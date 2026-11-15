import type { SellThroughRateResult } from './types';

/**
 * Sell-through Rate (%) = (Units Sold / Units Received) × 100
 */
export function calculateSellThroughRate(
  unitsSold: number,
  unitsReceived: number
): SellThroughRateResult | null {
  if (!Number.isFinite(unitsSold) || !Number.isFinite(unitsReceived)) return null;
  if (unitsReceived <= 0 || unitsSold < 0) return null;
  if (unitsSold > unitsReceived) return null;

  const sellThroughRatePercent = (unitsSold / unitsReceived) * 100;
  if (!Number.isFinite(sellThroughRatePercent)) return null;

  const formattedRate = Number(sellThroughRatePercent.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });

  return { sellThroughRatePercent, formattedRate };
}
