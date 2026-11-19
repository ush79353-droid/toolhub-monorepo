/**
 * Self-check for Revenue Calculator formulas.
 * Run: npx tsx frontend/src/tools/calculators/revenue/calculation.test.ts
 */
import {
  calculateRevenue,
  solvePrice,
  solveQuantity,
  solveTotalRevenue,
} from './calculation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(solveTotalRevenue(100, 25) === 2500, '100×25=2500');
assert(solvePrice(2500, 25) === 100, '2500/25=100');
assert(solveQuantity(2500, 100) === 25, '2500/100=25');
assert(solvePrice(100, 0) === null, 'div by zero quantity');
assert(solveQuantity(100, 0) === null, 'div by zero price');
assert(solveTotalRevenue(0, 10) === 0, 'zero price ok');

const total = calculateRevenue({
  solveFor: 'totalRevenue',
  price: 100,
  quantity: 25,
  totalRevenue: null,
  calcCurrency: 'PKR',
  totalRevenueCurrency: 'PKR',
});
assert(total && total.totalRevenue === 2500, 'engine total');

const price = calculateRevenue({
  solveFor: 'price',
  price: null,
  quantity: 25,
  totalRevenue: 2500,
  calcCurrency: 'PKR',
  totalRevenueCurrency: 'PKR',
});
assert(price && price.price === 100, 'engine price');

console.log('revenue/calculation.test.ts: ok');
