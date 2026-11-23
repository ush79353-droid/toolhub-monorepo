# Omega Calculators — Completed Tools Audit Issues

**Coordinator:** `cursor-agent-75916644-015950`  
**Session:** `sess-20261124-015950`  
**Companion:** `OMEGA-COMPLETED-TOOLS-FINAL-AUDIT.md`

---

## Open issues

### FIND-2026-11-24-001 — HIGH — LutealPhaseCalculator missing from backend allowlist

- **Calculator:** Luteal Phase Calculator  
- **Path:** `backend/src/modules/tools/tool.key.ts`  
- **Evidence:** No `LutealPhaseCalculator` string in allowlist (rechecked this session)  
- **Expected:** Key present in `APPROVED_COMPONENT_KEYS`  
- **Impact:** Assign/allowlist validation may fail for an otherwise completed tool  
- **Recommended repair:** Append key once; keep for-loop self-check; run `npx tsx src/modules/tools/tool.key.ts`  

### FIND-2026-11-24-002 — INFORMATIONAL — Mongo assign blocked for 13 session-new tools

- **Evidence:** `querySrv EBADRESP _mongodb._tcp.cluster0.pa6smuw.mongodb.net`  
- **Tools:** FourTScore, AbsoluteEosinophil/Lymphocyte/Reticulocyte, AddedSugar, AgeAdjustedDDimer, AlbuminGlobulin, AllowableBloodLoss, AncAbsoluteNeutrophil, AncWithoutBands, Bee, BenzodiazepineConversion, BloodDonor  
- **Repair:** Retry `tool:assign` with verified `_id`; preserve `indexable`  

### FIND-2026-11-24-003 — MEDIUM — Absolute Reticulocyte Count uses labeled Hct-based RBC estimate

- **Path:** `frontend/src/tools/calculators/absolute-reticulocyte-count/calculation.ts`  
- **Evidence:** Prompt notes hematocrit alone cannot determine RBC; module documents 5,000,000×(Hct/ref) estimate  
- **Repair:** Optional measured RBC field for true ARC  

### FIND-2026-11-24-004 — MEDIUM — BEE / Benzodiazepine clinical table citation depth

- **Paths:** `bee-calculator/`, `benzodiazepine-conversion/equiv-data.ts`  
- **Evidence:** Engine tests pass; prompt requires published equation / formulary verification beyond static session depth  
- **Repair:** Future citation QA against original Harris–Benedict revision and approved benzo equivalency source  

---

## Severity totals (this mission Phase 3)

| Severity | Count |
|---|---|
| CRITICAL | 0 |
| HIGH | 1 |
| MEDIUM | 2 |
| LOW | 0 (food-table spot-check folded into warnings in main audit) |
| INFORMATIONAL | 1+ (Mongo; no runtime browser tests) |

---

*End of issues report.*
