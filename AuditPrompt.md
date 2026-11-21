# OMEGA CALCULATORS — COMPREHENSIVE 50-CALCULATOR DEEP AUDIT

## ROLE

You are acting as a **Senior Full-Stack Software Auditor, Financial Calculation Auditor, Tax Logic Reviewer, MongoDB Integrity Auditor, and Next.js/Node.js Architecture Reviewer** for the existing Omega Calculators project.

Your assignment is to conduct an extensive, evidence-based, READ-ONLY audit of the **50 explicitly listed calculators**.

The goal is to determine which calculators are genuinely developed, correctly implemented, accurately calculated, properly registered, and functionally complete — and which contain bugs, missing functionality, incorrect formulas, incomplete integrations, or unresolved dependencies.

**THIS IS AN AUDIT, NOT A DEVELOPMENT OR REPAIR TASK.**

Do not fix anything. Do not make commits. Do not modify MongoDB records. Do not change tracker statuses.

---

# PHASE 1 — EXACT AUDIT SCOPE

Audit the following **50 calculators**, preserving their exact names and order.

| # | Calculator Name |
|---|---|
| 1 | Accounting Profit Calculator |
| 2 | Economic Profit Calculator |
| 3 | Net Profit Margin Calculator |
| 4 | Wage Calculator |
| 5 | Hourly Wage Calculator |
| 6 | Wage to Salary Calculator |
| 7 | Yearly Wage Calculator |
| 8 | Budget Calculator |
| 9 | Wedding Budget Calculator |
| 10 | Stimulus Check Calculator |
| 11 | Adjusted Gross Income (AGI) Calculator |
| 12 | Alabama Tax Calculator |
| 13 | AMT Calculator |
| 14 | Annual Income Calculator |
| 15 | Annual Pay Calculator |
| 16 | Biden's Tax Plan Calculator |
| 17 | Bill Rate Calculator |
| 18 | Billable Hours Calculator |
| 19 | Biweekly Pay Calculator |
| 20 | Build Back Better Calculator |
| 21 | California Tax Calculator |
| 22 | Child Tax Credit Calculator |
| 23 | Estate Tax Calculator |
| 24 | FICA Tax Calculator |
| 25 | Gratuity Calculator |
| 26 | Gross to Net Calculator |
| 27 | GST Calculator |
| 28 | GST/QST Calculator for Canada |
| 29 | Hours Pay Calculator |
| 30 | Illinois Tax Calculator |
| 31 | Lottery Tax Calculator |
| 32 | Marriage Tax Calculator |
| 33 | Mileage Reimbursement Calculator |
| 34 | Modified Adjusted Gross Income (MAGI) Calculator |
| 35 | Money per Hour Calculator |
| 36 | Monthly Income Calculator |
| 37 | Monthly Income Hourly Calculator |
| 38 | Net to Gross Calculator |
| 39 | New York Tax Calculator |
| 40 | Pay Raise Calculator |
| 41 | Quiz: Annual Income Calculator |
| 42 | Rate of Pay Calculator |
| 43 | RMD Calculator - Required Minimum Distributions Calculator |
| 44 | Selling Leave Days Calculator |
| 45 | Semi-Monthly Pay Calculator |
| 46 | State Tax Calculator |
| 47 | Take-Home-Paycheck Calculator |
| 48 | Tax Bracket Calculator |
| 49 | Texas Tax Calculator |
| 50 | Time and a Half Calculator |

### Strict scope rules

1. Audit all 50 calculators individually.
2. Do not skip calculators because their names are similar.
3. Do not combine multiple calculators into one audit result.
4. Do not assume that a calculator exists merely because its name appears here.
5. Do not assume that a development prompt means the calculator was implemented.
6. Do not automatically develop missing calculators.
7. Do not modify unrelated calculators.
8. Preserve the original calculator names in the final audit report.
9. If an exact calculator cannot be found, report its missing or unverified status.
10. If an audit item cannot be checked, label it UNVERIFIED rather than PASS.

---

# PHASE 2 — ABSOLUTE READ-ONLY RESTRICTIONS

This assignment must not interfere with any other Cursor agent.

### Forbidden operations

DO NOT:

- Create, modify, or delete calculator source files.
- Create, modify, or delete MongoDB records.
- Update `isDeveloped`, `isActive`, or `indexable`.
- Modify calculator registries.
- Modify the sitemap.
- Edit calculator guides or metadata.
- Install or upgrade dependencies.
- Run database migrations.
- Generate application files.
- Move task folders.
- Claim or release calculator jobs.
- Modify development tracker statuses.
- Modify or delete screenshots and prompts.
- Perform Git commits.
- PUSH, PULL, FETCH, or SYNC.
- Run `git reset`, `git clean`, or destructive cleanup.
- Run Playwright or browser automation.
- Run automated tests, lint, typecheck, or builds without explicit authorization.
- Start or stop development servers unnecessarily.
- Trigger production API writes.
- Use hidden background repair scripts.

