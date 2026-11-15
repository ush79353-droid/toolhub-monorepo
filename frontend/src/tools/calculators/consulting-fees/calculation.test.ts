import assert from 'node:assert/strict';
import { calculateConsultingFees, computeBillableDays, sumOperatingCosts } from './calculation';
import { createDefaultInput } from './types';

{
  const input = createDefaultInput();
  input.holidayDays = 20;
  input.sickDays = 5;
  input.nonClientDays = 30;
  assert.equal(computeBillableDays(input), 261 - 20 - 5 - 30);
}

{
  const input = createDefaultInput();
  input.advertising = 1000;
  input.officeRent = 500;
  assert.equal(sumOperatingCosts(input), 1500);
}

{
  const input = createDefaultInput();
  input.holidayDays = 10;
  input.sickDays = 5;
  input.nonClientDays = 46;
  input.targetIncome = 100_000;
  input.officeRent = 20_000;
  // billable = 261 - 10 - 5 - 46 = 200
  const res = calculateConsultingFees(input);
  assert.ok(res);
  assert.equal(res.billableDays, 200);
  assert.equal(res.annualOperatingCosts, 20_000);
  assert.equal(res.requiredAnnualRevenue, 120_000);
  assert.equal(res.dailyBillableRate, 600);
  assert.equal(res.hourlyRate, 75);
}

{
  const input = createDefaultInput();
  input.targetIncome = 50_000;
  input.workingHoursPerDay = 0;
  assert.equal(calculateConsultingFees(input), null);
}

console.log('consulting-fees calculation.test ok');
