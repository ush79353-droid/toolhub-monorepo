import assert from 'node:assert/strict';
import {
  GRAMS_PER_OUNCE,
  calculateOuncesToGrams,
  formatMass,
  gramsToOunces,
  ouncesToGrams,
  shareResultText,
} from './calculation';
import { validateOuncesToGrams } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-12) {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) <= eps * scale,
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(GRAMS_PER_OUNCE, 28.349523125);

assertClose(ouncesToGrams(0), 0);
assertClose(ouncesToGrams(1), 28.349523125);
assertClose(ouncesToGrams(2), 56.69904625);
assertClose(ouncesToGrams(5), 141.747615625);
assertClose(ouncesToGrams(8), 226.796185);
assertClose(ouncesToGrams(10), 283.49523125);
assertClose(ouncesToGrams(14), 396.89332375);
assertClose(ouncesToGrams(16), 453.59237);

assertClose(gramsToOunces(100), 100 / GRAMS_PER_OUNCE);
assertClose(gramsToOunces(250), 250 / GRAMS_PER_OUNCE);
assertClose(gramsToOunces(453.59237), 16);

{
  const one = calculateOuncesToGrams({ source: 'oz', oz: 1, g: null });
  assertClose(one.g, 28.349523125);
  assert.equal(formatMass(one.g), '28.349523125');
}

{
  const fromG = calculateOuncesToGrams({ source: 'g', oz: null, g: 100 });
  assertClose(fromG.oz, 100 / GRAMS_PER_OUNCE);
}

{
  const neg = validateOuncesToGrams({ source: 'oz', oz: -1, g: null });
  assert.equal(neg.isValid, false);
}

assert.match(
  shareResultText(calculateOuncesToGrams({ source: 'oz', oz: 5, g: null })),
  /Ounces to Grams Converter/,
);
assert.match(
  shareResultText(calculateOuncesToGrams({ source: 'oz', oz: 5, g: null })),
  /5 oz = 141\.747615625 g/,
);
assert.match(
  shareResultText(calculateOuncesToGrams({ source: 'oz', oz: 5, g: null })),
  /\/tools\/ounces-to-grams-converter/,
);

console.log('ounces-to-grams calculation.test.ts: ok');
