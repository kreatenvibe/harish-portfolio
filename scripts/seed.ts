/**
 * Seed script — populates MongoDB with real-work-based portfolio structure
 * and synchronizes real assets directly from ImageKit (/PORTFOLIO/ hierarchy).
 *
 * IMAGEKIT FOLDER MAPPING:
 *   - Branding:
 *       Logo Design & Brand Marks   -> /PORTFOLIO/BRANDING/LOGOS
 *       Brand Guidelines            -> /PORTFOLIO/BRANDING/BRAND GUIDELIENS
 *       Branding Mockups            -> /PORTFOLIO/BRANDING/MOCKUPS
 *   - AI Posters:                   -> (Empty category, 0 projects / 0 media)
 *   - Social Media:
 *       Job Listing                 -> /PORTFOLIO/SOCIAL MEDIA/JOB_LISTING
 *       Real Estate                 -> /PORTFOLIO/SOCIAL MEDIA/REAL ESTATE
 *       YouTube Thumbnails          -> /PORTFOLIO/SOCIAL MEDIA/YOUTUBE THUMBNAILS
 *       Movie Posters               -> /PORTFOLIO/SOCIAL MEDIA/MOVIE POSTERS
 *       Wedding                     -> /PORTFOLIO/SOCIAL MEDIA/WEDDING
 *       Chocolate Festival          -> /PORTFOLIO/SOCIAL MEDIA/CHOCOLATE FESTIVAL
 *       Animotsav                   -> /PORTFOLIO/SOCIAL MEDIA/ANIMOTSAV
 *       Social Media — Misc         -> Loose images directly under /PORTFOLIO/SOCIAL MEDIA/
 *   - Print Materials:
 *       Pamphlets                   -> /PORTFOLIO/PRINT MATERIALS/pamphlets
 *       Business Cards              -> /PORTFOLIO/PRINT MATERIALS/busines cards
 *       Banners                     -> /PORTFOLIO/PRINT MATERIALS/banners
 *       Menus                       -> /PORTFOLIO/PRINT MATERIALS/menu
 *       Letterheads                 -> /PORTFOLIO/PRINT MATERIALS/letterheads
 *
 * USAGE:
 *   npx tsx scripts/seed.ts
 */

import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

import type { Types } from "mongoose";
import type { IKRawFile } from "../types/imagekit";

