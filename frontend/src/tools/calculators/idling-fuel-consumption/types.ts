/**
 * Idling Fuel Consumption — educational estimate.
 * Petrol: F = 0.6 × E (L/h); Diesel: F = 0.45 × E (L/h).
 * FuelConsumed = F × hours; Cost = FuelConsumed × price/L.
 * CurrencySelect = denomination only — no live FX.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type FuelType = 'petrol' | 'diesel';
export type EngineCapacityUnit = 'L' | 'cm3' | 'in3';
export type FuelVolumeUnit = 'L' | 'mL' | 'galUS' | 'galUK';
export type FuelRateUnit = 'L/h' | 'mL/h' | 'galUS/h' | 'galUK/h';
export type FuelPriceUnit = 'perL' | 'perGalUS' | 'perGalUK';
export type TimeUnit = 's' | 'min' | 'h' | 'd';

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
};

export const ENGINE_UNIT_LABELS: Record<EngineCapacityUnit, string> = {
  L: 'L',
  cm3: 'cm³',
  in3: 'in³',
};

export const VOLUME_UNIT_LABELS: Record<FuelVolumeUnit, string> = {
  L: 'L',
  mL: 'mL',
  galUS: 'gal (US)',
  galUK: 'gal (UK)',
};

export const RATE_UNIT_LABELS: Record<FuelRateUnit, string> = {
  'L/h': 'L/h',
  'mL/h': 'mL/h',
  'galUS/h': 'gal (US)/h',
  'galUK/h': 'gal (UK)/h',
};

export const PRICE_UNIT_LABELS: Record<FuelPriceUnit, string> = {
  perL: '/ L',
  perGalUS: '/ gal (US)',
  perGalUK: '/ gal (UK)',
};

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  s: 's',
  min: 'min',
  h: 'h',
  d: 'd',
};

/** Rough estimate coeffs — not universal measured constants. */
export const PETROL_IDLE_LPH_PER_L = 0.6;
export const DIESEL_IDLE_LPH_PER_L = 0.45;

/** Direct combustion CO₂ factors (kg CO₂ / L) — approximate tank-to-wheel. */
export const CO2_KG_PER_L: Record<FuelType, number> = {
  petrol: 2.31,
  diesel: 2.68,
};

export interface IdlingInput {
  fuelType: FuelType;
  engineCapacity: string;
  engineUnit: EngineCapacityUnit;
  useCustomConsumption: boolean;
  customConsumptionRate: string;
  customRateUnit: FuelRateUnit;
  rateDisplayUnit: FuelRateUnit;
  idlingTime: string;
  timeUnit: TimeUnit;
  fuelConsumedUnit: FuelVolumeUnit;
  fuelPrice: string;
  fuelPriceUnit: FuelPriceUnit;
  currency: SupportedCurrency;
  /** Long-term estimate */
  showLongTerm: boolean;
  daysPerWeek: string;
  /** Optional CO₂ */
  showCo2: boolean;
}

export interface IdlingResult {
  estimatedConsumptionLph: number | null;
  effectiveConsumptionLph: number;
  isCustomRate: boolean;
  totalIdlingHours: number;
  fuelConsumedLiters: number;
  totalIdlingCost: number;
  currency: SupportedCurrency;
  formattedRate: string;
  formattedFuelConsumed: string;
  formattedCost: string;
  dailyFuelLiters: number | null;
  weeklyFuelLiters: number | null;
  monthlyFuelLiters: number | null;
  annualFuelLiters: number | null;
  dailyCost: number | null;
  weeklyCost: number | null;
  monthlyCost: number | null;
  annualCost: number | null;
  co2Kg: number | null;
  formulaSteps: string[];
  interpretation: string;
}

export type IdlingFieldErrors = {
  engineCapacity?: string;
  customConsumptionRate?: string;
  idlingTime?: string;
  fuelPrice?: string;
  daysPerWeek?: string;
  form?: string;
};

/** Spec: petrol 2.0 L · 30 min · PKR 280 → 1.2 L/h · 0.6 L · PKR 168 */
export function createEmptyInput(): IdlingInput {
  return {
    fuelType: 'petrol',
    engineCapacity: '2',
    engineUnit: 'L',
    useCustomConsumption: false,
    customConsumptionRate: '',
    customRateUnit: 'L/h',
    rateDisplayUnit: 'L/h',
    idlingTime: '30',
    timeUnit: 'min',
    fuelConsumedUnit: 'L',
    fuelPrice: '280',
    fuelPriceUnit: 'perL',
    currency: 'PKR',
    showLongTerm: false,
    daysPerWeek: '5',
    showCo2: false,
  };
}

export function createDieselExample(): IdlingInput {
  return {
    ...createEmptyInput(),
    fuelType: 'diesel',
  };
}
