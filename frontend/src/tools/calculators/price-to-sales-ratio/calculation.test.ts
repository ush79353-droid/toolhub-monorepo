/**
 * Runnable self-check for Price to Sales Ratio Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/price-to-sales-ratio/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculatePriceToSales } from './calculation';
import { createDefaultInput } from './types';
import { validatePriceToSalesInput } from './validation';

{
  const r = calculatePriceToSales({
    sales: 10_000_000,
    sharesOutstanding: 1_000_000,
    pricePerShare: 50,
  });
  assert.ok(r);
  assert.equal(r.salesPerShare, 10);
  assert.equal(r.priceToSalesRatio, 5);
  assert.equal(r.ratioUndefined, false);
}

{
  const r = calculatePriceToSales({
    sales: 0,
    sharesOutstanding: 100,
    pricePerShare: 50,
  });
  assert.ok(r);
  assert.equal(r.salesPerShare, 0);
  assert.equal(r.priceToSalesRatio, null);
  assert.equal(r.ratioUndefined, true);
}

{
  const r = calculatePriceToSales({
    sales: 1_000_000,
    sharesOutstanding: 100_000,
    pricePerShare: 0,
  });
  assert.ok(r);
  assert.equal(r.salesPerShare, 10);
  assert.equal(r.priceToSalesRatio, 0);
  assert.equal(r.ratioUndefined, false);
}

{
  const r = calculatePriceToSales({
    sales: 5_000,
    sharesOutstanding: 500,
  });
  assert.ok(r);
  assert.equal(r.salesPerShare, 10);
  assert.equal(r.priceToSalesRatio, null);
  assert.equal(r.ratioUndefined, false);
}

assert.equal(
  calculatePriceToSales({
    sales: 100,
    sharesOutstanding: 0,
    pricePerShare: 10,
  }),
  null
);

assert.equal(
  calculatePriceToSales({
    sales: -100,
    sharesOutstanding: 10,
    pricePerShare: 10,
  }),
  null
);

assert.equal(
  calculatePriceToSales({
    sales: 100,
    sharesOutstanding: 10,
    pricePerShare: -1,
  }),
  null
);

{
  const empty = validatePriceToSalesInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const ok = validatePriceToSalesInput({
    ...createDefaultInput(),
    sales: '10000000',
    sharesOutstanding: '1000000',
    pricePerShare: '50',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.salesPerShareInSalesCurrency, 10);
  assert.equal(ok.result.priceToSalesRatio, 5);
  assert.equal(ok.result.ratioUndefined, false);
}

{
  const zeroSales = validatePriceToSalesInput({
    ...createDefaultInput(),
    sales: '0',
    sharesOutstanding: '100',
    pricePerShare: '50',
  });
  assert.equal(zeroSales.isValid, true);
  assert.ok(zeroSales.result);
  assert.equal(zeroSales.result.ratioUndefined, true);
  assert.equal(zeroSales.result.priceToSalesRatio, null);
}

{
  const zeroPrice = validatePriceToSalesInput({
    ...createDefaultInput(),
    sales: '1000000',
    sharesOutstanding: '100000',
    pricePerShare: '0',
  });
  assert.equal(zeroPrice.isValid, true);
  assert.ok(zeroPrice.result);
  assert.equal(zeroPrice.result.priceToSalesRatio, 0);
}

console.log('price-to-sales-ratio calculation.self-check: ok');
