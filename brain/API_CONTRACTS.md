# API Contracts (`/api/v1`)

All Express endpoints are mounted under `API_PREFIX` (default `/api/v1`) in `backend/src/app.ts` and called **exclusively by the Next.js server** (`frontend/src/server/api/client.ts`), never directly from browser code.

## Standard Response Envelopes

### Success
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-11-11T00:00:00.000Z"
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-11-11T00:00:00.000Z"
  }
}
```
*(In non-production environments, `error.stack` may be included when `details` is an `Error` instance.)*

### Protected Endpoint Authentication
Protected routes apply `authenticateAdmin` (`backend/src/middleware/auth.middleware.ts`), accepting either:
- `x-admin-session: <64-hex-sessionId>` (used by all Next.js Server Actions)
- `Authorization: Bearer <64-hex-sessionId>`

Common auth errors: `401 UNAUTHORIZED`, `401 SESSION_EXPIRED`, `401 ACCOUNT_NOT_FOUND`, `403 ACCOUNT_DISABLED`.

---

## 1. Health Endpoint (Implemented)

### `GET /api/v1/health`
- **Auth:** Public
- **Response (`200`):**
  ```json
  {
    "status": "ok | degraded",
    "timestamp": "ISO-8601",
    "uptime": 123,
    "environment": "development | production | test",
    "database": {
      "status": "connected | disconnected | connecting | disconnecting",
      "name": "mega_tools"
    }
  }
  ```

---

## 2. Public Catalog Endpoints (Implemented)

Mounted at `/api/v1/catalog` (`backend/src/modules/catalog/catalog.router.ts`).

### `GET /api/v1/catalog/categories`
- **Auth:** Public
- **Response (`200`):** `PublicCategory[]` — Active root categories (`kind: 'category', isActive: true`), sorted by `sortOrder` asc, `name` asc:
  `{ id, name, slug, description, iconUrl, toolCount }[]`

### `GET /api/v1/catalog/categories/:slug`
- **Auth:** Public
- **Response (`200`):** `PublicCategoryDetail` for an active root category. Tools are grouped under their pillar, then sub-pillar. A tool whose pillar or sub-pillar is missing or inactive is returned in `ungrouped`. Empty pillars and empty sub-pillars are omitted.
  `{ id, name, slug, description, iconUrl, toolCount, pillars, ungrouped }`
  Each pillar is `{ id, name, slug, description, tools, subPillars }`. Each sub-pillar is `{ id, name, slug, description, tools }`. Each tool is `{ id, name, slug, shortDescription, isActive }`. Only `isActive: true` tools are included, and `toolCount` is that active total.
- **Errors:** `404 NOT_FOUND` when the slug is missing or is not an active root category.

### `GET /api/v1/catalog/featured`
- **Auth:** Public
- **Response (`200`):** `PublicFeaturedTool[]` — Up to 12 tools with `isFeatured: true`, sorted by `name` asc (note: currently filters only on `isFeatured: true`, not `isActive`):
  `{ id, name, slug, shortDescription, iconUrl, categoryName, categorySlug }[]`

### `GET /api/v1/catalog/tools/suggest`
- **Auth:** Public
- **Query:** `q` (trimmed, max 80). Empty `q` returns `{ items: [] }`.
- **Response (`200`):** Up to 10 active tools. Name-prefix matches come first, then name/slug/short-description contains matches, each group sorted by name.
  `{ items: { id, name, slug, shortDescription, categoryName }[] }`
- **Browser path:** `GET /api/catalog/tools/suggest` on Next.js proxies this route. The header search does not call Express directly.

### `GET /api/v1/catalog/tools`
- **Auth:** Public
- **Query:** `q` (optional, trimmed, max 120), `category` (optional root-category slug), `page` (default 1)
- **Response (`200`):** Active tools only, 48 per page, sorted by name. Search matches name, short description, and slug.
  `{ items: { id, name, slug, shortDescription, categoryName, categorySlug }[], page, limit, total, totalPages, categories }`
  `categories` lists every active root category, including those with no active tools, plus that active count. An unknown category slug returns an empty page rather than 404.

### `GET /api/v1/catalog/tools/:slug`
- **Auth:** Public
- **Response (`200`):** `PublicToolDetail` — Active tool (`isActive: true`) matching `slug`, populated with `category`, `pillar`, `subPillar`, and up to 6 existing MongoDB `relatedTools`:
  `{ id, name, slug, shortDescription, creator, reviewers, iconUrl, executionType, componentKey, category, pillar, subPillar, relatedTools, metaTitle, metaDescription, canonicalUrl, ogTitle, ogDescription, keywords, indexable, robotsFollow, robotsNoarchive, robotsNosnippet, robotsNoimageindex, robotsMaxSnippet, robotsMaxImagePreview, robotsMaxVideoPreview, ogImageUrl, ogImageAlt, ogType, ogSiteName, twitterCard, twitterTitle, twitterDescription, twitterImageUrl, twitterImageAlt, twitterSite, schemaTypes, sitemapInclude, sitemapPriority, sitemapChangeFrequency, isFeatured, updatedAt }`
  `creator` is `null` or `{ name, linkedInUrl, designation, about }`. `reviewers` is an array of that same shape.
  where each entry in `relatedTools` has `{ id, name, slug, shortDescription, iconUrl, componentKey, isActive, isFeatured, categoryName, categorySlug, pillarName }`.
  All SEO fields remain optional; blank values mean public `generateMetadata` uses documented fallbacks (`brain/SEO_STANDARDS.md`).
  Also returns embed prefs: `embedEnabled`, `embedDefaultHeight`, `embedPreferredLayout`, `embedAllowedDomains` (see `brain/EMBED_STANDARDS.md`).
- **Errors:** `404 NOT_FOUND` if slug format is invalid, missing, or `isActive` is `false`.

---

## 3. Admin Authentication Endpoints (Implemented)

Mounted at `/api/v1/admin/auth` (`backend/src/modules/auth/admin-auth.router.ts`).

| Method | Path | Auth | Rate Limit | Request Shape (Zod) | Response `data` (`200`) | Specific Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/admin/auth/login` | Public | 10 / 15m / IP | `{ email, password (8..128), rememberMe?: boolean }` | `{ user: SafeAdminUser, sessionId, expiresAt }` | `400 VALIDATION_ERROR`, `401 INVALID_CREDENTIALS`, `403 ACCOUNT_DISABLED`, `429 ACCOUNT_LOCKED`, `429 LOGIN_RATE_LIMITED` |
| `POST` | `/admin/auth/forgot-password` | Public | 5 / 15m / IP | `{ email }` | `{ message }` (generic anti-enumeration text) | `400 VALIDATION_ERROR`, `429 FORGOT_PASSWORD_RATE_LIMITED`, `503 EMAIL_DELIVERY_FAILED` |
| `POST` | `/admin/auth/reset-password` | Public | 5 / 15m / IP | `{ token, newPassword (8..128), confirmPassword }` | `{ message }` | `400 VALIDATION_ERROR`, `400 INVALID_RESET_TOKEN`, `429 FORGOT_PASSWORD_RATE_LIMITED` |
| `POST` | `/admin/auth/logout` | Admin | — | — | `{ message: "Logged out successfully" }` | Auth errors |
| `GET` | `/admin/auth/me` | Admin | — | — | `SafeAdminUser` | Auth errors, `404 NOT_FOUND` |
| `PATCH` | `/admin/auth/profile` | Admin | — | `{ name (2..100) }` | `SafeAdminUser` | `400 VALIDATION_ERROR`, `404 NOT_FOUND` |
| `POST` | `/admin/auth/change-password` | Admin | — | `{ currentPassword, newPassword, confirmPassword }` | `{ message }` (revokes all sessions) | `400 VALIDATION_ERROR`, `400 INVALID_CURRENT_PASSWORD`, `404 NOT_FOUND` |

