export type {
  CurrencyOption,
  SupportedCurrency,
} from '../../shared/currency';
export {
  CURRENCY_DENOMINATION_NOTE,
  CURRENCY_OPTIONS,
  DEFAULT_CURRENCY,
  formatCurrencyValue,
  getCurrencyShortLabel,
  getCurrencySymbol,
} from '../../shared/currency';
import { DEFAULT_CURRENCY, type SupportedCurrency } from '../../shared/currency';

export type CompoundingFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export type PaymentFrequency =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannually'
  | 'annually';

export interface AmortizationInput {
  loanAmount: number;
  termYears: number;
  termMonths: number;
  interestRate: number; // Annual nominal rate as percentage (e.g., 12.5)
  compoundingFrequency: CompoundingFrequency;
  paymentFrequency: PaymentFrequency;
  extraPayment: number; // Recurring extra payment per payment period
  recurringExtraStartPeriod: number; // 1-based period to start extra payments
  recurringExtraEndPeriod: number | null; // Optional 1-based period to end extra payments (null = payoff)
  oneTimeExtraAmount: number;
  oneTimeExtraPeriod: number;
  startDate: string; // ISO date 'YYYY-MM-DD'
  currency: SupportedCurrency;
}

export type AmortizationFieldKey = keyof AmortizationInput | 'form' | 'term';

export type AmortizationFieldErrors = Partial<Record<AmortizationFieldKey, string>>;

export interface AmortizationValidationResult {
  isValid: boolean;
  errors: AmortizationFieldErrors;
}

export interface AmortizationScheduleRow {
  periodNumber: number;
  paymentDate: string;
  openingBalance: number;
  scheduledPayment: number;
  principalPaid: number;
  interestPaid: number;
  extraPayment: number;
  totalPayment: number;
  closingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface AmortizationYearlyRow {
  year: number;
  calendarYear: number;
  paymentsCount: number;
  openingBalance: number;
  scheduledPayment: number;
  principalPaid: number;
  interestPaid: number;
  extraPayment: number;
  totalPayment: number;
  closingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface AmortizationChartPoint {
  period: number;
  date: string;
  balance: number;
  baselineBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface AmortizationResult {
  currency: SupportedCurrency;
  loanAmount: number;
  termYears: number;
  termMonths: number;
  annualInterestRate: number;
  compoundingFrequency: CompoundingFrequency;
  paymentFrequency: PaymentFrequency;
  compoundingPeriodsPerYear: number;
  paymentPeriodsPerYear: number;
  periodicRate: number;
  effectiveAnnualRate: number;
  regularPayment: number;
  scheduledPaymentsCount: number; // Baseline scheduled periods
  actualPaymentsCount: number; // Actual periods until full payoff
  paymentsSaved: number;
  totalScheduledPaymentAmount: number;
  totalExtraPaymentAmount: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  baselineTotalInterest: number;
  baselineTotalAmountPaid: number;
  interestSavings: number;
  payoffDate: string;
  baselinePayoffDate: string;
  timeSavedDescription: string;
  principalRatioPercent: number;
  interestRatioPercent: number;
  schedule: AmortizationScheduleRow[];
  yearlySchedule: AmortizationYearlyRow[];
  chartPoints: AmortizationChartPoint[];
}

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
  description: string;
  periodsPerYear: number;
}[] = [
  { value: 'daily', label: 'Daily (365/yr)', description: '365 times per year', periodsPerYear: 365 },
  { value: 'weekly', label: 'Weekly (52/yr)', description: '52 times per year', periodsPerYear: 52 },
  { value: 'biweekly', label: 'Biweekly (26/yr)', description: 'Every two weeks (26 times/yr)', periodsPerYear: 26 },
  { value: 'monthly', label: 'Monthly (12/yr)', description: 'Standard commercial & mortgage default', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly (4/yr)', description: '4 times per year', periodsPerYear: 4 },
  { value: 'semiannually', label: 'Semiannually (2/yr)', description: 'Twice per year (Canadian mortgages)', periodsPerYear: 2 },
  { value: 'annually', label: 'Annually (1/yr)', description: 'Once per year', periodsPerYear: 1 },
] as const;

export const PAYMENT_FREQUENCY_OPTIONS: readonly {
  value: PaymentFrequency;
  label: string;
  description: string;
  periodsPerYear: number;
  unitLabel: string;
}[] = [
  { value: 'weekly', label: 'Weekly', description: '52 payments per year', periodsPerYear: 52, unitLabel: '/ week' },
  { value: 'biweekly', label: 'Biweekly', description: '26 payments per year', periodsPerYear: 26, unitLabel: '/ 2 weeks' },
  { value: 'monthly', label: 'Monthly', description: '12 payments per year (Standard)', periodsPerYear: 12, unitLabel: '/ month' },
  { value: 'quarterly', label: 'Quarterly', description: '4 payments per year', periodsPerYear: 4, unitLabel: '/ quarter' },
  { value: 'semiannually', label: 'Semiannually', description: '2 payments per year', periodsPerYear: 2, unitLabel: '/ half-year' },
  { value: 'annually', label: 'Annually', description: '1 payment per year', periodsPerYear: 1, unitLabel: '/ year' },
] as const;

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDefaultAmortizationInput(startDate = getTodayIsoDate()): AmortizationInput {
  return {
    loanAmount: 10000,
    termYears: 10,
    termMonths: 0,
    interestRate: 12.5,
    compoundingFrequency: 'monthly',
    paymentFrequency: 'monthly',
    extraPayment: 0,
    recurringExtraStartPeriod: 1,
    recurringExtraEndPeriod: null,
    oneTimeExtraAmount: 0,
    oneTimeExtraPeriod: 1,
    startDate,
    currency: DEFAULT_CURRENCY,
  };
}
