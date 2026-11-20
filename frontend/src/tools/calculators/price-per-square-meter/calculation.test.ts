import assert from 'node:assert/strict';
import {
  calculateAbsolutePriceDifference,
  calculateAreaFromPrice,
  calculatePercentagePriceDifference,
  calculatePricePerArea,
  calculateTotalPrice,
  convertArea,
  convertPricePerArea,
  convertRentalPeriodDisplay,
  M2_PER_SQ_FT,
  SQ_FT_PER_M2,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePricePerSqmInput } from './validation';

// Test 1: Basic price per m²
assert.equal(calculatePricePerArea(500_000, 250), 2_000);

// Test 2: Decimal area
{
  const p = calculatePricePerArea(250_000, 125.5)!;
  assert.ok(Math.abs(p - 1_992.03187251) < 1e-6);
}

// Test 3: Total price
assert.equal(calculateTotalPrice(2_500, 200), 500_000);

// Test 4: Area
assert.equal(calculateAreaFromPrice(600_000, 3_000), 200);

// Test 5: Zero area
assert.equal(calculatePricePerArea(500_000, 0), null);
{
  const v = validatePricePerSqmInput({
    ...createDefaultInput(),
    price: '500000',
    area: '0',
  });
  assert.ok(v.errors.area);
}

// Test 6 / 7: Negatives
{
  assert.ok(
    validatePricePerSqmInput({
      ...createDefaultInput(),
      price: '-1',
      area: '100',
    }).errors.price
  );
  assert.ok(
    validatePricePerSqmInput({
      ...createDefaultInput(),
      price: '100',
      area: '-5',
    }).errors.area
  );
}

// Test 8: Zero price
assert.equal(calculatePricePerArea(0, 100), 0);

// Test 9: m² → ft²
assert.ok(Math.abs(convertArea(100, 'm2', 'ft2') - 100 * SQ_FT_PER_M2) < 1e-9);

// Test 10: ft² → m²
assert.ok(Math.abs(convertArea(1_000, 'ft2', 'm2') - 1_000 / SQ_FT_PER_M2) < 1e-9);
assert.ok(Math.abs(1_000 * M2_PER_SQ_FT - 92.90304) < 1e-6);

// Test 11: Price per area conversion
{
  const ppm = 2_000;
  const ppf = convertPricePerArea(ppm, 'm2', 'ft2');
  assert.ok(Math.abs(ppf - 2_000 * M2_PER_SQ_FT) < 0.01);
  assert.ok(Math.abs(ppf - 185.81) < 0.01);
}

// Test 12: Monthly rent
assert.equal(calculatePricePerArea(3_000, 150), 20);

// Test 13: Annual rent
assert.equal(calculatePricePerArea(36_000, 150), 240);

// Test 14: Rental period
assert.equal(convertRentalPeriodDisplay(3_000, 'monthly', 'annually'), 36_000);

// Test 15: Second property comparison
{
  const v = validatePricePerSqmInput({
    ...createDefaultInput(),
    price: '400000',
    area: '200',
    compareSecondProperty: true,
    secondPrice: '450000',
    secondArea: '180',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result!.pricePerArea, 2_000);
  assert.equal(v.result!.secondPricePerArea, 2_500);
  assert.equal(v.result!.absoluteDifference, 500);
  assert.equal(v.result!.percentageDifference, 25);
}

// Test 16: Equal unit prices
assert.equal(calculateAbsolutePriceDifference(2_000, 2_000), 0);
assert.equal(calculatePercentagePriceDifference(2_000, 2_000), 0);

// Test 17: Zero reference
assert.equal(calculatePercentagePriceDifference(100, 0), null);

// Test 18: Different area units
{
  const v = validatePricePerSqmInput({
    ...createDefaultInput(),
    price: '100000',
    area: '100',
    areaUnit: 'm2',
    compareSecondProperty: true,
    secondPrice: '100000',
    secondArea: String(100 * SQ_FT_PER_M2),
    secondAreaUnit: 'ft2',
  });
  assert.ok(Math.abs(v.result!.absoluteDifference!) < 0.01);
}

// Test 19: Second disabled
{
  const v = validatePricePerSqmInput({
    ...createDefaultInput(),
    price: '400000',
    area: '200',
    compareSecondProperty: false,
    secondPrice: '450000',
    secondArea: '180',
  });
  assert.equal(v.result!.absoluteDifference, null);
}

// Test 20: Clearing
assert.equal(
  validatePricePerSqmInput({ ...createDefaultInput(), area: '200' }).result,
  null
);

// Test 21: Defaults are m²
{
  const d = createDefaultInput();
  assert.equal(d.areaUnit, 'm2');
  assert.equal(d.secondAreaUnit, 'm2');
  assert.equal(d.currency, 'PKR');
}

// Test 22: Reverse modes
{
  const total = validatePricePerSqmInput({
    ...createDefaultInput(),
    calculationMode: 'totalPrice',
    area: '200',
    pricePerArea: '2500',
  });
  assert.equal(total.result!.price, 500_000);

  const areaMode = validatePricePerSqmInput({
    ...createDefaultInput(),
    calculationMode: 'area',
    price: '600000',
    pricePerArea: '3000',
  });
  assert.equal(areaMode.result!.area, 200);
}

console.log('price-per-square-meter/calculation.test.ts: all assertions passed');
