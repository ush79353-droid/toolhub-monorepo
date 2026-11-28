/**
 * Fuel cost — canonical: km, L/100 km, liters, money in selected currency.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  DistanceUnit,
  FuelCostInput,
  FuelCostResult,
  FuelEfficiencyUnit,
  FuelPriceUnit,
  FuelVolumeUnit,
} from './types';
import { VEHICLE_ESTIMATE_L_PER_100KM } from './types';

export const KM_PER_MILE = 1.609344;
export const LITERS_PER_US_GAL = 3.785411784;
export const LITERS_PER_IMP_GAL = 4.54609;

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  if (from === to) return value;
  const toKm: Record<DistanceUnit, number> = {
    km: 1,
    mi: KM_PER_MILE,
    m: 0.001,
  };
  return (value * toKm[from]) / toKm[to];
}

export function toKm(value: number, unit: DistanceUnit): number {
  return convertDistance(value, unit, 'km');
}

export function fromKm(km: number, unit: DistanceUnit): number {
  return convertDistance(km, 'km', unit);
}

export function toLPer100Km(
  value: number,
  unit: FuelEfficiencyUnit,
): number | null {
  if (!(value > 0)) return null;
  if (unit === 'L/100km') return value;
  if (unit === 'km/L') return 100 / value;
  if (unit === 'mpgUS') return 235.214583 / value;
  return 282.480936 / value;
}

export function fromLPer100Km(
  l100: number,
  unit: FuelEfficiencyUnit,
): number | null {
  if (!(l100 > 0)) return null;
  if (unit === 'L/100km') return l100;
  if (unit === 'km/L') return 100 / l100;
  if (unit === 'mpgUS') return 235.214583 / l100;
  return 282.480936 / l100;
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

export function fromPricePerLiter(
  ppl: number,
  unit: FuelPriceUnit,
): number {
  if (unit === 'perL') return ppl;
  if (unit === 'perGalUS') return ppl * LITERS_PER_US_GAL;
  return ppl * LITERS_PER_IMP_GAL;
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

export function calculateTotalTripDistanceKm(
  oneWayKm: number,
  isRoundTrip: boolean,
): number | null {
  if (!(oneWayKm >= 0)) return null;
  return oneWayKm * (isRoundTrip ? 2 : 1);
}

export function calculateFuelConsumptionLiters(
  distanceKm: number,
  lPer100Km: number,
): number | null {
  if (!(distanceKm >= 0) || !(lPer100Km > 0)) return null;
  if (distanceKm === 0) return 0;
  return (distanceKm * lPer100Km) / 100;
}

export function calculateFuelCost(
  fuelLiters: number,
  pricePerLiter: number,
): number | null {
  if (!(fuelLiters >= 0) || !(pricePerLiter >= 0)) return null;
  return fuelLiters * pricePerLiter;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function resolveEconomyL100(input: FuelCostInput): number | null {
  if (input.useEstimatedEfficiency && input.vehicleEstimate !== 'custom') {
    return VEHICLE_ESTIMATE_L_PER_100KM[input.vehicleEstimate];
  }
  const ecoRaw = parseNum(input.fuelEfficiency);
  if (ecoRaw == null) return null;
  return toLPer100Km(ecoRaw, input.fuelEfficiencyUnit);
}

export function calculateFuelCostFromInput(
  input: FuelCostInput,
): FuelCostResult | null {
  const distRaw = parseNum(input.oneWayDistance);
  if (distRaw == null || distRaw < 0) return null;
  const oneWayKm = toKm(distRaw, input.distanceUnit);

  const totalKm = calculateTotalTripDistanceKm(oneWayKm, input.isRoundTrip);
  if (totalKm == null) return null;

  const economyL100 = resolveEconomyL100(input);
  if (economyL100 == null || !(economyL100 > 0)) return null;

  const priceRaw = parseNum(input.fuelPrice);
  if (priceRaw == null || priceRaw < 0) return null;
  const ppl = toPricePerLiter(priceRaw, input.fuelPriceUnit);
  if (ppl == null) return null;

  const fuelL = calculateFuelConsumptionLiters(totalKm, economyL100);
  if (fuelL == null) return null;

  const cost = calculateFuelCost(fuelL, ppl);
  if (cost == null) return null;

  const passRaw = parseNum(input.passengers);
  let costPerPassenger: number | null = null;
  if (passRaw != null && Number.isInteger(passRaw) && passRaw > 0) {
    costPerPassenger = cost / passRaw;
  }

  const costPerKm = totalKm > 0 ? cost / totalKm : null;
  const miles = totalKm / KM_PER_MILE;
  const costPerMile = miles > 0 ? cost / miles : null;

  const displayFuel = fromLiters(fuelL, input.fuelUsedUnit);
  const money = (n: number) => formatCurrencyValue(n, input.currency);

  const steps: string[] = [];
  steps.push(
    `One-way = ${fmt(oneWayKm)} km${input.isRoundTrip ? ' · round trip × 2' : ''}`,
  );
  steps.push(`Total distance = ${fmt(totalKm)} km`);
  steps.push(`Economy = ${fmt(economyL100)} L/100 km`);
  steps.push(
    `Fuel used = ${fmt(totalKm)} × ${fmt(economyL100)} / 100 = ${fmt(fuelL)} L`,
  );
  steps.push(`Price = ${money(ppl)} / L`);
  steps.push(
    `Fuel cost = ${fmt(fuelL)} × ${money(ppl)} = ${money(cost)}`,
  );
  if (costPerKm != null) {
    steps.push(`Cost per km = ${money(costPerKm)}`);
  }
  if (costPerMile != null) {
    steps.push(`Cost per mile = ${money(costPerMile)}`);
  }
  if (costPerPassenger != null && passRaw != null && passRaw > 1) {
    steps.push(
      `Cost per passenger = ${money(cost)} / ${passRaw} = ${money(costPerPassenger)}`,
    );
  }

  return {
    totalDistanceKm: totalKm,
    fuelUsedLiters: fuelL,
    totalFuelCost: cost,
    costPerKm,
    costPerMile,
    costPerPassenger,
    currency: input.currency,
    isRoundTrip: input.isRoundTrip,
    economyL100,
    pricePerLiter: ppl,
    formattedFuelUsed: `${fmt(displayFuel)} ${input.fuelUsedUnit === 'galUS' ? 'gal (US)' : input.fuelUsedUnit === 'galUK' ? 'gal (UK)' : input.fuelUsedUnit}`,
    formattedFuelCost: money(cost),
    formulaSteps: steps,
    interpretation:
      'Estimate from distance × economy and local fuel price. Real consumption varies with traffic, speed, load, weather, and driving style. Currency labels denomination only — no live FX.',
  };
}
