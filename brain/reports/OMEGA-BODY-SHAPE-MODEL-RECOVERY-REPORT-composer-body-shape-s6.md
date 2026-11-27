# Body Shape Calculator — Model Recovery Report (Session 6)

**Date:** 2026-11-27  
**Agent:** cursor-agent-pending-composer-body-shape-s6  
**Slug (expected):** `body-shape-calculator`  
**Queue:** Remains in `Tools/Issued/Body Shape Calculator`  
**Development:** NONE (model not authorized)  
**Local commits:** none  
**GitHub sync:** NONE  

---

## Decision

**`DIFFERENT_RULES_REQUIRE_OWNER_APPROVAL`**

Secondary label: Omni live thresholds remain **unpublished**; Lee/calculator.net table is published and already implemented by Body Type, but **live Omni parity failed** on at least one fixture. Do **not** silently reuse Body Type.

---

## 1. Screenshot / prompt requirements

| Item | Observed |
| --- | --- |
| Inputs | Bust, Waist, High hip, Hips (blank; unit dropdown starts at **cm**) |
| Units on Omni live | cm default; also mm, m, in, ft, ft/in, m/cm (Body Type in-repo: **cm\|in** only) |
| Categories | Seven: Hourglass, Top hourglass, Bottom hourglass, Spoon, Triangle, Inverted triangle, Rectangle |
| UX | Live result text `Body shape is …`; bikini calculator link; Share / Reload / Clear; feedback |
| FX | None |
| Source cited by Omni | Lee, Istook, Nam & Park (2007) — sole listed source |

Prompt forbids inventing an Omni-proprietary table and requires comparison vs Body Type before sharing helpers.

---

## 2. Original-source research

