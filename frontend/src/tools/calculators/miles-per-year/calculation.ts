/**
 * Miles per year — canonical distance: miles.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  DistanceUnit,
  FuelEfficiencyUnit,
  FuelPriceUnit,
  MileagePeriod,
  MilesPerYearInput,
  MilesPerYearResult,
} from './types';
import { DISTANCE_UNIT_LABELS } from './types';

export const KM_PER_MILE = 1.609344;
export const DAYS_PER_YEAR = 365;
export const LITERS_PER_US_GAL = 3.785411784;
export const LITERS_PER_IMP_GAL = 4.54609;

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertMilesToKilometers(mi: number): number {
  return mi * KM_PER_MILE;
}

export function convertKilometersToMiles(km: number): number {
  return km / KM_PER_MILE;
}

export function toMiles(value: number, unit: DistanceUnit): number {
  return unit === 'mi' ? value : convertKilometersToMiles(value);
}

export function fromMiles(mi: number, unit: DistanceUnit): number {
  return unit === 'mi' ? mi : convertMilesToKilometers(mi);
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  if (from === to) return value;
  return fromMiles(toMiles(value, from), to);
}

export function getAnnualMileageMultiplier(period: MileagePeriod): number {
  if (period === 'day') return DAYS_PER_YEAR;
  if (period === 'week') return DAYS_PER_YEAR / 7;
  if (period === 'month') return 12;
  return 1;
}

export function calculateAnnualMiles(
  periodDistanceMiles: number,
  period: MileagePeriod,
): number | null {
  if (!(periodDistanceMiles >= 0)) return null;
  return periodDistanceMiles * getAnnualMileageMultiplier(period);
}

export function calculateAnnualKilometers(annualMiles: number): number {
  return convertMilesToKilometers(annualMiles);
}

/** Convert period distance when period changes, preserving annual miles. */
export function convertPeriodDistancePreservingAnnual(
  distance: number,
  fromPeriod: MileagePeriod,
  toPeriod: MileagePeriod,
): number {
  if (fromPeriod === toPeriod) return distance;
  const annual = distance * getAnnualMileageMultiplier(fromPeriod);
  return annual / getAnnualMileageMultiplier(toPeriod);
}

export function calculateCommuteRoundTrip(
  oneWay: number,
  isRoundTrip: boolean,
): number {
  return oneWay * (isRoundTrip ? 2 : 1);
}

export function calculateAnnualCommuteMileage(
  tripMiles: number,
  daysPerWeek: number,
  weeksPerYear: number,
): number | null {
  if (!(tripMiles >= 0) || !(daysPerWeek >= 0) || !(weeksPerYear >= 0)) {
    return null;
  }
  return tripMiles * daysPerWeek * weeksPerYear;
}

