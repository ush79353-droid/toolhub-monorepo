# OMEGA ISSUED — Missing Screenshots Investigation Report

**Date:** 2026-11-26
**Scope:** Read-only scan of `Tools/Issued` (all folders), cross-check vs `Tools/Pending`, `Tools/Progress`, `Tools/Completed`, and other `Tools/` image locations.
**Constraint:** No calculator development, no folder moves, no Mongo/Git changes, no ISSUE_REASON edits.
**Related prior report (not overwritten):** `brain/reports/OMEGA-ISSUED-TOOLS-RECOVERY-REPORT.md`

---

## Executive summary

| Metric | Count |
| --- | ---: |
| Total calculators in Issued | **59** |
| **A.** Confirmed missing-screenshot blockers | **49** |
| **B.** Missing screenshots + additional blockers | **1** |
| **C.** Previously missing, now restored in Issued | **0** |
| **D.** Matching screenshots found in Pending | **0** |
| **E.** Screenshots absent, blocker reason unknown | **0** |
| **F.** Issued for unrelated reasons (not in main list) | **9** |
| **Unique calculators requiring screenshot recovery** | **50** |

**Pending status at scan time:** `Tools/Pending` contains **0** calculator folders (empty). No Recycle-Bin restore matches could be linked from Pending.

**Classification notes:**
- Every folder under Issued was inspected (59/59).
- Evidence source for blockers: each folder's `ISSUE_REASON.txt` (all 59 present), plus recursive image scan (`.png`/`.jpg`/`.jpeg`/`.webp`/`.gif`/`.bmp`).
- Category **A** folders still have **0** image files and issue text that explicitly cites missing screenshots / empty specification packet / ADR-023 screenshot-first failure.
- Category **B** is the same missing-packet condition **plus** a documented missing MongoDB catalog identity.
- Category **F** tools retain screenshots (or were issued for duplicates / Mongo DNS / clinical formula / reference mismatch) and are **excluded** from the main recovery list.
- No Category **C**: none of the tools originally issued for missing screenshots now contain restored images in their Issued folders.
- No Category **D**: Pending is empty; no identity-matched screenshot packets found there.
- No Category **E**: every zero-image Issued folder has explicit missing-screenshot / empty-packet wording in `ISSUE_REASON.txt`.

---

## Main list — confirmed / possible missing-screenshot issues

