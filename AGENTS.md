# Shared Agent Instructions (`AGENTS.md`)

> Applies to both **Google Antigravity** (Developer A) and **Cursor** (Developer B) working on the Mega Tools / Omega Calculators repository (`ToolHub`).

Project memory is stored in the version-controlled `brain/` directory and synchronized exclusively through **Git commits and pulls** — there is no automatic real-time memory sharing across IDEs or machines.

---

## Before Every Task

1. Read `brain/README.md`.
2. Read `brain/CURRENT_STATE.md`.
3. Read `brain/ARCHITECTURE.md`.
4. Read relevant `brain/` documents for the task (e.g., `FRONTEND.md`, `BACKEND.md`, `DATABASE.md`, `API_CONTRACTS.md`, `AUTHENTICATION.md`, `DESIGN_SYSTEM.md`, `CALCULATOR_STANDARDS.md`, `SEO_STANDARDS.md`, `EMBED_STANDARDS.md`, `AD_STANDARDS.md`, `TOOL_DETAIL_PAGE_STANDARDS.md`, `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `TASKS.md`, `DECISIONS.md`).
5. For any new calculator or tool detail page work, **mandatory** reading: `brain/TOOL_DETAIL_PAGE_STANDARDS.md` (master shell, ADR-016), `brain/ARCHITECTURE.md` §7 (calculator module, ADR-018), and `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md` (workflow and mandatory checklist), plus `CALCULATOR_STANDARDS.md`, `SEO_STANDARDS.md`, `EMBED_STANDARDS.md`, and `AD_STANDARDS.md`. Auto Loan Calculator (`/tools/auto-loan-calculator`) is the official visual reference — do not redesign the shared shell. New calculators use the locked folder: pure `calculation.ts` and `validation.ts`, `detail.tsx`, lazy `registry/index.ts`, and `registry/details.ts`. Ship only after the playbook checklist: architecture, reusable components, pure engine, validation, tests, SEO, embed, responsive QA.
6. Inspect actual source code before making changes — never assume a planned feature is implemented.
7. Check Git status (`git status`) and sync state (`git fetch` / branch status).
8. Identify potential conflicts with existing work or another developer's active tasks.

---

## During Every Task

1. Follow the documented architecture in `brain/ARCHITECTURE.md`, including §7 for any new calculator. Do not add a per-tool page route or a second registry.
2. Preserve independent `frontend/` (Next.js) and `backend/` (Express) applications — do **not** introduce npm workspaces or merge the apps.
3. **Never call Express directly from browser components.** All API traffic must follow `Browser → Next.js Server → Express API → MongoDB` (except pre-signed direct browser `PUT` uploads to AWS S3 authorized through Next.js Server Actions).
4. Preserve the locked design system documented in `brain/DESIGN_SYSTEM.md`.
5. Use TypeScript strict mode (`strict: true`, no unguarded `any`).
6. Do not invent APIs, Mongoose models, endpoints, or implemented features.
7. Do not overwrite another developer's uncommitted changes or unrelated files.
8. Keep changes scoped to the requested task and follow engineering standards in `.agents/rules/ponytail.md` / `.cursor/rules/ponytail.mdc`.
9. Validate security-sensitive changes carefully (auth, sessions, cookies, RBAC, input schemas, storage keys, secret handling).
10. Currency conversion reuses the ADR-017 store (ADR-021). Do not call ExchangeRate-API from a calculator, and do not add a per-tool cron. A currency selector that only labels one currency must not pretend to convert amounts.
11. A new calculator is not delivered until its existing catalog record is active and `/tools/{slug}` renders (ADR-022). Do not activate a tool with no module, and do not re-enable a tool an admin turned off.

---

## After Every Task

1. Run relevant checks (`npm run type-check`, `npm run lint`, and targeted self-checks or tests).
2. Update affected topic-specific `brain/` documents (`FRONTEND.md`, `BACKEND.md`, `DATABASE.md`, `API_CONTRACTS.md`, `AUTHENTICATION.md`, `DESIGN_SYSTEM.md`).
3. Update `brain/CURRENT_STATE.md`.
4. Update `brain/TASKS.md`.
5. Append a chronological entry to `brain/CHANGELOG.md`.
6. Update `brain/DECISIONS.md` if an architectural or design decision changed (never silently delete prior decisions).
7. Report exact files changed and observed verification results. For a calculator, list each commit in the delivery and the checks run at that milestone.
8. Do not claim a feature or check is complete unless directly verified after your final edit.

---

## Git Rules

- Never commit secrets (`.env`, `.env.local`, credentials, tokens, private keys, or PII).
- Never force push (`git push --force` / `--force-with-lease`).
- Never overwrite remote history.
- Never automatically resolve conflicting architectural changes — stop and coordinate or ask for clarification.
- Follow the user's Git instructions for committing and pushing (`git fetch` and inspect divergence/conflicts before pushing).
- Stage only files that belong to the current task. Leave unrelated and uncommitted work untouched.
- New calculators follow the meaningful incremental commit sequence in ADR-019 and `brain/NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`. Commit each finished milestone. A very small tool may be one commit. Do not invent empty commits to raise the count.
- Non-calculator work still keeps its Brain update in the same commit as the code it describes.
- A calculator's closing Brain commit (`CURRENT_STATE.md`, `TASKS.md`, `CHANGELOG.md`, and any ADR) is the last commit of that delivery. Push the finished sequence together to `origin/development` after `git fetch` shows it can fast-forward. Do not push a registered calculator without that Brain commit in the same push.

