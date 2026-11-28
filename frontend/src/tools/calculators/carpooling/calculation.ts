/**
 * Carpooling cost engine — canonical internals:
 * distance km, economy L/100km, fuel L, money in selected currency units.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  CarpoolingInput,
  CarpoolingResult,
  DistanceUnit,
  ExpenseBreakdownPoint,
  FuelEconomyUnit,
  FuelPriceUnit,
  FuelVolumeUnit,
  OccupancyChartPoint,
} from './types';

export const KM_PER_MILE = 1.609344;
export const LITERS_PER_US_GAL = 3.785411784;
export const LITERS_PER_IMP_GAL = 4.54609;

function fmt(n: number, digits = 2): string {
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

/** Convert fuel economy to L/100 km. */
export function convertFuelEconomy(
  value: number,
  from: FuelEconomyUnit,
  to: FuelEconomyUnit,
): number {
  const toL100: Record<FuelEconomyUnit, (v: number) => number> = {
    'L/100km': (v) => v,
    'km/L': (v) => 100 / v,
    mpgUS: (v) => 235.214583 / v,
    mpgUK: (v) => 282.480936 / v,
  };
  const fromL100: Record<FuelEconomyUnit, (v: number) => number> = {
    'L/100km': (v) => v,
    'km/L': (v) => 100 / v,
    mpgUS: (v) => 235.214583 / v,
    mpgUK: (v) => 282.480936 / v,
  };
  const l100 = toL100[from](value);
  return fromL100[to](l100);
}

export function toLPer100Km(
  value: number,
  unit: FuelEconomyUnit,
): number | null {
  if (!(value > 0)) return null;
  if (unit === 'L/100km') return value;
  if (unit === 'km/L') return 100 / value;
  if (unit === 'mpgUS') return 235.214583 / value;
  return 282.480936 / value;
}

export function fromLPer100Km(
  l100: number,
  unit: FuelEconomyUnit,
): number | null {
  if (!(l100 > 0)) return null;
  if (unit === 'L/100km') return l100;
  if (unit === 'km/L') return 100 / l100;
  if (unit === 'mpgUS') return 235.214583 / l100;
  return 282.480936 / l100;
}

export function convertFuelVolume(
  value: number,
  from: FuelVolumeUnit,
  to: FuelVolumeUnit,
): number {
  const toL: Record<FuelVolumeUnit, number> = {
    L: 1,
    mL: 0.001,
    galUS: LITERS_PER_US_GAL,
    galUK: LITERS_PER_IMP_GAL,
  };
  return (value * toL[from]) / toL[to];
}

export function toLiters(value: number, unit: FuelVolumeUnit): number {
  return convertFuelVolume(value, unit, 'L');
}

export function fromLiters(liters: number, unit: FuelVolumeUnit): number {
  return convertFuelVolume(liters, 'L', unit);
}

/** Price per liter in the selected currency. */
export function toPricePerLiter(
  price: number,
  unit: FuelPriceUnit,
): number | null {
  if (!(price >= 0) || !Number.isFinite(price)) return null;
  if (unit === 'perL') return price;
  if (unit === 'perGalUS') return price / LITERS_PER_US_GAL;
  return price / LITERS_PER_IMP_GAL;
}

export function calculateRoundTripDistance(
  oneWayKm: number,
  roundTrip: boolean,
): number {
  return roundTrip ? oneWayKm * 2 : oneWayKm;
}

export function calculateFuelUsed(
  distanceKm: number,
  economyLPer100Km: number,
): number | null {
  if (
    ![distanceKm, economyLPer100Km].every(Number.isFinite) ||
    distanceKm < 0 ||
    !(economyLPer100Km > 0)
  ) {
    return null;
  }
  return (distanceKm * economyLPer100Km) / 100;
}

export function calculateFuelCost(
  fuelUsedLiters: number,
  pricePerLiter: number,
): number | null {
  if (
    ![fuelUsedLiters, pricePerLiter].every(Number.isFinite) ||
    fuelUsedLiters < 0 ||
    pricePerLiter < 0
  ) {
    return null;
  }
  return fuelUsedLiters * pricePerLiter;
}

export function calculateTotalTripCost(
  fuelCost: number,
  additionalExpenses: number,
): number {
  return fuelCost + additionalExpenses;
}

export function calculateCostPerPerson(
  totalTripCost: number,
  numberOfPeople: number,
): number | null {
  if (
    ![totalTripCost, numberOfPeople].every(Number.isFinite) ||
    !(numberOfPeople > 0)
  ) {
    return null;
  }
  return totalTripCost / numberOfPeople;
}

