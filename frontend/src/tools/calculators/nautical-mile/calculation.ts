/**
 * Nautical mile — canonical: meters, m/s, seconds.
 * 1 nmi = 1852 m exactly.
 */

import type {
  DistanceUnit,
  NauticalMileInput,
  NauticalMileResult,
  SpeedUnit,
  TimeUnit,
} from './types';
import {
  DISTANCE_UNIT_LABELS,
  SPEED_UNIT_LABELS,
  TIME_UNIT_LABELS,
} from './types';

export const DISTANCE_TO_METERS: Record<DistanceUnit, number> = {
  nmi: 1852,
  cable: 185.2,
  mi: 1609.344,
  ft: 0.3048,
  yd: 0.9144,
  in: 0.0254,
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
};

export const M_PER_NMI = 1852;
export const KM_PER_NMI = 1.852;
/** Mean Earth radius (m) for educational haversine — WGS84 mean ≈ 6371008.8 */
export const EARTH_RADIUS_M = 6_371_008.8;

export function fmt(n: number, digits = 4): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function toMeters(value: number, unit: DistanceUnit): number {
  return value * DISTANCE_TO_METERS[unit];
}

export function fromMeters(meters: number, unit: DistanceUnit): number {
  return meters / DISTANCE_TO_METERS[unit];
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  if (from === to) return value;
  return fromMeters(toMeters(value, from), to);
}

export function convertToNauticalMiles(
  value: number,
  unit: DistanceUnit,
): number {
  return convertDistance(value, unit, 'nmi');
}

export function convertFromNauticalMiles(
  nmi: number,
  unit: DistanceUnit,
): number {
  return convertDistance(nmi, 'nmi', unit);
}

export function convertNauticalMilesToKilometers(nmi: number): number {
  return nmi * KM_PER_NMI;
}

export function convertNauticalMilesToMiles(nmi: number): number {
  return convertDistance(nmi, 'nmi', 'mi');
}

export function convertMilesToNauticalMiles(mi: number): number {
  return convertDistance(mi, 'mi', 'nmi');
}

export function convertKilometersToNauticalMiles(km: number): number {
  return convertDistance(km, 'km', 'nmi');
}

export function toMetersPerSecond(value: number, unit: SpeedUnit): number {
  const factor: Record<SpeedUnit, number> = {
    'm/s': 1,
    'km/h': 1000 / 3600,
    mph: 1609.344 / 3600,
    'ft/s': 0.3048,
    kn: 1852 / 3600,
  };
  return value * factor[unit];
}

export function fromMetersPerSecond(mps: number, unit: SpeedUnit): number {
  return mps / toMetersPerSecond(1, unit);
}

export function convertSpeed(
  value: number,
  from: SpeedUnit,
  to: SpeedUnit,
): number {
  if (from === to) return value;
  return fromMetersPerSecond(toMetersPerSecond(value, from), to);
}

export function toSeconds(value: number, unit: TimeUnit): number {
  const factor: Record<TimeUnit, number> = {
    s: 1,
    min: 60,
    h: 3600,
    d: 86400,
  };
  return value * factor[unit];
}

export function fromSeconds(seconds: number, unit: TimeUnit): number {
  return seconds / toSeconds(1, unit);
}

export function convertTime(
  value: number,
  from: TimeUnit,
  to: TimeUnit,
): number {
  if (from === to) return value;
  return fromSeconds(toSeconds(value, from), to);
}

export function calculateTravelDistanceMeters(
  speedMps: number,
  timeSeconds: number,
): number | null {
  if (!(speedMps >= 0) || !(timeSeconds >= 0)) return null;
  return speedMps * timeSeconds;
}

export function calculateTravelSpeedMps(
  distanceMeters: number,
  timeSeconds: number,
): number | null {
  if (!(distanceMeters >= 0)) return null;
  if (distanceMeters === 0 && timeSeconds >= 0) return 0;
  if (!(timeSeconds > 0)) return null;
  return distanceMeters / timeSeconds;
}

export function calculateTravelTimeSeconds(
  distanceMeters: number,
  speedMps: number,
): number | null {
  if (!(distanceMeters >= 0)) return null;
  if (distanceMeters === 0) return 0;
  if (!(speedMps > 0)) return null;
  return distanceMeters / speedMps;
}

export function formatTravelDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '—';
  let rem = Math.round(totalSeconds);
  const days = Math.floor(rem / 86400);
  rem -= days * 86400;
  const hours = Math.floor(rem / 3600);
  rem -= hours * 3600;
  const minutes = Math.floor(rem / 60);
  const seconds = rem % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0)
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (seconds > 0 || parts.length === 0)
    parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  if (days === 0 && hours === 0 && minutes === 0) {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }
  if (seconds === 0) {
    return parts.filter((p) => !p.includes('second')).join(' ');
  }
  return parts.join(' ');
}

