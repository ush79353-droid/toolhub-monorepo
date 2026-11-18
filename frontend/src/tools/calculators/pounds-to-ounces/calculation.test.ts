import assert from 'node:assert/strict';
import {
  OUNCES_PER_POUND,
  calculatePoundsToOunces,
  formatMass,
  ouncesToPounds,
  poundsToOunces,
  shareResultText,
} from './calculation';
import { validatePoundsToOunces } from './validation';

assert.equal(OUNCES_PER_POUND, 16);

assert.equal(poundsToOunces(0), 0);
assert.equal(poundsToOunces(0.25), 4);
assert.equal(poundsToOunces(0.5), 8);
assert.equal(poundsToOunces(1), 16);
assert.equal(poundsToOunces(2), 32);
assert.equal(poundsToOunces(3), 48);
assert.equal(poundsToOunces(5), 80);
assert.equal(poundsToOunces(7.5), 120);
assert.equal(poundsToOunces(10), 160);
assert.equal(poundsToOunces(15), 240);
assert.equal(poundsToOunces(25), 400);
assert.equal(poundsToOunces(100), 1600);

assert.equal(ouncesToPounds(0), 0);
assert.equal(ouncesToPounds(1), 0.0625);
assert.equal(ouncesToPounds(4), 0.25);
assert.equal(ouncesToPounds(8), 0.5);
assert.equal(ouncesToPounds(16), 1);
assert.equal(ouncesToPounds(24), 1.5);
assert.equal(ouncesToPounds(32), 2);
assert.equal(ouncesToPounds(48), 3);
assert.equal(ouncesToPounds(80), 5);
assert.equal(ouncesToPounds(160), 10);

assert.throws(() => poundsToOunces(-1));
assert.throws(() => ouncesToPounds(-1));
assert.throws(() => poundsToOunces(Number.NaN));
assert.equal(ouncesToPounds(poundsToOunces(7.5)), 7.5);

{
  const result = calculatePoundsToOunces({ source: 'pounds', pounds: 5, ounces: null });
  assert.equal(result.ounces, 80);
  assert.match(shareResultText(result), /Pounds to Ounces Converter/);
  assert.match(shareResultText(result), /5 lb = 80 oz/);
}

{
  const result = calculatePoundsToOunces({ source: 'ounces', pounds: null, ounces: 48 });
  assert.equal(result.pounds, 3);
}

assert.ok(validatePoundsToOunces({ source: 'pounds', pounds: 0, ounces: null }).isValid);
assert.ok(!validatePoundsToOunces({ source: 'pounds', pounds: -1, ounces: null }).isValid);
assert.ok(!validatePoundsToOunces({ source: 'ounces', pounds: null, ounces: Number.NaN }).isValid);

assert.equal(formatMass(poundsToOunces(1)), '16');
assert.equal(formatMass(ouncesToPounds(1)), '0.0625');

console.log('pounds-to-ounces calculation.test.ts: ok');
