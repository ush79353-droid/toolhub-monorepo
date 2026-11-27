# Metastatic Prostate Cancer Prognosis Calculator — Clinical Evidence Pack (Session 9)

**Date:** 2026-11-27  
**Agent:** `cursor-agent-pending-composer-mpc-s9`  
**Session:** `sess-mpc-20261127-2351`  
**Slug (expected):** `metastatic-prostate-cancer-prognosis-calculator`  
**Historical Mongo hint:** `6af46f12a27d8d1d4e9902d7`  
**Queue:** Remains in `Tools/Issued/Metastatic Prostate Cancer Prognosis Calculator`  
**Development:** NONE (no UI / engine / registry / Mongo activation)  
**Local commits:** none  
**GitHub sync:** NONE  

---

## Decision

**`EVIDENCE_INSUFFICIENT_KEEP_ISSUED`** + **`MODEL_APPROVAL_REQUIRED`**

Do **not** implement a patient-facing life-expectancy / survival engine.  
Do **not** combine Zhang + Huncharek + Albertsen + Preston + SSA into a new personalized prognosis model.  
Do **not** treat Omni’s screenshot or secondary web clones as approval of an invented equation.  
Do **not** mark the tool developed or activate Mongo.

A complete, published, source-approved composite calculator methodology with coefficients, life-table vintage, independent fixtures, and Omega clinical/product-owner approval **does not exist** for this task as of this session.

---

## 1. Screenshot / prompt scope (verified)

Source: `Tools/Issued/Metastatic Prostate Cancer Prognosis Calculator/Screenshot 2026-11-25 001400.png` (Omni, dated 2025-10-03 on page chrome).

| Control | Observed |
| --- | --- |
| Age | blank, years |
| Height | blank, unit menu **cm** |
| Weight | blank, unit menu **kg** |
| Gleason score | dropdown; default **2–4** |
| Distant metastases? | **No** selected / Yes |
| Health level | Very good (>75%) / **Moderate (25–75%)** selected / Very bad (<25%) |
| Are you a smoker? | **No** selected / Yes |
| Results | **Not populated** in screenshot |
| Disclaimers | Population-statistics estimate only; cannot replace physician assessment |
| FX | None |

**Title vs eligibility conflict:** Title is “Metastatic…”, but the UI defaults distant metastases to **No** and accepts non-metastatic cases. Any Omega implementation must resolve whether metastatic disease is mandatory or optional before coding.

No `frontend/src/tools/calculators/**` module for this tool exists.

---

## 2. Phase-2 checklist answers

| # | Question | Finding |
| --- | --- | --- |
| 1 | Intended patient population | Omni text: men with prostate-cancer diagnosis; Albertsen source cohort is **clinically localized**, conservatively managed men aged **55–74**, diagnosed **1971–1984** (Connecticut). Not a modern metastatic mCRPC / mHSPC trial population. |
| 2 | Metastatic disease mandatory? | **No** in Omni UI (default No). Title implies metastatic focus. **Unresolved for Omega.** |
| 3 | Disease stage definitions | Omni article discusses TNM T1–T4 and cites ~**31%** 5-year survival for distant disease (ACS-style population figure). Calculator itself uses a binary distant-mets flag, not full TNM. |
| 4 | Treatment context | Albertsen = observation / androgen withdrawal only. Omni composite does **not** specify ADT, chemo, ARPI, radiation, or modern systemic therapy. |
| 5 | Prognostic endpoint | Omni marketing: life expectancy + mortality risk. Primary papers: prostate-cancer–specific mortality rates (Albertsen), RRs for fatal PCa (Huncharek, Zhang), population LE effects of obesity (Preston). |
| 6 | Prediction time horizon | Not locked. Omni article cites 5/10/15-year population survivals; Albertsen reports ~20-year competing-risk outcomes. Exact LE integration horizon **unpublished** on Omni. |
| 7 | Required variables | Age, height, weight (→ BMI), Gleason band, distant mets Y/N, self-rated health tertile, smoker Y/N. |
| 8 | Published coefficients | **Partial only** (see §3). Health multipliers and mets multiplier **not** published by Omni. |
| 9 | Baseline hazard / survival | Omni says SSA Actuarial Life Tables modify outcomes — **vintage, sex table, and exact hazard merge unpublished**. |
| 10 | Life-table version | **Unknown.** Secondary clones claim “SSA 2020 male”; Omni does not state year. |
| 11 | Source validation | Individual papers validated in their own domains. **No external validation of Omni’s composite calculator** found. Secondary clones are not independent validation. |
| 12 | Limitations / exclusions | Pre-PSA-era localized cohort rates; no ethnicity/treatment/response variables; self-rated health is subjective; combining independent RRs risks double-counting; metastatic extrapolation from localized mortality rates is scientifically unsupported without a validated stage multiplier. |

