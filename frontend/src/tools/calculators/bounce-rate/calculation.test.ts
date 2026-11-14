import assert from 'node:assert/strict';
import { calculateBounceRate } from './calculation';
import { validateBounceRateInput } from './validation';

// Example: 1,000 visits and 350 one-page visits → 35%
{
  const res = calculateBounceRate(1000, 350);
  assert.ok(res !== null);
  assert.equal(res.bounceRatePercent, 35);
  assert.equal(res.formattedRate, '35');
}

// Zero one-page visits → 0%
{
  const res = calculateBounceRate(1000, 0);
  assert.ok(res !== null);
  assert.equal(res.bounceRatePercent, 0);
  assert.equal(res.formattedRate, '0');
}

// 100% bounce
{
  const res = calculateBounceRate(500, 500);
  assert.ok(res !== null);
  assert.equal(res.bounceRatePercent, 100);
  assert.equal(res.formattedRate, '100');
}

// Fractional display
{
  const res = calculateBounceRate(3, 1);
  assert.ok(res !== null);
  assert.equal(Number(res.bounceRatePercent.toFixed(2)), 33.33);
  assert.equal(res.formattedRate, '33.33');
}

// Zero total visits → null
{
  assert.equal(calculateBounceRate(0, 0), null);
  assert.equal(calculateBounceRate(0, 5), null);
}

// One-page exceeds total → null
{
  assert.equal(calculateBounceRate(100, 101), null);
}

// Negatives / non-finite → null
{
  assert.equal(calculateBounceRate(-10, 5), null);
  assert.equal(calculateBounceRate(100, -1), null);
  assert.equal(calculateBounceRate(Number.NaN, 5), null);
  assert.equal(calculateBounceRate(100, Number.POSITIVE_INFINITY), null);
}

// Validation: happy path
{
  const v = validateBounceRateInput({ websiteVisits: '1000', onePageVisits: '350' });
  assert.equal(v.isValid, true);
  assert.deepEqual(v.parsedValues, { websiteVisits: 1000, onePageVisits: 350 });
}

// Validation: blank fields stay quiet
{
  const v = validateBounceRateInput({ websiteVisits: '', onePageVisits: '350' });
  assert.equal(v.isValid, false);
  assert.equal(Object.keys(v.errors).length, 0);
}

// Validation: zero visits rejected
{
  const v = validateBounceRateInput({ websiteVisits: '0', onePageVisits: '0' });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.websiteVisits);
}

// Validation: one-page > total
{
  const v = validateBounceRateInput({ websiteVisits: '10', onePageVisits: '11' });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.onePageVisits);
}

console.log('bounce rate calculation.test ok');
