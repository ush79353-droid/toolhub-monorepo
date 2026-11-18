import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  TAX_BRACKET_CITATION,
  calculatePretaxAccumulation,
  calculateTaxableAccumulation,
  formatVaMoney,
} from './calculation';
import type {
  VariableAnnuityFieldErrors,
  VariableAnnuityInput,
  VariableAnnuityResult,
} from './types';

export interface VariableAnnuityValidation {
  isValid: boolean;
  errors: VariableAnnuityFieldErrors;
  result: VariableAnnuityResult | null;
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

export function validateVariableAnnuityInput(
  input: VariableAnnuityInput,
  rates?: CurrencyRatesSnapshot | null
): VariableAnnuityValidation {
  const errors: VariableAnnuityFieldErrors = {};
  const home = input.startingBalanceCurrency;

  const starting = parseNumber(input.startingBalance);
  const currentAge = parseNumber(input.currentAge);
  const withdrawalAge = parseNumber(input.withdrawalAge);
  const lengthYears = parseNumber(input.lengthYears);
  const contribution = parseNumber(input.contribution);
  const rate = parseNumber(input.rateOfReturnPercent);
  const growth = parseNumber(input.annualGrowthPercent);
  const income = parseNumber(input.annualIncome);
  const incomeGrowth = parseNumber(input.incomeGrowthPercent);
  const inflation = parseNumber(input.inflationPercent);

  if (starting.blank || starting.invalid || starting.value === null) {
    errors.startingBalance = 'Enter a valid starting balance.';
  } else if (starting.value < 0) {
    errors.startingBalance = 'Starting balance cannot be negative.';
  }

  if (currentAge.blank || currentAge.invalid || currentAge.value === null) {
    errors.currentAge = 'Enter a valid current age.';
  } else if (currentAge.value < 0 || currentAge.value > 120) {
    errors.currentAge = 'Current age must be between 0 and 120.';
  }

  if (
    withdrawalAge.blank ||
    withdrawalAge.invalid ||
    withdrawalAge.value === null
  ) {
    errors.withdrawalAge = 'Enter a valid withdrawal age.';
  } else if (withdrawalAge.value < 0 || withdrawalAge.value > 120) {
    errors.withdrawalAge = 'Withdrawal age must be between 0 and 120.';
  }

  if (
    !errors.currentAge &&
    !errors.withdrawalAge &&
    currentAge.value !== null &&
    withdrawalAge.value !== null &&
    !(withdrawalAge.value > currentAge.value)
  ) {
    errors.withdrawalAge = 'Withdrawal age must be greater than current age.';
  }

  if (lengthYears.blank || lengthYears.invalid || lengthYears.value === null) {
    errors.lengthYears = 'Enter a valid annuity length in years.';
  } else if (!(lengthYears.value > 0) || lengthYears.value > 120) {
    errors.lengthYears = 'Length must be greater than 0 and at most 120 years.';
  }

  if (
    contribution.blank ||
    contribution.invalid ||
    contribution.value === null
  ) {
    errors.contribution = 'Enter a valid contribution.';
  } else if (contribution.value < 0) {
    errors.contribution = 'Contribution cannot be negative.';
  }

  if (rate.blank || rate.invalid || rate.value === null) {
    errors.rateOfReturnPercent = 'Enter a valid rate of return.';
  } else if (rate.value < 0) {
    errors.rateOfReturnPercent = 'Rate of return cannot be negative.';
  }

  if (growth.blank || growth.invalid || growth.value === null) {
    errors.annualGrowthPercent = 'Enter a valid annual growth rate.';
  } else if (growth.value < -100) {
    errors.annualGrowthPercent = 'Annual growth rate cannot be below -100%.';
  }

  if (income.blank || income.invalid || income.value === null) {
    errors.annualIncome = 'Enter a valid annual income.';
  } else if (income.value < 0) {
    errors.annualIncome = 'Annual income cannot be negative.';
  }

  if (
    incomeGrowth.blank ||
    incomeGrowth.invalid ||
    incomeGrowth.value === null
  ) {
    errors.incomeGrowthPercent = 'Enter a valid income growth rate.';
  }

  if (inflation.blank || inflation.invalid || inflation.value === null) {
    errors.inflationPercent = 'Enter a valid inflation rate.';
  } else if (inflation.value < -99) {
    errors.inflationPercent = 'Inflation rate cannot be below -99%.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const contribHome = convertMoney(
    contribution.value!,
    input.contributionCurrency,
    home,
    rates
  );
  if (!contribHome.ok) {
    errors.form = contribHome.message;
    return { isValid: false, errors, result: null };
  }
  const incomeHome = convertMoney(
    income.value!,
    input.annualIncomeCurrency,
    home,
    rates
  );
  if (!incomeHome.ok) {
    errors.form = incomeHome.message;
    return { isValid: false, errors, result: null };
  }

  const years = lengthYears.value!;
  const pretax = calculatePretaxAccumulation({
    startingBalance: starting.value!,
    contribution: contribHome.amount,
    lengthYears: years,
    paymentFrequency: input.paymentFrequency,
    compoundingFrequency: input.compoundingFrequency,
    annuityType: input.annuityType,
    rateOfReturnPercent: rate.value!,
    annualGrowthPercent: growth.value!,
  });

  if (!pretax) {
    errors.form = 'This combination does not produce a valid annuity result.';
    return { isValid: false, errors, result: null };
  }

  const taxable = calculateTaxableAccumulation({
    startingBalance: starting.value!,
    contribution: contribHome.amount,
    lengthYears: years,
    paymentFrequency: input.paymentFrequency,
    compoundingFrequency: input.compoundingFrequency,
    annuityType: input.annuityType,
    rateOfReturnPercent: rate.value!,
    annualGrowthPercent: growth.value!,
    annualIncome: incomeHome.amount,
    incomeGrowthPercent: incomeGrowth.value!,
    inflationPercent: inflation.value!,
    filingStatus: input.filingStatus,
  });

  const money = (v: number) => formatVaMoney(v, home);
  const result: VariableAnnuityResult = {
    openingBalance: starting.value!,
    finalBalanceBeforeTax: pretax.finalBalance,
    finalBalanceTaxable: taxable,
    taxableAvailable: taxable !== null,
    taxableNote: taxable === null ? null : TAX_BRACKET_CITATION,
    totalReturn: pretax.totalReturn,
    numberOfContributions: pretax.numberOfContributions,
    annualContribution: pretax.annualContribution,
    totalContribution: pretax.totalContribution,
    lengthYears: years,
    currency: home,
    formattedOpeningBalance: money(starting.value!),
    formattedFinalBalanceBeforeTax: money(pretax.finalBalance),
    formattedFinalBalanceTaxable: taxable === null ? '—' : money(taxable),
    formattedTotalReturn: money(pretax.totalReturn),
    formattedAnnualContribution: money(pretax.annualContribution),
    formattedTotalContribution: money(pretax.totalContribution),
    summaryText: `The final balance of your annuity is estimated to be ${money(pretax.finalBalance)}`,
  };

  return { isValid: true, errors: {}, result };
}