Permitted audit operations include:

- Reading project files.
- Reading calculator source code.
- Reading existing specifications and screenshots.
- Read-only MongoDB queries.
- Inspecting Git history.
- Inspecting Git status.
- Inspecting existing audit reports.
- Reviewing calculation logic statically.
- Comparing implemented formulas with independent reference calculations.
- Reviewing existing configuration and integrations.

If an operation has potential write-side effects, do not perform it.

If files or records are unavailable, document the limitation.

### No audit-generated repository changes

Do not create audit markdown files inside the repository.

Return the complete audit report in your final response, unless an explicitly authorized external read-only reporting destination already exists.

---

# PHASE 3 — PROJECT ARCHITECTURE AUDIT

First, inspect the actual repository architecture.

Expected architectural model:

### Frontend

- Next.js App Router.
- React.
- TypeScript.
- Independent frontend application.

### Backend

- Node.js.
- Express.
- TypeScript.
- MongoDB / Mongoose.
- Independent backend application.

Verify the actual implementation rather than assuming exact versions or packages.

### Important architectural rule

The frontend and backend must remain independently managed applications with separate package configuration and dependencies.

Do not modify the architecture during this audit.

### Review project ADRs

Read:

- ADR-016
- ADR-018
- ADR-023

Inspect their real contents and identify applicable design and integration requirements.

Do not guess what these ADRs contain.

### Known registry and integration paths

Inspect:

`frontend/src/tools/registry/keys.ts`

`frontend/src/tools/registry/index.ts`

`frontend/src/tools/registry/details.ts`

`backend/src/modules/tools/tool.key.ts`

`frontend/src/app/sitemap.ts`

Also discover actual locations for:

- Calculator React components.
- Calculation utilities.
- Shared input components.
- Currency conversion infrastructure.
- Tools-page currency provider.
- Embed currency provider.
- Calculator guide content.
- SEO metadata.
- Canonical URL generation.
- Tool routes.
- Component loading.
- Advertisement integrations.
- Shared calculator actions.
- Feedback handling.
- Calculator-related backend APIs.

Do not assume nonexistent files.

---

# PHASE 4 — MONGODB CATALOG AUDIT

For each of the 50 calculators, query the existing MongoDB catalog using the actual project connection and read-only access.

Search by:

- Exact title.
- Slug.
- Approved aliases.
- Existing componentKey.
- Relevant existing identifiers.

Do not create missing records.

For every calculator, verify:

1. MongoDB record exists.
2. Exact record identity.
3. MongoDB `_id`.
4. Title.
5. Slug.
6. Aliases where present.
7. componentKey.
8. Pillar/category assignment.
9. `isDeveloped`.
10. `isActive`.
11. `indexable`.
12. Ownership or administrative restrictions where applicable.
13. Duplicated records.
14. Incorrect slug mappings.
15. Missing componentKey mappings.
16. Record-to-component inconsistencies.
17. Record-to-route inconsistencies.

### Important development-status checks

Identify cases where:

- `isDeveloped=true` but component is missing.
- `isActive=true` but calculator is broken or incomplete.
- `isDeveloped=false` but implementation appears complete.
- Backend key exists but frontend registry is missing.
- Frontend registry exists but MongoDB record is missing.
- Multiple records refer to one unintended component.
- Two distinct calculators share the same incorrect slug.
- The calculator belongs to the wrong pillar.
- Tool exists in code but cannot be reached through its authorized route.

### Indexability

Do not automatically flag `indexable=false` as a defect.

It may be an intentional administrative choice.

Report the value and identify a problem only when independent authoritative evidence establishes a contradiction.

### MongoDB read failure

If database access is unavailable:

- Report `MONGODB_UNVERIFIED`.
- Continue with the remaining read-only source audit.
- Do not claim the catalog is correct.
- Do not infer live database status from source-code defaults.

---

# PHASE 5 — SCREENSHOT AND SPECIFICATION COMPARISON

Each calculator may have an original screenshot, prompt, or saved functional specification.

Locate existing authorized task material in applicable locations:

`D:\Project\ToolHub\Tools`

`D:\Project\ToolHub\In Progress`

`D:\Project\ToolHub\Completed Tools`

Do not move or claim any task folder.

### For every calculator

Compare its implementation against available authorized specifications.

Check:

1. All required input fields exist.
2. All required result fields exist.
3. Input labels match intended functionality.
4. Fields appear in the correct logical order.
5. Default values are correct.
6. Default radio options are correct.
7. Dropdown options are appropriate.
8. Collapsible sections behave according to their specification.
9. Units are correct.
10. Currency selectors appear only where required.
11. Editable inputs remain editable.
12. Calculated outputs behave as results.
13. Conditional fields appear appropriately.
14. Bidirectional calculations are implemented where specified.
15. Shared calculator actions are present.
16. Responsive and accessible implementation follows project conventions.

