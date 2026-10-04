/**
 * Seed script — populates MongoDB with flattened portfolio categories
 * directly matching ImageKit subfolders under /PORTFOLIO/.
 *
 * IMAGEKIT FOLDER -> CATEGORY MAPPING:
 *   1. Logos                -> /PORTFOLIO/LOGOS
 *   2. Brand Guidelines     -> /PORTFOLIO/BRAND GUIDELIENS
 *   3. Brand Mockups        -> /PORTFOLIO/MOCKUPS
 *   4. AI Posters           -> /PORTFOLIO/AI POSTERS
 *   5. Real Estate          -> /PORTFOLIO/REALESTATE
 *   6. Job Listings         -> /PORTFOLIO/JOB_LISTING
 *   7. YouTube Thumbnails   -> /PORTFOLIO/YOUTUBE THUMBNAILS
 *   8. Movie Posters        -> /PORTFOLIO/MOVIE POSTERS
 *   9. Chocolate Festival   -> /PORTFOLIO/CHOCOLATE FESTIVAL
 *  10. Animotsav            -> /PORTFOLIO/ANIMOTSAV
 *  11. Amazon Listings      -> /PORTFOLIO/Amazon_listings
 *  12. Business Cards       -> /PORTFOLIO/PRINT MATERIALS/busines cards
 *  13. Letterheads          -> /PORTFOLIO/PRINT MATERIALS/letterheads
 *  14. Pamphlets & Flyers   -> /PORTFOLIO/PRINT MATERIALS/pamplets
 *  15. Banners & Signage    -> /PORTFOLIO/PRINT MATERIALS/banners
 *  16. Restaurant Menus     -> /PORTFOLIO/PRINT MATERIALS/menu
 *
 * USAGE:
 *   node scripts/seed.mjs (or npx tsx scripts/seed.ts)
 */

import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

import type { Types } from "mongoose";
import type { IKRawFile } from "../types/imagekit";

interface CategoryDefinition {
    name: string;
    slug: string;
    description: string;
    order: number;
    imageKitFolder: string;
    tags: string[];
    isFeatured: boolean;
}

