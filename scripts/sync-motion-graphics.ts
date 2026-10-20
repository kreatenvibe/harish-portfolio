/**
 * Sync script — adds/updates a "Motion Graphics" category built from the
 * videos in an ImageKit folder, WITHOUT touching any other data.
 *
 * Unlike scripts/seed.ts (which wipes every collection), this is additive and
 * idempotent: re-running it upserts by slug / fileId and never duplicates or
 * overwrites captions/titles edited in admin.
 *
 * USAGE:
 *   npx tsx scripts/sync-motion-graphics.ts                 # auto-find folder named "motion graphics"
 *   npx tsx scripts/sync-motion-graphics.ts "/PORTFOLIO/MOTION GRAPHICS"
 */

import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

import type { IKRawFile, IKRawFolder } from "../types/imagekit";

const FOLDER_NAME = "motion graphics";
const SLUG = "motion-graphics";
const NAME = "Motion Graphics";
const DESCRIPTION =
    "Broadcast motion assets, campaign video edits, title sequences, and kinetic typography.";
const TAGS = ["Motion Graphics", "Video", "Kinetic Typography"];
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i;
const PAGE = 100;

async function main() {
    const { getVideoThumbnailUrl: videoThumb } = await import("../lib/imagekit");
    const { dbConnect } = await import("../lib/mongoose");
    const { ikFetch } = await import("../lib/imagekit.server");
    const Category = (await import("../database/models/Category.model")).default;
    const Project = (await import("../database/models/Project.model")).default;
    const ProjectSection = (await import("../database/models/ProjectSection.model")).default;
    const Media = (await import("../database/models/Media.model")).default;
    const mongoose = (await import("mongoose")).default;

    // Paginate an ImageKit /files listing. encodeURI keeps "/" intact — the API
    // gateway does not decode %2F (see app/api/assets/route.ts).
    async function listAll<T>(query: string): Promise<T[]> {
        const all: T[] = [];
        for (let skip = 0; ; skip += PAGE) {
            const page = await ikFetch<T[]>(`/files?${query}&limit=${PAGE}&skip=${skip}`);
            if (!Array.isArray(page) || page.length === 0) break;
            all.push(...page);
            if (page.length < PAGE) break;
        }
        return all;
    }

    // 1. Resolve the ImageKit folder
    let folderPath = process.argv[2];
    if (!folderPath) {
        const folders = await listAll<IKRawFolder>("type=folder");
        const matches = folders.filter((f) => f.name.trim().toLowerCase() === FOLDER_NAME);
        if (matches.length !== 1) {
            console.error(
                matches.length === 0
                    ? `No ImageKit folder named "${FOLDER_NAME}" found. Pass the path explicitly.`
                    : `Several folders named "${FOLDER_NAME}" found — pass one explicitly:\n` +
                          matches.map((m) => `  ${m.folderPath}`).join("\n")
            );
            process.exit(1);
        }
        folderPath = matches[0].folderPath;
    }
    console.log(`Using ImageKit folder: ${folderPath}`);

    // 2. List videos in the folder
    const files = await listAll<IKRawFile>(`path=${encodeURI(folderPath)}&type=file`);
    const videos = files
        .filter((f) => f.mime?.startsWith("video/") || VIDEO_EXT.test(f.name))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));

    if (videos.length === 0) {
        console.error(`No videos found in ${folderPath}. Nothing to sync.`);
        process.exit(1);
    }
    console.log(`Found ${videos.length} videos`);

    await dbConnect();

    const cover = { url: videoThumb(videos[0].url), fileId: videos[0].fileId };

    // 3. Upsert Category -> Project -> Section
    // New categories go to the end of the discipline list
    const lastCategory = await Category.findOne({}).sort({ order: -1 });
    const category = await Category.findOneAndUpdate(
        { slug: SLUG },
        {
            $set: { name: NAME, isActive: true },
            $setOnInsert: {
                description: DESCRIPTION,
                coverImage: cover,
                order: (lastCategory?.order ?? -1) + 1,
            },
        },
        { upsert: true, returnDocument: "after" }
    );

    const lastProject = await Project.findOne({}).sort({ order: -1 });
    const project = await Project.findOneAndUpdate(
        { slug: SLUG },
        {
            $set: { categoryId: category._id, status: "published" },
            $setOnInsert: {
                title: NAME,
                description: DESCRIPTION,
                coverImage: cover,
                tags: TAGS,
                order: (lastProject?.order ?? -1) + 1,
                isFeatured: true,
                seo: { title: `${NAME} — Harish Kumar G`, description: DESCRIPTION, ogImage: cover },
            },
        },
        { upsert: true, returnDocument: "after" }
    );

    // Keep auto-generated video-poster covers current (e.g. if the first video
    // changes), but never override a cover the admin picked themselves.
    const autoCover = { "coverImage.url": /\/ik-thumbnail\.jpg/ };
    await Category.updateOne({ _id: category._id, ...autoCover }, { $set: { coverImage: cover } });
    await Project.updateOne(
        { _id: project._id, ...autoCover },
        { $set: { coverImage: cover, "seo.ogImage": cover } }
    );

    const section = await ProjectSection.findOneAndUpdate(
        { projectId: project._id, title: `${NAME} Gallery` },
        { $setOnInsert: { description: `Showcase gallery for ${NAME}.`, order: 0 } },
        { upsert: true, returnDocument: "after" }
    );

    // 4. Upsert one Media doc per video
    let inserted = 0;
    let updated = 0;
    for (const [order, video] of videos.entries()) {
        const res = await Media.updateOne(
            { sectionId: section._id, fileId: video.fileId, deletedAt: null },
            {
                $set: {
                    projectId: project._id,
                    type: "video",
                    url: video.url,
                    thumbnail: videoThumb(video.url),
                    mimeType: video.mime ?? "video/mp4",
                    size: video.size,
                    ...(video.width && { width: video.width }),
                    ...(video.height && { height: video.height }),
                },
                $setOnInsert: {
                    title: video.name,
                    altText: `${NAME} work by Harish Kumar`,
                    caption: "",
                    order,
                },
            },
            { upsert: true }
        );
        if (res.upsertedCount) inserted += 1;
        else updated += 1;
    }

    console.log("\n==================================================");
    console.log(`MOTION GRAPHICS SYNC — ${folderPath}`);
    console.log(`  category: /work/${SLUG}`);
    console.log(`  videos inserted: ${inserted}`);
    console.log(`  videos updated:  ${updated}`);
    console.log("==================================================\n");

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error("Sync failed:", err);
    process.exit(1);
});
