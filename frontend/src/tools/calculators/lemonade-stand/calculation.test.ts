import assert from 'node:assert/strict';
import {
  calculateCostPerServing,
  calculateCupsCost,
  calculateIngredientsCost,
  calculateTotalCost,
  calculateTotalProfit,
} from './calculation';
import { createDefaultDraft } from './types';
import { validateLemonadeStandDraft } from './validation';

{
  assert.equal(calculateCupsCost(10, 2, false, Number.NaN), 20);
  assert.equal(calculateCupsCost(10, 2, true, 15), 15);
  assert.equal(calculateIngredientsCost('known', 30, 0, 0, 0), 30);
  assert.equal(calculateIngredientsCost('recipe', 0, 10, 5, 5), 20);
  assert.equal(calculateTotalCost(20, 30, 0, 0), 50);
  assert.equal(calculateCostPerServing(50, 10), 5);
  assert.equal(calculateTotalProfit(8, 10, 50), 30);
}

{
  const d = createDefaultDraft();
  assert.equal(d.hasTargetGoal, 'no');
  assert.equal(d.servings, '1');
  assert.equal(d.otherOpen, false);
}

{
  const v = validateLemonadeStandDraft({
    ...createDefaultDraft(),
    costPerCup: '2',
    ingredientsCost: '30',
    sellingPrice: '8',
    servings: '10',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result!.totalCost, 50);
  assert.equal(v.result!.totalProfit, 30);
}

{
  const v = validateLemonadeStandDraft({
    ...createDefaultDraft(),
    costPerCup: '5',
    ingredientsCost: '0',
    sellingPrice: '1',
    servings: '1',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result!.totalProfit < 0);
}

console.log('lemonade-stand calculation.test.ts: ok');
