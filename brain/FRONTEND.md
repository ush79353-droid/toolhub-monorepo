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
| `/tools` | `(website)/tools/page.tsx` | Renders `<Suspense>` + `ToolsDirectoryClient` (`'use client'`) using `sample-data.ts` (18 tools, 12 categories) | **Partially Implemented** (mock/sample data only) |
| `/tools/[slug]` | `(website)/tools/[slug]/page.tsx` | Server Component fetching `getPublicToolBySlug(slug)` via Express first (preserving DB SEO metadata & `indexable`), resolving allowlisted `componentKey` via `ToolWorkspace` + `tools/registry`; falls back to `sample-data.ts` | **Implemented for Auto Loan Calculator** (`AutoLoanCalculator`); legacy fallback for sample slugs |
| `/categories` | `(website)/categories/page.tsx` | Renders `CategoriesClient` (`'use client'`) using `sample-data.ts` | **Partially Implemented** (mock/sample data only) |
| `/categories/[slug]` | `(website)/categories/[slug]/page.tsx` | Server Component using `generateStaticParams()` and `sample-data.ts` | **Partially Implemented** (mock/sample data only) |
| `/about` | `(website)/about/page.tsx` | Server Component. Static editorial copy with a custom product board, mixed platform layout, and numbered principles. Category and tool totals come from `GET /catalog/categories` when reachable | **Implemented** |
| `/contact` | `(website)/contact/page.tsx` | Server page with a client form. Fields are name, email, subject, and message. Validation is client-side only, and a successful check says the message was not delivered | **Partially Implemented** (no backend submission endpoint) |
| `/privacy-policy` | `(website)/privacy-policy/page.tsx` | Static legal draft template (marked draft pending legal review) | **Partially Implemented** (draft copy) |
| `/terms-of-service` | `(website)/terms-of-service/page.tsx` | Static legal draft template (marked draft pending legal review) | **Partially Implemented** (draft copy) |
| `*` (404) | `src/app/not-found.tsx` | Custom 404 page with `Header` & `Footer` | **Implemented** |

### Known Data-Source Mismatch (Important)

- Homepage (`/`) renders live categories and featured tools from MongoDB (`/catalog/*`) and links to `/categories/${category.slug}` and `/tools/${tool.slug}`.
- `/tools/[slug]` now resolves active MongoDB tools via `getPublicToolBySlug(slug)` (including `/tools/auto-loan-calculator`) and falls back to `sample-data.ts` for legacy sample slugs.
- `/categories`, `/categories/[slug]`, `/tools`, `Header.tsx`, `MobileNavigation.tsx`, and `Footer.tsx` still read from `frontend/src/lib/sample-data.ts` (12 hardcoded categories and 18 sample tools). Live DB category slugs not in `sample-data.ts` will return 404 until category routes are wired to MongoDB.

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
| `/admin/media` | `listMediaAction`, `requestMediaUploadAction`, browser S3 `PUT`, `confirmMediaUploadAction`, `deleteMediaAction` | **Implemented** |
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

