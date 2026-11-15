import type { FullTimeEquivalentResult } from './types';

/**
 * FTE = Full-time Employees + (Part-time Employees × Part-time Hours / Full-time Hours)
 * Hours are per employee over the same period (hrs/week).
 */
export function calculateFullTimeEquivalent(
  fullTimeEmployees: number,
  fullTimeHours: number,
  partTimeEmployees: number,
  partTimeHours: number
): FullTimeEquivalentResult | null {
  if (
    ![fullTimeEmployees, fullTimeHours, partTimeEmployees, partTimeHours].every(Number.isFinite)
  ) {
    return null;
  }
  if (fullTimeHours <= 0) return null;
  if (fullTimeEmployees < 0 || partTimeEmployees < 0 || partTimeHours < 0) return null;

  const fte = fullTimeEmployees + (partTimeEmployees * partTimeHours) / fullTimeHours;
  if (!Number.isFinite(fte)) return null;

  const formattedFte = Number(fte.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });

  return {
    fullTimeEmployees,
    fullTimeHours,
    partTimeEmployees,
    partTimeHours,
    fte,
    formattedFte,
  };
}