export function calculatePassengerContribution(
  totalTripCost: number,
  numberOfPeople: number,
  paymentMethod: 'equalSplit' | 'driverFree' | 'customDriverContribution',
  driverContribution: number | null,
): { passengerContribution: number; driverPays: number } | null {
  if (!(numberOfPeople >= 1) || !Number.isFinite(totalTripCost)) return null;

  if (paymentMethod === 'equalSplit' || numberOfPeople === 1) {
    const each = totalTripCost / numberOfPeople;
    return { passengerContribution: each, driverPays: each };
  }

  if (paymentMethod === 'driverFree') {
    if (numberOfPeople < 2) return null;
    const each = totalTripCost / (numberOfPeople - 1);
    return { passengerContribution: each, driverPays: 0 };
  }

  // customDriverContribution
  if (driverContribution == null || driverContribution < 0) return null;
  if (numberOfPeople < 2) return null;
  if (driverContribution > totalTripCost) return null;
  const remaining = totalTripCost - driverContribution;
  return {
    passengerContribution: remaining / (numberOfPeople - 1),
    driverPays: driverContribution,
  };
}

export function calculateDriverReimbursement(
  totalTripCost: number,
  driverPays: number,
): number {
  return Math.max(0, totalTripCost - driverPays);
}

export function calculateCarpoolingSavings(
  separateTravelCost: number,
  sharedTravelCost: number,
): number {
  return separateTravelCost - sharedTravelCost;
}

export function calculateSavingsPercentage(
  totalSavings: number,
  separateTravelCost: number,
): number | null {
  if (!(separateTravelCost > 0)) return null;
  return (totalSavings / separateTravelCost) * 100;
}

