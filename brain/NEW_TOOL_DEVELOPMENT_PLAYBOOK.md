# New Tool Development Playbook — OmegaCalculators

Practical workflow for every new calculator / tool detail page.  
**Master visual & architectural reference:** Auto Loan Calculator (`/tools/auto-loan-calculator`) — see `TOOL_DETAIL_PAGE_STANDARDS.md`.

Do not redesign the page shell. Do not invent a second sticky/SEO/ads/embed system. Tool-specific math and copy are free to differ.

Module layout is locked in `ARCHITECTURE.md` §7 (ADR-018). Page design is locked in `TOOL_DETAIL_PAGE_STANDARDS.md` (ADR-016). The module lock does not restyle the page.

---

## Mandatory checklist

A new calculator is not done until every gate below is true, in this order. Details are in the steps that follow.

1. **Architecture** — Folder matches `ARCHITECTURE.md` §7.2. Registered in `keys.ts`, `registry/index.ts`, `registry/details.ts`, and `backend/.../tool.key.ts`. No new `page.tsx`. Unregistered keys 404.
2. **Reusable components** — Page shell, `ToolWorkspace`, `StickyCalculatorAside`, `TableOfContents`, `ToolDetailSidebar`, currency, clipboard, and download are reused. Nothing copied into the new folder.
3. **Pure calculation engine** — Formulas live in `calculation.ts` with no React, DOM, or Next imports.
4. **Validation** — Input checks live in `validation.ts` and block invalid results.
5. **Tests** — `calculation.test.ts` fails if the engine breaks. Run it.
6. **SEO** — Metadata comes from `generateMetadata` + `lib/seo/tool-seo.ts`. Slug added to `IMPLEMENTED_TOOL_SLUGS` in `sitemap.ts`. No metadata hardcoded in the calculator.
7. **Embed** — `/embed/{slug}` renders the same component with `presentation="embed"`. No ads. `noindex` comes from the shared embed route.
8. **Responsive QA** — Check 375, 768, 1024, and 1280. Calculator first below `lg`. No horizontal overflow.

Then finish accessibility, type-check, lint, and the Brain update (steps 16–19). Commit each finished milestone under ADR-019. Do not wait until the end for every file.

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

## Step 2 — Inspect the master Auto Loan Calculator reference

Open `/tools/auto-loan-calculator` (local or staging) and skim:

- Shared page: `frontend/src/app/(website)/tools/[slug]/page.tsx`
- Calculator aside: `StickyCalculatorAside.tsx` + sticky right `ToolDetailSidebar`
- Auto Loan as UI pattern: `frontend/src/tools/calculators/auto-loan/`
- Registry: `frontend/src/tools/registry/`

Confirm you will reuse the shell, not fork it. Peer reference (same shell, different fields): `/tools/loan-calculator`.

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

## Step 6 — Implement the calculation engine separately

Use the locked folder in `ARCHITECTURE.md` §7.2 (same shape as Loan, ARM, RREF, and 0-60):

```text
frontend/src/tools/calculators/{tool-id}/
  {Tool}Calculator.tsx
  {Tool}Form.tsx
  {Tool}Results.tsx
  {Tool}GuideArticle.tsx
  detail.tsx
  content.ts
  types.ts
  calculation.ts          # pure functions
  validation.ts           # pure checks
  calculation.test.ts
```

Name the engine `calculation.ts`. Do not add `engine.ts` or `math.ts` as a second home for the formula. Export pure `calculate*` functions with no DOM, React, or Next imports.

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

## Step 9 — Register in both allowlists and both loaders

1. Add `componentKey` to `REGISTERED_COMPONENT_KEYS` and `APPROVED_COMPONENT_KEYS` in `frontend/src/tools/registry/keys.ts`.
2. Add the same string to `backend/src/modules/tools/tool.key.ts` and its direct-run self-check.
3. Add one static `lazy()` `import()` in `registry/index.ts` (calculator chunk only).
4. Set the Mongo `componentKey` to that string.

An active tool whose key is not registered calls `notFound()` on `/tools/[slug]`. It does not fall back to sample content.

---

## Step 10 — Use shared Tool Detail Page layout

1. Add `detail.tsx` exporting `toolPageDetail` and a static `import()` in `tools/registry/details.ts` only. The calculator chunk stays in `registry/index.ts` (step 9). Do not also lazy-load `detail.tsx` from `index.ts`.
2. Do not create a parallel `app/tools/my-tool/page.tsx` unless ADR says otherwise.
3. Intro H1 + description come from catalog / page shell — keep one H1.

