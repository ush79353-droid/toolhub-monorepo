/**
 * Miles ↔ hours via speed — canonical: meters, m/s, seconds.
 */

import type {
  DistanceUnit,
  MilesToHoursInput,
  MilesToHoursResult,
  SpeedUnit,
  TimeUnit,
} from './types';
import { DISTANCE_UNIT_LABELS, SPEED_UNIT_LABELS, TIME_UNIT_LABELS } from './types';

export const M_PER_MI = 1609.344;
export const M_PER_KM = 1000;
export const M_PER_FT = 0.3048;
export const M_PER_YD = 0.9144;
export const M_PER_NMI = 1852;
export const KM_PER_MILE = 1.609344;

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Distance → meters */
export function toMeters(value: number, unit: DistanceUnit): number {
  const factor: Record<DistanceUnit, number> = {
    m: 1,
    km: M_PER_KM,
    mi: M_PER_MI,
    ft: M_PER_FT,
    yd: M_PER_YD,
    nmi: M_PER_NMI,
  };
  return value * factor[unit];
}

export function fromMeters(meters: number, unit: DistanceUnit): number {
  return meters / toMeters(1, unit);
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  if (from === to) return value;
  return fromMeters(toMeters(value, from), to);
}

/** Speed → m/s */
export function toMetersPerSecond(value: number, unit: SpeedUnit): number {
  const factor: Record<SpeedUnit, number> = {
    'm/s': 1,
    'km/h': 1000 / 3600,
    mph: M_PER_MI / 3600,
    'ft/s': M_PER_FT,
    kn: M_PER_NMI / 3600,
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

/** Time → seconds */
export function toSeconds(value: number, unit: TimeUnit): number {
  const factor: Record<TimeUnit, number> = {
    s: 1,
    min: 60,
    h: 3600,
    d: 86400,
    wk: 604800,
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

export function calculateTravelTimeSeconds(
  distanceMeters: number,
  speedMps: number,
): number | null {
  if (!(distanceMeters >= 0) || !Number.isFinite(distanceMeters)) return null;
  if (distanceMeters === 0) return 0;
  if (!(speedMps > 0)) return null;
  return distanceMeters / speedMps;
}

export function calculateDistanceMeters(
  speedMps: number,
  timeSeconds: number,
): number | null {
  if (!(speedMps >= 0) || !(timeSeconds >= 0)) return null;
  return speedMps * timeSeconds;
}

export function calculateRequiredSpeedMps(
  distanceMeters: number,
  timeSeconds: number,
): number | null {
  if (!(distanceMeters >= 0) || !Number.isFinite(distanceMeters)) return null;
  if (distanceMeters === 0 && timeSeconds >= 0) return 0;
  if (!(timeSeconds > 0)) return null;
  return distanceMeters / timeSeconds;
}

export function calculateTimeSaved(
  timeASeconds: number,
  timeBSeconds: number,
): number | null {
  if (!(timeASeconds >= 0) || !(timeBSeconds >= 0)) return null;
  return timeASeconds - timeBSeconds;
}

export function calculateTimeReductionPercentage(
  timeASeconds: number,
  timeBSeconds: number,
): number | null {
  if (!(timeASeconds > 0) || !(timeBSeconds >= 0)) return null;
  return ((timeASeconds - timeBSeconds) / timeASeconds) * 100;
}

export function calculateTotalBreakTimeSeconds(
  numberOfBreaks: number,
  breakDurationSeconds: number,
): number | null {
  if (!(numberOfBreaks >= 0) || !(breakDurationSeconds >= 0)) return null;
  return numberOfBreaks * breakDurationSeconds;
}

export function calculateTotalTripTimeSeconds(
  drivingSeconds: number,
  breakSeconds: number,
): number | null {
  if (!(drivingSeconds >= 0) || !(breakSeconds >= 0)) return null;
  return drivingSeconds + breakSeconds;
}

/**
 * Human-readable duration from unrounded seconds.
 * Rounds to nearest second then splits to avoid 60s / 60min displays.
 */
export function formatDuration(totalSeconds: number): string {
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
  if (days === 0 && hours === 0 && seconds === 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
  if (seconds === 0 && days === 0) {
    return parts.filter((p) => !p.includes('second')).join(' ');
  }
  return parts.join(' ');
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateMilesToHoursFromInput(
  input: MilesToHoursInput,
): MilesToHoursResult | null {
  const mode = input.calculationMode;
  const steps: string[] = [];

  let distanceMeters: number;
  let speedMps: number;
  let timeSeconds: number;

  if (mode === 'time') {
    const distRaw = parseNum(input.distance);
    const speedRaw = parseNum(input.speed);
    if (distRaw == null || distRaw < 0) return null;
    if (speedRaw == null || speedRaw < 0) return null;
    distanceMeters = toMeters(distRaw, input.distanceUnit);
    speedMps = toMetersPerSecond(speedRaw, input.speedUnit);
    const t = calculateTravelTimeSeconds(distanceMeters, speedMps);
    if (t == null) return null;
    timeSeconds = t;
    steps.push(
      `Distance = ${fmt(distRaw)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]} · Speed = ${fmt(speedRaw)} ${SPEED_UNIT_LABELS[input.speedUnit]}`,
    );
    steps.push(
      `Time = Distance / Speed = ${fmt(fromSeconds(timeSeconds, 'h'), 4)} h`,
    );
  } else if (mode === 'distance') {
    const speedRaw = parseNum(input.speed);
    const timeRaw = parseNum(input.time);
    if (speedRaw == null || speedRaw < 0) return null;
    if (timeRaw == null || timeRaw < 0) return null;
    speedMps = toMetersPerSecond(speedRaw, input.speedUnit);
    timeSeconds = toSeconds(timeRaw, input.timeUnit);
    const d = calculateDistanceMeters(speedMps, timeSeconds);
    if (d == null) return null;
    distanceMeters = d;
    steps.push(
      `Speed = ${fmt(speedRaw)} ${SPEED_UNIT_LABELS[input.speedUnit]} · Time = ${fmt(timeRaw)} ${TIME_UNIT_LABELS[input.timeUnit]}`,
    );
    steps.push(
      `Distance = Speed × Time = ${fmt(fromMeters(distanceMeters, input.distanceUnit))} ${DISTANCE_UNIT_LABELS[input.distanceUnit]}`,
    );
  } else {
    const distRaw = parseNum(input.distance);
    const timeRaw = parseNum(input.time);
    if (distRaw == null || distRaw < 0) return null;
    if (timeRaw == null || timeRaw < 0) return null;
    distanceMeters = toMeters(distRaw, input.distanceUnit);
    timeSeconds = toSeconds(timeRaw, input.timeUnit);
    const s = calculateRequiredSpeedMps(distanceMeters, timeSeconds);
    if (s == null) return null;
    speedMps = s;
    steps.push(
      `Distance = ${fmt(distRaw)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]} · Time = ${fmt(timeRaw)} ${TIME_UNIT_LABELS[input.timeUnit]}`,
    );
    steps.push(
      `Speed = Distance / Time = ${fmt(fromMetersPerSecond(speedMps, input.speedUnit))} ${SPEED_UNIT_LABELS[input.speedUnit]}`,
    );
  }

  const distanceValue = fromMeters(distanceMeters, input.distanceUnit);
  const speedValue = fromMetersPerSecond(speedMps, input.speedUnit);
  const timeValue = fromSeconds(timeSeconds, input.timeUnit);
  const timeHours = timeSeconds / 3600;
  const timeMinutes = timeSeconds / 60;
  const formattedDuration = formatDuration(timeSeconds);

  steps.push(`Readable duration: ${formattedDuration}`);

  let compareTimeAHours: number | null = null;
  let compareTimeBHours: number | null = null;
  let timeSavedHours: number | null = null;
  let percentageSaved: number | null = null;

  if (input.showCompare) {
    const speedBRaw = parseNum(input.compareSpeedB);
    if (speedBRaw == null || speedBRaw < 0) return null;
    const speedAMps = speedMps;
    const speedBMps = toMetersPerSecond(speedBRaw, input.compareSpeedBUnit);
    const tA = calculateTravelTimeSeconds(distanceMeters, speedAMps);
    const tB = calculateTravelTimeSeconds(distanceMeters, speedBMps);
    if (tA == null || tB == null) return null;
    compareTimeAHours = tA / 3600;
    compareTimeBHours = tB / 3600;
    const saved = calculateTimeSaved(tA, tB);
    if (saved == null) return null;
    timeSavedHours = saved / 3600;
    percentageSaved = calculateTimeReductionPercentage(tA, tB);
    steps.push(
      `Compare: @ A ${fmt(compareTimeAHours, 4)} h · @ B ${fmt(compareTimeBHours, 4)} h · saved ${fmt(timeSavedHours, 4)} h`,
    );
  }

  let breakTimeHours: number | null = null;
  let totalTripHours: number | null = null;
  let totalTripLabel: string | null = null;

  if (input.showBreaks) {
    const breaksRaw = parseNum(input.numberOfBreaks);
    const breakDurRaw = parseNum(input.breakDuration);
    if (breaksRaw == null || breaksRaw < 0) return null;
    if (breakDurRaw == null || breakDurRaw < 0) return null;
    const breakSec = calculateTotalBreakTimeSeconds(
      breaksRaw,
      toSeconds(breakDurRaw, input.breakDurationUnit),
    );
    if (breakSec == null) return null;
    const total = calculateTotalTripTimeSeconds(timeSeconds, breakSec);
    if (total == null) return null;
    breakTimeHours = breakSec / 3600;
    totalTripHours = total / 3600;
    totalTripLabel = formatDuration(total);
    steps.push(
      `Breaks = ${breaksRaw} × ${fmt(breakDurRaw)} ${TIME_UNIT_LABELS[input.breakDurationUnit]} = ${fmt(breakTimeHours, 4)} h`,
    );
    steps.push(`Total trip = driving + breaks → ${totalTripLabel}`);
  }

  return {
    calculationMode: mode,
    distanceValue,
    distanceUnit: input.distanceUnit,
    speedValue,
    speedUnit: input.speedUnit,
    timeValue,
    timeUnit: input.timeUnit,
    timeSeconds,
    timeMinutes,
    timeHours,
    formattedDuration,
    distanceDisplay: `${fmt(distanceValue)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]}`,
    speedDisplay: `${fmt(speedValue)} ${SPEED_UNIT_LABELS[input.speedUnit]}`,
    timeDisplay: `${fmt(timeValue)} ${TIME_UNIT_LABELS[input.timeUnit]}`,
    compareTimeAHours,
    compareTimeBHours,
    timeSavedHours,
    percentageSaved,
    breakTimeHours,
    totalTripHours,
    totalTripLabel,
    formulaSteps: steps,
    interpretation:
      'Assumes constant average speed with no traffic, weather, or route delays. Optional breaks add to driving time only when enabled. Not a recommendation to exceed legal speed limits.',
  };
}