const CATEGORIES_CONFIG: CategoryDefinition[] = [
    {
        name: "Logos",
        slug: "logos",
        description: "Selected logo explorations and identity marks created for distinct brand identities.",
        order: 0,
        imageKitFolder: "/PORTFOLIO/LOGOS",
        tags: ["Logo Design", "Brand Marks", "Visual Identity"],
        isFeatured: true,
    },
    {
        name: "Brand Guidelines",
        slug: "brand-guidelines",
        description: "Comprehensive brand identity systems, typography rules, color palettes, and brand guidelines.",
        order: 1,
        imageKitFolder: "/PORTFOLIO/BRAND GUIDELIENS",
        tags: ["Brand Guidelines", "Visual Systems", "Typography"],
        isFeatured: true,
    },
    {
        name: "Brand Mockups",
        slug: "brand-mockups",
        description: "Realistic presentation mockups demonstrating visual identities across physical and digital touchpoints.",
        order: 2,
        imageKitFolder: "/PORTFOLIO/MOCKUPS",
        tags: ["Mockups", "Brand Presentation", "Visual Design"],
        isFeatured: true,
    },
    {
        name: "AI Posters",
        slug: "ai-posters",
        description: "AI-assisted concept posters, key visuals, lighting studies, and creative promotional compositions.",
        order: 3,
        imageKitFolder: "/PORTFOLIO/AI POSTERS",
        tags: ["AI Poster Design", "Concept Art", "Key Visuals", "Typography"],
        isFeatured: true,
    },
    {
        name: "Real Estate",
        slug: "real-estate",
        description: "Property promotions, architecture marketing visuals, and real estate social campaigns.",
        order: 4,
        imageKitFolder: "/PORTFOLIO/REALESTATE",
        tags: ["Real Estate", "Promotional Design", "Social Media"],
        isFeatured: true,
    },
    {
        name: "Job Listings",
        slug: "job-listings",
        description: "Recruitment creatives and hiring announcement graphics for modern brands.",
        order: 5,
        imageKitFolder: "/PORTFOLIO/JOB_LISTING",
        tags: ["Social Media", "Recruitment", "Layout Design"],
        isFeatured: false,
    },
    {
        name: "YouTube Thumbnails",
        slug: "youtube-thumbnails",
        description: "High-conversion YouTube thumbnail designs crafted for high engagement and visual clarity.",
        order: 6,
        imageKitFolder: "/PORTFOLIO/YOUTUBE THUMBNAILS",
        tags: ["YouTube Thumbnails", "Digital Media", "Visual Hierarchy"],
        isFeatured: true,
    },
    {
        name: "Movie Posters",
        slug: "movie-posters",
        description: "Cinematic poster designs, key art, entertainment graphics, and promotional compositions.",
        order: 7,
        imageKitFolder: "/PORTFOLIO/MOVIE POSTERS",
        tags: ["Poster Design", "Cinematic Visuals", "Key Art"],
        isFeatured: true,
    },
    {
        name: "Chocolate Festival",
        slug: "chocolate-festival",
        description: "Event branding, campaign graphics, and festive social media creatives.",
        order: 8,
        imageKitFolder: "/PORTFOLIO/CHOCOLATE FESTIVAL",
        tags: ["Event Design", "Social Media", "Campaign Graphics"],
        isFeatured: false,
    },
    {
        name: "Animotsav",
        slug: "animotsav",
        description: "Festival artwork, event promotions, and visual identity creatives for Animotsav.",
        order: 9,
        imageKitFolder: "/PORTFOLIO/ANIMOTSAV",
        tags: ["Event Design", "Festival Branding", "Visual Storytelling"],
        isFeatured: false,
    },
    {
        name: "Amazon Listings",
        slug: "amazon-listings",
        description: "E-commerce product infographics, listing hero images, and Amazon visual assets.",
        order: 10,
        imageKitFolder: "/PORTFOLIO/Amazon_listings",
        tags: ["E-Commerce", "Product Listing", "Infographics"],
        isFeatured: false,
    },
    {
        name: "Business Cards",
        slug: "business-cards",
        description: "Premium business card designs, corporate stationery, and tactile print collateral.",
        order: 11,
        imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/busines cards",
        tags: ["Print Materials", "Stationery", "Business Cards"],
        isFeatured: false,
    },
    {
        name: "Letterheads",
        slug: "letterheads",
        description: "Corporate letterhead layouts and stationery identity systems.",
        order: 12,
        imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/letterheads",
        tags: ["Print Materials", "Corporate Identity", "Letterheads"],
        isFeatured: false,
    },
    {
        name: "Pamphlets & Flyers",
        slug: "pamphlets",
        description: "Promotional flyers, trifold brochures, and print distribution materials.",
        order: 13,
        imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/pamplets",
        tags: ["Print Materials", "Flyers", "Brochures"],
        isFeatured: true,
    },
    {
        name: "Banners & Signage",
        slug: "banners",
        description: "Large format print banners, exhibition backdrops, and event signage.",
        order: 14,
        imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/banners",
        tags: ["Print Materials", "Signage", "Banners"],
        isFeatured: false,
    },
    {
        name: "Restaurant Menus",
        slug: "restaurant-menus",
        description: "Food & beverage menu designs, cafe price lists, and restaurant print layouts.",
        order: 15,
        imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/menu",
        tags: ["Print Materials", "Menu Design", "Hospitality"],
        isFeatured: false,
    },
];

