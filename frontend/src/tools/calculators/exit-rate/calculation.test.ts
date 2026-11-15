import assert from 'node:assert/strict';
import { calculateExitRate } from './calculation';
import { validateExitRateInput } from './validation';

{
  const res = calculateExitRate(1_000, 250);
  assert.ok(res);
  assert.equal(res.exitRatePercent, 25);
  assert.equal(res.formattedRate, '25');
}

{
  const res = calculateExitRate(1_000, 0);
  assert.ok(res);
  assert.equal(res.exitRatePercent, 0);
}

{
  assert.equal(calculateExitRate(0, 10), null);
  assert.equal(calculateExitRate(100, 101), null);
  assert.equal(calculateExitRate(-1, 1), null);
  assert.equal(calculateExitRate(10, Number.NaN), null);
}

{
  const v = validateExitRateInput({ pageviews: '1000', exits: '250' });
  assert.equal(v.isValid, true);
}

{
  const v = validateExitRateInput({ pageviews: '', exits: '10' });
  assert.equal(v.isValid, false);
  assert.equal(Object.keys(v.errors).length, 0);
}

console.log('exit-rate calculation.test ok');
