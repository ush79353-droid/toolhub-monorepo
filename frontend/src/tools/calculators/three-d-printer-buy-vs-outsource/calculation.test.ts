import assert from 'node:assert/strict';
import { calculateThreeDPrinter, roundMoney } from './calculation';
import { DEFAULT_THREE_D_PRINTER_INPUT, type ThreeDPrinterInput } from './types';
import { validateThreeDPrinterInput } from './validation';

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ok - ${description}`);
  } catch (err) {
    console.error(`  FAIL - ${description}`);
    throw err;
  }
}

function withInput(patch: Partial<ThreeDPrinterInput>): ThreeDPrinterInput {
  return { ...DEFAULT_THREE_D_PRINTER_INPUT, ...patch };
}

function mustCalculate(input: ThreeDPrinterInput) {
  const result = calculateThreeDPrinter(input);
  assert.ok(result);
  return result;
}

console.log('Running 3D Printer Buy vs Outsource tests...');

test('default example buys cheaper and reports a break-even', () => {
  const result = mustCalculate(DEFAULT_THREE_D_PRINTER_INPUT);
  assert.equal(result.totalParts, 120);
  assert.equal(result.materialCostPerAttempt, 100);
  assert.equal(result.electricityCostPerAttempt, 18);
  assert.equal(result.variableCostPerAttempt, 118);
  assert.equal(result.recommendation, 'buy');
  assert.ok(result.netSavings > 0);
  assert.equal(result.totalInHouseCost, 51733.33);
  assert.equal(result.totalOutsourcingCost, 96000);
  assert.equal(result.netSavings, 44266.67);
  assert.equal(result.inHouseCostPerPart, 431.11);
  assert.equal(result.outsourceCostPerPart, 800);
  assert.equal(result.breakEvenMonths, 4.85);
  assert.equal(result.breakEvenParts, 48.47);
  assert.equal(result.resaleExceedsInvestment, false);
  assert.equal(result.points.length, 12);
  assert.equal(result.points[11]?.month, 12);
  assert.equal(result.points[11]?.inHouseCost, result.totalInHouseCost);
  assert.equal(result.points[11]?.outsourcingCost, result.totalOutsourcingCost);
});

test('outsourcing is cheaper when the printer is expensive and volume is low', () => {
  const result = mustCalculate(
    withInput({
      printerPrice: 10000,
      resaleValue: 0,
      maintenancePerMonth: 0,
      partsPerMonth: 1,
      months: 1,
      failureRatePercent: 0,
      materialGramsPerPart: 0,
      printHoursPerPart: 0,
      pricePerPart: 1,
      shippingPerOrder: 0,
    })
  );
  assert.equal(result.totalInHouseCost, 10000);
  assert.equal(result.totalOutsourcingCost, 1);
  assert.equal(result.recommendation, 'outsource');
  assert.ok(result.netSavings < 0);
});

test('exact break-even at one month and ten parts', () => {
  const result = mustCalculate(
    withInput({
      partsPerMonth: 10,
      months: 12,
      failureRatePercent: 0,
      materialGramsPerPart: 0,
      printHoursPerPart: 0,
      laborHourlyRate: 0,
      printerPrice: 100,
      setupCosts: 0,
      maintenancePerMonth: 0,
      resaleValue: 0,
      pricePerPart: 10,
      finishingCostPerPart: 0,
      shippingPerOrder: 0,
      oneTimeServiceFee: 0,
    })
  );
  assert.equal(result.breakEvenMonths, 1);
  assert.equal(result.breakEvenParts, 10);
  const atBreakEven = mustCalculate(
    withInput({
      partsPerMonth: 10,
      months: 1,
      failureRatePercent: 0,
      materialGramsPerPart: 0,
      printHoursPerPart: 0,
      printerPrice: 100,
      setupCosts: 0,
      maintenancePerMonth: 0,
      resaleValue: 0,
      pricePerPart: 10,
      shippingPerOrder: 0,
    })
  );
  assert.equal(atBreakEven.totalInHouseCost, 100);
  assert.equal(atBreakEven.totalOutsourcingCost, 100);
  assert.equal(atBreakEven.recommendation, 'tie');
  assert.equal(atBreakEven.netSavings, 0);
});

test('no break-even when outsourcing is cheaper per part', () => {
  const result = mustCalculate(
    withInput({
      failureRatePercent: 0,
      materialGramsPerPart: 1000,
      materialPricePerKg: 10,
      printHoursPerPart: 0,
      laborHourlyRate: 0,
      pricePerPart: 1,
      finishingCostPerPart: 0,
      shippingPerOrder: 0,
      maintenancePerMonth: 0,
    })
  );
  assert.ok(result.inHouseVariablePerPart > result.outsourceVariablePerPart);
  assert.equal(result.breakEvenMonths, null);
  assert.equal(result.breakEvenParts, null);
});

test('no break-even when monthly margin cannot repay the printer', () => {
  const result = mustCalculate(
    withInput({
      partsPerMonth: 1,
      failureRatePercent: 0,
      materialGramsPerPart: 0,
      printHoursPerPart: 0,
      printerPrice: 1000,
      resaleValue: 0,
      maintenancePerMonth: 100,
      pricePerPart: 10,
      shippingPerOrder: 0,
    })
  );
  assert.ok(result.outsourceVariablePerPart > result.inHouseVariablePerPart);
  assert.equal(result.breakEvenMonths, null);
});

test('failed prints use the same material, time, and labor again', () => {
  const clean = mustCalculate(
    withInput({
      partsPerMonth: 1,
      months: 1,
      failureRatePercent: 0,
      materialGramsPerPart: 1000,
      materialPricePerKg: 1,
      printHoursPerPart: 2,
      printerPowerWatts: 1000,
      electricityPricePerKWh: 0.5,
      laborHoursPerPrint: 1,
      laborHourlyRate: 4,
      printerPrice: 0,
      maintenancePerMonth: 0,
      resaleValue: 0,
    })
  );
  assert.equal(clean.expectedAttempts, 1);
  assert.equal(clean.materialCostPerAttempt, 1);
  assert.equal(clean.electricityCostPerAttempt, 1);
  assert.equal(clean.laborCostPerAttempt, 4);
  assert.equal(clean.expectedVariableCost, 6);

  const halfFail = mustCalculate(
    withInput({
      partsPerMonth: 1,
      months: 1,
      failureRatePercent: 50,
      materialGramsPerPart: 1000,
      materialPricePerKg: 1,
      printHoursPerPart: 2,
      printerPowerWatts: 1000,
      electricityPricePerKWh: 0.5,
      laborHoursPerPrint: 1,
      laborHourlyRate: 4,
      printerPrice: 0,
      maintenancePerMonth: 0,
      resaleValue: 0,
    })
  );
  assert.equal(halfFail.expectedAttempts, 2);
  assert.equal(halfFail.materialCost, 2);
  assert.equal(halfFail.electricityCost, 2);
  assert.equal(halfFail.laborCost, 8);
  assert.equal(halfFail.expectedVariableCost, 12);
});

test('shipping follows orders and maintenance follows months', () => {
  const result = mustCalculate(
    withInput({
      partsPerMonth: 0,
      months: 2,
      failureRatePercent: 0,
      printerPrice: 0,
      setupCosts: 0,
      resaleValue: 0,
      maintenancePerMonth: 10,
      pricePerPart: 0,
      shippingPerOrder: 5,
      ordersPerMonth: 3,
      oneTimeServiceFee: 7,
    })
  );
  assert.equal(result.maintenanceCost, 20);
  assert.equal(result.shippingCost, 30);
  assert.equal(result.oneTimeServiceFee, 7);
  assert.equal(result.totalInHouseCost, 20);
  assert.equal(result.totalOutsourcingCost, 37);
  assert.equal(result.inHouseCostPerPart, null);
  assert.equal(result.outsourceCostPerPart, null);
  assert.equal(result.breakEvenParts, null);
});

test('resale reduces ownership cost and warns when it exceeds the purchase', () => {
  const credited = mustCalculate(
    withInput({
      partsPerMonth: 0,
      months: 0,
      printerPrice: 100,
      setupCosts: 10,
      maintenancePerMonth: 0,
      resaleValue: 40,
      oneTimeServiceFee: 0,
    })
  );
  assert.equal(credited.fixedOwnershipCost, 70);
  assert.equal(credited.resaleExceedsInvestment, false);

  const warned = mustCalculate(
    withInput({
      partsPerMonth: 0,
      months: 0,
      printerPrice: 100,
      setupCosts: 10,
      maintenancePerMonth: 0,
      resaleValue: 200,
    })
  );
  assert.equal(warned.resaleExceedsInvestment, true);
  assert.equal(warned.fixedOwnershipCost, -90);
  assert.ok(Number.isFinite(warned.totalInHouseCost));
});

test('zero volume does not divide by zero', () => {
  const result = mustCalculate(withInput({ partsPerMonth: 0, months: 0, printerPrice: 50, resaleValue: 0 }));
  assert.equal(result.totalParts, 0);
  assert.equal(result.inHouseCostPerPart, null);
  assert.equal(result.points.length, 0);
  assert.equal(Number.isFinite(result.totalInHouseCost), true);
  assert.notEqual(result.totalInHouseCost, Infinity);
});

test('invalid inputs are rejected and do not calculate', () => {
  const negative = validateThreeDPrinterInput(withInput({ printerPrice: -1 }));
  assert.equal(negative.isValid, false);
  assert.ok(negative.errors.printerPrice);
  assert.equal(calculateThreeDPrinter(withInput({ printerPrice: -1 })), null);

  const fullFailure = validateThreeDPrinterInput(withInput({ failureRatePercent: 100 }));
  assert.equal(fullFailure.isValid, false);

  const overFailure = validateThreeDPrinterInput(withInput({ failureRatePercent: 100.1 }));
  assert.equal(overFailure.isValid, false);

  const nan = validateThreeDPrinterInput(withInput({ partsPerMonth: Number.NaN }));
  assert.equal(nan.isValid, false);

  const infinite = validateThreeDPrinterInput(withInput({ months: Number.POSITIVE_INFINITY }));
  assert.equal(infinite.isValid, false);

  const currency = validateThreeDPrinterInput(
    withInput({ currency: 'BTC' as ThreeDPrinterInput['currency'] })
  );
  assert.equal(currency.isValid, false);
  assert.equal(calculateThreeDPrinter(withInput({ materialGramsPerPart: -5 })), null);
});

test('fractional hours and cents stay finite', () => {
  const result = mustCalculate(
    withInput({
      partsPerMonth: 1.5,
      months: 2.5,
      printHoursPerPart: 0.25,
      materialGramsPerPart: 12.5,
      failureRatePercent: 0,
      printerPowerWatts: 120,
      electricityPricePerKWh: 0.15,
      printerPrice: 0,
      maintenancePerMonth: 0,
      resaleValue: 0,
      pricePerPart: 0,
    })
  );
  assert.equal(result.totalParts, 3.75);
  assert.equal(Number.isFinite(result.electricityCost), true);
  assert.equal(result.electricityCost, roundMoney(result.expectedAttempts * result.electricityCostPerAttempt));
  assert.equal(result.recommendation === 'buy' || result.recommendation === 'outsource' || result.recommendation === 'tie', true);
});

console.log('All 3D Printer Buy vs Outsource tests passed.');
