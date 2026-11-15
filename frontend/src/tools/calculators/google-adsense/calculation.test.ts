import assert from 'node:assert/strict';
import {
  buildGoogleAdsenseResult,
  calculateClicks,
  calculateImpressions,
  calculateRevenue,
} from './calculation';
import { validateGoogleAdsense } from './validation';
import { createDefaultInput } from './types';

{
  assert.equal(calculateImpressions(10_000, 2), 20_000);
  assert.equal(calculateClicks(20_000, 2), 400);
  assert.equal(calculateRevenue(400, 15), 6_000);
}

{
  const res = buildGoogleAdsenseResult(10_000, 2, 2, 15, 'PKR');
  assert.equal(res.impressions, 20_000);
  assert.equal(res.clicks, 400);
  assert.equal(res.revenue, 6_000);
  assert.equal(res.revenueDisplay, '6,000.00');
}

{
  const partial = buildGoogleAdsenseResult(10_000, 2, Number.NaN, Number.NaN, 'PKR');
  assert.equal(partial.impressions, 20_000);
  assert.equal(partial.clicks, null);
  assert.equal(partial.revenue, null);
  assert.equal(partial.clicksDisplay, '');
}

{
  assert.equal(calculateImpressions(-1, 2), null);
  assert.equal(calculateClicks(100, 101), null);
  assert.equal(calculateRevenue(10, Number.NaN), null);
}

{
  const input = { ...createDefaultInput(), pageviews: 10000, adsPerPage: 2, ctrPercent: 2, cpc: 15 };
  const v = validateGoogleAdsense(input);
  assert.equal(v.isValid, true);
  assert.equal(v.result?.revenue, 6000);
}

console.log('google-adsense calculation.test ok');
