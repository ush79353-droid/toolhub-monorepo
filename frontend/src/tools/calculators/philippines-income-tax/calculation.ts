/**
 * Philippines individual income tax + mandatory contributions — CY 2025.
 *
 * Sources (official / agency issuances):
 * - BIR: TRAIN Law RA 10963 schedules effective 1 Jan 2023 onwards;
 *   Revised Withholding Tax Table (RR No. 11-2018 Annex E monthly rows);
 *   RMC No. 34-2025 Annex A Table 2 (annual graduated rates).
 * - SSS: Circular No. 2024-006 (business ER/EE) and 2024-008 (self-employed),
 *   effective January 2025 — 15% total; EE share 5% of MSC; SE pays 15% of MSC;
 *   MSC ₱5,000–₱35,000 per published compensation ranges.
 * - PhilHealth: Advisory No. 2025-0002 / Circular 2020-0005 — 5% of MBS,
 *   floor ₱10,000 / ceiling ₱100,000; employed share is 50% of premium;
 *   self-employed pays the full premium.
 * - Pag-IBIG: HDMF Circular No. 460 (MFS ₱10,000 from Feb 2024, retained 2025);
 *   ≤₱1,500 → EE 1%; >₱1,500 → EE 2%; employer counterpart 2% (SE pays both).
 *
 * All money results are monthly PHP. Employer-only shares (SSS EC, Pag-IBIG ER
 * for employees, PhilHealth ER) are never deducted from employee take-home.
 * Self-employed tax uses annual graduated rates ÷ 12 (estimate — not payroll
 * withholding). Payroll withholding ≠ final annual ITR liability.
 */

import type { EmploymentStatus } from './types';

export const PH_TAX_YEAR_LABEL = '2025';

export const PH_TAX_YEAR_NOTE =
  'CY 2025 estimates — BIR TRAIN 2023+ withholding/graduated rates; SSS CI 2024-006/008; PhilHealth PA 2025-0002; Pag-IBIG Circular 460. Illustrative payroll/self-employed sketch only.';

/** SSS MSC from monthly compensation (CI 2024-006 compensation ranges). */
export function sssMonthlySalaryCredit(monthlyCompensation: number): number {
  if (!Number.isFinite(monthlyCompensation) || monthlyCompensation < 0) {
    return Number.NaN;
  }
  if (monthlyCompensation < 5_250) return 5_000;
  if (monthlyCompensation >= 34_750) return 35_000;
  return Math.floor((monthlyCompensation + 250) / 500) * 500;
}

/** Employee SSS + MPF share = 5% of total MSC. EC is employer-only. */
export function calculateSssEmployeeShare(monthlyCompensation: number): number {
  const msc = sssMonthlySalaryCredit(monthlyCompensation);
  if (!Number.isFinite(msc)) return Number.NaN;
  return msc * 0.05;
}

/** Self-employed SSS = 15% of MSC (CI 2024-008). */
export function calculateSssSelfEmployedShare(monthlyCompensation: number): number {
  const msc = sssMonthlySalaryCredit(monthlyCompensation);
  if (!Number.isFinite(msc)) return Number.NaN;
  return msc * 0.15;
}

function philHealthPremiumBase(monthlyBasicSalary: number): number {
  return Math.min(100_000, Math.max(10_000, monthlyBasicSalary));
}

/** Full PhilHealth premium (5% of clamped MBS). */
export function calculatePhilHealthPremium(monthlyBasicSalary: number): number {
  if (!Number.isFinite(monthlyBasicSalary) || monthlyBasicSalary < 0) {
    return Number.NaN;
  }
  return philHealthPremiumBase(monthlyBasicSalary) * 0.05;
}

export function calculatePhilHealthEmployeeShare(monthlyBasicSalary: number): number {
  return calculatePhilHealthPremium(monthlyBasicSalary) / 2;
}

function pagIbigFundSalary(monthlySalary: number): number {
  return Math.min(10_000, Math.max(0, monthlySalary));
}

