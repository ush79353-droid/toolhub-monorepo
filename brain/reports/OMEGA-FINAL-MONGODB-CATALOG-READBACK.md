# OMEGA — Final MongoDB Catalog Readback

**Date:** 2026-11-28  
**Mode:** Read-only verification after Quiz FFMI create + assign  
**Credentials:** Never printed  

---

## Connectivity

| Method | Result |
| --- | --- |
| Default `mongodb+srv` SRV | `querySrv EBADRESP` |
| Direct seedlist via Quad9 / app fallback | **Connected** → `omega_calculators` |

---

## Quiz FFMI (new)

| Field | Value |
| --- | --- |
| `_id` | `6b09e0f92c40547bdc543c2e` |
| name | Quiz FFMI Calculator (Fat-Free Mass Index) |
| slug | `quiz-ffmi-calculator-fat-free-mass-index` |
| componentKey | `QuizFfmiCalculator` |
| category | health-fitness (`6af451c1a27d8d1d4e98f97f`) |
| pillar / subpillar | null / null |
| isDeveloped | **true** |
| isActive | **true** |
| indexable | **false** |
| embedEnabled | true |

---

## Ordinary FFMI (must stay distinct)

| Field | Value |
| --- | --- |
| `_id` | `6af46f12a27d8d1d4e9902a8` |
| slug | `ffmi-calculator-fat-free-mass-index` |
| componentKey | `FfmiCalculator` |
| isDeveloped / isActive / indexable | true / true / **false** |

**Not reused** for Quiz FFMI.

---

## Health category

| Field | Value |
| --- | --- |
| slug | `health-fitness` |
| isActive | **true** (public testing policy) |

Completed-set `indexable=true` count: **0**.

---

## Issued controls

| Slug | isDeveloped | isActive | componentKey |
| --- | ---: | ---: | --- |
| addiction-calculator | false | false | empty |
| metastatic-prostate-cancer-prognosis-calculator | false | false | empty |

---

## Inconsistencies

None material for the 56 Completed identities after Quiz FFMI finalization. Static registry + Mongo assign alignment: **56/56**.
