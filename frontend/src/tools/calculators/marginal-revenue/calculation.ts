import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Discrete marginal revenue approximation:
 *   ΔTR = Final Revenue − Initial Revenue
 *   ΔQ  = Final Quantity − Initial Quantity
 *   MR  = ΔTR / ΔQ   (undefined when ΔQ === 0)
 *
 * Negative ΔTR, ΔQ, and MR are allowed. Full IEEE precision; never NaN/Infinity.
 */
export function calculateMarginalRevenue(input: {
  initialRevenue: number;
  finalRevenue: number;
  initialQuantity: number;
  finalQuantity: number;
}): {
  changeRevenue: number;
  changeQuantity: number;
  marginalRevenue: number | null;
  undefinedMarginalRevenue: boolean;
} | null {
  const {
    initialRevenue,
    finalRevenue,
    initialQuantity,
    finalQuantity,
  } = input;
  if (
    ![initialRevenue, finalRevenue, initialQuantity, finalQuantity].every(
      Number.isFinite
    )
  ) {
    return null;
  }

  const changeRevenue = finalRevenue - initialRevenue;
  const changeQuantity = finalQuantity - initialQuantity;
  if (![changeRevenue, changeQuantity].every(Number.isFinite)) return null;

  if (changeQuantity === 0) {
    return {
      changeRevenue,
      changeQuantity,
      marginalRevenue: null,
      undefinedMarginalRevenue: true,
    };
  }

  const marginalRevenue = changeRevenue / changeQuantity;
  if (!Number.isFinite(marginalRevenue)) return null;

  return {
    changeRevenue,
    changeQuantity,
    marginalRevenue,
    undefinedMarginalRevenue: false,
  };
}

export function formatMarginalRevenueMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatQuantityChange(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 12,
  }).format(amount);
}
