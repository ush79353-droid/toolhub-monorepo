import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  ASSUMED_WORK_HOURS_PER_WEEK,
  countryById,
  UNPAID_ACTIVITIES,
  type ActivityBreakdown,
  type IncomeFrequency,
  type UnpaidWorkResult,
} from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/**
 * Normalize professional pay to an hourly equivalent.
 * Weekly ÷ 40. Monthly × 12 ÷ (52 × 40).
 */
export function normalizeHourlyIncome(
  income: number,
  frequency: IncomeFrequency,
): number | null {
  if (!Number.isFinite(income) || income < 0) return null;
  const hours = ASSUMED_WORK_HOURS_PER_WEEK;
  if (frequency === 'hourly') return income;
  if (frequency === 'weekly') return income / hours;
  return (income * 12) / (52 * hours);
}

export interface ActivityCalcRow {
  id: ActivityBreakdown['id'];
  hoursPerWeek: number;
  outsourcingRate: number;
}

export function calculateUnpaidWork(input: {
  countryId: string;
  income: number;
  incomeFrequency: IncomeFrequency;
  activities: ActivityCalcRow[];
  outsourcingBudget: number;
  familySharedHours: number;
}): UnpaidWorkResult | null {
  const {
    countryId,
    income,
    incomeFrequency,
    activities,
    outsourcingBudget,
    familySharedHours,
  } = input;

  const country = countryById(countryId);
  const hourlyIncome = normalizeHourlyIncome(income, incomeFrequency);
  if (hourlyIncome === null) return null;
  if (outsourcingBudget < 0 || familySharedHours < 0) return null;

  if (activities.length !== UNPAID_ACTIVITIES.length) return null;

  const breakdown: ActivityBreakdown[] = [];
  let totalHours = 0;
  let weeklyCost = 0;

  for (const def of UNPAID_ACTIVITIES) {
    const row = activities.find((a) => a.id === def.id);
    if (!row) return null;
    if (row.hoursPerWeek < 0 || row.outsourcingRate < 0) return null;
    if (!Number.isFinite(row.hoursPerWeek) || !Number.isFinite(row.outsourcingRate)) {
      return null;
    }
    const weeklyValue = row.hoursPerWeek * row.outsourcingRate;
    totalHours += row.hoursPerWeek;
    weeklyCost += weeklyValue;
    breakdown.push({
      id: def.id,
      name: def.name,
      hoursPerWeek: row.hoursPerWeek,
      outsourcingRate: row.outsourcingRate,
      weeklyValue,
    });
  }

  if (totalHours > 168) return null;
  if (familySharedHours > totalHours + 1e-9) return null;

  const currency = country.currency;
  const average =
    totalHours > 0 ? weeklyCost / totalHours : 0;
  const monthly = weeklyCost * (52 / 12);
  const annual = weeklyCost * 52;
  const opportunity = totalHours * hourlyIncome;

  const family = Math.min(familySharedHours, totalHours);
  const remaining = totalHours - family;
  const hoursFromBudget =
    average > 0 ? Math.min(remaining, outsourcingBudget / average) : 0;
  const timeSaved = family + hoursFromBudget;
  const coverage =
    weeklyCost > 0 ? (outsourcingBudget / weeklyCost) * 100 : 0;

  return {
    countryId: country.id,
    countryName: country.name,
    currency,
    income: roundMoney(income, currency),
    incomeFrequency,
    hourlyIncome: roundMoney(hourlyIncome, currency),
    activities: breakdown.map((row) => ({
      ...row,
      weeklyValue: roundMoney(row.weeklyValue, currency),
      outsourcingRate: roundMoney(row.outsourcingRate, currency),
    })),
    totalWeeklyHours: totalHours,
    weeklyReplacementCost: roundMoney(weeklyCost, currency),
    monthlyReplacementCost: roundMoney(monthly, currency),
    annualReplacementCost: roundMoney(annual, currency),
    averageOutsourcingRate: roundMoney(average, currency),
    potentialWeeklyEarnings: roundMoney(opportunity, currency),
    outsourcingBudget: roundMoney(outsourcingBudget, currency),
    budgetCoveragePercent: coverage,
    familySharedHours: family,
    remainingWeeklyHours: remaining,
    hoursCoveredByBudget: hoursFromBudget,
    potentialTimeSaved: timeSaved,
  };
}

export function shareUnpaidWorkText(result: UnpaidWorkResult): string {
  const lines = [
    'Unpaid Work Calculator',
    `Country: ${result.countryName}`,
    `Professional income: ${formatMoney(result.income, result.currency)} (${result.incomeFrequency})`,
    `Hourly equivalent: ${formatMoney(result.hourlyIncome, result.currency)} (assumes ${ASSUMED_WORK_HOURS_PER_WEEK} paid hours/week)`,
    `Total weekly unpaid hours: ${result.totalWeeklyHours}`,
  ];
  for (const row of result.activities) {
    if (row.hoursPerWeek <= 0 && row.outsourcingRate <= 0) continue;
    lines.push(
      `${row.name}: ${row.hoursPerWeek} h/wk × ${formatMoney(row.outsourcingRate, result.currency)} = ${formatMoney(row.weeklyValue, result.currency)}`,
    );
  }
  lines.push(
    `Average outsourcing rate: ${formatMoney(result.averageOutsourcingRate, result.currency)}/hr`,
    `Weekly replacement value: ${formatMoney(result.weeklyReplacementCost, result.currency)}`,
    `Monthly replacement value: ${formatMoney(result.monthlyReplacementCost, result.currency)}`,
    `Annual replacement value: ${formatMoney(result.annualReplacementCost, result.currency)}`,
    `Potential professional earnings (weekly): ${formatMoney(result.potentialWeeklyEarnings, result.currency)}`,
    `Outsourcing budget: ${formatMoney(result.outsourcingBudget, result.currency)}/wk`,
    `Potential time saved: ${result.potentialTimeSaved} h/wk`,
  );
  return lines.join('\n');
}
