import type { SafetyStockResult } from './types';

function formatUnits(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

/**
 * Safety Stock = max(0, (Max Daily Usage × Max Lead Time) − (Average Daily Usage × Average Lead Time))
 * Reorder Point = (Average Daily Usage × Average Lead Time) + Safety Stock
 * Inventory quantities are rounded up to whole units.
 */
export function calculateSafetyStock(
  maxDailyUsage: number,
  maxLeadTime: number,
  averageDailyUsage: number,
  averageLeadTime: number
): SafetyStockResult | null {
  if (
    !Number.isFinite(maxDailyUsage) ||
    !Number.isFinite(maxLeadTime) ||
    !Number.isFinite(averageDailyUsage) ||
    !Number.isFinite(averageLeadTime)
  ) {
    return null;
  }

  const demandMax = maxDailyUsage * maxLeadTime;
  const demandAvg = averageDailyUsage * averageLeadTime;
  if (!Number.isFinite(demandMax) || !Number.isFinite(demandAvg)) return null;

  const rawSafety = Math.max(0, demandMax - demandAvg);
  if (!Number.isFinite(rawSafety)) return null;

  const safetyStock = Math.ceil(rawSafety);
  const reorderPoint = Math.ceil(demandAvg + safetyStock);
  if (!Number.isFinite(safetyStock) || !Number.isFinite(reorderPoint)) return null;

  return {
    maxDailyUsage,
    maxLeadTime,
    averageDailyUsage,
    averageLeadTime,
    safetyStock,
    reorderPoint,
    formattedSafetyStock: formatUnits(safetyStock),
    formattedReorderPoint: formatUnits(reorderPoint),
  };
}

export function describeResult(result: SafetyStockResult): string {
  return [
    `Safety stock: ${result.formattedSafetyStock} units`,
    `Reorder point: ${result.formattedReorderPoint} units`,
  ].join('\n');
}
