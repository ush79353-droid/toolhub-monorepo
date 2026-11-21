import type { SupportedCurrency } from '@/tools/shared/currency';

export type GdpPerCapitaMode = 'perCapita' | 'gdp' | 'population';

export type GdpMagnitude =
  | 'units'
  | 'thousands'
  | 'millions'
  | 'billions'
  | 'trillions';

export type PopulationMagnitude =
  | 'people'
  | 'thousands'
  | 'millions'
  | 'billions';

export type GdpMeasureType = 'real' | 'nominal' | 'ppp';

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

export const POPULATION_MAGNITUDE_OPTIONS: readonly {
  id: PopulationMagnitude;
  label: string;
  factor: number;
}[] = [
  { id: 'people', label: 'People', factor: 1 },
  { id: 'thousands', label: 'Thousands', factor: 1_000 },
  { id: 'millions', label: 'Millions', factor: 1_000_000 },
  { id: 'billions', label: 'Billions', factor: 1_000_000_000 },
] as const;

export interface GdpPerCapitaInput {
  mode: GdpPerCapitaMode;
  currency: SupportedCurrency;
  gdp: string;
  gdpMagnitude: GdpMagnitude;
  population: string;
  populationMagnitude: PopulationMagnitude;
  gdpPerCapita: string;
  measureType: GdpMeasureType;
}

export interface GdpPerCapitaResult {
  mode: GdpPerCapitaMode;
  currency: SupportedCurrency;
  gdpBase: number;
  populationBase: number;
  gdpPerCapita: number;
  formattedGdp: string;
  formattedPopulation: string;
  formattedPerCapita: string;
  displayGdp: string;
  displayPopulation: string;
  displayPerCapita: string;
  measureLabel: string;
  resultTitle: string;
  interpretation: string;
  formulaBreakdown: string;
  steps: string[];
  explanation: string;
}

export type GdpPerCapitaFieldErrors = {
  form?: string;
  gdp?: string;
  population?: string;
  gdpPerCapita?: string;
};

export function createDefaultInput(): GdpPerCapitaInput {
  return {
    mode: 'perCapita',
    currency: 'PKR',
    gdp: '',
    gdpMagnitude: 'trillions',
    population: '',
    populationMagnitude: 'millions',
    gdpPerCapita: '',
    measureType: 'real',
  };
}

export function createEmptyInput(
  mode: GdpPerCapitaMode = 'perCapita'
): GdpPerCapitaInput {
  return { ...createDefaultInput(), mode };
}

export function createExampleInput(): GdpPerCapitaInput {
  return {
    mode: 'perCapita',
    currency: 'USD',
    gdp: '2',
    gdpMagnitude: 'trillions',
    population: '50',
    populationMagnitude: 'millions',
    gdpPerCapita: '',
    measureType: 'real',
  };
}
