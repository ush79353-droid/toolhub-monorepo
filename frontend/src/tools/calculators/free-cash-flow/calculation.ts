import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface FreeCashFlowCalculationInput {
  /** Operating cash flow already in the FCF currency. */
  operatingCashFlow: number;
  /** CapEx outflow already in the FCF currency (positive = spending). */
  capex: number;
  /** Shares outstanding; omit or null when per-share is not requested. */
  sharesOutstanding?: number | null;
  /** Market cap already in the FCF currency; omit when yield is not requested. */
  marketCap?: number | null;
  /** Revenue already in the FCF currency; omit when margin is not requested. */
  revenue?: number | null;
}

export interface FreeCashFlowCalculationResult {
  fcf: number;
  fcfPerShare: number | null;
  fcfYieldPercent: number | null;
  fcfMarginPercent: number | null;
}

/**
 * Free cash flow metrics. Money inputs must already share one currency.
 * CapEx is treated as a cash outflow when positive (FCF = OCF − CapEx).
 * Negative FCF / yield / margin are allowed.
 * Returns null for non-finite core inputs or results.
 *
 * Per-share / yield / margin stay null until their denominators are valid
 * and positive (shares, market cap, revenue). Stock price is not used here —
 * yield uses market capitalization only.
 */
export function calculateFreeCashFlow(
  input: FreeCashFlowCalculationInput
): FreeCashFlowCalculationResult | null {
  const { operatingCashFlow, capex, sharesOutstanding, marketCap, revenue } =
    input;

  if (![operatingCashFlow, capex].every(Number.isFinite)) {
    return null;
  }

  const fcf = operatingCashFlow - capex;
  if (!Number.isFinite(fcf)) {
    return null;
  }

  let fcfPerShare: number | null = null;
  if (
    sharesOutstanding !== undefined &&
    sharesOutstanding !== null &&
    Number.isFinite(sharesOutstanding) &&
    sharesOutstanding > 0
  ) {
    const perShare = fcf / sharesOutstanding;
    if (!Number.isFinite(perShare)) return null;
    fcfPerShare = perShare;
  }

  let fcfYieldPercent: number | null = null;
  if (
    marketCap !== undefined &&
    marketCap !== null &&
    Number.isFinite(marketCap) &&
    marketCap > 0
  ) {
    const yieldPct = (fcf / marketCap) * 100;
    if (!Number.isFinite(yieldPct)) return null;
    fcfYieldPercent = yieldPct;
  }

  let fcfMarginPercent: number | null = null;
  if (
    revenue !== undefined &&
    revenue !== null &&
    Number.isFinite(revenue) &&
    revenue > 0
  ) {
    const marginPct = (fcf / revenue) * 100;
    if (!Number.isFinite(marginPct)) return null;
    fcfMarginPercent = marginPct;
  }

  return { fcf, fcfPerShare, fcfYieldPercent, fcfMarginPercent };
}

/** Display rounding only — never used inside formulas. */
export function formatFcfMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for percent results (not used in math). */
export function formatFcfPercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(percent);
}