---

## 4. Admin Categories Endpoints (Implemented)

Mounted at `/api/v1/admin/categories` (`backend/src/modules/categories/category.router.ts`). All routes require `authenticateAdmin`.

| Method | Path | Query / Body (Zod) | Response `data` | Specific Errors |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/admin/categories` | Query: `page` (default 1), `limit` (1..50, default 10), `search` | `{ items: CategoryNode[], page, limit, total, totalPages }` (3-level nested tree) | `400 VALIDATION_ERROR` |
| `GET` | `/admin/categories/options` | — | `{ id, name, kind }[]` (`category` & `pillar` nodes) | — |
| `GET` | `/admin/categories/:id` | Param: `id` | `CategoryNode` (`children: []`) | `404 NOT_FOUND` |
| `POST` | `/admin/categories` | Body: `{ name, slug?, kind ('category'\|'pillar'\|'sub_pillar'), parentId?, description?, sortOrder?, isActive? }` | `CategoryNode` (`201`) | `400 VALIDATION_ERROR`, `400 INVALID_PARENT`, `400 PARENT_REQUIRED`, `409 SLUG_TAKEN` |
| `PATCH` | `/admin/categories/:id` | Body (at least 1 field): `{ name?, slug?, description?, sortOrder?, isActive? }` | `CategoryNode` | `400 VALIDATION_ERROR`, `404 NOT_FOUND`, `409 SLUG_TAKEN` |
| `DELETE` | `/admin/categories/:id` | Param: `id` (cascade-deletes child pillars & sub-pillars) | `{ deleted: number }` | `404 NOT_FOUND` |

---

## 5. Admin Media Endpoints (Implemented)

Mounted at `/api/v1/admin/media` (`backend/src/modules/media/media.router.ts`). All routes require `authenticateAdmin`.

| Method | Path | Query / Body (Zod) | Response `data` | Specific Errors |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/admin/media` | Query: `page` (default 1), `limit` (1..48, default 24), `search`, `type` (`image`, `png`, `jpg`, `jpeg`, `webp`, `svg`, `gif`, `pdf`) | `{ items: MediaItem[], page, limit, total, totalPages }` | `400 VALIDATION_ERROR` |
| `POST` | `/admin/media/upload-url` | Body: `{ fileName (1..180), contentType, size (int > 0, <= 10 MB) }` | `{ driver: local\|s3, uploadUrl, key, contentType, publicUrl }` (`201`). `local` `uploadUrl` is `/api/media-upload?key=...`. `s3` `uploadUrl` is a 300s signed PUT. | `400 UNSUPPORTED_TYPE`, `400 FILE_TOO_LARGE`, `503 S3_NOT_CONFIGURED` |
| `PUT` | `/admin/media/object` | Query `key`. Raw body, max 10 MB. Used by the Next.js local upload route, not the browser. | `{ key, size }` | `401 UNAUTHORIZED`, `400 INVALID_KEY`, `400 UNSUPPORTED_TYPE`, `400 FILE_TOO_LARGE`, `409 WRONG_DRIVER` |
| `POST` | `/admin/media` | Body: `{ key, fileName, contentType, width?, height?, altText? }` | `MediaItem` (`201`) | `400 INVALID_KEY`, `400 UNSUPPORTED_TYPE`, `400 UPLOAD_MISSING`, `400 FILE_TOO_LARGE`, `400 TYPE_MISMATCH`, `409 ALREADY_SAVED`, `502 STORAGE_ERROR` |
| `DELETE` | `/admin/media/:id` | Param: `id`. Deletes the file from disk when `url` starts with `/uploads/`, otherwise from S3, then deletes the DB doc. | `{ id }` | `404 NOT_FOUND`, `502 STORAGE_ERROR` |

