# Frontend Architecture & Inventory (`frontend/`)

## 1. Overview

The frontend is an independent Next.js 15 App Router application (`omega-calculators-frontend`) using React 19, TypeScript (strict mode), Tailwind CSS 3.4, and `server-only` server actions to communicate with the Express backend.

- **Entry Root Layout:** `frontend/src/app/layout.tsx` (sets default metadata `<title>` template `%s | Omega Calculators`, favicon/apple icon `/images/logo/icon-with-bg.png`, base body classes `bg-background font-sans text-foreground`).
- **PWA Manifest:** `frontend/src/app/manifest.json` + icons in `frontend/public/`.
- **Edge Middleware:** `frontend/src/middleware.ts` (matches `/admin/:path*`).
- **Route Handlers (`src/app/api/`):** Currently empty (`.gitkeep` only). All server-to-Express communication uses Server Components and `'use server'` Server Actions.

---

## 2. Public Website Routes (`src/app/(website)/`)

Wrapped by `src/app/(website)/layout.tsx` (`Header` + `<main className="flex-1">` + `Footer`).

| Route | File | Rendering / Data Source | Implementation Status |
| :--- | :--- | :--- | :--- |
| `/` | `(website)/page.tsx` | Server Component (`cache: 'no-store'`) fetching `/catalog/categories` and `/catalog/featured` via `serverApi` | **Implemented** (falls back to empty arrays if backend unreachable) |
| `/tools` | `(website)/tools/page.tsx` | Server Component. `GET /catalog/tools` with `q`, `category`, and `page`. 24 active tools per page. | **Implemented** |
| `/tools/[slug]` | `(website)/tools/[slug]/page.tsx` | Server Component. Active tool from `getPublicToolBySlug`. Guide and FAQs load from that tool's `detail.tsx`. The calculator loads with `import()`. Unregistered keys call `notFound()`. | **Implemented** for the registered calculators, including the 401(k) and 403(b) calculators |
| `/embed/[slug]` | `embed/[slug]/page.tsx` (+ `embed/layout.tsx`) | Minimal no-header/footer calculator iframe surface; eligibility = active + allowlisted `componentKey` + embed not explicitly disabled (missing → enabled); `presentation="embed"`; noindex; optional ResizeObserver → postMessage; **no ad slots** | **Implemented** (shared for all registered calculators) |
| `/robots.txt` | `app/robots.ts` | Allow `/`; disallow `/admin/`, `/api/`, `/embed/`; sitemap URL from public origin | **Implemented** |
| `/sitemap.xml` | `app/sitemap.ts` | Static pages + categories + implemented sitemap-eligible tools only (skips localhost origin) | **Implemented** |
| `/categories` | `(website)/categories/page.tsx` | Server Component loads `getPublicCategories()`, then `CategoriesClient` filters that list in the browser | **Implemented** |
| `/categories/[slug]` | `(website)/categories/[slug]/page.tsx` | Server Component fetching `GET /catalog/categories/:slug`. Active tools are listed under their pillar and sub-pillar and link to `/tools/[slug]`. | **Implemented** |
| `/about` | `(website)/about/page.tsx` | Server Component. Static editorial copy with a custom product board, mixed platform layout, and numbered principles. Category and tool totals come from `GET /catalog/categories` when reachable | **Implemented** |
| `/contact` | `(website)/contact/page.tsx` | Server page with a client form. Fields are name, email, subject, and message. Validation is client-side only, and a successful check says the message was not delivered | **Partially Implemented** (no backend submission endpoint) |
| `/privacy-policy` | `(website)/privacy-policy/page.tsx` | Static legal draft template (marked draft pending legal review) | **Partially Implemented** (draft copy) |
| `/terms-of-service` | `(website)/terms-of-service/page.tsx` | Static legal draft template (marked draft pending legal review) | **Partially Implemented** (draft copy) |
| `*` (404) | `src/app/not-found.tsx` | Custom 404 page with `Header` & `Footer` | **Implemented** |

### Known Data-Source Mismatch (Important)

