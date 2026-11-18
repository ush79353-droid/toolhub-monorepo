import assert from 'node:assert/strict';
import {
  allFromPixels,
  formatSize,
  fromPixels,
  shareResultText,
  toPixels,
} from './calculation';
import { parseBaseInput, parseSizeInput, pixelsFromUnit } from './validation';

function approx(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

const base16 = 16;

const table: Array<[number, number, number, number]> = [
  [8, 0.5, 6, 50],
  [10, 0.625, 7.5, 62.5],
  [12, 0.75, 9, 75],
  [14, 0.875, 10.5, 87.5],
  [16, 1, 12, 100],
  [18, 1.125, 13.5, 112.5],
  [20, 1.25, 15, 125],
  [24, 1.5, 18, 150],
  [28, 1.75, 21, 175],
  [32, 2, 24, 200],
  [48, 3, 36, 300],
  [64, 4, 48, 400],
];

for (const [px, em, pt, percent] of table) {
  const a = allFromPixels(px, base16);
  approx(a.em, em);
  approx(a.pt, pt);
  approx(a.percent, percent);
  approx(toPixels(em, 'em', base16), px);
  approx(toPixels(pt, 'pt', base16), px);
  approx(toPixels(percent, 'percent', base16), px);
}

// Spec examples
approx(toPixels(32, 'px', 16), 32);
approx(fromPixels(32, 'em', 16), 2);
approx(fromPixels(32, 'pt', 16), 24);
approx(fromPixels(32, 'percent', 16), 200);

approx(toPixels(1.5, 'em', 16), 24);
approx(toPixels(12, 'pt', 16), 16);
approx(toPixels(125, 'percent', 16), 20);

const custom = allFromPixels(30, 20);
approx(custom.em, 1.5);
approx(custom.pt, 22.5);
approx(custom.percent, 150);

approx(toPixels(150, 'percent', 20), 30);

assert.equal(formatSize(1.5), '1.5');
assert.equal(formatSize(0.625), '0.625');
assert.equal(formatSize(16), '16');

assert.equal(parseSizeInput('').blank, true);
assert.equal(parseSizeInput('24').value, 24);
assert.ok(parseSizeInput('-1').error);
assert.ok(parseBaseInput('0').error);
assert.match(parseBaseInput('0').error ?? '', /greater than zero/);
assert.equal(parseBaseInput('16').value, 16);
assert.ok(parseBaseInput('-4').error);

{
  const ok = pixelsFromUnit(24, 'pt', 16);
  assert.equal(ok.ok, true);
  if (ok.ok) approx(ok.px, 32);
}

{
  const share = shareResultText(24, 16, 'px');
  assert.match(share, /Px to Em Converter/);
  assert.match(share, /Base size: 16 px/);
  assert.match(share, /1\.5 em/);
  assert.match(share, /18 pt/);
  assert.match(share, /150 %/);
}

console.log('px-to-em calculation.test.ts: ok');
