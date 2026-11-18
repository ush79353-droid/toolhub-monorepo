import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CarriedInterestResult, GpCatchUp } from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundPercent(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = roundPercent(value);
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(rounded);
}

/**
 * Fund Return (%) = ((Final − Initial) / Initial) × 100
 */
export function calculateFundReturnPercent(
  initialFundValue: number,
  finalFundValue: number
): number | null {
  if (!Number.isFinite(initialFundValue) || !Number.isFinite(finalFundValue)) return null;
  if (!(initialFundValue > 0) || finalFundValue < 0) return null;
  const pct = ((finalFundValue - initialFundValue) / initialFundValue) * 100;
  return Number.isFinite(pct) ? pct : null;
}

/**
 * Annually compounded hurdle profit:
 * Initial × ((1 + hurdleRate/100)^years − 1)
 */
export function calculateHurdleProfit(
  initialFundValue: number,
  hurdleRatePercent: number,
  holdPeriodYears: number
): number | null {
  if (
    !Number.isFinite(initialFundValue) ||
    !Number.isFinite(hurdleRatePercent) ||
    !Number.isFinite(holdPeriodYears)
  ) {
    return null;
  }
  if (!(initialFundValue > 0) || !(holdPeriodYears > 0) || hurdleRatePercent < 0) {
    return null;
  }
  const growth = Math.pow(1 + hurdleRatePercent / 100, holdPeriodYears);
  if (!Number.isFinite(growth)) return null;
  const hurdle = initialFundValue * (growth - 1);
  return Number.isFinite(hurdle) ? hurdle : null;
}

/**
 * Without catch-up: GP gets carry% of profit above the compounded hurdle only.
 * With full GP catch-up: GP receives 100% of post-hurdle profit until GP has
 * carry% of total profit, then residual splits at the carry rate.
 * (Standard American waterfall; no partial catch-up % in the reference UI.)
 */
export function calculateCarriedInterest(input: {
  initialFundValue: number;
  finalFundValue: number;
  holdPeriodYears: number;
  hurdleRatePercent: number;
  carriedInterestPercent: number;
  gpCatchUp: GpCatchUp;
  currency: SupportedCurrency;
}): CarriedInterestResult | null {
  const {
    initialFundValue,
    finalFundValue,
    holdPeriodYears,
    hurdleRatePercent,
    carriedInterestPercent,
    gpCatchUp,
    currency,
  } = input;

  if (
    ![
      initialFundValue,
      finalFundValue,
      holdPeriodYears,
      hurdleRatePercent,
      carriedInterestPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(initialFundValue > 0)) return null;
  if (finalFundValue < 0) return null;
  if (!(holdPeriodYears > 0)) return null;
  if (hurdleRatePercent < 0) return null;
  if (!(carriedInterestPercent >= 0) || carriedInterestPercent >= 100) return null;

  const fundReturnPercent = calculateFundReturnPercent(initialFundValue, finalFundValue);
  if (fundReturnPercent === null) return null;

  const totalProfit = finalFundValue - initialFundValue;
  if (!Number.isFinite(totalProfit)) return null;

  const hurdleProfit = calculateHurdleProfit(
    initialFundValue,
    hurdleRatePercent,
    holdPeriodYears
  );
  if (hurdleProfit === null) return null;

  const profitAboveHurdle = Math.max(0, totalProfit - hurdleProfit);
  if (!Number.isFinite(profitAboveHurdle)) return null;

  const carryRate = carriedInterestPercent / 100;
  let catchUpAmount = 0;
  let residualCarryAmount = 0;
  let gpCarriedInterestAmount = 0;

  if (profitAboveHurdle <= 0 || carryRate === 0) {
    gpCarriedInterestAmount = 0;
  } else if (gpCatchUp === 'no') {
    residualCarryAmount = profitAboveHurdle * carryRate;
    gpCarriedInterestAmount = residualCarryAmount;
  } else {
    // Full catch-up: C = hurdleProfit × carry / (1 − carry), capped by profit above hurdle.
    const catchUpTarget =
      carryRate >= 1 ? profitAboveHurdle : (hurdleProfit * carryRate) / (1 - carryRate);
    if (!Number.isFinite(catchUpTarget)) return null;
    catchUpAmount = Math.min(profitAboveHurdle, Math.max(0, catchUpTarget));
    const remaining = profitAboveHurdle - catchUpAmount;
    residualCarryAmount = remaining * carryRate;
    gpCarriedInterestAmount = catchUpAmount + residualCarryAmount;
  }

  if (
    ![
      catchUpAmount,
      residualCarryAmount,
      gpCarriedInterestAmount,
    ].every(Number.isFinite) ||
    gpCarriedInterestAmount < 0
  ) {
    return null;
  }

  // Never pay carry on a loss; clamp tiny float noise.
  if (totalProfit <= 0) {
    catchUpAmount = 0;
    residualCarryAmount = 0;
    gpCarriedInterestAmount = 0;
  }

  const roundedProfit = roundMoney(totalProfit);
  const roundedHurdle = roundMoney(hurdleProfit);
  const roundedAbove = roundMoney(profitAboveHurdle);
  const roundedCatchUp = roundMoney(catchUpAmount);
  const roundedResidual = roundMoney(residualCarryAmount);
  const roundedGp = roundMoney(gpCarriedInterestAmount);
  const roundedReturn = roundPercent(fundReturnPercent);

  return {
    fundReturnPercent: roundedReturn,
    totalProfit: roundedProfit,
    hurdleProfit: roundedHurdle,
    profitAboveHurdle: roundedAbove,
    gpCarriedInterestAmount: roundedGp,
    catchUpAmount: roundedCatchUp,
    residualCarryAmount: roundedResidual,
    currency,
    formattedFundReturnPercent: formatPercent(roundedReturn),
    formattedTotalProfit: formatMoney(roundedProfit, currency),
    formattedHurdleProfit: formatMoney(roundedHurdle, currency),
    formattedProfitAboveHurdle: formatMoney(roundedAbove, currency),
    formattedGpCarriedInterestAmount: formatMoney(roundedGp, currency),
  };
}
