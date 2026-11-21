import type { PppYear } from './ppp-data';

export type PppMode = 'dataset' | 'manual';
export type SalaryPeriod = 'yearly' | 'monthly';
export type MarketRateSource = 'wdi-official' | 'manual';

export interface PppInput {
  mode: PppMode;
  year: PppYear;
  sourceIso2: string;
  targetIso2: string;
  salary: string;
  period: SalaryPeriod;
  marketRateSource: MarketRateSource;
  /** Target currency units per 1 source currency unit */
  manualMarketRate: string;
  manualSourcePpp: string;
  manualTargetPpp: string;
  manualSourceCurrency: string;
  manualTargetCurrency: string;
}

export interface PppResult {
  mode: PppMode;
  year: PppYear | null;
  sourceName: string;
  targetName: string;
  sourceCurrency: string;
  targetCurrency: string;
  period: SalaryPeriod;
  salaryInPeriod: number;
  annualSalary: number;
  sourcePpp: number;
  targetPpp: number;
  internationalDollars: number;
  pppAdjustedSalary: number;
  bilateralPppRate: number;
  marketRate: number | null;
  marketRateLabel: string;
  marketConvertedSalary: number | null;
  relativePriceLevel: number | null;
  relativePriceLevelPercent: number | null;
  formattedSalary: string;
  formattedIntl: string;
  formattedPppSalary: string;
  formattedMarketSalary: string;
  formattedPppRate: string;
  formattedMarketRate: string;
  formattedRelative: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
  dataAttribution: string;
  chartMarket: number | null;
  chartPpp: number;
}

export type PppFieldErrors = {
  form?: string;
  salary?: string;
  sourceIso2?: string;
  targetIso2?: string;
  year?: string;
  manualMarketRate?: string;
  manualSourcePpp?: string;
  manualTargetPpp?: string;
  manualSourceCurrency?: string;
  manualTargetCurrency?: string;
};

export function createDefaultInput(): PppInput {
  return {
    mode: 'dataset',
    year: 2023,
    sourceIso2: 'US',
    targetIso2: 'CA',
    salary: '50000',
    period: 'yearly',
    marketRateSource: 'wdi-official',
    manualMarketRate: '',
    manualSourcePpp: '',
    manualTargetPpp: '',
    manualSourceCurrency: 'USD',
    manualTargetCurrency: 'CAD',
  };
}

export function createEmptyInput(mode: PppMode = 'dataset'): PppInput {
  return {
    ...createDefaultInput(),
    mode,
    salary: '',
    manualMarketRate: '',
    manualSourcePpp: '',
    manualTargetPpp: '',
  };
}

export function createExampleInput(mode: PppMode = 'dataset'): PppInput {
  if (mode === 'manual') {
    return {
      ...createDefaultInput(),
      mode: 'manual',
      salary: '50000',
      period: 'yearly',
      manualSourcePpp: '1',
      manualTargetPpp: '2',
      manualMarketRate: '1.35',
      marketRateSource: 'manual',
      manualSourceCurrency: 'USD',
      manualTargetCurrency: 'XXX',
    };
  }
  return createDefaultInput();
}
