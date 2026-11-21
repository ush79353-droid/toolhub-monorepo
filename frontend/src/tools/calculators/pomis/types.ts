/**
 * POMIS scheme rules are configurable. Defaults below are educational
 * illustrations commonly cited for Individual ₹9 lakh / Joint ₹15 lakh and a
 * 5-year tenure. Interest rates are revised by the Government of India;
 * 6.6% is an editable example — verify the rate applicable at account opening
 * with India Post / nsiindia.gov.in before relying on projections.
 */

export type PomisAccountType = 'individual' | 'joint';

export interface PomisSchemeConfig {
  /** Example / admin-configured annual rate (%). Not claimed as current official. */
  annualInterestRate: number;
  interestRateEffectiveFrom: string;
  interestRateSource: string;
  individualInvestmentLimit: number;
  jointInvestmentLimit: number;
  investmentTermYears: number;
  minimumInvestment: number;
  investmentIncrement: number;
  rulesEffectiveFrom: string;
  rulesSource: string;
}

/** Configurable educational defaults — update when verified official rules change. */
export const DEFAULT_POMIS_SCHEME: Readonly<PomisSchemeConfig> = {
  annualInterestRate: 6.6,
  interestRateEffectiveFrom: 'example-default',
  interestRateSource:
    'Editable example rate for illustration (historical Omni-style reference 6.6%). Verify current India Post / MoF notification.',
  individualInvestmentLimit: 900_000,
  jointInvestmentLimit: 1_500_000,
  investmentTermYears: 5,
  minimumInvestment: 1_000,
  investmentIncrement: 1_000,
  rulesEffectiveFrom: 'illustrative-config',
  rulesSource:
    'Educational limits commonly published for POMIS (Individual ₹9,00,000 / Joint ₹15,00,000; min ₹1,000; 5-year tenure). Confirm with India Post before investing.',
};

export interface PomisInput {
  accountType: PomisAccountType;
  investmentAmount: string;
  annualInterestRate: string;
  investmentStartDate: string;
}

export interface PomisScheduleRow {
  month: number;
  paymentDate: string;
  monthlyInterest: number;
  cumulativeInterest: number;
  principalOutstanding: number;
  isMaturityPrincipal: boolean;
}

export interface PomisResult {
  accountType: PomisAccountType;
  principalInvestment: number;
  maturityPrincipal: number;
  interestRateUsed: number;
  monthlyIncome: number;
  annualIncome: number;
  totalInterest: number;
  totalCashReceived: number;
  investmentTermYears: number;
  investmentTermMonths: number;
  scheduledPaymentCount: number;
  investmentStartDate: string | null;
  maturityDate: string | null;
  investmentLimit: number;
  rateNote: string;
  rulesNote: string;
  schedule: PomisScheduleRow[];
  interpretation: string;
  formattedMonthlyIncome: string;
  formattedAnnualIncome: string;
  formattedTotalInterest: string;
  formattedTotalCash: string;
  formattedPrincipal: string;
}

export type PomisFieldErrors = {
  investmentAmount?: string;
  annualInterestRate?: string;
  investmentStartDate?: string;
  form?: string;
};

export function createEmptyInput(): PomisInput {
  return {
    accountType: 'individual',
    investmentAmount: '',
    annualInterestRate: String(DEFAULT_POMIS_SCHEME.annualInterestRate),
    investmentStartDate: '',
  };
}

export function createExampleInput(): PomisInput {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return {
    accountType: 'individual',
    investmentAmount: '450000',
    annualInterestRate: String(DEFAULT_POMIS_SCHEME.annualInterestRate),
    investmentStartDate: `${yyyy}-${mm}-${dd}`,
  };
}

export function accountLimit(
  accountType: PomisAccountType,
  scheme: PomisSchemeConfig = DEFAULT_POMIS_SCHEME,
): number {
  return accountType === 'joint'
    ? scheme.jointInvestmentLimit
    : scheme.individualInvestmentLimit;
}
