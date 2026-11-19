import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { ScrapGoldResult, ScrapGoldWeightUnit } from './types';

/** Grams per unit (troy ounce for precious metals). */
export const GRAMS_PER: Record<ScrapGoldWeightUnit, number> = {
  g: 1,
  kg: 1000,
  ozt: 31.1034768,
  dwt: 1.55517384,
  gr: 0.06479891,
};

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function convertWeightToGrams(
  weight: number,
  unit: ScrapGoldWeightUnit,
): number {
  return weight * GRAMS_PER[unit];
}

export function convertGramsToUnit(
  grams: number,
  unit: ScrapGoldWeightUnit,
): number {
  return grams / GRAMS_PER[unit];
}

export function karatToPurityPercent(karat: number): number {
  return (karat / 24) * 100;
}

export function purityPercentToKarat(purityPercent: number): number {
  return (purityPercent / 100) * 24;
}

export function calculatePureGoldWeightGrams(
  weightInGrams: number,
  purityPercent: number,
): number {
  return weightInGrams * (purityPercent / 100);
}

export function convertPriceToPerGram(
  price: number,
  unit: ScrapGoldWeightUnit,
): number {
  return price / GRAMS_PER[unit];
}

export function calculateScrapGoldValue(
  pureGoldWeightInGrams: number,
  pricePerGram: number,
): number {
  return pureGoldWeightInGrams * pricePerGram;
}

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function formatQty(n: number, maxDigits = 6): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDigits,
  }).format(n);
}

export function weightUnitLabel(unit: ScrapGoldWeightUnit): string {
  switch (unit) {
    case 'g':
      return 'g';
    case 'kg':
      return 'kg';
    case 'ozt':
      return 'oz t';
    case 'dwt':
      return 'dwt';
    case 'gr':
      return 'gr';
  }
}

export function calculateScrapGoldResults(input: {
  weight: number;
  weightUnit: ScrapGoldWeightUnit;
  karat: number;
  purityPercent: number;
  pureGoldUnit: ScrapGoldWeightUnit;
  pricePerUnit: number;
  priceUnit: ScrapGoldWeightUnit;
  currency: SupportedCurrency;
}): ScrapGoldResult | null {
  const {
    weight,
    weightUnit,
    karat,
    purityPercent,
    pureGoldUnit,
    pricePerUnit,
    priceUnit,
    currency,
  } = input;

  if (!(weight >= 0) || !(pricePerUnit >= 0)) return null;
  if (!(karat >= 0) || karat > 24) return null;
  if (!(purityPercent >= 0) || purityPercent > 100) return null;

  const weightInGrams = convertWeightToGrams(weight, weightUnit);
  const pureGoldWeightInGrams = calculatePureGoldWeightGrams(
    weightInGrams,
    purityPercent,
  );
  const pureGoldWeight = convertGramsToUnit(pureGoldWeightInGrams, pureGoldUnit);
  const pricePerGram = convertPriceToPerGram(pricePerUnit, priceUnit);
  const totalValueRaw = calculateScrapGoldValue(
    pureGoldWeightInGrams,
    pricePerGram,
  );
  const totalValue = roundMoney(totalValueRaw, currency);

  const summaryText = `${formatQty(weight)} ${weightUnitLabel(weightUnit)} of ${formatQty(karat)}K (${formatQty(purityPercent)}%) scrap contains about ${formatQty(pureGoldWeight)} ${weightUnitLabel(pureGoldUnit)} of pure gold, valued at ${formatMoney(totalValue, currency)}.`;

  return {
    weight,
    weightUnit,
    weightInGrams,
    karat,
    purityPercent,
    pureGoldWeightInGrams,
    pureGoldWeight,
    pureGoldUnit,
    pricePerUnit,
    priceUnit,
    pricePerGram,
    totalValue,
    currency,
    summaryText,
  };
}

export function shareScrapGoldText(result: ScrapGoldResult): string {
  return [
    'Scrap Gold Calculator — Omega Calculators',
    `Scrap weight: ${formatQty(result.weight)} ${weightUnitLabel(result.weightUnit)}`,
    `Karat: ${formatQty(result.karat)}K`,
    `Purity: ${formatQty(result.purityPercent)}%`,
    `Pure gold: ${formatQty(result.pureGoldWeight)} ${weightUnitLabel(result.pureGoldUnit)}`,
    `Price: ${formatMoney(result.pricePerUnit, result.currency)} / ${weightUnitLabel(result.priceUnit)}`,
    `Total value: ${formatMoney(result.totalValue, result.currency)}`,
    result.summaryText,
  ].join('\n');
}

/** Educational mixed-batch example from the guide. */
export function mixedKaratExampleValue(): {
  pure18: number;
  pure9: number;
  totalPure: number;
  value: number;
} {
  const pure18 = calculatePureGoldWeightGrams(120, karatToPurityPercent(18));
  const pure9 = calculatePureGoldWeightGrams(350, karatToPurityPercent(9));
  const totalPure = pure18 + pure9;
  return {
    pure18,
    pure9,
    totalPure,
    value: calculateScrapGoldValue(totalPure, 39),
  };
}