- **UI Primitives (`src/components/ui/`):** `badge.tsx`, `button.tsx`, `card.tsx`, `input.tsx`, `select.tsx`, `switch.tsx`, `tabs.tsx`, `textarea.tsx` (using `cn()` from `src/lib/utils.ts` and `class-variance-authority`).
- **Website Layout (`src/components/layout/`):** `Container.tsx` (`max-w-7xl px-4 sm:px-6 lg:px-8`), `Header.tsx`, `Footer.tsx`, `MobileNavigation.tsx`.
- **Public Shared (`src/components/shared/`):** `Breadcrumbs.tsx`, `CategoryCard.tsx`, `CategoryIcon.tsx` (Lucide icon map), `EmptyState.tsx`, `FAQAccordion.tsx`, `SearchBar.tsx`, `SectionHeading.tsx`, `ToolCard.tsx`, `ToolWorkspace.tsx` (resolves allowlisted `componentKey` from `@/tools/registry`; falls back to UI preview shell for unregistered tools).
- **Admin Components (`src/components/admin/`):**
  - `auth/AuthSplit.tsx`
  - `layout/`: `AdminDashboardShell.tsx`, `AdminSidebar.tsx`, `AdminMobileSidebar.tsx`, `AdminHeader.tsx`, `AdminBreadcrumbs.tsx`, `admin-nav.tsx` (grouped collapsible menu: `Catalog`, `Insights`, `System`)
  - `dashboard/`: `StatCard.tsx`, `DashboardCharts.tsx`, `PopularToolsList.tsx`, `QuickActions.tsx`, `RecentActivity.tsx`
  - `forms/`: `FormSection.tsx`, `CategoryForm.tsx`, `ToolForm.tsx`
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
- `src/server/tools/actions.ts` — `listToolsAction`, `listToolPlacementAction`, `getToolAction`, `saveToolAction`, `deleteToolAction` (supports `executionType` and `componentKey`).
- `src/server/catalog/tools.ts` — `getPublicToolBySlug` (`React.cache` + `server-only`, calls `GET /catalog/tools/:slug`).

---

## 6. Tool Registry (`src/tools/`)

- `src/tools/types.ts`: Defines `ToolComponentProps`, `ToolComponent`, `RegisteredToolDefinition`, `ToolRegistryMap`.
- `src/tools/registry/keys.ts`: Pure allowlist of approved component keys (`APPROVED_COMPONENT_KEYS = ['AutoLoanCalculator']`, `isApprovedComponentKey`) shared across Server Components and `ToolForm.tsx`.
- `src/tools/registry/index.ts`: `'use client'` registry mapping allowlisted `componentKey` strings to validated React `ToolComponent`s (`registerToolComponent`, `getToolComponent`, `hasToolComponent`, `getRegisteredComponentKeys`). Currently registers `AutoLoanCalculator`.
- `src/tools/calculators/auto-loan/`: Modular Auto Loan Calculator implementation (`types.ts`, `validation.ts`, `calculation.ts`, `calculation.test.ts`, `content.ts`, `AutoLoanForm.tsx`, `AutoLoanResults.tsx`, `AutoLoanChart.tsx`, `AmortizationTable.tsx`, `AutoLoanCalculator.tsx`).
- Remaining category folders (`ai`, `audio`, `converters`, `developer`, `image`, `pdf`, `seo`, `video`) currently contain only `.gitkeep`.
- **Legacy Metadata Constants Drift:** `frontend/src/lib/constants.ts` defines 12 `TOOL_CATEGORIES` (`calculators`, `converters`, `pdf`, `image`, `text`, `seo`, `developer`, `ai`, `video`, `audio`, `security`, `productivity`), while `backend/src/constants/index.ts` defines 9 `TOOL_CATEGORIES`, and the seeded MongoDB hierarchy (`tools-directory-hierarchy.json`) uses 19 domain categories (`Finance & Business`, etc.).

---

## 7. Server vs. Client Components & Styling Conventions

- **Server Components (default):** Layouts (`RootLayout`, `WebsiteLayout`, `AdminDashboardLayout`), homepage (`(website)/page.tsx`), detail pages (`categories/[slug]/page.tsx`, `tools/[slug]/page.tsx`), `admin/profile/page.tsx`, informational pages.
- **Client Components (`'use client'`):** Interactive directory search/filters, admin login/reset forms, all interactive admin CRUD views/forms/tables, sidebar/header state, `FAQAccordion`, `SearchBar`, `ToolWorkspace`, `ContactFormClient`.
- **Styling:** Tailwind utility classes backed by semantic HSL CSS variables in `src/app/globals.css` plus explicit `brand.*` tokens in `tailwind.config.ts`. Prettier enforces `singleQuote: true`, `semi: true`, `printWidth: 100`, `tabWidth: 2`.
- **Note on `<img>` tags:** Several components use native `<img>` rather than `next/image` (including dynamic S3 URLs and logos), producing `@next/next/no-img-element` warnings during `npm run lint`.

