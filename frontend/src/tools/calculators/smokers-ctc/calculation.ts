import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { SmokersCtcInput, SmokersCtcResult, WagePeriod } from './types';

/** One cigarette per smoke break (Omni / reference assumption). */
export const CIGARETTES_PER_BREAK = 1;

/**
 * Commonly cited heuristic minutes of life lost per cigarette.
 * Illustrative only — not a medical estimate or individual prediction.
 */
export const LIFE_MINUTES_PER_CIGARETTE = 11;

const MINUTES_PER_DAY = 24 * 60;
const WEEKS_PER_YEAR = 52;

export function workdaysPerYear(daysPerWeek: number, holidayDays: number): number {
  if (!Number.isFinite(daysPerWeek) || !Number.isFinite(holidayDays)) return Number.NaN;
  if (daysPerWeek < 0 || holidayDays < 0) return Number.NaN;
  return Math.max(0, daysPerWeek * WEEKS_PER_YEAR - holidayDays);
}

/**
 * Convert entered wage to an hourly rate using work-day settings.
 * Monthly/yearly use workdays after holiday deduction.
 */
export function toHourlyWage(
  wage: number,
  period: WagePeriod,
  hoursPerDay: number,
  daysPerWeek: number,
  holidayDays: number
): number | null {
  if (!Number.isFinite(wage) || wage < 0) return null;
  if (!Number.isFinite(hoursPerDay) || hoursPerDay <= 0) return null;
  if (!Number.isFinite(daysPerWeek) || daysPerWeek <= 0) return null;

  switch (period) {
    case 'hourly':
      return wage;
    case 'daily':
      return wage / hoursPerDay;
    case 'weekly': {
      const weeklyHours = hoursPerDay * daysPerWeek;
      return weeklyHours > 0 ? wage / weeklyHours : null;
    }
    case 'monthly': {
      const days = workdaysPerYear(daysPerWeek, holidayDays);
      if (!Number.isFinite(days) || days <= 0) return null;
      const monthlyHours = (hoursPerDay * days) / 12;
      return monthlyHours > 0 ? wage / monthlyHours : null;
    }
    case 'yearly': {
      const days = workdaysPerYear(daysPerWeek, holidayDays);
      if (!Number.isFinite(days) || days <= 0) return null;
      const yearlyHours = hoursPerDay * days;
      return yearlyHours > 0 ? wage / yearlyHours : null;
    }
    default:
      return null;
  }
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Compact duration for smoking-time outputs (minutes under 60, else hours). */
export function formatDurationMinutes(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return '';
  if (totalMinutes < 60) {
    const rounded = Math.round(totalMinutes * 1000) / 1000;
    return `${formatPlain(rounded)} min`;
  }
  const hours = totalMinutes / 60;
  const rounded = Math.round(hours * 1000) / 1000;
  return `${formatPlain(rounded)} hrs`;
}

function formatPlain(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
  }).format(value);
}

export function formatLifeDays(days: number): string {
  if (!Number.isFinite(days) || days < 0) return '';
  const rounded = Math.round(days * 1000) / 1000;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(rounded);
}

/**
 * Daily smoking minutes = break minutes × breaks/day
 * Daily labor = (daily minutes / 60) × hourly wage
 * Weekly labor = daily labor × days/week
 * Yearly labor = daily labor × workdays/year (days/week × 52 − holidays)
 * Monthly labor = yearly labor / 12
 * Cigarette spend assumes one cigarette per break.
 * Life expectancy days = breaks × (days/week × 52) × 11 ÷ 1440
 * (holiday days do not reduce the life line — matches reference 5.958 default).
 */
