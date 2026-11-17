/** Which field the user last edited. */
export type FcSource = 'fahrenheit' | 'celsius';

export interface FahrenheitToCelsiusInput {
  source: FcSource;
  fahrenheit: number | null;
  celsius: number | null;
}

export type FahrenheitToCelsiusFieldErrors = {
  fahrenheit?: string;
  celsius?: string;
};

export const ABSOLUTE_ZERO_C = -273.15;
export const ABSOLUTE_ZERO_F = -459.67;
export const ABS_ZERO_EPS = 1e-9;
export const MAX_ABS_VALUE = 1e12;

export const DEFAULT_INPUT: FahrenheitToCelsiusInput = {
  source: 'fahrenheit',
  fahrenheit: null,
  celsius: null,
};
