import assert from 'node:assert/strict';
import {
  calculateFromInterestRate,
  calculateFromMoneyFactor,
  MONEY_FACTOR_DIVISOR,
} from './calculation';

assert.equal(MONEY_FACTOR_DIVISOR, 2400);

{
  const r = calculateFromInterestRate(6);
  assert.ok(r);
  assert.equal(r!.moneyFactor, 0.0025);
  assert.equal(r!.formattedMoneyFactor, '0.0025');
}

{
  const r = calculateFromMoneyFactor(0.003);
  assert.ok(r);
  assert.ok(Math.abs(r!.interestRatePercent - 7.2) < 1e-12);
  assert.equal(r!.formattedInterestRate, '7.2');
}

{
  const r = calculateFromInterestRate(0);
  assert.ok(r);
  assert.equal(r!.moneyFactor, 0);
  assert.equal(r!.formattedMoneyFactor, '0');
}

{
  assert.equal(calculateFromInterestRate(-1), null);
  assert.equal(calculateFromMoneyFactor(-0.001), null);
  assert.equal(calculateFromInterestRate(Number.NaN), null);
  assert.equal(calculateFromMoneyFactor(Number.POSITIVE_INFINITY), null);
}

console.log('money-factor calculation.test.ts: ok');