| # | Calculator Name | Issued Folder | Original Issue | Screenshot Status | Found in Pending? | Other Blockers |
|---|---|---|---|---|---|---|
| 1 | ABSI Calculator — **CONFIRMED (A)** | `Tools\Issued\ABSI Calculator` | Claimed Progress folder contained only AGENT_STATUS.md / .agent-claim lock. No prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 2 | Acid Base Calculator — **CONFIRMED (A)** | `Tools\Issued\Acid Base Calculator` | Claimed task folder contained zero files — no prompt.txt, no screenshots, no notes. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 3 | Adjusted Body Weight Calculator — **CONFIRMED+OTHER (B)** | `Tools\Issued\Adjusted Body Weight Calculator` | The claimed task folder was empty after atomic claim from Pending → Progress. Directory listing returned 0 files (no prompt.txt, no screenshots, no notes). A repository-wide path search found only the Progress folder ... | ABSENT (0 image files) | No — Pending empty (0 folders) | No matching MongoDB catalog row (OMEGA-136 snapshot); creating new row forbidden |
| 4 | Anion Gap Calculator — **CONFIRMED (A)** | `Tools\Issued\Anion Gap Calculator` | The claimed task folder contained no `prompt.txt`, no screenshots, and no approved notes. After atomic claim (Pending → Progress), the folder only contained AGENT_STATUS.md and `.agent-claim/lock.txt` written by this ... | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 5 | Arterial Blood pH Calculator — **CONFIRMED (A)** | `Tools\Issued\Arterial Blood pH Calculator` | The claimed task folder contains zero files. No prompt.txt, no screenshot(s), and no approved notes were present after the atomic Pending → Progress move. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 6 | BAI Calculator - Body Adiposity Index — **CONFIRMED (A)** | `Tools\Issued\BAI Calculator - Body Adiposity Index` | Claimed task folder contained no prompt.txt and no reference screenshot(s). Only AGENT_STATUS.md / .agent-claim artifacts written by this agent were present after Pending→Progress move. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 7 | Bedridden Patient Height Calculator — **CONFIRMED (A)** | `Tools\Issued\Bedridden Patient Height Calculator` | The claimed task folder contains zero files. No prompt.txt, no screenshots, and no approved notes were present after the atomic claim move from Pending to Progress. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 8 | Bicarbonate Deficit Calculator — **CONFIRMED (A)** | `Tools\Issued\Bicarbonate Deficit Calculator` | After atomic claim from Pending to Progress, the task folder contained only .agent-claim\lock.txt. No prompt.txt, no reference screenshot(s), and no approved notes were present. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 9 | Body Frame Size Calculator — **CONFIRMED (A)** | `Tools\Issued\Body Frame Size Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 10 | Body Shape Calculator — **CONFIRMED (A)** | `Tools\Issued\Body Shape Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 11 | Body Surface Area Calculator — **CONFIRMED (A)** | `Tools\Issued\Body Surface Area Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 12 | Body Type Calculator — **CONFIRMED (A)** | `Tools\Issued\Body Type Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 13 | BRI Calculator — Body Roundness Index — **CONFIRMED (A)** | `Tools\Issued\BRI Calculator — Body Roundness Index` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 14 | BSA Calculator – Body Surface Area — **CONFIRMED (A)** | `Tools\Issued\BSA Calculator – Body Surface Area` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 15 | Corrected Calcium Calculator — **CONFIRMED (A)** | `Tools\Issued\Corrected Calcium Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 16 | Corrected Magnesium Calculator — **CONFIRMED (A)** | `Tools\Issued\Corrected Magnesium Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 17 | Draw Length Calculator — **CONFIRMED (A)** | `Tools\Issued\Draw Length Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 18 | Drip Rate Calculator — **CONFIRMED (A)** | `Tools\Issued\Drip Rate Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 19 | Drops Per Minute Calculator — **CONFIRMED (A)** | `Tools\Issued\Drops Per Minute Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 20 | Face Shape Calculator — **CONFIRMED (A)** | `Tools\Issued\Face Shape Calculator` | Pending folder had no usable prompt.txt content and no screenshots. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 21 | FFMI Calculator (Fat-Free Mass Index) — **CONFIRMED (A)** | `Tools\Issued\FFMI Calculator (Fat-Free Mass Index)` | Claimed Progress folder contains only AGENT_STATUS / OWNER.lock. No prompt.txt, no screenshots, no approved notes. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 22 | Free Water Deficit Calculator — **CONFIRMED (A)** | `Tools\Issued\Free Water Deficit Calculator` | Claimed Progress folder contained no screenshot(s) and no prompt.txt — only the agent claim lock created during claim. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 23 | Healthy Weight Calculator — **CONFIRMED (A)** | `Tools\Issued\Healthy Weight Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 24 | Ideal Weight Calculator — **CONFIRMED (A)** | `Tools\Issued\Ideal Weight Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 25 | IV Flow Rate Calculator — **CONFIRMED (A)** | `Tools\Issued\IV Flow Rate Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 26 | Karvonen Formula Calculator — **CONFIRMED (A)** | `Tools\Issued\Karvonen Formula Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 27 | Lean Body Mass Calculator — **CONFIRMED (A)** | `Tools\Issued\Lean Body Mass Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 28 | NLR Calculator — **CONFIRMED (A)** | `Tools\Issued\NLR Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 29 | Overweight Calculator — **CONFIRMED (A)** | `Tools\Issued\Overweight Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 30 | Parkland Formula Calculator — **CONFIRMED (A)** | `Tools\Issued\Parkland Formula Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 31 | Plasma Osmolality Calculator — **CONFIRMED (A)** | `Tools\Issued\Plasma Osmolality Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 32 | Plasma Volume Calculator — **CONFIRMED (A)** | `Tools\Issued\Plasma Volume Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 33 | Ponderal Index Calculator — **CONFIRMED (A)** | `Tools\Issued\Ponderal Index Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 34 | Quiz FFMI Calculator (Fat-Free Mass Index) — **CONFIRMED (A)** | `Tools\Issued\Quiz FFMI Calculator (Fat-Free Mass Index)` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 35 | RBC Indices Calculator  What is MCHC — **CONFIRMED (A)** | `Tools\Issued\RBC Indices Calculator  What is MCHC` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 36 | RFM Calculator (Relative Fat Mass) — **CONFIRMED (A)** | `Tools\Issued\RFM Calculator (Relative Fat Mass)` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 37 | Serum Osmolality Calculator — **CONFIRMED (A)** | `Tools\Issued\Serum Osmolality Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 38 | Sodium Change Calculator in Hypertriglyceridemia — **CONFIRMED (A)** | `Tools\Issued\Sodium Change Calculator in Hypertriglyceridemia` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 39 | Sodium Correction Calculator — **CONFIRMED (A)** | `Tools\Issued\Sodium Correction Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 40 | Sodium Correction Rate Calculator for Hypoand Hypernatremia — **CONFIRMED (A)** | `Tools\Issued\Sodium Correction Rate Calculator for Hypoand Hypernatremia` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 41 | Sodium Deficit Calculator — **CONFIRMED (A)** | `Tools\Issued\Sodium Deficit Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 42 | Total Body Water Calculator — **CONFIRMED (A)** | `Tools\Issued\Total Body Water Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 43 | Transferrin Saturation Calculator — **CONFIRMED (A)** | `Tools\Issued\Transferrin Saturation Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 44 | Urine Anion Gap Calculator — **CONFIRMED (A)** | `Tools\Issued\Urine Anion Gap Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 45 | Venous Blood pH Calculator — **CONFIRMED (A)** | `Tools\Issued\Venous Blood pH Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 46 | Waist to Height Ratio Calculator — **CONFIRMED (A)** | `Tools\Issued\Waist to Height Ratio Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 47 | Waist to Hip Ratio Calculator — **CONFIRMED (A)** | `Tools\Issued\Waist to Hip Ratio Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 48 | Water Intake Calculator — **CONFIRMED (A)** | `Tools\Issued\Water Intake Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 49 | Weight Loss Percentage Calculator — **CONFIRMED (A)** | `Tools\Issued\Weight Loss Percentage Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |
| 50 | Winters' Formula Calculator — **CONFIRMED (A)** | `Tools\Issued\Winters' Formula Calculator` | Pending task folder contained no prompt.txt and no screenshot files. | ABSENT (0 image files) | No — Pending empty (0 folders) | prompt.txt also missing (same empty/incomplete packet) |

