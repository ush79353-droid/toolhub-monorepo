# Current Project State (`CURRENT_STATE.md`)

> **Primary Agent Starting Point.** Last verified: **2026-11-12** (after implementing Loan Calculator & wiring `/tools/loan-calculator` on branch `development`).

---

## 1. Snapshot Summary

- **Repository Setup:** Independent `frontend/` (Next.js 15 App Router, React 19, Tailwind CSS) and `backend/` (Express 4, Mongoose/MongoDB, TypeScript) applications with no npm workspaces.
- **Brand:** Codebase refactored from **Mega Tools** to **Omega Calculators** (`136359a`); some legacy `mega_tools` / `megatools.io` strings remain in env defaults and mock/placeholder files.
- **Core Rule:** `Browser → Next.js Server → Express API → MongoDB`. Media storage follows `STORAGE_DRIVER`: `local` (default, files in `backend/uploads`) or `s3` (direct browser `PUT` to a signed URL).

---

## 2. Feature Status Matrix

### Implemented (Verified End-to-End)
- Express server bootstrap, `/api/v1/health`, Zod env config, Mongoose connection & graceful shutdown (`backend/src/server.ts`, `app.ts`).
- Admin authentication: Argon2id hashing, MongoDB TTL `AdminSession`, `HttpOnly` `admin_session` cookie, Edge + Server layout route protection, brute-force lockout, IP rate limiters, SMTP password reset, profile name update, password change with global session revocation (`backend/src/modules/auth/`, `frontend/src/server/auth/`).
- Admin Category tree management (`/admin/categories`, `new`, `[id]/edit`) — 3-level `category → pillar → sub_pillar` CRUD, search, pagination, cascade delete, and `categories:seed` script (`19` categories, `155` pillars). Root categories also store `iconUrl` / `iconMedia` (`categories:icons`) and a public `description` (`categories:descriptions` fills empty root descriptions). The create and edit forms save that description.
- Admin Media Library (`/admin/media`) — `STORAGE_DRIVER=local` stores files in `backend/uploads` (served at `/uploads`). `STORAGE_DRIVER=s3` keeps the signed browser `PUT`. MongoDB `MediaAsset` records the URL. List, filter, preview, and delete work for both.
- Admin Tool Catalog CRUD (`/admin/tools`, `new`, `[id]/edit`) — full catalog metadata, placement validation, icon selection from media library, `executionType` + allowlisted `componentKey`, SEO fields, `tools:seed` (`4,351` tools seeded inactive/non-indexable), `tools:publish` (15 active browser tools per category, 20 featured), and `tool:assign` CLI helper.
- Public Catalog API: `/api/v1/catalog/categories`, `/api/v1/catalog/featured`, and `/api/v1/catalog/tools/:slug` (includes `relatedTools` from existing MongoDB category/pillar siblings).
- Homepage `/` Server Component integration linking featured tools and categories.
- Public About page (`/about`): redesigned editorial layout. Copy is static. Category and tool totals are read from `/catalog/categories` and hidden if that request fails.
- **Auto Loan Calculator (`/tools/auto-loan-calculator`):** Live client-side calculator (`componentKey: 'AutoLoanCalculator'`, `executionType: 'client'`) wired end-to-end from MongoDB → Express → Next.js Server Component (`generateMetadata` + `/tools/[slug]/page.tsx`) → allowlisted `ToolRegistry` → `AutoLoanCalculator`. Features a two-column desktop layout (`~62%` editorial article/TOC/related calculators left, `~38%` height-aware `StickyCalculatorAside` right with bottom-pinned fallback & keyboard focus header clearance; static single-column with calculator near top on `<1024px`), clean badge-free hero header, compact `h-11` (`44px` wrapper / `42px` inner input) aligned paired inputs (`Auto Price | Down Payment`, `Loan Term | Interest Rate`, `Trade-in Value | Amount Owed`), collapsible `Sales Tax, Fees & Start Date`, `autoComplete="off"` on numeric inputs, inline currency/unit badges with keyboard/hover/tap `InfoTooltip` help, fixed-rate & 0% APR math, positive/negative trade-in equity, configurable sales tax basis (`after-trade-in` vs `full-price`) & finance/upfront toggles, configurable display currency (`USD ($)`, etc.), mint Monthly Payment hero with symmetrical `2x3` metric cards & collapsible Principal/Interest SVG Chart and Breakdown drawers, Monthly & Yearly amortization schedule (inline toggle + `createPortal` full-width `z-[80]` modal + CSV download) with final-payment cent reconciliation, Copy Results, Reset, MongoDB-backed `RelatedCatalogTools` with clean footer status labels (`Open`, `Preview only`, non-link `Catalog only`), accessible `TableOfContents` (`scroll-mt-24`), unified single-card editorial article (`11` sections, `1.75` body line-height), FAQs, and 15 unit test suites (`calculation.test.ts`). **Formal financial calculation accuracy QA phase is still pending.**
- **Loan Calculator (`/tools/loan-calculator`):** Live client-side general-purpose calculator (`componentKey: 'LoanCalculator'`, `executionType: 'client'`, existing MongoDB record `6af46f0fa27d8d1d4e98ff4c` preserved) reusing the refined badge-free two-column layout, top-aligned Hero/Calculator cards, `StickyCalculatorAside`, `TableOfContents`, `RelatedCatalogTools` (bidirectionally linking with `Auto Loan Calculator`), and unified editorial article (`12` sections + FAQs). Supports Amortized and Interest-Only loan modes (explicit I/O period with post-I/O amortization or full-term principal balance due), Monthly (`12/yr`), Biweekly (`26/yr`), and Weekly (`52/yr`) schedules using nominal APR conversion, recurring & one-time extra principal payments with overpayment cap & interest savings comparison, upfront or financed origination fees, zero-interest & large-loan integer-cent math, Principal/Interest donut + Remaining Balance Over Time curve (`LoanChart.tsx`), Period/Yearly portaled `z-[80]` `LoanAmortizationTable` + CSV export, Copy Results, Reset, and 14 independent unit test suites (`loan/calculation.test.ts`).

