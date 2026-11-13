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

### 2026-11-12 — Paginated public tools directory
- **Summary:** `/tools` reads `GET /catalog/tools`. The list is active tools only, 24 per page, with a name search and category filter kept in the URL. Category pills count active tools.
- **Important Files:** `backend/src/modules/catalog/catalog.service.ts`, `backend/src/modules/catalog/catalog.router.ts`, `frontend/src/server/catalog/tools.ts`, `frontend/src/app/(website)/tools/page.tsx`.
- **Verification:** `/tools` compiled and listed 275 active tools, 24 per page. Page 2 showed tools 25-48. `?q=loan&category=finance-business` returned Auto Loan Calculator and Loan Calculator.



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

### 2026-11-12 — Lock master Tool Detail Page standards & new-tool playbook
- **Summary:** Extracted and locked Loan Calculator (`/tools/loan-calculator`) as the official master Tool Detail Page. Expanded `TOOL_DETAIL_PAGE_STANDARDS.md` with code- and visually-verified layout/typography/sticky/SEO/ads/embed rules; added `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`; wired Cursor + Antigravity always-on rules and `AGENTS.md`; updated Brain index/state/frontend/design/decisions/tasks. No calculator UI or formula source changes.
- **Important Files:** `brain/TOOL_DETAIL_PAGE_STANDARDS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `.cursor/rules/tool-detail-page-standards.mdc`, `.agents/rules/tool-detail-page-standards.md`, `AGENTS.md`, `brain/{README,CURRENT_STATE,FRONTEND,DESIGN_SYSTEM,CALCULATOR_STANDARDS,DECISIONS,TASKS,CHANGELOG}.md`, `.cursor/rules/calculator-standards.mdc`, `.agents/rules/calculator-standards.md`.
- **Verification:** Live browser inspect of `http://192.168.100.152:3000/tools/loan-calculator` (header, breadcrumbs, ads, Embed in calculator header, H1, TOC, related Open/Coming soon, guide, FAQ, footer); cross-checked Tailwind/constants in `page.tsx`, `StickyCalculatorAside`, `LoanCalculator`/`LoanForm`, `AdSlot`, Container. Docs-only diff — no frontend calculator source modified. Dry-run: Percentage Calculator would follow playbook steps 1–19 without a new design brief.

### 2026-11-12 — Align Auto Loan Calculator with master Tool Detail Page standards
- **Summary:** Brought Auto Loan Calculator into compliance with the locked Loan Calculator master shell without changing financial formulas. Removed two-column intro tool icon; converted guide CheckCircle/numbered steps to plain `list-disc`; matched form spacing/`h-11`/Calculate–Reset classes; replaced trade-in equity pill badges with muted helper text; removed results top border wrapper; metric “Total Estimated Cost” uses `text-accent` like other cards.
- **Important Files:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/calculators/auto-loan/{AutoLoanCalculator,AutoLoanForm,AutoLoanGuideArticle,AutoLoanResults}.tsx`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** Live `/tools/auto-loan-calculator` + `/embed/auto-loan-calculator` (Embed visible; ads on public page only; embed `noindex`; calculator functional). Desktop 1440 no horizontal overflow; mobile 375 screenshot. `npx tsc --noEmit` passed; `next lint` 0 errors (pre-existing img warnings); Auto Loan 15/15 + Loan 14/14 calculation tests passed; `next build` passed.

### 2026-11-13 — Swap two-column tool detail columns (calculator left)
- **Summary:** Flipped the shared two-column `/tools/[slug]` shell to calculator/guide left (~66%) and Calculators.com-style `ToolDetailSidebar` right (~34%: More tools list, other-topic links, dark country-rules pills). Full-width intro above the grid. Right sidebar is desktop-sticky under the header; left column scrolls with the page.
- **Important Files:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/components/shared/ToolDetailSidebar.tsx`, `frontend/src/tools/calculators/auto-loan/StickyCalculatorAside.tsx`, `brain/{TOOL_DETAIL_PAGE_STANDARDS,CALCULATOR_STANDARDS,CURRENT_STATE,DECISIONS,CHANGELOG}.md`.
- **Verification:** Frontend `npx tsc --noEmit` passed; ReadLints clean on touched TSX.

