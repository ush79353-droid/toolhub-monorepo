/** Which field the user last edited. */
export type CfSource = 'celsius' | 'fahrenheit';

export interface CelsiusToFahrenheitInput {
  source: CfSource;
  celsius: number | null;
  fahrenheit: number | null;
}

export type CelsiusToFahrenheitFieldErrors = {
  celsius?: string;
  fahrenheit?: string;
};

export const ABSOLUTE_ZERO_C = -273.15;
export const ABSOLUTE_ZERO_F = -459.67;
export const ABS_ZERO_EPS = 1e-9;
export const MAX_ABS_VALUE = 1e12;

export const DEFAULT_INPUT: CelsiusToFahrenheitInput = {
  source: 'celsius',
  celsius: null,
  fahrenheit: null,
};
