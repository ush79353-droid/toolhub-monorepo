/**
 * Commute cost engine — canonical: km, L/100km, money in selected currency.
 * Monthly is the internal period for comparisons; weekly×52 / monthly×12 annualize.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  CheaperOption,
  CommuteFrequency,
  CommuteInput,
  CommuteResult,
  CostBreakdownPoint,
  DistanceUnit,
  FuelEconomyUnit,
  FuelPriceUnit,
  OccupancyPoint,
  ParkingFrequency,
  PeriodCosts,
  TicketMode,
  TicketValidityUnit,
  WearFrequency,
} from './types';

export const KM_PER_MILE = 1.609344;
export const LITERS_PER_US_GAL = 3.785411784;
export const LITERS_PER_IMP_GAL = 4.54609;
export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;
/** Approximate for normalizing weekly ↔ monthly when needed. */
export const WEEKS_PER_MONTH = WEEKS_PER_YEAR / MONTHS_PER_YEAR;

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

export function toPricePerLiter(
  price: number,
  unit: FuelPriceUnit,
): number | null {
  if (!(price >= 0) || !Number.isFinite(price)) return null;
  if (unit === 'perL') return price;
  if (unit === 'perGalUS') return price / LITERS_PER_US_GAL;
  return price / LITERS_PER_IMP_GAL;
}

export function calculateRoundTripDistance(oneWayKm: number): number {
  return oneWayKm * 2;
}

/** Normalize commute-day count to monthly and yearly. */
export function normalizeCommuteDays(
  count: number,
  frequency: CommuteFrequency,
): { perMonth: number; perYear: number; perWeek: number } | null {
  if (!(count > 0) || !Number.isFinite(count)) return null;
  if (frequency === 'weekly') {
    return {
      perWeek: count,
      perMonth: count * WEEKS_PER_MONTH,
      perYear: count * WEEKS_PER_YEAR,
    };
  }
  if (frequency === 'monthly') {
    return {
      perWeek: count / WEEKS_PER_MONTH,
      perMonth: count,
      perYear: count * MONTHS_PER_YEAR,
    };
  }
  return {
    perWeek: count / WEEKS_PER_YEAR,
    perMonth: count / MONTHS_PER_YEAR,
    perYear: count,
  };
}

export function calculateCommuteDistance(
  roundTripKm: number,
  days: number,
): number {
  return roundTripKm * days;
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
  fuelLiters: number,
  pricePerLiter: number,
): number | null {
  if (
    ![fuelLiters, pricePerLiter].every(Number.isFinite) ||
    fuelLiters < 0 ||
    pricePerLiter < 0
  ) {
    return null;
  }
  return fuelLiters * pricePerLiter;
}

/** Normalize a parking/toll amount into monthly cost. */
export function calculateParkingAndTolls(
  amount: number,
  frequency: ParkingFrequency,
  days: { perMonth: number; perYear: number; perWeek: number },
): number | null {
  if (!(amount >= 0) || !Number.isFinite(amount)) return null;
  switch (frequency) {
    case 'perOneWay':
      return amount * 2 * days.perMonth;
    case 'perCommuteDay':
      return amount * days.perMonth;
    case 'perWeek':
      return amount * WEEKS_PER_MONTH;
    case 'perMonth':
      return amount;
    case 'perYear':
      return amount / MONTHS_PER_YEAR;
  }
}

export function calculateWearAndTear(
  amount: number,
  frequency: WearFrequency,
  monthlyDistanceKm: number,
  days: { perMonth: number },
): number | null {
  if (!(amount >= 0) || !Number.isFinite(amount)) return null;
  switch (frequency) {
    case 'perKm':
      return amount * monthlyDistanceKm;
    case 'perMile':
      return amount * (monthlyDistanceKm / KM_PER_MILE);
    case 'perCommuteDay':
      return amount * days.perMonth;
    case 'perMonth':
      return amount;
    case 'perYear':
      return amount / MONTHS_PER_YEAR;
  }
}

export function calculateTotalCarCost(
  fuel: number,
  parking: number,
  wear: number,
): number {
  return fuel + parking + wear;
}

