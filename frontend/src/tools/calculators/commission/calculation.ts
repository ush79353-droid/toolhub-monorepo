import type { CommissionResult, CommissionSolveTarget } from './types';

/** Display money with up to 2 fraction digits (full precision kept in engine). */
export function formatCommissionUsd(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  if (Object.is(rounded, -0) || rounded === 0) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

/** Display percent; trim trailing zeros but keep meaningful precision. */
export function formatCommissionPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e10) / 1e10;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  const text = rounded.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

/** Commission = Sales Price × Commission Rate / 100 */
export function solveCommission(salesPrice: number, commissionRate: number): number | null {
  if (!Number.isFinite(salesPrice) || !Number.isFinite(commissionRate)) return null;
  if (salesPrice < 0 || commissionRate < 0) return null;
  const commission = (salesPrice * commissionRate) / 100;
  return Number.isFinite(commission) ? commission : null;
}

/**
 * Commission Rate = Commission / Sales Price × 100
 * Rejects zero sales price (division by zero).
 */
export function solveCommissionRate(salesPrice: number, commission: number): number | null {
  if (!Number.isFinite(salesPrice) || !Number.isFinite(commission)) return null;
  if (salesPrice < 0 || commission < 0) return null;
  if (salesPrice === 0) return null;
  const rate = (commission / salesPrice) * 100;
  return Number.isFinite(rate) ? rate : null;
}

/**
 * Sales Price = Commission / (Commission Rate / 100)
 * Rejects zero commission rate (division by zero).
 */
export function solveSalesPrice(commission: number, commissionRate: number): number | null {
  if (!Number.isFinite(commission) || !Number.isFinite(commissionRate)) return null;
  if (commission < 0 || commissionRate < 0) return null;
  if (commissionRate === 0) return null;
  const salesPrice = commission / (commissionRate / 100);
  return Number.isFinite(salesPrice) ? salesPrice : null;
}

export interface CommissionEngineInput {
  solveFor: CommissionSolveTarget;
  salesPrice: number | null;
  commissionRate: number | null;
  commission: number | null;
}

function givenLabels(solveFor: CommissionSolveTarget): string {
  switch (solveFor) {
    case 'commission':
      return 'sales price and commission rate';
    case 'commissionRate':
      return 'sales price and commission';
    case 'salesPrice':
      return 'commission and commission rate';
  }
}

function solvedLead(solveFor: CommissionSolveTarget): string {
  switch (solveFor) {
    case 'commission':
      return 'the commission is:';
    case 'commissionRate':
      return 'the commission rate is:';
    case 'salesPrice':
      return 'the sales price is:';
  }
}

/**
 * Bidirectional flat-percentage commission solve.
 * Preserve full precision in numeric fields; formatters round for display only.
 */
export function calculateCommission(input: CommissionEngineInput): CommissionResult | null {
  const { solveFor } = input;
  let salesPrice = input.salesPrice;
  let commissionRate = input.commissionRate;
  let commission = input.commission;

  if (solveFor === 'commission') {
    if (salesPrice === null || commissionRate === null) return null;
    const solved = solveCommission(salesPrice, commissionRate);
    if (solved === null) return null;
    commission = solved;
  } else if (solveFor === 'commissionRate') {
    if (salesPrice === null || commission === null) return null;
    const solved = solveCommissionRate(salesPrice, commission);
    if (solved === null) return null;
    commissionRate = solved;
  } else {
    if (commission === null || commissionRate === null) return null;
    const solved = solveSalesPrice(commission, commissionRate);
    if (solved === null) return null;
    salesPrice = solved;
  }

  if (salesPrice === null || commissionRate === null || commission === null) return null;

  const formattedSalesPrice = formatCommissionUsd(salesPrice);
  const formattedCommissionRate = formatCommissionPercent(commissionRate);
  const formattedCommission = formatCommissionUsd(commission);

  const summaryValue =
    solveFor === 'commissionRate'
      ? `${formattedCommissionRate}%`
      : solveFor === 'salesPrice'
        ? `$${formattedSalesPrice}`
        : `$${formattedCommission}`;

  const summaryLead = `Given the ${givenLabels(solveFor)}, ${solvedLead(solveFor)}`;
  const summaryText = `${summaryLead} ${summaryValue}`;

  return {
    solvedField: solveFor,
    salesPrice,
    commissionRate,
    commission,
    formattedSalesPrice,
    formattedCommissionRate,
    formattedCommission,
    summaryLead,
    summaryValue,
    summaryText,
  };
}