/** Educational spherical great-circle distance (meters). */
export function calculateGreatCircleDistanceMeters(
  lat1Deg: number,
  lon1Deg: number,
  lat2Deg: number,
  lon2Deg: number,
): number | null {
  if (
    ![lat1Deg, lon1Deg, lat2Deg, lon2Deg].every(
      (n) => Number.isFinite(n) && Math.abs(n) <= 180,
    )
  ) {
    return null;
  }
  if (Math.abs(lat1Deg) > 90 || Math.abs(lat2Deg) > 90) return null;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const φ1 = toRad(lat1Deg);
  const φ2 = toRad(lat2Deg);
  const Δφ = toRad(lat2Deg - lat1Deg);
  const Δλ = toRad(lon2Deg - lon1Deg);
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function resolveConvertMeters(input: NauticalMileInput): number | null {
  if (input.convertSource === 'nmi') {
    const v = parseNum(input.nmiValue);
    if (v == null || v < 0) return null;
    return toMeters(v, 'nmi');
  }
  if (input.convertSource === 'imperial') {
    const v = parseNum(input.imperialValue);
    if (v == null || v < 0) return null;
    return toMeters(v, input.imperialUnit);
  }
  const v = parseNum(input.metricValue);
  if (v == null || v < 0) return null;
  return toMeters(v, input.metricUnit);
}

export function calculateNauticalMileFromInput(
  input: NauticalMileInput,
): NauticalMileResult | null {
  const steps: string[] = [];
  const meters = resolveConvertMeters(input);

  let nauticalMiles: number | null = null;
  let statuteMiles: number | null = null;
  let kilometers: number | null = null;
  let imperialDisplay: string | null = null;
  let metricDisplay: string | null = null;
  let nmiDisplay: string | null = null;
  let comparison: NauticalMileResult['comparison'] = null;

  if (meters != null) {
    nauticalMiles = fromMeters(meters, 'nmi');
    statuteMiles = fromMeters(meters, 'mi');
    kilometers = fromMeters(meters, 'km');
    const imperialVal = fromMeters(meters, input.imperialUnit);
    const metricVal = fromMeters(meters, input.metricUnit);
    nmiDisplay = `${fmt(nauticalMiles)} nmi`;
    imperialDisplay = `${fmt(imperialVal)} ${DISTANCE_UNIT_LABELS[input.imperialUnit]}`;
    metricDisplay = `${fmt(metricVal)} ${DISTANCE_UNIT_LABELS[input.metricUnit]}`;
    comparison = (
      ['nmi', 'mi', 'km', 'm', 'ft'] as DistanceUnit[]
    ).map((unit) => ({
      unit,
      value: fromMeters(meters, unit),
      label: DISTANCE_UNIT_LABELS[unit],
    }));
    steps.push(
      `Convert: ${fmt(nauticalMiles)} nmi = ${fmt(kilometers)} km = ${fmt(statuteMiles)} mi`,
    );
  }

  // Travel calculation
  let distanceMeters: number | null = null;
  let speedMps: number | null = null;
  let timeSeconds: number | null = null;
  const mode = input.calculationMode;

  if (mode === 'distance') {
    const s = parseNum(input.speed);
    const t = parseNum(input.time);
    if (s != null && s >= 0 && t != null && t >= 0) {
      speedMps = toMetersPerSecond(s, input.speedUnit);
      timeSeconds = toSeconds(t, input.timeUnit);
      distanceMeters = calculateTravelDistanceMeters(speedMps, timeSeconds);
      if (distanceMeters != null) {
        steps.push(
          `Distance = ${fmt(s)} ${SPEED_UNIT_LABELS[input.speedUnit]} × ${fmt(t)} ${TIME_UNIT_LABELS[input.timeUnit]}`,
        );
      }
    }
  } else if (mode === 'speed') {
    const d = parseNum(input.distance);
    const t = parseNum(input.time);
    if (d != null && d >= 0 && t != null && t >= 0) {
      const dm = toMeters(d, input.distanceUnit);
      const ts = toSeconds(t, input.timeUnit);
      const sm = calculateTravelSpeedMps(dm, ts);
      if (sm != null) {
        distanceMeters = dm;
        timeSeconds = ts;
        speedMps = sm;
        steps.push('Speed = Distance / Time');
      }
    }
  } else {
    const d = parseNum(input.distance);
    const s = parseNum(input.speed);
    if (d != null && d >= 0 && s != null && s >= 0) {
      const dm = toMeters(d, input.distanceUnit);
      const sm = toMetersPerSecond(s, input.speedUnit);
      const ts = calculateTravelTimeSeconds(dm, sm);
      if (ts != null) {
        distanceMeters = dm;
        speedMps = sm;
        timeSeconds = ts;
        steps.push('Time = Distance / Speed');
      }
    }
  }

  const travelOk =
    distanceMeters != null && speedMps != null && timeSeconds != null;

  let distanceValue: number | null = null;
  let speedValue: number | null = null;
  let timeValue: number | null = null;
  let distanceNauticalMiles: number | null = null;
  let speedKnots: number | null = null;
  let timeHours: number | null = null;
  let formattedDuration: string | null = null;
  let distanceDisplay: string | null = null;
  let speedDisplay: string | null = null;
  let timeDisplay: string | null = null;

  if (travelOk && distanceMeters != null && speedMps != null && timeSeconds != null) {
    distanceValue = fromMeters(distanceMeters, input.distanceUnit);
    speedValue = fromMetersPerSecond(speedMps, input.speedUnit);
    timeValue = fromSeconds(timeSeconds, input.timeUnit);
    distanceNauticalMiles = fromMeters(distanceMeters, 'nmi');
    speedKnots = fromMetersPerSecond(speedMps, 'kn');
    timeHours = timeSeconds / 3600;
    formattedDuration = formatTravelDuration(timeSeconds);
    distanceDisplay = `${fmt(distanceValue)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]}`;
    speedDisplay = `${fmt(speedValue)} ${SPEED_UNIT_LABELS[input.speedUnit]}`;
    timeDisplay = `${fmt(timeValue)} ${TIME_UNIT_LABELS[input.timeUnit]}`;
    steps.push(
      `Travel → ${distanceDisplay} · ${speedDisplay} · ${timeDisplay} (${formattedDuration})`,
    );
  }

  let convertedSpeed: number | null = null;
  let convertedSpeedDisplay: string | null = null;
  if (input.showSpeedConvert) {
    const sv = parseNum(input.convertSpeedValue);
    if (sv != null && sv >= 0) {
      convertedSpeed = convertSpeed(
        sv,
        input.convertSpeedFrom,
        input.convertSpeedTo,
      );
      convertedSpeedDisplay = `${fmt(convertedSpeed)} ${SPEED_UNIT_LABELS[input.convertSpeedTo]}`;
      steps.push(
        `Speed convert: ${fmt(sv)} ${SPEED_UNIT_LABELS[input.convertSpeedFrom]} → ${convertedSpeedDisplay}`,
      );
    }
  }

  let greatCircleNmi: number | null = null;
  let greatCircleKm: number | null = null;
  let greatCircleMi: number | null = null;
  if (input.showCoords) {
    const a = parseNum(input.lat1);
    const b = parseNum(input.lon1);
    const c = parseNum(input.lat2);
    const d = parseNum(input.lon2);
    if (a != null && b != null && c != null && d != null) {
      const gcd = calculateGreatCircleDistanceMeters(a, b, c, d);
      if (gcd != null) {
        greatCircleNmi = fromMeters(gcd, 'nmi');
        greatCircleKm = fromMeters(gcd, 'km');
        greatCircleMi = fromMeters(gcd, 'mi');
        steps.push(
          `Great-circle ≈ ${fmt(greatCircleNmi)} nmi (${fmt(greatCircleKm)} km) — spherical estimate`,
        );
      }
    }
  }

  if (
    meters == null &&
    !travelOk &&
    convertedSpeed == null &&
    greatCircleNmi == null
  ) {
    return null;
  }

  return {
    nauticalMiles,
    statuteMiles,
    kilometers,
    meters: meters ?? null,
    imperialDisplay,
    metricDisplay,
    nmiDisplay,
    comparison,
    calculationMode: mode,
    distanceValue,
    distanceUnit: input.distanceUnit,
    speedValue,
    speedUnit: input.speedUnit,
    timeValue,
    timeUnit: input.timeUnit,
    distanceNauticalMiles,
    speedKnots,
    timeHours,
    formattedDuration,
    distanceDisplay,
    speedDisplay,
    timeDisplay,
    convertedSpeed,
    convertedSpeedDisplay,
    greatCircleNmi,
    greatCircleKm,
    greatCircleMi,
    formulaSteps: steps,
    interpretation:
      '1 international nautical mile = exactly 1,852 m. A knot is 1 nmi/h. Travel estimates assume constant average speed (no currents, weather, or routing). Great-circle distances are educational spherical approximations — not certified navigation.',
  };
}