interface ProjectDefinition {
    categorySlug: string;
    title: string;
    slug: string;
    description: string;
    tags: string[];
    isFeatured: boolean;
    imageKitFolder?: string;
    isLooseSocialMedia?: boolean;
    sections: {
        title: string;
        description: string;
    }[];
}

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

    // Helper to fetch and sort image files from a specific ImageKit folder
    async function fetchImageKitFolderFiles(folderPath: string): Promise<{ files: IKRawFile[]; failed: boolean }> {
        try {
            const rawFiles = await ikFetch<IKRawFile[]>(
                `/files?path=${folderPath}&limit=100`
            );
            if (!Array.isArray(rawFiles)) {
                return { files: [], failed: false };
            }
            const imageFiles = rawFiles
                .filter((f) => f.fileType === "image" || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f.name))
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
            return { files: imageFiles, failed: false };
        } catch (err) {
            console.error(`[ImageKit Error] Failed to fetch folder "${folderPath}":`, err instanceof Error ? err.message : err);
            return { files: [], failed: true };
        }
    }

    // Helper to fetch loose images directly under /PORTFOLIO/SOCIAL MEDIA/
    async function fetchLooseSocialMediaFiles(): Promise<{ files: IKRawFile[]; failed: boolean }> {
        try {
            const rawFiles = await ikFetch<IKRawFile[]>(
                `/files?path=/PORTFOLIO/SOCIAL MEDIA&limit=100`
            );
            if (!Array.isArray(rawFiles)) {
                return { files: [], failed: false };
            }
            const looseFiles = rawFiles
                .filter((f) => {
                    const isImage = f.fileType === "image" || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f.name);
                    const folder = f.filePath.substring(0, f.filePath.lastIndexOf("/")) || "/";
                    const isDirect = folder === "/PORTFOLIO/SOCIAL MEDIA" || folder === "/PORTFOLIO/SOCIAL MEDIA/";
                    return isImage && isDirect;
                })
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
            return { files: looseFiles, failed: false };
        } catch (err) {
            console.error(`[ImageKit Error] Failed to fetch loose files in "/PORTFOLIO/SOCIAL MEDIA":`, err instanceof Error ? err.message : err);
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

    // ---------------------------------------------------------------------
    // 1. CATEGORIES (4 total)
    // ---------------------------------------------------------------------
    const categoryDefs = [
        {
            name: "Branding",
            slug: "branding",
            description: "Logos, brand guidelines, visual identity systems, and realistic presentation mockups.",
            order: 0,
        },
        {
            name: "AI Posters",
            slug: "ai-posters",
            description: "AI-assisted poster concepts and visual explorations developed for creative experimentation and future poster projects.",
            order: 1,
        },
        {
            name: "Social Media",
            slug: "social-media",
            description: "Social media creatives, promotional campaign graphics, YouTube thumbnails, and event visuals.",
            order: 2,
        },
        {
            name: "Print Materials",
            slug: "print-materials",
            description: "Promotional pamphlet designs, business cards, banners, menus, and corporate stationery.",
            order: 3,
        },
    ];

    // Initialize categories in MongoDB
    const createdCategories = await Promise.all(
        categoryDefs.map(async (c) => {
            return await Category.create({
                name: c.name,
                slug: c.slug,
                description: c.description,
                order: c.order,
                isActive: true,
            });
        })
    );

    const catMap = new Map<string, Types.ObjectId>();
    createdCategories.forEach((cat) => {
        if (cat._id) catMap.set(cat.slug, cat._id);
    });

    console.log(`Inserted ${createdCategories.length} categories`);

    // ---------------------------------------------------------------------
    // 2. PROJECT DEFINITIONS WITH IMAGEKIT FOLDER MAPPINGS
    // ---------------------------------------------------------------------
    const projectDefs: ProjectDefinition[] = [
        // =================================================================
        // BRANDING (3 Projects)
        // =================================================================
        {
            categorySlug: "branding",
            title: "Logo Design & Brand Marks",
            slug: "logo-design-brand-marks",
            description: "Selected logo explorations and identity marks created for different branding requirements, focusing on clear visual language, memorable forms, and practical application.",
            tags: ["Logo Design", "Brand Marks", "Visual Identity"],
            isFeatured: true,
            imageKitFolder: "/PORTFOLIO/BRANDING/LOGOS",
            sections: [
                {
                    title: "Logo Designs",
                    description: "Selected logo concepts and identity marks developed across different branding requirements.",
                },
                {
                    title: "Identity Applications",
                    description: "Examples of how logo and identity elements can translate across practical brand applications.",
                },
            ],
        },
        {
            categorySlug: "branding",
            title: "Brand Guidelines",
            slug: "brand-guidelines",
            description: "Brand identity documentation developed to establish a consistent visual language across communication materials and brand touchpoints.",
            tags: ["Brand Guidelines", "Visual Systems", "Typography"],
            isFeatured: false,
            imageKitFolder: "/PORTFOLIO/BRANDING/BRAND GUIDELIENS",
            sections: [
                {
                    title: "Brand Guidelines",
                    description: "Guidelines covering logo usage, typography, color, and visual direction.",
                },
                {
                    title: "Identity System",
                    description: "Supporting visual elements that help maintain consistency across brand applications.",
                },
            ],
        },
        {
            categorySlug: "branding",
            title: "Branding Mockups",
            slug: "branding-mockups",
            description: "Presentation mockups used to visualize branding concepts in realistic environments and demonstrate how identity systems work across different applications.",
            tags: ["Mockups", "Brand Presentation", "Visual Design"],
            isFeatured: true,
            imageKitFolder: "/PORTFOLIO/BRANDING/MOCKUPS",
            sections: [
                {
                    title: "Brand Applications",
                    description: "Identity elements presented across selected physical and digital applications.",
                },
                {
                    title: "Presentation Mockups",
                    description: "Visual presentations created to communicate branding concepts in realistic contexts.",
                },
            ],
        },

        // =================================================================
        // SOCIAL MEDIA (8 Projects)
        // =================================================================
        {
            categorySlug: "social-media",
            title: "Job Listing",
            slug: "job-listing",
            description: "Recruitment-focused social media creatives designed to communicate job opportunities clearly through engaging visual layouts.",
            tags: ["Social Media", "Recruitment", "Layout Design"],
            isFeatured: false,
            imageKitFolder: "/PORTFOLIO/SOCIAL MEDIA/JOB_LISTING",
            sections: [
                {
                    title: "Job Listing Creatives",
                    description: "Social media designs created for recruitment and job opportunity communication.",
                },
                {
                    title: "Social Media Formats",
                    description: "Selected variations adapted for digital and social media presentation.",
                },
            ],
        },
        {
            categorySlug: "social-media",
            title: "Real Estate",
            slug: "real-estate",
            description: "Real estate promotional creatives combining property-focused information with clear and engaging visual communication.",
            tags: ["Real Estate", "Promotional Design", "Social Media"],
            isFeatured: true,
            imageKitFolder: "/PORTFOLIO/SOCIAL MEDIA/REAL ESTATE",
            sections: [
                {
                    title: "Property Promotions",
                    description: "Promotional graphics created for real estate communication.",
                },
                {
                    title: "Campaign Creatives",
                    description: "Selected campaign-oriented visuals for property and real estate promotion.",
                },
            ],
        },
        {
            categorySlug: "social-media",
            title: "YouTube Thumbnails",
            slug: "youtube-thumbnails",
            description: "Thumbnail designs created to communicate video topics quickly through strong imagery, typography, and visual hierarchy.",
            tags: ["YouTube Thumbnails", "Digital Media", "Visual Hierarchy"],
            isFeatured: true,
            imageKitFolder: "/PORTFOLIO/SOCIAL MEDIA/YOUTUBE THUMBNAILS",
            sections: [
                {
                    title: "Thumbnail Designs",
                    description: "Selected YouTube thumbnail compositions focused on clarity and visual impact.",
                },
                {
                    title: "Visual Variations",
                    description: "Alternative compositions exploring different imagery, typography, and hierarchy.",
                },
            ],
        },
        {
            categorySlug: "social-media",
            title: "Movie Posters",
            slug: "movie-posters",
            description: "Poster compositions exploring cinematic imagery, typography, hierarchy, and promotional visual storytelling.",
            tags: ["Poster Design", "Cinematic Visuals", "Typography"],
            isFeatured: true,
            imageKitFolder: "/PORTFOLIO/SOCIAL MEDIA/MOVIE POSTERS",
            sections: [
                {
                    title: "Poster Designs",
                    description: "Selected cinematic poster compositions.",
                },
                {
                    title: "Typography & Composition",
                    description: "Poster layouts focused on typography, imagery, hierarchy, and visual storytelling.",
                },
            ],
        },
        {
            categorySlug: "social-media",
            title: "Wedding",
            slug: "wedding",
            description: "Wedding-themed social media creatives designed to communicate event information through expressive layouts and visual storytelling.",
            tags: ["Event Design", "Social Media", "Visual Storytelling"],
            isFeatured: false,
            imageKitFolder: "/PORTFOLIO/SOCIAL MEDIA/WEDDING",
            sections: [
                {
                    title: "Wedding Creatives",
                    description: "Selected wedding-related social media designs.",
                },
                {
                    title: "Event Visuals",
                    description: "Visual compositions created for wedding and event communication.",
                },
            ],
        },
        {
            categorySlug: "social-media",
            title: "Chocolate Festival",
            slug: "chocolate-festival",
            description: "Promotional creatives developed around a chocolate festival, combining event communication with product-focused visual presentation.",
            tags: ["Event Promotion", "Creative Layout", "Social Media"],
            isFeatured: false,
            imageKitFolder: "/PORTFOLIO/SOCIAL MEDIA/CHOCOLATE FESTIVAL",
            sections: [
                {
                    title: "Festival Creatives",
                    description: "Selected promotional designs created for festival communication.",
                },
                {
                    title: "Promotional Visuals",
                    description: "Visual compositions focused on event promotion and audience communication.",
                },
            ],
        },
        {
            categorySlug: "social-media",
            title: "Animotsav",
            slug: "animotsav",
            description: "Event-oriented visual communication created for Animotsav, exploring promotional layouts, typography, and digital presentation.",
            tags: ["Event Visuals", "Typography", "Digital Media"],
            isFeatured: false,
            imageKitFolder: "/PORTFOLIO/SOCIAL MEDIA/ANIMOTSAV",
            sections: [
                {
                    title: "Event Creatives",
                    description: "Selected promotional visuals created for the event.",
                },
                {
                    title: "Promotional Visuals",
                    description: "Digital compositions focused on event communication and presentation.",
                },
            ],
        },
        {
            categorySlug: "social-media",
            title: "Social Media — Miscellaneous",
            slug: "social-media-miscellaneous",
            description: "A selection of additional social media designs covering different promotional and communication requirements.",
            tags: ["Social Media", "Digital Creatives", "Campaign Design"],
            isFeatured: false,
            isLooseSocialMedia: true,
            sections: [
                {
                    title: "Social Creatives",
                    description: "Selected social media designs from different creative requirements.",
                },
                {
                    title: "Campaign Visuals",
                    description: "Additional promotional and campaign-oriented visual work.",
                },
            ],
        },

        // =================================================================
        // PRINT MATERIALS (5 Projects)
        // =================================================================
        {
            categorySlug: "print-materials",
            title: "Pamphlets",
            slug: "pamphlets",
            description: "Promotional pamphlet designs focused on clear information hierarchy, engaging layouts, and practical print communication.",
            tags: ["Print Design", "Pamphlets", "Marketing Collateral"],
            isFeatured: true,
            imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/pamphlets",
            sections: [
                {
                    title: "Selected Designs",
                    description: "Selected pamphlet layouts and promotional print compositions.",
                },
            ],
        },
        {
            categorySlug: "print-materials",
            title: "Business Cards",
            slug: "business-cards",
            description: "Business card designs balancing essential information with a clean and recognizable visual identity.",
            tags: ["Stationery", "Business Cards", "Brand Identity"],
            isFeatured: false,
            imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/busines cards",
            sections: [
                {
                    title: "Selected Designs",
                    description: "Selected business card designs and identity applications.",
                },
            ],
        },
        {
            categorySlug: "print-materials",
            title: "Banners",
            slug: "banners",
            description: "Large-format banner designs created for promotional, event, and business communication purposes.",
            tags: ["Large Format", "Banners", "Promotional Print"],
            isFeatured: false,
            imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/banners",
            sections: [
                {
                    title: "Selected Designs",
                    description: "Selected banner compositions for promotional and business communication.",
                },
            ],
        },
        {
            categorySlug: "print-materials",
            title: "Menus",
            slug: "menus",
            description: "Menu layouts designed to organize food and service information into clear, readable, and visually appealing print compositions.",
            tags: ["Editorial Layout", "Menu Design", "Print Materials"],
            isFeatured: false,
            imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/menu",
            sections: [
                {
                    title: "Selected Designs",
                    description: "Selected menu layouts and print compositions.",
                },
            ],
        },
        {
            categorySlug: "print-materials",
            title: "Letterheads",
            slug: "letterheads",
            description: "Professional letterhead designs created to extend brand identity into formal business communication.",
            tags: ["Stationery", "Letterheads", "Corporate Identity"],
            isFeatured: false,
            imageKitFolder: "/PORTFOLIO/PRINT MATERIALS/letterheads",
            sections: [
                {
                    title: "Selected Designs",
                    description: "Selected letterhead layouts and business stationery designs.",
                },
            ],
        },
    ];

    let totalSectionCount = 0;
    let totalRealMediaCount = 0;
    const projectImageCounts: { category: string; title: string; count: number }[] = [];
    const emptyFolders: string[] = [];
    const failedFolders: string[] = [];
    const categoryFirstCoverMap = new Map<string, { url: string; fileId: string }>();

    for (const [index, def] of projectDefs.entries()) {
        const categoryId = catMap.get(def.categorySlug);
        if (!categoryId) {
            console.error(`Category not found for slug: ${def.categorySlug}`);
            continue;
        }

        // 1. Fetch real ImageKit assets for this project
        let imageFiles: IKRawFile[] = [];
        const folderLabel = def.isLooseSocialMedia
            ? "/PORTFOLIO/SOCIAL MEDIA/ (loose)"
            : def.imageKitFolder || "N/A";

        if (def.isLooseSocialMedia) {
            const res = await fetchLooseSocialMediaFiles();
            imageFiles = res.files;
            if (res.failed) failedFolders.push(folderLabel);
            else if (imageFiles.length === 0) emptyFolders.push(folderLabel);
        } else if (def.imageKitFolder) {
            const res = await fetchImageKitFolderFiles(def.imageKitFolder);
            imageFiles = res.files;
            if (res.failed) failedFolders.push(folderLabel);
            else if (imageFiles.length === 0) emptyFolders.push(folderLabel);
        }

        projectImageCounts.push({
            category: def.categorySlug,
            title: def.title,
            count: imageFiles.length,
        });

        // Determine cover image from first sorted real asset
        const firstAsset = imageFiles[0];
        const coverImage = firstAsset
            ? { url: firstAsset.url, fileId: firstAsset.fileId }
            : undefined;

        // Save first project image as potential category cover image
        if (coverImage && !categoryFirstCoverMap.has(def.categorySlug)) {
            categoryFirstCoverMap.set(def.categorySlug, coverImage);
        }

        // 2. Create Project in MongoDB
        const project = await Project.create({
            categoryId,
            title: def.title,
            slug: def.slug,
            description: def.description,
            coverImage,
            tags: def.tags,
            order: index,
            status: "published",
            isFeatured: def.isFeatured,
            seo: {
                title: `${def.title} — Harish Kumar G`,
                description: def.description,
                ogImage: coverImage,
            },
        });

        // 3. Create Project Sections & Assign Real Media
        for (const [sIndex, sectionDef] of def.sections.entries()) {
            const section = await ProjectSection.create({
                projectId: project._id,
                title: sectionDef.title,
                description: sectionDef.description,
                order: sIndex,
            });
            totalSectionCount += 1;

            // Assign all images to the primary (first) section
            if (sIndex === 0 && imageFiles.length > 0) {
                for (let m = 0; m < imageFiles.length; m++) {
                    const item = imageFiles[m];
                    await Media.create({
                        projectId: project._id,
                        sectionId: section._id,
                        type: "image",
                        url: item.url,
                        fileId: item.fileId,
                        title: item.name,
                        altText: `${def.title} design by Harish Kumar`,
                        caption: "",
                        mimeType: "image/jpeg",
                        width: item.width || 1600,
                        height: item.height || 1000,
                        size: item.size,
                        order: m,
                    });
                    totalRealMediaCount += 1;
                }
            }
        }
    }

    // ---------------------------------------------------------------------
    // 3. UPDATE CATEGORY COVER IMAGES WITH REAL ASSETS
    // ---------------------------------------------------------------------
    for (const [catSlug, cover] of categoryFirstCoverMap.entries()) {
        await Category.updateOne(
            { slug: catSlug },
            { $set: { coverImage: cover } }
        );
    }

    // ---------------------------------------------------------------------
    // 4. BLOG POSTS (Development seed data preserved)
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
            coverImage: categoryFirstCoverMap.get("branding") || undefined,
            publishedAt: b.published ? new Date() : undefined,
        }))
    );

    console.log(`Inserted ${blogPosts.length} blog posts`);

    // ---------------------------------------------------------------------
    // 5. LEADS (Development seed data preserved)
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
    // 6. FINAL SEED REPORT
    // ---------------------------------------------------------------------
    console.log("\n==================================================");
    console.log("IMAGEKIT PORTFOLIO SYNC REPORT");
    console.log("==================================================");

    const categoriesList = ["branding", "ai-posters", "social-media", "print-materials"];
    const categoryLabels: Record<string, string> = {
        branding: "Branding",
        "ai-posters": "AI Posters",
        "social-media": "Social Media",
        "print-materials": "Print Materials",
    };

    for (const catKey of categoriesList) {
        console.log(`\n${categoryLabels[catKey]}`);
        const items = projectImageCounts.filter((p) => p.category === catKey);
        if (items.length === 0) {
            console.log("  - No projects / no images");
        } else {
            items.forEach((p) => {
                console.log(`  - ${p.title}: ${p.count} images`);
            });
        }
    }

    console.log("\n--------------------------------------------------");
    console.log(`TOTAL REAL IMAGEKIT IMAGES: ${totalRealMediaCount}`);
    console.log(`TOTAL SECTIONS: ${totalSectionCount}`);
    console.log(`PROJECT COVERS CONFIGURED: ${projectImageCounts.filter((p) => p.count > 0).length}`);
    console.log(`CATEGORY COVERS CONFIGURED: ${categoryFirstCoverMap.size}`);

    if (emptyFolders.length > 0) {
        console.log("\nEMPTY FOLDERS:");
        emptyFolders.forEach((f) => console.log(`  - ${f}`));
    } else {
        console.log("\nEMPTY FOLDERS: None");
    }

    if (failedFolders.length > 0) {
        console.log("\nFAILED FOLDERS:");
        failedFolders.forEach((f) => console.log(`  - ${f}`));
    } else {
        console.log("\nFAILED FOLDERS: None");
    }

    console.log("==================================================\n");

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});