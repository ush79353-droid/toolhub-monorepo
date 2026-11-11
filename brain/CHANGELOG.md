# Development Changelog (`CHANGELOG.md`)

> **Convention:** Append entries chronologically after verified tasks. Do not rewrite historical entries.

---

### 2026-11-10 — Project Initialization & Independent App Restructure
- **Commits:** `b36a6ee`, `fe6444e`, `684a7e3`, `37c0d96`, `5f378c9`, `488c43f`
- **Summary:** Initialized ToolHub repository and migrated from an npm-workspace monorepo into completely independent `frontend/` (Next.js App Router) and `backend/` (Express + Mongoose) applications; configured root `.gitignore`.
- **Important Files:** `frontend/package.json`, `backend/package.json`, `.gitignore`, `backend/src/app.ts`, `backend/src/server.ts`, `frontend/src/server/api/client.ts`.
- **Verification:** Historical commits prior to Shared Brain setup (not re-run at this commit).

### 2026-11-10 — Public Website & Admin Dashboard UI Foundations
- **Commits:** `896ba49`, `9bfcd76`, `7a7605d`
- **Summary:** Implemented locked teal design system (`#087E8B` primary, `#163C43` dark accent, `#F7F8F6` canvas), 9 public `(website)` pages backed by `sample-data.ts`, and 13 isolated admin dashboard UI pages backed by `admin-mock-data.ts`.
- **Important Files:** `frontend/tailwind.config.ts`, `frontend/src/app/globals.css`, `frontend/src/app/(website)/*`, `frontend/src/app/admin/*`, `frontend/src/components/*`.
- **Verification:** Historical UI milestones (now covered by baseline frontend checks below).

### 2026-11-11 — Admin Authentication, Brand Refactor & PWA Assets
- **Commits:** `0f2407b`, `834082a`, `2122725`, `136359a`, `28efe0c`
- **Summary:** Implemented `AdminUser` & `AdminSession` models, Argon2id hashing, `HttpOnly` cookie session flow, Edge + Server admin route protection, rate limiting, account lockout, and `nodemailer` SMTP password reset; added PWA manifest/icons; refactored brand naming from Mega Tools to Omega Calculators.
- **Important Files:** `backend/src/modules/admins/admin-user.model.ts`, `backend/src/modules/auth/*`, `backend/src/services/email.service.ts`, `backend/src/scripts/create-admin.ts`, `frontend/src/middleware.ts`, `frontend/src/server/auth/*`, `frontend/src/app/manifest.json`.
- **Verification:** Note: `nodemailer` dependency added in `28efe0c` requires local `npm install` in `backend/` before `tsc --noEmit` passes.

### 2026-11-11 — Category Hierarchy, S3 Media Library, Tool Catalog & Public Catalog Endpoints
- **Commits:** `d56372b`, `bf487af`, `bc7c46b`, `fa6436b`, `db76e7a`, `bccdc1f`, `ef4ed1c`
- **Summary:**
  - Added collapsible dark admin nav (`admin-nav.tsx`) and dynamic pagination window (`TablePagination.tsx`).
  - Implemented 3-level `Category` (`category` / `pillar` / `sub_pillar`) CRUD, admin pages, and `seed-categories.ts`.
  - Implemented AWS S3 pre-signed browser upload flow, `MediaAsset` model, and `/admin/media`.
  - Implemented `Tool` catalog CRUD, placement validation, icon picker, `seed-tools.ts` (4,351 catalog entries), and public `/api/v1/catalog/categories` + `/api/v1/catalog/featured` wired to homepage `/`.
- **Important Files:** `backend/src/modules/categories/*`, `backend/src/modules/media/*`, `backend/src/modules/tools/*`, `backend/src/modules/catalog/*`, `backend/src/services/s3.service.ts`, `frontend/src/app/(website)/page.tsx`, `frontend/src/app/admin/(dashboard)/categories/*`, `media/*`, `tools/*`.
- **Verification:** Verified via file inspection and baseline checks (`media.key.ts`, `tool.key.ts`, `tool.copy.ts` self-checks pass; frontend `tsc --noEmit` and `next lint` pass with 0 errors; backend `tsc --noEmit` fails locally until `npm install` installs `nodemailer` and `@aws-sdk/*`).