---

## 3. Full publication references (investigated)

### 3.1 Cited by Omni (confirmed on live page)

1. **Zhang X, Zhou G, Sun B, Zhao G, Liu D, Sun J, Liu C, Guo H.** Impact of obesity upon prostate cancer-associated mortality: A meta-analysis of 17 cohort studies. *Oncology Letters*. 2015;9(3):1307–1312. PMID 25663903; PMC4315023. DOI 10.3892/ol.2014.2841.  
   - Obesity vs aggressive PCa RR **1.14** (95% CI 1.04–1.25).  
   - Obesity vs PCa-associated mortality RR **1.24** (95% CI 1.15–2.33).  
   - **Does not** provide a personalized LE equation, Gleason table, mets factor, or SSA merge.

2. **Huncharek M, Haddock KS, Reid R, Kupelnick B.** Smoking as a risk factor for prostate cancer: a meta-analysis of 24 prospective cohort studies. *Am J Public Health*. 2010;100(4):693–701. PMID 19608952. DOI 10.2105/AJPH.2008.150508.  
   - Current smokers, fatal PCa (heterogeneity-adjusted pool): RR **1.14** (95% CI 1.06–1.19).  
   - Heavier smokers ~24–30% higher fatal-PCa risk in dose analyses.  
   - **Does not** publish a calculator integration rule.

3. **Albertsen PC, Hanley JA, Fine J.** 20-year outcomes following conservative management of clinically localized prostate cancer. *JAMA*. 2005;293(17):2095–2101. PMID 15870412. DOI 10.1001/jama.293.17.2095.  
   - Population: clinically **localized** PCa; observation or androgen withdrawal; ages 55–74; diagnosis years 1971–1984.  
   - Unadjusted PCa death rates per **1000 person-years** (Table 3) match Omni’s published Gleason table exactly:

   | Gleason | Deaths / 1000 PY (95% CI) |
   | --- | --- |
   | 2–4 | **6** (2–11) |
   | 5 | **12** (6–19) |
   | 6 | **30** (23–37) |
   | 7 | **65** (49–83) |
   | 8–10 | **121** (90–156) |

   - **Not** a metastatic-disease prognosis model. Applying these rates to distant metastatic disease without a validated stage adjustment invents clinical risk.

4. **Preston SH, Stokes A.** Contribution of obesity to international differences in life expectancy. *Am J Public Health*. 2011;101(11):2137–2143.  
   - Omni narrative: obesity “steals” on average **1.85 years** from obese Americans.  
   - Population LE attribution study — **not** a PCa-specific calculator coefficient sheet.

5. **U.S. Social Security Administration Actuarial Life Tables** (cited generically by Omni).  
   - Exact period table, sex, and age-specific qₓ series used by Omni: **not published** on the calculator methodology page.

### 3.2 Related but distinct published methods (not Omni’s composite)

| Method | What it is | Why it is not a drop-in |
| --- | --- | --- |
| **NCCN life-expectancy rule of thumb** | SSA LE ±50% for top/bottom health quartile; middle quartiles unchanged | Health adjustment differs from clone mortality multipliers 0.85/1.00/1.50; not a Gleason/mets/BMI/smoke composite |
| **Roswell Park / Kim et al. JNCCN-style counseling tools** | Uses Albertsen competing-risk context + actuarial LE for **localized** counseling | Different product; not Omni’s RR composite; not metastatic-first |
| **ACS distant-stage 5-year relative survival (~31%)** | Population SEER-style stage statistic | Single population percentage — not individualized LE from age/BMI/Gleason/smoke/health |

