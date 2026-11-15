import assert from 'node:assert/strict';
import { calculateRateOfReturn, rateWithoutCashFlows } from './calculation';
import { createDefaultInput } from './types';
import { validateRateOfReturnInput } from './validation';

{
  const closed = rateWithoutCashFlows(1000, 5000, 10, 12);
  assert.ok(closed !== null);
  const pct = closed! * 100;
  assert.ok(Math.abs(pct - 16.203) < 0.001, `expected ~16.203, got ${pct}`);
}

{
  const res = calculateRateOfReturn(
    1000,
    5000,
    10,
    'yrs',
    'monthly',
    0,
    'monthly',
    'end',
    'PKR'
  );
  assert.ok(res);
  assert.ok(Math.abs(res.annualRatePercent - 16.203) < 0.001);
  assert.equal(res.formattedRate, '16.203');
}

{
  const flat = calculateRateOfReturn(
    1000,
    1000,
    5,
    'yrs',
    'annually',
    0,
    'annually',
    'end',
    'PKR'
  );
  assert.ok(flat);
  assert.equal(flat.annualRatePercent, 0);
}

{
  const loss = calculateRateOfReturn(
    1000,
    500,
    2,
    'yrs',
    'annually',
    0,
    'annually',
    'end',
    'PKR'
  );
  assert.ok(loss);
  assert.ok(loss.annualRatePercent < 0);
  assert.ok(Number.isFinite(loss.annualRatePercent));
}

{
  // PV grows with monthly deposits; solve should find a positive rate below the no-PMT case.
  const withDeposit = calculateRateOfReturn(
    1000,
    5000,
    10,
    'yrs',
    'monthly',
    50,
    'monthly',
    'end',
    'PKR'
  );
  assert.ok(withDeposit);
  assert.ok(withDeposit.annualRatePercent < 16.203);
  assert.ok(withDeposit.annualRatePercent > 0);
  assert.ok(Number.isFinite(withDeposit.annualRatePercent));
}

{
  assert.equal(
    calculateRateOfReturn(0, 5000, 10, 'yrs', 'monthly', 0, 'monthly', 'end', 'PKR'),
    null
  );
  assert.equal(
    calculateRateOfReturn(1000, -1, 10, 'yrs', 'monthly', 0, 'monthly', 'end', 'PKR'),
    null
  );
  assert.equal(
    calculateRateOfReturn(1000, 5000, 0, 'yrs', 'monthly', 0, 'monthly', 'end', 'PKR'),
    null
  );
  assert.equal(
    calculateRateOfReturn(Number.NaN, 5000, 10, 'yrs', 'monthly', 0, 'monthly', 'end', 'PKR'),
    null
  );
}

{
  const v = validateRateOfReturnInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.ok(Math.abs(v.result.annualRatePercent - 16.203) < 0.001);
}

{
  const bad = validateRateOfReturnInput({
    ...createDefaultInput(),
    initialInvestment: '-10',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.initialInvestment);
}

console.log('rate-of-return calculation.test ok');
