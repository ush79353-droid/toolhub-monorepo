/**
 * MPG engine — canonical: miles, US gallons, US mpg; L/100 km via 235.214583.
 * Currency labels denomination only — no live FX.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  DistanceUnit,
  FuelEconomyUnit,
  FuelPriceUnit,
  FuelVolumeUnit,
  MpgInput,
  MpgResult,
} from './types';
import {
  DISTANCE_UNIT_LABELS,
  ECONOMY_UNIT_LABELS,
  VOLUME_UNIT_LABELS,
} from './types';

export const KM_PER_MILE = 1.609344;
export const M_PER_MI = 1609.344;
export const M_PER_FT = 0.3048;
export const M_PER_YD = 0.9144;
export const M_PER_NMI = 1852;
export const LITERS_PER_US_GAL = 3.785411784;
export const LITERS_PER_IMP_GAL = 4.54609;
/** Exact: 100 × LITERS_PER_US_GAL / KM_PER_MILE */
export const L100_FROM_US_MPG = 235.214583;
export const KM_L_PER_US_MPG = KM_PER_MILE / LITERS_PER_US_GAL; // ≈ 0.425143707
export const US_PER_IMP_MPG = LITERS_PER_US_GAL / LITERS_PER_IMP_GAL; // ≈ 0.832674185

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function toMiles(value: number, unit: DistanceUnit): number {
  const toMi: Record<DistanceUnit, number> = {
    mi: 1,
    km: 1 / KM_PER_MILE,
    m: 1 / M_PER_MI,
    ft: 1 / 5280,
    yd: 1 / 1760,
    nmi: M_PER_NMI / M_PER_MI,
  };
  return value * toMi[unit];
}

export function fromMiles(miles: number, unit: DistanceUnit): number {
  return miles / toMiles(1, unit);
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  if (from === to) return value;
  return fromMiles(toMiles(value, from), to);
}

export function toUSGallons(value: number, unit: FuelVolumeUnit): number {
  const toUS: Record<FuelVolumeUnit, number> = {
    'us-gal': 1,
    'imp-gal': LITERS_PER_IMP_GAL / LITERS_PER_US_GAL,
    L: 1 / LITERS_PER_US_GAL,
    mL: 1 / (LITERS_PER_US_GAL * 1000),
  };
  return value * toUS[unit];
}

export function fromUSGallons(usGal: number, unit: FuelVolumeUnit): number {
  return usGal / toUSGallons(1, unit);
}

export function convertFuelVolume(
  value: number,
  from: FuelVolumeUnit,
  to: FuelVolumeUnit,
): number {
  if (from === to) return value;
  return fromUSGallons(toUSGallons(value, from), to);
}

/** Normalize any economy unit → US mpg (positive). L/100km: lower is better. */
export function toUSMpg(value: number, unit: FuelEconomyUnit): number | null {
  if (!(value > 0)) return null;
  if (unit === 'us-mpg') return value;
  if (unit === 'imp-mpg') return value * US_PER_IMP_MPG;
  if (unit === 'km/L') return value / KM_L_PER_US_MPG;
  if (unit === 'mi/L') return value * LITERS_PER_US_GAL;
  // L/100km
  return L100_FROM_US_MPG / value;
}

export function fromUSMpg(mpgUS: number, unit: FuelEconomyUnit): number | null {
  if (!(mpgUS > 0)) return null;
  if (unit === 'us-mpg') return mpgUS;
  if (unit === 'imp-mpg') return mpgUS / US_PER_IMP_MPG;
  if (unit === 'km/L') return mpgUS * KM_L_PER_US_MPG;
  if (unit === 'mi/L') return mpgUS / LITERS_PER_US_GAL;
  return L100_FROM_US_MPG / mpgUS;
}

export function convertFuelEconomy(
  value: number,
  from: FuelEconomyUnit,
  to: FuelEconomyUnit,
): number | null {
  if (from === to) return value > 0 ? value : null;
  const us = toUSMpg(value, from);
  if (us == null) return null;
  return fromUSMpg(us, to);
}

export function calculateMPG(
  distanceMiles: number,
  fuelUSGallons: number,
): number | null {
  if (!(distanceMiles >= 0) || !(fuelUSGallons > 0)) return null;
  if (distanceMiles === 0) return 0;
  return distanceMiles / fuelUSGallons;
}

