import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateMagi, formatMagiMoney } from './calculation';
import {
  MAGI_MONEY_FIELDS,
  type MagiFieldErrors,
  type MagiInput,
  type MagiMoneyFieldKey,
  type MagiResult,
} from './types';

export interface MagiValidation {
  isValid: boolean;
  errors: MagiFieldErrors;
  result: MagiResult | null;
}

function parseNumber(
  raw: string,
  blankAsZero: boolean
): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return {
      value: blankAsZero ? 0 : null,
      blank: !blankAsZero,
      invalid: false,
    };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
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

const ADJUSTMENT_KEYS: readonly MagiMoneyFieldKey[] = MAGI_MONEY_FIELDS.filter(
  (f) => f.key !== 'agi'
).map((f) => f.key);

export function validateMagiInput(
  input: MagiInput,
  rates?: CurrencyRatesSnapshot | null
): MagiValidation {
  const errors: MagiFieldErrors = {};
  const parsed = new Map<MagiMoneyFieldKey, ReturnType<typeof parseNumber>>();

  for (const field of MAGI_MONEY_FIELDS) {
    const blankAsZero = field.key !== 'agi';
    const p = parseNumber(input[field.key], blankAsZero);
    parsed.set(field.key, p);

    if (p.invalid || (p.value === null && !p.blank)) {
      errors[field.key] = `Enter a valid ${fieldLabel(field.key)} amount.`;
      continue;
    }
    if (p.value !== null && !field.allowNegative && p.value < 0) {
      errors[field.key] = `${fieldLabel(field.key)} must be zero or greater.`;
    }
  }

  for (const key of Object.keys(errors) as MagiMoneyFieldKey[]) {
    if (errors[key] === undefined) delete errors[key];
  }

  const agiParsed = parsed.get('agi')!;
  if (agiParsed.blank) {
    return { isValid: false, errors, result: null };
  }
  if (errors.agi || agiParsed.value === null) {
    return { isValid: false, errors, result: null };
  }

  const hasFieldErrors = Object.keys(errors).length > 0;
  if (hasFieldErrors) {
    return { isValid: false, errors, result: null };
  }

  const base = input.agiCurrency;
  const normalized: Record<MagiMoneyFieldKey, number> = {
    agi: agiParsed.value!,
  } as Record<MagiMoneyFieldKey, number>;

  for (const key of ADJUSTMENT_KEYS) {
    const p = parsed.get(key)!;
    const amount = p.value ?? 0;
    const currencyKey = `${key}Currency` as keyof MagiInput;
    const from = input[currencyKey] as SupportedCurrency;
    const converted = convertMoney(amount, from, base, rates);
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    normalized[key] = converted.amount;
  }

  const computed = calculateMagi({
    agi: normalized.agi,
    foreignEarnedIncome: normalized.foreignEarnedIncome,
    foreignHousingCost: normalized.foreignHousingCost,
    nonTaxableSocialBenefits: normalized.nonTaxableSocialBenefits,
    selfEmploymentTaxes: normalized.selfEmploymentTaxes,
    iraContributions: normalized.iraContributions,
    passiveIncomeOrLosses: normalized.passiveIncomeOrLosses,
    others: normalized.others,
    employerPaidAdoptionBenefits: normalized.employerPaidAdoptionBenefits,
    savingsBondInterest: normalized.savingsBondInterest,
    studentLoanInterest: normalized.studentLoanInterest,
    qualifiedTuitionExpenses: normalized.qualifiedTuitionExpenses,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const magiFx = convertMoney(
    computed.magi,
    base,
    input.magiCurrency,
    rates
  );
  if (!magiFx.ok) {
    errors.form = magiFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: MagiResult = {
    magiCanonical: computed.magi,
    magi: magiFx.amount,
    agiCurrency: base,
    magiCurrency: input.magiCurrency,
    formattedMagi: formatMagiMoney(magiFx.amount, input.magiCurrency),
  };

  return { isValid: true, errors, result };
}

function fieldLabel(key: MagiMoneyFieldKey): string {
  const labels: Record<MagiMoneyFieldKey, string> = {
    agi: 'adjusted gross income (AGI)',
    foreignEarnedIncome: 'foreign-earned income',
    foreignHousingCost: 'foreign housing cost',
    nonTaxableSocialBenefits: 'non-taxable social benefits',
    selfEmploymentTaxes: 'self-employment taxes',
    iraContributions: 'IRA contributions',
    passiveIncomeOrLosses: 'passive income or losses',
    others: 'others',
    employerPaidAdoptionBenefits: 'employer-paid adoption benefits',
    savingsBondInterest: 'savings bond interest',
    studentLoanInterest: 'student loan interest',
    qualifiedTuitionExpenses: 'qualified tuition expenses and fees',
  };
  return labels[key];
}