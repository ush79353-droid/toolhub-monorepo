import assert from 'node:assert/strict';
import { calculateConversionRate } from './calculation';

{
  const result = calculateConversionRate({
    mode: 'ads',
    totalConversions: 50,
    totalClicksOrVisits: 1000,
  });
  assert.ok(result);
  assert.equal(result.conversionRatePercent, 5);
  assert.equal(result.rateDisplay, '5');
}

{
  const result = calculateConversionRate({
    mode: 'websites',
    totalConversions: 0,
    totalClicksOrVisits: 100,
  });
  assert.ok(result);
  assert.equal(result.conversionRatePercent, 0);
}

assert.equal(
  calculateConversionRate({ mode: 'ads', totalConversions: 10, totalClicksOrVisits: 0 }),
  null
);
assert.equal(
  calculateConversionRate({ mode: 'ads', totalConversions: 20, totalClicksOrVisits: 10 }),
  null
);

console.log('conversion-rate calculation.test.ts: ok');