**The screenshot is a functionality reference, not a styling reference.**

Do not flag a calculator merely because its visual design differs from the reference screenshot.

The Omega design system is authoritative for styling.

### Missing specifications

If only some screenshots are available:

- Audit the visible functionality.
- Inspect approved task prompts and existing project specifications for hidden fields.
- Do not invent missing requirements.
- Label unavailable specification areas `SPEC_UNVERIFIED`.

Do not mark the entire calculator PASS when important required functionality cannot be verified.

---

# PHASE 6 — MATHEMATICAL AND FORMULA AUDIT

Perform a detailed static calculation review of all 50 calculators.

Do not simply confirm that a calculation function exists.

Determine whether the formula actually produces correct results.

### Audit checklist

Verify:

- Correct mathematical formulas.
- Correct operation order.
- Correct numerical normalization.
- Correct units.
- Correct percentage interpretation.
- Correct pay-period conversions.
- Correct handling of annual/monthly/weekly/daily/hourly rates.
- Correct use of source versus calculated fields.
- Correct reverse calculations.
- Correct rounding.
- Appropriate internal precision.
- Divide-by-zero handling.
- Invalid-number handling.
- Proper negative-value handling.
- Empty-input handling.
- Valid zero handling.
- Large input handling.
- Missing-data handling.
- No circular calculations.
- No duplicate deductions or tax calculations.
- No placeholder or mock result values.

### Independent verification

For each distinct calculation mode, independently derive the expected result.

Compare it against the implemented expression using static review and permitted reasoning.

Where useful, provide reproducible numerical examples in the audit report.

Do not claim a runtime test passed merely because the formula looks correct.

Classify evidence as:

- `STATIC_FORMULA_VERIFIED`
- `STATIC_FORMULA_MISMATCH`
- `RUNTIME_NOT_TESTED`
- `FORMULA_UNVERIFIED`

---

# PHASE 7 — SALARY, WAGE, AND PAY CALCULATORS

Perform specialized checks for the relevant calculators in this batch, including:

- Wage Calculator
- Hourly Wage Calculator
- Wage to Salary Calculator
- Yearly Wage Calculator
- Annual Income Calculator
- Annual Pay Calculator
- Bill Rate Calculator
- Billable Hours Calculator
- Biweekly Pay Calculator
- Hours Pay Calculator
- Money per Hour Calculator
- Monthly Income Calculator
- Monthly Income Hourly Calculator
- Pay Raise Calculator
- Rate of Pay Calculator
- Selling Leave Days Calculator
- Semi-Monthly Pay Calculator
- Time and a Half Calculator

### Standard conversions

Where the approved calculator specification uses conventional full-year assumptions:

- 52 weeks/year.
- 12 months/year.
- 26 biweekly periods/year.
- 24 semi-monthly periods/year.

Do not assume 4 weeks equals 1 month.

### Check working schedules

Verify proper treatment of:

- Hours per day.
- Hours per week.
- Days per week.
- Paid versus unpaid time.
- Working weeks per year.
- Overtime multipliers.
- Leave encashment assumptions.

### Special checks

**Semi-Monthly Pay Calculator**

Verify:

`Semi-monthly pay = Annual pay / 24`

Do not confuse it with biweekly pay:

`Biweekly pay = Annual pay / 26`

Verify all five wage fields are correctly linked through the specified authoritative/last-edited input behavior.

**Pay Raise Calculator**

Ensure percentages and monetary raises are equivalent representations of one raise, not separate increases applied twice.

**Monthly Income Calculator**

Check that the implementation matches the corrected screenshot specification rather than an earlier superseded generic prompt.

**Selling Leave Days Calculator**

Verify the leave payout divisor, hours/day assumptions, salary period interpretation, and whether the result is clearly labeled an estimate rather than a universal legal entitlement.

**Rate of Pay Calculator**

Investigate task identity carefully.

Earlier screenshot material associated with this name showed RMD/IRA-related inputs rather than rate-of-pay functionality.

Verify that the Rate of Pay calculator has not accidentally received the RMD implementation, wrong screenshot, incorrect prompt, or wrong componentKey.

**RMD Calculator**

Verify it is a separate authorized calculator with its own correct retirement-distribution implementation.

Do not merge it with Rate of Pay.

---

# PHASE 8 — FINANCE AND BUSINESS CALCULATORS

Perform appropriate independent formula reviews for:

- Accounting Profit Calculator
- Economic Profit Calculator
- Net Profit Margin Calculator
- Budget Calculator
- Wedding Budget Calculator
- Lottery Tax Calculator
- Net to Gross Calculator
- Gross to Net Calculator
- GST Calculator
- GST/QST Calculator for Canada
- Gratuity Calculator

