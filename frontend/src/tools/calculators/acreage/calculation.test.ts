import assert from 'node:assert/strict';
import {
  areaToSquareMeters,
  calculateAcreage,
  lengthToMeters,
  roundDisplay,
  squareMetersToArea,
} from './calculation';
import { DEFAULT_ACREAGE_INPUT, SQUARE_METERS_PER_AREA_UNIT, type AcreageInput } from './types';
import { validateAcreage } from './validation';

function dims(partial: Partial<AcreageInput> = {}): AcreageInput {
  return { ...DEFAULT_ACREAGE_INPUT, mode: 'dimensions', ...partial };
}

function areaOnly(partial: Partial<AcreageInput> = {}): AcreageInput {
  return {
    ...DEFAULT_ACREAGE_INPUT,
    mode: 'area',
    width: null,
    length: null,
    area: 1,
    areaUnit: 'ac',
    ...partial,
  };
}

// 220 yd × 220 yd = 10 acres
{
  const result = calculateAcreage(dims({ width: 220, length: 220, widthUnit: 'yd', lengthUnit: 'yd', areaUnit: 'ac' }));
  assert.equal(result.areaDisplay, 10);
  assert.equal(result.conversions.find((row) => row.unit === 'yd2')?.value, 48400);
}

// 1 acre = 43,560 ft²
{
  assert.equal(roundDisplay(squareMetersToArea(SQUARE_METERS_PER_AREA_UNIT.ac, 'ft2')), 43560);
  const result = calculateAcreage(areaOnly({ area: 1, areaUnit: 'ac' }));
  assert.equal(result.conversions.find((row) => row.unit === 'ft2')?.value, 43560);
}

// 1 acre = 4,840 yd²
{
  assert.equal(roundDisplay(squareMetersToArea(SQUARE_METERS_PER_AREA_UNIT.ac, 'yd2')), 4840);
}

// 1 acre = 4,046.8564224 m²
{
  assert.equal(areaToSquareMeters(1, 'ac'), 4046.8564224);
  assert.equal(squareMetersToArea(4046.8564224, 'ac'), 1);
}

// 1 hectare = 10,000 m²
{
  assert.equal(areaToSquareMeters(1, 'ha'), 10_000);
  assert.equal(squareMetersToArea(10_000, 'ha'), 1);
}

// 1 hectare ≈ 2.47105381467 acres
{
  const acres = squareMetersToArea(10_000, 'ac');
  assert.ok(Math.abs(acres - 2.471053814671653) < 1e-12);
}

// Length SI anchors
{
  assert.equal(lengthToMeters(1, 'ft'), 0.3048);
  assert.equal(lengthToMeters(1, 'yd'), 0.9144);
  assert.equal(lengthToMeters(1, 'mi'), 1609.344);
}

// 5 acres × 15,000 USD/acre = 75,000 USD
{
  const result = calculateAcreage(
    areaOnly({
      area: 5,
      areaUnit: 'ac',
      pricePerUnit: 15_000,
      priceAreaUnit: 'ac',
      currency: 'USD',
    })
  );
  assert.equal(result.totalPrice, 75_000);
}

// Price unit can differ from area display unit
{
  const result = calculateAcreage(
    dims({
      width: 220,
      length: 220,
      areaUnit: 'ft2',
      pricePerUnit: 15_000,
      priceAreaUnit: 'ac',
    })
  );
  assert.equal(result.areaDisplay, 435_600);
  assert.equal(result.totalPrice, 150_000);
}

// Area mode does not invent dimensions
{
  const result = calculateAcreage(areaOnly({ area: 10, areaUnit: 'ac' }));
  assert.equal(result.mode, 'area');
  assert.equal(result.widthDisplay, null);
  assert.equal(result.lengthDisplay, null);
  assert.equal(result.areaDisplay, 10);
}

// Validation: zero / negative / blank
{
  const zero = validateAcreage(dims({ width: 0, length: 220 }));
  assert.equal(zero.isValid, false);
  assert.match(zero.errors.width ?? '', /greater than zero/i);

  const negative = validateAcreage(dims({ width: -1, length: 220 }));
  assert.equal(negative.isValid, false);

  const blank = validateAcreage(dims({ width: null, length: 220 }));
  assert.equal(blank.isValid, false);

  const areaNeg = validateAcreage(areaOnly({ area: -2 }));
  assert.equal(areaNeg.isValid, false);

  const ok = validateAcreage(dims());
  assert.equal(ok.isValid, true);
}

console.log('acreage calculation.test.ts: ok');
