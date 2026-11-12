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
- **Commit Hash:** Recorded on `cfbe897` (`fix(tools): remove extra badges and portal amortization modal`).

### 2026-11-11 — Align Auto Loan Hero & Calculator Cards on Same Top Line
- **Summary:** Moved `Breadcrumbs` above the responsive two-column grid in `frontend/src/app/(website)/tools/[slug]/page.tsx` so the left Hero card (`Auto Loan Calculator`) and right sticky Calculator card (`Calculator`) start on the exact same horizontal top line (`heroTop === calcTop === 133px`, `0px` diff) on desktop viewports while preserving mobile/tablet top-to-bottom stacking.
- **Important Files Changed:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `brain/{CURRENT_STATE,TASKS,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd frontend && npm run type-check` (`0` errors), `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings), and `calculation.test.ts` (`15` test suites passed).
  - Isolated production `npx next build` + headless Chromium CDP across all 6 viewports (`1440x900`, `1280x800`, `1024x768`, `768x1024`, `375x812`, `320x640`): verified `heroVsCalcCardTop.diff === 0` (`133px`/`133px`), `aboveFold900: true`, `clearedHeader: true`, `modalNotOccludedByFaq: true`, `0` overflow across all viewports, and visual confirmation in `desktop-1440-top.png`.
- **Commit Hash:** Recorded on `2b4ac12` (`style(tools): align auto loan hero and calculator cards`).

### 2026-11-12 — Implement Second Working Calculator: Loan Calculator (`LoanCalculator`)
- **Summary:** Implemented the complete client-side Loan Calculator (`LoanCalculator`) under `frontend/src/tools/calculators/loan/`, preserving all design/typography/sticky/accessibility conventions finalized on Auto Loan Calculator. Approved `LoanCalculator` in `backend/src/modules/tools/tool.key.ts` and `frontend/src/tools/registry/{keys,index}.ts`, generalized the two-column template in `frontend/src/app/(website)/tools/[slug]/page.tsx` via `TWO_COLUMN_TOOL_CONFIGS` without modifying Auto Loan calculations/UI, and bound the existing MongoDB `loan-calculator` record (`6af46f0fa27d8d1d4e98ff4c`) via `npm run tool:assign` while keeping existing metadata and SEO fields intact. Supports Amortized & Interest-Only loan modes (I/O period, post-I/O amortization or full-term principal due), Monthly (`12/yr`), Biweekly (`26/yr`), and Weekly (`52/yr`) schedules with nominal APR conversion, recurring (`every-payment`, calendar `monthly`, calendar `yearly`) and one-time extra payments capped cleanly against remaining balance with interest savings tracking, upfront vs. financed origination fees, integer-cent reconciliation, Principal/Interest donut + Remaining Balance Over Time SVGs, portaled `z-[80]` Period/Yearly amortization schedule + CSV export, 12 educational sections + worked example + FAQs, and 14 independent financial unit test suites.
- **Important Files Changed:** `backend/src/modules/tools/tool.key.ts`, `frontend/src/tools/registry/{keys,index}.ts`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/loan/{types,validation,calculation,calculation.test,content}.ts*`, `frontend/src/tools/calculators/loan/{LoanCalculator,LoanForm,LoanResults,LoanChart,LoanAmortizationTable,LoanGuideArticle}.tsx`, `brain/{CURRENT_STATE,FRONTEND,BACKEND,TASKS,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd backend && npm run tool:assign -- --slug loan-calculator --component LoanCalculator --execution client --activate`, `npm run type-check` (`0` errors), `npm run build`, and `npx tsx src/modules/tools/tool.key.ts` (`tool.key ok`).
  - `cd frontend && npm run type-check` (`0` errors) and `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings).
  - `.\backend\node_modules\.bin\tsx.cmd .\frontend\src\tools\calculators\loan\calculation.test.ts` (`14` suites passed) and `auto-loan/calculation.test.ts` (`15` suites passed).
  - Isolated production `npx next build` (`46/46` routes) + headless Chromium CDP across all 6 viewports (`1440x900`, `1280x800`, `1024x768`, `768x1024`, `375x812`, `320x640`): verified `/` featured link, `/tools/loan-calculator` & `/tools/auto-loan-calculator` bidirectional live `Open` links, `0px` top-line card alignment (`133px`/`133px`), sticky sidebar & keyboard focus header clearance, Biweekly/Weekly/Extra/Interest-Only modes, dual SVG charts, portaled `z-[80]` modal (`modalNotOccludedByFaq: true`), `0` horizontal/header overflow across all viewports, and `0` console/runtime errors, plus visual inspection of desktop/modal/tablet/mobile screenshots.
- **Commit Hash:** Recorded on `600e382` (`feat(tools): implement loan calculator using shared tool design`).

### 2026-11-12 — Fix Native Date Input Picker Alignment in Calculator Forms
- **Summary:** Fixed `Loan Start Date` (`<input type="date">`) icon alignment where `display: flex` on the shared `Input` primitive caused Chromium to collapse the calendar picker icon into the left third of the box. Switched native `date` / `datetime-local` / `time` inputs in `frontend/src/components/ui/input.tsx` to `block` with consistent calendar icon styling, and added `autoComplete="off"` to `AutoLoanForm.tsx` start-date input. Both `/tools/auto-loan-calculator` and `/tools/loan-calculator` share the fix.
- **Important Files Changed:** `frontend/src/components/ui/input.tsx`, `frontend/src/tools/calculators/auto-loan/AutoLoanForm.tsx`, `brain/{CURRENT_STATE,FRONTEND,CHANGELOG}.md`.
- **Verification Performed:**
  - `cd frontend && npm run type-check` (`0` errors), `npm run lint` (`0` errors, 11 pre-existing `@next/next/no-img-element` warnings), and `loan/calculation.test.ts` (`14` suites) + `auto-loan/calculation.test.ts` (`15` suites) passed.
  - Isolated production `npx next build` (`46/46` routes) + headless Chromium CDP screenshot (`auto-loan-date-fixed.png`) verified full-width `44px` (`380x44`) date input with right-aligned calendar icon and `Loan Calculator` live `Open` related card link.
- **Commit Hash:** Recorded on `style(ui): align date input picker indicator in shared Input`.

### 2026-11-12 — Publish a slice of browser tools
- **Summary:** Added `npm run tools:publish`. It turns on 15 browser tools in each category (all of them when a category has fewer) and marks 20 active browser tools as featured. Server and third-party tools are left alone. `tools:seed` still resets those flags.
- **Important Files:** `backend/src/scripts/publish-browser-tools.ts`, `backend/package.json`.
- **Verification:** `npx tsc --noEmit` passed. The script ran against `omega_calculators`: 273 tools activated, 17 categories at 15 active, Design & Graphics at 8, Developer & Misc Utilities at 12, and 20 featured including Auto Loan Calculator and Loan Calculator.

### 2026-11-12 — Local media storage driver
- **Summary:** Media uploads follow `STORAGE_DRIVER`. The default `local` writes `backend/uploads` and publishes them at `/uploads` through a Next.js rewrite. The browser sends those bytes to `/api/media-upload`, which forwards them to Express. `s3` still signs a direct browser PUT. Deleting a file uses its saved URL, so turning the driver to `s3` later sends new files to the bucket and leaves files already on disk where they are.
- **Important Files:** `backend/src/services/storage.ts`, `backend/src/services/local-storage.ts`, `backend/src/services/s3.service.ts`, `backend/src/config/env.ts`, `frontend/src/app/api/media-upload/route.ts`, `frontend/next.config.ts`.
- **Verification:** `npx tsx src/modules/media/media.key.ts` and `npx tsx src/services/local-storage.ts` passed. `npx tsc --noEmit` passed in `backend/` and `frontend/`. A probe file was served as HTTP 200 from `http://localhost:5001/uploads/...` and from `http://localhost:3000/uploads/...`. `PUT /api/v1/admin/media/object` without a session returned 401. The probe file was removed.

