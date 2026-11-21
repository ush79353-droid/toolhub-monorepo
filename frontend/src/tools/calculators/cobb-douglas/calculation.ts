/**
 * Cobb-Douglas: Y = A × L^α × K^β
 * RTS = α + β (constant / increasing / decreasing with float tolerance)
 * MPL = α Y / L (L > 0), MPK = β Y / K (K > 0)
 */
import type { ReturnsToScaleType } from './types';

export const RTS_TOLERANCE = 1e-9;

export interface CobbDouglasMathResult {
  totalProduction: number;
  returnsToScaleSum: number;
  returnsToScaleType: ReturnsToScaleType;
  marginalProductOfLabor: number | null;
  marginalProductOfCapital: number | null;
  averageProductOfLabor: number | null;
  averageProductOfCapital: number | null;
}

export function classifyReturnsToScale(
  sum: number,
  tolerance = RTS_TOLERANCE
): ReturnsToScaleType {
  if (!Number.isFinite(sum)) return 'decreasing';
  if (Math.abs(sum - 1) <= tolerance) return 'constant';
  if (sum > 1) return 'increasing';
  return 'decreasing';
}

export function calculateCobbDouglas(
  totalFactorProductivity: number,
  labor: number,
  laborElasticity: number,
  capital: number,
  capitalElasticity: number
): CobbDouglasMathResult | null {
  if (
    ![
      totalFactorProductivity,
      labor,
      laborElasticity,
      capital,
      capitalElasticity,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (totalFactorProductivity <= 0) return null;
  if (labor < 0 || capital < 0) return null;
  if (laborElasticity <= 0 || capitalElasticity <= 0) return null;

  // 0^negative is non-finite; reject when an exponent would make pow invalid
  if (labor === 0 && laborElasticity < 0) return null;
  if (capital === 0 && capitalElasticity < 0) return null;

  const laborTerm = Math.pow(labor, laborElasticity);
  const capitalTerm = Math.pow(capital, capitalElasticity);
  if (!Number.isFinite(laborTerm) || !Number.isFinite(capitalTerm)) {
    return null;
  }

  const totalProduction =
    totalFactorProductivity * laborTerm * capitalTerm;
  if (!Number.isFinite(totalProduction)) return null;

  const returnsToScaleSum = laborElasticity + capitalElasticity;
  const returnsToScaleType = classifyReturnsToScale(returnsToScaleSum);

  const averageProductOfLabor =
    labor > 0 && Number.isFinite(totalProduction / labor)
      ? totalProduction / labor
      : null;
  const averageProductOfCapital =
    capital > 0 && Number.isFinite(totalProduction / capital)
      ? totalProduction / capital
      : null;

  const marginalProductOfLabor =
    labor > 0 && averageProductOfLabor != null
      ? laborElasticity * averageProductOfLabor
      : null;
  const marginalProductOfCapital =
    capital > 0 && averageProductOfCapital != null
      ? capitalElasticity * averageProductOfCapital
      : null;

  if (
    marginalProductOfLabor != null &&
    !Number.isFinite(marginalProductOfLabor)
  ) {
    return null;
  }
  if (
    marginalProductOfCapital != null &&
    !Number.isFinite(marginalProductOfCapital)
  ) {
    return null;
  }

  return {
    totalProduction,
    returnsToScaleSum,
    returnsToScaleType,
    marginalProductOfLabor,
    marginalProductOfCapital,
    averageProductOfLabor,
    averageProductOfCapital,
  };
}

export function formatOutput(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatElasticity(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatReturnsToScaleLabel(
  type: ReturnsToScaleType
): string {
  switch (type) {
    case 'constant':
      return 'Constant Returns to Scale';
    case 'increasing':
      return 'Increasing Returns to Scale';
    case 'decreasing':
      return 'Decreasing Returns to Scale';
  }
}

export function interpretReturnsToScale(
  type: ReturnsToScaleType,
  sum: number
): string {
  const sumText = formatElasticity(sum);
  if (type === 'constant') {
    return `α + β ≈ ${sumText}. Scaling labor and capital by the same factor scales output proportionally (constant returns to scale).`;
  }
  if (type === 'increasing') {
    return `α + β ≈ ${sumText} (> 1). Scaling all inputs proportionally increases output by a larger proportion (increasing returns to scale).`;
  }
  return `α + β ≈ ${sumText} (< 1). Scaling all inputs proportionally increases output by a smaller proportion (decreasing returns to scale).`;
}

export function explainCobbDouglas(
  totalProduction: number,
  a: number,
  labor: number,
  capital: number
): string {
  return `Estimated total production is ${formatOutput(totalProduction)} output units under Y = A L^α K^β with A = ${formatElasticity(a)}, L = ${formatElasticity(labor)}, and K = ${formatElasticity(capital)}. Units follow the model's calibrated productivity coefficient; not currency by default.`;
}
