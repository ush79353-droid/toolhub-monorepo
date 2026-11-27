# OMEGA ISSUED TOOLS — COMPLETE INVESTIGATION

**Mission type:** Investigation & development planning only (read-only except this report set)  
**Investigation date:** 2026-11-27  
**Snapshot root:** `D:\Project\ToolHub\Tools\Issued`  
**Branch observed:** `development` (local; ahead/behind remote noted in git status — no fetch/push performed)  
**Agent policy:** No calculator development, no Mongo writes, no task moves, no Git commits, no ownership release

---

## A. Executive snapshot

| Metric | Count |
| --- | ---: |
| Issued folders (grounded rescan) | **10** |
| Folders with `prompt.txt` | **10** |
| Folders with ≥1 screenshot | **10** |
| Folders with `ISSUE_REASON.txt` | **10** |
| Matching folders in `Tools/Pending` | **0** |
| Matching folders in `Tools/Progress` | **0** |
| Matching folders in `D:\Tools Prompt\Ready` | **0** |
| Live MongoDB this session | **MONGODB_UNVERIFIED** (`querySrv EBADRESP _mongodb._tcp.cluster0.pa6smuw.mongodb.net`) |

### Development status totals (mutually exclusive)

| Status | Count | Calculators |
| --- | ---: | --- |
| `ALREADY_COMPLETED_DUPLICATE` | 3 | Adrenal Washout; Albumin Creatinine Ratio; BUN Creatinine Ratio |
| `NOT_DEVELOPED` | 7 | Addiction; Alcohol Unit; Body Shape; CIWA; Face Shape; Metastatic Prostate Cancer Prognosis; Quiz Protein Creatinine Ratio |
| `UI_ONLY` / `PARTIALLY_DEVELOPED` / `ENGINE_COMPLETE_INTEGRATION_MISSING` / `DEVELOPED_ACTIVATION_PENDING` | 0 | — |
| `ACTIVE_AGENT_OWNERSHIP` | 0 | Progress empty; Issued locks are **stale post-ISSUED claims**, not live owners |
| `DEVELOPMENT_UNVERIFIED` | 0 | Filesystem + registry evidence sufficient for all 10 |

### Recovery readiness totals (primary classification, one each)

| Readiness | Count |
| --- | ---: |
| `ALREADY_COMPLETED_RECONCILE` | 3 |
| `READY_AFTER_TECHNICAL_FIX` | 2 |
| `NEEDS_AUTHORITATIVE_FORMULA` | 4 |
| `NEEDS_MONGODB_AUTHORIZATION` | 1 |
| `READY_NOW` (net-new build without further input) | 0 |

---

## B. Method

1. Listed every directory under `Tools/Issued` (rescan at start and end).  
2. Read every `ISSUE_REASON.txt`, `prompt.txt`, ownership lock / `AGENT_STATUS.md` when present.  
3. Counted screenshots; visually inspected Addiction and Alcohol Unit screenshots.  
4. Searched `frontend/src/tools/calculators`, `registry/keys.ts|index.ts|details.ts`, and `backend/.../tool.key.ts`.  
5. Searched `Tools/{Pending,Progress,Completed}` and `D:\Tools Prompt\Ready` for restored materials / duplicates.  
6. Verified referenced Git commit objects for Adrenal / Albumin / BUN.  
7. Attempted **read-only** Mongo connect via backend `MONGODB_URI` — failed with Atlas SRV DNS error (same class as several original blockers).  
8. Used prior Brain reports only as **historical** identity hints; labeled them non-live when not re-verified.

---

## C. Full inventory (one row per Issued folder)

