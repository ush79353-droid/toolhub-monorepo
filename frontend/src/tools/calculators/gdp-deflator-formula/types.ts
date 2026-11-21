import type { SupportedCurrency } from '@/tools/shared/currency';

export type GdpDeflatorMode = 'deflator' | 'nominal' | 'real';

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

export interface GdpDeflatorInput {
  mode: GdpDeflatorMode;
  currency: SupportedCurrency;
  nominalGdp: string;
  nominalMagnitude: GdpMagnitude;
  realGdp: string;
  realMagnitude: GdpMagnitude;
  deflator: string;
  /** Optional inflation helper (collapsed by default). */
  previousDeflator: string;
  currentDeflator: string;
}

export interface GdpDeflatorResult {
  mode: GdpDeflatorMode;
  currency: SupportedCurrency;
  nominalBase: number;
  realBase: number;
  deflator: number;
  formattedNominal: string;
  formattedReal: string;
  formattedDeflator: string;
  /** Plain numeric strings for read-only field displays. */
  displayNominal: string;
  displayReal: string;
  displayDeflator: string;
  priceLevelInterpretation: string;
  formulaBreakdown: string;
  steps: string[];
  explanation: string;
  zeroNominalNote: string | null;
  inflationRate: number | null;
  formattedInflation: string | null;
  inflationNote: string | null;
}

export type GdpDeflatorFieldErrors = {
  form?: string;
  nominalGdp?: string;
  realGdp?: string;
  deflator?: string;
  previousDeflator?: string;
  currentDeflator?: string;
};

export function createDefaultInput(): GdpDeflatorInput {
  return {
    mode: 'deflator',
    currency: 'PKR',
    nominalGdp: '',
    nominalMagnitude: 'trillions',
    realGdp: '',
    realMagnitude: 'trillions',
    deflator: '',
    previousDeflator: '',
    currentDeflator: '',
  };
}

export function createEmptyInput(
  mode: GdpDeflatorMode = 'deflator'
): GdpDeflatorInput {
  return {
    ...createDefaultInput(),
    mode,
  };
}

export function createExampleInput(): GdpDeflatorInput {
  return {
    mode: 'deflator',
    currency: 'USD',
    nominalGdp: '25',
    nominalMagnitude: 'trillions',
    realGdp: '20',
    realMagnitude: 'trillions',
    deflator: '',
    previousDeflator: '120',
    currentDeflator: '126',
  };
}
