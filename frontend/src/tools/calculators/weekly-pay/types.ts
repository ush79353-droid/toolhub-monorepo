import type { SupportedCurrency } from '@/tools/shared/currency';

export type PaySource = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annual';

/** Which schedule field was last edited when reconciling hours/week. */
export type ScheduleDriver = 'hoursPerDay' | 'daysPerWeek' | 'hoursPerWeek';

export interface WeeklyPayInput {
  source: PaySource;
  hourly: string;
  daily: string;
  weekly: string;
  monthly: string;
  annual: string;
  hoursPerDay: string;
  daysPerWeek: string;
  hoursPerWeek: string;
  paidWeeksPerYear: string;
  unpaidWeeksOff: string;
  scheduleDriver: ScheduleDriver;
  scheduleOpen: boolean;
  examplesOpen: boolean;
  breakdownOpen: boolean;
  currency: SupportedCurrency;
}

export interface WeeklyPayResult {
  source: PaySource;
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  hoursPerDay: number;
  daysPerWeek: number;
  hoursPerWeek: number;
  paidWeeksPerYear: number;
  unpaidWeeksOff: number;
  averageWeeksPerMonth: number;
  annualPaidHours: number;
  currency: SupportedCurrency;
  formattedHourly: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedMonthly: string;
  formattedAnnual: string;
}

export type WeeklyPayFieldErrors = {
  hourly?: string;
  daily?: string;
  weekly?: string;
  monthly?: string;
  annual?: string;
  hoursPerDay?: string;
  daysPerWeek?: string;
  hoursPerWeek?: string;
  paidWeeksPerYear?: string;
  unpaidWeeksOff?: string;
  form?: string;
};

export function createDefaultInput(): WeeklyPayInput {
  return {
    source: 'hourly',
    hourly: '',
    daily: '',
    weekly: '',
    monthly: '',
    annual: '',
    hoursPerDay: '8',
    daysPerWeek: '5',
    hoursPerWeek: '40',
    paidWeeksPerYear: '52',
    unpaidWeeksOff: '0',
    scheduleDriver: 'hoursPerDay',
    scheduleOpen: true,
    examplesOpen: false,
    breakdownOpen: true,
    currency: 'USD',
  };
}

export function createHourlyExampleInput(): WeeklyPayInput {
  return {
    ...createDefaultInput(),
    source: 'hourly',
    hourly: '18',
    scheduleOpen: true,
    examplesOpen: true,
    breakdownOpen: true,
  };
}

export function createMonthlyExampleInput(): WeeklyPayInput {
  return {
    ...createDefaultInput(),
    source: 'monthly',
    monthly: '4000',
    scheduleOpen: true,
    examplesOpen: true,
    breakdownOpen: true,
  };
}
