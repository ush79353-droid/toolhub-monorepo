import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  DREAM_MAX_MONTHS,
  type DreamComeTrueResult,
  type DreamGoalStatus,
  type DreamSavingsBreakdown,
} from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function calculateMonthlyInterestRate(
  annualInterestRatePercent: number,
): number | null {
  if (!Number.isFinite(annualInterestRatePercent) || annualInterestRatePercent < 0) {
    return null;
  }
  return annualInterestRatePercent / 100 / 12;
}

export function calculateFutureSavings(
  initialSavings: number,
  monthlySavings: number,
  monthlyInterestRate: number,
  months: number,
): number | null {
  if (
    ![initialSavings, monthlySavings, monthlyInterestRate, months].every(Number.isFinite) ||
    initialSavings < 0 ||
    monthlySavings < 0 ||
    monthlyInterestRate < 0 ||
    months < 0 ||
    !Number.isInteger(months)
  ) {
    return null;
  }
  if (months === 0) return initialSavings;
  if (monthlyInterestRate === 0) {
    return initialSavings + monthlySavings * months;
  }
  const growth = (1 + monthlyInterestRate) ** months;
  return (
    initialSavings * growth +
    monthlySavings * ((growth - 1) / monthlyInterestRate)
  );
}

/**
 * Months needed to reach P with end-of-month deposits. Returns null if unreachable.
 * Result is not yet ceiled.
 */
export function calculateTimeToGoal(
  dreamPrice: number,
  initialSavings: number,
  monthlySavings: number,
  monthlyInterestRate: number,
): number | null {
  if (
    ![dreamPrice, initialSavings, monthlySavings, monthlyInterestRate].every(
      Number.isFinite,
    ) ||
    dreamPrice <= 0 ||
    initialSavings < 0 ||
    monthlySavings < 0 ||
    monthlyInterestRate < 0
  ) {
    return null;
  }

  if (initialSavings >= dreamPrice) return 0;

  if (monthlyInterestRate === 0) {
    if (monthlySavings <= 0) return null;
    return (dreamPrice - initialSavings) / monthlySavings;
  }

  const r = monthlyInterestRate;

  if (monthlySavings === 0) {
    if (initialSavings <= 0) return null;
    // Need I*(1+r)^n >= P
    if (initialSavings >= dreamPrice) return 0;
    return Math.log(dreamPrice / initialSavings) / Math.log(1 + r);
  }

  // n = ln((P*r + M) / (I*r + M)) / ln(1+r)
  const numerator = dreamPrice * r + monthlySavings;
  const denominator = initialSavings * r + monthlySavings;
  if (!(numerator > 0) || !(denominator > 0)) return null;
  const ratio = numerator / denominator;
  if (!(ratio > 0)) return null;
  // If ratio <= 1, already at/over target or contributions dominate incorrectly
  if (ratio <= 1) {
    // With positive M and I < P, ratio should be > 1 when goal is ahead
    if (initialSavings >= dreamPrice) return 0;
    // If I*r+M >= P*r+M then I >= P
    return null;
  }
  return Math.log(ratio) / Math.log(1 + r);
}

export function formatGoalCompletionTime(months: number): string {
  if (!Number.isFinite(months) || months < 0) return '';
  const whole = Math.max(0, Math.ceil(months));
  if (whole === 0) return '0 months';
  const years = Math.floor(whole / 12);
  const rem = whole % 12;
  const yearPart =
    years === 0 ? '' : years === 1 ? '1 year' : `${years} years`;
  const monthPart =
    rem === 0 ? '' : rem === 1 ? '1 month' : `${rem} months`;
  if (yearPart && monthPart) return `${yearPart}, ${monthPart}`;
  return yearPart || monthPart;
}