### Accounting Profit

Verify the implemented treatment of revenue and explicit accounting costs.

Confirm against the approved calculator's exact cost fields.

Do not silently treat opportunity costs as explicit accounting costs.

### Economic Profit

Verify opportunity costs are distinguished from accounting expenses.

Check that the final formula matches the authorized specification.

### Net Profit Margin

Verify:

`Net Profit Margin (%) = Net Profit / Revenue × 100`

Where this is the specified model.

Check zero revenue handling.

### Budget and Wedding Budget

Verify that category totals, expenses, balances, and derived percentages are calculated without double-counting.

### GST

Check tax-inclusive versus tax-exclusive calculations.

Verify:

`Gross = Net × (1 + Rate)`

`Net = Gross / (1 + Rate)`

When this is the approved model.

### GST/QST Canada

Verify applicable official tax rules for the selected province, territory, and effective period.

Do not double-count HST as GST plus an additional HST.

Check QST and provincial sales-tax methodology against applicable official sources.

### Net to Gross / Gross to Net

Verify that percentage definitions are not confused.

Check percentage-of-net versus percentage-of-gross calculations, reverse formulas, and singular cases.

### Lottery Tax

Check the distinction between tax liability and withholding, lump-sum versus annuity calculations, and supported jurisdiction/year assumptions.

Do not manufacture missing annuity schedule settings.

### Gratuity

Verify the legal jurisdiction and approved formula.

Do not describe a country-specific statutory formula as a universal rule.

---

# PHASE 9 — TAX CALCULATOR DEEP AUDIT

Apply additional review to:

- Stimulus Check Calculator
- Adjusted Gross Income (AGI) Calculator
- Alabama Tax Calculator
- AMT Calculator
- Biden's Tax Plan Calculator
- Build Back Better Calculator
- California Tax Calculator
- Child Tax Credit Calculator
- Estate Tax Calculator
- FICA Tax Calculator
- Illinois Tax Calculator
- Marriage Tax Calculator
- Mileage Reimbursement Calculator
- MAGI Calculator
- New York Tax Calculator
- State Tax Calculator
- Take-Home-Paycheck Calculator
- Tax Bracket Calculator
- Texas Tax Calculator

And any other calculator in the list whose functionality includes statutory taxes or benefits.

### Official-data verification

Identify the actual:

- Tax jurisdiction.
- Tax year.
- Effective date.
- Official rate source.
- Tax brackets.
- Filing-status rules.
- Deduction rules.
- Credit eligibility rules.
- Taxable base.
- Withholding methodology.
- Calculation limitations.

Where authoritative online references are available and read-only research is permitted, compare the implementation with official sources.

Otherwise label tax-rule correctness `OFFICIAL_SOURCE_UNVERIFIED`.

Do not claim official validation from an undocumented constant in code.

### Federal tax calculations

Check progressive tax calculations and filing-status-specific thresholds.

Verify that standard and itemized deductions are not both applied incorrectly.

Check that AGI is not automatically assumed to be payroll gross wages.

### FICA

Verify appropriate distinction among:

- Social Security wages.
- Medicare wages.
- Adjusted Gross Income.
- Taxable federal income.
- Gross salary.

Do not accept an AGI-only FICA formula without a supported, explicit estimation model.

### MAGI

Verify the calculator's defined MAGI purpose and applicable add-backs.

MAGI does not have a single universal adjustment formula for all tax and benefit purposes.

### RMD

For the RMD calculator, verify:

- Tax-year assumptions.
- Applicable life expectancy tables.
- Age-related distribution rules.
- Prior December 31 account value.
- Spousal beneficiary conditions.
- Relevant table selection.
- Required minimum distribution calculation.
- Correct handling of unsupported accounts or special situations.

Do not assume the screenshot's displayed life expectancy factor is universally correct for every tax year, age, or beneficiary situation.

### State-specific taxes

Check that each state calculator uses the correct state's rules.

**Texas Tax Calculator**

Verify:

- No Texas state individual income tax.
- Federal tax calculation methodology.
- Correct handling of property taxes.
- Anderson County default as specified.
- No unsupported hardcoded county effective-rate figures.
- Correct separation of property tax and paycheck deductions.

**Illinois Tax Calculator**

Verify its county/property-tax data belongs to Illinois, not another state.

**New York Tax Calculator**

Verify federal, state, and applicable NYC residency calculations based on the approved fields.

**California Tax Calculator**

Verify California-specific income-tax rules and do not confuse it with California Sales Tax Calculator.

**Alabama Tax Calculator**

Verify Alabama-specific schedules and applicable deductions.

**State Tax Calculator**

Determine the approved scope of this generic tool; do not assume a single state's rules apply nationally.

### Historical and proposed legislation

Special attention:

- Stimulus Check Calculator
- Biden's Tax Plan Calculator
- Build Back Better Calculator

