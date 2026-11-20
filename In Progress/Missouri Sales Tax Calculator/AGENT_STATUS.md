# AGENT STATUS — BLOCKED

- **Status:** BLOCKED (official data unusable from this environment)
- **Last attempt:** 2026-11-20 (repair pass)
- **Claimed by:** Cursor agent Auto (Composer)
- **Catalog:** `missouri-sales-tax-calculator` (`6af46f0fa27d8d1d4e99002a`) — verified undeveloped; **not activated**
- **Commits:** none (would be dishonest without official rates)
- **Do not reclaim** until official quarterly files are available locally or WAF access is fixed

## Exact blocker

Missouri Department of Revenue official quarterly Sales/Use **Boundary** and **Jurisdiction Total Rate** files cannot be retrieved or inspected from this agent environment.

| Attempt | Result |
|---|---|
| Direct HTTPS to Q4 2026 jurisdiction XLSX + boundary CSV | HTTP **403** Incapsula challenge HTML (not spreadsheet/CSV) |
| Hub page `dor.mo.gov/.../sales-use/` | HTTP **403** Incapsula |
| Cursor IDE browser navigation to the same hub | Incapsula iframe challenge; empty usable page (`Request unsuccessful`) |
| Project / Downloads / Desktop / Temp search for `dor-boundary*`, `dor-jurisdiction*`, prior extracts | **No official files found** |
| Prior task artifacts / helper scripts with usable ZIP→rate extract | **None** |

Without the real Boundary (Record Type `Z`) + Jurisdiction Total Rate (sales) tables, a ZIP→combined sales tax rate map cannot be built without inventing data. Task rules forbid fake datasets and silent statewide fallback.

## What is ready once files arrive

- Screenshot UI: Purchase amount + Purchase location ZIP Code; Share / Reload / Clear / feedback (Omega shell).
- Logic: `tax = amount × rate`, `total = amount + tax`; unavailable message for missing/ambiguous ZIP.
- Catalog ID / slug already known; register + `tool:assign` only after verified lookup works.

## Unblock checklist (human or allowlisted agent)

1. Manually download (browser that passes Incapsula) current-quarter:
   - `https://dor.mo.gov/taxation/business/tax-types/sales-use/documents/dor-boundary-database-q4-2026.csv` (or current quarter)
   - `https://dor.mo.gov/taxation/business/tax-types/sales-use/documents/dor-jurisdiction-total-rate-q4-2026.xlsx`
   - Docs: `…/Using-the-Rate-and-Boundary-Files.pdf`
2. Place files outside Git (or in an authorized non-committed cache) and note SHA-256 + effective period.
3. Extract unambiguous ZIP5 Record Type `Z` → sales total rate only.
4. Then implement UI + engine + three local commits + Mongo activation + move to Completed Tools.

**Folder remains:** `In Progress/Missouri Sales Tax Calculator`