### Partially Implemented / UI Preview Only
- **Public Directory & Legacy Tool Pages (`/tools` and unregistered `/tools/[slug]` pages):** `/tools` lists active tools from `GET /catalog/tools`, 24 per page, with name search and a category filter. `/categories` and `/categories/[slug]` also read the live catalog. A category page lists active tools only, grouped by pillar and sub-pillar, and links each one to `/tools/[slug]`. Header, footer, and the mobile menu use the same live category list. `/tools/[slug]` resolves active MongoDB tools via `getPublicToolBySlug` first and falls back to `sample-data.ts` for legacy sample slugs.
- **Other Tool Implementations (`frontend/src/tools/`):** Two working calculators (`AutoLoanCalculator` and `LoanCalculator`) are implemented and registered; the remaining category folders (`ai`, `audio`, `converters`, `developer`, `image`, `pdf`, `seo`, `video`) and other catalog tools remain unimplemented.
- **Public Contact (`/contact`):** Redesigned page (`ece3bce`). The form validates name, email, subject (`general inquiry`, `feature request`, `bug report`, `partnership`, `other`), and message in the browser, then explicitly states that the message was not delivered; no backend email/ticket endpoint exists.
- **Legal Pages (`/privacy-policy`, `/terms-of-service`):** Draft templates pending legal review.
- **Admin Preview Pages (`/admin`, `/admin/analytics`, `/admin/activity-logs`, `/admin/integrations`, `/admin/pages`, `/admin/seo`, `/admin/settings`, `/admin/users`):** Complete UI rendered from `frontend/src/lib/admin-mock-data.ts` with `PendingNotice` banners; backend endpoints/models do not exist yet.
- **Admin Profile 2FA Switch (`AdminProfileClient.tsx`):** UI toggle state only; no TOTP backend exists.

