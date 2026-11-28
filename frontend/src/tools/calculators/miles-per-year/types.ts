/**
 * Miles per Year Calculator — educational annual mileage estimate.
 * Annual = PeriodDistance × multiplier (day×365, week×365/7, month×12, year×1).
 * Optional commute schedule, fuel cost, odometer projection.
 * CurrencySelect = denomination only — no live FX.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type MileagePeriod = 'day' | 'week' | 'month' | 'year';
export type DistanceUnit = 'mi' | 'km';
export type FuelEfficiencyUnit = 'mpgUS' | 'mpgUK' | 'L/100km' | 'km/L';
export type FuelPriceUnit = 'perL' | 'perGalUS' | 'perGalUK';

export const PERIOD_LABELS: Record<MileagePeriod, string> = {
  day: 'In a day',
  week: 'In a week',
  month: 'In a month',
  year: 'In a year',
};

export const PERIOD_QUESTION: Record<MileagePeriod, string> = {
  day: 'How much do you travel in a day?',
  week: 'How much do you travel in a week?',
  month: 'How much do you travel in a month?',
  year: 'How much do you travel in a year?',
};

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  mi: 'mi',
  km: 'km',
};

export const EFFICIENCY_UNIT_LABELS: Record<FuelEfficiencyUnit, string> = {
  mpgUS: 'mpg (US)',
  mpgUK: 'mpg (UK)',
  'L/100km': 'L/100 km',
  'km/L': 'km/L',
};

export const PRICE_UNIT_LABELS: Record<FuelPriceUnit, string> = {
  perL: '/ L',
  perGalUS: '/ gal (US)',
  perGalUK: '/ gal (UK)',
};

export type CalcMode = 'period' | 'commute';

export interface MilesPerYearInput {
  mode: CalcMode;
  period: MileagePeriod;
  distance: string;
  distanceUnit: DistanceUnit;
  outputUnit: DistanceUnit;
  /** Commute schedule */
  oneWayCommute: string;
  isRoundTrip: boolean;
  daysPerWeek: string;
  weeksPerYear: string;
  additionalWeekly: string;
  commuteUnit: DistanceUnit;
  /** Optional fuel cost */
  showFuelCost: boolean;
  fuelEfficiency: string;
  fuelEfficiencyUnit: FuelEfficiencyUnit;
  fuelPrice: string;
  fuelPriceUnit: FuelPriceUnit;
  currency: SupportedCurrency;
  /** Optional projection */
  showProjection: boolean;
  currentOdometer: string;
  projectionYears: string;
  odometerUnit: DistanceUnit;
}

export interface MilesPerYearResult {
  annualMiles: number;
  annualKilometers: number;
  avgPerDayMiles: number;
  avgPerWeekMiles: number;
  avgPerMonthMiles: number;
  formattedAnnual: string;
  annualFuelUsGallons: number | null;
  annualFuelLiters: number | null;
  annualFuelCost: number | null;
  monthlyFuelCost: number | null;
  currency: SupportedCurrency | null;
  projectedOdometerMiles: number | null;
  formattedProjected: string | null;
  formulaSteps: string[];
  interpretation: string;
}

export type MilesPerYearFieldErrors = {
  distance?: string;
  oneWayCommute?: string;
  daysPerWeek?: string;
  weeksPerYear?: string;
  additionalWeekly?: string;
  fuelEfficiency?: string;
  fuelPrice?: string;
  currentOdometer?: string;
  projectionYears?: string;
  form?: string;
};

/** Spec: 1,000 mi/month → 12,000 mi/year */
export function createEmptyInput(): MilesPerYearInput {
  return {
    mode: 'period',
    period: 'month',
    distance: '1000',
    distanceUnit: 'mi',
    outputUnit: 'mi',
    oneWayCommute: '15',
    isRoundTrip: true,
    daysPerWeek: '5',
    weeksPerYear: '48',
    additionalWeekly: '50',
    commuteUnit: 'mi',
    showFuelCost: false,
    fuelEfficiency: '30',
    fuelEfficiencyUnit: 'mpgUS',
    fuelPrice: '3.50',
    fuelPriceUnit: 'perGalUS',
    currency: 'USD',
    showProjection: false,
    currentOdometer: '50000',
    projectionYears: '3',
    odometerUnit: 'mi',
  };
}

export function createDailyExample(): MilesPerYearInput {
  return {
    ...createEmptyInput(),
    period: 'day',
    distance: '30',
  };
}
