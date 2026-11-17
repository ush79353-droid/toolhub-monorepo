import {
  calculateCashBackOrLowInterest,
  formatUsdAmount,
} from './calculation';
import { isKnownUsStateCode } from './us-states';
import type {
  CashBackOrLowInterestFieldErrors,
  CashBackOrLowInterestInput,
  CashBackOrLowInterestResult,
  OfferBreakdown,
} from './types';

export interface CashBackOrLowInterestValidation {
  isValid: boolean;
  errors: CashBackOrLowInterestFieldErrors;
  result: CashBackOrLowInterestResult | null;
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

function toOfferBreakdown(
  scenario: NonNullable<
    ReturnType<typeof calculateCashBackOrLowInterest>
  >['cashBackOffer']
): OfferBreakdown {
  return {
    ...scenario,
    formattedTotalLoanAmount: formatUsdAmount(scenario.totalLoanAmount),
    formattedSalesTax: formatUsdAmount(scenario.salesTax),
    formattedUpfrontPayment: formatUsdAmount(scenario.upfrontPayment),
    formattedMonthlyPayment: formatUsdAmount(scenario.monthlyPayment),
    formattedTotalLoanPayments: formatUsdAmount(scenario.totalLoanPayments),
    formattedTotalLoanInterest: formatUsdAmount(scenario.totalLoanInterest),
    formattedTotalCost: formatUsdAmount(scenario.totalCost),
  };
}

export function validateCashBackOrLowInterestInput(
  input: CashBackOrLowInterestInput
): CashBackOrLowInterestValidation {
  const errors: CashBackOrLowInterestFieldErrors = {};

  const cashBack = parseNumber(input.cashBackAmount);
  const highRate = parseNumber(input.highInterestRatePercent);
  const lowRate = parseNumber(input.lowInterestRatePercent);
  const autoPrice = parseNumber(input.autoPrice);
  const term = parseNumber(input.loanTermMonths);
  const down = parseNumber(input.downPayment);
  const tradeIn = parseNumber(input.tradeInValue);
  const tax = parseNumber(input.salesTaxPercent);
  const fees = parseNumber(input.titleRegistrationFees);

  if (cashBack.blank) {
    errors.cashBackAmount = 'Enter a cash back amount (0 allowed).';
  } else if (cashBack.invalid || cashBack.value === null) {
    errors.cashBackAmount = 'Enter a valid cash back amount.';
  } else if (cashBack.value < 0) {
    errors.cashBackAmount = 'Cash back cannot be negative.';
  }

  if (highRate.blank) {
    errors.highInterestRatePercent = 'Enter the high interest rate.';
  } else if (highRate.invalid || highRate.value === null) {
    errors.highInterestRatePercent = 'Enter a valid high interest rate.';
  } else if (highRate.value < 0) {
    errors.highInterestRatePercent = 'Interest rate cannot be negative.';
  }

  if (lowRate.blank) {
    errors.lowInterestRatePercent = 'Enter the low interest rate.';
  } else if (lowRate.invalid || lowRate.value === null) {
    errors.lowInterestRatePercent = 'Enter a valid low interest rate.';
  } else if (lowRate.value < 0) {
    errors.lowInterestRatePercent = 'Interest rate cannot be negative.';
  }

  if (autoPrice.blank) {
    errors.autoPrice = 'Enter an auto price.';
  } else if (autoPrice.invalid || autoPrice.value === null) {
    errors.autoPrice = 'Enter a valid auto price.';
  } else if (autoPrice.value < 0) {
    errors.autoPrice = 'Auto price cannot be negative.';
  }

  if (term.blank) {
    errors.loanTermMonths = 'Enter a loan term in months.';
  } else if (term.invalid || term.value === null) {
    errors.loanTermMonths = 'Enter a valid loan term.';
  } else if (!Number.isInteger(term.value) || term.value <= 0) {
    errors.loanTermMonths = 'Loan term must be a whole number of months greater than 0.';
  } else if (term.value > 600) {
    errors.loanTermMonths = 'Loan term cannot exceed 600 months.';
  }

  if (down.blank) {
    errors.downPayment = 'Enter a down payment (0 allowed).';
  } else if (down.invalid || down.value === null) {
    errors.downPayment = 'Enter a valid down payment.';
  } else if (down.value < 0) {
    errors.downPayment = 'Down payment cannot be negative.';
  }

  if (tradeIn.blank) {
    errors.tradeInValue = 'Enter a trade-in value (0 allowed).';
  } else if (tradeIn.invalid || tradeIn.value === null) {
    errors.tradeInValue = 'Enter a valid trade-in value.';
  } else if (tradeIn.value < 0) {
    errors.tradeInValue = 'Trade-in value cannot be negative.';
  }

  if (!isKnownUsStateCode(input.stateCode)) {
    errors.form = 'Select a valid US state or leave as Select.';
  }

  if (tax.blank) {
    errors.salesTaxPercent = 'Enter a sales tax percentage (0 allowed).';
  } else if (tax.invalid || tax.value === null) {
    errors.salesTaxPercent = 'Enter a valid sales tax percentage.';
  } else if (tax.value < 0 || tax.value > 100) {
    errors.salesTaxPercent = 'Sales tax must be between 0 and 100.';
  }

  if (fees.blank) {
    errors.titleRegistrationFees = 'Enter title, registration and other fees (0 allowed).';
  } else if (fees.invalid || fees.value === null) {
    errors.titleRegistrationFees = 'Enter a valid fees amount.';
  } else if (fees.value < 0) {
    errors.titleRegistrationFees = 'Fees cannot be negative.';
  }

  if (
    !errors.autoPrice &&
    !errors.downPayment &&
    !errors.tradeInValue &&
    !errors.cashBackAmount &&
    autoPrice.value !== null &&
    down.value !== null &&
    tradeIn.value !== null &&
    cashBack.value !== null
  ) {
    const creditsWithoutCashBack = down.value + tradeIn.value;
    if (creditsWithoutCashBack > autoPrice.value) {
      errors.downPayment =
        'Down payment plus trade-in cannot exceed the auto price.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const canonical = calculateCashBackOrLowInterest({
    cashBackAmount: cashBack.value!,
    highInterestRatePercent: highRate.value!,
    lowInterestRatePercent: lowRate.value!,
    autoPrice: autoPrice.value!,
    loanTermMonths: term.value!,
    downPayment: down.value!,
    tradeInValue: tradeIn.value!,
    salesTaxPercent: tax.value!,
    titleRegistrationFees: fees.value!,
    includeAllFeesInLoan: input.includeAllFeesInLoan,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: CashBackOrLowInterestResult = {
    loanTermMonths: canonical.loanTermMonths,
    cashBackAmount: canonical.cashBackAmount,
    cashBackOffer: toOfferBreakdown(canonical.cashBackOffer),
    lowInterestOffer: toOfferBreakdown(canonical.lowInterestOffer),
    betterOffer: canonical.betterOffer,
    totalCostSavings: canonical.totalCostSavings,
    interestSavingsVsCashBack: canonical.interestSavingsVsCashBack,
    formattedTotalCostSavings: formatUsdAmount(canonical.totalCostSavings),
    formattedInterestSavingsVsCashBack: formatUsdAmount(
      Math.abs(canonical.interestSavingsVsCashBack)
    ),
    formattedCashBackAmount: formatUsdAmount(canonical.cashBackAmount),
    verdictTitle: canonical.verdictTitle,
    verdictExplanation: canonical.verdictExplanation,
  };

  return { isValid: true, errors: {}, result };
}