- Homepage (`/`) renders live categories and featured tools from MongoDB (`/catalog/*`) and links to `/categories/${category.slug}` and `/tools/${tool.slug}`.
- `/tools/[slug]` loads an active MongoDB tool and calls `notFound()` when its component is not registered. There is no sample-tool fallback.
- Header, footer, the mobile menu, the homepage, the category index, the category detail page, the tools directory, and the About totals all read the public catalog. The header menu, category index, and the homepage show each category's `iconUrl` when it is set. The footer and mobile menu show the first seven.

---

## 3. Admin Routes (`src/app/admin/`)

Wrapped by `src/app/admin/layout.tsx` (`robots: { index: false, follow: false }`).

### Public Admin Auth Pages
- `/admin/login` (`admin/login/page.tsx`) — **Implemented** (`AuthSplit` + `loginAdminAction`)
- `/admin/forgot-password` (`admin/forgot-password/page.tsx`) — **Implemented** (`AuthSplit` + `forgotPasswordAction`)
- `/admin/reset-password` (`admin/reset-password/page.tsx`) — **Implemented** (`AuthSplit` + `resetPasswordAction` reading `?token=`)

### Protected Admin Dashboard Pages (`src/app/admin/(dashboard)/`)
Protected by `admin/(dashboard)/layout.tsx` (`export const dynamic = 'force-dynamic'`), which verifies `getCurrentAdmin()` server-side and renders `AdminDashboardShell` (`AdminSidebar`, `AdminMobileSidebar`, `AdminHeader`, `AdminBreadcrumbs`).

| Route | Data Source | Status |
| :--- | :--- | :--- |
| `/admin` | `admin-mock-data.ts` (`ADMIN_ANALYTICS_DATA`) + `PendingNotice` | **Partially Implemented** (UI preview) |
| `/admin/categories` | `listCategoriesAction`, `deleteCategoryAction` (Express + MongoDB) | **Implemented** |
| `/admin/categories/new` | `listCategoryOptionsAction`, `createCategoryAction` | **Implemented** |
| `/admin/categories/[id]/edit` | `getCategoryAction`, `listCategoryOptionsAction`, `updateCategoryAction` | **Implemented** |
| `/admin/tools` | `listToolsAction`, `listToolPlacementAction`, `deleteToolAction` | **Implemented** |
| `/admin/tools/new` | `listToolPlacementAction`, `listMediaAction`, `saveToolAction` | **Implemented** |
| `/admin/tools/[id]/edit` | `getToolAction`, `listToolPlacementAction`, `listMediaAction`, `saveToolAction` | **Implemented** |
| `/admin/media` | `listMediaAction`, `requestMediaUploadAction`, `PUT /api/media-upload` when the driver is local (or a signed S3 URL when it is `s3`), `confirmMediaUploadAction`, `deleteMediaAction` | **Implemented** |
| `/admin/profile` | `getCurrentAdmin()`, `updateAdminProfileAction`, `changeAdminPasswordAction` | **Partially Implemented** (profile + password live; TOTP 2FA switch is visual state only) |
| `/admin/analytics` | `admin-mock-data.ts` + `PendingNotice` | **Partially Implemented** (UI preview) |
| `/admin/activity-logs` | `INITIAL_ADMIN_LOGS` + `PendingNotice` | **Partially Implemented** (UI preview) |
| `/admin/integrations` | `INITIAL_ADMIN_INTEGRATIONS` + `PendingNotice` | **Partially Implemented** (UI preview) |
| `/admin/pages` | `INITIAL_ADMIN_CMS_PAGES` + `PendingNotice` | **Partially Implemented** (UI preview) |
| `/admin/seo` | Local React state + `PendingNotice` | **Partially Implemented** (UI preview) |
| `/admin/settings` | Local React state + `PendingNotice` | **Partially Implemented** (UI preview) |
| `/admin/users` | `INITIAL_ADMIN_USERS` + `PendingNotice` | **Partially Implemented** (UI preview) |

---

## 4. Reusable Components Inventory

