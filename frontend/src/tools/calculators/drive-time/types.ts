/**
 * Drive time + trip cost (educational estimator).
 * DrivingTime = Distance / Speed
 * TotalTrip = Driving + Breaks
 * Arrival = Departure + Total (elapsed ms)
 * FuelUsed(L) = km × (L/100km) / 100
 * Denomination CurrencySelect only — no live FX.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type DistanceUnit = 'km' | 'mi' | 'm' | 'ft';
export type SpeedUnit = 'km/h' | 'mph' | 'm/s' | 'ft/s';
export type BreakUnit = 'min' | 'h' | 'd';
export type FuelEfficiencyUnit = 'L/100km' | 'km/L' | 'mpgUS' | 'mpgUK';
export type FuelPriceUnit = 'perL' | 'perGalUS' | 'perGalUK';
export type ScheduleMode = 'arrivalFromDeparture' | 'departureFromArrival';

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  km: 'km',
  mi: 'mi',
  m: 'm',
  ft: 'ft',
};

export const SPEED_UNIT_LABELS: Record<SpeedUnit, string> = {
  'km/h': 'km/h',
  mph: 'mph',
  'm/s': 'm/s',
  'ft/s': 'ft/s',
};

export const BREAK_UNIT_LABELS: Record<BreakUnit, string> = {
  min: 'Minutes',
  h: 'Hours',
  d: 'Days',
};

export const EFFICIENCY_UNIT_LABELS: Record<FuelEfficiencyUnit, string> = {
  'L/100km': 'L/100 km',
  'km/L': 'km/L',
  mpgUS: 'mpg (US)',
  mpgUK: 'mpg (UK)',
};

export const PRICE_UNIT_LABELS: Record<FuelPriceUnit, string> = {
  perL: '/ L',
  perGalUS: '/ gal (US)',
  perGalUK: '/ gal (UK)',
};

export interface DriveTimeInput {
  distance: string;
  distanceUnit: DistanceUnit;
  averageSpeed: string;
  speedUnit: SpeedUnit;
  breakDuration: string;
  breakUnit: BreakUnit;
  scheduleMode: ScheduleMode;
  departureLocal: string;
  arrivalLocal: string;
  fuelEfficiency: string;
  fuelEfficiencyUnit: FuelEfficiencyUnit;
  fuelPrice: string;
  fuelPriceUnit: FuelPriceUnit;
  currency: SupportedCurrency;
  parkingCost: string;
  tollCost: string;
  otherExpenses: string;
  passengers: string;
}

export interface DriveTimeResult {
  distanceKm: number;
  averageSpeedKmh: number;
  drivingTimeHours: number;
  breakHours: number;
  totalTripHours: number;
  drivingTimeLabel: string;
  breakTimeLabel: string;
  totalTripLabel: string;
  departureIso: string | null;
  arrivalIso: string | null;
  departureLabel: string | null;
  arrivalLabel: string | null;
  fuelUsedLiters: number;
  fuelCost: number;
  additionalExpenses: number;
  totalTripCost: number;
  costPerPerson: number;
  costPerKm: number | null;
  currency: SupportedCurrency;
  formulaSteps: string[];
  interpretation: string;
}

export type DriveTimeFieldErrors = {
  distance?: string;
  averageSpeed?: string;
  breakDuration?: string;
  departureLocal?: string;
  arrivalLocal?: string;
  fuelEfficiency?: string;
  fuelPrice?: string;
  parkingCost?: string;
  tollCost?: string;
  otherExpenses?: string;
  passengers?: string;
  form?: string;
};

function defaultDepartureLocal(): string {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(0);
  d.setHours(10);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function createEmptyInput(): DriveTimeInput {
  return {
    distance: '300',
    distanceUnit: 'km',
    averageSpeed: '60',
    speedUnit: 'km/h',
    breakDuration: '45',
    breakUnit: 'min',
    scheduleMode: 'arrivalFromDeparture',
    departureLocal: defaultDepartureLocal(),
    arrivalLocal: '',
    fuelEfficiency: '7',
    fuelEfficiencyUnit: 'L/100km',
    fuelPrice: '280',
    fuelPriceUnit: 'perL',
    currency: 'PKR',
    parkingCost: '200',
    tollCost: '500',
    otherExpenses: '100',
    passengers: '4',
  };
}

export function createExampleInput(): DriveTimeInput {
  return createEmptyInput();
}
