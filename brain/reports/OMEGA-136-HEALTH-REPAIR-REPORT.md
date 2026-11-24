# OMEGA-136-HEALTH-REPAIR-REPORT

**Run ID:** `cursor-health-repair-20261124-220201`  
**Generated:** 2026-11-24  
**Agent:** `cursor-health-repair-20261124-220201`  
**Git HEAD after repairs:** `af4f5c8b` (branch `development`)  
**Mode:** Remediation (registry + formula/citation repairs + Mongo identity reconciliation). No push/pull/fetch.

---

## A. Issues investigated

| ID | Calculator | Original defect | Outcome |
|---|---|---|---|
| H-001 | Luteal Phase Calculator | Missing `LutealPhaseCalculator` in `backend/.../tool.key.ts` | **REPAIRED** |
| H-002 | PERC Calculator | Missing `PercCalculator` in `frontend/.../keys.ts` (both lists) | **REPAIRED** |
| U-71 | Diet Risk Score | UNVERIFIED matrix/citation | **VERIFIED** + citation journal string fixed |
| U-72 | DRI Calculator | UNVERIFIED tables; adult protein AMDR 10–30% | **REPAIRED** → 10–35% adults |
| U-82 | Micronutrient | Child sodium shown as AI with CDRR cut-points; 6-mo band | **REPAIRED** |
| U-90 | Vitamin A | UNVERIFIED RAE factors | **VERIFIED_CORRECT** (no code change) |
| U-91 | Vitamin Calculator | 6 months classified as 7–12 mo | **REPAIRED** |
| U-124 | Blood Donor | Plasma recipient map not inverse of donor map | **REPAIRED** |
| W-2..W-127 | 30 PASS_WITH_WARNINGS | Mixed citation/limitation/screenshot | Investigated; 0 formula REPAIR_NEEDED from warnings set |
| Stillbirth | Misattributed Yerke / smoking debate | Citation → Trudell 2017; **keep β=0.2270** (Table 3) | **REPAIRED attribution** |
| GRACE / Twins | Historical blockers | Engines verified; Mongo keys assigned; public inactive | **VERIFIED engines** |

---

## B. Local repair commits

| Hash | Summary |
|---|---|
| `580e8417` | Add `LutealPhaseCalculator` to backend allowlist (H-001) |
| `a5cfcdd6` | Register `PercCalculator` in frontend keys.ts both lists (H-002) |
| `9d9b6b52` | Stillbirth attribution → Trudell 2017 Table 3 |
| `0a04cb67` | DRI AMDR, micronutrient sodium AIs, vitamin 0–6 mo band, DRS citation |
| `af4f5c8b` | Blood-donor plasma recipient map inverse fix |

`LvCalculator` preserved as a separate legitimate key.

---

## C. Files changed (code)

- `backend/src/modules/tools/tool.key.ts`
- `frontend/src/tools/registry/keys.ts`
- `frontend/src/tools/calculators/stillbirth-risk/*` (attribution)
- `frontend/src/tools/calculators/dri/calculation.ts` (+ test)
- `frontend/src/tools/calculators/micronutrient/micronutrient-data.ts` (+ test)
- `frontend/src/tools/calculators/vitamin/calculation.ts` (+ test)
- `frontend/src/tools/calculators/diet-risk-score/calculation.ts`, `types.ts`
- `frontend/src/tools/calculators/blood-donor/calculation.ts` (+ test)

---

## D. Verification evidence

- `npx tsx .../tool.key.ts` → `tool.key ok`
- Engine tests OK: dri, vitamin, blood-donor, stillbirth-risk, micronutrient, diet-risk-score
- Registry check: **136/136** keys present in FE approved + registered + index + details + BE allowlist (`OMEGA-136-HEALTH-REGISTRY-CHECK.json`)
- Mongo Atlas **CONNECT_OK**; Health category intentionally `isActive=false`; **0** active health tools (operator request preserved)
- Mongo reconciliation: **71** rows set `componentKey` + `isDeveloped=true` without changing `isActive`/`indexable`

---

## E. Unresolved blockers

1. **Public visibility:** Health & Fitness category and tools remain publicly deactivated by prior operator request — not re-activated in this mission.
2. **Catalog rows missing in Mongo:** `QuizHarrisBenedictCalculator`, `WeightWatchersPointsCalculator` — modules/registry exist; **no catalog row found**; cannot create new Mongo records under project rules.
3. **Audit ID collision skipped:** Doppler Echo shares cardiac-output Mongo id with `CardiacOutputCalculator` — left untouched.
4. **Formula STILL_UNVERIFIED (warnings):** Breast Cancer Recurrence risk % table; Nuchal Translucency centile knots (secondary Omni anchors).
5. **Screenshot absences (accepted):** Twins, GRACE, Harris–Benedict, Quiz Harris–Benedict.

---

## F. Safety

- Git push/pull/fetch/sync: **NONE**
- Unauthorized new Mongo records: **NONE**
- Force push / destructive git: **NONE**
- Unsupported medical coefficients invented: **NONE** (Trudell Table 3 retained; narrative 0.2770 rejected as inconsistent with OR 1.25)
