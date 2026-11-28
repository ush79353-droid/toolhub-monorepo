/**
 * Commute cost comparison (educational).
 * RoundTrip = oneWay × 2
 * PeriodDistance = RoundTrip × commuteDays
 * FuelUsed(L) = Distance(km) × Economy(L/100km) / 100
 * TotalCar = Fuel + Parking/Tolls + Wear
 * CostPerPerson = TotalCar / N
 * Savings = CarPerPerson − PublicTransport
 *
 * Annualization: monthly × 12; weekly × 52. Frequency values are
 * round-trip commuting days in the selected period — not assumed calendar days.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type DistanceUnit = 'km' | 'mi' | 'm';
export type FuelEconomyUnit = 'L/100km' | 'km/L' | 'mpgUS' | 'mpgUK';
export type FuelPriceUnit = 'perL' | 'perGalUS' | 'perGalUK';
export type CommuteFrequency = 'weekly' | 'monthly' | 'yearly';

export type ParkingFrequency =
  | 'perOneWay'
  | 'perCommuteDay'
  | 'perWeek'
  | 'perMonth'
  | 'perYear';

export type WearFrequency =
  | 'perKm'
  | 'perMile'
  | 'perCommuteDay'
  | 'perMonth'
  | 'perYear';

export type TicketMode = 'perRide' | 'perCommuteDay' | 'timeBasedPass';
export type TicketValidityUnit = 'hours' | 'days' | 'weeks' | 'months' | 'years';

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  km: 'km',
  mi: 'mi',
  m: 'm',
};

export const FREQUENCY_LABELS: Record<CommuteFrequency, string> = {
  weekly: 'times/week',
  monthly: 'times/month',
  yearly: 'times/year',
};

export const ECONOMY_UNIT_LABELS: Record<FuelEconomyUnit, string> = {
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

export const PARKING_FREQ_LABELS: Record<ParkingFrequency, string> = {
  perOneWay: 'per one-way trip',
  perCommuteDay: 'per commute day',
  perWeek: 'per week',
  perMonth: 'per month',
  perYear: 'per year',
};

export const WEAR_FREQ_LABELS: Record<WearFrequency, string> = {
  perKm: 'per km',
  perMile: 'per mile',
  perCommuteDay: 'per commute day',
  perMonth: 'per month',
  perYear: 'per year',
};

export const TICKET_MODE_LABELS: Record<TicketMode, string> = {
  perRide: 'Per ride',
  perCommuteDay: 'Per commute day',
  timeBasedPass: 'Time-based pass',
};

export const VALIDITY_UNIT_LABELS: Record<TicketValidityUnit, string> = {
  hours: 'hours',
  days: 'days',
  weeks: 'weeks',
  months: 'months',
  years: 'years',
};

export interface OccupancyPoint {
  people: number;
  costPerPerson: number;
}

export interface CostBreakdownPoint {
  label: string;
  amount: number;
}

export interface CommuteInput {
  oneWayDistance: string;
  distanceUnit: DistanceUnit;
  commuteCount: string;
  commuteFrequency: CommuteFrequency;
  peopleSharingRide: string;
  fuelEconomy: string;
  fuelEconomyUnit: FuelEconomyUnit;
  fuelPrice: string;
  fuelPriceUnit: FuelPriceUnit;
  currency: SupportedCurrency;
  parkingAndTolls: string;
  parkingFrequency: ParkingFrequency;
  wearAndTear: string;
  wearFrequency: WearFrequency;
  ticketMode: TicketMode;
  ticketPrice: string;
  ticketValidity: string;
  ticketValidityUnit: TicketValidityUnit;
  paidRidesPerDay: string;
  showCar: boolean;
  showTransit: boolean;
}

export type CheaperOption =
  | 'car'
  | 'publicTransport'
  | 'equal'
  | 'undetermined';

export interface PeriodCosts {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface CommuteResult {
  oneWayKm: number;
  roundTripKm: number;
  commuteDaysPerMonth: number;
  commuteDaysPerYear: number;
  monthlyDistanceKm: number;
  yearlyDistanceKm: number;
  monthlyFuelUsedLiters: number | null;
  monthlyFuelCost: number | null;
  monthlyParkingAndTolls: number;
  monthlyWearAndTear: number;
  monthlyTotalCarCost: number | null;
  monthlyCarCostPerPerson: number | null;
  carPeriod: PeriodCosts | null;
  carPerPersonPeriod: PeriodCosts | null;
  monthlyPublicTransportCost: number | null;
  transitPeriod: PeriodCosts | null;
  passesRequiredMonthly: number | null;
  monthlySavings: number | null;
  annualSavings: number | null;
  savingsPercentage: number | null;
  cheaperOption: CheaperOption;
  comparisonNote: string;
  occupancyChart: OccupancyPoint[];
  carBreakdown: CostBreakdownPoint[];
  formulaSteps: string[];
  interpretation: string;
  formattedPrimary: string;
  primaryLabel: string;
  currency: SupportedCurrency;
}

export type CommuteFieldErrors = {
  oneWayDistance?: string;
  commuteCount?: string;
  peopleSharingRide?: string;
  fuelEconomy?: string;
  fuelPrice?: string;
  parkingAndTolls?: string;
  wearAndTear?: string;
  ticketPrice?: string;
  ticketValidity?: string;
  paidRidesPerDay?: string;
  form?: string;
};

export function createEmptyInput(): CommuteInput {
  return {
    oneWayDistance: '',
    distanceUnit: 'km',
    commuteCount: '22',
    commuteFrequency: 'monthly',
    peopleSharingRide: '1',
    fuelEconomy: '',
    fuelEconomyUnit: 'L/100km',
    fuelPrice: '',
    fuelPriceUnit: 'perL',
    currency: 'USD',
    parkingAndTolls: '0',
    parkingFrequency: 'perMonth',
    wearAndTear: '0',
    wearFrequency: 'perMonth',
    ticketMode: 'perRide',
    ticketPrice: '',
    ticketValidity: '5',
    ticketValidityUnit: 'days',
    paidRidesPerDay: '2',
    showCar: true,
    showTransit: true,
  };
}

export function createExampleInput(): CommuteInput {
  return {
    oneWayDistance: '20',
    distanceUnit: 'km',
    commuteCount: '22',
    commuteFrequency: 'monthly',
    peopleSharingRide: '3',
    fuelEconomy: '8',
    fuelEconomyUnit: 'L/100km',
    fuelPrice: '280',
    fuelPriceUnit: 'perL',
    currency: 'PKR',
    parkingAndTolls: '200',
    parkingFrequency: 'perCommuteDay',
    wearAndTear: '5',
    wearFrequency: 'perKm',
    ticketMode: 'perRide',
    ticketPrice: '150',
    ticketValidity: '5',
    ticketValidityUnit: 'days',
    paidRidesPerDay: '2',
    showCar: true,
    showTransit: true,
  };
}