### Pending / Planned
- **Auto Loan Calculator financial calculation accuracy testing** (dedicated QA phase before marking math formulas sign-off complete).
- Wiring is done for public `/tools`, `/categories`, and `/categories/[slug]`. `listFeaturedTools` still does not require `isActive: true`.
- Building remaining client-side/server-side tool components under `frontend/src/tools/` (`TOOL-01`) and registering them.
- Backend modules currently containing `.gitkeep` only: `analytics`, `integrations`, `jobs`, `seo`, `uploads`, `users`.
- Attaching `requireRole` middleware to admin routes and implementing staff management.

---

## 3. Known Issues & Drift

1. **Catalog Featured Filter:** `catalog.service.ts` `listFeaturedTools()` queries `{ isFeatured: true }` without checking `isActive: true`.
2. **Env Var Drift:** `backend/.env.example` lists `SESSION_TTL_HOURS`/`SESSION_REMEMBER_ME_DAYS` and `frontend/.env.example` lists `ADMIN_SESSION_COOKIE_NAME`/`COOKIE_SECURE`, which are currently hardcoded in `admin-auth.service.ts` (`24h`/`7d`) and `session.ts` (`'admin_session'`, `NODE_ENV === 'production'`).
3. **Residual Branding Strings:** `mega_tools` DB default, `megatools.io` placeholders, and `mega-tools/platform` link remain in non-critical defaults/UI previews.

---

## 4. Current Development Focus

- Both featured financial calculators (`Auto Loan Calculator` and `Loan Calculator`) are implemented and live. `/categories` and `/categories/[slug]` read the live catalog. Next priorities are formal financial QA on Auto Loan Calculator, the public `/tools` directory (`BE-02` / `FE-01`), and building subsequent tools (`TOOL-01`).

---

## 5. Last Verified Checks (Observed 2026-11-12)

| App / Check | Command | Result |
| :--- | :--- | :--- |
| Backend Type-Check, Build & Self-Check | `cd backend && npm run type-check && npm run build && npx tsx src/modules/tools/tool.key.ts` | **Passed** (`tsc --noEmit` & `tsc` 0 errors, `tool.key ok`) |
| Frontend Type-Check | `cd frontend && npm run type-check` | **Passed** (`tsc --noEmit`, 0 errors) |
| Frontend Lint | `cd frontend && npm run lint` | **Passed** (`next lint`, 0 errors, 11 pre-existing `@next/next/no-img-element` warnings) |
| Frontend Production Build | Isolated `npx next build` (against running Express `5001`) | **Passed** (46/46 static pages compiled cleanly) |
| Loan Calculator Unit Tests | `.\backend\node_modules\.bin\tsx.cmd .\frontend\src\tools\calculators\loan\calculation.test.ts` | **Passed** (14 independent financial, schedule, fee, extra-payment, I/O, validation & CSV test suites) |
| Auto Loan Calculation Tests | `.\backend\node_modules\.bin\tsx.cmd .\frontend\src\tools\calculators\auto-loan\calculation.test.ts` | **Passed** (15 regression test suites; formal financial accuracy QA phase still pending) |
| Headless Browser & Responsive Verification | Headless Chrome CDP on `next start` (`1440x900`, `1280x800`, `1024x768`, `768x1024`, `375x812`, `320x640`) | **Passed** (verified `/` featured link, `/tools/loan-calculator` & `/tools/auto-loan-calculator`: 6/6 viewports 0 horizontal/header overflow, sticky enabled `>=1024px` / static `<1024px`, `0px` top-line card alignment, aligned inputs & frequency toggles, full-width `block` date input alignment on `Loan Start Date`, extra payment savings, Interest-Only mode, donut + balance curve SVGs, portaled `z-[80]` modal unobstructed by rotated FAQ chevrons, keyboard focus clearance, footer clearance, bidirectional Open links, and zero console/runtime errors) |
