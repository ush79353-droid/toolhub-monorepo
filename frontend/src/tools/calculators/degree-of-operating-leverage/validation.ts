import {
  calculateContributionMargin,
  calculateContributionMarginDOL,
  calculateDegreeOfOperatingLeverage,
  calculateEBIT,
  calculateEBITChangeFromDOL,
  calculateSalesChangeFromDOL,
  formatDol,
  formatDolMoney,
  formatPercentage,
  interpretOperatingLeverage,
} from './calculation';
import type {
  DegreeOfOperatingLeverageFieldErrors,
  DegreeOfOperatingLeverageInput,
  DegreeOfOperatingLeverageResult,
} from './types';

export interface DegreeOfOperatingLeverageValidation {
  isValid: boolean;
  errors: DegreeOfOperatingLeverageFieldErrors;
  result: DegreeOfOperatingLeverageResult | null;
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

export function validateDegreeOfOperatingLeverageInput(
  input: DegreeOfOperatingLeverageInput
): DegreeOfOperatingLeverageValidation {
  const errors: DegreeOfOperatingLeverageFieldErrors = {};
  const currency = input.currency;

  if (input.method === 'contributionMargin') {
    return validateContributionMargin(input, errors, currency);
  }
  return validatePeriodChange(input, errors, currency);
}

function validatePeriodChange(
  input: DegreeOfOperatingLeverageInput,
  errors: DegreeOfOperatingLeverageFieldErrors,
  currency: DegreeOfOperatingLeverageInput['currency']
): DegreeOfOperatingLeverageValidation {
  const salesParsed = parseNumber(input.salesChangePercentage);
  const ebitParsed = parseNumber(input.ebitChangePercentage);
  const dolParsed = parseNumber(input.degreeOfOperatingLeverage);

  if (!salesParsed.blank) {
    if (salesParsed.invalid || salesParsed.value === null) {
      errors.salesChangePercentage = 'Enter a valid sales percentage change.';
    } else if (salesParsed.value < -100) {
      errors.salesChangePercentage =
        'Sales change below −100% is not valid for nonnegative sales levels.';
    }
  }

  if (!ebitParsed.blank) {
    if (ebitParsed.invalid || ebitParsed.value === null) {
      errors.ebitChangePercentage = 'Enter a valid EBIT percentage change.';
    }
  }

  if (!dolParsed.blank) {
    if (dolParsed.invalid || dolParsed.value === null) {
      errors.degreeOfOperatingLeverage = 'Enter a valid DOL coefficient.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  let salesChangePercentage: number | null = null;
  let ebitChangePercentage: number | null = null;
  let degreeOfOperatingLeverage = 0;
  let ready = false;

  if (input.mode === 'dol') {
    if (
      !salesParsed.blank &&
      !ebitParsed.blank &&
      salesParsed.value !== null &&
      ebitParsed.value !== null
    ) {
      if (Math.abs(salesParsed.value) < 1e-9) {
        return {
          isValid: false,
          errors: {
            form:
              'DOL is undefined when sales percentage change is zero. Do not divide by a zero sales change.',
          },
          result: null,
        };
      }
      const dol = calculateDegreeOfOperatingLeverage(
        ebitParsed.value,
        salesParsed.value
      );
      if (dol === null) {
        return { isValid: false, errors, result: null };
      }
      salesChangePercentage = salesParsed.value;
      ebitChangePercentage = ebitParsed.value;
      degreeOfOperatingLeverage = dol;
      ready = true;
    }
  } else if (input.mode === 'ebitChange') {
    if (
      !dolParsed.blank &&
      !salesParsed.blank &&
      dolParsed.value !== null &&
      salesParsed.value !== null
    ) {
      if (salesParsed.value < -100) {
        return {
          isValid: false,
          errors: {
            salesChangePercentage:
              'Sales change below −100% is not valid for nonnegative sales levels.',
          },
          result: null,
        };
      }
      const ebit = calculateEBITChangeFromDOL(
        dolParsed.value,
        salesParsed.value
      );
      if (ebit === null) {
        return { isValid: false, errors, result: null };
      }
      degreeOfOperatingLeverage = dolParsed.value;
      salesChangePercentage = salesParsed.value;
      ebitChangePercentage = ebit;
      ready = true;
    }
  } else {
    // salesChange mode
    if (
      !ebitParsed.blank &&
      !dolParsed.blank &&
      ebitParsed.value !== null &&
      dolParsed.value !== null
    ) {
      if (
        Math.abs(ebitParsed.value) < 1e-9 &&
        Math.abs(dolParsed.value) < 1e-9
      ) {
        return {
          isValid: false,
          errors: {
            form:
              'When both EBIT change and DOL are zero, sales change is not uniquely determined.',
          },
          result: null,
        };
      }
      if (Math.abs(dolParsed.value) < 1e-9) {
        return {
          isValid: false,
          errors: {
            degreeOfOperatingLeverage:
              'Sales change is undefined when DOL is zero and EBIT change is nonzero.',
          },
          result: null,
        };
      }
      const sales = calculateSalesChangeFromDOL(
        ebitParsed.value,
        dolParsed.value
      );
      if (sales === null) {
        return { isValid: false, errors, result: null };
      }
      if (sales < -100) {
        return {
          isValid: false,
          errors: {
            form:
              'Implied sales change is below −100%, which is not valid for nonnegative sales levels.',
          },
          result: null,
        };
      }
      ebitChangePercentage = ebitParsed.value;
      degreeOfOperatingLeverage = dolParsed.value;
      salesChangePercentage = sales;
      ready = true;
    }
  }

  if (!ready) {
    return { isValid: false, errors, result: null };
  }

  const result: DegreeOfOperatingLeverageResult = {
    salesChangePercentage,
    ebitChangePercentage,
    contributionMargin: null,
    operatingIncome: null,
    degreeOfOperatingLeverage,
    status: 'valid',
    interpretation: interpretOperatingLeverage(
      degreeOfOperatingLeverage,
      'periodChange'
    ),
    warningMessage: null,
    method: 'periodChange',
    currency,
    formattedSalesChangePercentage:
      salesChangePercentage === null
        ? null
        : formatPercentage(salesChangePercentage),
    formattedEbitChangePercentage:
      ebitChangePercentage === null
        ? null
        : formatPercentage(ebitChangePercentage),
    formattedContributionMargin: null,
    formattedOperatingIncome: null,
    formattedDegreeOfOperatingLeverage: formatDol(degreeOfOperatingLeverage),
  };

  return { isValid: true, errors, result };
}

function validateContributionMargin(
  input: DegreeOfOperatingLeverageInput,
  errors: DegreeOfOperatingLeverageFieldErrors,
  currency: DegreeOfOperatingLeverageInput['currency']
): DegreeOfOperatingLeverageValidation {
  const salesParsed = parseNumber(input.salesRevenue);
  const variableParsed = parseNumber(input.variableCosts);
  const fixedParsed = parseNumber(input.fixedOperatingCosts);

  if (!salesParsed.blank) {
    if (salesParsed.invalid || salesParsed.value === null) {
      errors.salesRevenue = 'Enter a valid sales revenue.';
    } else if (salesParsed.value < 0) {
      errors.salesRevenue = 'Sales revenue cannot be negative.';
    }
  }
  if (!variableParsed.blank) {
    if (variableParsed.invalid || variableParsed.value === null) {
      errors.variableCosts = 'Enter a valid variable cost amount.';
    } else if (variableParsed.value < 0) {
      errors.variableCosts = 'Variable costs cannot be negative.';
    }
  }
  if (!fixedParsed.blank) {
    if (fixedParsed.invalid || fixedParsed.value === null) {
      errors.fixedOperatingCosts = 'Enter a valid fixed operating cost.';
    } else if (fixedParsed.value < 0) {
      errors.fixedOperatingCosts = 'Fixed operating costs cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    salesParsed.blank ||
    variableParsed.blank ||
    fixedParsed.blank ||
    salesParsed.value === null ||
    variableParsed.value === null ||
    fixedParsed.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const contributionMargin = calculateContributionMargin(
    salesParsed.value,
    variableParsed.value
  );
  if (contributionMargin === null) {
    return { isValid: false, errors, result: null };
  }

  const operatingIncome = calculateEBIT(
    contributionMargin,
    fixedParsed.value
  );
  if (operatingIncome === null) {
    return { isValid: false, errors, result: null };
  }

  if (Math.abs(operatingIncome) < 1e-9) {
    return {
      isValid: false,
      errors: {
        form:
          'DOL is undefined when EBIT is zero under the contribution-margin method (division by zero).',
      },
      result: null,
    };
  }

  const dol = calculateContributionMarginDOL(
    contributionMargin,
    operatingIncome
  );
  if (dol === null) {
    return { isValid: false, errors, result: null };
  }

  const warningMessage =
    operatingIncome < 0
      ? 'EBIT is negative. A signed DOL is mathematically defined but does not convey ordinary positive-profit leverage intuition.'
      : null;

  const result: DegreeOfOperatingLeverageResult = {
    salesChangePercentage: null,
    ebitChangePercentage: null,
    contributionMargin,
    operatingIncome,
    degreeOfOperatingLeverage: dol,
    status: 'valid',
    interpretation: interpretOperatingLeverage(dol, 'contributionMargin'),
    warningMessage,
    method: 'contributionMargin',
    currency,
    formattedSalesChangePercentage: null,
    formattedEbitChangePercentage: null,
    formattedContributionMargin: formatDolMoney(contributionMargin, currency),
    formattedOperatingIncome: formatDolMoney(operatingIncome, currency),
    formattedDegreeOfOperatingLeverage: formatDol(dol),
  };

  return { isValid: true, errors, result };
}
