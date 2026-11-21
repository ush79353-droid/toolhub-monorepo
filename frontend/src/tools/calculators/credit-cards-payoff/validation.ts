import {
  calculateCreditCardsPayoff,
  type NormalizedCard,
} from './calculation';
import {
  isCardRowBlank,
  type CreditCardsPayoffFieldErrors,
  type CreditCardsPayoffInput,
  type CreditCardsPayoffResult,
} from './types';

export interface CreditCardsPayoffValidation {
  isValid: boolean;
  errors: CreditCardsPayoffFieldErrors;
  result: CreditCardsPayoffResult | null;
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

export function validateCreditCardsPayoffInput(
  input: CreditCardsPayoffInput
): CreditCardsPayoffValidation {
  const errors: CreditCardsPayoffFieldErrors = {};
  const cardErrors: NonNullable<CreditCardsPayoffFieldErrors['cards']> = [];
  const normalized: NormalizedCard[] = [];

  const budget = parseNumber(input.monthlyBudget);
  if (budget.blank || budget.invalid || budget.value === null) {
    errors.monthlyBudget = 'Enter a valid monthly budget.';
  } else if (!(budget.value > 0)) {
    errors.monthlyBudget = 'Monthly budget must be greater than zero.';
  }

  for (let i = 0; i < input.cards.length; i += 1) {
    const row = input.cards[i]!;
    const rowErr: {
      name?: string;
      balance?: string;
      minimumPayment?: string;
      aprPercent?: string;
    } = {};

    if (isCardRowBlank(row)) {
      cardErrors.push(rowErr);
      continue;
    }

    const balance = parseNumber(row.balance);
    const minimum = parseNumber(row.minimumPayment);
    const apr = parseNumber(row.aprPercent);
    const name = row.name.trim();

    if (!name) {
      rowErr.name = 'Enter a card name.';
    }

    if (balance.blank || balance.invalid || balance.value === null) {
      rowErr.balance = 'Enter a valid balance.';
    } else if (balance.value < 0) {
      rowErr.balance = 'Balance cannot be negative.';
    }

    if (minimum.blank || minimum.invalid || minimum.value === null) {
      rowErr.minimumPayment = 'Enter a valid minimum payment.';
    } else if (minimum.value < 0) {
      rowErr.minimumPayment = 'Minimum payment cannot be negative.';
    }

    if (apr.blank || apr.invalid || apr.value === null) {
      rowErr.aprPercent = 'Enter a valid interest rate.';
    } else if (apr.value < 0) {
      rowErr.aprPercent = 'Interest rate cannot be negative.';
    }

    cardErrors.push(rowErr);

    if (Object.keys(rowErr).length > 0) continue;
    if (balance.value === 0) continue;

    if (!(minimum.value! >= 0)) continue;

    normalized.push({
      id: i + 1,
      name: name || `Card ${i + 1}`,
      balance: balance.value!,
      minimum: minimum.value!,
      aprPercent: apr.value!,
    });
  }

  if (cardErrors.some((e) => Object.keys(e).length > 0)) {
    errors.cards = cardErrors;
  }

  if (
    errors.monthlyBudget ||
    (errors.cards && errors.cards.some((e) => Object.keys(e).length > 0))
  ) {
    return { isValid: false, errors, result: null };
  }

  if (normalized.length === 0) {
    errors.form = 'Enter at least one credit card with a balance greater than zero.';
    return { isValid: false, errors, result: null };
  }

  const minSum = normalized.reduce((s, c) => s + c.minimum, 0);
  if (budget.value! + 1e-12 < minSum) {
    errors.form = `Monthly budget must cover all minimums (at least $${minSum.toFixed(2)}).`;
    return { isValid: false, errors, result: null };
  }

  const result = calculateCreditCardsPayoff({
    monthlyBudget: budget.value!,
    cards: normalized,
  });

  if (!result) {
    errors.form =
      'These payments cannot pay off the cards within a reasonable time. Increase the monthly budget.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