export function calculateFuelUsedUSGallons(
  distanceMiles: number,
  mpgUS: number,
): number | null {
  if (!(distanceMiles >= 0) || !(mpgUS > 0)) return null;
  return distanceMiles / mpgUS;
}

export function calculateDistanceMiles(
  mpgUS: number,
  fuelUSGallons: number,
): number | null {
  if (!(mpgUS >= 0) || !(fuelUSGallons >= 0)) return null;
  return mpgUS * fuelUSGallons;
}

export function calculateLitersPer100Km(mpgUS: number): number | null {
  if (!(mpgUS > 0)) return null;
  return L100_FROM_US_MPG / mpgUS;
}

export function calculateKilometersPerLiter(mpgUS: number): number | null {
  if (!(mpgUS > 0)) return null;
  return mpgUS * KM_L_PER_US_MPG;
}

export function calculateFuelRequiredUSGallons(
  tripMiles: number,
  mpgUS: number,
): number | null {
  return calculateFuelUsedUSGallons(tripMiles, mpgUS);
}

export function calculateFuelRangeMiles(
  fuelUSGallons: number,
  mpgUS: number,
): number | null {
  return calculateDistanceMiles(mpgUS, fuelUSGallons);
}

export function pricePerUSGallon(
  price: number,
  unit: FuelPriceUnit,
): number | null {
  if (!(price >= 0) || !Number.isFinite(price)) return null;
  if (unit === 'per-us-gal') return price;
  if (unit === 'per-imp-gal') return price / (LITERS_PER_IMP_GAL / LITERS_PER_US_GAL);
  return price * LITERS_PER_US_GAL; // per liter → per US gal
}

export function calculateTripCost(
  fuelUSGallons: number,
  pricePerUSGal: number,
): number | null {
  if (!(fuelUSGallons >= 0) || !(pricePerUSGal >= 0)) return null;
  return fuelUSGallons * pricePerUSGal;
}

export function calculateCostPerMile(
  totalCost: number,
  miles: number,
): number | null {
  if (!(totalCost >= 0) || !(miles > 0)) return null;
  return totalCost / miles;
}

export function calculateCostPerKilometer(
  totalCost: number,
  miles: number,
): number | null {
  if (!(totalCost >= 0) || !(miles > 0)) return null;
  return totalCost / (miles * KM_PER_MILE);
}

