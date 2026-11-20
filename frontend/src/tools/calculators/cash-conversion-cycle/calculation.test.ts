import assert from 'node:assert/strict';
import {
  calculateAverageAccountsPayable,
  calculateAverageAccountsReceivable,
  calculateAverageInventory,
  calculateCashConversionCycle,
  calculateDaysInventoryOutstanding,
  calculateDaysPayableOutstanding,
  calculateDaysSalesOutstanding,
  calculateOperatingCycle,
  normalizeReportingPeriod,
} from './calculation';
import { createDefaultInput } from './types';
import { validateCashConversionCycleInput } from './validation';

function nearly(actual: number | null, expected: number, eps = 1e-9) {
  assert.ok(actual !== null);
  assert.ok(Math.abs(actual! - expected) < eps, `${actual} ≈ ${expected}`);
}

assert.equal(calculateAverageInventory(90_000, 110_000), 100_000);
assert.equal(calculateAverageAccountsReceivable(70_000, 90_000), 80_000);
assert.equal(calculateAverageAccountsPayable(60_000, 80_000), 70_000);

nearly(calculateDaysInventoryOutstanding(100_000, 800_000, 365), 45.625);
nearly(calculateDaysSalesOutstanding(80_000, 1_000_000, 365), 29.2);
nearly(calculateDaysPayableOutstanding(70_000, 800_000, 365), 31.9375);

nearly(calculateCashConversionCycle(45.625, 29.2, 31.9375), 42.8875);
assert.equal(calculateCashConversionCycle(30, 20, 50), 0);
assert.equal(calculateCashConversionCycle(20, 15, 50), -15);
assert.equal(calculateCashConversionCycle(50, 30, 45), 35);
assert.equal(calculateOperatingCycle(45.625, 29.2), 74.825);

assert.equal(calculateDaysInventoryOutstanding(0, 800_000, 365), 0);
assert.equal(calculateDaysSalesOutstanding(0, 1_000_000, 365), 0);
assert.equal(calculateDaysPayableOutstanding(0, 800_000, 365), 0);
assert.equal(calculateDaysSalesOutstanding(80_000, 0, 365), null);
assert.equal(calculateDaysInventoryOutstanding(100_000, 0, 365), null);
assert.equal(calculateDaysPayableOutstanding(70_000, 0, 365), null);
assert.equal(calculateAverageInventory(-1, 10), null);
assert.equal(normalizeReportingPeriod(365, 'days'), 365);
assert.equal(normalizeReportingPeriod(1, 'years'), 365);
assert.equal(normalizeReportingPeriod(0, 'days'), null);

const full = validateCashConversionCycleInput({
  ...createDefaultInput(),
  currency: 'USD',
  period: '365',
  totalRevenue: '1000000',
  costOfGoodsSold: '800000',
  averageInventory: '100000',
  averageAccountsReceivable: '80000',
  averageAccountsPayable: '70000',
});
assert.equal(full.isValid, true);
nearly(full.result?.inventoryDays ?? null, 45.625);
nearly(full.result?.accountsReceivableDays ?? null, 29.2);
nearly(full.result?.accountsPayableDays ?? null, 31.9375);
nearly(full.result?.cashConversionCycle ?? null, 42.8875);
assert.equal(full.result?.formattedCashConversionCycle, '42.89');

const halfPeriod = validateCashConversionCycleInput({
  ...createDefaultInput(),
  period: '180',
  totalRevenue: '1000000',
  costOfGoodsSold: '800000',
  averageInventory: '100000',
  averageAccountsReceivable: '80000',
  averageAccountsPayable: '70000',
});
assert.ok(halfPeriod.result);
assert.equal(
  halfPeriod.result!.inventoryDays,
  (100_000 / 800_000) * 180
);

const zeroRevenue = validateCashConversionCycleInput({
  ...createDefaultInput(),
  totalRevenue: '0',
  costOfGoodsSold: '800000',
  averageInventory: '100000',
  averageAccountsReceivable: '80000',
  averageAccountsPayable: '70000',
});
assert.equal(zeroRevenue.result, null);
assert.ok(zeroRevenue.errors.totalRevenue);

const zeroCogs = validateCashConversionCycleInput({
  ...createDefaultInput(),
  totalRevenue: '1000000',
  costOfGoodsSold: '0',
  averageInventory: '100000',
  averageAccountsReceivable: '80000',
  averageAccountsPayable: '70000',
});
assert.equal(zeroCogs.result, null);
assert.ok(zeroCogs.errors.costOfGoodsSold);

const calculated = validateCashConversionCycleInput({
  ...createDefaultInput(),
  totalRevenue: '1000000',
  costOfGoodsSold: '800000',
  inventoryMode: 'calculated',
  beginningInventory: '90000',
  endingInventory: '110000',
  receivablesMode: 'calculated',
  beginningAccountsReceivable: '70000',
  endingAccountsReceivable: '90000',
  payablesMode: 'calculated',
  beginningAccountsPayable: '60000',
  endingAccountsPayable: '80000',
});
assert.equal(calculated.result?.averageInventory, 100_000);
assert.equal(calculated.result?.averageAccountsReceivable, 80_000);
assert.equal(calculated.result?.averageAccountsPayable, 70_000);
nearly(calculated.result?.cashConversionCycle ?? null, 42.8875);

const incompleteCalc = validateCashConversionCycleInput({
  ...createDefaultInput(),
  inventoryMode: 'calculated',
  beginningInventory: '90000',
  endingInventory: '',
  totalRevenue: '1000000',
  costOfGoodsSold: '800000',
  averageAccountsReceivable: '80000',
  averageAccountsPayable: '70000',
});
assert.equal(incompleteCalc.result, null);

const negative = validateCashConversionCycleInput({
  ...createDefaultInput(),
  totalRevenue: '-1',
  costOfGoodsSold: '800000',
  averageInventory: '100000',
  averageAccountsReceivable: '80000',
  averageAccountsPayable: '70000',
});
assert.ok(negative.errors.totalRevenue);

const blank = validateCashConversionCycleInput(createDefaultInput());
assert.equal(blank.result, null);

const faq = validateCashConversionCycleInput({
  ...createDefaultInput(),
  // Direct day components via balances that yield DIO 50, DSO 30, DPO 45
  // Using identities: DIO = inv/cogs*365 = 50 → inv/cogs = 50/365
  period: '365',
  totalRevenue: '365000',
  costOfGoodsSold: '365000',
  averageInventory: '50000',
  averageAccountsReceivable: '30000',
  averageAccountsPayable: '45000',
});
assert.equal(faq.result?.cashConversionCycle, 35);

console.log('cash-conversion-cycle/calculation.test.ts: all assertions passed');
