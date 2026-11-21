/**
 * G = A / (A + B)
 * Gini Index = G × 100
 * Sorted nonnegative incomes: G = 2∑(i·x_i)/(n·∑x_i) − (n+1)/n
 * Illustrative Lorenz for G∈[0,1): y = x^k with k=(1+G)/(1−G)
 */
import type { LorenzPoint } from './types';

export function calculateGiniCoefficient(
  areaA: number,
  areaB: number
): number {
  if (!Number.isFinite(areaA) || !Number.isFinite(areaB)) {
    throw new Error('Please enter valid numerical values.');
  }
  if (areaA < 0 || areaB < 0) {
    throw new Error('Areas cannot be negative.');
  }
  const totalArea = areaA + areaB;
  if (totalArea <= 0) {
    throw new Error('The combined area must be greater than zero.');
  }
  return areaA / totalArea;
}

export function giniIndexFromCoefficient(g: number): number {
  return g * 100;
}

export function calculateGiniFromIncomes(incomes: number[]): number {
  if (incomes.length < 2) {
    throw new Error('Enter at least two income observations.');
  }
  if (!incomes.every((x) => Number.isFinite(x) && x >= 0)) {
    throw new Error(
      'Incomes must be finite and nonnegative in this calculation mode.'
    );
  }
  const sorted = [...incomes].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((s, x) => s + x, 0);
  if (!(sum > 0)) {
    throw new Error('Total income must be greater than zero.');
  }
  let weighted = 0;
  for (let i = 0; i < n; i++) {
    weighted += (i + 1) * sorted[i]!;
  }
  return (2 * weighted) / (n * sum) - (n + 1) / n;
}

export function lorenzFromIncomes(incomes: number[]): LorenzPoint[] {
  const sorted = [...incomes].filter((x) => Number.isFinite(x) && x >= 0).sort(
    (a, b) => a - b
  );
  const n = sorted.length;
  const sum = sorted.reduce((s, x) => s + x, 0);
  if (n === 0 || !(sum > 0)) return [{ populationShare: 0, incomeShare: 0 }];
  const points: LorenzPoint[] = [{ populationShare: 0, incomeShare: 0 }];
  let cum = 0;
  for (let i = 0; i < n; i++) {
    cum += sorted[i]!;
    points.push({
      populationShare: (i + 1) / n,
      incomeShare: cum / sum,
    });
  }
  return points;
}

/** Modeled illustration only — not reconstructed measured data from A and B. */
export function illustrativeLorenzFromGini(
  g: number,
  samples = 41
): LorenzPoint[] {
  if (!(g >= 0) || !(g <= 1)) {
    return [
      { populationShare: 0, incomeShare: 0 },
      { populationShare: 1, incomeShare: 1 },
    ];
  }
  if (g >= 1 - 1e-12) {
    // Near max inequality illustration
    const points: LorenzPoint[] = [{ populationShare: 0, incomeShare: 0 }];
    for (let i = 1; i < samples - 1; i++) {
      const x = i / (samples - 1);
      points.push({ populationShare: x, incomeShare: 0 });
    }
    points.push({ populationShare: 1, incomeShare: 1 });
    return points;
  }
  const k = (1 + g) / (1 - g);
  const points: LorenzPoint[] = [];
  for (let i = 0; i < samples; i++) {
    const x = i / (samples - 1);
    points.push({ populationShare: x, incomeShare: Math.pow(x, k) });
  }
  return points;
}

export function formatGini(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(value);
}

export function formatIndex(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(value);
}

export function interpretGini(g: number): {
  title: string;
  interpretation: string;
} {
  if (Math.abs(g) < 1e-12) {
    return {
      title: 'Perfect Equality',
      interpretation:
        'A Gini coefficient of 0 indicates perfect equality in the measured distribution (Area A is zero). Context still depends on income definition and unit of analysis.',
    };
  }
  if (Math.abs(g - 1) < 1e-12) {
    return {
      title: 'Theoretical Maximum Inequality',
      interpretation:
        'A Gini coefficient of 1 is the theoretical maximum-inequality limit in this area model. Finite datasets may not attain exactly 1 under every Gini definition.',
    };
  }
  if (g < 0.2) {
    return {
      title: 'Very Low Measured Inequality',
      interpretation: `A Gini coefficient of ${formatGini(g)} suggests very low measured inequality relative to many real-world income distributions. These descriptive bands are illustrative, not official standards.`,
    };
  }
  if (g < 0.3) {
    return {
      title: 'Relatively Low Measured Inequality',
      interpretation: `A Gini coefficient of ${formatGini(g)} suggests relatively low measured inequality. Interpretation depends on the dataset, income definition, and population context.`,
    };
  }
  if (g < 0.4) {
    return {
      title: 'Moderate Measured Inequality',
      interpretation: `A Gini coefficient of ${formatGini(g)} suggests moderate measured inequality. Do not assign absolute socioeconomic judgments from the coefficient alone.`,
    };
  }
  if (g < 0.5) {
    return {
      title: 'Relatively High Measured Inequality',
      interpretation: `A Gini coefficient of ${formatGini(g)} suggests relatively high measured inequality compared with lower-Gini distributions.`,
    };
  }
  return {
    title: 'High Measured Inequality',
    interpretation: `A Gini coefficient of ${formatGini(g)} suggests high measured inequality. Different distributions can share the same Gini while having different Lorenz shapes.`,
  };
}

export function parseIncomesText(text: string): number[] {
  return text
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s.replace(/,/g, '')));
}
