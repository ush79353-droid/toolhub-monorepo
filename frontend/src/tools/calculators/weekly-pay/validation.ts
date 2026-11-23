import {
  calculateWeeklyPay,
  MAX_DAYS_PER_WEEK,
  MAX_WEEKS_PER_YEAR,
  toWeeklyPayResult,
} from './calculation';
import type {
  PaySource,
  ScheduleDriver,
  WeeklyPayFieldErrors,
  WeeklyPayInput,
  WeeklyPayResult,
} from './types';

function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return value;
}

function sourceAmount(input: WeeklyPayInput): { value: number | null; errorKey: PaySource } {
  switch (input.source) {
    case 'hourly':
      return { value: parseNumber(input.hourly), errorKey: 'hourly' };
    case 'daily':
      return { value: parseNumber(input.daily), errorKey: 'daily' };
    case 'weekly':
      return { value: parseNumber(input.weekly), errorKey: 'weekly' };
    case 'monthly':
      return { value: parseNumber(input.monthly), errorKey: 'monthly' };
    case 'annual':
      return { value: parseNumber(input.annual), errorKey: 'annual' };
  }
}

/** Reconcile hours/day, days/week, hours/week from the schedule driver. */
export function reconcileSchedule(input: WeeklyPayInput): {
  hoursPerDay: number | null;
  daysPerWeek: number | null;
  hoursPerWeek: number | null;
  errors: WeeklyPayFieldErrors;
} {
  const errors: WeeklyPayFieldErrors = {};
  let hoursPerDay = parseNumber(input.hoursPerDay);
  const daysPerWeek = parseNumber(input.daysPerWeek);
  let hoursPerWeek = parseNumber(input.hoursPerWeek);
  const driver: ScheduleDriver = input.scheduleDriver;

  if (driver === 'hoursPerWeek') {
    if (hoursPerWeek === null) errors.hoursPerWeek = 'Enter hours per week.';
    else if (!(hoursPerWeek > 0)) errors.hoursPerWeek = 'Hours per week must be greater than zero.';
    if (daysPerWeek === null) errors.daysPerWeek = 'Enter days per week.';
    else if (!(daysPerWeek > 0) || daysPerWeek > MAX_DAYS_PER_WEEK) {
      errors.daysPerWeek = `Days per week must be greater than 0 and at most ${MAX_DAYS_PER_WEEK}.`;
    }
    if (!errors.hoursPerWeek && !errors.daysPerWeek && daysPerWeek! > 0) {
      hoursPerDay = hoursPerWeek! / daysPerWeek!;
    }
  } else {
    if (hoursPerDay === null) errors.hoursPerDay = 'Enter hours per day.';
    else if (!(hoursPerDay > 0)) errors.hoursPerDay = 'Hours per day must be greater than zero.';
    if (daysPerWeek === null) errors.daysPerWeek = 'Enter days per week.';
    else if (!(daysPerWeek > 0) || daysPerWeek > MAX_DAYS_PER_WEEK) {
      errors.daysPerWeek = `Days per week must be greater than 0 and at most ${MAX_DAYS_PER_WEEK}.`;
    }
    if (!errors.hoursPerDay && !errors.daysPerWeek) {
      hoursPerWeek = hoursPerDay! * daysPerWeek!;
    }
  }

  return { hoursPerDay, daysPerWeek, hoursPerWeek, errors };
}

export function validateWeeklyPayInput(input: WeeklyPayInput): {
  isValid: boolean;
  errors: WeeklyPayFieldErrors;
  result: WeeklyPayResult | null;
} {
  const schedule = reconcileSchedule(input);
  const errors: WeeklyPayFieldErrors = { ...schedule.errors };

  const unpaid = parseNumber(input.unpaidWeeksOff);
  const paidWeeks = parseNumber(input.paidWeeksPerYear);

  if (unpaid === null) {
    errors.unpaidWeeksOff = 'Enter unpaid weeks off (use 0 if none).';
  } else if (unpaid < 0 || unpaid >= MAX_WEEKS_PER_YEAR) {
    errors.unpaidWeeksOff = `Unpaid weeks off must be from 0 to ${MAX_WEEKS_PER_YEAR - 1}.`;
  }

  if (paidWeeks === null) {
    errors.paidWeeksPerYear = 'Enter paid weeks per year.';
  } else if (!(paidWeeks > 0) || paidWeeks > MAX_WEEKS_PER_YEAR) {
    errors.paidWeeksPerYear = `Paid weeks per year must be greater than 0 and at most ${MAX_WEEKS_PER_YEAR}.`;
  }

  if (
    unpaid !== null &&
    paidWeeks !== null &&
    !errors.unpaidWeeksOff &&
    !errors.paidWeeksPerYear &&
    Math.abs(paidWeeks + unpaid - MAX_WEEKS_PER_YEAR) > 1e-9
  ) {
    errors.paidWeeksPerYear = 'Paid weeks + unpaid weeks must equal 52.';
  }

  const { value: amount, errorKey } = sourceAmount(input);
  if (amount === null) {
    errors[errorKey] = 'Enter a pay amount.';
  } else if (amount < 0) {
    errors[errorKey] = 'Pay cannot be negative.';
  }

  if (
    Object.keys(errors).length > 0 ||
    schedule.hoursPerDay === null ||
    schedule.daysPerWeek === null ||
    paidWeeks === null ||
    unpaid === null ||
    amount === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const breakdown = calculateWeeklyPay(input.source, amount, {
    hoursPerDay: schedule.hoursPerDay,
    daysPerWeek: schedule.daysPerWeek,
    paidWeeksPerYear: paidWeeks,
  });

  if (!breakdown) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate weekly pay with the current inputs.' },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: toWeeklyPayResult(
      breakdown,
      input.source,
      {
        hoursPerDay: schedule.hoursPerDay,
        daysPerWeek: schedule.daysPerWeek,
        paidWeeksPerYear: paidWeeks,
      },
      unpaid,
      input.currency,
    ),
  };
}