### 2026-11-12 — Shared server category list in the site chrome
- **Summary:** Header, footer, the mobile menu, the homepage, and the About totals all read `getPublicCategories()`. `React.cache()` keeps that Express call to one per request. The menu itself stays a client component, but it only receives the list. Category index and category detail pages still use sample data.
- **Important Files:** `frontend/src/server/catalog/categories.ts`, `frontend/src/components/layout/Header.tsx`, `Footer.tsx`, `MobileNavigation.tsx`.
- **Verification:** `npx tsc --noEmit` in `frontend/` passed.

### 2026-11-12 — Category icons on local storage
- **Summary:** Root categories gained `iconUrl` and `iconMedia`. `npm run categories:icons` downloads one Lucide SVG per category name, stores it with the local driver, and writes the `/uploads` URL onto the category. `GET /catalog/categories` returns `iconUrl`. Header, footer, mobile menu, and the homepage show that image.
- **Important Files:** `backend/src/modules/categories/category.model.ts`, `backend/src/scripts/attach-category-icons.ts`, `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/components/layout/Header.tsx`, `Footer.tsx`, `MobileNavigation.tsx`, `frontend/src/app/(website)/page.tsx`.
- **Verification:** Backend and frontend `npx tsc --noEmit` passed. The script attached 19 icons. `GET /catalog/categories` returned `/uploads/media/68ba4737-06c6-42a6-8087-e1d196515f8d.svg` for Finance & Business, and `http://localhost:3000` served that file as HTTP 200 `image/svg+xml`.