---

## Category A — CONFIRMED_MISSING_SCREENSHOTS

Count: **49**

Issue reports explicitly identify missing screenshots (and usually missing `prompt.txt`) as why development stopped. Image scan confirms **0** screenshots remain in each Issued folder.

| Calculator | Exact files still needed | Suggested recovery action |
| --- | --- | --- |
| ABSI Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Acid Base Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Anion Gap Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Arterial Blood pH Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| BAI Calculator - Body Adiposity Index | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Bedridden Patient Height Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Bicarbonate Deficit Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Body Frame Size Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Body Shape Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Body Surface Area Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Body Type Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| BRI Calculator — Body Roundness Index | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| BSA Calculator – Body Surface Area | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Corrected Calcium Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Corrected Magnesium Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Draw Length Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Drip Rate Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Drops Per Minute Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Face Shape Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| FFMI Calculator (Fat-Free Mass Index) | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Free Water Deficit Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Healthy Weight Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Ideal Weight Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| IV Flow Rate Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Karvonen Formula Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Lean Body Mass Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| NLR Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Overweight Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Parkland Formula Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Plasma Osmolality Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Plasma Volume Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Ponderal Index Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Quiz FFMI Calculator (Fat-Free Mass Index) | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| RBC Indices Calculator  What is MCHC | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| RFM Calculator (Relative Fat Mass) | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Serum Osmolality Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Sodium Change Calculator in Hypertriglyceridemia | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Sodium Correction Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Sodium Correction Rate Calculator for Hypoand Hypernatremia | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Sodium Deficit Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Total Body Water Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Transferrin Saturation Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Urine Anion Gap Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Venous Blood pH Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Waist to Height Ratio Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Waist to Hip Ratio Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Water Intake Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Weight Loss Percentage Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |
| Winters' Formula Calculator | At least one reference screenshot (`.png`/`.jpg`/`.jpeg`/`.webp`) **and** official `prompt.txt` (both absent today) | Locate original task packet (Recycle Bin / backup / source Omni packet), restore screenshot + prompt into a Pending folder named for this calculator, confirm Mongo `_id`/slug, then re-queue. Do not invent UI from title alone. |

