/**
 * Generic threshold DI: max(0, AGI − k·P)
 * Budgeting DI: take-home − necessary (may be negative)
 */
export interface ThresholdDiInputs {
  annualAGI: number;
  povertyGuideline: number;
  protectionMultiplier: number;
}

export interface ThresholdDiResult {
  protectedIncome: number;
  annualDiscretionaryIncome: number;
  monthlyDiscretionaryIncome: number;
}

export function calculateDiscretionaryIncome(
  inputs: ThresholdDiInputs
): ThresholdDiResult | null {
  const { annualAGI, povertyGuideline, protectionMultiplier } = inputs;
  if (
    !Number.isFinite(annualAGI) ||
    !Number.isFinite(povertyGuideline) ||
    !Number.isFinite(protectionMultiplier) ||
    povertyGuideline < 0 ||
    protectionMultiplier < 0
  ) {
    return null;
  }
  const protectedIncome = povertyGuideline * protectionMultiplier;
  if (!Number.isFinite(protectedIncome)) return null;
  // Student-loan DI floors at 0. Negative AGI is allowed mathematically.
  const annualDiscretionaryIncome = Math.max(0, annualAGI - protectedIncome);
  if (!Number.isFinite(annualDiscretionaryIncome)) return null;
  return {
    protectedIncome,
    annualDiscretionaryIncome,
    monthlyDiscretionaryIncome: annualDiscretionaryIncome / 12,
  };
}

export function estimateMonthlyIdrPayment(
  annualDiscretionaryIncome: number,
  assessmentRate: number
): number | null {
  if (
    !Number.isFinite(annualDiscretionaryIncome) ||
    annualDiscretionaryIncome < 0 ||
    !Number.isFinite(assessmentRate) ||
    assessmentRate < 0
  ) {
    return null;
  }
  const monthly = (annualDiscretionaryIncome * assessmentRate) / 12;
  return Number.isFinite(monthly) ? monthly : null;
}

export function calculateBudgetingDiscretionaryIncome(
  monthlyTakeHome: number,
  necessaryExpenses: number
): number | null {
  if (![monthlyTakeHome, necessaryExpenses].every(Number.isFinite)) return null;
  if (monthlyTakeHome < 0 || necessaryExpenses < 0) return null;
  const di = monthlyTakeHome - necessaryExpenses;
  return Number.isFinite(di) ? di : null;
}

export function sumNecessaryExpenses(parts: number[]): number | null {
  if (!parts.every((n) => Number.isFinite(n) && n >= 0)) return null;
  const sum = parts.reduce((a, b) => a + b, 0);
  return Number.isFinite(sum) ? sum : null;
}

export function formatUsd(amount: number, digits = 2): string {
  const body = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
  return `$${body}`;
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(rate * 100 % 1 === 0 ? 0 : 1)}%`;
}