### 2026-11-12 — Live category index
- **Summary:** `/categories` loads root categories from `GET /catalog/categories` on the server. The page still filters that list in the browser. Cards use each category's `iconUrl` and tool count. Category detail pages still use sample data.
- **Important Files:** `frontend/src/app/(website)/categories/page.tsx`, `frontend/src/components/categories/CategoriesClient.tsx`, `frontend/src/components/shared/CategoryCard.tsx`.
- **Verification:** Frontend `npx tsc --noEmit` passed. `/categories` rendered the 19 live names, including Finance & Business, and the filter kept Physics only.

### 2026-11-12 — Category descriptions
- **Summary:** `npm run categories:descriptions` writes a short public description on each root category that still has an empty description. The admin create and edit forms already save `description`; the field is labeled Public description, and the admin tree shows the saved text. The public category cards render that description.
- **Important Files:** `backend/src/scripts/set-category-descriptions.ts`, `frontend/src/components/admin/forms/CategoryForm.tsx`, `frontend/src/components/shared/CategoryCard.tsx`, `frontend/src/app/admin/(dashboard)/categories/page.tsx`.
- **Verification:** The script updated 19 descriptions. `GET /catalog/categories` returned the Finance & Business sentence, and `/categories` showed it on the card.

### 2026-11-12 — Live category detail grouped by pillar
- **Summary:** `GET /catalog/categories/:slug` returns one active root category with its tools grouped under pillars and sub-pillars. Tools with no active pillar land in `ungrouped`. `/categories/[slug]` renders that tree. Active tools link to `/tools/[slug]`. Inactive catalog rows stay on the page and are not linked.
- **Important Files:** `backend/src/modules/catalog/catalog.service.ts`, `backend/src/modules/catalog/catalog.router.ts`, `frontend/src/server/catalog/categories.ts`, `frontend/src/app/(website)/categories/[slug]/page.tsx`.
- **Verification:** Backend and frontend `npx tsc --noEmit` passed. `GET /catalog/categories/finance-business` returned 644 tools, 33 pillars, and 385 ungrouped. A missing slug returned 404. `/categories/finance-business` rendered Loan Calculator, its Home Loan Calculator and Student Loan Calculator sub-pillars, and the Other tools section.

### 2026-11-12 — Category pages list active tools only
- **Summary:** `GET /catalog/categories/:slug` now returns tools with `isActive: true`. Pillars and sub-pillars that have no active tool are omitted. The category page links every listed tool.
- **Important Files:** `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/app/(website)/categories/[slug]/page.tsx`.
- **Verification:** `GET /catalog/categories/finance-business` returned 15 tools, and `/categories/finance-business` showed 15 Open links with no Catalog rows.



