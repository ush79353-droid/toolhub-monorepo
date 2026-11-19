import {
  buildCashFlowResult,
  calculateAverageAndCumulative,
  calculateXIRR,
  daysBetween,
  parseIsoDate,
  type DatedCashFlow,
  type PeriodReturnInput,
} from './calculation';
import type {
  AverageFieldErrors,
  AverageSectionInput,
  AverageSectionResult,
  CashFlowFieldErrors,
  CashFlowSectionInput,
  CashFlowSectionResult,
} from './types';

function parseMoney(raw: string): { ok: true; value: number } | { ok: false; error: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: false, error: 'Enter an amount.' };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { ok: false, error: 'Enter a valid amount.' };
  if (value < 0) return { ok: false, error: 'Amount cannot be negative.' };
  return { ok: true, value };
}

function parseOptionalMoney(
  raw: string,
): { ok: true; value: number | null } | { ok: false; error: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: true, value: null };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { ok: false, error: 'Enter a valid amount.' };
  if (!(value > 0)) return { ok: false, error: 'Transaction amount must be greater than zero.' };
  return { ok: true, value };
}

export function validateCashFlowSection(input: CashFlowSectionInput): {
  isValid: boolean;
  errors: CashFlowFieldErrors;
  result: CashFlowSectionResult | null;
} {
  const errors: CashFlowFieldErrors = {};

  const startBal = parseMoney(input.startingBalance);
  if (!startBal.ok) errors.startingBalance = startBal.error;

  const endBal = parseMoney(input.endingBalance);
  if (!endBal.ok) errors.endingBalance = endBal.error;

  const startDate = parseIsoDate(input.startingDate);
  if (!startDate) errors.startingDate = 'Enter a valid starting date.';

  const endDate = parseIsoDate(input.endingDate);
  if (!endDate) errors.endingDate = 'Enter a valid ending date.';

  if (startDate && endDate && !(endDate.getTime() > startDate.getTime())) {
    errors.endingDate = 'Ending date must be later than starting date.';
  }

  const flows: DatedCashFlow[] = [];
  let totalDeposits = 0;
  let totalWithdrawals = 0;

  if (startBal.ok && startDate) {
    flows.push({ amount: -startBal.value, date: startDate });
  }

  input.transactions.forEach((tx, index) => {
    const amountEmpty = tx.amount.trim() === '';
    const dateEmpty = tx.date.trim() === '';
    if (amountEmpty && dateEmpty) return;

    if (amountEmpty || dateEmpty) {
      errors[`tx${index}`] = 'Complete both amount and date, or clear the row.';
      return;
    }

    const amt = parseOptionalMoney(tx.amount);
    if (!amt.ok) {
      errors[`tx${index}`] = amt.error;
      return;
    }
    if (amt.value === null) return;

    const date = parseIsoDate(tx.date);
    if (!date) {
      errors[`tx${index}`] = 'Enter a valid transaction date.';
      return;
    }

    if (startDate && endDate) {
      if (date.getTime() < startDate.getTime() || date.getTime() > endDate.getTime()) {
        errors[`tx${index}`] = 'Transaction date must fall within the investment period.';
        return;
      }
    }

    if (tx.activity === 'deposit') {
      flows.push({ amount: -amt.value, date });
      totalDeposits += amt.value;
    } else {
      flows.push({ amount: amt.value, date });
      totalWithdrawals += amt.value;
    }
  });

  if (endBal.ok && endDate) {
    flows.push({ amount: endBal.value, date: endDate });
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (!startBal.ok || !endBal.ok || !startDate || !endDate) {
    return { isValid: false, errors, result: null };
  }

  if (daysBetween(startDate, endDate) <= 0) {
    return {
      isValid: false,
      errors: { endingDate: 'Ending date must be later than starting date.' },
      result: null,
    };
  }

  const rate = calculateXIRR(flows);
  if (rate === null) {
    return {
      isValid: false,
      errors: {
        form: 'Unable to find a unique annualized money-weighted return for these cash flows. Check signs, dates, and amounts.',
      },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: buildCashFlowResult(
      startBal.value,
      endBal.value,
      startDate,
      endDate,
      totalDeposits,
      totalWithdrawals,
      rate,
      input.currency,
    ),
  };
}

function parseReturn(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } | { ok: true; value: null } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: true, value: null };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { ok: false, error: 'Enter a valid return percentage.' };
  if (value < -100) {
    return { ok: false, error: 'Return cannot be below −100%.' };
  }
  return { ok: true, value };
}

function parseNonNegInt(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } | { ok: true; value: null } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: true, value: null };
  if (!/^\d+$/.test(cleaned)) {
    return { ok: false, error: 'Enter a whole nonnegative number.' };
  }
  const value = Number(cleaned);
  if (!Number.isSafeInteger(value) || value < 0) {
    return { ok: false, error: 'Enter a whole nonnegative number.' };
  }
  return { ok: true, value };
}

export function validateAverageSection(input: AverageSectionInput): {
  isValid: boolean;
  errors: AverageFieldErrors;
  result: AverageSectionResult | null;
} {
  const errors: AverageFieldErrors = {};
  const periods: PeriodReturnInput[] = [];

  input.entries.forEach((entry, index) => {
    const retEmpty = entry.returnPercentage.trim() === '';
    const yEmpty = entry.holdingYears.trim() === '';
    const mEmpty = entry.holdingMonths.trim() === '';
    if (retEmpty && yEmpty && mEmpty) return;

    if (retEmpty || (yEmpty && mEmpty)) {
      errors[`entry${index}`] =
        'Complete return and holding period (years and/or months), or clear the row.';
      return;
    }

    const ret = parseReturn(entry.returnPercentage);
    if (!ret.ok) {
      errors[`entry${index}`] = ret.error;
      return;
    }
    if (ret.value === null) {
      errors[`entry${index}`] = 'Enter a return percentage.';
      return;
    }

    const years = parseNonNegInt(entry.holdingYears);
    const months = parseNonNegInt(entry.holdingMonths);
    if (!years.ok) {
      errors[`entry${index}`] = years.error;
      return;
    }
    if (!months.ok) {
      errors[`entry${index}`] = months.error;
      return;
    }

    const y = years.value ?? 0;
    const m = months.value ?? 0;
    if (m > 11 && entry.holdingYears.trim() !== '') {
      // Allow months > 11 if years empty? Spec says 0-11 for normalized entry when both used.
      // If only months filled with large value, accept total months = m.
    }
    if (entry.holdingYears.trim() !== '' && m > 11) {
      errors[`entry${index}`] = 'Months should be 0–11 when years are also entered.';
      return;
    }

    const totalMonths = y * 12 + m;
    if (!(totalMonths > 0)) {
      errors[`entry${index}`] = 'Holding period must be greater than zero.';
      return;
    }

    periods.push({
      periodReturnDecimal: ret.value / 100,
      holdingMonths: totalMonths,
    });
  });

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (periods.length === 0) {
    return {
      isValid: false,
      errors: { form: 'Enter at least one investment return and holding period.' },
      result: null,
    };
  }

  const result = calculateAverageAndCumulative(periods);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate average and cumulative returns.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
