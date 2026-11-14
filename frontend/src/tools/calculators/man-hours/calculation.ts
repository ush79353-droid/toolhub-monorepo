import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { ManHoursResult } from './types';

export function calculateManHours(people: number, hoursPerPerson: number): number {
  if (!Number.isFinite(people) || !Number.isFinite(hoursPerPerson)) return Number.NaN;
  if (people < 0 || hoursPerPerson < 0) return Number.NaN;
  const value = people * hoursPerPerson;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateCostPerPerson(hoursPerPerson: number, hourlyPay: number): number {
  if (!Number.isFinite(hoursPerPerson) || !Number.isFinite(hourlyPay)) return Number.NaN;
  if (hoursPerPerson < 0 || hourlyPay < 0) return Number.NaN;
  const value = hoursPerPerson * hourlyPay;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateTotalCost(manHours: number, hourlyPay: number): number {
  if (!Number.isFinite(manHours) || !Number.isFinite(hourlyPay)) return Number.NaN;
  if (manHours < 0 || hourlyPay < 0) return Number.NaN;
  const value = manHours * hourlyPay;
  return Number.isFinite(value) ? value : Number.NaN;
}

function formatHours(value: number): string {
  return Number(value.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

function formatMoney(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function calculateManHoursResult(
  people: number,
  hoursPerPerson: number,
  hourlyPay: number,
  currency: SupportedCurrency
): ManHoursResult | null {
  const manHours = calculateManHours(people, hoursPerPerson);
  const costPerPerson = calculateCostPerPerson(hoursPerPerson, hourlyPay);
  const totalCost = calculateTotalCost(manHours, hourlyPay);

  if (
    !Number.isFinite(manHours) ||
    !Number.isFinite(costPerPerson) ||
    !Number.isFinite(totalCost)
  ) {
    return null;
  }

  return {
    people,
    hoursPerPerson,
    hourlyPay,
    manHours,
    costPerPerson,
    totalCost,
    currency,
    manHoursDisplay: formatHours(manHours),
    costPerPersonDisplay: formatMoney(costPerPerson, currency),
    totalCostDisplay: formatMoney(totalCost, currency),
    shareManHours: `${formatHours(manHours)} hrs`,
    shareCostPerPerson: formatCurrencyValue(costPerPerson, currency),
    shareTotalCost: formatCurrencyValue(totalCost, currency),
  };
}
