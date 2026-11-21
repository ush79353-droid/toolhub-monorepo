/**
 * BBT Calculator — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/bbt/calculation.test.ts
 */
import {
  calculateBbtAdjustment,
  celsiusDeltaToFahrenheit,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  formatDeltaTemperature,
  signedTimeDifferenceMinutes,
  temperatureDifferenceCelsius,
  K_CELSIUS_PER_HOUR,
  MAX_CORRECTION_ABS_MINUTES,
} from './calculation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Omni / hexacalculator fixture: 6:30 usual, 7:00 actual, 36.60 °C → 36.55
{
  const r = calculateBbtAdjustment({
    usualHours: 6,
    usualMinutes: 30,
    actualHours: 7,
    actualMinutes: 0,
    measuredTemperature: 36.6,
    temperatureUnit: 'celsius',
  });
  assert(r.timeDifferenceMinutes === -30, 'time diff −30 min');
  assert(approx(r.temperatureDifferenceCelsius!, -0.05), 'ΔT −0.05 °C');
  assert(approx(r.adjustedCelsius, 36.55), 'adjusted 36.55 °C');
  assert(r.correctionApplied, 'correction applied');
}

// Earlier by 1 hour → +0.1 °C
{
  const r = calculateBbtAdjustment({
    usualHours: 7,
    usualMinutes: 0,
    actualHours: 6,
    actualMinutes: 0,
    measuredTemperature: 36.5,
    temperatureUnit: 'celsius',
  });
  assert(r.timeDifferenceMinutes === 60, 'time +60');
  assert(approx(r.temperatureDifferenceCelsius!, K_CELSIUS_PER_HOUR), '+0.1');
  assert(approx(r.adjustedCelsius, 36.6), 'adjusted 36.6');
}

// Overnight wrap: usual 06:00, actual 23:00 → usual is 7h after actual → +420 min
{
  const d = signedTimeDifferenceMinutes(6 * 60, 23 * 60);
  assert(d === 7 * 60, `overnight wrap got ${d}`);
}

// Outside ±6h window: no temp correction
{
  const r = calculateBbtAdjustment({
    usualHours: 6,
    usualMinutes: 0,
    actualHours: 14,
    actualMinutes: 0,
    measuredTemperature: 36.7,
    temperatureUnit: 'celsius',
  });
  assert(
    Math.abs(r.timeDifferenceMinutes) > MAX_CORRECTION_ABS_MINUTES ||
      Math.abs(r.timeDifferenceMinutes) === 8 * 60,
    '8h gap',
  );
  assert(!r.correctionApplied, 'no correction');
  assert(r.temperatureDifferenceCelsius == null, 'no ΔT');
  assert(approx(r.adjustedCelsius, 36.7), 'adjusted = measured');
}

// °F absolute offset vs difference scale
{
  assert(approx(celsiusToFahrenheit(0), 32), '0°C = 32°F');
  assert(approx(fahrenheitToCelsius(32), 0), '32°F = 0°C');
  assert(approx(celsiusDeltaToFahrenheit(0.05), 0.09), 'Δ0.05°C = 0.09°F');
  assert(
    formatDeltaTemperature(0.05, 'fahrenheit') === '+0.09 °F',
    'delta format',
  );
  const r = calculateBbtAdjustment({
    usualHours: 6,
    usualMinutes: 30,
    actualHours: 7,
    actualMinutes: 0,
    measuredTemperature: celsiusToFahrenheit(36.6),
    temperatureUnit: 'fahrenheit',
  });
  assert(approx(r.adjustedCelsius, 36.55, 1e-6), 'F path adjusted °C');
  assert(r.formattedTemperatureDifference.includes('°F'), 'Δ in °F');
  assert(!r.formattedTemperatureDifference.includes('+32'), 'no offset in Δ');
}

// Same time → zero delta
{
  assert(temperatureDifferenceCelsius(0) === 0, 'zero delta');
}

console.log('bbt calculation.test.ts: ok');