- **UI Primitives (`src/components/ui/`):** `badge.tsx`, `button.tsx`, `card.tsx`, `input.tsx` (uses `block` instead of `flex` for `date`/`time`/`datetime-local` inputs so native picker icons stay right-aligned), `select.tsx`, `switch.tsx`, `tabs.tsx`, `textarea.tsx` (using `cn()` from `src/lib/utils.ts` and `class-variance-authority`).
- **Website Layout (`src/components/layout/`):** `Container.tsx`, async server `Header.tsx` and `Footer.tsx` (live categories from `getPublicCategories()`), `MobileNavigation.tsx` (client menu; category list is passed in from the server header).
- **Public Shared (`src/components/shared/`):** `Breadcrumbs.tsx`, `CategoryCard.tsx`, `CategoryIcon.tsx` (Lucide icon map), `EmptyState.tsx`, `FAQAccordion.tsx` (medium/semibold question hierarchy and relaxed `1.7` answer line-height), `RelatedCatalogTools.tsx` (plain two-column `list-disc` links; `Open` / `Preview` linked items vs non-link `Catalog only`, no nested cards), `ToolDetailSidebar.tsx` (two-column right rail: More tools list, other-topic links, dark country-rules pills), `SearchBar.tsx`, `SectionHeading.tsx`, `ToolWorkspace.tsx` (renders a registered calculator, or nothing when the key is missing).
- **Admin Components (`src/components/admin/`):**
  - `auth/AuthSplit.tsx`
  - `layout/`: `AdminDashboardShell.tsx`, `AdminSidebar.tsx`, `AdminMobileSidebar.tsx`, `AdminHeader.tsx`, `AdminBreadcrumbs.tsx`, `admin-nav.tsx` (grouped collapsible menu: `Catalog`, `Insights`, `System`)
  - `dashboard/`: `StatCard.tsx`, `DashboardCharts.tsx`, `PopularToolsList.tsx`, `QuickActions.tsx`, `RecentActivity.tsx`
  - `forms/`: `FormSection.tsx`, `CategoryForm.tsx`, `ToolForm.tsx`, `ToolSeoSection.tsx` (collapsible Basic / OG / Twitter / Structured Data + search/social previews; Media Library pickers for OG/Twitter images; no robots/sitemap controls), `ToolEmbedSection.tsx` (allow embedding, height/layout, advisory domains, copy iframe/URL/auto-resize, preview)
  - `tables/`: `DataTable.tsx`, `TableFilters.tsx`, `TablePagination.tsx`, `RowActions.tsx`
  - `shared/`: `AdminSearchDialog.tsx` (implemented component, currently not mounted in `AdminHeader.tsx`), `ConfirmDialog.tsx`, `EmptyState.tsx`, `ExecutionTypeBadge.tsx`, `LoadingState.tsx`, `PendingNotice.tsx`, `StatusBadge.tsx`
  - `profile/`: `AdminProfileClient.tsx`

---

## 5. Server Actions & API Client (`src/server/`)

- `src/server/api/client.ts` (`ServerApiClient`, singleton `serverApi`, `ApiClientError`) — `server-only`, injects `Content-Type: application/json`, handles `AbortController` timeout (`API_TIMEOUT_MS`, default `10000`), unwraps `ApiResponse<T>`.
- `src/server/auth/session.ts` — manages `admin_session` `HttpOnly` cookie and `getCurrentAdmin()`.
- `src/server/auth/actions.ts` — `loginAdminAction`, `logoutAdminAction`, `updateAdminProfileAction`, `changeAdminPasswordAction`, `forgotPasswordAction`, `resetPasswordAction`.
- `src/server/categories/actions.ts` — `listCategoriesAction`, `getCategoryAction`, `listCategoryOptionsAction`, `createCategoryAction`, `updateCategoryAction`, `deleteCategoryAction`.
- `src/server/media/actions.ts` — `listMediaAction`, `requestMediaUploadAction`, `confirmMediaUploadAction`, `deleteMediaAction`.
- `src/server/tools/actions.ts` — `listToolsAction`, `listToolPlacementAction`, `getToolAction`, `saveToolAction` (`revalidatePath('/tools/[slug]')` after save), `deleteToolAction` (supports `executionType` and `componentKey` + full optional SEO payload).
- `src/server/catalog/tools.ts` — `getPublicToolBySlug` (`React.cache` + `server-only`, `cache: 'no-store'`, calls `GET /catalog/tools/:slug`).
- `src/server/seo/public-site.ts` — production-safe public origin helper (`NEXT_PUBLIC_SITE_URL` / `SITE_URL`; never emits localhost as production canonical).
- `src/lib/seo/tool-seo.ts` — shared optional-field fallbacks, robots/canonical/social builders, safe JSON-LD serializers (+ `tool-seo.test.ts`).
- `src/lib/embed/tool-embed.ts` — embed eligibility, iframe/auto-resize snippet builders, postMessage validators (+ `tool-embed.test.ts`); host script `public/embed.js`.
- `src/lib/ads/{types,placements}.ts` + `components/ads/AdSlot.tsx` — placeholder-only tool-page ad slots (`ADS_DISPLAY_MODE = 'placeholder'`); wired in `/tools/[slug]` only; never on embed routes.

