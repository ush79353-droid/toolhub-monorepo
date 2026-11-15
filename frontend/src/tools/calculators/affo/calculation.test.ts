import assert from 'node:assert/strict';
import { calculateAffo } from './calculation';
import { DEFAULT_AFFO_INPUT, type AffoInput } from './types';
import { parseOptionalNumber, validateAffo } from './validation';

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ok - ${description}`);
  } catch (err) {
    console.error(`  FAIL - ${description}`);
    throw err;
  }
}

function withInput(patch: Partial<AffoInput>): AffoInput {
  return { ...DEFAULT_AFFO_INPUT, ...patch };
}

console.log('Running AFFO calculator unit tests...');

test('basic FFO adds eligible depreciation and losses and subtracts gains', () => {
  const result = calculateAffo(
    withInput({
      netIncome: 100,
      realEstateDepreciation: 40,
      propertySaleLosses: 5,
      propertySaleGains: 15,
      interestIncome: 10,
      straightLineRentAdjustment: 0,
      recurringMaintenanceCapex: 0,
      maintenanceAdjustment: 0,
      noncashCompensation: 0,
      debtIssuanceAmortization: 0,
      leaseAmortizationAdjustment: 0,
    })
  );
  assert.equal(result.ffo, 130);
  assert.equal(result.interestIncome, 10);
  assert.equal(result.ffoAdditions, 45);
  assert.equal(result.ffoDeductions, 15);
});

test('interest income already in net income is not applied a second time', () => {
  const base = withInput({
    netIncome: 100,
    realEstateDepreciation: 0,
    propertySaleLosses: 0,
    propertySaleGains: 0,
    interestIncome: 0,
    straightLineRentAdjustment: 0,
    recurringMaintenanceCapex: 0,
    maintenanceAdjustment: 0,
    noncashCompensation: 0,
    debtIssuanceAmortization: 0,
    leaseAmortizationAdjustment: 0,
  });
  const withInterest = calculateAffo({ ...base, interestIncome: 25 });
  const without = calculateAffo(base);
  assert.equal(withInterest.ffo, without.ffo);
  assert.equal(withInterest.affo, without.affo);
});

test('straight-line rent, recurring capex, and optional add-backs reconcile to AFFO', () => {
  const result = calculateAffo(
    withInput({
      netIncome: 100,
      realEstateDepreciation: 40,
      propertySaleLosses: 5,
      propertySaleGains: 15,
      straightLineRentAdjustment: 8,
      recurringMaintenanceCapex: 20,
      maintenanceAdjustment: 0,
      noncashCompensation: 4,
      debtIssuanceAmortization: 2,
      leaseAmortizationAdjustment: -1,
    })
  );
  assert.equal(result.ffo, 130);
  assert.equal(result.affo, 107);
  assert.equal(result.affoAdjustment, -23);
  assert.equal(result.affo, result.ffo + result.affoAdjustment);
});

test('maintenance stays at zero unless the user enters an incremental adjustment', () => {
  const result = calculateAffo(
    withInput({
      netIncome: 50,
      realEstateDepreciation: 0,
      propertySaleGains: 0,
      propertySaleLosses: 0,
      straightLineRentAdjustment: 0,
      recurringMaintenanceCapex: 0,
      maintenanceAdjustment: 0,
      noncashCompensation: 0,
      debtIssuanceAmortization: 0,
      leaseAmortizationAdjustment: 0,
    })
  );
  assert.equal(result.affo, 50);
});

test('negative net income, FFO, and AFFO are kept', () => {
  const result = calculateAffo(
    withInput({
      netIncome: -20,
      realEstateDepreciation: 0,
      propertySaleGains: 5,
      propertySaleLosses: 0,
      straightLineRentAdjustment: 3,
      recurringMaintenanceCapex: 0,
      maintenanceAdjustment: 0,
      noncashCompensation: 0,
      debtIssuanceAmortization: 0,
      leaseAmortizationAdjustment: 0,
    })
  );
  assert.equal(result.ffo, -25);
  assert.equal(result.affo, -28);
});

test('zero adjustments leave FFO equal to net income and AFFO equal to FFO', () => {
  const result = calculateAffo(
    withInput({
      netIncome: 0,
      realEstateDepreciation: 0,
      propertySaleGains: 0,
      propertySaleLosses: 0,
      interestIncome: 0,
      straightLineRentAdjustment: 0,
      recurringMaintenanceCapex: 0,
      maintenanceAdjustment: 0,
      noncashCompensation: 0,
      debtIssuanceAmortization: 0,
      leaseAmortizationAdjustment: 0,
    })
  );
  assert.equal(result.ffo, 0);
  assert.equal(result.affo, 0);
  assert.equal(result.payoutRatio, null);
});

test('per share needs a positive diluted share count and payout needs nonzero AFFO', () => {
  const ready = calculateAffo(
    withInput({
      netIncome: 100,
      realEstateDepreciation: 0,
      propertySaleGains: 0,
      propertySaleLosses: 0,
      straightLineRentAdjustment: 0,
      recurringMaintenanceCapex: 0,
      maintenanceAdjustment: 0,
      noncashCompensation: 0,
      debtIssuanceAmortization: 0,
      leaseAmortizationAdjustment: 0,
      dilutedShares: 10,
      dividends: 40,
    })
  );
  assert.equal(ready.ffoPerShare, 10);
  assert.equal(ready.affoPerShare, 10);
  assert.equal(ready.payoutRatio, 0.4);

  const missingShares = calculateAffo(
    withInput({
      netIncome: 100,
      realEstateDepreciation: 0,
      propertySaleGains: 0,
      propertySaleLosses: 0,
      straightLineRentAdjustment: 0,
      recurringMaintenanceCapex: 0,
      maintenanceAdjustment: 0,
      noncashCompensation: 0,
      debtIssuanceAmortization: 0,
      leaseAmortizationAdjustment: 0,
      dilutedShares: null,
      dividends: null,
    })
  );
  assert.equal(missingShares.ffoPerShare, null);
  assert.equal(missingShares.payoutRatio, null);

  const zeroAffo = calculateAffo(
    withInput({
      netIncome: 0,
      realEstateDepreciation: 0,
      propertySaleGains: 0,
      propertySaleLosses: 0,
      straightLineRentAdjustment: 0,
      recurringMaintenanceCapex: 0,
      maintenanceAdjustment: 0,
      noncashCompensation: 0,
      debtIssuanceAmortization: 0,
      leaseAmortizationAdjustment: 0,
      dividends: 10,
      dilutedShares: null,
    })
  );
  assert.equal(zeroAffo.payoutRatio, null);
});

test('reporting period and currency are labels and do not rescale amounts', () => {
  const annual = calculateAffo(withInput({ period: 'annual', currency: 'USD', netIncome: 12 }));
  const month = calculateAffo(withInput({ period: 'monthly', currency: 'EUR', netIncome: 12 }));
  assert.equal(annual.ffo, month.ffo);
  assert.equal(month.periodLabel, 'Monthly');
  assert.equal(month.currency, 'EUR');
  assert.notEqual(annual.currency, month.currency);
});

test('the bridge lines reconcile to FFO and AFFO', () => {
  const result = calculateAffo(DEFAULT_AFFO_INPUT);
  assert.equal(result.ffo, 1_370_000);
  assert.equal(result.affo, 1_245_000);
  assert.equal(result.affo, result.ffo - 25_000 - 120_000 + 15_000 + 5_000);
  assert.ok(result.lines.some((line) => line.id === 'interest' && line.treatment === 'note'));
  assert.equal(Number.isFinite(result.ffo) && Number.isFinite(result.affo), true);
});

test('invalid shares, huge amounts, and bad numbers are rejected', () => {
  assert.equal(validateAffo(withInput({ dilutedShares: 0 })).isValid, false);
  assert.equal(validateAffo(withInput({ dilutedShares: -5 })).isValid, false);
  assert.equal(validateAffo(withInput({ netIncome: Number.NaN })).isValid, false);
  assert.equal(validateAffo(withInput({ realEstateDepreciation: 1e16 })).isValid, false);
  assert.equal(validateAffo(withInput({ netIncome: -1 })).isValid, true);
  assert.equal(parseOptionalNumber(''), null);
  assert.equal(parseOptionalNumber('-'), null);
  assert.equal(Number.isNaN(parseOptionalNumber('abc')), true);
});

console.log('AFFO calculator unit tests passed');
