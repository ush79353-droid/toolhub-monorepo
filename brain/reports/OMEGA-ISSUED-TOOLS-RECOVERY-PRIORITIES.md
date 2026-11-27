# OMEGA ISSUED TOOLS — RECOVERY PRIORITIES

**Date:** 2026-11-27  
**Issued count (grounded Session 10):** 6 (+ 1 Progress Alcohol WIP; 3 duplicates already Completed)  
**Live Mongo Session 10:** `MONGODB_UNVERIFIED` (Atlas `querySrv EBADRESP`)  
**Progress / Pending:** Progress 1 (Alcohol Unit); Pending 0  
**Policy:** Session 10 coordinator — no mid-flight steal; no unapproved clinical integration  
**Final report:** `brain/reports/OMEGA-ISSUED-TOOLS-FINAL-DEVELOPMENT-REPORT.md`

---

## Recommended order (owner view)

1. **Clean duplicates first** (no coding risk).  
2. **Fix Mongo/DNS**, then develop Alcohol Unit + CIWA.  
3. **Authorize Quiz Mongo row**, then build quiz (answers already known).  
4. **Collect owner packs** for Body Shape / Face Shape / Addiction / Metastatic — only then develop.  
5. **Never** rebuild Adrenal / Albumin ACR / BUN.

---

## 1. Ready to develop immediately

**Count: 0 net-new builds** without further environmental or owner input.

Closest “immediate” work (non-build):

| Calculator | Why “immediate” | Action |
| --- | --- | --- |
| Adrenal / Albumin / BUN duplicates | Implementation already in repo | Reconcile Issued folders only |

True greenfield READY_NOW with verified live Mongo + complete formula: **none** in this snapshot (Mongo DNS down).

---

## 2. Small technical fixes / reconciliation

| Calculator | Exact repair |
| --- | --- |
| **Adrenal Washout Calculator (duplicate-queue)** | Confirm module `adrenal-washout` + commits `09d37ff2` / `08783b11` / `c9086bff`; retire duplicate Issued folder; optional Mongo flag read-back when DNS works. **Do not rebuild.** |
| **Albumin Creatinine Ratio Calculator - duplicate-pending** | Confirm `albumin-creatinine-ratio` + commits `67954e30` / `a06a16c7` / `25427263`; retire duplicate. **Do not rebuild.** |
| **BUN Creatinine Ratio Calculator - duplicate-queue-reconciled** | Confirm `bun-creatinine-ratio` + commits `df3445b1` / `b11f1075` / `838eb350`; retire duplicate. **Do not rebuild.** |
| **Alcohol Unit Calculator** | Restore Atlas DNS → verify historical `_id` hint `6af46f12a27d8d1d4e9902f4` → claim → ADR-018 UI/engine/registry/assign. Spec already complete. |
| **CIWA Calculator** | Same DNS path → verify hint `6af46f12a27d8d1d4e9902fb` → implement CIWA-Ar (10 items, max 67) as educational worksheet. |

---

## 3. Partial implementations

**Count: 0**

No Issued tool is currently UI-only or engine-partial.  
(Related note outside Issued identity: non-quiz **Protein Creatinine Ratio** module exists and is registered — that is **not** the Issued quiz task.)

---

## 4. Missing screenshots / prompts

**Count: 0**

All 10 Issued folders have `prompt.txt` and at least one PNG.  
Searched `Pending`, `Progress`, `Completed`, and `D:\Tools Prompt\Ready` — no additional restored materials needed for this set.

---

## 5. Medical / official data / formula blockers

| Calculator | What must be obtained | Notes |
| --- | --- | --- |
| **Metastatic Prostate Cancer Prognosis Calculator** | Owner MODEL_APPROVAL + SSA vintage + mets/health merge coefficients + fixtures (Session 9 pack: `OMEGA-METASTATIC-PROSTATE-CLINICAL-EVIDENCE-PACK-composer-mpc-s9.md`) | Highest clinical risk; Omni fragments ≠ complete model; Albertsen localized; clones invent mets×2 / health 0.85–1.50; inventing LE forbidden |
| **Addiction Calculator** | Verified minutes-lost / exposure models + country life-expectancy baselines | Mongo also down; both blockers matter |
| **Body Shape Calculator** | Full 7-shape numeric table **or** explicit approval to reuse in-repo Body Type (Lee/calculator.net) rules after parity check | Omni page incomplete for thresholds |
| **Face Shape Calculator** | Numeric heuristics, jawline length vs width mapping, optional-sex effects, tie tolerances | Third-party clone thresholds not authoritative |

---

## 6. Active ownership

**Count: 0 live Progress owners**

| Observation | Detail |
| --- | --- |
| `Tools/Progress` | Empty |
| Stale Issued locks | Addiction, Adrenal duplicate, Alcohol Unit, CIWA, Metastatic still have old `.agent-claim` files from 2026-11-25 |
| Treatment | Treat as **STALE_CLAIM_POST_ISSUED**, not WAIT_FOR_ACTIVE_AGENT. Do not delete locks in investigation; clear only under a later authorized cleanup mission |

---

## 7. Already completed duplicates

| Calculator | Evidence | Next |
| --- | --- | --- |
| Adrenal Washout | Full module + registry + 3 commits; ISSUE_REASON documents prior activation | Reconcile Issued folder |
| Albumin Creatinine Ratio | Full module + registry + 3 commits | Reconcile Issued folder |
| BUN Creatinine Ratio | Full module + registry + 3 commits | Reconcile Issued folder |

Note: matching folders are **not** currently under `Tools/Completed` (earlier cleanup). Source of truth is the frontend module + Git history, not the task folder.

---

## 8. Needs MongoDB catalog authorization

| Calculator | Why | Next |
| --- | --- | --- |
| **Quiz Protein Creatinine Ratio Calculator** | Prior report: no live tools document for quiz identity; seed name only in `tools-catalog.json`; cannot invent `_id` | Admin authorize create/restore unique row, then implement quiz from prompt answers |

Do **not** assign the quiz to `ProteinCreatinineRatioCalculator` / `protein-creatinine-ratio-calculator`.

---

## Suggested development sequence (after owner authorization)

| Step | Work | Depends on |
| ---: | --- | --- |
| A | Reconcile 3 duplicates | Owner cleanup authorization |
| B | Restore Mongo/DNS | Network / Atlas |
| C | Develop Alcohol Unit | Step B + claim |
| D | Develop CIWA | Step B + claim |
| E | Seed Quiz Mongo row → develop quiz | Explicit catalog authorization |
| F | Body Shape after table/reuse decision | User decision |
| G | Face Shape after heuristics pack | User pack |
| H | Addiction after evidence pack | User pack + Mongo |
| I | Metastatic only after clinical pack | User clinical approval |

---

## Count summary (mutually exclusive primary buckets)

| Bucket | Count |
| --- | ---: |
| Already completed duplicates (reconcile) | 3 |
| Need small technical fix then develop (Alcohol, CIWA) | 2 |
| Need formulas / official / clinical packs | 4 |
| Need Mongo catalog authorization (Quiz) | 1 |
| Active agent wait | 0 |
| Missing screenshots/prompts | 0 |
| **Total** | **10** |
