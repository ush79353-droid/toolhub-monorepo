/**
 * Run: cd frontend && npx tsx src/tools/calculators/alcohol-unit/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateAlcoholUnits,
  ukUnitsFromDrink,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateAlcoholUnitInput } from './validation';

assert.equal(ukUnitsFromDrink(500, 5, 1), 2.5);
assert.equal(ukUnitsFromDrink(25, 40, 1), 1);
assert.equal(ukUnitsFromDrink(175, 12, 1), 2.1);
assert.equal(ukUnitsFromDrink(568, 5, 1), 2.84);

const empty = calculateAlcoholUnits(createDefaultInput());
assert.equal(empty.ukUnits, 0);
assert.equal(empty.displayUnits, 0);

const example = calculateAlcoholUnits(createExampleInput());
assert.equal(example.ukUnits, 2.5);
assert.equal(example.ethanolGrams, 20);
assert.equal(example.displayUnits, 2.5);

const usa = calculateAlcoholUnits({
  ...createExampleInput(),
  country: 'usa',
});
assert.equal(usa.ukUnits, 2.5);
assert.equal(usa.displayUnits, 1.43); // 20 g / 14 g

const spirit = calculateAlcoholUnits({
  ...createDefaultInput(),
  spiritCount: 1,
});
assert.equal(spirit.ukUnits, 1);

const wine = calculateAlcoholUnits({
  ...createDefaultInput(),
  wineStandardCount: 1,
});
assert.equal(wine.ukUnits, 2.1);

const beerPint = calculateAlcoholUnits({
  ...createDefaultInput(),
  standardBeerCount: 1,
  standardBeerSize: 'pint',
});
assert.equal(beerPint.ukUnits, 2.84);

const margarita = calculateAlcoholUnits({
  ...createDefaultInput(),
  margaritaCount: 1,
});
assert.equal(margarita.ukUnits, 2);

const invalid = validateAlcoholUnitInput({
  ...createDefaultInput(),
  lowBeerCount: -1,
});
assert.equal(invalid.isValid, false);
assert.ok(invalid.errors.lowBeerCount);

const customBad = validateAlcoholUnitInput({
  ...createDefaultInput(),
  customOpen: true,
  customCount: 1,
  customVolumeMl: null,
  customAbvPercent: 5,
});
assert.equal(customBad.isValid, false);

console.log('alcohol-unit calculation.test.ts: ok');
