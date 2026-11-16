import assert from 'node:assert/strict';
import {
  calculateCentToSquareMeter,
  convertArea,
  formatArea,
  shareResultText,
} from './calculation';
import { validateCentToSquareMeter } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(convertArea(1, 'cent', 'm2'), 40.468564224, 8);
assertClose(convertArea(1, 'cent', 'ft2'), 435.6, 8);
assertClose(convertArea(100, 'cent', 'm2'), 4046.8564224, 8);
assertClose(convertArea(100, 'cent', 'ft2'), 43560, 8);
assertClose(convertArea(4046.8564224, 'm2', 'cent'), 100, 8);
assertClose(convertArea(43560, 'ft2', 'cent'), 100, 8);
assert.equal(convertArea(0, 'cent', 'm2'), 0);

{
  const result = calculateCentToSquareMeter({
    source: 'cent',
    cent: 10,
    m2: null,
    ft2: null,
  });
  assertClose(result.m2, 404.68564224, 8);
  assertClose(result.ft2, 4356, 8);
  assert.match(shareResultText(result), /Cent to Square Meter/);
}

{
  const result = calculateCentToSquareMeter({
    source: 'm2',
    cent: null,
    m2: 100,
    ft2: null,
  });
  assertClose(result.cent, 100 / 40.468564224, 8);
}

assert.ok(
  validateCentToSquareMeter({ source: 'cent', cent: 0, m2: null, ft2: null }).isValid,
);
assert.ok(
  !validateCentToSquareMeter({ source: 'cent', cent: -1, m2: null, ft2: null }).isValid,
);
assert.ok(
  !validateCentToSquareMeter({ source: 'cent', cent: null, m2: null, ft2: null }).isValid,
);
assert.equal(formatArea(0), '0');
assert.ok(!formatArea(Number.NaN));

console.log('cent-to-square-meter calculation.test.ts: ok');
