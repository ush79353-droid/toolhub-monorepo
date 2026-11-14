import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { weightParts, type ImpermanentLossResult, type WeightPair } from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundPct(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatQty(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return String(rounded);
}

/**
 * Constant-weight AMM (no fees/rewards):
 * HODL = D × (wA×rA + wB×rB)
 * Pool = D × rA^wA × rB^wB
 * IL% = (Pool/HODL − 1) × 100
 * Net loss vs holding = HODL − Pool
 */
export function calculateImpermanentLoss(params: {
  weights: WeightPair;
  initialDeposit: number;
  initialPriceA: number;
  futurePriceA: number;
  initialPriceB: number;
  futurePriceB: number;
  currency: SupportedCurrency;
}): ImpermanentLossResult | null {
  const {
    weights,
    initialDeposit,
    initialPriceA,
    futurePriceA,
    initialPriceB,
    futurePriceB,
    currency,
  } = params;

  if (
    ![
      initialDeposit,
      initialPriceA,
      futurePriceA,
      initialPriceB,
      futurePriceB,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (
    initialDeposit <= 0 ||
    initialPriceA <= 0 ||
    futurePriceA <= 0 ||
    initialPriceB <= 0 ||
    futurePriceB <= 0
  ) {
    return null;
  }

  const { weightA, weightB } = weightParts(weights);
  if (!Number.isFinite(weightA) || !Number.isFinite(weightB)) return null;
  if (Math.abs(weightA + weightB - 1) > 1e-12) return null;

  const rA = futurePriceA / initialPriceA;
  const rB = futurePriceB / initialPriceB;
  if (!Number.isFinite(rA) || !Number.isFinite(rB) || rA <= 0 || rB <= 0) return null;

  const quantityA = initialDeposit * weightA / initialPriceA;
  const quantityB = initialDeposit * weightB / initialPriceB;
  if (!Number.isFinite(quantityA) || !Number.isFinite(quantityB)) return null;

  const hodlValue = roundMoney(initialDeposit * (weightA * rA + weightB * rB));
  const poolFactor = rA ** weightA * rB ** weightB;
  if (!Number.isFinite(poolFactor) || poolFactor <= 0) return null;
  const poolValue = roundMoney(initialDeposit * poolFactor);
  if (!Number.isFinite(hodlValue) || !Number.isFinite(poolValue) || hodlValue <= 0) {
    return null;
  }

  const impermanentLossPercent = roundPct((poolValue / hodlValue - 1) * 100);
  const netLossVsHolding = roundMoney(hodlValue - poolValue);
  if (!Number.isFinite(impermanentLossPercent) || !Number.isFinite(netLossVsHolding)) {
    return null;
  }

  return {
    weights,
    weightA,
    weightB,
    initialDeposit,
    initialPriceA,
    futurePriceA,
    initialPriceB,
    futurePriceB,
    quantityA,
    quantityB,
    hodlValue,
    poolValue,
    impermanentLossPercent,
    netLossVsHolding,
    currency,
    formattedQuantityA: formatQty(quantityA),
    formattedQuantityB: formatQty(quantityB),
    formattedImpermanentLoss: impermanentLossPercent.toFixed(2),
    formattedHodlValue: formatCurrencyValue(hodlValue, currency),
    formattedPoolValue: formatCurrencyValue(poolValue, currency),
    formattedNetLoss: formatCurrencyValue(netLossVsHolding, currency),
  };
}

export function describeResult(result: ImpermanentLossResult): string {
  return [
    `Impermanent loss: ${result.formattedImpermanentLoss}%`,
    `Value if held (HODL): ${result.formattedHodlValue}`,
    `Value in pool: ${result.formattedPoolValue}`,
    `Net loss vs. holding: ${result.formattedNetLoss}`,
  ].join('\n');
}
