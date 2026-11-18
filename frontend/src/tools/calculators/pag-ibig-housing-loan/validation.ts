import {
  INSURANCE_UNAVAILABLE_REASON,
  LOANABLE_AMOUNT_UNAVAILABLE_REASON,
  TOTAL_AMORTIZATION_UNAVAILABLE_REASON,
  calculateMonthlyPrincipalAndInterest,
  formatPhpAmount,
  monthlyFromAnnual,
} from './calculation';
import {
  getFixedPricingOption,
  type PagIbigHousingLoanFieldErrors,
  type PagIbigHousingLoanInput,
  type PagIbigHousingLoanResult,
} from './types';

export interface PagIbigHousingLoanValidation {
  isValid: boolean;
  errors: PagIbigHousingLoanFieldErrors;
  result: PagIbigHousingLoanResult | null;
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validatePagIbigHousingLoanInput(
  input: PagIbigHousingLoanInput
): PagIbigHousingLoanValidation {
  const errors: PagIbigHousingLoanFieldErrors = {};

  const property = parseNumber(input.estimatedPropertyValue);
  const loan = parseNumber(input.loanAmount);
  const annual = parseNumber(input.grossAnnualIncome);
  const monthly = parseNumber(input.grossMonthlyIncome);

  if (!property.blank && (property.invalid || property.value === null)) {
    errors.estimatedPropertyValue = 'Enter a valid estimated property value.';
  } else if (!property.blank && property.value !== null && !(property.value > 0)) {
    errors.estimatedPropertyValue = 'Estimated property value must be greater than zero.';
  }

  if (!loan.blank && (loan.invalid || loan.value === null)) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!loan.blank && loan.value !== null && !(loan.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (!annual.blank && (annual.invalid || annual.value === null)) {
    errors.grossAnnualIncome = 'Enter a valid gross annual income.';
  } else if (!annual.blank && annual.value !== null && annual.value < 0) {
    errors.grossAnnualIncome = 'Gross annual income cannot be negative.';
  }

  if (!monthly.blank && (monthly.invalid || monthly.value === null)) {
    errors.grossMonthlyIncome = 'Enter a valid gross monthly income.';
  } else if (!monthly.blank && monthly.value !== null && monthly.value < 0) {
    errors.grossMonthlyIncome = 'Gross monthly income cannot be negative.';
  }

  // Loanable amount never invents an LTV — property/income field errors stay visible
  // without blocking principal-and-interest when the loan amount itself is valid.
  if (loan.blank || errors.loanAmount) {
    return { isValid: false, errors, result: null };
  }

  const pricing = getFixedPricingOption(input.fixedPricingOptionId);
  const paymentCount = input.repaymentPeriodYears * 12;
  const rateCoversFullTerm = pricing.fixedYears >= input.repaymentPeriodYears;

  if (!rateCoversFullTerm) {
    errors.form =
      'The selected fixed pricing period is shorter than the repayment term. Future repricing rates are unknown in available reference data, so a full-term payment cannot be projected.';
    return { isValid: false, errors, result: null };
  }

  const monthlyPi = calculateMonthlyPrincipalAndInterest({
    principal: loan.value!,
    annualRatePercent: pricing.annualRatePercent,
    paymentCount,
  });

  if (monthlyPi === null) {
    errors.form = 'This combination does not produce a finite monthly principal and interest.';
    return { isValid: false, errors, result: null };
  }

  let displayAnnual = annual.value;
  let displayMonthly = monthly.value;
  if (input.incomeSource === 'annual' && annual.value !== null) {
    displayMonthly = monthlyFromAnnual(annual.value);
  } else if (input.incomeSource === 'monthly' && monthly.value !== null) {
    displayAnnual = monthly.value * 12;
  }

  const result: PagIbigHousingLoanResult = {
    loanableAmount: null,
    loanableUnavailableReason: LOANABLE_AMOUNT_UNAVAILABLE_REASON,
    monthlyPrincipalAndInterest: monthlyPi,
    paymentCount,
    annualRatePercent: pricing.annualRatePercent,
    fixedPricingYears: pricing.fixedYears,
    rateCoversFullTerm,
    monthlyInsurancePremium: null,
    insuranceUnavailableReason: INSURANCE_UNAVAILABLE_REASON,
    totalMonthlyAmortization: null,
    totalAmortizationUnavailableReason: TOTAL_AMORTIZATION_UNAVAILABLE_REASON,
    formattedMonthlyPrincipalAndInterest: formatPhpAmount(monthlyPi),
    formattedGrossAnnualIncome:
      displayAnnual !== null && Number.isFinite(displayAnnual)
        ? formatPhpAmount(displayAnnual)
        : '',
    formattedGrossMonthlyIncome:
      displayMonthly !== null && Number.isFinite(displayMonthly)
        ? formatPhpAmount(displayMonthly)
        : '',
  };

  // Keep non-blocking property/income field errors visible alongside a valid P&I result.
  return { isValid: true, errors, result };
}
