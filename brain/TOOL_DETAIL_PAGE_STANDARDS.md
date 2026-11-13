# Tool Detail Page Standards — OmegaCalculators

> **Official master reference:** Auto Loan Calculator (`/tools/auto-loan-calculator`, `componentKey: AutoLoanCalculator`).  
> Every future public tool detail page must inherit this shared shell. Tool-specific inputs, math, results, and article copy may differ; layout/architecture must not.
>
> **History:** Loan Calculator (`/tools/loan-calculator`) was the previous master (locked 2026-11-12, ADR-014). Superseded 2026-11-13 by ADR-016 — Auto Loan is now the final approved visual master. Loan remains a peer implementation that must follow Auto Loan’s shared design.

Read with: `AGENTS.md`, `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`, `CALCULATOR_STANDARDS.md`, `SEO_STANDARDS.md`, `EMBED_STANDARDS.md`, `AD_STANDARDS.md`, `DESIGN_SYSTEM.md`.

**Verification:** Code-inspected 2026-11-13. Visually inspected live at `http://192.168.100.152:3000/tools/auto-loan-calculator` (desktop 1440 + mobile). Loan Calculator cross-checked at `/tools/loan-calculator` for shell parity.

---

## 1. Purpose & scope

| In scope | Out of scope |
| :--- | :--- |
| Shared `/tools/[slug]` page shell | Per-tool financial formulas |
| Layout, typography, spacing, cards | Forcing loan-specific fields onto unrelated tools |
| SEO, ads, embed, calculator aside | Redesigning the master page per calculator |
| Registry + Mongo catalog wiring | Direct browser → Express calls |

**Exception rule:** Any intentional deviation needs an ADR in `DECISIONS.md` and Git review. Do not invent a second page architecture.

---

## 2. Architecture (verified)

| Layer | Source | Rule |
| :--- | :--- | :--- |
| Route | `frontend/src/app/(website)/tools/[slug]/page.tsx` | One dynamic route for all tools |
| Website chrome | `(website)/layout.tsx` — `Header` + `main` + `Footer`, canvas `bg-white` | Embed route uses separate `embed/layout.tsx` (no header/footer/ads) |
| Data | Next server → Express `GET /catalog/tools/:slug` (`cache: 'no-store'`) | Never call Express from browser calculators |
| Render | `ToolWorkspace` → allowlisted `componentKey` → registry | Unimplemented keys stay catalog-only |
| SEO | `lib/seo/tool-seo.ts` + `generateMetadata()` | No hardcoded per-calculator metadata in UI components |
| Config map | `TWO_COLUMN_TOOL_CONFIGS` in page.tsx | Register new two-column tools here (TOC, guide, FAQs, aside label) |

---

## 3. Page structure (actual order)

Verified DOM/section order for two-column tools:

1. Website `Header`
2. `Breadcrumbs` (`mb-4`)
3. `AdSlot` `tool_top_banner` (`mb-5`) — enabled
4. Full-width intro card: category eyebrow → **H1** → intro
5. Main grid:
   - **Mobile/tablet (`order-1`):** calculator + TOC + guide first; sidebar second
   - **Desktop (`lg`):** left calculator/guide `col-start-1`, right sidebar widgets `col-start-2`
6. Left column (`space-y-6`):
   - `StickyCalculatorAside` → calculator panel (`headerActions` Embed + currency + form + results + schedule)
   - TOC card
   - `AdSlot` `tool_article_middle` — enabled
   - Guide article (sections + FAQ)
   - `AdSlot` `tool_article_bottom` — **disabled** by default
7. Right column: `ToolDetailSidebar` — More tools list, Related in other topics, country-rules dark card; desktop `sticky` under header (`top: 84px`, viewport-capped max-height)
8. `AdSlot` `tool_bottom_banner` (`mt-8`) — enabled
9. Website `Footer`

Conceptual outline matches this implementation; do not rearrange without approval.

---

## 4. Layout measurements (from Tailwind / constants)

