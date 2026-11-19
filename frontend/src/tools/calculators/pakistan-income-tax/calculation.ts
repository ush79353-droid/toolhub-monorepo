/**
 * Pakistan FBR salaried-individual progressive income tax.
 *
 * Tax year: 2027 (1 July 2026 – 30 June 2027)
 * Legal basis:
 *   - Finance Act, 2026 — substitutes the Table in clause (2) of Division I of
 *     Part I of the First Schedule to the Income Tax Ordinance, 2001
 *     (Gazette of Pakistan, Extra., 26 June 2026)
 *   - FBR Circular No. 02 of 2026-27 (8 September 2026) — confirms revised
 *     salary rates and withdrawal of the salaried 9% surcharge under s.4AB
 *
 * Slabs (annual taxable salary, Rs.):
 *   ≤ 600,000                         → 0%
 *   600,001 – 1,200,000               → 1% of amount exceeding 600,000
 *   1,200,001 – 2,200,000             → 6,000 + 11% exceeding 1,200,000
 *   2,200,001 – 3,200,000             → 116,000 + 20% exceeding 2,200,000
 *   3,200,001 – 4,100,000             → 316,000 + 25% exceeding 3,200,000
 *   4,100,001 – 5,600,000             → 541,000 + 29% exceeding 4,100,000
 *   5,600,001 – 7,000,000             → 976,000 + 32% exceeding 5,600,000
 *   > 7,000,000                       → 1,424,000 + 35% exceeding 7,000,000
 *
 * No salaried surcharge (s.4AB) for TY 2027.
 * Returns full precision; round only for display.
 */

export const PAKISTAN_SALARY_TAX_YEAR_LABEL = '2027';

export const PAKISTAN_SALARY_TAX_YEAR_NOTE =
  'Tax Year 2027 salaried rates — Finance Act, 2026 (First Schedule, Part I, Division I, clause (2)); FBR Circular No. 02 of 2026-27. Salaried surcharge under section 4AB withdrawn.';

/** Inclusive upper bound of each progressive band; last band uses Infinity. */
const SALARY_SLABS: ReadonlyArray<{
  upTo: number;
  baseTax: number;
  rate: number;
  excessOver: number;
}> = [
  { upTo: 600_000, baseTax: 0, rate: 0, excessOver: 0 },
  { upTo: 1_200_000, baseTax: 0, rate: 0.01, excessOver: 600_000 },
  { upTo: 2_200_000, baseTax: 6_000, rate: 0.11, excessOver: 1_200_000 },
  { upTo: 3_200_000, baseTax: 116_000, rate: 0.2, excessOver: 2_200_000 },
  { upTo: 4_100_000, baseTax: 316_000, rate: 0.25, excessOver: 3_200_000 },
  { upTo: 5_600_000, baseTax: 541_000, rate: 0.29, excessOver: 4_100_000 },
  { upTo: 7_000_000, baseTax: 976_000, rate: 0.32, excessOver: 5_600_000 },
  {
    upTo: Number.POSITIVE_INFINITY,
    baseTax: 1_424_000,
    rate: 0.35,
    excessOver: 7_000_000,
  },
];

/**
 * Progressive annual salary tax for a given annual taxable income (Rs.).
 * Rejects negative / non-finite income. Zero and tax-free range return 0.
 */
export function calculateAnnualSalaryTax(annualIncome: number): number | null {
  if (!Number.isFinite(annualIncome) || annualIncome < 0) return null;

  for (const slab of SALARY_SLABS) {
    if (annualIncome <= slab.upTo) {
      const tax = slab.baseTax + (annualIncome - slab.excessOver) * slab.rate;
      if (!Number.isFinite(tax) || tax < 0) return null;
      // First slab (≤ 600k) has rate 0 and excessOver 0 → tax stays 0.
      return tax;
    }
  }
  return null;
}

export function calculatePakistanIncomeTax(input: {
  monthlyIncome: number;
}): {
  monthlyIncome: number;
  yearlyIncome: number;
  yearlyTax: number;
  monthlyTax: number;
  monthlyIncomeAfterTax: number;
  taxYearLabel: string;
} | null {
  const { monthlyIncome } = input;
  if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0) return null;

  const yearlyIncome = monthlyIncome * 12;
  const yearlyTax = calculateAnnualSalaryTax(yearlyIncome);
  if (yearlyTax === null) return null;

  const monthlyTax = yearlyTax / 12;
  const monthlyIncomeAfterTax = monthlyIncome - monthlyTax;

  if (
    ![yearlyIncome, yearlyTax, monthlyTax, monthlyIncomeAfterTax].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (monthlyTax < 0 || monthlyIncomeAfterTax < 0) return null;

  return {
    monthlyIncome,
    yearlyIncome,
    yearlyTax,
    monthlyTax,
    monthlyIncomeAfterTax,
    taxYearLabel: PAKISTAN_SALARY_TAX_YEAR_LABEL,
  };
}

/** Display rounding for PKR amounts — never used inside the formulas. */
export function formatPakistanRupees(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function shareResultText(input: {
  title: string;
  monthlyIncomeRaw: string;
  result: {
    taxYearLabel: string;
    formattedMonthlyTax: string;
    formattedMonthlyIncomeAfterTax: string;
    formattedYearlyIncome: string;
    formattedYearlyTax: string;
  };
}): string {
  const { title, monthlyIncomeRaw, result } = input;
  return [
    `${title} — Omega Calculators`,
    `Tax year: ${result.taxYearLabel} (FBR salaried / Finance Act 2026)`,
    `Monthly income: Rs. ${monthlyIncomeRaw}`,
    `Monthly tax: Rs. ${result.formattedMonthlyTax}`,
    `Monthly income after tax: Rs. ${result.formattedMonthlyIncomeAfterTax}`,
    `Yearly income: Rs. ${result.formattedYearlyIncome}`,
    `Yearly tax: Rs. ${result.formattedYearlyTax}`,
    PAKISTAN_SALARY_TAX_YEAR_NOTE,
  ].join('\n');
}
