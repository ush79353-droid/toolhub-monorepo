# Current Project State (`CURRENT_STATE.md`)

> **Primary Agent Starting Point.** Last verified: **2026-11-13** (Auto Loan is master Tool Detail Page; 12-Hour Shift Pay Calculator live at `/tools/12-hour-shift-pay-calculator`).

---

## 1. Snapshot Summary

- **Repository Setup:** Independent `frontend/` (Next.js 15 App Router, React 19, Tailwind CSS) and `backend/` (Express 4, Mongoose/MongoDB, TypeScript) applications with no npm workspaces.
- **Brand:** Codebase refactored from **Mega Tools** to **Omega Calculators** (`136359a`); some legacy `mega_tools` / `megatools.io` strings remain in env defaults and mock/placeholder files.
- **Core Rule:** `Browser → Next.js Server → Express API → MongoDB`. Media storage follows `STORAGE_DRIVER`: `local` (default, files in `backend/uploads`) or `s3` (direct browser `PUT` to a signed URL).

---

## 2. Feature Status Matrix

### Implemented (Verified End-to-End)
- Express server bootstrap, `/api/v1/health`, Zod env config, Mongoose connection & graceful shutdown (`backend/src/server.ts`, `app.ts`). After Mongo connects, a currency job is armed for the next local midnight.
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
- **ARM Mortgage Calculator (`/tools/arm-mortgage-calculator`):** Live client-side adjustable-rate mortgage calculator (`componentKey: 'ArmMortgageCalculator'`). Home price minus a down payment (amount or percent). Structures 3/1, 5/1, 7/1, 10/1, 5/6, 7/6, 10/6, plus a custom fixed period and adjustment interval. Resets use an entered index + margin (constant, rising, or falling). Periodic caps limit both directions. Lifetime increase and decrease caps set the contract ceiling and floor. A separate cap-path payment shows the fastest rise the caps allow. Payments re-amortize on the remaining balance and term. Tax, insurance, HOA, and PMI stay outside interest. Shared master shell, SEO, ads, and embed. Unit tests in `arm-mortgage/calculation.test.ts`. $250,000, 30 years, 5.5%, 5/1, index 4.5 + margin 2 → $1,419.47, then $1,560.75 at the first reset.
- **100 Day Calculator (`/tools/100-day-calculator`):** Live client-side calendar calculator (`componentKey: 'HundredDayCalculator'`). Add or subtract 1–100,000 days, or count signed calendar days between two dates. Inclusive offset treats the start as day 1 (target is N−1 days away). Inclusive span counts both endpoints (same day = 1; exclusive same day = 0). Dates are `YYYY-MM-DD` civil dates added in UTC, so daylight saving time cannot shift the day. Years 1–9999. Shared master shell, SEO, ads, and embed. Unit tests in `hundred-day/calculation.test.ts`. January 1, 2026 + 100 exclusive days = April 11, 2026.
- **12 Volt Wire Size Calculator (`/tools/12-volt-wire-size-calculator`):** Live client-side two-wire DC voltage-drop estimator (`componentKey: 'TwelveVoltWireCalculator'`). Defaults 12 V, 3% (0.36 V), copper, 10 A, 5 m one way, 50°C. Resistivity is IEC 60228 at 20°C with α = 0.00393 /°C (copper) and 0.00403 /°C (aluminium). Area = 2 × ρ(T) × I × L / Vdrop. AWG areas use ASTM B258. Metric sizes are nominal and are not treated as AWG equivalents. Ampacity is not verified, so the page shows the voltage-drop minimum and does not issue a code-compliant recommendation. Switching metres/feet or °C/°F converts the entered number. Shared shell, SEO, ads, and embed. Tests in `twelve-volt-wire/calculation.test.ts` and `electrical/conductor.test.ts`. Default case minimum area is 5.354 mm²; listed sizes 6 mm² and 9 AWG; loop resistance 0.036 Ω; wiring loss 3.6 W.
- **12-Hour Shift Pay Calculator (`/tools/12-hour-shift-pay-calculator`):** Live client-side pay estimate (`componentKey: 'TwelveHourShiftPayCalculator'`). Default 20 per hour, suggested overtime wage 30 (1.5× until the user types a rate), 8 regular hours inside a 12-hour shift, 5 shifts per week, 52 weeks per year, display currency PKR. Regular pay 160, overtime pay 120, shift pay 280, average 23.33. Week, month, and year figures state those schedule assumptions and are not guaranteed earnings. Currency changes the symbol only. Shared shell, SEO, ads, and embed. Tests in `twelve-hour-shift-pay/calculation.test.ts`.
- **0-60 Calculator (`/tools/0-60-calculator`):** Live client-side acceleration estimate (`componentKey: 'ZeroToSixtyCalculator'`). Defaults 300 hp, 3,500 lb, RWD, automatic, standard tires, dry, 0% grade, normal launch. Fixed-step integration (5 ms, 30 s cap) from rest to 60 mph (26.8224 m/s) and, separately, 100 km/h. Wheel force is the lesser of traction and `P_wheel / v`, with a 0.92 average-power factor because no torque curve is available. Shift delay, drag, rolling resistance, and grade are included. Default result is 5.98 s to 60 mph and 6.25 s to 100 km/h. Not a manufacturer specification. Shared shell, SEO, ads, and embed. Tests in `zero-to-sixty/calculation.test.ts`.
- **Calculator Embed System (`/embed/[slug]`):** Shared iframe surface for allowlisted calculators. **Embedding is enabled by default**; only an explicit admin OFF disables it (`resolveEmbedEnabled`). Public **Embed** button when eligible. CSP allows third-party framing only on `/embed/*`; embed pages are `noindex` with `no-store` cache and no ads. Standards: `brain/EMBED_STANDARDS.md`.
- **Dummy Ad Placeholders (`/tools/[slug]` only):** Reusable `AdSlot` (`tool_top_banner`, `tool_article_middle`, `tool_bottom_banner` on by default; sidebar/article-bottom off). Placeholder mode only — no AdSense. Embeds excluded. Standards: `brain/AD_STANDARDS.md`.
- **Tool Detail Page standards lock (docs):** Authoritative `TOOL_DETAIL_PAGE_STANDARDS.md`, step playbook `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, Cursor `.cursor/rules/tool-detail-page-standards.mdc`, Antigravity `.agents/rules/tool-detail-page-standards.md`, and `AGENTS.md` references — master is Auto Loan (verified 2026-11-13).
- **Calculator module lock (docs, ADR-018):** New calculators use `ARCHITECTURE.md` §7: pure `calculation.ts` / `validation.ts`, `detail.tsx`, lazy `registry/index.ts`, and `registry/details.ts`. Mandatory checklist is in the playbook. Page design, SEO, embed, and ads are unchanged. Existing gaps are listed under Known Issues and were not refactored.
- **Incremental calculator commits (docs, ADR-019):** New calculators are committed in meaningful milestones (small 1–2, medium 2–3, large 3–5) and pushed together to `origin/development`. The Brain record is the last commit of that sequence. ADR-016 and ADR-018 are unchanged. Cursor `.cursor/rules/git-commits.mdc` and Antigravity `.agents/rules/git-commits.md` apply the rule.

### Partially Implemented / UI Preview Only
- **Public Directory (`/tools`, `/categories`, `/categories/[slug]`):** `/tools` lists active tools from `GET /catalog/tools`, 24 per page, with name search and a category filter. `/categories` and `/categories/[slug]` read the live catalog. A category page lists active tools only, grouped by pillar and sub-pillar. Header, footer, and the mobile menu use the same live category list. `/tools/[slug]` returns 404 unless the active tool's `componentKey` is registered. Each registered tool's guide lives in its own `detail.tsx`, and the calculator loads with `import()`. `frontend/src/lib/sample-data.ts` is removed.
- **Other Tool Implementations (`frontend/src/tools/`):** Eight working calculators (`AutoLoanCalculator`, `LoanCalculator`, `RrefCalculator`, `ArmMortgageCalculator`, `HundredDayCalculator`, `TwelveVoltWireCalculator`, `ZeroToSixtyCalculator`, `TwelveHourShiftPayCalculator`) are implemented and registered. Remaining category folders and other catalog tools stay unimplemented.
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
4. **Calculator module gaps (left in place):** `hundred-day` has no `types.ts` (types are in `calculation.ts`). `StickyCalculatorAside`, `TableOfContents`, and `InfoTooltip` still live under `auto-loan/` and are imported by the shared page. `APPROVED_COMPONENT_KEYS` is duplicated in frontend `registry/keys.ts` and backend `tool.key.ts`.

---

## 4. Current Development Focus

- Auto Loan Calculator is the locked master Tool Detail Page. New calculators also follow the module in `ARCHITECTURE.md` §7 and the playbook checklist (ADR-018). Next priorities: formal financial QA on Auto Loan Calculator, `listFeaturedTools` active filter (`BE-02`), and subsequent tools via the playbook (`TOOL-01`).

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
