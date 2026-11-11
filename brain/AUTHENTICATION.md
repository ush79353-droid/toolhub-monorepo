# Authentication & Security (`AUTHENTICATION.md`)

This document describes only the **verified authentication and session implementation** in `frontend/` and `backend/`.

---

## 1. Admin Account Model & Provisioning

- **Model:** `AdminUser` (`backend/src/modules/admins/admin-user.model.ts`, collection `admin_users`).
- **Roles:** `'super_admin' | 'admin'` (`requireRole` middleware exists in `auth.middleware.ts`, though not yet attached to individual routers).
- **Statuses:** `'active' | 'disabled'`.
- **Provisioning:** There is no public signup or admin-invite HTTP endpoint. Initial `super_admin` accounts are created via CLI:
  `npm run admin:create` (`backend/src/scripts/create-admin.ts`), which prompts interactively or reads `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, and `BOOTSTRAP_ADMIN_PASSWORD`.

---

## 2. Password Hashing & Strength Rules

- **Source:** `backend/src/utils/password.ts` + `backend/src/validation/auth.schema.ts`
- **Algorithm:** **Argon2id** (`argon2` `^0.45.2`)
  - `type: argon2.argon2id`
  - `memoryCost: 65536` (64 MB)
  - `timeCost: 3` (3 iterations)
  - `parallelism: 1`
- **Password Length Bounds:** Minimum `8` characters, maximum `128` characters (DoS protection).
- **Verification:** `verifyPassword` returns `false` cleanly on missing inputs, >128 length, or malformed hashes.

---

## 3. Session Architecture & Cookie Handling

### Backend Session Store (`AdminSession`)
- **Model:** `AdminSession` (`collection: 'admin_sessions'`).
- **Token Generation:** `crypto.randomBytes(32).toString('hex')` (256-bit opaque random token, NOT a JWT).
- **TTL Expiration:**
  - Standard login (`rememberMe: false`): **24 hours**
  - Remember me (`rememberMe: true`): **7 days**
  - MongoDB TTL index on `expiresAt` (`index: { expires: 0 }`) purges expired sessions automatically.
  - *(Note: `backend/.env.example` lists `SESSION_TTL_HOURS` and `SESSION_REMEMBER_ME_DAYS`, but `admin-auth.service.ts` currently hardcodes `24h` and `7d`.)*

### Browser Cookie (`frontend/src/server/auth/session.ts`)
- **Cookie Name:** `admin_session` (`ADMIN_SESSION_COOKIE_NAME` constant; note `frontend/.env.example` documents `ADMIN_SESSION_COOKIE_NAME` and `COOKIE_SECURE`, while `session.ts` currently uses the constant `'admin_session'` and `secure: process.env.NODE_ENV === 'production'`).
- **Cookie Attributes:**
  - `httpOnly: true` (inaccessible to client-side JS)
  - `secure: process.env.NODE_ENV === 'production'`
  - `sameSite: 'lax'`
  - `path: '/'`
  - `maxAge`: `24 * 60 * 60` or `7 * 24 * 60 * 60` seconds

---

## 4. Login, Brute-Force Protection & Logout Flows

### Login Flow
1. Browser submits `/admin/login` form to Server Action `loginAdminAction` (`frontend/src/server/auth/actions.ts`).
2. Next.js server calls `POST /api/v1/admin/auth/login` (protected by `loginRateLimiter`: 10 requests / 15 min / IP).
3. `AdminAuthService.login`:
   - Looks up `AdminUser` by lowercased trimmed email with `+passwordHash`.
   - Checks `user.lockUntil > now` (returns `429 ACCOUNT_LOCKED` if locked).
   - Verifies Argon2id password. On failure, increments `failedLoginAttempts`; at `>= 5` consecutive failures, locks account for **15 minutes** (`lockUntil`). Returns generic `401 INVALID_CREDENTIALS`.
   - Checks `user.status === 'active'` (`403 ACCOUNT_DISABLED` if disabled).
   - Resets failure counters, updates `lastLoginAt`, creates `AdminSession` with IP and User-Agent.
4. `loginAdminAction` stores `sessionId` in the `HttpOnly` `admin_session` cookie on the browser response.

### Logout Flow
1. User confirms logout in `AdminSidebar`, `AdminMobileSidebar`, or `AdminHeader`, invoking `logoutAdminAction()`.
2. Next.js sends `POST /api/v1/admin/auth/logout` with `x-admin-session` to delete the `AdminSession` document in MongoDB.
3. Next.js deletes the `admin_session` cookie and redirects to `/admin/login`.

---

## 5. Protected Route & API Verification

1. **Layer 1 — Edge Middleware (`frontend/src/middleware.ts`, matcher `/admin/:path*`):**
   - Redirects unauthenticated requests (no `admin_session` cookie) away from `/admin/**` (except `/admin/login`, `/admin/forgot-password`, `/admin/reset-password`) to `/admin/login?redirect=...`.
   - Redirects requests with `admin_session` cookie visiting auth pages back to `/admin`.
   - Adds `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate` on `/admin/*`.
   - *(Note: Edge middleware checks cookie presence only; authoritative DB validation happens in Layer 2.)*
2. **Layer 2 — Server Component & Action Verification:**
   - `frontend/src/app/admin/(dashboard)/layout.tsx` (`dynamic = 'force-dynamic'`) calls `getCurrentAdmin()`, which queries Express `GET /api/v1/admin/auth/me`.
   - Every admin Server Action reads `getAdminSessionToken()` and passes `x-admin-session` to Express.
   - Express `authenticateAdmin` verifies active session (`expiresAt > now`), active `AdminUser`, and updates `lastActiveAt`. Invalid/orphaned/disabled sessions are purged immediately; `getCurrentAdmin()` clears the cookie on `401`/`403`.

---

## 6. Password Change & Password Reset Flows

- **Authenticated Password Change (`POST /api/v1/admin/auth/change-password`):**
  - Verifies `currentPassword` with Argon2id, hashes `newPassword`, sets `passwordChangedAt`, deletes **all** `AdminSession` records for that admin (`AdminSession.deleteMany({ adminId })`), and clears the browser cookie.
- **Forgot Password (`POST /api/v1/admin/auth/forgot-password`):**
  - Rate-limited (`forgotPasswordRateLimiter`: 5 req / 15 min / IP).
  - Always returns a generic anti-enumeration message if user is missing/disabled.
  - For active admins: generates 32-byte random `rawResetToken`, stores SHA-256 hash (`passwordResetTokenHash`) with **15-minute** expiry (`passwordResetExpiresAt`), and emails `${origin}/admin/reset-password?token=...` via `SmtpEmailService`.
  - *(Note: If `EMAIL_PROVIDER !== 'smtp'` or SMTP creds are missing, `sendPasswordResetEmail` returns `false` and `forgotPassword` throws `503 EMAIL_DELIVERY_FAILED`.)*
- **Reset Password (`POST /api/v1/admin/auth/reset-password`):**
  - Hashes submitted token with SHA-256, matches `passwordResetTokenHash` + `passwordResetExpiresAt > now`, sets new Argon2id hash, clears reset/lock fields, and revokes all active `AdminSession` records.

---

## 7. Security Gaps & Unimplemented Features (Verified)

- **No 2FA / TOTP Backend:** The TOTP switch in `AdminProfileClient.tsx` is a local UI state toggle only (`React.useState(true)`).
- **`requireRole` Unused:** `auth.middleware.ts` exports `requireRole(['super_admin'])`, but no router applies it yet; any authenticated active admin can currently call all `/admin/*` endpoints.
- **Single-Process Rate Limiting:** Rate limiters use an in-memory `Map`, not Redis.
- **Public User Auth:** There is no public user authentication (tools are public and account-free).

