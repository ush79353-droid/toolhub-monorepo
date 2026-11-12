# New Tool Development Playbook — OmegaCalculators

Practical workflow for every new calculator / tool detail page.  
**Master visual & architectural reference:** Loan Calculator (`/tools/loan-calculator`) — see `TOOL_DETAIL_PAGE_STANDARDS.md`.

Do not redesign the page shell. Do not invent a second sticky/SEO/ads/embed system. Tool-specific math and copy are free to differ.

---

## Step 1 — Read shared Brain & rules

Mandatory before coding:

1. `AGENTS.md`
2. `brain/README.md`, `CURRENT_STATE.md`, `ARCHITECTURE.md`
3. `brain/TOOL_DETAIL_PAGE_STANDARDS.md` (this master lock)
4. This playbook
5. `brain/CALCULATOR_STANDARDS.md`, `DESIGN_SYSTEM.md`, `SEO_STANDARDS.md`, `EMBED_STANDARDS.md`, `AD_STANDARDS.md`
6. `.cursor/rules/ponytail.mdc` (or `.agents/rules/ponytail.md`) — minimal diffs

Also: `git status` / fetch; do not overwrite unrelated work.

---

## Step 2 — Inspect the master Loan Calculator reference

Open `/tools/loan-calculator` (local or staging) and skim:

- Shared page: `frontend/src/app/(website)/tools/[slug]/page.tsx`
- Sticky: `StickyCalculatorAside.tsx`
- Loan as UI pattern: `frontend/src/tools/calculators/loan/`
- Registry: `frontend/src/tools/registry/`

Confirm you will reuse the shell, not fork it.

---

## Step 3 — Verify MongoDB catalog record

- Tool exists in catalog with correct **slug**, **category**, **status**, SEO fields (optional).
- `componentKey` will match frontend allowlist when you ship UI.
- `embedEnabled`: omit or `true` for default-on; only set `false` to disable.

---

## Step 4 — Identify category & slug

- Public URL = `/tools/{slug}` (and `/embed/{slug}` when eligible).
- Category drives breadcrumbs / related / directory grouping.
- Slug must be stable; update sitemap allowlist when implementing.

---

## Step 5 — Research & validate math

- Document formulas, edge cases (zero rates, rounding, units).
- Prefer standard library / existing shared helpers over new deps.
- Keep domain logic out of React components.

---

## Step 6 — Implement calculation engine separately

Suggested layout (mirror Loan):

```
frontend/src/tools/calculators/{tool-id}/
  {Tool}Calculator.tsx   # UI shell
  {Tool}Form.tsx         # inputs
  {Tool}Results.tsx      # optional
  engine.ts / math.ts    # pure functions
  types.ts
  GuideArticle.tsx       # educational content (optional but expected for SEO tools)
```

Export pure `calculate*` functions with no DOM/Next imports.

---

## Step 7 — Add calculation unit tests

- Smallest assert-based tests that fail if math breaks (Ponytail).
- Cover happy path + key edge cases.
- Run before claiming Done.

---

## Step 8 — Build calculator UI with shared components

Reuse:

- `h-11` controls, `text-[13px] font-medium text-accent` labels
- Currency via shared `CurrencySelect` when money display applies
- Clipboard / download helpers
- Card: `rounded-2xl border border-border bg-white` + Loan elevation shadow on public page
- Put **Embed** in `headerActions` (not above the card)

Do not copy loan-specific fields. Match visual density and alignment.

---

## Step 9 — Register in the component registry

1. Add `componentKey` to allowlist / `keys.ts`
2. Lazy/static map entry in `registry/index.ts`
3. Ensure catalog Mongo `componentKey` matches

Unregistered = catalog card only, no interactive workspace.

---

## Step 10 — Use shared Tool Detail Page layout

