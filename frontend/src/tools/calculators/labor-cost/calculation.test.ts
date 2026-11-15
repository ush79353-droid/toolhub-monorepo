import assert from 'node:assert/strict';
import { buildLaborCostResult, sumAdditionalAnnualCosts } from './calculation';
import { createDefaultInput } from './types';

{
  const input = {
    ...createDefaultInput(),
    weeklyHours: 40,
    payRate: 10,
    absentDays: 15,
    taxes: 3900,
  };
  const res = buildLaborCostResult(input, { includeLaborCostPercent: false });
  assert.equal(res.grossHoursPerYear, 2080);
  assert.equal(res.grossPay, 20800);
  assert.equal(res.hoursNotWorked, 120);
  assert.equal(res.netHoursWorked, 1960);
  assert.equal(res.additionalAnnualCosts, 3900);
  assert.equal(res.annualPayrollLaborCost, 24700);
  assert.ok(res.hourlyLaborCost !== null);
  assert.ok(Math.abs(res.hourlyLaborCost - 12.6) < 1e-9);
  assert.equal(res.laborCostPercent, null);
}

{
  const input = {
    ...createDefaultInput(),
    weeklyHours: 40,
    payRate: 10,
    absentDays: 15,
    taxes: 3900,
    revenue: 80_000,
  };
  const res = buildLaborCostResult(input, { includeLaborCostPercent: true });
  assert.ok(res.laborCostPercent !== null);
  assert.ok(Math.abs(res.laborCostPercent - 30.875) < 1e-9);
}

{
  assert.equal(sumAdditionalAnnualCosts(createDefaultInput()), 0);
}

{
  const res = buildLaborCostResult(
    { ...createDefaultInput(), weeklyHours: 40, payRate: 10, absentDays: 0, revenue: 0 },
    { includeLaborCostPercent: true }
  );
  assert.equal(res.laborCostPercent, null);
}

console.log('labor-cost calculation.test ok');
