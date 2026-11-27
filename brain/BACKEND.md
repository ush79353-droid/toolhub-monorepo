# Backend Architecture & Modules (`backend/`)

## 1. Entry Points & Express Pipeline

- **Build / run:** `npm run build` (`tsc`) emits CommonJS into `dist/`. Production start is `npm start` → `node dist/server.js`. Local development stays `npm run dev` (`tsx watch src/server.ts`). `tsconfig.json` uses `"module": "Node16"` + `"moduleResolution": "Node16"` (package remains CommonJS without `"type": "module"`) so `tsc` emit stays Node-runnable without deprecated `moduleResolution=node`/`node10` (ESNext/`bundler` emit was not Node-runnable).
- **Server Bootstrap (`backend/src/server.ts`):**
  - Calls `createApp()` and `connectDB()` (non-blocking: if MongoDB fails initially, server logs a warning and starts in `degraded` state).
  - Listens on `env.PORT` (default `5001`).
  - Handles `SIGINT`, `SIGTERM` (10-second graceful shutdown timeout), `unhandledRejection`, and `uncaughtException`.
- **Application Factory (`backend/src/app.ts`):**
  1. `helmet()` security headers
  2. `cors()` using comma-separated `env.CORS_ORIGIN`, `credentials: true`, methods `GET, POST, PUT, PATCH, DELETE, OPTIONS`, allowedHeaders `Content-Type, Authorization, X-Requested-With` *(Note: `x-admin-session` is sent server-to-server by Next.js, bypassing browser CORS)*
  3. `compression()`
  4. `express.json({ limit: env.BODY_LIMIT })` & `express.urlencoded({ extended: true, limit: env.BODY_LIMIT })`
  5. `requestLogger`
  6. `v1Router` mounted at `env.API_PREFIX` (default `/api/v1`)
  7. `notFoundHandler` (404 JSON envelope)
  8. `errorHandler` (centralized error formatter)

---

## 2. Backend Modules (`backend/src/modules/`)

### Implemented Modules

| Module | Directory | Responsibility | Mounted At |
| :--- | :--- | :--- | :--- |
| `health` | `modules/health/` | Server & MongoDB readiness check (`ok` vs `degraded`) | `/api/v1/health` |
| `admins` | `modules/admins/` | `AdminUser` Mongoose model (`admin-user.model.ts`) | — |
| `auth` | `modules/auth/` | Admin login, logout, session validation, profile update, password change, forgot/reset password, `AdminSession` model | `/api/v1/admin/auth` |
| `categories` | `modules/categories/` | 3-level taxonomy (`category`, `pillar`, `sub_pillar`) CRUD, tree assembly, search, cascade delete | `/api/v1/admin/categories` |
| `media` | `modules/media/` | Storage driver (`local` disk or S3), `MediaAsset` persistence, list/filter, file + DB delete | `/api/v1/admin/media` |
| `tools` | `modules/tools/` | Admin tool catalog CRUD, placement options, media icon validation, allowlisted `componentKey` & `executionType`, unique name/slug enforcement, optional SEO fields, embed gates, and the development audit (`isDeveloped`, `ToolAudit`) | `/api/v1/admin/tools` |
| `catalog` | `modules/catalog/` | Public read endpoints for active root categories (with tool counts via aggregation), featured tools, active tool directory, typeahead (`GET /tools/suggest`, 10 items), and active single tool detail by slug. Attaches a published SEO guide when one exists (ADR-027). | `/api/v1/catalog` |
| `seo` | `modules/seo/` | Finance SEO campaigns: DataForSEO research, OpenAI drafts, validation, admin approve/publish. Bull Board at `/api/v1/admin/queues` when Redis and `BULL_BOARD_PASSWORD` are set. Does not flip `isActive` or `indexable`. | `/api/v1/admin/seo` |

### Planned / Placeholder Modules (`.gitkeep` only)

- `modules/analytics/`
- `modules/integrations/`
- `modules/jobs/`
- `modules/uploads/`
- `modules/users/`

---

## 3. Middleware (`backend/src/middleware/`)

- **`auth.middleware.ts`:**
  - `extractSessionToken(req)`: Reads `x-admin-session` header or `Authorization: Bearer <token>`.
  - `authenticateAdmin`: Validates active non-expired `AdminSession`, loads `AdminUser`, revokes orphaned/disabled sessions, updates `lastActiveAt` (best-effort `.catch(() => {})`), attaches `req.admin` (`SafeAdminUser`) and `req.adminSession`.
  - `requireRole(allowedRoles: AdminRole[])`: RBAC guard checking `req.admin.role`. *(Implemented, not yet mounted on any routes.)*
