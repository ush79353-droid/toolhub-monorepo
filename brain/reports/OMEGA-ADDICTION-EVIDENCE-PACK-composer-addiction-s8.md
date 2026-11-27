# Addiction Calculator — Evidence Pack Request (Session 8)

**Date:** 2026-11-27  
**Agent:** cursor-agent-pending-composer-addiction-s8  
**Slug (expected):** `addiction-calculator`  
**Historical Mongo hint (unverified live):** `6af46f12a27d8d1d4e9902f3`  
**Queue:** Remains in `Tools/Issued/Addiction Calculator`  
**Development:** NONE  
**Local commits:** none  
**GitHub sync:** NONE  

---

## Decision

**`EVIDENCE_INSUFFICIENT_KEEP_ISSUED`**

Do **not** ship an individualized life-expectancy / death forecast.  
Do **not** invent minutes-lost defaults or a full country life-expectancy table.  
Dual blockers remain: **(1) unauthorized / non-reproducible per-dose life-loss model** and **(2) live Mongo identity still unreachable (Atlas `querySrv EBADRESP`)**.

---

## 1. Screenshot / prompt scope (verified)

| Control | Observed |
| --- | --- |
| Addiction type | Dropdown; default **Cigarettes**. Options: Alcoholic Drinks, Cigarettes, Cocaine lines, Meth hits, Methadone Pills, Heroin shots |
| Life lost | **14.1** shown; unit **min / dose**; live Omni field is **disabled/readonly** (auto from type — not a free user assumption) |
| Times used | blank **/ day** |
| Age started | blank **years old** |
| Country | **United States** (live Omni has ~223 countries) |
| Non-addict life expectancy | **79 yrs / 8.16 mos** for US (~79.68 y) |
| Addict's life expectancy | yrs / mos (computed) |
| Addiction duration | yrs / mos (computed) |
| Total life lost | yrs / mos / days (computed) |
| Notes | Continues-to-use caveat + strong medical disclaimer |
| FX | None |

No `frontend/src/tools/calculators/addiction/` module exists.

---

## 2. What the arithmetic would be (if authorized)

Educational awareness model Omni describes:

1. Pick substance → default `lifeLostPerDose`.  
2. User enters `timesPerDay`, `ageStarted`, `country`.  
3. `nonAddictLE` ← country baseline.  
4. `duration = max(0, nonAddictLE − ageStarted)`.  
5. `totalLifeLost = lifeLostPerDose × timesPerDay × durationDays`.  
6. `addictLE = nonAddictLE − totalLifeLost` (floored appropriately).

**Classification of outputs**

| Output | Nature |
| --- | --- |
| Duration from age→country LE | Arithmetic on baselines |
| Total life lost from per-dose × frequency × duration | Arithmetic on **assumed** per-dose loss |
| Addict LE | Arithmetic residual — **not** a validated individual prognosis |
| Default minutes/hours per dose | Requires **authorized population model / extract** — currently **not** independently reproducible from primary papers alone |
| Country LE list (~223) | Requires **frozen published vintage table** — Wikipedia “as always” is not a versioned Omega dataset |

Population association ≠ causal individualized forecast. Omni’s own page admits imperfect data, awareness purpose, and case-level deviation.

---

## 3. Minutes-lost research (critical gap)

### Omni-published defaults (per dose, lifelong addict framing)

| Substance | Omni default | Stated average use |
| --- | --- | --- |
| Alcohol | **6.5 hours** | 2.15 standard drinks/day |
| Cigarettes | **14.1 minutes** | 20/day |
| Cocaine | **6.6 hours** | 1 g/day ≈ 6 doses |
| Methamphetamine | **9.2 hours** | 5.3 hits/day |
| Heroin | **24 hours** | 3 injections/day |
| Methadone | **14.7 hours** | 4 pills/day (illegal-use framing only) |

Omni cites six papers (Westman 2015 alcohol LE; Jha 2013 smoking; Corkery 2017 cocaine deaths; Herbeck 2015 meth; Darke 2016 heroin YPLL; Clode 2009 methadone) **and** Treatment4Addiction aggregation (via Daily Mail) of CDC/SAMHSA-style stats.

### Independent tracing

Media coverage of Treatment4Addiction (~2014) describes **back-calculation**: years of life lost ÷ (years of use × doses/day) → minutes/hours per dose. Project lead acknowledged estimates are approximate.

Reported Treatment4Addiction / press figures **do not match Omni’s table exactly**, e.g.:

