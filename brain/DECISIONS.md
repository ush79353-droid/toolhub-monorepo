# Architecture Decision Records (`DECISIONS.md`)

> **Policy:** Never silently delete or overwrite previous decisions. Add new records chronologically or mark earlier records as `Superseded by ADR-XXX`.

---

## ADR-001: Independent `frontend/` and `backend/` Applications (No npm Workspaces)
- **Date:** 2026-11-10 (Commit `5f378c9`)
- **Decision:** Migrate away from an npm-workspace monorepo into two completely independent TypeScript Node applications (`frontend/` Next.js App Router and `backend/` Express + Mongoose), each with its own `package.json`, `tsconfig.json`, and `node_modules/`.
- **Reason:** Eliminate workspace hoisting/Next.js bundling friction and keep frontend and backend independently buildable and deployable.
- **Consequences:** Shared types and Zod validation schemas are maintained separately in `frontend/src/` and `backend/src/` (must be kept manually aligned); root scripts are intentionally absent.
- **Status:** Accepted

## ADR-002: Strict Server-Side Backend Boundary (`Browser → Next.js Server → Express API → MongoDB`)
- **Date:** 2026-11-10 (`5f378c9`, enforced in `frontend/src/server/api/client.ts`)
- **Decision:** Prohibit browser components from calling Express directly. All frontend-to-backend requests flow through `server-only` Server Components or `'use server'` Server Actions using private `API_INTERNAL_URL`.
- **Reason:** Hide backend topology/URLs, enforce `HttpOnly` session handling on the Next.js server, and centralize timeout/error handling.
- **Consequences:** Client components must go through Server Actions for mutations/queries; `API_INTERNAL_URL` must never be `NEXT_PUBLIC_*`. (Binary media uploads use pre-signed S3 URLs returned via Server Action so the browser PUTs directly to S3, still never touching Express directly.)
- **Status:** Accepted

## ADR-003: Locked Brand Color Palette & Visual System
- **Date:** 2026-11-10 (`896ba49`, `9bfcd76`)
- **Decision:** Lock the 9-color teal/slate palette (`#087E8B`, `#D9F0EF`, `#163C43`, `#066773`, `#EAF7F6`, `#F7F8F6`, `#202B2D`, `#667477`, `#DCE6E5`) in `tailwind.config.ts` and `globals.css`.
- **Reason:** Maintain consistent SaaS identity across public website and isolated dark-sidebar admin console without ad-hoc theme drift.
- **Consequences:** All new public and admin UI components must consume existing Tailwind/CSS tokens rather than introducing arbitrary brand colors.
- **Status:** Accepted

## ADR-004: Database-Backed Opaque Admin Sessions with Argon2id
- **Date:** 2026-11-11 (`0f2407b`)
- **Decision:** Authenticate admins with Argon2id password hashes and 32-byte random opaque session tokens stored in MongoDB `admin_sessions` (TTL indexed) paired with an `HttpOnly` `admin_session` cookie on Next.js.
- **Reason:** Support immediate server-side session revocation on logout, password change, password reset, or account disablement without stateless JWT revocation complexity.
- **Consequences:** Every authenticated admin request verifies the session against MongoDB (`authenticateAdmin`); Edge `middleware.ts` performs fast cookie-presence gating while `admin/(dashboard)/layout.tsx` performs authoritative verification.
- **Status:** Accepted

## ADR-005: Brand Refactor from Mega Tools to Omega Calculators
- **Date:** 2026-11-11 (`136359a`)
- **Decision:** Rename user-facing brand titles, package names, logos, PWA manifest, and copy generators from "Mega Tools" to "Omega Calculators".
- **Reason:** Align platform branding with the calculator-focused product identity while keeping repository structure intact.
- **Consequences:** Package names are `omega-calculators-frontend` and `omega-calculators-backend`; legacy `mega_tools` DB default and `megatools.io` preview strings still exist in minor configs/placeholders until cleaned up.
- **Status:** Accepted

## ADR-006: Unified Self-Referential Category Tree (`category → pillar → sub_pillar`)
- **Date:** 2026-11-11 (`bf487af`, `db76e7a`)
- **Decision:** Store categories, pillars, and sub-pillars in a single `Category` collection discriminated by `kind` (`category | pillar | sub_pillar`) with `parent` ObjectId reference, and reference all three levels optionally (`pillar`, `subPillar` nullable) on `Tool`.
- **Reason:** Support the 4,351-tool / 19-category directory taxonomy cleanly with deterministic seeding (`seedKey`) and cascaded deletes.
- **Consequences:** Legacy `TOOL_CATEGORIES` enum constants (`frontend/src/lib/constants.ts`, `backend/src/constants/index.ts`) no longer match the 19 dynamic MongoDB categories and must be reconciled when wiring public routes.
- **Status:** Accepted

