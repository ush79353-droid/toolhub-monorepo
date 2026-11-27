# Face Shape Calculator — Model Approval Pack (Session 7)

**Date:** 2026-11-27  
**Agent:** cursor-agent-pending-composer-face-shape-s7  
**Slug (expected):** `face-shape-calculator`  
**Queue:** Remains in `Tools/Issued/Face Shape Calculator`  
**Development:** NONE  
**Local commits:** none  
**GitHub sync:** NONE  

---

## Decision

**`MODEL_APPROVAL_REQUIRED`**

- Not `VERIFIED_SOURCE_RULES` — Omni publishes qualitative rules only; no numeric table, tolerances, ordered decision tree, or jawline-length→width mapping.
- Not `APPROVED_OMEGA_HEURISTIC` — no owner-approved Omega rule pack exists yet.
- Aesthetic classification only — not a clinical measurement.

---

## 1. Screenshot / prompt requirements (verified)

| Control | Observed |
| --- | --- |
| Sex | Optional Female / Male, **unselected** by default |
| Diagram | Forehead width, Cheeks width, Face length, Jawline length landmarks |
| Forehead width | blank, unit **cm** (live Omni also offers **in**) |
| Cheeks width | blank, cm |
| Jawline length | blank, cm — **chin → outer edge of ear** (length along jaw, not biponial jaw width) |
| Face length | blank, cm — hairline → chin tip |
| Feature sharpness | Sharp / **Somewhat (default selected)** / Round |
| Result panel | Live text when inputs complete; sex reminder remains until sex chosen |
| Actions | Share / Reload / Clear |
| FX | None |

Seven categories named by Omni: **oval, round, oblong (rectangular), square, triangle, diamond, heart**.

No in-repo `face-shape` module. Catalog name exists in `backend/data/tools-catalog.json` (Health & Fitness; pillar/subpillar null). Live Mongo `_id` unverified this session.

---

## 2. Source methodology research

### Omni (reference)
- Qualitative shape descriptions + “general rules” using words like *longer than wide*, *roughly the same*, *about as broad*, *narrow*, *sharp*.
- **No** published numeric thresholds, tie order, or sex-threshold effects.
- Sex: optional; “will personalize some aspects of your result” — wording implies copy/tips more than a proven separate classifier (unverified).
- Sharpness: used in diamond prose (“features are sharp”) and round vs square contrast; exact numeric effect unpublished.
- **Critical gap:** prose compares **jaw width** to forehead/cheeks, but the only jaw **input** is **jawline length** (chin→ear). Mapping from length to “wide/narrow jaw” is proprietary and unpublished.

### Live Omni probe (2026-11-27)
| Forehead | Cheeks | Jawline length | Face length | Sharpness | Omni live |
| --- | ---: | ---: | ---: | --- | --- |
| 13.5 cm | 13.5 cm | 11.5 cm | 19.5 cm | Somewhat | **“You have a heart-shaped face.”** |

Sex left unselected; reminder still shown under result → classification can run without sex.

### Third-party clones (NOT authoritative)
| Source | Notes | Same fixture 13.5/13.5/11.5/19.5 |
| --- | --- | --- |
| ShortCalc | Publishes own 3%/5%/15%/1.45 table; uses jawline length as if width-comparable | Claims **Oval** |
| CleverCalculator | Uses **jaw width**; R_L 1.30–1.55 etc. | Different measurement definition |
| us-calculator.com | Admits cutoffs are “our own choice” | Different |
| 123calculus | Jaw **width**; oval “40–60% longer” | Different |
| goldenratioface | Own overlapping ranges + jaw outline | Different |

**Conclusion:** Clone numeric tables disagree with each other and with Omni live on a shared-looking fixture. Do **not** ship any clone table as “Omni rules.”

---

## 3. Exact measurement definitions (for any future Omega build)

Use Omni landmarks (educational styling tool):

