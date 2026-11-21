import { calculateCltvFromInput } from './calculation';
import type { CltvFieldErrors, CltvInput, CltvResult } from './types';

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export interface CltvValidation {
  isValid: boolean;
  errors: CltvFieldErrors;
  result: CltvResult | null;
}

function hasErrors(errors: CltvFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(input: CltvInput): CltvFieldErrors {
  const errors: CltvFieldErrors = {};

  if (input.useBusinessData) {
    const revenue = parseNumber(input.totalRevenue);
    if (revenue.blank) errors.totalRevenue = 'Enter total revenue.';
    else if (revenue.invalid || revenue.value == null)
      errors.totalRevenue = 'Enter a valid total revenue.';
    else if (revenue.value < 0)
      errors.totalRevenue = 'Total revenue cannot be negative.';

    const purchases = parseNumber(input.totalPurchases);
    if (purchases.blank) errors.totalPurchases = 'Enter total purchases.';
    else if (purchases.invalid || purchases.value == null)
      errors.totalPurchases = 'Enter a valid number of purchases.';
    else if (purchases.value <= 0)
      errors.totalPurchases = 'Total purchases must be greater than zero.';

    const customers = parseNumber(input.numberOfCustomers);
    if (customers.blank) errors.numberOfCustomers = 'Enter number of customers.';
    else if (customers.invalid || customers.value == null)
      errors.numberOfCustomers = 'Enter a valid number of customers.';
    else if (customers.value <= 0)
      errors.numberOfCustomers = 'Number of customers must be greater than zero.';

    if (input.reportingPeriod === 'custom') {
      const months = parseNumber(input.customPeriodMonths);
      if (months.blank)
        errors.customPeriodMonths = 'Enter a valid reporting period.';
      else if (months.invalid || months.value == null)
        errors.customPeriodMonths = 'Enter a valid reporting period.';
      else if (months.value <= 0)
        errors.customPeriodMonths =
          'Reporting period must be greater than zero months.';
    }
  } else {
    const apv = parseNumber(input.averagePurchaseValue);
    if (apv.blank)
      errors.averagePurchaseValue = 'Enter a valid average purchase value.';
    else if (apv.invalid || apv.value == null)
      errors.averagePurchaseValue = 'Enter a valid average purchase value.';
    else if (apv.value < 0)
      errors.averagePurchaseValue =
        'Average purchase value cannot be negative.';

    const apf = parseNumber(input.averagePurchaseFrequency);
    if (apf.blank)
      errors.averagePurchaseFrequency =
        'Enter a valid average purchase frequency.';
    else if (apf.invalid || apf.value == null)
      errors.averagePurchaseFrequency =
        'Enter a valid average purchase frequency.';
    else if (apf.value < 0)
      errors.averagePurchaseFrequency =
        'Average purchase frequency cannot be negative.';
  }

  if (input.useChurnLifespan) {
    const churn = parseNumber(input.annualChurnRate);
    if (churn.blank) errors.annualChurnRate = 'Enter the annual churn rate.';
    else if (churn.invalid || churn.value == null)
      errors.annualChurnRate = 'Enter a valid annual churn rate.';
    else if (churn.value <= 0 || churn.value > 100)
      errors.annualChurnRate =
        'Annual churn rate must be greater than 0% and at most 100%.';
  }

  const life = parseNumber(input.averageCustomerLifespan);
  if (!input.useChurnLifespan || !life.blank) {
    if (life.blank && !input.useChurnLifespan) {
      errors.averageCustomerLifespan =
        'Customer lifespan must be greater than zero.';
    } else if (!life.blank) {
      if (life.invalid || life.value == null)
        errors.averageCustomerLifespan =
          'Enter a valid customer lifespan in years.';
      else if (life.value <= 0)
        errors.averageCustomerLifespan =
          'Customer lifespan must be greater than zero.';
    }
  }

  if (input.useGrossMargin) {
    const m = parseNumber(input.grossProfitMargin);
    if (m.blank) errors.grossProfitMargin = 'Enter gross profit margin.';
    else if (m.invalid || m.value == null)
      errors.grossProfitMargin = 'Enter a valid gross profit margin.';
    else if (m.value < 0 || m.value > 100)
      errors.grossProfitMargin =
        'Gross profit margin must be between 0% and 100%.';
  }

  if (input.useCac) {
    const cac = parseNumber(input.customerAcquisitionCost);
    if (cac.blank)
      errors.customerAcquisitionCost = 'Enter customer acquisition cost.';
    else if (cac.invalid || cac.value == null)
      errors.customerAcquisitionCost =
        'Enter a valid customer acquisition cost.';
    else if (cac.value < 0)
      errors.customerAcquisitionCost = 'CAC cannot be negative.';
    else if (cac.value === 0)
      errors.customerAcquisitionCost =
        'CAC must be greater than zero to calculate the CLTV:CAC ratio.';
  }

  if (input.useDiscounted) {
    const r = parseNumber(input.discountRate);
    if (r.blank) errors.discountRate = 'Enter the annual discount rate.';
    else if (r.invalid || r.value == null)
      errors.discountRate = 'Enter a valid annual discount rate.';
    else if (r.value <= -100)
      errors.discountRate =
        'Discount rate must be greater than -100%.';
  }

  return errors;
}

export function validateCltvInput(input: CltvInput): CltvValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateCltvFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
