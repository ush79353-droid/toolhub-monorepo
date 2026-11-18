import assert from 'node:assert/strict';
import {
  NANOMETERS_PER_METER,
  calculateNmToM,
  formatLength,
  metersToNanometers,
  nanometersToMeters,
  shareResultText,
} from './calculation';

function assertClose(actual: number, expected: number, eps = 1e-12) {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) <= eps * scale,
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(NANOMETERS_PER_METER, 1_000_000_000);

assertClose(nanometersToMeters(1), 1e-9);
assertClose(nanometersToMeters(10), 1e-8);
assertClose(nanometersToMeters(100), 1e-7);
assertClose(nanometersToMeters(120), 1.2e-7);
assertClose(nanometersToMeters(500), 5e-7);
assertClose(nanometersToMeters(1000), 1e-6);
assertClose(nanometersToMeters(1_000_000), 0.001);
assertClose(nanometersToMeters(1_000_000_000), 1);

assert.equal(metersToNanometers(1), 1_000_000_000);
assert.equal(metersToNanometers(0.1), 100_000_000);
assert.equal(metersToNanometers(0.001), 1_000_000);
assert.equal(metersToNanometers(0.000001), 1000);

{
  const one = calculateNmToM({ source: 'nm', nm: 1, m: null });
  assertClose(one.m, 1e-9);
  assert.notEqual(formatLength(one.m), '0');
}

{
  const hundred = calculateNmToM({ source: 'nm', nm: 100, m: null });
  assertClose(hundred.m, 1e-7);
}

{
  const fromM = calculateNmToM({ source: 'm', nm: null, m: 0.001 });
  assert.equal(fromM.nm, 1_000_000);
}

assert.match(
  shareResultText(calculateNmToM({ source: 'nm', nm: 120, m: null })),
  /nm to m Converter/,
);
assert.match(
  shareResultText(calculateNmToM({ source: 'nm', nm: 120, m: null })),
  /120 nm =/,
);
assert.match(
  shareResultText(calculateNmToM({ source: 'nm', nm: 120, m: null })),
  /\/tools\/nm-to-m-converter/,
);

console.log('nm-to-m calculation.test.ts: ok');
