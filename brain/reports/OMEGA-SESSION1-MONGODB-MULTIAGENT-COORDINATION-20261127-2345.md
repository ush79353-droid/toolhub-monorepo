# OMEGA SESSION 1 — MongoDB Recovery & Multi-Agent Coordination

**Run ID:** `sess-infra-coord-20261127-2345`  
**Role:** Infrastructure & Multi-Agent Coordination Lead  
**Date:** 2026-11-27  
**Root workspace:** `D:\Project\ToolHub` (branch `development`)  
**Policy followed:** No calculator UI/engine work · no Mongo writes · no GitHub sync · no secret printing · no Tools folder moves · local-only Git policy

---

## 1. MongoDB connectivity result

### Verdict

| Mode | Result |
| --- | --- |
| Default `mongodb+srv` via system/Google/Cloudflare Node resolvers | **FAIL** — `querySrv EBADRESP` (and often `queryTxt`/`queryA` EBADRESP) |
| Process-local Quad9 (`9.9.9.9` / `149.112.112.112`) + still `mongodb+srv` | SRV/TXT resolve OK, but **mongoose serverSelectionTimeout** (25s) |
| **Approved workaround: direct seedlist URI** (hosts from Quad9 SRV + TXT replicaSet) | **CONNECT=OK** — DB `omega_calculators` |

**Atlas connectivity is AVAILABLE for read-only catalog work when agents use the direct-seedlist recipe below.**  
Do **not** claim plain `mongodb+srv` “just works” on this machine without the workaround.

### Diagnostics (evidence)

- Env: `backend/.env` present; `MONGODB_URI` scheme `mongodb+srv`; host `cluster0.pa6smuw.mongodb.net` (credentials never printed).
- Backend `connectDB()` (`backend/src/config/database.ts`) uses stock `mongoose.connect(env.MONGODB_URI)` — no DNS preload built-in.
- System DNS servers observed: `8.8.8.8`, `8.8.4.4`.
- Node `dns.Resolver`:
  - Google / Cloudflare: SRV `EBADRESP`
  - System default: SRV `EBADRESP`, TXT sometimes OK (`authSource=admin&replicaSet=atlas-uyw9a2-shard-0`)
  - **Quad9:** SRV OK → three shard hosts on port **27017**
- `nslookup -type=SRV … 8.8.8.8` succeeded (Windows nslookup ≠ Node c-ares behavior).
- TCP `27017` to all three shard hostnames/IPs: **succeeded**.
- Client public IP (allowlist context only): `119.157.79.228` — network path is open; problem is primarily **Node SRV DNS**, not Atlas IP block.

### Safe process-local connection recipe (agents)

**Do not** change machine-wide DNS, commit `.env`, or disable auth.

1. Resolve SRV with process-local Quad9 (`dns.setServers(['9.9.9.9','149.112.112.112'])`).
2. Read TXT for `replicaSet` + `authSource` (observed: `atlas-uyw9a2-shard-0`, `admin`).
3. Build **in-memory only** a direct URI:

```text
mongodb://<user>:<pass>@
  ac-kbrgsnh-shard-00-00.pa6smuw.mongodb.net:27017,
  ac-kbrgsnh-shard-00-01.pa6smuw.mongodb.net:27017,
  ac-kbrgsnh-shard-00-02.pa6smuw.mongodb.net:27017
  /omega_calculators?replicaSet=atlas-uyw9a2-shard-0&authSource=admin&tls=true
```

4. Prefer re-resolving SRV each session — do not hardcode IPs into committed files.
5. Log only redacted URIs (`//***:***@…`).
6. `tool:assign` / `connectDB()` may still fail until the same workaround is applied in-process; Integration Coordinator owns assign when DNS/SRV is flaky.

**Temporary diagnostic scripts:** created under `%TEMP%` only and deleted.  
**Temporary files cleaned:** YES

---

## 2. Confirmed catalog identities (LIVE)

Database: `omega_calculators` · Collection: `tools` · Category for health targets: **Health & Fitness** `_id=6af451c1a27d8d1d4e98f97f` · slug `health-fitness`

