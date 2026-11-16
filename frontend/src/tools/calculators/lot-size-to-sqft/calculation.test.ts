import assert from 'node:assert/strict';
import {
  acresToSquareFeet,
  calculateLotArea,
  calculateLotSizeToSqft,
  lengthToMeters,
  shareResultText,
  squareFeetToAcres,
  squareMetersToSquareFeet,
  squareYardsToSquareFeet,
} from './calculation';
import {
  DEFAULT_LOT_SIZE_TO_SQFT_INPUT,
  SQ_FEET_PER_ACRE,
  type LotSizeToSqftInput,
} from './types';
import { parseOptionalNumber, validateLotSizeToSqft } from './validation';

function dims(partial: Partial<LotSizeToSqftInput> = {}): LotSizeToSqftInput {
  return { ...DEFAULT_LOT_SIZE_TO_SQFT_INPUT, source: 'dimensions', ...partial };
}

assert.ok(Math.abs(calculateLotArea(lengthToMeters(50, 'ft'), lengthToMeters(100, 'ft')) - 464.5152) < 1e-9);
assert.equal(50 * 100, 5000);
assert.equal(24 * 18, 432);
assert.equal(squareYardsToSquareFeet(180), 1620);
assert.equal(SQ_FEET_PER_ACRE, 43_560);
assert.equal(acresToSquareFeet(1), 43_560);
assert.equal(squareFeetToAcres(87_120), 2);
assert.equal(lengthToMeters(1, 'ft'), 0.3048);

{
  const result = calculateLotSizeToSqft(
    dims({ width: 50, length: 100, widthUnit: 'ft', lengthUnit: 'ft', areaUnit: 'ft2' }),
  );
  assert.equal(result.area, 5000);
  assert.equal(result.squareFeet, 5000);
}

{
  const result = calculateLotSizeToSqft(
    dims({ width: 24, length: 18, widthUnit: 'ft', lengthUnit: 'ft', areaUnit: 'ft2' }),
  );
  assert.equal(result.squareFeet, 432);
}

{
  const result = calculateLotSizeToSqft(
    dims({ width: 10, length: 20, widthUnit: 'm', lengthUnit: 'm', areaUnit: 'm2' }),
  );
  assert.equal(result.area, 200);
  assert.ok(Math.abs(result.squareFeet - 2152.782084) < 1e-5);
}

{
  const result = calculateLotSizeToSqft(
    dims({ width: 15, length: 12, widthUnit: 'yd', lengthUnit: 'yd', areaUnit: 'yd2' }),
  );
  assert.equal(result.area, 180);
  assert.equal(result.squareFeet, 1620);
}

{
  const result = calculateLotSizeToSqft(
    dims({ width: 100, length: 100, widthUnit: 'ft', lengthUnit: 'ft', areaUnit: 'ft2' }),
  );
  assert.ok(Math.abs(squareFeetToAcres(result.squareFeet) - 0.229568) < 1e-5);
}

{
  const result = calculateLotSizeToSqft({
    ...DEFAULT_LOT_SIZE_TO_SQFT_INPUT,
    source: 'solveLength',
    width: 50,
    length: null,
    area: 5000,
    widthUnit: 'ft',
    lengthUnit: 'ft',
    areaUnit: 'ft2',
  });
  assert.equal(result.length, 100);
}

{
  const result = calculateLotSizeToSqft(
    dims({
      width: 50,
      length: 100,
      areaUnit: 'ft2',
      pricePerUnit: 20,
      priceAreaUnit: 'ft2',
    }),
  );
  assert.equal(result.totalPrice, 100_000);
}

assert.ok(Math.abs(squareMetersToSquareFeet(1) - 10.76391041671) < 1e-8);
assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateLotSizeToSqft(dims({ width: -1, length: 10 })).isValid);
assert.ok(validateLotSizeToSqft(dims({ width: 0, length: 10 })).isValid);

{
  const result = calculateLotSizeToSqft(dims());
  assert.match(shareResultText(result), /Lot Size to Square Feet/);
  assert.match(shareResultText(result), /5,?000/);
}

console.log('lot-size-to-sqft calculation.test.ts: ok');
