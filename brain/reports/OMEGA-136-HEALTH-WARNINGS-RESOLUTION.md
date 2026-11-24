# OMEGA-136-HEALTH-WARNINGS-RESOLUTION

**Source:** 30 `PASS_WITH_WARNINGS` rows from `OMEGA-136-HEALTH-TOOLS-AUDIT-INVENTORY.csv`  
**Investigator:** `cursor-health-repair-20261124-220201`  
**Method:** Static citation/engine spot-check (no browser/runtime automation)

## Summary counts

| Decision | Count |
|---|---:|
| ACCEPTED_LIMITATION | 22 |
| UPGRADE_TO_PASS_STATIC (formula citation solid) | 6 |
| STILL_UNVERIFIED | 2 |
| REPAIR_NEEDED (software defect) | 0 |

Note: For #3, #46, #77, #86 the **formula** can be PASS_STATIC, but missing screenshots remain product/ADR-023 documentation gaps → final audit may still show `PASS_WITH_WARNINGS` for screenshot severity.

| # | Calculator | Original warning | Decision | Evidence | Repair |
|---|---|---|---|---|---|
| 2 | Breast Cancer Recurrence | O'Rourke via secondary tables | STILL_UNVERIFIED | Risk % non-monotonic vs expected table anchors | None without primary table |
| 3 | Chances of Having Twins | Screenshot unavailable; Mongo | UPGRADE_TO_PASS_STATIC (formula) | CDC/NCHS 2024 rates match; population birth rate | None; screenshot optional |
| 9 | Fertility by Age | Limited citation | ACCEPTED_LIMITATION | Teaching ASRM/ACOG bands | None |
| 11 | Fundal Height | Limited citation | ACCEPTED_LIMITATION | INTERGROWTH primary; Johnson add-on labeled | None |
| 14 | Implantation | Limited citation | ACCEPTED_LIMITATION | Wilcox natural; IVF unlabeled-stage band | None |
| 17 | Mean Sac Diameter | Limited citation | ACCEPTED_LIMITATION | MSD+30 teaching approx gated | None |
| 18 | Nuchal Translucency | Centile secondary Omni | STILL_UNVERIFIED | Chung median named; centile knots secondary | None without primary knots |
| 19 | Ovulation | Limited citation | UPGRADE_TO_PASS_STATIC | ASRM fertile window + ACOG +266 | None |
| 23 | Sperm Analysis | Functional ≠ WHO | ACCEPTED_LIMITATION | Explicit non-WHO product | None |
| 29 | Aortic Valve Area | Severe &lt;1 vs ACC ≤1 | ACCEPTED_LIMITATION | Screenshot teaching threshold | None |
| 44 | Framingham Risk | ATP III | UPGRADE_TO_PASS_STATIC | Points/map match ATP III; mmol 38.67 | None |
| 46 | GRACE | Screenshot unavailable | UPGRADE_TO_PASS_STATIC (formula) | Granger 2003 discrete GRACE 1.0 verified | None; screenshot optional |
| 49 | HF Life Expectancy | MAGGIC % not years | ACCEPTED_LIMITATION | Survival % labeled | None |
| 70 | Carbohydrate | Distinct shell | ACCEPTED_LIMITATION | Separate from carb-calculator | None |
| 76 | Gastric Sleeve | Population %EWL | ACCEPTED_LIMITATION | Chang 2014 mean | None |
| 77 | Harris–Benedict | Screenshot unavailable | UPGRADE_TO_PASS_STATIC (formula) | Roza & Shizgal 1984 | None; screenshot optional |
| 81 | Macro | Same as IIFYM | ACCEPTED_LIMITATION | Shared engine | None |
| 83 | Net Carbs | Not FDA | ACCEPTED_LIMITATION | Keto convention labeled | None |
| 85 | Quarantine Activity | Heuristic PAL | ACCEPTED_LIMITATION | Omni-style PAL | None |
| 86 | Quiz Harris–Benedict | Screenshot unavailable | UPGRADE_TO_PASS_STATIC (formula) | Same HB helper | None; screenshot optional; **Mongo row missing** |
| 93 | Weight Watcher Points | SmartPoints | ACCEPTED_LIMITATION | 2015–2021 coeffs | None |
| 94 | Weight Watchers Points | Same coeffs | ACCEPTED_LIMITATION | Calories-only OK | None; **Mongo row missing** |
| 95 | Benzodiazepine Conversion | Equivalency approx | ACCEPTED_LIMITATION | Not for taper | None |
| 101 | Isotretinoin Dose | Cumulative teaching | ACCEPTED_LIMITATION | vs label course | None |
| 104 | Local Anesthetic | Ropivacaine teaching | ACCEPTED_LIMITATION | Caps documented | None |
| 106 | Medicine 3×/day | Fixed waking window | ACCEPTED_LIMITATION | Clock math teaching | None |
| 108 | Opioid Conversion | Equianalgesic approx | ACCEPTED_LIMITATION | CDC 2022 factors | None |
| 114 | Warfarin Dosing | Nomogram gaps | ACCEPTED_LIMITATION | Incomplete when gaps | None |
| 118 | Absolute Reticulocyte | Hct heuristic | ACCEPTED_LIMITATION | Labeled without RBC | None |
| 127 | Corrected Reticulocyte | Duplicate maturation gate | ACCEPTED_LIMITATION | Harmless duplicate | None |

Temporary files cleaned during investigation: YES.
