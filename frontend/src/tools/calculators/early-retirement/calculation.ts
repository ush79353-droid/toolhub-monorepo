import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Cap search at 200 years of monthly steps (defensive unreachable ceiling). */
export const MAX_MONTHS = 200 * 12;

export interface EarlyRetirementMathInput {
  netIncome: number;
  expenses: number;
  initialBalance: number;
  annualReturnPercent: number;
  withdrawalRatePercent: number;
}

export interface EarlyRetirementMathResult {
  monthlyDeposit: number;
  requiredBalance: number;
  monthsExact: number;
  monthsWhole: number;
  yearsPart: number;
  monthsPart: number;
  durationYears: number;
  durationMonths: number;
  totalContribution: number;
  totalInterest: number;
  finalBalance: number;
  alreadyIndependent: boolean;
  unreachable: boolean;
  statusMessage: string | null;
}

/**
 * Effective monthly rate from a nominal annual return compounded annually:
 * (1 + r_annual)^(1/12) − 1.
 */
export function monthlyRateFromAnnualPercent(annualReturnPercent: number): number {
  return Math.pow(1 + annualReturnPercent / 100, 1 / 12) - 1;
}

/** Monthly savings capacity from annual net income and expenses. */
export function monthlyDepositFromIncome(
  netIncome: number,
  expenses: number
): number {
  return Math.max(netIncome - expenses, 0) / 12;
}

/**
 * Required retirement balance from the safe withdrawal rate:
 * Required = AnnualExpenses / (withdrawalRate% / 100).
 */
export function requiredBalanceFromWithdrawal(
  annualExpenses: number,
  withdrawalRatePercent: number
): number | null {
  if (!(annualExpenses >= 0)) return null;
  if (!(withdrawalRatePercent > 0)) return null;
  const balance = annualExpenses / (withdrawalRatePercent / 100);
  return Number.isFinite(balance) ? balance : null;
}

/**
 * Months to grow P0 with end-of-month deposits PMT at monthly rate rm to target.
 * Ordinary annuity (deposits at end of each month). Returns exact (possibly fractional) months.
 */
export function monthsToReachTargetExact(
  initialBalance: number,
  monthlyDeposit: number,
  monthlyRate: number,
  target: number
): { months: number; unreachable: boolean; message: string | null } {
  if (!(target >= 0) || !Number.isFinite(target)) {
    return { months: 0, unreachable: true, message: 'Required balance is invalid.' };
  }
  if (!(initialBalance >= 0) || !Number.isFinite(initialBalance)) {
    return { months: 0, unreachable: true, message: 'Initial balance is invalid.' };
  }
  if (!(monthlyDeposit >= 0) || !Number.isFinite(monthlyDeposit)) {
    return { months: 0, unreachable: true, message: 'Monthly deposit is invalid.' };
  }
  if (!Number.isFinite(monthlyRate) || monthlyRate <= -1) {
    return {
      months: 0,
      unreachable: true,
      message: 'Return on investment produces an invalid monthly rate.',
    };
  }

  if (initialBalance >= target) {
    return { months: 0, unreachable: false, message: null };
  }

  const need = target - initialBalance;

  // Zero return: linear accumulation with end-of-month deposits.
  if (Math.abs(monthlyRate) < 1e-15) {
    if (monthlyDeposit <= 0) {
      return {
        months: 0,
        unreachable: true,
        message:
          'With a zero return and no monthly savings, the required balance cannot be reached.',
      };
    }
    const months = need / monthlyDeposit;
    if (!Number.isFinite(months) || months < 0) {
      return { months: 0, unreachable: true, message: 'Unable to solve duration.' };
    }
    if (months > MAX_MONTHS) {
      return {
        months: 0,
        unreachable: true,
        message: `Duration exceeds ${MAX_MONTHS / 12} years under these inputs.`,
      };
    }
    return { months, unreachable: false, message: null };
  }

  // Growth from balance alone (no deposits).
  if (monthlyDeposit === 0) {
    if (monthlyRate <= 0) {
      return {
        months: 0,
        unreachable: true,
        message:
          'With no monthly savings and a non-positive return, the required balance cannot be reached.',
      };
    }
    if (!(initialBalance > 0)) {
      return {
        months: 0,
        unreachable: true,
        message:
          'With no monthly savings and a zero initial balance, the required balance cannot be reached.',
      };
    }
    const months =
      Math.log(target / initialBalance) / Math.log(1 + monthlyRate);
    if (!Number.isFinite(months) || months < 0) {
      return { months: 0, unreachable: true, message: 'Unable to solve duration.' };
    }
    if (months > MAX_MONTHS) {
      return {
        months: 0,
        unreachable: true,
        message: `Duration exceeds ${MAX_MONTHS / 12} years under these inputs.`,
      };
    }
    return { months, unreachable: false, message: null };
  }

  // Ordinary annuity closed form:
  // target = P0(1+rm)^n + PMT*((1+rm)^n − 1)/rm
  // G = (target + PMT/rm) / (P0 + PMT/rm); n = ln(G)/ln(1+rm)
  const pmtOverR = monthlyDeposit / monthlyRate;
  const denom = initialBalance + pmtOverR;
  if (!(Math.abs(denom) > 1e-18)) {
    return {
      months: 0,
      unreachable: true,
      message: 'Unable to solve duration with these inputs.',
    };
  }
  const G = (target + pmtOverR) / denom;
  if (!(G > 0) || !Number.isFinite(G)) {
    return {
      months: 0,
      unreachable: true,
      message:
        'The portfolio never reaches the required balance with this savings rate and return.',
    };
  }

  // Negative return: G must be reachable (balance shrinking toward asymptote).
  if (monthlyRate < 0 && G >= 1) {
    return {
      months: 0,
      unreachable: true,
      message:
        'With a negative return, savings never accumulate to the required balance.',
    };
  }

  const months = Math.log(G) / Math.log(1 + monthlyRate);
  if (!Number.isFinite(months) || months < 0) {
    return {
      months: 0,
      unreachable: true,
      message:
        'The portfolio never reaches the required balance with this savings rate and return.',
    };
  }
  if (months > MAX_MONTHS) {
    return {
      months: 0,
      unreachable: true,
      message: `Duration exceeds ${MAX_MONTHS / 12} years under these inputs.`,
    };
  }
  return { months, unreachable: false, message: null };
}

