# Backend Implementation Plan — kreatenvibe

Tracks the work to turn the static KreatenVibe frontend into a full-stack app: MongoDB + Mongoose backend, admin CMS for Blog/Work, and a working Contact form. Source of architectural patterns: `BACKEND_HANDOFF.md` (adapted, not copied — see Decisions Log).

Check items off as they're completed. Work through phases in order; each phase should build and typecheck before moving to the next.

---

## Decisions Log (from planning conversation)

- Deploy target: **Vercel** (Node.js runtime), not Cloudflare Workers. Domain stays registered at Cloudflare, DNS pointed at Vercel — that cutover is operational, done outside this codebase.
- Admin scope: **Full CMS** — Blog posts, Work/Projects, and a Leads inbox, all auth-gated under `/admin`.
- Auth: **Google OAuth via NextAuth v5**, restricted to an `ADMIN_EMAILS` allow-list (fixes the old project's "any Google account = admin" gap).
- Contact form: saves to MongoDB only, no email notifications (for now).
- ~~Cover images: plain URL text field for v1, not a real upload pipeline.~~ **Superseded 2026-08-16:** user is providing ImageKit credentials, so the ImageKit upload pipeline (`lib/imagekit.server.ts`, `app/api/{upload-auth,assets,folders}/route.ts`, `types/imagekit.d.ts`, `AssetSelector` component) is back in scope for v1, kept/adapted rather than deleted. `coverImage` on `BlogPost`/`Project` goes back to the old `{url, fileId}` shape so deletes can clean up the ImageKit file too.
- Blog content: stored as a **Markdown string**, edited with the **TipTap editor directly** (changed from the earlier "textarea now, TipTap later" plan — user provided working `TextEditor.tsx` + `Toolbar.tsx` + `BubbleMenu.tsx` from `dev-portfolio`, reskinned for this project's theme). In-editor image insert wires to `AssetSelector`/ImageKit (see cover-image decision below), falling back to a `window.prompt` URL entry only if `onImageInsert` isn't wired up.
- Services section stays static (not part of CMS scope).
- `dbName` is configurable via `MONGODB_DB` env var, never hardcoded (old project hardcoded `"devportfolio"`).
- Do not port `/api/test`-style unauthenticated debug endpoints.
- **2026-08-16:** User pasted the *entire* old `dev-portfolio` backend into this repo as raw material (same pattern as the editor files) — all 5 models, all actions, `auth.ts`, `proxy.ts`, the full ImageKit subsystem, and the old `types/*.d.ts`. Decision: **adapt in place** rather than delete-and-rewrite-from-scratch or expand scope to match the old project. Concretely this means pruning `Testimonial`/`YoutubeVideo`/`Settings` (not needed by this UI), keeping the ImageKit pipeline (see cover-image decision below), and reshaping `Project`/`BlogPost`/`auth.ts` to this project's actual fields and security requirements. See Phase 1 for the exact file-by-file disposition.
- **2026-08-16:** `components/` reorganized to mirror `dev-portfolio`'s folder taxonomy — `layout/`, `sections/`, `cards/`, `filters/`, `admin/`, `editor/` — so future admin/CRUD components land in the same place a future maintainer familiar with the old project would expect. Kept scope to *reorganizing existing files*, not decomposing `app/page.tsx` into per-section components the way `dev-portfolio`'s homepage is split (that page is currently one file with inline JSX sections; splitting it is a frontend refactor with no backend dependency, so it's optional/deferred — see Phase 9). One deliberate deviation from the old project's taxonomy: added `components/ui/` for small cross-section presentational atoms (`CtaButton`, `Eyebrow`) that `dev-portfolio` didn't need as separate files because its homepage was already fully split into section components.
- **2026-08-16:** Env values provided by user and written to `.env.local` (Mongo URI/db, Google OAuth client, ImageKit keys). Admin allow-list confirmed as `koush.solves@gmail.com`. `AUTH_SECRET` had a paste error (`BETTER_AUTH_SECRET=...` prefix from an unrelated project) — corrected to the bare secret value.
- **2026-08-16:** This project pins `mongoose@^9.9.2`, a version new enough that it renamed the `FilterQuery<T>` type (well-known from Mongoose v6–8 docs and most training data) to `QueryFilter<T>`. Confirmed by grepping `node_modules/mongoose/types/*.d.ts` directly rather than trusting memorized Mongoose APIs — consistent with `AGENTS.md`'s warning that this codebase tracks bleeding-edge package versions. Worth rechecking other Mongoose type names against `node_modules` if they don't resolve as expected.
- **2026-08-16:** Phase 1 executed in full — see per-file checkmarks below. Notably: `auth.ts` now also sets `pages.signIn` and a `callbacks.authorized` gate (not just the `signIn` allow-list) because NextAuth v5's bare `export { auth as proxy }` does **not** enforce anything on its own — protection is driven entirely by `callbacks.authorized`, which was missing from the pasted file. Without it, `/admin/*` would have been wide open despite the allow-list.
- **2026-08-16:** Phases 3, 5, and 6 executed in full (see checkmarks below), plus two structural fixes discovered along the way:
  - **Route groups introduced** (`app/(public)/`, `app/(admin)/admin/(dashboard)/`) — not explicitly planned, but required. Root `app/layout.tsx` unconditionally wrapped `{children}` in the public `Navbar`/`Footer`, which would have rendered the site chrome around every admin page too. Fix: root layout now only sets up fonts/`<html>`/`<body>`; `app/(public)/layout.tsx` owns `Navbar`/`Footer` for the public site; a nested `app/(admin)/admin/(dashboard)/layout.tsx` owns the sidebar shell for the authenticated admin pages only. `/admin/login` sits outside the `(dashboard)` group (sibling, not wrapped) so it doesn't get the sidebar or a session-check redirect loop.
  - **`@floating-ui/dom` added as a dependency** — `components/editor/BubbleMenu.tsx` (pasted from `dev-portfolio`, kept per Phase 1) imports `@tiptap/react`'s bubble/floating menu, which requires `@floating-ui/dom` as a peer dependency. It was listed as frontend-only in `BACKEND_HANDOFF.md` §8 but never installed here; the production build failed on it (`Module not found`) until installed.
  - **`TiptapProps.output` gained a `"markdown"` option** — the plan calls for blog content stored as a Markdown string (for `react-markdown` on the frontend), and `tiptap-markdown` was already wired into `TextEditor.tsx`'s extensions, but `onUpdate` only ever emitted `"html" | "json"`. Added `"markdown"` output that calls `editor.storage.markdown.getMarkdown()` (cast through `unknown` — `tiptap-markdown`'s storage type isn't part of `@tiptap/core`'s ambient `Storage` type). `BlogPostForm` uses `output="markdown"`.
  - **Blog post Markdown rendering does not use `@tailwindcss/typography`** (not installed, and out of scope to add) — `app/(public)/blog/[slug]/page.tsx` instead styles `react-markdown` output directly via its `components` prop, using the site's existing tokens.
  - **`/blog` and `/work` are `export const dynamic = "force-dynamic"`** — without it, Next prerendered them as static at build time (frozen snapshot of DB content at build). A CMS-driven site needs these to reflect live data on every request.
  - **Admin CRUD list/detail pages use inline server actions** (`action={async () => { "use server"; return deleteBlogPost(...); }}`) passed as props into client components (`AdminDeleteButton`, etc.) rather than React Hook Form — this project's Phase 0 dependency list never installed `react-hook-form`/`@hookform/resolvers` (unlike `dev-portfolio`), consistent with Phase 1's "no extra dependencies" rewrites of `lib/utils.ts`/`lib/url.ts`.
- **2026-08-16:** Data-layer CRUD (create/read/update/delete + unique-slug-index rejection) verified directly against the real Atlas cluster for all three models via a throwaway script, then deleted — not run through the actual admin UI/OAuth (no browser available in this environment). Two things came out of it:
  - **This machine's Node.js resolves DNS via `127.0.0.1` (a local stub) which refuses the `SRV` query `mongodb+srv://` needs**, even though the OS resolver (used by PowerShell/curl) handles it fine — this is why `npm run build`'s static-generation phase logs `ECONNREFUSED` for routes that touch the DB, and it will also affect a plain `npm run dev` on this machine. Not a code issue and irrelevant on Vercel (proper DNS there); workaround for local scripts is `dns.setServers([...])` before connecting. Worth knowing about if local dev ever appears to hang/fail on DB calls.
  - **Fixed a real deprecation**: `findByIdAndUpdate(..., { new: true })` in `lib/actions/{blog,project,lead}.action.ts` triggered a Mongoose 9 deprecation warning against the live cluster. Replaced with `{ returnDocument: "after" }` (the non-deprecated equivalent) in all three files; re-ran the CRUD script to confirm no behavior change and the warning is gone.

---

## Phase 0 — Dependencies

- [x] Install: `mongoose`, `next-auth@beta`, `zod`, `pino`, `pino-pretty` (dev), `slugify`, `react-markdown`
- [x] Install: `@tiptap/react`, `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-highlight`, `@tiptap/extension-image`, `@tiptap/extension-underline`, `@tiptap/extension-link`, `tiptap-markdown`, `lucide-react`
- [x] Install: `@floating-ui/dom` (added during Phase 5 — required peer dependency of `@tiptap/react`'s bubble/floating menu, used by the pasted `BubbleMenu.tsx`; production build failed without it — see Decisions Log)
- [x] Create `.env.example` documenting all required env vars (see Phase 8); `.env.local` scaffolded too (gitignored, values pending from user)
- [x] Reorganize `components/` into `layout/`, `sections/`, `cards/`, `filters/`, `admin/`, `editor/`, `ui/` (mirrors `dev-portfolio` taxonomy + one addition, `ui/`, for cross-section atoms); import paths fixed in `app/layout.tsx` and `app/page.tsx`. `cards/`, `filters/`, `admin/` are currently empty, populated in Phases 5–6.

## Phase 1 — Reconcile the pasted backend + core infrastructure

The files below already exist in the tree (pasted from `dev-portfolio`, all untracked in git). This phase adapts each one instead of writing from scratch.

**Keep, adapt:**
- [x] `lib/mongoose.ts` — fix hardcoded `dbName: "devportfolio"` → read from `process.env.MONGODB_DB` (throws fast if unset, same as `MONGODB_URI`)
- [x] `lib/http-errors.ts` — reused as-is
- [x] `lib/logger.ts` — reused as-is
- [x] `lib/handlers/error.ts` — reused as-is
- [x] `lib/handlers/action.ts` — reused as-is
- [x] `database/models/BlogPost.model.ts` — kept `coverImage: {url, fileId}` (ImageKit shape); `_id` typed as `Types.ObjectId` instead of `any` (lint)
- [x] `database/models/Project.model.ts` — replaced portfolio fields with `label, challenge, whatWeBuilt, howItWorks, outcome, liveUrl?`; kept `coverImage: {url, fileId}`
- [x] `database/index.ts` — dropped `Testimonial`/`YoutubeVideo`/`Settings` exports, added `Lead`
- [x] `lib/actions/blog.action.ts` — coverImage shape unchanged; fixed `publishedAt` typing (schema allows `string | Date`, model requires `Date` — now normalized with `new Date(...)` before assignment) and removed `any` casts
- [x] `lib/actions/project.action.ts` — rewritten for the new `Project` field set; search query now matches `title`/`challenge` (old `description`/`techStack` fields no longer exist); dropped the old `client`/`personal` techStack-regex filter (modeling smell called out in `BACKEND_HANDOFF.md` §5, and the fields it matched against don't exist on the new schema)
- [x] `auth.ts` — added `ADMIN_EMAILS` allow-list in `signIn` callback, `pages.signIn: "/admin/login"`, and a `callbacks.authorized` gate (see Decisions Log — required for the proxy to actually enforce anything)
- [x] `proxy.ts` — reused as-is (matcher `/admin/:path*`); login-page exclusion handled inside `authorized()` in `auth.ts` instead
- [x] `app/api/auth/[...nextauth]/route.ts` — reused as-is
- [x] `types/global.d.ts` — reused as-is
- [x] `types/action.d.ts` — dropped Testimonial/YoutubeVideo/Settings param types, adjusted Project/BlogPost params, added `SubmitLeadParams`/`MarkLeadReadParams`/`DeleteLeadParams`
- [x] `types/env.d.ts` — dropped `AUTH_GITHUB_*`; added `MONGODB_DB`, `ADMIN_EMAILS`; kept `IMAGEKIT_*`
- [x] `types/tiptap.d.ts` — reused as-is
- [x] `types/imagekit.d.ts` — reused as-is
- [x] `lib/imagekit.server.ts` — reused as-is
- [x] `app/api/upload-auth/route.ts`, `app/api/assets/route.ts`, `app/api/folders/route.ts` — reused as-is; `@imagekit/next` was already in `package.json` from the user's paste
- [x] `components/admin/AssetSelector.tsx` — user had already pasted this in; reskinned from the old paper/hand-font theme to this project's tokens (`font-heading`/`font-sans`, `text-foreground`/`text-muted`, `border-foreground/10`, `bg-accent`/`text-accent` instead of stray `blue-600`/`red-500`); fixed a real bug (`(file as any).fileId` reached for a property that doesn't exist on the normalized `IKFile` type — `/api/assets` already maps ImageKit's `fileId` into `.id`)
- [x] `components/editor/{TextEditor,Toolbar,BubbleMenu}.tsx` — reskinned colors/fonts to this project's theme tokens (`var(--font-hand)`/`var(--font-body)` → `var(--font-sans)`; hardcoded hex → `var(--foreground)`/`var(--muted)`/`var(--background)`/`rgb(10 10 10 / 0.12)`; unified the two mismatched highlight colors to one `#fde2e1` tint; fixed `TextEditor`'s invalid `border-border` Tailwind class and dead `artifact-shadow`/`artifact-rotate-left` custom classes that had no CSS backing anything). `onImageInsert` → `AssetSelector` wiring is deferred to Phase 5 (it's the *parent form's* job to pass that prop, not the editor's).

**Delete (out of scope for this site):**
- [x] `database/models/Testimonial.model.ts`, `database/models/YoutubeVideo.model.ts`, `database/models/Settings.model.ts`
- [x] `lib/actions/testimonial.action.ts`, `lib/actions/youtube.action.ts`, `lib/actions/settings.action.ts`

**Rewrite without the extra dependencies they currently import:**
- [x] `lib/utils.ts` — rewritten dependency-free: `cn()` is a small manual flatten/join (no `tailwind-merge` dedup, acceptable at this scale), `formatDate()` uses native `Intl.DateTimeFormat`, `truncate()` unchanged
- [x] `lib/url.ts` — deleted (nothing imports it; native `URLSearchParams` is enough if admin list filters need it later)

**New:**
- [x] `database/models/Lead.model.ts`
- [x] `lib/actions/lead.action.ts`

## Phase 2 — Database models

- [x] `BlogPost` — adapted per Phase 1
- [x] `Project` — adapted per Phase 1
- [x] `Lead` — new per Phase 1
- [x] `database/index.ts` updated to export exactly these three

## Phase 3 — Authentication

- [x] `auth.ts` — Google provider, `ADMIN_EMAILS` allow-list in `signIn`, `authorized` callback gating the proxy
- [x] `proxy.ts` — protects `/admin/:path*`
- [x] `app/(admin)/admin/login/page.tsx` — public sign-in page (server component, form posts to an inline server action calling `signIn("google", { redirectTo: "/admin" })`), styled to match site theme. Sits outside the `(dashboard)` route group so it isn't wrapped by the sidebar layout.

## Phase 4 — Server actions

- [x] `lib/actions/blog.action.ts` — `getBlogPosts(params, publishedOnly?)`, `getBlogPostBySlug`, `getBlogPostById`, `createBlogPost`, `updateBlogPost`, `deleteBlogPost`, `togglePublished`
- [x] `lib/actions/project.action.ts` — `getProjects(params)`, `getProjectBySlug`, `getProjectById`, `createProject`, `updateProject`, `deleteProject`
- [x] `lib/actions/lead.action.ts` — `submitLead` (public, Zod-validated, honeypot field), `getLeads`, `markLeadRead`, `deleteLead` (all authed)
- [x] Slug auto-derivation via `slugify` on create, re-derived on title change, for BlogPost + Project

## Phase 5 — Admin UI

- [x] `app/(admin)/admin/(dashboard)/layout.tsx` — sidebar nav (Dashboard, Blog, Work, Leads, Sign out), session check (redirects to `/admin/login` if no session — defense in depth alongside `proxy.ts`)
- [x] `app/(admin)/admin/(dashboard)/page.tsx` — dashboard overview (post/project/unread-lead counts)
- [x] `app/(admin)/admin/(dashboard)/blog/page.tsx` — list, publish toggle, delete, search/filter via `FilterBar`
- [x] `app/(admin)/admin/(dashboard)/blog/new/page.tsx` + `[id]/edit/page.tsx` — form using `components/editor/TextEditor.tsx` (Markdown output) for content
- [x] `app/(admin)/admin/(dashboard)/work/page.tsx` — list, delete, search/featured-filter via `FilterBar` (drag-reorder not implemented — `order` is a plain number field in `ProjectForm`)
- [x] `app/(admin)/admin/(dashboard)/work/new/page.tsx` + `[id]/edit/page.tsx` — form covering challenge/whatWeBuilt/howItWorks/outcome
- [x] `app/(admin)/admin/(dashboard)/leads/page.tsx` — inbox, mark read/unread, delete
- [x] `components/admin/AdminSidebar.tsx`, `AdminDeleteButton.tsx`, `TogglePublishedButton.tsx`, `LeadReadToggle.tsx`, `BlogPostForm.tsx`, `ProjectForm.tsx` — styled with existing Tailwind theme tokens (no new design system); forms are plain controlled components (no React Hook Form — see Decisions Log) calling the server actions directly
- [x] `components/filters/FilterBar.tsx` — search/filter bar for the admin Blog and Work list pages, drives `?query=&filter=` via `useSearchParams`/`router.push`

## Phase 6 — Connect public frontend to the backend

- [x] `components/cards/BlogCard.tsx`, `components/cards/ProjectCard.tsx` — new, render one BlogPost/Project as used by the list pages below
- [x] `app/(public)/blog/page.tsx` — replaced stub with `getBlogPosts({ pageSize: 100 }, true)`, renders grid via `BlogCard`; `force-dynamic`
- [x] `app/(public)/blog/[slug]/page.tsx` — replaced stub with `getBlogPostBySlug`, renders Markdown content via `react-markdown` (custom `components` map, not `@tailwindcss/typography`), `notFound()` if missing/unpublished
- [x] `app/(public)/work/page.tsx` — replaced hardcoded `projects` array with `getProjects({ pageSize: 100 })`; per-project markup extracted into `ProjectCard` (clean 1:1 swap — image block falls back to the old number/label placeholder when no `coverImage` is set); `force-dynamic`
- [x] `app/(public)/contact/page.tsx` — form extracted to `components/sections/ContactForm.tsx` (needed `"use client"` for interactivity while the page stays a server component for metadata), wired to `submitLead` with pending/success/error UI and a hidden honeypot field, all original fields/styling kept

## Phase 7 — Verification

- [x] `npm run lint` — clean
- [x] TypeScript check (`tsc --noEmit`) — clean
- [x] `npm run build` — clean (MongoDB `ECONNREFUSED` lines during static-generation of unrelated routes are expected in this sandboxed environment, which has no network egress to Atlas — the actions catch the error and return a normal `ActionResponse`, so the build isn't affected; will not occur on Vercel)
- [x] Data-layer CRUD verified against the real Atlas database (create/read/update/delete + unique-slug-index enforcement, for BlogPost, Project, and Lead) via a throwaway script — see note below. Still open: driving the same flows through the actual admin UI + Google OAuth, which needs a real browser session.
- [ ] Manual: admin login flow (allowed email succeeds, non-allowed email rejected)
- [ ] Manual: Blog CRUD end-to-end through the admin UI (create with TipTap editor → publish → visible on `/blog` → visible at `/blog/[slug]` → edit → delete)
- [ ] Manual: Work CRUD end-to-end through the admin UI (create → visible on `/work` → edit → delete)
- [ ] Manual: Contact form submits through the browser, lead appears in `/admin/leads`
- [x] Confirm no private env vars (`MONGODB_URI`, `AUTH_GOOGLE_SECRET`, etc.) reachable from any `"use client"` component — grepped every `"use client"` file for `process.env`, no hits

## Phase 8 — Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | Mongo connection string |
| `MONGODB_DB` | yes | Database name (configurable — no hardcoded name) |
| `AUTH_SECRET` | yes | NextAuth JWT/cookie signing secret |
| `AUTH_GOOGLE_ID` | yes | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | yes | Google OAuth client secret |
| `ADMIN_EMAILS` | yes | Comma-separated allow-list of emails permitted admin access |
| `IMAGEKIT_PUBLIC_KEY` | yes | ImageKit public API key (client-safe) |
| `IMAGEKIT_PRIVATE_KEY` | yes | ImageKit private API key (server-only, never sent to client) |
| `IMAGEKIT_URL_ENDPOINT` | yes | ImageKit CDN base URL |
| `LOG_LEVEL` | no | Pino log level (default debug/info) |

Status: all values filled in `.env.local` (gitignored).

## Phase 9 — Not in this pass (future TODOs)

- [ ] Decompose `app/page.tsx` into `components/sections/*` files (Hero, Benefits, Services, Process, WhyUs, SelectedWork, Faq, Cta) matching `dev-portfolio`'s per-section pattern — pure refactor, no functional change, deferred since it's unrelated to wiring up the backend
- [ ] Email notifications on new Lead
- [ ] Vercel deployment + Cloudflare DNS cutover to point the existing domain at Vercel
- [ ] Remove unused `@opennextjs/cloudflare` / `wrangler` devDependencies once Vercel migration is confirmed
