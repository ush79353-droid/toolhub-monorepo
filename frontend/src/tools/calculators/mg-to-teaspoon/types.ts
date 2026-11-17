import type { DensityUnit } from '../mg-to-tablespoon/types';

export type { DensityUnit };
export {
  DENSITY_UNIT_OPTIONS,
  G_PER_ML_PER_DENSITY_UNIT,
  MAX_ABS_VALUE,
  MILLIGRAMS_PER_GRAM,
  SALT_DENSITY_G_PER_ML,
  WATER_DENSITY_G_PER_ML,
} from '../mg-to-tablespoon/types';

export type MgTspSource = 'milligrams' | 'teaspoons';

export type TeaspoonStandard = 'us' | 'metric';

export interface MgToTeaspoonInput {
  source: MgTspSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  teaspoonStandard: TeaspoonStandard;
  milligrams: number | null;
  teaspoons: number | null;
}

export interface MgToTeaspoonResult {
  source: MgTspSource;
  substanceId: string;
  substanceName: string;
  densityGPerMl: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  teaspoonStandard: TeaspoonStandard;
  teaspoonMl: number;
  milligrams: number;
  teaspoons: number;
  explanation: string;
}

export type MgToTeaspoonFieldErrors = {
  densityValue?: string;
  milligrams?: string;
  teaspoons?: string;
};

/** Exact: 1 US liquid gallon = 3785.411784 mL; 1 US tsp = gallon / 768. */
export const US_TEASPOON_ML = 4.92892159375;
export const METRIC_TEASPOON_ML = 5;

export const TEASPOON_ML: Record<TeaspoonStandard, number> = {
  us: US_TEASPOON_ML,
  metric: METRIC_TEASPOON_ML,
};

export const TEASPOON_STANDARD_OPTIONS: readonly {
  value: TeaspoonStandard;
  label: string;
}[] = [
  { value: 'us', label: 'US tsp (4.92892159375 mL)' },
  { value: 'metric', label: 'Metric tsp (5 mL)' },
] as const;

export const TEASPOON_STANDARD_LABEL: Record<TeaspoonStandard, string> = {
  us: 'US tsp',
  metric: 'metric tsp',
};
