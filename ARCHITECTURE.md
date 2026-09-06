# Architecture — HK Designs Portfolio (`hk-designs`)

## 1. Stack

| | |
|---|---|
| Framework | **Next.js 16.2.12** |
| Router | **App Router** (`app/`) |
| Language | **TypeScript** (strict, `^5`) |
| Package manager | **npm** (`package-lock.json` present) |
| Deploy target | Vercel-shaped (Mongo Atlas connection code explicitly branches on "the Vercel build machine's egress IP", see [app/sitemap.ts](app/sitemap.ts#L6-L9)); a Cloudflare adapter (`@opennextjs/cloudflare`) is also installed as a dev dependency but nothing in the repo wires it up (no `wrangler.toml`, no OpenNext config file) |
| Interception layer | `proxy.ts` at the repo root — **not** `middleware.ts`. This Next.js version renamed the middleware entry point to "proxy" (see [AGENTS.md](AGENTS.md): "this is NOT the Next.js you know") |

Every dependency touching UI, styling, animation, images, or content rendering:

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.12 | Framework |
| `react` / `react-dom` | 19.2.4 | UI runtime |
| `next-auth` | 5.0.0-beta.32 | Google OAuth for `/admin` |
| `tailwindcss` / `@tailwindcss/postcss` | ^4 | Styling (CSS-first `@theme` config, no `tailwind.config.ts`) |
| `@phosphor-icons/react` | ^2.1.10 | Icon set (used via `/dist/ssr` entrypoint in server components) |
| `lucide-react` | ^1.31.0 | Icon set (installed; not observed in use anywhere in `app/` or `components/`) |
| `@floating-ui/dom` | ^1.8.0 | Positioning primitives (used by the Tiptap bubble menu) |
| `@imagekit/next` | ^2.1.5 | Client-side upload SDK + server upload-auth helper for ImageKit |
| `react-markdown` | ^10.1.0 | Renders blog post body (stored as Markdown) on the public blog page |
| `@tiptap/*` (`core`, `react`, `starter-kit`, `extension-highlight/image/link/underline`, `pm`) | ^3.30.1 | Rich-text editor used in the admin Blog form |
| `tiptap-markdown` | ^0.9.0 | Serializes Tiptap's document to/from Markdown |
| `slugify` | ^1.6.9 | Slug generation for projects/categories/blog posts |
| `zod` | ^4.4.3 | Input validation for every Server Action |
| `mongoose` / `mongodb` | ^9.9.2 / ^7.6.0 | Data layer (MongoDB) |
| `pino` / `pino-pretty` | ^10.3.1 / ^13.1.3 | Structured logging |

No dedicated animation library (Framer Motion, GSAP, etc.) is installed — animation is done with hand-written CSS `@keyframes` in [app/globals.css](app/globals.css) and Tailwind `transition-*` utility classes.

---

## 2. Route Map

### Public site — `app/(public)/`, wrapped by [app/(public)/layout.tsx](app/(public)/layout.tsx) (Navbar + Footer, forces `.theme-dark`)

| Path | File | Component type | Rendering mode | Renders |
|---|---|---|---|---|
| `/` | `app/(public)/page.tsx` | Server | Static (no data fetch, no `dynamic` export) | Hero, about teaser, services grid, benefits, process steps, "why work with me", selected-work teaser, FAQ accordion, final CTA — all hardcoded content |
| `/services` | `app/(public)/services/page.tsx` | Server | Static | Hardcoded services list with placeholder visual blocks |
| `/work` | `app/(public)/work/page.tsx` | Server | **`force-dynamic`** | Grid of published `Project`s via `getProjects({pageSize:100}, true)` |
| `/work/[slug]` | `app/(public)/work/[slug]/page.tsx` | Server | **`force-dynamic`** | One published `Project` + its `ProjectSection`s + each section's `Media`; `generateMetadata` builds per-project OG/Twitter tags |
| `/blog` | `app/(public)/blog/page.tsx` | Server | **`force-dynamic`** | Grid of published `BlogPost`s via `getBlogPosts({pageSize:100}, true)` |
| `/blog/[slug]` | `app/(public)/blog/[slug]/page.tsx` | Server | Static-ish (no `dynamic` export, but reads live per-request) | One published `BlogPost`, body rendered via `react-markdown` |
| `/about` | `app/(public)/about/page.tsx` | Server | Static | Hardcoded bio, experience timeline, approach section |
| `/contact` | `app/(public)/contact/page.tsx` | Server (embeds a client `ContactForm`) | Static | Contact info + lead-capture form |

### Admin — `app/(admin)/admin/`

| Path | File | Component type | Rendering mode | Renders |
|---|---|---|---|---|
| `/admin/login` | `app/(admin)/admin/login/page.tsx` | Server | Dynamic (session-dependent) | Google sign-in button, invokes `signIn("google", …)` server action |
| `/admin` (dashboard root) | `app/(admin)/admin/(dashboard)/page.tsx` | Server | Dynamic | Post/project/lead counts |
| `/admin/blog` | `.../(dashboard)/blog/page.tsx` | Server | Dynamic | Paginated/filterable blog post table |
| `/admin/blog/new` | `.../(dashboard)/blog/new/page.tsx` | Server (renders client `BlogPostForm`) | Dynamic | Create form |
| `/admin/blog/[id]/edit` | `.../(dashboard)/blog/[id]/edit/page.tsx` | Server | Dynamic | Edit form, 404 via `notFound()` if missing |
| `/admin/work` | `.../(dashboard)/work/page.tsx` | Server | Dynamic | Paginated/filterable project table |
| `/admin/work/new` | `.../(dashboard)/work/new/page.tsx` | Server | Dynamic | Create form (blocked until ≥1 category exists) |
| `/admin/work/[id]/edit` | `.../(dashboard)/work/[id]/edit/page.tsx` | Server | Dynamic | Edit form + `ProjectSectionsManager` for section/media CRUD |
| `/admin/categories` | `.../(dashboard)/categories/page.tsx` | Server | Dynamic | Category table |
| `/admin/categories/new` | `.../(dashboard)/categories/new/page.tsx` | Server | Dynamic | Create form |
| `/admin/categories/[id]/edit` | `.../(dashboard)/categories/[id]/edit/page.tsx` | Server | Dynamic | Edit form |
| `/admin/leads` | `.../(dashboard)/leads/page.tsx` | Server | Dynamic | Lead inbox with read/unread toggle and delete |

### Metadata / infra routes

| Path | File | Mode |
|---|---|---|
| `/sitemap.xml` | `app/sitemap.ts` | `force-dynamic`, backed by `unstable_cache` (1h revalidate, tag-invalidated on publish/edit/delete) |
| `/robots.txt` | `app/robots.ts` | Static function, disallows `/admin/` and `/api/` |

### Route groups, layouts, dynamic segments

- Route groups: `(public)` and `(admin)`, plus a nested `(dashboard)` group inside `(admin)/admin` — groups don't affect the URL, only layout nesting.
- Layouts: [app/layout.tsx](app/layout.tsx) (root — fonts, `<html>/<body>`, global metadata), [app/(public)/layout.tsx](app/(public)/layout.tsx) (Navbar/Footer/dark theme), [app/(admin)/admin/(dashboard)/layout.tsx](app/(admin)/admin/(dashboard)/layout.tsx) (auth gate + `AdminSidebar`). `/admin/login` sits outside the `(dashboard)` group, so it renders without the sidebar/auth-redirect.
- Dynamic segments: `[slug]` for work and blog, `[id]` for admin edit routes.
- `loading.tsx`, `error.tsx`, `template.tsx`, `not-found.tsx`: **none exist anywhere in `app/`.** Not-found behavior relies solely on `notFound()` calls inside page components, which fall back to Next's default 404 UI.

---

## 3. Data Layer

Content lives in **MongoDB** (via Mongoose), not JSON/MDX/CMS files. Connection: [lib/mongoose.ts](lib/mongoose.ts), a cached-singleton `dbConnect()` with dev-only DNS-resolver workarounds for `mongodb+srv://`.

### Entities

**Category** — [database/models/Category.model.ts](database/models/Category.model.ts)
```ts
export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  coverImage?: { url: string; fileId: string };
  order: number;
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
```
Example: `{ name: "Brand Identity", slug: "brand-identity", order: 0, isActive: true }`

**Project** — [database/models/Project.model.ts](database/models/Project.model.ts)
```ts
export type ProjectStatus = "draft" | "published" | "archived";

export interface IProject {
  _id?: Types.ObjectId;
  categoryId: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  coverImage?: { url: string; fileId: string };
  year?: number;
  client?: string;
  tags: string[];
  order: number;
  status: ProjectStatus;
  isFeatured: boolean;
  seo?: { title?: string; description?: string; ogImage?: { url: string; fileId: string } };
  customMetadata?: Record<string, unknown>;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
```
Example: `{ title: "Fiber Optic Wire Removal", slug: "fiber-optic-wire-removal", categoryId: <Category>, status: "published", isFeatured: true, tags: ["VFX", "Roto"], year: 2025 }`

**ProjectSection** (per-project, admin-authored content blocks) — [database/models/ProjectSection.model.ts](database/models/ProjectSection.model.ts)
```ts
export interface IProjectSection {
  _id?: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  customMetadata?: Record<string, unknown>;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
```
Example: `{ projectId: <Project>, title: "Logos & Visual Identity", order: 0 }`

**Media** (belongs to a `ProjectSection`) — [database/models/Media.model.ts](database/models/Media.model.ts)
```ts
export type MediaType = "image" | "video" | "pdf" | "other";

export interface IMedia {
  _id?: Types.ObjectId;
  projectId: Types.ObjectId;
  sectionId: Types.ObjectId;
  type: MediaType;
  url: string;
  fileId: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  altText?: string;
  caption?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  order: number;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
```
Example: `{ projectId: <Project>, sectionId: <ProjectSection>, type: "image", url: "https://ik.imagekit.io/.../before.jpg", fileId: "abc123", order: 0 }`

**BlogPost** — [database/models/BlogPost.model.ts](database/models/BlogPost.model.ts)
```ts
export interface IBlogPost {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;          // Markdown
  coverImage?: { url: string; fileId: string };
  tags?: string[];
  published: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
```
Example: `{ title: "Cleaning Up Wire Rigs in Silhouette", slug: "cleaning-up-wire-rigs-in-silhouette", excerpt: "A quick look at...", content: "## Intro\n...", published: true }`

**Lead** (contact-form submission) — [database/models/Lead.model.ts](database/models/Lead.model.ts)
```ts
export interface ILead {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  business?: string;
  businessDescription?: string;
  improvement?: string;
  currentTools?: string;
  whatToBuild?: string;
  anythingElse?: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```
Example: `{ name: "Jane Studio", email: "jane@studio.com", business: "Acme Films", read: false }`

`Category`, `Project`, `ProjectSection`, and `Media` share a **soft-delete plugin** ([database/plugins/softDelete.plugin.ts](database/plugins/softDelete.plugin.ts)) that adds `deletedAt` and auto-filters it out of `find`/`findOne`/`findOneAndUpdate`/`countDocuments` unless a caller explicitly queries `deletedAt`. Deleting a `Project` cascades a soft delete to its `ProjectSection`s and `Media`; deleting a `ProjectSection` cascades to its `Media`. `BlogPost` and `Lead` use hard deletes.

### Data fetching

All reads/writes go through **Next.js Server Actions** (`"use server"` files) in [lib/actions/](lib/actions/) — one file per entity: `project.action.ts`, `blog.action.ts`, `category.action.ts`, `section.action.ts`, `media.action.ts`, `lead.action.ts`. Every action:
1. Runs its input through a Zod schema and (if `authorize: true`) requires a NextAuth session, via the shared [lib/handlers/action.ts](lib/handlers/action.ts) wrapper.
2. Calls `dbConnect()` then a Mongoose query, using `.lean()` for reads.
3. Returns a uniform `ActionResponse<T>` (`{ success, data?, error? }`), normalized through [lib/handlers/error.ts](lib/handlers/error.ts).

Public pages call these actions directly as async functions inside Server Components (e.g. `app/(public)/work/page.tsx` calls `getProjects({ pageSize: 100 }, true)`). There is no REST/GraphQL layer for content reads — the only real API routes are for ImageKit asset management and NextAuth (see §5).

Mutations that affect the sitemap (`createProject`, `updateProject`, `setProjectStatus`, `deleteProject`, `restoreProject`, `reorderProjects`, and the equivalent blog actions) call `revalidateTag("sitemap-projects" | "sitemap-blogs")` so `app/sitemap.ts`'s `unstable_cache`-wrapped queries refresh immediately rather than waiting out the 1-hour fallback.

---

## 4. Image Pipeline

- **Storage**: All real content images/videos (project covers, section media, blog covers) live on **ImageKit** (`https://ik.imagekit.io/...` via `IMAGEKIT_URL_ENDPOINT`), uploaded through the admin `AssetSelector`/`MediaManager` components using `@imagekit/next`'s client `upload()` call, authorized by a server-signed token from [app/api/upload-auth/route.ts](app/api/upload-auth/route.ts). `/public` holds only static/design-system assets (logo, hero placeholders, default Next.js SVGs) and is **not** where portfolio content images live.
- **`next.config.ts`** is effectively empty — verbatim:
  ```ts
  import type { NextConfig } from "next";
  const nextConfig: NextConfig = {
    /* config options here */
  };
  export default nextConfig;
  ```
  No `images.remotePatterns`, no `formats`, no `deviceSizes` configured.
- **`next/image` vs `<img>`**: `next/image` is used throughout (`ProjectCard`, `BlogCard`, `ProjectDetail`, `ProjectMediaCarousel`, admin `ProjectForm`/`AssetSelector`/`MediaManager`), but **every single usage passes `unoptimized`** — this is what allows ImageKit URLs to work without a `remotePatterns` entry, at the cost of skipping Next's built-in resize/optimize/CDN pipeline entirely (ImageKit does its own transforms server-side instead). The one raw `<img>` exception is in [app/(public)/blog/[slug]/page.tsx](app/(public)/blog/[slug]/page.tsx#L55-L62), inside the `react-markdown` custom `img` renderer for inline Markdown images (explicitly flagged with `// eslint-disable-next-line @next/next/no-img-element`).
- **width/height/placeholder**: Most `next/image` calls use `fill` (`ProjectCard`, `BlogCard`, `ProjectMediaCarousel`, blog cover) inside an explicitly-sized/aspect-ratio parent `div`; `ProjectDetail`'s cover/section images pass fixed `width`/`height` (1600×1000, 1200×800) as intrinsic-ratio hints only, since `unoptimized` means Next doesn't actually generate resized variants. No `blurDataURL` or `placeholder="blur"` is set anywhere — there's no blur-hash/LQIP generation step in the codebase.
- **Volume/size**: `/public` contains 4 raster images total — 3 unused-looking hero placeholders (`hero/automation-card.png`, `billing-card.png`, `crm-card.png`, ~700–880 KB each) and one small logo (`logo/kreatenvibe-logo.png`, 25 KB) — none of which are referenced anywhere in `app/` or `components/` (they read as leftovers from a different starter template, not this portfolio's own assets). All actual portfolio imagery is remote on ImageKit and its count/dimensions aren't knowable from the repo — they're admin-uploaded at runtime.

---

## 5. API Surface

| Route | Method | Auth | Input | Output | Side effects |
|---|---|---|---|---|---|
| `app/api/auth/[...nextauth]/route.ts` | GET, POST | — | NextAuth internal | NextAuth internal | Google OAuth flow; `signIn` callback rejects any email not in `ADMIN_EMAILS` |
| `app/api/upload-auth/route.ts` | GET | Session required | none | `{ token, expire, signature, publicKey }` | Issues a short-lived ImageKit upload token |
| `app/api/assets/route.ts` | GET | Session required | `?folder=&limit=&skip=` | `IKFile[]` | Lists ImageKit files via `ikFetch` |
| `app/api/assets/route.ts` | DELETE | Session required | `{ fileId }` | `{ success }` | Deletes a file from ImageKit |
| `app/api/assets/move/route.ts` | POST | Session required | `{ sourceFilePath, destinationPath }` | `{ success }` | Moves a file in ImageKit |
| `app/api/folders/route.ts` | GET | Session required | `?path=` | `IKFolder[]` | Lists ImageKit folders |
| `app/api/folders/route.ts` | POST | Session required | `{ folderName, parentFolderPath }` | `{ success }` | Creates an ImageKit folder |

**`proxy.ts`** (the `middleware.ts` equivalent in this Next.js version) re-exports NextAuth's `auth` as `proxy`, matched against `/admin/:path*`; the actual authorization decision is NextAuth's `authorized()` callback in [auth.ts](auth.ts), which allows `/admin/login` unconditionally and requires a session everywhere else under `/admin`.

**Server Actions** (not HTTP routes, but the app's real "API" for content — see §3): `lib/actions/{project,blog,category,section,media,lead}.action.ts`. All mutation actions require `authorize: true` (a NextAuth session) except `submitLead` (public, with a honeypot field for spam).

**External services and where their env vars live:**

| Service | Purpose | Env vars | Read in |
|---|---|---|---|
| MongoDB Atlas | Primary datastore | `MONGODB_URI`, `MONGODB_DB` | [lib/mongoose.ts](lib/mongoose.ts) |
| Google OAuth (via NextAuth) | Admin login | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, `ADMIN_EMAILS` | [auth.ts](auth.ts) |
| ImageKit | Image/video/PDF storage + CDN delivery | `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` | [lib/imagekit.server.ts](lib/imagekit.server.ts), [app/api/upload-auth/route.ts](app/api/upload-auth/route.ts) |

No analytics, email-sending, or SMS service is wired up. `lib/contact.ts` only holds static display constants (email, phone, WhatsApp link) — lead submissions are stored in Mongo and read from `/admin/leads`, there is no outbound email/notification on submit.

---

## 6. UI Foundation

### Styling

**Tailwind CSS v4**, configured entirely in CSS via `@theme inline` in [app/globals.css](app/globals.css) — there is no `tailwind.config.ts`. Theme tokens:

```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --primary: #0a0a0a;
  --accent: #e53935;
  --muted: #6b6b6b;
  --surface: #f7f6f3;
  --surface-2: #ffffff;
  --surface-hover: #eeeeec;
}

/* Applied to the public site only, via .theme-dark on the (public) layout wrapper */
.theme-dark {
  --background: #0a0a0b;
  --foreground: #f2f1ed;
  --muted: #9c9992;
  --accent: #ff4438;
  --surface: #141416;
  --surface-2: #1c1c1f;
  --surface-hover: #1f1f22;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-surface-hover: var(--surface-hover);
  --font-sans: var(--font-manrope);
  --font-heading: var(--font-bebas);
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
```

The public site forces `.theme-dark` (dark UI) in [app/(public)/layout.tsx](app/(public)/layout.tsx); the admin dashboard deliberately stays on the light `:root` palette (comment: "the admin dashboard stays on the :root light theme... since it's a functional CRUD tool rather than the visual portfolio"). No explicit breakpoint tokens are defined — spacing/breakpoints use Tailwind's v4 defaults (`sm/md/lg/xl` etc.) directly in class names (`sm:`, `lg:`, `max-w-7xl`, etc.), nothing custom.

### Animation

No animation library is installed. All motion is:
- Hand-written CSS `@keyframes` in `globals.css`: `stack-rotating` / `stack-opacity` (the rotating 3-card "ShowcaseStack" on the homepage hero, credited as adapted from an Uiverse.io concept) and the `.build-tile` hover-fill radial expansion (also credited to Uiverse.io).
- Tailwind `transition-*`/`duration-*`/`hover:` utility classes scattered through components (image zoom-on-hover, icon rotation on hover, mobile-menu slide/fade).
- Both keyframe animations respect `prefers-reduced-motion: reduce` (explicitly disabled via media query).

### Shared/reusable components

| Component | Props | Notes |
|---|---|---|
| [components/ui/CtaButton.tsx](components/ui/CtaButton.tsx) | `href: string; children: ReactNode; variant?: "primary"\|"accent"\|"ghost"\|"ghost-dark"` | Pill CTA with trailing arrow-icon shell |
| [components/ui/Eyebrow.tsx](components/ui/Eyebrow.tsx) | `children: ReactNode; tone?: "light"\|"dark"` | Small uppercase pill label used above section headings |
| [components/cards/ProjectCard.tsx](components/cards/ProjectCard.tsx) | `project: IProject; index: number` | Work-grid card, links to `/work/[slug]` |
| [components/cards/BlogCard.tsx](components/cards/BlogCard.tsx) | `post: IBlogPost` | Blog-grid card, links to `/blog/[slug]` |
| [components/cards/ProjectMediaCarousel.tsx](components/cards/ProjectMediaCarousel.tsx) | `media: {url,fileId,type}[]; alt: string` | Client-side swipeable image/video carousel (used inside project cards/detail) |
| [components/layout/Navbar.tsx](components/layout/Navbar.tsx) | none | Client component; sticky header + mobile offcanvas menu |
| [components/layout/Footer.tsx](components/layout/Footer.tsx) | none | Site-wide footer, links from `lib/contact.ts` |
| [components/sections/ShowcaseStack.tsx](components/sections/ShowcaseStack.tsx) | none | Decorative animated 3-card stack (homepage hero only) |
| [components/sections/FaqAccordion.tsx](components/sections/FaqAccordion.tsx) | `faqs: {question,answer}[]` | Client accordion, single-open-at-a-time |
| [components/sections/ContactForm.tsx](components/sections/ContactForm.tsx) | none | Client form calling `submitLead` Server Action, includes honeypot field |
| [components/sections/ProjectDetail.tsx](components/sections/ProjectDetail.tsx) | `project: IProject; sections: (IProjectSection & {media: IMedia[]})[]` | Full project-detail layout (newspaper-style header, masonry media columns) |
| Admin-only: `ProjectForm`, `BlogPostForm`, `CategoryForm`, `ProjectSectionsManager`, `MediaManager`, `AssetSelector`, `AdminSidebar`, `AdminDeleteButton`, `TogglePublishedButton`, `LeadReadToggle`, `ReorderButtons`, `CategoryList`, `ProjectList`, `CategoryFilterSelect`, `FilterBar` | — | CRUD forms/tables/toggles for the dashboard; all client components |
| Editor: `TextEditor`, `Toolbar`, `BubbleMenu` (in `components/editor/`) | — | Tiptap-based rich text editor for `BlogPostForm` |

### Fonts

Loaded via `next/font/local` in [app/layout.tsx](app/layout.tsx) — no `next/font/google`, all self-hosted `.ttf` files under `app/fonts/`:
```ts
const bebas = localFont({ src: "./fonts/BebasNeue-Regular.ttf", variable: "--font-bebas" });
const manrope = localFont({ src: "./fonts/Manrope.ttf", variable: "--font-manrope" });
```
`--font-bebas` drives every heading (`h1`–`h6` are globally forced to `text-transform: uppercase` in `globals.css`, since Bebas Neue is a caps-only display face); `--font-manrope` is the body/sans font. A third font file, `BricolageGrotesque.ttf`, exists in `app/fonts/` but is **not loaded or referenced anywhere** — dead asset.

---

## 7. Constraints

Things worth knowing before adding heavy animation or otherwise touching this codebase:

- **All content images bypass Next's image optimizer** (`unoptimized` everywhere, §4) — Next serves whatever byte size ImageKit hands back, with no responsive `srcset` generation. Any animation that reveals/scales large media (e.g. a hero video, a fullscreen gallery transition) will be animating full-resolution assets, not optimized ones.
- **No `remotePatterns`/`images` config exists at all** — if `unoptimized` is ever removed from an `<Image>` call, that image will 500 in production until ImageKit's host is added to `next.config.ts`.
- **Every content page under `/work` and `/blog` (list pages) is `force-dynamic`** — no ISR, no static generation, every request hits MongoDB fresh. Heavy client-side animation layered onto these routes doesn't change server cost, but be aware there's no cached HTML to animate "into" — first paint always waits on a live DB round trip.
- **The homepage (`/`) and `/services`/`/about` are the only fully static, data-free routes** — safe ground for the heaviest animation work since there's no data-fetch latency or dynamic-content layout shift to fight.
- **No `loading.tsx` anywhere** — the `force-dynamic` work/blog list and detail pages have no Suspense/skeleton fallback; navigating to them shows nothing until the full server render completes. Introducing streaming or skeleton animation would require adding `loading.tsx` files that don't currently exist.
- **Mongoose soft-delete pre-hooks fire on every `find`/`findOne`/`countDocuments`** for four of six models — not a performance concern at current scale, but worth knowing before assuming a query filter is complete (deleted docs are silently excluded unless you opt in).
- **The public site hardcodes `.theme-dark` at the layout level**, while admin stays light — any shared/reusable component built for animation should be tested against both CSS-variable palettes, since colors like `--accent` and `--foreground` change value entirely between them (see the `.build-tile::before` comment in `globals.css` about a hardcoded gradient "disappearing" on the dark page — this exact class of bug is easy to reintroduce).
- **`prefers-reduced-motion: reduce` is already respected** for both existing CSS animations — any new animation work should follow the same pattern (`@media (prefers-reduced-motion: reduce)` disabling the animation, not just slowing it).
- **No hydration-risk patterns observed** (no `Date.now()`/`Math.random()` in server-rendered markup, no obvious client/server markup mismatches) — `Navbar`'s active-link state and `ContactForm`/`FaqAccordion`/carousels are cleanly isolated `"use client"` leaves rather than large client islands wrapping server content.
- **`app/sitemap.ts`'s `BASE_URL` is a hardcoded placeholder** (`https://hkdesigns.com`) with a comment flagging it needs to be swapped for the real deployed domain — unrelated to animation but a pre-existing loose end in the repo.
- **Unused/leftover assets**: `app/fonts/BricolageGrotesque.ttf` (never loaded) and the four raster images under `/public/hero` and `/public/logo` (§4) appear to be carried over from a different template and aren't part of this portfolio's actual content — don't assume they're load-bearing.