### 2026-11-12 — Dynamic tool SEO management + calculator standards lock
- **Summary:** Expanded optional Tool SEO fields (robots/social/schema/sitemap prefs), redesigned Admin Tool SEO UI with previews + media pickers, fixed public `generateMetadata`/canonical/`metadataBase`/JSON-LD via shared `lib/seo/tool-seo.ts`, and revalidate public tool paths on admin save. Locked `CALCULATOR_STANDARDS.md` + `SEO_STANDARDS.md` with matching Cursor/Antigravity rules. Also includes Loan page UI polish (unified intro card, sticky internal scroll, copy/CSV reliability, heading/icon cleanup).
- **Important Files:** `backend/src/modules/tools/{tool.model,tool.service}.ts`, `backend/src/validation/admin-tool.schema.ts`, `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/lib/seo/*`, `frontend/src/components/admin/forms/{ToolForm,ToolSeoSection}.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/config/site.ts`, `brain/{SEO_STANDARDS,CALCULATOR_STANDARDS,README,CHANGELOG,CURRENT_STATE,TASKS,DECISIONS}.md`, `.cursor/rules/calculator-standards.mdc`, `.agents/rules/calculator-standards.md`.
- **Verification:** Backend `tsc --noEmit` passed; frontend `tsc --noEmit` passed; `tool-seo.test.ts` ok; currency/loan/auto-loan unit tests passed.

### 2026-11-12 — Sticky calculator internal scroll + themed table scrollbar
- **Summary:** `StickyCalculatorAside` now caps to the viewport under the site header and scrolls internally (`overflow-y-auto` + `overscroll-contain`, scrollbar visually hidden) when amortization/results expand. Amortization schedule overflow uses a Deep Teal `brand-scroll` scrollbar. Two-column tool pages merge hero + TOC + Related into one left card.
- **Important Files:** `frontend/src/tools/calculators/auto-loan/StickyCalculatorAside.tsx`, `frontend/src/tools/calculators/auto-loan/AmortizationTable.tsx`, `frontend/src/tools/calculators/loan/LoanAmortizationTable.tsx`, `frontend/src/app/globals.css`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/auto-loan/TableOfContents.tsx`, `frontend/src/components/shared/RelatedCatalogTools.tsx`.

### 2026-11-12 — Shared 49-currency support + public canvas polish
- **Summary:** Added reusable `frontend/src/tools/shared/currency.ts` (`49` ISO display currencies, `Intl` fraction digits, denomination-only formatting) plus searchable accessible `CurrencySelect`. Wired into Auto Loan and Loan calculators without changing financial formulas or adding FX conversion. Public `(website)` canvas set to white; calculator panels use soft elevation shadow.
- **Important Files:** `frontend/src/tools/shared/{currency.ts,currency.test.ts,CurrencySelect.tsx}`, `frontend/src/tools/calculators/auto-loan/{types,calculation,AutoLoanCalculator,AutoLoanForm,content}.*`, `frontend/src/tools/calculators/loan/{types,LoanCalculator,LoanForm,content}.*`, `frontend/src/app/(website)/layout.tsx`, `brain/{CURRENT_STATE,FRONTEND,TASKS,DESIGN_SYSTEM,CHANGELOG}.md`.
- **Verification:** Frontend `tsc --noEmit` passed; `currency.test.ts` ok (`49` currencies); Loan `calculation.test.ts` 14/14; Auto Loan `calculation.test.ts` 15/15; `next lint` 0 errors (pre-existing `@next/next/no-img-element` warnings only).

### 2026-11-12 — Loan Calculator page list/icon polish
- **Summary:** On `/tools/loan-calculator`, removed the hero tool icon beside the title; simplified shared `TableOfContents` to a plain heading with `list-disc` bullets (no header icon / fancy `01` indexes); replaced Loan guide-article `CheckCircle` markers and circled ordered-step badges with plain bullets; flattened `RelatedCatalogTools` from nested cards into a plain two-column bullet link list.
- **Important Files:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/auto-loan/TableOfContents.tsx`, `frontend/src/tools/calculators/loan/LoanGuideArticle.tsx`, `frontend/src/components/shared/RelatedCatalogTools.tsx`.
- **Verification:** Frontend `npm run type-check` and `npm run lint` passed (0 errors; pre-existing `@next/next/no-img-element` warnings only).

### 2026-11-12 — Category menu presentation
- **Summary:** The header category menu is a two-column subject panel with no tool counts. The footer and mobile menu show the first seven categories, plus a link to the full index.

