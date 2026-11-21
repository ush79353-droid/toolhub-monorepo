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
  SQ_FT_PER_M2,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePricePerSqftInput } from './validation';

// Test 1: Basic PPSF
assert.equal(calculatePricePerArea(500_000, 2_500), 200);

// Test 2: Decimal area
{
  const p = calculatePricePerArea(250_000, 1_250.5)!;
  assert.ok(Math.abs(p - 199.920031987) < 1e-6);
}

// Test 3: Total price
assert.equal(calculateTotalPrice(250, 2_000), 500_000);

// Test 4: Area from price
assert.equal(calculateAreaFromPrice(600_000, 300), 2_000);

// Test 5: Zero area
assert.equal(calculatePricePerArea(500_000, 0), null);
{
  const v = validatePricePerSqftInput({
    ...createDefaultInput(),
    price: '500000',
    area: '0',
  });
  assert.ok(v.errors.area);
}

// Test 6 / 7: Negatives
{
  const v = validatePricePerSqftInput({
    ...createDefaultInput(),
    price: '-1',
    area: '1000',
  });
  assert.ok(v.errors.price);
  const v2 = validatePricePerSqftInput({
    ...createDefaultInput(),
    price: '1000',
    area: '-5',
  });
  assert.ok(v2.errors.area);
}

// Test 8: Zero price
assert.equal(calculatePricePerArea(0, 1_000), 0);

// Test 9: ft² → m²
assert.ok(Math.abs(convertArea(1_000, 'ft2', 'm2') - 1_000 / SQ_FT_PER_M2) < 1e-9);

// Test 10: Unit conversion consistency
{
  const price = 100_000;
  const areaFt = 1_000;
  const ppsf = calculatePricePerArea(price, areaFt)!;
  const areaM = convertArea(areaFt, 'ft2', 'm2');
  const ppm = convertPricePerArea(ppsf, 'ft2', 'm2');
  assert.ok(Math.abs(calculatePricePerArea(price, areaM)! - ppm) < 1e-6);
  assert.ok(Math.abs(ppm * areaM - price) < 1e-6);
}

// Test 11: Monthly rent per sqft
assert.equal(calculatePricePerArea(3_000, 1_500), 2);

// Test 12: Annual rent per sqft
assert.equal(calculatePricePerArea(36_000, 1_500), 24);

// Test 13: Rental period conversion
assert.equal(convertRentalPeriodDisplay(3_000, 'monthly', 'annually'), 36_000);
assert.equal(convertRentalPeriodDisplay(36_000, 'annually', 'monthly'), 3_000);

// Test 14: Second property comparison
{
  const v = validatePricePerSqftInput({
    ...createDefaultInput(),
    price: '400000',
    area: '2000',
    compareSecondProperty: true,
    secondPrice: '450000',
    secondArea: '1800',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result!.pricePerArea, 200);
  assert.equal(v.result!.secondPricePerArea, 250);
  assert.equal(v.result!.absoluteDifference, 50);
  assert.equal(v.result!.percentageDifference, 25);
}

// Test 15: Equal unit prices
{
  const diff = calculateAbsolutePriceDifference(200, 200);
  assert.equal(diff, 0);
  assert.equal(calculatePercentagePriceDifference(200, 200), 0);
}

// Test 16: Zero reference price
assert.equal(calculatePercentagePriceDifference(100, 0), null);

// Test 17: Different area units
{
  const v = validatePricePerSqftInput({
    ...createDefaultInput(),
    price: '100000',
    area: '1000',
    areaUnit: 'ft2',
    compareSecondProperty: true,
    secondPrice: '100000',
    secondArea: String(1000 / SQ_FT_PER_M2),
    secondAreaUnit: 'm2',
  });
  assert.ok(v.result);
  assert.ok(Math.abs(v.result!.absoluteDifference!) < 0.01);
}

// Test 18: Second property disabled
{
  const v = validatePricePerSqftInput({
    ...createDefaultInput(),
    price: '400000',
    area: '2000',
    compareSecondProperty: false,
    secondPrice: '450000',
    secondArea: '1800',
  });
  assert.equal(v.result!.secondEnabled, false);
  assert.equal(v.result!.absoluteDifference, null);
}

// Test 19: Input clearing
{
  const v = validatePricePerSqftInput({
    ...createDefaultInput(),
    price: '',
    area: '2000',
  });
  assert.equal(v.result, null);
}

// Test 20: Reset defaults
{
  const d = createDefaultInput();
  assert.equal(d.calculationMode, 'pricePerArea');
  assert.equal(d.pricingContext, 'purchase');
  assert.equal(d.areaUnit, 'ft2');
  assert.equal(d.currency, 'PKR');
  assert.equal(d.compareSecondProperty, false);
}

// Test 21: Mode switching
{
  const total = validatePricePerSqftInput({
    ...createDefaultInput(),
    calculationMode: 'totalPrice',
    area: '2000',
    pricePerArea: '250',
  });
  assert.equal(total.result!.price, 500_000);

  const areaMode = validatePricePerSqftInput({
    ...createDefaultInput(),
    calculationMode: 'area',
    price: '600000',
    pricePerArea: '300',
  });
  assert.equal(areaMode.result!.area, 2_000);
}

// Test 22: Large values
{
  const v = validatePricePerSqftInput({
    ...createDefaultInput(),
    price: '20000000',
    area: '2000',
  });
  assert.equal(v.result!.pricePerArea, 10_000);
  assert.ok(v.result!.formattedPrice.includes(','));
}

// Test 23: Decimal inputs via validation
{
  const v = validatePricePerSqftInput({
    ...createDefaultInput(),
    price: '250000.50',
    area: '1250.25',
  });
  assert.ok(v.result);
  assert.ok(Number.isFinite(v.result!.pricePerArea));
}

console.log('price-per-square-foot/calculation.test.ts: all assertions passed');
