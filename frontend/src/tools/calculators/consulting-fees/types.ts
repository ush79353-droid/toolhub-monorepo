import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ConsultingFeesInput {
  workingHoursPerDay: number;
  weekdaysPerYear: number;
  holidayDays: number;
  sickDays: number;
  nonClientDays: number;
  advertising: number;
  equipment: number;
  training: number;
  memberships: number;
  insurance: number;
  healthcare: number;
  officeExpenses: number;
  officeRent: number;
  supplies: number;
  professionalFees: number;
  averageProjectValue: number;
  targetIncome: number;
  currency: SupportedCurrency;
}

export interface ConsultingFeesResult {
  currency: SupportedCurrency;
  billableDays: number;
  annualOperatingCosts: number;
  requiredAnnualRevenue: number;
  dailyBillableRate: number;
  hourlyRate: number;
  /** Context only — not used in rate formulas */
  averageProjectValue: number | null;
}

export type ConsultingFeesFieldErrors = Record<string, string>;

export function createDefaultInput(): ConsultingFeesInput {
  return {
    workingHoursPerDay: 8,
    weekdaysPerYear: 261,
    holidayDays: Number.NaN,
    sickDays: Number.NaN,
    nonClientDays: Number.NaN,
    advertising: 0,
    equipment: 0,
    training: 0,
    memberships: 0,
    insurance: 0,
    healthcare: 0,
    officeExpenses: 0,
    officeRent: 0,
    supplies: 0,
    professionalFees: 0,
    averageProjectValue: Number.NaN,
    targetIncome: Number.NaN,
    currency: 'PKR',
  };
}

export const OPERATING_COST_KEYS = [
  'advertising',
  'equipment',
  'training',
  'memberships',
  'insurance',
  'healthcare',
  'officeExpenses',
  'officeRent',
  'supplies',
  'professionalFees',
] as const;

export type OperatingCostKey = (typeof OPERATING_COST_KEYS)[number];