### 2026-11-12 — Reusable calculator embed system
- **Summary:** Added `/embed/[slug]` minimal layout reusing registry calculators; Tool `embedEnabled` (default false) + height/layout/domains fields through admin Embedding & Sharing; public Embed dialog when eligible; CSP `frame-ancestors` split; optional `/embed.js` auto-resize; locked `EMBED_STANDARDS.md`.
- **Important Files:** `backend/src/modules/tools/{tool.model,tool.service}.ts`, `backend/src/validation/admin-tool.schema.ts`, `backend/src/modules/catalog/catalog.service.ts`, `frontend/src/app/embed/**`, `frontend/src/lib/embed/*`, `frontend/src/components/{admin/forms/ToolEmbedSection,tools/CalculatorEmbedDialog,embed/EmbedResizeReporter}.tsx`, `frontend/public/embed.js`, `frontend/next.config.ts`, `brain/EMBED_STANDARDS.md`.
- **Verification:** Backend `tsc --noEmit` passed; frontend `tsc --noEmit` passed; `tool-embed.test.ts` ok; `tool-seo.test.ts` ok; Loan 14/14 + Auto Loan 15/15 calculation tests passed; `next lint` 0 errors (pre-existing img warnings); `next build` passed including `/embed/[slug]`.

### 2026-11-12 — Tool detail page production audit & standards lock
- **Summary:** Added `robots.ts`/`sitemap.ts` (implemented tools only); FAQ JSON-LD synced to visible guide FAQs; related tools link only implemented calculators; pillar related query requires `isActive`; Embed dialog portal/focus-trap/scroll-lock; Embed control moved into calculator header for card alignment; locked `TOOL_DETAIL_PAGE_STANDARDS.md`.
- **Important Files:** `frontend/src/app/{robots,sitemap}.ts`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `RelatedCatalogTools.tsx`, `CalculatorEmbedDialog.tsx`, `backend/src/modules/catalog/catalog.service.ts`, `brain/TOOL_DETAIL_PAGE_STANDARDS.md`.
- **Verification:** Frontend/backend `tsc` pass; `tool-seo`/`tool-embed`/Loan 14/Auto Loan 15 tests pass; `next lint` 0 errors (pre-existing img warnings); `next build` pass with `/robots.txt` + `/sitemap.xml` routes.

### 2026-11-12 — Embed default-ON policy + restore Embed button
- **Summary:** Root cause of missing Embed button was `embedEnabled` defaulting to false and eligibility requiring strict `=== true`. Policy locked to enabled-by-default (`resolveEmbedEnabled`: only explicit `false` disables). Schema/API/admin/UI updated; `npm run tools:embed-defaults` corrects implemented tools that inherited the old false write.
- **Important Files:** `frontend/src/lib/embed/tool-embed.ts`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `backend/src/modules/tools/tool.model.ts`, `backend/src/modules/{tools,catalog}/*.ts`, `backend/src/scripts/enable-default-embeds.ts`, `brain/EMBED_STANDARDS.md`.
- **Verification:** Frontend `tsc` + `tool-embed.test.ts` ok; `next lint` 0 errors; backend `tsc` ok. `tools:embed-defaults` could not reach Mongo in this environment (timed out); operators should run it once when DB is available if any implemented tools still have `embedEnabled: false` stored.

### 2026-11-12 — Dummy ad placeholders on tool detail pages
- **Summary:** Added reusable `AdSlot` + typed placements for `/tools/[slug]` (top banner, in-article, bottom banner; sidebar off). Placeholder-only design; no AdSense/scripts; embeds excluded; locked `AD_STANDARDS.md`.
- **Important Files:** `frontend/src/components/ads/AdSlot.tsx`, `frontend/src/lib/ads/*`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `brain/AD_STANDARDS.md`, `.cursor/rules/ad-standards.mdc`, `.agents/rules/ad-standards.md`.
- **Verification:** Frontend `tsc --noEmit` passed; Loan 14/14 + Auto Loan 15/15 passed; `next lint` 0 errors (pre-existing img warnings); `next build` passed; `/embed/[slug]` remains without AdSlot imports.

