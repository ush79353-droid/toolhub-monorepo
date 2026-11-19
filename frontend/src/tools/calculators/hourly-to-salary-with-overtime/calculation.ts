/**
 * Reuse salary-with-overtime pure math (ADR sibling). This catalog tool is a
 * distinct route with its own defaults/UX; formulas stay shared.
 */
export {
  WORKDAYS_PER_WEEK,
  WEEKS_PER_YEAR,
  formatSalaryWithOvertimeMoney as formatHourlyToSalaryWithOvertimeMoney,
  toWeeklyHours,
  toMonthlyHours,
  toHourlyRate,
  fromHourlyRate,
  fromMonthlyPay,
  calculateSalaryWithOvertime as calculateHourlyToSalaryWithOvertime,
} from '../salary-with-overtime/calculation';