export function generateOccupancyChartData(
  totalTripCost: number,
  maxPeople = 6,
): OccupancyChartPoint[] {
  if (!(totalTripCost >= 0)) return [];
  const points: OccupancyChartPoint[] = [];
  for (let n = 1; n <= maxPeople; n++) {
    points.push({ people: n, costPerPerson: totalTripCost / n });
  }
  return points;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function parsePositiveInt(raw: string): number | null {
  const n = parseNum(raw);
  if (n == null || !Number.isInteger(n) || n < 1) return null;
  return n;
}

export function calculateCarpoolingFromInput(
  input: CarpoolingInput,
): CarpoolingResult | null {
  const people = parsePositiveInt(input.numberOfPeople);
  if (people == null) return null;

  const distRaw = parseNum(input.distance);
  if (distRaw == null || distRaw < 0) return null;
  const oneWayKm = toKm(distRaw, input.distanceUnit);
  const totalKm = calculateRoundTripDistance(oneWayKm, input.roundTrip);

  let economyL100: number | null = null;
  let fuelL: number | null = null;

  if (input.useFuelUsedOverride) {
    const fu = parseNum(input.fuelUsedOverride);
    if (fu == null || fu < 0) return null;
    fuelL = toLiters(fu, input.fuelUsedUnit);
    const ecoRaw = parseNum(input.fuelEconomy);
    if (ecoRaw != null && ecoRaw > 0) {
      economyL100 = toLPer100Km(ecoRaw, input.fuelEconomyUnit);
    } else if (totalKm > 0 && fuelL >= 0) {
      economyL100 = (fuelL * 100) / totalKm;
    } else {
      return null;
    }
  } else {
    const ecoRaw = parseNum(input.fuelEconomy);
    if (ecoRaw == null || !(ecoRaw > 0)) return null;
    economyL100 = toLPer100Km(ecoRaw, input.fuelEconomyUnit);
    if (economyL100 == null || !(economyL100 > 0)) return null;
    fuelL = calculateFuelUsed(totalKm, economyL100);
  }

  if (fuelL == null || economyL100 == null || !(economyL100 > 0)) return null;

  const priceRaw = parseNum(input.fuelPrice);
  if (priceRaw == null || priceRaw < 0) return null;
  const pricePerL = toPricePerLiter(priceRaw, input.fuelPriceUnit);
  if (pricePerL == null) return null;

  const fuelCost = calculateFuelCost(fuelL, pricePerL);
  if (fuelCost == null) return null;

  const tolls = parseNum(input.tolls) ?? 0;
  const parking = parseNum(input.parking) ?? 0;
  const other = parseNum(input.otherExpenses) ?? 0;
  if (tolls < 0 || parking < 0 || other < 0) return null;
  const additional = tolls + parking + other;
  const total = calculateTotalTripCost(fuelCost, additional);

  let driverContribution: number | null = null;
  if (input.paymentMethod === 'customDriverContribution') {
    driverContribution = parseNum(input.driverContribution);
    if (driverContribution == null || driverContribution < 0) return null;
  }

  const split = calculatePassengerContribution(
    total,
    people,
    input.paymentMethod,
    driverContribution,
  );
  if (!split) return null;

  const reimbursement = calculateDriverReimbursement(total, split.driverPays);
  const costPerPerson = calculateCostPerPerson(total, people);
  if (costPerPerson == null) return null;

  let separateTravelCost: number | null = null;
  let sharedTravelCost: number | null = null;
  let totalSavings: number | null = null;
  let savingsPercentage: number | null = null;

  if (input.enableSavings) {
    const soloEcoRaw =
      parseNum(input.soloFuelEconomy) ?? parseNum(input.fuelEconomy);
    if (soloEcoRaw == null || !(soloEcoRaw > 0)) return null;
    const soloUnit =
      parseNum(input.soloFuelEconomy) != null
        ? input.soloFuelEconomyUnit
        : input.fuelEconomyUnit;
    const soloL100 = toLPer100Km(soloEcoRaw, soloUnit);
    if (soloL100 == null) return null;
    const soloFuel = calculateFuelUsed(totalKm, soloL100);
    if (soloFuel == null) return null;
    const soloFuelCost = calculateFuelCost(soloFuel, pricePerL);
    if (soloFuelCost == null) return null;
    // Comparison: N separate vehicles each paying solo fuel + same optional extras
    // (scenario assumption — labeled as comparison, not a guarantee).
    const soloTrip = soloFuelCost + additional;
    separateTravelCost = people * soloTrip;
    sharedTravelCost = total;
    totalSavings = calculateCarpoolingSavings(
      separateTravelCost,
      sharedTravelCost,
    );
    savingsPercentage = calculateSavingsPercentage(
      totalSavings,
      separateTravelCost,
    );
  }

  const money = (n: number) => formatCurrencyValue(n, input.currency);
  const steps: string[] = [];
  steps.push(
    `One-way distance = ${fmt(oneWayKm)} km${input.roundTrip ? ' (×2 round trip)' : ''}`,
  );
  steps.push(`Total distance = ${fmt(totalKm)} km`);
  steps.push(`Fuel economy = ${fmt(economyL100)} L/100 km`);
  steps.push('Fuel used = Distance × Economy / 100');
  steps.push(
    `Fuel used = ${fmt(totalKm)} × ${fmt(economyL100)} / 100 = ${fmt(fuelL)} L`,
  );
  steps.push(`Fuel cost = ${fmt(fuelL)} × ${money(pricePerL)}/L = ${money(fuelCost)}`);
  if (additional > 0) {
    steps.push(
      `Additional expenses = ${money(tolls)} + ${money(parking)} + ${money(other)} = ${money(additional)}`,
    );
  }
  steps.push(
    `Total trip cost = ${money(fuelCost)} + ${money(additional)} = ${money(total)}`,
  );
  steps.push(
    `Cost per person = ${money(total)} / ${people} = ${money(costPerPerson)}`,
  );
  if (input.paymentMethod === 'driverFree' && people > 1) {
    steps.push(
      `Passenger contribution (driver free) = ${money(total)} / ${people - 1} = ${money(split.passengerContribution)}`,
    );
  }
  steps.push(
    `Driver reimbursement from passengers = ${money(reimbursement)}`,
  );

  const expenseBreakdown: ExpenseBreakdownPoint[] = [
    { label: 'Fuel', amount: fuelCost },
    { label: 'Tolls', amount: tolls },
    { label: 'Parking', amount: parking },
    { label: 'Other', amount: other },
  ].filter((p) => p.amount > 0 || p.label === 'Fuel');

  return {
    oneWayDistanceKm: oneWayKm,
    totalDistanceKm: totalKm,
    fuelEconomyLPer100Km: economyL100,
    fuelUsedLiters: fuelL,
    fuelCost,
    additionalExpenses: additional,
    totalTripCost: total,
    numberOfPeople: people,
    costPerPerson,
    passengerContribution: split.passengerContribution,
    driverPays: split.driverPays,
    driverReimbursement: reimbursement,
    separateTravelCost,
    sharedTravelCost,
    totalSavings,
    savingsPercentage,
    occupancyChart: generateOccupancyChartData(total),
    expenseBreakdown,
    formulaSteps: steps,
    interpretation:
      people === 1
        ? 'Solo traveler: cost per person equals the full trip cost; carpooling savings versus sharing are zero.'
        : 'Estimates direct trip costs (fuel + optional fees), not full vehicle ownership. Savings comparison assumes each traveler would otherwise drive separately — customize solo economy when enabling that scenario.',
    formattedPrimary: money(costPerPerson),
    primaryLabel: 'Cost per Person',
    currency: input.currency,
  };
}

export { fmt };
