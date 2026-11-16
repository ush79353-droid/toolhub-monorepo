export const CPS_UNITS = [
  'cps',
  'cpm',
  'rpm',
  'hz',
  'khz',
  'mhz',
  'ghz',
  'degPerSec',
  'radPerSec',
] as const;

export type CpsUnit = (typeof CPS_UNITS)[number];

export type CpsFieldErrors = Partial<Record<CpsUnit, string>>;

/** Multiply cps by this factor to obtain the unit value. */
export const CPS_TO_UNIT: Record<CpsUnit, number> = {
  cps: 1,
  cpm: 60,
  rpm: 60,
  hz: 1,
  khz: 1e-3,
  mhz: 1e-6,
  ghz: 1e-9,
  degPerSec: 360,
  radPerSec: 2 * Math.PI,
};

export const CPS_UNIT_SYMBOLS: Record<CpsUnit, string> = {
  cps: 'cps',
  cpm: 'cpm',
  rpm: 'RPM',
  hz: 'Hz',
  khz: 'kHz',
  mhz: 'MHz',
  ghz: 'GHz',
  degPerSec: 'deg/s',
  radPerSec: 'rad/s',
};

export const CPS_FIELD_LABELS: Record<CpsUnit, string> = {
  cps: 'Frequency in cycles per second',
  cpm: 'Frequency in cycles per minute',
  rpm: 'Frequency in revolutions per minute',
  hz: 'Frequency in hertz',
  khz: 'Frequency in kilohertz',
  mhz: 'Frequency in megahertz',
  ghz: 'Frequency in gigahertz',
  degPerSec: 'Frequency in degrees per second',
  radPerSec: 'Frequency in radians per second',
};

export const MAX_ABS_CPS = 1e24;
