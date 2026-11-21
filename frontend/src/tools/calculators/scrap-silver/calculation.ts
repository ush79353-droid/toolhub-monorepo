import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  ScrapSilverResult,
  ScrapSilverWeightUnit,
  SilverPurityPreset,
} from './types';

/** Grams per unit (troy ounce for precious metals). */
export const GRAMS_PER: Record<ScrapSilverWeightUnit, number> = {
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
  unit: ScrapSilverWeightUnit,
): number {
  return weight * GRAMS_PER[unit];
}

export function convertGramsToUnit(
  grams: number,
  unit: ScrapSilverWeightUnit,
): number {
  return grams / GRAMS_PER[unit];
}

export function convertPriceToPerGram(
  price: number,
  unit: ScrapSilverWeightUnit,
): number {
  return price / GRAMS_PER[unit];
}

export function calculatePureSilverWeightGrams(
  weightInGrams: number,
  purityPercent: number,
): number {
  return weightInGrams * (purityPercent / 100);
}

export function calculateSilverValue(
  pureSilverWeightInGrams: number,
  pricePerGram: number,
): number {
  return pureSilverWeightInGrams * pricePerGram;
}

export function calculateDealerDiscountAmount(
  silverValue: number,
  discountPercent: number,
): number {
  return silverValue * (discountPercent / 100);
}

export function calculateEstimatedSellingValue(
  silverValue: number,
  dealerDiscountAmount: number,
  refiningFee: number,
  transactionFee: number,
): number {
  return silverValue - dealerDiscountAmount - refiningFee - transactionFee;
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

export function weightUnitLabel(unit: ScrapSilverWeightUnit): string {
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

export function calculateScrapSilverResults(input: {
  weight: number;
  weightUnit: ScrapSilverWeightUnit;
  purityPreset: SilverPurityPreset;
  purityPercent: number;
  pureSilverUnit: ScrapSilverWeightUnit;
  pricePerUnit: number;
  priceUnit: ScrapSilverWeightUnit;
  dealerDiscountPercent: number;
  refiningFee: number;
  transactionFee: number;
  currency: SupportedCurrency;
}): ScrapSilverResult | null {
  const {
    weight,
    weightUnit,
    purityPreset,
    purityPercent,
    pureSilverUnit,
    pricePerUnit,
    priceUnit,
    dealerDiscountPercent,
    refiningFee,
    transactionFee,
    currency,
  } = input;

  if (!(weight >= 0) || !(pricePerUnit >= 0)) return null;
  if (!(purityPercent > 0) || purityPercent > 100) return null;
  if (!(dealerDiscountPercent >= 0) || dealerDiscountPercent > 100) return null;
  if (!(refiningFee >= 0) || !(transactionFee >= 0)) return null;

  const weightInGrams = convertWeightToGrams(weight, weightUnit);
  const purityFraction = purityPercent / 100;
  const pureSilverWeightInGrams = calculatePureSilverWeightGrams(
    weightInGrams,
    purityPercent,
  );
  const pureSilverWeight = convertGramsToUnit(
    pureSilverWeightInGrams,
    pureSilverUnit,
  );
  const pricePerGram = convertPriceToPerGram(pricePerUnit, priceUnit);
  const silverValueRaw = calculateSilverValue(
    pureSilverWeightInGrams,
    pricePerGram,
  );
  const silverValue = roundMoney(silverValueRaw, currency);
  const dealerDiscountAmount = roundMoney(
    calculateDealerDiscountAmount(silverValue, dealerDiscountPercent),
    currency,
  );
  const refiningRounded = roundMoney(refiningFee, currency);
  const transactionRounded = roundMoney(transactionFee, currency);
  const totalFees = roundMoney(
    dealerDiscountAmount + refiningRounded + transactionRounded,
    currency,
  );
  const estimatedSellingValue = roundMoney(
    calculateEstimatedSellingValue(
      silverValue,
      dealerDiscountAmount,
      refiningRounded,
      transactionRounded,
    ),
    currency,
  );

  const summaryText = `${formatQty(weight)} ${weightUnitLabel(weightUnit)} of ${formatQty(purityPercent)}% silver contains about ${formatQty(pureSilverWeight)} ${weightUnitLabel(pureSilverUnit)} of pure silver, melt value ${formatMoney(silverValue, currency)}.`;

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
    silverValue,
    dealerDiscountPercent,
    dealerDiscountAmount,
    refiningFee: refiningRounded,
    transactionFee: transactionRounded,
    totalFees,
    estimatedSellingValue,
    currency,
    summaryText,
  };
}

export function shareScrapSilverText(result: ScrapSilverResult): string {
  return [
    'Scrap Silver Calculator | Omega Calculators',
    `Scrap weight: ${formatQty(result.weight)} ${weightUnitLabel(result.weightUnit)}`,
    `Purity: ${formatQty(result.purityPercent)}% (fineness ${formatQty(result.purityFraction, 4)})`,
    `Pure silver: ${formatQty(result.pureSilverWeight)} ${weightUnitLabel(result.pureSilverUnit)}`,
    `Price: ${formatMoney(result.pricePerUnit, result.currency)} / ${weightUnitLabel(result.priceUnit)}`,
    `Melt value: ${formatMoney(result.silverValue, result.currency)}`,
    `Estimated selling value: ${formatMoney(result.estimatedSellingValue, result.currency)}`,
    result.summaryText,
  ].join('\n');
}

/** Guide example: 100g · .925 · $0.85/g → $78.625 raw / $78.63 USD. */
export function sterlingExampleValue(): {
  pureGrams: number;
  rawValue: number;
  roundedUsd: number;
} {
  const pureGrams = calculatePureSilverWeightGrams(100, 92.5);
  const rawValue = calculateSilverValue(pureGrams, 0.85);
  return {
    pureGrams,
    rawValue,
    roundedUsd: roundMoney(rawValue, 'USD'),
  };
}
