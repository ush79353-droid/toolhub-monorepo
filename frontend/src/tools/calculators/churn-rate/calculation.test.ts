import assert from 'node:assert/strict';
import { calculateChurnRate } from './calculation';

{
  const result = calculateChurnRate({ startingCustomers: 1000, customersLost: 50 });
  assert.ok(result);
  assert.equal(result.churnRatePercent, 5);
  assert.equal(result.customerLifetimePeriods, 20);
  assert.equal(result.churnRateDisplay, '5');
  assert.equal(result.lifetimeDisplay, '20');
}

{
  const result = calculateChurnRate({ startingCustomers: 1000, customersLost: 0 });
  assert.ok(result);
  assert.equal(result.churnRatePercent, 0);
  assert.equal(result.lifetimeDisplay, 'No finite estimate');
}

assert.equal(calculateChurnRate({ startingCustomers: 0, customersLost: 0 }), null);
assert.equal(calculateChurnRate({ startingCustomers: 10, customersLost: 11 }), null);

console.log('churn-rate calculation.test.ts: ok');
