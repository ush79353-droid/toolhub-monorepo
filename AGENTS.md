# Shared Agent Instructions (`AGENTS.md`)

> Applies to both **Google Antigravity** (Developer A) and **Cursor** (Developer B) working on the Mega Tools / Omega Calculators repository (`ToolHub`).

Project memory is stored in the version-controlled `brain/` directory and synchronized exclusively through **Git commits and pulls** — there is no automatic real-time memory sharing across IDEs or machines.

---

## Before Every Task

1. Read `brain/README.md`.
2. Read `brain/CURRENT_STATE.md`.
3. Read `brain/ARCHITECTURE.md`.
4. Read relevant `brain/` documents for the task (e.g., `FRONTEND.md`, `BACKEND.md`, `DATABASE.md`, `API_CONTRACTS.md`, `AUTHENTICATION.md`, `DESIGN_SYSTEM.md`, `TASKS.md`, `DECISIONS.md`).
5. Inspect actual source code before making changes — never assume a planned feature is implemented.
6. Check Git status (`git status`) and sync state (`git fetch` / branch status).
7. Identify potential conflicts with existing work or another developer's active tasks.

---

## During Every Task

1. Follow the documented architecture in `brain/ARCHITECTURE.md`.
2. Preserve independent `frontend/` (Next.js) and `backend/` (Express) applications — do **not** introduce npm workspaces or merge the apps.
3. **Never call Express directly from browser components.** All API traffic must follow `Browser → Next.js Server → Express API → MongoDB` (except pre-signed direct browser `PUT` uploads to AWS S3 authorized through Next.js Server Actions).
4. Preserve the locked design system documented in `brain/DESIGN_SYSTEM.md`.
5. Use TypeScript strict mode (`strict: true`, no unguarded `any`).
6. Do not invent APIs, Mongoose models, endpoints, or implemented features.
7. Do not overwrite another developer's uncommitted changes or unrelated files.
8. Keep changes scoped to the requested task and follow engineering standards in `.agents/rules/ponytail.md` / `.cursor/rules/ponytail.mdc`.
9. Validate security-sensitive changes carefully (auth, sessions, cookies, RBAC, input schemas, storage keys, secret handling).

---

## After Every Task

1. Run relevant checks (`npm run type-check`, `npm run lint`, and targeted self-checks or tests).
2. Update affected topic-specific `brain/` documents (`FRONTEND.md`, `BACKEND.md`, `DATABASE.md`, `API_CONTRACTS.md`, `AUTHENTICATION.md`, `DESIGN_SYSTEM.md`).
3. Update `brain/CURRENT_STATE.md`.
4. Update `brain/TASKS.md`.
5. Append a chronological entry to `brain/CHANGELOG.md`.
6. Update `brain/DECISIONS.md` if an architectural or design decision changed (never silently delete prior decisions).
7. Report exact files changed and observed verification results.
8. Do not claim a feature or check is complete unless directly verified after your final edit.

---

## Git Rules

- Never commit secrets (`.env`, `.env.local`, credentials, tokens, private keys, or PII).
- Never force push (`git push --force` / `--force-with-lease`).
- Never overwrite remote history.
- Never automatically resolve conflicting architectural changes — stop and coordinate or ask for clarification.
- Follow the user's Git instructions for committing and pushing (`git fetch` and inspect divergence/conflicts before pushing).
- Include `brain/` documentation updates in the same commit as related code changes so repository state and Project Brain stay in sync.

