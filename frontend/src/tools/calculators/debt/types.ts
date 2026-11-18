import type { SupportedCurrency } from '@/tools/shared/currency';

export const MIN_DEBT_COUNT = 2;
export const MAX_DEBT_COUNT = 6;

export const DEBT_COUNT_OPTIONS = [
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
  { value: 4, label: 'Four' },
  { value: 5, label: 'Five' },
  { value: 6, label: 'Six' },
] as const;

export type DebtMethod = 'min' | 'snowball' | 'avalanche' | 'consolidation';

export interface DebtRowInput {
  balance: string;
  balanceCurrency: SupportedCurrency;
  interestRatePercent: string;
  payment: string;
  paymentCurrency: SupportedCurrency;
}

export interface DebtCalculatorInput {
  debtCount: number;
  debts: DebtRowInput[];
  consolidationRatePercent: string;
  prepaidFee: string;
  prepaidFeeCurrency: SupportedCurrency;
  totalDebtCurrency: SupportedCurrency;
  monthlyPaymentCurrency: SupportedCurrency;
}

export interface MethodRow {
  method: DebtMethod;
  label: string;
  /** APR percent; null when unavailable. */
  aprPercent: number | null;
  /** Weighted-average APR footnote for minimum payment. */
  aprIsWeightedEstimate: boolean;
  interest: number;
  payoffMonths: number | null;
  ok: boolean;
  message?: string;
}

export interface DebtCalculatorResult {
  totalDebt: number;
  monthlyPayment: number;
  calcCurrency: SupportedCurrency;
  totalDebtDisplay: number;
  monthlyPaymentDisplay: number;
  totalDebtCurrency: SupportedCurrency;
  monthlyPaymentCurrency: SupportedCurrency;
  formattedTotalDebt: string;
  formattedMonthlyPayment: string;
  rows: MethodRow[];
  formattedInterest: (amount: number) => string;
}

export type DebtCalculatorFieldErrors = {
  form?: string;
  consolidationRatePercent?: string;
  prepaidFee?: string;
  debts?: Array<{
    balance?: string;
    interestRatePercent?: string;
    payment?: string;
  }>;
};

export function emptyDebtRow(currency: SupportedCurrency = 'PKR'): DebtRowInput {
  return {
    balance: '',
    balanceCurrency: currency,
    interestRatePercent: '',
    payment: '',
    paymentCurrency: currency,
  };
}

export function createDefaultInput(): DebtCalculatorInput {
  return {
    debtCount: 2,
    debts: [
      {
        balance: '4500',
        balanceCurrency: 'PKR',
        interestRatePercent: '6.2',
        payment: '120',
        paymentCurrency: 'PKR',
      },
      {
        balance: '12000',
        balanceCurrency: 'PKR',
        interestRatePercent: '18.2',
        payment: '220',
        paymentCurrency: 'PKR',
      },
      emptyDebtRow(),
      emptyDebtRow(),
      emptyDebtRow(),
      emptyDebtRow(),
    ],
    consolidationRatePercent: '9.5',
    prepaidFee: '200',
    prepaidFeeCurrency: 'PKR',
    totalDebtCurrency: 'PKR',
    monthlyPaymentCurrency: 'PKR',
  };
}