### 2026-11-11 — Shared Project Brain, Ponytail Antigravity Adaptation & Cross-Agent Rules
- **Summary:** Inspected the entire repository and `.cursor/rules/ponytail.mdc`; preserved `.cursor/rules/ponytail.mdc` untouched; added `.cursor/rules/mega-tools-brain.mdc`, Antigravity rules `.agents/rules/ponytail.md` and `.agents/rules/mega-tools-brain.md`, root `AGENTS.md`, and all 13 topic-specific documents under `brain/`.
- **Important Files Changed:** `AGENTS.md`, `.agents/rules/ponytail.md`, `.agents/rules/mega-tools-brain.md`, `.cursor/rules/mega-tools-brain.mdc`, `brain/*.md`.
- **Verification Performed:**
  - Confirmed `.cursor/rules/ponytail.mdc` unmodified (`git diff` check).
  - Verified Antigravity (`trigger: always_on`) and Cursor (`alwaysApply: true`) rule syntax, no npm workspaces added, no `.env`/`.env.local` modified, and no secrets copied into documentation.
  - Observed `cd frontend && npm run type-check` (0 errors) and `npm run lint` (0 errors, 11 `<img>` warnings); observed `npx tsx` self-checks for `media.key.ts`, `tool.key.ts`, `tool.copy.ts` passing; documented local `backend` `tsc --noEmit` missing-dependency errors accurately in `brain/CURRENT_STATE.md`.
- **Commit Hash:** `cf87b79` (following `1deba07`).

### 2026-11-11 — Contact page redesign
- **Summary:** Rebuilt `/contact` with a compact headline and note sheet, a full-width form, an uneven support row, a three-step delivery note, and a quiet directory link. The form still only validates in the browser. A passed check says the message was not sent. Subject is a select: general inquiry, feature request, bug report, partnership, or other. Header and footer were not changed.
- **Important Files:** `frontend/src/app/(website)/contact/page.tsx`, `frontend/src/components/contact/ContactFormClient.tsx`.
- **Verification:** Desktop review of `http://localhost:3000/contact` covered empty-field errors, an invalid email, the disabled Checking state, and the not-sent result. Phone width (390) and tablet width (768) showed stacked content with no horizontal overflow. `cd frontend && npm run type-check` passed.

### 2026-11-11 — About page art direction
- **Summary:** Rebuilt `/about` as separate compositions: a product board in the hero, an editorial index for the story, a mixed platform layout (dark calculator panel, conversion line, code sample, ruled list), a numbered principles list, a typography-led value statement, and a full-width dark close. Live category and tool totals still come from `/catalog/categories`. Header and footer were not changed.
- **Important Files:** `frontend/src/app/(website)/about/page.tsx`.
- **Verification:** Desktop review of `http://localhost:3000/about` showed the hero board, platform panels, and numbered principles. Phone-width emulation was not available in this session.

### 2026-11-11 — Public About page redesign
- **Summary:** Replaced the About page layout and copy. Sections are hero, story, mission, offerings, principles, practical reasons to use the directory, and a closing pair of links. Category and tool totals are loaded from `GET /api/v1/catalog/categories` and omitted when the API is unavailable. No testimonials or invented history. Header and footer were not changed.
- **Important Files:** `frontend/src/app/(website)/about/page.tsx`, `brain/FRONTEND.md`, `brain/CURRENT_STATE.md`, `brain/TASKS.md`.
- **Verification:** Desktop review of `http://localhost:3000/about` showed the hero, live totals (19 categories, 4,351 tools), mission, principles, and footer. Phone-width emulation was blocked in this session, so the mobile layout was checked from the responsive classes only. `cd frontend && npm run type-check` passed (`tsc --noEmit`, 0 errors).

