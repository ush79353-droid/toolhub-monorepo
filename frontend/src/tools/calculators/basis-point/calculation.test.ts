import assert from 'node:assert/strict';
import { calculateBpsOfAmount, conversionFromField } from './calculation';

{
  const res = conversionFromField('decimal', 0.01);
  assert.ok(res);
  assert.equal(res.percent, 1);
  assert.equal(res.permille, 10);
  assert.equal(res.basisPoints, 100);
}

{
  const res = conversionFromField('basisPoints', 100);
  assert.ok(res);
  assert.equal(res.decimal, 0.01);
  assert.equal(res.formattedPercent, '1');
}

{
  const res = calculateBpsOfAmount(1.5, 65_000, 'PKR');
  assert.ok(res);
  assert.equal(res.equals, 9.75);
  assert.equal(res.formattedEquals, '9.75');
}

{
  assert.equal(conversionFromField('percent', Number.NaN), null);
  assert.equal(calculateBpsOfAmount(Number.POSITIVE_INFINITY, 100, 'PKR'), null);
}

console.log('basis-point calculation.test ok');