/** Employee Pag-IBIG share only (Circular 460). */
export function calculatePagIbigEmployeeShare(monthlySalary: number): number {
  if (!Number.isFinite(monthlySalary) || monthlySalary < 0) return Number.NaN;
  const base = pagIbigFundSalary(monthlySalary);
  if (base <= 0) return 0;
  const rate = monthlySalary <= 1_500 ? 0.01 : 0.02;
  return base * rate;
}

/** Self-employed Pag-IBIG = employee + employer counterparts. */
export function calculatePagIbigSelfEmployedShare(monthlySalary: number): number {
  if (!Number.isFinite(monthlySalary) || monthlySalary < 0) return Number.NaN;
  const base = pagIbigFundSalary(monthlySalary);
  if (base <= 0) return 0;
  const eeRate = monthlySalary <= 1_500 ? 0.01 : 0.02;
  const erRate = 0.02;
  return base * (eeRate + erRate);
}

/**
 * BIR monthly withholding on taxable compensation (Annex E, Jan 2023+).
 * `taxableCompensation` is already net of mandatory EE contributions.
 */
export function calculateMonthlyWithholdingTax(taxableCompensation: number): number {
  if (!Number.isFinite(taxableCompensation) || taxableCompensation < 0) {
    return Number.NaN;
  }
  const t = taxableCompensation;
  if (t < 20_833) return 0;
  if (t <= 33_332) return (t - 20_833) * 0.15;
  if (t <= 66_666) return 1_875 + (t - 33_333) * 0.2;
  if (t <= 166_666) return 8_541.8 + (t - 66_667) * 0.25;
  if (t <= 666_666) return 33_541.8 + (t - 166_667) * 0.3;
  return 183_541.8 + (t - 666_667) * 0.35;
}

/**
 * Annual graduated income tax (RMC 34-2025 Table 2 / TRAIN 2023+).
 */
export function calculateAnnualGraduatedTax(annualTaxableIncome: number): number {
  if (!Number.isFinite(annualTaxableIncome) || annualTaxableIncome < 0) {
    return Number.NaN;
  }
  const y = annualTaxableIncome;
  if (y <= 250_000) return 0;
  if (y <= 400_000) return (y - 250_000) * 0.15;
  if (y <= 800_000) return 22_500 + (y - 400_000) * 0.2;
  if (y <= 2_000_000) return 102_500 + (y - 800_000) * 0.25;
  if (y <= 8_000_000) return 402_500 + (y - 2_000_000) * 0.3;
  return 2_202_500 + (y - 8_000_000) * 0.35;
}

