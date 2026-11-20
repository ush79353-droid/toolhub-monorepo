import assert from 'node:assert/strict';
import {
  calculateFica,
  formatRatePercent,
  formatUsd,
  roundTaxCents,
} from './calculation';
import { FICA_YEAR_PARAMS, additionalMedicareThreshold } from './fica-parameters';
import { createDefaultInput, createExampleInput } from './types';
import { validateFicaInput } from './validation';

assert.equal(roundTaxCents(10.004), 10);
assert.equal(roundTaxCents(10.005), 10.01);
assert.equal(formatUsd(7650), '7,650.00');
assert.equal(formatRatePercent(7.65), '7.65');
assert.equal(FICA_YEAR_PARAMS[2026].socialSecurityWageBase, 184_500);
assert.equal(FICA_YEAR_PARAMS[2025].socialSecurityWageBase, 176_100);
assert.equal(additionalMedicareThreshold('single'), 200_000);
assert.equal(additionalMedicareThreshold('married-joint'), 250_000);
assert.equal(additionalMedicareThreshold('married-separate'), 125_000);

{
  // 2026 single employee — $100,000 wages (under wage base and Additional Medicare threshold)
  const r = calculateFica({
    employmentType: 'employee-employer',
    taxYear: 2026,
    filingStatus: 'single',
    income: 100_000,
  });
  assert.equal(r.employeeSocialSecurity, 6_200);
  assert.equal(r.employerSocialSecurity, 6_200);
  assert.equal(r.employeeMedicare, 1_450);
  assert.equal(r.employerMedicare, 1_450);
  assert.equal(r.additionalMedicare, 0);
  assert.equal(r.taxpayerTotal, 7_650);
  assert.equal(r.employerTotal, 7_650);
  assert.equal(r.combinedTotal, 15_300);
  assert.equal(r.effectiveTaxpayerRate, 7.65);
  assert.equal(r.effectiveCombinedRate, 15.3);
}

{
  // Wage base cap — 2026 employee above $184,500
  const r = calculateFica({
    employmentType: 'employee-employer',
    taxYear: 2026,
    filingStatus: 'single',
    income: 200_000,
  });
  assert.equal(r.socialSecurityTaxable, 184_500);
  assert.equal(r.employeeSocialSecurity, roundTaxCents(184_500 * 0.062));
  assert.equal(r.employeeMedicare, roundTaxCents(200_000 * 0.0145));
  assert.equal(r.additionalMedicare, 0);
}

{
  // Additional Medicare — single wages above $200,000
  const r = calculateFica({
    employmentType: 'employee-employer',
    taxYear: 2026,
    filingStatus: 'single',
    income: 250_000,
  });
  assert.equal(r.additionalMedicare, roundTaxCents(50_000 * 0.009));
  assert.equal(r.employerMedicare, roundTaxCents(250_000 * 0.0145));
  // Employer share never includes Additional Medicare
  assert.equal(r.employerTotal, roundTaxCents(184_500 * 0.062 + 250_000 * 0.0145));
}

{
  // MFS Additional Medicare threshold $125,000
  const r = calculateFica({
    employmentType: 'employee-employer',
    taxYear: 2026,
    filingStatus: 'married-separate',
    income: 150_000,
  });
  assert.equal(r.additionalMedicare, roundTaxCents(25_000 * 0.009));
}

{
  // Self-employed — $100,000 net profit
  const r = calculateFica({
    employmentType: 'self-employed',
    taxYear: 2026,
    filingStatus: 'single',
    income: 100_000,
  });
  const seEarnings = roundTaxCents(100_000 * 0.9235);
  assert.equal(r.medicareTaxable, seEarnings);
  assert.equal(r.seSocialSecurity, roundTaxCents(seEarnings * 0.124));
  assert.equal(r.seMedicare, roundTaxCents(seEarnings * 0.029));
  assert.equal(r.additionalMedicare, 0);
  assert.equal(
    r.seDeductibleHalf,
    roundTaxCents((r.seSocialSecurity + r.seMedicare) / 2),
  );
  assert.equal(r.employerTotal, 0);
  assert.equal(r.taxpayerTotal, roundTaxCents(r.seSocialSecurity + r.seMedicare));
}

{
  // Zero income
  const r = calculateFica({
    employmentType: 'employee-employer',
    taxYear: 2026,
    filingStatus: 'single',
    income: 0,
  });
  assert.equal(r.taxpayerTotal, 0);
  assert.equal(r.combinedTotal, 0);
  assert.equal(r.effectiveTaxpayerRate, 0);
}

{
  const invalid = validateFicaInput({ ...createDefaultInput(), income: '' });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.income);

  const negative = validateFicaInput({ ...createDefaultInput(), income: '-1' });
  assert.equal(negative.isValid, false);

  const example = validateFicaInput(createExampleInput());
  assert.equal(example.isValid, true);
  assert.equal(example.result?.taxpayerTotal, 7_650);
}

console.log('fica-tax calculation.test.ts: all assertions passed');
