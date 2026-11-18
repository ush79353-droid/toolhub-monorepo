import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateFhaLoanCanonical,
  formatFhaMoney,
  formatFhaPercent,
} from './calculation';
import type {
  FhaLoanFieldErrors,
  FhaLoanInput,
  FhaLoanResult,
} from './types';

export interface FhaLoanValidation {
  isValid: boolean;
  errors: FhaLoanFieldErrors;
  result: FhaLoanResult | null;
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

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

export function validateFhaLoanInput(
  input: FhaLoanInput,
  rates?: CurrencyRatesSnapshot | null
): FhaLoanValidation {
  const errors: FhaLoanFieldErrors = {};

  const price = parseNumber(input.homePrice);
  const down = parseNumber(input.downPaymentPercent);
  const term = parseNumber(input.loanTermYears);
  const rate = parseNumber(input.interestRatePercent);
  const mip = parseNumber(input.annualMipPercent);

  if (price.blank || price.invalid || price.value === null) {
    errors.homePrice = 'Enter a valid home price.';
  } else if (price.value <= 0) {
    errors.homePrice = 'Home price must be greater than zero.';
  }

  if (down.blank || down.invalid || down.value === null) {
    errors.downPaymentPercent = 'Enter a valid down payment percentage.';
  } else if (down.value < 0 || down.value >= 100) {
    errors.downPaymentPercent = 'Down payment must be at least 0% and less than 100%.';
  }

  if (term.blank || term.invalid || term.value === null) {
    errors.loanTermYears = 'Enter a valid loan term.';
  } else if (term.value <= 0) {
    errors.loanTermYears = 'Loan term must be greater than zero.';
  }

  if (rate.blank || rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (mip.blank || mip.invalid || mip.value === null) {
    errors.annualMipPercent = 'Enter a valid FHA annual MIP.';
  } else if (mip.value < 0) {
    errors.annualMipPercent = 'FHA annual MIP cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const canonical = calculateFhaLoanCanonical({
    homePrice: price.value!,
    downPaymentPercent: down.value!,
    loanTermYears: term.value!,
    interestRatePercent: rate.value!,
    annualMipPercent: mip.value!,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a finite FHA loan result.';
    return { isValid: false, errors, result: null };
  }

  const home = input.homePriceCurrency;
  const pairs: Array<{
    amount: number;
    to: SupportedCurrency;
  }> = [
    { amount: canonical.totalDownPayment, to: input.totalDownPaymentCurrency },
    { amount: canonical.baseLoanAmount, to: input.baseLoanAmountCurrency },
    { amount: canonical.upfrontMip, to: input.upfrontMipCurrency },
    {
      amount: canonical.monthlyMortgagePayment,
      to: input.monthlyMortgagePaymentCurrency,
    },
    { amount: canonical.monthlyMip, to: input.monthlyMipCurrency },
    { amount: canonical.totalFhaLoanAmount, to: input.totalFhaLoanAmountCurrency },
    { amount: canonical.totalMonthlyPayment, to: input.totalMonthlyPaymentCurrency },
    { amount: canonical.totalCostOfLoan, to: input.totalCostOfLoanCurrency },
  ];

  const converted: number[] = [];
  for (const pair of pairs) {
    const out = convertMoney(pair.amount, home, pair.to, rates);
    if (!out.ok) {
      errors.form = out.message;
      return { isValid: false, errors, result: null };
    }
    converted.push(out.amount);
  }

  const [
    totalDownPayment,
    baseLoanAmount,
    upfrontMip,
    monthlyMortgagePayment,
    monthlyMip,
    totalFhaLoanAmount,
    totalMonthlyPayment,
    totalCostOfLoan,
  ] = converted as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];

  const result: FhaLoanResult = {
    totalDownPaymentInHome: canonical.totalDownPayment,
    baseLoanAmountInHome: canonical.baseLoanAmount,
    upfrontMipInHome: canonical.upfrontMip,
    monthlyMortgagePaymentInHome: canonical.monthlyMortgagePayment,
    monthlyMipInHome: canonical.monthlyMip,
    totalFhaLoanAmountInHome: canonical.totalFhaLoanAmount,
    totalMonthlyPaymentInHome: canonical.totalMonthlyPayment,
    totalCostOfLoanInHome: canonical.totalCostOfLoan,
    totalDownPayment,
    baseLoanAmount,
    upfrontMip,
    monthlyMortgagePayment,
    monthlyMip,
    totalFhaLoanAmount,
    totalMonthlyPayment,
    totalCostOfLoan,
    formattedTotalDownPayment: formatFhaMoney(
      totalDownPayment,
      input.totalDownPaymentCurrency
    ),
    formattedBaseLoanAmount: formatFhaMoney(
      baseLoanAmount,
      input.baseLoanAmountCurrency
    ),
    formattedUpfrontMip: formatFhaMoney(upfrontMip, input.upfrontMipCurrency),
    formattedMonthlyMortgagePayment: formatFhaMoney(
      monthlyMortgagePayment,
      input.monthlyMortgagePaymentCurrency
    ),
    formattedMonthlyMip: formatFhaMoney(monthlyMip, input.monthlyMipCurrency),
    formattedTotalFhaLoanAmount: formatFhaMoney(
      totalFhaLoanAmount,
      input.totalFhaLoanAmountCurrency
    ),
    formattedTotalMonthlyPayment: formatFhaMoney(
      totalMonthlyPayment,
      input.totalMonthlyPaymentCurrency
    ),
    formattedTotalCostOfLoan: formatFhaMoney(
      totalCostOfLoan,
      input.totalCostOfLoanCurrency
    ),
    totalDownPaymentCurrency: input.totalDownPaymentCurrency,
    baseLoanAmountCurrency: input.baseLoanAmountCurrency,
    upfrontMipCurrency: input.upfrontMipCurrency,
    monthlyMortgagePaymentCurrency: input.monthlyMortgagePaymentCurrency,
    monthlyMipCurrency: input.monthlyMipCurrency,
    totalFhaLoanAmountCurrency: input.totalFhaLoanAmountCurrency,
    totalMonthlyPaymentCurrency: input.totalMonthlyPaymentCurrency,
    totalCostOfLoanCurrency: input.totalCostOfLoanCurrency,
    periodicInterestRatePercent: canonical.periodicInterestRatePercent,
    formattedPeriodicInterestRatePercent: formatFhaPercent(
      canonical.periodicInterestRatePercent
    ),
    numberOfPayments: canonical.numberOfPayments,
  };

  return { isValid: true, errors: {}, result };
}
