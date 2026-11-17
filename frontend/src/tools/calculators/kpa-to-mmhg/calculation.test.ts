import assert from 'node:assert/strict';
import {
  MMHG_PER_KPA,
  calculateKpaToMmhg,
  formatPressure,
  kPaToMmHg,
  mmHgToKPa,
  shareResultText,
} from './calculation';
import { validateKpaToMmhg } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(MMHG_PER_KPA, 760_000 / 101_325, 12);
assertClose(kPaToMmHg(101.325), 760, 10);
assertClose(mmHgToKPa(760), 101.325, 10);
assertClose(kPaToMmHg(1), 7.50061683, 8);
assertClose(kPaToMmHg(7), 52.5043178, 6);
assertClose(mmHgToKPa(30), 3.99967105, 7);
assert.equal(kPaToMmHg(0), 0);
assert.equal(mmHgToKPa(0), 0);
assertClose(kPaToMmHg(-101.325), -760, 10);
assertClose(kPaToMmHg(2), 15.001234, 5);
assertClose(kPaToMmHg(5), 37.503084, 5);
assertClose(kPaToMmHg(10), 75.006168, 5);
assertClose(kPaToMmHg(100), 750.061683, 5);
assertClose(kPaToMmHg(1000), 7500.616827, 5);

{
  const original = 245.75;
  assertClose(mmHgToKPa(kPaToMmHg(original)), original, 10);
}

{
  const result = calculateKpaToMmhg({ source: 'kPa', kPa: 101.325, mmHg: null });
  assertClose(result.mmHg, 760, 10);
  assert.match(shareResultText(result), /kPa to mmHg Conversion/);
}

{
  const result = calculateKpaToMmhg({ source: 'mmHg', kPa: null, mmHg: 760 });
  assertClose(result.kPa, 101.325, 10);
}

assert.ok(validateKpaToMmhg({ source: 'kPa', kPa: 0, mmHg: null }).isValid);
assert.ok(validateKpaToMmhg({ source: 'kPa', kPa: -1.5, mmHg: null }).isValid);
assert.ok(!validateKpaToMmhg({ source: 'kPa', kPa: Number.NaN, mmHg: null }).isValid);
assert.ok(
  !validateKpaToMmhg({
    source: 'mmHg',
    kPa: null,
    mmHg: Number.POSITIVE_INFINITY,
  }).isValid,
);

assert.ok(formatPressure(kPaToMmHg(1)).startsWith('7.500'));

console.log('kpa-to-mmhg calculation.test.ts: ok');
