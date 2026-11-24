# OMEGA-136-HEALTH-UNVERIFIED-RESOLUTION

Exact six `UNVERIFIED` rows from the baseline inventory (not a sample).

| # | Calculator | Model / formula | Original uncertainty | Sources checked | Numerical review | Defects | Repair | Final status |
|---|---|---|---|---|---|---|---|---|
| 71 | Diet Risk Score | Johnston 9-item DRS 0–27 | Matrix not PDF-checked | `scoring-data.ts` vs BMJ Nutr Prev Health 2020 Table 1 | Worst pattern **27** high; best **0** low | Citation said “BMJ Open” | Citation → BMJ Nutr Prev Health (`0a04cb67`) | **VERIFIED_CORRECT** → PASS_STATIC |
| 72 | DRI Calculator | HB 1919 × PAL + AMDR + NIH ODS | Table verification | `dri-data.ts`, IOM AMDR | 80 kg / 180 cm / sedentary → **2,280** kcal; protein high was **171 g** | Adult protein AMDR coded 10–30% (should be **10–35%**) | Adult high → 35% (`0a04cb67`); tests updated | **VERIFIED** after repair → PASS_STATIC |
| 82 | Micronutrient | NASEM/NIH DRI element tables | Table verification | `micronutrient-data.ts`, NASEM 2019 Na | Age 2 Na was AI **1200** (CDRR cut) vs AI **800** | Child Na values + 6-mo band | Na AI 800/1000/1200; 0–6 mo through 6 mo (`0a04cb67`) | **VERIFIED** after repair → PASS_STATIC |
| 90 | Vitamin A | NIH ODS RAE/IU | RAE vs mcg-to-iu sync | ODS factors in engine | 3000 IU retinol → **900** mcg RAE | None | None | **VERIFIED_CORRECT** → PASS_STATIC |
| 91 | Vitamin Calculator | Shared DRI vitamin table | Age-band / kind labels | Shared table + age bands | Age **6 mo** returned 7–12 mo A **500** vs 0–6 AI **400** | Inclusive 0–6 mo boundary wrong | Boundary `7/12` y (`0a04cb67`) | **VERIFIED** after repair → PASS_STATIC |
| 124 | Blood Donor | ABO/Rh RBC + plasma | Compatibility tables | `calculation.ts` maps | Receive plasma A− listed O donors | Plasma recipient map ≠ inverse of donor map | Inverse rebuilt (`af4f5c8b`) | **VERIFIED** after repair → PASS_STATIC |

## Related historical blockers (also verified here)

| Calculator | Final formula status | Notes |
|---|---|---|
| Stillbirth Risk | PASS (attribution fixed) | Model is **Trudell 2017** e0173461 Table 3; smoking **0.2270** kept (matches OR 1.25). Narrative **0.2770** rejected as inconsistent. Was mislabeled Yerke/e0182874. Commit `9d9b6b52`. |
| GRACE | PASS | Granger 2003 GRACE 1.0 discrete points; worked example total **188** high. Screenshot still absent → warning retained for screenshot only. |
| Chances of Having Twins | PASS | CDC/NCHS 2024 / NVSS rates; age 32 → **33.2/1000**. Population birth rate, not individualized prediction. Screenshot absent. |

No unsupported coefficients were invented.
