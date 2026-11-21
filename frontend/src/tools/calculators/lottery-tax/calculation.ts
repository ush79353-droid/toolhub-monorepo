/**
 * Lottery tax comparison: lump sum vs nominal growing annuity.
 *
 * Advertised annuity A is the sum of nominal annual payments (not a PV).
 * With growth g over n years: first = A × g / ((1+g)^n − 1) when g ≠ 0;
 * equal payments A/n when g = 0. Payment(y) = first × (1+g)^(y−1).
 *
 * US mode Tax I uses IRC §3402(q) 24% federal withholding on lottery proceeds
 * (withholding — not final federal tax liability). Tax II stays 0 (no invented state rate).
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  LotteryTaxColumn,
  LotteryTaxMode,
  LotteryTaxResult,
  LotteryTaxScheduleRow,
} from './types';

/** IRC §3402(q) federal withholding rate for certain gambling/lottery winnings. */
export const US_FEDERAL_WITHHOLDING_RATE = 24;

export function formatLotteryTaxMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function lumpSumFromAnnuity(
  annuityAmount: number,
  percent: number
): number | null {
  if (![annuityAmount, percent].every(Number.isFinite)) return null;
  if (annuityAmount < 0 || percent < 0 || percent > 100) return null;
  return annuityAmount * (percent / 100);
}

export function firstNominalAnnuityPayment(
  totalAnnuity: number,
  years: number,
  growthRate: number
): number | null {
  if (![totalAnnuity, years, growthRate].every(Number.isFinite)) return null;
  if (totalAnnuity < 0 || !(years > 0) || !Number.isInteger(years)) return null;
  if (growthRate <= -1) return null;
  if (Math.abs(growthRate) < 1e-15) return totalAnnuity / years;
  const denom = Math.pow(1 + growthRate, years) - 1;
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const first = (totalAnnuity * growthRate) / denom;
  return Number.isFinite(first) && first >= 0 ? first : null;
}

export function applyIndependentTaxes(
  gross: number,
  rateI: number,
  rateII: number
): { taxI: number; taxII: number; net: number } | null {
  if (![gross, rateI, rateII].every(Number.isFinite)) return null;
  if (gross < 0 || rateI < 0 || rateII < 0) return null;
  const taxI = gross * (rateI / 100);
  const taxII = gross * (rateII / 100);
  const net = gross - taxI - taxII;
  if (![taxI, taxII, net].every(Number.isFinite)) return null;
  return { taxI, taxII, net };
}

function column(
  payout: number,
  taxI: number,
  taxII: number,
  net: number,
  currency: SupportedCurrency
): LotteryTaxColumn {
  return {
    payout,
    taxI,
    taxII,
    net,
    formattedPayout: formatLotteryTaxMoney(payout, currency),
    formattedTaxI: formatLotteryTaxMoney(taxI, currency),
    formattedTaxII: formatLotteryTaxMoney(taxII, currency),
    formattedNet: formatLotteryTaxMoney(net, currency),
  };
}

export interface LotteryTaxNumericInput {
  annuityAmount: number;
  lumpSumPercent: number;
  taxMode: LotteryTaxMode;
  taxRateI: number;
  taxRateII: number;
  years: number;
  growthPercent: number;
  calcCurrency: SupportedCurrency;
  lumpSumCurrency: SupportedCurrency;
  annuityCurrency: SupportedCurrency;
}

