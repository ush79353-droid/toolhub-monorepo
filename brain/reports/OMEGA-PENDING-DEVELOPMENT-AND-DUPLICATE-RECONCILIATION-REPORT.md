# OMEGA — Pending Development & Duplicate Reconciliation Report

**Agent:** `cursor-agent-pending-78604974-222204`  
**Session:** `sess-pending-first-20261125-222204`  
**Mission:** Pending-first development (Issued recovery NOT started)  
**Generated:** 2026-11-25T18:40+05:00  

---

## H. Final Status

**PENDING EMPTY — OTHER AGENTS STILL DEVELOPING.**

Pending count is **0**. Thirteen calculators remain in Progress under other agents. Issued inventory below is for operator review only — no Issued recovery was started.

---

## A. Initial Queue (post Recycle Bin scan)

| Folder | Count at mission start |
| --- | ---: |
| Pending | 33 |
| Progress | 3 |
| Completed | 18 |
| Issued | 60 |

**Pending materials:** Every Pending folder had `prompt.txt` + ≥1 screenshot (restored).

**Pending ↔ Completed overlaps (already developed; left for other agents / reconciliation):**  
Bladder Volume, Creatinine Clearance, EORTC, FEUrea, GFR, KtV, Prostate Volume.

**Pending ↔ Progress overlaps (do not claim):**  
FENa, Kidney Failure Risk (+ Audit Score already in Progress).

**Pending ↔ Issued overlaps:**  
Kidney STONE (registration lock history), Metastatic Prostate (clinical gap), Protein Creatinine Ratio (Mongo DNS history).

**Other concurrent pending-first agents observed:**  
`cursor-agent-4068b3c92f7d`, `cursor-agent-pending-a72c401d8e`, `cursor-agent-pending-composer-b7e4`, plus worker subagents.

---

## B. Pending Development (this coordinator)

