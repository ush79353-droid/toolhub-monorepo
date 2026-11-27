# OMEGA ONE-GO — Final 7 Calculators Development Report

**Agent:** `cursor-agent-onego-final7-20261128`  
**Session:** `sess-onego-final7-20261128`  
**Credits:** `CREDITS_NOT_VERIFIABLE`  
**Branch / HEAD:** `development` @ `3de606f8`  
**GitHub sync:** **NOT PERFORMED**  

---

## A. Executive summary

| Metric | Count |
| --- | ---: |
| Target remaining calculators | **7** |
| Newly fully completed this session | **5** |
| Still blocked (correctly) | **2** |
| Already-developed duplicates (prior) | **3** (unchanged) |
| Session capacity | Continued through all actionable work |

**Completed now:** Alcohol Unit, CIWA, Quiz PCR, Body Shape, Face Shape.  
**Still Issued:** Addiction, Metastatic Prostate Cancer Prognosis (evidence/clinical gates).

---

## B. Individual results

### 1. Alcohol Unit Calculator — COMPLETED
| Field | Value |
| --- | --- |
| Mongo `_id` | `6af46f12a27d8d1d4e9902f4` |
| Slug | `alcohol-unit-calculator` |
| componentKey | `AlcoholUnitCalculator` |
| Work | Cherry-picked worker UI/engine; registry; assign `--set-active`; `indexable` false |
| Formula | UK units = mL×ABV%/1000; fixture 500×5→2.5 verified |
| Commits | UI `bfebd7c4` · ENG `56da0612` · INT `e014d551` |
| Folder | `Tools/Completed/Alcohol Unit Calculator` |

### 2. CIWA Calculator — COMPLETED
| Field | Value |
| --- | --- |
| Mongo `_id` | `6af46f12a27d8d1d4e9902fb` |
| Slug | `ciwa-calculator` |
| componentKey | `CiwaCalculator` |
| Work | Cherry-pick; registry; assign; 10-item CIWA-Ar max 67 |
| Commits | UI `8b5c5645` · ENG `62ac50d6` · INT `d2d8f1d0` |
| Folder | `Tools/Completed/CIWA Calculator` |

### 3. Quiz Protein Creatinine Ratio — COMPLETED
| Field | Value |
| --- | --- |
| Mongo `_id` | **`6b09d760fe0c31bdba4798cc`** (created this session under owner one-go authorization) |
| Slug | `quiz-protein-creatinine-ratio-calculator` |
| componentKey | `QuizProteinCreatinineRatioCalculator` |
| Work | Catalog create (unique; non-quiz PCR `…02d9` protected); cherry-pick; registry; assign |
| Commits | UI `7ec00f04` · ENG `ad496d89` · INT `cc96ae79` |
| Folder | `Tools/Completed/Quiz Protein Creatinine Ratio Calculator` |

### 4. Body Shape Calculator — COMPLETED
| Field | Value |
| --- | --- |
| Mongo `_id` | `6af46f12a27d8d1d4e9902a1` |
| Slug | `body-shape-calculator` |
| componentKey | `BodyShapeCalculator` |
| Method | Lee/FFIT via Body Type reuse (**owner one-go authorization**); **disclosed non-Omni parity** |
| Commits | UI `18e9c4fa` · ENG `e437bb81` · INT `3de606f8` (shared with Face) |
| Folder | `Tools/Completed/Body Shape Calculator` |

### 5. Face Shape Calculator — COMPLETED
| Field | Value |
| --- | --- |
| Mongo `_id` | `6af46f12a27d8d1d4e9902a7` |
| Slug | `face-shape-calculator` |
| componentKey | `FaceShapeCalculator` |
| Method | **Omega-defined aesthetic heuristic** (owner one-go authorization); not Omni/clinical |
| Commits | UI `72c1a7f0` · ENG `94b1d86e` · INT `3de606f8` |
| Folder | `Tools/Completed/Face Shape Calculator` |

