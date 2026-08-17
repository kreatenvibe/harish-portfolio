import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { dbConnect } from "@/lib/mongoose";
import { BlogPost, Project } from "@/database";

/**
 * Single source of truth for the production origin. Every URL emitted below
 * is built from this so the sitemap can never drift from the live domain.
 */
export const BASE_URL = "https://kreatenvibe.com";

// Google (and most crawlers) reject a single sitemap file beyond this count.
// See the `generateSitemaps()` note at the bottom of this file for the fix.
const MAX_URLS_PER_SITEMAP = 50_000;

// Derived from Next's own type (rather than hand-rolled) so this stays in
// sync automatically if the sitemap protocol's allowed values ever change.
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

// ---------------------------------------------------------------------------
// Static marketing pages — hand-maintained, no data fetch required.
// ---------------------------------------------------------------------------

const STATIC_ROUTES: StaticRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/work", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
];

// ---------------------------------------------------------------------------
// Dynamic, data-driven pages.
//
// Wrapped in `unstable_cache` so a burst of crawler/browser hits to
// /sitemap.xml collapses into one Mongo query per revalidate window instead
// of hitting the database on every request. Each cache entry is tagged so
// admin mutations (see lib/actions/blog.action.ts / project.action.ts) can
// call `revalidateTag(...)` to refresh it immediately on publish/edit/delete,
// rather than waiting out the hourly fallback.
// ---------------------------------------------------------------------------

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
  { revalidate: 3600, tags: ["sitemap-blogs"] }
);

const getDynamicProjects = unstable_cache(
  async (): Promise<DynamicEntry[]> => {
    await dbConnect();
    const projects = await Project.find({})
      .select("slug updatedAt")
      .sort({ order: 1 })
      .lean<{ slug: string; updatedAt: Date }[]>();

    return projects.map((project) => ({ slug: project.slug, updatedAt: project.updatedAt }));
  },
  ["sitemap-projects"],
  { revalidate: 3600, tags: ["sitemap-projects"] }
);

/**
 * Placeholder for a future commerce catalog. There is no Product model yet —
 * wire this to a real collection/CMS query (mirroring getDynamicBlogs above)
 * the moment one exists, and add a matching entry map in `sitemap()` below.
 */
async function getDynamicProducts(): Promise<DynamicEntry[]> {
  return [];
}

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

  const [blogs, projects, products] = await Promise.all([
    getDynamicBlogs(),
    getDynamicProjects(),
    getDynamicProducts(),
  ]);

  const blogEntries: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const entries = [...staticEntries, ...blogEntries, ...projectEntries, ...productEntries];

  if (entries.length > MAX_URLS_PER_SITEMAP) {
    // Past this point Google will only crawl the first 50,000 URLs and ignore
    // the rest — split into multiple sitemaps before this ever fires in prod.
    console.warn(
      `[sitemap] ${entries.length} URLs exceeds the ${MAX_URLS_PER_SITEMAP} single-sitemap limit. ` +
        "Migrate to generateSitemaps() — see comment at the bottom of app/sitemap.ts."
    );
  }

  return entries;
}

// ---------------------------------------------------------------------------
// SCALING PAST 50,000 URLS
//
// Google's protocol caps a single sitemap file at 50,000 URLs. If
// getDynamicBlogs()/getDynamicProjects()/getDynamicProducts() ever grow past
// that combined total, replace the single `sitemap()` export above with
// `generateSitemaps()` + a chunked `sitemap(props)`, e.g.:
//
//   export async function generateSitemaps() {
//     const totalBlogs = await BlogPost.countDocuments({ published: true });
//     const chunks = Math.ceil(totalBlogs / MAX_URLS_PER_SITEMAP);
//     return Array.from({ length: chunks }, (_, id) => ({ id }));
//   }
//
//   export default async function sitemap({
//     id,
//   }: {
//     id: Promise<string>;
//   }): Promise<MetadataRoute.Sitemap> {
//     const chunkId = Number(await id);
//     const start = chunkId * MAX_URLS_PER_SITEMAP;
//
//     await dbConnect();
//     const posts = await BlogPost.find({ published: true })
//       .select("slug updatedAt")
//       .sort({ publishedAt: -1 })
//       .skip(start)
//       .limit(MAX_URLS_PER_SITEMAP)
//       .lean<{ slug: string; updatedAt: Date }[]>();
//
//     return posts.map((post) => ({
//       url: `${BASE_URL}/blog/${post.slug}`,
//       lastModified: post.updatedAt,
//     }));
//   }
//
// This is generated at /sitemap/[id].xml and requires splitting static,
// blog, project, and product entries into their own chunked sitemaps (or
// nesting a dedicated sitemap.ts per route segment, e.g. app/blog/sitemap.ts)
// once any single collection alone approaches the limit.
// ---------------------------------------------------------------------------
