# Tool Detail Page Standards — OmegaCalculators

> Authoritative standard for every public `/tools/[slug]` calculator page. Loan Calculator is the production reference.

Read with: `AGENTS.md`, `CALCULATOR_STANDARDS.md`, `SEO_STANDARDS.md`, `EMBED_STANDARDS.md`, `AD_STANDARDS.md`, `DESIGN_SYSTEM.md`.

## 1. Dynamic routing & registry

- Route: `frontend/src/app/(website)/tools/[slug]/page.tsx`
- Resolve MongoDB tool via Next server → Express `/catalog/tools/:slug` (`cache: 'no-store'`)
- Render via allowlisted `componentKey` → `ToolWorkspace` → registry
- Never hardcode per-calculator page routes or SEO inside calculator components
- Sample-data fallback remains for legacy preview slugs only (`noindex`)

## 2. Page layout (Loan reference)

- Breadcrumbs above content
- Optional `AdSlot` top banner (placeholder only)
- Desktop two-column: ~62% editorial / ~38% calculator; single column `<1024px`
- One unified left intro card (H1 + intro + TOC + related)
- Guide article card below (educational sections + visible FAQs)
- Sticky calculator: `StickyCalculatorAside` (viewport-capped, no nested sticky ads)
- Optional bottom `AdSlot` before footer
- Embed control lives **inside** calculator header (`headerActions`) so cards stay top-aligned

## 3. SEO metadata

- Shared pipeline only: `lib/seo/tool-seo.ts` + `generateMetadata()`
- Admin fields optional; documented fallbacks (`SEO_STANDARDS.md`)
- Visible H1 = tool name; SEO title may differ
- Production canonicals never use localhost (`NEXT_PUBLIC_SITE_URL` / `SITE_URL`)
- Index only when `isActive` + admin indexable + allowlisted `componentKey`
- Revalidate `/tools/{slug}` (and `/embed/{slug}`) on admin save

## 4. Indexability & crawl

- `app/robots.ts`: allow public site; disallow `/admin/`, `/api/`, `/embed/`
- `app/sitemap.ts`: static pages + categories + implemented eligible tools only
- Embed routes: `noindex` + excluded from sitemap + CSP `frame-ancestors` split
- Do not index empty/unimplemented catalog shells as working calculators

## 5. Structured data

- WebApplication (implemented) or WebPage + BreadcrumbList via `buildToolJsonLd`
- FAQPage only when matching Q&A are visible on the page (Loan/Auto Loan guides)
- Escape JSON-LD (`serializeJsonLd`); no fabricated ratings/reviews/prices
- No unrestricted admin JSON-LD editor

## 6. Content & semantics

- Exactly one page H1
- Logical H2/H3 in guide articles and TOC anchors (`scroll-mt-24`)
- Useful educational copy; no keyword stuffing; honest financial limitations
- Related calculators: link **implemented** tools only; others labeled Coming soon

## 7. Ads

- Shared `AdSlot` on `/tools/[slug]` only (`AD_STANDARDS.md`)
- Never on `/embed/[slug]`
- Never inside calculator forms/results
- Placeholder mode only — no AdSense/scripts in this phase

## 8. Embed

- Default ON; explicit admin OFF disables (`EMBED_STANDARDS.md`)
- Public Embed button when active + implemented + not disabled
- Dedicated `/embed/[slug]` reuses same calculator engine
- Dialog: height + URL + iframe code; focus trap + Escape + body scroll lock

## 9. Accessibility

- Labeled inputs; keyboard focus visible
- Dialogs: `role="dialog"`, focus trap, restore focus on close
- FAQ accordion semantics; table headers on schedules
- Touch targets ≥ ~36–44px for primary controls

## 10. Performance

- Keep SEO-critical content server-rendered
- Avoid unnecessary client boundaries
- Reserve ad placeholder min-heights (CLS)
- Measure with production builds; do not treat Lighthouse alone as field CWV

## 11. Security

- Browser → Next server → Express only
- Safe metadata / JSON-LD serialization
- No secrets in client bundles or Brain docs

## 12. Testing (Definition of Done)

Before marking a calculator detail page complete:

1. `generateMetadata` reflects admin SEO + fallbacks
2. Canonical / robots / sitemap eligibility correct
3. JSON-LD valid for WebApp + breadcrumbs (+ FAQ when visible)
4. Loan-style layout responsive at 320–1440px, no horizontal overflow
5. Sticky aside behavior preserved
6. Embed button + `/embed/[slug]` work; embed has no ads and is noindex
7. Related links do not point at empty shells
8. Existing calculation unit tests pass
9. Frontend type-check + lint + production build pass

## 13. Future calculators

Register allowlisted `componentKey` → inherit this page shell, SEO, ads, embed, and tests automatically. Do not fork a second detail-page architecture.