| Metric | Count |
| --- | ---: |
| Pending processed by this agent (claimed) | 1 (Light's Criteria) |
| Newly developed + activated by this agent | 1 |
| Already-developed Pending folders reconciled by this agent | 0 (left to parallel agents / Completed overlap policy) |
| Failed → Issued by this agent | 0 |
| Parallel workers spawned | PSA Density, PF Ratio, RSBI, Kidney STONE reg, QpQs, Vital Capacity, PSA Doubling, TTKG |
| Remaining unclaimed Pending at end | **0** |

---

## C. Successful Development (this agent)

### Light's Criteria Calculator for Pleural Effusion

| Field | Value |
| --- | --- |
| MongoDB `_id` | `6af46f12a27d8d1d4e9902e6` |
| Slug | `lights-criteria-calculator-for-pleural-effusion` |
| ComponentKey | `LightsCriteriaCalculator` |
| Original task | `Tools/Pending/Light's Criteria Calculator for Pleural Effusion` |
| Issued duplicate? | No |
| Formula | Light 1972 strict inequalities: protein ratio >0.5, LDH ratio >0.6, pleural LDH >(2/3)×ULN; exudate on any met; transudate only when all three assessed negative |
| Frontend/backend | Registered in `keys.ts` (both lists), `registry/index.ts`, `registry/details.ts`, `tool.key.ts` |
| Commits | UI `b4278d02` · Engine `06a5aaa4` · Reg `e6f5585b` (also `abc1a78c` on origin history) |
| GitHub | Synced on `origin/development` |
| MongoDB | `isDeveloped=true`, `isActive=true`, `indexable=false`, `embedEnabled=true` |
| Completed path | `Tools/Completed/Light's Criteria Calculator for Pleural Effusion` |
| Checks run | `npx tsx …/lights-criteria/calculation.test.ts` → ok; Mongo assign read-back OK. Full lint/typecheck/build **not** run (not authorized for this mission batch). |

**Also observed completed by other agents during this session (not claimed here):**  
Endotracheal Tube Size (activated), FEV1/FVC, Kidney STONE (Issued duplicate removed; now in Completed), Lung Capacity, Peak Flow, Oxygenation Index, PF Ratio, PSA Density, Tidal Volume, Urine Output, RSBI, Lung Cancer Risk, and others — see Completed folder growth 18 → 39.

---

## D. Issued Duplicate Reconciliation

| Calculator | Result |
| --- | --- |
| Kidney STONE | Pending restored + registration finished by parallel worker; **Issued duplicate removed**; canonical folder in Completed |
| Metastatic Prostate | Still in Issued (clinical formula gap) **and** Progress (another agent claimed) — **not** merged/deleted by this agent |
| Protein Creatinine Ratio | Still in Issued (historical Mongo DNS) **and** Progress — code already on GitHub; activation may still be in flight |
| Light's Criteria | No Issued twin |

---

## E. Failed Pending Calculators (this agent)

None.

---

## F. Final Folder Counts (fresh scan)

| Folder | Count |
| --- | ---: |
| `Tools/Pending` | **0** |
| `Tools/Progress` | **13** |
| `Tools/Completed` | **39** |
| `Tools/Issued` | **59** |

---

## G. Remaining Issued Tools (inventory only)

**Classification summary (59):**

| Category | Count |
| --- | ---: |
| Missing screenshots / prompt / empty task pack | ~50 |
| MongoDB / Atlas DNS / assign blockers | ~7 |
| Clinical / formula / primary-source gaps | ~2 |
| Duplicate-queue / reconciled labels / other | remainder in folder-name suffixes |

**Full Issued folder list:**

1. ABSI Calculator — missing screenshots/prompt  
2. Acid Base Calculator — empty task pack  
3. Addiction Calculator — Mongo/Atlas DNS  
4. Adjusted Body Weight Calculator — other/unclassified  
5. Adrenal Washout Calculator (duplicate-queue) — duplicate-queue label  
6. Albumin Creatinine Ratio Calculator - duplicate-pending — duplicate after completion  
7. Alcohol Unit Calculator — other  
8. Anion Gap Calculator — other  
9. Arterial Blood pH Calculator — other  
10. BAC Calculator — reference/screenshot mismatch  
11. BAI Calculator - Body Adiposity Index — missing screenshots/prompt  
12. Bedridden Patient Height Calculator — other  
13. Bicarbonate Deficit Calculator — other  
14. Body Frame Size Calculator — missing screenshots/prompt  
15. Body Shape Calculator — missing screenshots/prompt  
16. Body Surface Area Calculator — missing screenshots/prompt  
17. Body Type Calculator — missing screenshots/prompt  
18. BRI Calculator — Body Roundness Index — missing screenshots/prompt  
19. BSA Calculator – Body Surface Area — missing screenshots/prompt  
20. BUN Creatinine Ratio Calculator - duplicate-queue-reconciled — duplicate label  
21. CIWA Calculator — other  
22. Corrected Calcium Calculator — missing screenshots/prompt  
23. Corrected Magnesium Calculator — missing screenshots/prompt  
24. Draw Length Calculator — missing screenshots/prompt  
25. Drip Rate Calculator — missing screenshots/prompt  
26. Drops Per Minute Calculator — missing screenshots/prompt  
27. Face Shape Calculator — missing screenshots/prompt  
28. FFMI Calculator (Fat-Free Mass Index) — missing screenshots/prompt  
29. Free Water Deficit Calculator — other  
30. Healthy Weight Calculator — missing screenshots/prompt  
31. Ideal Weight Calculator — missing screenshots/prompt  
32. IV Flow Rate Calculator — missing screenshots/prompt  
33. Karvonen Formula Calculator — missing screenshots/prompt  
34. Lean Body Mass Calculator — missing screenshots/prompt  
35. Metastatic Prostate Cancer Prognosis Calculator — **clinical formula / life-table gap** (also in Progress)  
36. NLR Calculator — missing screenshots/prompt  
37. Overweight Calculator — missing screenshots/prompt  
38. Parkland Formula Calculator — missing screenshots/prompt  
39. Plasma Osmolality Calculator — missing screenshots/prompt  
40. Plasma Volume Calculator — missing screenshots/prompt  
41. Ponderal Index Calculator — missing screenshots/prompt  
42. Protein Creatinine Ratio Calculator — historical Mongo assign blocker (also in Progress)  
43. Quiz FFMI Calculator (Fat-Free Mass Index) — missing screenshots/prompt  
44. RBC Indices Calculator What is MCHC — missing screenshots/prompt  
45. RFM Calculator (Relative Fat Mass) — missing screenshots/prompt  
46. Serum Osmolality Calculator — missing screenshots/prompt  
47. Sodium Change Calculator in Hypertriglyceridemia — missing screenshots/prompt  
48. Sodium Correction Calculator — missing screenshots/prompt  
49. Sodium Correction Rate Calculator for Hypoand Hypernatremia — missing screenshots/prompt  
50. Sodium Deficit Calculator — missing screenshots/prompt  
51. Total Body Water Calculator — missing screenshots/prompt  
52. Transferrin Saturation Calculator — missing screenshots/prompt  
53. Urine Anion Gap Calculator — missing screenshots/prompt  
54. Venous Blood pH Calculator — missing screenshots/prompt  
55. Waist to Height Ratio Calculator — missing screenshots/prompt  
56. Waist to Hip Ratio Calculator — missing screenshots/prompt  
57. Water Intake Calculator — missing screenshots/prompt  
58. Weight Loss Percentage Calculator — missing screenshots/prompt  
59. Winters' Formula Calculator — missing screenshots/prompt  

---

## Progress still active (do not disturb)

| Calculator | Owner (if known) |
| --- | --- |
| Audit Score Calculator | `cursor-agent-25205458-010544` (REGISTRATION_WAITING_LOCKS) |
| FENa Calculator | unknown / stale lock history |
| Kidney Failure Risk Calculator | `cursor-agent-66940321-002348` |
| Lung Nodule Growth Rate Calculator | `cursor-agent-4068b3c92f7d` |
| Metastatic Prostate Cancer Prognosis Calculator | unknown |
| Protein Creatinine Ratio Calculator | unknown |
| PSA Doubling Time Calculator | unknown |
| PSI Calculator | `cursor-agent-pending-psi-sub` |
| Quiz Protein Creatinine Ratio Calculator | unknown |
| TTKG Calculator | unknown |
| Urine Output Calculator | unknown |
| URR Calculator | unknown |
| Vital Capacity Calculator | unknown |

---

## Temporary files cleaned

**YES** — removed `backend/src/scripts/_tmp-lights-lookup.ts` and temp Mongo lookup `.mjs` outside the repo. No `git clean` used.

---

## Operator note

**Do not start Issued recovery until instructed.** Pending is empty; wait for Progress agents to finish, then optionally re-scan Issued (especially Metastatic clinical pack and Mongo-blocked rows with restored materials).
