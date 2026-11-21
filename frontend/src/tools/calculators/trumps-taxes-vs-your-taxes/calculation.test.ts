import assert from 'node:assert/strict';
import {
  COMPARISON_ITEMS,
  DEFAULT_TRUMP_TAX_USD,
  DEFAULT_USER_TAX_USD,
  REFERENCE_TAX_DIFFERENCE_USD,
} from './comparison-items';
import {
  calculateTrumpsTaxesComparison,
  formatUsd,
  itemQuantity,
  percentageDifference,
  taxDifference,
  taxRatio,
} from './calculation';
import { createDefaultInput } from './types';
import { validateTrumpsTaxesInput } from './validation';

assert.equal(DEFAULT_USER_TAX_USD, 3202);
assert.equal(DEFAULT_TRUMP_TAX_USD, 750);
assert.equal(REFERENCE_TAX_DIFFERENCE_USD, 2452);

{
  const ratio = taxRatio(3202, 750);
  assert.ok(ratio !== null);
  assert.ok(Math.abs(ratio! - 3202 / 750) < 1e-12);
}

{
  assert.equal(taxDifference(3202, 750), 2452);
  const pct = percentageDifference(3202, 750);
  assert.ok(pct !== null);
  assert.ok(Math.abs(pct! - ((3202 - 750) / 750) * 100) < 1e-10);
}

assert.equal(taxRatio(100, 0), null);
assert.equal(percentageDifference(100, 0), null);
assert.equal(itemQuantity(2452, 0), 0);
assert.equal(itemQuantity(-10, 5), 0);
assert.equal(itemQuantity(100, -5), 0);

{
  const prices: Record<string, number> = {};
  for (const item of COMPARISON_ITEMS) {
    prices[item.id] = item.defaultUnitPriceUsd;
  }
  const result = calculateTrumpsTaxesComparison(3202, 750, prices);
  assert.ok(result);
  assert.equal(result!.taxDifference, 2452);
  assert.equal(result!.availableForComparisons, 2452);
  assert.equal(formatUsd(result!.userTax), '3,202.00');
  assert.equal(formatUsd(result!.trumpTax), '750.00');

  for (const item of COMPARISON_ITEMS) {
    const line = [...result!.luxuryLines, ...result!.essentialLines].find((l) => l.id === item.id);
    assert.ok(line, item.id);
    assert.equal(
      line!.quantity,
      item.referenceQuantityAtDefault,
      `${item.id} expected ${item.referenceQuantityAtDefault}, got ${line!.quantity}`,
    );
  }
}

{
  const prices: Record<string, number> = {};
  for (const item of COMPARISON_ITEMS) {
    prices[item.id] = item.defaultUnitPriceUsd;
  }
  const equal = calculateTrumpsTaxesComparison(750, 750, prices);
  assert.ok(equal);
  assert.equal(equal!.taxDifference, 0);
  assert.equal(equal!.availableForComparisons, 0);
  assert.ok(equal!.luxuryLines.every((l) => l.quantity === 0));
}

{
  const prices: Record<string, number> = {};
  for (const item of COMPARISON_ITEMS) {
    prices[item.id] = item.defaultUnitPriceUsd;
  }
  const less = calculateTrumpsTaxesComparison(500, 750, prices);
  assert.ok(less);
  assert.equal(less!.taxDifference, -250);
  assert.equal(less!.availableForComparisons, 0);
  assert.ok(less!.taxRatio < 1);
}

{
  const validated = validateTrumpsTaxesInput(createDefaultInput());
  assert.equal(validated.isValid, true);
  assert.ok(validated.result);
  assert.equal(validated.result!.luxuryLines[0]?.quantity, 43);
}

{
  const bad = validateTrumpsTaxesInput({
    ...createDefaultInput(),
    trumpTax: '0',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.trumpTax);
}

{
  const blank = validateTrumpsTaxesInput({
    ...createDefaultInput(),
    userTax: '',
  });
  assert.equal(blank.isValid, false);
  assert.ok(blank.errors.userTax);
}

{
  const reset = createDefaultInput();
  assert.equal(reset.userTax, '3202.00');
  assert.equal(reset.trumpTax, '750.00');
  const again = validateTrumpsTaxesInput(reset);
  assert.equal(again.isValid, true);
}

console.log('trumps-taxes-vs-your-taxes calculation.test.ts: ok');
