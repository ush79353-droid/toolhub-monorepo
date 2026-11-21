import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  BillingFrequency,
  CategoryBreakdownRow,
  SubscriptionCategoryId,
  SubscriptionEntry,
  SubscriptionLineResult,
  SubscriptionWasteInput,
  SubscriptionWasteResult,
} from './types';
import {
  SUBSCRIPTION_CATEGORIES,
  categoryLabel,
  resolveDisplayName,
} from './types';

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/** Normalize billed amount to a monthly equivalent. */
export function toMonthlyEquivalent(
  amount: number,
  frequency: BillingFrequency,
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  switch (frequency) {
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    case 'weekly':
      return (amount * 52) / 12;
    case 'quarterly':
      return amount / 3;
    default:
      return null;
  }
}

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function isEntryComplete(entry: SubscriptionEntry): boolean {
  const amount = parseOptionalNumber(entry.amount);
  if (amount === null || amount < 0) return false;
  const name =
    entry.serviceKey === 'Other' || entry.serviceKey === ''
      ? entry.customName.trim()
      : entry.serviceKey.trim();
  return name.length > 0;
}

export function calculateSubscriptionWasteResult(
  input: SubscriptionWasteInput,
): SubscriptionWasteResult {
  const lines: SubscriptionLineResult[] = [];
  const categoryTotals = new Map<SubscriptionCategoryId, number>();

  for (const cat of SUBSCRIPTION_CATEGORIES) {
    categoryTotals.set(cat.id, 0);
    for (const entry of input.entries[cat.id]) {
      if (!isEntryComplete(entry)) continue;
      const amount = parseOptionalNumber(entry.amount)!;
      const monthly = toMonthlyEquivalent(amount, entry.billingFrequency);
      if (monthly === null) continue;
      const monthlyRounded = roundMoney(monthly, input.currency);
      lines.push({
        id: entry.id,
        categoryId: cat.id,
        displayName: resolveDisplayName(entry),
        amount,
        billingFrequency: entry.billingFrequency,
        monthlyEquivalent: monthlyRounded,
        selectedForCancellation: entry.selectedForCancellation,
      });
      categoryTotals.set(
        cat.id,
        (categoryTotals.get(cat.id) ?? 0) + monthlyRounded,
      );
    }
  }

  const categoryBreakdown: CategoryBreakdownRow[] = SUBSCRIPTION_CATEGORIES.map(
    (cat) => {
      const monthlyTotal = roundMoney(
        categoryTotals.get(cat.id) ?? 0,
        input.currency,
      );
      return {
        categoryId: cat.id,
        label: cat.label,
        monthlyTotal,
        annualTotal: roundMoney(monthlyTotal * 12, input.currency),
        activeCount: lines.filter((l) => l.categoryId === cat.id).length,
      };
    },
  );

  const totalMonthlySpending = roundMoney(
    categoryBreakdown.reduce((sum, row) => sum + row.monthlyTotal, 0),
    input.currency,
  );
  const totalAnnualSpending = roundMoney(
    totalMonthlySpending * 12,
    input.currency,
  );

  const potentialMonthlySavings = roundMoney(
    lines
      .filter((l) => l.selectedForCancellation)
      .reduce((sum, l) => sum + l.monthlyEquivalent, 0),
    input.currency,
  );
  const potentialAnnualSavings = roundMoney(
    potentialMonthlySavings * 12,
    input.currency,
  );

  return {
    lines,
    categoryBreakdown,
    totalMonthlySpending,
    totalAnnualSpending,
    potentialMonthlySavings,
    potentialAnnualSavings,
    currency: input.currency,
  };
}

export function shareSubscriptionWasteText(
  result: SubscriptionWasteResult,
): string {
  const lines = [
    'Subscription Waste Calculator | Omega Calculators',
    `Total monthly: ${formatMoney(result.totalMonthlySpending, result.currency)}`,
    `Total annual: ${formatMoney(result.totalAnnualSpending, result.currency)}`,
    `Potential monthly savings: ${formatMoney(result.potentialMonthlySavings, result.currency)}`,
    `Potential annual savings: ${formatMoney(result.potentialAnnualSavings, result.currency)}`,
    '',
    'Subscriptions:',
  ];
  for (const line of result.lines) {
    lines.push(
      `- [${categoryLabel(line.categoryId)}] ${line.displayName}: ${formatMoney(line.amount, result.currency)} ${line.billingFrequency} (≈ ${formatMoney(line.monthlyEquivalent, result.currency)}/mo)${line.selectedForCancellation ? ' [cancel]' : ''}`,
    );
  }
  return lines.join('\n');
}