### Category A evidence excerpts (from ISSUE_REASON.txt)

Representative wording patterns observed across Category A:

1. **Empty / lock-only claim:** e.g. ABSI, Acid Base, Anion Gap, Arterial Blood pH, BAI, Bedridden, Bicarbonate Deficit, FFMI, Free Water Deficit — folder had no `prompt.txt` and no screenshots after claim; ADR-023 blocked development.
2. **Batch empty-packet wording:** e.g. Body Frame Size through BSA, Corrected Calcium/Magnesium, Draw Length, Drip Rate, Drops Per Minute, Face Shape, Healthy/Ideal Weight, IV Flow Rate, Karvonen, Lean Body Mass, NLR, Overweight, Parkland, Plasma Osmolality/Volume, Ponderal, Quiz FFMI, RBC Indices, RFM, Serum Osmolality, Sodium* family, Total Body Water, Transferrin Saturation, Urine Anion Gap, Venous Blood pH, Waist ratios, Water Intake, Weight Loss Percentage, Winters' Formula — `Pending folder had no usable prompt.txt content and no screenshots` / `hasPrompt=False imageCount=0` / `ADR-023 screenshot-first scope cannot be determined`.
3. **Still absent now:** recursive image listing of each Category A Issued path returned **0** matches.

---

## Category B — MISSING_SCREENSHOTS_WITH_OTHER_BLOCKERS

Count: **1**

### Adjusted Body Weight Calculator

- **Issued path:** `Tools\Issued\Adjusted Body Weight Calculator`
- **Screenshot status:** ABSENT (0 image files)
- **prompt.txt present:** False
- **Original issue (summary):** The claimed task folder was empty after atomic claim from Pending → Progress. Directory listing returned 0 files (no prompt.txt, no screenshots, no notes). A repository-wide path search found only the Progress folder ...
- **Other blockers:** No matching MongoDB catalog row (OMEGA-136 snapshot); creating new row forbidden
- **Evidence:** ISSUE_REASON states claimed folder was empty (no prompt/screenshots) **and** OMEGA-136 health MongoDB snapshot had **no catalog row** matching this calculator; creating a new Mongo record is forbidden.
- **Files still needed:** official `prompt.txt` + reference screenshot(s); **plus** an authorized existing MongoDB catalog identity (`_id`, slug) before development/activation can proceed.
- **Suggested next recovery action:** Restore screenshot/prompt packet first; separately confirm whether a catalog row exists under an alternate name/slug. If no row exists, escalate for catalog authorization — do not develop against a missing `_id`.

---

## Category C — SCREENSHOTS_NOW_AVAILABLE

**Count: 0**

No Issued calculator that was originally blocked for missing screenshots now contains restored screenshot files. The 9 Issued folders that currently have `.png` files were issued for other reasons and already recorded `Screenshots and prompt preserved: YES` (or equivalent) at issue time.

---

## Category D — SCREENSHOTS_AVAILABLE_IN_PENDING

