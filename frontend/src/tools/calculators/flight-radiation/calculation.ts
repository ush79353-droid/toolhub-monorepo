/**
 * Flight radiation — internal base: microsieverts (µSv) and hours.
 */

import type {
  DoseRateUnit,
  FlightRadiationInput,
  FlightRadiationResult,
  RadiationDoseUnit,
  TimeUnit,
} from './types';

export function fmt(n: number, digits = 6): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-4 || abs >= 1e7)) {
    return n.toExponential(4);
  }
  const fixed = n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
  return fixed;
}

export function convertTime(
  value: number,
  from: TimeUnit,
  to: TimeUnit,
): number {
  if (from === to) return value;
  const toH: Record<TimeUnit, number> = {
    h: 1,
    min: 1 / 60,
    s: 1 / 3600,
    d: 24,
  };
  return (value * toH[from]) / toH[to];
}

export function toHours(value: number, unit: TimeUnit): number {
  return convertTime(value, unit, 'h');
}

export function fromHours(hours: number, unit: TimeUnit): number {
  return convertTime(hours, 'h', unit);
}

/** 1 Sv = 1e6 µSv; 1 rem = 0.01 Sv = 1e4 µSv; 1 mrem = 10 µSv */
const DOSE_TO_USV: Record<RadiationDoseUnit, number> = {
  'µSv': 1,
  mSv: 1000,
  Sv: 1_000_000,
  mrem: 10,
  rem: 10_000,
};

const RATE_TO_USV_PER_H: Record<DoseRateUnit, number> = {
  'µSv/h': 1,
  'mSv/h': 1000,
  'Sv/h': 1_000_000,
  'mrem/h': 10,
  'rem/h': 10_000,
};

export function toMicrosieverts(
  value: number,
  unit: RadiationDoseUnit,
): number {
  return value * DOSE_TO_USV[unit];
}

export function fromMicrosieverts(
  uSv: number,
  unit: RadiationDoseUnit,
): number {
  return uSv / DOSE_TO_USV[unit];
}

export function toUSvPerHour(value: number, unit: DoseRateUnit): number {
  return value * RATE_TO_USV_PER_H[unit];
}

export function fromUSvPerHour(uSvPerH: number, unit: DoseRateUnit): number {
  return uSvPerH / RATE_TO_USV_PER_H[unit];
}

export function calculateFlightRadiationDose(
  hours: number,
  doseRateUSvPerH: number,
): number | null {
  if (!(hours >= 0) || !(doseRateUSvPerH >= 0)) return null;
  return hours * doseRateUSvPerH;
}

export function calculateCumulativeFlightDose(
  dosePerFlightUSv: number,
  flights: number,
): number | null {
  if (!(dosePerFlightUSv >= 0) || !(flights >= 0) || !Number.isInteger(flights)) {
    return null;
  }
  return dosePerFlightUSv * flights;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateFlightRadiationFromInput(
  input: FlightRadiationInput,
): FlightRadiationResult | null {
  const dRaw = parseNum(input.flightDuration);
  if (dRaw == null || dRaw < 0) return null;
  const hours = toHours(dRaw, input.flightDurationUnit);

  const rRaw = parseNum(input.doseRate);
  if (rRaw == null || rRaw < 0) return null;
  const rateUSvH = toUSvPerHour(rRaw, input.doseRateUnit);

  const perFlight = calculateFlightRadiationDose(hours, rateUSvH);
  if (perFlight == null) return null;

  const fRaw = parseNum(input.numberOfFlights);
  if (fRaw == null || fRaw < 0 || !Number.isInteger(fRaw)) return null;
  const flights = fRaw;

  const total = calculateCumulativeFlightDose(perFlight, flights);
  if (total == null) return null;

  const display = fromMicrosieverts(total, input.doseUnit);
  const displayPer = fromMicrosieverts(perFlight, input.doseUnit);
  const mSv = fromMicrosieverts(total, 'mSv');
  const uSv = total;

  const steps: string[] = [];
  steps.push(`Flight duration = ${fmt(hours, 4)} h`);
  steps.push(
    `Dose rate = ${fmt(rateUSvH, 4)} µSv/h (${fmt(fromUSvPerHour(rateUSvH, 'mSv/h'), 6)} mSv/h)`,
  );
  steps.push(
    `Dose per flight = Rate × Time = ${fmt(rateUSvH, 4)} × ${fmt(hours, 4)} = ${fmt(perFlight, 4)} µSv`,
  );
  if (flights !== 1) {
    steps.push(
      `Number of flights = ${flights}`,
    );
    steps.push(
      `Cumulative dose = ${fmt(perFlight, 4)} × ${flights} = ${fmt(total, 4)} µSv`,
    );
  }
  steps.push(
    `Display = ${fmt(display, 6)} ${input.doseUnit} (${fmt(mSv, 6)} mSv · ${fmt(uSv, 4)} µSv)`,
  );

  return {
    doseMicrosieverts: total,
    dosePerFlightMicrosieverts: perFlight,
    numberOfFlights: flights,
    flightHours: hours,
    doseRateUSvPerH: rateUSvH,
    formattedDose: `${fmt(display, 6)} ${input.doseUnit}`,
    formattedPerFlight: `${fmt(displayPer, 6)} ${input.doseUnit}`,
    formulaSteps: steps,
    interpretation:
      'Estimated effective dose using a constant average dose rate × flight time. Real cosmic radiation varies with altitude, latitude, route, and solar activity — not a personalized medical risk prediction.',
  };
}
