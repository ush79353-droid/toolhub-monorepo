/**
 * Verified everyday cash denomination sets for the Money Counter.
 * Face values are in major currency units. Arithmetic uses integer minor units.
 *
 * Sources (illustrative circulating sets for manual till counts):
 * - USD: Federal Reserve / US Mint circulating notes & coins
 * - EUR: ECB current banknotes & euro coins (€500 remains legal tender)
 * - GBP: Bank of England notes + standard UK circulating coins
 * - CAD: Bank of Canada polymer notes; no 1¢ (withdrawn 2013)
 * - AUD: RBA notes; 1¢/2¢ withdrawn
 * - INR: RBI circulating notes; common coin set
 * - JPY: Bank of Japan notes & coins (no minor subunit)
 * - PKR: SBP circulating notes & coins
 */
import type { SupportedCurrency } from '@/tools/shared/currency';
import { getCurrencyFractionDigits } from '@/tools/shared/currency';

export type DenomKind = 'note' | 'coin';

export interface Denomination {
  id: string;
  kind: DenomKind;
  /** Face value in major units (e.g. 0.25 for a US quarter). */
  faceValue: number;
  label: string;
}

export interface CurrencyDenominationSet {
  currency: SupportedCurrency;
  notes: readonly Denomination[];
  coins: readonly Denomination[];
}

function note(
  currency: SupportedCurrency,
  faceValue: number,
  label: string
): Denomination {
  return {
    id: `${currency}-note-${faceValue}`,
    kind: 'note',
    faceValue,
    label,
  };
}

function coin(
  currency: SupportedCurrency,
  faceValue: number,
  label: string
): Denomination {
  return {
    id: `${currency}-coin-${faceValue}`,
    kind: 'coin',
    faceValue,
    label,
  };
}

export const MONEY_COUNTER_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'INR',
  'JPY',
  'PKR',
] as const satisfies readonly SupportedCurrency[];

export type MoneyCounterCurrency = (typeof MONEY_COUNTER_CURRENCIES)[number];