| Substance | Press/T4A-era | Omni |
| --- | --- | --- |
| Cigarette | ~13.8 min | **14.1 min** |
| Alcohol | ~6.6 h | **6.5 h** |
| Cocaine | ~5.1 h | **6.6 h** |
| Meth | ~11.1 h | **9.2 h** |
| Heroin | ~22.8 h | **24 h** |
| Methadone | ~12.6 h | **14.7 h** |

Primary cited papers report cohort mortality / years lost — **not** these exact per-dose minute constants. Therefore Omega cannot treat Omni’s defaults as a verified primary-derived calibration without an owner-approved extract of the aggregation workbook / method.

**Interpretation of “minutes lost per dose”:** an awareness scalar derived from population averages for chronic users, not a measured biological countdown for one exposure, and not a personalized death date.

---

## 4. Country life-expectancy research

- Omni: “Wikipedia comes to the rescue.” Live US baseline **79 y + 8.16 mo**.  
- In-repo Retirement defaults: UN WPP 2024 e0 US ≈ **81.4 F / 76.4 M** (sex-specific) — **not** the same number as Omni’s both-sex Wikipedia figure.  
- Full Omni country list ≈ **223** entries. Shipping without a frozen published table would invent baselines.  
- Safe path if later approved: reuse a **versioned** UNDESA WPP (or other dated official) table with sex policy explicit (both-sex e0 vs sex selector — screenshot has **no sex input**).

---

## 5. MongoDB status (this session)

| Check | Result |
| --- | --- |
| URI configured | Yes |
| Live connect | **FAIL** `querySrv EBADRESP _mongodb._tcp.cluster0.pa6smuw.mongodb.net` |
| Historical hint `6af46f12a27d8d1d4e9902f3` | **Not re-verified** |
| Catalog JSON name | Present (Health & Fitness; pillar/subpillar null) |

Do not assign/activate until live unique row is confirmed.

---

## 6. Evidence pack — owner must supply / approve

### Missing substance data
1. Authorized per-dose life-loss table for all six types (units, dose definition, population).  
2. Transparent derivation: source years lost, duration of use, doses/day, and rounding that yields Omni (or Omega) constants.  
3. Confirmation whether methadone illegal-use-only framing is retained.  
4. Policy for substances **not** listed (unsupported → honest empty state).

### Missing country data
1. Frozen LE table for every supported country (or capped country list).  
2. Publication year / agency (e.g. UNDESA WPP 2024 both-sex e0).  
3. Match/acceptance vs screenshot US **79.68 y** (keep Omni Wikipedia vintage vs switch to WPP with disclosed deviation).

### Required model / assumptions
1. Explicit formula for duration and total loss (calendar day factor 365 vs 365.25).  
2. Flooring when total loss ≥ remaining LE.  
3. Quitting / former-user out of scope (disclaimer only).  
4. UI: Life lost remains type-driven readonly vs owner allows override.  
5. Labeling: **educational population-average illustration — not medical prognosis**.

### Proposed safe calculation scope (only after approval)
- Arithmetic awareness calculator using **owner-approved** defaults + **versioned** country LE.  
- Strong disclaimer; no treatment advice; no individual death prediction language.  
- Unsupported country/substance → clear unavailable state.  
- Optional Phase-1: US-only + cigarettes-only if that is the only approved subset.

### Independent numerical fixtures needed (examples)
| ID | Type | Times/day | Age started | Country | Expected (after approved tables) |
| --- | --- | ---: | ---: | --- | --- |
| F1 | Cigarettes | 20 | 18 | United States | fill after LE+14.1 authorized |
| F2 | Alcohol | 2.15 | 21 | United States | fill |
| F3 | Cigarettes | 0 | 18 | United States | zero loss / duration still defined? |
| F4 | Heroin | 3 | 23 | United States | fill |
| F5 | Cigarettes | 20 | 18 | (unsupported) | unavailable |

---

## 7. Owner decision

**A.** Approve evidence pack (tables + formula + fixtures + disclaimer language) → then develop after Mongo verify.  
**B.** Narrow scope (e.g. US + cigarettes only) with approved numbers.  
**C.** Defer — keep Issued.

Until A/B **and** live Mongo identity: **no module, no registry, no commits claiming completion.**

---

## 8. Next exact development action

1. Owner supplies/approves evidence pack (or B narrow scope).  
2. Restore Atlas DNS; verify `_id`/slug/flags (do not trust hint alone).  
3. Isolated worktree → UI then engine commits → integrator registries.  
4. Until then: remain Issued.

Temporary files cleaned: YES  
