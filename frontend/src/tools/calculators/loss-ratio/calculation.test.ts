import assert from 'node:assert/strict';
import {
  calculateLossRatio,
  formatPercent,
  interpretLossRatio,
  toLossRatioResult,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateLossRatioInput } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

{
  const r = calculateLossRatio(1000, 500, 30);
  assert.ok(r);
  assert.equal(r!.totalLossRelatedCosts, 530);
  assertClose(r!.lossRatio, 53);
  assert.equal(r!.premiumsRemaining, 470);
}

{
  const r = calculateLossRatio(1000, 250, 50);
  assert.ok(r);
  assertClose(r!.lossRatio, 30);
}

{
  const r = calculateLossRatio(2000, 1200, 100);
  assert.ok(r);
  assertClose(r!.lossRatio, 65);
}

{
  const r = calculateLossRatio(1000, 950, 100);
  assert.ok(r);
  assertClose(r!.lossRatio, 105);
  assert.equal(r!.premiumsRemaining, -50);
}

{
  const r = calculateLossRatio(500, 0, 0);
  assert.ok(r);
  assertClose(r!.lossRatio, 0);
  assert.match(interpretLossRatio(0), /0\.00%/);
}

{
  const r = calculateLossRatio(10_000_000, 3_500_000, 1_800_000);
  assert.ok(r);
  assertClose(r!.lossRatio, 53);
  assert.equal(r!.totalLossRelatedCosts, 5_300_000);
}

assert.equal(calculateLossRatio(0, 100, 20), null);
assert.equal(calculateLossRatio(-1, 100, 20), null);
assert.equal(calculateLossRatio(1000, -1, 0), null);
assert.equal(calculateLossRatio(1000, 0, -1), null);

{
  const ex = validateLossRatioInput(createExampleInput());
  assert.equal(ex.isValid, true);
  assertClose(ex.result!.lossRatio, 53);
  assert.equal(ex.result!.formattedLossRatio, '53.00');
  assert.equal(ex.result!.currency, 'PKR');
}

{
  const empty = validateLossRatioInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const zeroP = validateLossRatioInput({
    ...createExampleInput(),
    premiumsEarned: '0',
  });
  assert.equal(zeroP.isValid, false);
  assert.match(zeroP.errors.premiumsEarned ?? '', /greater than zero/i);
}

{
  const negClaims = validateLossRatioInput({
    ...createExampleInput(),
    claimsPaid: '-1',
  });
  assert.equal(negClaims.isValid, false);
  assert.match(negClaims.errors.claimsPaid ?? '', /negative/i);
}

{
  const negExp = validateLossRatioInput({
    ...createExampleInput(),
    lossAdjustmentExpenses: '-5',
  });
  assert.equal(negExp.isValid, false);
  assert.match(negExp.errors.lossAdjustmentExpenses ?? '', /negative/i);
}

{
  const partial = validateLossRatioInput({
    ...createDefaultInput(),
    premiumsEarned: '1000',
    claimsPaid: '',
    lossAdjustmentExpenses: '0',
  });
  assert.equal(partial.isValid, false);
  assert.equal(partial.result, null);
}

{
  const decimals = validateLossRatioInput({
    ...createDefaultInput(),
    premiumsEarned: '1000.00',
    claimsPaid: '250.50',
    lossAdjustmentExpenses: '49.50',
  });
  assert.equal(decimals.isValid, true);
  assertClose(decimals.result!.lossRatio, 30);
}

{
  const large = validateLossRatioInput({
    ...createDefaultInput(),
    premiumsEarned: '1e12',
    claimsPaid: '5e11',
    lossAdjustmentExpenses: '1e11',
  });
  assert.equal(large.isValid, true);
  assert.ok(Number.isFinite(large.result!.lossRatio));
  assertClose(large.result!.lossRatio, 60);
}

{
  const formatted = toLossRatioResult(
    calculateLossRatio(1000, 500, 30)!,
    'PKR',
  );
  assert.equal(formatPercent(formatted.lossRatio), '53.00');
  assert.equal(formatted.formattedTotalLossRelatedCosts, '530.00');
}

console.log('loss-ratio calculation.test.ts: all assertions passed');
