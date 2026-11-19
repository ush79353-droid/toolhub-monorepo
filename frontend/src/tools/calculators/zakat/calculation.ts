import type { SupportedCurrency } from '@/tools/shared/currency';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  GOLD_NISAB_GRAMS,
  METAL_REFERENCE_AS_OF,
  SILVER_NISAB_GRAMS,
  ZAKAT_RATE,
  referenceUsdPerGram,
  type HawlStatus,
  type NisabMethod,
  type ZakatInput,
  type ZakatResult,
} from './types';

export interface ResolvedMetalPrice {
  ok: true;
  pricePerGram: number;
  kind: 'reference' | 'manual';
}

export interface UnresolvedMetalPrice {
  ok: false;
  reason: 'MISSING_RATE' | 'INVALID_PRICE';
}

export function resolveMetalPrice(input: {
  metal: 'gold' | 'silver';
  currency: SupportedCurrency;
  mode: 'reference' | 'manual';
  manualPricePerGram: number;
  rates: Record<string, number>;
}): ResolvedMetalPrice | UnresolvedMetalPrice {
  if (input.mode === 'manual') {
    if (!Number.isFinite(input.manualPricePerGram) || input.manualPricePerGram < 0) {
      return { ok: false, reason: 'INVALID_PRICE' };
    }
    return { ok: true, pricePerGram: input.manualPricePerGram, kind: 'manual' };
  }

  const usd = referenceUsdPerGram(input.metal);
  if (input.currency === 'USD') {
    return { ok: true, pricePerGram: usd, kind: 'reference' };
  }

  const converted = convertCurrency({
    amount: usd,
    from: 'USD',
    to: input.currency,
    rates: input.rates,
  });
  if (!converted.ok) {
    return { ok: false, reason: 'MISSING_RATE' };
  }
  return { ok: true, pricePerGram: converted.amount, kind: 'reference' };
}

export function metalHoldingValue(
  grams: number,
  purityPercent: number,
  pricePerGram: number,
): number {
  return grams * (purityPercent / 100) * pricePerGram;
}

export function nisabThreshold(
  method: NisabMethod,
  goldPricePerGram: number,
  silverPricePerGram: number,
  customNisab: number,
): number {
  if (method === 'gold') return GOLD_NISAB_GRAMS * goldPricePerGram;
  if (method === 'silver') return SILVER_NISAB_GRAMS * silverPricePerGram;
  return customNisab;
}

function hawlSentence(hawl: HawlStatus): string {
  if (hawl === 'yes') {
    return 'You marked the lunar year as complete. Treat the amount as currently payable only if that is true for this wealth.';
  }
  if (hawl === 'no') {
    return 'You marked that one lunar year is not complete. The estimate is still shown. Do not treat it as currently payable until the timing rules for this wealth are met.';
  }
  return 'You are not sure about the lunar year. Confirm Hawl before treating the amount as currently payable.';
}

function methodLabel(method: NisabMethod): string {
  if (method === 'gold') return `gold (${GOLD_NISAB_GRAMS} g)`;
  if (method === 'silver') return `silver (${SILVER_NISAB_GRAMS} g)`;
  return 'a custom threshold';
}

export function calculateZakat(
  input: ZakatInput,
  rates: Record<string, number>,
): ZakatResult | null {
  const gold = resolveMetalPrice({
    metal: 'gold',
    currency: input.currency,
    mode: input.goldPriceMode,
    manualPricePerGram: input.manualGoldPricePerGram,
    rates,
  });
  const silver = resolveMetalPrice({
    metal: 'silver',
    currency: input.currency,
    mode: input.silverPriceMode,
    manualPricePerGram: input.manualSilverPricePerGram,
    rates,
  });
  const goldNeeded = input.nisabMethod === 'gold' || input.goldGrams > 0;
  const silverNeeded = input.nisabMethod === 'silver' || input.silverGrams > 0;
  if ((goldNeeded && !gold.ok) || (silverNeeded && !silver.ok)) return null;

  const goldPrice = gold.ok ? gold.pricePerGram : 0;
  const silverPrice = silver.ok ? silver.pricePerGram : 0;
  const goldValue = metalHoldingValue(input.goldGrams, input.goldPurityPercent, goldPrice);
  const silverValue = metalHoldingValue(input.silverGrams, input.silverPurityPercent, silverPrice);
  const totalAssets =
    input.cashInBank +
    input.cashInHand +
    input.savings +
    input.loansReceivable +
    input.cashForTrade +
    input.investments +
    goldValue +
    silverValue +
    input.stocks +
    input.tradeInventory +
    input.otherAssets;
  const totalLiabilities = input.loansTaken + input.debtsPayable + input.paymentsDue;
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);
  const threshold = nisabThreshold(input.nisabMethod, goldPrice, silverPrice, input.customNisab);
  const meetsNisab = netZakatableWealth >= threshold;
  const zakatPayable = meetsNisab ? netZakatableWealth * ZAKAT_RATE : 0;

  const money = (amount: number) => formatCurrencyValue(amount, input.currency);
  const explanation = meetsNisab
    ? `Your net Zakatable wealth is ${money(netZakatableWealth)}, which meets the selected Nisab of ${money(threshold)} using ${methodLabel(input.nisabMethod)}. At 2.5%, the estimated Zakat is ${money(zakatPayable)}. Amounts are in ${input.currency}. ${hawlSentence(input.hawl)} This is an estimate, not a ruling.`
    : `You have not met the selected Nisab threshold of ${money(threshold)} (${methodLabel(input.nisabMethod)}). Your estimated Zakat obligation is ${money(0)}. Amounts are in ${input.currency}. ${hawlSentence(input.hawl)}`;

  return {
    currency: input.currency,
    nisabMethod: input.nisabMethod,
    goldPricePerGram: goldPrice,
    silverPricePerGram: silverPrice,
    goldPriceKind: gold.ok ? gold.kind : 'reference',
    silverPriceKind: silver.ok ? silver.kind : 'reference',
    goldValue,
    silverValue,
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    nisabThreshold: threshold,
    meetsNisab,
    zakatRate: ZAKAT_RATE,
    zakatPayable,
    hawl: input.hawl,
    explanation,
  };
}

export function shareZakatText(result: ZakatResult): string {
  const money = (amount: number) => formatCurrencyValue(amount, result.currency);
  const method =
    result.nisabMethod === 'gold'
      ? 'Gold'
      : result.nisabMethod === 'silver'
        ? 'Silver'
        : 'Custom';
  return [
    `Zakat estimate (${result.currency})`,
    `Nisab method: ${method}`,
    `Total assets: ${money(result.totalAssets)}`,
    `Liabilities: ${money(result.totalLiabilities)}`,
    `Net Zakatable wealth: ${money(result.netZakatableWealth)}`,
    `Nisab threshold: ${money(result.nisabThreshold)}`,
    `Zakat rate: 2.5%`,
    `Estimated Zakat: ${money(result.zakatPayable)}`,
    `Hawl: ${result.hawl}`,
    `Metal reference date: ${METAL_REFERENCE_AS_OF} (not a live quote).`,
  ].join('\n');
}
