import assert from 'node:assert/strict';
import { calculateMarginAndSalesTax } from './calculation';
import { validateMarginAndSalesTaxInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// Cost 100, markup 25%, tax 8% → net 125, profit 25, margin 20%, gross 135
{
  const r = calculateMarginAndSalesTax({
    cost: 100,
    markupPercent: 25,
    salesTaxPercent: 8,
  });
  assert.ok(r);
  approxEqual(r.netPrice, 125);
  approxEqual(r.profit, 25);
  assert.equal(r.marginPercent, 20);
  approxEqual(r.grossPrice, 135);
  approxEqual(r.salesTaxAmount, 10);
}

// Zero cost + zero markup → net 0, margin null, gross 0
{
  const r = calculateMarginAndSalesTax({
    cost: 0,
    markupPercent: 0,
    salesTaxPercent: 10,
  });
  assert.ok(r);
  approxEqual(r.netPrice, 0);
  approxEqual(r.profit, 0);
  assert.equal(r.marginPercent, null);
  approxEqual(r.grossPrice, 0);
}

// Negative markup (−50%) on cost 200 → net 100, margin −100%
{
  const r = calculateMarginAndSalesTax({
    cost: 200,
    markupPercent: -50,
    salesTaxPercent: 0,
  });
  assert.ok(r);
  approxEqual(r.netPrice, 100);
  approxEqual(r.profit, -100);
  assert.equal(r.marginPercent, -100);
  approxEqual(r.grossPrice, 100);
}

// Validation with matching currencies (no rates needed)
{
  const input = {
    ...createDefaultInput(),
    cost: '100',
    markupPercent: '25',
    salesTaxPercent: '8',
  };
  const v = validateMarginAndSalesTaxInput(input, null);
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  approxEqual(v.result.netPrice, 125);
  approxEqual(v.result.grossPrice, 135);
  assert.equal(v.result.formattedMarginPercent, '20');
}

{
  const input = {
    ...createDefaultInput(),
    cost: '-1',
    markupPercent: '10',
    salesTaxPercent: '-1',
  };
  const v = validateMarginAndSalesTaxInput(input, null);
  assert.equal(v.isValid, false);
  assert.ok(v.errors.cost);
  assert.ok(v.errors.salesTaxPercent);
}

console.log('margin-and-sales-tax calculation.test.ts: ok');
