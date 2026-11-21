/**
 * BBT Calculator — basal body temperature time adjustment (ADR-018).
 *
 * Validated Celsius rule (Omni / common fertility-charting heuristic):
 *   k = 0.05 °C per 30 minutes = 0.1 °C per hour
 *   timeDiffMin = usual − actual  (signed, overnight-wrapped)
 *   tempDiff°C = (timeDiffMin / 30) × 0.05
 *   adjusted = measured − k × (actual − usual)  [= measured + tempDiff°C]
 *
 * Absolute °F uses the +32 offset; temperature *differences* scale by 9/5 only.
 * Corrections outside ±6 hours are not applied (measured + time delta only).
 * Educational timing adjustment only — not ovulation confirmation or contraception.
 */

import type { BbtInput, BbtResult, TemperatureUnit } from './types';
import {
  K_CELSIUS_PER_HOUR,
  MAX_CORRECTION_ABS_MINUTES,
  TEMPERATURE_UNIT_LABELS,
} from './types';

export { K_CELSIUS_PER_HOUR, MAX_CORRECTION_ABS_MINUTES };

const MINUTES_PER_DAY = 24 * 60;
const HALF_DAY_MINUTES = 12 * 60;

export function parseFiniteNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/** Scale a Celsius *difference* to Fahrenheit (no 32 offset). */
export function celsiusDeltaToFahrenheit(deltaCelsius: number): number {
  return (deltaCelsius * 9) / 5;
}

export function toCelsius(
  value: number,
  unit: TemperatureUnit,
): number {
  return unit === 'fahrenheit' ? fahrenheitToCelsius(value) : value;
}

export function fromCelsius(
  celsius: number,
  unit: TemperatureUnit,
): number {
  return unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius;
}

export function fromCelsiusDelta(
  deltaCelsius: number,
  unit: TemperatureUnit,
): number {
  return unit === 'fahrenheit'
    ? celsiusDeltaToFahrenheit(deltaCelsius)
    : deltaCelsius;
}

