import type { SupportedCurrency } from '@/tools/shared/currency';

/** Omni-style compounding conventions shown on the screenshot. */
export type InterestMethod = 'monthly_us_uk' | 'semi_annual_canada';

export type PaymentFrequency =
  | 'monthly'
  | 'semi_monthly'
  | 'biweekly'
  | 'accelerated_biweekly'
  | 'weekly'
  | 'accelerated_weekly';

export type DownPaymentSource = 'percent' | 'amount';

export const INTEREST_METHOD_OPTIONS: readonly {
  value: InterestMethod;
  label: string;
}[] = [
  { value: 'monthly_us_uk', label: 'Monthly (US & UK)' },
  { value: 'semi_annual_canada', label: 'Semi-annually (Canada)' },
];

export const PAYMENT_FREQUENCY_OPTIONS: readonly {
  value: PaymentFrequency;
  label: string;
}[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'semi_monthly', label: 'Semi-monthly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'accelerated_biweekly', label: 'Acc. bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'accelerated_weekly', label: 'Acc. weekly' },
];

/** PMI cancels once equity reaches this share of original home value (80% LTV). */
export const PMI_CANCEL_LTV = 0.8;

export interface HomeLoanInput {
  homeValue: string;
  homeValueCurrency: SupportedCurrency;
  downPayment: string;
  downPaymentCurrency: SupportedCurrency;
  downPaymentPercent: string;
  downPaymentSource: DownPaymentSource;
  loanAmountCurrency: SupportedCurrency;
  interestRatePercent: string;
  loanTermYears: string;
  interestMethod: InterestMethod;
  paymentFrequency: PaymentFrequency;
  firstDay: string;
  paymentCurrency: SupportedCurrency;
  /** Further specifications (collapsed by default). */
  showFurtherSpecs: boolean;
  annualPmiPercent: string;
  otherCosts: string;
  otherCostsCurrency: SupportedCurrency;
}

export interface HomeLoanResult {
  homeValue: number;
  downPayment: number;
  downPaymentPercent: number;
  loanAmount: number;
  periodicPayment: number;
  paymentCount: number;
  totalPayments: number;
  totalInterest: number;
  periodicPmi: number;
  totalPmi: number;
  pmiPaymentCount: number;
  pmiUntilDate: string | null;
  otherCostsPeriodic: number;
  totalOtherCosts: number;
  totalWithCosts: number;
  payoffDate: string;
  /** Chart shares (0–100), sum ≈ 100. */
  principalSharePercent: number;
  interestSharePercent: number;
  pmiSharePercent: number;
  otherSharePercent: number;
  calcCurrency: SupportedCurrency;
  formattedHomeValue: string;
  formattedDownPayment: string;
  formattedDownPaymentPercent: string;
  formattedLoanAmount: string;
  formattedPeriodicPayment: string;
  formattedTotalPayments: string;
  formattedTotalInterest: string;
  formattedPeriodicPmi: string;
  formattedTotalPmi: string;
  formattedOtherCostsPeriodic: string;
  formattedTotalOtherCosts: string;
  formattedTotalWithCosts: string;
  downPaymentDisplay: number;
  loanAmountDisplay: number;
  periodicPaymentDisplay: number;
  totalPaymentsDisplay: number;
  totalInterestDisplay: number;
  periodicPmiDisplay: number;
  totalPmiDisplay: number;
  otherCostsPeriodicDisplay: number;
  totalWithCostsDisplay: number;
  homeValueCurrency: SupportedCurrency;
  downPaymentCurrency: SupportedCurrency;
  loanAmountCurrency: SupportedCurrency;
  paymentCurrency: SupportedCurrency;
  otherCostsCurrency: SupportedCurrency;
}

export type HomeLoanFieldErrors = {
  homeValue?: string;
  downPayment?: string;
  downPaymentPercent?: string;
  interestRatePercent?: string;
  loanTermYears?: string;
  firstDay?: string;
  annualPmiPercent?: string;
  otherCosts?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): HomeLoanInput {
  return {
    homeValue: '150000',
    homeValueCurrency: 'PKR',
    downPayment: '15000',
    downPaymentCurrency: 'PKR',
    downPaymentPercent: '10',
    downPaymentSource: 'percent',
    loanAmountCurrency: 'PKR',
    interestRatePercent: '4.5',
    loanTermYears: '30',
    interestMethod: 'monthly_us_uk',
    paymentFrequency: 'monthly',
    firstDay: todayIsoDate(),
    paymentCurrency: 'PKR',
    showFurtherSpecs: false,
    annualPmiPercent: '0.5',
    otherCosts: '0',
    otherCostsCurrency: 'PKR',
  };
}
