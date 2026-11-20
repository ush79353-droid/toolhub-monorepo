export type TrendDirection = 'uptrend' | 'downtrend';
export type FibonacciLevelType = 'retracement' | 'extension';

export const FIBONACCI_RETRACEMENT_LEVELS = [
  0, 0.236, 0.382, 0.5, 0.618, 0.764, 0.786, 1,
] as const;

export const FIBONACCI_EXTENSION_LEVELS = [
  0, 0.618, 1, 1.272, 1.618, 2, 2.618,
] as const;

export interface FibonacciMathInput {
  lowPrice: number;
  highPrice: number;
  trend: TrendDirection;
  levelType: FibonacciLevelType;
}

export interface FibonacciMathLevel {
  ratio: number;
  price: number;
}

export interface FibonacciMathResult {
  priceDifference: number;
  levels: FibonacciMathLevel[];
}

export function calculateFibonacci(
  input: FibonacciMathInput
): FibonacciMathResult | null {
  const { lowPrice, highPrice, trend, levelType } = input;

  if (!Number.isFinite(lowPrice) || !Number.isFinite(highPrice)) {
    return null;
  }
  if (lowPrice < 0 || highPrice < 0) return null;
  if (!(highPrice > lowPrice)) return null;

  const priceDifference = highPrice - lowPrice;
  const ratios =
    levelType === 'retracement'
      ? FIBONACCI_RETRACEMENT_LEVELS
      : FIBONACCI_EXTENSION_LEVELS;

  const levels: FibonacciMathLevel[] = [];
  for (const ratio of ratios) {
    let price: number;
    if (levelType === 'retracement') {
      price =
        trend === 'uptrend'
          ? highPrice - priceDifference * ratio
          : lowPrice + priceDifference * ratio;
    } else {
      // Two-price extension: up = L + D×r · down = H − D×r
      price =
        trend === 'uptrend'
          ? lowPrice + priceDifference * ratio
          : highPrice - priceDifference * ratio;
    }
    if (!Number.isFinite(price)) return null;
    levels.push({ ratio, price });
  }

  return { priceDifference, levels };
}

export function formatFibPrice(value: number): string {
  const abs = Math.abs(value);
  let maxFrac = 2;
  if (abs > 0 && abs < 0.01) maxFrac = 8;
  else if (abs > 0 && abs < 1) maxFrac = 6;
  else if (Number.isInteger(value)) maxFrac = 2;
  else maxFrac = 6;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFrac,
  }).format(value);
}

export function formatFibPercent(ratio: number): string {
  const pct = ratio * 100;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
  }).format(pct);
}

export function interpretFibonacci(
  trend: TrendDirection,
  levelType: FibonacciLevelType,
  difference: number
): string {
  const move = formatFibPrice(difference);
  if (levelType === 'retracement') {
    return trend === 'uptrend'
      ? `Uptrend retracements measure pullbacks from the high across a ${move} price range.`
      : `Downtrend retracements measure rebounds from the low across a ${move} price range.`;
  }
  return trend === 'uptrend'
    ? `Uptrend extensions project targets beyond the high across a ${move} price range (two-price convention).`
    : `Downtrend extensions project targets beyond the low across a ${move} price range (two-price convention).`;
}
