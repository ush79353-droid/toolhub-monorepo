import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface EpsGrowthMathInput {
  initialEps: number;
  finalEps: number;
  numberOfPeriods: number;
}

export interface EpsGrowthMathResult {
  absoluteEpsChange: number;
  totalGrowthPercentage: number | null;
  compoundGrowthRate: number | null;
  warning: string | null;
}

/**
 * Total growth (positive initial only): (final − initial) / initial × 100
 * CAGR (positive initial & final ≥ 0): (final/initial)^(1/n) − 1
 */
export function calculateEpsGrowth(
  input: EpsGrowthMathInput
): EpsGrowthMathResult | null {
  const { initialEps, finalEps, numberOfPeriods } = input;

  if (
    !Number.isFinite(initialEps) ||
    !Number.isFinite(finalEps) ||
    !Number.isFinite(numberOfPeriods)
  ) {
    return null;
  }
  if (!(numberOfPeriods > 0)) return null;

  const absoluteEpsChange = finalEps - initialEps;
  let totalGrowthPercentage: number | null = null;
  let compoundGrowthRate: number | null = null;
  let warning: string | null = null;

  if (initialEps > 0) {
    totalGrowthPercentage = (absoluteEpsChange / initialEps) * 100;

    if (finalEps >= 0) {
      const ratio = finalEps / initialEps;
      compoundGrowthRate = (Math.pow(ratio, 1 / numberOfPeriods) - 1) * 100;
      if (!Number.isFinite(compoundGrowthRate)) {
        compoundGrowthRate = null;
        warning =
          'EPS CAGR could not be computed for these values.';
      }
    } else {
      warning =
        'EPS moved from positive to negative. Total percentage change is shown, but conventional CAGR is undefined when earnings cross into a loss.';
    }
  } else if (initialEps === 0) {
    warning =
      'EPS growth percentage cannot be calculated when the starting EPS is zero.';
  } else {
    warning =
      'EPS started negative. Conventional percentage growth and CAGR are not meaningful with a negative starting EPS. Use the absolute EPS change instead.';
  }

  if (
    totalGrowthPercentage != null &&
    !Number.isFinite(totalGrowthPercentage)
  ) {
    totalGrowthPercentage = null;
  }
  if (
    compoundGrowthRate != null &&
    !Number.isFinite(compoundGrowthRate)
  ) {
    compoundGrowthRate = null;
  }

  return {
    absoluteEpsChange,
    totalGrowthPercentage,
    compoundGrowthRate,
    warning,
  };
}

export function formatEpsAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: Math.max(digits, 4),
  }).format(amount);
}

export function formatGrowthPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function interpretEpsGrowth(
  absoluteChange: number,
  totalGrowth: number | null,
  cagr: number | null,
  periods: number,
  symbol: string,
  currency: SupportedCurrency
): string {
  const abs = `${symbol}${formatEpsAmount(absoluteChange, currency)}`;
  if (totalGrowth == null) {
    return `Absolute EPS change is ${abs}. Standard percentage growth is unavailable for these inputs.`;
  }
  const total = `${formatGrowthPercent(totalGrowth)}%`;
  if (cagr == null) {
    return `Total EPS growth is ${total} (${abs} absolute). Conventional CAGR is unavailable for these EPS values.`;
  }
  const unit = periods === 1 ? 'period' : 'periods';
  return `Total EPS growth is ${total}. Annualized (compound) growth over ${periods} ${unit} is ${formatGrowthPercent(cagr)}% per period.`;
}
