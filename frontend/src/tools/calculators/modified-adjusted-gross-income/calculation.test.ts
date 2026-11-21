import assert from 'node:assert/strict';
import { calculateMagi, formatMagiMoney } from './calculation';
import { validateMagiInput } from './validation';
import { createDefaultInput } from './types';

{
  const out = calculateMagi({
    agi: 80_000,
    foreignEarnedIncome: 5_000,
    foreignHousingCost: 0,
    nonTaxableSocialBenefits: 0,
    selfEmploymentTaxes: 1_500,
    iraContributions: 7_000,
    passiveIncomeOrLosses: -2_000,
    others: 0,
    employerPaidAdoptionBenefits: 0,
    savingsBondInterest: 0,
    studentLoanInterest: 2_500,
    qualifiedTuitionExpenses: 0,
  });
  assert.ok(out);
  assert.equal(out.magi, 94_000);
}

{
  const out = calculateMagi({
    agi: 50_000,
    foreignEarnedIncome: 0,
    foreignHousingCost: 0,
    nonTaxableSocialBenefits: 0,
    selfEmploymentTaxes: 0,
    iraContributions: 0,
    passiveIncomeOrLosses: 0,
    others: 0,
    employerPaidAdoptionBenefits: 0,
    savingsBondInterest: 0,
    studentLoanInterest: 0,
    qualifiedTuitionExpenses: 0,
  });
  assert.ok(out);
  assert.equal(out.magi, 50_000);
}

{
  assert.equal(
    calculateMagi({
      agi: 1,
      foreignEarnedIncome: -1,
      foreignHousingCost: 0,
      nonTaxableSocialBenefits: 0,
      selfEmploymentTaxes: 0,
      iraContributions: 0,
      passiveIncomeOrLosses: 0,
      others: 0,
      employerPaidAdoptionBenefits: 0,
      savingsBondInterest: 0,
      studentLoanInterest: 0,
      qualifiedTuitionExpenses: 0,
    }),
    null
  );
}

{
  assert.equal(formatMagiMoney(94_000, 'PKR'), '94,000.00');
  assert.equal(formatMagiMoney(-5_000, 'PKR'), '-5,000.00');
}

{
  const validated = validateMagiInput({
    ...createDefaultInput(),
    agi: '80000',
    selfEmploymentTaxes: '1500',
    iraContributions: '7000',
    passiveIncomeOrLosses: '-2000',
    studentLoanInterest: '2500',
    foreignEarnedIncome: '5000',
  });
  assert.equal(validated.isValid, true);
  assert.ok(validated.result);
  assert.equal(validated.result.magiCanonical, 94_000);
}

{
  const incomplete = validateMagiInput(createDefaultInput());
  assert.equal(incomplete.isValid, false);
  assert.equal(incomplete.result, null);
}

console.log('modified-adjusted-gross-income calculation tests passed');