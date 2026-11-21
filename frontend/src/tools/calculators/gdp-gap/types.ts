import type { SupportedCurrency } from '@/tools/shared/currency';

export type GdpGapMode = 'gap' | 'actual' | 'potential';

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

export interface GdpGapInput {
  mode: GdpGapMode;
  currency: SupportedCurrency;
  actualGdp: string;
  actualMagnitude: GdpMagnitude;
  potentialGdp: string;
  potentialMagnitude: GdpMagnitude;
  gapPercent: string;
}

export interface GdpGapResult {
  mode: GdpGapMode;
  currency: SupportedCurrency;
  actualBase: number;
  potentialBase: number;
  gapPercent: number;
  absoluteGap: number;
  formattedActual: string;
  formattedPotential: string;
  formattedGap: string;
  formattedAbsoluteGap: string;
  displayActual: string;
  displayPotential: string;
  displayGap: string;
  statusTitle: string;
  interpretation: string;
  formulaBreakdown: string;
  steps: string[];
  explanation: string;
}

export type GdpGapFieldErrors = {
  form?: string;
  actualGdp?: string;
  potentialGdp?: string;
  gapPercent?: string;
};

export function createDefaultInput(): GdpGapInput {
  return {
    mode: 'gap',
    currency: 'PKR',
    actualGdp: '',
    actualMagnitude: 'trillions',
    potentialGdp: '',
    potentialMagnitude: 'trillions',
    gapPercent: '',
  };
}

export function createEmptyInput(mode: GdpGapMode = 'gap'): GdpGapInput {
  return { ...createDefaultInput(), mode };
}

export function createExampleInput(): GdpGapInput {
  return {
    mode: 'gap',
    currency: 'USD',
    actualGdp: '18',
    actualMagnitude: 'trillions',
    potentialGdp: '20',
    potentialMagnitude: 'trillions',
    gapPercent: '',
  };
}
