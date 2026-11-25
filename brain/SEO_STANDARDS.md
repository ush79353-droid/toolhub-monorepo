# SEO Standards — Omega Calculators

> Locked conventions for admin-editable, optional tool SEO. Applies to every public `/tools/[slug]` page.

## 1. Architecture

- SEO lives on the MongoDB `Tool` record (flat optional fields).
- Admin edits via Tool Editor → Express `/api/v1/admin/tools`.
- Public pages read SEO only through Next.js server → Express `/api/v1/catalog/tools/:slug`.
- Metadata is built in `frontend/src/lib/seo/tool-seo.ts` and applied by `generateMetadata()` in `tools/[slug]/page.tsx`.
- Do **not** hardcode SEO inside calculator components.

## 2. Optional Field Policy

Every editable SEO field is optional. Blank means “use fallback.” Saving a tool never requires SEO fields.

## 3. Supported Fields

Basic (Admin UI): `metaTitle`, `metaDescription`, `keywords`, `canonicalUrl`  
Open Graph: `ogTitle`, `ogDescription`, `ogImageUrl`, `ogImageAlt`, `ogType`, `ogSiteName`  
Twitter/X: `twitterCard`, `twitterTitle`, `twitterDescription`, `twitterImageUrl`, `twitterImageAlt`, `twitterSite`  
Structured data: `schemaType`, `includeFaqSchema`  

Admin SEO UI does **not** expose robots directives or sitemap fields. Public robots default to index/follow when the tool is active + allowlisted/`implemented`; otherwise `noindex`.

## 4. Fallbacks

| Field | Fallback chain |
| :--- | :--- |
| Title | Admin meta title → `Tool Name \| Omega Calculators` |
| Description | Admin meta description → short description → safe summary |
| Canonical | Valid admin http(s) URL → `SITE_URL`/`NEXT_PUBLIC_SITE_URL` + `/tools/{slug}` |
| OG title | OG title → meta title → tool name |
| OG description | OG description → meta description → short description |
| OG image | OG image → `siteConfig.defaultOgImage` |
| Twitter title/description/image | Twitter → OG → meta fallbacks |
| Robots index | Admin index **and** tool is active **and** `componentKey` is allowlisted |

## 5. Canonical Rules

- Production canonicals must never use localhost.
- Configure `NEXT_PUBLIC_SITE_URL` (or `SITE_URL`) to the real public https origin.
- Reject unsafe schemes (`javascript:`, etc.).
- Normalize trailing slashes consistently via the shared helper.

## 6. Crawl surfaces

- `frontend/src/app/robots.ts` — allow public site; disallow `/admin/`, `/api/`, `/embed/`.
- `/sitemap.xml` is a sitemap index. `/sitemap/static.xml` lists the fixed pages in `frontend/src/config/static-sitemap.ts` (their `lastModified` is stored there) plus each active category hub.
- Each pillar has `/sitemap/{pillarSlug}.xml`. That file lists the pillar section on its category page and the pillar's tool URLs.
- Do not add a tool slug to a sitemap file. A tool is included only when `isActive`, `indexable`, and `sitemapInclude` are on, a `SeoDraft` is `published`, and its component is registered. Tools with no pillar go in `/sitemap/unassigned.xml`.
- **Site-wide indexing kill switch:** `SITE_ALLOW_INDEXING` must be exactly `true` to allow crawling. When unset/false: `robots.txt` is `Disallow: /`, and a production sitemap is empty. `next dev` still renders the sitemap on localhost so the files can be checked. Root and tool meta stay `noindex,nofollow` until the flag is on.

## 7. Cache Policy

- Public tool fetches use `cache: 'no-store'`.
- Admin `saveToolAction` / `deleteToolAction` call `revalidatePath` for `/`, `/tools`, `/tools/{slug}`, and `/embed/{slug}`.
- After an admin SEO save, the next request to the public page must reflect the new metadata.

## 8. Structured Data

- Generated from typed fields + real page content only.
- Allowed types: `WebPage`, `WebApplication`, `BreadcrumbList`, optional `FAQPage` when matching FAQs are visible on the page.
- JSON-LD is escaped (`<` → `\u003c`). No raw script editor.

## 9. Testing

- Unit tests: `frontend/src/lib/seo/tool-seo.test.ts`
- Verify admin save → MongoDB → catalog API → HTML `<head>` for Loan Calculator and Auto Loan Calculator.
- Keep calculator math tests green when SEO changes.

## 10. Published guide override (ADR-027)

Finance SEO campaigns store drafts in `SeoCampaign` / `SeoDraft`. Nothing is public until an admin publishes.

- DataForSEO supplies keyword and SERP facts. OpenAI drafts copy. The server rejects a primary keyword that was not in the DataForSEO list.
- Publish writes `metaTitle`, `metaDescription`, `keywords`, matching Open Graph and Twitter title/description, and `includeFaqSchema`. It does not write `isActive`, `indexable`, `isDeveloped`, `embedEnabled`, or `componentKey`.
- `/tools/[slug]` renders `PublishedGuideArticle` only when a published draft exists. Otherwise the calculator file guide stays.
- `/admin/seo` remains the non-saving site preview. Campaigns live at `/admin/seo-campaigns`.