---

## Step 11 — Dynamic admin-driven SEO

- Rely on `generateMetadata` + `lib/seo/tool-seo.ts`
- Never hardcode title/description/canonical inside the calculator component
- Ensure production `NEXT_PUBLIC_SITE_URL` (no localhost canonicals)
- Add slug to `IMPLEMENTED_TOOL_SLUGS` in `sitemap.ts` when the tool is live and indexable. `robots.ts` does not list slugs.

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

Closing commit of the calculator sequence (or the only commit when the tool is small):

- `CURRENT_STATE.md`, `TASKS.md`, `CHANGELOG.md`
- `FRONTEND.md` / `CALCULATOR_STANDARDS.md` if registry or patterns changed
- `DECISIONS.md` only for architectural exceptions

ADR-016 (Auto Loan visual shell) and ADR-018 (calculator module) stay in force. This step does not restyle the page or change the folder layout.

---

## Step 19 — Incremental commits and push

ADR-019. Commit a finished milestone when it is coherent and the checks that apply to it pass. Push the finished sequence once, after `git fetch`, only if `origin/development` can take a fast-forward. Never force-push.

| Size | Commits |
| :--- | :--- |
| Small | 1–2. One commit is enough when the engine, UI, registration, and Brain note are one change. |
| Medium | 2–3 |
| Large | 3–5. More than five is allowed when each extra commit is a real milestone. |

Example for a large calculator, using the tool name in place of `calculator`:

1. `feat(calculator): add calculation engine, types and validation`
2. `test(calculator): add calculation unit tests`
3. `feat(calculator): implement form and results UI`
4. `feat(calculator): integrate registry, guide, SEO and embed`
5. `docs(calculator): update Brain and development records`

Rules:

- Each commit contains a real, reviewable change. No empty, duplicate, or padded commits.
- Do not split a change so the tree cannot build. Register the calculator only when its component and `detail.tsx` exist. Keep the engine commit free of React.
- Run the checks that match the milestone: engine tests after the test commit, `type-check` and `lint` after UI and registry commits, responsive and embed checks before the closing docs commit.
- Use Conventional Commit subjects. Stage only this task's files.
- The delivery report lists every commit hash and the checks run at that milestone.

---

## Definition of Done (checklist)

A new calculator is **not** done when the form merely renders. The first eight items are the mandatory gate from the top of this playbook:

- [ ] Architecture matches `ARCHITECTURE.md` §7 (folder, both allowlists, both loaders, no new page route)
- [ ] Reusable shell, aside, TOC, sidebar, currency, clipboard, and download — nothing forked
- [ ] Pure `calculation.ts` (no React / DOM / Next)
- [ ] `validation.ts` blocks invalid input
- [ ] `calculation.test.ts` run and passing
- [ ] Dynamic SEO + `IMPLEMENTED_TOOL_SLUGS` updated
- [ ] Embed renders calculator-only when eligible
- [ ] Responsive check at 375, 768, 1024, 1280
- [ ] UI matches the Auto Loan master shell
- [ ] Results spot-checked against the engine
- [ ] Topic-specific guide, FAQ, and related links
- [ ] Shared ad placements inherited (none inside the calculator)
- [ ] Accessibility basics (labels, focus, FAQ, table headers)
- [ ] `type-check` and `lint` passing
- [ ] Brain docs updated in the closing commit of the ADR-019 sequence (or in the only commit when the tool is small)

---

## Dry-run: Percentage Calculator (do not implement here)

If asked to ship a Percentage Calculator, agents should automatically:

1. Read this playbook + `TOOL_DETAIL_PAGE_STANDARDS.md`
2. Inspect Loan page shell (not loan amortization math)
3. Confirm/create catalog slug e.g. `percentage-calculator`, category Math
4. Implement `calculation.ts` and `validation.ts` (% of, change, reverse) + `calculation.test.ts`
5. Build form/results with shared `h-11` / cards; no currency unless needed
6. Register `PercentageCalculator` in `keys.ts`, `registry/index.ts`, `registry/details.ts`, and the sitemap slug list
7. Write percentage-specific guide/TOC/FAQ (not loan copy)
8. Rely on shared SEO/ads/embed
9. Verify responsive + a11y + gates
10. Commit the milestones from Step 19 (one commit is enough for this small tool), with the Brain update in the last of those commits

No new design brief required — the master standards already define the shell.
