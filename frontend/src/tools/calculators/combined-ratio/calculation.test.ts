import assert from 'node:assert/strict';
import {
  buildFromComponents,
  formatMoney,
  formatPercent,
  solvePremiums,
  solveUnderwritingExpense,
} from './calculation';
import { createDefaultInput, createExampleAInput } from './types';
import { validateCombinedRatioInput } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

{
  const r = buildFromComponents(40_000_000, 5_000_000, 100_000_000, 25_000_000);
  assert.ok(r);
  assert.equal(r!.lossExpense, 45_000_000);
  assert.equal(r!.lossRatio, 45);
  assert.equal(r!.expenseRatio, 25);
  assert.equal(r!.combinedRatio, 70);
  assert.equal(r!.underwritingResult, 30_000_000);
  assert.equal(r!.underwritingMargin, 30);
  assert.equal(r!.status, 'profit');
}

{
  const r = buildFromComponents(50_000_000, 10_000_000, 100_000_000, 40_000_000);
  assert.ok(r);
  assert.equal(r!.combinedRatio, 100);
  assert.equal(r!.status, 'breakeven');
  assert.equal(r!.underwritingResult, 0);
}

{
  const r = buildFromComponents(70_000_000, 20_000_000, 100_000_000, 25_000_000);
  assert.ok(r);
  assert.equal(r!.combinedRatio, 115);
  assert.equal(r!.status, 'loss');
  assert.equal(r!.underwritingResult, -15_000_000);
}

{
  const r = solveUnderwritingExpense(85, 80_000_000, 50_000_000, 50_000_000, 0);
  assert.ok(r);
  assert.equal(r!.underwritingExpense, 18_000_000);
  assertClose(r!.combinedRatio, 85);
}

{
  const r = solvePremiums(100, 75_000_000, 25_000_000, 75_000_000, 0);
  assert.ok(r);
  assert.equal(r!.premiums, 100_000_000);
}

assert.equal(buildFromComponents(1, 0, 0, 1), null);
assert.equal(buildFromComponents(-1, 0, 100, 1), null);

{
  const ex = validateCombinedRatioInput(createExampleAInput());
  assert.equal(ex.isValid, true);
  assert.equal(ex.result!.combinedRatio, 70);
  assert.equal(ex.result!.formattedCombinedRatio, '70.00');
}

{
  const empty = validateCombinedRatioInput(createDefaultInput());
  assert.equal(empty.isValid, false);
}

{
  const zeroP = validateCombinedRatioInput({
    ...createExampleAInput(),
    premiums: '0',
  });
  assert.equal(zeroP.isValid, false);
  assert.match(zeroP.errors.premiums ?? '', /greater than zero/i);
}

{
  const reverse = validateCombinedRatioInput({
    ...createDefaultInput(),
    driver: 'combinedRatio',
    ratioSolveTarget: 'underwritingExpense',
    combinedRatio: '85',
    premiums: '80000000',
    lossExpense: '50000000',
    claimLoss: '50000000',
    lossAdjustments: '0',
  });
  assert.equal(reverse.isValid, true);
  assert.equal(reverse.result!.underwritingExpense, 18_000_000);
}

{
  const fromLe = validateCombinedRatioInput({
    ...createDefaultInput(),
    driver: 'lossExpense',
    fixedLossComponent: 'lossAdjustments',
    lossExpense: '45000000',
    lossAdjustments: '5000000',
    premiums: '100000000',
    underwritingExpense: '25000000',
  });
  assert.equal(fromLe.isValid, true);
  assert.equal(fromLe.result!.claimLoss, 40_000_000);
  assert.equal(fromLe.result!.combinedRatio, 70);
}

{
  const solveP = validateCombinedRatioInput({
    ...createDefaultInput(),
    driver: 'combinedRatio',
    ratioSolveTarget: 'premiums',
    combinedRatio: '100',
    lossExpense: '75000000',
    claimLoss: '75000000',
    lossAdjustments: '0',
    underwritingExpense: '25000000',
  });
  assert.equal(solveP.isValid, true);
  assert.equal(solveP.result!.premiums, 100_000_000);
}

assert.equal(formatMoney(1_250_000, 'USD'), '1,250,000.00');
assert.equal(formatPercent(70), '70.00');

console.log('combined-ratio calculation.test.ts: ok');
