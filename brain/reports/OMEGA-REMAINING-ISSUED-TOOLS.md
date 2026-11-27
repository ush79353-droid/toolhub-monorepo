# OMEGA — Remaining Issued Tools (Audit Snapshot)

**Snapshot:** 2026-11-28  
**Path:** `D:\Project\ToolHub\Tools\Issued`  
**Directory exists:** YES  

## ISSUED_FOLDER_EMPTY

**NO**

**Exact count of immediate calculator folders: 4**

Issued does **not** contain zero calculator folders at this verified snapshot.

---

## Inventory

| # | Calculator folder | prompt.txt | Screenshots | ISSUE_REASON / AGENT | Why still Issued | Development started? | Formula / approval | Implemented elsewhere? | Required to resolve |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Addiction Calculator | YES | 1 PNG | YES / EVIDENCE_INSUFFICIENT | Per-dose LE model not independently reproducible | Investigation only (S8) | Evidence pack incomplete | No module | Approved life-lost tables + then develop |
| 2 | Body Shape Calculator | YES | 1 PNG | YES | Omni thresholds / Body Type reuse unapproved | Investigation only (S6) | Model approval required | No (Body Type is different product) | Owner rule pack or reuse approval |
| 3 | Face Shape Calculator | YES | 1 PNG | YES | Heuristics / jawline mapping unapproved | Investigation only (S7) | Approval pack required | No (Face Shape Detector is different) | Owner heuristic table |
| 4 | Metastatic Prostate Cancer Prognosis Calculator | YES | 1 PNG | YES / MODEL_APPROVAL_REQUIRED | Incomplete clinical composite; inventing LE forbidden | Investigation only (S9) | Clinical MODEL_APPROVAL | No | Approved coefficients/SSA/fixtures or retire |

No nested Issued calculator directories beyond the four above.

---

## Related unfinished tools NOT in Issued (Progress)

These are **not** Issued but prevent “mission complete”:

| Calculator | Folder | Status |
| --- | --- | --- |
| Alcohol Unit Calculator | Progress | READY_FOR_INTEGRATION (worktree commits; not on `development`) |
| CIWA Calculator | Progress | READY_FOR_INTEGRATION |
| Quiz Protein Creatinine Ratio Calculator | Progress | Module done; **live Mongo quiz row MISSING** → cannot finalize |

---

## Accountability of all 10 originals

| Original | Current home |
| --- | --- |
| Addiction | Issued |
| Adrenal Washout | Completed (+ live module) |
| Albumin Creatinine Ratio | Completed (+ live module) |
| Alcohol Unit | Progress (+ worktree) |
| Body Shape | Issued |
| BUN Creatinine Ratio | Completed (+ live module) |
| CIWA | Progress (+ worktree) |
| Face Shape | Issued |
| Metastatic Prostate | Issued |
| Quiz Protein Creatinine Ratio | Progress (+ worktree; catalog missing) |

**All ten original identities are accounted for.** Empty Issued is **not** true; empty Issued would still not mean success while Progress holds unfinished integrations and four blockers remain.

---

## Full verification report

See `brain/reports/OMEGA-10-SESSIONS-FINAL-VERIFICATION.md`.
