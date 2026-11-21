import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  buildRdFormulaBreakdown,
  calculateRecurringDeposit,
  formatRdMoney,
  RD_COMPOUNDING_NOTE,
} from './calculation';
import type { RdFieldErrors, RdInput, RdResult } from './types';

export interface RdValidation {
  isValid: boolean;
  errors: RdFieldErrors;
  result: RdResult | null;
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

export function validateRdInput(
  input: RdInput,
  rates?: CurrencyRatesSnapshot | null,
): RdValidation {
  const errors: RdFieldErrors = {};
  const deposit = parseNumber(input.monthlyDeposit);
  const term = parseNumber(input.term);
  const rate = parseNumber(input.annualRatePercent);

  if (!deposit.blank && (deposit.invalid || deposit.value === null)) {
    errors.monthlyDeposit = 'Enter a valid monthly deposit.';
  } else if (deposit.value !== null && deposit.value < 0) {
    errors.monthlyDeposit = 'Monthly deposit cannot be negative.';
  }

  if (!term.blank && (term.invalid || term.value === null)) {
    errors.term = 'Enter a valid RD term.';
  } else if (term.value !== null && !(term.value > 0)) {
    errors.term = 'RD term must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualRatePercent = 'Enter a valid annual interest rate.';
  } else if (rate.value !== null && rate.value < 0) {
    errors.annualRatePercent = 'Interest rate cannot be negative.';
  } else if (rate.value !== null && rate.value > 100) {
    errors.annualRatePercent = 'Interest rate looks unreasonably high.';
  }

  if (
    input.termUnit !== 'years' &&
    input.termUnit !== 'months'
  ) {
    errors.term = 'Select years or months.';
  }

  const incomplete =
    deposit.blank ||
    term.blank ||
    rate.blank ||
    Boolean(errors.monthlyDeposit) ||
    Boolean(errors.term) ||
    Boolean(errors.annualRatePercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateRecurringDeposit({
    monthlyDeposit: deposit.value!,
    term: term.value!,
    termUnit: input.termUnit,
    annualRatePercent: rate.value!,
  });
  if (!computed) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const base = input.monthlyDepositCurrency;
  const depositsFx = convertMoney(
    computed.totalDeposits,
    base,
    input.totalDepositsCurrency,
    rates,
  );
  if (!depositsFx.ok) {
    errors.form = depositsFx.message;
    return { isValid: false, errors, result: null };
  }
  const interestFx = convertMoney(
    computed.totalInterest,
    base,
    input.totalInterestCurrency,
    rates,
  );
  if (!interestFx.ok) {
    errors.form = interestFx.message;
    return { isValid: false, errors, result: null };
  }
  const maturityFx = convertMoney(
    computed.maturityAmount,
    base,
    input.maturityCurrency,
    rates,
  );
  if (!maturityFx.ok) {
    errors.form = maturityFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: RdResult = {
    months: computed.months,
    quarters: computed.quarters,
    totalDepositsCanonical: computed.totalDeposits,
    totalInterestCanonical: computed.totalInterest,
    maturityCanonical: computed.maturityAmount,
    totalDeposits: depositsFx.amount,
    totalInterest: interestFx.amount,
    maturityAmount: maturityFx.amount,
    monthlyDepositCurrency: base,
    totalDepositsCurrency: input.totalDepositsCurrency,
    totalInterestCurrency: input.totalInterestCurrency,
    maturityCurrency: input.maturityCurrency,
    formattedTotalDeposits: formatRdMoney(
      depositsFx.amount,
      input.totalDepositsCurrency,
    ),
    formattedTotalInterest: formatRdMoney(
      interestFx.amount,
      input.totalInterestCurrency,
    ),
    formattedMaturity: formatRdMoney(
      maturityFx.amount,
      input.maturityCurrency,
    ),
    compoundingNote: RD_COMPOUNDING_NOTE,
    formulaBreakdown: buildRdFormulaBreakdown({
      monthlyDeposit: deposit.value!,
      months: computed.months,
      quarters: computed.quarters,
      annualRatePercent: rate.value!,
      maturityAmount: computed.maturityAmount,
      totalDeposits: computed.totalDeposits,
      totalInterest: computed.totalInterest,
    }),
  };

  return { isValid: true, errors, result };
}
