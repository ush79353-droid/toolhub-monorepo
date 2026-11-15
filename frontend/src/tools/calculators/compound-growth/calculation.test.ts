import assert from 'node:assert/strict';
import { calculateCompoundGrowth } from './calculation';

{
  // No contributions: 1000 at 8% monthly for 20y
  const res = calculateCompoundGrowth({
    initialDeposit: 1000,
    interestRatePercent: 8,
    termYears: 20,
    termMonths: 0,
    compoundFrequency: 'monthly',
    contributionFrequency: 'monthly',
    contributionAmount: 0,
    contributionTiming: 'beginning',
    annualContributionGrowthPercent: 0,
    periodicContributionGrowthPercent: 0,
    currency: 'PKR',
  });
  assert.ok(res);
  assert.equal(res.finalBalance, 4926.8);
  assert.equal(res.totalCompoundedGrowth, 3926.8);
}

{
  // With 50 monthly beginning — standard annuity-due + compound principal
  const res = calculateCompoundGrowth({
    initialDeposit: 1000,
    interestRatePercent: 8,
    termYears: 20,
    termMonths: 0,
    compoundFrequency: 'monthly',
    contributionFrequency: 'monthly',
    contributionAmount: 50,
    contributionTiming: 'beginning',
    annualContributionGrowthPercent: 0,
    periodicContributionGrowthPercent: 0,
    currency: 'PKR',
  });
  assert.ok(res);
  assert.equal(res.additionalPrincipal, 12000);
  assert.equal(res.finalBalance, 34574.16);
  assert.equal(res.totalCompoundedGrowth, 21574.16);
  assert.ok(res.years.length === 20);
}

{
  assert.equal(
    calculateCompoundGrowth({
      initialDeposit: -1,
      interestRatePercent: 8,
      termYears: 1,
      termMonths: 0,
      compoundFrequency: 'monthly',
      contributionFrequency: 'monthly',
      contributionAmount: 0,
      contributionTiming: 'end',
      annualContributionGrowthPercent: 0,
      periodicContributionGrowthPercent: 0,
      currency: 'PKR',
    }),
    null
  );
}

console.log('compound-growth calculation.test ok');