export function calculateCostPerPerson(
  total: number,
  people: number,
): number | null {
  if (!(people > 0) || !Number.isFinite(total)) return null;
  return total / people;
}

export function periodFromMonthly(
  monthly: number,
  daysPerMonth: number,
): PeriodCosts {
  const daily = daysPerMonth > 0 ? monthly / daysPerMonth : 0;
  return {
    daily,
    weekly: monthly / WEEKS_PER_MONTH,
    monthly,
    yearly: monthly * MONTHS_PER_YEAR,
  };
}

function validityToDays(
  value: number,
  unit: TicketValidityUnit,
): number | null {
  if (!(value > 0)) return null;
  switch (unit) {
    case 'hours':
      return value / 24;
    case 'days':
      return value;
    case 'weeks':
      return value * 7;
    case 'months':
      return value * (365.25 / 12);
    case 'years':
      return value * 365.25;
  }
}

/**
 * Monthly public-transport cost.
 * Time-based: ceiling of calendar coverage days / validity days.
 * Coverage for monthly estimate ≈ days in average month (365.25/12).
 */
export function calculatePublicTransportCost(
  mode: TicketMode,
  ticketPrice: number,
  daysPerMonth: number,
  paidRidesPerDay: number,
  validityValue: number | null,
  validityUnit: TicketValidityUnit,
): { monthly: number; passesMonthly: number | null } | null {
  if (!(ticketPrice >= 0) || !Number.isFinite(ticketPrice)) return null;
  if (!(daysPerMonth > 0)) return null;

  if (mode === 'perRide') {
    if (!(paidRidesPerDay > 0)) return null;
    return {
      monthly: ticketPrice * paidRidesPerDay * daysPerMonth,
      passesMonthly: paidRidesPerDay * daysPerMonth,
    };
  }

  if (mode === 'perCommuteDay') {
    return {
      monthly: ticketPrice * daysPerMonth,
      passesMonthly: daysPerMonth,
    };
  }

  // timeBasedPass — calendar coverage for one month ≈ 30.4375 days
  if (validityValue == null || !(validityValue > 0)) return null;
  const validityDays = validityToDays(validityValue, validityUnit);
  if (validityDays == null || !(validityDays > 0)) return null;
  const coverageDays = 365.25 / 12;
  const passes = Math.ceil(coverageDays / validityDays);
  return {
    monthly: passes * ticketPrice,
    passesMonthly: passes,
  };
}

export function compareCommuteCosts(
  carPerPerson: number | null,
  transit: number | null,
): {
  savings: number | null;
  pct: number | null;
  cheaper: CheaperOption;
  note: string;
} {
  if (carPerPerson == null || transit == null) {
    return {
      savings: null,
      pct: null,
      cheaper: 'undetermined',
      note: 'Enter both car and public transport inputs to compare.',
    };
  }
  const savings = carPerPerson - transit;
  const pct =
    carPerPerson > 0 ? (savings / carPerPerson) * 100 : null;
  if (Math.abs(savings) < 1e-9) {
    return {
      savings: 0,
      pct: 0,
      cheaper: 'equal',
      note: 'Both commuting options have the same estimated cost.',
    };
  }
  if (savings > 0) {
    return {
      savings,
      pct,
      cheaper: 'publicTransport',
      note: 'Public transportation is cheaper for your personal share under these inputs.',
    };
  }
  return {
    savings,
    pct,
    cheaper: 'car',
    note: 'Commuting by car (your share) is cheaper under these inputs.',
  };
}

