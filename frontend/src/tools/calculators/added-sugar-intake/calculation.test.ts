/**
 * Run: cd frontend && npx tsx src/tools/calculators/added-sugar-intake/calculation.test.ts
 */
import {
  calculateAddedSugarIntake,
  formatGrams,
  gramsToTeaspoons,
  totalAddedSugarGrams,
} from './calculation';
import { GRAMS_PER_TEASPOON } from './food-data';
import {
  createDefaultInput,
  createScreenshotFixtureInput,
} from './types';
import { validateAddedSugarIntakeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(GRAMS_PER_TEASPOON === 4, '4 g per tsp');

{
  const input = createScreenshotFixtureInput();
  const r = calculateAddedSugarIntake(input);
  assert(r.totalGrams === 75, `screenshot fixture total ${r.totalGrams}`);
  assert(r.approximateTeaspoons === 18.8, `tsp ${r.approximateTeaspoons}`);
  assert(r.overGuideline === true, 'over 25g female limit');
}

{
  const input = createDefaultInput();
  input.cerealQtyText = '0';
  input.drinkQtyText = '0';
  const r = calculateAddedSugarIntake(input);
  assert(r.totalGrams === 0, 'zeros');
}

{
  const input = createScreenshotFixtureInput();
  input.drinkQtyText = '0.5';
  const r = calculateAddedSugarIntake(input);
  assert(r.totalGrams === 62.5, `half coke ${r.totalGrams}`);
}

{
  const input = createScreenshotFixtureInput();
  input.candyId = 'chocolate_bar';
  input.candyQtyText = '1';
  const r = calculateAddedSugarIntake(input);
  assert(r.totalGrams != null && r.totalGrams > 75, 'product swap');
}

{
  const v = validateAddedSugarIntakeInput(createDefaultInput());
  assert(v.result != null && v.result.totalGrams === 0, 'blank default zero');
}

{
  const input = createDefaultInput();
  input.teaCoffeeTspText = '-1';
  const v = validateAddedSugarIntakeInput(input);
  assert(v.errors.teaCoffeeTspText != null, 'negative tsp');
}

{
  const g = gramsToTeaspoons(12);
  assert(g === 3, 'tsp conv');
  assert(formatGrams(75) === '75', 'fmt');
}

{
  const input = createScreenshotFixtureInput();
  const qty = {
    drink: 1,
    dairy: 2,
    cereal: 0,
    obviousBaked: 0,
    candy: 5,
    teaTsp: 2,
    otherObvious: 0,
    hiddenSnack: 0,
    hiddenBread: 1,
    dressing: 1,
    otherHidden: 0,
  };
  assert(totalAddedSugarGrams(input, qty) === 75, 'direct sum');
}

console.log('added-sugar-intake calculation.test.ts: ok');