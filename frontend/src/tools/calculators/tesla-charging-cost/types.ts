/**
 * Tesla Charging Cost Calculator.
 * CurrencySelect = denomination only — no live FX on the electricity tariff.
 * Vehicle presets are labeled estimates; users may override capacity/efficiency.
 */

import type { SupportedCurrency } from '@/tools/shared/currency';

export type DistanceUnit = 'km' | 'mi';
export type EnergyUnit = 'Wh' | 'kWh' | 'MWh';
export type EfficiencyUnit =
  | 'kWh/100km'
  | 'kWh/100mi'
  | 'Wh/km'
  | 'Wh/mi'
  | 'mi/kWh'
  | 'km/kWh';

export type ChartInterval = 5 | 10 | 20 | 25;

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  km: 'km',
  mi: 'mi',
};

export const ENERGY_UNIT_LABELS: Record<EnergyUnit, string> = {
  Wh: 'Wh',
  kWh: 'kWh',
  MWh: 'MWh',
};

export const EFFICIENCY_UNIT_LABELS: Record<EfficiencyUnit, string> = {
  'kWh/100km': 'kWh/100 km',
  'kWh/100mi': 'kWh/100 mi',
  'Wh/km': 'Wh/km',
  'Wh/mi': 'Wh/mi',
  'mi/kWh': 'mi/kWh',
  'km/kWh': 'km/kWh',
};

export interface TeslaChargingInput {
  vehicleId: string;
  batteryCapacity: string;
  batteryCapacityUnit: EnergyUnit;
  electricityPrice: string;
  currency: SupportedCurrency;
  drivingDistance: string;
  distanceUnit: DistanceUnit;
  efficiency: string;
  efficiencyUnit: EfficiencyUnit;
  advancedMode: boolean;
  startBatteryPercent: string;
  targetBatteryPercent: string;
  chargingEfficiencyPercent: string;
  chartInterval: ChartInterval;
}

export interface ChartPoint {
  socPercent: number;
  cost: number;
}

export interface TeslaChargingResult {
  fullChargeCost: number | null;
  drivingEnergyKWh: number | null;
  drivingCost: number | null;
  batteryEnergyAddedKWh: number | null;
  gridEnergyRequiredKWh: number | null;
  partialChargingCost: number | null;
  costPer100Km: number | null;
  costPer100Mi: number | null;
  fullChargeCostDisplay: string | null;
  drivingEnergyDisplay: string | null;
  drivingCostDisplay: string | null;
  partialChargingCostDisplay: string | null;
  chartPoints: ChartPoint[];
  currency: SupportedCurrency;
  formulaSteps: string[];
  interpretation: string;
}

export type TeslaChargingFieldErrors = {
  batteryCapacity?: string;
  electricityPrice?: string;
  drivingDistance?: string;
  efficiency?: string;
  startBatteryPercent?: string;
  targetBatteryPercent?: string;
  chargingEfficiencyPercent?: string;
  form?: string;
};

/** Spec fixture: 60 kWh · 0.25 → 15.00; 200 km · 21.75 → 10.875 */
export function createEmptyInput(): TeslaChargingInput {
  return {
    vehicleId: 'custom',
    batteryCapacity: '60',
    batteryCapacityUnit: 'kWh',
    electricityPrice: '0.25',
    currency: 'USD',
    drivingDistance: '200',
    distanceUnit: 'km',
    efficiency: '21.75',
    efficiencyUnit: 'kWh/100km',
    advancedMode: false,
    startBatteryPercent: '20',
    targetBatteryPercent: '80',
    chargingEfficiencyPercent: '90',
    chartInterval: 10,
  };
}

export function createBlankInput(): TeslaChargingInput {
  return {
    ...createEmptyInput(),
    batteryCapacity: '',
    electricityPrice: '',
    drivingDistance: '',
    efficiency: '',
    advancedMode: false,
  };
}
