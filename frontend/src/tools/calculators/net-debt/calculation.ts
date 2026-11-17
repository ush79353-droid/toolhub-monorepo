import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatNetDebtMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Cash total = cash + cash equivalents
 * Short-term = sum of ST items
 * Long-term = sum of LT items
 * Net debt = ST + LT − cash total (may be negative)
 * Full precision — round only for display.
 */
export function calculateNetDebt(input: {
  cash: number;
  cashEquivalents: number;
  accountsPayable: number;
  currentLongTermDebt: number;
  currentLeases: number;
  otherShortTerm: number;
  nonCurrentLongTermDebt: number;
  nonCurrentLeases: number;
  otherLongTerm: number;
}): {
  cashTotal: number;
  shortTermDebt: number;
  longTermDebt: number;
  netDebt: number;
} | null {
  const values = [
    input.cash,
    input.cashEquivalents,
    input.accountsPayable,
    input.currentLongTermDebt,
    input.currentLeases,
    input.otherShortTerm,
    input.nonCurrentLongTermDebt,
    input.nonCurrentLeases,
    input.otherLongTerm,
  ];
  if (!values.every(Number.isFinite)) return null;
  if (values.some((v) => v < 0)) return null;

  const cashTotal = input.cash + input.cashEquivalents;
  const shortTermDebt =
    input.accountsPayable +
    input.currentLongTermDebt +
    input.currentLeases +
    input.otherShortTerm;
  const longTermDebt =
    input.nonCurrentLongTermDebt +
    input.nonCurrentLeases +
    input.otherLongTerm;
  const netDebt = shortTermDebt + longTermDebt - cashTotal;

  if (![cashTotal, shortTermDebt, longTermDebt, netDebt].every(Number.isFinite)) {
    return null;
  }

  return { cashTotal, shortTermDebt, longTermDebt, netDebt };
}