export function buildSmokersCtcResult(input: SmokersCtcInput): SmokersCtcResult {
  const currency = input.currency;
  const blankMoney = (): SmokersCtcResult => ({
    dailySmokingMinutes: Number.NaN,
    weeklySmokingMinutes: Number.NaN,
    monthlySmokingMinutes: Number.NaN,
    yearlySmokingMinutes: Number.NaN,
    dailyLaborCost: null,
    weeklyLaborCost: null,
    monthlyLaborCost: null,
    yearlyLaborCost: null,
    weeklyCigaretteCost: null,
    yearlyCigaretteCost: null,
    lifeExpectancyDays: null,
    workdaysPerYear: Number.NaN,
    hourlyWage: null,
    currency,
    dailySmokingDisplay: '',
    weeklySmokingDisplay: '',
    monthlySmokingDisplay: '',
    yearlySmokingDisplay: '',
    dailyLaborDisplay: '',
    weeklyLaborDisplay: '',
    monthlyLaborDisplay: '',
    yearlyLaborDisplay: '',
    weeklyCigaretteDisplay: '',
    yearlyCigaretteDisplay: '',
    lifeExpectancyDisplay: '',
  });

  const { breakMinutes, breaksPerDay, hoursPerDay, daysPerWeek, holidayDays } = input;

  if (
    !Number.isFinite(breakMinutes) ||
    breakMinutes < 0 ||
    !Number.isFinite(breaksPerDay) ||
    breaksPerDay < 0 ||
    !Number.isFinite(hoursPerDay) ||
    hoursPerDay <= 0 ||
    !Number.isFinite(daysPerWeek) ||
    daysPerWeek < 0 ||
    !Number.isFinite(holidayDays) ||
    holidayDays < 0
  ) {
    return blankMoney();
  }

  const daysYear = workdaysPerYear(daysPerWeek, holidayDays);
  if (!Number.isFinite(daysYear)) return blankMoney();

  const dailySmokingMinutes = breakMinutes * breaksPerDay;
  const weeklySmokingMinutes = dailySmokingMinutes * daysPerWeek;
  const yearlySmokingMinutes = dailySmokingMinutes * daysYear;
  const monthlySmokingMinutes = yearlySmokingMinutes / 12;

  const hourlyWage = toHourlyWage(
    input.wage,
    input.wagePeriod,
    hoursPerDay,
    daysPerWeek,
    holidayDays
  );

  let dailyLaborCost: number | null = null;
  let weeklyLaborCost: number | null = null;
  let monthlyLaborCost: number | null = null;
  let yearlyLaborCost: number | null = null;

  if (hourlyWage !== null && Number.isFinite(hourlyWage)) {
    const dailyHours = dailySmokingMinutes / 60;
    dailyLaborCost = dailyHours * hourlyWage;
    weeklyLaborCost = dailyLaborCost * daysPerWeek;
    yearlyLaborCost = dailyLaborCost * daysYear;
    monthlyLaborCost = yearlyLaborCost / 12;
    if (!Number.isFinite(dailyLaborCost)) dailyLaborCost = null;
    if (!Number.isFinite(weeklyLaborCost)) weeklyLaborCost = null;
    if (!Number.isFinite(monthlyLaborCost)) monthlyLaborCost = null;
    if (!Number.isFinite(yearlyLaborCost)) yearlyLaborCost = null;
  }

  let weeklyCigaretteCost: number | null = null;
  let yearlyCigaretteCost: number | null = null;

  if (
    Number.isFinite(input.packPrice) &&
    input.packPrice >= 0 &&
    Number.isFinite(input.cigarettesPerPack) &&
    input.cigarettesPerPack > 0
  ) {
    const costPerCigarette = input.packPrice / input.cigarettesPerPack;
    const dailyCigs = breaksPerDay * CIGARETTES_PER_BREAK;
    weeklyCigaretteCost = dailyCigs * daysPerWeek * costPerCigarette;
    yearlyCigaretteCost = dailyCigs * daysYear * costPerCigarette;
    if (!Number.isFinite(weeklyCigaretteCost)) weeklyCigaretteCost = null;
    if (!Number.isFinite(yearlyCigaretteCost)) yearlyCigaretteCost = null;
  }

  // Life line uses scheduled work pattern before holidays (matches reference 5.958).
  const scheduledWorkdays = daysPerWeek * WEEKS_PER_YEAR;
  const lifeMinutes =
    breaksPerDay * CIGARETTES_PER_BREAK * scheduledWorkdays * LIFE_MINUTES_PER_CIGARETTE;
  const lifeExpectancyDays =
    Number.isFinite(lifeMinutes) && lifeMinutes >= 0 ? lifeMinutes / MINUTES_PER_DAY : null;

  return {
    dailySmokingMinutes,
    weeklySmokingMinutes,
    monthlySmokingMinutes,
    yearlySmokingMinutes,
    dailyLaborCost,
    weeklyLaborCost,
    monthlyLaborCost,
    yearlyLaborCost,
    weeklyCigaretteCost,
    yearlyCigaretteCost,
    lifeExpectancyDays,
    workdaysPerYear: daysYear,
    hourlyWage,
    currency,
    dailySmokingDisplay: formatDurationMinutes(dailySmokingMinutes),
    weeklySmokingDisplay: formatDurationMinutes(weeklySmokingMinutes),
    monthlySmokingDisplay: formatDurationMinutes(monthlySmokingMinutes),
    yearlySmokingDisplay: formatDurationMinutes(yearlySmokingMinutes),
    dailyLaborDisplay: dailyLaborCost === null ? '' : formatMoney(dailyLaborCost, currency),
    weeklyLaborDisplay: weeklyLaborCost === null ? '' : formatMoney(weeklyLaborCost, currency),
    monthlyLaborDisplay: monthlyLaborCost === null ? '' : formatMoney(monthlyLaborCost, currency),
    yearlyLaborDisplay: yearlyLaborCost === null ? '' : formatMoney(yearlyLaborCost, currency),
    weeklyCigaretteDisplay:
      weeklyCigaretteCost === null ? '' : formatMoney(weeklyCigaretteCost, currency),
    yearlyCigaretteDisplay:
      yearlyCigaretteCost === null ? '' : formatMoney(yearlyCigaretteCost, currency),
    lifeExpectancyDisplay:
      lifeExpectancyDays === null ? '' : formatLifeDays(lifeExpectancyDays),
  };
}