1. **Forehead width** — widest forehead, typically halfway hairline→brows.  
2. **Cheeks width** — outer corner of eye to outer corner (cheekbones).  
3. **Jawline length** — chin tip along jaw to outer edge of ear (**not** ear-to-ear jaw width unless owner redefines).  
4. **Face length** — hairline center → chin tip.  
5. **Feature sharpness** — Sharp | Somewhat | Round (default Somewhat).  
6. **Sex** — optional Female | Male | unset.

Units: start **cm**; support **in** with physical-value-preserving conversion. No currency FX.

---

## 4. PROPOSED Omega heuristic (DRAFT — NOT APPROVED)

> Label clearly as **Omega-defined aesthetic heuristic**, never as “exact Omni model,” unless Option B provides Omni extract.

### Open design choices (must be decided by owner)

**Q1.** How is jawline **length** compared to forehead/cheek **widths**?  
- (a) Treat length as a proxy width (ShortCalc-style) — geometrically weak.  
- (b) Require a fifth **jaw width** input (angle-to-angle) — changes screenshot scope.  
- (c) Derive proxy `jawWidth ≈ k × jawlineLength` with owner-approved `k`.  
- (d) Owner provides Omni extract.

**Q2.** Sex: copy-only personalization vs threshold shifts? If shifts, what deltas?

**Q3.** Sharpness: only Round↔Square / Oblong↔Oval / Diamond gate, or score modifier?

**Q4.** Tolerances for “equal / about / roughly”: 3%, 5%, 8%, 10%, 15%?

### Illustrative candidate only (requires explicit approval; mirrors ShortCalc structure but **fails Omni live** on the probe)

Ordered first-match draft (ratios unitless; `F,C,J,L` = forehead, cheeks, jawline length, face length; `S` = sharpness):

1. Heart: `F > C×1.03` ∧ `J < C×0.95`  
2. Diamond: `C > F×1.03` ∧ `C > J×1.03` ∧ (`S=Sharp` or `S=Somewhat`)  
3. Triangle: `J > F×1.03` ∧ `J > C×0.98`  
4. Oblong: `L > C×1.45`  
5. Square/Round: `|L−C| ≤ 0.15×C` → Square if Sharp else Round  
6. Oval: else  

**Known failure vs Omni:** same numbers → ShortCalc Oval, **Omni Heart**. This draft is **rejected for silent shipping**.

### Example matrix for owner verification (fill expected Omni / Omega columns)

| ID | F | C | J | L | S | Sex | Expected Omni | Expected Omega |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| E1 | 13.5 | 13.5 | 11.5 | 19.5 | Somewhat | unset | **heart** (observed) | ? |
| E2 | equal widths, L≈C | … | … | … | Round | unset | ? | ? |
| E3 | equal widths, L≈C | … | … | … | Sharp | unset | ? | ? |
| E4 | long face, F≈J | … | … | … | Somewhat | Female | ? | ? |
| E5 | C widest, F&J narrow | … | … | … | Sharp | Male | ? | ? |
| E6 | J dominant | … | … | … | Somewhat | unset | ? | ? |

---

## 5. Known limitations

- No standardized clinical face-shape instrument.  
- Home tape error ~2–5 mm can flip categories.  
- Jawline length ≠ jaw width.  
- Overlapping shapes and subjectivity (Omni acknowledges disagreement is fine).  
- Sex effect unpublished.  
- Mongo live identity still needed before activation.

---

## 6. Owner decision required

Reply with one of:

**A.** Approve a fully specified Omega heuristic (answer Q1–Q4 + fill example expected column).  
**B.** Attach Omni-equivalent numeric extract / observed fixture pack that reproduces live Omni.  
**C.** Defer — keep Issued.

Until A or B: **no module, no commits, do not mark Completed.**

---

## 7. Next exact development action

1. Wait for A/B/C.  
2. If authorized: claim → Progress → worktree → UI then engine commits → hand registries to integrator; Mongo assign when DNS/`_id` verified.  
3. If C: leave Issued.

Temporary files cleaned: YES  
