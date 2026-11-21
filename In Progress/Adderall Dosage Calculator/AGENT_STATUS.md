# Adderall Dosage Calculator — AGENT STATUS

**Status:** BLOCKED — CLINICAL REVIEW + MISSING RESULT/CUSTOM-DOSE SPEC  
**Agent:** cursor-composer (recovery revalidation 2026-11-22)  
**MongoDB _id:** `6af46f10a27d8d1d4e9901d1` (unique; id↔slug match)  
**Slug:** `adderall-dosage-calculator`  
**nameKey:** `adderall dosage calculator`  
**pillar:** `6af451c1a27d8d1d4e98f980` · **subPillar:** null  
**componentKey:** (none)  
**isDeveloped:** false · **isActive:** false · **indexable:** false (preserved; no Mongo write)  
**embedEnabled:** (unset / not activated)

## Ownership

- Folder remained under `In Progress/Adderall Dosage Calculator`.
- Prior lock released (`OWNER.txt` owner=released, blocker=clinical-review-gate).
- This pass: read-only recovery; no takeover of another active agent’s in-flight code.
- Ownership re-released after documentation for queue continuity.

## Previous blocker (still valid)

`prompt.txt` requires FDA labeling verification **and** clinical review; keep prescribing outputs disabled until approved. ADHD / Narcolepsy are the primary screenshot indications (Schedule II stimulant). No clinical-review approval artifact exists in the task folder.

## Screenshot functionality observed (ADR-023)

Reference: `Screenshot 2026-11-21 223303.png` (+ session attachment).

| Control | Observed |
| :--- | :--- |
| Age | Empty numeric, unit `years` |
| Indication | Radios: **ADHD** (default), Narcolepsy, Enter a custom dose |
| Tablet strength | Dropdown default **5 mg** |
| Results | **None visible** in captured state |
| Actions | Share result, Reload calculator, Clear all changes, Yes/No feedback |

No closed-menu strength list, custom-dose reveal layout, frequency fields, or numeric result panel appear in the screenshot.

## Medication formulation verified (labeling only)

| Item | Evidence |
| :--- | :--- |
| Product | **Adderall®** immediate-release **tablets** (mixed salts of a single-entity amphetamine product) — **not** Adderall XR capsules |
| DEA | Schedule **CII** |
| Strengths (labeled) | **5, 7.5, 10, 12.5, 15, 20, 30 mg** (matches screenshot default 5 mg; do not invent others) |
| Indications | ADHD and Narcolepsy (same IR tablet label) |
| ADHD age notes | Not recommended &lt;3 y; 3–5 y start 2.5 mg daily; ≥6 y start 5 mg once or twice daily; rare to exceed 40 mg/day; doses 4–6 h apart; avoid late evening |
| Narcolepsy age notes | Usual 5–60 mg/day divided; suggested starts differ for 6–12 vs ≥12; seldom under 12 |
| Boxed warning | Abuse, misuse, addiction; overdose risk |

### Authoritative sources consulted

1. **DailyMed** — ADDERALL tablet SPL, setid `f22635fe-821d-4cde-aa12-419f8b53db81`, updated **May 29, 2024**  
   https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f22635fe-821d-4cde-aa12-419f8b53db81
2. **FDA label PDF** — Adderall CII tablets, `011522s044lbl.pdf` (accessdata)  
   https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/011522s044lbl.pdf

**Clinical reviewer / approval status:** **NONE** in task folder or Brain. FDA/DailyMed text alone does **not** authorize shipping a patient-specific prescribing algorithm or activating the catalog row.

## Calculation methodology decision

| Mode | Allowed now? | Reason |
| :--- | :--- | :--- |
| ADHD → recommended start / titration | **No** | Prompt + mission require clinical review; schedule II; no reviewer sign-off |
| Narcolepsy → recommended start / titration | **No** | Same; separate labeled starts must not be silently reused from ADHD |
| Custom → tablets = prescribed mg ÷ strength mg | **Not yet** | Arithmetic is only allowed when inputs/result are fully specified; screenshot does not show custom-dose field(s), units (per dose vs per day), frequency, or result presentation; inventing that layout violates ADR-023 |
| Share of a “recommended dose” | **No** | Would broadcast unsupported prescribing output |

## Integration state (verified)

- No `frontend/src/tools/calculators/adderall*` module.
- No `AdderallDosageCalculator` in frontend registries or backend `tool.key.ts`.
- Catalog row unique; `componentKey` null; inactive / not developed / not indexable.
- No calculator commits for this tool (only docs mention in `d1f4633a`).
- FX: N/A (nonmonetary).

## This pass actions

- Re-read prompt + screenshot; read-only Mongo verify (`_id` / slug / flags).
- Verified DailyMed IR tablet strengths + ADHD/narcolepsy dosing sections (documentation only).
- **Did not** invent UI result panels, XR formulation, extra strengths, or start-dose engine.
- **Did not** register, `tool:assign`, activate, or create ADR-019 commits.
- Preserved screenshots, `prompt.txt`, and folder location under `In Progress`.

## Unblock requirements (all)

1. Documented clinical review approving the exact educational vs prescribing scope (or an authorized custom-only arithmetic scope change).
2. Approved custom-dose reveal: field labels, units, per-admin vs per-day, frequency (if any), and result copy.
3. Explicit decision whether ADHD/Narcolepsy modes may show **label-text educational schedules** (Gabapentin-style) vs remain clinician-gated unavailable.
4. Then ADR-018 module + ADR-019 three commits + ADR-022 activation only if functionally complete.

## Verdict

**BLOCKED — REQUIRED SPECIFICATION MISSING** (clinical review approval + custom-dose/result UX). Labeling sources recorded for future work; Mongo left unchanged.