- **`rate-limit.middleware.ts`:**
  - `createRateLimiter`: In-memory `Map<string, { count, resetAt }>` keyed by `x-forwarded-for` first hop or `req.socket.remoteAddress`, with 60s cleanup timer (`.unref()`). Sets `Retry-After` and `X-RateLimit-*` headers and returns HTTP `429`.
  - `loginRateLimiter`: 10 requests per 15 minutes (`LOGIN_RATE_LIMITED`).
  - `forgotPasswordRateLimiter`: 5 requests per 15 minutes (`FORGOT_PASSWORD_RATE_LIMITED`).
- **`logger.middleware.ts`:** Logs `METHOD URL STATUS - DURATIONms` on `res.on('finish')` (`info` for 2xx/3xx, `warn` for 4xx, `error` for 5xx).
- **`notFound.middleware.ts`:** Returns `404` `NOT_FOUND` envelope.
- **`error.middleware.ts`:** `AppError(message, statusCode, code, details)` + `errorHandler` handling:
  - `ZodError` → `400` `VALIDATION_ERROR` (with `err.format()`)
  - `AppError` → custom `statusCode` and `code`
  - JSON `SyntaxError` (`status === 400`) → `400` `BAD_REQUEST`
  - Unhandled exceptions → `500` `INTERNAL_SERVER_ERROR` (generic message in `production`, raw details/stack otherwise).

---

## 4. Services & Helpers

- **`services/email.service.ts` (`SmtpEmailService`):**
  - Sends admin password reset links (`${origin}/admin/reset-password?token=...`, origin taken from first entry of `CORS_ORIGIN`) via `nodemailer`.
  - Only sends when `EMAIL_PROVIDER === 'smtp'` and `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` are present; otherwise logs and returns `false` (which causes `adminAuthService.forgotPassword` to throw `503 EMAIL_DELIVERY_FAILED`).
- **`services/storage.ts`:** Picks `STORAGE_DRIVER`. `local` writes `UPLOAD_DIR` (default `uploads`) and returns `/api/media-upload`. `s3` delegates to `s3.service.ts`. `removeStored` uses the saved URL: `/uploads/...` is disk, anything else is S3.
- **`services/s3.service.ts`:**
  - Lazy `S3Client` configured with `BUCKET_REGION`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `requestChecksumCalculation: 'WHEN_REQUIRED'`, `responseChecksumValidation: 'WHEN_REQUIRED'` (needed for browser `PUT`).
  - `ensureUploadCors()`: Runs once per process before signing; checks `GetBucketCorsCommand` and attempts `PutBucketCorsCommand` for `CORS_ORIGIN` `PUT` if missing.
  - `signMediaUpload`: Generates 300-second pre-signed `PutObjectCommand` URL.
  - `headMediaObject`: Verifies uploaded object exists in S3 (`HeadObjectCommand`).
  - `deleteMediaObject`: Deletes object from S3 (`DeleteObjectCommand`), ignoring `NotFound`/`NoSuchKey`.
- **`modules/media/media.key.ts`:** Validates allowed MIME types (`png`, `jpeg`, `webp`, `svg`, `gif`, `pdf`), max size (`10 MB`), and owned key pattern `media/<uuid>.<ext>`. Includes direct-run self-check.
- **`modules/tools/tool.key.ts` & `tool.copy.ts`:** `toolNameKey`, `isToolSlug`, `APPROVED_COMPONENT_KEYS` / `isApprovedComponentKey` (the registered calculators, including `FourZeroThreeBCalculator`, kept in sync with `frontend/src/tools/registry/keys.ts`), and `buildToolCopy` (SEO copy generator for seeded tools). Both include direct-run self-checks.
- **`utils/password.ts`:** `hashPassword` & `verifyPassword` using `argon2.argon2id` (`memoryCost: 65536`, `timeCost: 3`, `parallelism: 1`, 8–128 chars).
- **`utils/response.ts`:** Standard response envelope `{ success, data?, error?, meta: { timestamp } }`.

---

## 5. Environment Configuration (`backend/src/config/env.ts`)

