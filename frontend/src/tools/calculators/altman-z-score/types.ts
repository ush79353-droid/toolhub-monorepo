import type { SupportedCurrency } from '@/tools/shared/currency';

export type WorkingCapitalSource = 'balance-sheet' | 'simplified' | 'direct';
export type MarketEquitySource = 'shares' | 'direct';
export type RetainedEarningsSource = 'rollforward' | 'direct';

export type AltmanRiskZone = 'distress' | 'grey' | 'safer';

export interface AltmanZScoreInput {
  currency: SupportedCurrency;
  workingCapitalSource: WorkingCapitalSource;
  marketEquitySource: MarketEquitySource;
  retainedEarningsSource: RetainedEarningsSource;
  /** Balance-sheet NWC */
  currentAssets: string;
  currentLiabilities: string;
  /** Simplified NWC */
  accountsReceivable: string;
  inventory: string;
  accountsPayable: string;
  /** Direct NWC */
  workingCapital: string;
  /** MVE from shares */
  sharesOutstanding: string;
  sharePrice: string;
  /** Direct MVE */
  marketValueOfEquity: string;
  /** RE rollforward */
  beginningRetainedEarnings: string;
  netIncome: string;
  dividendPerShare: string;
  otherDividends: string;
  /** Direct RE */
  retainedEarnings: string;
  /** Core Z inputs */
  ebit: string;
  totalAssets: string;
  totalLiabilities: string;
  sales: string;
}

export interface AltmanZScoreResult {
  currency: SupportedCurrency;
  workingCapital: number;
  marketValueOfEquity: number;
  retainedEarnings: number;
  ebit: number;
  totalAssets: number;
  totalLiabilities: number;
  sales: number;
  totalDividends: number | null;
  workingCapitalSource: WorkingCapitalSource;
  marketEquitySource: MarketEquitySource;
  retainedEarningsSource: RetainedEarningsSource;
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  x5: number;
  contributions: {
    workingCapital: number;
    retainedEarnings: number;
    profitability: number;
    leverage: number;
    assetTurnover: number;
  };
  zScore: number;
  riskZone: AltmanRiskZone;
  riskLabel: string;
  riskMessage: string;
  formattedZScore: string;
  formattedWorkingCapital: string;
  formattedMve: string;
  formattedRetainedEarnings: string;
  formattedX1: string;
  formattedX2: string;
  formattedX3: string;
  formattedX4: string;
  formattedX5: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  disclaimer: string;
}

export type AltmanZScoreFieldErrors = {
  form?: string;
  currentAssets?: string;
  currentLiabilities?: string;
  accountsReceivable?: string;
  inventory?: string;
  accountsPayable?: string;
  workingCapital?: string;
  sharesOutstanding?: string;
  sharePrice?: string;
  marketValueOfEquity?: string;
  beginningRetainedEarnings?: string;
  netIncome?: string;
  dividendPerShare?: string;
  otherDividends?: string;
  retainedEarnings?: string;
  ebit?: string;
  totalAssets?: string;
  totalLiabilities?: string;
  sales?: string;
};

export function createDefaultInput(): AltmanZScoreInput {
  return {
    currency: 'USD',
    workingCapitalSource: 'balance-sheet',
    marketEquitySource: 'direct',
    retainedEarningsSource: 'direct',
    currentAssets: '',
    currentLiabilities: '',
    accountsReceivable: '',
    inventory: '',
    accountsPayable: '',
    workingCapital: '',
    sharesOutstanding: '',
    sharePrice: '',
    marketValueOfEquity: '',
    beginningRetainedEarnings: '',
    netIncome: '',
    dividendPerShare: '',
    otherDividends: '',
    retainedEarnings: '',
    ebit: '',
    totalAssets: '',
    totalLiabilities: '',
    sales: '',
  };
}

export function createEmptyInput(): AltmanZScoreInput {
  return createDefaultInput();
}

/** Worked example → Z = 2.902 (grey zone). */
export function createExampleInput(): AltmanZScoreInput {
  return {
    currency: 'USD',
    workingCapitalSource: 'balance-sheet',
    marketEquitySource: 'direct',
    retainedEarningsSource: 'direct',
    currentAssets: '1500000',
    currentLiabilities: '700000',
    accountsReceivable: '',
    inventory: '',
    accountsPayable: '',
    workingCapital: '',
    sharesOutstanding: '',
    sharePrice: '',
    marketValueOfEquity: '3000000',
    beginningRetainedEarnings: '',
    netIncome: '',
    dividendPerShare: '',
    otherDividends: '',
    retainedEarnings: '1000000',
    ebit: '500000',
    totalAssets: '5000000',
    totalLiabilities: '2000000',
    sales: '6000000',
  };
}

export const RISK_ZONE_LABELS: Record<AltmanRiskZone, string> = {
  distress: 'Distress Zone',
  grey: 'Grey Zone',
  safer: 'Safer Zone',
};

export const RISK_ZONE_MESSAGES: Record<AltmanRiskZone, string> = {
  distress:
    'Your Altman Z-Score falls in the distress zone. The original model indicates elevated financial distress risk.',
  grey: 'Your Altman Z-Score falls in the grey zone. The model provides an inconclusive financial distress classification.',
  safer:
    'Your Altman Z-Score falls in the safer zone, indicating a comparatively stronger financial profile under the original model.',
};

export const MODEL_DISCLAIMER =
  'The Altman Z-Score is a financial distress screening model, not a guaranteed bankruptcy prediction or a direct probability of bankruptcy. Results depend on the quality of financial statements, reporting periods, industry characteristics, and model suitability. This calculator implements the original five-factor Z-Score intended primarily for publicly traded manufacturing firms.';
