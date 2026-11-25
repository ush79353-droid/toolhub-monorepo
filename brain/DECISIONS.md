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
- **Consequences:** Each newly built tool requires registering its `componentKey` in both `backend/src/modules/tools/tool.key.ts` (`APPROVED_COMPONENT_KEYS`) and `frontend/src/tools/registry/keys.ts` + `index.ts`, then assigning it to the MongoDB tool record via `/admin/tools/[id]/edit` or `npm run tool:assign`. ADR-018 adds `registry/details.ts` and requires `notFound()` when the key is unregistered.
- **Status:** Accepted. Registration mechanics extended by ADR-018 (2026-11-13).

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

## ADR-013: Tool Detail Page Master Standard + Crawl Surfaces
- **Date:** 2026-11-12
- **Decision:** Lock `/tools/[slug]` architecture in `brain/TOOL_DETAIL_PAGE_STANDARDS.md`; ship Next.js `robots.ts` + `sitemap.ts` that include only implemented, indexable tools; related calculators link only allowlisted implemented tools; FAQ JSON-LD emits when FAQs are visible on two-column guides; Embed dialog uses portal + focus trap.
- **Reason:** Production crawl/index hygiene and a single Definition of Done for every future calculator page.
- **Consequences:** Agents must follow Tool Detail Page standards before shipping new calculators; sitemap list of implemented slugs must be extended when new registry tools launch until a bulk catalog endpoint exists.
- **Status:** Accepted (expanded 2026-11-12 by ADR-014)

## ADR-014: Loan Calculator as Official Master Tool Detail Page + New-Tool Playbook
- **Date:** 2026-11-12
- **Decision:** Declare Loan Calculator (`/tools/loan-calculator`, `LoanCalculator`) the **official master** visual and architectural reference for every future tool detail page. Authoritative docs: `brain/TOOL_DETAIL_PAGE_STANDARDS.md` + `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`. Both Cursor (`.cursor/rules/tool-detail-page-standards.mdc`) and Antigravity (`.agents/rules/tool-detail-page-standards.md`) must auto-load these; `AGENTS.md` lists them as mandatory before new calculator work. Tool-specific math/inputs/results/copy may differ; shared shell (grid, sticky, SEO, ads, embed, a11y) must not be redesigned without a new ADR.
- **Reason:** Avoid re-explaining design/layout/SEO/ads/embed patterns for each new tool; keep one source of truth for both IDEs.
- **Consequences:** New tools follow the playbook; agents must not invent parallel page layouts or duplicate sticky/SEO/ad/embed systems; standards were extracted from live Loan page + source (visual + code verified 2026-11-12).
- **Status:** Superseded by ADR-016 (2026-11-13)

## ADR-012: Shared Calculator Embed System
- **Date:** 2026-11-12
- **Decision:** Provide one dynamic `/embed/[slug]` route reusing allowlisted calculator components; gate with Tool fields `embedEnabled` (**default `true`**; missing → enabled; only explicit `false` disables), height/layout prefs, and advisory `embedAllowedDomains`; split CSP so only `/embed/*` allows third-party framing; optional `/embed.js` auto-resize with namespaced postMessage validation; lock rules in `brain/EMBED_STANDARDS.md`.
- **Reason:** Partners need copy-paste iframes without forking calculators or exposing admin chrome; embedding must be independently disableable without taking down normal tool pages. Product policy is opt-out, not opt-in.
- **Consequences:** Catalog-only / inactive tools still do not render working embeds; public Embed button appears for implemented active tools by default; embed pages are noindex; public iframe URLs remain reusable without signed tokens unless a future auth layer is added; agents must follow embed standards for new calculators.
- **Status:** Accepted (policy corrected 2026-11-12 from default-OFF to default-ON)

