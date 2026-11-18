/** Which field the user last edited. */
export type CcSource = 'centigrade' | 'celsius';

export interface CentigradeToCelsiusInput {
  source: CcSource;
  centigrade: number | null;
  celsius: number | null;
}

export type CentigradeToCelsiusFieldErrors = {
  centigrade?: string;
  celsius?: string;
};

/** Same absolute zero for both names — they share one scale. */
export const ABSOLUTE_ZERO_C = -273.15;
export const ABS_ZERO_EPS = 1e-9;
export const MAX_ABS_VALUE = 1e12;

export const DEFAULT_INPUT: CentigradeToCelsiusInput = {
  source: 'centigrade',
  centigrade: null,
  celsius: null,
};
