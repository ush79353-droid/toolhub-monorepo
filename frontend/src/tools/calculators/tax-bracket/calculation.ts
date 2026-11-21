import { YEAR_BRACKETS, YEAR_SOURCE, type OrdinaryBracket } from './tax-parameters';
import type {
  BracketSlice,
  TaxBracketCalculatorResult,
  TaxBracketFilingStatus,
  TaxBracketYear,
} from './types';

/**
 * Progressive ordinary-income tax with per-bracket slices.
 * Tax = Σ (portion in band × rate). Never applies the top marginal rate to all income.
 */
export function calculateTaxBracket(input: {
  taxYear: TaxBracketYear;
  filingStatus: TaxBracketFilingStatus;
  incomeEntered: number;
  deductions: number;
}): TaxBracketCalculatorResult | null {
  const { taxYear, filingStatus, incomeEntered, deductions } = input;
  if (![incomeEntered, deductions].every(Number.isFinite)) return null;
  if (incomeEntered < 0 || deductions < 0) return null;

  const taxableIncome = Math.max(0, incomeEntered - deductions);
  const brackets = YEAR_BRACKETS[taxYear][filingStatus];
  if (!brackets?.length) return null;

  const slices = buildSlices(taxableIncome, brackets);
  const estimatedTax = slices.reduce((sum, s) => sum + s.taxInBracket, 0);
  if (!Number.isFinite(estimatedTax) || estimatedTax < 0) return null;

  const marginalRate = marginalRateFor(taxableIncome, brackets);
  const effectiveRate =
    taxableIncome > 0 ? (estimatedTax / taxableIncome) * 100 : taxableIncome === 0 ? 0 : null;

  return {
    taxYear,
    filingStatus,
    incomeEntered,
    deductions,
    taxableIncome,
    estimatedTax,
    marginalRate,
    effectiveRate,
    slices,
    formattedIncomeEntered: formatUsd(incomeEntered),
    formattedDeductions: formatUsd(deductions),
    formattedTaxableIncome: formatUsd(taxableIncome),
    formattedEstimatedTax: formatUsd(estimatedTax),
    formattedMarginalRate: formatPercent(marginalRate * 100),
    formattedEffectiveRate:
      effectiveRate === null ? '—' : formatPercent(effectiveRate),
    sourceNote: YEAR_SOURCE[taxYear],
  };
}

function buildSlices(
  taxableIncome: number,
  brackets: readonly OrdinaryBracket[]
): BracketSlice[] {
  const slices: BracketSlice[] = [];
  if (!(taxableIncome > 0)) return slices;

  for (const b of brackets) {
    if (taxableIncome <= b.from) break;
    const upper = Number.isFinite(b.upTo) ? b.upTo : taxableIncome;
    const taxableInBracket = Math.min(taxableIncome, upper) - b.from;
    if (taxableInBracket <= 0) continue;
    slices.push({
      rate: b.rate,
      from: b.from,
      upTo: b.upTo,
      taxableInBracket,
      taxInBracket: taxableInBracket * b.rate,
    });
    if (taxableIncome <= b.upTo || !Number.isFinite(b.upTo)) break;
  }
  return slices;
}

function marginalRateFor(
  taxableIncome: number,
  brackets: readonly OrdinaryBracket[]
): number {
  if (!(taxableIncome > 0)) return brackets[0]?.rate ?? 0;
  for (const b of brackets) {
    if (taxableIncome <= b.upTo || !Number.isFinite(b.upTo)) return b.rate;
  }
  return brackets[brackets.length - 1]!.rate;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}