## ADR-015: Two-Column Tool Detail — Calculator Left, Sidebar Widgets Right, Unified Scroll
- **Date:** 2026-11-13
- **Decision:** On desktop (`lg+`), the shared `/tools/[slug]` shell uses a full-width intro card, then a two-column grid: left (`minmax(0,2fr)`, ~66%) holds calculator + TOC + guide; right (`minmax(280px,1fr)`, ~34%) holds `ToolDetailSidebar` widgets (More tools, Related in other topics, dark country-rules pills) with `position: sticky; top: 84px` and viewport-capped max-height. Left calculator column stays in normal flow (no sticky). Mobile/tablet still shows calculator column first (`order-1`).
- **Reason:** Product preference for a wider calculator column, Calculators.com-style right-rail boxes that stay visible while reading the guide, and page-level scroll on the left.
- **Consequences:** Master shell in `page.tsx` + `ToolDetailSidebar.tsx`; standards docs describe left calculator/guide + sticky right sidebar widgets; do not move related lists back into the intro card without a new ADR.
- **Status:** Accepted

## ADR-016: Auto Loan Calculator as Final Master Tool Detail Page
- **Date:** 2026-11-13
- **Decision:** Promote the latest Auto Loan Calculator (`/tools/auto-loan-calculator`, `AutoLoanCalculator`) to the **final approved official master** visual and architectural reference for every OmegaCalculators tool detail page. Authoritative docs: `brain/TOOL_DETAIL_PAGE_STANDARDS.md` + `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`. Cursor + Antigravity tool-detail rules and `AGENTS.md` must name Auto Loan as master. Loan Calculator remains a peer implementation that follows the same shared shell; its tool-specific fields/math stay independent.
- **Reason:** Product approved additional Auto Loan UI/UX work (full-width intro, wider calculator column, sticky `ToolDetailSidebar`, form/results chrome) as the permanent design system for future tools.
- **Consequences:** Supersedes ADR-014’s master designation; agents must inspect Auto Loan (not Loan) before building new calculators; do not redesign Auto Loan’s approved appearance; do not create competing shells.
- **Status:** Accepted

## ADR-017: Daily currency rates from one USD quote
- **Date:** 2026-11-13
- **Decision:** Store `CurrencyRate` and `CurrencyRateHistory` in Mongo. The backend process schedules the fetch for local midnight (`0 0 * * *`) with `setTimeout`. One ExchangeRate-API `latest/USD` response is divided into a conversion map for each tracked base. No Country model and no extra scheduler package.
- **Reason:** The provider already returns every pair against USD, so a per-currency request loop would spend the key without changing the stored tables.
- **Consequences:** The job runs only while the API process is up at midnight. `npm run currency:fetch` runs the same save on demand. An empty `CURRENCY_EXCHANGE_API_KEY` skips the request.
- **Update (2026-11-13):** The timer is `node-cron` schedule `0 0 * * *`, replacing the earlier `setTimeout` loop.
- **Status:** Accepted

## ADR-018: Locked calculator module (lazy registry + per-tool detail)
- **Date:** 2026-11-13
- **Decision:** Every new calculator uses the folder, pure `calculation.ts` / `validation.ts`, `detail.tsx`, and dual registration described in `ARCHITECTURE.md` §7 and `CALCULATOR_STANDARDS.md` §1. `registry/index.ts` loads one calculator chunk with `React.lazy`. `registry/details.ts` loads only that tool's page copy. `/tools/[slug]` calls `notFound()` when the key is not registered. The mandatory ship checklist is in `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`. Cursor (`.cursor/rules/calculator-standards.mdc`) and Antigravity (`.agents/rules/calculator-standards.md`) both require that checklist.
- **Reason:** Commits `a75ccbe` and `ebf68df` removed sample tool pages and split guides out of the shared page. Later calculators already follow that shape. Agents were still reading an architecture doc that described empty category folders and a preview registry.
- **Consequences:** Does not supersede ADR-016. Auto Loan remains the visual master. SEO, embed, and ad standards stay in their own docs. Existing gaps (`hundred-day` types, shared widgets still under `auto-loan/`, duplicated allowlists) stay until a task asks to refactor them. New calculators do not copy those gaps.
- **Update (2026-11-13):** `twelve-volt-wire` now has `calculation.test.ts`. Shared resistivity helpers remain in `electrical/conductor.ts`.
- **Status:** Accepted