---

## 6. Admin Tools Endpoints (Implemented)

Mounted at `/api/v1/admin/tools` (`backend/src/modules/tools/tool.router.ts`). All routes require `authenticateAdmin`.

| Method | Path | Query / Body (Zod) | Response `data` | Specific Errors |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/admin/tools` | Query: `page` (1), `limit` (1..50, 10), `search`, `categoryId`, `status` (`active`\|`inactive`), `sort` (`name`\|`updatedAt`), `order` (`asc`\|`desc`) | `{ items: ToolRecord[], page, limit, total, totalPages }` | `400 VALIDATION_ERROR` |
| `GET` | `/admin/tools/placement` | — | `{ id, name, kind, parentId }[]` | — |
| `GET` | `/admin/tools/:id` | Param: `id` | `ToolRecord` | `404 NOT_FOUND` |
| `POST` | `/admin/tools` | Body (`toolFieldsSchema`): core tool fields plus optional SEO and embed prefs (`embedEnabled?`, `embedDefaultHeight?` 320–4000, `embedPreferredLayout?`, `embedAllowedDomains?`, `isActive?`, `isFeatured?`) | `ToolRecord` (`201`) | `400 VALIDATION_ERROR`, `400 INVALID_PLACEMENT`, `400 INVALID_ICON`, `409 NAME_TAKEN`, `409 SLUG_TAKEN` |
| `PATCH` | `/admin/tools/:id` | Body (`toolFieldsSchema` — full fields required by schema on PATCH; all SEO fields still optional strings/booleans/nulls) | `ToolRecord` | Same as `POST` + `404 NOT_FOUND` |
| `DELETE` | `/admin/tools/:id` | Param: `id` | `{ id }` | `404 NOT_FOUND` |
| `GET` | `/admin/tools/development-audit` | — | `{ report: StoredAudit \| null }` | Auth errors |
| `GET` | `/admin/tools/development-audit/catalog` | — | `{ id, name, slug, category, componentKey, isDeveloped, isDevelopedPersisted }[]` for every tool. `isDevelopedPersisted` is false when the field has never been written. | Auth errors |
| `POST` | `/admin/tools/development-audit` | Body: audit totals, category stats, duplicate groups, rows (max 20,000), conclusive `updates`, and `initializeIds`. Component paths must be empty or start with `src/` and must not contain `..`. | `{ report: StoredAudit }` | `400 VALIDATION_ERROR`, auth errors |

`ToolRecord` now includes `isDeveloped`. The public catalog does not. These three routes are registered before `GET /admin/tools/:id`. Audit writes use `timestamps: false`, so catalog `updatedAt` order does not change. `StoredAudit` is `{ ranAt, source, warning, totals, categories, duplicates, newlyDeveloped, regressed, updatedCount, rows, history }`.

---

## 7. Public Currency Rates (Implemented)

Mounted at `/api/v1/currency` (`backend/src/modules/currency/currency.router.ts`).

### `GET /api/v1/currency/rates`
- **Auth:** Public
- **Query:** `base` (optional, default `USD`) — 3-letter ISO code for the stored `CurrencyRate` document
- **Response (`200`):** `{ available, baseCurrency, rates, fetchedAt, isStale, staleThresholdHours, supportedCurrencies }`
  - `rates` is units of each code per 1 unit of `baseCurrency` (base rate = 1)
  - `isStale` is true when `fetchedAt` is older than 48 hours (still readable)
  - When no active rates exist, `available` is false and `rates` is empty
- **Errors:** `400 VALIDATION_ERROR` for a bad `base`; `404 NOT_FOUND` when other bases exist but the requested base does not
- **Next.js loader:** `frontend/src/server/currency/rates.ts` (`getCurrencyRates`) — server-only, `Browser → Next.js → Express → MongoDB`

---

## 8. Admin SEO campaigns (ADR-027)

All routes use `authenticateAdmin`. Browser code calls them through `frontend/src/server/seo/campaign-actions.ts`.

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `GET` | `/admin/seo/eligible-tools` | Active, developed Finance & Business calculators |
| `GET` | `/admin/seo/campaigns` | Recent campaigns |
| `POST` | `/admin/seo/campaigns` | Create a pilot (`name`, `toolIds`, max 20) and enqueue research |
| `GET` | `/admin/seo/campaigns/:id` | Campaign plus draft rows |
| `GET` | `/admin/seo/drafts/:id` | Keyword facts, SERP titles, content, validation |
| `PATCH` | `/admin/seo/drafts/:id` | Save edited content and re-validate. Returns the draft to review. |
| `POST` | `/admin/seo/drafts/:id/approve` | Lock a draft that has no blocking checks |
| `POST` | `/admin/seo/drafts/:id/publish` | Write meta fields and mark the guide published. Does not change `isActive` or `indexable`. |
| `POST` | `/admin/seo/drafts/:id/unpublish` | Hide the published guide. The file guide returns. Meta fields already written stay. |
| `POST` | `/admin/seo/drafts/:id/regenerate` | `{ researchAgain: boolean }`. Copy only, or keyword research again. |
| `POST` | `/admin/seo/drafts/:id/retry` | Re-queue a failed step |

`503 SEO_NOT_CONFIGURED` when Redis, DataForSEO, or OpenAI env is missing. Public `GET /catalog/tools/:slug` adds `publishedGuide` (`null` when nothing is published).

---

## 9. Planned / Unimplemented Endpoints

The following capabilities exist only as empty backend module directories (`.gitkeep`) or frontend UI previews and are **not implemented**:

- Contact / tool suggestion submission (`POST /api/v1/contact` or similar)
- Server-side or third-party tool execution endpoints
- Admin staff management (`/api/v1/admin/users`)
- Analytics & telemetry ingestion/queries (`/api/v1/admin/analytics`)
- Audit / activity logs (`/api/v1/admin/activity-logs`)
- CMS pages management (`/api/v1/admin/pages`)
- Global SEO site settings and system settings persistence (`/api/v1/admin/settings`). `/api/v1/admin/seo` is the finance SEO campaign API (ADR-027), not the mock `/admin/seo` preview.
- Third-party integration credential management (`/api/v1/admin/integrations`)
- Background jobs (`/api/v1/admin/jobs`) & public user uploads (`/api/v1/uploads`)

