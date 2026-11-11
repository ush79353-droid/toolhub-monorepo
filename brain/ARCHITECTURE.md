# Architecture — Mega Tools / Omega Calculators

## 1. High-Level Topology

The repository houses **two completely independent TypeScript applications** (migrated out of an npm-workspace monorepo in commit `5f378c9`):

```text
ToolHub/
├── .agents/rules/       # Antigravity workspace rules (ponytail.md, mega-tools-brain.md)
├── .cursor/rules/       # Cursor workspace rules (ponytail.mdc, mega-tools-brain.mdc)
├── brain/               # Shared version-controlled Project Brain
├── AGENTS.md            # Cross-agent mandatory workflow and guardrails
├── backend/             # Independent Express.js + TypeScript + Mongoose REST API (Port 5001)
├── frontend/            # Independent Next.js 15 App Router + React 19 + Tailwind CSS app (Port 3000)
└── .gitignore           # Root ignore rules (node_modules, .env*, .next, dist, keys)
```

- **No npm workspaces:** `frontend/` and `backend/` each maintain independent `package.json`, `package-lock.json`, `tsconfig.json`, `.prettierrc`, and `node_modules/`.
- **Strict TypeScript:** Both applications enforce `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`, and `"noImplicitReturns": true`.

---

## 2. Critical Communication Boundary (Non-Negotiable)

```text
Browser  ──►  Next.js Server (RSC / Server Actions)  ──►  Express API (/api/v1)  ──►  MongoDB
```

### Boundary Rules

1. **The browser must NEVER call Express directly.**
   - Client Components (`'use client'`) must invoke **Next.js Server Actions** (`frontend/src/server/*/actions.ts`) or future Next.js Route Handlers (`frontend/src/app/api/`).
   - `frontend/src/server/api/client.ts` enforces `import 'server-only'` so it cannot be bundled into browser code.
   - `API_INTERNAL_URL` (default `http://localhost:5001/api/v1`) is a server-only environment variable and must **never** be prefixed with `NEXT_PUBLIC_`.
2. **Express is the authoritative backend for persistence, auth, and integrations.**
   - All MongoDB access lives in `backend/` via Mongoose (`backend/src/modules/*/*.model.ts`).
   - Session validation, password hashing, email delivery, and AWS S3 signing happen strictly in `backend/`.
3. **Direct Browser Upload Exception (AWS S3 only, not Express):**
   - In `/admin/media`, the browser requests a short-lived (300s) pre-signed S3 `PUT` URL via a Next.js Server Action (`requestMediaUploadAction` → Express `POST /api/v1/admin/media/upload-url`), uploads binary bytes via `XMLHttpRequest` `PUT` **directly to AWS S3**, and then commits metadata via a second Server Action (`confirmMediaUploadAction` → Express `POST /api/v1/admin/media`), where Express runs `HeadObjectCommand` against S3 before writing to MongoDB.
   - The browser still **never** communicates directly with Express.

---

## 3. Technology Stack (Verified)

