import assert from 'node:assert/strict';
import {
  calculateAnnualizedReturn,
  calculateGainOrLoss,
  calculatePercentageReturn,
  calculateTimeNeededYears,
  endDateFromDuration,
  yearsBetweenDates,
} from './calculation';
import { createDefaultInput } from './types';
import { syncDurationFields, validatePercentageReturn } from './validation';

{
  assert.equal(calculateGainOrLoss(10_000, 12_100), 2_100);
  assert.equal(calculatePercentageReturn(10_000, 12_100), 21);
  assert.ok(Math.abs((calculateAnnualizedReturn(10_000, 12_100, 2) ?? NaN) - 10) < 1e-10);
}

{
  assert.equal(calculateGainOrLoss(10_000, 8_000), -2_000);
  assert.equal(calculatePercentageReturn(10_000, 8_000), -20);
  assert.equal(calculateAnnualizedReturn(10_000, 0, 2), -100);
}

{
  assert.equal(calculateGainOrLoss(0, 100), null);
  assert.equal(calculatePercentageReturn(-1, 100), null);
  assert.equal(calculateAnnualizedReturn(10_000, 12_100, 0), null);
}

{
  const years = calculateTimeNeededYears(10_000, 12_100, 0.1);
  assert.ok(years !== null);
  assert.ok(Math.abs(years - 2) < 1e-10);
  assert.equal(calculateTimeNeededYears(10_000, 12_100, -1), null);
  assert.equal(calculateTimeNeededYears(10_000, 0, 0.1), null);
}

{
  assert.equal(yearsBetweenDates('2024-01-01', '2026-01-01'), 2);
  assert.equal(yearsBetweenDates('2026-01-01', '2024-01-01'), null);
  assert.equal(endDateFromDuration('2024-01-01', 2), '2026-01-01');
}

{
  const synced = syncDurationFields({
    ...createDefaultInput(),
    startDate: '2024-01-01',
    endDate: '2026-01-01',
    durationSource: 'endDate',
  });
  assert.equal(synced.durationYears, '2');
}

{
  const v = validatePercentageReturn({
    ...createDefaultInput(),
    investedAmount: '10000',
    returnedAmount: '12100',
    durationYears: '2',
    durationSource: 'duration',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.gainOrLoss, 2_100);
  assert.equal(v.result?.percentageReturn, 21);
  assert.ok(Math.abs((v.result?.annualizedReturn ?? NaN) - 10) < 1e-10);
}

{
  const time = validatePercentageReturn({
    ...createDefaultInput(),
    solveMode: 'time-needed',
    investedAmount: '10000',
    returnedAmount: '12100',
    annualizedRatePercent: '10',
  });
  assert.equal(time.isValid, true);
  assert.ok(Math.abs((time.result?.timeNeededYears ?? NaN) - 2) < 1e-10);
}

console.log('percentage-return calculation.test ok');