1. Add entry to `TWO_COLUMN_TOOL_CONFIGS` in `tools/[slug]/page.tsx` (aside label, TOC items, Guide, FAQs) **or** extend the shared pattern the page already uses.
2. Do not create a parallel `app/tools/my-tool/page.tsx` unless ADR says otherwise.
3. Intro H1 + description come from catalog / page shell — keep one H1.

---

## Step 11 — Dynamic admin-driven SEO

- Rely on `generateMetadata` + `lib/seo/tool-seo.ts`
- Never hardcode title/description/canonical inside the calculator component
- Ensure production `NEXT_PUBLIC_SITE_URL` (no localhost canonicals)
- Add slug to `IMPLEMENTED_TOOL_SLUGS` in `robots.ts` / `sitemap.ts` when the tool is live and indexable

---

## Step 12 — Educational content

- Original, topic-specific article (H2/H3 hierarchy)
- TOC ids match section anchors (`scroll-mt-24`)
- Formula boxes / examples / FAQ as appropriate
- Related tools via existing `RelatedCatalogTools` (implemented links only)

---

## Step 13 — Inherit advertisements

- No per-calculator `AdSlot` forks for the same placements
- Shared page already mounts top / middle / bottom
- No ads inside calculator results or embed

---

## Step 14 — Inherit Embed System

- Eligible when catalog allows embed (`resolveEmbedEnabled`)
- Dialog already available via page `headerActions` for registered tools
- Verify `/embed/{slug}` renders calculator-only (no ads)

---

## Step 15 — Verify mobile & desktop

Check at least: 375, 768, 1024, 1280.

- Calculator first below `lg`; sticky + two-column at `lg`+
- No horizontal overflow; tables scroll or Full View

---

## Step 16 — Accessibility

- Labels / `htmlFor`, keyboard to all controls
- Focus visible; dialogs trap focus
- FAQ buttons expandable; tables have headers

---

## Step 17 — Quality gates

From `frontend/` (and `backend/` if API touched):

- `npm run type-check`
- `npm run lint`
- Calculation tests
- `npm run build` when releasing

---

## Step 18 — Update Project Brain

Same commit as code when possible:

- `CURRENT_STATE.md`, `TASKS.md`, `CHANGELOG.md`
- `FRONTEND.md` / `CALCULATOR_STANDARDS.md` if registry or patterns changed
- `DECISIONS.md` only for architectural exceptions

---

## Step 19 — Commit & push safely

- Commit only relevant files; never secrets
- `git fetch`; no force push
- Follow user/Git branch policy

---

## Definition of Done (checklist)

A new calculator is **not** done when the form merely renders. Require:

- [ ] Accurate calculation logic + validation
- [ ] Professional UI matching Loan shell
- [ ] Correct results (manual spot-check)
- [ ] Responsive desktop/mobile
- [ ] Dynamic SEO + crawl allowlist updated
- [ ] Educational content (topic-specific)
- [ ] Relevant internal / related links
- [ ] Embed when eligible
- [ ] Shared ad placements (inherited)
- [ ] Accessibility basics
- [ ] Tests green + type-check/lint
- [ ] Brain docs updated

---

## Dry-run: Percentage Calculator (do not implement here)

If asked to ship a Percentage Calculator, agents should automatically:

1. Read this playbook + `TOOL_DETAIL_PAGE_STANDARDS.md`
2. Inspect Loan page shell (not loan amortization math)
3. Confirm/create catalog slug e.g. `percentage-calculator`, category Math
4. Implement `engine.ts` (% of, change, reverse) + tests
5. Build form/results with shared `h-11` / cards; no currency unless needed
6. Register `PercentageCalculator` key + `TWO_COLUMN_TOOL_CONFIGS` + sitemap slug
7. Write percentage-specific guide/TOC/FAQ (not loan copy)
8. Rely on shared SEO/ads/embed
9. Verify responsive + a11y + gates
10. Update Brain; commit

No new design brief required — the master standards already define the shell.
