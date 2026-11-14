import { formatCurrencyValue } from '@/tools/shared/currency';
import type { ConsultingFeesInput, ConsultingFeesResult } from './types';
import { OPERATING_COST_KEYS } from './types';

export function sumOperatingCosts(input: ConsultingFeesInput): number {
  return OPERATING_COST_KEYS.reduce((sum, key) => {
    const value = input[key];
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);
}

export function computeBillableDays(input: ConsultingFeesInput): number | null {
  if (!Number.isFinite(input.weekdaysPerYear)) return null;
  const holidays = Number.isFinite(input.holidayDays) ? input.holidayDays : 0;
  const sick = Number.isFinite(input.sickDays) ? input.sickDays : 0;
  const nonClient = Number.isFinite(input.nonClientDays) ? input.nonClientDays : 0;
  return input.weekdaysPerYear - holidays - sick - nonClient;
}

/**
 * Billable Days = Weekdays − Holidays − Sick − Non-client
 * Required Annual Revenue = Target Income + Annual Operating Costs
 * Daily Rate = Required Annual Revenue / Billable Days
 * Hourly Rate = Daily Rate / Working Hours per Day
 * Average project value is context-only and does not affect rates.
 */
export function calculateConsultingFees(input: ConsultingFeesInput): ConsultingFeesResult | null {
  if (!Number.isFinite(input.workingHoursPerDay) || input.workingHoursPerDay <= 0) return null;
  if (!Number.isFinite(input.targetIncome) || input.targetIncome < 0) return null;

  const billableDays = computeBillableDays(input);
  if (billableDays === null || !Number.isFinite(billableDays) || billableDays <= 0) return null;

  for (const key of OPERATING_COST_KEYS) {
    const value = input[key];
    if (Number.isFinite(value) && value < 0) return null;
  }

  const annualOperatingCosts = sumOperatingCosts(input);
  const requiredAnnualRevenue = input.targetIncome + annualOperatingCosts;
  const dailyBillableRate = requiredAnnualRevenue / billableDays;
  const hourlyRate = dailyBillableRate / input.workingHoursPerDay;

  if (!Number.isFinite(dailyBillableRate) || !Number.isFinite(hourlyRate)) return null;

  return {
    currency: input.currency,
    billableDays,
    annualOperatingCosts,
    requiredAnnualRevenue,
    dailyBillableRate,
    hourlyRate,
    averageProjectValue: Number.isFinite(input.averageProjectValue)
      ? input.averageProjectValue
      : null,
  };
}

export function formatMoney(value: number, currency: ConsultingFeesResult['currency']): string {
  return formatCurrencyValue(value, currency);
}

export function formatDays(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}
