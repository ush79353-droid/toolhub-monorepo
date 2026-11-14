import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateSalesCommission } from './calculation';
import {
  COMMISSION_BASES,
  usesBasePayTarget,
  usesGrossMarginTarget,
  usesManualQuota,
  type SalesCommissionFieldErrors,
  type SalesCommissionInput,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function requireMoney(
  errors: SalesCommissionFieldErrors,
  key: string,
  value: number,
  label: string,
  { allowNegative = false }: { allowNegative?: boolean } = {}
): void {
  if (!finite(value)) {
    errors[key] = `Enter ${label}`;
    return;
  }
  if (!allowNegative && value < 0) {
    errors[key] = `${label} cannot be negative`;
  }
}

function requirePercent(
  errors: SalesCommissionFieldErrors,
  key: string,
  value: number,
  label: string,
  { allowZero = true, max = 100 }: { allowZero?: boolean; max?: number } = {}
): void {
  if (!finite(value)) {
    errors[key] = `Enter ${label}`;
    return;
  }
  if (value < 0 || (!allowZero && value === 0)) {
    errors[key] = allowZero ? `${label} cannot be negative` : `${label} must be greater than zero`;
    return;
  }
  if (value > max) {
    errors[key] = `${label} cannot exceed ${max}%`;
  }
}

export function validateSalesCommission(
  input: SalesCommissionInput
): { isValid: boolean; errors: SalesCommissionFieldErrors } {
  const errors: SalesCommissionFieldErrors = {};

  if (!COMMISSION_BASES.includes(input.commissionBase)) {
    errors.commissionBase = 'Choose how commission is based';
  }
  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  requireMoney(errors, 'revenue', input.revenue, 'gross sales or revenue');
  requireMoney(errors, 'cogs', input.cogs, 'cost of goods sold');
  requireMoney(errors, 'sellingExpenses', input.sellingExpenses, 'selling expenses');
  requirePercent(errors, 'discountRatePercent', input.discountRatePercent, 'discount rate');
  requireMoney(errors, 'baseSalary', input.baseSalary, 'base salary');
  requirePercent(errors, 'commissionRatePercent', input.commissionRatePercent, 'commission rate', {
    allowZero: true,
  });

  if (usesManualQuota(input.commissionBase)) {
    requireMoney(errors, 'salesQuota', input.salesQuota, 'sales threshold');
  }
  if (usesBasePayTarget(input.commissionBase)) {
    requirePercent(errors, 'basePayTargetPercent', input.basePayTargetPercent, 'base pay target', {
      allowZero: false,
    });
  }
  if (usesGrossMarginTarget(input.commissionBase)) {
    requirePercent(
      errors,
      'grossMarginTargetPercent',
      input.grossMarginTargetPercent,
      'gross margin target',
      { allowZero: false, max: 99.99 }
    );
  }

  if (Object.keys(errors).length > 0) return { isValid: false, errors };

  const result = calculateSalesCommission(input);
  if (!result.defined) {
    errors.form = result.explanation ?? 'This calculation is undefined.';
    return { isValid: false, errors };
  }

  return { isValid: true, errors };
}

export function parseOptionalNumber(raw: string): number {
  const text = raw.trim().replace(/,/g, '');
  if (text === '') return Number.NaN;
  return Number(text);
}
