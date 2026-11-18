import type { SupportedCurrency } from '@/tools/shared/currency';

export type TermUnit = 'yrs' | 'mos';
export type MoneyFrequency = 'mo' | 'yr';
export type PaymentSource = 'auto' | 'manual';
export type NoiSource = 'direct' | 'calculated';

export const TERM_UNIT_OPTIONS: readonly { value: TermUnit; label: string }[] = [
  { value: 'yrs', label: 'yrs' },
  { value: 'mos', label: 'mos' },
] as const;

export const MONEY_FREQUENCY_OPTIONS: readonly {
  value: MoneyFrequency;
  label: string;
}[] = [
  { value: 'mo', label: '/ mo' },
  { value: 'yr', label: '/ yr' },
] as const;

export interface DebtServiceCoverageRatioInput {
  interestRatePercent: string;
  term: string;
  termUnit: TermUnit;
  totalLoan: string;
  totalLoanCurrency: SupportedCurrency;
  loanPayment: string;
  loanPaymentCurrency: SupportedCurrency;
  loanPaymentFrequency: MoneyFrequency;
  /** Whether loan payment was auto-synced from amortization or typed. */
  paymentSource: PaymentSource;
  /** Collapsible NOI builder. */
  noiSectionOpen: boolean;
  grossIncome: string;
  grossIncomeCurrency: SupportedCurrency;
  grossIncomeFrequency: MoneyFrequency;
  expensesPercent: string;
  vacancyPercent: string;
  noi: string;
  noiCurrency: SupportedCurrency;
  noiFrequency: MoneyFrequency;
  noiSource: NoiSource;
}

export interface DebtServiceCoverageRatioResult {
  monthlyPaymentInCalc: number;
  monthlyNoiInCalc: number;
  dscr: number;
  formattedDscr: string;
  formattedLoanPayment: string;
  formattedNoi: string;
  calcCurrency: SupportedCurrency;
}

export type DebtServiceCoverageRatioFieldErrors = {
  interestRatePercent?: string;
  term?: string;
  totalLoan?: string;
  loanPayment?: string;
  grossIncome?: string;
  expensesPercent?: string;
  vacancyPercent?: string;
  noi?: string;
  form?: string;
};

export function createDefaultInput(): DebtServiceCoverageRatioInput {
  return {
    interestRatePercent: '4',
    term: '',
    termUnit: 'yrs',
    totalLoan: '',
    totalLoanCurrency: 'PKR',
    loanPayment: '',
    loanPaymentCurrency: 'PKR',
    loanPaymentFrequency: 'mo',
    paymentSource: 'auto',
    noiSectionOpen: false,
    grossIncome: '',
    grossIncomeCurrency: 'PKR',
    grossIncomeFrequency: 'mo',
    expensesPercent: '',
    vacancyPercent: '',
    noi: '',
    noiCurrency: 'PKR',
    noiFrequency: 'mo',
    noiSource: 'direct',
  };
}
