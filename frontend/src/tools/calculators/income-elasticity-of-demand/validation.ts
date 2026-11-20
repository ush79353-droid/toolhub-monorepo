import {
  calculateIncomeElasticity,
  calculateIncomePercentageChange,
  calculateQuantityPercentageChange,
  classifyIncomeElasticity,
  formatPercentageChange,
  formatYed,
  interpretIncomeElasticity,
} from './calculation';
import type {
  IncomeElasticityOfDemandFieldErrors,
  IncomeElasticityOfDemandInput,
  IncomeElasticityOfDemandResult,
  IncomeElasticityStatus,
} from './types';

export interface IncomeElasticityOfDemandValidation {
  isValid: boolean;
  errors: IncomeElasticityOfDemandFieldErrors;
  result: IncomeElasticityOfDemandResult | null;
}

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

export function validateIncomeElasticityOfDemandInput(
  input: IncomeElasticityOfDemandInput
): IncomeElasticityOfDemandValidation {
  const errors: IncomeElasticityOfDemandFieldErrors = {};
  const currency = input.currency;
  const method = input.method;

  const y1 = parseNumber(input.incomePeriod1);
  const y2 = parseNumber(input.incomePeriod2);
  const q1 = parseNumber(input.quantityPeriod1);
  const q2 = parseNumber(input.quantityPeriod2);

  if (!y1.blank) {
    if (y1.invalid || y1.value === null) {
      errors.incomePeriod1 = 'Enter a valid income for period 1.';
    } else if (y1.value <= 0) {
      errors.incomePeriod1 =
        method === 'standard'
          ? 'Period 1 income must be greater than zero for the Standard method.'
          : 'Income must be positive under the household-income model.';
    }
  }

  if (!y2.blank) {
    if (y2.invalid || y2.value === null) {
      errors.incomePeriod2 = 'Enter a valid income for period 2.';
    } else if (y2.value <= 0) {
      errors.incomePeriod2 =
        'Income must be positive under the household-income model.';
    }
  }

  if (!q1.blank) {
    if (q1.invalid || q1.value === null) {
      errors.quantityPeriod1 = 'Enter a valid quantity demanded for period 1.';
    } else if (q1.value < 0) {
      errors.quantityPeriod1 = 'Quantity demanded cannot be negative.';
    } else if (method === 'standard' && q1.value === 0) {
      errors.quantityPeriod1 =
        'Period 1 quantity must be greater than zero for the Standard method.';
    }
  }

  if (!q2.blank) {
    if (q2.invalid || q2.value === null) {
      errors.quantityPeriod2 = 'Enter a valid quantity demanded for period 2.';
    } else if (q2.value < 0) {
      errors.quantityPeriod2 = 'Quantity demanded cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    y1.blank ||
    y2.blank ||
    q1.blank ||
    q2.blank ||
    y1.value === null ||
    y2.value === null ||
    q1.value === null ||
    q2.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const incomePercentageChange = calculateIncomePercentageChange(
    y1.value,
    y2.value,
    method
  );
  const quantityPercentageChange = calculateQuantityPercentageChange(
    q1.value,
    q2.value,
    method
  );

  if (incomePercentageChange === null) {
    return {
      isValid: false,
      errors: {
        form:
          method === 'midpoint'
            ? 'Income percentage change is undefined when average income is zero.'
            : 'Income percentage change is undefined under the Standard method for these inputs.',
      },
      result: null,
    };
  }

  if (quantityPercentageChange === null) {
    return {
      isValid: false,
      errors: {
        form:
          method === 'midpoint'
            ? 'Quantity percentage change is undefined when average quantity is zero.'
            : 'Quantity percentage change is undefined under the Standard method for these inputs.',
      },
      result: null,
    };
  }

  let status: IncomeElasticityStatus = 'valid';
  let warningMessage: string | null =
    'YED = %Δ quantity demanded ÷ %Δ income. Coefficient is dimensionless (not a percent). Amounts share one currency label (no FX conversion).';
  let yed: number | null = null;
  let isValid = true;

  if (incomePercentageChange === 0 && quantityPercentageChange === 0) {
    status = 'indeterminate';
    isValid = false;
    warningMessage =
      'Income elasticity is indeterminate when both income and quantity percentage changes are zero (0/0).';
    errors.form = warningMessage;
  } else if (incomePercentageChange === 0) {
    status = 'zeroIncomeChange';
    isValid = false;
    warningMessage =
      'Income elasticity cannot be calculated because the percentage change in income is zero.';
    errors.form = warningMessage;
  } else {
    yed = calculateIncomeElasticity(
      quantityPercentageChange,
      incomePercentageChange
    );
    if (yed === null) {
      return { isValid: false, errors, result: null };
    }
  }

  const classification =
    yed === null ? 'unknown' : classifyIncomeElasticity(yed);

  const result: IncomeElasticityOfDemandResult = {
    incomePercentageChange,
    quantityPercentageChange,
    incomeElasticityOfDemand: yed,
    classification,
    status,
    interpretation:
      yed === null
        ? warningMessage ??
          'Income elasticity of demand could not be determined.'
        : interpretIncomeElasticity(yed, classification),
    warningMessage,
    method,
    currency,
    formattedIncomePercentageChange: formatPercentageChange(
      incomePercentageChange
    ),
    formattedQuantityPercentageChange: formatPercentageChange(
      quantityPercentageChange
    ),
    formattedIncomeElasticity: yed === null ? null : formatYed(yed),
  };

  if (status === 'zeroIncomeChange' || status === 'indeterminate') {
    return { isValid: false, errors, result };
  }

  return { isValid, errors, result };
}