### 2026-11-13 — Promote Auto Loan as final master Tool Detail Page
- **Summary:** Declared latest Auto Loan Calculator the official master visual/architectural reference (ADR-016 supersedes ADR-014). Aligned remaining Loan Calculator form/amortization micro-styles (`tabular-nums`, `gap-3.5`, empty schedule placeholder). Updated Brain standards, playbook, Cursor/Antigravity rules, and `AGENTS.md`. Shared shell (sidebar, ads, SEO, embed) unchanged; no formula changes; Auto Loan visual design left intact.
- **Important Files:** `frontend/src/tools/calculators/loan/{LoanForm,LoanAmortizationTable}.tsx`, `frontend/src/components/shared/ToolDetailSidebar.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `brain/{TOOL_DETAIL_PAGE_STANDARDS,NEW_TOOL_DEVELOPMENT_PLAYBOOK,CALCULATOR_STANDARDS,DESIGN_SYSTEM,FRONTEND,CURRENT_STATE,DECISIONS,TASKS,CHANGELOG,README}.md`, `AGENTS.md`, `.cursor/rules/{tool-detail-page-standards.mdc,calculator-standards.mdc}`, `.agents/rules/{tool-detail-page-standards.md,calculator-standards.md}`.
- **Verification:** Live browser inspect Auto Loan + Loan at 1440px; `/embed/loan-calculator` functional (no ads). Loan 14/14 + Auto Loan 15/15 calculation suites passed; `npx tsc --noEmit` passed; `npm run lint` 0 errors (pre-existing img warnings); `npx next build` passed.

### 2026-11-13 — Add RREF Calculator with step-by-step elimination
- **Summary:** Shipped first matrix calculator under the Auto Loan master shell. Canonical catalog slug `reduced-row-echelon-form-calculator` (`RrefCalculator`): exact rational Gauss–Jordan RREF, step-by-step ops, rank/pivots/free columns/nullity, optional augmented analysis, 1×1–6×8 editor, educational guide, shared SEO/ads/embed. Assigned existing Mongo tool `6af46f14a27d8d1d4e990674` (no duplicate record).
- **Important Files:** `frontend/src/tools/calculators/rref/*`, `frontend/src/tools/registry/{keys,index}.ts`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/app/sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-rref-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Precision policy:** Integers/fractions/decimals parsed to exact `Rational` (decimals via place-value, max 12 places); no `eval`; no float elimination.
- **Verification:** Live `/tools/reduced-row-echelon-form-calculator` (Embed, ads, H1, rank 2 / pivots 1,2 / nullity 1 on default matrix). RREF 20/20 + Loan 14/14 + Auto Loan 15/15 passed; `tsc` + lint (0 errors) + `next build` passed.

### 2026-11-13 — Add ARM Mortgage Calculator
- **Summary:** Shipped an adjustable-rate mortgage calculator on the existing catalog slug `arm-mortgage-calculator`. Supports 3/1 through 10/6 structures, user rate assumptions (constant, rising step, falling step), increase caps, lifetime ceiling, optional floor, remaining-balance re-amortization, housing costs outside interest, schedule, and charts. Uses the Auto Loan master shell, shared SEO, ads, and embed.
- **Assumptions:** Caps limit rate increases only. Index + margin is an entered assumption, not a live index. Currency is display-only. Introductory $250,000 / 30-year / 5.5% payment is $1,419.47.
- **Important Files:** `frontend/src/tools/calculators/arm-mortgage/*`, registry, `page.tsx`, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-arm-mortgage-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** ARM unit tests passed; `tsc --noEmit` passed; `next build` passed. Mongo record `6af46f0fa27d8d1d4e98ff6c` assigned.

### 2026-11-13 — Add 100 Day Calculator
- **Summary:** Shipped a calendar-day calculator on the existing catalog slug `100-day-calculator`. Add or subtract 1–100,000 days, or count signed days between two dates. Inclusive offset counts the start as day 1. Inclusive spans count both endpoints. Arithmetic uses UTC civil dates so daylight saving time cannot move the selected day. Shared Auto Loan shell, SEO, ads, and embed.
- **Counting:** Exclusive January 1, 2026 + 100 days = April 11, 2026. Inclusive = April 10, 2026. January 1 to January 10 is 9 exclusive and 10 inclusive. Identical dates are 0 exclusive and 1 inclusive.
- **Important Files:** `frontend/src/tools/calculators/hundred-day/*`, registry, `page.tsx`, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-hundred-day-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** 100-day, loan, auto-loan, RREF, and ARM unit suites passed. Mongo record `6af46f18a27d8d1d4e990d16` assigned. Typecheck, lint, and production build recorded with the implementation.

### 2026-11-13 — Add 12 Volt Wire Size Calculator
- **Summary:** Shipped a 12 V DC two-wire voltage-drop calculator on the existing catalog slug `12-volt-wire-size-calculator`. Shared conductor helpers use IEC 60228 resistivity and ASTM B258 AWG areas. The page shows the minimum area, the next listed metric size, and the next listed AWG size. Ampacity is explicitly unverified, so the result is not a code-compliant recommendation.
- **Example:** 12 V, 3%, copper, 10 A, 5 m, 50°C → 5.354 mm² minimum, 6 mm² and 9 AWG on the listed series. A 6 mm² loop drops about 0.321 V.
- **Important Files:** `frontend/src/tools/electrical/conductor.ts`, `frontend/src/tools/calculators/twelve-volt-wire/*`, registry, `page.tsx`, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-twelve-volt-wire-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** Conductor tests passed with the loan, auto-loan, RREF, ARM, and 100-day suites from the same pass. Mongo record `6af46f15a27d8d1d4e99074d` assigned. Typecheck, lint, and production build recorded with this change.

### 2026-11-13 — Daily currency rate job
- **Summary:** Added `CurrencyRate` and `CurrencyRateHistory`. The API process schedules a local-midnight fetch (`0 0 * * *`). One USD quote is expanded into a conversion map for each tracked base currency. `npm run currency:fetch` runs the same save immediately.
- **Important Files:** `backend/src/modules/currency/*`, `backend/src/jobs/currency-rates.cron.ts`, `backend/src/scripts/fetch-currency-rates.ts`, `backend/src/server.ts`, `backend/src/config/env.ts`.
- **Verification:** `npx tsx src/jobs/currency-rates.cron.ts` printed `currency-rates cron ok`. `npm run currency:fetch` saved the tracked bases. Backend `npx tsc --noEmit` passed.

### 2026-11-13 — Currency job uses node-cron
- **Summary:** The midnight currency fetch is scheduled with `node-cron` (`0 0 * * *`, `noOverlap`) instead of a `setTimeout` loop.
- **Important Files:** `backend/src/jobs/currency-rates.cron.ts`, `backend/package.json`.
- **Verification:** `npx tsx src/jobs/currency-rates.cron.ts` printed `currency-rates cron ok`. Backend `npx tsc --noEmit` passed.

### 2026-11-13 — Tool pages 404 when the calculator is not registered
- **Summary:** `/tools/[slug]` calls `notFound()` when the active tool has no registered component or no page shell. Public `sample-data.ts` and the preview workspace are removed. Embeds for an unregistered key stay unavailable.
- **Important Files:** `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/tools/registry/keys.ts`, `frontend/src/components/shared/ToolWorkspace.tsx`, `frontend/src/app/embed/[slug]/page.tsx`.
- **Verification:** Frontend `npx tsc --noEmit` passed. `/tools/100-day-calculator` rendered the calculator (200). `/tools/0-60-calculator` (`ZeroToSixtyCalculator`, active, not registered) returned the not-found page (404).

### 2026-11-13 — Tool guides and calculators load per tool
- **Summary:** Each calculator's guide, FAQs, and intro line live in that tool's `detail.tsx`. The shared tool page loads only that module. The client registry loads only the calculator being rendered, through a static `import()` path.
- **Important Files:** `frontend/src/tools/registry/index.ts`, `frontend/src/tools/registry/details.ts`, `frontend/src/tools/calculators/*/detail.tsx`, `frontend/src/app/(website)/tools/[slug]/page.tsx`, `frontend/src/components/shared/ToolWorkspace.tsx`.
- **Verification:** Frontend `npx tsc --noEmit` passed. `/tools/loan-calculator` rendered the calculator ($483.32) and the loan guide. `/tools/12-volt-wire-size-calculator` rendered its own guide and the 5.354 mm² result.

### 2026-11-13 — Add 0-60 Calculator
- **Summary:** Shipped an illustrative 0-60 mph estimator on the existing catalog slug `0-60-calculator`. A 5 ms integration uses traction-limited launch, power-limited force `P/v` with a 0.92 average-power factor, one shift delay, drag, rolling resistance, and grade. 0-100 km/h is integrated to its own speed. The result is not a manufacturer time. The guide lives in `zero-to-sixty/detail.tsx` and the calculator loads through the shared lazy registry.
- **Example:** 300 hp, 3,500 lb, RWD, 85% efficiency, automatic 0.15 s shift, standard dry tires, level road → 5.98 s to 60 mph, 6.25 s to 100 km/h, 255 wheel hp.
- **Important Files:** `frontend/src/tools/calculators/zero-to-sixty/*`, registry, `sitemap.ts`, `backend/src/scripts/assign-zero-to-sixty-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** 0-60 tests (25) passed with loan, auto-loan, RREF, and 12 V wire suites. Mongo record `6af46f19a27d8d1d4e990dbd` assigned. Frontend typecheck and lint passed. Production build recorded with this change. Public page and embed rendered after the calculator was registered.

### 2026-11-13 — Lock calculator module architecture
- **Summary:** Audited commits `e76f98b` through `70e1af3` against the tree. Locked the live calculator layout in `ARCHITECTURE.md` §7 (ADR-018): one `/tools/[slug]` route, `React.lazy` calculator chunks, per-tool `detail.tsx`, pure `calculation.ts` / `validation.ts`, and `notFound()` for unregistered keys. The playbook now starts with the mandatory checklist (architecture, reusable components, engine, validation, tests, SEO, embed, responsive QA). Cursor and Antigravity calculator rules point at that checklist. Auto Loan remains the visual master (ADR-016). No calculator source was edited. Documented gaps: `hundred-day` has no `types.ts`; `twelve-volt-wire` tests live under `electrical/`; shared aside and TOC still sit in `auto-loan/`; the component-key allowlist is duplicated in the backend.
- **Important Files:** `brain/ARCHITECTURE.md`, `brain/CALCULATOR_STANDARDS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/DECISIONS.md`, `AGENTS.md`, `.cursor/rules/calculator-standards.mdc`, `.agents/rules/calculator-standards.md`.
- **Verification:** File inspection of `frontend/src/tools/registry/`, each calculator folder, `tools/[slug]/page.tsx`, and `embed/[slug]/page.tsx`. Docs-only change; type-check and lint were not re-run.

### 2026-11-13 — Add 12-Hour Shift Pay Calculator
- **Summary:** Shipped a client-side shift pay estimate on the existing catalog slug `12-hour-shift-pay-calculator`. Overtime hours are shift length minus regular hours. The overtime wage starts at 1.5× the hourly wage and stays at a typed value after the field is edited. Week, month, and year totals use shifts per week and weeks per year, and the page states those assumptions. Display currency defaults to PKR and does not convert amounts. The 1.5× rate is labeled as an assumption, not a legal rule.
- **Example:** Wage 20, overtime wage 30, 8 regular hours, 12-hour shift → regular pay 160, overtime pay 120, shift pay 280, average 23.33. Five shifts and 52 weeks → weekly 1,400, yearly 72,800, monthly 6,066.67.
- **Important Files:** `frontend/src/tools/calculators/twelve-hour-shift-pay/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-twelve-hour-shift-pay-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (10 cases). Frontend `npx tsc --noEmit` and `npm run lint` passed (existing `<img>` warnings only). Mongo record `6af46f0fa27d8d1d4e99004f` assigned with embed enabled. Public page showed PKR 280.00, average PKR 23.33, weekly 1,400.00, monthly 6,066.67, yearly 72,800.00, regular pay 160.00, and overtime pay 120.00. A typed overtime wage of 40 stayed at 40 when the hourly wage changed to 25 (shift pay PKR 360.00). Regular hours 13 cleared the result and showed the range error. Reset restored the defaults. Embed returned `X-Robots-Tag: noindex, nofollow` and `Content-Security-Policy: frame-ancestors *` with no advertisement text. No horizontal overflow at 375px or 1280px. `npm run build` was not completed: the first attempt overlapped the dev server, and a later clean attempt failed on an unrelated uncommitted ARM form type error that was not part of this change. A later `tsc --noEmit` reported no errors.

### 2026-11-13 — Finish 12 Volt Wire Size Calculator results
- **Summary:** The existing `12-volt-wire-size-calculator` page now shows the permitted drop next to the percentage, converts metres/feet and °C/°F when the unit changes, and reports loop resistance and wiring loss for the voltage-drop area. The headline stays an estimate because ampacity is still not verified. Tool tests live in `calculation.test.ts`; shared resistivity and AWG checks stay in `electrical/conductor.test.ts`.
- **Example:** 12 V, 3%, copper, 10 A, 5 m, 50°C → 5.354 mm², 0.036 Ω, 3.6 W. Listed sizes 6 mm² (0.321 V drop, 11.679 V at the load) and 9 AWG. Aluminum at the same inputs is 8.800 mm².
- **Important Files:** `frontend/src/tools/calculators/twelve-volt-wire/*`, `frontend/src/tools/electrical/conductor.ts`, `brain/{CURRENT_STATE,FRONTEND,ARCHITECTURE,CALCULATOR_STANDARDS,TASKS,CHANGELOG,DECISIONS}.md`.
- **Verification:** `calculation.test.ts` and `conductor.test.ts` passed, along with loan (14), auto-loan (15), 0-60 (25), RREF (20), ARM, and 100-day suites. Browser: feet toggle 5 m → 16.4042 ft with the same 5 m result, negative current shows an inline error and clears the result, Reset restores the defaults and 5.354 mm². Aluminum at the defaults selects 10 mm² and 7 AWG. Embed returns `X-Robots-Tag: noindex, nofollow` and `Content-Security-Policy: frame-ancestors *`, with the safety notice and no article or ad slot. 375px embed width has no horizontal overflow. Catalog title and description match. Dev canonical is localhost, which the production resolver does not emit.

### 2026-11-13 — Tools development audit
- **Summary:** Added admin-only `/tools-audit`. Start Audit reads the live component registry, exports, and shared tool route on the Next.js server, classifies every catalog tool, and Express persists `Tool.isDeveloped` plus a `ToolAudit` report. The initial `true` default is not treated as proof. Needs Review does not overwrite a stored boolean. A build-time manifest covers servers that do not have the source tree. ADR-020.
- **Important Files:** `frontend/src/app/tools-audit/page.tsx`, `frontend/src/lib/tools-audit/`, `frontend/src/server/tools-audit/actions.ts`, `frontend/src/generated/component-manifest.json`, `backend/src/modules/tools/tool-audit.*`, `backend/src/modules/tools/tool.model.ts`.
- **Verification:** Frontend and backend `tsc --noEmit` passed. `classify.test.ts` passed against the live registry. Unsigned `/tools-audit` redirects to login. The page compiles and an invalid session is rejected. The audit API returns 401 without a session. Start Audit was not clicked because this session had no admin login.

### 2026-11-13 — Complete ARM Mortgage Calculator inputs and caps
- **Summary:** Extended the existing `arm-mortgage-calculator` module. The loan amount is home price minus a down payment (amount or percent). Structures include 3/1 through 10/6 and a custom fixed period plus adjustment interval. Each reset targets index + margin, with an optional rising or falling step after the first reset. Periodic caps limit increases and decreases. Lifetime increase and decrease caps set the ceiling and floor. Results separate that assumption from the payment if the rate rises as fast as the caps allow. Year and month schedules, the shared principal/interest chart, and the guide match those rules. No second slug, registry key, or Mongo record.
- **Example:** $250,000, no down payment, 30 years, 5.5%, 5/1, index 4.5, margin 2, caps 2/2/5 → introductory payment $1,419.47; first reset $1,560.75 at 6.5%; lifetime ceiling 10.5%.
- **Important Files:** `frontend/src/tools/calculators/arm-mortgage/*`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `npx tsx src/tools/calculators/arm-mortgage/calculation.test.ts` passed. Frontend `npx tsc --noEmit` passed. `npx next lint` on the ARM module reported no warnings or errors. Browser: default $400,000 / 20% down shows loan $320,000, initial P&I $1,816.92, first reset $1,997.76 at 6.500%, contract ceiling 10.500% and cap-path payment $2,773.62. A 100% down payment shows “Down payment must be less than the home price” and clears the result. Reset restores $1,816.92. A 0% initial rate shows $888.89. Embed and the public page share the dev server; a later embed request returned 500 from a corrupted `.next` cache (`routes-manifest.json` missing), not from the calculator module. `npx next build` compiled and type-checked, then failed on an unrelated invariant (`no direct app page entry found for /about`). Loan 14/14 and Auto Loan 15/15 still passed.

### 2026-11-13 — Lock incremental calculator commits
- **Summary:** ADR-019 requires new calculators to land as meaningful milestone commits (small 1–2, medium 2–3, large 3–5, more only when each extra commit is real). The Brain record is the last commit of that sequence and is pushed with the code. Empty commits are rejected. ADR-016 and ADR-018 are unchanged. No calculator source was edited.
- **Important Files:** `AGENTS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/CALCULATOR_STANDARDS.md`, `brain/DECISIONS.md`, `.cursor/rules/git-commits.mdc`, `.agents/rules/git-commits.md`.
- **Verification:** File inspection only. The two agent rule files state the same sequence, the same size bands, and the same push rule.

### 2026-11-13 — Add 3D Printer Buy vs Outsource Calculator
- **Summary:** Shipped a client-side ownership versus outsourcing comparison on the existing catalog slug `3d-printer-buy-vs-outsource-calculator`. Failed attempts reuse the same material, time, and labor. Shipping is per order. Break-even is omitted when the service is cheaper per successful part or the monthly margin cannot repay the printer. Display currency defaults to PKR and does not convert amounts.
- **Example:** 10 parts/month for 12 months, 40 g, 3 h, 10% failures, printer 50,000, resale 20,000, material 2,500/kg, 200 W at 30/kWh, maintenance 500, outsource 800/part → in-house 51,733.33, outsource 96,000, savings 44,266.67, break-even about 4.85 months (48.47 parts).
- **Important Files:** `frontend/src/tools/calculators/three-d-printer-buy-vs-outsource/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-three-d-printer-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (11 cases). Loan (14) and auto-loan (15) suites passed. Frontend `tsc --noEmit` and `npm run lint` passed (existing `<img>` warnings only). Mongo record `6af46f0fa27d8d1d4e99007b` assigned with embed enabled. A live page response included the title, in-house 51,733.33, outsourcing 96,000, and “Buy and operate”. Embed returned `X-Robots-Tag: noindex, nofollow` and `Content-Security-Policy: frame-ancestors *`, with the recommendation and no advertisement or guide heading. A later request returned 500 after overlapping dev and production builds deleted a `.next` chunk (`Cannot find module ./5611.js`). `npm run build` in the same window failed on an unrelated `apple-icon.png` invariant, not on this calculator.

### 2026-11-13 — Add 3x Rent Calculator
- **Summary:** Shipped a client-side rent-to-income screen on the existing catalog slug `3x-rent-calculator`. Required-income mode multiplies monthly rent by the guideline multiple (default 3) and by 12 for the year. Affordable-rent mode divides gross monthly income by the same multiple. Two or more tenants can split the requirement equally or by percents that add to 100%. Individual gross incomes are summed before the affordable-rent limit. Equal shares are an assumption. The 3× multiple is a screening guideline, not a legal rule. Display currency defaults to PKR and does not convert amounts.
- **Example:** Monthly rent 1,500 at 3× requires gross monthly income 4,500 and gross annual income 54,000. Two tenants splitting equally need 2,250 each per month. Combined incomes 2,000 and 2,500 support a maximum monthly rent of 1,500.
- **Important Files:** `frontend/src/tools/calculators/three-x-rent/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-three-x-rent-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,BACKEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed (13 cases). Frontend `npx tsc --noEmit` passed. `npm run lint` passed with the existing `<img>` warnings only. Backend `npx tsc --noEmit` and `tool.key.ts` self-check passed. Mongo record `6af46f0fa27d8d1d4e98ffbb` assigned with embed enabled. Browser: rent 1,500 shows PKR 4,500 monthly and PKR 54,000 annual (33.33%). Two tenants show PKR 2,250 and PKR 27,000 each. Combined incomes 2,000 and 2,500 show maximum rent PKR 1,500. Negative rent shows an inline error and clears the result. Reset restores a blank rent, multiplier 3, and PKR. Embed returned `X-Robots-Tag: noindex, nofollow` and `Content-Security-Policy: frame-ancestors *`, with no advertisement and no guide. No horizontal overflow at 375px or 1280px. A clean `npm run build` passed after an overlapping dev/build run had left `.next` inconsistent.

### 2026-11-13 — Add A/R Days Calculator
- **Summary:** Shipped a client-side accounts-receivable days calculator on the existing catalog slug `ar-days-calculator`. The formula is (receivables / net credit sales) × days in the period. One explicit target is solved from the other three. Ending receivables and the average of the beginning and ending balances stay separate; the average is used only when that method is selected. Zero credit sales with a positive balance is undefined, and 0/0 is indeterminate. Display currency defaults to PKR and does not convert amounts. The page does not grade a day count as good or bad.
- **Example:** Receivables 50,000, net credit sales 100,000, 365 days → 182.5 days, period turnover 2. Beginning 40,000 and ending 60,000 average to the same 50,000 and the same 182.5 days.
- **Important Files:** `frontend/src/tools/calculators/ar-days/*`, registry, `sitemap.ts`, `backend/src/modules/tools/tool.key.ts`, `backend/src/scripts/assign-ar-days-tool.ts`, `brain/{CURRENT_STATE,FRONTEND,TASKS,CHANGELOG}.md`.
- **Verification:** `calculation.test.ts` passed. Loan (14) and auto-loan (15) suites passed. Frontend `npx tsc --noEmit` passed. `npx next lint` on the A/R days module reported no warnings or errors. Backend `tool.key.ts` self-check passed. Mongo record `6af46f0fa27d8d1d4e99007c` assigned with embed enabled. Browser: defaults show 182.5 days, PKR 50,000, PKR 100,000, turnover 2. Average of 40,000 and 60,000 stays 182.5 and labels the average method. Net credit sales of 0 clears the result and explains that the ratio is undefined. Reset restores 50,000, 100,000, the ending method, and 182.5 days. Embed returned 200, `X-Robots-Tag: noindex, nofollow`, and `Content-Security-Policy: frame-ancestors *`, with the form and 182.5 and without an advertisement or the guide heading. No horizontal overflow at 375px or 1280px. `npm run build` was not run while the dev server was serving this page.

### 2026-11-13 — Lock shared currency conversion
- **Summary:** ADR-021 requires future converting calculators to use the ADR-017 `CurrencyRate` map: `amount * rate[target] / rate[source]`, with the base rate set to 1. Denomination selectors stay formatting-only. No new cron, collection, or provider call was added. The daily job still does not write when the provider response fails, and no read route exists yet.
- **Important Files:** `AGENTS.md`, `brain/ARCHITECTURE.md`, `brain/CALCULATOR_STANDARDS.md`, `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `brain/DECISIONS.md`, `.cursor/rules/currency-conversion.mdc`, `.agents/rules/currency-conversion.md`.
- **Verification:** Compared `fetch-currency-rates.ts`, `currency-rates.cron.ts`, both Mongoose models, and `currency.ts` with the new rules. Both agent rule files state the same formula, the same 48-hour stale policy, and the same missing-read-route gap. No calculator source was edited.

