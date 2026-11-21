import type { SupportedCurrency } from '@/tools/shared/currency';

export interface RoicInput {
  ebit: string;
  taxRate: string;
  equity: string;
  debt: string;
  useAverageCapital: boolean;
  beginningCapital: string;
  endingCapital: string;
  currency: SupportedCurrency;
}

export interface RoicResult {
  nopat: number;
  investedCapital: number;
  roicPercentage: number;
  returnPerCapitalUnit: number;
  usedAverageCapital: boolean;
  hasNegativeEquity: boolean;
  hasNegativeEbit: boolean;
  currency: SupportedCurrency;
  formattedNopat: string;
  formattedInvestedCapital: string;
  formattedRoic: string;
  interpretation: string;
  explanation: string;
  warningMessage: string | null;
}

export type RoicFieldErrors = {
  form?: string;
  ebit?: string;
  taxRate?: string;
  equity?: string;
  debt?: string;
  beginningCapital?: string;
  endingCapital?: string;
};

/** Reference: EBIT 500k · tax 25% · equity 1.2M · debt 800k → ROIC 18.75% */
export function createDefaultInput(): RoicInput {
  return {
    ebit: '500000',
    taxRate: '25',
    equity: '1200000',
    debt: '800000',
    useAverageCapital: false,
    beginningCapital: '1800000',
    endingCapital: '2200000',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): RoicInput {
  return {
    ebit: '',
    taxRate: '',
    equity: '',
    debt: '',
    useAverageCapital: false,
    beginningCapital: '',
    endingCapital: '',
    currency,
  };
}
