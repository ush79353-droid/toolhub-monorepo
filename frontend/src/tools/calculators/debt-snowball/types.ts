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

export type DebtSnowballMethod = 'min' | 'snowball' | 'avalanche';

export const AIM_OPTIONS = [
  {
    value: 'minimum' as const,
    label: 'Pay the minimum amount monthly',
  },
  {
    value: 'snowball' as const,
    label: 'Reduce the number of debts — snowball',
  },
  {
    value: 'avalanche' as const,
    label: 'Pay the highest interest — avalanche',
  },
];

export type DebtSnowballAim = (typeof AIM_OPTIONS)[number]['value'];

export const COMPARE_OPTIONS = [
  { value: 'min' as const, label: 'Minimum payment' },
  { value: 'snowball' as const, label: 'Snowball repayment' },
  { value: 'avalanche' as const, label: 'Avalanche repayment' },
];

export interface DebtSnowballRowInput {
  balance: string;
  balanceCurrency: SupportedCurrency;
  interestRatePercent: string;
  payment: string;
  paymentCurrency: SupportedCurrency;
}

export interface DebtSnowballInput {
  debtCount: number;
  debts: DebtSnowballRowInput[];
  aim: DebtSnowballAim;
  compareWith: DebtSnowballMethod;
  paymentIncrease: string;
  paymentIncreaseCurrency: SupportedCurrency;
  totalDebtCurrency: SupportedCurrency;
  totalPaymentCurrency: SupportedCurrency;
}

export interface MethodSummary {
  method: DebtSnowballMethod;
  label: string;
  aprPercent: number | null;
  aprIsWeightedEstimate: boolean;
  monthlyPayment: number;
  payoffMonths: number | null;
  totalPayable: number;
  totalInterest: number;
  ok: boolean;
  message?: string;
}

export interface DebtSnowballResult {
  calcCurrency: SupportedCurrency;
  totalDebt: number;
  totalCurrentMonthlyPayment: number;
  paymentIncrease: number;
  newMonthlyPayment: number;
  totalDebtDisplay: number;
  totalCurrentMonthlyPaymentDisplay: number;
  paymentIncreaseDisplay: number;
  newMonthlyPaymentDisplay: number;
  totalDebtCurrency: SupportedCurrency;
  totalPaymentCurrency: SupportedCurrency;
  paymentIncreaseCurrency: SupportedCurrency;
  formattedTotalDebt: string;
  formattedTotalCurrentMonthlyPayment: string;
  formattedPaymentIncrease: string;
  formattedNewMonthlyPayment: string;
  rows: MethodSummary[];
  aimMethod: DebtSnowballMethod;
  compareWith: DebtSnowballMethod;
}

export type DebtSnowballFieldErrors = {
  form?: string;
  paymentIncrease?: string;
  debts?: Array<{
    balance?: string;
    interestRatePercent?: string;
    payment?: string;
  }>;
};

export function aimToMethod(aim: DebtSnowballAim): DebtSnowballMethod {
  if (aim === 'minimum') return 'min';
  if (aim === 'avalanche') return 'avalanche';
  return 'snowball';
}

export function emptyDebtRow(currency: SupportedCurrency = 'PKR'): DebtSnowballRowInput {
  return {
    balance: '',
    balanceCurrency: currency,
    interestRatePercent: '',
    payment: '',
    paymentCurrency: currency,
  };
}

export function createDefaultInput(): DebtSnowballInput {
  return {
    debtCount: 2,
    debts: [
      {
        balance: '1500',
        balanceCurrency: 'PKR',
        interestRatePercent: '2.5',
        payment: '120',
        paymentCurrency: 'PKR',
      },
      {
        balance: '4000',
        balanceCurrency: 'PKR',
        interestRatePercent: '6.2',
        payment: '150',
        paymentCurrency: 'PKR',
      },
      emptyDebtRow(),
      emptyDebtRow(),
      emptyDebtRow(),
      emptyDebtRow(),
    ],
    aim: 'snowball',
    compareWith: 'min',
    paymentIncrease: '0',
    paymentIncreaseCurrency: 'PKR',
    totalDebtCurrency: 'PKR',
    totalPaymentCurrency: 'PKR',
  };
}
