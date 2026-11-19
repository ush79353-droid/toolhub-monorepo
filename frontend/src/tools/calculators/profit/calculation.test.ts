import assert from 'node:assert/strict';
import { calculateProfit } from './calculation';

// Example: 100/1 cost · 150/1 price · qty 10 · 10% discount
{
  const r = calculateProfit({
    cost: 100,
    costPer: 1,
    price: 150,
    pricePer: 1,
    quantity: 10,
    discountPercent: 10,
  });
  assert.ok(r);
  assert.equal(r.unitCost, 100);
  assert.equal(r.unitPrice, 150);
  assert.equal(r.totalCost, 1000);
  assert.equal(r.revenue, 1350);
  assert.equal(r.totalProfit, 350);
}

// Pack normalization: cost 200 for 4 · price 90 for 2 · qty 8 · 0%
{
  const r = calculateProfit({
    cost: 200,
    costPer: 4,
    price: 90,
    pricePer: 2,
    quantity: 8,
    discountPercent: 0,
  });
  assert.ok(r);
  assert.equal(r.unitCost, 50);
  assert.equal(r.unitPrice, 45);
  assert.equal(r.totalCost, 400);
  assert.equal(r.revenue, 360);
  assert.equal(r.totalProfit, -40);
}

// Zero quantity / zero discount
{
  const r = calculateProfit({
    cost: 50,
    costPer: 1,
    price: 80,
    pricePer: 1,
    quantity: 0,
    discountPercent: 0,
  });
  assert.ok(r);
  assert.equal(r.totalCost, 0);
  assert.equal(r.revenue, 0);
  assert.equal(r.totalProfit, 0);
}

// Division by zero rejected
{
  assert.equal(
    calculateProfit({
      cost: 10,
      costPer: 0,
      price: 20,
      pricePer: 1,
      quantity: 1,
      discountPercent: 0,
    }),
    null
  );
}

// Discount bounds
{
  assert.equal(
    calculateProfit({
      cost: 10,
      costPer: 1,
      price: 20,
      pricePer: 1,
      quantity: 1,
      discountPercent: 101,
    }),
    null
  );
}

console.log('profit calculation.test.ts: all assertions passed');
