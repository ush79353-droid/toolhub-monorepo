/**
 * Gas Calculator — canonical: km, L/100 km, liters, money in selected currency.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  DistanceUnit,
  FuelEfficiencyUnit,
  FuelPriceUnit,
  FuelVolumeUnit,
  GasInput,
  GasResult,
} from './types';
import { VOLUME_UNIT_LABELS } from './types';

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
  const km = from === 'mi' ? value * KM_PER_MILE : value;
  return to === 'mi' ? km / KM_PER_MILE : km;
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

export function fromPricePerLiter(ppl: number, unit: FuelPriceUnit): number {
  if (unit === 'perL') return ppl;
  if (unit === 'perGalUS') return ppl * LITERS_PER_US_GAL;
  return ppl * LITERS_PER_IMP_GAL;
}

export function toLiters(value: number, unit: FuelVolumeUnit): number {
  if (unit === 'L') return value;
  if (unit === 'galUS') return value * LITERS_PER_US_GAL;
  return value * LITERS_PER_IMP_GAL;
}

export function fromLiters(liters: number, unit: FuelVolumeUnit): number {
  if (unit === 'L') return liters;
  if (unit === 'galUS') return liters / LITERS_PER_US_GAL;
  return liters / LITERS_PER_IMP_GAL;
}

export function calculateTotalDistanceKm(
  oneWayKm: number,
  isRoundTrip: boolean,
): number | null {
  if (!(oneWayKm >= 0)) return null;
  return oneWayKm * (isRoundTrip ? 2 : 1);
}

export function calculateFuelRequired(
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

export function calculateCostPerPerson(
  totalCost: number,
  passengers: number,
): number | null {
  if (!(totalCost >= 0) || !(passengers > 0) || !Number.isInteger(passengers)) {
    return null;
  }
  return totalCost / passengers;
}

export function calculateCostPerKm(
  totalCost: number,
  distanceKm: number,
): number | null {
  if (!(totalCost >= 0) || !(distanceKm > 0)) return null;
  return totalCost / distanceKm;
}

export function calculateMaximumDrivingRangeKm(
  availableFuelLiters: number,
  lPer100Km: number,
): number | null {
  if (!(availableFuelLiters >= 0) || !(lPer100Km > 0)) return null;
  return (availableFuelLiters * 100) / lPer100Km;
}

export function calculateWeeklyFuelCost(
  costPerTrip: number,
  tripsPerWeek: number,
): number | null {
  if (!(costPerTrip >= 0) || !(tripsPerWeek > 0)) return null;
  return costPerTrip * tripsPerWeek;
}

export function calculateAnnualFuelCost(weeklyCost: number): number {
  return weeklyCost * 52;
}

/** Average month = 52/12 weeks. */
export function calculateMonthlyFuelCost(weeklyCost: number): number {
  return (weeklyCost * 52) / 12;
}

