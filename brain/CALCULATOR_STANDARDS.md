# Calculator Standards — Omega Calculators

> Master conventions for every future calculator. The Loan Calculator page is the production reference implementation.

Read with: `AGENTS.md`, `DESIGN_SYSTEM.md`, `SEO_STANDARDS.md`, `EMBED_STANDARDS.md`, `AD_STANDARDS.md`, `TOOL_DETAIL_PAGE_STANDARDS.md`, `ARCHITECTURE.md`.

## 1. Architecture

- Client-side math in `frontend/src/tools/calculators/<tool>/`
- Register allowlisted `componentKey` in `tools/registry/keys.ts` + `tools/registry/index.ts`
- Public route: dynamic `/tools/[slug]` resolves MongoDB tool → `ToolWorkspace` → registered component
- Full page shell/SEO/ads/embed/DoD: `TOOL_DETAIL_PAGE_STANDARDS.md`
- API boundary: Browser → Next.js Server → Express → MongoDB
- Never call Express from browser calculator components

## 2. Page Shell (Loan Calculator reference)

- Breadcrumbs above content
- Two-column desktop (`~62%` editorial / `~38%` calculator), single column on `<1024px`
- One unified left intro card: title + intro + TOC + related links
- Guide article as its own card below
- Sticky calculator uses `StickyCalculatorAside` (viewport-capped, internal scroll, hidden scrollbar)
- Soft elevation shadow on calculator panel; public canvas `bg-white`

## 3. Typography

- H1: ~30–36px, `font-bold`
- H2: 21–24px (article) / `text-lg`–`xl` (in-card sections), `font-semibold`
- H3: ~17px, medium/semibold
- Body: 15–16px, weight 400
- Labels: 13px medium; helper 12px normal
- No badge clutter; no decorative section icons in calculator headers

## 4. Forms & Currency

- Shared currency catalog: `tools/shared/currency.ts` + `CurrencySelect`
- Denomination/formatting only — never live FX conversion
- Input height `h-11`; consistent unit affixes via `getCurrencySymbol`
- Copy/download helpers: `tools/shared/clipboard.ts`, `tools/shared/download.ts`

## 5. Results

- Primary payment hero card
- Balanced metric grid
- Optional chart / breakdown drawers
- One CSV control (no duplicate download buttons)
- Themed table overflow via `.brand-scroll`

## 6. SEO

- Use shared dynamic SEO pipeline only (`SEO_STANDARDS.md`)
- Do not hardcode metadata inside calculator files
- Visible H1 ≠ SEO title unless content model requires it

## 6b. Embedding

- Use shared `/embed/[slug]` pipeline only (`EMBED_STANDARDS.md`)
- Same registered calculator component; `presentation="embed"` for compact chrome
- Embedding is **enabled by default**; only explicit admin OFF disables it
- Public Embed button + working `/embed/[slug]` also require active + allowlisted `componentKey`
- Do not build calculator-specific iframe routes

## 6c. Advertisements

- Dummy placeholders via shared `AdSlot` on `/tools/[slug]` only (`AD_STANDARDS.md`)
- Never render ads inside calculators or on `/embed/[slug]`
- No live AdSense/scripts until a dedicated consented integration

## 7. Testing

- Independent calculation unit tests for each calculator
- Shared currency / SEO helper tests when touched
- Preserve existing Loan + Auto Loan suites when changing shared UI

## 8. Exceptions

Intentional deviations require a Brain note / ADR and Git review.
