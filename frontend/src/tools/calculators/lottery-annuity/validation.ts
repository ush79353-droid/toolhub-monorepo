import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import {
  buildLotteryAnnuitySchedule,
  firstLotteryPayout,
  formatLotteryMoney,
} from './calculation';
import type {
  LotteryAnnuityFieldErrors,
  LotteryAnnuityInput,
  LotteryAnnuityResult,
} from './types';

export interface LotteryAnnuityValidation {
  isValid: boolean;
  errors: LotteryAnnuityFieldErrors;
  result: LotteryAnnuityResult | null;
}

const US_TAX_BLOCKED =
  'US tax brackets and state withholding are not configured in this calculator. Choose Without tax or Customized tax rate.';

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

/**
 * Validates inputs and builds the yearly payout table.
 * Prize is already in the selected currency (denomination); FX conversion happens
 * on currency change in the form. `rates` is accepted for API symmetry with other
 * FX calculators but is not required for same-currency math.
 */
export function validateLotteryAnnuityInput(
  input: LotteryAnnuityInput,
  _rates?: CurrencyRatesSnapshot | null
): LotteryAnnuityValidation {
  void _rates;
  const errors: LotteryAnnuityFieldErrors = {};

  const prize = parseNumber(input.prizeAmount);
  const years = parseNumber(input.years);
  const growth = parseNumber(input.payoutGrowthPercent);
  const ret = parseNumber(input.rateOfReturnPercent);
  const customTax = parseNumber(input.customTaxRatePercent);

  if (prize.blank || prize.invalid || prize.value === null) {
    errors.prizeAmount = 'Enter a valid prize amount.';
  } else if (!(prize.value > 0)) {
    errors.prizeAmount = 'Prize amount must be greater than zero.';
  }

  if (years.blank || years.invalid || years.value === null) {
    errors.years = 'Enter a valid number of years.';
  } else if (!Number.isInteger(years.value) || !(years.value > 0) || years.value > 200) {
    errors.years = 'Enter a whole number of years between 1 and 200.';
  }

  if (growth.blank || growth.invalid || growth.value === null) {
    errors.payoutGrowthPercent = 'Enter a valid payout increase percentage.';
  } else if (growth.value <= -100) {
    errors.payoutGrowthPercent = 'Payout increase must be greater than −100%.';
  }

  if (ret.blank || ret.invalid || ret.value === null) {
    errors.rateOfReturnPercent = 'Enter a valid rate of return.';
  } else if (ret.value <= -100) {
    errors.rateOfReturnPercent = 'Rate of return must be greater than −100%.';
  }

  if (input.taxTreatment === 'custom') {
    if (customTax.blank || customTax.invalid || customTax.value === null) {
      errors.customTaxRatePercent = 'Enter a customized tax rate.';
    } else if (customTax.value < 0 || customTax.value >= 100) {
      errors.customTaxRatePercent = 'Tax rate must be from 0% up to (but not including) 100%.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (input.taxTreatment === 'us') {
    return {
      isValid: false,
      errors: { form: US_TAX_BLOCKED },
      result: null,
    };
  }

  const g = growth.value! / 100;
  const r = ret.value! / 100;
  const n = years.value!;

  const first = firstLotteryPayout({
    prizePresentValue: prize.value!,
    years: n,
    growthRate: g,
    returnRate: r,
  });

  if (first === null) {
    errors.form = 'This combination does not produce a finite first payout.';
    return { isValid: false, errors, result: null };
  }

  let netMultiplier = 1;
  let taxApplied = false;
  let tableCaption = 'Lottery annuity table without taxes.';

  if (input.taxTreatment === 'custom') {
    const t = customTax.value! / 100;
    netMultiplier = 1 - t;
    taxApplied = t > 0;
    tableCaption = taxApplied
      ? `Lottery annuity table with customized tax rate (${customTax.value}%).`
      : 'Lottery annuity table without taxes.';
  }

  const scheduleRaw = buildLotteryAnnuitySchedule({
    firstPayout: first,
    years: n,
    growthRate: g,
    netMultiplier,
  });

  if (scheduleRaw === null) {
    errors.form = 'Unable to build a finite payout schedule.';
    return { isValid: false, errors, result: null };
  }

  const schedule = scheduleRaw.map((row) => ({
    ...row,
    formattedPayout: formatLotteryMoney(row.payout),
    formattedTotalPayout: formatLotteryMoney(row.totalPayout),
  }));

  return {
    isValid: true,
    errors: {},
    result: {
      firstPayout: first * netMultiplier,
      schedule,
      taxApplied,
      tableCaption,
      currency: input.prizeCurrency,
    },
  };
}
