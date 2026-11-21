import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateIra, formatMoneyAmount } from './calculation';
import type { IraFieldErrors, IraInput, IraResult } from './types';

export interface IraValidation {
  isValid: boolean;
  errors: IraFieldErrors;
  result: IraResult | null;
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
  rates: CurrencyRatesSnapshot | null | undefined,
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

export function collectFieldErrors(input: IraInput): IraFieldErrors {
  const errors: IraFieldErrors = {};

  const currentAge = parseNumber(input.currentAge);
  if (currentAge.blank) errors.currentAge = 'Enter current age.';
  else if (currentAge.invalid || currentAge.value == null)
    errors.currentAge = 'Enter a valid age.';
  else if (currentAge.value < 0 || currentAge.value > 120)
    errors.currentAge = 'Age must be between 0 and 120.';

  const retirementAge = parseNumber(input.retirementAge);
  if (retirementAge.blank) errors.retirementAge = 'Enter retirement age.';
  else if (retirementAge.invalid || retirementAge.value == null)
    errors.retirementAge = 'Enter a valid retirement age.';
  else if (retirementAge.value < 0 || retirementAge.value > 120)
    errors.retirementAge = 'Retirement age must be between 0 and 120.';
  else if (
    currentAge.value != null &&
    !currentAge.blank &&
    retirementAge.value <= currentAge.value
  ) {
    errors.retirementAge = 'Retirement age must be greater than current age.';
  }

  const withdrawalYears = parseNumber(input.withdrawalYears);
  if (withdrawalYears.blank)
    errors.withdrawalYears = 'Enter years of withdrawal.';
  else if (withdrawalYears.invalid || withdrawalYears.value == null)
    errors.withdrawalYears = 'Enter a valid withdrawal period.';
  else if (withdrawalYears.value <= 0)
    errors.withdrawalYears = 'Withdrawal years must be greater than zero.';
  else if (withdrawalYears.value > 100)
    errors.withdrawalYears = 'Withdrawal years look too large.';

  const contributionYears = parseNumber(input.contributionYears);
  if (contributionYears.blank)
    errors.contributionYears = 'Enter contribution years.';
  else if (contributionYears.invalid || contributionYears.value == null)
    errors.contributionYears = 'Enter a valid contribution period.';
  else if (contributionYears.value < 0)
    errors.contributionYears = 'Contribution years cannot be negative.';
  else if (contributionYears.value > 100)
    errors.contributionYears = 'Contribution years look too large.';

  const taxC = parseNumber(input.taxBracketContributionPercent);
  if (taxC.blank)
    errors.taxBracketContributionPercent =
      'Enter the contribution-period tax bracket (%).';
  else if (taxC.invalid || taxC.value == null)
    errors.taxBracketContributionPercent = 'Enter a valid tax bracket.';
  else if (taxC.value < 0 || taxC.value >= 100)
    errors.taxBracketContributionPercent =
      'Tax bracket must be from 0% up to (but not including) 100%.';

  const taxR = parseNumber(input.taxBracketRetirementPercent);
  if (taxR.blank)
    errors.taxBracketRetirementPercent =
      'Enter the retirement tax bracket (%).';
  else if (taxR.invalid || taxR.value == null)
    errors.taxBracketRetirementPercent = 'Enter a valid tax bracket.';
  else if (taxR.value < 0 || taxR.value >= 100)
    errors.taxBracketRetirementPercent =
      'Tax bracket must be from 0% up to (but not including) 100%.';

  const trad = parseNumber(input.traditionalContribution);
  if (trad.blank)
    errors.traditionalContribution = 'Enter the annual contribution.';
  else if (trad.invalid || trad.value == null)
    errors.traditionalContribution = 'Enter a valid contribution.';
  else if (trad.value < 0)
    errors.traditionalContribution = 'Contribution cannot be negative.';

  const roth = parseNumber(input.rothContribution);
  if (roth.blank)
    errors.rothContribution = 'Enter the Roth after-tax annual contribution.';
  else if (roth.invalid || roth.value == null)
    errors.rothContribution = 'Enter a valid Roth contribution.';
  else if (roth.value < 0)
    errors.rothContribution = 'Contribution cannot be negative.';

  const ret = parseNumber(input.annualReturnPercent);
  if (ret.blank) errors.annualReturnPercent = 'Enter the annual return rate.';
  else if (ret.invalid || ret.value == null)
    errors.annualReturnPercent = 'Enter a valid annual return.';
  else if (ret.value <= -100)
    errors.annualReturnPercent =
      'Annual return must be greater than −100%.';

  return errors;
}

export function validateIraInput(
  input: IraInput,
  rates: CurrencyRatesSnapshot | null | undefined,
): IraValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const currentAge = parseNumber(input.currentAge).value!;
  const contributionYears = parseNumber(input.contributionYears).value!;
  const withdrawalYears = parseNumber(input.withdrawalYears).value!;
  const taxC = parseNumber(input.taxBracketContributionPercent).value!;
  const taxR = parseNumber(input.taxBracketRetirementPercent).value!;
  const tradRaw = parseNumber(input.traditionalContribution).value!;
  const rothRaw = parseNumber(input.rothContribution).value!;
  const annualReturnPercent = parseNumber(input.annualReturnPercent).value!;

  const calcCurrency = input.traditionalContributionCurrency;

  const tradCanon = convertMoney(
    tradRaw,
    input.traditionalContributionCurrency,
    calcCurrency,
    rates,
  );
  if (!tradCanon.ok) {
    return {
      isValid: false,
      errors: { conversion: tradCanon.message },
      result: null,
    };
  }
  const rothCanon = convertMoney(
    rothRaw,
    input.rothContributionCurrency,
    calcCurrency,
    rates,
  );
  if (!rothCanon.ok) {
    return {
      isValid: false,
      errors: { conversion: rothCanon.message },
      result: null,
    };
  }

  const tradUsd = convertMoney(
    tradRaw,
    input.traditionalContributionCurrency,
    'USD',
    rates,
  );
  const rothUsd = convertMoney(
    rothRaw,
    input.rothContributionCurrency,
    'USD',
    rates,
  );

  const convertOut = (
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency,
  ): number | null => {
    const c = convertMoney(amount, from, to, rates);
    return c.ok ? c.amount : null;
  };

  const result = calculateIra({
    currentAge,
    contributionYears,
    withdrawalYears,
    taxBracketContributionPercent: taxC,
    taxBracketRetirementPercent: taxR,
    traditionalContribution: tradCanon.amount,
    rothContribution: rothCanon.amount,
    annualReturnPercent,
    calculationCurrency: calcCurrency,
    traditionalContributionUsd: tradUsd.ok ? tradUsd.amount : null,
    rothContributionUsd: rothUsd.ok ? rothUsd.amount : null,
    format: formatMoneyAmount,
    balanceCurrency: input.balanceCurrency,
    traditionalWithdrawalCurrency: input.traditionalWithdrawalCurrency,
    traditionalAfterTaxCurrency: input.traditionalAfterTaxCurrency,
    traditionalTakeHomeCurrency: input.traditionalTakeHomeCurrency,
    rothBalanceCurrency: input.rothBalanceCurrency,
    rothTakeHomeCurrency: input.rothTakeHomeCurrency,
    convertOut,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
