/** Which field the user last edited. */
export type KfSource = 'kelvin' | 'fahrenheit';

export interface KelvinToFahrenheitInput {
  source: KfSource;
  kelvin: number | null;
  fahrenheit: number | null;
}

export type KelvinToFahrenheitFieldErrors = {
  kelvin?: string;
  fahrenheit?: string;
};

export const ABSOLUTE_ZERO_K = 0;
export const ABSOLUTE_ZERO_F = -459.67;
export const ABS_ZERO_EPS = 1e-9;
export const MAX_ABS_VALUE = 1e12;