---

## 4. What Omni publishes vs what is missing

### Published on Omni methodology page (usable as *citations*, not as a complete engine)

- Albertsen Gleason mortality rates /1000 PY (table above).  
- Zhang obesity PCa-mortality RR **1.24** and aggressive-PCa RR **1.14**.  
- Huncharek smoking fatal-PCa RR **1.14**.  
- Narrative Preston obesity LE loss (~1.85 y).  
- Mention that SSA life tables are used.  
- Binary distant-mets input and three-level health input exist in UI.

### Missing for a reproducible, approvable engine

| Piece | Status |
| --- | --- |
| Exact equation combining baseline SSA hazard + cancer hazard | **Missing** |
| Whether cancer mortality is added, competing-risks, or multiplicative | **Missing** |
| Distant-metastases numeric multiplier / hazard model | **Missing on Omni**; secondary clones invent **×2** |
| Health-level numeric multipliers | **Missing on Omni**; secondary clones invent **0.85 / 1.00 / 1.50** on baseline mortality |
| Whether BMI uses Zhang RR on cancer hazard, Preston years subtracted, both, or threshold BMI≥30 only | **Ambiguous** |
| SSA table vintage / male-only confirmation / terminal age | **Missing** (clones claim 2020) |
| Age eligibility bounds (Albertsen 55–74 vs open age field) | **Unresolved** |
| Independent numerical fixtures from Omni (age/BMI/Gleason/mets/health/smoke → LE, 5y, 10y) | **Missing** |
| External validation of the composite | **None found** |
| Omega clinical / product-owner approval for exact model + presentation | **Absent** |

---

## 5. Secondary clones — do not treat as source of truth

Public clone writeups (e.g. best-calculators.com style) state formulas such as:

```text
adjustedAnnualMortality =
  baselineMortality(age) * healthMultiplier
  + cancerMortality(gleason) * metsMultiplier * smokerMultiplier * bmiMultiplier
```

with claims:

- SSA **2020** male table  
- mets multiplier **2**  
- health **0.85 / 1.00 / 1.50**  
- smoking **1.14**  
- BMI≥30 uses Zhang-style RR  
- integrate survival to age 110  

**Problems:**

1. These integration constants are **not** published on Omni’s methodology page.  
2. Some clones **merge Gleason 5–6** contrary to Albertsen/Omni’s separate 5 vs 6 rates.  
3. Multiplying localized Albertsen rates by an arbitrary mets×2 is **not** a validated metastatic model.  
4. NCCN’s published health rule is **±50% life expectancy**, not 0.85/1.50 mortality scaling — clones are not “NCCN official.”  
5. Example clone fixture (age 70, BMI 24, Gleason 8–10, mets yes, average health, non-smoker → LE 4.4 y, 5y 35.6%) is **unverified against Omni** and must not be used as Omega gold without owner confirmation.

Shipping a clone equation would invent clinical prognosis numbers → forbidden by Session 9 clinical safety gate + ADR-023 prompt rules.

---

## 6. Input → model variable mapping (aspirational only)

| Screenshot input | Candidate mapping | Source status |
| --- | --- | --- |
| Age (years) | Index into SSA male qₓ / LE | Table vintage missing |
| Height, weight | BMI = kg / m²; obesity often BMI ≥ 30 | Zhang RR published; application rule missing |
| Gleason band | Cancer mortality /1000 PY | Albertsen/Omni table published |
| Distant metastases | Unknown hazard adjustment | **Not published** |
| Health level tertile | Unknown baseline or LE adjustment | **Not published** (NCCN ±50% LE is a different model) |
| Smoker | Fatal-PCa RR 1.14 if applied to cancer hazard | Huncharek RR published; application rule missing |

---

## 7. Independent example fixtures

**None authorized.**

Required before implementation:

