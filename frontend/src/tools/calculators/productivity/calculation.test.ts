import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateRevenuePerEmployee,
  calculateRevenuePerWorkingHour,
  convertWorkingTimeToHours,
} from './calculation';
import { validateProductivityInput } from './validation';
import { createDefaultInput } from './types';

const TOL = 1e-9;

describe('productivity formulas', () => {
  it('Company Alpha: RPE 20k, RPH 125', () => {
    assert.equal(calculateRevenuePerEmployee(500000, 25), 20000);
    assert.equal(calculateRevenuePerWorkingHour(500000, 4000), 125);
  });

  it('screenshot-style 120k / 20 / 800', () => {
    assert.equal(calculateRevenuePerEmployee(120000, 20), 6000);
    assert.equal(calculateRevenuePerWorkingHour(120000, 800), 150);
  });

  it('small / large / freelancer', () => {
    assert.equal(calculateRevenuePerEmployee(100000, 10), 10000);
    assert.equal(calculateRevenuePerWorkingHour(100000, 2000), 50);
    assert.equal(calculateRevenuePerEmployee(2500000, 50), 50000);
    assert.equal(calculateRevenuePerWorkingHour(2500000, 80000), 31.25);
    assert.equal(calculateRevenuePerEmployee(12000, 1), 12000);
    assert.equal(calculateRevenuePerWorkingHour(12000, 160), 75);
  });

  it('zero revenue', () => {
    assert.equal(calculateRevenuePerEmployee(0, 5), 0);
    assert.equal(calculateRevenuePerWorkingHour(0, 800), 0);
  });

  it('zero / negative denominators → null', () => {
    assert.equal(calculateRevenuePerEmployee(50000, 0), null);
    assert.equal(calculateRevenuePerWorkingHour(50000, 0), null);
    assert.equal(calculateRevenuePerEmployee(-1000, 10), null);
    assert.equal(calculateRevenuePerWorkingHour(1500, -1), null);
  });

  it('decimal hours', () => {
    assert.equal(calculateRevenuePerWorkingHour(1500, 7.5), 200);
  });

  it('time conversions', () => {
    assert.ok(
      Math.abs(convertWorkingTimeToHours(1200, 'minutes')! - 20) < TOL
    );
    assert.ok(
      Math.abs(convertWorkingTimeToHours(7200, 'seconds')! - 2) < TOL
    );
    assert.equal(convertWorkingTimeToHours(40, 'hours'), 40);
  });

  it('minutes → RPH 300; seconds → RPH 1800', () => {
    const hMin = convertWorkingTimeToHours(1200, 'minutes')!;
    assert.equal(calculateRevenuePerWorkingHour(6000, hMin), 300);
    const hSec = convertWorkingTimeToHours(7200, 'seconds')!;
    assert.equal(calculateRevenuePerWorkingHour(3600, hSec), 1800);
  });

  it('large values', () => {
    assert.equal(calculateRevenuePerEmployee(1_000_000_000, 10_000), 100_000);
    assert.equal(
      calculateRevenuePerWorkingHour(1_000_000_000, 20_000_000),
      50
    );
  });

  it('RPE = RPH × hours/employees invariant', () => {
    const revenue = 120000;
    const employees = 20;
    const hours = 800;
    const rpe = calculateRevenuePerEmployee(revenue, employees)!;
    const rph = calculateRevenuePerWorkingHour(revenue, hours)!;
    assert.ok(Math.abs(rpe - rph * (hours / employees)) < TOL);
  });
});

describe('validateProductivityInput', () => {
  it('Company Alpha end-to-end', () => {
    const v = validateProductivityInput({
      ...createDefaultInput(),
      revenue: '500000',
      numberOfEmployees: '25',
      workingHours: '4000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.revenuePerEmployee, 20000);
    assert.equal(v.result?.revenuePerWorkingHour, 125);
  });

  it('independent branches: missing employees still yields hourly', () => {
    const v = validateProductivityInput({
      ...createDefaultInput(),
      revenue: '100000',
      workingHours: '2000',
    });
    assert.equal(v.result?.revenuePerEmployee, null);
    assert.equal(v.result?.revenuePerWorkingHour, 50);
  });

  it('independent branches: missing hours still yields employee', () => {
    const v = validateProductivityInput({
      ...createDefaultInput(),
      revenue: '100000',
      numberOfEmployees: '10',
    });
    assert.equal(v.result?.revenuePerEmployee, 10000);
    assert.equal(v.result?.revenuePerWorkingHour, null);
  });

  it('zero employees → error on field; hourly still works', () => {
    const v = validateProductivityInput({
      ...createDefaultInput(),
      revenue: '50000',
      numberOfEmployees: '0',
      workingHours: '800',
    });
    assert.ok(v.errors.numberOfEmployees);
    assert.equal(v.result?.revenuePerEmployee, null);
    assert.equal(v.result?.revenuePerWorkingHour, 62.5);
  });

  it('negative revenue → error', () => {
    const v = validateProductivityInput({
      ...createDefaultInput(),
      revenue: '-1000',
      numberOfEmployees: '10',
    });
    assert.ok(v.errors.revenue);
    assert.equal(v.result, null);
  });

  it('minutes conversion in validation', () => {
    const v = validateProductivityInput({
      ...createDefaultInput(),
      revenue: '6000',
      workingHours: '1200',
      workingHoursUnit: 'minutes',
    });
    assert.ok(Math.abs(v.result!.totalWorkingHours! - 20) < TOL);
    assert.equal(v.result?.revenuePerWorkingHour, 300);
  });

  it('all empty → no result', () => {
    assert.equal(validateProductivityInput(createDefaultInput()).result, null);
  });
});