Distinguish historical laws, expired programs, proposed legislation, and currently effective rules.

Do not present a proposal as enacted law.

Do not imply expired benefits are currently available.

Verify the intended historical year and supported scenario.

### Mileage Reimbursement

Verify official mileage rates for the selected year and category.

Differentiate a reimbursement estimate from an actual allowable tax deduction.

### Property Tax

Do not assume a county uniquely determines the property's actual combined tax rate.

Check rate source, valuation basis, district limitations, exemptions, and effective year.

---

# PHASE 10 — QUIZ CALCULATOR AUDIT

Specially audit:

**Quiz: Annual Income Calculator**

This is an interactive quiz, not a standard monetary calculator.

Verify:

1. The exact existing MongoDB record.
2. The authorized seven-question specification.
3. Correct first question.
4. All seven approved questions.
5. Their answer choices.
6. Correct answer mappings.
7. Automatic question progression.
8. Correct radio selection behavior.
9. Ability to change answers as specified.
10. Score calculation.
11. Maximum score of 7.
12. Proper incomplete-quiz message.
13. Completion state.
14. Reset behavior.
15. Share-result behavior.
16. Accessible interaction.

The visible first question in the known screenshot is:

**What does annual income mean?**

Correct answer:

**The amount of money earned in one year.**

The remaining questions must come from authorized source material.

Do not invent them during the audit.

If the implementation uses unsupported fabricated quiz content, flag it.

If the remaining approved questions cannot be located, mark the content comparison UNVERIFIED.

---

# PHASE 11 — NUMERICAL CURRENCY CONVERSION AUDIT

Many calculators in the list use independently selectable currencies.

Audit the actual screenshot/specification and implementation for each calculator.

### When independent currency selectors exist

Verify that the calculator uses real numerical FX conversion.

Changing PKR to USD must not merely replace the currency symbol.

Check:

1. Correct shared FX provider.
2. Correct exchange-rate retrieval.
3. Correct base-currency normalization.
4. Correct independent field currencies.
5. Correct result conversion.
6. Consistency after changing input currencies.
7. Preservation of authoritative economic values.
8. Appropriate exchange-rate freshness handling.
9. Missing-rate/error behavior.
10. No silent 1:1 fallback.
11. No conversion of nonmonetary dimensions.
12. Appropriate conversion precision.
13. Proper page integration.
14. Proper embed integration.

Locate the two live `CURRENCY_CONVERSION_SLUGS` lists.

Verify that each calculator requiring numerical FX appears in both applicable lists.

### When fixed currencies are specified

Verify that additional currency selectors were not incorrectly introduced.

For example, a fixed-USD US tax calculator should not receive unwanted PKR selectors simply because other calculators have FX.

Do not treat exchange-rate data as interchangeable with historical tax reporting exchange rates.

### Currency audit classifications

Use:

- FX_REQUIRED_AND_CORRECT
- FX_REQUIRED_BUT_MISSING
- FX_INCORRECT
- FX_NOT_REQUIRED
- FX_UNVERIFIED

---

# PHASE 12 — REACT STATE AND INTERACTIVE FUNCTIONALITY AUDIT

Review each calculator's actual component logic.

### Check

- Controlled input behavior.
- Default initialization.
- Derived value updates.
- State dependencies.
- Authoritative/last-edited fields.
- Reverse calculations.
- Input validation.
- Currency changes.
- Unit changes.
- Dropdown changes.
- Conditional fields.
- Accordion behavior.
- Reset.
- Clear.
- Reload.
- Share.
- Feedback.
- React dependency handling.
- Memoization where appropriate.
- Avoidance of infinite update loops.
- Avoidance of stale values.
- Correct handling of asynchronous FX state.

### Particular bug patterns

Identify:

- Formulas using stale state.
- Circular useEffect dependencies.
- Repeated rounding during reverse conversion.
- Currency conversion performed twice.
- Inputs losing focus unexpectedly.
- User-entered values overwritten by derived fields.
- Reset actions leaving stale values.
- Dropdown selections not influencing results.
- Nonfunctional controls.
- Result fields showing zero before inputs are provided.
- Errors when user clears an input.
- Results containing NaN or Infinity.

Distinguish statically demonstrable defects from runtime risks.

Do not label an interaction PASS based solely on component presence when behavior cannot be established.

---

# PHASE 13 — FRONTEND REGISTRY AUDIT

For each calculator, verify:

1. Correct component exists.
2. Correct component export.
3. Correct componentKey.
4. Correct frontend registry key.
5. Correct registry mapping.
6. Correct lazy-loading configuration.
7. Correct calculator metadata.
8. Correct route integration.
9. Correct slug mapping.
10. No accidental duplicate component registration.
11. No references to deleted components.
12. Correct category/pillar association.

Check actual registry architecture before evaluating.

### Cross-calculator collision detection

Specifically inspect similar calculator names.