## ADR-019: Three-commit delivery for new calculators
- **Date:** 2026-11-13
- **Amended:** 2026-11-17 (two-commit); **2026-11-18** (three-commit)
- **Decision:** Deliver each successfully developed calculator as exactly **three meaningful commits**, then push all three to `origin/development`. (1) **UI** — calculator UI, components, fields, and layout. (2) **Engine** — calculation formulas, validation, results wiring, tests, and Phase 2 FX where applicable (omit FX files when not used; never invent an empty FX commit). (3) **Registration & cleanup** — frontend/backend registration, sitemap, authorized MongoDB `tool:assign` / activation, SEO, Brain docs (`CURRENT_STATE.md`, `TASKS.md`, `CHANGELOG.md`, ADRs), temporary-file cleanup, and final delivery cleanup — always last. Stage only the current calculator/task. Never include colleague or unrelated files. Never create empty, duplicate, padded, or artificial commits. If development is skipped or blocked, create no unnecessary commits. The delivery report lists all three commit hashes separately and the checks run.
- **Reason:** Reviewers need separable UI, math/validation, and publish/activation history without returning to unbounded milestone padding. Three fixed meaningful commits match OmegaCalculators delivery practice better than a single tool blob plus a Brain-only commit.
- **Consequences:** Does not supersede ADR-016 or ADR-018. The visual shell and the calculator module stay locked. Do not register a calculator key or activate Mongo before the UI and engine commits exist. Non-calculator work still keeps its Brain update in the same commit as the code. Never force-push or rewrite shared history. Cursor (`.cursor/rules/git-commits.mdc`) and Antigravity (`.agents/rules/git-commits.md`) both apply this rule. Supersedes the 2026-11-17 two-commit amendment and the earlier size-banded milestone sequence (small 1–2 / medium 2–3 / large 3–5).
- **Status:** Accepted

## ADR-020: Server-side tool development audit
- **Date:** 2026-11-13
- **Decision:** `/tools-audit` is an admin-only page. The browser never reads the source tree. A Next.js server action scans `frontend/src/tools` plus the shared `/tools/[slug]` route, classifies every MongoDB tool, and Express persists `Tool.isDeveloped` and a `ToolAudit` report. If the source tree is absent, the action uses `frontend/src/generated/component-manifest.json`. Needs Review does not change a stored `isDeveloped` value. The schema default `true` is only the initial value.
- **Reason:** The catalog has thousands of tools and only a handful of registered calculators. Development status has to come from the registry, exports, and route wiring, not from the default boolean.
- **Consequences:** Re-running the audit is idempotent. The first saved audit has no regression baseline. Shared component keys are reported and are not automatic failures. The audit does not execute calculator math. Does not supersede ADR-016, ADR-018, or ADR-019.
- **Status:** Accepted

## ADR-021: Calculators reuse the stored currency rates
- **Date:** 2026-11-13
- **Decision:** A calculator that converts money uses the ADR-017 `CurrencyRate` documents and no other rate source. The stored map is units of each currency per 1 unit of that document's base, and the base rate is 1. `converted = amount * rate[target] / rate[source]`. Round the money result once to the target's ISO minor units. A calculator that only labels one currency keeps using `CurrencySelect` and does not convert. The pure engine does not import Mongo, HTTP, or React.
- **Reason:** The daily ExchangeRate-API job already stores the tables. Per-calculator fetches would duplicate the key, the cron, and the map.
- **Consequences:** Does not supersede ADR-016, ADR-017, ADR-018, or ADR-019. Phase 1 (2026-11-16) added the shared Express read and Next.js loader. Phase 2 (2026-11-16) added pure `convertCurrency`, `MoneyValue` / `useConvertibleMoneyField`, and `CurrencyRatesProvider`. Per-calculator wiring is a later opt-in task. Load the snapshot once per page. Show `fetchedAt`. A timestamp older than 48 hours is stale and is still used. A missing code is unavailable, not 1:1. Failed provider responses already skip the write; do not change that job in a calculator task. Cursor (`.cursor/rules/currency-conversion.mdc`) and Antigravity (`.agents/rules/currency-conversion.md`) both apply this rule.
- **Status:** Accepted

