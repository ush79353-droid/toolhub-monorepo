import {
  buildMoneySupplyPresentation,
  calculateMoneySupplyBundle,
} from './calculation';
import type {
  MoneySupplyFieldErrors,
  MoneySupplyInput,
  MoneySupplyResult,
} from './types';

export interface MoneySupplyValidation {
  isValid: boolean;
  errors: MoneySupplyFieldErrors;
  result: MoneySupplyResult | null;
}

function parseNonNeg(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  negative: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') {
    return { value: null, blank: true, invalid: false, negative: false };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  if (value < 0) {
    return { value: null, blank: false, invalid: false, negative: true };
  }
  return { value, blank: false, invalid: false, negative: false };
}

function moneyErr(
  p: ReturnType<typeof parseNonNeg>,
  label: string
): string | undefined {
  if (p.blank) return `Enter ${label}.`;
  if (p.invalid) return `Enter a valid ${label}.`;
  if (p.negative) return `${label} cannot be negative.`;
  return undefined;
}

const CORE_FIELDS: {
  key: keyof MoneySupplyFieldErrors & keyof MoneySupplyInput;
  label: string;
}[] = [
  { key: 'federalReserveNotes', label: 'Federal Reserve notes' },
  { key: 'coins', label: 'coins' },
  { key: 'currencyInCirculation', label: 'currency in circulation' },
  { key: 'reserveBalances', label: 'reserve balances' },
  { key: 'demandDeposits', label: 'demand deposits' },
  { key: 'travelersChecks', label: "traveler's checks" },
  { key: 'otherCheckableDeposits', label: 'other checkable deposits' },
  { key: 'savingsDeposits', label: 'savings deposits' },
  { key: 'eligibleMoneyMarketFunds', label: 'eligible money market funds' },
  { key: 'eligibleTimeDeposits', label: 'eligible time deposits' },
];

const BROAD_FIELDS: {
  key: keyof MoneySupplyFieldErrors & keyof MoneySupplyInput;
  label: string;
}[] = [
  { key: 'largeTimeDeposits', label: 'large time deposits' },
  {
    key: 'institutionalMoneyMarketFunds',
    label: 'institutional money market funds',
  },
  { key: 'otherLiquidInstruments', label: 'other liquid instruments' },
];

export function validateMoneySupplyInput(
  input: MoneySupplyInput
): MoneySupplyValidation {
  const errors: MoneySupplyFieldErrors = {};
  const parsed: Record<string, number> = {};

  for (const { key, label } of CORE_FIELDS) {
    const p = parseNonNeg(String(input[key]));
    const err = moneyErr(p, label);
    if (err) errors[key] = err;
    else if (p.value != null) parsed[key] = p.value;
  }

  const needsBroad =
    input.definition === 'textbook' || input.definition === 'custom';
  if (needsBroad) {
    for (const { key, label } of BROAD_FIELDS) {
      const p = parseNonNeg(String(input[key]));
      const err = moneyErr(p, label);
      if (err) errors[key] = err;
      else if (p.value != null) parsed[key] = p.value;
    }
  } else {
    for (const { key } of BROAD_FIELDS) {
      const p = parseNonNeg(String(input[key]));
      if (!p.blank && (p.invalid || p.negative)) {
        errors[key] = moneyErr(p, key)!;
      }
      parsed[key] = p.value ?? 0;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  try {
    const bundleInput = {
      definition: input.definition,
      currency: input.currency,
      magnitude: input.magnitude,
      federalReserveNotes: parsed.federalReserveNotes,
      coins: parsed.coins,
      currencyInCirculation: parsed.currencyInCirculation,
      reserveBalances: parsed.reserveBalances,
      demandDeposits: parsed.demandDeposits,
      travelersChecks: parsed.travelersChecks,
      otherCheckableDeposits: parsed.otherCheckableDeposits,
      savingsDeposits: parsed.savingsDeposits,
      eligibleMoneyMarketFunds: parsed.eligibleMoneyMarketFunds,
      eligibleTimeDeposits: parsed.eligibleTimeDeposits,
      largeTimeDeposits: parsed.largeTimeDeposits ?? 0,
      institutionalMoneyMarketFunds:
        parsed.institutionalMoneyMarketFunds ?? 0,
      otherLiquidInstruments: parsed.otherLiquidInstruments ?? 0,
    };
    const bundle = calculateMoneySupplyBundle(bundleInput);
    const result = buildMoneySupplyPresentation(bundleInput, bundle);
    return { isValid: true, errors: {}, result };
  } catch (e) {
    return {
      isValid: false,
      errors: {
        form: e instanceof Error ? e.message : 'Unable to calculate.',
      },
      result: null,
    };
  }
}