export function calculateSavingsBreakdown(
  initialSavings: number,
  monthlySavings: number,
  monthlyInterestRate: number,
  months: number,
  currency: SupportedCurrency,
): DreamSavingsBreakdown[] {
  const rows: DreamSavingsBreakdown[] = [];
  if (months <= 0) {
    rows.push({
      month: 0,
      initialSavingsGrowth: roundMoney(initialSavings, currency),
      monthlyContributions: 0,
      interestEarned: 0,
      totalSavings: roundMoney(initialSavings, currency),
    });
    return rows;
  }

  const step = months > 120 ? Math.ceil(months / 60) : 1;
  for (let m = 0; m <= months; m += step) {
    const totalRaw = calculateFutureSavings(
      initialSavings,
      monthlySavings,
      monthlyInterestRate,
      m,
    );
    if (totalRaw === null) continue;
    const initialGrowth =
      monthlyInterestRate === 0
        ? initialSavings
        : initialSavings * (1 + monthlyInterestRate) ** m;
    const contrib = monthlySavings * m;
    const total = roundMoney(totalRaw, currency);
    const blue = roundMoney(initialGrowth, currency);
    const red = roundMoney(contrib, currency);
    const yellow = roundMoney(Math.max(0, total - blue - red), currency);
    rows.push({
      month: m,
      initialSavingsGrowth: blue,
      monthlyContributions: red,
      interestEarned: yellow,
      totalSavings: total,
    });
  }

  // Ensure final month is included
  if (rows[rows.length - 1]?.month !== months) {
    const totalRaw = calculateFutureSavings(
      initialSavings,
      monthlySavings,
      monthlyInterestRate,
      months,
    );
    if (totalRaw !== null) {
      const initialGrowth =
        monthlyInterestRate === 0
          ? initialSavings
          : initialSavings * (1 + monthlyInterestRate) ** months;
      const contrib = monthlySavings * months;
      const total = roundMoney(totalRaw, currency);
      const blue = roundMoney(initialGrowth, currency);
      const red = roundMoney(contrib, currency);
      rows.push({
        month: months,
        initialSavingsGrowth: blue,
        monthlyContributions: red,
        interestEarned: roundMoney(Math.max(0, total - blue - red), currency),
        totalSavings: total,
      });
    }
  }

  return rows;
}

