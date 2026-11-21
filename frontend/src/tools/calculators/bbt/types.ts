/** Temperature unit for absolute readings (°C / °F). Differences scale without the 32 offset. */
export type TemperatureUnit = 'celsius' | 'fahrenheit';

/** °C rise per hour of later wake time (0.05 °C / 30 min). */
export const K_CELSIUS_PER_HOUR = 0.1;

/** Maximum |usual − actual| for applying the linear correction. */
export const MAX_CORRECTION_ABS_MINUTES = 6 * 60;

export interface BbtInput {
  usualHours: string;
  usualMinutes: string;
  actualHours: string;
  actualMinutes: string;
  measuredTemperature: string;
  temperatureUnit: TemperatureUnit;
}

export interface BbtResult {
  usualMinutesOfDay: number;
  actualMinutesOfDay: number;
  /** Signed minutes: usual − actual, wrapped to (−12h, +12h]. */
  timeDifferenceMinutes: number;
  measuredCelsius: number;
  /** Null when outside the validated correction window. */
  temperatureDifferenceCelsius: number | null;
  adjustedCelsius: number;
  correctionApplied: boolean;
  temperatureUnit: TemperatureUnit;
  formattedMeasured: string;
  formattedAdjusted: string;
  formattedTemperatureDifference: string;
  formattedTimeDifference: string;
  explanation: string;
  steps: string[];
  disclaimer: string;
}

export type BbtFieldErrors = {
  form?: string;
  usualTime?: string;
  actualTime?: string;
  measuredTemperature?: string;
};

/** Blank defaults — no medically seeded wake time or temperature (ADR-023 / prompt). */
export function createEmptyInput(): BbtInput {
  return {
    usualHours: '',
    usualMinutes: '',
    actualHours: '',
    actualMinutes: '',
    measuredTemperature: '',
    temperatureUnit: 'celsius',
  };
}

/**
 * Educational fixture only (Omni-style worked example):
 * usual 6:30 · actual 7:00 · 36.60 °C → adjusted 36.55 °C (Δ −0.05 °C).
 */
export function createExampleInput(): BbtInput {
  return {
    usualHours: '6',
    usualMinutes: '30',
    actualHours: '7',
    actualMinutes: '0',
    measuredTemperature: '36.60',
    temperatureUnit: 'celsius',
  };
}

export const TEMPERATURE_UNIT_LABELS: Record<TemperatureUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
};
