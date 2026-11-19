/**
 * Run: npx --yes tsx src/tools/calculators/revenue/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateRevenue } from './calculation';

const revenue = calculateRevenue({
  solveFor: 'totalRevenue',
  price: 100,
  quantity: 25,
  totalRevenue: null,
});
assert.ok(revenue);
assert.equal(revenue.totalRevenue, 2500);
assert.equal(revenue.solvedField, 'totalRevenue');

const price = calculateRevenue({
  solveFor: 'price',
  price: null,
  quantity: 25,
  totalRevenue: 2500,
});
assert.ok(price);
assert.equal(price.price, 100);

const quantity = calculateRevenue({
  solveFor: 'quantity',
  price: 100,
  quantity: null,
  totalRevenue: 2500,
});
assert.ok(quantity);
assert.equal(quantity.quantity, 25);

assert.equal(
  calculateRevenue({
    solveFor: 'price',
    price: null,
    quantity: 0,
    totalRevenue: 100,
  }),
  null
);

assert.equal(
  calculateRevenue({
    solveFor: 'quantity',
    price: 0,
    quantity: null,
    totalRevenue: 100,
  }),
  null
);

const zeroOk = calculateRevenue({
  solveFor: 'totalRevenue',
  price: 0,
  quantity: 10,
  totalRevenue: null,
});
assert.ok(zeroOk);
assert.equal(zeroOk.totalRevenue, 0);

console.log('revenue calculation.test.ts: all assertions passed');