| Tool | `_id` (LIVE) | Slug (LIVE) | componentKey | pillar / subPillar | isDeveloped | isActive | indexable | Hint match |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Addiction Calculator | `6af46f12a27d8d1d4e9902f3` | `addiction-calculator` | *(absent/empty)* | null / null | **false** | **false** | **false** | YES |
| Alcohol Unit Calculator | `6af46f12a27d8d1d4e9902f4` | `alcohol-unit-calculator` | *(absent/empty)* | null / null | **false** | **false** | **false** | YES |
| CIWA Calculator | `6af46f12a27d8d1d4e9902fb` | `ciwa-calculator` | *(absent/empty)* | null / null | **false** | **false** | **false** | YES |
| Body Shape Calculator | `6af46f12a27d8d1d4e9902a1` | `body-shape-calculator` | *(absent/empty)* | null / null | **false** | **false** | **false** | n/a (new live ID) |
| Face Shape Calculator | `6af46f12a27d8d1d4e9902a7` | `face-shape-calculator` | *(absent/empty)* | null / null | **false** | **false** | **false** | n/a (new live ID) |
| Metastatic Prostate Cancer Prognosis Calculator | `6af46f12a27d8d1d4e9902d7` | `metastatic-prostate-cancer-prognosis-calculator` | *(absent/empty)* | null / null | **false** | **false** | **false** | YES |

Uniqueness: each of the six returned **exactly one** document by name and by slug. No ambiguous duplicates among these six.

### Related identity (NOT a Session-1 development target, but protected)

| Tool | `_id` | Slug | componentKey | isDeveloped | isActive | indexable |
| --- | --- | --- | --- | --- | --- | --- |
| Protein Creatinine Ratio Calculator | `6af46f12a27d8d1d4e9902d9` | `protein-creatinine-ratio-calculator` | `ProteinCreatinineRatioCalculator` | true | true | false |

**Forbidden:** assigning Quiz work to this PCR identity.

### Near-name trap

| Tool | `_id` | Slug | Note |
| --- | --- | --- | --- |
| Face Shape Detector | `6af46f1aa27d8d1d4e990f8b` | `face-shape-detector` | Different product — do not use for Face Shape Calculator |

---

## 3. Missing catalog records

| Proposed tool | Live status |
| --- | --- |
| **Quiz: Protein Creatinine Ratio Calculator** / `quiz-protein-creatinine-ratio-calculator` | **MISSING** — name count 0, slug count 0, fuzzy quiz+protein+creatinine count 0 |
| Seed file only | Name exists in `backend/data/tools-catalog.json` (category Health & Fitness; no `_id`) |

**No catalog row was created in this session.**

---

## 4. Proposed Quiz catalog authorization request (DO NOT CREATE YET)

Owner authorization required before any insert/seed/upsert.

### Proposed fields (aligned with live undeveloped peers + Quiz: Stone conventions)

| Field | Proposed value | Rationale |
| --- | --- | --- |
| `name` | `Quiz: Protein Creatinine Ratio Calculator` | Exact Issued / seed name |
| `nameKey` | `quiz: protein creatinine ratio calculator` | Matches live pattern (`addiction calculator`, `quiz: stone calculator`) |
| `slug` | `quiz-protein-creatinine-ratio-calculator` | Unique; mirrors other quiz slugs |
| `category` | `ObjectId("6af451c1a27d8d1d4e98f97f")` | Health & Fitness (same as PCR / CIWA peers) |
| `pillar` | `null` | Same as peer health tools |
| `subPillar` | `null` | Same |
| `executionType` | `client` | Schema default; quiz is client-side |
| `componentKey` | `''` (empty) until authorized `tool:assign` | Do not invent assign before module |
| `shortDescription` | *(catalog-style one-liner; Integration Coordinator may set via assign flags)* | Follow assign CLI |
| `metaTitle` | `Quiz: Protein Creatinine Ratio Calculator \| Omega Calculators` | Peer pattern |
| `isDeveloped` | `false` | Explicit — do not rely on schema default `true` |
| `isActive` | `false` | Undeveloped peers are inactive |
| `indexable` | `false` | Preserve publishing policy |
| `embedEnabled` | `true` (default) unless admin says otherwise | ADR embed default |
| `sitemapInclude` | follow peer/default; public URL only after active+indexable+SEO rules | Do not force sitemap |

