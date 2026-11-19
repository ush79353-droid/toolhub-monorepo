import type { SupportedCurrency } from '@/tools/shared/currency';

/** Paid-work hours used to turn weekly/monthly pay into an hourly equivalent. */
export const ASSUMED_WORK_HOURS_PER_WEEK = 40;

export type IncomeFrequency = 'hourly' | 'weekly' | 'monthly';

export type UnpaidActivityId =
  | 'meal-preparation'
  | 'cleaning'
  | 'laundry'
  | 'child-care'
  | 'babysitting'
  | 'adult-care'
  | 'pet-care'
  | 'transport'
  | 'repairs'
  | 'gardening';

export interface UnpaidActivityDef {
  id: UnpaidActivityId;
  name: string;
  /** Illustrative hourly outsourcing assumption — not an official market price. */
  defaultRate: number;
}

export const UNPAID_ACTIVITIES: readonly UnpaidActivityDef[] = [
  { id: 'meal-preparation', name: 'Meal preparation', defaultRate: 15 },
  { id: 'cleaning', name: 'Cleaning', defaultRate: 20 },
  { id: 'laundry', name: 'Laundry', defaultRate: 12 },
  { id: 'child-care', name: 'Child care', defaultRate: 18 },
  { id: 'babysitting', name: 'Babysitting', defaultRate: 18 },
  { id: 'adult-care', name: 'Adult care', defaultRate: 20 },
  { id: 'pet-care', name: 'Pet care', defaultRate: 15 },
  { id: 'transport', name: 'Transport', defaultRate: 18 },
  { id: 'repairs', name: 'Repairs', defaultRate: 25 },
  { id: 'gardening', name: 'Gardening', defaultRate: 16 },
];

export interface CountryOption {
  id: string;
  name: string;
  currency: SupportedCurrency;
}

/** Country sets display currency only. Amounts are not converted. */
export const UNPAID_WORK_COUNTRIES: readonly CountryOption[] = [
  { id: 'US', name: 'United States', currency: 'USD' },
  { id: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { id: 'CA', name: 'Canada', currency: 'CAD' },
  { id: 'AU', name: 'Australia', currency: 'AUD' },
  { id: 'IN', name: 'India', currency: 'INR' },
  { id: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { id: 'DE', name: 'Germany', currency: 'EUR' },
  { id: 'PK', name: 'Pakistan', currency: 'PKR' },
];

export interface ActivityRowInput {
  id: UnpaidActivityId;
  hoursPerWeek: string;
  outsourcingRate: string;
}

export interface UnpaidWorkInput {
  countryId: string;
  income: string;
  incomeFrequency: IncomeFrequency;
  activities: ActivityRowInput[];
  outsourcingBudget: string;
  familySharedHours: string;
}

export interface ActivityBreakdown {
  id: UnpaidActivityId;
  name: string;
  hoursPerWeek: number;
  outsourcingRate: number;
  weeklyValue: number;
}

export interface UnpaidWorkResult {
  countryId: string;
  countryName: string;
  currency: SupportedCurrency;
  income: number;
  incomeFrequency: IncomeFrequency;
  hourlyIncome: number;
  activities: ActivityBreakdown[];
  totalWeeklyHours: number;
  weeklyReplacementCost: number;
  monthlyReplacementCost: number;
  annualReplacementCost: number;
  averageOutsourcingRate: number;
  potentialWeeklyEarnings: number;
  outsourcingBudget: number;
  budgetCoveragePercent: number;
  familySharedHours: number;
  remainingWeeklyHours: number;
  hoursCoveredByBudget: number;
  potentialTimeSaved: number;
}

export type UnpaidWorkFieldErrors = Partial<
  Record<
    | 'income'
    | 'hours'
    | 'rates'
    | 'outsourcingBudget'
    | 'familySharedHours'
    | 'form',
    string
  >
>;

export function countryById(id: string): CountryOption {
  return (
    UNPAID_WORK_COUNTRIES.find((c) => c.id === id) ?? UNPAID_WORK_COUNTRIES[0]!
  );
}

function activityRows(hours: string, useDefaultRates: boolean): ActivityRowInput[] {
  return UNPAID_ACTIVITIES.map((activity) => ({
    id: activity.id,
    hoursPerWeek: hours,
    outsourcingRate: useDefaultRates ? String(activity.defaultRate) : '0',
  }));
}

export function createDefaultInput(): UnpaidWorkInput {
  return {
    countryId: 'US',
    income: '0',
    incomeFrequency: 'hourly',
    activities: activityRows('0', true),
    outsourcingBudget: '0',
    familySharedHours: '0',
  };
}

export function createBlankInput(countryId = 'US'): UnpaidWorkInput {
  return {
    countryId,
    income: '',
    incomeFrequency: 'hourly',
    activities: activityRows('', false),
    outsourcingBudget: '',
    familySharedHours: '',
  };
}

export function createExampleInput(): UnpaidWorkInput {
  const base = createDefaultInput();
  const hours: Partial<Record<UnpaidActivityId, string>> = {
    'meal-preparation': '10',
    cleaning: '5',
    laundry: '4',
    'child-care': '15',
    gardening: '2',
  };
  return {
    ...base,
    activities: base.activities.map((row) => ({
      ...row,
      hoursPerWeek: hours[row.id] ?? '0',
    })),
  };
}

export function hasUnpaidWorkChanges(input: UnpaidWorkInput): boolean {
  const blank = createBlankInput(input.countryId);
  if (input.income.trim() !== blank.income) return true;
  if (input.incomeFrequency !== blank.incomeFrequency) return true;
  if (input.outsourcingBudget.trim() !== blank.outsourcingBudget) return true;
  if (input.familySharedHours.trim() !== blank.familySharedHours) return true;
  return input.activities.some((row, index) => {
    const other = blank.activities[index];
    return (
      row.hoursPerWeek.trim() !== (other?.hoursPerWeek ?? '') ||
      row.outsourcingRate.trim() !== (other?.outsourcingRate ?? '')
    );
  });
}
