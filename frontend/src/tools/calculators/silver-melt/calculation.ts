import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  OtherMetalType,
  SilverMeltPurityPreset,
  SilverMeltResult,
  SilverMeltWeightUnit,
} from './types';

export const GRAMS_PER: Record<SilverMeltWeightUnit, number> = {
  g: 1,
  kg: 1000,
  ozt: 31.1034768,
  oz: 28.349523125,
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
  unit: SilverMeltWeightUnit,
): number {
  return weight * GRAMS_PER[unit];
}

export function convertGramsToUnit(
  grams: number,
  unit: SilverMeltWeightUnit,
): number {
  return grams / GRAMS_PER[unit];
}

export function convertPriceToPerGram(
  price: number,
  unit: SilverMeltWeightUnit,
): number {
  return price / GRAMS_PER[unit];
}

export function calculatePureSilverMassGrams(
  weightInGrams: number,
  purityPercent: number,
): number {
  return weightInGrams * (purityPercent / 100);
}

export function calculateSilverMeltValue(
  pureSilverGrams: number,
  pricePerGram: number,
): number {
  return pureSilverGrams * pricePerGram;
}

export function calculateOtherMetalValue(
  otherMetalGrams: number,
  pricePerGram: number,
): number {
  return otherMetalGrams * pricePerGram;
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

export function weightUnitLabel(unit: SilverMeltWeightUnit): string {
  switch (unit) {
    case 'g':
      return 'g';
    case 'kg':
      return 'kg';
    case 'ozt':
      return 'oz t';
    case 'oz':
      return 'oz';
    case 'dwt':
      return 'dwt';
    case 'gr':
      return 'gr';
  }
}

export function otherMetalDisplayName(
  type: OtherMetalType,
  customLabel: string,
): string {
  if (type === 'copper') return 'Copper';
  if (type === 'custom' && customLabel.trim()) return customLabel.trim();
  return 'Other metal';
}

export function calculateSilverMeltResults(input: {
  weight: number;
  weightUnit: SilverMeltWeightUnit;
  purityPreset: SilverMeltPurityPreset;
  purityPercent: number;
  pureSilverUnit: SilverMeltWeightUnit;
  pricePerUnit: number;
  priceUnit: SilverMeltWeightUnit;
  currency: SupportedCurrency;
  alloyOpen: boolean;
  otherMetalType: OtherMetalType;
  otherMetalLabel: string;
  deriveOtherFromRemainder: boolean;
  otherMetalWeight: number | null;
  otherMetalWeightUnit: SilverMeltWeightUnit;
  otherMetalPrice: number | null;
  otherMetalPriceUnit: SilverMeltWeightUnit;
}): SilverMeltResult | null {
  const {
    weight,
    weightUnit,
    purityPreset,
    purityPercent,
    pureSilverUnit,
    pricePerUnit,
    priceUnit,
    currency,
    alloyOpen,
    otherMetalType,
    otherMetalLabel,
    deriveOtherFromRemainder,
    otherMetalWeight,
    otherMetalWeightUnit,
    otherMetalPrice,
    otherMetalPriceUnit,
  } = input;

  if (!(weight >= 0) || !(pricePerUnit >= 0)) return null;
  if (!(purityPercent > 0) || purityPercent > 100) return null;

  const weightInGrams = convertWeightToGrams(weight, weightUnit);
  const purityFraction = purityPercent / 100;
  const pureSilverWeightInGrams = calculatePureSilverMassGrams(
    weightInGrams,
    purityPercent,
  );
  const pureSilverWeight = convertGramsToUnit(
    pureSilverWeightInGrams,
    pureSilverUnit,
  );
  const pricePerGram = convertPriceToPerGram(pricePerUnit, priceUnit);
  const silverMeltValue = roundMoney(
    calculateSilverMeltValue(pureSilverWeightInGrams, pricePerGram),
    currency,
  );

  let otherMetalWeightInGrams: number | null = null;
  let otherMetalWeightDisplay: number | null = null;
  let otherMetalValue: number | null = null;
  let combinedAlloyValue: number | null = null;

  if (alloyOpen) {
    if (deriveOtherFromRemainder) {
      otherMetalWeightInGrams = Math.max(
        0,
        weightInGrams - pureSilverWeightInGrams,
      );
    } else if (otherMetalWeight !== null && otherMetalWeight >= 0) {
      otherMetalWeightInGrams = convertWeightToGrams(
        otherMetalWeight,
        otherMetalWeightUnit,
      );
    }

    if (
      otherMetalWeightInGrams !== null &&
      otherMetalPrice !== null &&
      otherMetalPrice >= 0
    ) {
      otherMetalWeightDisplay = convertGramsToUnit(
        otherMetalWeightInGrams,
        otherMetalWeightUnit,
      );
      const otherPricePerGram = convertPriceToPerGram(
        otherMetalPrice,
        otherMetalPriceUnit,
      );
      otherMetalValue = roundMoney(
        calculateOtherMetalValue(otherMetalWeightInGrams, otherPricePerGram),
        currency,
      );
      combinedAlloyValue = roundMoney(
        silverMeltValue + otherMetalValue,
        currency,
      );
    }
  }

  const summaryText = `${formatQty(weight)} ${weightUnitLabel(weightUnit)} at ${formatQty(purityPercent)}% contains about ${formatQty(pureSilverWeight)} ${weightUnitLabel(pureSilverUnit)} of pure silver, melt value ${formatMoney(silverMeltValue, currency)}.`;

  return {
    weight,
    weightUnit,
    weightInGrams,
    purityPreset,
    purityPercent,
    purityFraction,
    pureSilverWeightInGrams,
    pureSilverWeight,
    pureSilverUnit,
    pricePerUnit,
    priceUnit,
    pricePerGram,
    silverMeltValue,
    alloyOpen,
    otherMetalType,
    otherMetalLabel: otherMetalDisplayName(otherMetalType, otherMetalLabel),
    otherMetalWeightInGrams,
    otherMetalWeight: otherMetalWeightDisplay,
    otherMetalWeightUnit,
    otherMetalPrice,
    otherMetalPriceUnit,
    otherMetalValue,
    combinedAlloyValue,
    currency,
    summaryText,
  };
}

export function shareSilverMeltText(result: SilverMeltResult): string {
  const lines = [
    'Silver Melt Calculator | Omega Calculators',
    `Weight: ${formatQty(result.weight)} ${weightUnitLabel(result.weightUnit)}`,
    `Purity: ${formatQty(result.purityPercent)}%`,
    `Pure silver: ${formatQty(result.pureSilverWeight)} ${weightUnitLabel(result.pureSilverUnit)}`,
    `Price: ${formatMoney(result.pricePerUnit, result.currency)} / ${weightUnitLabel(result.priceUnit)}`,
    `Silver melt value: ${formatMoney(result.silverMeltValue, result.currency)}`,
  ];
  if (
    result.alloyOpen &&
    result.otherMetalValue !== null &&
    result.combinedAlloyValue !== null
  ) {
    lines.push(
      `${result.otherMetalLabel} value: ${formatMoney(result.otherMetalValue, result.currency)}`,
      `Combined alloy value: ${formatMoney(result.combinedAlloyValue, result.currency)}`,
    );
  }
  lines.push(result.summaryText);
  return lines.join('\n');
}

/** Guide example: 225g · 92.5% · $0.90/g → $187.3125 / $187.31. */
export function sterlingMeltExample(): {
  pureGrams: number;
  rawValue: number;
  roundedUsd: number;
} {
  const pureGrams = calculatePureSilverMassGrams(225, 92.5);
  const rawValue = calculateSilverMeltValue(pureGrams, 0.9);
  return {
    pureGrams,
    rawValue,
    roundedUsd: roundMoney(rawValue, 'USD'),
  };
}

/** Pre-1965 US silver quarter approx. */
export function silverQuarterPureGrams(): number {
  return calculatePureSilverMassGrams(6.25, 90);
}
