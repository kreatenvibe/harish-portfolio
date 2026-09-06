/**
 * Seed script — populates MongoDB with realistic dummy content, no images.
 *
 * Every image field is set to a clearly-fake placeholder object so the UI
 * still renders (next/image needs a non-empty src) but nothing points to a
 * real file:
 *   { url: "https://via.placeholder.com/1600x1000", fileId: "placeholder-<n>" }
 *
 * Swap those out once you upload real assets to ImageKit — the fileId
 * pattern makes them easy to find-and-replace later.
 *
 * USAGE
 *   1. npm install -D tsx   (if you don't already have a ts-node/tsx runner)
 *   2. Adjust the model import paths below to match your project
 *      (this assumes database/models/*.model.ts as in your architecture doc)
 *   3. npx tsx scripts/seed.ts
 *
 * This script is destructive: it wipes the six collections before inserting.
 * Do not point it at a production database.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import mongoose from "mongoose";
import { dbConnect } from "../lib/mongoose";
import Category from "../database/models/Category.model";
import Project from "../database/models/Project.model";
import ProjectSection from "../database/models/ProjectSection.model";
import Media from "../database/models/Media.model";
import BlogPost from "../database/models/BlogPost.model";
import Lead from "../database/models/Lead.model";

const placeholderImage = (n: number) => ({
    url: `https://via.placeholder.com/1600x1000?text=Placeholder+${n}`,
    fileId: `placeholder-${n}`,
});

let placeholderCounter = 0;
function nextPlaceholder() {
    placeholderCounter += 1;
    return placeholderImage(placeholderCounter);
}

async function main() {
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
    // 1. CATEGORIES
    // ---------------------------------------------------------------------
    const categoryDefs = [
        { name: "Branding", slug: "branding", description: "Logos, visual identity systems, brand guidelines, stationery and collateral.", order: 0 },
        { name: "Packaging", slug: "packaging", description: "Product packaging, labels, boxes, pouches and packaging mockups.", order: 1 },
        { name: "Social Media", slug: "social-media", description: "Instagram posts, carousels, stories, campaign creatives and ad sets.", order: 2 },
        { name: "Print Design", slug: "print-design", description: "Brochures, flyers, posters, business cards, catalogues and menus.", order: 3 },
    ];

    const categories = await Category.insertMany(
        categoryDefs.map((c) => ({
            ...c,
            coverImage: nextPlaceholder(),
            isActive: true,
        }))
    );

    const catId = (slug: string) =>
        categories.find((c) => c.slug === slug)!._id;

    console.log(`Inserted ${categories.length} categories`);

    // ---------------------------------------------------------------------
    // 2. PROJECTS (2 per category, 8 total)
    // ---------------------------------------------------------------------
    const projectDefs = [
        // Branding
        {
            categorySlug: "branding",
            title: "Kavali Coffee Roasters — Brand Identity",
            slug: "kavali-coffee-roasters-brand-identity",
            description: "Full identity system for a specialty coffee roaster: wordmark, mark, color system, packaging typography rules and stationery.",
            client: "Kavali Coffee Roasters",
            year: 2024,
            tags: ["Branding", "Logo Design", "Identity System"],
            isFeatured: true,
            sections: [
                { title: "Logos & Visual Identity", description: "Primary wordmark, submark, and clearspace/minimum-size rules." },
                { title: "Brand Guidelines", description: "20-page guideline document covering typography, color, and usage do's and don'ts." },
                { title: "Stationery", description: "Letterhead, business cards, envelope and compliment slip." },
            ],
        },
        {
            categorySlug: "branding",
            title: "Nandi Organics — Rebrand",
            slug: "nandi-organics-rebrand",
            description: "Rebrand of a regional organic foods brand moving from a dated crest logo to a warm, modern identity.",
            client: "Nandi Organics",
            year: 2023,
            tags: ["Rebrand", "Identity", "Agriculture"],
            isFeatured: false,
            sections: [
                { title: "Logos & Visual Identity", description: "Before/after logo evolution and mark construction grid." },
                { title: "Brand Collateral", description: "Tote bags, farmer's-market signage, and price tags." },
            ],
        },
        // Packaging
        {
            categorySlug: "packaging",
            title: "Sundara Spa — Product Line Packaging",
            slug: "sundara-spa-product-line-packaging",
            description: "Packaging system for a six-SKU skincare range, designed to work as a shelf set and individually.",
            client: "Sundara Spa",
            year: 2024,
            tags: ["Packaging", "Skincare", "Label Design"],
            isFeatured: true,
            sections: [
                { title: "Product Packaging", description: "Carton structure and front/back panel layouts for all six SKUs." },
                { title: "Labels", description: "Wraparound bottle labels with batch-code and ingredient panel." },
                { title: "Packaging Mockups", description: "Studio-lit mockups showing the full shelf set together." },
            ],
        },
        {
            categorySlug: "packaging",
            title: "Nellore Nuts Co. — Pouch Redesign",
            slug: "nellore-nuts-co-pouch-redesign",
            description: "Stand-up pouch redesign for a dry-fruits brand, built around a modular window-cutout system.",
            client: "Nellore Nuts Co.",
            year: 2023,
            tags: ["Packaging", "Food", "Pouch Design"],
            isFeatured: false,
            sections: [
                { title: "Boxes & Pouches", description: "Stand-up pouch dielines for three pack sizes." },
                { title: "Packaging Mockups", description: "Flat-lay and hand-held mockups for the pitch deck." },
            ],
        },
        // Social Media
        {
            categorySlug: "social-media",
            title: "Aarambh Fitness — Launch Campaign",
            slug: "aarambh-fitness-launch-campaign",
            description: "30-day social launch campaign for a new gym: feed system, story templates and paid ad creatives.",
            client: "Aarambh Fitness",
            year: 2025,
            tags: ["Social Media", "Campaign", "Fitness"],
            isFeatured: true,
            sections: [
                { title: "Instagram Posts", description: "Grid-consistent feed post set for the launch week." },
                { title: "Carousels", description: "5-slide educational carousel on gym membership tiers." },
                { title: "Stories", description: "Countdown and poll-sticker story templates." },
                { title: "Ads", description: "Static and carousel ad creatives for the Meta launch campaign." },
            ],
        },
        {
            categorySlug: "social-media",
            title: "Teja Bookstore — Monthly Content System",
            slug: "teja-bookstore-monthly-content-system",
            description: "Recurring monthly content system for an independent bookstore's Instagram.",
            client: "Teja Bookstore",
            year: 2024,
            tags: ["Social Media", "Content System", "Retail"],
            isFeatured: false,
            sections: [
                { title: "Instagram Posts", description: "New-arrivals and staff-pick post templates." },
                { title: "Campaign Creatives", description: "Creatives for the store's anniversary sale." },
            ],
        },
        // Print Design
        {
            categorySlug: "print-design",
            title: "Sri Lakshmi Caterers — Menu & Collateral",
            slug: "sri-lakshmi-caterers-menu-collateral",
            description: "Full print suite for a catering business: menu cards, price lists, and business cards.",
            client: "Sri Lakshmi Caterers",
            year: 2023,
            tags: ["Print Design", "Menu Design", "Hospitality"],
            isFeatured: false,
            sections: [
                { title: "Menus", description: "Tri-fold event menu with vegetarian and non-vegetarian sections." },
                { title: "Business Cards", description: "Double-sided card with QR link to the online catalogue." },
            ],
        },
        {
            categorySlug: "print-design",
            title: "Ravindra Motors — Showroom Launch Print Kit",
            slug: "ravindra-motors-showroom-launch-print-kit",
            description: "Print collateral for a new showroom opening: posters, flyers, and a product catalogue.",
            client: "Ravindra Motors",
            year: 2025,
            tags: ["Print Design", "Automotive", "Catalogue"],
            isFeatured: true,
            sections: [
                { title: "Posters", description: "A2 launch-day poster set for in-store and street display." },
                { title: "Flyers", description: "DL-size flyer with finance-offer callout." },
                { title: "Catalogues", description: "16-page product catalogue covering the full vehicle lineup." },
            ],
        },
    ];

    let sectionCount = 0;
    let mediaCount = 0;

    for (const [index, def] of projectDefs.entries()) {
        const project = await Project.create({
            categoryId: catId(def.categorySlug),
            title: def.title,
            slug: def.slug,
            description: def.description,
            coverImage: nextPlaceholder(),
            year: def.year,
            client: def.client,
            tags: def.tags,
            order: index,
            status: "published",
            isFeatured: def.isFeatured,
            seo: {
                title: `${def.title} — Harish Kumar G`,
                description: def.description,
                ogImage: nextPlaceholder(),
            },
        });

        for (const [sIndex, sectionDef] of def.sections.entries()) {
            const section = await ProjectSection.create({
                projectId: project._id,
                title: sectionDef.title,
                description: sectionDef.description,
                order: sIndex,
            });
            sectionCount += 1;

            // 2–3 media items per section
            const mediaItemCount = 2 + (sIndex % 2);
            for (let m = 0; m < mediaItemCount; m++) {
                await Media.create({
                    projectId: project._id,
                    sectionId: section._id,
                    type: "image",
                    ...nextPlaceholder(),
                    title: `${sectionDef.title} — asset ${m + 1}`,
                    altText: `${def.title}, ${sectionDef.title}, image ${m + 1}`,
                    caption: "",
                    mimeType: "image/jpeg",
                    width: 1600,
                    height: 1000,
                    order: m,
                });
                mediaCount += 1;
            }
        }
    }

    console.log(`Inserted ${projectDefs.length} projects, ${sectionCount} sections, ${mediaCount} media items`);

    // ---------------------------------------------------------------------
    // 3. CATEGORY COVER IMAGES already set above via placeholder
    // ---------------------------------------------------------------------

    // ---------------------------------------------------------------------
    // 4. BLOG POSTS
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
            coverImage: nextPlaceholder(),
            publishedAt: b.published ? new Date() : undefined,
        }))
    );

    console.log(`Inserted ${blogPosts.length} blog posts`);

    // ---------------------------------------------------------------------
    // 5. LEADS
    // ---------------------------------------------------------------------
    const leadDefs = [
        {
            name: "Priya Reddy",
            email: "priya@nandiorganics.in",
            business: "Nandi Organics",
            businessDescription: "Regional organic foods brand, 3 retail locations.",
            improvement: "Our packaging looks dated next to newer competitors.",
            currentTools: "Canva, a freelance designer we used once in 2021",
            whatToBuild: "Full packaging refresh across 6 SKUs, plus updated shelf-talkers.",
            anythingElse: "Would like to move fast — trade show in 10 weeks.",
            read: true,
        },
        {
            name: "Vikram Sastry",
            email: "vikram@ravindramotors.com",
            business: "Ravindra Motors",
            businessDescription: "Multi-brand automotive showroom.",
            improvement: "Need print collateral for a new showroom launch.",
            currentTools: "In-house print shop, no dedicated designer",
            whatToBuild: "Poster set, flyers, and a product catalogue.",
            anythingElse: "",
            read: true,
        },
        {
            name: "Ananya Rao",
            email: "ananya@tejabookstore.in",
            business: "Teja Bookstore",
            businessDescription: "Independent bookstore, active on Instagram.",
            improvement: "Our feed looks inconsistent, we post whenever.",
            currentTools: "Phone camera, no editing app",
            whatToBuild: "A repeatable monthly content system.",
            anythingElse: "Budget is limited, looking for something simple to maintain ourselves after.",
            read: false,
        },
    ];

    const leads = await Lead.insertMany(leadDefs);
    console.log(`Inserted ${leads.length} leads`);

    console.log("\nSeed complete.");
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});