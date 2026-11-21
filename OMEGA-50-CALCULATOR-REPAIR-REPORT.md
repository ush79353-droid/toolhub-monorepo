# OMEGA 50-CALCULATOR REPAIR REPORT

**Mission date:** 2026-11-21  
**Baseline audit:** OMEGA CALCULATORS — 50-CALCULATOR DEEP AUDIT REPORT (2026-11-20)  
**Pre-repair HEAD:** `a2e4a754` (post-audit recovery notes); audit originally at `938d0283`  
**Post-repair HEAD:** see latest local commits below  
**Git push/pull/fetch/sync:** NONE  
**Missouri Sales Tax touched:** NO  
**Runtime testing:** NO (static checks + targeted `tsx` calculation self-checks only)

---

## A. Executive Summary

| Metric | Count |
|---|---|
| Calculators in scope | 50 |
| Findings reviewed | All CRITICAL/HIGH/MEDIUM/LOW from audit + incomplete/undeveloped items |
| Critical resolved | 1 (S28-1 Canada GST/QST registry) |
| High resolved | 4 (S36-1 Monthly FX, S46-1 State Tax NY/TX, S34-1 MAGI labeling, S38-1 Net to Gross developed) |
| Medium resolved | 5+ (Alabama sitemap, AGI/RMD/Marriage/Gratuity disclosures where applicable) |
| Low resolved | AMT constant + Selling Leave/GST naming + several already-adequate disclosures verified |
| Newly developed | 1 (Net to Gross) |
| Remaining blocked | 3 (Biden, Quiz Annual Income, Take-Home) |
| Specification required | 2 (Build Back Better, Rate of Pay) |
| ON HOLD (out of scope) | 1 (Missouri — not in 50-repair mission) |
| Already fixed / verified OK | Multiple PASS calculators unchanged |

---

## B. Per-Finding Results

