# Calculator Standards — Omega Calculators

> Master conventions for every future calculator. The Auto Loan Calculator page is the production visual reference implementation (ADR-016), NOT the functional reference (ADR-023).

Read with: `AGENTS.md`, `TOOL_DETAIL_PAGE_STANDARDS.md` (authoritative page shell), `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md` (workflow), `DESIGN_SYSTEM.md`, `SEO_STANDARDS.md`, `EMBED_STANDARDS.md`, `AD_STANDARDS.md`, `ARCHITECTURE.md`.

## 1. Module architecture (locked)

Authoritative layout: `ARCHITECTURE.md` §7 (ADR-018). Visual shell stays `TOOL_DETAIL_PAGE_STANDARDS.md` (ADR-016). Functional scope and simplicity stay `CALCULATOR_STANDARDS.md` §1b (ADR-023). Workflow and the mandatory checklist: `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md`.

- One public route: `/tools/[slug]`. Unregistered `componentKey` or a missing `detail.tsx` calls `notFound()`.
- Client calculator chunk: `tools/registry/index.ts` (`React.lazy` + static `import()`), mounted by `ToolWorkspace`.
- Server page copy: `tools/registry/details.ts` loads `<tool>/detail.tsx` (`toolPageDetail`).
- Allowlist: `tools/registry/keys.ts` and the same strings in `backend/src/modules/tools/tool.key.ts`.
- Pure engine in `calculation.ts`. Pure checks in `validation.ts`. No React, DOM, or Next imports in either file.
- Tests in `calculation.test.ts` next to the engine (run with `tsx`).
- Sitemap slug list: `IMPLEMENTED_TOOL_SLUGS` in `frontend/src/app/sitemap.ts` only.
- API boundary: Browser → Next.js Server → Express → MongoDB. Calculator components never call Express.
- Do not add a per-calculator `page.tsx`, ad slot, iframe route, or metadata builder.
- Activation is part of delivery (ADR-022 + ADR-023 verified activation). After registration, tests, and a successful `/tools/{slug}` check: set `isDeveloped` (when on schema), `isActive`, and `indexable` when eligible. Confirm embed and sitemap eligibility. Do not activate a row that has no module, and do not turn an admin-disabled / noindex tool back on — report blockers instead.

## 1b. Screenshot-First Functional Parity & Simplicity (ADR-023)

- **Screenshot determines WHAT the calculator does:** When building or refactoring a calculator based on a reference screenshot, that screenshot is the single authoritative source for functional scope.
- **Auto Loan determines HOW it looks:** Auto Loan is the **visual design master**, NOT the **functional master**. Reuse its colors, typography, input dimensions (`h-11`), form tokens, responsive layout, and page shell. Do NOT copy its field count, advanced sections, charts, payment breakdowns, or result cards into unrelated calculators.
- **Do not invent unrequested functionality:** Avoid adding extra input fields, unrequested calculation modes, bloated advanced drawers, unnecessary charts, or large statistical dashboards.
- **Pre-implementation parity checklist:** Before writing code, identify:
  1. Primary input fields
  2. Optional inputs
  3. Dropdown options
  4. Checkboxes
  5. Calculation modes
  6. Main outputs
  7. Result structure
  8. Conditional field visibility
- **Conditional settings:** Complex or secondary assumptions (e.g., compounding, upfront fees, advanced scenarios) must remain hidden behind checkboxes or collapsible disclosures until explicitly enabled by the user.

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
- `twelve-volt-wire` keeps shared resistivity and AWG helpers in `electrical/conductor.ts`. Tool assertions are in `calculation.test.ts`.
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

## 4. Forms & Currency (ADR-017 / ADR-021 / ADR-023)

- Input height `h-11`. Unit affixes use `getCurrencySymbol` where applicable.
- **Currency selector rule:** Include a currency selector ONLY when:
  1. The reference screenshot explicitly provides currency selection; OR
  2. The user explicitly requests currency selection; OR
  3. Currency conversion is genuinely essential to the calculator's requested functionality.
- Do NOT automatically inject currency selectors into every financial calculator. If a calculator uses one fixed currency, format numbers consistently without requiring a dropdown.
- **Denomination:** every money input is already in the selected currency. The selector changes the symbol and grouping only. Say that on the page. Do not multiply by an exchange rate.
- **Conversion:** the calculator turns an amount from one currency into another. Use the ADR-017 `CurrencyRate` map through the shared server read (ADR-021). `converted = amount * rate[target] / rate[source]`, with the base rate equal to 1. Round the money result once. Do not call ExchangeRate-API from the calculator, and do not add a cron.
- A missing or non-finite rate is an unavailable conversion, not 1:1. Show `fetchedAt`. Older than 48 hours is stale and still usable.
- The pure `calculation.ts` receives numbers. It does not import Mongo, HTTP, or React.
- Copy/download helpers: `tools/shared/clipboard.ts`, `tools/shared/download.ts`

## 5. Results Simplicity (ADR-023)

- **Results match calculator purpose:** If the reference calculator displays five essential results, do not generate fifteen results without justification.
- **Prioritize:**
  1. Primary calculated answer (hero card)
  2. Essential supporting values (compact metric grid)
  3. Short calculation explanation, where useful
- **Avoid default clutter:** Do not automatically add large financial dashboards, multiple charts, scenario tables, year-by-year projections, or redundant summaries to the main view.
- **Optional disclosures:** Detailed schedules, breakdowns, or tables remain available behind optional disclosure controls (collapsed by default).
- **Internal math vs external UI:** Internal calculation logic may be complex; the user-facing interface must remain clean and simple.

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

## 9. Three-commit delivery (ADR-019)

Does not change ADR-016 or ADR-018.

- Exactly three meaningful commits per successfully developed calculator: (1) UI/components/fields/layout, (2) formulas/validation/results and Phase 2 FX where applicable, (3) registration/sitemap/Mongo/SEO/Brain/cleanup last.
- Empty, duplicate, padded, or artificial commits are not allowed. If development is skipped or blocked, create no unnecessary commits.
- Do not register a key or activate Mongo before the UI and engine commits exist.
- Brain docs (`CURRENT_STATE.md`, `TASKS.md`, `CHANGELOG.md`) land in commit 3. Push all three commits together to `origin/development`.
- The delivery report names all three commit hashes separately and the checks run.

The sequence and the safety rules are in `NEW_TOOL_DEVELOPMENT_PLAYBOOK.md` Step 19 and `AGENTS.md`.
