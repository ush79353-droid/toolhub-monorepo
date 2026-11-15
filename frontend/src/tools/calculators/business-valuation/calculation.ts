import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  SCALE_FACTOR,
  type BusinessValuationInput,
  type BusinessValuationResult,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

/** Present value of a level annuity: CF × [1 − (1+r)^(-n)] / r; for r = 0 → CF × n. */
export function dcfAnnuityValue(
  cashFlow: number,
  years: number,
  discountRateDecimal: number
): number {
  if (!finite(cashFlow) || !finite(years) || !finite(discountRateDecimal)) return Number.NaN;
  if (years < 0) return Number.NaN;
  if (discountRateDecimal === 0) return cashFlow * years;
  if (discountRateDecimal <= -1) return Number.NaN;
  const factor = (1 - Math.pow(1 + discountRateDecimal, -years)) / discountRateDecimal;
  return cashFlow * factor;
}

export function calculateBusinessValuation(
  input: BusinessValuationInput
): BusinessValuationResult | null {
  let value = Number.NaN;

  switch (input.method) {
    case 'dcf': {
      const scaled = input.cashFlow * SCALE_FACTOR[input.cashFlowScale];
      const r = input.discountRatePercent / 100;
      value = dcfAnnuityValue(scaled, input.projectionYears, r);
      break;
    }
    case 'asset-based':
      value = input.totalAssets - input.totalLiabilities;
      break;
    case 'market-cap':
      value = input.sharePrice * input.sharesOutstanding;
      break;
    case 'multiples':
      value = input.financialMetric * input.valuationMultiple;
      break;
  }

  if (!finite(value)) return null;

  return {
    method: input.method,
    currency: input.currency,
    value,
    valueDisplay: formatCurrencyValue(value, input.currency),
  };
}
