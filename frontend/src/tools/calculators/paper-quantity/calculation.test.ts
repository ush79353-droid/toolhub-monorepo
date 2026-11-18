import assert from 'node:assert/strict';
import {
  allFromSheets,
  formatPaperQty,
  fromSheets,
  shareResultText,
  toSheets,
} from './calculation';
import { parsePaperInput, sheetsFromUnit } from './validation';

function approx(actual: number, expected: number, tol = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) <= tol * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(toSheets(1, 'reams'), 500);
assert.equal(toSheets(2, 'reams'), 1000);
assert.equal(toSheets(1, 'quires'), 25);
assert.equal(toSheets(20, 'quires'), 500);
assert.equal(toSheets(1, 'bundles'), 1000);
assert.equal(toSheets(1, 'bales'), 5000);
assert.equal(toSheets(2, 'bales'), 10000);
assert.equal(toSheets(5, 'quires'), 125);

approx(fromSheets(250, 'reams'), 0.5);
approx(fromSheets(1250, 'reams'), 2.5);
approx(fromSheets(500, 'quires'), 20);
approx(fromSheets(1000, 'bundles'), 1);
approx(fromSheets(5000, 'reams'), 10);

{
  const a = allFromSheets(toSheets(1, 'reams'));
  assert.equal(a.sheets, 500);
  assert.equal(a.quires, 20);
  assert.equal(a.reams, 1);
  approx(a.bundles, 0.5);
  approx(a.bales, 0.1);
}

{
  const a = allFromSheets(1000);
  assert.equal(a.sheets, 1000);
  assert.equal(a.quires, 40);
  assert.equal(a.reams, 2);
  assert.equal(a.bundles, 1);
  approx(a.bales, 0.2);
}

{
  const a = allFromSheets(0);
  assert.equal(a.sheets, 0);
  assert.equal(a.quires, 0);
  assert.equal(a.reams, 0);
  assert.equal(a.bundles, 0);
  assert.equal(a.bales, 0);
}

assert.equal(formatPaperQty(1000), '1,000');
assert.equal(formatPaperQty(0.125), '0.125');
assert.equal(formatPaperQty(500), '500');

assert.equal(parsePaperInput('').blank, true);
assert.equal(parsePaperInput('1.').incomplete, true);
assert.ok(parsePaperInput('-1').error);
assert.ok(parsePaperInput('abc').error);
assert.equal(parsePaperInput('1,000').value, 1000);

{
  const r = sheetsFromUnit(1, 'reams');
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.sheets, 500);
}

{
  const share = shareResultText(1000);
  assert.match(share, /Paper Quantity Converter/);
  assert.match(share, /Modern/);
  assert.match(share, /Sheets: 1,000/);
  assert.match(share, /Reams: 2/);
  assert.match(share, /Bundles: 1/);
}

console.log('paper-quantity calculation.test.ts: ok');
