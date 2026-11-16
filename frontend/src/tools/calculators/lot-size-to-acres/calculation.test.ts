import assert from 'node:assert/strict';
import {
  acresToSquareFeet,
  acresToSquareMeters,
  calculateLotArea,
  calculateLotSizeToAcres,
  lengthToMeters,
  shareResultText,
  squareFeetToAcres,
  squareMetersToAcres,
  squareYardsToAcres,
} from './calculation';
import { DEFAULT_LOT_SIZE_TO_ACRES_INPUT, SQ_METERS_PER_ACRE, type LotSizeToAcresInput } from './types';
import { parseOptionalNumber, validateLotSizeToAcres } from './validation';

function dims(partial: Partial<LotSizeToAcresInput> = {}): LotSizeToAcresInput {
  return { ...DEFAULT_LOT_SIZE_TO_ACRES_INPUT, source: 'dimensions', ...partial };
}

assert.equal(squareFeetToAcres(43_560), 1);
assert.equal(acresToSquareFeet(2), 87_120);
assert.equal(acresToSquareMeters(1), SQ_METERS_PER_ACRE);
assert.equal(calculateLotArea(100, 200), 20_000);
assert.ok(Math.abs(squareFeetToAcres(20_000) - 0.4591368) < 1e-7);
assert.equal(squareFeetToAcres(0), 0);
assert.equal(squareYardsToAcres(4_840), 1);
assert.equal(lengthToMeters(1, 'ft'), 0.3048);
assert.equal(lengthToMeters(1, 'yd'), 0.9144);

{
  const result = calculateLotSizeToAcres(
    dims({ width: 100, length: 200, widthUnit: 'ft', lengthUnit: 'ft', areaUnit: 'ft2' }),
  );
  assert.equal(result.area, 20_000);
  assert.ok(Math.abs(result.acres - 0.4591368) < 1e-7);
}

{
  const result = calculateLotSizeToAcres(
    dims({ width: 150, length: 175, widthUnit: 'yd', lengthUnit: 'yd', areaUnit: 'ac' }),
  );
  assert.ok(Math.abs(result.acres - 5.423553719) < 1e-6);
  assert.ok(Math.abs(result.area - 5.423554) < 1e-5 || Math.abs(result.area - 5.423553) < 1e-5);
}

{
  const result = calculateLotSizeToAcres({
    ...DEFAULT_LOT_SIZE_TO_ACRES_INPUT,
    source: 'solveLength',
    width: 100,
    length: null,
    area: 1,
    widthUnit: 'ft',
    lengthUnit: 'ft',
    areaUnit: 'ac',
  });
  assert.ok(Math.abs(result.length - 435.6) < 1e-9);
}

{
  const result = calculateLotSizeToAcres({
    ...DEFAULT_LOT_SIZE_TO_ACRES_INPUT,
    source: 'solveWidth',
    width: null,
    length: 200,
    area: 1,
    widthUnit: 'ft',
    lengthUnit: 'ft',
    areaUnit: 'ac',
  });
  assert.ok(Math.abs(result.width - 217.8) < 1e-9);
}

{
  const result = calculateLotSizeToAcres(
    dims({
      width: 220,
      length: 220,
      areaUnit: 'ac',
      pricePerUnit: 15_000,
      priceAreaUnit: 'ac',
    }),
  );
  assert.equal(result.acres, 10);
  assert.equal(result.totalPrice, 150_000);
}

{
  const result = calculateLotSizeToAcres(
    dims({
      width: 100,
      length: 200,
      widthUnit: 'ft',
      lengthUnit: 'ft',
      areaUnit: 'ft2',
      pricePerUnit: 5,
      priceAreaUnit: 'ft2',
    }),
  );
  assert.equal(result.totalPrice, 100_000);
}

{
  const m2 = 45.7 * 128.2;
  assert.ok(Math.abs(squareMetersToAcres(m2) - 1.447729) < 1e-5);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateLotSizeToAcres(dims({ width: -1, length: 10 })).isValid);
assert.ok(validateLotSizeToAcres(dims({ width: 0, length: 10 })).isValid);

{
  const result = calculateLotSizeToAcres(dims());
  assert.match(shareResultText(result), /Lot Size to Acres/);
  assert.match(shareResultText(result), /150/);
}

console.log('lot-size-to-acres calculation.test.ts: ok');
