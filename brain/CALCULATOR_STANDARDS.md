# Calculator Standards — Omega Calculators

> Master conventions for every future calculator. The Auto Loan Calculator page is the production reference implementation.

Read with: `AGENTS.md`, `TOOL_DETAIL_PAGE_STANDARDS.md` (authoritative page shell), `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md` (workflow), `DESIGN_SYSTEM.md`, `SEO_STANDARDS.md`, `EMBED_STANDARDS.md`, `AD_STANDARDS.md`, `ARCHITECTURE.md`.

## 1. Module architecture (locked)

Authoritative layout: `ARCHITECTURE.md` §7 (ADR-018). Visual shell stays `TOOL_DETAIL_PAGE_STANDARDS.md` (ADR-016). Workflow and the mandatory checklist: `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`.

- One public route: `/tools/[slug]`. Unregistered `componentKey` or a missing `detail.tsx` calls `notFound()`.
- Client calculator chunk: `tools/registry/index.ts` (`React.lazy` + static `import()`), mounted by `ToolWorkspace`.
- Server page copy: `tools/registry/details.ts` loads `<tool>/detail.tsx` (`toolPageDetail`).
- Allowlist: `tools/registry/keys.ts` and the same strings in `backend/src/modules/tools/tool.key.ts`.
- Pure engine in `calculation.ts`. Pure checks in `validation.ts`. No React, DOM, or Next imports in either file.
- Tests in `calculation.test.ts` next to the engine (run with `tsx`).
- Sitemap slug list: `IMPLEMENTED_TOOL_SLUGS` in `frontend/src/app/sitemap.ts` only.
- API boundary: Browser → Next.js Server → Express → MongoDB. Calculator components never call Express.
- Do not add a per-calculator `page.tsx`, ad slot, iframe route, or metadata builder.

### Required files

```text
frontend/src/tools/calculators/<kebab-id>/
  <Name>Calculator.tsx
  <Name>Form.tsx
  <Name>Results.tsx
  <Name>GuideArticle.tsx
  detail.tsx
  content.ts
  types.ts
  calculation.ts
  validation.ts
  calculation.test.ts
```

Reuse `StickyCalculatorAside` and `TableOfContents` from `calculators/auto-loan/`. Do not copy them. Domain helpers used by more than one tool go in `frontend/src/tools/<domain>/`.

### Known exceptions (existing tools — do not copy)

- `hundred-day` keeps types in `calculation.ts` (no `types.ts`).
- `twelve-volt-wire` tests live in `electrical/conductor.test.ts` (no tool-local `calculation.test.ts`).
- Shared aside, TOC, and `InfoTooltip` still sit in the `auto-loan` folder because the page shell imports them there.

## 2. Page Shell (Auto Loan Calculator reference)

- Breadcrumbs above content
- Full-width intro (H1 + description), then two-column desktop (`~66%` calculator/guide left / `~34%` sidebar right), single column on `<1024px`
- Right rail: `ToolDetailSidebar` (More tools list, other-topic links, dark country-rules pills); desktop sticky under header
- Guide article under the calculator on the left
- Calculator column uses `StickyCalculatorAside` as a plain flow `<aside>` landmark
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

- `calculation.test.ts` beside the engine, covering the happy path and the edge cases that change the result
- Shared currency / SEO helper tests when those helpers change
- Preserve existing calculator suites when changing shared UI or shared math helpers

## 8. Exceptions

Intentional deviations require a Brain note / ADR and Git review.
