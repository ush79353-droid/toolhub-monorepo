import type { AfnInput, AfnResult } from './types';

/** Round money once for display; rates and intermediate signs stay exact until here. */
export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

/**
 * Simplified additional funds needed:
 * AFN = ΔA − ΔL − ΔRE
 *
 * Positive → external financing needed.
 * Zero → no extra external financing indicated.
 * Negative → financing surplus (do not clamp to zero).
 */
export function calculateAfn(input: AfnInput): AfnResult | null {
  const { changeInAssets: assets, changeInLiabilities: liabilities, changeInRetainedEarnings: retained } =
    input;

  if (assets === null || liabilities === null || retained === null) return null;
  if (!Number.isFinite(assets) || !Number.isFinite(liabilities) || !Number.isFinite(retained)) {
    return null;
  }

  const additionalFundsNeeded = roundMoney(assets - liabilities - retained);
  if (!Number.isFinite(additionalFundsNeeded)) return null;

  return {
    changeInAssets: assets,
    changeInLiabilities: liabilities,
    changeInRetainedEarnings: retained,
    additionalFundsNeeded,
    currency: input.currency,
  };
}

export function afnInterpretation(afn: number): 'surplus' | 'balanced' | 'needed' {
  if (afn < 0) return 'surplus';
  if (afn > 0) return 'needed';
  return 'balanced';
}
