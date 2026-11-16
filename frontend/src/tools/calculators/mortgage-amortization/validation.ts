import {
  calculateMortgageAmortization,
  formatUsdAmount,
} from './calculation';
import type {
  MortgageAmortizationFieldErrors,
  MortgageAmortizationInput,
  MortgageAmortizationResult,
} from './types';

export interface MortgageAmortizationValidation {
  isValid: boolean;
  errors: MortgageAmortizationFieldErrors;
  result: MortgageAmortizationResult | null;
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

export function validateMortgageAmortizationInput(
  input: MortgageAmortizationInput
): MortgageAmortizationValidation {
  const errors: MortgageAmortizationFieldErrors = {};

  const home = parseNumber(input.homePrice);
  const downPct = parseNumber(input.downPaymentPercent);
  const years = parseNumber(input.loanTermYears);
  const rate = parseNumber(input.interestRatePercent);
  const taxPct = parseNumber(input.propertyTaxPercent);
  const insurance = parseNumber(input.homeInsuranceAnnual);
  const pmi = parseNumber(input.pmiInsuranceAnnual);
  const hoa = parseNumber(input.hoaFeeAnnual);
  const other = parseNumber(input.otherCostsAnnual);
  const startYear = parseNumber(input.startYear);

  if (home.blank) {
    errors.homePrice = 'Enter a home price.';
  } else if (home.invalid || home.value === null) {
    errors.homePrice = 'Enter a valid home price.';
  } else if (!(home.value > 0)) {
    errors.homePrice = 'Home price must be greater than zero.';
  }

  if (downPct.blank) {
    errors.downPaymentPercent = 'Enter a down payment percentage.';
  } else if (downPct.invalid || downPct.value === null) {
    errors.downPaymentPercent = 'Enter a valid down payment percentage.';
  } else if (downPct.value < 0 || downPct.value >= 100) {
    errors.downPaymentPercent = 'Down payment must be at least 0% and less than 100%.';
  }

  if (years.blank) {
    errors.loanTermYears = 'Enter a loan term in years.';
  } else if (years.invalid || years.value === null) {
    errors.loanTermYears = 'Enter a valid loan term.';
  } else if (!(years.value > 0) || !Number.isInteger(years.value)) {
    errors.loanTermYears = 'Loan term years must be a positive whole number.';
  }

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (startYear.blank) {
    errors.startYear = 'Enter a start year.';
  } else if (startYear.invalid || startYear.value === null) {
    errors.startYear = 'Enter a valid start year.';
  } else if (!Number.isInteger(startYear.value) || startYear.value < 1900) {
    errors.startYear = 'Enter a valid start year.';
  }

  if (!(input.startMonth >= 1 && input.startMonth <= 12)) {
    errors.form = 'Select a valid start month.';
  }

  if (input.includeOptionals) {
    if (taxPct.blank) {
      errors.propertyTaxPercent = 'Enter a property tax rate (0 allowed).';
    } else if (taxPct.invalid || taxPct.value === null) {
      errors.propertyTaxPercent = 'Enter a valid property tax rate.';
    } else if (taxPct.value < 0) {
      errors.propertyTaxPercent = 'Property tax rate cannot be negative.';
    }

    if (insurance.blank) {
      errors.homeInsuranceAnnual = 'Enter home insurance (0 allowed).';
    } else if (insurance.invalid || insurance.value === null) {
      errors.homeInsuranceAnnual = 'Enter a valid home insurance amount.';
    } else if (insurance.value < 0) {
      errors.homeInsuranceAnnual = 'Home insurance cannot be negative.';
    }

    if (pmi.blank) {
      errors.pmiInsuranceAnnual = 'Enter PMI (0 allowed).';
    } else if (pmi.invalid || pmi.value === null) {
      errors.pmiInsuranceAnnual = 'Enter a valid PMI amount.';
    } else if (pmi.value < 0) {
      errors.pmiInsuranceAnnual = 'PMI cannot be negative.';
    }

    if (hoa.blank) {
      errors.hoaFeeAnnual = 'Enter HOA fee (0 allowed).';
    } else if (hoa.invalid || hoa.value === null) {
      errors.hoaFeeAnnual = 'Enter a valid HOA fee.';
    } else if (hoa.value < 0) {
      errors.hoaFeeAnnual = 'HOA fee cannot be negative.';
    }

    if (other.blank) {
      errors.otherCostsAnnual = 'Enter other costs (0 allowed).';
    } else if (other.invalid || other.value === null) {
      errors.otherCostsAnnual = 'Enter a valid other-costs amount.';
    } else if (other.value < 0) {
      errors.otherCostsAnnual = 'Other costs cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const canonical = calculateMortgageAmortization({
    homePrice: home.value!,
    downPaymentPercent: downPct.value!,
    termYears: years.value!,
    annualRatePercent: rate.value!,
    includeOptionals: input.includeOptionals,
    propertyTaxPercent: input.includeOptionals ? taxPct.value! : 0,
    homeInsuranceAnnual: input.includeOptionals ? insurance.value! : 0,
    pmiInsuranceAnnual: input.includeOptionals ? pmi.value! : 0,
    hoaFeeAnnual: input.includeOptionals ? hoa.value! : 0,
    otherCostsAnnual: input.includeOptionals ? other.value! : 0,
    startMonth: input.startMonth,
    startYear: startYear.value!,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a finite mortgage result.';
    return { isValid: false, errors, result: null };
  }

  const result: MortgageAmortizationResult = {
    ...canonical,
    formattedHomePrice: formatUsdAmount(canonical.homePrice),
    formattedDownPayment: formatUsdAmount(canonical.downPayment),
    formattedLoanAmount: formatUsdAmount(canonical.loanAmount),
    formattedMonthlyMortgage: formatUsdAmount(canonical.monthlyMortgage),
    formattedTotalMortgagePayments: formatUsdAmount(canonical.totalMortgagePayments),
    formattedTotalInterest: formatUsdAmount(canonical.totalInterest),
    formattedMonthlyPropertyTax: formatUsdAmount(canonical.monthlyPropertyTax),
    formattedTotalPropertyTax: formatUsdAmount(canonical.totalPropertyTax),
    formattedMonthlyHomeInsurance: formatUsdAmount(canonical.monthlyHomeInsurance),
    formattedTotalHomeInsurance: formatUsdAmount(canonical.totalHomeInsurance),
    formattedMonthlyPmi: formatUsdAmount(canonical.monthlyPmi),
    formattedTotalPmi: formatUsdAmount(canonical.totalPmi),
    formattedMonthlyHoa: formatUsdAmount(canonical.monthlyHoa),
    formattedTotalHoa: formatUsdAmount(canonical.totalHoa),
    formattedMonthlyOtherCosts: formatUsdAmount(canonical.monthlyOtherCosts),
    formattedTotalOtherCosts: formatUsdAmount(canonical.totalOtherCosts),
    formattedMonthlyOutOfPocket: formatUsdAmount(canonical.monthlyOutOfPocket),
    formattedTotalOutOfPocket: formatUsdAmount(canonical.totalOutOfPocket),
  };

  return { isValid: true, errors: {}, result };
}