### Omni article
- Qualitative seven-shape descriptions + measurement definitions (high hip = upper swell over pelvic bone).
- FAQ inch heuristics (rectangle waist &lt; 9" smaller than hip/bust; spoon hips ≥2" over bust; inverted triangle bust ≥3" over hips; hourglass ~equal hip/bust + narrow waist).
- **Does not publish** the full numeric decision table, tie order, or high-hip cutoff.

### Published Lee / FFIT table (inches)
From Lee et al. 2007 as reproduced by calculator.net and Sokolowski & Bettencourt (2020) Table 7:

| Order | Shape | Rule |
| --- | --- | --- |
| 1 | Hourglass | (bust−hip)≤1 ∧ (hip−bust)&lt;3.6 ∧ ((bust−waist)≥9 ∨ (hip−waist)≥10) |
| 2 | Bottom hourglass | 3.6≤(hip−bust)&lt;10 ∧ (hip−waist)≥9 ∧ (high hip/waist)&lt;**1.193** |
| 3 | Top hourglass | 1&lt;(bust−hip)&lt;10 ∧ (bust−waist)≥9 |
| 4 | Spoon | (hip−bust)&gt;2 ∧ (hip−waist)≥7 ∧ (high hip/waist)≥**1.193** |
| 5 | Triangle | (hip−bust)≥3.6 ∧ (hip−waist)&lt;9 |
| 6 | Inverted triangle | (bust−hip)≥3.6 ∧ (bust−waist)&lt;9 |
| 7 | Rectangle | (hip−bust)&lt;3.6 ∧ (bust−hip)&lt;3.6 ∧ (bust−waist)&lt;9 ∧ (hip−waist)&lt;10 |

**1.193 verification:** Confirmed in calculator.net body-type page and Sokolowski 2020 PDF Table 7 (Lee et al.). In-repo Body Type uses the same constant and first-match order.

---

## 3. Existing Body Type comparison

In-repo: `frontend/src/tools/calculators/body-type/calculation.ts`  
Implements the Lee/calculator.net table above (inches after conversion; first match wins; unclassified fallback).

| Dimension | Body Shape (Omni reference) | Body Type (in-repo) |
| --- | --- | --- |
| Categories | Same seven names | Same seven (+ unclassified) |
| Inputs | Bust, waist, high hip, hips | Same four |
| High-hip definition | Upper swell / top of hip curve | ~7 in (18 cm) below waist (calculator.net wording) |
| Published numeric table on Omni page | **No** | Yes (via Lee/calculator.net) |
| Unit set in UI | Many length units | cm \| in |
| Result UX | Live `Body shape is …` | Explicit Calculate; also shows WHR |
| Catalog identity | Separate row `Body Shape Calculator` | Separate row `Body Type Calculator` |

### Live Omni vs Body Type fixtures (2026-11-27 browser check)

| Fixture (in unless noted) | Body Type engine | Omni live |
| --- | --- | --- |
| 90/60/80/90 **cm** | hourglass | **hourglass** (match) |
| 34 / 26 / 30.99 / 38 | **bottom_hourglass** (high-hip/waist≈1.192 &lt; 1.193) | **hourglass** (**MISMATCH**) |
| 34 / 26 / 31.05 / 38 | spoon | not fully re-verified after mismatch |
| 34 / 30 / 32 / 38 | triangle | not required after mismatch |
| 40 / 34 / 33 / 36 | inverted_triangle | not required |
| 36 / 32 / 34 / 36 | rectangle | not required |

**Interpretation of mismatch:** calculator.net’s prose for Hourglass is operator-ambiguous (`… AND … AND … OR …`). Nested Lee/Sokolowski reading (Body Type) requires hip−bust &lt; 3.6 before applying the waist OR. Omni’s live result for 34/26/30.99/38 behaves as if **hip−waist ≥ 10 alone** can force Hourglass — which Lee nested formulas do **not** allow. Therefore Body Type ≠ Omni Body Shape for methodology, even though both cite Lee 2007.

---

## 4. Formula status

| Status field | Value |
| --- | --- |
| ORIGINAL_BODY_SHAPE_RULES_VERIFIED | **No** — Omni does not publish the complete table |
| EXISTING_BODY_TYPE_RULES_MATCH_APPROVED_SCOPE | **No** — live Omni parity failed |
| DIFFERENT_RULES_REQUIRE_OWNER_APPROVAL | **Yes — selected** |
| CLASSIFICATION_MODEL_UNVERIFIED | Partially true for Omni’s exact proprietary JS; Lee table itself is verified for Body Type only |

---

## 5. Mongo / ownership / capacity

| Item | Status |
| --- | --- |
| Catalog name | Present in `backend/data/tools-catalog.json` (Health & Fitness; pillar/subpillar null) |
| Live Mongo `_id` | **Unverified** (Atlas DNS historically EBADRESP this wave) |
| Exclusive claim | Investigation claim held then released to ISSUED |
| Progress folder | Empty for this tool |
| Worktree/branch for implementation | Not created (development blocked) |

---

## 6. RULE-APPROVAL REQUEST (owner decision needed)

### Missing table
Exact Omni Body Shape decision table: all seven shapes with numeric thresholds (inch and/or cm), high-hip usage, tolerances, deterministic tie / first-match order, and unclassified handling.

### Proposed reuse option (needs explicit YES)
**Option A — Approve Lee/Body Type methodology for Body Shape**  
Build `body-shape` UI to screenshot (blank cm fields, live result, bikini link policy as Omega-owned related-tool link if allowed) but reuse Body Type’s Lee/Istook engine (shared pure helper or copy). Document educational apparel disclaimer; do **not** claim clinical validation. Accept known Omni live divergence on borderline bottom-hourglass vs hourglass cases.

**Option B — Provide Omni-equivalent extract**  
Owner attaches verified numeric table matching Omni live (including hourglass OR precedence). Implement that table; do not share Body Type helper until parity proven.

**Option C — Keep Issued / defer**  
No development until A or B.

### Differences owner must accept if choosing A
1. Omni live labeled **hourglass** for 34/26/30.99/38 in; Lee/Body Type → **bottom hourglass**.
2. Body Type shows WHR; Omni screenshot result is shape phrase only (WHR optional / out of screenshot scope).
3. Unit menus differ (cm|in vs Omni’s larger set) — ADR-023: match screenshot starting units; support conversions shown as needed without inventing FX.
4. Separate catalog tools remain distinct products even if math is shared.

### Examples requiring verification under B
1. 90/60/80/90 cm → hourglass  
2. 34/26/30.99/38 in → Omni hourglass vs Lee bottom hourglass  
3. 34/26/31.05/38 in → Lee spoon (high-hip/waist ≥ 1.193)  
4. 34/30/32/38 → triangle  
5. 40/34/33/36 → inverted triangle  
6. 36/32/34/36 → rectangle  
7. Symmetric / unclassified extremes (e.g. hip−bust ≥ 10 without shelf)

### User decision needed
Reply with **A**, **B** (+ table), or **C**. Until then: **no calculator module, no commits, task stays Issued.**

---

## 7. Next exact development action

1. Wait for owner A/B/C.  
2. If A: claim → Progress → isolated worktree → UI then engine commits (shared Lee helper only after approval) → hand off registries to central integrator; Mongo assign when DNS works.  
3. If B: implement only after table attached and fixtures pass.  
4. If C: leave Issued unchanged.

Temporary files cleaned: YES  
