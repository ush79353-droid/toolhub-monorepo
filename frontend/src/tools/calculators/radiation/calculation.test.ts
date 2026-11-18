import assert from 'node:assert/strict';
import {
  allFromGray,
  allFromSievert,
  fromGray,
  fromSievert,
  shareResultText,
  toGray,
  toSievert,
} from './calculation';
import { grayFromUnit, parseDoseInput, sievertFromUnit } from './validation';

function approx(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(toGray(1, 'gray'), 1);
approx(toGray(1, 'milliGray'), 0.001);
approx(toGray(1, 'rad'), 0.01);
approx(fromGray(1, 'milliGray'), 1000);
approx(fromGray(1, 'rad'), 100);

{
  const a = allFromGray(toGray(250, 'milliGray'));
  approx(a.milliGray, 250);
  approx(a.gray, 0.25);
  approx(a.rad, 25);
}

{
  const a = allFromGray(toGray(10, 'rad'));
  approx(a.gray, 0.1);
  approx(a.milliGray, 100);
}

assert.equal(toSievert(1, 'milliSievert'), 0.001);
approx(toSievert(1, 'microSievert'), 1e-6);
approx(toSievert(1, 'rem'), 0.01);
approx(fromSievert(1, 'milliSievert'), 1000);
approx(fromSievert(1, 'microSievert'), 1_000_000);
approx(fromSievert(1, 'rem'), 100);

{
  const e = allFromSievert(toSievert(50, 'milliSievert'));
  approx(e.milliSievert, 50);
  approx(e.microSievert, 50_000);
  approx(e.rem, 5);
}

{
  const e = allFromSievert(toSievert(1, 'rem'));
  approx(e.milliSievert, 10);
}

assert.equal(parseDoseInput('').blank, true);
assert.ok(parseDoseInput('-1').error);
assert.ok(grayFromUnit(1, 'gray').ok);
assert.ok(sievertFromUnit(50, 'milliSievert').ok);

{
  const share = shareResultText({ gray: 0.25, sievert: 0.05 });
  assert.match(share, /Radiation Converter/);
  assert.match(share, /250 mGy/);
  assert.match(share, /50,000 µSv|50000 µSv/);
  assert.match(share, /not universally interchangeable/);
}

console.log('radiation calculation.test.ts: ok');
