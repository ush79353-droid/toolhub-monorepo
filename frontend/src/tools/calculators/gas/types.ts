/**
 * Gas Calculator — trip fuel volume & cost (educational).
 * FuelRequired(L) = DistanceKm × (L/100km) / 100
 * FuelCost = FuelRequired × PricePerLiter
 * CurrencySelect = denomination only — no live FX.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type DistanceUnit = 'km' | 'mi';
export type FuelEfficiencyUnit = 'L/100km' | 'km/L' | 'mpgUS' | 'mpgUK';
export type FuelVolumeUnit = 'L' | 'galUS' | 'galUK';
export type FuelPriceUnit = 'perL' | 'perGalUS' | 'perGalUK';

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  km: 'km',
  mi: 'mi',
};

export const EFFICIENCY_UNIT_LABELS: Record<FuelEfficiencyUnit, string> = {
  'L/100km': 'L/100 km',
  'km/L': 'km/L',
  mpgUS: 'mpg (US)',
  mpgUK: 'mpg (UK)',
};

export const VOLUME_UNIT_LABELS: Record<FuelVolumeUnit, string> = {
  L: 'L',
  galUS: 'gal (US)',
  galUK: 'gal (UK)',
};

export const PRICE_UNIT_LABELS: Record<FuelPriceUnit, string> = {
  perL: '/ L',
  perGalUS: '/ gal (US)',
  perGalUK: '/ gal (UK)',
};

export interface GasInput {
  oneWayDistance: string;
  distanceUnit: DistanceUnit;
  isRoundTrip: boolean;
  fuelEfficiency: string;
  fuelEfficiencyUnit: FuelEfficiencyUnit;
  fuelPrice: string;
  fuelPriceUnit: FuelPriceUnit;
  currency: SupportedCurrency;
  passengers: string;
  fuelUsedUnit: FuelVolumeUnit;
  /** Advanced: tank / available fuel for range estimate */
  availableFuel: string;
  availableFuelUnit: FuelVolumeUnit;
  /** Advanced: recurring commute */
  tripsPerWeek: string;
  /** Advanced: second vehicle economy (same distance & price) */
  comparisonEfficiency: string;
  comparisonEfficiencyUnit: FuelEfficiencyUnit;
  /**
   * Advanced: optional % reduction in L/100 km consumption (not mpg gain).
   * Empty = disabled.
   */
  consumptionReductionPercent: string;
}

export interface GasResult {
  totalDistanceKm: number;
  fuelRequiredLiters: number;
  totalFuelCost: number;
  costPerPerson: number | null;
  costPerKm: number | null;
  costPerMile: number | null;
  currency: SupportedCurrency;
  isRoundTrip: boolean;
  economyL100: number;
  pricePerLiter: number;
  passengers: number;
  formattedFuelRequired: string;
  formattedFuelCost: string;
  maximumRangeKm: number | null;
  weeklyFuelCost: number | null;
  monthlyFuelCost: number | null;
  annualFuelCost: number | null;
  comparisonFuelCost: number | null;
  estimatedSavings: number | null;
  improvedEconomyL100: number | null;
  improvedFuelCost: number | null;
  improvementSavings: number | null;
  formulaSteps: string[];
  interpretation: string;
}

export type GasFieldErrors = {
  oneWayDistance?: string;
  fuelEfficiency?: string;
  fuelPrice?: string;
  passengers?: string;
  availableFuel?: string;
  tripsPerWeek?: string;
  comparisonEfficiency?: string;
  consumptionReductionPercent?: string;
  form?: string;
};

/** Spec fixture: 250 km · 7.5 · PKR 280 · 3 pax → 18.75 L · 5,250 · 1,750 · 21/km */
export function createEmptyInput(): GasInput {
  return {
    oneWayDistance: '250',
    distanceUnit: 'km',
    isRoundTrip: false,
    fuelEfficiency: '7.5',
    fuelEfficiencyUnit: 'L/100km',
    fuelPrice: '280',
    fuelPriceUnit: 'perL',
    currency: 'PKR',
    passengers: '3',
    fuelUsedUnit: 'L',
    availableFuel: '40',
    availableFuelUnit: 'L',
    tripsPerWeek: '',
    comparisonEfficiency: '',
    comparisonEfficiencyUnit: 'L/100km',
    consumptionReductionPercent: '',
  };
}

export function createRoundTripExample(): GasInput {
  return {
    ...createEmptyInput(),
    isRoundTrip: true,
    oneWayDistance: '200',
    passengers: '1',
  };
}