| # | Calculator (folder) | Development status | Original issue (summary) | Original issue still present? | Current primary blocker | Recovery readiness |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Addiction Calculator | NOT_DEVELOPED | Mongo DNS before coding | **Yes** (DNS still fails) + deeper evidence gap | Authoritative substance/country life-loss tables + Mongo identity | NEEDS_AUTHORITATIVE_FORMULA |
| 2 | Adrenal Washout Calculator (duplicate-queue) | ALREADY_COMPLETED_DUPLICATE | Duplicate queue after completion | No build blocker | Queue reconcile only | ALREADY_COMPLETED_RECONCILE |
| 3 | Albumin Creatinine Ratio Calculator - duplicate-pending | ALREADY_COMPLETED_DUPLICATE | Duplicate Pending after completion | No build blocker | Queue reconcile only | ALREADY_COMPLETED_RECONCILE |
| 4 | Alcohol Unit Calculator | NOT_DEVELOPED | Mongo DNS before coding | **Yes** (DNS still fails) | Live Mongo identity confirm, then full ADR-018 build | READY_AFTER_TECHNICAL_FIX |
| 5 | Body Shape Calculator | NOT_DEVELOPED | Unverified 7-shape decision table | **Yes** | Approved numeric classification table (Omni-equivalent or Body Type reuse approval) | NEEDS_AUTHORITATIVE_FORMULA |
| 6 | BUN Creatinine Ratio Calculator - duplicate-queue-reconciled | ALREADY_COMPLETED_DUPLICATE | Duplicate after completion | No build blocker | Queue reconcile only | ALREADY_COMPLETED_RECONCILE |
| 7 | CIWA Calculator | NOT_DEVELOPED | Mongo DNS before coding | **Yes** (DNS still fails) | Live Mongo identity confirm, then CIWA-Ar build | READY_AFTER_TECHNICAL_FIX |
| 8 | Face Shape Calculator | NOT_DEVELOPED | Unverified face-shape heuristics | **Yes** | Approved numeric heuristics / jawline mapping | NEEDS_AUTHORITATIVE_FORMULA |
| 9 | Metastatic Prostate Cancer Prognosis Calculator | NOT_DEVELOPED | Missing verified clinical model pack | **Yes** | Primary coefficients + SSA/life-table fixtures | NEEDS_AUTHORITATIVE_FORMULA |
| 10 | Quiz Protein Creatinine Ratio Calculator | NOT_DEVELOPED | No live Mongo catalog row | **Likely yes** (cannot re-verify live) | Authorized catalog row create/restore | NEEDS_MONGODB_AUTHORIZATION |

---

## D. Individual investigations

### 1. Addiction Calculator

- **Path:** `Tools/Issued/Addiction Calculator`
- **Prompt / screenshots:** Present (`prompt.txt`; `Screenshot 2026-11-25 004626.png`)
- **Ownership:** Stale `.agent-claim/OWNER.lock` + `AGENT_STATUS.md` still saying IN_PROGRESS from 2026-11-25; folder already Issued with ISSUE_REASON — **not** an active Progress owner
- **ISSUE_REASON:** Atlas `querySrv EBADRESP`; no module written; expected slug `addiction-calculator`
- **Code:** No `frontend/src/tools/calculators/addiction*`; no registry/backend key
- **Mongo (this session):** UNVERIFIED  
  **Historical hint (recovery report 2026-11-25):** `_id` `6af46f12a27d8d1d4e9902f3` — **not re-confirmed live**
- **Git:** No task commits
- **Spec notes:** Screenshot shows addiction type, minutes lost per dose, uses/day, age started, country; results include non-addict LE, addict LE, duration, total life lost. Prompt requires verified demographic baselines and published evidence per exposure — inventing minutes/country tables is forbidden
- **Primary blocker:** Authoritative exposure + country life-expectancy data pack  
- **Secondary:** Live Mongo identity / DNS  
- **Can repo alone finish it?** Partially — UI scope is clear; numeric evidence pack is not fully in-repo

### 2. Adrenal Washout Calculator (duplicate-queue)

- **Path:** `Tools/Issued/Adrenal Washout Calculator (duplicate-queue)`
- **Prompt / screenshots:** Present
- **Ownership:** Stale claim lock from duplicate-claim session
- **ISSUE_REASON:** Second queue copy after genuine delivery; Mongo ID cited `6af46f12a27d8d1d4e9902ca`; slug `adrenal-washout-calculator`
- **Code:** Full ADR-018 module at `frontend/src/tools/calculators/adrenal-washout/` (UI, calculation, validation, tests, guide)
- **Registry:** `AdrenalWashoutCalculator` in `keys.ts`, `registry/index.ts`, `registry/details.ts`, `tool.key.ts`
- **Git evidence:** `09d37ff2` (UI), `08783b11` (engine), `c9086bff` (integration) — objects exist
- **Tools/Completed folder:** Not present anymore (Completed now holds other tools; delivery folder cleaned after earlier completion). Implementation remains in source tree
- **Primary blocker:** Duplicate Issued folder reconciliation only — **do not rebuild**
- **Mongo this session:** UNVERIFIED (historical activation claimed in ISSUE_REASON)

### 3. Albumin Creatinine Ratio Calculator - duplicate-pending

- **Path:** `Tools/Issued/Albumin Creatinine Ratio Calculator - duplicate-pending`
- **Prompt / screenshots:** Present; no `.agent-claim`
- **ISSUE_REASON:** Duplicate after completion; Mongo ID `6af46f12a27d8d1d4e9902cb`; slug `albumin-creatinine-ratio-calculator`
- **Code:** Full module `frontend/src/tools/calculators/albumin-creatinine-ratio/`
- **Registry/backend key:** `AlbuminCreatinineRatioCalculator` present
- **Git:** `67954e30` / `a06a16c7` / `25427263` exist
- **Completed folder:** Not in current `Tools/Completed` list; code remains
- **Primary blocker:** Reconcile duplicate Issued entry — **do not rebuild**

