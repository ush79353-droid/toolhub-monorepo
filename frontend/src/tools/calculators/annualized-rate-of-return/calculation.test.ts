import assert from 'node:assert/strict';
import { calculateAnnualizedRateOfReturn } from './calculation';
import { validateAnnualizedRateOfReturnInput } from './validation';

{
  const res = calculateAnnualizedRateOfReturn(2, 'monthly');
  assert.ok(res);
  assert.equal(Number(res.annualizedReturnPercent.toFixed(2)), 26.82);
  assert.equal(res.formattedRate, '26.82');
}

{
  const res = calculateAnnualizedRateOfReturn(0, 'annual');
  assert.ok(res);
  assert.equal(res.annualizedReturnPercent, 0);
}

{
  const res = calculateAnnualizedRateOfReturn(-50, 'annual');
  assert.ok(res);
  assert.equal(res.annualizedReturnPercent, -50);
}

{
  assert.equal(calculateAnnualizedRateOfReturn(-100.01, 'monthly'), null);
  assert.equal(calculateAnnualizedRateOfReturn(Number.NaN, 'daily'), null);
}

{
  const v = validateAnnualizedRateOfReturnInput({ period: 'monthly', periodRate: '2' });
  assert.equal(v.isValid, true);
}

{
  const v = validateAnnualizedRateOfReturnInput({ period: 'monthly', periodRate: '' });
  assert.equal(v.isValid, false);
  assert.equal(Object.keys(v.errors).length, 0);
}

console.log('annualized-rate-of-return calculation.test ok');
