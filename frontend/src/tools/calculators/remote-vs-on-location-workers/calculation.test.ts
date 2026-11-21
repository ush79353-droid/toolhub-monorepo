import assert from 'node:assert/strict';
import {
  calculateRemoteVsOnLocation,
  toMonthlyAmount,
  toMonths,
  toResult,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateRemoteVsOnLocationInput } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(toMonthlyAmount(5000, 'monthly'), 5000);
assertClose(toMonthlyAmount(60000, 'yearly'), 5000);
assertClose(toMonthlyAmount(1000, 'weekly'), (1000 * 52) / 12);
assertClose(toMonthlyAmount(9000, 'quarterly'), 3000);
assertClose(toMonthlyAmount(100, 'daily'), (100 * 365) / 12);

assertClose(toMonths(6, 'years'), 72);
assertClose(toMonths(12, 'months'), 12);
assertClose(toMonths(52, 'weeks'), 12);
assertClose(toMonths(365, 'days'), 12);

{
  const r = calculateRemoteVsOnLocation(
    12,
    12,
    'months',
    {
      employeeCount: 10,
      oneTimeAllowancePerEmployee: 20_000,
      recurringLines: [{ amount: 5_000, frequency: 'monthly' }],
    },
    {
      employeeCount: 10,
      officeSpaceType: 'own',
      oneTimeOfficeCost: 150_000,
      officeLease: { amount: 0, frequency: 'monthly' },
      recurringLines: [{ amount: 50_000, frequency: 'monthly' }],
    },
  );
  assert.ok(r);
  assert.equal(r!.remoteOneTimeCost, 200_000);
  assert.equal(r!.remoteRecurringCost, 600_000);
  assert.equal(r!.totalRemoteCost, 800_000);
  assert.equal(r!.onLocationOneTimeCost, 150_000);
  assert.equal(r!.onLocationRecurringCost, 600_000);
  assert.equal(r!.totalOnLocationCost, 750_000);
  assert.equal(r!.cheaperOption, 'on-location');
  assertClose(r!.remoteCostPerEmployee!, 80_000);
  assertClose(r!.onLocationCostPerEmployee!, 75_000);
}

{
  const r = calculateRemoteVsOnLocation(
    12,
    12,
    'months',
    {
      employeeCount: 0,
      oneTimeAllowancePerEmployee: 0,
      recurringLines: [],
    },
    {
      employeeCount: 10,
      officeSpaceType: 'lease',
      oneTimeOfficeCost: 100_000,
      officeLease: { amount: 30_000, frequency: 'monthly' },
      recurringLines: [{ amount: 20_000, frequency: 'monthly' }],
    },
  );
  assert.ok(r);
  assert.equal(r!.totalOnLocationCost, 700_000);
  assert.equal(r!.onLocationRecurringCost, 600_000);
}

{
  const r = calculateRemoteVsOnLocation(
    12,
    12,
    'months',
    {
      employeeCount: 10,
      oneTimeAllowancePerEmployee: 0,
      recurringLines: [{ amount: 5_000, frequency: 'monthly' }],
    },
    {
      employeeCount: 10,
      officeSpaceType: 'own',
      oneTimeOfficeCost: 0,
      officeLease: { amount: 99_999, frequency: 'monthly' },
      recurringLines: [{ amount: 40_000, frequency: 'monthly' }],
    },
  );
  assert.ok(r);
  // Own office must ignore lease amount.
  assert.equal(r!.onLocationRecurringCost, 480_000);
  assert.equal(r!.totalRemoteCost, 600_000);
}

