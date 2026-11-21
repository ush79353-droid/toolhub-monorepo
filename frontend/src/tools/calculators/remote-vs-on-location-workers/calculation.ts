import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  CheaperOption,
  ExpenseFrequency,
  PeriodUnit,
  RemoteVsOnLocationResult,
} from './types';

export interface ExpenseLine {
  amount: number;
  frequency: ExpenseFrequency;
}

export interface RemoteCostInputs {
  employeeCount: number;
  oneTimeAllowancePerEmployee: number;
  recurringLines: ExpenseLine[];
}

export interface OnLocationCostInputs {
  employeeCount: number;
  officeSpaceType: 'lease' | 'own';
  oneTimeOfficeCost: number;
  officeLease: ExpenseLine;
  recurringLines: ExpenseLine[];
}

export interface ComparisonBreakdown {
  comparisonPeriodMonths: number;
  periodLabel: string;
  remoteOneTimeCost: number;
  remoteRecurringCost: number;
  totalRemoteCost: number;
  remoteCostPerEmployee: number | null;
  onLocationOneTimeCost: number;
  onLocationRecurringCost: number;
  totalOnLocationCost: number;
  onLocationCostPerEmployee: number | null;
  costDifference: number;
  remoteSavingsPercentage: number | null;
  onLocationSavingsPercentage: number | null;
  cheaperOption: CheaperOption;
  interpretation: string;
  remoteEmployees: number;
  onLocationEmployees: number;
}

/** Normalize a recurring amount to a monthly equivalent. */
export function toMonthlyAmount(amount: number, frequency: ExpenseFrequency): number {
  if (!(amount >= 0) || !Number.isFinite(amount)) return Number.NaN;
  switch (frequency) {
    case 'daily':
      return (amount * 365) / 12;
    case 'weekly':
      return (amount * 52) / 12;
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
      return amount / 12;
  }
}

/** Convert comparison period into months. */
export function toMonths(value: number, unit: PeriodUnit): number {
  if (!(value > 0) || !Number.isFinite(value)) return Number.NaN;
  switch (unit) {
    case 'days':
      return value / (365 / 12);
    case 'weeks':
      return value / (52 / 12);
    case 'months':
      return value;
    case 'years':
      return value * 12;
  }
}

export function periodLabel(months: number, value: number, unit: PeriodUnit): string {
  const unitLabel =
    unit === 'days'
      ? value === 1
        ? 'day'
        : 'days'
      : unit === 'weeks'
        ? value === 1
          ? 'week'
          : 'weeks'
        : unit === 'months'
          ? value === 1
            ? 'month'
            : 'months'
          : value === 1
            ? 'year'
            : 'years';
  const monthsRounded =
    Math.abs(months - Math.round(months)) < 1e-9
      ? String(Math.round(months))
      : months.toFixed(2);
  return `${value} ${unitLabel} (≈ ${monthsRounded} months)`;
}

export function sumMonthly(lines: readonly ExpenseLine[]): number {
  let total = 0;
  for (const line of lines) {
    const monthly = toMonthlyAmount(line.amount, line.frequency);
    if (!Number.isFinite(monthly)) return Number.NaN;
    total += monthly;
  }
  return total;
}

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function interpretComparison(
  cheaper: CheaperOption,
  remoteEmployees: number,
  onLocationEmployees: number,
  remoteSavingsPct: number | null,
  onLocationSavingsPct: number | null,
): string {
  const staffingNote =
    remoteEmployees !== onLocationEmployees
      ? ' Employee counts differ — compare per-employee costs as well as totals.'
      : '';

  if (cheaper === 'equal') {
    return `Remote and on-location arrangements have equal total costs for this period.${staffingNote}`;
  }
  if (cheaper === 'remote') {
    const pct =
      remoteSavingsPct !== null ? ` (${formatPercent(remoteSavingsPct)}% lower than on-location)` : '';
    return `Remote work is more cost-effective on total spend${pct}.${staffingNote}`;
  }
  const pct =
    onLocationSavingsPct !== null
      ? ` (${formatPercent(onLocationSavingsPct)}% lower than remote)`
      : '';
  return `On-location work is more cost-effective on total spend${pct}.${staffingNote}`;
}

