import type { SaasLifetimeValueInput, SaasLifetimeValueResult } from './types';

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

export function resolveArpa(input: SaasLifetimeValueInput): number | null {
  if (input.dontKnowArpa) {
    const { recurringRevenue: revenue, numberOfAccounts: accounts } = input;
    if (revenue === null || accounts === null) return null;
    if (!Number.isFinite(revenue) || !Number.isFinite(accounts) || accounts <= 0) {
      return null;
    }
    const arpa = revenue / accounts;
    return Number.isFinite(arpa) ? arpa : null;
  }
  if (input.arpa === null || !Number.isFinite(input.arpa)) return null;
  return input.arpa;
}

/**
 * LTV = ((ARPA + Account Expansion) × Gross Margin Fraction) / Churn Fraction
 * When churn is 0, LTV is omitted (no finite estimate).
 */
export function calculateSaasLifetimeValue(
  input: SaasLifetimeValueInput,
): SaasLifetimeValueResult | null {
  const arpa = resolveArpa(input);
  const {
    grossMarginPercent: margin,
    churnPercent: churn,
    accountExpansion: expansion,
  } = input;

  if (arpa === null || margin === null || churn === null || expansion === null) {
    return null;
  }
  if (
    !Number.isFinite(arpa) ||
    !Number.isFinite(margin) ||
    !Number.isFinite(churn) ||
    !Number.isFinite(expansion)
  ) {
    return null;
  }

  let customerLifetimeValue: number | null = null;
  if (churn > 0) {
    const numerator = (arpa + expansion) * (margin / 100);
    const ltv = numerator / (churn / 100);
    if (Number.isFinite(ltv)) {
      customerLifetimeValue = roundMoney(ltv);
      if (!Number.isFinite(customerLifetimeValue)) customerLifetimeValue = null;
    }
  }

  return {
    arpa: roundMoney(arpa),
    grossMarginPercent: margin,
    churnPercent: churn,
    accountExpansion: expansion,
    customerLifetimeValue,
    currency: input.currency,
    derivedFromRevenue: input.dontKnowArpa,
  };
}
