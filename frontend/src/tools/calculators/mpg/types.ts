/**
 * MPG Calculator — fuel economy from distance ÷ fuel (educational).
 * Modes: economy | fuel-used | distance.
 * CurrencySelect = denomination only — no live FX.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type DistanceUnit = 'mi' | 'km' | 'm' | 'ft' | 'yd' | 'nmi';
export type FuelVolumeUnit = 'us-gal' | 'imp-gal' | 'L' | 'mL';
export type FuelEconomyUnit =
  | 'us-mpg'
  | 'imp-mpg'
  | 'km/L'
  | 'L/100km'
  | 'mi/L';
export type CalculationMode = 'fuel-economy' | 'fuel-used' | 'distance';
export type FuelPriceUnit = 'per-us-gal' | 'per-imp-gal' | 'per-L';

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  mi: 'mi',
  km: 'km',
  m: 'm',
  ft: 'ft',
  yd: 'yd',
  nmi: 'nmi',
};

export const VOLUME_UNIT_LABELS: Record<FuelVolumeUnit, string> = {
  'us-gal': 'US gal',
  'imp-gal': 'imp gal',
  L: 'L',
  mL: 'mL',
};

export const ECONOMY_UNIT_LABELS: Record<FuelEconomyUnit, string> = {
  'us-mpg': 'US mpg',
  'imp-mpg': 'imp mpg',
  'km/L': 'km/L',
  'L/100km': 'L/100 km',
  'mi/L': 'mi/L',
};

export const PRICE_UNIT_LABELS: Record<FuelPriceUnit, string> = {
  'per-us-gal': '/ US gal',
  'per-imp-gal': '/ imp gal',
  'per-L': '/ L',
};

export const MODE_LABELS: Record<CalculationMode, string> = {
  'fuel-economy': 'Fuel economy',
  'fuel-used': 'Fuel used',
  distance: 'Distance',
};

export interface MpgInput {
  calculationMode: CalculationMode;
  distance: string;
  distanceUnit: DistanceUnit;
  fuelUsed: string;
  fuelUsedUnit: FuelVolumeUnit;
  fuelEconomy: string;
  fuelEconomyUnit: FuelEconomyUnit;
  /** Fuel price & trip cost */
  showTripCost: boolean;
  tripDistance: string;
  tripDistanceUnit: DistanceUnit;
  fuelPrice: string;
  fuelPriceUnit: FuelPriceUnit;
  currency: SupportedCurrency;
  /** Range */
  showRange: boolean;
  availableFuel: string;
  availableFuelUnit: FuelVolumeUnit;
  /** Compare two vehicles */
  showCompare: boolean;
  compareEconomyB: string;
  compareEconomyBUnit: FuelEconomyUnit;
  compareDistance: string;
  compareDistanceUnit: DistanceUnit;
  /** MPG improvement */
  showImprove: boolean;
  previousEconomy: string;
  previousEconomyUnit: FuelEconomyUnit;
  newEconomy: string;
  newEconomyUnit: FuelEconomyUnit;
}

export interface MpgResult {
  calculationMode: CalculationMode;
  distanceValue: number;
  distanceUnit: DistanceUnit;
  fuelUsedValue: number;
  fuelUsedUnit: FuelVolumeUnit;
  economyValue: number;
  economyUnit: FuelEconomyUnit;
  mpgUS: number;
  mpgImperial: number;
  kilometersPerLiter: number;
  litersPer100Km: number;
  milesPerLiter: number;
  distanceDisplay: string;
  fuelUsedDisplay: string;
  economyDisplay: string;
  /** Trip cost */
  tripFuelNeeded: number | null;
  tripFuelNeededUnit: FuelVolumeUnit | null;
  tripCost: number | null;
  costPerMile: number | null;
  costPerKilometer: number | null;
  currency: SupportedCurrency | null;
  /** Range */
  rangeDistance: number | null;
  rangeDistanceUnit: DistanceUnit | null;
  /** Compare */
  compareFuelA: number | null;
  compareFuelB: number | null;
  compareCostA: number | null;
  compareCostB: number | null;
  fuelSavings: number | null;
  costSavings: number | null;
  fuelReductionPct: number | null;
  /** Improve */
  mpgDifference: number | null;
  mpgImprovementPct: number | null;
  consumptionReductionPct: number | null;
  formulaSteps: string[];
  interpretation: string;
}

export type MpgFieldErrors = {
  distance?: string;
  fuelUsed?: string;
  fuelEconomy?: string;
  tripDistance?: string;
  fuelPrice?: string;
  availableFuel?: string;
  compareEconomyB?: string;
  compareDistance?: string;
  previousEconomy?: string;
  newEconomy?: string;
  form?: string;
};

/** Spec fixture: 300 mi / 10 US gal → 30 US MPG */
export function createEmptyInput(): MpgInput {
  return {
    calculationMode: 'fuel-economy',
    distance: '300',
    distanceUnit: 'mi',
    fuelUsed: '10',
    fuelUsedUnit: 'us-gal',
    fuelEconomy: '30',
    fuelEconomyUnit: 'us-mpg',
    showTripCost: false,
    tripDistance: '300',
    tripDistanceUnit: 'mi',
    fuelPrice: '3.50',
    fuelPriceUnit: 'per-us-gal',
    currency: 'USD',
    showRange: false,
    availableFuel: '12',
    availableFuelUnit: 'us-gal',
    showCompare: false,
    compareEconomyB: '40',
    compareEconomyBUnit: 'us-mpg',
    compareDistance: '1000',
    compareDistanceUnit: 'mi',
    showImprove: false,
    previousEconomy: '25',
    previousEconomyUnit: 'us-mpg',
    newEconomy: '30',
    newEconomyUnit: 'us-mpg',
  };
}