## ADR-022: Developed calculators are activated before delivery
- **Date:** 2026-11-14
- **Decision:** A calculator is delivered only when its existing catalog row is active and `/tools/{slug}` renders the registered component. Registration comes first: module, `keys.ts`, lazy `registry/index.ts`, `registry/details.ts`, and `backend/.../tool.key.ts`. Then set `isActive` on that one MongoDB tool. Set `isDeveloped` only when the field is already on the schema. `embedEnabled` stays on unless an admin sets it false. The slug goes in `IMPLEMENTED_TOOL_SLUGS`. Sitemap inclusion still requires `isActive`, `indexable`, and `sitemapInclude`.
- **Reason:** A registered calculator that stays inactive, or a catalog row activated with no component, cannot be tested on the public site.
- **Consequences:** Does not supersede ADR-016, ADR-017, ADR-018, ADR-019, or ADR-021. Do not insert a second catalog row. Do not activate a placeholder. Do not turn an admin-disabled tool back on unless the task says so. An empty or unregistered `componentKey` keeps the public route at `notFound()`. Cursor (`.cursor/rules/tool-activation.mdc`) and Antigravity (`.agents/rules/tool-activation.md`) both apply this rule.
- **Amendment (2026-11-25):** Do not add a tool slug to a sitemap file. `/sitemap.xml` is an index. Static pages keep `lastModified` in `frontend/src/config/static-sitemap.ts`, and active category hubs share `/sitemap/static.xml`. Each pillar is `/sitemap/{pillarSlug}.xml`. A tool URL is included only when `isActive`, `indexable`, `sitemapInclude`, a published SEO draft, and a registered component all hold. Tools with no pillar go in `/sitemap/unassigned.xml`.
- **Amendment (2026-11-25, sitemap nesting):** The index is static, then categories. `/sitemap/{category}.xml` is an index: tools with no pillar, then each pillar. A pillar with subpillars is an index of its direct tools, then each subpillar urlset. A pillar with no subpillars is a urlset of its tools. There is no `unassigned` file.
- **Amendment (2026-11-25, no tools.xml):** Category and pillar files list their own tool URLs. Child sitemap links come after those URLs. A separate `tools.xml` is not generated.
- **Status:** Accepted

