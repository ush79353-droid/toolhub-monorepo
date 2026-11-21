import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface MagiCalculationInput {
  agi: number;
  foreignEarnedIncome: number;
  foreignHousingCost: number;
  nonTaxableSocialBenefits: number;
  selfEmploymentTaxes: number;
  iraContributions: number;
  passiveIncomeOrLosses: number;
  others: number;
  employerPaidAdoptionBenefits: number;
  savingsBondInterest: number;
  studentLoanInterest: number;
  qualifiedTuitionExpenses: number;
}

export interface MagiCalculationResult {
  magi: number;
}

/**
 * Illustrative simplified MAGI estimate:
 * MAGI = AGI + sum of all listed adjustment amounts (after FX into AGI currency).
 * Not program-specific IRS eligibility.
 */
export function calculateMagi(
  input: MagiCalculationInput
): MagiCalculationResult | null {
  const values = Object.values(input);
  if (!values.every(Number.isFinite)) {
    return null;
  }

  const {
    agi,
    foreignEarnedIncome,
    foreignHousingCost,
    nonTaxableSocialBenefits,
    selfEmploymentTaxes,
    iraContributions,
    passiveIncomeOrLosses,
    others,
    employerPaidAdoptionBenefits,
    savingsBondInterest,
    studentLoanInterest,
    qualifiedTuitionExpenses,
  } = input;

  const nonnegativeKeys: (keyof Omit<MagiCalculationInput, 'agi' | 'passiveIncomeOrLosses' | 'others'>)[] =
    [
      'foreignEarnedIncome',
      'foreignHousingCost',
      'nonTaxableSocialBenefits',
      'selfEmploymentTaxes',
      'iraContributions',
      'employerPaidAdoptionBenefits',
      'savingsBondInterest',
      'studentLoanInterest',
      'qualifiedTuitionExpenses',
    ];

  for (const key of nonnegativeKeys) {
    if (input[key] < 0) return null;
  }

  const magi =
    agi +
    foreignEarnedIncome +
    foreignHousingCost +
    nonTaxableSocialBenefits +
    selfEmploymentTaxes +
    iraContributions +
    passiveIncomeOrLosses +
    others +
    employerPaidAdoptionBenefits +
    savingsBondInterest +
    studentLoanInterest +
    qualifiedTuitionExpenses;

  if (!Number.isFinite(magi)) return null;

  return { magi };
}

export function formatMagiMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}