---

## 6. Tool Registry (`src/tools/`)

- `src/tools/types.ts`: Defines `ToolComponentProps`, `ToolComponent`, `RegisteredToolDefinition`, `ToolRegistryMap`.
- `src/tools/page-detail.ts`: `ToolPageDetail` contract (intro line, aside label, TOC, guide component, FAQs, optional country rules).
- `src/tools/registry/keys.ts`: Pure allowlist shared by Server Components, sitemap, embed, and `ToolForm.tsx`. Registered keys: `AutoLoanCalculator`, `LoanCalculator`, `RrefCalculator`, `ArmMortgageCalculator`, `HundredDayCalculator`, `TwelveVoltWireCalculator`, `ZeroToSixtyCalculator`, `TwelveHourShiftPayCalculator`, `ThreeDPrinterBuyVsOutsourceCalculator`, `ThreeXRentCalculator`, `ARDaysCalculator`, `FiveTwentyNineCalculator`, `SeventyTwentyTenCalculator`, `ADRCalculator`. `APPROVED_COMPONENT_KEYS` and `REGISTERED_COMPONENT_KEYS` include the registered keys above.
- `src/tools/registry/index.ts`: `'use client'` loader. Each registered calculator is a `React.lazy` `import()` with a static path, so one tool page downloads that calculator only.
- `src/tools/registry/details.ts`: Server loader. `loadToolPageDetail(key)` imports that tool's `detail.tsx` (guide, TOC, FAQs, intro line). Locked for new tools in `ARCHITECTURE.md` §7.
- `src/tools/shared/`: Shared calculator utilities — `currency.ts` (`49` ISO display currencies, `Intl.NumberFormat` fraction digits, denomination-only formatting helpers + `currency.test.ts`) and searchable accessible `CurrencySelect.tsx` (code/name search, keyboard navigation). No live FX conversion.
- `src/tools/calculators/auto-loan/`: Modular Auto Loan Calculator — **official master Tool Detail Page UI reference** (`TOOL_DETAIL_PAGE_STANDARDS.md`). Includes `types.ts`, `validation.ts`, `calculation.ts`, `calculation.test.ts`, `content.ts`, `InfoTooltip.tsx`, `TableOfContents.tsx`, `StickyCalculatorAside.tsx`, `AutoLoanForm.tsx`, `AutoLoanResults.tsx`, `AutoLoanChart.tsx`, `AmortizationTable.tsx`, `AutoLoanCalculator.tsx`, `AutoLoanGuideArticle.tsx`. Full-width intro; left calculator/guide + sticky right `ToolDetailSidebar`; plain `list-disc` guide; Embed via shared `headerActions`. Auto-specific trade-in/tax/fees math preserved.
- `src/tools/calculators/loan/`: Modular General Loan Calculator aligned to the Auto Loan master shell. Implements `types.ts`, `validation.ts`, `calculation.ts`, `calculation.test.ts`, `content.ts`, `LoanForm.tsx`, `LoanResults.tsx`, `LoanChart.tsx`, `LoanAmortizationTable.tsx`, `LoanCalculator.tsx`, `LoanGuideArticle.tsx`; reuses `StickyCalculatorAside`, `TableOfContents`, `InfoTooltip`, shared `CurrencySelect` / currency helpers, and date/CSV primitives. Supports Amortized & Interest-Only modes, Monthly/Biweekly/Weekly frequencies, recurring/one-time extra principal payments, upfront/financed origination fees, Principal/Interest + Balance Over Time SVGs, and portaled Period/Yearly schedule dialog + CSV export. The shared tool page loads `loan/detail.tsx`.
- `src/tools/calculators/rref/`: RREF (Reduced Row Echelon Form) Calculator — first matrix tool under the Auto Loan master shell. Exact `Rational` arithmetic + Gauss–Jordan engine (`rational.ts`, `parse.ts`, `calculation.ts`, 20 unit suites), 1×1–6×8 editor, step-by-step ops, rank/pivots/nullity, optional augmented analysis, `MatrixDisplay` reusable bracket UI, guide article, registry key `RrefCalculator`, catalog slug `reduced-row-echelon-form-calculator`.
- `src/tools/calculators/arm-mortgage/`: ARM Mortgage Calculator (`ArmMortgageCalculator`, slug `arm-mortgage-calculator`). Monthly amortization in cents, ARM structures, modeled resets with increase caps / lifetime cap / optional floor, housing costs excluded from interest, schedule + balance/payment charts, guide, shared shell.
- `src/tools/calculators/hundred-day/`: 100 Day Calculator (`HundredDayCalculator`, slug `100-day-calculator`). UTC civil-date add/subtract and signed day-span modes, inclusive/exclusive counting, leap years, guide, shared shell. No currency.
- `src/tools/electrical/conductor.ts`: Shared DC conductor helpers (IEC 60228 resistivity and temperature coefficients, ASTM B258 AWG area, nominal metric sizes, two-wire minimum area). No ampacity table.
- `src/tools/calculators/twelve-volt-wire/`: 12 Volt Wire Size Calculator (`TwelveVoltWireCalculator`, slug `12-volt-wire-size-calculator`). Voltage-drop area, separate AWG and mm² picks, load voltage, loop resistance, and I²R loss. Unit toggles convert length and temperature. Ampacity labeled unverified. Guide, shared shell, and `calculation.test.ts`.
- `src/tools/calculators/twelve-hour-shift-pay/`: 12-Hour Shift Pay Calculator (`TwelveHourShiftPayCalculator`, slug `12-hour-shift-pay-calculator`). Pure shift split: overtime hours = shift length − regular hours. Suggested overtime wage is 1.5× until the field is edited. Week, month, and year use the schedule assumptions. Display currency only.
- `src/tools/calculators/zero-to-sixty/`: 0-60 Calculator (`ZeroToSixtyCalculator`, slug `0-60-calculator`). SI integration of a peak-power, traction-limited launch with drag, rolling resistance, grade, and one shift delay. Separate 60 mph and 100 km/h times, speed-time chart, and `detail.tsx` for the shared shell.
- `src/tools/calculators/three-d-printer-buy-vs-outsource/`: 3D Printer Buy vs Outsource Calculator (`ThreeDPrinterBuyVsOutsourceCalculator`, slug `3d-printer-buy-vs-outsource-calculator`). Ownership versus a print service, with failed-print attempts, order-based shipping, and a break-even only when the variable gap repays the printer. Display currency only. Guide in `detail.tsx`.
- `src/tools/calculators/three-x-rent/`: 3x Rent Calculator (`ThreeXRentCalculator`, slug `3x-rent-calculator`). Required-income mode is rent × multiplier, then × 12 for the year. Affordable-rent mode divides gross monthly income by the multiplier. Optional tenant count, equal or custom shares, and combined household income. Display currency only. Guide in `detail.tsx`.
- `src/tools/calculators/ar-days/`: A/R Days Calculator (`ARDaysCalculator`, slug `ar-days-calculator`). Ending or average receivables, an explicit solve target for days, receivables, net credit sales, or the period length, and a guide in `detail.tsx`. Display currency only. Undefined and indeterminate cases stay explanations.
- `src/tools/calculators/adr/`: ADR Calculator (`ADRCalculator`, slug `adr-calculator`). Room revenue divided by sold room-nights, with reverse targets and optional occupancy and RevPAR. Display currency only. Guide in `detail.tsx`.
- `src/tools/calculators/four-zero-one-k/`: 401(k) Calculator (`FourZeroOneKCalculator`, slug `401k-calculator`). Effective-annual period projection, employer match formulas, optional user-entered USD limits, and a bounded solver for the employee deferral. Display currency only. Guide in `detail.tsx`.
- `src/tools/calculators/four-zero-three-b/`: 403(b) Calculator (`FourZeroThreeBCalculator`, slug `403b-calculator`). Period-by-period projection with a nominal default rate, employer match formulas, optional user-entered limits, and a bounded solver for the employee deferral, salary, or employer rate. Display currency only. Guide in `detail.tsx`.
- `src/tools/calculators/seventy-twenty-ten-rule/`: 70/20/10 Rule Money Calculator (`SeventyTwentyTenCalculator`, slug `702010-rule-money-calculator`). After-tax income split, optional custom percentages that must total 100%, actual spending comparison, and one monthly/annual conversion. Display currency only. Guide in `detail.tsx`.
- `src/tools/calculators/five-twenty-nine/`: 529 Calculator (`FiveTwentyNineCalculator`, slug `529-calculator`). Monthly nominal growth and fees, inflated education costs, scholarships, a funding gap, and a required monthly contribution. Display currency defaults to USD and does not convert amounts. Guide in `detail.tsx`.
- Remaining category folders (`ai`, `audio`, `converters`, `developer`, `image`, `pdf`, `seo`, `video`) currently contain only `.gitkeep`.
- **Legacy Metadata Constants Drift:** `frontend/src/lib/constants.ts` defines 12 `TOOL_CATEGORIES` (`calculators`, `converters`, `pdf`, `image`, `text`, `seo`, `developer`, `ai`, `video`, `audio`, `security`, `productivity`), while `backend/src/constants/index.ts` defines 9 `TOOL_CATEGORIES`, and the seeded MongoDB hierarchy (`tools-directory-hierarchy.json`) uses 19 domain categories (`Finance & Business`, etc.).