## ADR-007: Direct Browser-to-S3 Media Uploads via Pre-Signed URLs
- **Date:** 2026-11-11 (`bc7c46b`)
- **Decision:** Upload admin media directly from the browser to AWS S3 using short-lived (300s) pre-signed `PUT` URLs issued through Next.js Server Actions + Express, followed by Express `HeadObject` verification and `MediaAsset` persistence.
- **Reason:** Avoid proxying binary file streams through Next.js Server Actions and Express memory/body limits while still validating uploaded MIME types and sizes before persisting DB records.
- **Consequences:** Requires valid `AWS_*` environment config and S3 bucket CORS allowing `PUT` from `CORS_ORIGIN`.
- **Status:** Accepted when `STORAGE_DRIVER=s3`. The default driver is local disk. See ADR-010.

## ADR-008: Shared Version-Controlled Project Brain & Cross-Agent Rules
- **Date:** 2026-11-11
- **Decision:** Establish `brain/`, root `AGENTS.md`, `.cursor/rules/mega-tools-brain.mdc`, `.agents/rules/mega-tools-brain.md`, and Antigravity-adapted `.agents/rules/ponytail.md` while keeping `.cursor/rules/ponytail.mdc` untouched.
- **Reason:** Synchronize context, architecture boundaries, and task tracking across Developer A (Google Antigravity) and Developer B (Cursor) via Git without installing external Ponytail hooks/executables.
- **Consequences:** Both agents must read `brain/` before tasks and update `brain/` in the same commit as code changes; synchronization occurs strictly via Git commits/pulls.
- **Status:** Accepted

## ADR-009: Allowlisted Tool Component Key Mapping & Pure Client-Side Financial Engine
- **Date:** 2026-11-11
- **Decision:** Add validated `executionType` and allowlisted `componentKey` fields to `Tool` (plus `GET /api/v1/catalog/tools/:slug`), resolve components exclusively via the static allowlisted frontend registry (`src/tools/registry/`), and implement the Auto Loan Calculator with integer-cent amortization, configurable display currency (formatting only), explicit sales-tax basis selection (`after-trade-in` vs `full-price`), and full-width layout on `/tools/[slug]` when a registered tool is rendered.
- **Reason:** Keep database records authoritative for tool metadata/SEO while prohibiting arbitrary code execution from database strings, avoiding cumulative floating-point drift in amortization tables, and avoiding hidden state-specific tax assumptions.
- **Consequences:** Each newly built tool requires registering its `componentKey` in both `backend/src/modules/tools/tool.key.ts` (`APPROVED_COMPONENT_KEYS`) and `frontend/src/tools/registry/keys.ts` + `index.ts`, then assigning it to the MongoDB tool record via `/admin/tools/[id]/edit` or `npm run tool:assign`.
- **Status:** Accepted

## ADR-010: Storage driver for media files
- **Date:** 2026-11-12
- **Decision:** `STORAGE_DRIVER` selects where new media files go. `local` (default) writes `backend/uploads` and stores the public URL as `/uploads/media/<uuid>.<ext>`. `s3` keeps the signed browser `PUT`. Delete follows the stored URL, so a later switch to S3 does not strand files already on disk.
- **Reason:** S3 stays in the codebase, but the current host does not need a paid bucket. One env change moves new uploads to S3.
- **Consequences:** Local bytes go Browser → `PUT /api/media-upload` → Express `PUT /admin/media/object`. The browser still does not call Express. Existing S3 objects stay on S3. Files already saved on disk stay on disk until they are deleted or uploaded again.
- **Status:** Accepted

## ADR-011: Shared Dynamic Tool SEO + Locked Calculator Standards
- **Date:** 2026-11-12
- **Decision:** Persist optional SEO fields on the existing `Tool` model; build public metadata exclusively through shared `frontend/src/lib/seo/tool-seo.ts` + `/tools/[slug]` `generateMetadata()`; require `NEXT_PUBLIC_SITE_URL`/`SITE_URL` for production canonicals; treat Loan Calculator conventions in `brain/CALCULATOR_STANDARDS.md` and SEO rules in `brain/SEO_STANDARDS.md` as locked defaults for future calculators.
- **Reason:** Admin SEO edits must reach HTML `<head>` without per-calculator hardcoding, and future calculators must inherit one shell/SEO pipeline.
- **Consequences:** New SEO fields remain optional with documented fallbacks; unimplemented tools cannot become indexable from the Index toggle alone; agents must read the standards docs before building calculators.
- **Status:** Accepted

## ADR-012: Shared Calculator Embed System
- **Date:** 2026-11-12
- **Decision:** Provide one dynamic `/embed/[slug]` route reusing allowlisted calculator components; gate with Tool fields `embedEnabled` (default `false`), height/layout prefs, and advisory `embedAllowedDomains`; split CSP so only `/embed/*` allows third-party framing; optional `/embed.js` auto-resize with namespaced postMessage validation; lock rules in `brain/EMBED_STANDARDS.md`.
- **Reason:** Partners need copy-paste iframes without forking calculators or exposing admin chrome; embedding must be independently disableable without taking down normal tool pages.
- **Consequences:** Catalog-only tools never get blank embeds; embed pages are noindex; public iframe URLs remain reusable without signed tokens unless a future auth layer is added; agents must follow embed standards for new calculators.
- **Status:** Accepted