**Count: 0**

`D:\Project\ToolHub\Tools\Pending` has **0** subfolders at investigation time. Exact-name and normalized-name matching against Category A/B Issued tools found **no** Pending counterparts with screenshots.

Broader `Tools/` image scan (66 images total) found screenshots under Completed, Issued (non–screenshot-blocked tools), Progress (unrelated active tasks), and `_restored-pending-duplicate-*` folders — **none** identity-matched to Category A/B calculator names.

---

## Category E — SCREENSHOTS_MISSING_REASON_UNKNOWN

**Count: 0**

Every Issued folder with 0 images has explicit missing-screenshot / empty-packet language in `ISSUE_REASON.txt`.

---

## Category F — OTHER_ISSUE (excluded from main missing-screenshot list)

Count: **9** — screenshots present; issued for non-missing-screenshot reasons.

| Calculator | Issued Folder | Original non-screenshot blocker | Screenshot files present |
| --- | --- | --- | --- |
| Addiction Calculator | `Tools\Issued\Addiction Calculator` | Duplicate queue / already completed — Live catalog lookup failed twice with Atlas DNS error before any calculator code was written. | PRESENT (1): Screenshot 2026-11-25 004626.png |
| Adrenal Washout Calculator (duplicate-queue) | `Tools\Issued\Adrenal Washout Calculator (duplicate-queue)` | Duplicate queue / already completed — A second Pending copy of Adrenal Washout Calculator was claimed after the same calculator was already developed, registered, activated, and moved to Tools/Completed. | PRESENT (1): Screenshot 2026-11-24 233830.png |
| Albumin Creatinine Ratio Calculator - duplicate-pending | `Tools\Issued\Albumin Creatinine Ratio Calculator - duplicate-pending` | Duplicate queue / already completed — A second Pending folder appeared after the calculator was already completed and activated. | PRESENT (1): Screenshot 2026-11-24 235556.png |
| Alcohol Unit Calculator | `Tools\Issued\Alcohol Unit Calculator` | Duplicate queue / already completed — Read-only MongoDB catalog lookup failed repeatedly with `querySrv EBADRESP _mongodb._tcp.cluster0.pa6smuw.mongodb.net` / `ENOTFOUND cluster0.pa6smuw.mongodb.net`. Local `tools-catalog.json` lists the name only (no `_i... | PRESENT (1): Screenshot 2026-11-25 004713.png |
| BAC Calculator | `Tools\Issued\BAC Calculator` | Wrong screenshot (EtG vs BAC); needs correct BAC reference — REFERENCE MISMATCH. The task folder is named BAC Calculator and the MongoDB catalog row is BAC Calculator (slug bac-calculator, _id 6af46f12a27d8d1d4e9902f7, componentKey empty, undeveloped). The provided reference sc... | PRESENT (1): Screenshot 2026-11-25 004857.png |
| BUN Creatinine Ratio Calculator - duplicate-queue-reconciled | `Tools\Issued\BUN Creatinine Ratio Calculator - duplicate-queue-reconciled` | Duplicate queue / already completed — After atomic claim, inspection found a complete ADR-018 module at frontend/src/tools/calculators/bun-creatinine-ratio/, registry keys present (keys/index/details/tool.key/sitemap), calculation.test.ts OK (BUN 20 / Cr ... | PRESENT (1): Screenshot 2026-11-24 235646.png |
| CIWA Calculator | `Tools\Issued\CIWA Calculator` | Duplicate queue / already completed — Live catalog lookup failed with Atlas SRV DNS error before any calculator code was written. `tool:assign` requires a verified `_id`. | PRESENT (1): Screenshot 2026-11-25 005159.png |
| Metastatic Prostate Cancer Prognosis Calculator | `Tools\Issued\Metastatic Prostate Cancer Prognosis Calculator` | Duplicate queue / already completed — Screenshot shows inputs (age, height/weight with units, Gleason 2-4, distant metastases No/Yes, health level, smoker) but no populated results. Task prompt forbids inventing life-expectancy estimates. Omni cites Zhang... | PRESENT (1): Screenshot 2026-11-25 001400.png |
| Protein Creatinine Ratio Calculator | `Tools\Issued\Protein Creatinine Ratio Calculator` | Duplicate queue / already completed — Calculator UI, engine, tests, frontend/backend registry, sitemap, and GitHub commits succeeded, but MongoDB Atlas SRV lookup failed repeatedly (querySrv EBADRESP for cluster0.pa6smuw.mongodb.net). Without a verified `... | PRESENT (1): Screenshot 2026-11-25 001457.png |

**Note on BAC Calculator:** Screenshot file exists, but it depicts an **EtG Calculator**, not BAC. This is a **reference mismatch**, not a missing-file case. It needs a *correct* BAC screenshot (or EtG catalog re-pairing), tracked under F — not counted in the 50 screenshot-recovery total.

---

## Pending / restore cross-check detail

| Check | Result |
| --- | --- |
| Pending folder count | 0 |
| Exact name matches Pending ↔ Issued(A/B) | 0 |
| Progress overlaps with Issued(A/B) names | 0 |
| Completed folders providing screenshots for Issued(A/B) names | 0 exact identity matches |
| `_restored-pending-duplicate-*` folders matching Issued(A/B) | None (those restores are Creatinine Clearance, EORTC, FEUrea, GFR, KtV, Prostate Volume — already Completed lineage) |

**Potential recovery candidates from Pending:** none at this time.

---

## Exact screenshot files still needed

For all **50** Category A+B calculators:

1. **Minimum:** ≥1 reference screenshot image file in the task folder (`.png` preferred; `.jpg`/`.jpeg`/`.webp` also acceptable).
2. **Also required for retry:** official `prompt.txt` (currently absent on all 50).
3. Original filenames are unknown (never present in claimed folders). Restore whatever authentic Omni/reference capture belongs to that calculator — do not invent placeholders.
4. **Adjusted Body Weight Calculator** additionally needs a verified existing MongoDB catalog `_id`/slug (or an authorized decision that the tool should not be built).

---

## Suggested next recovery actions (operations only — not development)

1. Search Windows Recycle Bin / backups / source Omni export for packets named exactly like the 50 Category A+B folders.
2. When a packet with screenshot + `prompt.txt` is found, place it under `Tools/Pending/<Calculator Name>/` (do not merge into Issued automatically).
3. Re-scan with this report's checklist before releasing any folder for development.
4. Treat **BSA Calculator – Body Surface Area** and **Body Surface Area Calculator** as potentially related but **separate** Issued identities until prompts prove otherwise.
5. Do not retry Category F tools under a “missing screenshots” recovery track; they need Mongo DNS, duplicate cleanup, clinical sources, or correct BAC reference instead.
6. Keep Category B (Adjusted Body Weight) blocked for development until catalog identity is resolved, even after screenshots return.

---

## Inventory reconciliation

```
Issued total                 = 59
A confirmed missing shots    = 49
B missing + other blockers   = 1
C restored in Issued         = 0
D available in Pending       = 0
E reason unknown             = 0
F other issue                = 9
A+B+C+D+E+F                  = 59  (must equal 59)
Unique screenshot recovery   = 50  (A∪B, no double-count)
```

---

## Method

1. Listed all directories under `D:\Project\ToolHub\Tools\Issued` (59).
2. Read every `ISSUE_REASON.txt`; sampled `AGENT_STATUS.md` / `prompt.txt` where present.
3. Recursively searched each Issued folder for image extensions.
4. Compared against Pending (empty), Progress (4 unrelated/active), Completed, and `_restored-pending-duplicate-*`.
5. Classified strictly from evidence; did not assume empty folder ⇒ missing screenshots without ISSUE_REASON support (in practice all empty Issued folders did cite that cause).

**Temporary files cleaned:** YES (classification artifacts written only under `%TEMP%`, outside the repo).


