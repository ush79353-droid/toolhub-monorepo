import assert from 'node:assert/strict';
import {
  buildWebsiteAdRevenueResult,
  calculatePageViews,
  calculateRevenue,
} from './calculation';

assert.equal(calculatePageViews(10_000, 2.5), 25_000);
assert.equal(calculateRevenue(25_000, 200), 5_000);

assert.equal(calculatePageViews(-1, 2), null);
assert.equal(calculatePageViews(10, -1), null);
assert.equal(calculateRevenue(1000, -1), null);
assert.equal(calculateRevenue(Number.NaN, 200), null);
assert.equal(calculateRevenue(Number.POSITIVE_INFINITY, 200), null);

const example = buildWebsiteAdRevenueResult(10_000, 2.5, 200, 'PKR');
assert.equal(example.pageViews, 25_000);
assert.equal(example.revenue, 5_000);
assert.equal(example.pageViewsDisplay, '25,000');
assert.equal(example.revenueDisplay, '5,000.00');

const incomplete = buildWebsiteAdRevenueResult(10_000, Number.NaN, 200, 'PKR');
assert.equal(incomplete.pageViews, null);
assert.equal(incomplete.revenue, null);
assert.equal(incomplete.pageViewsDisplay, '');
assert.equal(incomplete.revenueDisplay, '');

console.log('website-ad-revenue/calculation.test.ts: ok');