{
  const r = calculateRemoteVsOnLocation(
    12,
    12,
    'months',
    {
      employeeCount: 5,
      oneTimeAllowancePerEmployee: 0,
      recurringLines: [{ amount: 10_000, frequency: 'monthly' }],
    },
    {
      employeeCount: 5,
      officeSpaceType: 'own',
      oneTimeOfficeCost: 0,
      officeLease: { amount: 0, frequency: 'monthly' },
      recurringLines: [{ amount: 60_000, frequency: 'monthly' }],
    },
  );
  assert.ok(r);
  assert.equal(r!.totalRemoteCost, 600_000);
  assert.equal(r!.totalOnLocationCost, 720_000);
  assert.equal(r!.cheaperOption, 'remote');
  assertClose(r!.costDifference, 120_000);
  assertClose(r!.remoteSavingsPercentage!, (120_000 / 720_000) * 100);
}

{
  const equal = calculateRemoteVsOnLocation(
    12,
    12,
    'months',
    {
      employeeCount: 1,
      oneTimeAllowancePerEmployee: 100,
      recurringLines: [],
    },
    {
      employeeCount: 1,
      officeSpaceType: 'own',
      oneTimeOfficeCost: 100,
      officeLease: { amount: 0, frequency: 'monthly' },
      recurringLines: [],
    },
  );
  assert.ok(equal);
  assert.equal(equal!.cheaperOption, 'equal');
}

assert.equal(
  calculateRemoteVsOnLocation(0, 0, 'months', {
    employeeCount: 1,
    oneTimeAllowancePerEmployee: 1,
    recurringLines: [],
  }, {
    employeeCount: 1,
    officeSpaceType: 'own',
    oneTimeOfficeCost: 1,
    officeLease: { amount: 0, frequency: 'monthly' },
    recurringLines: [],
  }),
  null,
);

{
  const ex = validateRemoteVsOnLocationInput(createExampleInput());
  assert.equal(ex.isValid, true);
  assert.equal(ex.result!.totalRemoteCost, 800_000);
  assert.equal(ex.result!.totalOnLocationCost, 750_000);
  assert.equal(ex.result!.cheaperOption, 'on-location');
}

{
  const defaults = validateRemoteVsOnLocationInput(createDefaultInput());
  assert.equal(defaults.isValid, true);
  assert.equal(defaults.result!.totalRemoteCost, 0);
  assert.equal(defaults.result!.totalOnLocationCost, 0);
}

{
  const negEmp = validateRemoteVsOnLocationInput({
    ...createDefaultInput(),
    remoteEmployees: '-1',
  });
  assert.equal(negEmp.isValid, false);
  assert.match(negEmp.errors.remoteEmployees ?? '', /negative/i);
}

{
  const frac = validateRemoteVsOnLocationInput({
    ...createDefaultInput(),
    onLocationEmployees: '1.5',
  });
  assert.equal(frac.isValid, false);
  assert.match(frac.errors.onLocationEmployees ?? '', /whole/i);
}

{
  const zeroPeriod = validateRemoteVsOnLocationInput({
    ...createDefaultInput(),
    periodValue: '0',
  });
  assert.equal(zeroPeriod.isValid, false);
}

{
  const yearly = validateRemoteVsOnLocationInput({
    ...createDefaultInput(),
    periodValue: '1',
    periodUnit: 'years',
    remoteEmployees: '1',
    remote: {
      ...createDefaultInput().remote,
      internet: '60000',
      internetFrequency: 'yearly',
    },
  });
  assert.equal(yearly.isValid, true);
  assertClose(yearly.result!.totalRemoteCost, 60_000);
}

{
  const formatted = toResult(
    calculateRemoteVsOnLocation(
      12,
      12,
      'months',
      {
        employeeCount: 10,
        oneTimeAllowancePerEmployee: 20_000,
        recurringLines: [{ amount: 5_000, frequency: 'monthly' }],
      },
      {
        employeeCount: 10,
        officeSpaceType: 'own',
        oneTimeOfficeCost: 150_000,
        officeLease: { amount: 0, frequency: 'monthly' },
        recurringLines: [{ amount: 50_000, frequency: 'monthly' }],
      },
    )!,
    'PKR',
  );
  assert.match(formatted.formattedTotalRemoteCost, /800[,]?000\.00/);
}

console.log('remote-vs-on-location-workers calculation.test.ts: all assertions passed');
