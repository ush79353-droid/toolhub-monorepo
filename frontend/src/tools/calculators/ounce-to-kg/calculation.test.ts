import assert from 'node:assert/strict';
import {
  KG_PER_OUNCE,
  KG_PER_POUND,
  OUNCES_PER_POUND,
  calculateOunceToKg,
  formatMass,
  kilogramsToOunces,
  ouncesToKilograms,
  ouncesToPounds,
  shareResultText,
} from './calculation';
import { validateOunceToKg } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12) {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) <= eps * scale,
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(OUNCES_PER_POUND, 16);
assert.equal(KG_PER_POUND, 0.45359237);
assertClose(KG_PER_OUNCE, 0.028349523125);

assertClose(ouncesToKilograms(0), 0);
assertClose(ouncesToKilograms(1), 0.028349523125);
assertClose(ouncesToKilograms(2), 0.05669904625);
assertClose(ouncesToKilograms(4), 0.1133980925);
assertClose(ouncesToKilograms(8), 0.226796185);
assertClose(ouncesToKilograms(10), 0.28349523125);
assertClose(ouncesToKilograms(16), 0.45359237);
assertClose(ouncesToKilograms(18), 0.51029141625);
assertClose(ouncesToKilograms(24), 0.680388555);
assertClose(ouncesToKilograms(32), 0.90718474);
assertClose(ouncesToKilograms(48), 1.36077711);
assertClose(ouncesToKilograms(100), 2.8349523125);

assertClose(ouncesToPounds(16), 1);
assertClose(ouncesToPounds(8), 0.5);
assertClose(ouncesToPounds(32), 2);

assertClose(kilogramsToOunces(1), 1 / KG_PER_OUNCE);

{
  const sixteen = calculateOunceToKg({ source: 'oz', oz: 16, kg: null, lb: null });
  assertClose(sixteen.kg, 0.45359237);
  assertClose(sixteen.lb, 1);
}

{
  const fromKg = calculateOunceToKg({ source: 'kg', oz: null, kg: 1, lb: null });
  assertClose(fromKg.oz, 1 / KG_PER_OUNCE);
  assertClose(fromKg.lb, 1 / KG_PER_POUND);
}

{
  const fromLb = calculateOunceToKg({ source: 'lb', oz: null, kg: null, lb: 2 });
  assert.equal(fromLb.oz, 32);
  assertClose(fromLb.kg, 0.90718474);
}

{
  const neg = validateOunceToKg({ source: 'oz', oz: -1, kg: null, lb: null });
  assert.equal(neg.isValid, false);
}

assert.equal(formatMass(0.028349523125), '0.028349523125');

assert.match(
  shareResultText(calculateOunceToKg({ source: 'oz', oz: 8, kg: null, lb: null })),
  /Ounce to kg Converter/,
);
assert.match(
  shareResultText(calculateOunceToKg({ source: 'oz', oz: 8, kg: null, lb: null })),
  /8 oz = 0\.226796185 kg = 0\.5 lb/,
);
assert.match(
  shareResultText(calculateOunceToKg({ source: 'oz', oz: 8, kg: null, lb: null })),
  /\/tools\/ounce-to-kg-converter/,
);

console.log('ounce-to-kg calculation.test.ts: ok');