export function calculatePhilippinesIncomeTax(input: {
  employmentStatus: EmploymentStatus;
  monthlyIncome: number;
}): {
  monthlyIncome: number;
  annualIncome: number;
  sss: number;
  philHealth: number;
  pagIbig: number;
  totalContributions: number;
  taxableIncome: number;
  withholdingTax: number;
  netPayAfterTax: number;
  totalDeductions: number;
  netPayAfterDeductions: number;
  taxLabel: string;
  contributionsSectionTitle: string;
  taxYearLabel: string;
} | null {
  const { employmentStatus, monthlyIncome } = input;
  if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0) return null;

  const employed = employmentStatus === 'employed';

  // True zero income → all-zero sketch (no MSC/floor contributions applied).
  if (monthlyIncome === 0) {
    return {
      monthlyIncome: 0,
      annualIncome: 0,
      sss: 0,
      philHealth: 0,
      pagIbig: 0,
      totalContributions: 0,
      taxableIncome: 0,
      withholdingTax: 0,
      netPayAfterTax: 0,
      totalDeductions: 0,
      netPayAfterDeductions: 0,
      taxLabel: employed ? 'Withholding tax' : 'Estimated income tax',
      contributionsSectionTitle: employed
        ? 'Contributions for employed individuals'
        : 'Contributions for self-employed individuals',
      taxYearLabel: PH_TAX_YEAR_LABEL,
    };
  }

  const sss = employed
    ? calculateSssEmployeeShare(monthlyIncome)
    : calculateSssSelfEmployedShare(monthlyIncome);
  const philHealth = employed
    ? calculatePhilHealthEmployeeShare(monthlyIncome)
    : calculatePhilHealthPremium(monthlyIncome);
  const pagIbig = employed
    ? calculatePagIbigEmployeeShare(monthlyIncome)
    : calculatePagIbigSelfEmployedShare(monthlyIncome);

  if (![sss, philHealth, pagIbig].every(Number.isFinite)) return null;
  if (sss < 0 || philHealth < 0 || pagIbig < 0) return null;

  const totalContributions = sss + philHealth + pagIbig;
  const taxableIncome = Math.max(0, monthlyIncome - totalContributions);

  let withholdingTax: number;
  let taxLabel: string;
  if (employed) {
    withholdingTax = calculateMonthlyWithholdingTax(taxableIncome);
    taxLabel = 'Withholding tax';
  } else {
    const annualTaxable = taxableIncome * 12;
    const annualTax = calculateAnnualGraduatedTax(annualTaxable);
    if (!Number.isFinite(annualTax)) return null;
    withholdingTax = annualTax / 12;
    taxLabel = 'Estimated income tax';
  }

  if (!Number.isFinite(withholdingTax) || withholdingTax < 0) return null;

  const netPayAfterTax = monthlyIncome - withholdingTax;
  const totalDeductions = withholdingTax + totalContributions;
  const netPayAfterDeductions = monthlyIncome - totalDeductions;

  if (
    ![
      taxableIncome,
      netPayAfterTax,
      totalDeductions,
      netPayAfterDeductions,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (netPayAfterTax < 0 || netPayAfterDeductions < 0) return null;

  return {
    monthlyIncome,
    annualIncome: monthlyIncome * 12,
    sss,
    philHealth,
    pagIbig,
    totalContributions,
    taxableIncome,
    withholdingTax,
    netPayAfterTax,
    totalDeductions,
    netPayAfterDeductions,
    taxLabel,
    contributionsSectionTitle: employed
      ? 'Contributions for employed individuals'
      : 'Contributions for self-employed individuals',
    taxYearLabel: PH_TAX_YEAR_LABEL,
  };
}

export function formatPhp(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function shareResultText(input: {
  title: string;
  monthlyIncomeRaw: string;
  result: {
    taxYearLabel: string;
    employmentStatus: EmploymentStatus;
    formattedSss: string;
    formattedPhilHealth: string;
    formattedPagIbig: string;
    formattedTotalContributions: string;
    formattedTaxableIncome: string;
    formattedWithholdingTax: string;
    taxLabel: string;
    formattedNetPayAfterTax: string;
    formattedTotalDeductions: string;
    formattedNetPayAfterDeductions: string;
  };
}): string {
  const { title, monthlyIncomeRaw, result } = input;
  return [
    `${title} — Omega Calculators`,
    `Tax year: CY ${result.taxYearLabel}`,
    `Status: ${result.employmentStatus}`,
    `Monthly income: ₱${monthlyIncomeRaw}`,
    `SSS: ₱${result.formattedSss}`,
    `PhilHealth: ₱${result.formattedPhilHealth}`,
    `Pag-IBIG: ₱${result.formattedPagIbig}`,
    `Total contributions: ₱${result.formattedTotalContributions}`,
    `Taxable income: ₱${result.formattedTaxableIncome}`,
    `${result.taxLabel}: ₱${result.formattedWithholdingTax}`,
    `Net pay after tax: ₱${result.formattedNetPayAfterTax}`,
    `Total deductions: ₱${result.formattedTotalDeductions}`,
    `Net pay after deductions: ₱${result.formattedNetPayAfterDeductions}`,
    PH_TAX_YEAR_NOTE,
  ].join('\n');
}