## ADR-023: Screenshot-First Functional Parity, Minimal UI Complexity, and Verified Automatic Activation
- **Date:** 2026-11-14
- **Decision:** Whenever a calculator is requested with a reference screenshot or specification, that screenshot defines the authoritative **functional scope**. Auto Loan Calculator (`/tools/auto-loan-calculator`) remains the **visual design master** (typography, colors, tokens, input heights, card styling, page shell), but is **never the functional master**. ADR-018 remains the **code architecture master**. Do not copy Auto Loan's inputs, advanced drawers, charts, or payment dashboards into unrelated calculators. Keep interfaces as simple as the reference screenshot requires. Do not copy copyrighted article text, branding, ads, or visual assets from the reference.
  - **Inputs:** Include only fields present in the reference screenshot or strictly required for mathematical safety. Conditional/advanced settings (such as compounding and fees) remain hidden behind checkboxes or disclosures until enabled. If the screenshot shows four fields, implement those four fields.
  - **Currency:** Inject `CurrencySelect` only when the screenshot explicitly includes currency selection, the user asks for it, or real currency conversion is essential. Do not attach currency selectors to calculators such as absenteeism percentage, BMI, age, percentages, or ordinary unit conversions. Fixed-currency calculators format numbers consistently without a dropdown. Real conversion still uses ADR-017 rates through ADR-021.
  - **Results:** Match the actual complexity of the calculator. Prioritize the primary answer, essential supporting metrics, and brief explanations. Do not force extra donut charts, comparison bars, or sprawling metric dashboards. Detailed schedules or breakdowns remain behind optional disclosure controls (collapsed by default). A separate `Results.tsx` file must not invent oversized result cards merely because the architecture requires that file.
  - **Parity check:** Before marking a calculator complete, compare field-by-field against the supplied screenshot. Report any justified differences. Do not mark complete if important screenshot functionality is missing. Mathematical accuracy must never be sacrificed for visual simplicity.
  - **Verified automatic activation (extends ADR-022):** After the module, registry, tests, and route check succeed, set `isDeveloped: true` (when the schema has the field), set `isActive: true` under the existing publishing policy, and set `indexable: true` when the tool is eligible and no explicit admin noindex restriction exists. Verify sitemap eligibility, category/search visibility, and embed unless explicitly disabled. Preserve explicit admin-disabled, draft, private, or noindex decisions and report them as activation blockers. A calculator is not delivered until `/tools/{slug}` is accessible for testing, or an explicit activation blocker is reported. Do not activate missing, incomplete, or broken calculators.
- **Reason:** Prevent calculators from becoming bloated, over-engineered, and cluttered with unrequested inputs, extra modes, and heavy dashboards — and prevent finished calculators from remaining inactive and untestable on the public site. Accurate mathematics, clean UI, minimal necessary fields, reliable functionality, and verified public activation are the permanent priorities for Cursor and Antigravity.
- **Consequences:** Does not supersede ADR-016 (visual shell), ADR-017/021 (currency), ADR-018 (module layout), ADR-019 (three-commit delivery), or ADR-022 (activation). Strengthens ADR-022 with an explicit verified activation gate tied to screenshot-first delivery. Every future calculator must pass the Screenshot-First Functional Parity & Simplicity checklist and the verified activation checklist before delivery. Cursor (`.cursor/rules/calculator-standards.mdc`, `.cursor/rules/tool-activation.mdc`) and Antigravity (`.agents/rules/calculator-standards.md`, `.agents/rules/tool-activation.md`) both apply this rule.
- **Status:** Accepted

## ADR-024: Single reusable `tool:assign` CLI (no per-tool assign scripts)
- **Date:** 2026-11-17
- **Decision:** Catalog component assignment and post-verify content updates use **only** `backend` `npm run tool:assign` → `assign-tool-component.ts`. Agents pass tool content via CLI flags (`--slug`, `--component`, `--id`, `--name`, `--short-description`, `--meta-title`, `--meta-description`, optional `--expected-pillar` / `--expected-subpillar`, optional activate/indexable flags). Creating `backend/src/scripts/assign-*-tool.ts`, `_tmp-*`, or one-off lookup scripts for a single tool is forbidden. Permanent keepers remain seeds, publish, admin bootstrap, currency fetch, and category helpers.
- **Reason:** Hundreds of one-time assign scripts duplicated the same Mongo guards and cluttered the scripts folder; a single parameterized CLI matches Ponytail and ADR-022 activation without file sprawl.
- **Consequences:** Does not supersede ADR-016–023. Extends ADR-022 activation with a locked assign path. Cursor (`.cursor/rules/tool-activation.mdc`) and Antigravity (`.agents/rules/tool-activation.md`) both enforce this. Preserve `isActive` / `indexable` / `isFeatured` by default; only flip with explicit flags when the task allows.
- **Status:** Accepted

