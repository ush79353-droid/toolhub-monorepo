import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { FcffSource } from './types';

export interface FcffCalculationInput {
  source: FcffSource;
  /** Source amount already in the result currency. */
  sourceValue: number;
  /** D&A in result currency (0 when unused for the source). */
  depreciation: number;
  /** Interest expense in result currency (0 when unused). */
  interest: number;
  /** Corporate tax rate as a decimal in [0, 1]. */
  taxRate: number;
  /** CapEx outflow in result currency. */
  capex: number;
  /** ΔNWC in result currency (0 for CFO). */
  nwc: number;
}

/**
 * Source-specific FCFF. Inputs must already share one currency.
 * CapEx and ΔNWC are treated as cash outflows when positive.
 * CFO does not subtract ΔNWC (already in operating cash flow).
 * Returns null for non-finite inputs or results.
 */
export function calculateFcff(input: FcffCalculationInput): number | null {
  const {
    source,
    sourceValue,
    depreciation,
    interest,
    taxRate,
    capex,
    nwc,
  } = input;

  if (
    ![sourceValue, depreciation, interest, taxRate, capex, nwc].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (taxRate < 0 || taxRate > 1) return null;

  const oneMinusT = 1 - taxRate;
  let fcff: number;

  switch (source) {
    case 'net_income':
      // FCFF = NI + D&A + Interest × (1 − T) − CapEx − ΔNWC
      fcff =
        sourceValue +
        depreciation +
        interest * oneMinusT -
        capex -
        nwc;
      break;
    case 'ebitda':
      // FCFF = EBITDA × (1 − T) + D&A × T − CapEx − ΔNWC
      fcff =
        sourceValue * oneMinusT + depreciation * taxRate - capex - nwc;
      break;
    case 'ebit':
      // FCFF = EBIT × (1 − T) + D&A − CapEx − ΔNWC
      fcff = sourceValue * oneMinusT + depreciation - capex - nwc;
      break;
    case 'cfo':
      // FCFF = CFO + Interest × (1 − T) − CapEx  (no ΔNWC)
      fcff = sourceValue + interest * oneMinusT - capex;
      break;
  }

  return Number.isFinite(fcff) ? fcff : null;
}

export function formulaLabelForSource(source: FcffSource): string {
  switch (source) {
    case 'net_income':
      return 'FCFF = NI + D&A + Interest × (1 − T) − CapEx − ΔNWC';
    case 'ebitda':
      return 'FCFF = EBITDA × (1 − T) + D&A × T − CapEx − ΔNWC';
    case 'ebit':
      return 'FCFF = EBIT × (1 − T) + D&A − CapEx − ΔNWC';
    case 'cfo':
      return 'FCFF = CFO + Interest × (1 − T) − CapEx';
  }
}

/** Display rounding only — never used inside the formula. */
export function formatFcffMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