| Layer | Technology | Version (from `package.json`) | Notes |
| :--- | :--- | :--- | :--- |
| Frontend Framework | Next.js (App Router) | `^15.1.7` | `reactStrictMode: true` in `next.config.ts` |
| UI Runtime | React / React DOM | `^19.0.0` | Server Components by default; `'use client'` for interactive views |
| Styling | Tailwind CSS + `tailwindcss-animate` + CVA | `^3.4.17` | `components.json` configured (shadcn-style `src/components/ui/`) |
| Icons | `lucide-react` | `^1.16.0` | Used across public and admin UI |
| Backend Runtime | Express.js | `^4.21.2` | Versioned `/api/v1` router, `helmet`, `cors`, `compression` |
| Database / ODM | MongoDB + Mongoose | `^8.10.1` | `strictQuery: true`, graceful non-blocking startup on connect failure |
| Validation | Zod | `^3.24.2` | Independent copies in `frontend/src/lib/validation` and `backend/src/validation` |
| Password Hashing | Argon2 (`argon2`) | `^0.45.2` | Argon2id (64 MB memory, 3 iterations, parallelism 1) |
| Email Transport | `nodemailer` | `^10.5.0` | SMTP transport for admin password resets |
| Object Storage | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` | `^3.1166.0` | Pre-signed S3 uploads + head/delete operations |
| Language & Tooling | TypeScript, `tsx`, ESLint 9, Prettier 3.5 | `^5.7.3` | Both apps use `tsx` (backend dev/scripts), Prettier; frontend uses `next lint` |

---

## 4. Request & Auth Flow Summary

1. **Public SSR (`(website)/page.tsx`):** Next.js Server Component calls `serverApi.get('/catalog/categories')` and `serverApi.get('/catalog/featured')` using `API_INTERNAL_URL` with `cache: 'no-store'`.
2. **Admin Page Guard (`middleware.ts` + `admin/(dashboard)/layout.tsx`):**
   - Edge `middleware.ts` checks presence of the `admin_session` cookie on `/admin/:path*` and sets `noindex, nofollow` + `no-store` cache headers.
   - Server layout `admin/(dashboard)/layout.tsx` (`dynamic = 'force-dynamic'`) calls `getCurrentAdmin()`, which forwards `admin_session` to Express `GET /api/v1/admin/auth/me` via `x-admin-session` header.
3. **Admin Mutations:** Client component → `'use server'` Action (`src/server/*/actions.ts`) → reads `admin_session` cookie → sends `x-admin-session` header to Express `API_INTERNAL_URL` → Express `authenticateAdmin` middleware validates active `AdminSession` and `AdminUser` in MongoDB.

---

## 5. Directory Structure Summary

- `frontend/src/app/`: Route groups `(website)/`, `admin/` (auth pages + `(dashboard)/`), `api/` (`.gitkeep` only), root `layout.tsx`, `globals.css`, `not-found.tsx`, `manifest.json`.
- `frontend/src/server/`: `server-only` API client (`api/client.ts`) and Server Actions (`auth/`, `categories/`, `media/`, `tools/`).
- `frontend/src/components/`: `ui/` primitives, `layout/`, `shared/`, `tools/`, `categories/`, `contact/`, `admin/` (`auth`, `dashboard`, `forms`, `layout`, `profile`, `shared`, `tables`).
- `frontend/src/tools/`: `types.ts`, `registry/index.ts`, and 9 empty category folders (`.gitkeep`).
- `frontend/src/lib/`: `constants.ts`, `helpers.ts`, `utils.ts`, `validation/`, `sample-data.ts`, `admin-mock-data.ts`.
- `backend/src/config/`: `env.ts` (Zod env parsing), `database.ts` (Mongoose lifecycle).
- `backend/src/middleware/`: `auth.middleware.ts`, `error.middleware.ts`, `logger.middleware.ts`, `notFound.middleware.ts`, `rate-limit.middleware.ts`.
- `backend/src/modules/`: Implemented (`health`, `admins`, `auth`, `categories`, `media`, `tools`, `catalog`) and placeholders (`analytics`, `integrations`, `jobs`, `seo`, `uploads`, `users`).
- `backend/src/services/`: `email.service.ts`, `s3.service.ts`.
- `backend/src/scripts/`: `create-admin.ts`, `seed-categories.ts`, `seed-tools.ts`.
- `backend/data/`: `tools-directory-hierarchy.json`, `tools-catalog.json`.

---

## 6. Deployment Assumptions (Observed from Code & `.env.example`)

- **Separate Deployable Processes:** Frontend runs on port `3000`; Backend runs on port `5001` (or platform-injected `PORT`).
- **Private Network / Internal URL:** Next.js server requires `API_INTERNAL_URL` (throws at startup in `production` if missing in `ServerApiClient`).
- **MongoDB Required for Full Functionality:** Backend startup does **not** crash if initial MongoDB connection fails (`server.ts` logs warning and `/health` reports `status: 'degraded'`), allowing health checks while degraded.
- **HTTPS in Production:** `setAdminSessionCookie` sets `secure: process.env.NODE_ENV === 'production'`.
- **In-Memory Rate Limiter Caveat:** `rate-limit.middleware.ts` uses a per-process JavaScript `Map`; multi-instance horizontal scaling would require a shared store (e.g., Redis) if deployed across multiple backend replicas.
- **External Services:** Password reset emails require `EMAIL_PROVIDER=smtp` and valid `SMTP_*`/`EMAIL_FROM` vars; media uploads require `AWS_*` S3 variables and bucket CORS allowing browser `PUT` from `CORS_ORIGIN`.

