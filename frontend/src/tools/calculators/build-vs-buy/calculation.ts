import {
  WEEKS_PER_MONTH,
  WORKING_DAYS_PER_MONTH,
  type BuildTimeUnit,
  type BuildVsBuyInput,
  type BuildVsBuyResult,
  type PaybackUnit,
} from './types';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';

export function buildDurationInMonths(buildTime: number, unit: BuildTimeUnit): number {
  switch (unit) {
    case 'days':
      return buildTime / WORKING_DAYS_PER_MONTH;
    case 'weeks':
      return buildTime / WEEKS_PER_MONTH;
    case 'months':
      return buildTime;
    case 'years':
      return buildTime * 12;
  }
}

export function effectiveMonthlyEmployeeCost(
  salaryMonthly: number,
  overheadPercent: number
): number {
  return salaryMonthly * (1 + overheadPercent / 100);
}

export function costToBuild(
  employees: number,
  effectiveMonthly: number,
  durationMonths: number
): number {
  return employees * effectiveMonthly * durationMonths;
}

export function annualMaintenanceCost(
  maintenanceDaysPerMonth: number,
  effectiveMonthly: number
): number {
  return (maintenanceDaysPerMonth / WORKING_DAYS_PER_MONTH) * effectiveMonthly * 12;
}

function formatPayback(years: number, unit: PaybackUnit): string {
  const value = unit === 'months' ? years * 12 : years;
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

export function calculateBuildVsBuy(input: BuildVsBuyInput): BuildVsBuyResult | null {
  const {
    buyCostAnnual,
    employees,
    buildTime,
    buildTimeUnit,
    salaryMonthly,
    overheadPercent,
    maintenanceDaysPerMonth,
    paybackUnit,
    currency,
  } = input;

  if (
    ![
      buyCostAnnual,
      employees,
      buildTime,
      salaryMonthly,
      overheadPercent,
      maintenanceDaysPerMonth,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  const durationMonths = buildDurationInMonths(buildTime, buildTimeUnit);
  const effectiveMonthly = effectiveMonthlyEmployeeCost(salaryMonthly, overheadPercent);
  const buildCost = costToBuild(employees, effectiveMonthly, durationMonths);
  const maintenance = annualMaintenanceCost(maintenanceDaysPerMonth, effectiveMonthly);
  const savings = buyCostAnnual - maintenance;
  const hasPayback = savings > 0;
  const yearsToProfit = hasPayback ? buildCost / savings : null;

  if (
    ![durationMonths, effectiveMonthly, buildCost, maintenance, savings].every(Number.isFinite)
  ) {
    return null;
  }
  if (yearsToProfit !== null && !Number.isFinite(yearsToProfit)) return null;

  return {
    currency,
    effectiveMonthlyCost: effectiveMonthly,
    costToBuild: buildCost,
    annualMaintenance: maintenance,
    annualSavings: savings,
    yearsToProfit,
    hasPayback,
    buildDurationMonths: durationMonths,
    paybackUnit,
    paybackDisplay:
      yearsToProfit === null ? 'No payback' : formatPayback(yearsToProfit, paybackUnit),
    effectiveMonthlyDisplay: formatCurrencyValue(effectiveMonthly, currency),
    costToBuildDisplay: formatCurrencyValue(buildCost, currency),
    annualMaintenanceDisplay: formatCurrencyValue(maintenance, currency),
    annualSavingsDisplay: formatCurrencyValue(savings, currency),
  };
}

export function moneyLabel(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}
