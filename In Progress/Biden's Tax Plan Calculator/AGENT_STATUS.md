# AGENT STATUS — BLOCKED (historical verification incomplete)

- **Status:** BLOCKED — UNRESOLVED
- **Recovery pass:** 2026-11-20 (autonomous In Progress recovery)
- **Claimed by:** Cursor recovery agent (research continuation; prior claim was research-only)
- **Catalog:** `bidens-tax-plan-calculator` (`6af46f0fa27d8d1d4e990055`) — undeveloped; inactive; indexable false; `componentKey` null
- **Commits:** none
- **Screenshot identity:** Copy references funding the **American Families Plan** (not a generic “Biden 2020 campaign” calculator alone).

## Verified research (not sufficient to ship)

Authoritative secondary sources (Tax Foundation May 2021 AFP analysis; CNBC White House confirmation of thresholds):

- Raise top ordinary rate **37% → 39.6%** for income over **$452,700** single/HoH and **$509,300** joint (2022 first year).
- Extend ARP-style CTC through 2025: **$3,600** under 6 / **$3,000** ages 6–17 with documented phaseouts; full refundability permanence proposed.
- Baseline for comparison is historical TCJA-era law for the chosen illustration year — not “today’s” 2026 law.

## Remaining blockers (do not invent)

1. **Your age** — screenshot field has no verified formula role (CTC uses child ages only; parent age not specified for this UI).
2. **Number of dependents** vs child age buckets — interaction / double-count rules not in task package.
3. Exact **baseline year** and full ordinary-income bracket table the original product used for “current tax plan” vs AFP (must not silently use 2025/2026 Income Tax Calculator params).
4. Whether outputs are tax-before-credits, after CTC, or refundable “negative tax” (copy mentions refunds; UI only shows income tax + effective rates).
5. Capital gains / NIIT / other AFP provisions are out of screenshot scope but must not be silently omitted if the authorized model required them.

## Rule

Prompt: *If the exact historical proposal cannot be verified, report BLOCKED instead of fabricating comparison results.*

**Folder remains:** `In Progress/Biden's Tax Plan Calculator`  
Missouri ON HOLD untouched. No Mongo activation. No commits.
