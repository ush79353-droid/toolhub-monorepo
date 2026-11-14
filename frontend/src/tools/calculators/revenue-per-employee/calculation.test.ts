import assert from 'node:assert/strict';
import { calculateRevenuePerEmployee } from './calculation';
import { createDefaultInput } from './types';
import { validateRevenuePerEmployeeInput } from './validation';

{
  const res = calculateRevenuePerEmployee(5_000_000, 25, 'PKR');
  assert.ok(res);
  assert.equal(res.revenuePerEmployee, 200_000);
  assert.equal(res.formattedRevenuePerEmployee, '200,000.00');
}

{
  const res = calculateRevenuePerEmployee(0, 10, 'PKR');
  assert.ok(res);
  assert.equal(res.revenuePerEmployee, 0);
}

{
  assert.equal(calculateRevenuePerEmployee(100, 0, 'PKR'), null);
  assert.equal(calculateRevenuePerEmployee(-1, 5, 'PKR'), null);
  assert.equal(calculateRevenuePerEmployee(100, 2.5, 'PKR'), null);
}

{
  const v = validateRevenuePerEmployeeInput({
    ...createDefaultInput(),
    revenue: '5000000',
    employeeCount: '25',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.revenuePerEmployee, 200_000);
}

{
  const v = validateRevenuePerEmployeeInput({
    ...createDefaultInput(),
    revenue: '',
    employeeCount: '25',
  });
  assert.equal(v.isValid, false);
  assert.equal(Object.keys(v.errors).length, 0);
}

console.log('revenue-per-employee calculation.test ok');