### 4. Alcohol Unit Calculator

- **Path:** `Tools/Issued/Alcohol Unit Calculator`
- **Prompt / screenshots:** Present; screenshot matches UK units / drink presets / country grams definition
- **Ownership:** Stale claim; `AGENT_STATUS.md` = `ISSUED_MONGO_DNS`
- **ISSUE_REASON:** Mongo DNS; no module; formula sketched (UK units = Σ(mL×ABV%/1000); 500 mL 5% → 2.5)
- **Code:** No alcohol-unit module; not in registry/`tool.key.ts`
- **Historical Mongo hint:** `6af46f12a27d8d1d4e9902f4` (recovery report) — not live-confirmed
- **Primary blocker:** Restore Mongo connectivity and re-verify unique catalog row, then implement ADR-018
- **Formula status:** Sufficient in prompt + public UK unit definition for engine work once identity is confirmed
- **User materials needed:** None (prompt + screenshot already present)

### 5. Body Shape Calculator

- **Path:** `Tools/Issued/Body Shape Calculator`
- **Prompt / screenshots:** Present (bust/waist/high hip/hip cm; seven shapes)
- **ISSUE_REASON:** Omni public page lacks complete numeric decision table; prompt forbids inventing table; Mongo DNS also failed historically
- **Code:** No `body-shape` module
- **Related in-repo:** `BodyTypeCalculator` already implements Lee/calculator.net seven-shape rules with high-hip cutoff `1.193` in `frontend/src/tools/calculators/body-type/calculation.ts`. Prompt requires comparing Body Shape vs Body Type conventions **before** sharing helpers
- **Primary blocker:** Operator-approved rule table for **this** tool (or explicit approval to reuse Body Type table after parity check)
- **Secondary:** Live Mongo identity
- **Ready materials elsewhere?** No matching Ready/Pending/Progress folder found

### 6. BUN Creatinine Ratio Calculator - duplicate-queue-reconciled

- **Path:** `Tools/Issued/BUN Creatinine Ratio Calculator - duplicate-queue-reconciled`
- **Prompt / screenshots:** Present
- **ISSUE_REASON:** Claimed duplicate; module already complete; Mongo ID hint `6af46f12a27d8d1d4e9902cd`
- **Code:** Full module `frontend/src/tools/calculators/bun-creatinine-ratio/`
- **Registry/backend:** `BunCreatinineRatioCalculator` present
- **Git:** `df3445b1` / `b11f1075` / `838eb350` exist
- **Primary blocker:** Reconcile Issued duplicate — **do not rebuild**

### 7. CIWA Calculator

- **Path:** `Tools/Issued/CIWA Calculator`
- **Prompt / screenshots:** Present; CIWA-Ar 10 items; orientation max 4; others max 7; total 67
- **Ownership:** Stale lock (`phase=DEVELOPING` leftover)
- **ISSUE_REASON:** Mongo DNS; no code
- **Code:** No `ciwa` module; not registered
- **Historical Mongo hint:** `6af46f12a27d8d1d4e9902fb` — not live-confirmed
- **Primary blocker:** Mongo identity confirm + standard CIWA-Ar implementation (published scale; educational worksheet constraints)
- **User materials needed:** None for basic scale wiring (clinical disclaimer still required)

### 8. Face Shape Calculator

- **Path:** `Tools/Issued/Face Shape Calculator`
- **Prompt / screenshots:** Present (optional sex; forehead/cheeks/jawline/face length; Sharp/Somewhat/Round)
- **ISSUE_REASON:** Omni qualitative only; third-party clones disagree; jawline length vs width mapping unclear
- **Code:** None
- **Primary blocker:** Approved numeric heuristics + sex personalization rules
- **Cannot invent** proprietary thresholds from clones

### 9. Metastatic Prostate Cancer Prognosis Calculator

- **Path:** `Tools/Issued/Metastatic Prostate Cancer Prognosis Calculator`
- **Prompt / screenshots:** Present; results blank in screenshot; prompt forbids inventing LE estimates
- **Ownership:** Session 9 claim released `RELEASED_ISSUED` (`cursor-agent-pending-composer-mpc-s9`)
- **ISSUE_REASON:** Updated 2026-11-27 — Omni composite incomplete; Albertsen localized-only; mets/health/SSA merge unpublished; clones invent multipliers
- **Evidence pack:** `brain/reports/OMEGA-METASTATIC-PROSTATE-CLINICAL-EVIDENCE-PACK-composer-mpc-s9.md`
- **Decision:** `EVIDENCE_INSUFFICIENT_KEEP_ISSUED` + `MODEL_APPROVAL_REQUIRED` — **no code**
- **Code:** None
- **Historical Mongo:** `_id` `6af46f12a27d8d1d4e9902d7` (Session-1 live OK); Session 9 re-verify **failed** (`querySrv EBADRESP`)
- **Primary blocker:** Owner MODEL_APPROVAL + full coefficient/SSA/fixture pack (or retire tool)
- **Risk:** Highest — patient-facing prognosis numbers