Examples:

- Wage vs Hourly Wage.
- Annual Income vs Annual Pay.
- Monthly Income vs Monthly Income Hourly.
- Gross to Net vs Net to Gross.
- Biweekly Pay vs Semi-Monthly Pay.
- Rate of Pay vs RMD.
- State Tax vs Texas Tax.
- Take-Home-Paycheck vs Texas Tax.
- Accounting Profit vs Economic Profit.
- Annual Income vs Quiz: Annual Income.

These are not automatically duplicates.

Each authorized record must preserve its unique identity and functionality.

---

# PHASE 14 — BACKEND INTEGRATION AUDIT

For each calculator:

- Verify the correct backend tool key.
- Verify consistency with MongoDB.
- Verify any actual required API integration.
- Check relevant backend service references.
- Confirm expected response shapes.
- Check authorization and validation patterns where applicable.
- Identify missing backend registrations.
- Identify broken componentKey mappings.
- Identify references to non-existent tool identities.

Do not require a calculator-specific backend endpoint unless the existing architecture and approved calculator functionality actually require one.

A purely client-side mathematical calculation may not need its own backend calculation endpoint.

Do not create endpoints during this audit.

---

# PHASE 15 — SEO, SITEMAP, GUIDE AND EMBED AUDIT

For each calculator, inspect applicable integration requirements.

### SEO

Verify:

- Existing title metadata.
- Meta description.
- Canonical URL.
- Slug consistency.
- Correct category.
- No accidental duplicate canonical.
- Appropriate indexability behavior.

### Sitemap

Inspect the actual:

`frontend/src/app/sitemap.ts`

Verify calculator inclusion or exclusion according to the actual authorized indexing policy.

Do not assume a separate registry sitemap file exists.

### Guide content

Verify that calculator descriptions and guides:

- Correspond to the correct calculator.
- Explain the relevant formula.
- State important assumptions.
- Avoid false financial or tax claims.
- Do not duplicate unrelated calculator guides.

### Embed

Verify:

- Correct calculator identity.
- Expected embed loading.
- Shared actions where supported.
- Currency provider integration where applicable.
- Correct metadata/routing.

### Ads and shared components

Check that applicable existing integration requirements are respected.

Do not invent a defect merely because a feature is intentionally disabled for a specific tool type.

---

# PHASE 16 — GIT AND DEVELOPMENT HISTORY AUDIT

Use read-only Git inspection only.

Inspect:

- `git status`
- `git log`
- `git show`
- Relevant file history.
- Calculator-specific commits.

Do not modify the worktree.

### Check development evidence

For each calculator, determine:

1. Are relevant implementation commits present?
2. Is there evidence of the expected three-phase development workflow?
3. Are UI changes identifiable?
4. Are formula/logic changes identifiable?
5. Are registry/integration changes identifiable?
6. Are commits meaningful?
7. Are there partial implementations?
8. Are there later regressions or overrides?
9. Are there suspicious shared-file collisions?
10. Are ownership/task-folder states consistent with the implementation?

Omega's current development standard requires exactly three meaningful local commits for each newly developed calculator.

However, do not assume every historical calculator necessarily followed the same standard.

Report legacy exceptions separately from confirmed recent workflow violations.

### Multi-agent safety

Do not interact with active agent tasks.

Do not stage files.

Do not automatically repair conflicts.

If another agent is currently modifying a calculator, mark the relevant observations as potentially unstable and report the ownership situation.

---

# PHASE 17 — DEVELOPMENT STATUS VS AUDIT STATUS

Keep these separate.

### Development status

Classify each calculator as:

- `DEVELOPED`
- `PARTIALLY_DEVELOPED`
- `NOT_DEVELOPED`
- `DEVELOPMENT_UNVERIFIED`

Use code, catalog, and integration evidence.

Do not rely solely on MongoDB `isDeveloped=true`.

### Audit status

Classify each calculator as:

- `PASS`
- `PASS_WITH_WARNINGS`
- `FAIL`
- `BLOCKED`
- `UNVERIFIED`

Definitions:

**PASS**

All applicable audited requirements are satisfied with sufficient evidence.

**PASS_WITH_WARNINGS**

The calculator appears correctly implemented, but noncritical concerns remain.

**FAIL**

One or more demonstrable defects affect required functionality, correctness, or integration.

**BLOCKED**

An essential specification, dependency, or verified official dataset is missing, preventing reliable completion of the required audit or implementation assessment.

**UNVERIFIED**

Insufficient access or evidence exists to establish the required audit conclusions.

### Important rules

- DEVELOPED does not automatically mean PASS.
- `isDeveloped=true` does not automatically mean developed.
- A written prompt does not establish development.
- An earlier Cursor completion message is evidence of a report, not proof of current correct code.
- An unavailable test environment does not prove a defect.
- An unexecuted test cannot be reported as passed.
- Missing screenshots do not automatically prove incorrect implementation.

