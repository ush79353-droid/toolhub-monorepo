import assert from 'node:assert/strict';
import {
  calculateRoi,
  futureValueWithContributions,
  yearsBetweenDates,
} from './calculation';
import { createDefaultInput } from './types';
import { validateRoiInput } from './validation';

{
  const years = yearsBetweenDates('2026-11-15', '2031-11-15');
  assert.ok(years !== null);
  assert.ok(Math.abs(years! - 5) < 0.01);
}

{
  const res = calculateRoi({
    periodValue: 5,
    periodUnit: 'years',
    initialInvestment: 10_000,
    contributionFrequency: 'none',
    contributionAmount: 0,
    rateOfReturnPercent: null,
    returnedAmount: 15_000,
    sourceField: 'returned',
    startDate: '2026-11-15',
    endDate: '2031-11-15',
    currency: 'PKR',
  });
  assert.ok(res);
  assert.equal(res.totalGainLoss, 5_000);
  assert.equal(res.roiPercent, 50);
  assert.ok(res.annualizedRoiPercent !== null);
  assert.ok(Math.abs(res.annualizedRoiPercent! - 8.447177) < 0.001);
}

{
  const fromRate = calculateRoi({
    periodValue: 5,
    periodUnit: 'years',
    initialInvestment: 10_000,
    contributionFrequency: 'none',
    contributionAmount: 0,
    rateOfReturnPercent: 8.447177,
    returnedAmount: null,
    sourceField: 'rate',
    startDate: '2026-11-15',
    endDate: '2031-11-15',
    currency: 'PKR',
  });
  assert.ok(fromRate);
  assert.ok(Math.abs(fromRate.returnedAmount - 15_000) < 1);
}

{
  const fv = futureValueWithContributions(10_000, 0.06, 1, 1_000, 12);
  assert.ok(fv !== null);
  assert.ok(Math.abs(fv! - 22_952.34) < 0.05);
}

{
  const loss = calculateRoi({
    periodValue: 1,
    periodUnit: 'years',
    initialInvestment: 10_000,
    contributionFrequency: 'none',
    contributionAmount: 0,
    rateOfReturnPercent: null,
    returnedAmount: 8_000,
    sourceField: 'returned',
    startDate: '2026-01-01',
    endDate: '2027-01-01',
    currency: 'PKR',
  });
  assert.ok(loss);
  assert.equal(loss.totalGainLoss, -2_000);
  assert.equal(loss.roiPercent, -20);
}

{
  const v = validateRoiInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result?.roiPercent, 50);
}

{
  const bad = validateRoiInput({
    ...createDefaultInput(),
    initialInvestment: '0',
  });
  assert.equal(bad.isValid, false);
}

console.log('roi calculation.test ok');
