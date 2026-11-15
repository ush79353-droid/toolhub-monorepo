/**
 * Canonical monetary value for conversion-aware fields (ADR-021).
 * `amount` stays unrounded; round only when formatting for display.
 */

export interface MoneyValue {
  /** Unrounded amount in `currency`. Use NaN for blank. */
  amount: number;
  currency: string;
}

export function createMoneyValue(
  amount: number = Number.NaN,
  currency = 'USD'
): MoneyValue {
  return {
    amount,
    currency: currency.trim().toUpperCase(),
  };
}

export function isBlankMoney(value: MoneyValue): boolean {
  return !Number.isFinite(value.amount);
}

export function parseMoneyInput(raw: string): number {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return Number.NaN;
  if (/infinity|nan/i.test(cleaned)) return Number.NaN;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

/** Display helper — full precision string when finite; empty when blank. */
export function moneyAmountToInputString(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  // Avoid scientific notation for typical money magnitudes.
  return String(amount);
}
