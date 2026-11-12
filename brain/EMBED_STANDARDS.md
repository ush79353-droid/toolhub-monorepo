# Embed Standards — Omega Calculators

> Locked conventions for iframe embedding of implemented calculators.

Read with: `AGENTS.md`, `CALCULATOR_STANDARDS.md`, `SEO_STANDARDS.md`, `ARCHITECTURE.md`.

## 1. Architecture

- Dedicated route: `/embed/[slug]` (minimal layout, no site header/footer/article/TOC/related).
- Same allowlisted calculator components power `/tools/[slug]` and `/embed/[slug]`.
- Do **not** duplicate calculation engines or create per-tool embed routes.
- API boundary unchanged: Browser → Next.js Server → Express → MongoDB.
- Presentation flag: `ToolWorkspace` / `ToolComponentProps.presentation = 'embed' | 'default'`.

## 2. Eligibility

A tool may render inside an embed only when **all** are true:

1. Tool exists in MongoDB catalog
2. `isActive === true`
3. `componentKey` is allowlisted and registered
4. `embedEnabled === true`

Otherwise show: “This calculator is not available for embedding.” (optional link to `/tools/{slug}` when active).

`isActive` alone is never proof of implementation.

## 3. Admin settings (Tool Editor → Embedding & Sharing)

| Field | Default | Notes |
| :--- | :--- | :--- |
| `embedEnabled` | `false` | Required gate |
| `embedDefaultHeight` | `650` | 320–4000 px |
| `embedPreferredLayout` | `responsive` | or `compact` |
| `embedAllowedDomains` | `''` | Advisory comma-separated hosts — **not** signed auth |

Existing records stay non-embeddable until an admin enables embedding.

## 4. Embed code

Generate iframe HTML with escaped attributes, production origin from `NEXT_PUBLIC_SITE_URL` / `SITE_URL` (never invent a domain; warn on localhost).

Optional `/embed.js` auto-resize script:

- Message namespace: `source: 'omega-calculators-embed'`
- Types: `ready`, `resize` (+ `embedId`, `height`)
- Host validates `event.origin` against iframe `src` origin and optional `data-omega-embed-origin`
- Host validates `event.source === iframe.contentWindow`
- Never execute message payloads; throttle near-duplicate heights

Iframe-only installs must work with fixed height when the script is omitted.

## 5. Security

- Non-embed pages: `Content-Security-Policy: frame-ancestors 'self'` + `X-Frame-Options: SAMEORIGIN`
- Embed pages: `frame-ancestors *` (public calculators), `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`
- Do not rely on Referer/Origin alone as authorization
- Public embed URLs can be reused unless a stronger signed system is added later
- No admin cookies, admin APIs, or secrets in embed surfaces

## 6. SEO

- Embed routes: `noindex, nofollow`
- Canonical may point to the normal `/tools/{slug}` page
- Never include embed URLs in sitemaps
- Do not let admin SEO titles create indexable duplicate embed pages

## 7. Cache / disable behavior

- Catalog fetch: `cache: 'no-store'`
- Admin save revalidates `/tools/{slug}` and `/embed/{slug}`
- Disabling `embedEnabled` stops calculator render on the next embed request; normal tool page stays live

## 8. Public UX

- Eligible normal pages show a compact **Embed** control near the calculator
- Dialog: preview, copy iframe, copy URL, height, optional auto-resize snippet, short install steps
- Hide Embed when not eligible

## 9. Testing

- Loan + Auto Loan embeds; disabled / inactive / unimplemented / invalid slug
- Admin enable/disable persistence
- Interactions: currency, dates, results, charts, schedules, copy/reset
- Widths: 320 / 375 / 480 / 768 + desktop (no horizontal overflow)
- postMessage validation; CSP framing split; noindex
- Unit tests: `frontend/src/lib/embed/tool-embed.test.ts`

## 10. Future calculators

Register allowlisted `componentKey` → when admin enables embed, `/embed/[slug]` works automatically. No calculator-specific embed forks.
