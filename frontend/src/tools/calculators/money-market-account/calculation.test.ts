import assert from 'node:assert/strict';
import {
  calculateMoneyMarketAccount,
  normalizeTerm,
  resolvePeriodCount,
} from './calculation';
import { createDefaultInput } from './types';
import { validateMoneyMarketAccount } from './validation';

{
  const term = normalizeTerm(1, 14);
  assert.deepEqual(term, { years: 2, months: 2, totalMonths: 26 });
}

{
  assert.equal(resolvePeriodCount('sip', 12, 'monthly'), 12);
  assert.equal(resolvePeriodCount('one-time', 12, 'weekly'), 12);
  assert.equal(resolvePeriodCount('sip', 12, 'annually'), 1);
  assert.equal(resolvePeriodCount('sip', 6, 'annually'), 1);
}

{
  // Spec example: 10,000 + 1,000/mo @ 6% for 1 year (monthly compounding, end deposits)
  const res = calculateMoneyMarketAccount({
    mode: 'sip',
    startingBalance: 10_000,
    recurringInvestment: 1_000,
    contributionFrequency: 'monthly',
    annualReturnPercent: 6,
    years: 1,
    months: 0,
    currency: 'PKR',
  });
  assert.ok(res);
  assert.equal(res.totalDeposit, 22_000);
  assert.equal(res.futureValue, 22_952.34);
  assert.equal(res.totalInterest, 952.34);
}

{
  const oneTime = calculateMoneyMarketAccount({
    mode: 'one-time',
    startingBalance: 10_000,
    recurringInvestment: 1_000,
    contributionFrequency: 'monthly',
    annualReturnPercent: 6,
    years: 1,
    months: 0,
    currency: 'PKR',
  });
  assert.ok(oneTime);
  assert.equal(oneTime.totalDeposit, 10_000);
  assert.equal(oneTime.futureValue, 10_616.78);
  assert.equal(oneTime.totalInterest, 616.78);
}

{
  const zeroRate = calculateMoneyMarketAccount({
    mode: 'sip',
    startingBalance: 10_000,
    recurringInvestment: 1_000,
    contributionFrequency: 'monthly',
    annualReturnPercent: 0,
    years: 1,
    months: 0,
    currency: 'PKR',
  });
  assert.ok(zeroRate);
  assert.equal(zeroRate.futureValue, 22_000);
  assert.equal(zeroRate.totalInterest, 0);
}

{
  const annualSip = calculateMoneyMarketAccount({
    mode: 'sip',
    startingBalance: 10_000,
    recurringInvestment: 12_000,
    contributionFrequency: 'annually',
    annualReturnPercent: 6,
    years: 1,
    months: 0,
    currency: 'PKR',
  });
  assert.ok(annualSip);
  // N=1, i=0.06 → FV = 10000*1.06 + 12000 = 22600
  assert.equal(annualSip.periods, 1);
  assert.equal(annualSip.futureValue, 22_600);
  assert.equal(annualSip.totalDeposit, 22_000);
}

{
  const v = validateMoneyMarketAccount(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result?.totalDeposit, 22_000);
}

{
  const neg = validateMoneyMarketAccount({
    ...createDefaultInput(),
    startingBalance: '-1',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.startingBalance);
}

{
  const blank = validateMoneyMarketAccount({
    ...createDefaultInput(),
    startingBalance: '',
    recurringInvestment: '',
    annualReturnPercent: '',
    years: '',
    months: '',
  });
  assert.equal(blank.isValid, false);
  assert.equal(blank.result, null);
}

console.log('money-market-account calculation.test ok');
