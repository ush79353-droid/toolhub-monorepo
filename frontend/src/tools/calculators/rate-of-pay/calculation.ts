import {
  calculateWagePeriods,
  formatWageMoney,
  WEEKS_PER_YEAR,
  WORKDAYS_PER_WEEK,
} from '../wage/calculation';
import type { RateOfPaySourceField } from './types';

export { formatWageMoney as formatRateOfPayMoney, WEEKS_PER_YEAR, WORKDAYS_PER_WEEK };

/**
 * Bidirectional rate-of-pay conversion (hourly ↔ daily ↔ weekly ↔ biweekly ↔
 * monthly ↔ annual). Reuses verified Wage Calculator period math for the
 * screenshot field set (no per-second / per-minute).
 *
 * Assumptions (disclosed in UI):
 *   Annual Hours = HoursPerWeek × 52
 *   Weekly = Hourly × HoursPerWeek
 *   Annual = Hourly × Annual Hours
 *   Monthly = Annual / 12
 *   Biweekly = Weekly × 2
 *   Daily = Weekly / 5
 *
 * Full precision; no display rounding inside the formulas.
 */
export function calculateRateOfPay(input: {
  hoursPerWeek: number;
  sourceField: RateOfPaySourceField;
  sourceAmount: number;
}): {
  annualHours: number;
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
} | null {
  const computed = calculateWagePeriods({
    hoursPerWeek: input.hoursPerWeek,
    sourceField: input.sourceField,
    sourceAmount: input.sourceAmount,
  });
  if (computed === null) return null;
  return {
    annualHours: computed.annualHours,
    hourly: computed.hourly,
    daily: computed.daily,
    weekly: computed.weekly,
    biweekly: computed.biweekly,
    monthly: computed.monthly,
    annual: computed.annual,
  };
}