export function applyConsumptionReduction(
  lPer100Km: number,
  reductionPercent: number,
): number | null {
  if (!(lPer100Km > 0)) return null;
  if (!(reductionPercent >= 0) || !(reductionPercent < 100)) return null;
  return lPer100Km * (1 - reductionPercent / 100);
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateGasFromInput(input: GasInput): GasResult | null {
  const distRaw = parseNum(input.oneWayDistance);
  if (distRaw == null || distRaw < 0) return null;
  const oneWayKm = toKm(distRaw, input.distanceUnit);

  const totalKm = calculateTotalDistanceKm(oneWayKm, input.isRoundTrip);
  if (totalKm == null) return null;

  const ecoRaw = parseNum(input.fuelEfficiency);
  if (ecoRaw == null) return null;
  const economyL100 = toLPer100Km(ecoRaw, input.fuelEfficiencyUnit);
  if (economyL100 == null || !(economyL100 > 0)) return null;

  const priceRaw = parseNum(input.fuelPrice);
  if (priceRaw == null || priceRaw < 0) return null;
  const ppl = toPricePerLiter(priceRaw, input.fuelPriceUnit);
  if (ppl == null) return null;

  const fuelL = calculateFuelRequired(totalKm, economyL100);
  if (fuelL == null) return null;

  const cost = calculateFuelCost(fuelL, ppl);
  if (cost == null) return null;

  const passRaw = parseNum(input.passengers);
  if (
    passRaw == null ||
    !Number.isInteger(passRaw) ||
    passRaw <= 0
  ) {
    return null;
  }
  const costPerPerson = calculateCostPerPerson(cost, passRaw);
  const costPerKm = calculateCostPerKm(cost, totalKm);
  const miles = totalKm / KM_PER_MILE;
  const costPerMile = miles > 0 ? cost / miles : null;

  let maximumRangeKm: number | null = null;
  const availRaw = parseNum(input.availableFuel);
  if (availRaw != null && availRaw >= 0) {
    const availL = toLiters(availRaw, input.availableFuelUnit);
    maximumRangeKm = calculateMaximumDrivingRangeKm(availL, economyL100);
  }

  let weeklyFuelCost: number | null = null;
  let monthlyFuelCost: number | null = null;
  let annualFuelCost: number | null = null;
  const tripsRaw = parseNum(input.tripsPerWeek);
  if (tripsRaw != null && tripsRaw > 0) {
    weeklyFuelCost = calculateWeeklyFuelCost(cost, tripsRaw);
    if (weeklyFuelCost != null) {
      monthlyFuelCost = calculateMonthlyFuelCost(weeklyFuelCost);
      annualFuelCost = calculateAnnualFuelCost(weeklyFuelCost);
    }
  }

  let comparisonFuelCost: number | null = null;
  let estimatedSavings: number | null = null;
  const cmpRaw = parseNum(input.comparisonEfficiency);
  if (cmpRaw != null && cmpRaw > 0) {
    const cmpL100 = toLPer100Km(cmpRaw, input.comparisonEfficiencyUnit);
    if (cmpL100 != null && cmpL100 > 0) {
      const cmpFuel = calculateFuelRequired(totalKm, cmpL100);
      if (cmpFuel != null) {
        comparisonFuelCost = calculateFuelCost(cmpFuel, ppl);
        if (comparisonFuelCost != null) {
          estimatedSavings = cost - comparisonFuelCost;
        }
      }
    }
  }

  let improvedEconomyL100: number | null = null;
  let improvedFuelCost: number | null = null;
  let improvementSavings: number | null = null;
  const redRaw = parseNum(input.consumptionReductionPercent);
  if (redRaw != null && redRaw >= 0 && redRaw < 100) {
    improvedEconomyL100 = applyConsumptionReduction(economyL100, redRaw);
    if (improvedEconomyL100 != null) {
      const improvedFuel = calculateFuelRequired(totalKm, improvedEconomyL100);
      if (improvedFuel != null) {
        improvedFuelCost = calculateFuelCost(improvedFuel, ppl);
        if (improvedFuelCost != null) {
          improvementSavings = cost - improvedFuelCost;
        }
      }
    }
  }

  const displayFuel = fromLiters(fuelL, input.fuelUsedUnit);
  const money = (n: number) => formatCurrencyValue(n, input.currency);

  const steps: string[] = [];
  steps.push(
    `One-way = ${fmt(oneWayKm)} km${input.isRoundTrip ? ' · round trip × 2' : ''}`,
  );
  steps.push(`Total distance = ${fmt(totalKm)} km`);
  steps.push(`Economy = ${fmt(economyL100)} L/100 km`);
  steps.push(
    `Fuel required = ${fmt(totalKm)} × ${fmt(economyL100)} / 100 = ${fmt(fuelL)} L`,
  );
  steps.push(`Price = ${money(ppl)} / L`);
  steps.push(
    `Fuel cost = ${fmt(fuelL)} × ${money(ppl)} = ${money(cost)}`,
  );
  if (costPerPerson != null) {
    steps.push(
      `Cost per person = ${money(cost)} / ${passRaw} = ${money(costPerPerson)}`,
    );
  }
  if (costPerKm != null) {
    steps.push(`Cost per km = ${money(costPerKm)}`);
  }
  if (maximumRangeKm != null) {
    steps.push(`Max range (available fuel) ≈ ${fmt(maximumRangeKm)} km`);
  }
  if (weeklyFuelCost != null) {
    steps.push(
      `Weekly ≈ ${money(weeklyFuelCost)}; monthly (52/12) ≈ ${money(monthlyFuelCost!)}; annual ≈ ${money(annualFuelCost!)}`,
    );
  }
  if (comparisonFuelCost != null && estimatedSavings != null) {
    steps.push(
      `Comparison vehicle cost = ${money(comparisonFuelCost)}; difference vs primary = ${money(estimatedSavings)}`,
    );
  }
  if (improvedEconomyL100 != null && improvedFuelCost != null) {
    steps.push(
      `Improved economy = ${fmt(improvedEconomyL100)} L/100 km → cost ${money(improvedFuelCost)} (saves ${money(improvementSavings!)})`,
    );
  }

  return {
    totalDistanceKm: totalKm,
    fuelRequiredLiters: fuelL,
    totalFuelCost: cost,
    costPerPerson,
    costPerKm,
    costPerMile,
    currency: input.currency,
    isRoundTrip: input.isRoundTrip,
    economyL100,
    pricePerLiter: ppl,
    passengers: passRaw,
    formattedFuelRequired: `${fmt(displayFuel)} ${VOLUME_UNIT_LABELS[input.fuelUsedUnit]}`,
    formattedFuelCost: money(cost),
    maximumRangeKm,
    weeklyFuelCost,
    monthlyFuelCost,
    annualFuelCost,
    comparisonFuelCost,
    estimatedSavings,
    improvedEconomyL100,
    improvedFuelCost,
    improvementSavings,
    formulaSteps: steps,
    interpretation:
      'Estimate from distance × economy and pump price. Real consumption varies with traffic, speed, load, weather, and driving style. Currency labels denomination only — no live FX or fuel-price feed.',
  };
}