const SETS: Record<MoneyCounterCurrency, CurrencyDenominationSet> = {
  USD: {
    currency: 'USD',
    notes: [
      note('USD', 1, '$1'),
      note('USD', 2, '$2'),
      note('USD', 5, '$5'),
      note('USD', 10, '$10'),
      note('USD', 20, '$20'),
      note('USD', 50, '$50'),
      note('USD', 100, '$100'),
    ],
    coins: [
      coin('USD', 0.01, '1¢'),
      coin('USD', 0.05, '5¢'),
      coin('USD', 0.1, '10¢'),
      coin('USD', 0.25, '25¢'),
      coin('USD', 0.5, '50¢'),
      coin('USD', 1, '$1 coin'),
    ],
  },
  EUR: {
    currency: 'EUR',
    notes: [
      note('EUR', 5, '€5'),
      note('EUR', 10, '€10'),
      note('EUR', 20, '€20'),
      note('EUR', 50, '€50'),
      note('EUR', 100, '€100'),
      note('EUR', 200, '€200'),
      note('EUR', 500, '€500'),
    ],
    coins: [
      coin('EUR', 0.01, '1c'),
      coin('EUR', 0.02, '2c'),
      coin('EUR', 0.05, '5c'),
      coin('EUR', 0.1, '10c'),
      coin('EUR', 0.2, '20c'),
      coin('EUR', 0.5, '50c'),
      coin('EUR', 1, '€1'),
      coin('EUR', 2, '€2'),
    ],
  },
  GBP: {
    currency: 'GBP',
    notes: [
      note('GBP', 5, '£5'),
      note('GBP', 10, '£10'),
      note('GBP', 20, '£20'),
      note('GBP', 50, '£50'),
    ],
    coins: [
      coin('GBP', 0.01, '1p'),
      coin('GBP', 0.02, '2p'),
      coin('GBP', 0.05, '5p'),
      coin('GBP', 0.1, '10p'),
      coin('GBP', 0.2, '20p'),
      coin('GBP', 0.5, '50p'),
      coin('GBP', 1, '£1'),
      coin('GBP', 2, '£2'),
    ],
  },
  CAD: {
    currency: 'CAD',
    notes: [
      note('CAD', 5, 'CA$5'),
      note('CAD', 10, 'CA$10'),
      note('CAD', 20, 'CA$20'),
      note('CAD', 50, 'CA$50'),
      note('CAD', 100, 'CA$100'),
    ],
    coins: [
      coin('CAD', 0.05, '5¢'),
      coin('CAD', 0.1, '10¢'),
      coin('CAD', 0.25, '25¢'),
      coin('CAD', 0.5, '50¢'),
      coin('CAD', 1, 'CA$1'),
      coin('CAD', 2, 'CA$2'),
    ],
  },
  AUD: {
    currency: 'AUD',
    notes: [
      note('AUD', 5, 'A$5'),
      note('AUD', 10, 'A$10'),
      note('AUD', 20, 'A$20'),
      note('AUD', 50, 'A$50'),
      note('AUD', 100, 'A$100'),
    ],
    coins: [
      coin('AUD', 0.05, '5c'),
      coin('AUD', 0.1, '10c'),
      coin('AUD', 0.2, '20c'),
      coin('AUD', 0.5, '50c'),
      coin('AUD', 1, 'A$1'),
      coin('AUD', 2, 'A$2'),
    ],
  },
  INR: {
    currency: 'INR',
    notes: [
      note('INR', 10, '₹10'),
      note('INR', 20, '₹20'),
      note('INR', 50, '₹50'),
      note('INR', 100, '₹100'),
      note('INR', 200, '₹200'),
      note('INR', 500, '₹500'),
    ],
    coins: [
      coin('INR', 1, '₹1'),
      coin('INR', 2, '₹2'),
      coin('INR', 5, '₹5'),
      coin('INR', 10, '₹10'),
      coin('INR', 20, '₹20'),
    ],
  },
  JPY: {
    currency: 'JPY',
    notes: [
      note('JPY', 1000, '¥1,000'),
      note('JPY', 2000, '¥2,000'),
      note('JPY', 5000, '¥5,000'),
      note('JPY', 10000, '¥10,000'),
    ],
    coins: [
      coin('JPY', 1, '¥1'),
      coin('JPY', 5, '¥5'),
      coin('JPY', 10, '¥10'),
      coin('JPY', 50, '¥50'),
      coin('JPY', 100, '¥100'),
      coin('JPY', 500, '¥500'),
    ],
  },
  PKR: {
    currency: 'PKR',
    notes: [
      note('PKR', 10, 'Rs 10'),
      note('PKR', 20, 'Rs 20'),
      note('PKR', 50, 'Rs 50'),
      note('PKR', 100, 'Rs 100'),
      note('PKR', 500, 'Rs 500'),
      note('PKR', 1000, 'Rs 1,000'),
      note('PKR', 5000, 'Rs 5,000'),
    ],
    coins: [
      coin('PKR', 1, 'Rs 1'),
      coin('PKR', 2, 'Rs 2'),
      coin('PKR', 5, 'Rs 5'),
      coin('PKR', 10, 'Rs 10'),
    ],
  },
};

export function isMoneyCounterCurrency(
  code: string
): code is MoneyCounterCurrency {
  return (MONEY_COUNTER_CURRENCIES as readonly string[]).includes(code);
}

export function getDenominationSet(
  currency: MoneyCounterCurrency
): CurrencyDenominationSet {
  return SETS[currency];
}

export function faceToMinorUnits(
  faceValue: number,
  currency: SupportedCurrency
): number {
  const digits = getCurrencyFractionDigits(currency);
  const scale = 10 ** digits;
  return Math.round(faceValue * scale);
}