async function main() {
    const { dbConnect } = await import("../lib/mongoose");
    const { ikFetch } = await import("../lib/imagekit.server");
    const Category = (await import("../database/models/Category.model")).default;
    const Project = (await import("../database/models/Project.model")).default;
    const ProjectSection = (await import("../database/models/ProjectSection.model")).default;
    const Media = (await import("../database/models/Media.model")).default;
    const BlogPost = (await import("../database/models/BlogPost.model")).default;
    const Lead = (await import("../database/models/Lead.model")).default;
    const mongoose = (await import("mongoose")).default;

    // Helper to fetch and sort image files from a specific ImageKit folder (with pagination)
    async function fetchImageKitFolderFiles(folderPath: string): Promise<{ files: IKRawFile[]; failed: boolean }> {
        try {
            let skip = 0;
            const limit = 100;
            const allFiles: IKRawFile[] = [];

            while (true) {
                const rawFiles = await ikFetch<IKRawFile[]>(
                    `/files?path=${encodeURIComponent(folderPath)}&limit=${limit}&skip=${skip}`
                );
                if (!Array.isArray(rawFiles) || rawFiles.length === 0) break;
                allFiles.push(...rawFiles);
                if (rawFiles.length < limit) break;
                skip += limit;
            }

            const imageFiles = allFiles
                .filter((f) => f.fileType === "image" || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f.name))
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
            return { files: imageFiles, failed: false };
        } catch (err) {
            console.error(`[ImageKit Error] Failed to fetch folder "${folderPath}":`, err instanceof Error ? err.message : err);
            return { files: [], failed: true };
        }
    }

    await dbConnect();
    console.log("Connected to MongoDB");

    console.log("Clearing existing collections...");
    await Promise.all([
        Category.deleteMany({}),
        Project.deleteMany({}),
        ProjectSection.deleteMany({}),
        Media.deleteMany({}),
        BlogPost.deleteMany({}),
        Lead.deleteMany({}),
    ]);

    let totalSectionCount = 0;
    let totalRealMediaCount = 0;
    const categoryReport: { name: string; slug: string; fileCount: number }[] = [];
    let firstGeneralCover: { url: string; fileId: string } | undefined;

    for (const [idx, catDef] of CATEGORIES_CONFIG.entries()) {
        console.log(`Processing [${idx + 1}/${CATEGORIES_CONFIG.length}] ${catDef.name} (${catDef.imageKitFolder})...`);
        const { files: imageFiles, failed } = await fetchImageKitFolderFiles(catDef.imageKitFolder);

        const firstAsset = imageFiles[0];
        const coverImage = firstAsset
            ? { url: firstAsset.url, fileId: firstAsset.fileId }
            : undefined;

        if (coverImage && !firstGeneralCover) {
            firstGeneralCover = coverImage;
        }

        // 1. Create Category
        const category = await Category.create({
            name: catDef.name,
            slug: catDef.slug,
            description: catDef.description,
            coverImage,
            order: catDef.order,
            isActive: true,
        });

        // 2. Create Project inside this Category
        const project = await Project.create({
            categoryId: category._id,
            title: catDef.name,
            slug: catDef.slug,
            description: catDef.description,
            coverImage,
            tags: catDef.tags,
            order: idx,
            status: "published",
            isFeatured: catDef.isFeatured,
            seo: {
                title: `${catDef.name} — Harish Kumar G`,
                description: catDef.description,
                ogImage: coverImage,
            },
        });

        // 3. Create Project Section & Assign Media
        const section = await ProjectSection.create({
            projectId: project._id,
            title: `${catDef.name} Gallery`,
            description: `Showcase gallery for ${catDef.name}.`,
            order: 0,
        });
        totalSectionCount += 1;

        for (let m = 0; m < imageFiles.length; m++) {
            const item = imageFiles[m];
            await Media.create({
                projectId: project._id,
                sectionId: section._id,
                type: "image",
                url: item.url,
                fileId: item.fileId,
                title: item.name,
                altText: `${catDef.name} work by Harish Kumar`,
                caption: "",
                mimeType: "image/jpeg",
                width: item.width || 1600,
                height: item.height || 1000,
                size: item.size,
                order: m,
            });
            totalRealMediaCount += 1;
        }

        categoryReport.push({
            name: catDef.name,
            slug: catDef.slug,
            fileCount: imageFiles.length,
        });
    }

    // ---------------------------------------------------------------------
    // BLOG POSTS (Development seed data preserved)
    // ---------------------------------------------------------------------
    const blogDefs = [
        {
            title: "Building a Brand Identity That Survives Contact With Reality",
            slug: "building-a-brand-identity-that-survives-contact-with-reality",
            excerpt: "Most identity systems fall apart the first time someone outside the design team has to use them. Here's how to design against that.",
            content:
                "## Why identities break\n\nA brand guideline that only the designer can follow isn't a system, it's a portfolio piece...\n\n## Designing for handoff\n\nEvery rule needs a fallback...\n\n## Takeaways\n\nBuild for the intern with Canva, not just the agency with Illustrator.",
            tags: ["Branding", "Process"],
            published: true,
        },
        {
            title: "Packaging Mockups Lie — Here's How to Catch It Before Print",
            slug: "packaging-mockups-lie-catch-it-before-print",
            excerpt: "A polished mockup can hide problems that only show up once a physical carton comes off the press.",
            content:
                "## The mockup gap\n\nStudio lighting flatters everything...\n\n## What to check manually\n\nDieline tolerances, bleed, and spot color drift...\n\n## A pre-press checklist\n\n...",
            tags: ["Packaging", "Print Production"],
            published: true,
        },
        {
            title: "A Simple System for Monthly Social Content Without Burning Out",
            slug: "a-simple-system-for-monthly-social-content-without-burning-out",
            excerpt: "Recurring content work doesn't need a new idea every week — it needs a good template.",
            content:
                "## The template trap\n\nTemplates get boring when nobody revisits them...\n\n## A rotation that works\n\nThree post types, one carousel, one story series...",
            tags: ["Social Media", "Workflow"],
            published: false,
        },
    ];

    const blogPosts = await BlogPost.insertMany(
        blogDefs.map((b) => ({
            ...b,
            coverImage: firstGeneralCover || undefined,
            publishedAt: b.published ? new Date() : undefined,
        }))
    );
    console.log(`Inserted ${blogPosts.length} blog posts`);

    // ---------------------------------------------------------------------
    // LEADS (Development seed data preserved)
    // ---------------------------------------------------------------------
    const leadDefs = [
        {
            name: "Priya Reddy",
            email: "priya@example.com",
            business: "Example Studio",
            businessDescription: "Regional brand requiring updated packaging and print collateral.",
            improvement: "Packaging refresh and promotional print collateral.",
            currentTools: "Canva, freelance designer",
            whatToBuild: "Full packaging refresh and promotional print kit.",
            anythingElse: "Looking to launch before upcoming trade exhibition.",
            read: true,
        },
        {
            name: "Vikram Sastry",
            email: "vikram@example.com",
            business: "Automotive Showroom",
            businessDescription: "Automotive showroom launching promotional campaign.",
            improvement: "Need print collateral for a new showroom launch.",
            currentTools: "In-house team",
            whatToBuild: "Poster set, flyers, and a product catalogue.",
            anythingElse: "",
            read: true,
        },
        {
            name: "Ananya Rao",
            email: "ananya@example.com",
            business: "Bookstore Retail",
            businessDescription: "Retail bookstore active across social platforms.",
            improvement: "Consistent social media templates and monthly content system.",
            currentTools: "Phone camera, editing apps",
            whatToBuild: "A repeatable monthly content system.",
            anythingElse: "Looking for clear design templates.",
            read: false,
        },
    ];

    const leads = await Lead.insertMany(leadDefs);
    console.log(`Inserted ${leads.length} leads`);

    // ---------------------------------------------------------------------
    // SUMMARY REPORT
    // ---------------------------------------------------------------------
    console.log("\n==================================================");
    console.log("IMAGEKIT PORTFOLIO FLATTENED SYNC REPORT");
    console.log("==================================================");
    for (const cat of categoryReport) {
        console.log(`  - [${cat.slug}] ${cat.name}: ${cat.fileCount} assets`);
    }
    console.log("--------------------------------------------------");
    console.log(`TOTAL CATEGORIES: ${CATEGORIES_CONFIG.length}`);
    console.log(`TOTAL REAL IMAGEKIT IMAGES SYNCED: ${totalRealMediaCount}`);
    console.log(`TOTAL SECTIONS: ${totalSectionCount}`);
    console.log("==================================================\n");

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});