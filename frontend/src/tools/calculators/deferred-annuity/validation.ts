import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  addMonthsToIso,
  calculateDeferredAnnuity,
  formatDeferredAnnuityDateLabel,
  formatDeferredAnnuityMoney,
  monthsBetweenDates,
  periodToMonths,
  todayIsoDate,
} from './calculation';
import type {
  DeferredAnnuityFieldErrors,
  DeferredAnnuityInput,
  DeferredAnnuityResult,
} from './types';

export interface DeferredAnnuityValidation {
  isValid: boolean;
  errors: DeferredAnnuityFieldErrors;
  result: DeferredAnnuityResult | null;
}

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

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates inputs, normalizes lump/contribution/(optional fixed withdrawal)
 * into lump currency, runs the deferred-annuity engine, then converts money
 * results into resultCurrency for display.
 */
export function validateDeferredAnnuityInput(
  input: DeferredAnnuityInput,
  rates?: CurrencyRatesSnapshot | null,
  now = new Date()
): DeferredAnnuityValidation {
  const errors: DeferredAnnuityFieldErrors = {};
  const today = todayIsoDate(now);

  const lump = parseNumber(input.lumpSum);
  const contrib = parseNumber(input.monthlyContribution);
  const accRate = parseNumber(input.accumulationRatePercent);
  const payRate = parseNumber(input.payoutRatePercent);
  const wYears = parseNumber(input.withdrawalYears);
  const wMonths = parseNumber(input.withdrawalMonths);
  const fixed = parseNumber(input.fixedWithdrawal);
  const dYears = parseNumber(input.deferralYears);
  const dMonths = parseNumber(input.deferralMonths);

  if (lump.blank) errors.lumpSum = 'Enter a lump sum payment.';
  else if (lump.invalid || lump.value === null) errors.lumpSum = 'Enter a valid lump sum.';
  else if (lump.value < 0) errors.lumpSum = 'Lump sum cannot be negative.';

  if (contrib.blank) errors.monthlyContribution = 'Enter a monthly contribution.';
  else if (contrib.invalid || contrib.value === null) {
    errors.monthlyContribution = 'Enter a valid monthly contribution.';
  } else if (contrib.value < 0) {
    errors.monthlyContribution = 'Monthly contribution cannot be negative.';
  }

  if (accRate.blank) {
    errors.accumulationRatePercent = 'Enter an expected rate of return.';
  } else if (accRate.invalid || accRate.value === null) {
    errors.accumulationRatePercent = 'Enter a valid rate of return.';
  } else if (accRate.value < 0) {
    errors.accumulationRatePercent = 'Rate of return cannot be negative.';
  }

  if (payRate.blank) {
    errors.payoutRatePercent = 'Enter an expected rate of return.';
  } else if (payRate.invalid || payRate.value === null) {
    errors.payoutRatePercent = 'Enter a valid rate of return.';
  } else if (payRate.value < 0) {
    errors.payoutRatePercent = 'Rate of return cannot be negative.';
  }

  let deferralMonths: number | null = null;
  let deferralEndIso = input.deferralEndDate.trim();

  if (input.deferralMode === 'until_date') {
    if (!deferralEndIso) {
      errors.deferralEndDate = 'Enter the end of the deferral phase.';
    } else {
      deferralMonths = monthsBetweenDates(today, deferralEndIso);
      if (deferralMonths === null) {
        errors.deferralEndDate = 'Enter a valid end date (YYYY-MM-DD).';
      } else if (deferralMonths < 0) {
        errors.deferralEndDate = 'End of deferral must be on or after today.';
      }
    }
  } else {
    const years = dYears.blank ? 0 : dYears.value;
    const months = dMonths.blank ? 0 : dMonths.value;
    if ((!dYears.blank && dYears.invalid) || (!dMonths.blank && dMonths.invalid)) {
      errors.deferralYears = 'Enter a valid deferral period.';
    } else if (years === null || months === null) {
      errors.deferralYears = 'Enter a valid deferral period.';
    } else {
      deferralMonths = periodToMonths(years, months);
      if (deferralMonths === null || deferralMonths < 0) {
        errors.deferralYears = 'Deferral period cannot be negative.';
      } else if (deferralMonths === 0 && lump.value === 0) {
        errors.deferralYears = 'Enter a positive deferral period or lump sum.';
      } else {
        const end = addMonthsToIso(today, deferralMonths);
        if (!end) errors.deferralYears = 'Unable to compute the deferral end date.';
        else deferralEndIso = end;
      }
    }
  }

  let withdrawalMonths = 0;
  if (input.knowMode === 'withdraw_amount') {
    const years = wYears.blank ? 0 : wYears.value;
    const months = wMonths.blank ? 0 : wMonths.value;
    if (wYears.blank && wMonths.blank) {
      errors.withdrawalYears = 'Enter the length of withdrawals.';
    } else if (
      (!wYears.blank && (wYears.invalid || years === null)) ||
      (!wMonths.blank && (wMonths.invalid || months === null))
    ) {
      errors.withdrawalYears = 'Enter a valid withdrawal length.';
    } else if (years === null || months === null) {
      errors.withdrawalYears = 'Enter a valid withdrawal length.';
    } else {
      const total = periodToMonths(years, months);
      if (total === null || !(total > 0)) {
        errors.withdrawalYears = 'Withdrawal length must be greater than zero.';
      } else {
        withdrawalMonths = total;
      }
    }
  } else if (fixed.blank) {
    errors.fixedWithdrawal = 'Enter a monthly withdrawal amount.';
  } else if (fixed.invalid || fixed.value === null) {
    errors.fixedWithdrawal = 'Enter a valid monthly withdrawal.';
  } else if (!(fixed.value > 0)) {
    errors.fixedWithdrawal = 'Monthly withdrawal must be greater than zero.';
  }

  if (Object.keys(errors).length > 0 || deferralMonths === null) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.lumpSumCurrency;

  const contribInCalc = convertMoney(
    contrib.value!,
    input.contributionCurrency,
    calcCurrency,
    rates
  );
  if (!contribInCalc.ok) {
    errors.form = contribInCalc.message;
    return { isValid: false, errors, result: null };
  }

  let fixedInCalc = 0;
  if (input.knowMode === 'duration') {
    const converted = convertMoney(
      fixed.value!,
      input.withdrawalCurrency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    fixedInCalc = converted.amount;
  }

  const computed = calculateDeferredAnnuity({
    knowMode: input.knowMode,
    deferralMonths,
    lumpSum: lump.value!,
    monthlyContribution: contribInCalc.amount,
    accumulationRatePercent: accRate.value!,
    payoutRatePercent: payRate.value!,
    withdrawalMonths,
    fixedWithdrawal: fixedInCalc,
    startDateIso: today,
    deferralEndIso,
  });

  if (computed === null) {
    errors.form =
      input.knowMode === 'duration'
        ? 'This withdrawal cannot deplete the annuity (payment may be too low for the payout rate).'
        : 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const moneyFields = [
    computed.balanceAtFirstWithdrawal,
    computed.monthlyWithdrawal,
    computed.totalWithdrawal,
    computed.totalContribution,
    computed.totalReturn,
  ] as const;

  const converted: number[] = [];
  for (const amount of moneyFields) {
    const out = convertMoney(amount, calcCurrency, input.resultCurrency, rates);
    if (!out.ok) {
      errors.form = out.message;
      return { isValid: false, errors, result: null };
    }
    converted.push(out.amount);
  }

  const [
    balanceOut,
    withdrawalOut,
    totalWithdrawalOut,
    totalContributionOut,
    totalReturnOut,
  ] = converted as [number, number, number, number, number];

  const symbol = getCurrencySymbol(input.resultCurrency);
  const formattedWithdrawal = formatDeferredAnnuityMoney(
    withdrawalOut,
    input.resultCurrency
  );
  const summaryText =
    input.knowMode === 'withdraw_amount'
      ? `You can withdraw ${symbol}${formattedWithdrawal} at the end of each month to deplete your annuity entirely.`
      : `A monthly withdrawal of ${symbol}${formattedWithdrawal} lasts ${computed.numberOfWithdrawals} months before the annuity is depleted.`;

  const result: DeferredAnnuityResult = {
    summaryText,
    balanceAtFirstWithdrawal: balanceOut,
    monthlyWithdrawal: withdrawalOut,
    totalWithdrawal: totalWithdrawalOut,
    totalContribution: totalContributionOut,
    totalReturn: totalReturnOut,
    numberOfWithdrawals: computed.numberOfWithdrawals,
    lastWithdrawalDateIso: computed.lastWithdrawalDateIso,
    lastWithdrawalDateLabel: formatDeferredAnnuityDateLabel(
      computed.lastWithdrawalDateIso
    ),
    deferralMonths: computed.deferralMonths,
    formattedBalanceAtFirstWithdrawal: formatDeferredAnnuityMoney(
      balanceOut,
      input.resultCurrency
    ),
    formattedMonthlyWithdrawal: formattedWithdrawal,
    formattedTotalWithdrawal: formatDeferredAnnuityMoney(
      totalWithdrawalOut,
      input.resultCurrency
    ),
    formattedTotalContribution: formatDeferredAnnuityMoney(
      totalContributionOut,
      input.resultCurrency
    ),
    formattedTotalReturn: formatDeferredAnnuityMoney(
      totalReturnOut,
      input.resultCurrency
    ),
    resultCurrency: input.resultCurrency,
    calcCurrency,
  };

  return { isValid: true, errors: {}, result };
}
