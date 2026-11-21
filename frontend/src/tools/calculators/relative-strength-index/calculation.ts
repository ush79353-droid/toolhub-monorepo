import type { RsiMethod, RsiPoint } from './types';

export interface RsiMathInputs {
  closingPrices: number[];
  period: number;
  method: RsiMethod;
}

export interface RsiMathResult {
  rsi: number | null;
  averageGain: number | null;
  averageLoss: number | null;
  relativeStrength: number | null;
  series: RsiPoint[];
  status: 'valid' | 'insufficient-data' | 'invalid';
}

function gainsAndLosses(prices: number[]): {
  gains: number[];
  losses: number[];
} {
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < prices.length; i += 1) {
    const delta = prices[i]! - prices[i - 1]!;
    gains.push(Math.max(delta, 0));
    losses.push(Math.max(-delta, 0));
  }
  return { gains, losses };
}

/**
 * RS / RSI from average gain and average loss.
 * Flat (both zero) → RSI 50 (documented neutral convention).
 * No losses → RSI 100. No gains → RSI 0.
 */
export function rsiFromAverages(
  averageGain: number,
  averageLoss: number
): { relativeStrength: number | null; rsi: number } {
  if (!Number.isFinite(averageGain) || !Number.isFinite(averageLoss)) {
    return { relativeStrength: null, rsi: Number.NaN };
  }
  if (averageGain < 0 || averageLoss < 0) {
    return { relativeStrength: null, rsi: Number.NaN };
  }
  if (averageGain === 0 && averageLoss === 0) {
    return { relativeStrength: null, rsi: 50 };
  }
  if (averageLoss === 0) {
    return { relativeStrength: null, rsi: 100 };
  }
  if (averageGain === 0) {
    return { relativeStrength: 0, rsi: 0 };
  }
  const relativeStrength = averageGain / averageLoss;
  const rsi = 100 - 100 / (1 + relativeStrength);
  return { relativeStrength, rsi };
}

function mean(values: number[]): number {
  if (values.length === 0) return Number.NaN;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Calculate RSI series. First RSI appears at price index = period
 * (after `period` changes from `period + 1` prices).
 */
export function calculateRSI(inputs: RsiMathInputs): RsiMathResult {
  const { closingPrices, period, method } = inputs;

  if (
    !Number.isInteger(period) ||
    period < 1 ||
    !Number.isFinite(period)
  ) {
    return {
      rsi: null,
      averageGain: null,
      averageLoss: null,
      relativeStrength: null,
      series: [],
      status: 'invalid',
    };
  }

  for (const p of closingPrices) {
    if (!Number.isFinite(p) || p < 0) {
      return {
        rsi: null,
        averageGain: null,
        averageLoss: null,
        relativeStrength: null,
        series: [],
        status: 'invalid',
      };
    }
  }

  const required = period + 1;
  if (closingPrices.length < required) {
    return {
      rsi: null,
      averageGain: null,
      averageLoss: null,
      relativeStrength: null,
      series: [],
      status: 'insufficient-data',
    };
  }

  const { gains, losses } = gainsAndLosses(closingPrices);
  const series: RsiPoint[] = [];

  if (method === 'simple') {
    for (let end = period - 1; end < gains.length; end += 1) {
      const windowGains = gains.slice(end - period + 1, end + 1);
      const windowLosses = losses.slice(end - period + 1, end + 1);
      const averageGain = mean(windowGains);
      const averageLoss = mean(windowLosses);
      const { relativeStrength, rsi } = rsiFromAverages(
        averageGain,
        averageLoss
      );
      if (!Number.isFinite(rsi)) {
        return {
          rsi: null,
          averageGain: null,
          averageLoss: null,
          relativeStrength: null,
          series: [],
          status: 'invalid',
        };
      }
      const priceIndex = end + 1;
      series.push({
        priceIndex,
        price: closingPrices[priceIndex]!,
        averageGain,
        averageLoss,
        relativeStrength,
        rsi,
      });
    }
  } else {
    // Wilder: initial simple average of first `period` changes, then smooth
    let averageGain = mean(gains.slice(0, period));
    let averageLoss = mean(losses.slice(0, period));
    let { relativeStrength, rsi } = rsiFromAverages(averageGain, averageLoss);
    if (!Number.isFinite(rsi)) {
      return {
        rsi: null,
        averageGain: null,
        averageLoss: null,
        relativeStrength: null,
        series: [],
        status: 'invalid',
      };
    }
    series.push({
      priceIndex: period,
      price: closingPrices[period]!,
      averageGain,
      averageLoss,
      relativeStrength,
      rsi,
    });

    for (let i = period; i < gains.length; i += 1) {
      averageGain = (averageGain * (period - 1) + gains[i]!) / period;
      averageLoss = (averageLoss * (period - 1) + losses[i]!) / period;
      ({ relativeStrength, rsi } = rsiFromAverages(averageGain, averageLoss));
      if (!Number.isFinite(rsi)) {
        return {
          rsi: null,
          averageGain: null,
          averageLoss: null,
          relativeStrength: null,
          series: [],
          status: 'invalid',
        };
      }
      const priceIndex = i + 1;
      series.push({
        priceIndex,
        price: closingPrices[priceIndex]!,
        averageGain,
        averageLoss,
        relativeStrength,
        rsi,
      });
    }
  }

  const last = series[series.length - 1]!;
  return {
    rsi: last.rsi,
    averageGain: last.averageGain,
    averageLoss: last.averageLoss,
    relativeStrength: last.relativeStrength,
    series,
    status: 'valid',
  };
}

export function interpretRsi(rsi: number): string {
  if (!Number.isFinite(rsi)) return 'RSI is unavailable.';
  if (rsi < 30) {
    return `RSI ${formatRsi(rsi)} — commonly considered oversold. Recent losses have been relatively strong compared with gains. This does not guarantee an imminent price increase.`;
  }
  if (rsi < 50) {
    return `RSI ${formatRsi(rsi)} — lower momentum range (below the neutral 50 level). Recent average losses outweigh gains somewhat.`;
  }
  if (rsi === 50 || Math.abs(rsi - 50) < 1e-9) {
    return `RSI ${formatRsi(rsi)} — neutral momentum. Recent average gains and losses are approximately balanced (or flat prices used the calculator’s RSI=50 convention).`;
  }
  if (rsi <= 70) {
    return `RSI ${formatRsi(rsi)} — higher momentum range (above the neutral 50 level). Recent average gains outweigh losses somewhat.`;
  }
  return `RSI ${formatRsi(rsi)} — commonly considered overbought. Recent upward momentum has been strong. An overbought RSI does not guarantee an immediate price decline.`;
}

export function formatRsi(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatMetric(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
