import {
  calculateCanadianMortgage,
  formatPayoffDate,
  formatUsdAmount,
} from './calculation';
import type {
  CanadianMortgageFieldErrors,
  CanadianMortgageInput,
  CanadianMortgageResult,
} from './types';

export interface CanadianMortgageValidation {
  isValid: boolean;
  errors: CanadianMortgageFieldErrors;
  result: CanadianMortgageResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function requireNonNegativeMoney(
  raw: string,
  label: string
): { value: number | null; error?: string } {
  const parsed = parseNumber(raw);
  if (parsed.blank) return { value: null, error: `Enter ${label}.` };
  if (parsed.invalid || parsed.value === null) {
    return { value: null, error: `Enter a valid ${label}.` };
  }
  if (parsed.value < 0) return { value: null, error: `${label} cannot be negative.` };
  return { value: parsed.value };
}

export function validateCanadianMortgageInput(
  input: CanadianMortgageInput
): CanadianMortgageValidation {
  const errors: CanadianMortgageFieldErrors = {};

  const home = parseNumber(input.homePrice);
  const down = parseNumber(input.downPaymentPercent);
  const term = parseNumber(input.loanTermYears);
  const rate = parseNumber(input.interestRatePercent);
  const startMonth = parseNumber(input.startMonth);
  const startYear = parseNumber(input.startYear);

  if (home.blank) {
    errors.homePrice = 'Enter a home price.';
  } else if (home.invalid || home.value === null) {
    errors.homePrice = 'Enter a valid home price.';
  } else if (!(home.value > 0)) {
    errors.homePrice = 'Home price must be greater than zero.';
  }

  if (down.blank) {
    errors.downPaymentPercent = 'Enter a down payment percentage.';
  } else if (down.invalid || down.value === null) {
    errors.downPaymentPercent = 'Enter a valid down payment percentage.';
  } else if (down.value < 0) {
    errors.downPaymentPercent = 'Down payment cannot be negative.';
  } else if (!(down.value < 100)) {
    errors.downPaymentPercent = 'Down payment must be less than 100%.';
  }

  if (term.blank) {
    errors.loanTermYears = 'Enter a loan term in years.';
  } else if (term.invalid || term.value === null) {
    errors.loanTermYears = 'Enter a valid loan term.';
  } else if (!(term.value > 0)) {
    errors.loanTermYears = 'Loan term must be greater than zero.';
  } else if (!Number.isInteger(term.value)) {
    errors.loanTermYears = 'Loan term years must be a whole number.';
  } else if (term.value > 50) {
    errors.loanTermYears = 'Loan term cannot exceed 50 years.';
  }

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (startMonth.blank) {
    errors.startMonth = 'Select a start month.';
  } else if (
    startMonth.invalid ||
    startMonth.value === null ||
    !Number.isInteger(startMonth.value) ||
    startMonth.value < 1 ||
    startMonth.value > 12
  ) {
    errors.startMonth = 'Select a valid start month.';
  }

  if (startYear.blank) {
    errors.startYear = 'Enter a start year.';
  } else if (
    startYear.invalid ||
    startYear.value === null ||
    !Number.isInteger(startYear.value)
  ) {
    errors.startYear = 'Enter a valid start year.';
  } else if (startYear.value < 1900 || startYear.value > 2200) {
    errors.startYear = 'Start year must be between 1900 and 2200.';
  }

  let propertyTaxPercent = 0;
  let homeInsuranceAnnual = 0;
  let mortgageInsuranceAnnual = 0;
  let condoHoaFeeAnnual = 0;
  let otherCostsAnnual = 0;

  if (input.includeOptionals) {
    const tax = parseNumber(input.propertyTaxPercent);
    if (tax.blank) {
      errors.propertyTaxPercent = 'Enter a property tax percentage.';
    } else if (tax.invalid || tax.value === null) {
      errors.propertyTaxPercent = 'Enter a valid property tax percentage.';
    } else if (tax.value < 0) {
      errors.propertyTaxPercent = 'Property tax cannot be negative.';
    } else {
      propertyTaxPercent = tax.value;
    }

    const insurance = requireNonNegativeMoney(
      input.homeInsuranceAnnual,
      'home insurance'
    );
    if (insurance.error) errors.homeInsuranceAnnual = insurance.error;
    else homeInsuranceAnnual = insurance.value!;

    const mi = requireNonNegativeMoney(
      input.mortgageInsuranceAnnual,
      'mortgage insurance'
    );
    if (mi.error) errors.mortgageInsuranceAnnual = mi.error;
    else mortgageInsuranceAnnual = mi.value!;

    const hoa = requireNonNegativeMoney(input.condoHoaFeeAnnual, 'condo/HOA fee');
    if (hoa.error) errors.condoHoaFeeAnnual = hoa.error;
    else condoHoaFeeAnnual = hoa.value!;

    const other = requireNonNegativeMoney(input.otherCostsAnnual, 'other costs');
    if (other.error) errors.otherCostsAnnual = other.error;
    else otherCostsAnnual = other.value!;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCanadianMortgage({
    homePrice: home.value!,
    downPaymentPercent: down.value!,
    loanTermYears: term.value!,
    interestRatePercent: rate.value!,
    includeOptionals: input.includeOptionals,
    propertyTaxPercent,
    homeInsuranceAnnual,
    mortgageInsuranceAnnual,
    condoHoaFeeAnnual,
    otherCostsAnnual,
    startMonth: startMonth.value!,
    startYear: startYear.value!,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: CanadianMortgageResult = {
    ...computed,
    formattedPayoffDate: formatPayoffDate(computed.payoffMonth, computed.payoffYear),
    formattedHomePrice: formatUsdAmount(computed.homePrice),
    formattedDownPayment: formatUsdAmount(computed.downPayment),
    formattedLoanAmount: formatUsdAmount(computed.loanAmount),
    formattedMonthlyMortgagePayment: formatUsdAmount(computed.monthlyMortgagePayment),
    formattedTotalMortgagePayments: formatUsdAmount(computed.totalMortgagePayments),
    formattedTotalInterest: formatUsdAmount(computed.totalInterest),
    formattedMonthlyPropertyTax: formatUsdAmount(computed.monthlyPropertyTax),
    formattedTotalPropertyTax: formatUsdAmount(computed.totalPropertyTax),
    formattedMonthlyHomeInsurance: formatUsdAmount(computed.monthlyHomeInsurance),
    formattedTotalHomeInsurance: formatUsdAmount(computed.totalHomeInsurance),
    formattedMonthlyMortgageInsurance: formatUsdAmount(
      computed.monthlyMortgageInsurance
    ),
    formattedTotalMortgageInsurance: formatUsdAmount(computed.totalMortgageInsurance),
    formattedMonthlyCondoHoa: formatUsdAmount(computed.monthlyCondoHoa),
    formattedTotalCondoHoa: formatUsdAmount(computed.totalCondoHoa),
    formattedMonthlyOtherCosts: formatUsdAmount(computed.monthlyOtherCosts),
    formattedTotalOtherCosts: formatUsdAmount(computed.totalOtherCosts),
    formattedMonthlyOutOfPocket: formatUsdAmount(computed.monthlyOutOfPocket),
    formattedTotalOutOfPocket: formatUsdAmount(computed.totalOutOfPocket),
  };

  return { isValid: true, errors: {}, result };
}