/**
 * Remote: one-time = N × allowance; recurring = N × monthlyPerEmployee × T months.
 * On-location: one-time = office setup; recurring = (lease? + other monthly) × T.
 * Lease excluded when office is owned. Office lines are NOT multiplied by headcount.
 */
export function calculateRemoteVsOnLocation(
  periodMonths: number,
  periodValue: number,
  periodUnit: PeriodUnit,
  remote: RemoteCostInputs,
  onLocation: OnLocationCostInputs,
): ComparisonBreakdown | null {
  if (!(periodMonths > 0) || !Number.isFinite(periodMonths)) return null;
  if (!Number.isSafeInteger(remote.employeeCount) || remote.employeeCount < 0) return null;
  if (!Number.isSafeInteger(onLocation.employeeCount) || onLocation.employeeCount < 0) {
    return null;
  }
  if (
    !Number.isFinite(remote.oneTimeAllowancePerEmployee) ||
    remote.oneTimeAllowancePerEmployee < 0
  ) {
    return null;
  }
  if (!Number.isFinite(onLocation.oneTimeOfficeCost) || onLocation.oneTimeOfficeCost < 0) {
    return null;
  }

  const remoteMonthlyPerEmployee = sumMonthly(remote.recurringLines);
  if (!Number.isFinite(remoteMonthlyPerEmployee)) return null;

  const remoteOneTimeCost = remote.employeeCount * remote.oneTimeAllowancePerEmployee;
  const remoteRecurringCost =
    remote.employeeCount * remoteMonthlyPerEmployee * periodMonths;
  const totalRemoteCost = remoteOneTimeCost + remoteRecurringCost;

  const leaseMonthly =
    onLocation.officeSpaceType === 'lease'
      ? toMonthlyAmount(onLocation.officeLease.amount, onLocation.officeLease.frequency)
      : 0;
  if (!Number.isFinite(leaseMonthly)) return null;

  const otherMonthly = sumMonthly(onLocation.recurringLines);
  if (!Number.isFinite(otherMonthly)) return null;

  const onLocationMonthly = leaseMonthly + otherMonthly;
  const onLocationOneTimeCost = onLocation.oneTimeOfficeCost;
  const onLocationRecurringCost = onLocationMonthly * periodMonths;
  const totalOnLocationCost = onLocationOneTimeCost + onLocationRecurringCost;

  if (
    ![
      remoteOneTimeCost,
      remoteRecurringCost,
      totalRemoteCost,
      onLocationOneTimeCost,
      onLocationRecurringCost,
      totalOnLocationCost,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  const remoteCostPerEmployee =
    remote.employeeCount > 0 ? totalRemoteCost / remote.employeeCount : null;
  const onLocationCostPerEmployee =
    onLocation.employeeCount > 0 ? totalOnLocationCost / onLocation.employeeCount : null;

  const costDifference = totalOnLocationCost - totalRemoteCost;
  const remoteSavingsPercentage =
    totalOnLocationCost > 0 ? (costDifference / totalOnLocationCost) * 100 : null;
  const onLocationSavingsPercentage =
    totalRemoteCost > 0 ? ((totalRemoteCost - totalOnLocationCost) / totalRemoteCost) * 100 : null;

  let cheaperOption: CheaperOption = 'equal';
  if (Math.abs(costDifference) < 1e-9) cheaperOption = 'equal';
  else if (costDifference > 0) cheaperOption = 'remote';
  else cheaperOption = 'on-location';

  return {
    comparisonPeriodMonths: periodMonths,
    periodLabel: periodLabel(periodMonths, periodValue, periodUnit),
    remoteOneTimeCost,
    remoteRecurringCost,
    totalRemoteCost,
    remoteCostPerEmployee,
    onLocationOneTimeCost,
    onLocationRecurringCost,
    totalOnLocationCost,
    onLocationCostPerEmployee,
    costDifference,
    remoteSavingsPercentage,
    onLocationSavingsPercentage,
    cheaperOption,
    interpretation: interpretComparison(
      cheaperOption,
      remote.employeeCount,
      onLocation.employeeCount,
      remoteSavingsPercentage,
      onLocationSavingsPercentage,
    ),
    remoteEmployees: remote.employeeCount,
    onLocationEmployees: onLocation.employeeCount,
  };
}

export function toResult(
  breakdown: ComparisonBreakdown,
  currency: SupportedCurrency,
): RemoteVsOnLocationResult {
  const r = (n: number) => roundMoney(n, currency);
  const fmt = (n: number) => formatMoney(r(n), currency);
  const fmtOpt = (n: number | null) => (n === null ? '—' : fmt(n));
  const fmtPct = (n: number | null) => (n === null ? '—' : formatPercent(n));

  return {
    ...breakdown,
    remoteOneTimeCost: r(breakdown.remoteOneTimeCost),
    remoteRecurringCost: r(breakdown.remoteRecurringCost),
    totalRemoteCost: r(breakdown.totalRemoteCost),
    remoteCostPerEmployee:
      breakdown.remoteCostPerEmployee === null
        ? null
        : r(breakdown.remoteCostPerEmployee),
    onLocationOneTimeCost: r(breakdown.onLocationOneTimeCost),
    onLocationRecurringCost: r(breakdown.onLocationRecurringCost),
    totalOnLocationCost: r(breakdown.totalOnLocationCost),
    onLocationCostPerEmployee:
      breakdown.onLocationCostPerEmployee === null
        ? null
        : r(breakdown.onLocationCostPerEmployee),
    costDifference: r(breakdown.costDifference),
    currency,
    formattedRemoteOneTimeCost: fmt(breakdown.remoteOneTimeCost),
    formattedRemoteRecurringCost: fmt(breakdown.remoteRecurringCost),
    formattedTotalRemoteCost: fmt(breakdown.totalRemoteCost),
    formattedRemoteCostPerEmployee: fmtOpt(breakdown.remoteCostPerEmployee),
    formattedOnLocationOneTimeCost: fmt(breakdown.onLocationOneTimeCost),
    formattedOnLocationRecurringCost: fmt(breakdown.onLocationRecurringCost),
    formattedTotalOnLocationCost: fmt(breakdown.totalOnLocationCost),
    formattedOnLocationCostPerEmployee: fmtOpt(breakdown.onLocationCostPerEmployee),
    formattedCostDifference: fmt(Math.abs(breakdown.costDifference)),
    formattedRemoteSavingsPercentage: fmtPct(breakdown.remoteSavingsPercentage),
    formattedOnLocationSavingsPercentage: fmtPct(breakdown.onLocationSavingsPercentage),
  };
}

export function shareResultText(
  result: RemoteVsOnLocationResult,
  path = '/tools/remote-vs-on-location-workers-calculator',
): string {
  return [
    'Remote vs. On-Location Workers Calculator — Omega Calculators',
    '',
    `Period: ${result.periodLabel}`,
    `Currency: ${result.currency} (formatting only)`,
    '',
    `Remote employees: ${result.remoteEmployees}`,
    `Remote one-time: ${result.formattedRemoteOneTimeCost} ${result.currency}`,
    `Remote recurring: ${result.formattedRemoteRecurringCost} ${result.currency}`,
    `Total remote: ${result.formattedTotalRemoteCost} ${result.currency}`,
    `Remote per employee: ${result.formattedRemoteCostPerEmployee} ${result.currency}`,
    '',
    `On-location employees: ${result.onLocationEmployees}`,
    `On-location one-time: ${result.formattedOnLocationOneTimeCost} ${result.currency}`,
    `On-location recurring: ${result.formattedOnLocationRecurringCost} ${result.currency}`,
    `Total on-location: ${result.formattedTotalOnLocationCost} ${result.currency}`,
    `On-location per employee: ${result.formattedOnLocationCostPerEmployee} ${result.currency}`,
    '',
    `Cost difference: ${result.formattedCostDifference} ${result.currency}`,
    `Cheaper on totals: ${result.cheaperOption}`,
    result.interpretation,
    path,
  ].join('\n');
}
