import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import { BlogPost, Project, Category } from "@/database";

// Renders per-request instead of being statically generated at build time.
// The Vercel build machine's egress IP isn't whitelisted in MongoDB Atlas,
// so a build-time DB connection here fails and takes the whole build down
// with it. The underlying queries are still cached via unstable_cache below.
export const dynamic = "force-dynamic";

/**
 * Single source of truth for the production origin. Every URL emitted below
 * is built from this so the sitemap can never drift from the live domain.
 *
 * PLACEHOLDER — swap for the real domain once one is registered/deployed.
 */
export const BASE_URL = "https://hkdesigns.com";

const MAX_URLS_PER_SITEMAP = 50_000;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type StaticRoute = {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

type DynamicEntry = {
  slug: string;
  updatedAt: Date;
};

type DynamicProjectEntry = {
  projectSlug: string;
  categorySlug: string;
  updatedAt: Date;
};

// ---------------------------------------------------------------------------
// Static marketing pages — hand-maintained, no data fetch required.
// ---------------------------------------------------------------------------

const STATIC_ROUTES: StaticRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/work", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
];

// ---------------------------------------------------------------------------
// Dynamic, data-driven pages with caching.
// ---------------------------------------------------------------------------

const getDynamicCategories = unstable_cache(
  async (): Promise<DynamicEntry[]> => {
    await dbConnect();
    const categories = await Category.find({ isActive: true })
      .select("slug updatedAt")
      .sort({ order: 1 })
      .lean<{ slug: string; updatedAt: Date }[]>();

    return categories.map((cat) => ({
      slug: cat.slug,
      updatedAt: cat.updatedAt,
    }));
  },
  ["sitemap-categories"],
  { revalidate: 3600, tags: ["sitemap-categories", "categories"] }
);

const getDynamicBlogs = unstable_cache(
  async (): Promise<DynamicEntry[]> => {
    await dbConnect();
    const posts = await BlogPost.find({ published: true })
      .select("slug updatedAt")
      .sort({ publishedAt: -1 })
      .lean<{ slug: string; updatedAt: Date }[]>();

    return posts.map((post) => ({ slug: post.slug, updatedAt: post.updatedAt }));
  },
  ["sitemap-blogs"],
  { revalidate: 3600, tags: ["sitemap-blogs", "blog-posts"] }
);

const getDynamicProjects = unstable_cache(
  async (): Promise<DynamicProjectEntry[]> => {
    await dbConnect();
    const [projects, categories] = await Promise.all([
      Project.find({ status: "published" })
        .select("slug categoryId updatedAt")
        .sort({ order: 1 })
        .lean<{ slug: string; categoryId: unknown; updatedAt: Date }[]>(),
      Category.find({ isActive: true })
        .select("_id slug")
        .lean<{ _id: unknown; slug: string }[]>(),
    ]);

    const categoryMap = new Map<string, string>();
    categories.forEach((cat) => {
      categoryMap.set(String(cat._id), cat.slug);
    });

    const entries: DynamicProjectEntry[] = [];
    for (const project of projects) {
      const categorySlug = categoryMap.get(String(project.categoryId));
      if (categorySlug) {
        entries.push({
          projectSlug: project.slug,
          categorySlug,
          updatedAt: project.updatedAt,
        });
      }
    }

    return entries;
  },
  ["sitemap-projects"],
  { revalidate: 3600, tags: ["sitemap-projects", "projects"] }
);

// ---------------------------------------------------------------------------
// Sitemap entry point
// ---------------------------------------------------------------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [categories, blogs, projects] = await Promise.all([
    getDynamicCategories(),
    getDynamicBlogs(),
    getDynamicProjects(),
  ]);

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/work/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.categorySlug}/${project.projectSlug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const entries = [...staticEntries, ...categoryEntries, ...blogEntries, ...projectEntries];

  if (entries.length > MAX_URLS_PER_SITEMAP) {
    console.warn(
      `[sitemap] ${entries.length} URLs exceeds the ${MAX_URLS_PER_SITEMAP} single-sitemap limit.`
    );
  }

  return entries;
}
