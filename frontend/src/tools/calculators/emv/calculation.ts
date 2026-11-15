import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { EmvResult, EmvRiskValues } from './types';

/** Risk EMV = impact × (probability / 100). Sign of impact is preserved. */
export function calculateRiskEmv(impact: number, probabilityPercent: number): number {
  if (!Number.isFinite(impact) || !Number.isFinite(probabilityPercent)) return Number.NaN;
  if (probabilityPercent < 0 || probabilityPercent > 100) return Number.NaN;
  const value = impact * (probabilityPercent / 100);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateTotalEmv(risks: EmvRiskValues[]): number {
  let total = 0;
  for (const risk of risks) {
    if (!Number.isFinite(risk.riskEmv)) return Number.NaN;
    total += risk.riskEmv;
  }
  return Number.isFinite(total) ? total : Number.NaN;
}

function formatAmount(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildEmvResult(
  risks: EmvRiskValues[],
  currency: SupportedCurrency
): EmvResult | null {
  const totalEmv = calculateTotalEmv(risks);
  if (!Number.isFinite(totalEmv)) return null;

  return {
    risks,
    totalEmv,
    currency,
    emvDisplay: formatAmount(totalEmv, currency),
    shareEmv: formatCurrencyValue(totalEmv, currency),
  };
}