**Explicit exclusions**

- Do **not** reuse `_id` `6af46f12a27d8d1d4e9902d9`.
- Do **not** set `componentKey` to `ProteinCreatinineRatioCalculator`.
- Proposed future componentKey (after module exists): `QuizProteinCreatinineRatioCalculator` (Integration Coordinator registers in `keys.ts` / `tool.key.ts`).

---

## 5. Approved isolated-worktree / locking strategy

### Git reality (this machine)

- Single worktree today: `D:/Project/ToolHub` on `development` (`d1bb02ee`).
- Local branch is **ahead 141 / behind 18** vs `origin/development` — **no fetch/pull/push** in this session.
- Disk free on `D:` ≈ 235 GB — worktrees feasible.
- Proposed parent (outside `Tools/`): `D:\Project\ToolHub-worktrees` (**not created this session** — create when agents are assigned).

### Approved strategy

**Preferred (when an agent is assigned a tool):**

```text
git worktree add -b omega/issued/<calculator-slug> D:\Project\ToolHub-worktrees\<calculator-slug> development
```

Examples:

- `omega/issued/alcohol-unit-calculator`
- `omega/issued/ciwa-calculator`
- `omega/issued/addiction-calculator`
- …

Rules:

1. Root `D:\Project\ToolHub` stays on `development` for Integration Coordinator + Tools queue.
2. Workers commit **only** inside their calculator module path under their worktree.
3. Workers do **not** edit shared registries, `tool.key.ts`, sitemap, Brain docs, or run `tool:assign`.
4. Workers never `git push|pull|fetch`.
5. When UI+engine+tests are done, worker marks **`READY_FOR_INTEGRATION`** (not Completed).
6. Integration Coordinator serializes merges into root `development`, then registry/Mongo/folder moves.

**If worktree add is blocked:** fall back to exclusive `.omega-coordination` locks + **serialized** `git-ops` lock for any commit. Never two agents committing through the same index concurrently.

### Shared-file locks (current)

| Lock | Status |
| --- | --- |
| `git-ops` | RELEASED |
| `keys.ts` / `registry-keys.ts` / `registry-index.ts` / `registry-details.ts` / `tool-key.ts` / `brain-docs` | RELEASED |
| `sitemap.ts` / `registry-crcl` | status=released (stale agentId lines may remain — treat as released) |

Integration Coordinator must re-acquire these locks exclusively during final wiring.

---

## 6. Exact safe development instructions for other agents

### A. What you MAY do (after task claim)

1. Read this report + Issued `prompt.txt` / screenshots / `ISSUE_REASON.txt`.
2. Claim ownership keyed to **verified slug + `_id`** (not folder name alone) via existing `.omega-coordination/.agent-claim/<slug>/` + Tools Progress claim procedure.
3. Work in an isolated worktree/branch for your slug.
4. Implement **only** `frontend/src/tools/calculators/<module>/` (ADR-018: `calculation.ts`, `validation.ts`, `types.ts`, `detail.tsx`, tests, UI pieces).
5. Run focused calculation self-checks.
6. Local commits on your branch (UI then engine per ADR-019 — **stop before registration commit** if that commit would touch shared registries). Prefer reporting READY_FOR_INTEGRATION with module commits only.
7. Preserve screenshots/prompts; no destructive Tools cleanup.

### B. What you MUST NOT do

- Edit `registry/keys.ts`, `registry/index.ts`, `registry/details.ts`, `backend/.../tool.key.ts`, sitemap, or Brain docs.
- Run `npm run tool:assign` / create Mongo rows / flip `isActive`.
- Move folders Issued→Progress→Completed without Coordinator.
- Touch another agent’s module or the PCR non-quiz module for the quiz task.
- Use Face Shape Detector identity for Face Shape Calculator.
- `git push`, `git pull`, `git fetch`, force-push, reset, `git clean -fd`.
- Print or commit secrets / full Mongo URIs.

### C. Per-tool readiness for parallel workers

