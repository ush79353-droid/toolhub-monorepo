import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateSipLumpsum,
  formatEndDateLabel,
  formatMoneyWithCode,
  formatSipLumpsumMoney,
  parseIsoDate,
  roundMoneyAmount,
  termToYears,
} from './calculation';
import {
  DEPOSIT_FREQUENCY_OPTIONS,
  type SipLumpsumFieldErrors,
  type SipLumpsumInput,
  type SipLumpsumResult,
} from './types';

export interface SipLumpsumValidation {
  isValid: boolean;
  errors: SipLumpsumFieldErrors;
  result: SipLumpsumResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateSipLumpsumInput(
  input: SipLumpsumInput
): SipLumpsumValidation {
  const errors: SipLumpsumFieldErrors = {};
  const { solveFor, currency } = input;
  const symbol = getCurrencySymbol(currency);
  let hasFieldError = false;

  const needsPv = solveFor !== 'lumpsum';
  const needsReturn = solveFor !== 'return';
  const needsTerm = solveFor !== 'term';
  const needsDeposit = solveFor !== 'deposit';
  const needsTarget = solveFor !== 'finalBalance';

  const pv = parseNumber(input.initialLumpsum);
  if (needsPv) {
    if (pv.blank) {
      errors.initialLumpsum = 'Enter the initial lumpsum (use 0 if none).';
      hasFieldError = true;
    } else if (pv.invalid || pv.value === null) {
      errors.initialLumpsum = 'Enter a valid initial lumpsum.';
      hasFieldError = true;
    } else if (pv.value < 0) {
      errors.initialLumpsum = 'Initial lumpsum cannot be negative.';
      hasFieldError = true;
    }
  }

  const rate = parseNumber(input.annualReturnPercent);
  if (needsReturn) {
    if (rate.blank) {
      errors.annualReturnPercent = 'Enter the expected annual return.';
      hasFieldError = true;
    } else if (rate.invalid || rate.value === null) {
      errors.annualReturnPercent = 'Enter a valid annual return.';
      hasFieldError = true;
    } else if (rate.value < -99.999) {
      errors.annualReturnPercent = 'Annual return cannot be −100% or lower.';
      hasFieldError = true;
    }
  }

  const term = parseNumber(input.termValue);
  let termYears: number | null = null;
  if (needsTerm) {
    if (term.blank) {
      errors.termValue = 'Enter the investment term.';
      hasFieldError = true;
    } else if (term.invalid || term.value === null) {
      errors.termValue = 'Enter a valid term.';
      hasFieldError = true;
    } else if (!(term.value > 0)) {
      errors.termValue = 'Term must be greater than zero.';
      hasFieldError = true;
    } else {
      termYears = termToYears(term.value, input.termUnit);
      if (termYears === null || termYears > 100) {
        errors.termValue = 'Term cannot exceed 100 years.';
        hasFieldError = true;
      }
    }
  } else {
    termYears = 1; // placeholder until solved
  }

  if (!input.startDate.trim()) {
    errors.startDate = 'Enter a start date.';
    hasFieldError = true;
  } else if (!parseIsoDate(input.startDate)) {
    errors.startDate = 'Enter a valid start date (YYYY-MM-DD).';
    hasFieldError = true;
  }

  const inflation = parseNumber(input.inflationPercent);
  if (inflation.blank) {
    errors.inflationPercent = 'Enter the inflation rate (use 0 if none).';
    hasFieldError = true;
  } else if (inflation.invalid || inflation.value === null) {
    errors.inflationPercent = 'Enter a valid inflation rate.';
    hasFieldError = true;
  } else if (inflation.value < 0) {
    errors.inflationPercent = 'Inflation rate cannot be negative.';
    hasFieldError = true;
  } else if (inflation.value > 100) {
    errors.inflationPercent = 'Inflation rate cannot exceed 100%.';
    hasFieldError = true;
  }

  const deposit = parseNumber(input.depositAmount);
  if (needsDeposit) {
    if (deposit.blank) {
      errors.depositAmount = 'Enter the periodic deposit (use 0 if none).';
      hasFieldError = true;
    } else if (deposit.invalid || deposit.value === null) {
      errors.depositAmount = 'Enter a valid deposit amount.';
      hasFieldError = true;
    }
  }

  const target = parseNumber(input.targetFinalBalance);
  if (needsTarget) {
    if (target.blank) {
      errors.targetFinalBalance = 'Enter the target final balance.';
      hasFieldError = true;
    } else if (target.invalid || target.value === null) {
      errors.targetFinalBalance = 'Enter a valid target final balance.';
      hasFieldError = true;
    }
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateSipLumpsum({
    solveFor,
    currency,
    pv: needsPv ? (pv.value as number) : 0,
    annualReturnPercent: needsReturn ? (rate.value as number) : 0,
    termYears: termYears as number,
    startDateIso: input.startDate.trim(),
    inflationPercent: inflation.value as number,
    compounding: input.compounding,
    pmt: needsDeposit ? (deposit.value as number) : 0,
    depositFrequency: input.depositFrequency,
    timing: input.depositTiming,
    targetFv: needsTarget ? (target.value as number) : 0,
  });

  if (math === null) {
    errors.form =
      'Unable to solve with these inputs. Check that a stable numeric solution exists.';
    return { isValid: false, errors, result: null };
  }

  const opening = roundMoneyAmount(math.openingBalance, currency);
  const finalBal = roundMoneyAmount(math.finalBalance, currency);
  const periodic = roundMoneyAmount(math.periodicDeposit, currency);
  const totalDep = roundMoneyAmount(math.totalDeposits, currency);
  const totalRet = roundMoneyAmount(math.totalReturn, currency);
  const real =
    math.realFinalBalance == null
      ? null
      : roundMoneyAmount(math.realFinalBalance, currency);

  const money = (n: number) => formatMoneyWithCode(n, currency);
  const freqLabel =
    DEPOSIT_FREQUENCY_OPTIONS.find((o) => o.value === input.depositFrequency)
      ?.label.toLowerCase() ?? 'periodic';

  const periodicInOutLabel =
    input.depositFrequency === 'monthly'
      ? 'Monthly in/out'
      : `${freqLabel.charAt(0).toUpperCase()}${freqLabel.slice(1)} in/out`;

  let summaryMessage: string;
  if (solveFor === 'finalBalance') {
    summaryMessage = `The final balance of your investment will be ${money(finalBal)} at the end of the term.`;
  } else if (solveFor === 'deposit') {
    summaryMessage = `You need a ${freqLabel} deposit of ${money(periodic)} to reach ${money(finalBal)}.`;
  } else if (solveFor === 'lumpsum') {
    summaryMessage = `You need an initial lumpsum of ${money(opening)} to reach ${money(finalBal)}.`;
  } else if (solveFor === 'return') {
    summaryMessage = `You need an expected return of ${math.annualReturnPercent.toFixed(4)}% per year to reach ${money(finalBal)}.`;
  } else {
    summaryMessage = `It takes about ${math.termYears.toFixed(4)} years to reach ${money(finalBal)}.`;
  }

  if (real != null) {
    summaryMessage += ` In today’s purchasing power (inflation ${math.inflationPercent}%), that is about ${money(real)}.`;
  }

  const result: SipLumpsumResult = {
    solveFor,
    currency,
    openingBalance: opening,
    finalBalance: finalBal,
    realFinalBalance: real,
    periodicDeposit: periodic,
    totalDeposits: totalDep,
    totalReturn: totalRet,
    annualReturnPercent: math.annualReturnPercent,
    termYears: math.termYears,
    depositPeriods: math.depositPeriods,
    compoundPeriods: math.compoundPeriods,
    numberOfTransactions: math.numberOfTransactions,
    endDateIso: math.endDate.toISOString().slice(0, 10),
    endDateLabel: formatEndDateLabel(math.endDate),
    depositFrequency: input.depositFrequency,
    depositTiming: input.depositTiming,
    compounding: input.compounding,
    inflationPercent: math.inflationPercent,
    summaryMessage,
    formattedOpeningBalance: money(opening),
    formattedFinalBalance: money(finalBal),
    formattedRealFinalBalance: real == null ? null : money(real),
    formattedPeriodicDeposit: money(periodic),
    formattedTotalDeposits: money(totalDep),
    formattedTotalReturn: money(totalRet),
    periodicInOutLabel,
    schedule: math.schedule.map((row) => ({
      ...row,
      deposit: roundMoneyAmount(row.deposit, currency),
      balance: roundMoneyAmount(row.balance, currency),
      interest: roundMoneyAmount(row.interest, currency),
    })),
  };

  void symbol;
  void formatSipLumpsumMoney;

  return { isValid: true, errors, result };
}