### 10. Quiz Protein Creatinine Ratio Calculator

- **Path:** `Tools/Issued/Quiz Protein Creatinine Ratio Calculator`
- **Prompt / screenshots:** Present; **answers already listed** in prompt (kidney health; normalize concentration; protein leakage; kidneys; urine); score /5
- **ISSUE_REASON:** No live Mongo row for quiz title/slug; only seed name in `tools-catalog.json`; unrelated Quiz Stone exists; cannot invent `_id`
- **Code:** No quiz-protein module. Note: separate **Protein Creatinine Ratio Calculator** (non-quiz) **is** implemented at `frontend/src/tools/calculators/protein-creatinine-ratio/` with registry keys — **different product**, do not assign quiz under that identity
- **Primary blocker:** Authorized Mongo catalog create/restore for the quiz tool
- **Secondary:** After identity exists, quiz UI/engine is straightforward from prompt

---

## E. Screenshot / prompt recovery search

| Location | Result for Issued set |
| --- | --- |
| Issued folders themselves | All 10 have prompt + ≥1 PNG |
| `Tools/Pending` | Empty (0 folders) |
| `Tools/Progress` | Empty (0 folders) |
| `Tools/Completed` | 48 folders; none are the three duplicate health ratio tools (folders cleaned earlier); Body Type exists (related to Body Shape only) |
| `D:\Tools Prompt\Ready` | 70 folders; **no name match** for these 10 calculators |

**Conclusion:** No Issued tool is currently blocked solely by missing screenshots. Prior “missing screenshot” era (old 60+ Issued set) has been cleared for this remaining set.

---

## F. MongoDB status

| Check | Result |
| --- | --- |
| `backend/.env` `MONGODB_URI` present | Yes |
| Connect (Node + mongoose, 25s timeout) | **Failed** — `querySrv EBADRESP` |
| Alternate DNS resolveSrv via 8.8.8.8 / 1.1.1.1 | Failed same class |
| Live `_id` / flags this session | **MONGODB_UNVERIFIED** for all 10 |
| Catalog seed file | Names exist in `backend/data/tools-catalog.json` (name + category only; **no `_id`/slug**) |

Historical IDs from prior Brain reports / ISSUE_REASON (for planning only):

| Tool | Historical `_id` | Historical note |
| --- | --- | --- |
| Addiction | `6af46f12a27d8d1d4e9902f3` | Recovery report verified via DNS preload |
| Alcohol Unit | `6af46f12a27d8d1d4e9902f4` | Same |
| CIWA | `6af46f12a27d8d1d4e9902fb` | Same |
| Adrenal Washout | `6af46f12a27d8d1d4e9902ca` | ISSUE_REASON activation claim |
| Albumin ACR | `6af46f12a27d8d1d4e9902cb` | ISSUE_REASON |
| BUN | `6af46f12a27d8d1d4e9902cd` | ISSUE_REASON |
| Metastatic Prostate | `6af46f12a27d8d1d4e9902d7` | ISSUE_REASON live verify at issue time |
| Quiz PCR | — | Reported **missing** live row |
| Body Shape / Face Shape | — | Not live-verified in available reports |

---

## G. Ownership / multi-agent safety

- `Tools/Progress` = **0** → no concurrent calculator development ownership observed in the queue.
- Several Issued folders retain **stale** `.agent-claim` files from 2026-11-25. Treat as abandoned claim residue after ISSUED, not as `WAIT_FOR_ACTIVE_AGENT`.
- This investigation did **not** delete locks or move folders.
- Concurrent workspace churn observed only in `.omega-coordination/*` lock files (unrelated tools) — not used as Issued status evidence.

---

## H. Validation checklist

1. Rescanned Issued → **10** folders.  
2. Every folder has an investigation entry above.  
3. Simple-language guide + CSV + priorities companion reports created.  
4. Unique count = 10 (no double-count).  
5. CSV expected rows = 10.  
6. No calculator source code modified.  
7. No Mongo writes.  
8. No task folder moves.  
9. No Git commits / GitHub sync.  
10. Temporary Mongo probe scripts used outside repo and deleted.

**Temporary files cleaned:** YES
