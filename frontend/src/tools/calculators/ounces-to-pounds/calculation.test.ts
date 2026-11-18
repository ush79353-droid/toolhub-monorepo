import assert from 'node:assert/strict';
import {
  KG_PER_OUNCE,
  KG_PER_POUND,
  OUNCES_PER_POUND,
  calculateOuncesToPounds,
  formatMass,
  kilogramsToOunces,
  ouncesToKilograms,
  ouncesToPounds,
  poundsToOunces,
  shareResultText,
} from './calculation';
import { validateOuncesToPounds } from './validation';

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

assertClose(ouncesToPounds(0), 0);
assertClose(ouncesToPounds(1), 0.0625);
assertClose(ouncesToPounds(2), 0.125);
assertClose(ouncesToPounds(4), 0.25);
assertClose(ouncesToPounds(8), 0.5);
assertClose(ouncesToPounds(16), 1);
assertClose(ouncesToPounds(24), 1.5);
assertClose(ouncesToPounds(32), 2);
assertClose(ouncesToPounds(48), 3);
assertClose(ouncesToPounds(64), 4);

assert.equal(poundsToOunces(1), 16);
assert.equal(poundsToOunces(2), 32);
assert.equal(poundsToOunces(2.5), 40);

assertClose(ouncesToKilograms(16), 0.45359237);
assertClose(ouncesToKilograms(32), 0.90718474);
assertClose(kilogramsToOunces(1), 1 / KG_PER_OUNCE);

{
  const sixteen = calculateOuncesToPounds({ source: 'oz', oz: 16, lb: null, kg: null });
  assertClose(sixteen.lb, 1);
  assertClose(sixteen.kg, 0.45359237);
}

{
  const fromLb = calculateOuncesToPounds({ source: 'lb', oz: null, lb: 3, kg: null });
  assert.equal(fromLb.oz, 48);
  assertClose(fromLb.kg, 1.36077711);
}

{
  const fromKg = calculateOuncesToPounds({ source: 'kg', oz: null, lb: null, kg: 1 });
  assertClose(fromKg.oz, 1 / KG_PER_OUNCE);
  assertClose(fromKg.lb, 1 / KG_PER_POUND);
}

{
  const neg = validateOuncesToPounds({ source: 'oz', oz: -1, lb: null, kg: null });
  assert.equal(neg.isValid, false);
}

assert.equal(formatMass(0.0625), '0.0625');

assert.match(
  shareResultText(calculateOuncesToPounds({ source: 'oz', oz: 32, lb: null, kg: null })),
  /Ounces to Pounds Converter/,
);
assert.match(
  shareResultText(calculateOuncesToPounds({ source: 'oz', oz: 32, lb: null, kg: null })),
  /32 oz = 2 lb =/,
);
assert.match(
  shareResultText(calculateOuncesToPounds({ source: 'oz', oz: 32, lb: null, kg: null })),
  /\/tools\/ounces-to-pounds-converter/,
);

console.log('ounces-to-pounds calculation.test.ts: ok');
