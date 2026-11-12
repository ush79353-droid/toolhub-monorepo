# Current Project State (`CURRENT_STATE.md`)

> **Primary Agent Starting Point.** Last verified: **2026-11-13** (Auto Loan is master Tool Detail Page; 100 Day Calculator live at `/tools/100-day-calculator`).

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
- **Auto Loan Calculator (`/tools/auto-loan-calculator`):** Live client-side calculator (`componentKey: 'AutoLoanCalculator'`). **Official master Tool Detail Page reference** (ADR-016, 2026-11-13) for layout, typography, sticky `ToolDetailSidebar`, SEO/ads/embed inheritance, and educational shell — see `TOOL_DETAIL_PAGE_STANDARDS.md` + `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`. Full-width intro; desktop calculator/guide left ~66% + sticky sidebar widgets right ~34%; form spacing/`h-11`/Calculate–Reset; trade-in equity as muted helper text; Embed in `headerActions`. Retains auto-specific inputs (vehicle price, down payment amount/%, trade-in, sales tax/fees, start date) and results (monthly payment, amount financed, interest, upfront, total cost, payoff, chart, amortization). 15 unit test suites pass. **Formal financial calculation accuracy QA phase is still pending.**
- **Loan Calculator (`/tools/loan-calculator`):** Live client-side general-purpose calculator (`componentKey: 'LoanCalculator'`, `executionType: 'client'`, existing MongoDB record `6af46f0fa27d8d1d4e98ff4c` preserved). Visually aligned to the Auto Loan master shell while retaining Loan-specific features (Amortized/Interest-Only, Monthly/Biweekly/Weekly, extra payments, origination fees, balance curve, portaled amortization + CSV, Copy Results, Reset). Shares page shell, sticky sidebar, SEO/ads/embed. 14 unit test suites (`loan/calculation.test.ts`).
- **RREF Calculator (`/tools/reduced-row-echelon-form-calculator`):** Live client-side matrix calculator (`componentKey: 'RrefCalculator'`, existing catalog id `6af46f14a27d8d1d4e990674`). Exact rational Gauss–Jordan RREF with step-by-step row ops, rank/pivots/free columns/nullity, optional augmented-system analysis, 1×1–6×8 editor, shared Auto Loan master shell + embed/SEO/ads. 20 unit test suites (`rref/calculation.test.ts`).
- **ARM Mortgage Calculator (`/tools/arm-mortgage-calculator`):** Live client-side adjustable-rate mortgage calculator (`componentKey: 'ArmMortgageCalculator'`). Structures 3/1, 5/1, 7/1, 10/1, 5/6, 7/6, 10/6. Introductory amortization, then resets using a user assumption (constant, rising step, or falling step) with increase caps, lifetime ceiling, and optional floor. Payments re-amortize on remaining balance and term. Housing costs stay outside interest. Shared master shell, SEO, ads, and embed. Unit tests in `arm-mortgage/calculation.test.ts`.
- **100 Day Calculator (`/tools/100-day-calculator`):** Live client-side calendar calculator (`componentKey: 'HundredDayCalculator'`). Add or subtract 1–100,000 days, or count signed calendar days between two dates. Inclusive offset treats the start as day 1 (target is N−1 days away). Inclusive span counts both endpoints (same day = 1; exclusive same day = 0). Dates are `YYYY-MM-DD` civil dates added in UTC, so daylight saving time cannot shift the day. Years 1–9999. Shared master shell, SEO, ads, and embed. Unit tests in `hundred-day/calculation.test.ts`. January 1, 2026 + 100 exclusive days = April 11, 2026.
- **Calculator Embed System (`/embed/[slug]`):** Shared iframe surface for allowlisted calculators. **Embedding is enabled by default**; only an explicit admin OFF disables it (`resolveEmbedEnabled`). Public **Embed** button when eligible. CSP allows third-party framing only on `/embed/*`; embed pages are `noindex` with `no-store` cache and no ads. Standards: `brain/EMBED_STANDARDS.md`.
- **Dummy Ad Placeholders (`/tools/[slug]` only):** Reusable `AdSlot` (`tool_top_banner`, `tool_article_middle`, `tool_bottom_banner` on by default; sidebar/article-bottom off). Placeholder mode only — no AdSense. Embeds excluded. Standards: `brain/AD_STANDARDS.md`.
- **Tool Detail Page standards lock (docs):** Authoritative `TOOL_DETAIL_PAGE_STANDARDS.md`, step playbook `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, Cursor `.cursor/rules/tool-detail-page-standards.mdc`, Antigravity `.agents/rules/tool-detail-page-standards.md`, and `AGENTS.md` references — master is Auto Loan (verified 2026-11-13).

### Partially Implemented / UI Preview Only
- **Public Directory & Legacy Tool Pages (`/tools` and unregistered `/tools/[slug]` pages):** `/categories` and `/categories/[slug]` read the live catalog. A category page lists active tools only, grouped by pillar and sub-pillar, and links each one to `/tools/[slug]`. `/tools` still uses `frontend/src/lib/sample-data.ts`. Header, footer, and the mobile menu use the same live category list. `/tools/[slug]` resolves active MongoDB tools via `getPublicToolBySlug` first and falls back to `sample-data.ts` for legacy sample slugs.
- **Other Tool Implementations (`frontend/src/tools/`):** Five working calculators (`AutoLoanCalculator`, `LoanCalculator`, `RrefCalculator`, `ArmMortgageCalculator`, `HundredDayCalculator`) are implemented and registered; remaining category folders (`ai`, `audio`, `converters`, `developer`, `image`, `pdf`, `seo`, `video`) and other catalog tools remain unimplemented.
- **Public Contact (`/contact`):** Redesigned page (`ece3bce`). The form validates name, email, subject (`general inquiry`, `feature request`, `bug report`, `partnership`, `other`), and message in the browser, then explicitly states that the message was not delivered; no backend email/ticket endpoint exists.
- **Legal Pages (`/privacy-policy`, `/terms-of-service`):** Draft templates pending legal review.
- **Admin Preview Pages (`/admin`, `/admin/analytics`, `/admin/activity-logs`, `/admin/integrations`, `/admin/pages`, `/admin/seo`, `/admin/settings`, `/admin/users`):** Complete UI rendered from `frontend/src/lib/admin-mock-data.ts` with `PendingNotice` banners; backend endpoints/models do not exist yet.
- **Admin Profile 2FA Switch (`AdminProfileClient.tsx`):** UI toggle state only; no TOTP backend exists.

### Pending / Planned
- **Auto Loan Calculator financial calculation accuracy testing** (dedicated QA phase before marking math formulas sign-off complete).
- Wiring public `/tools` to MongoDB via Express `/api/v1/catalog/*`. `/categories` and `/categories/[slug]` already read the live catalog.
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

- Auto Loan Calculator is the locked master Tool Detail Page; Loan Calculator is aligned to that shell. Next priorities: formal financial QA on Auto Loan Calculator, public `/tools` directory (`BE-02` / `FE-01`), and subsequent tools via `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md` (`TOOL-01`).

---

## 5. Last Verified Checks (Observed 2026-11-12 — Auto Loan master-alignment)

| App / Check | Command | Result |
| :--- | :--- | :--- |
| Frontend Type-Check | `cd frontend && npx tsc --noEmit` | **Passed** (0 errors) |
| Frontend Lint | `cd frontend && npm run lint` | **Passed** (0 errors; pre-existing `@next/next/no-img-element` warnings only) |
| Auto Loan Calculation Tests | `tsx frontend/src/tools/calculators/auto-loan/calculation.test.ts` | **Passed** (15 suites) |
| Loan Calculator Regression Tests | `tsx frontend/src/tools/calculators/loan/calculation.test.ts` | **Passed** (14 suites) |
| Frontend Production Build | `cd frontend && npm run build` | **Passed** (includes `/tools/[slug]`, `/embed/[slug]`, `/robots.txt`, `/sitemap.xml`) |
| Live browser | `/tools/auto-loan-calculator` + `/embed/auto-loan-calculator` | **Passed** (no intro icon; Embed on; ads on public only; embed `noindex`; 1440 no overflowX; 375 mobile screenshot) |
