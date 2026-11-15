import assert from 'node:assert/strict';
import { calculateSimpleInterest, normalizeTerm } from './calculation';

{
  const term = normalizeTerm(1, 14);
  assert.ok(term);
  assert.equal(term!.years, 2);
  assert.equal(term!.months, 2);
  assert.equal(term!.yearsExact, 26 / 12);
}

{
  const r = calculateSimpleInterest({
    principal: 100_000,
    interestRatePercent: 10,
    termYears: 2,
    termMonths: 6,
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r!.totalInterest, 25_000);
  assert.equal(r!.finalBalance, 125_000);
  assert.equal(r!.formattedTotalInterest, '25,000.00');
  assert.equal(r!.formattedFinalBalance, '125,000.00');
}

{
  const r = calculateSimpleInterest({
    principal: 0,
    interestRatePercent: 10,
    termYears: 1,
    termMonths: 0,
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r!.totalInterest, 0);
  assert.equal(r!.finalBalance, 0);
}

{
  const r = calculateSimpleInterest({
    principal: 1000,
    interestRatePercent: 0,
    termYears: 5,
    termMonths: 0,
    currency: 'PKR',
  });
  assert.ok(r);
  assert.equal(r!.totalInterest, 0);
  assert.equal(r!.finalBalance, 1000);
}

{
  assert.equal(
    calculateSimpleInterest({
      principal: -1,
      interestRatePercent: 10,
      termYears: 1,
      termMonths: 0,
      currency: 'PKR',
    }),
    null
  );
  assert.equal(normalizeTerm(1, -1), null);
}

console.log('simple-interest calculation.test.ts: ok');
