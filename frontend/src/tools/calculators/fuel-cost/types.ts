/**
 * Fuel cost estimator (educational).
 * TotalDistance = OneWay × (roundTrip ? 2 : 1)
 * FuelUsed(L) = km × (L/100km) / 100
 * FuelCost = FuelUsed × PricePerLiter
 * CurrencySelect = denomination only — no live FX.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type DistanceUnit = 'km' | 'mi' | 'm';
export type FuelEfficiencyUnit = 'L/100km' | 'km/L' | 'mpgUS' | 'mpgUK';
export type FuelVolumeUnit = 'L' | 'mL' | 'galUS' | 'galUK';
export type FuelPriceUnit = 'perL' | 'perGalUS' | 'perGalUK';

export type VehicleEstimateCategory =
  | 'smallGas'
  | 'mediumGas'
  | 'largeGas'
  | 'suv'
  | 'hybrid'
  | 'diesel'
  | 'motorcycle'
  | 'custom';

/** Illustrative L/100 km only — not model-specific OEM data. */
export const VEHICLE_ESTIMATE_L_PER_100KM: Record<
  Exclude<VehicleEstimateCategory, 'custom'>,
  number
> = {
  smallGas: 7.0,
  mediumGas: 8.5,
  largeGas: 11.0,
  suv: 12.5,
  hybrid: 5.5,
  diesel: 6.5,
  motorcycle: 4.0,
};

export const VEHICLE_ESTIMATE_LABELS: Record<VehicleEstimateCategory, string> = {
  smallGas: 'Small gasoline car (est.)',
  mediumGas: 'Medium gasoline car (est.)',
  largeGas: 'Large gasoline car (est.)',
  suv: 'SUV (est.)',
  hybrid: 'Hybrid car (est.)',
  diesel: 'Diesel car (est.)',
  motorcycle: 'Motorcycle (est.)',
  custom: 'Custom value',
};

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  km: 'km',
  mi: 'mi',
  m: 'm',
};

export const EFFICIENCY_UNIT_LABELS: Record<FuelEfficiencyUnit, string> = {
  'L/100km': 'L/100 km',
  'km/L': 'km/L',
  mpgUS: 'mpg (US)',
  mpgUK: 'mpg (UK)',
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

export interface FuelCostInput {
  oneWayDistance: string;
  distanceUnit: DistanceUnit;
  isRoundTrip: boolean;
  fuelPrice: string;
  fuelPriceUnit: FuelPriceUnit;
  currency: SupportedCurrency;
  fuelEfficiency: string;
  fuelEfficiencyUnit: FuelEfficiencyUnit;
  useEstimatedEfficiency: boolean;
  vehicleEstimate: VehicleEstimateCategory;
  fuelUsedUnit: FuelVolumeUnit;
  passengers: string;
}

export interface FuelCostResult {
  totalDistanceKm: number;
  fuelUsedLiters: number;
  totalFuelCost: number;
  costPerKm: number | null;
  costPerMile: number | null;
  costPerPassenger: number | null;
  currency: SupportedCurrency;
  isRoundTrip: boolean;
  economyL100: number;
  pricePerLiter: number;
  formattedFuelUsed: string;
  formattedFuelCost: string;
  formulaSteps: string[];
  interpretation: string;
}

export type FuelCostFieldErrors = {
  oneWayDistance?: string;
  fuelPrice?: string;
  fuelEfficiency?: string;
  passengers?: string;
  form?: string;
};

export function createEmptyInput(): FuelCostInput {
  return {
    oneWayDistance: '150',
    distanceUnit: 'km',
    isRoundTrip: true,
    fuelPrice: '280',
    fuelPriceUnit: 'perL',
    currency: 'PKR',
    fuelEfficiency: '7.5',
    fuelEfficiencyUnit: 'L/100km',
    useEstimatedEfficiency: false,
    vehicleEstimate: 'custom',
    fuelUsedUnit: 'L',
    passengers: '1',
  };
}

export function createExampleOneWay(): FuelCostInput {
  return {
    ...createEmptyInput(),
    isRoundTrip: false,
    oneWayDistance: '100',
    fuelEfficiency: '8',
  };
}
