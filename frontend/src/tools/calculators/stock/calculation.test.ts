import assert from 'node:assert/strict';
import {
  calculateStockTrade,
  formatStockMoney,
  formatStockPercent,
} from './calculation';
import { validateStockInput } from './validation';
import { createDefaultInput } from './types';

// Worked example: 100 shares · buy 50 @ 1% · sell 60 @ 1%
{
  const out = calculateStockTrade({
    numberOfShares: 100,
    buyingPrice: 50,
    buyingCommissionPercent: 1,
    sellingPrice: 60,
    sellingCommissionPercent: 1,
  });
  assert.ok(out);
  assert.equal(out.grossPurchaseCost, 5_000);
  assert.equal(out.buyingCommissionAmount, 50);
  assert.equal(out.netBuyingCost, 5_050);
  assert.equal(out.grossSaleProceeds, 6_000);
  assert.equal(out.sellingCommissionAmount, 60);
  assert.equal(out.netSellingProceeds, 5_940);
  assert.equal(out.profit, 890);
  assert.ok(Math.abs(out.roiPercent - (890 / 5_050) * 100) < 1e-10);
  assert.ok(Math.abs(out.breakEvenSellingPrice - 5_050 / 99) < 1e-10);
}

// Zero commissions
{
  const out = calculateStockTrade({
    numberOfShares: 10,
    buyingPrice: 100,
    buyingCommissionPercent: 0,
    sellingPrice: 110,
    sellingCommissionPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.buyingCommissionAmount, 0);
  assert.equal(out.sellingCommissionAmount, 0);
  assert.equal(out.netBuyingCost, 1_000);
  assert.equal(out.netSellingProceeds, 1_100);
  assert.equal(out.profit, 100);
  assert.equal(out.roiPercent, 10);
  assert.equal(out.breakEvenSellingPrice, 100);
}

// Loss and zero profit
{
  const loss = calculateStockTrade({
    numberOfShares: 5,
    buyingPrice: 20,
    buyingCommissionPercent: 0,
    sellingPrice: 10,
    sellingCommissionPercent: 0,
  });
  assert.ok(loss);
  assert.equal(loss.profit, -50);
  assert.equal(loss.roiPercent, -50);

  const flat = calculateStockTrade({
    numberOfShares: 5,
    buyingPrice: 20,
    buyingCommissionPercent: 0,
    sellingPrice: 20,
    sellingCommissionPercent: 0,
  });
  assert.ok(flat);
  assert.equal(flat.profit, 0);
  assert.equal(flat.roiPercent, 0);
}

// Reject invalid inputs / 100% sell commission / zero shares
{
  assert.equal(
    calculateStockTrade({
      numberOfShares: 0,
      buyingPrice: 10,
      buyingCommissionPercent: 0,
      sellingPrice: 12,
      sellingCommissionPercent: 0,
    }),
    null
  );
  assert.equal(
    calculateStockTrade({
      numberOfShares: 10,
      buyingPrice: -1,
      buyingCommissionPercent: 0,
      sellingPrice: 12,
      sellingCommissionPercent: 0,
    }),
    null
  );
  assert.equal(
    calculateStockTrade({
      numberOfShares: 10,
      buyingPrice: 10,
      buyingCommissionPercent: 101,
      sellingPrice: 12,
      sellingCommissionPercent: 0,
    }),
    null
  );
  assert.equal(
    calculateStockTrade({
      numberOfShares: 10,
      buyingPrice: 10,
      buyingCommissionPercent: 0,
      sellingPrice: 12,
      sellingCommissionPercent: 100,
    }),
    null
  );
  assert.equal(
    calculateStockTrade({
      numberOfShares: Number.NaN,
      buyingPrice: 10,
      buyingCommissionPercent: 0,
      sellingPrice: 12,
      sellingCommissionPercent: 0,
    }),
    null
  );
}

// Zero buy price with zero buy commission → net buying cost 0 → reject ROI
{
  assert.equal(
    calculateStockTrade({
      numberOfShares: 10,
      buyingPrice: 0,
      buyingCommissionPercent: 0,
      sellingPrice: 5,
      sellingCommissionPercent: 0,
    }),
    null
  );
}

// Display formatters
{
  assert.equal(formatStockMoney(890, 'PKR'), '890.00');
  assert.equal(formatStockPercent((890 / 5_050) * 100), '17.6238');
}

// Validation: empty defaults incomplete
{
  const empty = validateStockInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: worked example with matching currencies
{
  const input = createDefaultInput();
  input.numberOfShares = '100';
  input.buyingPrice = '50';
  input.buyingCommissionPercent = '1';
  input.sellingPrice = '60';
  input.sellingCommissionPercent = '1';
  const validated = validateStockInput(input);
  assert.equal(validated.isValid, true);
  assert.ok(validated.result);
  assert.equal(validated.result.profitCanonical, 890);
  assert.equal(validated.result.formattedProfit, '890.00');
}

// Validation: 100% selling commission blocked
{
  const input = createDefaultInput();
  input.numberOfShares = '10';
  input.buyingPrice = '50';
  input.buyingCommissionPercent = '0';
  input.sellingPrice = '60';
  input.sellingCommissionPercent = '100';
  const validated = validateStockInput(input);
  assert.equal(validated.isValid, false);
  assert.ok(validated.errors.sellingCommissionPercent);
}

console.log('stock calculation tests passed');
