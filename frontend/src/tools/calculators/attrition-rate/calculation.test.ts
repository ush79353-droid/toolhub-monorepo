import assert from 'node:assert/strict';
import { calculateAttritionRate } from './calculation';
import { validateAttritionRateInput } from './validation';

// Example test case: Start = 100, End = 90, Left = 10 -> Attrition rate = 10.53%
{
  const res = calculateAttritionRate(100, 90, 10);
  assert.ok(res !== null);
  assert.equal(res.averageEmployees, 95);
  assert.equal(Number(res.attritionRatePercent.toFixed(2)), 10.53);
  assert.equal(res.formattedRate, '10.53');
}

// Zero left -> 0%
{
  const res = calculateAttritionRate(100, 100, 0);
  assert.ok(res !== null);
  assert.equal(res.averageEmployees, 100);
  assert.equal(res.attritionRatePercent, 0);
  assert.equal(res.formattedRate, '0');
}

// Turnover above 100%
{
  const res = calculateAttritionRate(50, 50, 60);
  assert.ok(res !== null);
  assert.equal(res.attritionRatePercent, 120);
  assert.equal(res.formattedRate, '120');
}

// Zero average -> null
{
  const res = calculateAttritionRate(0, 0, 5);
  assert.equal(res, null);
}

// Negative values -> null
{
  const res = calculateAttritionRate(-10, 50, 5);
  assert.equal(res, null);
}

// Validation tests
{
  const v = validateAttritionRateInput({ startEmployees: '100', endEmployees: '90', leftEmployees: '10' });
  assert.equal(v.isValid, true);
  assert.deepEqual(v.parsedValues, { start: 100, end: 90, left: 10 });
}

{
  const v = validateAttritionRateInput({ startEmployees: '', endEmployees: '90', leftEmployees: '10' });
  assert.equal(v.isValid, false);
}

console.log('attrition rate calculation.test ok');
