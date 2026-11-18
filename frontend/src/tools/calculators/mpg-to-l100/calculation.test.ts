import assert from 'node:assert/strict';
import {
  allFromKmPerLiter,
  fromKmPerLiter,
  shareResultText,
  toKmPerLiter,
  ukMpgToLPer100KmFactor,
  usMpgToLPer100KmFactor,
} from './calculation';
import { UK_MPG_TO_KM_PER_L, US_MPG_TO_KM_PER_L } from './types';
import { kmPerLiterFromUnit, parseFuelInput } from './validation';

function approx(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

const usFactor = usMpgToLPer100KmFactor();
const ukFactor = ukMpgToLPer100KmFactor();

approx(usFactor, 235.214583333333, 1e-10);
approx(ukFactor, 282.480936331822, 1e-10);

approx(toKmPerLiter(30, 'usMpg'), 30 * US_MPG_TO_KM_PER_L);
approx(fromKmPerLiter(30 * US_MPG_TO_KM_PER_L, 'lPer100Km'), usFactor / 30);
approx(usFactor / 30, 7.840486111111, 1e-8);

approx(usFactor / 25, 9.408583333333, 1e-8);
approx(usFactor / 40, 5.880364583333, 1e-8);
approx(ukFactor / 40, 7.062023408296, 1e-8);

{
  const kmL = toKmPerLiter(5, 'lPer100Km');
  approx(kmL, 20);
  approx(fromKmPerLiter(kmL, 'usMpg'), usFactor / 5);
  approx(fromKmPerLiter(kmL, 'ukMpg'), ukFactor / 5);
}

{
  const kmL = toKmPerLiter(8, 'lPer100Km');
  approx(fromKmPerLiter(kmL, 'usMpg'), usFactor / 8);
}

assert.equal(toKmPerLiter(20, 'kmPerLiter'), 20);
assert.equal(fromKmPerLiter(20, 'lPer100Km'), 5);
assert.equal(fromKmPerLiter(10, 'lPer100Km'), 10);

{
  const a = allFromKmPerLiter(toKmPerLiter(15, 'kmPerLiter'));
  approx(a.lPer100Km, 100 / 15);
  approx(a.usMpg, 15 / US_MPG_TO_KM_PER_L);
  approx(a.ukMpg, 15 / UK_MPG_TO_KM_PER_L);
}

// Round trip
{
  const kmL = toKmPerLiter(30, 'usMpg');
  approx(fromKmPerLiter(kmL, 'usMpg'), 30);
  const back = toKmPerLiter(fromKmPerLiter(kmL, 'ukMpg'), 'ukMpg');
  approx(back, kmL);
}

assert.equal(parseFuelInput('').blank, true);
assert.ok(parseFuelInput('0').error);
assert.ok(parseFuelInput('-1').error);
assert.equal(parseFuelInput('30').value, 30);
assert.ok(kmPerLiterFromUnit(30, 'usMpg').ok);

{
  const share = shareResultText(toKmPerLiter(30, 'usMpg'), 'usMpg');
  assert.match(share, /MPG to L\/100 km Converter/);
  assert.match(share, /30 US mpg/);
}

console.log('mpg-to-l100 calculation.test.ts: ok');
