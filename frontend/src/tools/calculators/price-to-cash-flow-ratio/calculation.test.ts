/**
 * Runnable self-check for Price to Cash Flow Ratio Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/price-to-cash-flow-ratio/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculatePriceToCashFlow } from './calculation';
import { createDefaultInput } from './types';
import { validatePriceToCashFlowInput } from './validation';

{
  const r = calculatePriceToCashFlow({
    cashFlow: 10_000_000,
    sharesOutstanding: 1_000_000,
    pricePerShare: 150,
  });
  assert.ok(r);
  assert.equal(r.cashFlowPerShare, 10);
  assert.equal(r.priceToCashFlowRatio, 15);
  assert.equal(r.ratioUndefined, false);
}

{
  const r = calculatePriceToCashFlow({
    cashFlow: 0,
    sharesOutstanding: 100,
    pricePerShare: 50,
  });
  assert.ok(r);
  assert.equal(r.cashFlowPerShare, 0);
  assert.equal(r.priceToCashFlowRatio, null);
  assert.equal(r.ratioUndefined, true);
}

{
  const r = calculatePriceToCashFlow({
    cashFlow: -1_000_000,
    sharesOutstanding: 100_000,
    pricePerShare: 20,
  });
  assert.ok(r);
  assert.equal(r.cashFlowPerShare, -10);
  assert.equal(r.priceToCashFlowRatio, -2);
  assert.equal(r.ratioUndefined, false);
}

{
  const r = calculatePriceToCashFlow({
    cashFlow: 5_000,
    sharesOutstanding: 500,
  });
  assert.ok(r);
  assert.equal(r.cashFlowPerShare, 10);
  assert.equal(r.priceToCashFlowRatio, null);
  assert.equal(r.ratioUndefined, false);
}

assert.equal(
  calculatePriceToCashFlow({
    cashFlow: 100,
    sharesOutstanding: 0,
    pricePerShare: 10,
  }),
  null
);

assert.equal(
  calculatePriceToCashFlow({
    cashFlow: 100,
    sharesOutstanding: 10,
    pricePerShare: -1,
  }),
  null
);

{
  const empty = validatePriceToCashFlowInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const ok = validatePriceToCashFlowInput({
    ...createDefaultInput(),
    cashFlow: '10000000',
    sharesOutstanding: '1000000',
    pricePerShare: '150',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.cashFlowPerShareInCashFlowCurrency, 10);
  assert.equal(ok.result.priceToCashFlowRatio, 15);
  assert.equal(ok.result.ratioUndefined, false);
}

{
  const zeroCf = validatePriceToCashFlowInput({
    ...createDefaultInput(),
    cashFlow: '0',
    sharesOutstanding: '100',
    pricePerShare: '50',
  });
  assert.equal(zeroCf.isValid, true);
  assert.ok(zeroCf.result);
  assert.equal(zeroCf.result.ratioUndefined, true);
  assert.equal(zeroCf.result.priceToCashFlowRatio, null);
}

{
  const neg = validatePriceToCashFlowInput({
    ...createDefaultInput(),
    cashFlow: '-1000000',
    sharesOutstanding: '100000',
    pricePerShare: '20',
  });
  assert.equal(neg.isValid, true);
  assert.ok(neg.result);
  assert.equal(neg.result.priceToCashFlowRatio, -2);
  assert.ok(neg.result.negativeRatioNote);
}

console.log('price-to-cash-flow-ratio calculation.self-check: ok');
