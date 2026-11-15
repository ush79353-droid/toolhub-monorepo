import assert from 'node:assert/strict';
import {
  calculateCostPerPerson,
  calculateManHours,
  calculateManHoursResult,
  calculateTotalCost,
} from './calculation';
import { createDefaultInput } from './types';
import { validateManHoursInput } from './validation';

// Reference: 5 people × 8 hrs × PKR 500
{
  assert.equal(calculateManHours(5, 8), 40);
  assert.equal(calculateCostPerPerson(8, 500), 4_000);
  assert.equal(calculateTotalCost(40, 500), 20_000);
  const result = calculateManHoursResult(5, 8, 500, 'PKR');
  assert.ok(result);
  assert.equal(result!.manHours, 40);
  assert.equal(result!.costPerPerson, 4_000);
  assert.equal(result!.totalCost, 20_000);
}

// Zeros allowed
{
  assert.equal(calculateManHours(0, 8), 0);
  assert.equal(calculateManHours(5, 0), 0);
  assert.equal(calculateCostPerPerson(8, 0), 0);
  assert.equal(calculateTotalCost(0, 500), 0);
}

// Negatives → NaN
{
  assert.ok(Number.isNaN(calculateManHours(-1, 8)));
  assert.ok(Number.isNaN(calculateManHours(5, -1)));
  assert.ok(Number.isNaN(calculateCostPerPerson(8, -1)));
  assert.ok(Number.isNaN(calculateTotalCost(40, -1)));
}

// Blank defaults + validation
{
  const d = createDefaultInput();
  assert.equal(d.people, '');
  assert.equal(d.hoursPerPerson, '');
  assert.equal(d.hourlyPay, '');
  const blank = validateManHoursInput(d);
  assert.equal(blank.isValid, false);
  assert.equal(blank.incomplete, true);

  const ok = validateManHoursInput({
    people: '5',
    hoursPerPerson: '8',
    hourlyPay: '500',
    currency: 'PKR',
  });
  assert.equal(ok.isValid, true);
  assert.equal(ok.result?.totalCost, 20_000);

  const fractionalPeople = validateManHoursInput({
    people: '2.5',
    hoursPerPerson: '8',
    hourlyPay: '500',
    currency: 'PKR',
  });
  assert.equal(fractionalPeople.isValid, false);
  assert.ok(fractionalPeople.errors.people);
}

console.log('man-hours calculation.test.ts: ok');
