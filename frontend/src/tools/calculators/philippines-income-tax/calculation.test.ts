import assert from 'node:assert/strict';
import {
  calculateAnnualGraduatedTax,
  calculateMonthlyWithholdingTax,
  calculatePagIbigEmployeeShare,
  calculatePagIbigSelfEmployedShare,
  calculatePhilHealthEmployeeShare,
  calculatePhilHealthPremium,
  calculatePhilippinesIncomeTax,
  calculateSssEmployeeShare,
  calculateSssSelfEmployedShare,
  formatPhp,
  PH_TAX_YEAR_LABEL,
  sssMonthlySalaryCredit,
} from './calculation';
import { validatePhilippinesIncomeTaxInput } from './validation';
import { createDefaultInput } from './types';

function approxEqual(actual: number, expected: number, eps = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

// SSS MSC banding (CI 2024-006)
{
  assert.equal(sssMonthlySalaryCredit(0), 5_000);
  assert.equal(sssMonthlySalaryCredit(5_000), 5_000);
  assert.equal(sssMonthlySalaryCredit(20_000), 20_000);
  assert.equal(sssMonthlySalaryCredit(20_249), 20_000);
  assert.equal(sssMonthlySalaryCredit(20_250), 20_500);
  assert.equal(sssMonthlySalaryCredit(40_000), 35_000);
}

// SSS EE 5% / SE 15% of MSC
{
  assert.equal(calculateSssEmployeeShare(20_000), 1_000);
  assert.equal(calculateSssSelfEmployedShare(20_000), 3_000);
  assert.equal(calculateSssEmployeeShare(40_000), 1_750);
  assert.equal(calculateSssSelfEmployedShare(40_000), 5_250);
}

// PhilHealth 5% of clamped MBS; EE half
{
  assert.equal(calculatePhilHealthPremium(8_000), 500); // floor 10k × 5%
  assert.equal(calculatePhilHealthEmployeeShare(8_000), 250);
  assert.equal(calculatePhilHealthPremium(50_000), 2_500);
  assert.equal(calculatePhilHealthEmployeeShare(50_000), 1_250);
  assert.equal(calculatePhilHealthPremium(150_000), 5_000); // ceiling 100k
  assert.equal(calculatePhilHealthEmployeeShare(150_000), 2_500);
}

// Pag-IBIG Circular 460
{
  assert.equal(calculatePagIbigEmployeeShare(1_000), 10); // 1% of 1k
  assert.equal(calculatePagIbigEmployeeShare(1_500), 15);
  assert.equal(calculatePagIbigEmployeeShare(8_000), 160); // 2% of 8k
  assert.equal(calculatePagIbigEmployeeShare(25_000), 200); // 2% of MFS 10k
  assert.equal(calculatePagIbigSelfEmployedShare(25_000), 400); // EE+ER 4% of 10k
  assert.equal(calculatePagIbigSelfEmployedShare(1_000), 30); // 1%+2% of 1k
}

// BIR monthly withholding (TRAIN 2023+)
{
  assert.equal(calculateMonthlyWithholdingTax(0), 0);
  assert.equal(calculateMonthlyWithholdingTax(20_832), 0);
  approxEqual(calculateMonthlyWithholdingTax(20_833), 0);
  approxEqual(calculateMonthlyWithholdingTax(30_000), (30_000 - 20_833) * 0.15);
  approxEqual(calculateMonthlyWithholdingTax(50_000), 1_875 + (50_000 - 33_333) * 0.2);
}

// Annual graduated
{
  assert.equal(calculateAnnualGraduatedTax(0), 0);
  assert.equal(calculateAnnualGraduatedTax(250_000), 0);
  assert.equal(calculateAnnualGraduatedTax(400_000), 22_500);
  assert.equal(calculateAnnualGraduatedTax(800_000), 102_500);
}

// Employed path — ₱25,000/mo
{
  const out = calculatePhilippinesIncomeTax({
    employmentStatus: 'employed',
    monthlyIncome: 25_000,
  });
  assert.ok(out);
  assert.equal(out.taxYearLabel, PH_TAX_YEAR_LABEL);
  assert.equal(out.sss, 1_250); // MSC 25k × 5%
  assert.equal(out.philHealth, 625); // 25k × 5% / 2
  assert.equal(out.pagIbig, 200); // 2% × 10k MFS
  assert.equal(out.totalContributions, 2_075);
  assert.equal(out.taxableIncome, 22_925);
  approxEqual(out.withholdingTax, (22_925 - 20_833) * 0.15);
  assert.equal(out.taxLabel, 'Withholding tax');
  assert.equal(
    out.contributionsSectionTitle,
    'Contributions for employed individuals'
  );
  approxEqual(out.netPayAfterTax, 25_000 - out.withholdingTax);
  approxEqual(out.netPayAfterDeductions, 25_000 - out.totalDeductions);
  assert.equal(out.annualIncome, 300_000);
}

// Self-employed path — ₱25,000/mo (full SSS/PhilHealth/Pag-IBIG; graduated÷12)
{
  const out = calculatePhilippinesIncomeTax({
    employmentStatus: 'self-employed',
    monthlyIncome: 25_000,
  });
  assert.ok(out);
  assert.equal(out.sss, 3_750); // 25k MSC × 15%
  assert.equal(out.philHealth, 1_250); // full premium
  assert.equal(out.pagIbig, 400); // EE+ER
  assert.equal(out.totalContributions, 5_400);
  assert.equal(out.taxableIncome, 19_600);
  // annual taxable 235,200 ≤ 250k → 0 tax
  assert.equal(out.withholdingTax, 0);
  assert.equal(out.taxLabel, 'Estimated income tax');
  assert.equal(
    out.contributionsSectionTitle,
    'Contributions for self-employed individuals'
  );
}

// Zero income → all zeros (no floor contributions)
{
  const out = calculatePhilippinesIncomeTax({
    employmentStatus: 'employed',
    monthlyIncome: 0,
  });
  assert.ok(out);
  assert.equal(out.sss, 0);
  assert.equal(out.philHealth, 0);
  assert.equal(out.pagIbig, 0);
  assert.equal(out.taxableIncome, 0);
  assert.equal(out.withholdingTax, 0);
  assert.equal(out.netPayAfterTax, 0);
  assert.equal(out.netPayAfterDeductions, 0);
}

// Rejects
{
  assert.equal(
    calculatePhilippinesIncomeTax({
      employmentStatus: 'employed',
      monthlyIncome: -1,
    }),
    null
  );
  assert.equal(
    calculatePhilippinesIncomeTax({
      employmentStatus: 'employed',
      monthlyIncome: Number.NaN,
    }),
    null
  );
}

// Display
{
  assert.equal(formatPhp(2075), '2,075.00');
  assert.equal(formatPhp(313.8), '313.80');
}

// Validation: blank default
{
  const blank = validatePhilippinesIncomeTaxInput(createDefaultInput());
  assert.equal(blank.isValid, false);
  assert.equal(blank.result, null);
}

// Validation: employed 25k
{
  const ok = validatePhilippinesIncomeTaxInput({
    employmentStatus: 'employed',
    monthlyIncome: '25000',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.formattedTotalContributions, '2,075.00');
  assert.equal(ok.result.taxLabel, 'Withholding tax');
}

// Validation: negative
{
  const neg = validatePhilippinesIncomeTaxInput({
    employmentStatus: 'employed',
    monthlyIncome: '-1',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.monthlyIncome);
}

console.log('philippines-income-tax calculation.test.ts: all assertions passed');
