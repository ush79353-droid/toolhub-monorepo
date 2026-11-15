import assert from 'node:assert/strict';
import {
  calculateFutureValue,
  calculatePresentValue,
  calculateTimeValueOfMoney,
} from './calculation';
import { createDefaultInput } from './types';
import { validateTimeValueOfMoneyInput } from './validation';

{
  const fv = calculateFutureValue(10_000, 10, 2, 1);
  assert.ok(fv !== null);
  assert.equal(fv, 12_100);
}

{
  const pv = calculatePresentValue(12_100, 10, 2, 1);
  assert.ok(pv !== null);
  assert.equal(pv, 10_000);
}

{
  const res = calculateTimeValueOfMoney({
    interestRatePercent: 10,
    years: 2,
    months: 0,
    compounding: 'yearly',
    presentValue: 10_000,
    futureValue: 0,
    sourceField: 'presentValue',
    currency: 'PKR',
  });
  assert.ok(res);
  assert.equal(res.futureValue, 12_100);
  assert.equal(res.formattedFutureValue, '12,100.00');
}

{
  const res = calculateTimeValueOfMoney({
    interestRatePercent: 10,
    years: 2,
    months: 0,
    compounding: 'yearly',
    presentValue: 0,
    futureValue: 12_100,
    sourceField: 'futureValue',
    currency: 'PKR',
  });
  assert.ok(res);
  assert.equal(res.presentValue, 10_000);
}

{
  const zeroRate = calculateFutureValue(10_000, 0, 5, 12);
  assert.equal(zeroRate, 10_000);
  const zeroTerm = calculateFutureValue(10_000, 10, 0, 12);
  assert.equal(zeroTerm, 10_000);
}

{
  assert.equal(calculateFutureValue(10_000, -200, 1, 1), null);
  assert.equal(calculatePresentValue(-1, 10, 1, 1), null);
  assert.equal(
    calculateTimeValueOfMoney({
      interestRatePercent: Number.NaN,
      years: 2,
      months: 0,
      compounding: 'yearly',
      presentValue: 10_000,
      futureValue: 0,
      sourceField: 'presentValue',
      currency: 'PKR',
    }),
    null
  );
}

{
  const v = validateTimeValueOfMoneyInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result?.futureValue, 12_100);
}

{
  const bad = validateTimeValueOfMoneyInput({
    ...createDefaultInput(),
    presentValue: '-1',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.presentValue);
}

console.log('time-value-of-money calculation.test ok');