Validated at import via Zod (`dotenv.config()`):

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `5001` | HTTP listen port |
| `NODE_ENV` | `development` | `'development' \| 'production' \| 'test'` |
| `API_PREFIX` | `/api/v1` | Base path for versioned router |
| `CORS_ORIGIN` | `http://localhost:3000` | Comma-separated allowed origins (also base URL for reset links & S3 CORS) |
| `MONGODB_URI` | `mongodb://localhost:27017/mega_tools` | MongoDB connection string |
| `BODY_LIMIT` | `10mb` | Express JSON/urlencoded max payload size |
| `EMAIL_PROVIDER` | `console` | `'console' \| 'smtp'` (in `.env.example`: `smtp`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | `''` / `587` | SMTP delivery settings |
| `STORAGE_DRIVER` | `local` | `local` writes `backend/uploads`. `s3` uses the signed upload. |
| `UPLOAD_DIR` | `uploads` | Directory for `STORAGE_DRIVER=local`, relative to the backend working directory |
| `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `BUCKET_REGION`, `AWS_BUCKET_NAME`, `AWS_BASE_URL` | `''` | Required only when `STORAGE_DRIVER=s3` |
| `CURRENCY_EXCHANGE_API_KEY` | `''` | ExchangeRate-API key. The daily currency job skips the fetch when this is empty. |
| `REDIS_HOST` | `''` | Redis host for SEO queues. Empty disables enqueue. |
| `REDIS_PORT` | `6379` | Redis port. |
| `REDIS_PASSWORD` | `''` | Redis password. Omitted from the client when empty. |
| `SEO_WORKERS_ENABLED` | `false` | Workers start only when this is `true` and `REDIS_HOST` is set. |
| `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` | `''` | DataForSEO basic auth. Empty refuses campaign enqueue. |
| `DATAFORSEO_LOCATION_CODE` | `2840` | DataForSEO location. 2840 is the United States. There is no single global location. |
| `DATAFORSEO_LANGUAGE_CODE` | `en` | DataForSEO language. |
| `OPENAI_API_KEY`, `OPENAI_SEO_MODEL` | `''` | OpenAI structured draft. Both required before enqueue. |
| `BULL_BOARD_USER` | `admin` | Basic-auth user for `/api/v1/admin/queues`. |
| `BULL_BOARD_PASSWORD` | `''` | Basic-auth password. Empty leaves Bull Board unmounted. |

> **Config Drift Note:** `backend/.env.example` also lists `SESSION_TTL_HOURS=24` and `SESSION_REMEMBER_ME_DAYS=7`, but `env.ts` does not parse them and `admin-auth.service.ts` hardcodes `24h` and `7d`.

---

## 6. CLI Bootstrap & Seeding Scripts (`backend/src/scripts/`)

- `npm run admin:create` (`create-admin.ts`): Interactive CLI (or `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`) to create the initial `super_admin` user.
- `npm run categories:seed` (`seed-categories.ts`): Upserts 3-level taxonomy from `data/tools-directory-hierarchy.json` using deterministic `seedKey`.
- `npm run tools:seed` (`seed-tools.ts`): Bulk upserts 4,351 tools from `data/tools-catalog.json` (creates missing sub-pillars if needed; sets `isActive: false`, `indexable: false`, `isFeatured: false`, and generates SEO copy via `buildToolCopy`).
- `npm run tool:assign` (`assign-tool-component.ts`): **Sole** catalog assign path. Required: `--slug`, `--component` (allowlisted), `--id` (expected Mongo `_id`), `--name`, `--short-description`, `--meta-title` (≤70), `--meta-description` (≤160). Optional: `--expected-pillar` / `--expected-subpillar` (`null` when empty), `--execution` (default `client`), `--set-active`, `--set-indexable` / `--unset-indexable`, `--no-developed`, `--no-embed`. Sets `isDeveloped` by default; preserves `isActive` / `indexable` / `isFeatured` / placement unless optional flags say otherwise. **Do not** add per-tool `assign-*-tool.ts` scripts.
- `npm run categories:icons` (`attach-category-icons.ts`): Downloads one Lucide SVG per root category, stores it with the local storage driver, and saves `iconMedia` / `iconUrl` on that category. Skips a category that already has a `/uploads/` icon. Requires `STORAGE_DRIVER=local`.
- `npm run categories:descriptions` (`set-category-descriptions.ts`): Writes a short public description onto each root category that still has an empty `description`. Categories that already have text are left as saved.
- `npm run currency:fetch` (`fetch-currency-rates.ts`): Fetches the latest USD table and upserts every tracked base currency, plus a history row. `node-cron` runs the same function at local midnight (`0 0 * * *`, server local time, `noOverlap`) from `src/jobs/currency-rates.cron.ts` after Mongo connects. A failed or rejected provider response does not write.
- Public currency read: `GET /api/v1/currency/rates?base=USD` (`currency.router.ts` / `currency.service.ts`) returns the stored snapshot with `fetchedAt` and 48-hour `isStale` (ADR-021).

---

## 7. API Versioning & Error Envelope

- All endpoints are mounted under `env.API_PREFIX` (`/api/v1`).
- Success format (`sendSuccess`): `{ success: true, data: <T>, meta: { timestamp: ISOString, ... } }`.
- Error format (`sendError`): `{ success: false, error: { code, message, details?, stack? }, meta: { timestamp: ISOString } }` (`stack` only included outside `production` when `details instanceof Error`).

