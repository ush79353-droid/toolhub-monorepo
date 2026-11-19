import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateAgiUsd, formatAgiMoney } from './calculation';
import type {
  AdjustedGrossIncomeFieldErrors,
  AdjustedGrossIncomeInput,
  AdjustedGrossIncomeResult,
  MoneyFieldKey,
} from './types';

export interface AdjustedGrossIncomeValidation {
  isValid: boolean;
  errors: AdjustedGrossIncomeFieldErrors;
  result: AdjustedGrossIncomeResult | null;
}

const NONNEG_FIELDS: MoneyFieldKey[] = [
  'wages',
  'business',
  'interestDividends',
  'retirementDistributions',
  'unemployment',
  'alimonyReceived',
  'taxableSocialSecurity',
  'otherIncome',
  'iraContributions',
  'studentLoanInterest',
  'educatorExpenses',
  'hsaContributions',
  'healthInsurancePremiums',
  'earlyWithdrawalPenalty',
  'alimonyPaid',
  'movingExpenses',
];

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

function currencyOf(
  input: AdjustedGrossIncomeInput,
  field: MoneyFieldKey
): SupportedCurrency {
  return input[`${field}Currency` as keyof AdjustedGrossIncomeInput] as SupportedCurrency;
}

function toUsd(
  amount: number,
  from: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === 'USD') return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to: 'USD',
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

