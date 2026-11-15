import assert from 'node:assert/strict';
import { calculateMutualFund } from './calculation';
import { createDefaultInput } from './types';
import { validateMutualFundInput } from './validation';

{
  const res = calculateMutualFund('sip', 1000, 12, 1, 0, 'PKR');
  assert.ok(res);
  assert.equal(res.maturityValue, 12_682.5);
  assert.equal(res.formattedMaturityValue, '12,682.50');
  assert.equal(res.periods, 12);
}

{
  const res = calculateMutualFund('lumpSum', 1000, 12, 1, 0, 'PKR');
  assert.ok(res);
  assert.equal(res.maturityValue, 1_126.83);
}

{
  const sipZero = calculateMutualFund('sip', 1000, 0, 1, 0, 'PKR');
  assert.ok(sipZero);
  assert.equal(sipZero.maturityValue, 12_000);

  const lumpZero = calculateMutualFund('lumpSum', 1000, 0, 1, 0, 'PKR');
  assert.ok(lumpZero);
  assert.equal(lumpZero.maturityValue, 1000);
}

{
  const zeroInvest = calculateMutualFund('sip', 0, 12, 1, 0, 'PKR');
  assert.ok(zeroInvest);
  assert.equal(zeroInvest.maturityValue, 0);

  const fractional = calculateMutualFund('sip', 1000, 12.5, 0, 6, 'PKR');
  assert.ok(fractional);
  assert.ok(Number.isFinite(fractional.maturityValue));
}

{
  assert.equal(calculateMutualFund('sip', -1, 12, 1, 0, 'PKR'), null);
  assert.equal(calculateMutualFund('sip', 1000, 12, -1, 0, 'PKR'), null);
  assert.equal(calculateMutualFund('sip', Number.NaN, 12, 1, 0, 'PKR'), null);
  assert.equal(calculateMutualFund('sip', 1000, Number.POSITIVE_INFINITY, 1, 0, 'PKR'), null);
}

{
  const v = validateMutualFundInput({
    ...createDefaultInput(),
    investmentAmount: '1000',
    expectedAnnualReturn: '12',
    years: '1',
    months: '',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.maturityValue, 12_682.5);
}

{
  const incomplete = validateMutualFundInput(createDefaultInput());
  assert.equal(incomplete.isValid, false);
  assert.equal(incomplete.result, null);
}

{
  const neg = validateMutualFundInput({
    ...createDefaultInput(),
    investmentAmount: '-10',
    expectedAnnualReturn: '12',
    years: '1',
    months: '0',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.investmentAmount);
}

console.log('mutual-fund calculation.test ok');
