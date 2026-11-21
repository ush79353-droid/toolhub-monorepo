/**
 * Verified FICA / self-employment tax parameters.
 *
 * Sources:
 * - SSA 2026 COLA Fact Sheet — OASDI taxable maximum $184,500 (2026); $176,100 (2025)
 * - IRS Topic no. 751 — Social Security and Medicare withholding rates
 * - IRS Topic no. 560 / Form 8959 — Additional Medicare Tax thresholds
 * - IRC §§3101, 3111, 1401, 1402; Schedule SE (Form 1040)
 */

export type FicaTaxYear = 2025 | 2026;

export type FicaFilingStatus =
  | 'single'
  | 'married-joint'
  | 'married-separate'
  | 'head-of-household'
  | 'qualifying-surviving-spouse';

export type FicaEmploymentType = 'employee-employer' | 'self-employed';

/** Employee / employer OASDI + HI rates (each side). */
export const SS_RATE_EACH = 0.062;
export const MEDICARE_RATE_EACH = 0.0145;

/** Combined self-employment OASDI + HI (Schedule SE). */
export const SS_RATE_SE = 0.124;
export const MEDICARE_RATE_SE = 0.029;

/** Additional Medicare Tax (employee / SE only — no employer match). */
export const ADDITIONAL_MEDICARE_RATE = 0.009;

/**
 * Net-earnings factor for self-employment tax (IRC §1402(a)(12)):
 * multiply net profit from self-employment by 92.35% before SE rates.
 */
export const SE_NET_EARNINGS_FACTOR = 0.9235;

/**
 * Employer Additional Medicare Tax withholding threshold (calendar-year wages).
 * Employers withhold at $200,000 regardless of filing status; actual liability
 * still uses Form 8959 filing-status thresholds.
 */
export const EMPLOYER_ADDITIONAL_MEDICARE_WITHHOLDING_THRESHOLD = 200_000;

export interface FicaYearParams {
  taxYear: FicaTaxYear;
  /** OASDI (Social Security) wage / SE earnings base for the year. */
  socialSecurityWageBase: number;
}

export const FICA_YEAR_PARAMS: Record<FicaTaxYear, FicaYearParams> = {
  2025: { taxYear: 2025, socialSecurityWageBase: 176_100 },
  2026: { taxYear: 2026, socialSecurityWageBase: 184_500 },
};

/** Form 8959 Additional Medicare Tax thresholds by filing status. */
export function additionalMedicareThreshold(status: FicaFilingStatus): number {
  switch (status) {
    case 'married-joint':
      return 250_000;
    case 'married-separate':
      return 125_000;
    case 'single':
    case 'head-of-household':
    case 'qualifying-surviving-spouse':
      return 200_000;
  }
}

export const DISCLOSURE_SCOPE =
  'Educational FICA / self-employment tax estimate only. It does not compute federal income tax, state payroll taxes, FUTA, SUTA, tips aggregation, multi-employer wage bases, or Form 8959 when both wages and SE income apply in the same year.';

export const DISCLOSURE_INCOME_EMPLOYEE =
  'Income is treated as FICA wages subject to Social Security and Medicare tax for the selected year (Box 3 / Box 5 style covered wages).';

export const DISCLOSURE_INCOME_SE =
  'Income is treated as net profit from self-employment (Schedule C style) before the 92.35% net-earnings adjustment. Do not enter gross business revenue unless it equals net SE earnings.';

export const DISCLOSURE_ADDITIONAL_MEDICARE =
  'Additional Medicare Tax (0.9%) is the taxpayer’s liability above the filing-status threshold (Form 8959). Employers withhold Additional Medicare Tax once calendar-year wages exceed $200,000 regardless of filing status — withholding can differ from final liability.';

export const DISCLOSURE_SE_DEDUCTION =
  'The deductible half of self-employment tax follows IRC §164(f) on the regular SE tax (Social Security + Medicare at SE rates). Additional Medicare Tax is not included in that deduction.';