### 2026-11-11 — Implement Auto Loan Calculator & Allowlisted Tool Registry Wiring
- **Summary:** Added `executionType` and allowlisted `componentKey` to `Tool` schema/admin form/CLI assignment (`tool:assign`), added public `GET /api/v1/catalog/tools/:slug`, wired `/tools/[slug]` and `ToolWorkspace` to resolve allowlisted components while preserving MongoDB SEO metadata and sample fallback, and built the full client-side Auto Loan Calculator (`AutoLoanCalculator`) with integer-cent amortization, monthly/yearly views, SVG Principal vs. Interest chart, CSV export, informational guide/FAQs, and 14 unit test suites. Assigned `componentKey: 'AutoLoanCalculator'` to existing MongoDB record `auto-loan-calculator` (`6af46f0fa27d8d1d4e98ff4d`).
- **Important Files Changed:** `backend/src/modules/tools/*`, `backend/src/validation/admin-tool.schema.ts`, `backend/src/modules/catalog/*`, `backend/src/scripts/assign-tool-component.ts`, `backend/package.json`, `frontend/src/types/tool.ts`, `frontend/src/tools/registry/*`, `frontend/src/tools/calculators/auto-loan/*`, `frontend/src/server/catalog/tools.ts`, `frontend/src/server/tools/actions.ts`, `frontend/src/components/admin/forms/ToolForm.tsx`, `frontend/src/components/shared/ToolWorkspace.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `brain/*`.
- **Verification Performed:**
  - `cd backend && npm run type-check`, `npm run build`, and `npx tsx` self-checks (`tool.key.ts`, `media.key.ts`, `tool.copy.ts`) passed.
  - `cd frontend && npm run type-check` and `npm run lint` passed (0 errors, 11 pre-existing `<img>` warnings); `npm run build` compiled cleanly before failing at `Collecting page data` (`no direct app page entry found for /_not-found`) due to shared `.next/` contention with the concurrent `next dev` server.
  - `.\backend\node_modules\.bin\tsx.cmd .\frontend\src\tools\calculators\auto-loan\calculation.test.ts` passed (14 test suites).
  - Verified live HTTP 200 on `/api/v1/catalog/tools/auto-loan-calculator`, `/`, `/tools/auto-loan-calculator`, `/tools/age-calculator`, and `/about`, plus HTTP 404 on unknown slugs.
- **Commit Hash:** `062c763` (`feat(tools): implement auto loan calculator`).

### 2026-11-11 — Refine Auto Loan Calculator UI/UX, Two-Column Layout, TOC & Guide Content
- **Summary:** Refined the Auto Loan Calculator experience using a reference-inspired two-column responsive layout (`~60-65%` Left: Breadcrumbs, Category/Group/Client badges, Title, Intro, accessible 11-item `TableOfContents`, MongoDB-backed `RelatedCatalogTools` distinguishing `Preview Only` links vs non-link `Catalog Only` entries without broken 404 links, and 11 educational sections including formula, 36–72 month comparison, worked example, comparison tips, and FAQs; `~35-40%` Right on desktop and top-of-page below compact header on tablet/mobile: compact form with inline units & `InfoTooltip` popovers, Monthly Payment & Cost metrics, Donut Breakdown chart, inline/full-modal Amortization Schedule & CSV download). Extended `GET /api/v1/catalog/tools/:slug` with `relatedTools` from existing MongoDB sibling records and prevented 404 category breadcrumb links when a DB category slug lacks a `/categories/[slug]` route.
- **Important Files Changed:** `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/server/catalog/tools.ts`, `frontend/src/components/shared/RelatedCatalogTools.tsx`, `frontend/src/app/globals.css`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/auto-loan/{InfoTooltip,TableOfContents,AutoLoanGuideArticle,AutoLoanCalculator,AutoLoanForm,AutoLoanResults,AutoLoanChart,AmortizationTable,content,calculation.test}.ts*`, `brain/*`.
- **Verification Performed:**
  - `cd backend && npm run type-check && npm run build` passed (`0` errors); `GET /api/v1/catalog/tools/auto-loan-calculator` returned 6 real MongoDB `relatedTools`.
  - `cd frontend && npm run type-check` (`0` errors), `npm run lint` (`0` errors, 11 pre-existing `<img>` warnings), and `calculation.test.ts` (15 test suites passed).
  - Isolated production `next build` passed (`46/46` pages, exit `0`).
  - Headless Chromium CDP verification across `1440px` desktop (`60.2%`/`37.2%`, non-sticky right panel), `768px` tablet, and `375px` mobile (calculator directly below header, zero horizontal overflow) verified live Worked Example outputs, validation, Reset, tooltip, inline/modal schedule + `Escape`, FAQ toggle, TOC anchors + `scroll-margin-top`, zero 404 `<main>` links, and zero runtime exceptions.
- **Commit Hash:** Recorded on `feat(tools): refine auto loan calculator page and content`.

### 2026-11-11 — Final Auto Loan Calculator UI/UX Polish & Height-Aware Sticky Sidebar
- **Summary:** Performed a comprehensive UI/UX polish across the Auto Loan Calculator page and shared website chrome without altering calculation formulas or validation rules. Added `StickyCalculatorAside` (height-aware desktop `position: sticky` with bottom-pinned negative offset when taller than the viewport, automatic resize/content adjustment via `ResizeObserver`, dynamic keyboard-focus offset/blur restoration so focused controls clear the `64px` header without losing article scroll context, clean footer stop, and static flow below `1024px`). Balanced typography weights (`font-semibold` headings, `font-medium` labels, `font-normal` `16px`/`1.75` article body), standardized calculator inputs/selects/buttons to `h-11` (`44px` wrapper / `42px` inner input) with `autoComplete="off"`, aligned paired rows (`Auto Price | Down Payment`, `Loan Term | Interest Rate`, `Trade-in Value | Amount Owed`), fixed currency selector double-parentheses display (`USD ($)`), collapsed optional Sales Tax/Fees & Chart/Breakdown drawers by default so Monthly Payment results sit above the desktop fold, unified the 11 editorial guide sections into one bordered white card with subtle dividers, polished `RelatedCatalogTools` / `FAQAccordion` / `Footer` heading hierarchy, and prevented `768px` tablet `Header` overflow. Reconciled `brain/CURRENT_STATE.md` with `/contact` commit `ece3bce` while preserving prior local edits. **Financial calculation accuracy testing remains a separate pending next step.**
- **Important Files Changed:** `frontend/src/tools/calculators/auto-loan/{StickyCalculatorAside,AutoLoanCalculator,AutoLoanForm,AutoLoanResults,AutoLoanChart,AmortizationTable,TableOfContents,AutoLoanGuideArticle}.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/components/layout/{Header,Footer}.tsx`, `frontend/src/components/shared/{FAQAccordion,RelatedCatalogTools}.tsx`, `brain/{CURRENT_STATE,FRONTEND,DESIGN_SYSTEM,TASKS,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd frontend && npm run type-check` (`0` errors) and `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings).
  - `.\backend\node_modules\.bin\tsx.cmd .\frontend\src\tools\calculators\auto-loan\calculation.test.ts` (`15` test suites passed).
  - Isolated production `npx next build` (`46/46` routes compiled cleanly) + headless Chromium CDP verification on `next start` (`1440x900`, `1280x800`, `1024x768`, `768x1024`, `375x812`, `320x640`): verified `0` horizontal/header overflow across all 6 viewports, `0px` paired input alignment drift, `1.75` body line-height ratio, above-fold Monthly Payment, sticky mid-scroll & footer clearance, keyboard-focus header clearance (`clearedHeader: true`), interactive drawers/Amortization Full View dialog, and `0` console/runtime errors.
- **Commit Hash:** Recorded on `d941890` (`style(tools): polish auto loan calculator UI and sticky layout`).

### 2026-11-11 — Remove Extra Auto Loan Badges & Fix Amortization Modal Portal Layering
- **Summary:** Addressed visual feedback on `/tools/auto-loan-calculator`: removed the three redundant pill badges above the Auto Loan Hero heading (breadcrumbs already show category context) and replaced pill status badges on `RelatedCatalogTools` cards with calm footer labels (`Open`, `Preview only`, `Catalog only`); moved the `AmortizationTable` Full View modal into `ReactDOM.createPortal(..., document.body)` at `z-[80]` with body scroll lock cleanup and added a portal focus-containment guard (`element.contains(target)`) + timer cleanup in `StickyCalculatorAside` so open `FAQAccordion` `rotate-180` chevrons never render above the modal overlay.
- **Important Files Changed:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/components/shared/RelatedCatalogTools.tsx`, `frontend/src/tools/calculators/auto-loan/{AmortizationTable,StickyCalculatorAside}.tsx`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd frontend && npm run type-check` (`0` errors), `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings), and `calculation.test.ts` (`15` test suites passed).
  - Isolated production `npx next build` (`46/46` routes) + headless Chromium CDP across all 6 viewports (`1440x900`, `1280x800`, `1024x768`, `768x1024`, `375x812`, `320x640`): confirmed `heroBadgeTexts: []`, `relatedBadgeTexts: []`, `dialogInBody: true`, `modalNotOccludedByFaq: true` (`elementFromPoint` on rotated FAQ #6 chevron returns `TD` inside dialog), `clearedHeader: true`, `0` overflow across all viewports, and `0` console/runtime errors. Visual inspection of `desktop-1440-top.png` and `modal-fixed.png` confirmed clean badge-free layout and unobstructed dialog.
- **Commit Hash:** Recorded on `fix(tools): remove extra badges and portal amortization modal`.

