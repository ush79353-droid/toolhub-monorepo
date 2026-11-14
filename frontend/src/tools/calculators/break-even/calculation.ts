import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { BreakEvenResult } from './types';

function formatPercent(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}

function formatAmount(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Contribution = revenue − cost
 * Margin (%) = contribution / revenue × 100
 * Markup (%) = contribution / cost × 100
 * Break-even units (exact) = fixed / contribution
 * Units to sell = ceil(exact)
 * Break-even revenue = units to sell × revenue
 */
export function calculateBreakEven(
  revenuePerUnit: number,
  costPerUnit: number,
  fixedCosts: number,
  currency: SupportedCurrency
): BreakEvenResult {
  const contributionPerUnit = revenuePerUnit - costPerUnit;

  const marginPercent =
    revenuePerUnit > 0 && Number.isFinite(contributionPerUnit / revenuePerUnit)
      ? (contributionPerUnit / revenuePerUnit) * 100
      : null;

  const markupPercent =
    costPerUnit > 0 && Number.isFinite(contributionPerUnit / costPerUnit)
      ? (contributionPerUnit / costPerUnit) * 100
      : null;

  let unitsToSell: number | null = null;
  let breakEvenRevenue: number | null = null;
  let breakEvenDefined = false;
  let explanation: string | null = null;

  if (contributionPerUnit <= 0) {
    explanation =
      'Contribution per unit must be greater than zero (revenue per unit must exceed cost per unit) to reach a finite break-even quantity.';
  } else {
    const exactUnits = fixedCosts / contributionPerUnit;
    if (!Number.isFinite(exactUnits) || exactUnits < 0) {
      explanation = 'This combination does not produce a finite break-even quantity.';
    } else {
      unitsToSell = Math.ceil(exactUnits);
      breakEvenRevenue = unitsToSell * revenuePerUnit;
      if (!Number.isFinite(unitsToSell) || !Number.isFinite(breakEvenRevenue)) {
        unitsToSell = null;
        breakEvenRevenue = null;
        explanation = 'This combination does not produce a finite break-even quantity.';
      } else {
        breakEvenDefined = true;
      }
    }
  }

  return {
    revenuePerUnit,
    costPerUnit,
    fixedCosts,
    contributionPerUnit,
    marginPercent: marginPercent !== null && Number.isFinite(marginPercent) ? marginPercent : null,
    markupPercent: markupPercent !== null && Number.isFinite(markupPercent) ? markupPercent : null,
    unitsToSell,
    breakEvenRevenue,
    currency,
    formattedMargin:
      marginPercent !== null && Number.isFinite(marginPercent) ? formatPercent(marginPercent) : '',
    formattedMarkup:
      markupPercent !== null && Number.isFinite(markupPercent) ? formatPercent(markupPercent) : '',
    formattedUnits:
      unitsToSell !== null
        ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(unitsToSell)
        : '',
    formattedRevenue:
      breakEvenRevenue !== null ? formatAmount(breakEvenRevenue, currency) : '',
    shareRevenue:
      breakEvenRevenue !== null ? formatCurrencyValue(breakEvenRevenue, currency) : '',
    breakEvenDefined,
    explanation,
  };
}
