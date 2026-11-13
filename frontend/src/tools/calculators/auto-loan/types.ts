export type DownPaymentMode = 'amount' | 'percent';

export type TermUnit = 'months' | 'years';

export type CostInclusion = 'finance' | 'upfront';

export type TaxPolicy = 'after-trade-in' | 'full-price';

export type {
  CurrencyOption,
  SupportedCurrency,
} from '@/tools/shared/currency';
export {
  CURRENCY_DENOMINATION_NOTE,
  CURRENCY_OPTIONS,
  DEFAULT_CURRENCY,
  formatCurrencyValue,
  getCurrencyShortLabel,
  getCurrencySymbol,
} from '@/tools/shared/currency';
import { DEFAULT_CURRENCY, type SupportedCurrency } from '@/tools/shared/currency';

export interface AutoLoanInput {
  autoPrice: number;
  downPaymentValue: number;
  downPaymentMode: DownPaymentMode;
  loanTermValue: number;
  loanTermUnit: TermUnit;
  annualInterestRate: number;
  tradeInValue: number;
  tradeInOwed: number;
  salesTaxRate: number;
  taxPolicy: TaxPolicy;
  salesTaxInclusion: CostInclusion;
  additionalFees: number;
  feesInclusion: CostInclusion;
  startDate: string;
  currency: SupportedCurrency;
}

export type AutoLoanFieldKey = keyof AutoLoanInput | 'form';

export type AutoLoanFieldErrors = Partial<Record<AutoLoanFieldKey, string>>;

export interface AutoLoanValidationResult {
  isValid: boolean;
  errors: AutoLoanFieldErrors;
}

export interface AmortizationMonthlyRow {
  paymentNumber: number;
  paymentDate: string;
  beginningBalance: number;
  monthlyPayment: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface AmortizationYearlyRow {
  year: number;
  paymentsCount: number;
  beginningBalance: number;
  totalPayment: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface ScheduleTotals {
  totalPayment: number;
  totalPrincipal: number;
  totalInterest: number;
}

export interface AutoLoanResult {
  currency: SupportedCurrency;
  autoPrice: number;
  downPaymentAmount: number;
  downPaymentPercentOfPrice: number;
  tradeInValue: number;
  tradeInOwed: number;
  netTradeInEquity: number;
  tradeInEquityStatus: 'positive' | 'negative' | 'even';
  taxPolicy: TaxPolicy;
  taxableVehicleAmount: number;
  salesTax: number;
  financedSalesTax: number;
  upfrontSalesTax: number;
  additionalFees: number;
  financedFees: number;
  upfrontFees: number;
  amountFinanced: number;
  totalMonths: number;
  annualInterestRate: number;
  monthlyInterestRate: number;
  estimatedMonthlyPayment: number;
  finalMonthlyPayment: number;
  totalLoanPayments: number;
  totalInterest: number;
  upfrontCosts: number;
  totalEstimatedCost: number;
  startDate: string;
  payoffDate: string;
  principalRatioPercent: number;
  interestRatioPercent: number;
  monthlySchedule: AmortizationMonthlyRow[];
  yearlySchedule: AmortizationYearlyRow[];
  scheduleTotals: ScheduleTotals;
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultAutoLoanInput(startDate = getTodayIsoDate()): AutoLoanInput {
  return {
    autoPrice: 35000,
    downPaymentValue: 5000,
    downPaymentMode: 'amount',
    loanTermValue: 60,
    loanTermUnit: 'months',
    annualInterestRate: 6.5,
    tradeInValue: 6000,
    tradeInOwed: 2000,
    salesTaxRate: 7,
    taxPolicy: 'after-trade-in',
    salesTaxInclusion: 'finance',
    additionalFees: 850,
    feesInclusion: 'finance',
    startDate,
    currency: DEFAULT_CURRENCY,
  };
}