export function minutesOfDay(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

/**
 * Signed minutes usual − actual, wrapped to (−12h, +12h] to resolve overnight
 * ambiguity (e.g. usual 06:00 vs actual 23:00 → +7h earlier, not −17h).
 */
export function signedTimeDifferenceMinutes(
  usualMinutesOfDay: number,
  actualMinutesOfDay: number,
): number {
  let raw = usualMinutesOfDay - actualMinutesOfDay;
  raw = ((raw % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  if (raw > HALF_DAY_MINUTES) raw -= MINUTES_PER_DAY;
  return raw;
}

export function temperatureDifferenceCelsius(
  timeDifferenceMinutes: number,
): number {
  return (timeDifferenceMinutes / 30) * 0.05;
}

export function formatTemperature(
  value: number,
  unit: TemperatureUnit,
  digits = 2,
): string {
  if (!Number.isFinite(value)) return '—';
  const n = value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
  return `${n} ${TEMPERATURE_UNIT_LABELS[unit]}`;
}

export function formatDeltaTemperature(
  deltaCelsius: number | null,
  unit: TemperatureUnit,
  digits = 2,
): string {
  if (deltaCelsius == null || !Number.isFinite(deltaCelsius)) return '—';
  const v = fromCelsiusDelta(deltaCelsius, unit);
  const sign = v > 0 ? '+' : '';
  const n = v.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
  return `${sign}${n} ${TEMPERATURE_UNIT_LABELS[unit]}`;
}

export function formatTimeDifferenceMinutes(minutes: number): string {
  if (!Number.isFinite(minutes)) return '—';
  const sign = minutes > 0 ? '+' : minutes < 0 ? '−' : '';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${sign}${m} min`;
  if (m === 0) return `${sign}${h} h`;
  return `${sign}${h} h ${m} min`;
}

export interface BbtNumericInput {
  usualHours: number;
  usualMinutes: number;
  actualHours: number;
  actualMinutes: number;
  measuredTemperature: number;
  temperatureUnit: TemperatureUnit;
}

export function calculateBbtAdjustment(input: BbtNumericInput): BbtResult {
  const usualMinutesOfDay = minutesOfDay(input.usualHours, input.usualMinutes);
  const actualMinutesOfDay = minutesOfDay(
    input.actualHours,
    input.actualMinutes,
  );
  const timeDifferenceMinutes = signedTimeDifferenceMinutes(
    usualMinutesOfDay,
    actualMinutesOfDay,
  );
  const measuredCelsius = toCelsius(
    input.measuredTemperature,
    input.temperatureUnit,
  );
  const withinWindow =
    Math.abs(timeDifferenceMinutes) <= MAX_CORRECTION_ABS_MINUTES;
  const temperatureDifferenceCelsiusValue = withinWindow
    ? temperatureDifferenceCelsius(timeDifferenceMinutes)
    : null;
  const adjustedCelsius = withinWindow
    ? measuredCelsius + (temperatureDifferenceCelsiusValue as number)
    : measuredCelsius;

  const unit = input.temperatureUnit;
  const unitLabel = TEMPERATURE_UNIT_LABELS[unit];
  const steps: string[] = [
    `Usual check: ${padTime(input.usualHours, input.usualMinutes)} (${usualMinutesOfDay} min from midnight).`,
    `Actual check: ${padTime(input.actualHours, input.actualMinutes)} (${actualMinutesOfDay} min from midnight).`,
    `Signed time difference (usual − actual, overnight-wrapped): ${formatTimeDifferenceMinutes(timeDifferenceMinutes)}.`,
  ];

  let explanation: string;
  if (withinWindow) {
    const delta = temperatureDifferenceCelsiusValue as number;
    steps.push(
      `Temperature difference (°C) = (${timeDifferenceMinutes} / 30) × 0.05 = ${delta.toFixed(4)} °C.`,
      `Adjusted (°C) = measured − k × (actual − usual) with k = ${K_CELSIUS_PER_HOUR} °C/h → ${adjustedCelsius.toFixed(4)} °C.`,
    );
    if (unit === 'fahrenheit') {
      steps.push(
        `Display unit °F: absolute temps use ×9/5 + 32; the temperature difference uses ×9/5 only (no +32).`,
      );
    }
    explanation =
      timeDifferenceMinutes === 0
        ? 'Actual check matches usual time, so no timing adjustment is applied.'
        : timeDifferenceMinutes < 0
          ? 'You measured later than usual; the linear rule lowers the reading toward the usual wake time.'
          : 'You measured earlier than usual; the linear rule raises the reading toward the usual wake time.';
  } else {
    steps.push(
      `Correction not applied: |time difference| exceeds the validated ±${MAX_CORRECTION_ABS_MINUTES / 60} hour window.`,
      'Showing measured temperature and observed time difference only.',
    );
    explanation = `Timing gap is outside the ±${MAX_CORRECTION_ABS_MINUTES / 60} hour window used for this educational linear correction. Adjusted temperature equals the measured value; chart the day with a note rather than forcing a large adjustment.`;
  }

  return {
    usualMinutesOfDay,
    actualMinutesOfDay,
    timeDifferenceMinutes,
    measuredCelsius,
    temperatureDifferenceCelsius: temperatureDifferenceCelsiusValue,
    adjustedCelsius,
    correctionApplied: withinWindow,
    temperatureUnit: unit,
    formattedMeasured: formatTemperature(fromCelsius(measuredCelsius, unit), unit),
    formattedAdjusted: formatTemperature(fromCelsius(adjustedCelsius, unit), unit),
    formattedTemperatureDifference: formatDeltaTemperature(
      temperatureDifferenceCelsiusValue,
      unit,
    ),
    formattedTimeDifference: formatTimeDifferenceMinutes(timeDifferenceMinutes),
    explanation,
    steps,
    disclaimer:
      'Educational timing adjustment only (0.05 °C per 30 minutes / 0.1 °C per hour). Not ovulation confirmation, not contraception, and not medical advice. Illness, alcohol, shift work, and short sleep can dominate small timing effects.',
  };
}

function padTime(hours: number, minutes: number): string {
  const hh = String(Math.trunc(hours)).padStart(2, '0');
  const mm = String(Math.trunc(minutes)).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function calculateBbtFromInput(input: BbtInput): BbtResult | null {
  const usualHours = parseFiniteNumber(input.usualHours);
  const usualMinutes = parseFiniteNumber(input.usualMinutes);
  const actualHours = parseFiniteNumber(input.actualHours);
  const actualMinutes = parseFiniteNumber(input.actualMinutes);
  const measured = parseFiniteNumber(input.measuredTemperature);
  if (
    usualHours == null ||
    usualMinutes == null ||
    actualHours == null ||
    actualMinutes == null ||
    measured == null
  ) {
    return null;
  }
  if (
    usualHours < 0 ||
    usualHours > 23 ||
    usualMinutes < 0 ||
    usualMinutes > 59 ||
    actualHours < 0 ||
    actualHours > 23 ||
    actualMinutes < 0 ||
    actualMinutes > 59
  ) {
    return null;
  }
  return calculateBbtAdjustment({
    usualHours,
    usualMinutes,
    actualHours,
    actualMinutes,
    measuredTemperature: measured,
    temperatureUnit: input.temperatureUnit,
  });
}