| Token | Value | Source | Code | Visual |
| :--- | :--- | :--- | :---: | :---: |
| Container | `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8` | `Container.tsx` | ✓ | ✓ |
| Page vertical pad | `py-6 sm:py-9` | tools `[slug]/page.tsx` | ✓ | ✓ |
| Main grid | `grid-cols-1 gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start lg:gap-8` | page.tsx | ✓ | ✓ |
| Left stack gap | `space-y-6` | page.tsx | ✓ | ✓ |
| Sidebar widget gap | `space-y-4` (`ToolDetailSidebar`) | ToolDetailSidebar.tsx | ✓ | ✓ |
| Intro/guide cards | `rounded-2xl border border-border bg-white` + `p-5 sm:p-6` (intro) / `px-5 py-6 sm:px-8 sm:py-8` (guide) | page / `AutoLoanGuideArticle` | ✓ | ✓ |
| Calculator card | `rounded-2xl border border-border bg-white` + elevation shadow (non-embed) | `AutoLoanCalculator.tsx` | ✓ | ✓ |
| Calculator shadow | `shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]` | AutoLoanCalculator | ✓ | ✓ |
| Public canvas | `bg-white` (website layout) | `(website)/layout.tsx` | ✓ | ✓ |

---

## 5. Colors (locked)

Use design tokens only (`DESIGN_SYSTEM.md`):

| Role | Hex | Typical class |
| :--- | :--- | :--- |
| Primary | `#087E8B` | `text-primary`, `bg-primary` |
| Secondary | `#D9F0EF` | `bg-secondary` |
| Dark accent | `#163C43` | `text-accent` |
| Hover | `#066773` | `hover:bg-[hsl(var(--primary-hover))]` |
| Soft teal | `#EAF7F6` | `bg-muted`, formula `bg-brand-softTeal/55` |
| Background token | `#F7F8F6` | ad placeholders |
| Text | `#202B2D` / `#667477` | `text-foreground` / `text-muted-foreground` |
| Border | `#DCE6E5` | `border-border` |

No arbitrary new brand colors. No excessive bold or badge clutter.

---

## 6. Typography (verified)

| Element | Classes | Code | Visual |
| :--- | :--- | :---: | :---: |
| Category eyebrow | `text-[11px] font-medium uppercase tracking-[0.14em] text-primary` | ✓ | ✓ |
| H1 | `text-[30px] font-bold leading-[1.12] tracking-[-0.02em] text-accent sm:text-[34px] lg:text-[36px]` | ✓ | ✓ |
| Intro body | `text-[15px] font-normal leading-[1.7] text-muted-foreground sm:text-base sm:leading-[1.75]` | ✓ | ✓ |
| TOC / Related H2 | `text-lg font-semibold tracking-tight text-accent sm:text-xl` | ✓ | ✓ |
| Article H2 | `text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl` | ✓ | ✓ |
| Article body | `text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]` | ✓ | ✓ |
| Form labels | `text-[13px] font-medium text-accent` | ✓ | ✓ |
| Helper / muted | `text-xs font-normal text-muted-foreground` | ✓ | ✓ |
| Calculator panel title | `text-[15px] font-semibold text-accent` | ✓ | ✓ |
| Formula box | `font-mono text-xs sm:text-sm` on `rounded-xl border bg-brand-softTeal/55` | ✓ | ✓ |

Exactly **one** page H1 (tool name). SEO title may differ (admin metadata).

---

## 7. Calculator workspace pattern

### Shared (reuse)

| Concern | Location |
| :--- | :--- |
| Registry | `tools/registry/keys.ts`, `tools/registry/index.ts` |
| Workspace host | `components/shared/ToolWorkspace.tsx` (`presentation`, `headerActions`) |
| Sticky aside | `tools/calculators/auto-loan/StickyCalculatorAside.tsx` |
| Currency | `tools/shared/currency.ts`, `CurrencySelect.tsx` (denomination only, no FX) |
| Clipboard / download | `tools/shared/clipboard.ts`, `download.ts` |
| TOC | `TableOfContents.tsx` |
| Related | `RelatedCatalogTools.tsx` (link **implemented** only) |
| FAQ UI | `FAQAccordion` |
| Ads | `components/ads/AdSlot.tsx` |
| Embed control | `CalculatorEmbedDialog` via `headerActions` |

### Tool-specific (allowed to differ)

- Input schema, units, toggles, advanced options
- Calculation engine + unit tests
- Result metrics, charts, tables
- Guide article sections / FAQs / TOC ids
- Validation copy

### Form control conventions (Loan-verified)

- Control height: `h-11` (inputs, selects, Calculate/Reset)
- Affixed currency/unit fields: `h-11` flex row, muted affix `bg-muted/50`
- Primary Calculate: `h-11 flex-1 bg-primary font-medium text-white`
- Reset: `h-11` outline
- Panel body: `space-y-4 p-4 sm:p-5`
- Header row: Embed + currency on the right (keeps left/right cards top-aligned)

Do **not** force loan fields onto unrelated tools. Do **reuse** heights, labels, cards, and shared primitives.