1. Owner-approved Omni (or primary-paper) input→output pairs covering metastatic and non-metastatic cases.  
2. Boundary ages, BMI≥30 vs <30, each Gleason band, smoker Y/N, each health tertile.  
3. Explicit unavailable / out-of-population states (e.g. age outside Albertsen cohort if that restriction is adopted).

Until then, no `calculation.test.ts` goldens may be invented.

---

## 8. External validation status

| Layer | Status |
| --- | --- |
| Albertsen localized competing-risk rates | Published primary cohort |
| Zhang / Huncharek meta-analytic RRs | Published |
| Preston obesity LE attribution | Published (population) |
| Omni composite calculator | **Proprietary / incompletely documented** |
| Clone implementations | **Unauthorized reconstructions** |
| Prospective external validation of Omni composite | **Not found** |
| Omega clinical sign-off | **Not granted** |

---

## 9. Known limitations (if any educational tool is ever approved later)

- Albertsen rates come from a pre-PSA, localized, conservatively managed cohort — poor transportability to contemporary metastatic patients on modern systemic therapy.  
- Self-rated health is subjective and not a comorbidity index (Charlson, CCI, etc.).  
- Independent RRs multiplied together without joint modeling can double-count correlated risks.  
- Population ACS 31% 5-year distant survival is not an individualized prediction.  
- Strong, persistent non-diagnostic disclaimer would still be mandatory; tool must never present as a clinical prognosis for treatment decisions.

---

## 10. Mongo / catalog identity (this session)

| Check | Result |
| --- | --- |
| Live Mongo probe | **FAILED** — Atlas `querySrv EBADRESP _mongodb._tcp.cluster0.pa6smuw.mongodb.net` |
| Historical hint | `6af46f12a27d8d1d4e9902d7` (prior Session-1 live verify: unique undeveloped row, empty `componentKey`, `isDeveloped/isActive/indexable` false) |
| This-session re-verify | **Not possible** (DNS/SRV) |
| Activation | **Not attempted** (correct — model unapproved) |

---

## 11. Required approval before any implementation

Product owner / clinical reviewer must approve **in writing**, for Omega specifically:

1. Exact model identity (Omni reverse-engineered composite **vs** Albertsen+NCCN LE only **vs** refuse tool **vs** other named instrument).  
2. Whether non-metastatic inputs are in scope despite the title.  
3. Full coefficient sheet: Gleason rates, mets factor, health factors, BMI rule, smoking rule, SSA vintage file.  
4. Competing-risk / hazard merge equation.  
5. Age and population eligibility + unavailable states.  
6. Independent fixture table.  
7. Patient-facing wording (estimate-only; not treatment advice).  
8. Confirmation that screenshot blank results do **not** authorize inventing numbers.

Screenshot presence ≠ clinical approval.

---

## 12. Recommended next action

1. Keep task in **Issued**.  
2. Deliver this evidence pack to clinical/product owner.  
3. Prefer one of:  
   - **A.** Obtain Omni’s unpublished full method + fixtures + license/approval; or  
   - **B.** Select a single published instrument (e.g. educational presentation of Albertsen rates + SSA LE **without** inventing mets/health RR composite) and approve that narrower scope explicitly; or  
   - **C.** Retire / do not build this calculator on Omega.  
4. Re-verify Mongo `_id` when Atlas DNS works; do not activate until model+approval exist.  
5. Only then allow UI → engine → registration commits (ADR-019) under isolated worktree.

---

## 13. Session worklog

| Item | Status |
| --- | --- |
| Read prompt, screenshot, ISSUE_REASON, prior brain reports | Done |
| Claim exclusive investigation lock | Done → released RELEASED_ISSUED |
| Omni methodology page | Reviewed |
| Albertsen / Zhang / Huncharek / Preston / SSA leads | Reviewed |
| Secondary clones | Reviewed and rejected as authority |
| Frontend module search | Absent |
| Mongo live verify | Blocked (EBADRESP) |
| Calculator code | **None written** |
| Activation | **None** |
| Local commits / GitHub sync | **None** |

**Temporary files cleaned:** YES (outside-repo Mongo probe script removed; no in-repo temps created for coding).
