# Architecture — Mega Tools / Omega Calculators

## 1. High-Level Topology

The repository houses **two completely independent TypeScript applications** (migrated out of an npm-workspace monorepo in commit `5f378c9`):

```text
ToolHub/
├── .agents/rules/       # Antigravity workspace rules (ponytail.md, mega-tools-brain.md)
├── .cursor/rules/       # Cursor workspace rules (ponytail.mdc, mega-tools-brain.mdc)
├── brain/               # Shared version-controlled Project Brain
├── AGENTS.md            # Cross-agent mandatory workflow and guardrails
├── backend/             # Independent Express.js + TypeScript + Mongoose REST API (Port 5001)
├── frontend/            # Independent Next.js 15 App Router + React 19 + Tailwind CSS app (Port 3000)
└── .gitignore           # Root ignore rules (node_modules, .env*, .next, dist, keys)
```

- **No npm workspaces:** `frontend/` and `backend/` each maintain independent `package.json`, `package-lock.json`, `tsconfig.json`, `.prettierrc`, and `node_modules/`.
- **Strict TypeScript:** Both applications enforce `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`, and `"noImplicitReturns": true`.

---

## 2. Critical Communication Boundary (Non-Negotiable)

```text
Browser  ──►  Next.js Server (RSC / Server Actions)  ──►  Express API (/api/v1)  ──►  MongoDB
```

### Boundary Rules

1. **The browser must NEVER call Express directly.**
   - Client Components (`'use client'`) must invoke **Next.js Server Actions** (`frontend/src/server/*/actions.ts`) or future Next.js Route Handlers (`frontend/src/app/api/`).
   - `frontend/src/server/api/client.ts` enforces `import 'server-only'` so it cannot be bundled into browser code.
   - `API_INTERNAL_URL` (default `http://localhost:5001/api/v1`) is a server-only environment variable and must **never** be prefixed with `NEXT_PUBLIC_`.
2. **Express is the authoritative backend for persistence, auth, and integrations.**
   - All MongoDB access lives in `backend/` via Mongoose (`backend/src/modules/*/*.model.ts`).
   - Session validation, password hashing, email delivery, and AWS S3 signing happen strictly in `backend/`.
3. **Media upload follows `STORAGE_DRIVER`.**
   - `local` (default): the browser `PUT`s the file to the Next.js route `/api/media-upload`, which forwards the bytes to Express `PUT /api/v1/admin/media/object`. Express writes `backend/uploads`. Public URLs are `/uploads/...`, rewritten by Next.js to that folder. The browser still does not call Express.
   - `s3`: the browser requests a short-lived pre-signed URL (`requestMediaUploadAction` → `POST /api/v1/admin/media/upload-url`) and `PUT`s the bytes directly to S3, then `confirmMediaUploadAction` asks Express to `HeadObject` before saving `MediaAsset`.

---

## 3. Technology Stack (Verified)

