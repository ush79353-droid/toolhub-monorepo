# Backend `tool.key.ts` allowlist

`backend/src/modules/tools/tool.key.ts` is the approved `componentKey` allowlist for `tool:assign`, admin validation, and embed helpers.

## When registering a calculator

1. Append the new key **once** to `APPROVED_COMPONENT_KEYS` (same string as frontend `keys.ts`).
2. Leave the file-bottom self-check as a **`for` loop** over `APPROVED_COMPONENT_KEYS`.
3. Keep the negative check `isApprovedComponentKey('EvilEval')` as a separate `if`.

## Forbidden

Do **not** rebuild or extend a mega logical expression such as:

```ts
if (
  !isApprovedComponentKey('FooCalculator') ||
  !isApprovedComponentKey('BarCalculator') ||
  // hundreds more…
  isApprovedComponentKey('EvilEval')
) {
  throw new Error('component key allowlist');
}
```

TypeScript binds nested `||` / `&&` recursively. A chain of hundreds of keys causes:

`RangeError: Maximum call stack size exceeded` during `npm run build` / `tsc`.

## Required self-check shape

```ts
for (const key of APPROVED_COMPONENT_KEYS) {
  if (!isApprovedComponentKey(key)) {
    throw new Error(`component key allowlist: ${key}`);
  }
}
if (isApprovedComponentKey('EvilEval')) {
  throw new Error('component key allowlist');
}
```

Only run that block when the file is executed directly (existing `isDirect` guard). Do not run it on every server boot.

## Verify after edits

- `cd backend && npm run build` (or `npm run type-check`)
- Optional: `npx tsx src/modules/tools/tool.key.ts` → `tool.key ok`
