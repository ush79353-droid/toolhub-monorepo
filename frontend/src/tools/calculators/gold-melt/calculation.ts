import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  GoldMeltInput,
  GoldMeltResult,
  KaratOption,
  PriceUnit,
  WeightUnit,
} from './types';

/** Grams per unit */
export const GRAMS_PER: Record<WeightUnit, number> = {
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

export function convertWeightToGrams(weight: number, unit: WeightUnit): number {
  return weight * GRAMS_PER[unit];
}

/** Karat / 24 × 100 — theoretical purity from karat ratio. */
export function calculateGoldPurityFromKarat(karat: number): number {
  return (karat / 24) * 100;
}

export function convertPriceToPerGram(price: number, unit: PriceUnit): number {
  switch (unit) {
    case 'per-gram':
      return price;
    case 'per-troy-ounce':
      return price / GRAMS_PER.ozt;
    case 'per-kilogram':
      return price / 1000;
  }
}

export function convertPriceFromPerGram(
  pricePerGram: number,
  unit: PriceUnit,
): number {
  switch (unit) {
    case 'per-gram':
      return pricePerGram;
    case 'per-troy-ounce':
      return pricePerGram * GRAMS_PER.ozt;
    case 'per-kilogram':
      return pricePerGram * 1000;
  }
}

export function calculatePureGoldWeight(
  weightInGrams: number,
  purityPercent: number,
): number {
  return weightInGrams * (purityPercent / 100);
}

export function calculateGoldMeltValue(
  pureGoldWeight: number,
  marketPricePerGram: number,
): number {
  return pureGoldWeight * marketPricePerGram;
}

export function calculateBidAskFromSpread(
  spotPrice: number,
  spreadPercent: number,
): { bid: number; ask: number } {
  const factor = spreadPercent / 100;
  return {
    bid: spotPrice * (1 - factor),
    ask: spotPrice * (1 + factor),
  };
}

export interface GoldMeltEngineValues {
  karat: KaratOption;
  purityPercent: number;
  weight: number;
  weightUnit: WeightUnit;
  marketPrice: number;
  marketPriceUnit: PriceUnit;
  spreadPercent: number;
  currency: SupportedCurrency;
  bidPriceOverride: number | null;
  askPriceOverride: number | null;
}

export function calculateGoldMeltPlan(
  values: GoldMeltEngineValues,
): GoldMeltResult | null {
  const {
    karat,
    purityPercent,
    weight,
    weightUnit,
    marketPrice,
    marketPriceUnit,
    spreadPercent,
    currency,
    bidPriceOverride,
    askPriceOverride,
  } = values;

  if (!(weight > 0) || !(purityPercent > 0) || !(purityPercent <= 100)) {
    return null;
  }
  if (!(marketPrice >= 0) || !(spreadPercent >= 0)) return null;

  const weightInGrams = convertWeightToGrams(weight, weightUnit);
  const marketPricePerGram = convertPriceToPerGram(marketPrice, marketPriceUnit);
  const pureGoldWeight = calculatePureGoldWeight(weightInGrams, purityPercent);
  const meltValue = calculateGoldMeltValue(pureGoldWeight, marketPricePerGram);

  const derived = calculateBidAskFromSpread(marketPrice, spreadPercent);
  const bidPricePerUnit =
    bidPriceOverride !== null ? bidPriceOverride : derived.bid;
  const askPricePerUnit =
    askPriceOverride !== null ? askPriceOverride : derived.ask;

  const bidPricePerGram = convertPriceToPerGram(bidPricePerUnit, marketPriceUnit);
  const askPricePerGram = convertPriceToPerGram(askPricePerUnit, marketPriceUnit);
  const bidValue = calculateGoldMeltValue(pureGoldWeight, bidPricePerGram);
  const askValue = calculateGoldMeltValue(pureGoldWeight, askPricePerGram);
  const spreadDifference = meltValue - bidValue;
  const spreadPercentage =
    meltValue > 0 ? (spreadDifference / meltValue) * 100 : 0;

  const symbol = getCurrencySymbol(currency);
  const money = (v: number) =>
    `${symbol}${formatGoldMoney(v, currency)}`;

  const summaryText = `Your ${formatQty(weight)} ${weightUnitLabel(weightUnit)} of ${karatLabel(karat, purityPercent)} gold contain approximately ${formatQty(pureGoldWeight)} grams of pure gold. Based on your selected market price, the estimated melt value is ${money(meltValue)}.`;

  return {
    weightInGrams,
    purityPercentage: purityPercent,
    pureGoldWeight,
    marketPricePerGram,
    meltValue,
    bidPricePerUnit,
    askPricePerUnit,
    bidPricePerGram,
    askPricePerGram,
    bidValue,
    askValue,
    spreadDifference,
    spreadPercentage,
    currency,
    marketPriceUnit,
    weightUnit,
    karat,
    summaryText,
  };
}

function karatLabel(karat: KaratOption, purity: number): string {
  if (karat === 'custom') return `${formatQty(purity)}% purity`;
  return `${karat}K (${formatQty(purity)}%)`;
}

function weightUnitLabel(unit: WeightUnit): string {
  switch (unit) {
    case 'g':
      return 'grams';
    case 'kg':
      return 'kilograms';
    case 'ozt':
      return 'troy ounces';
    case 'oz':
      return 'ounces';
    case 'dwt':
      return 'pennyweights';
    case 'gr':
      return 'grains';
  }
}

function formatQty(n: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(n);
}

export function formatGoldMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(amount));
}

export function shareGoldMeltText(
  result: GoldMeltResult,
  input: GoldMeltInput,
): string {
  const symbol = getCurrencySymbol(result.currency);
  const money = (v: number) => `${symbol}${formatGoldMoney(v, result.currency)}`;
  return [
    'Gold Melt Calculator',
    `Weight: ${input.weight} ${input.weightUnit}`,
    `Karat: ${input.karat}`,
    `Purity: ${formatQty(result.purityPercentage)}%`,
    `Market price: ${money(parseOptionalNumber(input.marketPrice) ?? 0)} (${input.marketPriceUnit})`,
    `Melt value: ${money(result.meltValue)}`,
    `Dealer bid value: ${money(result.bidValue)}`,
    `Dealer ask value: ${money(result.askValue)}`,
    `Spread: ${input.spread}%`,
    result.summaryText,
  ].join('\n');
}

export function isGoldMeltInputBlank(input: GoldMeltInput): boolean {
  return !input.weight.trim() && !input.marketPrice.trim();
}

/** FAQ helper: 1g of 10K at $2000/ozt */
export function meltValueTenKaratOneGramAt2000PerOzt(): number {
  const pricePerGram = 2000 / GRAMS_PER.ozt;
  const purity = 10 / 24;
  return 1 * purity * pricePerGram;
}
