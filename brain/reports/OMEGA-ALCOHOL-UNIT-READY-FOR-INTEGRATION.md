# Alcohol Unit Calculator — READY_FOR_INTEGRATION

**Worker:** `cursor-agent-alcohol-unit-20261127`  
**Branch:** `omega/issued/alcohol-unit-calculator`  
**Worktree:** `D:\Project\ToolHub-worktrees\alcohol-unit-calculator`  
**Task folder:** `Tools/Progress/Alcohol Unit Calculator`  
**Credits:** `CREDITS_NOT_VERIFIABLE`

## Commits

1. UI: `590e360fc675af2867b2e7efed6da10fcfc3b2b3`
2. Engine: `193de3c13dbb5b93a22bb37cfb8f6044157f3dc7`
3. Integration: pending Coordinator (registry / `tool.key` / `tool:assign` / Brain / Completed move)

## Mongo (live)

- `_id` `6af46f12a27d8d1d4e9902f4`
- slug `alcohol-unit-calculator`
- undeveloped / inactive / **indexable false** (preserve)
- Proposed key: `AlcoholUnitCalculator`

## Verification

- `npx tsx …/alcohol-unit/calculation.test.ts` → ok
- Fixture 500 ml × 5% → 2.5 UK units
- No shared registry edits by worker
- No GitHub sync
- No BAC / driving claims

See `Tools/Progress/Alcohol Unit Calculator/READY_FOR_INTEGRATION.md` for full registry patch instructions.
