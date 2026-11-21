/**
 * PPF scheme configuration — educational defaults.
 * Limits/rates change via government notification; verify before investing.
 * Default rate 7.1% is an editable illustrative assumption (not a live guarantee).
 */

export type PpfInvestmentMode = 'fixed' | 'custom';
export type PpfDepositFrequency =
  | 'monthly'
  | 'quarterly'
  | 'half-yearly'
  | 'annually';
export type PpfExtensionMode =
  | 'standard'
  | 'extension-with-contributions'
  | 'extension-without-contributions';

export interface PpfSchemeConfig {
  minimumAnnualDeposit: number;
  maximumAnnualDeposit: number;
  depositIncrement: number;
  standardTenureYears: number;
  extensionBlockYears: number;
  defaultAnnualInterestRate: number;
  interestRateLabel: string;
  interestRateSource: string;
  rulesSource: string;
}

export const DEFAULT_PPF_SCHEME: Readonly<PpfSchemeConfig> = {
  minimumAnnualDeposit: 500,
  maximumAnnualDeposit: 150_000,
  depositIncrement: 50,
  standardTenureYears: 15,
  extensionBlockYears: 5,
  defaultAnnualInterestRate: 7.1,
  interestRateLabel: 'Illustrative constant rate (editable)',
  interestRateSource:
    'Editable projection assumption. Official PPF rates are notified quarterly by the Government of India — verify the rate applicable for each period.',
  rulesSource:
    'Educational model of PPF rules: FY Apr–Mar, 5th-day eligible balance, annual FY-end interest credit, ₹500–₹1,50,000 annual deposit band (₹50 increments), 15-year FY-end maturity. Confirm with India Post / nsiindia.gov.in.',
};

export interface PpfDeposit {
  id: string;
  date: string;
  amount: string;
}

export interface PpfInput {
  investmentMode: PpfInvestmentMode;
  depositAmount: string;
  depositFrequency: PpfDepositFrequency;
  annualInterestRate: string;
  startDate: string;
  inflationRate: string;
  extensionMode: PpfExtensionMode;
  customDeposits: PpfDeposit[];
}

export interface PpfYearlyRecord {
  financialYear: string;
  openingBalance: number;
  deposits: number;
  interestEarned: number;
  interestCredited: number;
  closingBalance: number;
  cumulativeInvestment: number;
  cumulativeInterest: number;
}

export interface PpfResult {
  initialInvestment: number;
  scheduledDepositAmount: number;
  depositFrequency: PpfDepositFrequency | 'custom';
  totalInvestment: number;
  totalInterest: number;
  maturityValue: number;
  inflationAdjustedValue: number;
  investmentYears: number;
  numberOfDeposits: number;
  maturityDate: string;
  openingFinancialYear: string;
  interestRateUsed: number;
  inflationRateUsed: number;
  extensionMode: PpfExtensionMode;
  yearlyBreakdown: PpfYearlyRecord[];
  interpretation: string;
  formattedMaturity: string;
  formattedInvestment: string;
  formattedInterest: string;
  formattedInflationAdjusted: string;
  formattedInitial: string;
}

export type PpfFieldErrors = {
  depositAmount?: string;
  annualInterestRate?: string;
  startDate?: string;
  inflationRate?: string;
  customDeposits?: string;
  form?: string;
};

let depositSeq = 0;
export function newDepositId(): string {
  depositSeq += 1;
  return `d${depositSeq}`;
}

export function createEmptyInput(): PpfInput {
  return {
    investmentMode: 'fixed',
    depositAmount: '',
    depositFrequency: 'monthly',
    annualInterestRate: String(DEFAULT_PPF_SCHEME.defaultAnnualInterestRate),
    startDate: '',
    inflationRate: '0',
    extensionMode: 'standard',
    customDeposits: [],
  };
}

export function createExampleInput(): PpfInput {
  return {
    investmentMode: 'fixed',
    depositAmount: '50000',
    depositFrequency: 'annually',
    annualInterestRate: String(DEFAULT_PPF_SCHEME.defaultAnnualInterestRate),
    startDate: '2026-04-05',
    inflationRate: '0',
    extensionMode: 'standard',
    customDeposits: [],
  };
}
