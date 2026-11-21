import type { MoneyCounterCurrency } from './denominations';
import { getDenominationSet } from './denominations';

export interface MoneyCounterInput {
  currency: MoneyCounterCurrency;
  includeCoins: boolean;
  /** Denomination id → count string */
  counts: Record<string, string>;
}

export interface DenominationLine {
  id: string;
  kind: 'note' | 'coin';
  label: string;
  faceValue: number;
  count: number;
  lineTotal: number;
}

export interface MoneyCounterResult {
  currency: MoneyCounterCurrency;
  includeCoins: boolean;
  lines: DenominationLine[];
  totalMinor: number;
  total: number;
  pieceCount: number;
  formattedTotal: string;
  explanation: string;
}

export type MoneyCounterFieldErrors = {
  form?: string;
  currency?: string;
  counts?: string;
  [denomId: string]: string | undefined;
};

function emptyCounts(currency: MoneyCounterCurrency): Record<string, string> {
  const set = getDenominationSet(currency);
  const counts: Record<string, string> = {};
  for (const d of [...set.notes, ...set.coins]) {
    counts[d.id] = '0';
  }
  return counts;
}

export function createDefaultInput(): MoneyCounterInput {
  return {
    currency: 'USD',
    includeCoins: false,
    counts: emptyCounts('USD'),
  };
}

export function createEmptyInput(
  currency: MoneyCounterCurrency = 'USD'
): MoneyCounterInput {
  const counts = emptyCounts(currency);
  for (const key of Object.keys(counts)) {
    counts[key] = '';
  }
  return {
    currency,
    includeCoins: false,
    counts,
  };
}

/** Remap counts when currency changes; keep overlapping ids if any, else reset to 0. */
export function remapCountsForCurrency(
  prev: Record<string, string>,
  currency: MoneyCounterCurrency
): Record<string, string> {
  const next = emptyCounts(currency);
  for (const id of Object.keys(next)) {
    if (prev[id] != null && prev[id] !== '') {
      next[id] = prev[id]!;
    }
  }
  return next;
}
