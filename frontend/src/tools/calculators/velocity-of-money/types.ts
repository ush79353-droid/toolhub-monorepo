import type { SupportedCurrency } from '@/tools/shared/currency';

export type VelocityMode = 'transactions' | 'gdp';

/** Which quantity to solve for (others are inputs). */
export type VelocitySolveTarget =
  | 'velocity'
  | 'moneySupply'
  | 'nominalFlow'
  | 'priceIndex'
  | 'volume';

export type TransactionSource = 'direct' | 'derived';

export type MeasurementPeriod = 'year' | 'quarter' | 'month' | 'custom';

export type MoneyAggregate = 'M1' | 'M2' | 'base' | 'other';

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

export const PERIOD_OPTIONS: readonly {
  id: MeasurementPeriod;
  label: string;
  unitSuffix: string;
}[] = [
  { id: 'year', label: 'Yearly', unitSuffix: 'turnovers/year' },
  { id: 'quarter', label: 'Quarterly', unitSuffix: 'turnovers/quarter' },
  { id: 'month', label: 'Monthly', unitSuffix: 'turnovers/month' },
  { id: 'custom', label: 'Custom period', unitSuffix: 'turnovers/period' },
] as const;

export const AGGREGATE_OPTIONS: readonly {
  id: MoneyAggregate;
  label: string;
}[] = [
  { id: 'M1', label: 'M1' },
  { id: 'M2', label: 'M2' },
  { id: 'base', label: 'Monetary base' },
  { id: 'other', label: 'Other / custom' },
] as const;

export interface VelocityOfMoneyInput {
  mode: VelocityMode;
  solveTarget: VelocitySolveTarget;
  transactionSource: TransactionSource;
  currency: SupportedCurrency;
  magnitude: MoneyMagnitude;
  period: MeasurementPeriod;
  moneyAggregate: MoneyAggregate;
  /** Dimensionless price index (e.g. 110 with base 100) */
  priceIndex: string;
  /** Index base, typically 100 */
  indexBase: string;
  /** Monetary base price for one standardized basket (required to convert index → money) */
  basePrice: string;
  /** Real transaction volume / basket count */
  volume: string;
  /** Direct nominal transaction value (display units) */
  nominalTransactionValue: string;
  /** Nominal GDP (display units) — GDP mode */
  nominalGdp: string;
  /** Money stock (display units) */
  moneySupply: string;
  velocity: string;
}

export interface VelocityOfMoneyResult {
  mode: VelocityMode;
  solveTarget: VelocitySolveTarget;
  currency: SupportedCurrency;
  magnitude: MoneyMagnitude;
  period: MeasurementPeriod;
  periodUnit: string;
  moneyAggregate: MoneyAggregate;
  velocity: number;
  moneySupplyBase: number;
  numeratorBase: number;
  nominalTransactionValueBase: number | null;
  nominalGdpBase: number | null;
  priceIndex: number | null;
  volume: number | null;
  impliedPricePerBasket: number | null;
  formattedVelocity: string;
  formattedMoneySupply: string;
  formattedNumerator: string;
  formattedNominalTxn: string | null;
  formattedNominalGdp: string | null;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  chartParts: { label: string; value: number; formatted: string }[];
}

export type VelocityOfMoneyFieldErrors = {
  form?: string;
  priceIndex?: string;
  indexBase?: string;
  basePrice?: string;
  volume?: string;
  nominalTransactionValue?: string;
  nominalGdp?: string;
  moneySupply?: string;
  velocity?: string;
};

export function createDefaultInput(): VelocityOfMoneyInput {
  return {
    mode: 'transactions',
    solveTarget: 'velocity',
    transactionSource: 'direct',
    currency: 'USD',
    magnitude: 'units',
    period: 'year',
    moneyAggregate: 'M2',
    priceIndex: '',
    indexBase: '100',
    basePrice: '',
    volume: '',
    nominalTransactionValue: '',
    nominalGdp: '',
    moneySupply: '',
    velocity: '',
  };
}

export function createEmptyInput(
  mode: VelocityMode = 'transactions'
): VelocityOfMoneyInput {
  return {
    ...createDefaultInput(),
    mode,
    indexBase: '',
  };
}

/** Example A: T=$1.5M, M=$500k → V=3 */
export function createExampleInput(): VelocityOfMoneyInput {
  return {
    mode: 'transactions',
    solveTarget: 'velocity',
    transactionSource: 'direct',
    currency: 'USD',
    magnitude: 'units',
    period: 'year',
    moneyAggregate: 'M2',
    priceIndex: '',
    indexBase: '100',
    basePrice: '',
    volume: '',
    nominalTransactionValue: '1500000',
    nominalGdp: '',
    moneySupply: '500000',
    velocity: '',
  };
}

export function createGdpExampleInput(): VelocityOfMoneyInput {
  return {
    mode: 'gdp',
    solveTarget: 'velocity',
    transactionSource: 'direct',
    currency: 'USD',
    magnitude: 'trillions',
    period: 'year',
    moneyAggregate: 'M2',
    priceIndex: '',
    indexBase: '100',
    basePrice: '',
    volume: '',
    nominalTransactionValue: '',
    nominalGdp: '25',
    moneySupply: '20',
    velocity: '',
  };
}

export function magnitudeFactor(m: MoneyMagnitude): number {
  return MONEY_MAGNITUDE_OPTIONS.find((o) => o.id === m)?.factor ?? 1;
}

export function periodUnit(period: MeasurementPeriod): string {
  return PERIOD_OPTIONS.find((o) => o.id === period)?.unitSuffix ?? 'turnovers/period';
}
