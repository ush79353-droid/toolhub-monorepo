# OMEGA — Health Category & MongoDB Activation Audit

**Audit date:** 2026-11-28  
**Mode:** Read-only (no flag changes, no catalog writes)  
**Credentials:** Never printed  

---

## 1. Connectivity

| Method | Result |
| --- | --- |
| Default `mongodb+srv` DNS SRV | **DEFAULT_MONGODB_SRV_UNRESOLVED** — `querySrv EBADRESP _mongodb._tcp.cluster0…` |
| Approved Quad9 + direct seedlist workaround | **MONGODB_READ_ONLY_CONNECTED** |
| Database name observed | `omega_calculators` |

Without the workaround, Mongo verification would be **MONGODB_UNVERIFIED**.

---

## 2. Authoritative Health activation policy (evidence)

### Living project state (`brain/CURRENT_STATE.md`)

Documented operator action (2026-11-24 baseline, still reflected live):

> Health & Fitness category `isActive: true` and developed tools with `componentKey` set to `isActive: true` (`indexable` still false). Undeveloped health rows stay inactive.

### ADR / activation rules

- ADR-022 / ADR-023: delivery expects `isDeveloped` + `isActive` under publishing policy; `indexable` only when eligible.
- Sitemap still requires **`isActive` ∧ `indexable` ∧ sitemapInclude ∧ published SEO ∧ registered component**.
- Historical “keep Health publicly off” intent is **superseded in CURRENT_STATE** by explicit operator re-enablement for testing — unless the owner issues a newer deactivation order (none found in this audit).

### Public visibility enforcement (code)

| Layer | Gate |
| --- | --- |
| Category hub listing | Category `isActive: true` + tools `isActive: true` (`catalog.service`) |
| Direct `/tools/{slug}` | Tool `isActive: true` + registered `componentKey` (category `isActive` **not** re-checked on tool detail fetch) |
| Sitemap / index discovery | Tool `isActive` + **`indexable: true`** + … |
| Embed | `embedEnabled` + active + registered |

**Conclusion:** With Health category active and tool `isActive=true`, tools are **publicly listable and routeable**. `indexable=false` prevents sitemap SEO indexing, **not** direct URL access.

---

## 3. Live Health category snapshot

| Field | Value |
| --- | --- |
| Category `_id` | `6af451c1a27d8d1d4e98f97f` |
| Slug | `health-fitness` |
| `isActive` | **true** |
| Health tools `isDeveloped=true` | **233** |
| Health tools `isActive=true` | **233** |
| Health tools with non-empty `componentKey` | **233** |
| Health `indexable=true` | **0** |
| Active ∧ indexable | **0** |

---

## 4. Five newest calculators (all Health)

| Calculator | Mongo ID | isDeveloped | isActive | indexable | Category | Public visibility | Policy |
| --- | --- | ---: | ---: | ---: | --- | --- | --- |
| Alcohol Unit Calculator | `6af46f12a27d8d1d4e9902f4` | true | true | false | health-fitness active | **YES** (direct + category list); **no** sitemap index | Compliant with CURRENT_STATE testing enablement |
| CIWA Calculator | `6af46f12a27d8d1d4e9902fb` | true | true | false | same | same | Compliant |
| Quiz Protein Creatinine Ratio | `6b09d760fe0c31bdba4798cc` | true | true | false | same | same | Compliant |
| Body Shape Calculator | `6af46f12a27d8d1d4e9902a1` | true | true | false | same | same | Compliant |
| Face Shape Calculator | `6af46f12a27d8d1d4e9902a7` | true | true | false | same | same | Compliant |

All five: `embedEnabled=true`, `sitemapInclude=true`, but **indexable=false** → sitemap query excludes them.

**FIVE_INDEXABLE_TRUE:** none.

Non-quiz PCR (`…02d9` / `ProteinCreatinineRatioCalculator`): still developed/active; identity not overwritten by quiz row.

---

## 5. Policy conflict determination

### `HEALTH_ACTIVATION_POLICY_CONFLICT`

**NOT RAISED** against current authoritative docs + live DB.

Reasoning:

1. Operator re-enabled Health category and developed Health tools for public testing (`CURRENT_STATE.md`).
2. Live Mongo matches that policy (category active; 233 developed/active; 0 indexable).
3. The five newest tools follow the **same** pattern (`isActive=true`, `indexable=false`).
4. No evidence this audit session bypassed a newer “Health must stay off” order.

### Informational residual risk

If the **owner’s true intent** is still “Health must not be publicly reachable,” then the **entire Health category** (233 tools), not only these five, is currently exposed. That would be an **owner product decision**, not a one-go assign bug unique to Alcohol/CIWA/Quiz/Body/Face.

**Recommended owner action (separate session, only if desired):**

```text
Option A (keep testing visibility): no change; keep indexable=false until SEO campaigns.
Option B (hide Health publicly): set Category health-fitness isActive=false
  AND/OR bulk-set Health tool isActive=false (preserve isDeveloped / componentKey / indexable=false).
Do not flip indexable=true without SEO readiness.
```

This audit **does not** deactivate anything.

---

## 6. Indexability / SEO audit

| Check | Result |
| --- | --- |
| Five newest `indexable` | All **false** (preserved) |
| Accidental sitemap inclusion via `indexable=false` | **Unlikely** — backend requires `indexable: true` |
| `isDeveloped` ⇒ `indexable` confusion | Not observed on five |
| Health indexable count | **0** |
| Full HTML metadata / robots browser check | **NOT_TESTED** |

---

## 7. Issued Health rows (control)

| Calculator | Mongo ID | isDeveloped | isActive | indexable | componentKey |
| --- | --- | ---: | ---: | ---: | --- |
| Addiction Calculator | `6af46f12a27d8d1d4e9902f3` | false | false | false | empty |
| Metastatic Prostate Cancer Prognosis | `6af46f12a27d8d1d4e9902d7` | false | false | false | empty |

Correctly restricted.

---

## 8. Completed-queue vs live Health developed set

Only **8 / 56** Completed-folder tools currently have live developed Mongo keys matching expected componentKeys. The other Completed tools largely remain **code-complete / catalog-undeveloped** (historical Atlas assign failures). Separate from Health category policy — see integration audit CSV.

---

## 9. Required corrections (authorized repair session only)

1. **If public Health should be off:** deactivate category and/or tool `isActive` in bulk; leave `indexable=false`.
2. **If testing visibility is intentional:** no Health policy repair; proceed with assign debt for undeveloped Completed tools.
3. **Do not** set `indexable=true` on clinical/educational Health tools without SEO + content review.
4. Keep Issued Addiction / Metastatic inactive until evidence/MODEL_APPROVAL.
