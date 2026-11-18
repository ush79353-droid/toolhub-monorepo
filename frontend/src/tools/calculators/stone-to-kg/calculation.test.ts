import assert from 'node:assert/strict';
import {
  calculateStoneToKg,
  formatMass,
  kgToStone,
  KG_PER_STONE,
  shareResultText,
  stoneToKg,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assert.equal(KG_PER_STONE, 6.35029318);
assertClose(stoneToKg(1), 6.35029318, 10);
assertClose(stoneToKg(8), 50.80234544, 9);
assertClose(stoneToKg(10), 63.5029318, 9);
assertClose(stoneToKg(15), 95.2543977, 9);
assertClose(kgToStone(70), 11.0231, 4);
assert.equal(stoneToKg(0), 0);
assert.equal(kgToStone(0), 0);

{
  const original = 12.75;
  assertClose(kgToStone(stoneToKg(original)), original, 10);
}

assert.throws(() => stoneToKg(-1), /negative/i);
assert.throws(() => kgToStone(Number.NaN), /finite/i);

{
  const result = calculateStoneToKg({
    source: 'st',
    st: 15,
    kg: null,
  });
  assertClose(result.kg, 95.2543977, 9);
}

{
  const text = shareResultText({
    source: 'st',
    st: 15,
    kg: 95.2543977,
    explanation: '15 st × 6.35029318 = 95.2543977 kg',
  });
  assert.match(text, /Stone to kg Converter/);
  assert.match(text, /15 st/);
  assert.match(text, /stone-to-kg-converter/);
}

assert.equal(formatMass(0), '0');
console.log('stone-to-kg calculation.test.ts: ok');
