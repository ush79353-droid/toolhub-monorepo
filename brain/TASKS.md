# Shared Task Board (`TASKS.md`)

> **Rules:** Keep Task IDs stable (`INFRA-*`, `BE-*`, `FE-*`, `TOOL-*`). Never delete or renumber IDs. Do not invent owners unless assigned.

---

## Planned

| ID | Description | Owner | Status | Relevant Files | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `BE-01` | Install missing backend dependencies (`nodemailer`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`) locally and verify `backend` `npm run type-check` passes cleanly | Unassigned | Planned | `backend/package.json`, `backend/src/services/email.service.ts`, `backend/src/services/s3.service.ts` | — |
| `BE-02` | Add public catalog endpoints for paginated tools list/search, category detail with pillars/tools, and single active tool by slug; ensure `listFeaturedTools` filters `isActive: true` | Unassigned | Planned | `backend/src/modules/catalog/`, `backend/src/modules/tools/tool.model.ts` | `BE-01` |
| `FE-01` | Wire public `/tools`, `/tools/[slug]`, `/categories`, `/categories/[slug]`, `Header`, `Footer`, and `MobileNavigation` to live `/api/v1/catalog/*` endpoints instead of `sample-data.ts` | Unassigned | Planned | `frontend/src/app/(website)/`, `frontend/src/components/layout/`, `frontend/src/components/tools/`, `frontend/src/components/categories/` | `BE-02` |
| `TOOL-01` | Implement real client-side calculator/utility components under `frontend/src/tools/` and register them in `frontend/src/tools/registry/index.ts`; wire `ToolWorkspace` to resolve registered components | Unassigned | Planned | `frontend/src/tools/registry/index.ts`, `frontend/src/tools/*`, `frontend/src/components/shared/ToolWorkspace.tsx` | `FE-01` |
| `BE-03` | Implement admin staff management (`backend/src/modules/users/`) and enforce `requireRole` RBAC across sensitive admin endpoints; wire `/admin/users` | Unassigned | Planned | `backend/src/modules/users/`, `backend/src/middleware/auth.middleware.ts`, `frontend/src/app/admin/(dashboard)/users/page.tsx` | — |
| `BE-04` | Implement backend audit logging (`activity-logs`) and telemetry/analytics (`backend/src/modules/analytics/`) to replace `admin-mock-data.ts` on `/admin`, `/admin/analytics`, and `/admin/activity-logs` | Unassigned | Planned | `backend/src/modules/analytics/`, `frontend/src/app/admin/(dashboard)/analytics/`, `frontend/src/app/admin/(dashboard)/activity-logs/` | — |
| `BE-05` | Implement CMS pages, global SEO settings, system settings, and third-party integration configuration persistence | Unassigned | Planned | `backend/src/modules/seo/`, `backend/src/modules/integrations/`, `frontend/src/app/admin/(dashboard)/pages/`, `seo/`, `settings/`, `integrations/` | — |
| `FE-02` | Wire `/contact` form submission to a real backend email/inquiry endpoint and update draft legal pages after review | Unassigned | Planned | `frontend/src/components/contact/ContactFormClient.tsx`, `frontend/src/app/(website)/privacy-policy/`, `terms-of-service/` | — |
| `INFRA-02` | Clean up config drift (`SESSION_TTL_HOURS`, `SESSION_REMEMBER_ME_DAYS`, `COOKIE_SECURE`, residual `mega_tools` / `megatools.io` strings) | Unassigned | Planned | `backend/src/config/env.ts`, `backend/src/modules/auth/admin-auth.service.ts`, `frontend/src/server/auth/session.ts`, `frontend/src/config/site.ts` | — |

---

## In Progress

*No code implementation tasks currently active.*

---

## Blocked

*None currently.*

---

## Completed

| ID | Description | Owner | Status | Relevant Files | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `INFRA-00` | Initialize project and restructure into independent `frontend/` and `backend/` applications | Bilal Ajmery | Completed | `frontend/`, `backend/`, `.gitignore` | — |
| `FE-00` | Build public website UI (9 pages) and admin dashboard UI shell (13 pages) with locked teal palette | Bilal Ajmery | Completed | `frontend/src/app/`, `frontend/src/components/`, `frontend/tailwind.config.ts` | `INFRA-00` |
| `AUTH-01` | Implement admin auth (`AdminUser`, `AdminSession`, Argon2id, `HttpOnly` cookie, Edge + Server guards, rate limits, SMTP password reset) | Bilal Ajmery / sameer52718 | Completed | `backend/src/modules/auth/`, `backend/src/modules/admins/`, `backend/src/services/email.service.ts`, `frontend/src/server/auth/` | `INFRA-00` |
| `BRAND-01` | Refactor branding from Mega Tools to Omega Calculators + add PWA manifest and icons | sameer52718 | Completed | `frontend/package.json`, `backend/package.json`, `frontend/src/app/manifest.json`, `frontend/public/` | `FE-00` |
| `CAT-01` | Implement 3-level Category/Pillar/Sub-pillar CRUD, admin pages, and `categories:seed` CLI | sameer52718 | Completed | `backend/src/modules/categories/`, `backend/src/scripts/seed-categories.ts`, `frontend/src/app/admin/(dashboard)/categories/` | `AUTH-01` |
| `MEDIA-01` | Implement AWS S3 pre-signed media upload/list/delete and `/admin/media` library UI | sameer52718 | Completed | `backend/src/modules/media/`, `backend/src/services/s3.service.ts`, `frontend/src/app/admin/(dashboard)/media/` | `AUTH-01` |
| `TOOL-00` | Implement Tool catalog CRUD, placement validation, icon picker, `tools:seed` (4,351 tools), and initial `/catalog/*` homepage routes | sameer52718 | Completed | `backend/src/modules/tools/`, `backend/src/modules/catalog/`, `backend/src/scripts/seed-tools.ts`, `frontend/src/app/admin/(dashboard)/tools/`, `frontend/src/app/(website)/page.tsx` | `CAT-01`, `MEDIA-01` |
| `INFRA-01` | Establish shared Project Brain (`brain/`), `AGENTS.md`, `.cursor/rules/mega-tools-brain.mdc`, and Antigravity rules (`.agents/rules/ponytail.md`, `mega-tools-brain.md`) | — | Completed | `AGENTS.md`, `.agents/rules/`, `.cursor/rules/mega-tools-brain.mdc`, `brain/` | — |
