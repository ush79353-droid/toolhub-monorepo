import type { SupportedCurrency } from '@/tools/shared/currency';

export type WagePeriod = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface SmokersCtcInput {
  breakMinutes: number;
  breaksPerDay: number;
  wagePeriod: WagePeriod;
  wage: number;
  hoursPerDay: number;
  daysPerWeek: number;
  holidayDays: number;
  packPrice: number;
  cigarettesPerPack: number;
  currency: SupportedCurrency;
}

export interface SmokersCtcResult {
  dailySmokingMinutes: number;
  weeklySmokingMinutes: number;
  monthlySmokingMinutes: number;
  yearlySmokingMinutes: number;
  dailyLaborCost: number | null;
  weeklyLaborCost: number | null;
  monthlyLaborCost: number | null;
  yearlyLaborCost: number | null;
  weeklyCigaretteCost: number | null;
  yearlyCigaretteCost: number | null;
  lifeExpectancyDays: number | null;
  workdaysPerYear: number;
  hourlyWage: number | null;
  currency: SupportedCurrency;
  dailySmokingDisplay: string;
  weeklySmokingDisplay: string;
  monthlySmokingDisplay: string;
  yearlySmokingDisplay: string;
  dailyLaborDisplay: string;
  weeklyLaborDisplay: string;
  monthlyLaborDisplay: string;
  yearlyLaborDisplay: string;
  weeklyCigaretteDisplay: string;
  yearlyCigaretteDisplay: string;
  lifeExpectancyDisplay: string;
}

export type SmokersCtcFieldErrors = Partial<
  Record<
    | 'breakMinutes'
    | 'breaksPerDay'
    | 'wage'
    | 'hoursPerDay'
    | 'daysPerWeek'
    | 'holidayDays'
    | 'packPrice'
    | 'cigarettesPerPack',
    string
  >
>;

export const WAGE_PERIOD_OPTIONS: readonly { value: WagePeriod; label: string }[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export function createDefaultInput(): SmokersCtcInput {
  return {
    breakMinutes: 15,
    breaksPerDay: 3,
    wagePeriod: 'hourly',
    wage: Number.NaN,
    hoursPerDay: 8,
    daysPerWeek: 5,
    holidayDays: 10,
    packPrice: Number.NaN,
    cigarettesPerPack: 20,
    currency: 'PKR',
  };
}