export function calculateDreamComeTrue(input: {
  dreamPrice: number;
  initialSavings: number;
  monthlySavings: number;
  annualInterestRate: number;
  currency: SupportedCurrency;
}): DreamComeTrueResult | null {
  const r = calculateMonthlyInterestRate(input.annualInterestRate);
  if (r === null) return null;
  if (!(input.dreamPrice > 0)) return null;
  if (input.initialSavings < 0 || input.monthlySavings < 0) return null;

  const currency = input.currency;
  const dreamPrice = roundMoney(input.dreamPrice, currency);
  const initial = roundMoney(input.initialSavings, currency);
  const monthly = roundMoney(input.monthlySavings, currency);

  if (initial >= dreamPrice) {
    return {
      monthlyInterestRate: r,
      timeRequiredMonths: 0,
      yearsRequired: 0,
      remainingMonths: 0,
      timeLabel: 'Goal achieved!',
      totalInitialSavings: initial,
      totalMonthlyContributions: 0,
      totalInterestEarned: 0,
      finalSavingsBalance: initial,
      dreamPrice,
      savingsProgressPercentage: 100,
      goalAlreadyAchieved: true,
      goalReachable: true,
      status: 'achieved',
      statusMessage:
        'Your dream is already within reach. You have enough savings to achieve your goal.',
      explanation: `Your initial savings of ${formatMoney(initial, currency)} already meet or exceed your dream price of ${formatMoney(dreamPrice, currency)}.`,
      breakdown: calculateSavingsBreakdown(initial, monthly, r, 0, currency),
      currency,
    };
  }

  const rawMonths = calculateTimeToGoal(dreamPrice, initial, monthly, r);
  if (rawMonths === null || !Number.isFinite(rawMonths) || rawMonths < 0) {
    return unreachableResult({
      dreamPrice,
      initial,
      monthly,
      r,
      currency,
    });
  }

  const months = Math.ceil(rawMonths - 1e-12);
  if (months > DREAM_MAX_MONTHS) {
    return unreachableResult({
      dreamPrice,
      initial,
      monthly,
      r,
      currency,
      message: `Your goal would take more than ${DREAM_MAX_MONTHS / 12} years with the current plan. Increase monthly savings or adjust the target.`,
    });
  }

  const finalRaw = calculateFutureSavings(initial, monthly, r, months);
  if (finalRaw === null) return null;

  const finalSavingsBalance = roundMoney(finalRaw, currency);
  const totalMonthlyContributions = roundMoney(monthly * months, currency);
  const totalInterestEarned = roundMoney(
    Math.max(0, finalSavingsBalance - initial - totalMonthlyContributions),
    currency,
  );
  const yearsRequired = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const timeLabel = formatGoalCompletionTime(months);
  const breakdown = calculateSavingsBreakdown(initial, monthly, r, months, currency);

  const status: DreamGoalStatus = 'reachable';
  const explanation = `Based on your initial savings of ${formatMoney(initial, currency)}, monthly contributions of ${formatMoney(monthly, currency)}, and an annual interest rate of ${input.annualInterestRate}%, you can reach your ${formatMoney(dreamPrice, currency)} savings goal in approximately ${timeLabel}.`;

  return {
    monthlyInterestRate: r,
    timeRequiredMonths: months,
    yearsRequired,
    remainingMonths,
    timeLabel,
    totalInitialSavings: initial,
    totalMonthlyContributions,
    totalInterestEarned,
    finalSavingsBalance,
    dreamPrice,
    savingsProgressPercentage: 100,
    goalAlreadyAchieved: false,
    goalReachable: true,
    status,
    statusMessage: `Time you need: ${timeLabel}`,
    explanation,
    breakdown,
    currency,
  };
}

function unreachableResult(args: {
  dreamPrice: number;
  initial: number;
  monthly: number;
  r: number;
  currency: SupportedCurrency;
  message?: string;
}): DreamComeTrueResult {
  const progress =
    args.dreamPrice > 0
      ? roundMoney(
          Math.min(100, (args.initial / args.dreamPrice) * 100),
          args.currency,
        )
      : 0;
  return {
    monthlyInterestRate: args.r,
    timeRequiredMonths: 0,
    yearsRequired: 0,
    remainingMonths: 0,
    timeLabel: 'Goal cannot be reached',
    totalInitialSavings: args.initial,
    totalMonthlyContributions: 0,
    totalInterestEarned: 0,
    finalSavingsBalance: args.initial,
    dreamPrice: args.dreamPrice,
    savingsProgressPercentage: progress,
    goalAlreadyAchieved: false,
    goalReachable: false,
    status: 'unreachable',
    statusMessage:
      args.message ??
      'Goal cannot be reached with the current savings plan.',
    explanation:
      args.message ??
      'With no growth path to the target (for example zero contributions and zero interest, or zero savings with no deposits), the dream price cannot be reached.',
    breakdown: [],
    currency: args.currency,
  };
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareDreamComeTrueText(result: DreamComeTrueResult): string {
  return [
    'Dream Come True Calculator | Omega Calculators',
    `Dream price: ${formatMoney(result.dreamPrice, result.currency)}`,
    `Initial savings: ${formatMoney(result.totalInitialSavings, result.currency)}`,
    `Monthly savings contributions (total): ${formatMoney(result.totalMonthlyContributions, result.currency)}`,
    `Interest earned: ${formatMoney(result.totalInterestEarned, result.currency)}`,
    `Final savings: ${formatMoney(result.finalSavingsBalance, result.currency)}`,
    `Time needed: ${result.timeLabel}`,
    result.statusMessage,
  ].join('\n');
}