/** Future value after `months` end-of-month deposits. */
export function futureValueAfterMonths(
  initialBalance: number,
  monthlyDeposit: number,
  monthlyRate: number,
  months: number
): number {
  if (!(months >= 0) || !Number.isFinite(months)) return NaN;
  if (Math.abs(monthlyRate) < 1e-15) {
    return initialBalance + monthlyDeposit * months;
  }
  const growth = Math.pow(1 + monthlyRate, months);
  return (
    initialBalance * growth +
    (monthlyDeposit * (growth - 1)) / monthlyRate
  );
}

export function splitYearsMonths(totalMonthsWhole: number): {
  yearsPart: number;
  monthsPart: number;
} {
  const m = Math.max(0, Math.floor(totalMonthsWhole));
  return {
    yearsPart: Math.floor(m / 12),
    monthsPart: m % 12,
  };
}

/**
 * Early-retirement / FI accumulation planner.
 * Deposits are applied at the **end of each month** (ordinary annuity).
 * Monthly rate uses annual effective compounding: (1+r)^(1/12)−1.
 */
export function calculateEarlyRetirement(
  input: EarlyRetirementMathInput
): EarlyRetirementMathResult | null {
  const {
    netIncome,
    expenses,
    initialBalance,
    annualReturnPercent,
    withdrawalRatePercent,
  } = input;

  if (!Number.isFinite(netIncome) || netIncome < 0) return null;
  if (!Number.isFinite(expenses) || expenses < 0) return null;
  if (!Number.isFinite(initialBalance) || initialBalance < 0) return null;
  if (!Number.isFinite(annualReturnPercent) || annualReturnPercent < -99.999) {
    return null;
  }
  if (!Number.isFinite(withdrawalRatePercent)) return null;

  if (!(withdrawalRatePercent > 0)) {
    return {
      monthlyDeposit: monthlyDepositFromIncome(netIncome, expenses),
      requiredBalance: NaN,
      monthsExact: 0,
      monthsWhole: 0,
      yearsPart: 0,
      monthsPart: 0,
      durationYears: 0,
      durationMonths: 0,
      totalContribution: 0,
      totalInterest: 0,
      finalBalance: initialBalance,
      alreadyIndependent: false,
      unreachable: true,
      statusMessage: 'Withdrawal rate must be greater than zero.',
    };
  }

  const monthlyDeposit = monthlyDepositFromIncome(netIncome, expenses);
  const requiredBalance = requiredBalanceFromWithdrawal(
    expenses,
    withdrawalRatePercent
  );
  if (requiredBalance === null) return null;

  const monthlyRate = monthlyRateFromAnnualPercent(annualReturnPercent);
  if (!Number.isFinite(monthlyRate) || monthlyRate <= -1) return null;

  const solved = monthsToReachTargetExact(
    initialBalance,
    monthlyDeposit,
    monthlyRate,
    requiredBalance
  );

  if (solved.unreachable) {
    return {
      monthlyDeposit,
      requiredBalance,
      monthsExact: 0,
      monthsWhole: 0,
      yearsPart: 0,
      monthsPart: 0,
      durationYears: 0,
      durationMonths: 0,
      totalContribution: 0,
      totalInterest: 0,
      finalBalance: initialBalance,
      alreadyIndependent: false,
      unreachable: true,
      statusMessage: solved.message,
    };
  }

  const monthsExact = solved.months;
  const alreadyIndependent = monthsExact === 0;
  // Whole months of deposits: ceil so the last end-of-month deposit meets/exceeds target.
  const monthsWhole = alreadyIndependent ? 0 : Math.ceil(monthsExact - 1e-12);
  const { yearsPart, monthsPart } = splitYearsMonths(monthsWhole);

  const finalBalance = alreadyIndependent
    ? initialBalance
    : futureValueAfterMonths(
        initialBalance,
        monthlyDeposit,
        monthlyRate,
        monthsWhole
      );

  if (!Number.isFinite(finalBalance)) return null;

  const totalContribution = monthlyDeposit * monthsWhole;
  // Interest relative to reaching the planning target (not surplus above target).
  const basis = alreadyIndependent ? initialBalance : requiredBalance;
  const totalInterest = basis - initialBalance - totalContribution;

  return {
    monthlyDeposit,
    requiredBalance,
    monthsExact,
    monthsWhole,
    yearsPart,
    monthsPart,
    durationYears: monthsWhole / 12,
    durationMonths: monthsWhole,
    totalContribution,
    totalInterest,
    finalBalance,
    alreadyIndependent,
    unreachable: false,
    statusMessage: alreadyIndependent
      ? 'Initial balance already meets or exceeds the required retirement balance.'
      : null,
  };
}

export function roundMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): number {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatEarlyRetirementMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatDurationLabel(
  yearsPart: number,
  monthsPart: number,
  monthsWhole: number,
  unit: 'years' | 'months'
): string {
  if (unit === 'months') {
    return `${monthsWhole} mo`;
  }
  if (yearsPart === 0) {
    return `${monthsPart} mo`;
  }
  if (monthsPart === 0) {
    return `${yearsPart} yr`;
  }
  return `${yearsPart} yr ${monthsPart} mo`;
}
