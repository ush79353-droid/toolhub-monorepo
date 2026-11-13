import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  MAX_MONEY,
  MAX_SHARES,
  REPORTING_PERIODS,
  type AffoFieldErrors,
  type AffoInput,
  type ReportingPeriod,
} from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function moneyMessage(value: number, label: string): string | undefined {
  if (!Number.isFinite(value)) return `Enter a number for ${label}.`;
  if (Math.abs(value) > MAX_MONEY) return `${label} is too large.`;
  return undefined;
}

function isPeriod(value: string): value is ReportingPeriod {
  return (REPORTING_PERIODS as readonly string[]).includes(value);
}

export function validateAffo(input: AffoInput): { isValid: boolean; errors: AffoFieldErrors } {
  const errors: AffoFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }
  if (!isPeriod(input.period)) {
    errors.period = 'Choose annual, quarterly, or monthly.';
  }

  const required: Array<[keyof AffoInput, string]> = [
    ['netIncome', 'Net income'],
    ['realEstateDepreciation', 'Eligible depreciation and amortization'],
    ['propertySaleLosses', 'Eligible property-sale losses'],
    ['propertySaleGains', 'Eligible property-sale gains'],
    ['interestIncome', 'Interest income'],
    ['straightLineRentAdjustment', 'Straight-line rent adjustment'],
    ['recurringMaintenanceCapex', 'Recurring maintenance capital expenditures'],
    ['maintenanceAdjustment', 'Maintenance adjustment'],
    ['noncashCompensation', 'Noncash compensation'],
    ['debtIssuanceAmortization', 'Debt issuance cost amortization'],
    ['leaseAmortizationAdjustment', 'Lease amortization adjustment'],
  ];

  for (const [key, label] of required) {
    const message = moneyMessage(input[key] as number, label);
    if (message) errors[key as keyof AffoFieldErrors] = message;
  }

  if (input.dilutedShares !== null) {
    if (!Number.isFinite(input.dilutedShares) || input.dilutedShares <= 0 || input.dilutedShares > MAX_SHARES) {
      errors.dilutedShares = 'Diluted shares must be greater than zero.';
    }
  }

  if (input.dividends !== null) {
    const message = moneyMessage(input.dividends, 'Dividends');
    if (message) errors.dividends = message;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
