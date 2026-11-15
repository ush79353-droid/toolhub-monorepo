import assert from 'node:assert/strict';
import {
  buildSinkingFundResult,
  calculateRequiredContribution,
  calculateUssfFactor,
  durationYears,
} from './calculation';
import { createDefaultInput } from './types';
import { validateSinkingFund } from './validation';

{
  const ussf = calculateUssfFactor(0.05, 5);
  assert.ok(ussf !== null);
  assert.ok(Math.abs(ussf - 0.1809748174) < 1e-9);
  const pay = calculateRequiredContribution(100_000, ussf);
  assert.ok(pay !== null);
  assert.ok(Math.abs(pay - 18_097.48174) < 1e-4);
}

{
  assert.equal(calculateUssfFactor(0, 5), 0.2);
  assert.equal(calculateRequiredContribution(100_000, 0.2), 20_000);
  assert.equal(calculateUssfFactor(-1, 5), null);
  assert.equal(calculateUssfFactor(0.05, 0), null);
}

{
  assert.equal(durationYears(5, 0), 5);
  assert.equal(durationYears(1, 6), 1.5);
  assert.equal(durationYears(0, 0), null);
  assert.equal(durationYears(1, 12), null);
}

{
  const res = buildSinkingFundResult(100_000, 5, 'annually', 5, 0, 'PKR');
  assert.ok(res);
  assert.ok(Math.abs(res.ussfFactor - 0.1809748174) < 1e-9);
  assert.ok(Math.abs(res.requiredContribution - 18_097.48174) < 1e-4);
}

{
  const monthly = buildSinkingFundResult(100_000, 5, 'monthly', 5, 0, 'PKR');
  assert.ok(monthly);
  assert.equal(monthly.periodsPerYear, 12);
  assert.equal(monthly.totalPeriods, 60);
}

{
  const v = validateSinkingFund({
    ...createDefaultInput(),
    moneyToAccumulate: '100000',
    annualInterestRatePercent: '5',
    periodYears: '5',
    periodMonths: '0',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.ok(Math.abs(v.result.ussfFactor - 0.1809748174) < 1e-9);
}

{
  const zeroRate = validateSinkingFund({
    ...createDefaultInput(),
    moneyToAccumulate: '100000',
    annualInterestRatePercent: '0',
    periodYears: '5',
    periodMonths: '0',
  });
  assert.equal(zeroRate.isValid, true);
  assert.equal(zeroRate.result?.ussfFactor, 0.2);
  assert.equal(zeroRate.result?.requiredContribution, 20_000);
}

console.log('sinking-fund calculation.test ok');
