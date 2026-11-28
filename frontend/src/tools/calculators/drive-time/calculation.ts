/**
 * Drive time engine — canonical: km, km/h, hours, liters, money in selected currency.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  BreakUnit,
  DistanceUnit,
  DriveTimeInput,
  DriveTimeResult,
  FuelEfficiencyUnit,
  FuelPriceUnit,
  SpeedUnit,
} from './types';

export const KM_PER_MILE = 1.609344;
export const M_PER_FT = 0.3048;
export const LITERS_PER_US_GAL = 3.785411784;
export const LITERS_PER_IMP_GAL = 4.54609;

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  if (from === to) return value;
  const toKm: Record<DistanceUnit, number> = {
    km: 1,
    mi: KM_PER_MILE,
    m: 0.001,
    ft: M_PER_FT / 1000,
  };
  return (value * toKm[from]) / toKm[to];
}

export function toKm(value: number, unit: DistanceUnit): number {
  return convertDistance(value, unit, 'km');
}

export function fromKm(km: number, unit: DistanceUnit): number {
  return convertDistance(km, 'km', unit);
}

export function convertSpeed(
  value: number,
  from: SpeedUnit,
  to: SpeedUnit,
): number {
  if (from === to) return value;
  const toKmh: Record<SpeedUnit, number> = {
    'km/h': 1,
    mph: KM_PER_MILE,
    'm/s': 3.6,
    'ft/s': 1.09728,
  };
  return (value * toKmh[from]) / toKmh[to];
}

export function toKmh(value: number, unit: SpeedUnit): number {
  return convertSpeed(value, unit, 'km/h');
}

export function fromKmh(kmh: number, unit: SpeedUnit): number {
  return convertSpeed(kmh, 'km/h', unit);
}

export function breakToHours(value: number, unit: BreakUnit): number {
  if (unit === 'min') return value / 60;
  if (unit === 'h') return value;
  return value * 24;
}

export function hoursToBreak(hours: number, unit: BreakUnit): number {
  if (unit === 'min') return hours * 60;
  if (unit === 'h') return hours;
  return hours / 24;
}

export function toLPer100Km(
  value: number,
  unit: FuelEfficiencyUnit,
): number | null {
  if (!(value > 0)) return null;
  if (unit === 'L/100km') return value;
  if (unit === 'km/L') return 100 / value;
  if (unit === 'mpgUS') return 235.214583 / value;
  return 282.480936 / value;
}

export function fromLPer100Km(
  l100: number,
  unit: FuelEfficiencyUnit,
): number | null {
  if (!(l100 > 0)) return null;
  if (unit === 'L/100km') return l100;
  if (unit === 'km/L') return 100 / l100;
  if (unit === 'mpgUS') return 235.214583 / l100;
  return 282.480936 / l100;
}

export function toPricePerLiter(
  price: number,
  unit: FuelPriceUnit,
): number | null {
  if (!(price >= 0) || !Number.isFinite(price)) return null;
  if (unit === 'perL') return price;
  if (unit === 'perGalUS') return price / LITERS_PER_US_GAL;
  return price / LITERS_PER_IMP_GAL;
}

export function calculateDrivingTimeHours(
  distanceKm: number,
  speedKmh: number,
): number | null {
  if (!(distanceKm >= 0) || !Number.isFinite(distanceKm)) return null;
  if (distanceKm === 0) return 0;
  if (!(speedKmh > 0)) return null;
  return distanceKm / speedKmh;
}

export function calculateTotalTripTimeHours(
  drivingHours: number,
  breakHours: number,
): number | null {
  if (!(drivingHours >= 0) || !(breakHours >= 0)) return null;
  return drivingHours + breakHours;
}

export function calculateFuelConsumptionLiters(
  distanceKm: number,
  lPer100Km: number,
): number | null {
  if (!(distanceKm >= 0) || !(lPer100Km > 0)) return null;
  return (distanceKm * lPer100Km) / 100;
}

export function calculateFuelCost(
  fuelLiters: number,
  pricePerLiter: number,
): number | null {
  if (!(fuelLiters >= 0) || !(pricePerLiter >= 0)) return null;
  return fuelLiters * pricePerLiter;
}

export function calculateAdditionalExpenses(
  parking: number,
  tolls: number,
  other: number,
): number | null {
  if (![parking, tolls, other].every((n) => n >= 0 && Number.isFinite(n))) {
    return null;
  }
  return parking + tolls + other;
}

export function calculateTotalDriveCost(
  fuelCost: number,
  additional: number,
): number | null {
  if (!(fuelCost >= 0) || !(additional >= 0)) return null;
  return fuelCost + additional;
}

export function calculateCostPerPerson(
  total: number,
  passengers: number,
): number | null {
  if (!(total >= 0) || !Number.isInteger(passengers) || passengers < 1) {
    return null;
  }
  return total / passengers;
}

export function calculateCostPerKilometer(
  total: number,
  distanceKm: number,
): number | null {
  if (!(total >= 0) || !(distanceKm > 0)) return null;
  return total / distanceKm;
}

/** Format duration as "Xd Yh Zm" / "Xh Ym". */
export function formatTravelDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours < 0) return '—';
  const totalMin = Math.round(hours * 60);
  const days = Math.floor(totalMin / (24 * 60));
  const rem = totalMin - days * 24 * 60;
  const h = Math.floor(rem / 60);
  const m = rem % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} d`);
  if (h > 0 || days > 0) parts.push(`${h} h`);
  parts.push(`${m} min`);
  if (days === 0 && h === 0) return `${m} min`;
  if (days === 0) return `${h} h ${m} min`;
  return parts.join(' ');
}

export function parseLocalDateTime(raw: string): Date | null {
  const t = raw.trim();
  if (!t) return null;
  // datetime-local: YYYY-MM-DDTHH:mm
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(t);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const hh = Number(m[4]);
  const mm = Number(m[5]);
  const ss = m[6] ? Number(m[6]) : 0;
  const dt = new Date(y, mo, d, hh, mm, ss, 0);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo ||
    dt.getDate() !== d ||
    dt.getHours() !== hh ||
    dt.getMinutes() !== mm
  ) {
    return null;
  }
  return dt;
}

export function formatLocalDateTime(dt: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

export function formatLocalDateTimeLabel(dt: Date): string {
  return dt.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Add elapsed hours using absolute ms (DST-safe wall-clock display). */
export function addHoursLocal(start: Date, hours: number): Date {
  return new Date(start.getTime() + hours * 3600 * 1000);
}

export function subtractHoursLocal(end: Date, hours: number): Date {
  return new Date(end.getTime() - hours * 3600 * 1000);
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateDriveTimeFromInput(
  input: DriveTimeInput,
): DriveTimeResult | null {
  const distRaw = parseNum(input.distance);
  if (distRaw == null || distRaw < 0) return null;
  const distanceKm = toKm(distRaw, input.distanceUnit);

  const speedRaw = parseNum(input.averageSpeed);
  if (speedRaw == null || speedRaw < 0) return null;
  const speedKmh = toKmh(speedRaw, input.speedUnit);

  const drivingHours = calculateDrivingTimeHours(distanceKm, speedKmh);
  if (drivingHours == null) return null;

  const breakRaw = parseNum(input.breakDuration);
  if (breakRaw == null || breakRaw < 0) return null;
  const breakHours = breakToHours(breakRaw, input.breakUnit);

  const totalHours = calculateTotalTripTimeHours(drivingHours, breakHours);
  if (totalHours == null) return null;

  let departure: Date | null = null;
  let arrival: Date | null = null;

  if (input.scheduleMode === 'arrivalFromDeparture') {
    departure = parseLocalDateTime(input.departureLocal);
    if (!departure) return null;
    arrival = addHoursLocal(departure, totalHours);
  } else {
    arrival = parseLocalDateTime(input.arrivalLocal);
    if (!arrival) return null;
    departure = subtractHoursLocal(arrival, totalHours);
  }

  const effRaw = parseNum(input.fuelEfficiency);
  if (effRaw == null) return null;
  const l100 = toLPer100Km(effRaw, input.fuelEfficiencyUnit);
  if (l100 == null) return null;

  const fuelLiters = calculateFuelConsumptionLiters(distanceKm, l100);
  if (fuelLiters == null) return null;

  const priceRaw = parseNum(input.fuelPrice);
  if (priceRaw == null || priceRaw < 0) return null;
  const ppl = toPricePerLiter(priceRaw, input.fuelPriceUnit);
  if (ppl == null) return null;

  const fuelCost = calculateFuelCost(fuelLiters, ppl);
  if (fuelCost == null) return null;

  const parking = parseNum(input.parkingCost);
  const tolls = parseNum(input.tollCost);
  const other = parseNum(input.otherExpenses);
  if (parking == null || tolls == null || other == null) return null;
  if (parking < 0 || tolls < 0 || other < 0) return null;

  const additional = calculateAdditionalExpenses(parking, tolls, other);
  if (additional == null) return null;

  const totalCost = calculateTotalDriveCost(fuelCost, additional);
  if (totalCost == null) return null;

  const passRaw = parseNum(input.passengers);
  if (passRaw == null || !Number.isInteger(passRaw) || passRaw < 1) return null;
  const perPerson = calculateCostPerPerson(totalCost, passRaw);
  if (perPerson == null) return null;

  const perKm = calculateCostPerKilometer(totalCost, distanceKm);

  const money = (n: number) => formatCurrencyValue(n, input.currency);

  const steps = [
    `Distance = ${fmt(distanceKm)} km · Speed = ${fmt(speedKmh)} km/h`,
    `Driving time = Distance / Speed = ${fmt(distanceKm)} / ${fmt(speedKmh)} = ${fmt(drivingHours, 4)} h (${formatTravelDuration(drivingHours)})`,
    `Breaks = ${fmt(breakHours, 4)} h (${formatTravelDuration(breakHours)})`,
    `Total trip = ${fmt(drivingHours, 4)} + ${fmt(breakHours, 4)} = ${fmt(totalHours, 4)} h (${formatTravelDuration(totalHours)})`,
    departure && arrival
      ? input.scheduleMode === 'arrivalFromDeparture'
        ? `Arrival = Departure + Total = ${formatLocalDateTimeLabel(departure)} → ${formatLocalDateTimeLabel(arrival)}`
        : `Departure = Arrival − Total = ${formatLocalDateTimeLabel(arrival)} → ${formatLocalDateTimeLabel(departure)}`
      : '',
    `Fuel used = km × (L/100 km) / 100 = ${fmt(distanceKm)} × ${fmt(l100)} / 100 = ${fmt(fuelLiters)} L`,
    `Fuel cost = ${fmt(fuelLiters)} × ${fmt(ppl)} = ${money(fuelCost)}`,
    `Additional = parking + tolls + other = ${money(additional)}`,
    `Total cost = ${money(fuelCost)} + ${money(additional)} = ${money(totalCost)}`,
    `Cost / person = ${money(totalCost)} / ${passRaw} = ${money(perPerson)}`,
    perKm != null
      ? `Cost / km = ${money(totalCost)} / ${fmt(distanceKm)} = ${money(perKm)}/km`
      : 'Cost / km = n/a (zero distance)',
  ].filter(Boolean);

  return {
    distanceKm,
    averageSpeedKmh: speedKmh,
    drivingTimeHours: drivingHours,
    breakHours,
    totalTripHours: totalHours,
    drivingTimeLabel: formatTravelDuration(drivingHours),
    breakTimeLabel: formatTravelDuration(breakHours),
    totalTripLabel: formatTravelDuration(totalHours),
    departureIso: departure ? departure.toISOString() : null,
    arrivalIso: arrival ? arrival.toISOString() : null,
    departureLabel: departure ? formatLocalDateTimeLabel(departure) : null,
    arrivalLabel: arrival ? formatLocalDateTimeLabel(arrival) : null,
    fuelUsedLiters: fuelLiters,
    fuelCost,
    additionalExpenses: additional,
    totalTripCost: totalCost,
    costPerPerson: perPerson,
    costPerKm: perKm,
    currency: input.currency,
    formulaSteps: steps,
    interpretation:
      'Educational estimate using constant average speed and stated fuel economy. Not live traffic, routing, or FX conversion.',
  };
}
