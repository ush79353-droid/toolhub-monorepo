import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateHomeMortgage,
  formatHomeMortgageMoney,
  formatHomeMortgagePercent,
} from './calculation';
import type { HomeMortgageFieldErrors, HomeMortgageInput, HomeMortgageResult } from './types';

export interface HomeMortgageValidation {
  isValid: boolean;
  errors: HomeMortgageFieldErrors;
  result: HomeMortgageResult | null;
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

export function validateHomeMortgageInput(
  input: HomeMortgageInput,
  rates?: CurrencyRatesSnapshot | null
): HomeMortgageValidation {
  const errors: HomeMortgageFieldErrors = {};

  const home = parseNumber(input.homeValue);
  const down = parseNumber(input.downPayment);
  const downPct = parseNumber(input.downPaymentPercent);
  const rate = parseNumber(input.interestRatePercent);
  const years = parseNumber(input.loanTermYears);
  const pmi = parseNumber(input.annualPmiPercent);
  const other = parseNumber(input.otherCosts);

  if (home.blank) {
    errors.homeValue = 'Enter a home value.';
  } else if (home.invalid || home.value === null) {
    errors.homeValue = 'Enter a valid home value.';
  } else if (!(home.value > 0)) {
    errors.homeValue = 'Home value must be greater than zero.';
  }

  if (input.downPaymentSource === 'percent') {
    if (downPct.blank) {
      errors.downPaymentPercent = 'Enter a down payment percentage.';
    } else if (downPct.invalid || downPct.value === null) {
      errors.downPaymentPercent = 'Enter a valid down payment percentage.';
    } else if (downPct.value < 0 || downPct.value > 100) {
      errors.downPaymentPercent = 'Down payment must be between 0% and 100%.';
    }
  } else {
    if (down.blank) {
      errors.downPayment = 'Enter a down payment.';
    } else if (down.invalid || down.value === null) {
      errors.downPayment = 'Enter a valid down payment.';
    } else if (down.value < 0) {
      errors.downPayment = 'Down payment cannot be negative.';
    }
  }

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (years.blank) {
    errors.loanTermYears = 'Enter a loan term in years.';
  } else if (years.invalid || years.value === null) {
    errors.loanTermYears = 'Enter a valid loan term.';
  } else if (!(years.value > 0)) {
    errors.loanTermYears = 'Loan term must be greater than zero.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.firstDay.trim())) {
    errors.firstDay = 'Enter a valid first payment date.';
  }

  if (pmi.blank) {
    errors.annualPmiPercent = 'Enter a PMI rate (0 allowed).';
  } else if (pmi.invalid || pmi.value === null) {
    errors.annualPmiPercent = 'Enter a valid PMI rate.';
  } else if (pmi.value < 0) {
    errors.annualPmiPercent = 'PMI rate cannot be negative.';
  }

  if (other.blank) {
    errors.otherCosts = 'Enter other periodic costs (0 allowed).';
  } else if (other.invalid || other.value === null) {
    errors.otherCosts = 'Enter a valid other-costs amount.';
  } else if (other.value < 0) {
    errors.otherCosts = 'Other costs cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const homeCurrency = input.homeValueCurrency;
  const homeValue = home.value!;

  let downInHome: number;
  if (input.downPaymentSource === 'percent') {
    downInHome = homeValue * (downPct.value! / 100);
  } else {
    const converted = convertMoney(
      down.value!,
      input.downPaymentCurrency,
      homeCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    downInHome = converted.amount;
    if (downInHome > homeValue) {
      errors.downPayment = 'Down payment cannot exceed home value.';
      return { isValid: false, errors, result: null };
    }
  }

  const otherConverted = convertMoney(
    other.value!,
    input.otherCostsCurrency,
    homeCurrency,
    rates
  );
  if (!otherConverted.ok) {
    errors.form = otherConverted.message;
    return { isValid: false, errors, result: null };
  }

  const canonical = calculateHomeMortgage({
    homeValue,
    downPayment: downInHome,
    annualRatePercent: rate.value!,
    termYears: years.value!,
    interestMethod: input.interestMethod,
    paymentFrequency: input.paymentFrequency,
    firstDay: input.firstDay.trim(),
    annualPmiPercent: pmi.value!,
    otherCostsPeriodic: otherConverted.amount,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a valid mortgage result.';
    return { isValid: false, errors, result: null };
  }

  const downDisplay = convertMoney(
    canonical.downPayment,
    homeCurrency,
    input.downPaymentCurrency,
    rates
  );
  const loanDisplay = convertMoney(
    canonical.loanAmount,
    homeCurrency,
    input.loanAmountCurrency,
    rates
  );
  const paymentDisplay = convertMoney(
    canonical.periodicPayment,
    homeCurrency,
    input.paymentCurrency,
    rates
  );
  const totalPayDisplay = convertMoney(
    canonical.totalPayments,
    homeCurrency,
    input.paymentCurrency,
    rates
  );
  const interestDisplay = convertMoney(
    canonical.totalInterest,
    homeCurrency,
    input.paymentCurrency,
    rates
  );
  const pmiPeriodicDisplay = convertMoney(
    canonical.periodicPmi,
    homeCurrency,
    input.paymentCurrency,
    rates
  );
  const pmiTotalDisplay = convertMoney(
    canonical.totalPmi,
    homeCurrency,
    input.paymentCurrency,
    rates
  );
  const otherPeriodicDisplay = convertMoney(
    canonical.otherCostsPeriodic,
    homeCurrency,
    input.otherCostsCurrency,
    rates
  );
  const totalWithDisplay = convertMoney(
    canonical.totalWithCosts,
    homeCurrency,
    input.paymentCurrency,
    rates
  );
  const totalOtherDisplay = convertMoney(
    canonical.totalOtherCosts,
    homeCurrency,
    input.paymentCurrency,
    rates
  );

  if (
    !downDisplay.ok ||
    !loanDisplay.ok ||
    !paymentDisplay.ok ||
    !totalPayDisplay.ok ||
    !interestDisplay.ok ||
    !pmiPeriodicDisplay.ok ||
    !pmiTotalDisplay.ok ||
    !otherPeriodicDisplay.ok ||
    !totalWithDisplay.ok ||
    !totalOtherDisplay.ok
  ) {
    const failed = [
      downDisplay,
      loanDisplay,
      paymentDisplay,
      totalPayDisplay,
      interestDisplay,
      pmiPeriodicDisplay,
      pmiTotalDisplay,
      otherPeriodicDisplay,
      totalWithDisplay,
      totalOtherDisplay,
    ].find((step) => !step.ok);
    errors.form = failed && !failed.ok ? failed.message : 'Conversion failed.';
    return { isValid: false, errors, result: null };
  }

  const result: HomeMortgageResult = {
    homeValue: canonical.homeValue,
    downPayment: canonical.downPayment,
    downPaymentPercent: canonical.downPaymentPercent,
    loanAmount: canonical.loanAmount,
    periodicPayment: canonical.periodicPayment,
    paymentCount: canonical.paymentCount,
    totalPayments: canonical.totalPayments,
    totalInterest: canonical.totalInterest,
    periodicPmi: canonical.periodicPmi,
    totalPmi: canonical.totalPmi,
    pmiPaymentCount: canonical.pmiPaymentCount,
    pmiUntilDate: canonical.pmiUntilDate,
    otherCostsPeriodic: canonical.otherCostsPeriodic,
    totalOtherCosts: canonical.totalOtherCosts,
    totalWithCosts: canonical.totalWithCosts,
    payoffDate: canonical.payoffDate,
    principalSharePercent: canonical.principalSharePercent,
    interestSharePercent: canonical.interestSharePercent,
    pmiSharePercent: canonical.pmiSharePercent,
    otherSharePercent: canonical.otherSharePercent,
    calcCurrency: homeCurrency,
    formattedHomeValue: formatHomeMortgageMoney(canonical.homeValue, homeCurrency),
    formattedDownPayment: formatHomeMortgageMoney(
      downDisplay.amount,
      input.downPaymentCurrency
    ),
    formattedDownPaymentPercent: formatHomeMortgagePercent(canonical.downPaymentPercent),
    formattedLoanAmount: formatHomeMortgageMoney(
      loanDisplay.amount,
      input.loanAmountCurrency
    ),
    formattedPeriodicPayment: formatHomeMortgageMoney(
      paymentDisplay.amount,
      input.paymentCurrency
    ),
    formattedTotalPayments: formatHomeMortgageMoney(
      totalPayDisplay.amount,
      input.paymentCurrency
    ),
    formattedTotalInterest: formatHomeMortgageMoney(
      interestDisplay.amount,
      input.paymentCurrency
    ),
    formattedPeriodicPmi: formatHomeMortgageMoney(
      pmiPeriodicDisplay.amount,
      input.paymentCurrency
    ),
    formattedTotalPmi: formatHomeMortgageMoney(
      pmiTotalDisplay.amount,
      input.paymentCurrency
    ),
    formattedOtherCostsPeriodic: formatHomeMortgageMoney(
      otherPeriodicDisplay.amount,
      input.otherCostsCurrency
    ),
    formattedTotalOtherCosts: formatHomeMortgageMoney(
      totalOtherDisplay.amount,
      input.paymentCurrency
    ),
    formattedTotalWithCosts: formatHomeMortgageMoney(
      totalWithDisplay.amount,
      input.paymentCurrency
    ),
    downPaymentDisplay: downDisplay.amount,
    loanAmountDisplay: loanDisplay.amount,
    periodicPaymentDisplay: paymentDisplay.amount,
    totalPaymentsDisplay: totalPayDisplay.amount,
    totalInterestDisplay: interestDisplay.amount,
    periodicPmiDisplay: pmiPeriodicDisplay.amount,
    totalPmiDisplay: pmiTotalDisplay.amount,
    otherCostsPeriodicDisplay: otherPeriodicDisplay.amount,
    totalWithCostsDisplay: totalWithDisplay.amount,
    homeValueCurrency: homeCurrency,
    downPaymentCurrency: input.downPaymentCurrency,
    loanAmountCurrency: input.loanAmountCurrency,
    paymentCurrency: input.paymentCurrency,
    otherCostsCurrency: input.otherCostsCurrency,
  };

  return { isValid: true, errors: {}, result };
}
