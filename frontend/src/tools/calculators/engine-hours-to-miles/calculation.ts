/**
 * Engine hours converter — canonical: hours, mph, miles.
 */

import type {
  DistanceUnit,
  EngineHoursInput,
  EngineHoursResult,
  SpeedUnit,
  TimeUnit,
} from './types';

export const KM_PER_MILE = 1.609344;
export const M_PER_FT = 0.3048;
export const KM_PER_KNOT = 1.852;

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
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

export function convertSpeed(
  value: number,
  from: SpeedUnit,
  to: SpeedUnit,
): number {
  if (from === to) return value;
  const toMph: Record<SpeedUnit, number> = {
    mph: 1,
    'km/h': 1 / KM_PER_MILE,
    'm/s': 3600 / (KM_PER_MILE * 1000),
    kn: KM_PER_KNOT / KM_PER_MILE,
  };
  return (value * toMph[from]) / toMph[to];
}

export function toMph(value: number, unit: SpeedUnit): number {
  return convertSpeed(value, unit, 'mph');
}

export function fromMph(mph: number, unit: SpeedUnit): number {
  return convertSpeed(mph, 'mph', unit);
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  if (from === to) return value;
  const toMi: Record<DistanceUnit, number> = {
    mi: 1,
    km: 1 / KM_PER_MILE,
    m: 1 / (KM_PER_MILE * 1000),
    ft: 1 / 5280,
  };
  return (value * toMi[from]) / toMi[to];
}

export function toMiles(value: number, unit: DistanceUnit): number {
  return convertDistance(value, unit, 'mi');
}

export function fromMiles(mi: number, unit: DistanceUnit): number {
  return convertDistance(mi, 'mi', unit);
}

export function calculateDistanceFromEngineHours(
  hours: number,
  speedMph: number,
): number | null {
  if (!(hours >= 0) || !(speedMph >= 0)) return null;
  return hours * speedMph;
}

export function calculateEngineHoursFromDistance(
  distanceMiles: number,
  speedMph: number,
): number | null {
  if (!(distanceMiles >= 0) || !(speedMph > 0)) return null;
  return distanceMiles / speedMph;
}

export function calculateMaintenanceEquivalentMiles(
  idleHours: number,
  factorMiPerH: number,
): number | null {
  if (!(idleHours >= 0) || !(factorMiPerH >= 0)) return null;
  return idleHours * factorMiPerH;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateEngineHoursFromInput(
  input: EngineHoursInput,
): EngineHoursResult | null {
  const steps: string[] = [];

  if (input.mode === 'driving') {
    const hRaw = parseNum(input.engineHours);
    if (hRaw == null || hRaw < 0) return null;
    const hours = toHours(hRaw, input.engineHoursUnit);

    const sRaw = parseNum(input.averageSpeed);
    if (sRaw == null || sRaw < 0) return null;
    const mph = toMph(sRaw, input.averageSpeedUnit);

    const miles = calculateDistanceFromEngineHours(hours, mph);
    if (miles == null) return null;

    const display = fromMiles(miles, input.resultDistanceUnit);
    steps.push(`Mode: driving engine hours`);
    steps.push(`Time = ${fmt(hours)} h`);
    steps.push(`Average speed = ${fmt(mph)} mph`);
    steps.push(
      `Distance = Time × Speed = ${fmt(hours)} × ${fmt(mph)} = ${fmt(miles)} mi`,
    );
    steps.push(
      `Display = ${fmt(display)} ${input.resultDistanceUnit}`,
    );

    return {
      mode: 'driving',
      engineHoursValue: hours,
      averageSpeedMph: mph,
      distanceMiles: miles,
      actualDistanceMiles: miles,
      maintenanceEquivalentMiles: null,
      estimatedDrivingHours: null,
      displayPrimary: `${fmt(display)} ${input.resultDistanceUnit}`,
      primaryLabel: 'Estimated driving distance',
      formulaSteps: steps,
      interpretation:
        'Estimated distance from engine hours × average driving speed. Not odometer mileage and not a wear guarantee.',
    };
  }

  if (input.mode === 'stationary') {
    const hRaw = parseNum(input.engineHours);
    if (hRaw == null || hRaw < 0) return null;
    const hours = toHours(hRaw, input.engineHoursUnit);

    const fRaw = parseNum(input.maintenanceFactor);
    if (fRaw == null || fRaw < 0) return null;
    let factorMi = fRaw;
    if (input.maintenanceFactorUnit === 'km/h') {
      factorMi = toMiles(fRaw, 'km'); // km per hour → mi per hour numerically same as km→mi
    }

    const equiv = calculateMaintenanceEquivalentMiles(hours, factorMi);
    if (equiv == null) return null;
    const display = fromMiles(equiv, input.resultDistanceUnit);

    steps.push(`Mode: stationary / idle engine hours`);
    steps.push(`Idle time = ${fmt(hours)} h`);
    steps.push(
      `Maintenance factor (assumption) = ${fmt(factorMi)} mi/h`,
    );
    steps.push(`Actual distance traveled = 0 mi`);
    steps.push(
      `Maintenance-equivalent = Idle × Factor = ${fmt(hours)} × ${fmt(factorMi)} = ${fmt(equiv)} mi`,
    );
    steps.push(
      `Display equivalent = ${fmt(display)} ${input.resultDistanceUnit}`,
    );

    return {
      mode: 'stationary',
      engineHoursValue: hours,
      averageSpeedMph: null,
      distanceMiles: 0,
      actualDistanceMiles: 0,
      maintenanceEquivalentMiles: equiv,
      estimatedDrivingHours: null,
      displayPrimary: `${fmt(display)} ${input.resultDistanceUnit} equiv.`,
      primaryLabel: 'Maintenance-equivalent mileage (not actual distance)',
      formulaSteps: steps,
      interpretation:
        'Actual distance is zero while stationary. Equivalent miles use your selected factor — not a universal OEM standard and not odometer travel.',
    };
  }

  // distanceToHours
  const dRaw = parseNum(input.distance);
  if (dRaw == null || dRaw < 0) return null;
  const miles = toMiles(dRaw, input.distanceUnit);

  const sRaw = parseNum(input.averageSpeed);
  if (sRaw == null || sRaw < 0) return null;
  const mph = toMph(sRaw, input.averageSpeedUnit);
  if (miles > 0 && !(mph > 0)) return null;

  const hours =
    miles === 0 && mph === 0
      ? 0
      : calculateEngineHoursFromDistance(miles, mph);
  if (hours == null) return null;

  const displayH = fromHours(hours, input.resultTimeUnit);
  steps.push(`Mode: distance → driving engine hours`);
  steps.push(`Distance = ${fmt(miles)} mi`);
  steps.push(`Average speed = ${fmt(mph)} mph`);
  steps.push(
    `Hours = Distance / Speed = ${fmt(miles)} / ${fmt(mph)} = ${fmt(hours)} h`,
  );
  steps.push(
    `Display = ${fmt(displayH)} ${input.resultTimeUnit}`,
  );

  return {
    mode: 'distanceToHours',
    engineHoursValue: hours,
    averageSpeedMph: mph,
    distanceMiles: miles,
    actualDistanceMiles: miles,
    maintenanceEquivalentMiles: null,
    estimatedDrivingHours: hours,
    displayPrimary: `${fmt(displayH)} ${input.resultTimeUnit}`,
    primaryLabel: 'Estimated driving engine hours',
    formulaSteps: steps,
    interpretation:
      'Estimated moving time only. Recorded engine hours may be higher if idle time is included on the hour meter.',
  };
}
