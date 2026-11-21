import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
} from '@/tools/shared/currency';
import {
  faceToMinorUnits,
  getDenominationSet,
  type MoneyCounterCurrency,
} from './denominations';
import type { DenominationLine, MoneyCounterResult } from './types';

export function calculateMoneyTotal(args: {
  currency: MoneyCounterCurrency;
  includeCoins: boolean;
  counts: Record<string, number>;
}): MoneyCounterResult {
  const { currency, includeCoins, counts } = args;
  const set = getDenominationSet(currency);
  const denoms = includeCoins
    ? [...set.notes, ...set.coins]
    : [...set.notes];
  const scale = 10 ** getCurrencyFractionDigits(currency);

  const lines: DenominationLine[] = [];
  let totalMinor = 0;
  let pieceCount = 0;

  for (const d of denoms) {
    const count = counts[d.id] ?? 0;
    if (!Number.isFinite(count) || count < 0 || !Number.isInteger(count)) {
      throw new Error(`Invalid count for ${d.label}.`);
    }
    const minor = faceToMinorUnits(d.faceValue, currency);
    const lineMinor = count * minor;
    if (!Number.isFinite(lineMinor)) {
      throw new Error('Line total is not finite.');
    }
    totalMinor += lineMinor;
    pieceCount += count;
    lines.push({
      id: d.id,
      kind: d.kind,
      label: d.label,
      faceValue: d.faceValue,
      count,
      lineTotal: lineMinor / scale,
    });
  }

  if (!Number.isFinite(totalMinor) || totalMinor < 0) {
    throw new Error('Total is not a valid amount.');
  }

  const total = totalMinor / scale;
  const formattedTotal = formatCurrencyValue(total, currency);

  const active = lines.filter((l) => l.count > 0);
  const explanation =
    active.length === 0
      ? `No pieces entered. Total is ${formattedTotal}.`
      : `Total ${formattedTotal} from ${pieceCount} piece(s): ${active
          .map((l) => `${l.count}×${l.label}`)
          .join(' + ')}.`;

  return {
    currency,
    includeCoins,
    lines,
    totalMinor,
    total,
    pieceCount,
    formattedTotal,
    explanation,
  };
}

/** Candy worked example from Omni: 10×$10 + 20×$50 + 15×$100 + 20×$1 + 40×$0.50 = $2640 */
export function candyExampleTotalUsd(): number {
  return 10 * 10 + 20 * 50 + 15 * 100 + 20 * 1 + 40 * 0.5;
}
