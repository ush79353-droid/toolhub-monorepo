# Database Schema & Models (`DATABASE.md`)

Database: **MongoDB** accessed strictly from `backend/` via **Mongoose** (`^8.10.1`, `mongoose.set('strictQuery', true)`).

Only **5 Mongoose models** exist in the codebase today. No other collections (`analytics`, `audit_logs`, `cms_pages`, `settings`, `integrations`) are implemented yet.

---

## 1. `AdminUser` (`collection: 'admin_users'`)

- **Source:** `backend/src/modules/admins/admin-user.model.ts`
- **Responsibility:** Stores administrator accounts, Argon2id password hashes, account status, login lockout state, and single-use password reset token hashes.

### Fields & Validation

| Field | Type | Constraints / Validation | Default |
| :--- | :--- | :--- | :--- |
| `name` | `String` | Required, trimmed, `maxlength: 100` | — |
| `email` | `String` | Required, unique, trimmed, lowercase, email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | — |
| `passwordHash` | `String` | Required, `select: false` (hidden in default queries) | — |
| `role` | `String` | Required, enum `['super_admin', 'admin']` | `'admin'` |
| `status` | `String` | Required, enum `['active', 'disabled']` | `'active'` |
| `lastLoginAt` | `Date` | Optional | — |
| `passwordChangedAt` | `Date` | Optional | — |
| `passwordResetTokenHash` | `String` | Optional, `select: false` (SHA-256 hex digest) | — |
| `passwordResetExpiresAt` | `Date` | Optional | — |
| `failedLoginAttempts` | `Number` | Counter for consecutive failed logins | `0` |
| `lockUntil` | `Date` | Optional (set to `+15 min` at 5 failures) | — |
| `createdAt`, `updatedAt` | `Date` | Managed by `{ timestamps: true }` | — |

### Indexes & Methods
- Unique index on `email` (`unique: true, index: true`).
- Index on `status` (`index: true`).
- Instance method `toSafeObject()` strips `passwordHash`, `passwordResetTokenHash`, `passwordResetExpiresAt`, `failedLoginAttempts`, and `lockUntil`.

---

## 2. `AdminSession` (`collection: 'admin_sessions'`)

- **Source:** `backend/src/modules/auth/admin-session.model.ts`
- **Responsibility:** Server-side database-backed sessions enabling immediate session revocation and automatic expiration cleanup.

### Fields & Relationships

| Field | Type | Constraints / Relationships | Default |
| :--- | :--- | :--- | :--- |
| `sessionId` | `String` | Required, unique (64-char hex from 32 random bytes) | — |
| `adminId` | `ObjectId` | Required, `ref: 'AdminUser'` | — |
| `role` | `String` | Required, enum `['super_admin', 'admin']` | — |
| `expiresAt` | `Date` | Required (MongoDB TTL expiration timestamp) | — |
| `ipAddress` | `String` | Optional | — |
| `userAgent` | `String` | Optional | — |
| `lastActiveAt` | `Date` | Updated on authenticated requests | `Date.now` |
| `createdAt`, `updatedAt` | `Date` | Managed by `{ timestamps: true }` | — |

### Indexes
- Unique index on `sessionId`.
- Index on `adminId`.
- **TTL Index:** `expiresAt` (`index: { expires: 0 }`) — MongoDB automatically purges expired session documents.

---

## 3. `Category` (collection: `categories`)

- **Source:** `backend/src/modules/categories/category.model.ts`
- **Responsibility:** Unified 3-level self-referential hierarchy representing top-level **Categories**, **Pillars**, and **Sub-pillars**.

### Fields & Relationships

| Field | Type | Constraints / Relationships | Default |
| :--- | :--- | :--- | :--- |
| `name` | `String` | Required, trimmed, `maxlength: 160` | — |
| `slug` | `String` | Required, trimmed, lowercase | — |
| `seedKey` | `String` | Optional, trimmed (used by `seed-categories.ts` / `seed-tools.ts`) | — |
| `kind` | `String` | Required, enum `['category', 'pillar', 'sub_pillar']` | — |
| `parent` | `ObjectId \| null` | `ref: 'Category'` (`null` for `category`, points to `category` for `pillar`, points to `pillar` for `sub_pillar`) | `null` |
| `sortOrder` | `Number` | Required | `0` |
| `description` | `String` | `maxlength: 2000` | `''` |
| `iconUrl` | `String` | Public URL of the category icon. Empty unless set. Local files use `/uploads/<key>`. | `''` |
| `iconMedia` | `ObjectId \| null` | `ref: 'MediaAsset'` | `null` |
| `isActive` | `Boolean` | Visibility flag | `true` |
| `createdAt`, `updatedAt` | `Date` | Managed by `{ timestamps: true }` | — |

