/**
 * Runnable self-check for Salary Inflation Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/salary-inflation/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateSalaryInflation } from './calculation';
import {
  createDefaultInput,
  EXAMPLE_BEAT_INFLATION,
  EXAMPLE_PURCHASING_POWER_LOSS,
} from './types';
import { validateSalaryInflationInput } from './validation';

{
  const r = calculateSalaryInflation({
    referenceSalary: 100_000,
    inflationPercent: 5,
    currentSalary: 110_000,
  });
  assert.ok(r);
  assert.equal(r.adjustedSalary, 105_000);
  assert.equal(r.gainLoss, 5_000);
}

{
  // Flat current pay vs inflation → purchasing-power loss.
  const r = calculateSalaryInflation({
    referenceSalary: 100_000,
    inflationPercent: 10,
    currentSalary: 100_000,
  });
  assert.ok(r);
  assert.ok(Math.abs(r.adjustedSalary - 110_000) < 1e-6);
  assert.ok(Math.abs(r.gainLoss - -10_000) < 1e-6);
}

{
  // Zero inflation → adjusted = reference; gain = current − reference.
  const r = calculateSalaryInflation({
    referenceSalary: 80_000,
    inflationPercent: 0,
    currentSalary: 85_000,
  });
  assert.ok(r);
  assert.equal(r.adjustedSalary, 80_000);
  assert.equal(r.gainLoss, 5_000);
}

{
  // Deflation (above −100%).
  const r = calculateSalaryInflation({
    referenceSalary: 100_000,
    inflationPercent: -5,
    currentSalary: 100_000,
  });
  assert.ok(r);
  assert.equal(r.adjustedSalary, 95_000);
  assert.equal(r.gainLoss, 5_000);
}

assert.equal(
  calculateSalaryInflation({
    referenceSalary: 100,
    inflationPercent: -100,
    currentSalary: 100,
  }),
  null
);

assert.equal(
  calculateSalaryInflation({
    referenceSalary: Number.NaN,
    inflationPercent: 5,
    currentSalary: 100,
  }),
  null
);

assert.equal(
  calculateSalaryInflation({
    referenceSalary: -1,
    inflationPercent: 5,
    currentSalary: 100,
  }),
  null
);

{
  const empty = validateSalaryInflationInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const beat = validateSalaryInflationInput(EXAMPLE_BEAT_INFLATION);
  assert.equal(beat.isValid, true);
  assert.ok(beat.result);
  assert.equal(beat.result.adjustedSalaryCanonical, 105_000);
  assert.equal(beat.result.gainLossCanonical, 5_000);
}

{
  const loss = validateSalaryInflationInput(EXAMPLE_PURCHASING_POWER_LOSS);
  assert.equal(loss.isValid, true);
  assert.ok(loss.result);
  assert.ok(Math.abs(loss.result.adjustedSalaryCanonical - 110_000) < 1e-6);
  assert.ok(Math.abs(loss.result.gainLossCanonical - -10_000) < 1e-6);
}

{
  const badInflation = validateSalaryInflationInput({
    ...createDefaultInput(),
    referenceSalary: '100000',
    inflationPercent: '-100',
    currentSalary: '100000',
  });
  assert.equal(badInflation.isValid, false);
  assert.ok(badInflation.errors.inflationPercent);
}

{
  const negRef = validateSalaryInflationInput({
    ...createDefaultInput(),
    referenceSalary: '-1',
    inflationPercent: '5',
    currentSalary: '100000',
  });
  assert.equal(negRef.isValid, false);
  assert.ok(negRef.errors.referenceSalary);
}

console.log('salary-inflation calculation.test.ts: all assertions passed');
