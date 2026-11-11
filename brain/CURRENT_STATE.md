# Current Project State (`CURRENT_STATE.md`)

> **Primary Agent Starting Point.** Last verified: **2026-11-11** (after implementing Auto Loan Calculator & public tool-by-slug wiring on branch `development`).

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
- Admin Tool Catalog CRUD (`/admin/tools`, `new`, `[id]/edit`) — full catalog metadata, placement validation, icon selection from media library, `executionType` + allowlisted `componentKey`, SEO fields, `tools:seed` (`4,351` tools seeded inactive/non-indexable), and `tool:assign` CLI helper.
- Public Catalog API: `/api/v1/catalog/categories`, `/api/v1/catalog/featured`, and `/api/v1/catalog/tools/:slug` (includes `relatedTools` from existing MongoDB category/pillar siblings).
- Homepage `/` Server Component integration linking featured tools and categories.
- Public About page (`/about`): redesigned editorial layout. Copy is static. Category and tool totals are read from `/catalog/categories` and hidden if that request fails.
- **Auto Loan Calculator (`/tools/auto-loan-calculator`):** Live client-side calculator (`componentKey: 'AutoLoanCalculator'`, `executionType: 'client'`) wired end-to-end from MongoDB → Express → Next.js Server Component (`generateMetadata` + `/tools/[slug]/page.tsx`) → allowlisted `ToolRegistry` → `AutoLoanCalculator`. Features a two-column desktop layout (`~62%` left article/TOC/related calculators, `~38%` right compact calculator panel; single-column with calculator near top on tablet/mobile), inline unit inputs with keyboard/hover/tap `InfoTooltip` help, fixed-rate & 0% APR math, positive/negative trade-in equity, configurable sales tax basis (`after-trade-in` vs `full-price`) & finance/upfront toggles, configurable display currency, Principal vs. Interest SVG breakdown, Monthly & Yearly amortization schedule (inline toggle + accessible full-width modal + CSV download) with final-payment cent reconciliation, Copy Results, Reset, MongoDB-backed `RelatedCatalogTools` distinguishing `Preview Only` vs non-link `Catalog Only` entries, accessible `TableOfContents` (`scroll-mt-24`), 11 educational content sections (including term comparison & worked example), FAQs, and 15 unit test suites (`calculation.test.ts`).

### Partially Implemented / UI Preview Only
- **Public Directory & Tool Pages (`/tools`, `/tools/[slug]`, `/categories`, `/categories/[slug]`, `Header`, `Footer`, `MobileNavigation`):** Currently backed by static `frontend/src/lib/sample-data.ts` (12 categories, 18 tools), **not** live MongoDB records.
- **Tool Execution Workspace (`ToolWorkspace.tsx` + `src/tools/registry/index.ts`):** Registry infrastructure and `ToolWorkspace` UI preview shell exist, but `frontend/src/tools/` category directories contain only `.gitkeep` (0 live calculator implementations).
- **Public Contact (`/contact`):** Redesigned page. The form validates name, email, subject, and message in the browser, then states that nothing was delivered. No backend email/ticket endpoint.
- **Public Directory & Legacy Tool Pages (`/tools`, `/categories`, `/categories/[slug]`, `Header`, `Footer`, `MobileNavigation`, and unregistered `/tools/[slug]` pages):** Currently backed by static `frontend/src/lib/sample-data.ts` (12 categories, 18 sample tools); `/tools/[slug]` resolves active MongoDB tools via `getPublicToolBySlug` first and falls back to `sample-data.ts` for legacy sample slugs.
- **Other Tool Implementations (`frontend/src/tools/`):** Only `AutoLoanCalculator` is implemented and registered; the remaining category folders (`ai`, `audio`, `converters`, `developer`, `image`, `pdf`, `seo`, `video`) and `Loan Calculator` remain unimplemented.
- **Public Contact (`/contact`):** Client-side form validation preview only; no backend email/ticket endpoint.
- **Legal Pages (`/privacy-policy`, `/terms-of-service`):** Draft templates pending legal review.
- **Admin Preview Pages (`/admin`, `/admin/analytics`, `/admin/activity-logs`, `/admin/integrations`, `/admin/pages`, `/admin/seo`, `/admin/settings`, `/admin/users`):** Complete UI rendered from `frontend/src/lib/admin-mock-data.ts` with `PendingNotice` banners; backend endpoints/models do not exist yet.
- **Admin Profile 2FA Switch (`AdminProfileClient.tsx`):** UI toggle state only; no TOTP backend exists.

