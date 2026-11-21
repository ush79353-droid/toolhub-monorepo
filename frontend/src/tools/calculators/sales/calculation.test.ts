import assert from 'node:assert/strict';
import {
  calculateSales,
  convertBetweenPeriods,
  periodToMonthlyFactor,
} from './calculation';

// 100 × 25 / mo → gross 2,500 / mo → annual 30,000; no deductions → net = gross
{
  const r = calculateSales({
    productPrice: 100,
    quantity: 25,
    quantityPeriod: 'month',
    salesReturns: 0,
    salesAllowances: 0,
    salesDiscounts: 0,
  });
  assert.ok(r);
  assert.equal(r.grossInPeriod, 2500);
  assert.equal(r.monthlyGross, 2500);
  assert.equal(r.annualGross, 30000);
  assert.equal(r.netInPeriod, 2500);
}

// Deductions: returns 100 + allowances 50 + discounts 50 = 200 → net 2,300 / mo
{
  const r = calculateSales({
    productPrice: 100,
    quantity: 25,
    quantityPeriod: 'month',
    salesReturns: 100,
    salesAllowances: 50,
    salesDiscounts: 50,
  });
  assert.ok(r);
  assert.equal(r.deductionsInPeriod, 200);
  assert.equal(r.netInPeriod, 2300);
  assert.equal(r.monthlyNet, 2300);
  assert.equal(r.annualNet, 27600);
}

// Yearly quantity period → monthly = annual/12
{
  const r = calculateSales({
    productPrice: 10,
    quantity: 1200,
    quantityPeriod: 'year',
    salesReturns: 0,
    salesAllowances: 0,
    salesDiscounts: 0,
  });
  assert.ok(r);
  assert.equal(r.grossInPeriod, 12000);
  assert.equal(r.monthlyGross, 1000);
  assert.equal(r.annualGross, 12000);
}

assert.equal(periodToMonthlyFactor('month'), 1);
assert.equal(convertBetweenPeriods(12, 'year', 'month'), 1);
assert.equal(convertBetweenPeriods(1, 'month', 'year'), 12);

// Reject negatives
assert.equal(
  calculateSales({
    productPrice: -1,
    quantity: 1,
    quantityPeriod: 'month',
    salesReturns: 0,
    salesAllowances: 0,
    salesDiscounts: 0,
  }),
  null
);

console.log('sales calculation.test.ts: ok');