---

# PHASE 18 — SEVERITY CLASSIFICATION

For every finding, assign severity.

### CRITICAL

Examples:

- Incorrect authorized MongoDB identity causing tool collisions.
- Calculator presenting materially wrong tax liability as an authoritative result.
- Major calculation producing incorrect financial results.
- Unauthorized catalog activation or data integrity defects.
- Severe cross-calculator misrouting.

### HIGH

Examples:

- Incorrect core formula.
- Missing essential input.
- Broken result logic.
- Missing required numeric FX.
- Incorrect tax year.
- Wrong state/country tax rules.
- Broken frontend/backend registration.

### MEDIUM

Examples:

- Reset behavior broken.
- Unhandled input edge cases.
- Incorrect default.
- Missing required guide content.
- Incorrect explanatory limitations.
- Incomplete noncritical integration.

### LOW

Examples:

- Minor formatting inconsistency.
- Noncritical accessibility gap.
- Minor explanatory issue.
- Small UI behavior inconsistency not affecting calculation results.

### INFORMATIONAL

For verified observations that do not themselves establish a defect.

Do not overstate severity.

Every defect must include supporting evidence.

---

# PHASE 19 — EVIDENCE REQUIREMENTS

Do not return generic statements such as:

- "Formula checked."
- "Everything looks good."
- "Frontend complete."
- "Database integrated."
- "No problems found."

For every PASS or FAIL judgment, provide concrete evidence.

Use, where available:

- File paths.
- Function names.
- Line numbers or code locations.
- MongoDB record IDs.
- Registry keys.
- Calculation examples.
- Relevant official-source references.
- Commit hashes.
- Task specification references.
- Explanation of the expected versus observed implementation.

For mathematical issues, include:

1. Inputs.
2. Expected result.
3. Implemented result or expression.
4. Difference.
5. Root cause.
6. Suggested repair approach.

If the implemented result was derived through static analysis rather than executed, say so explicitly.

Do not fabricate line numbers, commit hashes, source URLs, or test outcomes.

---

# PHASE 20 — FINAL AUDIT OUTPUT

Produce one comprehensive audit report covering all 50 calculators.

## REPORT SECTION A — Executive Summary

Include:

**Audit title:**

OMEGA CALCULATORS — 50-CALCULATOR DEEP AUDIT REPORT

Include:

- Audit date.
- Repository location.
- Git HEAD, if available.
- Git worktree status.
- MongoDB access status.
- Number of calculators requested: 50.
- Number individually inspected.
- Number not inspected.
- Number developed.
- Number partially developed.
- Number not developed.
- Number development-unverified.
- Number audit PASS.
- Number PASS_WITH_WARNINGS.
- Number FAIL.
- Number BLOCKED.
- Number audit UNVERIFIED.
- Number with critical issues.
- Number with high-severity issues.

Ensure counts reconcile exactly to the 50 requested calculators for each independent status dimension.

Do not add overlapping statuses together incorrectly.

---

## REPORT SECTION B — Master Calculator Audit Table

Provide exactly 50 rows in the original order.

Columns:

| # | Calculator | MongoDB Status | Development Status | UI/Spec | Formula | FX | Integration | Audit Status | Highest Severity |
|---|---|---|---|---|---|---|---|---|---|

Use concise, consistent values.

Do not omit rows for blocked or unavailable calculators.

If a field was not checked, show `UNVERIFIED` or `N/A` as appropriate.

---

## REPORT SECTION C — Detailed Individual Audit

For EACH calculator, include:

### Calculator #N — Exact Calculator Name

**Identity**
- MongoDB ID:
- Slug:
- componentKey:
- Pillar:
- isDeveloped:
- isActive:
- indexable:

**Evidence**
- Main component path:
- Calculation logic path:
- Registry reference:
- Backend integration:
- Sitemap:
- Task specification source:
- Relevant Git commits:

**Audit Checks**
- MongoDB integrity:
- UI/screenshot compliance:
- Input defaults:
- Formula correctness:
- Unit conversions:
- Numeric FX:
- Validation:
- React state:
- Shared actions:
- SEO:
- Guide:
- Embed:
- Responsiveness/accessibility:
- Development history:

**Calculation Verification**
- Mode/formula inspected:
- Example inputs:
- Expected result:
- Observed/static result:
- Verification method:

**Findings**
- Finding ID:
- Severity:
- Description:
- Evidence:
- Suggested repair:

**Final Classification**
- Development Status:
- Audit Status:
- Outstanding verification:

Repeat for all 50 calculators.

For clean calculators, keep the detailed entry concise while providing sufficient evidence for PASS.

For defective calculators, provide full issue details.

---

## REPORT SECTION D — Critical and High-Severity Issues

Create a prioritized issue table.

Columns:

| Priority | Calculator | Finding ID | Severity | Problem | Evidence | Recommended Fix |
|---|---|---|---|---|---|---|

Order:

1. Critical calculation errors.
2. Wrong tax-law or official-data results.
3. MongoDB identity/activation issues.
4. Missing or broken required integrations.
5. Wrong FX calculations.
6. Incorrect screenshot functionality.
7. Other high-priority issues.

Do not perform any repairs.

---

## REPORT SECTION E — Cross-Calculator Issues

Identify shared-system problems affecting multiple tools.

Examples:

- Broken shared FX provider.
- Missing tools-page/embed FX slug registration.
- Incorrect shared pay-period conversion function.
- Shared tax-data year mismatch.
- Registry collision.
- Incorrect componentKey mappings.
- Repeated state-management bug.
- Inconsistent reset behavior.
- Shared SEO/sitemap integration issue.

Identify the root cause and all affected calculators.

Do not list the same underlying bug as unrelated problems without noting the shared cause.

---

## REPORT SECTION F — Missing and Incomplete Calculators

List calculators that are:

- Missing from MongoDB.
- Missing from source code.
- Only partially implemented.
- Missing necessary screenshot functionality.
- Missing calculation logic.
- Missing integration.
- Blocked by official data.
- Blocked by unavailable specifications.
- Claimed by another agent and unsuitable for stable audit.

Preserve the distinction between proven missing components and unavailable evidence.

---

## REPORT SECTION G — Recommended Repair Plan

Provide a repair plan only.

Group findings into:

### Priority 1 — Critical

Must be addressed before the calculator can be considered reliable.

### Priority 2 — High

Core functionality, data, and integration problems.

### Priority 3 — Medium

Validation, reset, UX, and noncritical integration issues.

### Priority 4 — Low

Minor improvements and refinements.

For each repair, state:

- Calculator.
- Exact defect.
- Evidence.
- Expected correct behavior.
- Files likely requiring investigation.
- Any dependency on another repair.
- Whether shared infrastructure is involved.

**Do not modify files or create repair commits.**

---

## REPORT SECTION H — Final Audit Integrity Statement

End with the following completed checklist:

- Total requested calculators: 50.
- Total independently reviewed:
- Total not reviewed:
- MongoDB audit completed: YES / PARTIAL / NO.
- Screenshot/specification comparison: YES / PARTIAL / NO.
- Formula static audit: YES / PARTIAL / NO.
- Real FX audit: YES / PARTIAL / NO.
- Frontend registry audit: YES / PARTIAL / NO.
- Backend integration audit: YES / PARTIAL / NO.
- SEO/sitemap audit: YES / PARTIAL / NO.
- Embed audit: YES / PARTIAL / NO.
- Git history audit: YES / PARTIAL / NO.
- Runtime testing performed: NO, unless expressly authorized.
- Repository files modified: NO.
- MongoDB records modified: NO.
- Task folders moved: NO.
- Development tracker modified: NO.
- Git commits created: NO.
- Git push/pull/fetch/sync performed: NO.
- Repairs performed: NO.

If any of these read-only integrity statements are false, report the actual action honestly and explain why.

---

# PHASE 21 — EXECUTION STRATEGY

Work systematically through all 50 calculators.

Recommended internal audit sequence:

1. Inspect architecture and relevant ADRs.
2. Read the exact calculator catalog records.
3. Build the identity and source-file map.
4. Locate authorized screenshots/specifications.
5. Audit calculator implementations individually.
6. Audit calculation correctness.
7. Audit FX requirements.
8. Audit frontend/backend integrations.
9. Audit shared functions and cross-calculator dependencies.
10. Inspect Git history.
11. Reconcile evidence.
12. Produce the full final report.

You may group internal read-only inspection operations for efficiency.

However, maintain an independent conclusion for each calculator.

Do not use generic assumptions to mark entire groups PASS.

If context or execution limits prevent completing all 50, provide a truthful partial report containing the exact completed count, outstanding calculator names, and evidence already collected. Do not mark uninspected calculators as audited.

Do not ask for permission to perform ordinary read-only inspection.

Do not perform prohibited writes or automated execution without authorization.

---

# FINAL INSTRUCTION

**AUDIT ONLY — NO DEVELOPMENT — NO REPAIRS — NO COMMITS — NO DATABASE CHANGES.**

The purpose is to establish the real condition of these exact 50 Omega Calculators.

A calculator must not receive PASS simply because:

- Its MongoDB record exists.
- Its `isDeveloped` flag is true.
- A React component exists.
- It is present in the registry.
- A Cursor agent previously reported completion.
- A prompt was written for it.
- Its UI looks correct.
- Its formulas have not been independently reviewed.

Provide an evidence-based technical audit with precise findings, reliable status classifications, and an actionable future repair plan.

**Deliver the most complete truthful report possible for all 50 calculators, then STOP.**