### Pending / Planned
- Wiring public `/tools`, `/categories`, `/categories/[slug]`, and header/footer navigation to MongoDB via Express `/api/v1/catalog/*`.
- Building remaining client-side/server-side tool components under `frontend/src/tools/` (starting with `Loan Calculator`, etc.) and registering them.
- Backend modules currently containing `.gitkeep` only: `analytics`, `integrations`, `jobs`, `seo`, `uploads`, `users`.
- Attaching `requireRole` middleware to admin routes and implementing staff management.

---

## 3. Known Issues & Drift

1. **Homepage vs. Category Detail Route Data Mismatch:** `/` links to live MongoDB category slugs (`/categories/finance-business`, etc.), whereas `/categories/[slug]` still resolves against `sample-data.ts`. (Tool link `/tools/auto-loan-calculator` now resolves live from MongoDB; unimplemented featured tool `/tools/loan-calculator` resolves to the sample-data preview.)
2. **Catalog Featured Filter:** `catalog.service.ts` `listFeaturedTools()` queries `{ isFeatured: true }` without checking `isActive: true`.
3. **Env Var Drift:** `backend/.env.example` lists `SESSION_TTL_HOURS`/`SESSION_REMEMBER_ME_DAYS` and `frontend/.env.example` lists `ADMIN_SESSION_COOKIE_NAME`/`COOKIE_SECURE`, which are currently hardcoded in `admin-auth.service.ts` (`24h`/`7d`) and `session.ts` (`'admin_session'`, `NODE_ENV === 'production'`).
4. **Residual Branding Strings:** `mega_tools` DB default, `megatools.io` placeholders, and `mega-tools/platform` link remain in non-critical defaults/UI previews.

---

## 4. Current Development Focus

- Auto Loan Calculator implemented and live at `/tools/auto-loan-calculator`; next priority is wiring public `/tools` & `/categories` catalog endpoints (`BE-02` / `FE-01`) and implementing subsequent calculators (`TOOL-01`).

---

## 5. Last Verified Checks (Observed 2026-11-11)

| App / Check | Command | Result |
| :--- | :--- | :--- |
| Backend Type-Check & Build | `cd backend && npm run type-check && npm run build` | **Passed** (`tsc --noEmit` & `tsc`, 0 errors) |
| Backend Helper Self-Checks | `npx tsx src/modules/tools/tool.key.ts`, `media.key.ts`, `tool.copy.ts` | **Passed** |
| Frontend Type-Check | `cd frontend && npm run type-check` | **Passed** (`tsc --noEmit`, 0 errors) |
| Frontend Lint | `cd frontend && npm run lint` | **Passed** (`next lint`, 0 errors, 11 pre-existing `@next/next/no-img-element` warnings) |
| Frontend Production Build | Isolated `npx next build` (against running Express `5001`) | **Passed** (46/46 static pages compiled cleanly) |
| Auto Loan Calculation Tests | `.\backend\node_modules\.bin\tsx.cmd .\frontend\src\tools\calculators\auto-loan\calculation.test.ts` | **Passed** (15 test suites including worked example & term table) |
| Headless Browser & Responsive Verification | Headless Chrome CDP on `next start` (`1440px` desktop, `768px` tablet, `375px` mobile) | **Passed** (2-column ratios, mobile top placement, live worked example math, validation, tooltips, schedule modal/Escape, TOC anchors, zero 404 main links, zero console exceptions) |