## ADR-025: Mandatory temporary file cleanup
- **Date:** 2026-11-18
- **Decision:** Every calculator development, audit, repair, and debugging task must end with safe cleanup of **only** that task’s temporary artifacts. Prefer existing project utilities and read-only commands over temp scripts. When temps are necessary, create them outside the repo when possible, track them, and delete them as soon as unused. Before finishing, run `git status --short`, remove only this-task temps, and report `Temporary files cleaned: YES/NO`. Never delete pre-existing, colleague, or unknown untracked files. Never use `git clean -fd`, `rm -rf` on project directories, or Git reset for cleanup.
- **Reason:** One-off scripts, logs, reports, and backups left in the tree create noise, merge risk, and accidental deletion of legitimate work. Cleanup must be mandatory and narrowly scoped.
- **Consequences:** Does not supersede ADR-016–024. Complements ADR-024 (no per-tool assign scripts) and Ponytail minimalism. Cursor (`.cursor/rules/temporary-file-cleanup.mdc`) and Antigravity (`.agents/rules/temporary-file-cleanup.md`) both always apply. `AGENTS.md` After Every Task and the New Tool playbook DoD require the cleanup report line.
- **Status:** Accepted

## ADR-026: `tool.key.ts` allowlist self-check must use a loop
- **Date:** 2026-11-21
- **Decision:** When registering a calculator, append the new key once to `APPROVED_COMPONENT_KEYS` in `backend/src/modules/tools/tool.key.ts`. The direct-run self-check must iterate that array with a `for` loop (plus a separate negative `EvilEval` check). Rebuilding or extending a mega `||` / `&&` chain of `!isApprovedComponentKey(...)` calls is forbidden.
- **Reason:** TypeScript binds nested logical expressions recursively. A chain of hundreds of keys caused `RangeError: Maximum call stack size exceeded` during `backend` `tsc` / `npm run build`.
- **Consequences:** Does not change the allowlist semantics for `tool:assign` or admin validation. Extends ADR-009 / ADR-022 / ADR-024 registration. Enforced by `.cursor/rules/tool-key-allowlist.mdc`, `.agents/rules/tool-key-allowlist.md`, and the tool-activation rules.
- **Status:** Accepted

## ADR-027: Admin-approved SEO drafts for tool guides
- **Date:** 2026-11-24
- **Decision:** Finance & Business SEO runs as admin campaigns. DataForSEO supplies keyword and SERP facts. OpenAI drafts a structured guide. Drafts stay off the public page until an admin publishes. A published draft replaces that tool’s file guide, TOC, and visible FAQ schema. Publish may update meta title, description, keywords, the matching social title/description, and `includeFaqSchema`. It must not change `isActive`, `indexable`, `isDeveloped`, `embedEnabled`, or `componentKey`. Keyword volume and difficulty are stored from DataForSEO only. Workers run only when `SEO_WORKERS_ENABLED=true` and `REDIS_HOST` is set. Redis is host, port, and password, not a URL.
- **Reason:** Tool guides lived only in calculator source, so a 20-tool finance pilot could not be reviewed before it went live. Indexing stays a separate admin choice.
- **Consequences:** Does not add pillar, sub-pillar, or topic-guide pages. Does not replace `/admin/seo` (still a non-saving preview). Embed pages still omit the guide. Catalog updates for calculator delivery stay on `tool:assign` (ADR-024).
- **Amendment (2026-11-24):** A campaign is no longer a Finance & Business pilot. `/admin/seo-campaigns` lists campaigns. `/admin/seo-campaigns/new` lists every active tool, filters by category, pillar, sub-pillar, and published state, and accepts at most 50. Select all applies to the filtered list. Sibling slug checks use each tool’s own category.
- **Amendment (2026-11-25):** A campaign runs one tool through research and copy before the next tool starts. The primary keyword must contain the tool’s distinctive words as whole words, including short names such as APR and 529. If no suggestion matches, the draft stays in review instead of taking the highest-volume keyword. A keyword already used in the campaign is skipped. Keyword research calls DataForSEO keyword suggestions. The seed is the tool name with “calculator” and “converter” removed.
- **Status:** Accepted