function fromUsd(
  amount: number,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (to === 'USD') return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from: 'USD',
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

function readMoney(
  input: AdjustedGrossIncomeInput,
  field: MoneyFieldKey,
  errors: AdjustedGrossIncomeFieldErrors,
  allowNegative: boolean
): number | null {
  const raw = input[field] as string;
  const parsed = parseNumber(raw);
  if (parsed.blank) return 0;
  if (parsed.invalid || parsed.value === null) {
    errors[field] = 'Enter a valid amount.';
    return null;
  }
  if (!allowNegative && parsed.value < 0) {
    errors[field] = 'Amount must be zero or greater.';
    return null;
  }
  return parsed.value;
}

/**
 * Validates inputs, converts money to USD for IRS limit tests, computes AGI,
 * then FX-converts results into independent display currencies.
 */
export function validateAdjustedGrossIncomeInput(
  input: AdjustedGrossIncomeInput,
  rates?: CurrencyRatesSnapshot | null
): AdjustedGrossIncomeValidation {
  const errors: AdjustedGrossIncomeFieldErrors = {};

  const wages = readMoney(input, 'wages', errors, false);
  const business = readMoney(input, 'business', errors, false);
  const interestDividends = readMoney(input, 'interestDividends', errors, false);
  const capitalGains = readMoney(input, 'capitalGains', errors, true);
  const retirementDistributions = readMoney(
    input,
    'retirementDistributions',
    errors,
    false
  );
  const unemployment = readMoney(input, 'unemployment', errors, false);
  const alimonyReceived = readMoney(input, 'alimonyReceived', errors, false);
  const taxableSocialSecurity = readMoney(
    input,
    'taxableSocialSecurity',
    errors,
    false
  );
  const otherIncome = readMoney(input, 'otherIncome', errors, false);

  const iraContributions = readMoney(input, 'iraContributions', errors, false);
  const studentLoanInterest = readMoney(
    input,
    'studentLoanInterest',
    errors,
    false
  );
  const educatorExpenses = readMoney(input, 'educatorExpenses', errors, false);
  const hsaContributions = readMoney(input, 'hsaContributions', errors, false);
  const healthInsurancePremiums = readMoney(
    input,
    'healthInsurancePremiums',
    errors,
    false
  );
  const earlyWithdrawalPenalty = readMoney(
    input,
    'earlyWithdrawalPenalty',
    errors,
    false
  );
  const alimonyPaid = readMoney(input, 'alimonyPaid', errors, false);
  const movingExpenses = readMoney(input, 'movingExpenses', errors, false);

  void NONNEG_FIELDS;

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const moneyPairs: Array<{ amount: number; field: MoneyFieldKey }> = [
    { amount: wages!, field: 'wages' },
    { amount: business!, field: 'business' },
    { amount: interestDividends!, field: 'interestDividends' },
    { amount: capitalGains!, field: 'capitalGains' },
    { amount: retirementDistributions!, field: 'retirementDistributions' },
    { amount: unemployment!, field: 'unemployment' },
    { amount: alimonyReceived!, field: 'alimonyReceived' },
    { amount: taxableSocialSecurity!, field: 'taxableSocialSecurity' },
    { amount: otherIncome!, field: 'otherIncome' },
    { amount: iraContributions!, field: 'iraContributions' },
    { amount: studentLoanInterest!, field: 'studentLoanInterest' },
    { amount: educatorExpenses!, field: 'educatorExpenses' },
    { amount: hsaContributions!, field: 'hsaContributions' },
    { amount: healthInsurancePremiums!, field: 'healthInsurancePremiums' },
    { amount: earlyWithdrawalPenalty!, field: 'earlyWithdrawalPenalty' },
    { amount: alimonyPaid!, field: 'alimonyPaid' },
    { amount: movingExpenses!, field: 'movingExpenses' },
  ];

  const usdAmounts: Record<MoneyFieldKey, number> = {} as Record<
    MoneyFieldKey,
    number
  >;

  for (const pair of moneyPairs) {
    const fx = toUsd(pair.amount, currencyOf(input, pair.field), rates);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    usdAmounts[pair.field] = fx.amount;
  }

  const computed = calculateAgiUsd({
    filingStatus: input.filingStatus,
    age50OrOver: input.age50OrOver,
    age55OrOver: input.age55OrOver,
    coveredByWorkplacePlan: input.coveredByWorkplacePlan,
    hsaCoverage: input.hsaCoverage,
    selfEmployedHealthInsurance: input.selfEmployedHealthInsurance,
    alimonyReceivedPre2019: input.alimonyReceivedPre2019,
    alimonyPaidPre2019: input.alimonyPaidPre2019,
    armedForcesMove: input.armedForcesMove,
    includeMoreIncome: input.showMoreIncome,
    includeMoreDeductions: input.showMoreDeductions,
    income: {
      wages: usdAmounts.wages,
      business: usdAmounts.business,
      interestDividends: usdAmounts.interestDividends,
      capitalGains: usdAmounts.capitalGains,
      retirementDistributions: usdAmounts.retirementDistributions,
      unemployment: usdAmounts.unemployment,
      alimonyReceived: usdAmounts.alimonyReceived,
      taxableSocialSecurity: usdAmounts.taxableSocialSecurity,
      otherIncome: usdAmounts.otherIncome,
    },
    adjustments: {
      iraContributions: usdAmounts.iraContributions,
      studentLoanInterest: usdAmounts.studentLoanInterest,
      educatorExpenses: usdAmounts.educatorExpenses,
      hsaContributions: usdAmounts.hsaContributions,
      healthInsurancePremiums: usdAmounts.healthInsurancePremiums,
      earlyWithdrawalPenalty: usdAmounts.earlyWithdrawalPenalty,
      alimonyPaid: usdAmounts.alimonyPaid,
      movingExpenses: usdAmounts.movingExpenses,
    },
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const grossFx = fromUsd(computed.grossIncomeUsd, input.grossIncomeCurrency, rates);
  if (!grossFx.ok) {
    errors.form = grossFx.message;
    return { isValid: false, errors, result: null };
  }
  const adjFx = fromUsd(
    computed.totalAdjustmentsUsd,
    input.totalAdjustmentsCurrency,
    rates
  );
  if (!adjFx.ok) {
    errors.form = adjFx.message;
    return { isValid: false, errors, result: null };
  }
  const agiFx = fromUsd(computed.agiUsd, input.agiCurrency, rates);
  if (!agiFx.ok) {
    errors.form = agiFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: AdjustedGrossIncomeResult = {
    ...computed,
    grossIncome: grossFx.amount,
    totalAdjustments: adjFx.amount,
    agi: agiFx.amount,
    grossIncomeCurrency: input.grossIncomeCurrency,
    totalAdjustmentsCurrency: input.totalAdjustmentsCurrency,
    agiCurrency: input.agiCurrency,
    formattedGrossIncome: formatAgiMoney(
      grossFx.amount,
      input.grossIncomeCurrency
    ),
    formattedTotalAdjustments: formatAgiMoney(
      adjFx.amount,
      input.totalAdjustmentsCurrency
    ),
    formattedAgi: formatAgiMoney(agiFx.amount, input.agiCurrency),
  };

  return { isValid: true, errors, result };
}