| Slug | Mongo ready? | Spec/formula blocker | Ownership note | Worker may start module? |
| --- | --- | --- | --- | --- |
| `alcohol-unit-calculator` | YES — `_id` confirmed | Formula sufficient in prompt | Coord claim ISSUED (stale); Issued folder lock residue | **YES** after fresh claim |
| `ciwa-calculator` | YES | CIWA-Ar published scale; educational disclaimer | No coord claim; Issued folder lock residue | **YES** after fresh claim |
| `addiction-calculator` | YES | Needs verified exposure/country evidence pack | RELEASED_ISSUED (mongo-dns) — DNS now workable | **ONLY if** evidence pack approved |
| `body-shape-calculator` | YES — `_id` `…9902a1` | Needs approved rule table / Body Type reuse approval | **CLAIMED** investigation `cursor-agent-pending-composer-body-shape-s6` (exclusive) | **WAIT** for that claim release / handoff |
| `face-shape-calculator` | YES — `_id` `…9902a7` | Needs approved heuristics | RELEASED Issued | **ONLY if** heuristics pack approved |
| `metastatic-prostate-cancer-prognosis-calculator` | YES | Clinical coefficient/SSA pack required | RELEASED_ISSUED | **NO coding** until clinical pack approved |
| `quiz-protein-creatinine-ratio-calculator` | **NO row** | Answers in prompt — blocked on catalog create | No claim | **NO** until owner authorizes catalog seed |

### D. Integration Coordinator checklist (later session)

1. Acquire `git-ops` + registry + `tool-key` + sitemap locks.
2. Merge worker branches one at a time into root `development`.
3. Append keys / lazy imports / details / `APPROVED_COMPONENT_KEYS` (loop self-check only).
4. Apply Mongo connect workaround → `tool:assign` with **live** `--id` / `--slug` / `--expected-pillar null` / `--expected-subpillar null`.
5. Verify route; then authorized Tools folder move.
6. Worker status may become Completed only after this.

---

## 7. Task ownership / Tools queue snapshot

| Queue | Count |
| --- | --- |
| Issued | 10 |
| Progress | 0 |
| Pending | 0 |
| Completed | 48 |

- Stale timestamp alone ≠ reclaim. For Issued residues: require ISSUE_REASON present, Progress empty for that tool, and coord claim `RELEASED*` / absent — then **new claim** with live `_id`.
- Body Shape currently has an **active exclusive investigation claim** — do not steal.
- Do not delete screenshots, prompts, or ISSUE_REASON files.

---

## 8. Infrastructure blockers remaining

1. **Stock `mongodb+srv` path unreliable** on this host (Node `EBADRESP`) — agents/scripts must use Quad9 + direct seedlist (or Integration Coordinator wraps `connectDB`).
2. **Quiz catalog row missing** — owner authorization required before any development that needs `tool:assign`.
3. **Formula/clinical packs** still block Addiction, Body Shape, Face Shape, Metastatic (Mongo is no longer the primary blocker for those).
4. **Body Shape exclusive investigation claim** active.
5. **Git divergence** (ahead 141 / behind 18) — do not fetch/pull/push; Coordinator must plan local-only merges carefully later.
6. Shared lock files sometimes leave stale `agentId` lines even when `status=released` — always read full lock body.

---

## 9. What this session did / did not do

| Done | Not done |
| --- | --- |
| DNS/Atlas diagnostics | Calculator UI/engines |
| Live catalog verification for 6 tools | Creating Quiz Mongo row |
| Documented connection recipe | Creating worktrees on disk |
| Multi-agent / registry serialization policy | `tool:assign` / activation |
| Quiz authorization proposal drafted | GitHub sync / fetch / push |
| Temp scripts cleaned | Claiming Issued tools for development |

---

## 10. Bottom line for parallel agents

**Mongo is recoverable now** with the direct-seedlist workaround.  
**Six of seven** Issued targets have **confirmed unique undeveloped catalog rows** — historical IDs for Addiction, Alcohol Unit, CIWA, and Metastatic **reconfirmed live**; Body Shape and Face Shape live IDs newly confirmed.  
**Quiz is missing** and needs owner authorization.  
**Develop modules in isolated worktrees; leave registries/Mongo/folder moves to the Integration Coordinator; report `READY_FOR_INTEGRATION`.**
