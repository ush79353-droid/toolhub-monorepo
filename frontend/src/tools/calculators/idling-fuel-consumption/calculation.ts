/**
 * Idling fuel — canonical: liters, L/h, hours, currency/L.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  EngineCapacityUnit,
  FuelPriceUnit,
  FuelRateUnit,
  FuelType,
  FuelVolumeUnit,
  IdlingInput,
  IdlingResult,
  TimeUnit,
} from './types';
import {
  CO2_KG_PER_L,
  DIESEL_IDLE_LPH_PER_L,
  PETROL_IDLE_LPH_PER_L,
  RATE_UNIT_LABELS,
  VOLUME_UNIT_LABELS,
} from './types';

export const LITERS_PER_US_GAL = 3.785411784;
export const LITERS_PER_IMP_GAL = 4.54609;
export const LITERS_PER_IN3 = 0.016387064;
export const MEAN_DAYS_PER_YEAR = 365.2425;

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function toLitersDisplacement(
  value: number,
  unit: EngineCapacityUnit,
): number {
  if (unit === 'L') return value;
  if (unit === 'cm3') return value / 1000;
  return value * LITERS_PER_IN3;
}

export function fromLitersDisplacement(
  liters: number,
  unit: EngineCapacityUnit,
): number {
  if (unit === 'L') return liters;
  if (unit === 'cm3') return liters * 1000;
  return liters / LITERS_PER_IN3;
}

export function convertEngineCapacity(
  value: number,
  from: EngineCapacityUnit,
  to: EngineCapacityUnit,
): number {
  if (from === to) return value;
  return fromLitersDisplacement(toLitersDisplacement(value, from), to);
}

export function toLiters(value: number, unit: FuelVolumeUnit): number {
  if (unit === 'L') return value;
  if (unit === 'mL') return value / 1000;
  if (unit === 'galUS') return value * LITERS_PER_US_GAL;
  return value * LITERS_PER_IMP_GAL;
}

export function fromLiters(liters: number, unit: FuelVolumeUnit): number {
  if (unit === 'L') return liters;
  if (unit === 'mL') return liters * 1000;
  if (unit === 'galUS') return liters / LITERS_PER_US_GAL;
  return liters / LITERS_PER_IMP_GAL;
}

export function toLph(value: number, unit: FuelRateUnit): number {
  if (unit === 'L/h') return value;
  if (unit === 'mL/h') return value / 1000;
  if (unit === 'galUS/h') return value * LITERS_PER_US_GAL;
  return value * LITERS_PER_IMP_GAL;
}

export function fromLph(lph: number, unit: FuelRateUnit): number {
  if (unit === 'L/h') return lph;
  if (unit === 'mL/h') return lph * 1000;
  if (unit === 'galUS/h') return lph / LITERS_PER_US_GAL;
  return lph / LITERS_PER_IMP_GAL;
}

export function toHours(value: number, unit: TimeUnit): number {
  if (unit === 'h') return value;
  if (unit === 'min') return value / 60;
  if (unit === 's') return value / 3600;
  return value * 24;
}

export function fromHours(hours: number, unit: TimeUnit): number {
  if (unit === 'h') return hours;
  if (unit === 'min') return hours * 60;
  if (unit === 's') return hours * 3600;
  return hours / 24;
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

export function fromPricePerLiter(ppl: number, unit: FuelPriceUnit): number {
  if (unit === 'perL') return ppl;
  if (unit === 'perGalUS') return ppl * LITERS_PER_US_GAL;
  return ppl * LITERS_PER_IMP_GAL;
}

export function estimatePetrolIdlingConsumption(engineLiters: number): number | null {
  if (!(engineLiters > 0)) return null;
  return PETROL_IDLE_LPH_PER_L * engineLiters;
}

export function estimateDieselIdlingConsumption(engineLiters: number): number | null {
  if (!(engineLiters > 0)) return null;
  return DIESEL_IDLE_LPH_PER_L * engineLiters;
}

export function estimateIdlingConsumption(
  fuelType: FuelType,
  engineLiters: number,
): number | null {
  return fuelType === 'petrol'
    ? estimatePetrolIdlingConsumption(engineLiters)
    : estimateDieselIdlingConsumption(engineLiters);
}

export function calculateTotalFuelConsumed(
  lph: number,
  hours: number,
): number | null {
  if (!(lph >= 0) || !(hours >= 0)) return null;
  return lph * hours;
}

export function calculateIdlingCost(
  liters: number,
  pricePerLiter: number,
): number | null {
  if (!(liters >= 0) || !(pricePerLiter >= 0)) return null;
  return liters * pricePerLiter;
}

export function calculateEstimatedCo2(
  liters: number,
  fuelType: FuelType,
): number | null {
  if (!(liters >= 0)) return null;
  return liters * CO2_KG_PER_L[fuelType];
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateIdlingFromInput(
  input: IdlingInput,
): IdlingResult | null {
  let estimated: number | null = null;
  let effective: number;
  let isCustom = false;

  if (input.useCustomConsumption) {
    const customRaw = parseNum(input.customConsumptionRate);
    if (customRaw == null || !(customRaw >= 0)) return null;
    effective = toLph(customRaw, input.customRateUnit);
    isCustom = true;
  } else {
    const engRaw = parseNum(input.engineCapacity);
    if (engRaw == null || !(engRaw > 0)) return null;
    const engL = toLitersDisplacement(engRaw, input.engineUnit);
    estimated = estimateIdlingConsumption(input.fuelType, engL);
    if (estimated == null) return null;
    effective = estimated;
  }

  const timeRaw = parseNum(input.idlingTime);
  if (timeRaw == null || timeRaw < 0) return null;
  const hours = toHours(timeRaw, input.timeUnit);

  const fuelL = calculateTotalFuelConsumed(effective, hours);
  if (fuelL == null) return null;

  const priceRaw = parseNum(input.fuelPrice);
  if (priceRaw == null || priceRaw < 0) return null;
  const ppl = toPricePerLiter(priceRaw, input.fuelPriceUnit);
  if (ppl == null) return null;

  const cost = calculateIdlingCost(fuelL, ppl);
  if (cost == null) return null;

  let dailyFuelLiters: number | null = null;
  let weeklyFuelLiters: number | null = null;
  let monthlyFuelLiters: number | null = null;
  let annualFuelLiters: number | null = null;
  let dailyCost: number | null = null;
  let weeklyCost: number | null = null;
  let monthlyCost: number | null = null;
  let annualCost: number | null = null;

  if (input.showLongTerm) {
    const daysRaw = parseNum(input.daysPerWeek);
    if (daysRaw == null || !(daysRaw > 0) || daysRaw > 7) return null;
    dailyFuelLiters = calculateTotalFuelConsumed(effective, hours);
    weeklyFuelLiters =
      dailyFuelLiters != null ? dailyFuelLiters * daysRaw : null;
    if (weeklyFuelLiters != null) {
      annualFuelLiters = weeklyFuelLiters * (MEAN_DAYS_PER_YEAR / 7);
      monthlyFuelLiters = annualFuelLiters / 12;
      dailyCost = calculateIdlingCost(dailyFuelLiters!, ppl);
      weeklyCost = calculateIdlingCost(weeklyFuelLiters, ppl);
      monthlyCost = calculateIdlingCost(monthlyFuelLiters, ppl);
      annualCost = calculateIdlingCost(annualFuelLiters, ppl);
    }
  }

  const co2Kg = input.showCo2
    ? calculateEstimatedCo2(fuelL, input.fuelType)
    : null;

  const money = (n: number) => formatCurrencyValue(n, input.currency);
  const coeff =
    input.fuelType === 'petrol'
      ? PETROL_IDLE_LPH_PER_L
      : DIESEL_IDLE_LPH_PER_L;

  const steps: string[] = [];
  if (isCustom) {
    steps.push(`Custom rate = ${fmt(effective)} L/h`);
  } else {
    const engRaw = parseNum(input.engineCapacity)!;
    const engL = toLitersDisplacement(engRaw, input.engineUnit);
    steps.push(
      `Engine = ${fmt(engL)} L · ${input.fuelType} coeff ${fmt(coeff, 2)}`,
    );
    steps.push(
      `Estimated rate = ${fmt(engL)} × ${fmt(coeff, 2)} = ${fmt(effective)} L/h`,
    );
  }
  steps.push(`Idling = ${fmt(hours, 4)} h`);
  steps.push(
    `Fuel consumed = ${fmt(effective)} × ${fmt(hours, 4)} = ${fmt(fuelL)} L`,
  );
  steps.push(`Price = ${money(ppl)} / L`);
  steps.push(`Cost = ${fmt(fuelL)} × ${money(ppl)} = ${money(cost)}`);
  if (co2Kg != null) {
    steps.push(
      `Est. CO₂ (tank-to-wheel) ≈ ${fmt(co2Kg)} kg (${fmt(CO2_KG_PER_L[input.fuelType], 2)} kg/L)`,
    );
  }

  return {
    estimatedConsumptionLph: estimated,
    effectiveConsumptionLph: effective,
    isCustomRate: isCustom,
    totalIdlingHours: hours,
    fuelConsumedLiters: fuelL,
    totalIdlingCost: cost,
    currency: input.currency,
    formattedRate: `${fmt(fromLph(effective, input.rateDisplayUnit))} ${RATE_UNIT_LABELS[input.rateDisplayUnit]}`,
    formattedFuelConsumed: `${fmt(fromLiters(fuelL, input.fuelConsumedUnit))} ${VOLUME_UNIT_LABELS[input.fuelConsumedUnit]}`,
    formattedCost: money(cost),
    dailyFuelLiters,
    weeklyFuelLiters,
    monthlyFuelLiters,
    annualFuelLiters,
    dailyCost,
    weeklyCost,
    monthlyCost,
    annualCost,
    co2Kg,
    formulaSteps: steps,
    interpretation:
      'Estimated idling consumption uses a simplified displacement model (or your custom rate). Actual use varies with A/C, temperature, accessories, load, and engine technology. Currency labels denomination only — no live FX.',
  };
}
