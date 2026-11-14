import assert from 'node:assert/strict';
import {
  buildSmokersCtcResult,
  LIFE_MINUTES_PER_CIGARETTE,
  toHourlyWage,
  workdaysPerYear,
} from './calculation';
import { createDefaultInput } from './types';

// Defaults: 15 min × 3 breaks, 5 days/week, 10 holidays → 250 workdays
{
  const input = createDefaultInput();
  input.wage = 10;
  input.packPrice = 8;
  const result = buildSmokersCtcResult(input);
  assert.equal(result.dailySmokingMinutes, 45);
  assert.equal(result.weeklySmokingMinutes, 225);
  assert.equal(workdaysPerYear(5, 10), 250);
  assert.equal(result.workdaysPerYear, 250);
  assert.ok(result.dailyLaborCost !== null);
  assert.equal(result.dailyLaborCost, 7.5);
  assert.equal(result.weeklyLaborCost, 37.5);
  assert.equal(result.yearlyLaborCost, 1875);
  assert.equal(result.monthlyLaborCost, 156.25);
  assert.equal(result.weeklyCigaretteCost, 6);
  assert.equal(result.yearlyCigaretteCost, 300);
  // Life line uses 5×52 before holidays → 5.958 days
  assert.ok(result.lifeExpectancyDays !== null);
  assert.ok(Math.abs(result.lifeExpectancyDays! - 5.958333333333333) < 1e-9);
  assert.equal(LIFE_MINUTES_PER_CIGARETTE, 11);
}

{
  assert.equal(toHourlyWage(80, 'daily', 8, 5, 10), 10);
  assert.equal(toHourlyWage(400, 'weekly', 8, 5, 10), 10);
  assert.equal(toHourlyWage(10, 'hourly', 0, 5, 10), null);
  assert.equal(toHourlyWage(Number.NaN, 'hourly', 8, 5, 10), null);
}

{
  const blank = buildSmokersCtcResult(createDefaultInput());
  assert.equal(blank.dailyLaborCost, null);
  assert.equal(blank.weeklyCigaretteCost, null);
  assert.equal(blank.dailySmokingMinutes, 45);
}

console.log('smokers-ctc calculation.test.ts: ok');
