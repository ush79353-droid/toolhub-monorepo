import assert from 'node:assert/strict';
import {
  apyToNominal,
  calculateSimpleSavings,
  nominalToApy,
  simulateSavings,
} from './calculation';

// APY ↔ nominal
{
  const apy = nominalToApy(0.013, 12);
  assert.ok(Math.abs(apy - 0.013077) < 1e-5);
  const back = apyToNominal(apy, 12);
  assert.ok(Math.abs(back - 0.013) < 1e-10);
}

// Zero interest, end deposits: final = principal + deposits
{
  const sim = simulateSavings({
    principal: 1000,
    nominalRateDecimal: 0,
    years: 1,
    compoundN: 12,
    depositAmount: 100,
    depositN: 12,
    timing: 'end',
    depositGrowthDecimal: 0,
  });
  assert.ok(sim);
  assert.equal(sim!.finalBalance, 2200);
  assert.equal(sim!.totalAdditionalDeposits, 1200);
}

// Beginning deposits earn more interest than end deposits
{
  const shared = {
    principal: 0,
    nominalRateDecimal: 0.12,
    years: 1,
    compoundN: 12,
    depositAmount: 100,
    depositN: 12,
    depositGrowthDecimal: 0,
  };
  const begin = simulateSavings({ ...shared, timing: 'beginning' as const });
  const end = simulateSavings({ ...shared, timing: 'end' as const });
  assert.ok(begin && end);
  assert.ok(begin!.finalBalance > end!.finalBalance);
}

// Screenshot defaults identity: final = initial + deposits + interest
{
  const result = calculateSimpleSavings({
    knownRate: 'interest-rate',
    ratePercent: 1.3,
    initialSavings: 1000,
    termYears: 6,
    termMonths: 0,
    compounding: 'monthly',
    depositAmount: 100,
    depositFrequency: 'monthly',
    depositTiming: 'beginning',
    adjustInflation: false,
    inflationPercent: 0,
    depositGrowthPercent: 0,
    resultCurrency: 'PKR',
  });
  assert.ok(result);
  assert.ok(Math.abs(result!.apyPercent - 1.3077) < 1e-3);
  assert.ok(
    Math.abs(
      result!.finalBalance -
        (1000 + result!.totalAdditionalDeposits + result!.totalInterest)
    ) < 1e-6
  );
}

// APY input derives matching nominal
{
  const fromApy = calculateSimpleSavings({
    knownRate: 'apy',
    ratePercent: 1.3077,
    initialSavings: 1000,
    termYears: 1,
    termMonths: 0,
    compounding: 'monthly',
    depositAmount: 0,
    depositFrequency: 'monthly',
    depositTiming: 'end',
    adjustInflation: false,
    inflationPercent: 0,
    depositGrowthPercent: 0,
    resultCurrency: 'PKR',
  });
  assert.ok(fromApy);
  assert.ok(Math.abs(fromApy!.nominalRatePercent - 1.3) < 1e-2);
}

// Inflation purchasing power (no double-count into nominal FV)
{
  const result = calculateSimpleSavings({
    knownRate: 'interest-rate',
    ratePercent: 0,
    initialSavings: 1000,
    termYears: 2,
    termMonths: 0,
    compounding: 'annually',
    depositAmount: 0,
    depositFrequency: 'annually',
    depositTiming: 'end',
    adjustInflation: true,
    inflationPercent: 10,
    depositGrowthPercent: 0,
    resultCurrency: 'PKR',
  });
  assert.ok(result && result.realFinalBalance != null);
  assert.ok(Math.abs(result!.realFinalBalance! - 1000 / 1.1 ** 2) < 1e-9);
  assert.equal(result!.finalBalance, 1000);
}

// Reject invalid
{
  assert.equal(
    calculateSimpleSavings({
      knownRate: 'interest-rate',
      ratePercent: 5,
      initialSavings: -1,
      termYears: 1,
      termMonths: 0,
      compounding: 'monthly',
      depositAmount: 0,
      depositFrequency: 'monthly',
      depositTiming: 'end',
      adjustInflation: false,
      inflationPercent: 0,
      depositGrowthPercent: 0,
      resultCurrency: 'PKR',
    }),
    null
  );
}

console.log('simple-savings calculation.test.ts: all assertions passed');