---

## 7. Server vs. Client Components & Styling Conventions

- **Server Components (default):** Layouts (`RootLayout`, `WebsiteLayout`, `AdminDashboardLayout`), homepage (`(website)/page.tsx`), detail pages (`categories/[slug]/page.tsx`, `tools/[slug]/page.tsx`), `admin/profile/page.tsx`, informational pages.
- **Client Components (`'use client'`):** Interactive directory search/filters, admin login/reset forms, all interactive admin CRUD views/forms/tables, sidebar/header state, `FAQAccordion`, `SearchBar`, `ToolWorkspace`, `ContactFormClient`.
- **Styling:** Tailwind utility classes backed by semantic HSL CSS variables in `src/app/globals.css` plus explicit `brand.*` tokens in `tailwind.config.ts`. Prettier enforces `singleQuote: true`, `semi: true`, `printWidth: 100`, `tabWidth: 2`.
- **Note on `<img>` tags:** Several components use native `<img>` rather than `next/image` (including dynamic S3 URLs and logos), producing `@next/next/no-img-element` warnings during `npm run lint`.

- `src/tools/calculators/amortization/`: Amortization Calculator (`AmortizationCalculator`, slug `amortization-calculator`). Fixed-rate loan amortization with customizable compounding (daily, weekly, biweekly, monthly, quarterly, semi-annual, annual) and payment frequencies, recurring extra payments, advanced extra payment ranges, and one-time lump-sum payments. Pure cents-based schedule ledger, balance curve SVG with baseline comparison, period/yearly schedule table, pagination, CSV download, full-screen modal, and 14 unit test suites.
- `src/tools/calculators/acreage/`: Acreage Calculator (`AcreageCalculator`, slug `acreage-calculator`). Rectangular width × length to area with SI length/area factors, separate area-conversion mode, optional unit price total (denomination-only currency), conversion table, guide, and unit tests.
- `src/tools/calculators/feet-to-inches/`: Feet to Inches Calculator (`FeetToInchesCalculator`, slug `feet-to-inches-calculator`). Bidirectional ft ↔ in with source-field tracking, collapsible other units (mm/cm/m/yd/km/mi), guide, and unit tests.
- `src/tools/calculators/acres-to-square-miles/`: Acres to Square Miles Calculator (`AcresToSquareMilesCalculator`, slug `acres-to-square-miles-calculator`). Bidirectional acres ↔ mi² with exact factor 640, source-field tracking, reference table, guide, and unit tests.
- `src/tools/calculators/height-in-inches/`: Height in Inches Calculator (`HeightInInchesCalculator`, slug `height-in-inches-calculator`). Feet + inches, total inches, cm, and m with exact factors 12 and 2.54, excess-inch normalization, guide, and unit tests.
- `src/tools/calculators/acre-to-are/`: Acre to Are Conversion (`AcreToAreConversionCalculator`, slug `acre-to-are-conversion`). Bidirectional acres ↔ ares with exact factor 40.468564224, source-field tracking, reference table, guide, and unit tests.
- `src/tools/calculators/inches-to-fraction/`: Inches to Fraction Calculator (`InchesToFractionCalculator`, slug `inches-to-fraction-calculator`). Decimal/fraction/mixed parsing, precision 1/2–1/256, other units from original inches, guide, and unit tests.
- `src/tools/calculators/area-converter/`: Area Converter (`AreaConverter`, slug `area-converter`). Five synchronized fields, 15 area units via m² base, unit switching without drift, guide, and unit tests.
- `src/tools/calculators/length-converter/`: Length Converter (`LengthConverter`, slug `length-converter`). Six synchronized fields, 25 length units via meter base, Other units accordion, guide, and unit tests.
- `src/tools/calculators/ares-to-cent/`: Ares to Cent Converter (`AresToCentConverter`, slug `ares-to-cent-converter`). Bidirectional ares ↔ cents with exact `ARES_PER_CENT = 0.40468564224`, guide, and unit tests. Catalog left inactive.
- `src/tools/calculators/light-year-conversion/`: Light Year Conversion (`LightYearConversion`, slug `light-year-conversion`). Four synchronized fields (ly / metric / imperial / astro), Julian-year ly and IAU AU, guide, and unit tests. Catalog left inactive.
- `src/tools/calculators/ares-to-hectares/`: Ares to Hectares Converter (`AresToHectaresConverter`, slug `ares-to-hectares-converter`). Bidirectional ares ↔ hectares with exact factor 100, More conversion options (m²/km²/ft²/yd²/ac/cent), guide, and unit tests. Catalog left inactive.
- `src/tools/calculators/mesh-to-micron/`: Mesh to Micron Converter (`MeshToMicronConverter`, slug `mesh-to-micron-converter`). ASTM E11 sieve lookup, custom woven-mesh opening, reverse nearest-sieve, unit equivalents, guide, and unit tests.
- `src/tools/calculators/astronomical-unit/`: Astronomical Unit Calculator (`AstronomicalUnitCalculator`, slug `astronomical-unit-calculator`). Six synchronized fields (au/m/km/ly/pc/mi defaults), IAU au + Julian ly + geometric pc + light-travel units, metric/imperial selectors, guide, and unit tests.
- `src/tools/calculators/pixels-to-inches/`: Pixels to Inches Converter (`PixelsToInchesConverter`, slug `pixels-to-inches-converter`). Bidirectional px ↔ in with configurable PPI (default 96), source tracking, mm/cm/ft options, guide, and unit tests.
- `src/tools/calculators/decimeter-to-meter/`: Decimeter to Meter Converter (`DecimeterToMeterConverter`, slug `decimeter-to-meter-converter`). Bidirectional dm ↔ m with exact factor 10, more-options mm/cm/km/in/ft/yd, guide, and unit tests.
- `src/tools/calculators/square-kilometers-to-acres/`: Square Kilometers to Acres Conversion (`SquareKilometersToAcresConverter`, slug `square-kilometers-to-acres-conversion`). Bidirectional km² ↔ ac via exact m² factors, more-options m²/ft²/yd²/ha/a/mi², guide, and unit tests.
- `src/tools/calculators/feet-and-inches/`: Feet and Inches Calculator (`FeetAndInchesCalculator`, slug `feet-and-inches-calculator`). Mixed ft/in arithmetic (+/−/×/÷), fractional inches (reuses inches-to-fraction parser), precision selector, guide, and unit tests.
- `src/tools/calculators/yards-to-acres/`: Yards to Acres Calculator (`YardsToAcresCalculator`, slug `yards-to-acres-calculator`). Bidirectional yd² ↔ ac with exact factor 4840, more-options ft²/m²/km²/ha/a, guide, and unit tests.
- `src/tools/calculators/ccf-to-gallons/`: CCF to Gallons Conversion (`CcfToGallonsConversion`, slug `ccf-to-gallons-conversion`). Bidirectional CCF ↔ US gal with exact ratio 172800/231, more-options ft³/m³/L/mL/imp gal, guide, and unit tests.
- `src/tools/calculators/liters-to-centiliters/`: Liters to Centiliters Converter (`LitersToCentilitersConverter`, slug `liters-to-centiliters-converter`). Bidirectional L ↔ cL with exact factor 100, more-options mL/dL/cm³/m³/US gal/US fl oz, guide, and unit tests.
- `src/tools/calculators/cubic-feet/`: Cubic Feet Calculator (`CubicFeetCalculator`, slug `cubic-feet-calculator`). L×W×H volume in ft³ with independent length units, prism illustration, more-options, find-missing-dimension, guide, and unit tests.
- `src/tools/calculators/mcg-to-mg/`: mcg to mg Converter (`McgToMgConverter`, slug `mcg-to-mg-converter`). Bidirectional mcg ↔ mg with exact factor 1000, more-options ng/cg/dg/g/kg, guide, and unit tests.
- `src/tools/calculators/cubic-meter/`: Cubic Meter Calculator (`CubicMeterCalculator`, slug `cubic-meter-calculator`). H×L×W → m³ with independent length units, volume-conversion workflow, more-options, find-missing-dimension, guide, and unit tests.
- `src/tools/calculators/mg-to-ml/`: mg to mL Calculator (`MgToMlCalculator`, slug `mg-to-ml-calculator`). Density vs medication-concentration modes, bidirectional mg↔mL, custom concentration only, safety notice, guide, and unit tests.
- `src/tools/calculators/cubic-yards-to-tons/`: Cubic Yards to Tons Calculator (`CubicYardsToTonsCalculator`, slug `cubic-yards-to-tons-calculator`). Density-based yd³↔tons with category/material presets, metric/US/imperial tons, guide, and unit tests.
- `src/tools/calculators/ml-to-cups/`: mL to Cups Converter (`MlToCupsConverter`, slug `ml-to-cups-converter`). Bidirectional mL↔cups with US/metric/imperial standards, fraction presets, more-options, guide, and unit tests.
- `src/tools/calculators/decagram-to-gram/`: Decagram to Gram Converter (`DecagramToGramConverter`, slug `decagram-to-gram-converter`). Bidirectional dag↔g with exact factor 10, more-options, guide, and unit tests.
- `src/tools/calculators/pint-to-pound/`: Pint to Pound Conversion (`PintToPoundCalculator`, slug `pint-to-pound-conversion`). Density-based pt↔lb with US/imperial/dry pint standards, custom density for non-water ingredients, more-options, guide, and unit tests.
- `src/tools/calculators/drops-to-ml/`: Drops to mL Conversion (`DropsToMlConverter`, slug `drops-to-ml-conversion`). Bidirectional drops↔mL with assumed 20 drops/mL factor, adjustable settings, optional calibration, more-options, guide, and unit tests.
- `src/tools/calculators/pounds-and-ounces/`: Pounds and Ounces Calculator (`PoundsAndOuncesCalculator`, slug `pounds-and-ounces-calculator`). Bidirectional lb↔oz, mixed normalization, metric/stones equivalents, multi-row addition, guide, and unit tests.
- `src/tools/calculators/oz-to-cups/`: oz to Cups Converter (`OzToCupsConverter`, slug `oz-to-cups-converter`). Bidirectional fl oz↔cups with US/Imperial fl oz and multiple cup standards, fraction presets, more-options, guide, and unit tests.
- `src/tools/calculators/gallon/`: Gallon Calculator (`GallonCalculator`, slug `gallon-calculator`). Multi-field volume converter (US/Imperial/dry gallons and related units) plus density-based water-weight mode, guide, and unit tests.
- `src/tools/calculators/quarts-to-pounds/`: Quarts to Pounds Conversion (`QuartsToPoundsConverter`, slug `quarts-to-pounds-conversion`). Density-based qt↔lb with US/Imperial/dry quarts, Show Ingredient Density checkbox, more-options, guide, and unit tests.
- `src/tools/calculators/gallons-to-pounds/`: Gallons to Pounds Converter (`GallonsToPoundsConverter`, slug `gallons-to-pounds-converter`). Density-based gal↔lb with US/Imperial/dry gallons, Show Liquid Density checkbox, more-options, guide, and unit tests. Catalog left inactive.
- `src/tools/calculators/affo/`: AFFO Calculator (`AFFOCalculator`, slug `affo-calculator`). Simplified FFO and a labeled AFFO estimate for one reporting period. Interest income is not adjusted twice. Display currency only. Guide in `detail.tsx`.
