import type { SupportedCurrency } from '@/tools/shared/currency';

export const DEBT_COUNT_OPTIONS = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
  { value: 4, label: 'Four' },
  { value: 5, label: 'Five' },
  { value: 6, label: 'Six' },
  { value: 7, label: 'Seven' },
  { value: 8, label: 'Eight' },
  { value: 9, label: 'Nine' },
  { value: 10, label: 'Ten' },
] as const;

export type DebtCount = (typeof DEBT_COUNT_OPTIONS)[number]['value'];

export interface DebtInputRow {
  balance: string;
  balanceCurrency: SupportedCurrency;
  interestRatePercent: string;
  payment: string;
  paymentCurrency: SupportedCurrency;
}

export interface DebtAvalancheInput {
  debtCount: DebtCount;
  debts: DebtInputRow[];
  resultCurrency: SupportedCurrency;
}

export interface ScenarioSummary {
  aprPercent: number;
  formattedApr: string;
  /** Null means “varied” (baseline independent payments). */
  monthlyPayment: number | null;
  formattedMonthlyPayment: string;
  payoffMonths: number;
  formattedPayoffTerm: string;
  totalPayable: number;
  formattedTotalPayable: string;
  totalInterest: number;
  formattedTotalInterest: string;
}

export interface DebtAvalancheResult {
  currency: SupportedCurrency;
  totalDebt: number;
  formattedTotalDebt: string;
  interestSavings: number;
  formattedInterestSavings: string;
  monthsSaved: number;
  baseline: ScenarioSummary;
  avalanche: ScenarioSummary;
}

export type DebtAvalancheFieldErrors = {
  debts?: Array<{
    balance?: string;
    interestRatePercent?: string;
    payment?: string;
  }>;
  form?: string;
};

export function createDefaultDebtRow(index: number): DebtInputRow {
  if (index === 0) {
    return {
      balance: '1000',
      balanceCurrency: 'PKR',
      interestRatePercent: '6',
      payment: '100',
      paymentCurrency: 'PKR',
    };
  }
  if (index === 1) {
    return {
      balance: '5000',
      balanceCurrency: 'PKR',
      interestRatePercent: '12',
      payment: '200',
      paymentCurrency: 'PKR',
    };
  }
  return {
    balance: '0',
    balanceCurrency: 'PKR',
    interestRatePercent: '0',
    payment: '0',
    paymentCurrency: 'PKR',
  };
}

export function createDefaultInput(): DebtAvalancheInput {
  return {
    debtCount: 2,
    debts: [createDefaultDebtRow(0), createDefaultDebtRow(1)],
    resultCurrency: 'PKR',
  };
}

export function ensureDebtRows(
  debts: DebtInputRow[],
  count: DebtCount
): DebtInputRow[] {
  const next = debts.slice(0, count);
  while (next.length < count) {
    next.push(createDefaultDebtRow(next.length));
  }
  return next;
}