export function generateOccupancyChart(
  monthlyTotal: number,
  maxPeople = 6,
): OccupancyPoint[] {
  if (!(monthlyTotal >= 0)) return [];
  const pts: OccupancyPoint[] = [];
  for (let n = 1; n <= maxPeople; n++) {
    pts.push({ people: n, costPerPerson: monthlyTotal / n });
  }
  return pts;
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

export function calculateCommuteFromInput(
  input: CommuteInput,
): CommuteResult | null {
  const oneWayRaw = parseNum(input.oneWayDistance);
  if (oneWayRaw == null || !(oneWayRaw > 0)) return null;
  const oneWayKm = toKm(oneWayRaw, input.distanceUnit);
  const roundTripKm = calculateRoundTripDistance(oneWayKm);

  const count = parseNum(input.commuteCount);
  if (count == null || !(count > 0)) return null;
  const days = normalizeCommuteDays(count, input.commuteFrequency);
  if (!days) return null;

  const monthlyDistanceKm = calculateCommuteDistance(
    roundTripKm,
    days.perMonth,
  );
  const yearlyDistanceKm = calculateCommuteDistance(
    roundTripKm,
    days.perYear,
  );

  const people = parsePositiveInt(input.peopleSharingRide) ?? 1;

  let monthlyFuelUsed: number | null = null;
  let monthlyFuelCost: number | null = null;
  let monthlyParking = 0;
  let monthlyWear = 0;
  let monthlyTotalCar: number | null = null;
  let monthlyCarPerPerson: number | null = null;
  let carPeriod: PeriodCosts | null = null;
  let carPerPersonPeriod: PeriodCosts | null = null;
  let occupancyChart: OccupancyPoint[] = [];
  let carBreakdown: CostBreakdownPoint[] = [];

  const steps: string[] = [];
  const money = (n: number) => formatCurrencyValue(n, input.currency);

  steps.push(`One-way = ${fmt(oneWayKm)} km`);
  steps.push(`Round trip = ${fmt(roundTripKm)} km`);
  steps.push(
    `Commute days ≈ ${fmt(days.perMonth, 2)}/month · ${fmt(days.perYear, 1)}/year`,
  );
  steps.push(
    `Monthly distance = ${fmt(roundTripKm)} × ${fmt(days.perMonth, 2)} = ${fmt(monthlyDistanceKm)} km`,
  );

  if (input.showCar) {
    const ecoRaw = parseNum(input.fuelEconomy);
    const priceRaw = parseNum(input.fuelPrice);
    const parkingRaw = parseNum(input.parkingAndTolls) ?? 0;
    const wearRaw = parseNum(input.wearAndTear) ?? 0;

    if (ecoRaw != null && ecoRaw > 0 && priceRaw != null && priceRaw >= 0) {
      const eco = toLPer100Km(ecoRaw, input.fuelEconomyUnit);
      const ppl = toPricePerLiter(priceRaw, input.fuelPriceUnit);
      if (eco != null && ppl != null) {
        monthlyFuelUsed = calculateFuelUsed(monthlyDistanceKm, eco);
        if (monthlyFuelUsed != null) {
          monthlyFuelCost = calculateFuelCost(monthlyFuelUsed, ppl);
        }
      }
    }

    const park = calculateParkingAndTolls(
      parkingRaw,
      input.parkingFrequency,
      days,
    );
    const wear = calculateWearAndTear(
      wearRaw,
      input.wearFrequency,
      monthlyDistanceKm,
      days,
    );
    if (park != null) monthlyParking = park;
    if (wear != null) monthlyWear = wear;

    if (monthlyFuelCost != null) {
      monthlyTotalCar = calculateTotalCarCost(
        monthlyFuelCost,
        monthlyParking,
        monthlyWear,
      );
      monthlyCarPerPerson = calculateCostPerPerson(monthlyTotalCar, people);
      carPeriod = periodFromMonthly(monthlyTotalCar, days.perMonth);
      if (monthlyCarPerPerson != null) {
        carPerPersonPeriod = periodFromMonthly(
          monthlyCarPerPerson,
          days.perMonth,
        );
      }
      occupancyChart = generateOccupancyChart(monthlyTotalCar);
      carBreakdown = [
        { label: 'Fuel', amount: monthlyFuelCost },
        { label: 'Parking & tolls', amount: monthlyParking },
        { label: 'Wear & tear', amount: monthlyWear },
      ];

      steps.push(
        `Fuel used = ${fmt(monthlyDistanceKm)} × economy / 100 = ${fmt(monthlyFuelUsed ?? 0)} L`,
      );
      steps.push(`Fuel cost = ${money(monthlyFuelCost)}`);
      steps.push(`Parking & tolls = ${money(monthlyParking)}`);
      steps.push(`Wear & tear = ${money(monthlyWear)}`);
      steps.push(`Total car = ${money(monthlyTotalCar)}`);
      if (monthlyCarPerPerson != null) {
        steps.push(
          `Cost per person = ${money(monthlyTotalCar)} / ${people} = ${money(monthlyCarPerPerson)}`,
        );
      }
    }
  }

  let monthlyTransit: number | null = null;
  let transitPeriod: PeriodCosts | null = null;
  let passesMonthly: number | null = null;

  if (input.showTransit) {
    const ticketRaw = parseNum(input.ticketPrice);
    if (ticketRaw != null && ticketRaw >= 0) {
      const rides = parseNum(input.paidRidesPerDay) ?? 2;
      const validity = parseNum(input.ticketValidity);
      const pt = calculatePublicTransportCost(
        input.ticketMode,
        ticketRaw,
        days.perMonth,
        rides,
        validity,
        input.ticketValidityUnit,
      );
      if (pt) {
        monthlyTransit = pt.monthly;
        passesMonthly = pt.passesMonthly;
        transitPeriod = periodFromMonthly(monthlyTransit, days.perMonth);
        steps.push(`Public transport (monthly) = ${money(monthlyTransit)}`);
        if (passesMonthly != null) {
          steps.push(`Tickets/passes (monthly est.) = ${fmt(passesMonthly, 0)}`);
        }
      }
    }
  }

  const cmp = compareCommuteCosts(monthlyCarPerPerson, monthlyTransit);
  if (cmp.savings != null) {
    steps.push(`Monthly savings (car share − transit) = ${money(cmp.savings)}`);
  }

  let formattedPrimary = '';
  let primaryLabel = 'Commute Comparison';
  if (monthlyCarPerPerson != null && monthlyTransit != null) {
    formattedPrimary = money(Math.abs(cmp.savings ?? 0));
    primaryLabel =
      cmp.cheaper === 'publicTransport'
        ? 'Monthly savings with public transport'
        : cmp.cheaper === 'car'
          ? 'Monthly savings with car (your share)'
          : 'Monthly cost difference';
  } else if (monthlyCarPerPerson != null) {
    formattedPrimary = money(monthlyCarPerPerson);
    primaryLabel = 'Car cost per person / month';
  } else if (monthlyTransit != null) {
    formattedPrimary = money(monthlyTransit);
    primaryLabel = 'Public transport / month';
  } else {
    return null;
  }

  return {
    oneWayKm,
    roundTripKm,
    commuteDaysPerMonth: days.perMonth,
    commuteDaysPerYear: days.perYear,
    monthlyDistanceKm,
    yearlyDistanceKm,
    monthlyFuelUsedLiters: monthlyFuelUsed,
    monthlyFuelCost,
    monthlyParkingAndTolls: monthlyParking,
    monthlyWearAndTear: monthlyWear,
    monthlyTotalCarCost: monthlyTotalCar,
    monthlyCarCostPerPerson: monthlyCarPerPerson,
    carPeriod,
    carPerPersonPeriod,
    monthlyPublicTransportCost: monthlyTransit,
    transitPeriod,
    passesRequiredMonthly: passesMonthly,
    monthlySavings: cmp.savings,
    annualSavings:
      cmp.savings != null ? cmp.savings * MONTHS_PER_YEAR : null,
    savingsPercentage: cmp.pct,
    cheaperOption: cmp.cheaper,
    comparisonNote: cmp.note,
    occupancyChart,
    carBreakdown,
    formulaSteps: steps,
    interpretation: `${cmp.note} Annualization uses ×12 for monthly and ×52 for weekly commute-day rates. Time-based transit passes use calendar coverage (~30.4 days/month), not commute-day counts.`,
    formattedPrimary,
    primaryLabel,
    currency: input.currency,
  };
}

export { fmt };
