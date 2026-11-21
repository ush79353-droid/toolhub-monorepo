import type { SupportedCurrency } from '@/tools/shared/currency';

export type RealGdpMode = 'real' | 'nominal' | 'deflator';

export type GdpMagnitude =
  | 'units'
  | 'thousands'
  | 'millions'
  | 'billions'
  | 'trillions';

export const GDP_MAGNITUDE_OPTIONS: readonly {
  id: GdpMagnitude;
  label: string;
  factor: number;
}[] = [
  { id: 'units', label: 'Units', factor: 1 },
  { id: 'thousands', label: 'Thousands', factor: 1_000 },
  { id: 'millions', label: 'Millions', factor: 1_000_000 },
  { id: 'billions', label: 'Billions', factor: 1_000_000_000 },
  { id: 'trillions', label: 'Trillions', factor: 1_000_000_000_000 },
] as const;

export const REAL_GDP_MODE_OPTIONS: readonly {
  id: RealGdpMode;
  label: string;
}[] = [
  { id: 'real', label: 'Real GDP' },
  { id: 'nominal', label: 'Nominal GDP' },
  { id: 'deflator', label: 'GDP Deflator' },
] as const;

export interface RealGdpInput {
  mode: RealGdpMode;
  currency: SupportedCurrency;
  /** Shared magnitude for nominal and real GDP displays */
  magnitude: GdpMagnitude;
  nominalGdp: string;
  realGdp: string;
  deflator: string;
  /** Optional growth helper */
  previousRealGdp: string;
  currentRealGdp: string;
}

export interface RealGdpResult {
  mode: RealGdpMode;
  currency: SupportedCurrency;
  magnitude: GdpMagnitude;
  nominalBase: number;
  realBase: number;
  deflator: number;
  formattedNominal: string;
  formattedReal: string;
  formattedDeflator: string;
  displayNominal: string;
  displayReal: string;
  displayDeflator: string;
  priceLevelInterpretation: string;
  realToNominalRatio: number | null;
  formattedRatio: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  growthRate: number | null;
  formattedGrowth: string | null;
  growthNote: string | null;
}

export type RealGdpFieldErrors = {
  form?: string;
  nominalGdp?: string;
  realGdp?: string;
  deflator?: string;
  previousRealGdp?: string;
  currentRealGdp?: string;
};

export function createDefaultInput(): RealGdpInput {
  return {
    mode: 'real',
    currency: 'USD',
    magnitude: 'billions',
    nominalGdp: '',
    realGdp: '',
    deflator: '',
    previousRealGdp: '',
    currentRealGdp: '',
  };
}

export function createEmptyInput(mode: RealGdpMode = 'real'): RealGdpInput {
  return { ...createDefaultInput(), mode };
}

export function createExampleInput(mode: RealGdpMode = 'real'): RealGdpInput {
  return {
    mode,
    currency: 'USD',
    magnitude: 'billions',
    nominalGdp: mode === 'nominal' ? '' : '25000',
    realGdp: mode === 'real' ? '' : '20000',
    deflator: mode === 'deflator' ? '' : '125',
    previousRealGdp: '20000',
    currentRealGdp: '21000',
  };
}
