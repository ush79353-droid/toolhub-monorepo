/**
 * Runnable self-check for Free Cash Flow Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/free-cash-flow/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateFreeCashFlow } from './calculation';
import { createDefaultInput } from './types';
import { validateFreeCashFlowInput } from './validation';

{
  const r = calculateFreeCashFlow({
    operatingCashFlow: 500_000,
    capex: 120_000,
  });
  assert.ok(r);
  assert.equal(r.fcf, 380_000);
  assert.equal(r.fcfPerShare, null);
  assert.equal(r.fcfYieldPercent, null);
  assert.equal(r.fcfMarginPercent, null);
}

{
  const r = calculateFreeCashFlow({
    operatingCashFlow: 500_000,
    capex: 120_000,
    sharesOutstanding: 100_000,
    marketCap: 3_800_000,
    revenue: 2_000_000,
  });
  assert.ok(r);
  assert.equal(r.fcf, 380_000);
  assert.equal(r.fcfPerShare, 3.8);
  assert.equal(r.fcfYieldPercent, 10);
  assert.equal(r.fcfMarginPercent, 19);
}

{
  // Negative FCF when CapEx exceeds OCF.
  const r = calculateFreeCashFlow({
    operatingCashFlow: 100_000,
    capex: 150_000,
    marketCap: 1_000_000,
    revenue: 500_000,
  });
  assert.ok(r);
  assert.equal(r.fcf, -50_000);
  assert.equal(r.fcfYieldPercent, -5);
  assert.equal(r.fcfMarginPercent, -10);
}

{
  // Shares ≤ 0 → no per-share (null), not error at engine level.
  const r = calculateFreeCashFlow({
    operatingCashFlow: 100,
    capex: 10,
    sharesOutstanding: 0,
  });
  assert.ok(r);
  assert.equal(r.fcf, 90);
  assert.equal(r.fcfPerShare, null);
}

assert.equal(
  calculateFreeCashFlow({
    operatingCashFlow: Number.NaN,
    capex: 10,
  }),
  null
);

{
  const empty = validateFreeCashFlowInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const core = validateFreeCashFlowInput({
    ...createDefaultInput(),
    operatingCashFlow: '500000',
    capex: '120000',
  });
  assert.equal(core.isValid, true);
  assert.ok(core.result);
  assert.equal(core.result.fcf, 380_000);
  assert.equal(core.result.fcfPerShare, null);
  assert.equal(core.result.fcfYieldPercent, null);
}

{
  // Stock price alone does not invent market cap / yield.
  const priceOnly = validateFreeCashFlowInput({
    ...createDefaultInput(),
    operatingCashFlow: '500000',
    capex: '120000',
    stockPrice: '38',
  });
  assert.equal(priceOnly.isValid, true);
  assert.ok(priceOnly.result);
  assert.equal(priceOnly.result.fcfYieldPercent, null);
}

{
  const full = validateFreeCashFlowInput({
    ...createDefaultInput(),
    operatingCashFlow: '500000',
    capex: '120000',
    sharesOutstanding: '100000',
    stockPrice: '38',
    marketCap: '3800000',
    revenue: '2000000',
  });
  assert.equal(full.isValid, true);
  assert.ok(full.result);
  assert.equal(full.result.fcf, 380_000);
  assert.equal(full.result.fcfPerShare, 3.8);
  assert.equal(full.result.fcfYieldPercent, 10);
  assert.equal(full.result.fcfMarginPercent, 19);
  assert.equal(full.result.consistencyNote, null);
}

{
  // Soft consistency when price × shares ≠ market cap.
  const mismatch = validateFreeCashFlowInput({
    ...createDefaultInput(),
    operatingCashFlow: '100',
    capex: '0',
    sharesOutstanding: '10',
    stockPrice: '100',
    marketCap: '500',
  });
  assert.equal(mismatch.isValid, true);
  assert.ok(mismatch.result);
  assert.equal(mismatch.result.fcfYieldPercent, 20);
  assert.ok(mismatch.result.consistencyNote);
}

{
  const badShares = validateFreeCashFlowInput({
    ...createDefaultInput(),
    operatingCashFlow: '100',
    capex: '10',
    sharesOutstanding: '0',
  });
  assert.equal(badShares.isValid, true);
  assert.ok(badShares.result);
  assert.equal(badShares.result.fcfPerShare, null);
  assert.ok(badShares.errors.sharesOutstanding);
}

console.log('free-cash-flow calculation.test.ts: all assertions passed');