export function calculateMPGImprovement(
  oldMpgUS: number,
  newMpgUS: number,
): { difference: number; improvementPct: number; consumptionReductionPct: number } | null {
  if (!(oldMpgUS > 0) || !(newMpgUS > 0)) return null;
  const difference = newMpgUS - oldMpgUS;
  const improvementPct = (difference / oldMpgUS) * 100;
  const consumptionReductionPct = (1 - oldMpgUS / newMpgUS) * 100;
  return { difference, improvementPct, consumptionReductionPct };
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateMpgFromInput(input: MpgInput): MpgResult | null {
  const mode = input.calculationMode;
  const steps: string[] = [];

  let distanceMiles: number;
  let fuelUS: number;
  let mpgUS: number;

  if (mode === 'fuel-economy') {
    const d = parseNum(input.distance);
    const f = parseNum(input.fuelUsed);
    if (d == null || d < 0) return null;
    if (f == null || f < 0) return null;
    distanceMiles = toMiles(d, input.distanceUnit);
    fuelUS = toUSGallons(f, input.fuelUsedUnit);
    const mpg = calculateMPG(distanceMiles, fuelUS);
    if (mpg == null) return null;
    mpgUS = mpg;
    steps.push(
      `Distance = ${fmt(d)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]} · Fuel = ${fmt(f)} ${VOLUME_UNIT_LABELS[input.fuelUsedUnit]}`,
    );
    steps.push(
      `US MPG = miles / US gal = ${fmt(distanceMiles)} / ${fmt(fuelUS)} = ${fmt(mpgUS)}`,
    );
  } else if (mode === 'fuel-used') {
    const d = parseNum(input.distance);
    const e = parseNum(input.fuelEconomy);
    if (d == null || d < 0) return null;
    if (e == null || !(e > 0)) return null;
    distanceMiles = toMiles(d, input.distanceUnit);
    const us = toUSMpg(e, input.fuelEconomyUnit);
    if (us == null) return null;
    mpgUS = us;
    const fuel = calculateFuelUsedUSGallons(distanceMiles, mpgUS);
    if (fuel == null) return null;
    fuelUS = fuel;
    steps.push(
      `Distance = ${fmt(distanceMiles)} mi · Economy = ${fmt(mpgUS)} US mpg`,
    );
    steps.push(`Fuel used = ${fmt(distanceMiles)} / ${fmt(mpgUS)} = ${fmt(fuelUS)} US gal`);
  } else {
    const f = parseNum(input.fuelUsed);
    const e = parseNum(input.fuelEconomy);
    if (f == null || f < 0) return null;
    if (e == null || !(e > 0)) return null;
    fuelUS = toUSGallons(f, input.fuelUsedUnit);
    const us = toUSMpg(e, input.fuelEconomyUnit);
    if (us == null) return null;
    mpgUS = us;
    const dist = calculateDistanceMiles(mpgUS, fuelUS);
    if (dist == null) return null;
    distanceMiles = dist;
    steps.push(
      `Fuel = ${fmt(fuelUS)} US gal · Economy = ${fmt(mpgUS)} US mpg`,
    );
    steps.push(`Distance = ${fmt(mpgUS)} × ${fmt(fuelUS)} = ${fmt(distanceMiles)} mi`);
  }

  const mpgImperial = fromUSMpg(mpgUS, 'imp-mpg');
  const kmL = calculateKilometersPerLiter(mpgUS);
  const l100 = calculateLitersPer100Km(mpgUS);
  const miL = fromUSMpg(mpgUS, 'mi/L');
  if (mpgImperial == null || kmL == null || l100 == null || miL == null) {
    // zero MPG edge (zero distance): still allow display of 0 economy
    if (mpgUS === 0) {
      // leave conversions null-ish via 0 display path below
    } else {
      return null;
    }
  }

  const distanceValue = fromMiles(distanceMiles, input.distanceUnit);
  const fuelUsedValue = fromUSGallons(fuelUS, input.fuelUsedUnit);
  const economyValue =
    mpgUS === 0
      ? 0
      : (fromUSMpg(mpgUS, input.fuelEconomyUnit) ?? 0);

  steps.push(
    `Also ≈ ${fmt(l100 ?? 0)} L/100 km · ${fmt(kmL ?? 0)} km/L · ${fmt(mpgImperial ?? 0)} imp mpg`,
  );

  let tripFuelNeeded: number | null = null;
  let tripFuelNeededUnit: FuelVolumeUnit | null = null;
  let tripCost: number | null = null;
  let costPerMile: number | null = null;
  let costPerKilometer: number | null = null;
  let currency = null as MpgResult['currency'];

  if (input.showTripCost) {
    if (!(mpgUS > 0)) return null;
    const td = parseNum(input.tripDistance);
    const price = parseNum(input.fuelPrice);
    if (td == null || td < 0) return null;
    if (price == null || price < 0) return null;
    const tripMi = toMiles(td, input.tripDistanceUnit);
    const needed = calculateFuelRequiredUSGallons(tripMi, mpgUS);
    if (needed == null) return null;
    const ppg = pricePerUSGallon(price, input.fuelPriceUnit);
    if (ppg == null) return null;
    tripFuelNeeded = fromUSGallons(needed, input.fuelUsedUnit);
    tripFuelNeededUnit = input.fuelUsedUnit;
    tripCost = calculateTripCost(needed, ppg);
    if (tripCost == null) return null;
    costPerMile = calculateCostPerMile(tripCost, tripMi);
    costPerKilometer = calculateCostPerKilometer(tripCost, tripMi);
    currency = input.currency;
    steps.push(
      `Trip fuel = ${fmt(tripMi)} mi / ${fmt(mpgUS)} = ${fmt(needed)} US gal → ${formatCurrencyValue(tripCost, input.currency)}`,
    );
  }

  let rangeDistance: number | null = null;
  let rangeDistanceUnit: DistanceUnit | null = null;
  if (input.showRange) {
    if (!(mpgUS > 0)) return null;
    const af = parseNum(input.availableFuel);
    if (af == null || af < 0) return null;
    const afUS = toUSGallons(af, input.availableFuelUnit);
    const rangeMi = calculateFuelRangeMiles(afUS, mpgUS);
    if (rangeMi == null) return null;
    rangeDistance = fromMiles(rangeMi, input.distanceUnit);
    rangeDistanceUnit = input.distanceUnit;
    steps.push(
      `Range = ${fmt(afUS)} US gal × ${fmt(mpgUS)} = ${fmt(rangeMi)} mi`,
    );
  }

  let compareFuelA: number | null = null;
  let compareFuelB: number | null = null;
  let compareCostA: number | null = null;
  let compareCostB: number | null = null;
  let fuelSavings: number | null = null;
  let costSavings: number | null = null;
  let fuelReductionPct: number | null = null;

  if (input.showCompare) {
    if (!(mpgUS > 0)) return null;
    const eb = parseNum(input.compareEconomyB);
    const cd = parseNum(input.compareDistance);
    const price = parseNum(input.fuelPrice);
    if (eb == null || !(eb > 0)) return null;
    if (cd == null || cd < 0) return null;
    if (price == null || price < 0) return null;
    const mpgB = toUSMpg(eb, input.compareEconomyBUnit);
    if (mpgB == null) return null;
    const cmpMi = toMiles(cd, input.compareDistanceUnit);
    const fuelA = calculateFuelUsedUSGallons(cmpMi, mpgUS);
    const fuelB = calculateFuelUsedUSGallons(cmpMi, mpgB);
    if (fuelA == null || fuelB == null) return null;
    const ppg = pricePerUSGallon(price, input.fuelPriceUnit);
    if (ppg == null) return null;
    compareFuelA = fuelA;
    compareFuelB = fuelB;
    compareCostA = calculateTripCost(fuelA, ppg);
    compareCostB = calculateTripCost(fuelB, ppg);
    if (compareCostA == null || compareCostB == null) return null;
    fuelSavings = fuelA - fuelB;
    costSavings = compareCostA - compareCostB;
    fuelReductionPct = fuelA > 0 ? ((fuelA - fuelB) / fuelA) * 100 : null;
    currency = input.currency;
    steps.push(
      `Compare @ ${fmt(cmpMi)} mi: A ${fmt(fuelA)} gal / B ${fmt(fuelB)} gal · save ${fmt(fuelSavings)} gal`,
    );
  }

  let mpgDifference: number | null = null;
  let mpgImprovementPct: number | null = null;
  let consumptionReductionPct: number | null = null;
  if (input.showImprove) {
    const prev = parseNum(input.previousEconomy);
    const next = parseNum(input.newEconomy);
    if (prev == null || !(prev > 0)) return null;
    if (next == null || !(next > 0)) return null;
    const oldUS = toUSMpg(prev, input.previousEconomyUnit);
    const newUS = toUSMpg(next, input.newEconomyUnit);
    if (oldUS == null || newUS == null) return null;
    const imp = calculateMPGImprovement(oldUS, newUS);
    if (!imp) return null;
    mpgDifference = imp.difference;
    mpgImprovementPct = imp.improvementPct;
    consumptionReductionPct = imp.consumptionReductionPct;
    steps.push(
      `Improve: ${fmt(oldUS)} → ${fmt(newUS)} US mpg (+${fmt(imp.improvementPct)}% MPG; −${fmt(imp.consumptionReductionPct)}% fuel)`,
    );
  }

  return {
    calculationMode: mode,
    distanceValue,
    distanceUnit: input.distanceUnit,
    fuelUsedValue,
    fuelUsedUnit: input.fuelUsedUnit,
    economyValue,
    economyUnit: input.fuelEconomyUnit,
    mpgUS,
    mpgImperial: mpgImperial ?? 0,
    kilometersPerLiter: kmL ?? 0,
    litersPer100Km: l100 ?? 0,
    milesPerLiter: miL ?? 0,
    distanceDisplay: `${fmt(distanceValue)} ${DISTANCE_UNIT_LABELS[input.distanceUnit]}`,
    fuelUsedDisplay: `${fmt(fuelUsedValue)} ${VOLUME_UNIT_LABELS[input.fuelUsedUnit]}`,
    economyDisplay: `${fmt(economyValue)} ${ECONOMY_UNIT_LABELS[input.fuelEconomyUnit]}`,
    tripFuelNeeded,
    tripFuelNeededUnit,
    tripCost,
    costPerMile,
    costPerKilometer,
    currency,
    rangeDistance,
    rangeDistanceUnit,
    compareFuelA,
    compareFuelB,
    compareCostA,
    compareCostB,
    fuelSavings,
    costSavings,
    fuelReductionPct,
    mpgDifference,
    mpgImprovementPct,
    consumptionReductionPct,
    formulaSteps: steps,
    interpretation:
      'Higher US/imp mpg and km/L mean better economy; lower L/100 km means better economy. US and Imperial gallons differ. Currency labels denomination only — no live FX. Estimates assume constant average fuel economy.',
  };
}
