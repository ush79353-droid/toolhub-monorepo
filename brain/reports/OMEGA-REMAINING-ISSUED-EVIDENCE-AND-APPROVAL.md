# OMEGA — Remaining Issued Evidence & Approval

**Date:** 2026-11-28  
**Issued count:** **2**  
**Development this mission:** **NONE** for either tool  

---

## 1. Addiction Calculator

| Field | Value |
| --- | --- |
| Packet | `Tools/Issued/Addiction Calculator` |
| Mongo | `6af46f12a27d8d1d4e9902f3` — undeveloped, inactive, empty `componentKey` |
| Prior pack | `OMEGA-ADDICTION-EVIDENCE-PACK-composer-addiction-s8.md` |
| Decision | **`EVIDENCE_INSUFFICIENT_KEEP_ISSUED`** |

### Technical / evidence blocker

Screenshot-driven model needs **substance → minutes lost per dose** constants and a **country life-expectancy** table with vintage. Session 8 showed these are **not independently reproducible** from primary literature alone without inventing Omni-matched defaults.

### Research completed

Scope controls documented; arithmetic outline known; **no authorized coefficient table**.

### What is missing

1. Owner-approved minutes-lost table for each substance option.  
2. Country LE baselines + vintage.  
3. Independent fixtures (US cigarette example, edge cases).  

### Can it be developed safely now?

**NO** — would invent personalized mortality forecasts.

### Approval required

Explicit numerical tables + permission to encode them as educational (non-diagnostic) estimates.

### Next implementation step

After tables arrive: ADR-018 module → registry → `tool:assign` with `--id 6af46f12a27d8d1d4e9902f3` → keep `indexable=false` until SEO review.

---

## 2. Metastatic Prostate Cancer Prognosis Calculator

| Field | Value |
| --- | --- |
| Packet | `Tools/Issued/Metastatic Prostate Cancer Prognosis Calculator` |
| Mongo | `6af46f12a27d8d1d4e9902d7` — undeveloped, inactive, empty `componentKey` |
| Prior pack | `OMEGA-METASTATIC-PROSTATE-CLINICAL-EVIDENCE-PACK-composer-mpc-s9.md` |
| Decision | **`MODEL_APPROVAL_REQUIRED`** + keep Issued |

### Technical / evidence blocker

No complete, published, Omega-approved composite with coefficients, life-table vintage, eligibility rules (title vs “distant metastases = No”), and fixtures. Combining unrelated papers into a new patient-specific model is forbidden.

### Research completed

UI controls inventoried; clinical gate documented; **no MODEL_APPROVAL**.

### What is missing

Exact approved model identity, coefficients, SSA/life-table vintage, validation fixtures, clinical/product-owner sign-off.

### Can it be developed safely now?

**NO**.

### Approval required

Clinical/product-owner approval of one exact model **or** explicit retire instruction.

### Next step

Wait for approval package; only then implement ADR-018 + assign `…02d7`.

---

## Owner-facing (Roman Urdu)

### Addiction Calculator
- **Problem:** Har substance ke liye “minutes lost” aur countries ki life-expectancy numbers abhi proof / approval ke baghair maujood nahi.  
- **Evidence:** Screenshot + Session 8 pack; primary papers se Omni jaisi table reproduce nahi hoti.  
- **Safely develop?** **Nahi** — numbers invent karna forbidden.  
- **Approval?** **Haan** — owner-approved tables + fixtures chahiye.

### Metastatic Prostate Cancer Prognosis
- **Problem:** Poora clinical model + coefficients + approval missing.  
- **Evidence:** Session 9 pack; screenshot results empty.  
- **Safely develop?** **Nahi**.  
- **Approval?** **Haan** — `MODEL_APPROVAL` ya retire decision.
