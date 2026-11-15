# Embed Standards — Omega Calculators

> Locked conventions for iframe embedding of implemented calculators.

Read with: `AGENTS.md`, `CALCULATOR_STANDARDS.md`, `SEO_STANDARDS.md`, `ARCHITECTURE.md`.

## 1. Architecture

- Dedicated route: `/embed/[slug]` (minimal layout, no site header/footer/article/TOC/related/ads).
- Same allowlisted calculator components power `/tools/[slug]` and `/embed/[slug]`.
- Do **not** duplicate calculation engines or create per-tool embed routes.
- API boundary unchanged: Browser → Next.js Server → Express → MongoDB.
- Presentation flag: `ToolWorkspace` / `ToolComponentProps.presentation = 'embed' | 'default'`.

## 2. Default policy (locked)

**Embedding is ENABLED by default for every tool.**

| Stored value | Effective |
| :--- | :--- |
| `embedEnabled === false` | Disabled |
| `embedEnabled === true` | Enabled |
| `embed` / `embedEnabled` missing | Enabled |

Only an explicit admin disable turns embedding off.

Helpers: `resolveEmbedEnabled()` / `isToolEmbedEligible()` in `frontend/src/lib/embed/tool-embed.ts`.

## 3. Public render eligibility

A tool may **render** a working embed / show the public **Embed** button only when **all** are true:

1. Tool exists in MongoDB catalog
2. `isActive === true`
3. `componentKey` is allowlisted and registered
4. `resolveEmbedEnabled(embedEnabled)` is true (missing → true)

Otherwise:

- No public Embed button
- `/embed/[slug]` shows “This calculator is not available for embedding.” (optional link to `/tools/{slug}` when active)

Default permission ≠ implementation availability. Catalog-only tools stay non-renderable.

## 4. Admin settings (Tool Editor → Embedding & Sharing)

| Field | Default | Notes |
| :--- | :--- | :--- |
| `embedEnabled` / Allow Embedding | `true` | Explicit OFF blocks button + embed route |
| `embedDefaultHeight` | `650` | 320–4000 px |
| `embedPreferredLayout` | `responsive` | or `compact` |
| `embedAllowedDomains` | `''` | Advisory comma-separated hosts — **not** signed auth |

When OFF: hide public Embed button, block embed route, keep normal `/tools/{slug}` live.

## 5. Public Embed button

- Shared `/tools/[slug]` page only (near calculator controls)
- Label: **Embed**
- Opens `CalculatorEmbedDialog` (URL, iframe code, height, preview, optional auto-resize)
- No duplicate dialogs / buttons

## 6. Embed code

Generate iframe HTML with escaped attributes, production origin from `NEXT_PUBLIC_SITE_URL` / `SITE_URL` (never invent a domain; warn on localhost).

Optional `/embed.js` auto-resize script:

- Message namespace: `source: 'omega-calculators-embed'`
- Types: `ready`, `resize` (+ `embedId`, `height`)
- Host validates `event.origin` against iframe `src` origin and optional `data-omega-embed-origin`
- Host validates `event.source === iframe.contentWindow`
- Never execute message payloads; throttle near-duplicate heights

Iframe-only installs must work with fixed height when the script is omitted.

## 7. Security

- Non-embed pages: `Content-Security-Policy: frame-ancestors 'self'` + `X-Frame-Options: SAMEORIGIN`
- Embed pages: `frame-ancestors *`, `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`
- Do not rely on Referer/Origin alone as authorization
- Public embed URLs can be reused without signed tokens unless a future auth layer is added
- No admin cookies, admin APIs, or secrets in embed surfaces

## 8. SEO

- Embed routes: `noindex, nofollow`
- Canonical may point to the normal `/tools/{slug}` page
- Never include embed URLs in sitemaps

## 9. Cache / disable behavior

- Catalog fetch: `cache: 'no-store'`
- Admin save revalidates `/tools/{slug}` and `/embed/{slug}`
- Disabling `embedEnabled` stops calculator render on the next embed request

## 10. Data correction

If older code wrote `embedEnabled: false` as an automatic default for implemented tools, run:

`cd backend && npm run tools:embed-defaults`

This only flips `false → true` for allowlisted `componentKey` values. Later admin OFF values should not be re-run blindly.

## 11. Testing

- Loan + Auto Loan: Embed button visible by default
- Admin OFF → button hidden + embed unavailable; re-enable restores
- Missing config inherits ON
- Unimplemented / inactive: no broken embed
- Embed UI without header/footer/article/ads/sticky
- Unit tests: `frontend/src/lib/embed/tool-embed.test.ts`

## 12. Future calculators

Register allowlisted `componentKey` → embedding is ON by default. Admin may opt out. No calculator-specific embed forks.
