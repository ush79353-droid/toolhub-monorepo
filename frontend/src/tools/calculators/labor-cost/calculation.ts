import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { LaborCostInput, LaborCostResult } from './types';

const WEEKS_PER_YEAR = 52;
const WORK_DAYS_PER_WEEK = 5;

export function moneyOrZero(value: number): number {
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function formatPlainNumber(value: number): string {
  return Number(value.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function sumAdditionalAnnualCosts(input: LaborCostInput): number {
  return (
    moneyOrZero(input.taxes) +
    moneyOrZero(input.insurance) +
    moneyOrZero(input.benefits) +
    moneyOrZero(input.overtime) +
    moneyOrZero(input.supplies)
  );
}

export function countFilledAdditionalCosts(input: LaborCostInput): number {
  return (
    [input.taxes, input.insurance, input.benefits, input.overtime, input.supplies] as number[]
  ).filter((v) => Number.isFinite(v) && v !== 0).length;
}

/**
 * Gross Hours/Year = Weekly Hours × 52
 * Gross Pay = Gross Hours/Year × Hourly Pay Rate
 * Hours Not Worked = Absent Days × (Weekly Hours / 5)
 * Net Hours Worked = Gross Hours/Year − Hours Not Worked
 * Annual Payroll Labor Cost = Gross Pay + Additional Annual Employment Costs
 * Hourly Labor Cost = Annual Payroll Labor Cost / Net Hours Worked
 * Labor Cost Percentage = (Annual Payroll Labor Cost / Revenue) × 100
 */
export function buildLaborCostResult(
  input: LaborCostInput,
  options: { includeLaborCostPercent: boolean }
): LaborCostResult {
  const currency = input.currency;
  const blank = (): LaborCostResult => ({
    grossHoursPerYear: null,
    grossPay: null,
    hoursNotWorked: null,
    netHoursWorked: null,
    additionalAnnualCosts: sumAdditionalAnnualCosts(input),
    annualPayrollLaborCost: null,
    hourlyLaborCost: null,
    laborCostPercent: null,
    currency,
    grossHoursPerYearDisplay: '',
    grossPayDisplay: '',
    hoursNotWorkedDisplay: '',
    netHoursWorkedDisplay: '',
    annualPayrollLaborCostDisplay: '',
    hourlyLaborCostDisplay: '',
    laborCostPercentDisplay: '',
  });

  const weeklyHours = input.weeklyHours;
  const payRate = input.payRate;
  const absentDays = input.absentDays;

  if (!Number.isFinite(weeklyHours) || weeklyHours < 0) return blank();
  if (!Number.isFinite(absentDays) || absentDays < 0) return blank();

  const grossHoursPerYear = weeklyHours * WEEKS_PER_YEAR;
  if (!Number.isFinite(grossHoursPerYear)) return blank();

  const hoursNotWorked = absentDays * (weeklyHours / WORK_DAYS_PER_WEEK);
  if (!Number.isFinite(hoursNotWorked)) return blank();

  const netHoursWorked = grossHoursPerYear - hoursNotWorked;
  if (!Number.isFinite(netHoursWorked)) return blank();

  const additionalAnnualCosts = sumAdditionalAnnualCosts(input);

  let grossPay: number | null = null;
  let annualPayrollLaborCost: number | null = null;
  let hourlyLaborCost: number | null = null;
  let laborCostPercent: number | null = null;

  if (Number.isFinite(payRate) && payRate >= 0) {
    grossPay = grossHoursPerYear * payRate;
    if (Number.isFinite(grossPay)) {
      annualPayrollLaborCost = grossPay + additionalAnnualCosts;
      if (!Number.isFinite(annualPayrollLaborCost)) {
        annualPayrollLaborCost = null;
      } else if (netHoursWorked > 0) {
        hourlyLaborCost = annualPayrollLaborCost / netHoursWorked;
        if (!Number.isFinite(hourlyLaborCost)) hourlyLaborCost = null;
      }

      if (
        options.includeLaborCostPercent &&
        annualPayrollLaborCost !== null &&
        Number.isFinite(input.revenue) &&
        input.revenue > 0
      ) {
        laborCostPercent = (annualPayrollLaborCost / input.revenue) * 100;
        if (!Number.isFinite(laborCostPercent)) laborCostPercent = null;
      }
    } else {
      grossPay = null;
    }
  }

  return {
    grossHoursPerYear,
    grossPay,
    hoursNotWorked,
    netHoursWorked,
    additionalAnnualCosts,
    annualPayrollLaborCost,
    hourlyLaborCost,
    laborCostPercent,
    currency,
    grossHoursPerYearDisplay: formatPlainNumber(grossHoursPerYear),
    grossPayDisplay: grossPay === null ? '' : formatMoney(grossPay, currency),
    hoursNotWorkedDisplay: formatPlainNumber(hoursNotWorked),
    netHoursWorkedDisplay: formatPlainNumber(netHoursWorked),
    annualPayrollLaborCostDisplay:
      annualPayrollLaborCost === null ? '' : formatMoney(annualPayrollLaborCost, currency),
    hourlyLaborCostDisplay:
      hourlyLaborCost === null ? '' : formatMoney(hourlyLaborCost, currency),
    laborCostPercentDisplay:
      laborCostPercent === null ? '' : formatPlainNumber(laborCostPercent),
  };
}
