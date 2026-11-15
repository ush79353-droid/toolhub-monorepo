import { isSupportedCurrency } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type {
  CustomerAcquisitionCostFieldErrors,
  CustomerAcquisitionCostInput,
} from './types';

function parseOptionalNumber(value: string): number | null | typeof Number.NaN {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateCustomerAcquisitionCostInput(input: CustomerAcquisitionCostInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: CustomerAcquisitionCostFieldErrors;
  parsed: {
    costOfMarketing: number;
    costOfSales: number;
    newCustomers: number;
    currency: SupportedCurrency;
  } | null;
} {
  const errors: CustomerAcquisitionCostFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  const marketing = parseOptionalNumber(input.costOfMarketing);
  const sales = parseOptionalNumber(input.costOfSales);
  const customers = parseOptionalNumber(input.newCustomers);

  if (marketing === null || sales === null || customers === null) {
    return {
      isValid: false,
      incomplete: Object.keys(errors).length === 0,
      errors,
      parsed: null,
    };
  }

  if (Number.isNaN(marketing) || marketing < 0) {
    errors.costOfMarketing = 'Enter a valid non-negative marketing cost';
  }
  if (Number.isNaN(sales) || sales < 0) {
    errors.costOfSales = 'Enter a valid non-negative sales cost';
  }
  if (Number.isNaN(customers) || customers <= 0) {
    errors.newCustomers = 'Number of new customers must be greater than zero';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, parsed: null };
  }

  return {
    isValid: true,
    incomplete: false,
    errors: {},
    parsed: {
      costOfMarketing: marketing,
      costOfSales: sales,
      newCustomers: customers,
      currency: input.currency,
    },
  };
}