export function calculateAnnualPersonalMileage(
  weeklyMiles: number,
  weeksPerYear: number,
): number | null {
  if (!(weeklyMiles >= 0) || !(weeksPerYear >= 0)) return null;
  return weeklyMiles * weeksPerYear;
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

export function calculateAnnualFuelConsumption(
  annualMiles: number,
  efficiency: number,
  efficiencyUnit: FuelEfficiencyUnit,
): { usGallons: number; liters: number } | null {
  if (!(annualMiles >= 0) || !(efficiency > 0)) return null;
  if (efficiencyUnit === 'mpgUS') {
    const usGallons = annualMiles / efficiency;
    return { usGallons, liters: usGallons * LITERS_PER_US_GAL };
  }
  if (efficiencyUnit === 'mpgUK') {
    const ukGal = annualMiles / efficiency;
    const liters = ukGal * LITERS_PER_IMP_GAL;
    return { usGallons: liters / LITERS_PER_US_GAL, liters };
  }
  const l100 = toLPer100Km(efficiency, efficiencyUnit);
  if (l100 == null) return null;
  const annualKm = convertMilesToKilometers(annualMiles);
  const liters = (annualKm * l100) / 100;
  return { usGallons: liters / LITERS_PER_US_GAL, liters };
}

export function calculateAnnualDrivingCost(
  fuelAmount: number,
  pricePerUnit: number,
): number | null {
  if (!(fuelAmount >= 0) || !(pricePerUnit >= 0)) return null;
  return fuelAmount * pricePerUnit;
}

export function calculateFutureOdometer(
  currentMiles: number,
  annualMiles: number,
  years: number,
): number | null {
  if (!(currentMiles >= 0) || !(annualMiles >= 0) || !(years >= 0)) return null;
  return currentMiles + annualMiles * years;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateMilesPerYearFromInput(
  input: MilesPerYearInput,
): MilesPerYearResult | null {
  const steps: string[] = [];
  let annualMiles: number;

  if (input.mode === 'period') {
    const distRaw = parseNum(input.distance);
    if (distRaw == null || distRaw < 0) return null;
    const periodMi = toMiles(distRaw, input.distanceUnit);
    const annual = calculateAnnualMiles(periodMi, input.period);
    if (annual == null) return null;
    annualMiles = annual;
    const mult = getAnnualMileageMultiplier(input.period);
    steps.push(`Period: ${input.period}`);
    steps.push(
      `Distance = ${fmt(periodMi)} mi × ${fmt(mult, 4)} = ${fmt(annualMiles)} mi/year`,
    );
  } else {
    const oneWayRaw = parseNum(input.oneWayCommute);
    const daysRaw = parseNum(input.daysPerWeek);
    const weeksRaw = parseNum(input.weeksPerYear);
    const addRaw = parseNum(input.additionalWeekly);
    if (oneWayRaw == null || oneWayRaw < 0) return null;
    if (daysRaw == null || daysRaw < 0 || daysRaw > 7) return null;
    if (weeksRaw == null || weeksRaw < 0 || weeksRaw > 53) return null;
    if (addRaw == null || addRaw < 0) return null;

    const oneWayMi = toMiles(oneWayRaw, input.commuteUnit);
    const trip = calculateCommuteRoundTrip(oneWayMi, input.isRoundTrip);
    const commute = calculateAnnualCommuteMileage(trip, daysRaw, weeksRaw);
    const personal = calculateAnnualPersonalMileage(
      toMiles(addRaw, input.commuteUnit),
      weeksRaw,
    );
    if (commute == null || personal == null) return null;
    annualMiles = commute + personal;
    steps.push(
      `Trip = ${fmt(oneWayMi)} mi${input.isRoundTrip ? ' × 2' : ''} = ${fmt(trip)} mi`,
    );
    steps.push(
      `Annual commute = ${fmt(trip)} × ${daysRaw} × ${weeksRaw} = ${fmt(commute)} mi`,
    );
    steps.push(
      `Annual personal = ${fmt(toMiles(addRaw, input.commuteUnit))} × ${weeksRaw} = ${fmt(personal)} mi`,
    );
    steps.push(`Total = ${fmt(annualMiles)} mi/year`);
  }

  const annualKm = calculateAnnualKilometers(annualMiles);
  const avgPerDayMiles = annualMiles / DAYS_PER_YEAR;
  const avgPerWeekMiles = annualMiles / (DAYS_PER_YEAR / 7);
  const avgPerMonthMiles = annualMiles / 12;

  let annualFuelUsGallons: number | null = null;
  let annualFuelLiters: number | null = null;
  let annualFuelCost: number | null = null;
  let monthlyFuelCost: number | null = null;
  let currency = null as MilesPerYearResult['currency'];

  if (input.showFuelCost) {
    const effRaw = parseNum(input.fuelEfficiency);
    const priceRaw = parseNum(input.fuelPrice);
    if (effRaw == null || !(effRaw > 0)) return null;
    if (priceRaw == null || priceRaw < 0) return null;
    const fuel = calculateAnnualFuelConsumption(
      annualMiles,
      effRaw,
      input.fuelEfficiencyUnit,
    );
    if (!fuel) return null;
    annualFuelUsGallons = fuel.usGallons;
    annualFuelLiters = fuel.liters;

    // Cost in selected price unit amount × matching fuel amount
    if (input.fuelPriceUnit === 'perGalUS') {
      annualFuelCost = calculateAnnualDrivingCost(fuel.usGallons, priceRaw);
    } else if (input.fuelPriceUnit === 'perGalUK') {
      const ukGal = fuel.liters / LITERS_PER_IMP_GAL;
      annualFuelCost = calculateAnnualDrivingCost(ukGal, priceRaw);
    } else {
      annualFuelCost = calculateAnnualDrivingCost(fuel.liters, priceRaw);
    }
    if (annualFuelCost == null) return null;
    monthlyFuelCost = annualFuelCost / 12;
    currency = input.currency;
    steps.push(
      `Fuel ≈ ${fmt(fuel.usGallons)} US gal (${fmt(fuel.liters)} L)`,
    );
    steps.push(
      `Annual fuel cost ≈ ${formatCurrencyValue(annualFuelCost, input.currency)}`,
    );
  }

  let projectedOdometerMiles: number | null = null;
  let formattedProjected: string | null = null;
  if (input.showProjection) {
    const odoRaw = parseNum(input.currentOdometer);
    const yearsRaw = parseNum(input.projectionYears);
    if (odoRaw == null || odoRaw < 0) return null;
    if (yearsRaw == null || yearsRaw < 0) return null;
    const odoMi = toMiles(odoRaw, input.odometerUnit);
    projectedOdometerMiles = calculateFutureOdometer(
      odoMi,
      annualMiles,
      yearsRaw,
    );
    if (projectedOdometerMiles == null) return null;
    formattedProjected = `${fmt(fromMiles(projectedOdometerMiles, input.odometerUnit))} ${DISTANCE_UNIT_LABELS[input.odometerUnit]}`;
    steps.push(
      `Projected odometer = ${fmt(odoMi)} + ${fmt(annualMiles)} × ${yearsRaw} = ${fmt(projectedOdometerMiles)} mi`,
    );
  }

  return {
    annualMiles,
    annualKilometers: annualKm,
    avgPerDayMiles,
    avgPerWeekMiles,
    avgPerMonthMiles,
    formattedAnnual: `${fmt(fromMiles(annualMiles, input.outputUnit))} ${DISTANCE_UNIT_LABELS[input.outputUnit]}/year`,
    annualFuelUsGallons,
    annualFuelLiters,
    annualFuelCost,
    monthlyFuelCost,
    currency,
    projectedOdometerMiles,
    formattedProjected,
    formulaSteps: steps,
    interpretation:
      'Annual mileage estimate assumes a steady rate (365-day year for day/week; 12 months for month). Real driving varies seasonally. Currency labels denomination only — no live FX.',
  };
}