### 6. Addiction Calculator — STILL ISSUED
| Field | Value |
| --- | --- |
| Mongo `_id` | `6af46f12a27d8d1d4e9902f3` undeveloped |
| Blocker | Non-reproducible per-dose LE constants (Session 8 pack) |
| Development | None — inventing mortality forecasts forbidden |
| Folder | `Tools/Issued/Addiction Calculator` |

### 7. Metastatic Prostate Cancer Prognosis — STILL ISSUED
| Field | Value |
| --- | --- |
| Mongo `_id` | `6af46f12a27d8d1d4e9902d7` undeveloped |
| Blocker | Incomplete clinical model + MODEL_APPROVAL (Session 9 pack) |
| Development | None — inventing prognosis forbidden |
| Folder | `Tools/Issued/Metastatic Prostate Cancer Prognosis Calculator` |

---

## C. Local Git

| Item | Value |
| --- | --- |
| Branch | `development` |
| HEAD | `3de606f8` |
| Worker branches preserved | alcohol / ciwa / quiz-pcr worktrees still present |
| GitHub | NOT PERFORMED |

---

## D. MongoDB

| Item | Detail |
| --- | --- |
| Connectivity | Direct seedlist workaround (default SRV still EBADRESP) |
| Assignments | Alcohol, CIWA, Quiz, Body Shape, Face Shape — all `isDeveloped=true`, `isActive=true`, **`indexable=false`** |
| Quiz create | One new row `6b09d760fe0c31bdba4798cc` only |
| Non-quiz PCR | Untouched `…02d9` |

---

## E. Website quality

| Check | Result |
| --- | --- |
| Registry keys/index/details/tool.key | Updated for 5 new keys |
| Focused calculation tests | alcohol / ciwa / quiz / body-shape / face-shape → **ok** |
| Full build / lint / browser | **NOT RUN** — runtime UNVERIFIED |
| Broken partial registries | Avoided |

---

## F. Final queue (rescanned)

| Folder | Count |
| --- | ---: |
| Pending | **0** |
| Progress | **0** |
| Completed | **56** |
| Issued | **2** |

Baseline was Completed 51 / Issued 4 / Progress 3. Delta: +5 Completed, −3 Progress, −2 Issued (Body+Face), Addiction+Metastatic remain.

Ideal “Issued 0 / Completed 58” **not** claimed — two genuine blockers remain.

---

## G. Remaining Issued (Roman Urdu)

### Addiction Calculator
1. **Problem:** Substance minutes-lost / country LE data primary sources se reproduce nahi hoti.  
2. **Development:** Is session mein nahi — safely blocked.  
3. **Missing:** Authorized evidence tables.  
4. **User:** Life-lost + LE vintage approve/provide karein.  
5. **Next:** Evidence ke baad ADR-018 develop + assign.

### Metastatic Prostate Cancer Prognosis
1. **Problem:** Complete validated clinical model + approval missing.  
2. **Development:** Nahi — clinical safety gate.  
3. **Missing:** Coefficients/SSA/fixtures + MODEL_APPROVAL.  
4. **User:** Exact model approve karein ya tool retire.  
5. **Next:** Approval ke baad hi engine.

---

## Ten original identities (accountability)

| # | Calculator | Final |
| ---: | --- | --- |
| 1 | Addiction | Issued (blocked) |
| 2 | Adrenal Washout | Completed (prior reconcile) |
| 3 | Albumin ACR | Completed (prior) |
| 4 | Alcohol Unit | **Completed this session** |
| 5 | Body Shape | **Completed this session** |
| 6 | BUN | Completed (prior) |
| 7 | CIWA | **Completed this session** |
| 8 | Face Shape | **Completed this session** |
| 9 | Metastatic Prostate | Issued (blocked) |
| 10 | Quiz PCR | **Completed this session** |

**Temporary files cleaned:** YES  
**GitHub sync:** NOT PERFORMED
