import assert from 'node:assert/strict';
import {
  calculateTbspToGrams,
  formatKitchen,
  gramsPerTablespoon,
  gramsToTablespoons,
  shareResultText,
  tablespoonsToGrams,
  US_TABLESPOON_ML,
} from './calculation';
import { DEFAULT_INGREDIENT_ID, findIngredient } from './ingredients';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assert.equal(US_TABLESPOON_ML, 14.78676478125);
assert.equal(DEFAULT_INGREDIENT_ID, 'butter');
assertClose(tablespoonsToGrams(2, 1), 29.5735295625, 9);
assertClose(tablespoonsToGrams(2, 0.959), 28.36, 2);
assertClose(gramsPerTablespoon(1), 14.78676478125, 9);
assert.equal(tablespoonsToGrams(0, 1), 0);
assert.ok(Number.isNaN(gramsToTablespoons(10, 0)));

{
  const grams = tablespoonsToGrams(5, 0.845);
  assertClose(gramsToTablespoons(grams, 0.845), 5, 10);
}

{
  const butter = findIngredient('butter');
  assert.ok(butter);
  assert.equal(butter.densityGPerMl, 0.959);
  assertClose(gramsPerTablespoon(butter.densityGPerMl), 14.18, 2);
}

{
  const result = calculateTbspToGrams({
    source: 'tablespoons',
    ingredientId: 'butter',
    tablespoons: 2,
    grams: null,
  });
  assertClose(result.grams, 28.36, 2);
  assert.equal(result.ingredientName, 'Butter');
}

{
  const text = shareResultText({
    source: 'tablespoons',
    ingredientId: 'butter',
    ingredientName: 'Butter',
    densityGPerMl: 0.959,
    tablespoons: 2,
    grams: 28.361,
    gramsPerTbsp: 14.1805,
    explanation: '2 US tbsp …',
  });
  assert.match(text, /tbsp to Grams Converter/);
  assert.match(text, /Butter/);
  assert.match(text, /tbsp-to-grams-converter-with-ingredient-weights/);
}

assert.equal(formatKitchen(0), '0');
console.log('tbsp-to-grams calculation.test.ts: ok');