export function calculateLotteryTax(
  input: LotteryTaxNumericInput
): LotteryTaxResult | null {
  const {
    annuityAmount,
    lumpSumPercent,
    taxMode,
    years,
    growthPercent,
    calcCurrency,
    lumpSumCurrency,
    annuityCurrency,
  } = input;

  let rateI = input.taxRateI;
  let rateII = input.taxRateII;
  let usTaxNote: string | null = null;

  if (taxMode === 'us') {
    rateI = US_FEDERAL_WITHHOLDING_RATE;
    rateII = 0;
    usTaxNote =
      'US mode applies IRC §3402(q) 24% federal withholding on the gross payout as Tax I (withholding, not final federal tax). Tax II is left at 0%. Enter a state rate under Customized tax rates; this tool does not invent state lottery tax rates.';
  }

  const lumpGross = lumpSumFromAnnuity(annuityAmount, lumpSumPercent);
  if (lumpGross === null) return null;

  const lumpTaxes = applyIndependentTaxes(lumpGross, rateI, rateII);
  if (!lumpTaxes) return null;

  const growthRate = growthPercent / 100;
  const first = firstNominalAnnuityPayment(annuityAmount, years, growthRate);
  if (first === null) return null;

  const schedule: LotteryTaxScheduleRow[] = [];
  let annuityTaxI = 0;
  let annuityTaxII = 0;
  let annuityNet = 0;
  let annuityGrossCheck = 0;

  for (let year = 1; year <= years; year++) {
    const gross = first * Math.pow(1 + growthRate, year - 1);
    const taxes = applyIndependentTaxes(gross, rateI, rateII);
    if (!taxes) return null;
    annuityGrossCheck += gross;
    annuityTaxI += taxes.taxI;
    annuityTaxII += taxes.taxII;
    annuityNet += taxes.net;
    schedule.push({
      year,
      gross,
      taxI: taxes.taxI,
      taxII: taxes.taxII,
      net: taxes.net,
      formattedGross: formatLotteryTaxMoney(gross, calcCurrency),
      formattedTaxI: formatLotteryTaxMoney(taxes.taxI, calcCurrency),
      formattedTaxII: formatLotteryTaxMoney(taxes.taxII, calcCurrency),
      formattedNet: formatLotteryTaxMoney(taxes.net, calcCurrency),
    });
  }

  // Reconcile tiny floating error so displayed total matches advertised annuity.
  const grossDrift = annuityAmount - annuityGrossCheck;
  if (Math.abs(grossDrift) > 0 && Math.abs(grossDrift) < 0.02 * years) {
    const last = schedule[schedule.length - 1]!;
    last.gross += grossDrift;
    const taxes = applyIndependentTaxes(last.gross, rateI, rateII);
    if (!taxes) return null;
    annuityTaxI += taxes.taxI - last.taxI;
    annuityTaxII += taxes.taxII - last.taxII;
    annuityNet += taxes.net - last.net;
    last.taxI = taxes.taxI;
    last.taxII = taxes.taxII;
    last.net = taxes.net;
    last.formattedGross = formatLotteryTaxMoney(last.gross, calcCurrency);
    last.formattedTaxI = formatLotteryTaxMoney(last.taxI, calcCurrency);
    last.formattedTaxII = formatLotteryTaxMoney(last.taxII, calcCurrency);
    last.formattedNet = formatLotteryTaxMoney(last.net, calcCurrency);
  }

  const lumpSum = column(
    lumpGross,
    lumpTaxes.taxI,
    lumpTaxes.taxII,
    lumpTaxes.net,
    calcCurrency
  );
  const annuity = column(
    annuityAmount,
    annuityTaxI,
    annuityTaxII,
    annuityNet,
    calcCurrency
  );
  const difference = column(
    lumpSum.payout - annuity.payout,
    lumpSum.taxI - annuity.taxI,
    lumpSum.taxII - annuity.taxII,
    lumpSum.net - annuity.net,
    calcCurrency
  );

  return {
    lumpSum,
    annuity,
    difference,
    schedule,
    years,
    growthPercent,
    lumpSumPercent,
    taxMode,
    effectiveTaxRateI: rateI,
    effectiveTaxRateII: rateII,
    calcCurrency,
    lumpSumCurrency,
    annuityCurrency,
    usTaxNote,
    summaryText: `Lump ${formatLotteryTaxMoney(lumpSum.net, calcCurrency)} net vs annuity ${formatLotteryTaxMoney(annuity.net, calcCurrency)} net (${years} yrs · ${growthPercent}% growth). Nominal comparison; no time-value discount.`,
  };
}