### Indexes
- `{ slug: 1 }` (`unique: true`)
- `{ seedKey: 1 }` (`unique: true, sparse: true`)
- `{ parent: 1, sortOrder: 1 }`

---

## 4. `MediaAsset` (collection: `mediaassets`)

- **Source:** `backend/src/modules/media/media.model.ts`
- **Responsibility:** Tracks media files (`media/<uuid>.<ext>`) for tool icons and the library. The file itself is on local disk or S3, chosen by `STORAGE_DRIVER` at upload time.

### Fields

| Field | Type | Constraints | Default |
| :--- | :--- | :--- | :--- |
| `fileName` | `String` | Required, trimmed, `maxlength: 180` | — |
| `contentType` | `String` | Required (validated MIME: png, jpeg, webp, svg+xml, gif, pdf) | — |
| `size` | `Number` | Required (verified from the stored file, max 10 MB) | — |
| `width` | `Number` | Optional | — |
| `height` | `Number` | Optional | — |
| `altText` | `String` | `maxlength: 300` | `''` |
| `key` | `String` | Required (`media/<uuid>.<ext>`, same key on disk and on S3) | — |
| `url` | `String` | Required. Local files use `/uploads/<key>`. S3 files use `AWS_BASE_URL` + key. Delete uses this to pick the driver. | — |
| `createdAt`, `updatedAt` | `Date` | Managed by `{ timestamps: true }` | — |

### Indexes
- `{ key: 1 }` (`unique: true`)
- `{ createdAt: -1 }`

---

## 5. `Tool` (collection: `tools`)

- **Source:** `backend/src/modules/tools/tool.model.ts`
- **Responsibility:** Catalog metadata, taxonomy placement, icon reference, SEO tags, and visibility flags for each tool. *(Note: Executable calculator UI/logic lives in `frontend/src/tools/`, not in this collection.)*

### Fields & Relationships

| Field | Type | Constraints / Relationships | Default |
| :--- | :--- | :--- | :--- |
| `name` | `String` | Required, trimmed, `maxlength: 160` | — |
| `nameKey` | `String` | Required (lowercased trimmed `name` for case-insensitive uniqueness) | — |
| `slug` | `String` | Required, trimmed, lowercase | — |
| `category` | `ObjectId` | Required, `ref: 'Category'` (must have `kind === 'category'`) | — |
| `pillar` | `ObjectId \| null` | `ref: 'Category'` (`kind === 'pillar'`, child of `category`) | `null` |
| `subPillar` | `ObjectId \| null` | `ref: 'Category'` (`kind === 'sub_pillar'`, child of `pillar`) | `null` |
| `iconMedia` | `ObjectId \| null` | `ref: 'MediaAsset'` (image MIME required) | `null` |
| `iconUrl` | `String` | Resolved URL from `MediaAsset.url` | `''` |
| `executionType` | `String` | Enum `['client', 'server', 'third-party']` | `'client'` |
| `componentKey` | `String` | Trimmed, `maxlength: 100` (allowlisted frontend registry key, e.g. `'AutoLoanCalculator'`) | `''` |
| `shortDescription` | `String` | `maxlength: 500` | `''` |
| `metaTitle` | `String` | `maxlength: 70` | `''` |
| `metaDescription` | `String` | `maxlength: 160` | `''` |
| `canonicalUrl` | `String` | `maxlength: 300` | `''` |
| `ogTitle` | `String` | `maxlength: 70` | `''` |
| `ogDescription` | `String` | `maxlength: 200` | `''` |
| `keywords` | `String` | `maxlength: 200` | `''` |
| `indexable` | `Boolean` | Search crawler indexing toggle | `true` |
| `isActive` | `Boolean` | Active status flag | `true` |
| `isFeatured` | `Boolean` | Homepage featured promotion flag | `false` |
| `createdAt`, `updatedAt` | `Date` | Managed by `{ timestamps: true }` | — |

### Indexes
- `{ nameKey: 1 }` (`unique: true`)
- `{ slug: 1 }` (`unique: true`)
- `{ category: 1, updatedAt: -1 }`

