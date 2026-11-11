# Project Overview — Mega Tools / Omega Calculators

## 1. Purpose & Vision

**ToolHub** is an online tools and calculators platform designed to deliver fast, privacy-conscious, browser-accessible utilities across financial, mathematical, conversion, document, image, developer, SEO, and productivity domains, paired with a secure administrative console for managing the tool catalog, hierarchical taxonomy, media assets, and platform operations.

### Naming & Rebranding Context (Verified)

- **Origin / Historical Name:** The project was initialized as **ToolHub** / **Mega Tools** (`origin`: `https://github.com/ush79353-droid/toolhub-monorepo.git`, database default `mega_tools`).
- **Current Codebase Brand (`136359a`, 2026-11-11):** Refactored across `frontend/` and `backend/` packages, layouts, metadata, PWA manifest, email templates, and copy generators to **Omega Calculators** (`omega-calculators-frontend`, `omega-calculators-backend`).
- **Residual Mega Tools References in Code:**
  - `backend/.env.example` and `backend/src/config/env.ts` (`MONGODB_URI` default `mongodb://localhost:27017/mega_tools`)
  - `frontend/src/config/site.ts` (`links.github: 'https://github.com/mega-tools/platform'`)
  - `frontend/src/components/admin/layout/AdminHeader.tsx` (fallback display email `admin@megatools.io`)
  - `frontend/src/app/admin/(dashboard)/seo/page.tsx` and `settings/page.tsx` (placeholder URLs/emails `megatools.io`)
- Both **Mega Tools** (initiative/platform name) and **Omega Calculators** (current codebase brand) refer to this same repository.

---

## 2. Major Platform Surfaces

### A. Public Website (`frontend/src/app/(website)/`)

| Capability | Status | Notes |
| :--- | :--- | :--- |
| Homepage (`/`) | **Implemented** | Server-rendered page fetching active categories (`/catalog/categories`) and featured tools (`/catalog/featured`) from Express/MongoDB |
| Tools Directory (`/tools`) | **Partially Implemented** | Interactive search & category filtering UI (`ToolsDirectoryClient`), currently reading static `sample-data.ts` (18 sample tools) rather than MongoDB |
| Tool Detail & Workspace (`/tools/[slug]`) | **Partially Implemented** | Static `sample-data.ts` lookup; `ToolWorkspace` renders a UI architecture preview with state switcher (`Success` / `Loading` / `Error`) rather than real tool computation engines |
| Categories Directory (`/categories`, `/categories/[slug]`) | **Partially Implemented** | UI implemented against `sample-data.ts` (12 sample categories), not yet backed by the 19 seeded MongoDB categories |
| Informational & Legal Pages (`/about`, `/contact`, `/privacy-policy`, `/terms-of-service`) | **Partially Implemented** | Static content pages; `/contact` validates client-side only without backend email delivery; legal pages are explicitly labeled draft templates |

### B. Admin Dashboard (`frontend/src/app/admin/`)

| Capability | Status | Notes |
| :--- | :--- | :--- |
| Admin Authentication (`/admin/login`, `/admin/forgot-password`, `/admin/reset-password`) | **Implemented** | Argon2id login, MongoDB-backed sessions, `HttpOnly` cookie, rate limiting, account lockout, SMTP reset tokens |
| Profile & Password Management (`/admin/profile`) | **Partially Implemented** | Name update and password change (with full session revocation) are live; the TOTP 2FA switch is UI state only |
| Category Hierarchy Management (`/admin/categories`, `new`, `[id]/edit`) | **Implemented** | 3-level tree (`category → pillar → sub_pillar`) CRUD, search, pagination, cascade deletion |
| Media Library (`/admin/media`) | **Implemented** | Direct browser PUT to pre-signed AWS S3 URLs, HEAD confirmation, MongoDB `MediaAsset` persistence, list/filter/delete |
| Tool Catalog Management (`/admin/tools`, `new`, `[id]/edit`) | **Implemented** | Catalog CRUD, placement (`category`, optional `pillar`, optional `sub_pillar`), S3 media icon selection, SEO fields, active/featured toggles |
| Dashboard Overview, Analytics, Activity Logs, CMS Pages, Integrations, SEO, Settings, Users | **Partially Implemented (UI Preview)** | Full UI layouts built using `frontend/src/lib/admin-mock-data.ts` and `PendingNotice` banners; backend endpoints/models are not yet implemented |

---

## 3. Tool Execution Types

Defined in `frontend/src/types/tool.ts`, `backend/src/types/tool.ts`, and `frontend/src/lib/constants.ts`:

1. **`client`** — In-browser execution using client JavaScript/browser APIs with zero server payload transmission (primary architectural model for calculators, unit converters, formatters, etc.).
2. **`server`** — Server-side execution pipeline (for heavier processing or protected operations; backend tool execution endpoints are **Planned**).
3. **`third-party`** — External API-backed execution proxied via the Express backend so secrets are never exposed to the browser (**Planned**).

> **Note:** `frontend/src/tools/registry/index.ts` provides a typed `ToolRegistryMap` (`registerToolComponent`, `getToolComponent`), and `frontend/src/tools/` has 9 category folders (`ai`, `audio`, `calculators`, `converters`, `developer`, `image`, `pdf`, `seo`, `video`), all currently containing only `.gitkeep`. Actual executable calculator/tool components are **Planned**.

---

## 4. Seeded Catalog Scale (Backend Data)

- `backend/data/tools-directory-hierarchy.json`: 19 top-level categories, 155 extracted pillar headings (source PDF notes 156 in TOC / 4,351 total tools).
- `backend/data/tools-catalog.json`: 4,351 tool definitions (`name`, `category`, `pillar`, `subPillar`).
- Seeding scripts (`categories:seed`, `tools:seed`) populate MongoDB `Category` and `Tool` collections (seeded tools default to `isActive: false`, `indexable: false`, `isFeatured: false`).

---

## 5. Current Development Goals

1. **Maintain strict dual-app discipline and shared Brain synchronization** across Antigravity and Cursor workflows.
2. **Resolve backend local dependency/type-check parity** (install newly added `nodemailer` & `@aws-sdk/*` packages locally and verify clean `tsc --noEmit`).
3. **Wire public catalog routes** (`/tools`, `/tools/[slug]`, `/categories`, `/categories/[slug]`, and header/footer navigation) to live Express/MongoDB endpoints instead of `sample-data.ts`.
4. **Implement and register real tool components** under `frontend/src/tools/` via `tools/registry/index.ts` and connect `ToolWorkspace`.
5. **Implement remaining backend admin modules** (`users`, `analytics`, `activity-logs`, `seo`, `pages`, `integrations`, `settings`) to replace `admin-mock-data.ts` previews.
