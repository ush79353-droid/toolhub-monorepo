export type RsiMethod = 'wilder' | 'simple';

export const MAX_RSI_PRICES = 100;
export const MIN_RSI_PRICE_ROWS = 2;
export const DEFAULT_RSI_PERIOD = 14;

export interface RsiPriceRow {
  id: string;
  price: string;
}

export interface RelativeStrengthIndexInput {
  prices: RsiPriceRow[];
  period: string;
  method: RsiMethod;
}

export interface RsiPoint {
  priceIndex: number;
  price: number;
  averageGain: number;
  averageLoss: number;
  relativeStrength: number | null;
  rsi: number;
}

export type RsiStatus = 'valid' | 'insufficient-data' | 'invalid' | 'missing';

export interface RelativeStrengthIndexResult {
  rsi: number | null;
  averageGain: number | null;
  averageLoss: number | null;
  relativeStrength: number | null;
  interpretation: string | null;
  series: RsiPoint[];
  status: RsiStatus;
  priceCount: number;
  changeCount: number;
  requiredPrices: number;
  formattedRsi: string | null;
  formattedAvgGain: string | null;
  formattedAvgLoss: string | null;
  formattedRs: string | null;
  insufficientMessage: string | null;
  warningMessage: string | null;
}

export type RelativeStrengthIndexFieldErrors = {
  form?: string;
  period?: string;
  prices?: Record<string, string>;
};

let priceSeq = 0;

export function createPriceId(): string {
  priceSeq += 1;
  return `rsi-${Date.now().toString(36)}-${priceSeq}`;
}

export function createPriceRow(price = ''): RsiPriceRow {
  return { id: createPriceId(), price };
}

/**
 * Default: period 14 · Wilder · 15 blank rows (need n+1 prices).
 * Worked example (period 5) is covered in tests and the guide.
 */
export function createDefaultInput(): RelativeStrengthIndexInput {
  return {
    prices: Array.from({ length: 15 }, () => createPriceRow()),
    period: String(DEFAULT_RSI_PERIOD),
    method: 'wilder',
  };
}

/** Worked example: period 5 → RSI 80 */
export function createExampleInput(): RelativeStrengthIndexInput {
  return {
    prices: ['100', '102', '101', '104', '103', '106'].map((p) =>
      createPriceRow(p)
    ),
    period: '5',
    method: 'wilder',
  };
}

export function createEmptyInput(): RelativeStrengthIndexInput {
  return {
    prices: Array.from({ length: 5 }, () => createPriceRow()),
    period: String(DEFAULT_RSI_PERIOD),
    method: 'wilder',
  };
}
