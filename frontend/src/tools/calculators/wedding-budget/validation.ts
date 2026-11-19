import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateWeddingBudget, formatWeddingMoney } from './calculation';
import type {
  ExpenseFieldKey,
  MoneyAmount,
  WeddingBudgetFieldErrors,
  WeddingBudgetInput,
  WeddingBudgetResult,
} from './types';
import { EXPENSE_FIELD_KEYS } from './types';

export interface WeddingBudgetValidation {
  isValid: boolean;
  errors: WeddingBudgetFieldErrors;
  result: WeddingBudgetResult | null;
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

function parseMoneyField(
  line: MoneyAmount,
  label: string
): { value: number | null; error?: string } {
  const parsed = parseNumber(line.amount);
  if (parsed.blank) return { value: null, error: `Enter ${label}.` };
  if (parsed.invalid || parsed.value === null) {
    return { value: null, error: `Enter a valid ${label}.` };
  }
  if (parsed.value < 0) return { value: null, error: `${label} cannot be negative.` };
  return { value: parsed.value };
}

const EXPENSE_LABELS: Record<ExpenseFieldKey, string> = {
  bridesDress: "bride's dress",
  jewellery: 'jewellery',
  groomsSuit: "groom's suit and accessories",
  weddingRings: 'wedding rings',
  hairAndMakeup: 'hair and makeup',
  weddingStationery: 'wedding stationery',
  photographyVideo: 'photography & video',
  florist: 'florist',
  weddingPlanner: 'wedding planner',
  venue: 'venue',
  rehearsalDinner: 'rehearsal dinner',
  catering: 'catering',
  weddingCake: 'wedding cake',
  musiciansDj: 'ceremony musicians / DJs',
  liquors: 'liquors',
  ceremonySite: 'ceremony site',
  officiant: 'officiant',
  hotel: 'hotel',
  limoTransport: 'limo rental and transportation',
};

/**
 * Normalize every money line into the planned-budget currency, then compute
 * section totals, grand total, cost per guest, and budget balance.
 * Guest count is never FX-converted.
 */
export function validateWeddingBudgetInput(
  input: WeddingBudgetInput,
  rates?: CurrencyRatesSnapshot | null
): WeddingBudgetValidation {
  const errors: WeddingBudgetFieldErrors = {};
  const calcCurrency = input.plannedBudget.currency;

  const planned = parseMoneyField(input.plannedBudget, 'planned wedding budget');
  if (planned.error) errors.plannedBudget = planned.error;

  const guests = parseNumber(input.guestCount);
  if (guests.blank) {
    errors.guestCount = 'Enter the number of guests.';
  } else if (guests.invalid || guests.value === null) {
    errors.guestCount = 'Enter a valid number of guests.';
  } else if (!(guests.value > 0)) {
    errors.guestCount = 'Number of guests must be greater than zero.';
  }

  const expenseValues: Partial<Record<ExpenseFieldKey, number>> = {};
  for (const key of EXPENSE_FIELD_KEYS) {
    const parsed = parseMoneyField(input[key], EXPENSE_LABELS[key]);
    if (parsed.error) {
      errors[key] = parsed.error;
    } else if (parsed.value !== null) {
      expenseValues[key] = parsed.value;
    }
  }

  const customNormalized: number[] = [];
  for (let i = 0; i < input.customExpenses.length; i++) {
    const line = input.customExpenses[i]!;
    const label = line.label.trim() || `custom expense ${i + 1}`;
    const parsed = parseMoneyField(
      { amount: line.amount, currency: line.currency },
      label
    );
    if (parsed.error) {
      errors.customExpenses = parsed.error;
      break;
    }
    const converted = convertMoney(
      parsed.value!,
      line.currency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      break;
    }
    customNormalized.push(converted.amount);
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const normalizeField = (
    key: ExpenseFieldKey
  ): { ok: true; amount: number } | { ok: false; message: string } => {
    return convertMoney(
      expenseValues[key]!,
      input[key].currency,
      calcCurrency,
      rates
    );
  };

  const brideKeys: ExpenseFieldKey[] = [
    'bridesDress',
    'jewellery',
    'groomsSuit',
    'weddingRings',
    'hairAndMakeup',
  ];
  const subKeys: ExpenseFieldKey[] = [
    'weddingStationery',
    'photographyVideo',
    'florist',
    'weddingPlanner',
  ];
  const venueKeys: ExpenseFieldKey[] = [
    'venue',
    'rehearsalDinner',
    'catering',
    'weddingCake',
    'musiciansDj',
    'liquors',
  ];
  const ceremonyKeys: ExpenseFieldKey[] = ['ceremonySite', 'officiant'];
  const transportKeys: ExpenseFieldKey[] = ['hotel', 'limoTransport'];

  const normalizeGroup = (keys: readonly ExpenseFieldKey[]) => {
    const out: number[] = [];
    for (const key of keys) {
      const converted = normalizeField(key);
      if (!converted.ok) return { ok: false as const, message: converted.message };
      out.push(converted.amount);
    }
    return { ok: true as const, amounts: out };
  };

  const plannedConverted = convertMoney(
    planned.value!,
    input.plannedBudget.currency,
    calcCurrency,
    rates
  );
  if (!plannedConverted.ok) {
    errors.form = plannedConverted.message;
    return { isValid: false, errors, result: null };
  }

  const bride = normalizeGroup(brideKeys);
  if (!bride.ok) {
    errors.form = bride.message;
    return { isValid: false, errors, result: null };
  }
  const subs = normalizeGroup(subKeys);
  if (!subs.ok) {
    errors.form = subs.message;
    return { isValid: false, errors, result: null };
  }
  const venue = normalizeGroup(venueKeys);
  if (!venue.ok) {
    errors.form = venue.message;
    return { isValid: false, errors, result: null };
  }
  const ceremony = normalizeGroup(ceremonyKeys);
  if (!ceremony.ok) {
    errors.form = ceremony.message;
    return { isValid: false, errors, result: null };
  }
  const transport = normalizeGroup(transportKeys);
  if (!transport.ok) {
    errors.form = transport.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateWeddingBudget({
    plannedBudget: plannedConverted.amount,
    guestCount: guests.value!,
    brideGroom: bride.amounts,
    subcontractors: subs.amounts,
    venueFood: venue.amounts,
    ceremony: ceremony.amounts,
    transport: transport.amounts,
    customExpenses: customNormalized,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite wedding budget.';
    return { isValid: false, errors, result: null };
  }

  const fmt = (n: number) => formatWeddingMoney(n, calcCurrency);
  const result: WeddingBudgetResult = {
    calcCurrency,
    brideGroomTotal: computed.brideGroomTotal,
    subcontractorsTotal: computed.subcontractorsTotal,
    venueFoodTotal: computed.venueFoodTotal,
    ceremonyTotal: computed.ceremonyTotal,
    transportTotal: computed.transportTotal,
    customTotal: computed.customTotal,
    totalWeddingCost: computed.totalWeddingCost,
    costPerGuest: computed.costPerGuest,
    budgetBalance: computed.budgetBalance,
    balanceStatus: computed.balanceStatus,
    statusMessage: computed.statusMessage,
    formattedBrideGroomTotal: fmt(computed.brideGroomTotal),
    formattedSubcontractorsTotal: fmt(computed.subcontractorsTotal),
    formattedVenueFoodTotal: fmt(computed.venueFoodTotal),
    formattedCeremonyTotal: fmt(computed.ceremonyTotal),
    formattedTransportTotal: fmt(computed.transportTotal),
    formattedCustomTotal: fmt(computed.customTotal),
    formattedTotalWeddingCost: fmt(computed.totalWeddingCost),
    formattedCostPerGuest:
      computed.costPerGuest === null ? '—' : fmt(computed.costPerGuest),
    formattedBudgetBalance: fmt(computed.budgetBalance),
    summaryText: `Total wedding cost ${fmt(computed.totalWeddingCost)}; cost per guest ${
      computed.costPerGuest === null ? '—' : fmt(computed.costPerGuest)
    }; budget balance ${fmt(computed.budgetBalance)}. ${computed.statusMessage}`,
  };

  return { isValid: true, errors: {}, result };
}
