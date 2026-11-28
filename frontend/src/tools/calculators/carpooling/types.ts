/**
 * Carpooling trip cost sharing (educational).
 * FuelUsed(L) = Distance(km) × Economy(L/100km) / 100
 * TotalTripCost = FuelCost + AdditionalExpenses
 * CostPerPerson = TotalTripCost / N
 *
 * Vehicle economy presets are documented sample values — not model-specific
 * manufacturer data.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type TripType = 'city' | 'highway' | 'urbanHighway' | 'custom';

export type VehiclePreset =
  | 'compact'
  | 'sedan'
  | 'suv'
  | 'pickup'
  | 'minivan'
  | 'hybrid'
  | 'custom';

export type FuelEconomyUnit = 'L/100km' | 'km/L' | 'mpgUS' | 'mpgUK';
export type DistanceUnit = 'km' | 'mi' | 'm';
export type FuelVolumeUnit = 'L' | 'mL' | 'galUS' | 'galUK';
export type FuelPriceUnit = 'perL' | 'perGalUS' | 'perGalUK';

export type PaymentMethod =
  | 'equalSplit'
  | 'driverFree'
  | 'customDriverContribution';

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  city: 'City',
  highway: 'Highway',
  urbanHighway: 'Urban and Highway',
  custom: 'Custom',
};

export const VEHICLE_LABELS: Record<VehiclePreset, string> = {
  compact: 'Compact Car',
  sedan: 'Sedan',
  suv: 'SUV',
  pickup: 'Pickup Truck',
  minivan: 'Minivan',
  hybrid: 'Hybrid Vehicle',
  custom: 'Custom Vehicle',
};

/** Sample L/100 km by trip type — illustrative only. */
export const VEHICLE_ECONOMY_L_PER_100KM: Record<
  Exclude<VehiclePreset, 'custom'>,
  { city: number; highway: number; urbanHighway: number }
> = {
  compact: { city: 8.5, highway: 6.5, urbanHighway: 7.5 },
  sedan: { city: 9.5, highway: 7.0, urbanHighway: 8.2 },
  suv: { city: 13.0, highway: 10.0, urbanHighway: 11.5 },
  pickup: { city: 15.0, highway: 11.5, urbanHighway: 13.0 },
  minivan: { city: 12.0, highway: 9.0, urbanHighway: 10.5 },
  hybrid: { city: 5.5, highway: 5.0, urbanHighway: 5.2 },
};

export const ECONOMY_UNIT_LABELS: Record<FuelEconomyUnit, string> = {
  'L/100km': 'L/100 km',
  'km/L': 'km/L',
  mpgUS: 'mpg (US)',
  mpgUK: 'mpg (UK)',
};

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  km: 'km',
  mi: 'mi',
  m: 'm',
};

export const VOLUME_UNIT_LABELS: Record<FuelVolumeUnit, string> = {
  L: 'L',
  mL: 'mL',
  galUS: 'gal (US)',
  galUK: 'gal (UK)',
};

export const PRICE_UNIT_LABELS: Record<FuelPriceUnit, string> = {
  perL: '/ L',
  perGalUS: '/ gal (US)',
  perGalUK: '/ gal (UK)',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  equalSplit: 'Equal split (including driver)',
  driverFree: 'Passengers pay (driver free)',
  customDriverContribution: 'Custom driver contribution',
};

export interface OccupancyChartPoint {
  people: number;
  costPerPerson: number;
}

export interface ExpenseBreakdownPoint {
  label: string;
  amount: number;
}

export interface CarpoolingInput {
  tripType: TripType;
  vehicle: VehiclePreset;
  fuelEconomy: string;
  fuelEconomyUnit: FuelEconomyUnit;
  distance: string;
  distanceUnit: DistanceUnit;
  roundTrip: boolean;
  fuelUsedOverride: string;
  useFuelUsedOverride: boolean;
  fuelUsedUnit: FuelVolumeUnit;
  fuelPrice: string;
  fuelPriceUnit: FuelPriceUnit;
  currency: SupportedCurrency;
  numberOfPeople: string;
  tolls: string;
  parking: string;
  otherExpenses: string;
  showAdditional: boolean;
  paymentMethod: PaymentMethod;
  driverContribution: string;
  enableSavings: boolean;
  soloFuelEconomy: string;
  soloFuelEconomyUnit: FuelEconomyUnit;
}

export interface CarpoolingResult {
  oneWayDistanceKm: number;
  totalDistanceKm: number;
  fuelEconomyLPer100Km: number;
  fuelUsedLiters: number;
  fuelCost: number;
  additionalExpenses: number;
  totalTripCost: number;
  numberOfPeople: number;
  costPerPerson: number;
  passengerContribution: number;
  driverPays: number;
  driverReimbursement: number;
  separateTravelCost: number | null;
  sharedTravelCost: number | null;
  totalSavings: number | null;
  savingsPercentage: number | null;
  occupancyChart: OccupancyChartPoint[];
  expenseBreakdown: ExpenseBreakdownPoint[];
  formulaSteps: string[];
  interpretation: string;
  formattedPrimary: string;
  primaryLabel: string;
  currency: SupportedCurrency;
}

export type CarpoolingFieldErrors = {
  fuelEconomy?: string;
  distance?: string;
  fuelUsedOverride?: string;
  fuelPrice?: string;
  numberOfPeople?: string;
  tolls?: string;
  parking?: string;
  otherExpenses?: string;
  driverContribution?: string;
  soloFuelEconomy?: string;
  form?: string;
};

export function economyForPreset(
  vehicle: VehiclePreset,
  tripType: TripType,
): number | null {
  if (vehicle === 'custom' || tripType === 'custom') return null;
  return VEHICLE_ECONOMY_L_PER_100KM[vehicle][tripType];
}

export function createEmptyInput(): CarpoolingInput {
  const vehicle: VehiclePreset = 'suv';
  const tripType: TripType = 'city';
  const economy = economyForPreset(vehicle, tripType);
  return {
    tripType,
    vehicle,
    fuelEconomy: economy != null ? String(economy) : '',
    fuelEconomyUnit: 'L/100km',
    distance: '',
    distanceUnit: 'km',
    roundTrip: false,
    fuelUsedOverride: '',
    useFuelUsedOverride: false,
    fuelUsedUnit: 'L',
    fuelPrice: '',
    fuelPriceUnit: 'perL',
    currency: 'USD',
    numberOfPeople: '2',
    tolls: '0',
    parking: '0',
    otherExpenses: '0',
    showAdditional: false,
    paymentMethod: 'equalSplit',
    driverContribution: '',
    enableSavings: false,
    soloFuelEconomy: '',
    soloFuelEconomyUnit: 'L/100km',
  };
}

export function createExampleInput(): CarpoolingInput {
  return {
    tripType: 'custom',
    vehicle: 'custom',
    fuelEconomy: '8',
    fuelEconomyUnit: 'L/100km',
    distance: '120',
    distanceUnit: 'km',
    roundTrip: false,
    fuelUsedOverride: '',
    useFuelUsedOverride: false,
    fuelUsedUnit: 'L',
    fuelPrice: '1.50',
    fuelPriceUnit: 'perL',
    currency: 'USD',
    numberOfPeople: '4',
    tolls: '6',
    parking: '2',
    otherExpenses: '0',
    showAdditional: true,
    paymentMethod: 'equalSplit',
    driverContribution: '',
    enableSavings: false,
    soloFuelEconomy: '',
    soloFuelEconomyUnit: 'L/100km',
  };
}
