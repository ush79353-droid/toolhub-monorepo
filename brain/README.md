# Shared Project Brain (`brain/`)

This directory is the version-controlled, single source of truth for **Mega Tools / Omega Calculators** (`ToolHub`), shared by:

- **Developer A** using **Google Antigravity** (`.agents/rules/mega-tools-brain.md`, `.agents/rules/ponytail.md`)
- **Developer B** using **Cursor** (`.cursor/rules/mega-tools-brain.mdc`, `.cursor/rules/ponytail.mdc`)
- Root shared instructions: [`AGENTS.md`](../AGENTS.md)

---

## How Synchronization Works

**Brain synchronization occurs exclusively through Git commits, fetches, pulls, and merges.** Neither Cursor nor Antigravity has real-time automatic memory sharing across developer machines.

To avoid merge conflicts and stale context:

1. **Pull/fetch before starting work** (`git fetch` / `git pull`) and read the Brain docs listed below.
2. **Keep updates topic-specific** — only edit the documents affected by your task.
3. **Keep `CURRENT_STATE.md` concise** — avoid turning it into a verbose log.
4. **Use stable Task IDs** in `TASKS.md` (e.g., `CORE-01`, `FE-01`, `BE-01`) — never renumber existing IDs.
5. **Preserve prior decisions** in `DECISIONS.md` — add new ADRs or supersede status rather than deleting history.
6. **Append chronologically** to `CHANGELOG.md` — place new entries consistently without rewriting older entries.
7. **Bundle Brain updates with code commits** — never commit code changes that alter routes, schemas, auth, UI tokens, or task status without updating the corresponding Brain files in the same commit.
8. **Never force push or silently overwrite another developer's work.** Stop and resolve conflicts explicitly.

---

## Document Index & Reading Order

| Order | Document | Purpose | Update When... |
| :--- | :--- | :--- | :--- |
| 1 | [`README.md`](./README.md) | Index, reading workflow, and multi-dev Git rules | Brain structure or workflow changes |
| 2 | [`CURRENT_STATE.md`](./CURRENT_STATE.md) | Concise snapshot of implemented/partial/pending features, issues, checks | **After every task** |
| 3 | [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Independent apps, API boundary, directory layout, deployment assumptions | Architectural boundaries or stack change |
| — | [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md) | Product vision, naming history, public site, admin console, tool types | Major product scope or naming changes |
| — | [`FRONTEND.md`](./FRONTEND.md) | Next.js App Router structure, routes, layouts, components, tool registry | Frontend routes, actions, or components change |
| — | [`BACKEND.md`](./BACKEND.md) | Express modules, controllers, services, middleware, env config | Backend modules, middleware, or services change |
| — | [`DATABASE.md`](./DATABASE.md) | Verified Mongoose models, fields, indexes, references | Any Mongoose schema or index changes |
| — | [`API_CONTRACTS.md`](./API_CONTRACTS.md) | Implemented `/api/v1` endpoints, request/response/error shapes, planned APIs | Endpoints or Zod validation contracts change |
| — | [`AUTHENTICATION.md`](./AUTHENTICATION.md) | Admin auth, Argon2id, MongoDB sessions, `HttpOnly` cookies, password reset | Auth, session, cookie, or RBAC code changes |
| — | [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Locked brand palette, typography, spacing, UI patterns, responsiveness | UI tokens or shared visual patterns change |
| — | [`CALCULATOR_STANDARDS.md`](./CALCULATOR_STANDARDS.md) | Locked master calculator page/layout/currency/testing conventions (Loan Calculator reference) | Calculator shell or shared tool UX conventions change |
| — | [`SEO_STANDARDS.md`](./SEO_STANDARDS.md) | Optional admin SEO fields, fallbacks, canonical/robots/social/JSON-LD rules | Tool SEO schema, metadata pipeline, or cache policy changes |
| — | [`EMBED_STANDARDS.md`](./EMBED_STANDARDS.md) | Shared `/embed/[slug]` eligibility, admin gates, CSP, auto-resize, noindex | Calculator iframe embedding or framing headers |
| — | [`AD_STANDARDS.md`](./AD_STANDARDS.md) | Dummy tool-page ad slots, density rules, embed exclusion, future AdSense hooks | Tool detail ad placeholders or live ads work |
| — | [`DECISIONS.md`](./DECISIONS.md) | Architecture Decision Records (ADRs) | Architectural or technical policy decisions occur |
| — | [`TASKS.md`](./TASKS.md) | Shared task board (`Planned`, `In Progress`, `Blocked`, `Completed`) | Starting, blocking, or completing tasks |
| — | [`CHANGELOG.md`](./CHANGELOG.md) | Chronological development history with verification & commit hashes | **After every completed task** |

---

## Accuracy Policy

Every statement in `brain/` must distinguish between:

- **Implemented** — Verified directly in source files and routes.
- **Partially Implemented** — Scaffolded, mocked, or only partially wired to backend/DB.
- **Planned** — Empty placeholder modules, notices, or stated future scope.
- **Unknown / Not Verified** — Not yet tested or runtime-verified in this environment.

Never mark a planned or UI-preview feature as implemented, and never store `.env`, `.env.local`, passwords, API keys, session tokens, or personal data in `brain/`.