| Layer | Technology | Version (from `package.json`) | Notes |
| :--- | :--- | :--- | :--- |
| Frontend Framework | Next.js (App Router) | `^15.1.7` | `reactStrictMode: true` in `next.config.ts` |
| UI Runtime | React / React DOM | `^19.0.0` | Server Components by default; `'use client'` for interactive views |
| Styling | Tailwind CSS + `tailwindcss-animate` + CVA | `^3.4.17` | `components.json` configured (shadcn-style `src/components/ui/`) |
| Icons | `lucide-react` | `^1.16.0` | Used across public and admin UI |
| Backend Runtime | Express.js | `^4.21.2` | Versioned `/api/v1` router, `helmet`, `cors`, `compression` |
| Database / ODM | MongoDB + Mongoose | `^8.10.1` | `strictQuery: true`, graceful non-blocking startup on connect failure |
| Validation | Zod | `^3.24.2` | Independent copies in `frontend/src/lib/validation` and `backend/src/validation` |
| Password Hashing | Argon2 (`argon2`) | `^0.45.2` | Argon2id (64 MB memory, 3 iterations, parallelism 1) |
| Email Transport | `nodemailer` | `^10.5.0` | SMTP transport for admin password resets |
| Object Storage | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` | `^3.1166.0` | Pre-signed S3 uploads + head/delete operations |
| Language & Tooling | TypeScript, `tsx`, ESLint 9, Prettier 3.5 | `^5.7.3` | Both apps use `tsx` (backend dev/scripts), Prettier; frontend uses `next lint` |

---

## 4. Request & Auth Flow Summary

1. **Public SSR (`(website)/page.tsx`):** Next.js Server Component calls `serverApi.get('/catalog/categories')` and `serverApi.get('/catalog/featured')` using `API_INTERNAL_URL` with `cache: 'no-store'`.
2. **Admin Page Guard (`middleware.ts` + `admin/(dashboard)/layout.tsx`):**
   - Edge `middleware.ts` checks presence of the `admin_session` cookie on `/admin/:path*` and sets `noindex, nofollow` + `no-store` cache headers.
   - Server layout `admin/(dashboard)/layout.tsx` (`dynamic = 'force-dynamic'`) calls `getCurrentAdmin()`, which forwards `admin_session` to Express `GET /api/v1/admin/auth/me` via `x-admin-session` header.
3. **Admin Mutations:** Client component → `'use server'` Action (`src/server/*/actions.ts`) → reads `admin_session` cookie → sends `x-admin-session` header to Express `API_INTERNAL_URL` → Express `authenticateAdmin` middleware validates active `AdminSession` and `AdminUser` in MongoDB.

---

## 5. Directory Structure Summary

- `frontend/src/app/`: Route groups `(website)/`, `admin/` (auth pages + `(dashboard)/`), `embed/[slug]`, root `layout.tsx`, `globals.css`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, `manifest.json`.
- `frontend/src/server/`: `server-only` API client (`api/client.ts`) and Server Actions (`auth/`, `categories/`, `media/`, `tools/`, `catalog/`, `seo/`).
- `frontend/src/components/`: `ui/` primitives, `layout/`, `shared/`, `tools/`, `ads/`, `embed/`, `categories/`, `contact/`, `admin/`.
- `frontend/src/tools/`: calculator modules, registry, and shared helpers. See §7. Placeholder category folders (`ai`, `audio`, `converters`, `developer`, `image`, `pdf`, `seo`, `video`) still contain only `.gitkeep`. `frontend/src/lib/sample-data.ts` is removed.
- `frontend/src/lib/`: `constants.ts`, `helpers.ts`, `utils.ts`, `validation/`, `seo/`, `embed/`, `ads/`, `admin-mock-data.ts`.
- `backend/src/config/`: `env.ts` (Zod env parsing), `database.ts` (Mongoose lifecycle).
- `backend/src/middleware/`: `auth.middleware.ts`, `error.middleware.ts`, `logger.middleware.ts`, `notFound.middleware.ts`, `rate-limit.middleware.ts`.
- `backend/src/modules/`: Implemented (`health`, `admins`, `auth`, `categories`, `media`, `tools`, `catalog`, `currency`) and placeholders (`analytics`, `integrations`, `seo`, `uploads`, `users`).
- `backend/src/jobs/`: `currency-rates.cron.ts` (daily USD rate fetch, ADR-017).
- `backend/src/services/`: `email.service.ts`, `s3.service.ts`.
- `backend/src/scripts/`: `create-admin.ts`, `seed-categories.ts`, `seed-tools.ts`, `fetch-currency-rates.ts`, plus per-tool `assign-*-tool.ts` helpers.
- `backend/data/`: `tools-directory-hierarchy.json`, `tools-catalog.json`.

---

## 6. Deployment Assumptions (Observed from Code & `.env.example`)

- **Separate Deployable Processes:** Frontend runs on port `3000`; Backend runs on port `5001` (or platform-injected `PORT`).
- **Private Network / Internal URL:** Next.js server requires `API_INTERNAL_URL` (throws at startup in `production` if missing in `ServerApiClient`).
- **MongoDB Required for Full Functionality:** Backend startup does **not** crash if initial MongoDB connection fails (`server.ts` logs warning and `/health` reports `status: 'degraded'`), allowing health checks while degraded.
- **HTTPS in Production:** `setAdminSessionCookie` sets `secure: process.env.NODE_ENV === 'production'`.
- **In-Memory Rate Limiter Caveat:** `rate-limit.middleware.ts` uses a per-process JavaScript `Map`; multi-instance horizontal scaling would require a shared store (e.g., Redis) if deployed across multiple backend replicas.
- **External Services:** Password reset emails require `EMAIL_PROVIDER=smtp` and valid `SMTP_*`/`EMAIL_FROM` vars. Media uploads use local disk unless `STORAGE_DRIVER=s3`, which then needs `AWS_*` and bucket CORS allowing browser `PUT` from `CORS_ORIGIN`. Daily currency rates need `CURRENCY_EXCHANGE_API_KEY` (ADR-017); an empty key skips the fetch.

---

## 7. Calculator Module Architecture (Locked)

Verified against the tree after commits `a75ccbe` (drop preview data; 404 unregistered tools), `ebf68df` (per-tool `detail.tsx` + lazy calculator chunks), and `70e1af3` (0-60 follows the same module). **ADR-018.** Page design, SEO, embed, and ads stay locked in their own docs (ADR-016 and `TOOL_DETAIL_PAGE_STANDARDS.md`). This section does not change those decisions.

### 7.1 One route, two loaders

```text
/tools/[slug]
  Server page
    getPublicToolBySlug(slug)          # Next server → Express → Mongo
    isRegisteredComponentKey           # else notFound()
    loadToolPageDetail(componentKey)   # registry/details.ts → <tool>/detail.tsx
    ToolWorkspace                      # client; React.lazy from registry/index.ts
/embed/[slug]
  Same calculator component, presentation="embed"
  No guide, no AdSlot, noindex
```

- `frontend/src/tools/page-detail.ts` defines `ToolPageDetail` (intro line, aside label, TOC, guide component, FAQs, optional country rules).
- `frontend/src/tools/registry/details.ts` is a server map of static `import()` paths. It loads only the requested tool's `detail.tsx`.
- `frontend/src/tools/registry/index.ts` is `'use client'`. `getToolComponent` returns `React.lazy` for one static `import()` path. `ToolWorkspace` wraps it in `Suspense`.
- `frontend/src/tools/registry/keys.ts` is the pure allowlist (`APPROVED_COMPONENT_KEYS` and `REGISTERED_COMPONENT_KEYS`). Server pages, sitemap, embed, and the admin tool form import it. It must not import React calculator components.
- An active catalog row whose `componentKey` is missing from `REGISTERED_COMPONENT_KEYS`, or whose detail module fails to load, calls `notFound()`. It does not render a sample workspace.

### 7.2 Folder every new calculator uses

```text
frontend/src/tools/calculators/<kebab-id>/
  <Name>Calculator.tsx    # ToolComponent: metadata, presentation, headerActions
  <Name>Form.tsx          # inputs
  <Name>Results.tsx       # results (omit only when the calculator file is already tiny)
  <Name>GuideArticle.tsx  # educational article
  detail.tsx              # export const toolPageDetail: ToolPageDetail
  content.ts              # TOC, FAQ, and article copy constants
  types.ts                # input and result types
  calculation.ts          # pure engine
  validation.ts           # pure input checks
  calculation.test.ts     # assert checks, run with tsx
```

Add a chart, table, or unit helper in the same folder only when that tool needs it. Put a helper used by more than one tool in `frontend/src/tools/<domain>/` (example: `electrical/conductor.ts` plus `conductor.test.ts`).

`calculation.ts` and `validation.ts` import no React, no DOM, no Next.js, and no `server-only` modules. The calculator component calls them. It does not inline the formula.

### 7.3 Registration (all of these)

1. `frontend/src/tools/registry/keys.ts` — add the key to both allowlists.
2. `frontend/src/tools/registry/index.ts` — one `lazy()` entry. Keep the import path static so the bundler emits a separate chunk.
3. `frontend/src/tools/registry/details.ts` — one `import()` of `detail.tsx`.
4. `backend/src/modules/tools/tool.key.ts` — the same string in `APPROVED_COMPONENT_KEYS`, and the direct-run self-check.
5. Mongo `Tool.componentKey` matches that string (`tool:assign` or admin edit).
6. `frontend/src/app/sitemap.ts` — add the public slug to `IMPLEMENTED_TOOL_SLUGS`. `robots.ts` does not list slugs.

Do not add `app/(website)/tools/<slug>/page.tsx`. Do not register a calculator by importing it eagerly at the top of the shared page.

### 7.4 Shared shell to reuse, not copy

| Concern | Use |
| :--- | :--- |
| Page layout, intro, grid, ads | `app/(website)/tools/[slug]/page.tsx` |
| Calculator mount | `components/shared/ToolWorkspace.tsx` |
| Sticky calculator column | `calculators/auto-loan/StickyCalculatorAside.tsx` |
| Guide TOC | `calculators/auto-loan/TableOfContents.tsx` |
| Right rail | `components/shared/ToolDetailSidebar.tsx` |
| Display currency | `tools/shared/currency.ts`, `CurrencySelect.tsx` |
| Copy / CSV | `tools/shared/clipboard.ts`, `download.ts` |
| SEO | `lib/seo/tool-seo.ts` |
| Embed | `app/embed/[slug]/page.tsx`, `lib/embed/tool-embed.ts` |
| Ads | `components/ads/AdSlot.tsx` on the public tool page only |

`StickyCalculatorAside` and `TableOfContents` still live under `auto-loan/` because the shared page imports them from there. New calculators import those modules. They do not get a second aside or TOC component.

### 7.5 What this lock does not change

- Visual master remains Auto Loan Calculator (ADR-016): `TOOL_DETAIL_PAGE_STANDARDS.md`.
- SEO: `SEO_STANDARDS.md`. Embed: `EMBED_STANDARDS.md`. Ads: `AD_STANDARDS.md`.
- Currency display does not perform live FX conversion.
- Browser calculators still never call Express.

### 7.6 Existing calculators that do not match §7.2

Documented so new work does not copy the exception. Do not refactor them unless a task asks for it.

| Tool | Gap |
| :--- | :--- |
| `hundred-day` | No `types.ts`. Input and result types live in `calculation.ts`. |
| `auto-loan` | Also holds the shared aside, TOC, and `InfoTooltip` used by the page shell. |
| All seven | `APPROVED_COMPONENT_KEYS` is maintained twice: `registry/keys.ts` and `backend/.../tool.key.ts`. |

