import assert from 'node:assert/strict';
import { calculateCtr } from './calculation';
import { validateCtrInput } from './validation';

{
  const res = calculateCtr(10_000, 250);
  assert.ok(res);
  assert.equal(res.ctrPercent, 2.5);
  assert.equal(res.formattedRate, '2.5');
}

{
  const res = calculateCtr(1_000, 0);
  assert.ok(res);
  assert.equal(res.ctrPercent, 0);
}

{
  assert.equal(calculateCtr(0, 10), null);
  assert.equal(calculateCtr(100, 101), null);
  assert.equal(calculateCtr(-1, 1), null);
  assert.equal(calculateCtr(10, Number.NaN), null);
}

{
  const v = validateCtrInput({ impressions: '10000', clicks: '250' });
  assert.equal(v.isValid, true);
}

{
  const v = validateCtrInput({ impressions: '', clicks: '10' });
  assert.equal(v.isValid, false);
  assert.equal(Object.keys(v.errors).length, 0);
}

console.log('ctr calculation.test ok');
