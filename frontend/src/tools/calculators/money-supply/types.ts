import type { SupportedCurrency } from '@/tools/shared/currency';

/** Monetary aggregate definition sets which formulas and aggregates apply. */
export type MoneySupplyDefinition =
  | 'us-fed'
  | 'textbook'
  | 'custom';

export type MoneyMagnitude =
  | 'units'
  | 'thousands'
  | 'millions'
  | 'billions'
  | 'trillions';

export const MONEY_MAGNITUDE_OPTIONS: readonly {
  id: MoneyMagnitude;
  label: string;
  factor: number;
}[] = [
  { id: 'units', label: 'Units', factor: 1 },
  { id: 'thousands', label: 'Thousands', factor: 1_000 },
  { id: 'millions', label: 'Millions', factor: 1_000_000 },
  { id: 'billions', label: 'Billions', factor: 1_000_000_000 },
  { id: 'trillions', label: 'Trillions', factor: 1_000_000_000_000 },
] as const;

export const DEFINITION_OPTIONS: readonly {
  id: MoneySupplyDefinition;
  label: string;
  short: string;
}[] = [
  {
    id: 'us-fed',
    label: 'U.S. Federal Reserve style',
    short: 'Illustrative Fed-style M1/M2 (post–May 2020 savings in M1). M3/M4 not published.',
  },
  {
    id: 'textbook',
    label: 'General textbook model',
    short: 'Teaching aggregates including optional MZM, M3, and M4.',
  },
  {
    id: 'custom',
    label: 'Custom monetary aggregate model',
    short: 'Same teaching stack as textbook with explicit wholesale/custom add-ons.',
  },
] as const;

export interface MoneySupplyInput {
  definition: MoneySupplyDefinition;
  currency: SupportedCurrency;
  magnitude: MoneyMagnitude;
  federalReserveNotes: string;
  coins: string;
  currencyInCirculation: string;
  reserveBalances: string;
  demandDeposits: string;
  travelersChecks: string;
  otherCheckableDeposits: string;
  savingsDeposits: string;
  eligibleMoneyMarketFunds: string;
  eligibleTimeDeposits: string;
  largeTimeDeposits: string;
  institutionalMoneyMarketFunds: string;
  otherLiquidInstruments: string;
}

export interface MoneySupplyResult {
  definition: MoneySupplyDefinition;
  definitionLabel: string;
  currency: SupportedCurrency;
  magnitude: MoneyMagnitude;
  m0: number;
  monetaryBase: number;
  m1: number;
  m2: number;
  mzm: number | null;
  m3: number | null;
  m4: number | null;
  m3UnavailableReason: string | null;
  m4UnavailableReason: string | null;
  currencyFromNotesCoins: number;
  formattedM0: string;
  formattedMb: string;
  formattedM1: string;
  formattedM2: string;
  formattedMzm: string;
  formattedM3: string;
  formattedM4: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
  m1Parts: { label: string; value: number; formatted: string }[];
  m2Parts: { label: string; value: number; formatted: string }[];
  mbParts: { label: string; value: number; formatted: string }[];
  chartAggregates: { label: string; value: number; formatted: string }[];
}

export type MoneySupplyFieldErrors = {
  form?: string;
  federalReserveNotes?: string;
  coins?: string;
  currencyInCirculation?: string;
  reserveBalances?: string;
  demandDeposits?: string;
  travelersChecks?: string;
  otherCheckableDeposits?: string;
  savingsDeposits?: string;
  eligibleMoneyMarketFunds?: string;
  eligibleTimeDeposits?: string;
  largeTimeDeposits?: string;
  institutionalMoneyMarketFunds?: string;
  otherLiquidInstruments?: string;
};

export function createDefaultInput(): MoneySupplyInput {
  return {
    definition: 'textbook',
    currency: 'USD',
    magnitude: 'units',
    federalReserveNotes: '',
    coins: '',
    currencyInCirculation: '',
    reserveBalances: '',
    demandDeposits: '',
    travelersChecks: '',
    otherCheckableDeposits: '',
    savingsDeposits: '',
    eligibleMoneyMarketFunds: '',
    eligibleTimeDeposits: '',
    largeTimeDeposits: '',
    institutionalMoneyMarketFunds: '',
    otherLiquidInstruments: '',
  };
}

export function createEmptyInput(): MoneySupplyInput {
  return createDefaultInput();
}

/** Reference teaching example (nonoverlapping components). */
export function createExampleInput(): MoneySupplyInput {
  return {
    definition: 'textbook',
    currency: 'USD',
    magnitude: 'units',
    federalReserveNotes: '2050000',
    coins: '50000',
    currencyInCirculation: '2100000',
    reserveBalances: '4050000',
    demandDeposits: '4000000',
    travelersChecks: '1000',
    otherCheckableDeposits: '4000000',
    savingsDeposits: '11400000',
    eligibleMoneyMarketFunds: '500000',
    eligibleTimeDeposits: '640000',
    largeTimeDeposits: '2000000',
    institutionalMoneyMarketFunds: '800000',
    otherLiquidInstruments: '500000',
  };
}
