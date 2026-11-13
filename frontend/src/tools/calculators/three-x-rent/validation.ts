import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  MAX_MONEY,
  MAX_MULTIPLIER,
  MAX_TENANT_COUNT,
  MIN_TENANT_COUNT,
  RESULT_CAP,
  SHARE_SUM_TOLERANCE,
  type ThreeXRentFieldErrors,
  type ThreeXRentInput,
} from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function moneyProblem(value: number | null): 'blank' | 'bad' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value) || value < 0 || value > MAX_MONEY) return 'bad';
  return 'ok';
}

function moneyMessage(value: number | null, label: string): string {
  if (value !== null && Number.isFinite(value) && value < 0) {
    return `${label} cannot be negative.`;
  }
  if (value !== null && Number.isFinite(value) && value > MAX_MONEY) {
    return `Enter a ${label.toLowerCase()} of 1,000,000,000,000 or less.`;
  }
  return `Enter a ${label.toLowerCase()} of 0 or more.`;
}

export function validateThreeXRent(input: ThreeXRentInput): {
  isValid: boolean;
  errors: ThreeXRentFieldErrors;
} {
  const errors: ThreeXRentFieldErrors = {};
  let blank = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a currency from the list.';
  }

  const multiplier = input.multiplier;
  if (multiplier === null) {
    blank = true;
  } else if (!Number.isFinite(multiplier) || multiplier <= 0 || multiplier > MAX_MULTIPLIER) {
    errors.multiplier =
      multiplier !== null && Number.isFinite(multiplier) && multiplier > MAX_MULTIPLIER
        ? 'Enter a multiplier of 100 or less.'
        : 'Enter a multiplier greater than 0.';
  }

  let tenantCount = 1;
  if (input.multipleTenants) {
    const count = input.tenantCount;
    if (count === null) {
      blank = true;
    } else if (!Number.isInteger(count) || count < MIN_TENANT_COUNT || count > MAX_TENANT_COUNT) {
      errors.tenantCount =
        Number.isFinite(count) && count > MAX_TENANT_COUNT
          ? `Enter ${MAX_TENANT_COUNT} tenants or fewer.`
          : `Enter a whole number of tenants from ${MIN_TENANT_COUNT} to ${MAX_TENANT_COUNT}.`;
    } else {
      tenantCount = count;
    }
  }

  if (input.mode === 'required-income') {
    const rentState = moneyProblem(input.monthlyRent);
    if (rentState === 'blank') blank = true;
    if (rentState === 'bad') errors.monthlyRent = moneyMessage(input.monthlyRent, 'Monthly rent');

    if (input.multipleTenants && input.split === 'custom' && !errors.tenantCount && input.tenantCount !== null) {
      const shares = input.sharePercents;
      if (shares.length !== tenantCount) {
        errors.sharePercents = 'Enter one income share for each tenant.';
      } else if (shares.some((share) => share === null)) {
        blank = true;
      } else if (shares.some((share) => share === null || !Number.isFinite(share) || share < 0 || share > 100)) {
        errors.sharePercents = 'Each share must be a percent from 0 to 100.';
      } else {
        const sum = shares.reduce<number>((acc, share) => acc + (share ?? 0), 0);
        if (Math.abs(sum - 100) > SHARE_SUM_TOLERANCE) {
          errors.sharePercents = 'Income shares must add up to 100%.';
        }
      }
    }

    if (
      !blank &&
      !errors.monthlyRent &&
      !errors.multiplier &&
      input.monthlyRent !== null &&
      multiplier !== null &&
      Number.isFinite(multiplier) &&
      multiplier > 0
    ) {
      const required = input.monthlyRent * multiplier;
      if (!Number.isFinite(required) || required > RESULT_CAP || required * 12 > RESULT_CAP) {
        errors.monthlyRent = 'That rent and multiplier are outside the supported range.';
      }
    }
  } else {
    const incomes = input.multipleTenants
      ? input.tenantIncomes.slice(0, tenantCount)
      : [input.grossMonthlyIncome];

    if (input.multipleTenants && !errors.tenantCount && input.tenantCount !== null) {
      if (input.tenantIncomes.length < tenantCount) {
        errors.tenantIncomes = 'Enter a gross monthly income for every tenant.';
      }
    }

    if (!errors.tenantIncomes) {
      let anyBlank = false;
      let anyBad = false;
      let sample: number | null = null;
      for (const income of incomes) {
        const state = moneyProblem(income);
        if (state === 'blank') anyBlank = true;
        if (state === 'bad') {
          anyBad = true;
          sample = income;
        }
      }
      if (anyBad) {
        const message = moneyMessage(sample, 'Gross monthly income');
        if (input.multipleTenants) errors.tenantIncomes = message;
        else errors.grossMonthlyIncome = message;
      } else if (anyBlank) {
        blank = true;
      } else {
        const combined = incomes.reduce<number>((acc, income) => acc + (income ?? 0), 0);
        if (!Number.isFinite(combined) || combined > RESULT_CAP) {
          const message = 'Combined gross income is outside the supported range.';
          if (input.multipleTenants) errors.tenantIncomes = message;
          else errors.grossMonthlyIncome = message;
        } else if (
          multiplier !== null &&
          Number.isFinite(multiplier) &&
          multiplier > 0 &&
          combined / multiplier > RESULT_CAP
        ) {
          errors.multiplier = 'That income and multiplier are outside the supported range.';
        }
      }
    }
  }

  return { isValid: !blank && Object.keys(errors).length === 0, errors };
}
