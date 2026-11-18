/** Which field the user last edited. */
export type KcSource = 'kelvin' | 'celsius';

export interface KelvinToCelsiusInput {
  source: KcSource;
  kelvin: number | null;
  celsius: number | null;
}

export type KelvinToCelsiusFieldErrors = {
  kelvin?: string;
  celsius?: string;
};

export const ABSOLUTE_ZERO_K = 0;
export const ABSOLUTE_ZERO_C = -273.15;
export const ABS_ZERO_EPS = 1e-9;
export const MAX_ABS_VALUE = 1e12;
