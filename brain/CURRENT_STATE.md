# Current Project State (`CURRENT_STATE.md`)

> **Primary Agent Starting Point.** Last verified: **2026-11-11** (HEAD at `ef4ed1c` on branch `development` prior to adding Brain/rules).

---

## 1. Snapshot Summary

- **Repository Setup:** Independent `frontend/` (Next.js 15 App Router, React 19, Tailwind CSS) and `backend/` (Express 4, Mongoose/MongoDB, TypeScript) applications with no npm workspaces.
- **Brand:** Codebase refactored from **Mega Tools** to **Omega Calculators** (`136359a`); some legacy `mega_tools` / `megatools.io` strings remain in env defaults and mock/placeholder files.
- **Core Rule:** `Browser → Next.js Server → Express API → MongoDB` (strictly enforced via `server-only` + Server Actions; media uploads use Server-Action-signed S3 URLs for direct browser `PUT` to S3).

---

## 2. Feature Status Matrix

### Implemented (Verified End-to-End)
- Express server bootstrap, `/api/v1/health`, Zod env config, Mongoose connection & graceful shutdown (`backend/src/server.ts`, `app.ts`).
- Admin authentication: Argon2id hashing, MongoDB TTL `AdminSession`, `HttpOnly` `admin_session` cookie, Edge + Server layout route protection, brute-force lockout, IP rate limiters, SMTP password reset, profile name update, password change with global session revocation (`backend/src/modules/auth/`, `frontend/src/server/auth/`).
- Admin Category tree management (`/admin/categories`, `new`, `[id]/edit`) — 3-level `category → pillar → sub_pillar` CRUD, search, pagination, cascade delete, and `categories:seed` script (`19` categories, `155` pillars).
- Admin Media Library (`/admin/media`) — AWS S3 presigned `PUT` upload, `HeadObject` validation, MongoDB `MediaAsset` storage, list/filter/preview/delete.
- Admin Tool Catalog CRUD (`/admin/tools`, `new`, `[id]/edit`) — full catalog metadata, placement validation, icon selection from media library, SEO fields, and `tools:seed` script (`4,351` tools seeded inactive/non-indexable).
- Public Catalog API (`/api/v1/catalog/categories`, `/api/v1/catalog/featured`) and homepage `/` Server Component integration.

### Partially Implemented / UI Preview Only
- **Public Directory & Tool Pages (`/tools`, `/tools/[slug]`, `/categories`, `/categories/[slug]`, `Header`, `Footer`, `MobileNavigation`):** Currently backed by static `frontend/src/lib/sample-data.ts` (12 categories, 18 tools), **not** live MongoDB records.
- **Tool Execution Workspace (`ToolWorkspace.tsx` + `src/tools/registry/index.ts`):** Registry infrastructure and `ToolWorkspace` UI preview shell exist, but `frontend/src/tools/` category directories contain only `.gitkeep` (0 live calculator implementations).
- **Public Contact (`/contact`):** Client-side form validation preview only; no backend email/ticket endpoint.
- **Legal Pages (`/privacy-policy`, `/terms-of-service`):** Draft templates pending legal review.
- **Admin Preview Pages (`/admin`, `/admin/analytics`, `/admin/activity-logs`, `/admin/integrations`, `/admin/pages`, `/admin/seo`, `/admin/settings`, `/admin/users`):** Complete UI rendered from `frontend/src/lib/admin-mock-data.ts` with `PendingNotice` banners; backend endpoints/models do not exist yet.
- **Admin Profile 2FA Switch (`AdminProfileClient.tsx`):** UI toggle state only; no TOTP backend exists.

### Pending / Planned
- Wiring public `/tools`, `/tools/[slug]`, `/categories`, `/categories/[slug]`, and header/footer navigation to MongoDB via Express `/api/v1/catalog/*`.
- Building actual client-side/server-side tool components under `frontend/src/tools/` and registering them.
- Backend modules currently containing `.gitkeep` only: `analytics`, `integrations`, `jobs`, `seo`, `uploads`, `users`.
- Attaching `requireRole` middleware to admin routes and implementing staff management.

---

## 3. Known Issues & Drift

1. **Backend Local `node_modules` Out of Sync:** `backend/package.json` declares `nodemailer` (`^10.5.0`), `@aws-sdk/client-s3` (`^3.1166.0`), and `@aws-sdk/s3-request-presigner` (`^3.1166.0`), which are **not yet installed** in local `backend/node_modules/`, causing `backend` `npm run type-check` to fail locally with `TS2307` (and `TS7006` on `allowed` in `s3.service.ts:72` due to missing SDK types).
2. **Homepage vs. Detail Route Data Mismatch:** `/` links to live MongoDB category/tool slugs from `/catalog/*`, whereas `/categories/[slug]` and `/tools/[slug]` still resolve against `sample-data.ts` (`generateStaticParams` + lookup), causing 404s for DB slugs not in `sample-data.ts`.
3. **Catalog Featured Filter:** `catalog.service.ts` `listFeaturedTools()` queries `{ isFeatured: true }` without checking `isActive: true`.
4. **Env Var Drift:** `backend/.env.example` lists `SESSION_TTL_HOURS`/`SESSION_REMEMBER_ME_DAYS` and `frontend/.env.example` lists `ADMIN_SESSION_COOKIE_NAME`/`COOKIE_SECURE`, which are currently hardcoded in `admin-auth.service.ts` (`24h`/`7d`) and `session.ts` (`'admin_session'`, `NODE_ENV === 'production'`).
5. **Residual Branding Strings:** `mega_tools` DB default, `megatools.io` placeholders, and `mega-tools/platform` link remain in non-critical defaults/UI previews.

---

## 4. Current Development Focus

- Establishing cross-agent shared Project Brain (`brain/`), root `AGENTS.md`, and synchronized Antigravity (`.agents/rules/`) + Cursor (`.cursor/rules/`) guardrails for multi-developer collaboration on branch `development`.

---

## 5. Last Verified Checks (Observed 2026-11-11)

| App / Check | Command | Result |
| :--- | :--- | :--- |
| Frontend Type-Check | `cd frontend && npm run type-check` | **Passed** (`tsc --noEmit`, 0 errors) |
| Frontend Lint | `cd frontend && npm run lint` | **Passed** (`next lint`, 0 errors, 11 `@next/next/no-img-element` warnings) |
| Backend Type-Check | `cd backend && npm run type-check` | **Failed** (4 TS errors: missing local `nodemailer` & `@aws-sdk/*` packages in `backend/node_modules` + `TS7006` at `s3.service.ts:72`) |
| Backend Helper Self-Checks | `npx tsx src/modules/media/media.key.ts`, `tool.key.ts`, `tool.copy.ts` | **Passed** (`media.key ok`, `tool.key ok`, `tool.copy ok`) |