| Finding ID | Calculator | Severity | Original Problem | Action Taken | Files Changed | Validation | Final Status |
|---|---|---|---|---|---|---|---|
| S28-1 | GST/QST Calculator for Canada | CRITICAL | Module+Mongo active; registries wiped | Restored `CanadaGstQstCalculator` in keys/index/details/tool.key + sitemap | registry, sitemap, tool.key | Canada GST `tsx` test OK; keys present | FIXED |
| S36-1 | Monthly Income Calculator | HIGH | Missing FX slug lists | Added `monthly-income-calculator` to tools+embed FX sets | page.tsx, embed page | Static presence verified | FIXED |
| S46-1 | State Tax Calculator | HIGH | Navigator AL/CA/IL only | Added NY + TX live destinations; updated test | states.ts, calculation.test.ts | `tsx` test OK | FIXED |
| S34-1 | MAGI Calculator | HIGH | Generic MAGI overclaim risk | Strengthened illustrative/non-program-specific labeling | MAGI detail/content/guide | Static copy review | FIXED |
| S38-1 | Net to Gross Calculator | HIGH | Engine-only / unregistered | Built UI, registered, activated Mongo, moved folder | net-to-gross/*, registries, FX, sitemap, brain | `tsx` calc test; Mongo assign | DEVELOPED |
| S12-1 | Alabama Tax Calculator | MEDIUM | Missing sitemap slug | Added `alabama-tax-calculator` to IMPLEMENTED_TOOL_SLUGS | sitemap.ts | Static presence | FIXED |
| S11-1 | AGI Calculator | MEDIUM | Educational scope unclear | Clarified simplified Form 1040 AGI estimate labeling | AGI detail/content/form/guide | Static copy | FIXED |
| S25-1 | Gratuity Calculator | MEDIUM | Jurisdiction clarity | Already disclosed Indian Act 1972 | — | Verified existing | ALREADY FIXED |
| S32-1 | Marriage Tax Calculator | MEDIUM | Model simplifications | Disclosed itemized/SE½/dependent limits | marriage-tax content/guide/validation | Static copy | FIXED |
| S43-1 | RMD Calculator | MEDIUM | SECURE 2.0 / joint-life | Clarified starting-age cohorts + Uniform Lifetime scope | rmd detail/content/guide | Static copy | FIXED |
| S13-1 | AMT Calculator | LOW | Wrong 2022 single phaseoutComplete | Corrected unused constant `776_100` → `843_500` | amt-parameters.ts | IRS Form 6251 2022 | FIXED |
| S10-1 | Stimulus Check | LOW | Non-filer oversimplification | Already disclosed historical EIP1 + SSI/VA | — | Verified existing | ALREADY FIXED |
| S22-1 | Child Tax Credit | LOW | ACTC limits | Already disclosed | — | Verified existing | ALREADY FIXED |
| S23-1 | Estate Tax | LOW | Lifetime gifts | Already disclosed informational | — | Verified existing | ALREADY FIXED |
| S31-1 | Lottery Tax | LOW | Withholding vs liability | Already disclosed | — | Verified existing | ALREADY FIXED |
| S44-1 | Selling Leave Days | LOW | 260/8h assumptions | Labeled estimate assumptions | selling-leave detail | Static copy | FIXED |
| S26 | GST Calculator | LOW | Naming collision risk | Clarified generic rate tool vs Canada GST/QST | gst detail/content/guide | Static copy | FIXED |
| S16-1 | Biden's Tax Plan | HIGH | Undeveloped | Research incomplete (age/dependents/baseline) | AGENT_STATUS only | Spec gaps | BLOCKED |
| S20-1 | Build Back Better | HIGH | Catalog only, no task assets | No authorized screenshot/prompt in project | — | No invent | SPECIFICATION REQUIRED |
| S42-1 | Rate of Pay | HIGH | Catalog only; RMD misfile history | No authorized Rate of Pay screenshot/prompt | — | No invent | SPECIFICATION REQUIRED |
| S41-1 | Quiz: Annual Income | HIGH | Only Q1/7 | Q2–Q7 still missing | AGENT_STATUS | No invent | BLOCKED |
| S47-1 | Take-Home-Paycheck | HIGH | Jurisdiction unknown | KS Anderson 1.37% circumstantial only | AGENT_STATUS | No invent | BLOCKED |
| Informational | Annual Income / Pay / Yearly Wage | INFO | Near-duplicates | Left as independent catalog products | — | — | NOT VERIFIED (no change required) |
| Informational | Gross↔Net identity | INFO | Overlap concern | Distinct Net to Gross shipped | — | — | FIXED via S38-1 |
| Informational | Rate of Pay vs RMD | INFO | Collision risk | Identities remain separate | — | — | ALREADY FIXED |

---

## C. Newly Developed Calculator Summary

| Calculator | MongoDB ID | Component Key | Three Local Commits | Folder Moved | Final Status |
|---|---|---|---|---|---|
| Net to Gross Calculator | `6af46f0fa27d8d1d4e99006b` | `NetToGrossCalculator` | `2c0f976b` / `4535b2ec` / `453c0c5c` | YES → Completed Tools | DEVELOPED |

---

## D. Remaining Blockers

### Biden's Tax Plan Calculator (`…0055`)
- **Missing:** Verified role of age field; dependents vs child-age interaction; exact baseline year table; refundable CTC presentation rules.
- **Evidence:** Screenshot AFP copy; Tax Foundation thresholds known but UI semantics incomplete.
- **Next:** PO supplies authorized baseline year + field rules, or historical product source.
- **Implementation remains:** none; Mongo undeveloped.

### Quiz: Annual Income Calculator (`…006e`)
- **Missing:** Authorized Q2–Q7 text, options, correct answers.
- **Evidence:** Prompt + screenshot only Q1.
- **Next:** Supply full 7-question bank.
- **Implementation remains:** none.

### Take-Home-Paycheck Calculator (`…0074`)
- **Missing:** Authorized state/jurisdiction for Anderson @ 1.37%.
- **Evidence:** Circumstantial KS ACS match; TX Anderson is 0.919% (different tool).
- **Next:** PO confirms state + authorized county/tax datasets.
- **Implementation remains:** none.

### Build Back Better Calculator (`…0059`)
- **Missing:** Project screenshot/prompt and product field scope.
- **Evidence:** Catalog row only; House BBBA never enacted; third-party calculators are not authorized specs.
- **Next:** SPECIFICATION REQUIRED before any build.
- **User approval:** YES for product scope.

### Rate of Pay Calculator (`…006f`)
- **Missing:** Authorized Rate of Pay screenshot/prompt (prior material was misfiled as RMD).
- **Evidence:** Catalog undeveloped; RMD correctly owns `RmdCalculator`.
- **Next:** SPECIFICATION REQUIRED.
- **User approval:** YES for functional scope.

---

## E. Final Integrity

### Frontend registration
- `CanadaGstQstCalculator` and `NetToGrossCalculator` present in `keys.ts` (both lists), `index.ts`, `details.ts`.

### Backend registration
- Both keys present in `tool.key.ts` APPROVED list + direct-run asserts.

### Sitemap
- `gstqst-calculator-for-canada`, `alabama-tax-calculator`, `net-to-gross-calculator` present in `IMPLEMENTED_TOOL_SLUGS`.

### FX allowlists
- `monthly-income-calculator` and `net-to-gross-calculator` present in tools + embed `CURRENCY_CONVERSION_SLUGS`.
- Canada GST/QST correctly **not** FX-listed (fixed CAD).

### MongoDB
- Canada GST/QST: previously active — left active (no unnecessary update).
- Net to Gross: activated via `tool:assign --set-active` (`indexable` false preserved).

### Key local commit hashes
| Hash | Summary |
|---|---|
| `ba8cd58b` | Canada GST/QST registry + Monthly FX + State Tax NY/TX + Alabama sitemap |
| `cb645b38` | Disclosure clarifications (MAGI, AGI, RMD, AMT, Marriage, Selling Leave, GST) |
| `2c0f976b` | Net to Gross UI |
| `4535b2ec` | Net to Gross engine test |
| `453c0c5c` | Net to Gross registration/Brain/folder |

### Checklist
- Tracker updated: YES (`OMEGA-DEVELOPMENT-TRACKER.md`)
- Temporary files cleaned: YES
- Git push/pull/fetch/sync: NONE
- Missouri Sales Tax touched: NO
- Runtime testing performed: NO (targeted `tsx` self-checks only)
- Final audit executed: NO (repair mission only)