---

## 8. Calculator aside (document flow)

Source: `StickyCalculatorAside.tsx` (name kept for registry continuity)

| Rule | Value |
| :--- | :--- |
| Positioning | Normal document flow — **not** `position: sticky` |
| Overflow | None; page scrolls as one unit (left + right columns together) |
| Role | Semantic `<aside>` landmark with `aria-label` |
| Mobile | Calculator `order-1` near top; editorial `order-2` |
| Embed | Never reuse this aside shell inside `/embed/[slug]` |

---

## 9. Educational content pattern

- Guide: `LoanGuideArticle` pattern — `divide-y` sections, `scroll-mt-24` anchors
- TOC: plain `list-disc` two-column from `sm`
- Lists: `list-disc`, no decorative check icons
- FAQ: visible accordion; FAQPage JSON-LD when FAQs are on-page
- Related: implemented → “Open” link; else “Coming soon” (no empty-shell links)
- Topic copy must be original to the tool — never paste Loan explanations into unrelated calculators

---

## 10. SEO / structured data / crawl

See `SEO_STANDARDS.md`. Summary:

- Admin → Mongo → Express catalog → `generateMetadata` / JSON-LD
- Optional fields + fallbacks; no localhost production canonicals
- Index only if active + indexable + allowlisted component
- `robots.ts` / `sitemap.ts` — extend `IMPLEMENTED_TOOL_SLUGS` when shipping new tools
- Embed: noindex; not in sitemap

---

## 11. Advertisements

See `AD_STANDARDS.md`. Placements wired in shared page only (`lib/ads/placements.ts`):

| Id | Default |
| :--- | :--- |
| `tool_top_banner` | on |
| `tool_article_middle` | on |
| `tool_article_bottom` | off |
| `tool_bottom_banner` | on |
| `tool_sidebar_optional` | off |

Placeholder only. Never on embed pages. Never inside calculator forms/results.

---

## 12. Embed

See `EMBED_STANDARDS.md`.

- Default ON; explicit admin OFF disables
- Public Embed in calculator header when eligible
- `/embed/[slug]` reuses same engine; no ads/header/footer/article
- Dialog: Height + Embed URL + iframe code (portal, focus trap, Escape)

---

## 13. Responsive conventions

Breakpoints used by the master page:

| Width | Behavior |
| :--- | :--- |
| `<1024px` | Single column; calculator first (`order-1`) |
| `≥1024px` | Two-column grid; calculator/guide left (~66%), sidebar widgets right (~34%); unified page scroll |
| `sm` / `lg` | Padding and type scale steps as in Tailwind classes above |

Test matrix: 320, 375, 480, 768, 1024, 1280, 1440 — no horizontal overflow, no clipped controls.

---

## 14. Accessibility & performance

- Semantic landmarks, labeled inputs, visible focus rings
- Dialogs: `role="dialog"`, focus trap, restore focus
- Tables: headers; schedules usable via Full View / CSV
- SSR SEO content; reserve ad min-heights; avoid extra client JS
- Measure CWV in production; do not chase lab-only scores

---

## 15. Testing & Definition of Done

A tool detail page is done only when:

1. Registered allowlisted `componentKey` + Mongo catalog assignment
2. Calculation engine + unit tests green
3. UI follows this shell (grid, cards, `h-11`, aside landmark, header Embed)
4. Dynamic SEO + JSON-LD correct; sitemap slug list updated if new tool
5. Topic-specific educational content + TOC + FAQs as appropriate
6. Ads/embed inherited (no forks)
7. Responsive + keyboard checks
8. `tsc`, lint, build, calc tests pass
9. Brain updated (`CURRENT_STATE`, `CHANGELOG`, `TASKS`)

---

## 16. Source file index

| Concern | Path |
| :--- | :--- |
| Page shell | `frontend/src/app/(website)/tools/[slug]/page.tsx` |
| Sticky | `frontend/src/tools/calculators/auto-loan/StickyCalculatorAside.tsx` |
| Loan UI reference | `frontend/src/tools/calculators/loan/*` |
| Shared currency | `frontend/src/tools/shared/*` |
| SEO | `frontend/src/lib/seo/tool-seo.ts` |
| Ads | `frontend/src/components/ads/AdSlot.tsx`, `lib/ads/*` |
| Embed | `frontend/src/app/embed/*`, `components/tools/CalculatorEmbedDialog.tsx` |
| Crawl | `frontend/src/app/robots.ts`, `sitemap.ts` |
