import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  type CompoundingMethod,
  type PaymentFrequency,
  type RetirementWithdrawalResult,
  type WithdrawalTiming,
  type YearBalancePoint,
} from './types';

const RATE_TOL = 1e-12;
const MAX_PERIODS = 1200 * 12; // soft ceiling (~1,200 years monthly)

export interface RetirementWithdrawalCanonicalInput {
  mode: 'withdrawal' | 'duration';
  currency: SupportedCurrency;
  balanceAtRetirement: number;
  ageNow: number;
  retireAge: number;
  yearsInRetirement: number;
  withdrawalAmount: number;
  annualInterestRatePercent: number;
  inflationBeforePercent: number;
  inflationAfterPercent: number;
  paymentFrequency: PaymentFrequency;
  compounding: CompoundingMethod;
  timing: WithdrawalTiming;
  endBalance: number;
  /** Calendar year used as “now” for chart labels */
  baseCalendarYear: number;
}

export function formatRetirementMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function paymentsPerYear(frequency: PaymentFrequency): number {
  return (
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === frequency)
      ?.periodsPerYear ?? 12
  );
}

export function compoundingPerYear(
  method: CompoundingMethod
): number | null {
  return (
    COMPOUNDING_OPTIONS.find((o) => o.value === method)?.periodsPerYear ??
    null
  );
}

/**
 * Equivalent interest rate per withdrawal period from nominal annual %.
 * Discrete: (1 + i/m)^(m/q) − 1
 * Continuous: exp(i/q) − 1
 */
export function periodRateFromAnnual(
  annualPercent: number,
  compounding: CompoundingMethod,
  paymentFrequency: PaymentFrequency
): number | null {
  if (!Number.isFinite(annualPercent)) return null;
  const q = paymentsPerYear(paymentFrequency);
  if (!(q > 0)) return null;
  const i = annualPercent / 100;
  if (annualPercent === 0) return 0;
  if (compounding === 'continuously') {
    const r = Math.exp(i / q) - 1;
    return Number.isFinite(r) ? r : null;
  }
  const m = compoundingPerYear(compounding);
  if (m === null || !(m > 0)) return null;
  const base = 1 + i / m;
  if (!(base > 0)) return null;
  const r = Math.pow(base, m / q) - 1;
  return Number.isFinite(r) ? r : null;
}

function timingType(timing: WithdrawalTiming): 0 | 1 {
  return timing === 'beginning' ? 1 : 0;
}

/** Periodic growth factor from annual inflation % and payment frequency. */
export function periodGrowthFromAnnual(
  annualInflationPercent: number,
  paymentFrequency: PaymentFrequency
): number | null {
  if (!Number.isFinite(annualInflationPercent)) return null;
  const q = paymentsPerYear(paymentFrequency);
  if (!(q > 0)) return null;
  if (annualInflationPercent === 0) return 0;
  const g = Math.pow(1 + annualInflationPercent / 100, 1 / q) - 1;
  return Number.isFinite(g) ? g : null;
}

/**
 * First withdrawal for a growing annuity that moves PV → −FV over n periods.
 * Withdrawals grow by g each period; interest r per period; type 0/1 timing.
 * Sign: returns positive withdrawal amount.
 */
export function firstWithdrawalGrowing(
  pv: number,
  fv: number,
  r: number,
  g: number,
  n: number,
  timing: WithdrawalTiming
): number | null {
  if (![pv, fv, r, g, n].every(Number.isFinite) || !(n > 0)) return null;
  if (!(pv >= 0) || fv < 0) return null;
  const type = timingType(timing);

  // Target: after n withdrawals (+ interest), balance ≈ fv.
  // Equivalent: PV_of_withdrawals + PV_of_fv = pv
  // Using TVM with level real payment when g≈0, else growing annuity PV.
  if (Math.abs(g) < RATE_TOL) {
    return firstWithdrawalLevel(pv, fv, r, n, timing);
  }

  if (r <= -1 || 1 + g <= 0) return null;

  // Present value of growing withdrawals (first payment W at t=0 if beginning,
  // or t=1 if end): standard growing-annuity discount.
  // We solve W from:
  //   pv = PV(growing W) + fv / (1+r)^n
  // Ordinary (end): PV = W * (1 − ((1+g)/(1+r))^n) / (r − g)   when r≠g
  // Due (begin): PV = ordinary * (1+r)  — first payment undiscounted relative to end form shift
  // More carefully for due: PV = W + W*(1+g)/(1+r) + … + W*(1+g)^(n−1)/(1+r)^(n−1)
  //          = W * (1 − ((1+g)/(1+r))^n) / (1 − (1+g)/(1+r)) when ratios differ

  const discFv = fv / Math.pow(1 + r, n);
  if (!Number.isFinite(discFv)) return null;
  const capitalForWithdrawals = pv - discFv;
  if (!(capitalForWithdrawals > 0) && !(Math.abs(capitalForWithdrawals) < 1e-9)) {
    // Need withdrawals that leave residual — if capital too small for fv alone
    if (capitalForWithdrawals < 0) return null;
  }

  let annuityFactor: number;
  if (Math.abs(r - g) < RATE_TOL) {
    // r ≈ g
    if (type === 1) {
      annuityFactor = n; // W * n when each payment grows with r and begin
      // begin with r=g: W * sum_{k=0}^{n-1} ((1+g)/(1+r))^k = W * n
    } else {
      annuityFactor = n / (1 + r);
    }
  } else {
    const ratio = (1 + g) / (1 + r);
    if (!(ratio > 0) || !Number.isFinite(ratio)) return null;
    const geom = (1 - Math.pow(ratio, n)) / (1 - ratio);
    if (!Number.isFinite(geom)) return null;
    annuityFactor = type === 1 ? geom : geom / (1 + r);
  }

  if (!(annuityFactor > 0)) return null;
  const w = capitalForWithdrawals / annuityFactor;
  return Number.isFinite(w) && w >= 0 ? w : null;
}

export function firstWithdrawalLevel(
  pv: number,
  fv: number,
  r: number,
  n: number,
  timing: WithdrawalTiming
): number | null {
  if (![pv, fv, r, n].every(Number.isFinite) || !(n > 0)) return null;
  const type = timingType(timing);
  // Nest egg PV>0, desired ending balance fv≥0 → W = (PV(1+r)^n − fv) / annuityFactor
  if (Math.abs(r) < RATE_TOL) {
    const w = (pv - fv) / n;
    return Number.isFinite(w) && w >= 0 ? w : null;
  }
  if (r <= -1) return null;
  const growth = Math.pow(1 + r, n);
  if (!Number.isFinite(growth)) return null;
  const denom = ((growth - 1) / r) * (1 + r * type);
  if (!Number.isFinite(denom) || Math.abs(denom) < 1e-15) return null;
  const w = (pv * growth - fv) / denom;
  return Number.isFinite(w) && w >= 0 ? w : null;
}

/**
 * Periods until balance reaches endBalance under fixed (or growing) withdrawals.
 */
export function periodsUntilEndBalance(
  pv: number,
  withdrawal0: number,
  r: number,
  g: number,
  timing: WithdrawalTiming,
  endBalance: number
): { periods: number; neverDepletes: boolean } | null {
  if (
    ![pv, withdrawal0, r, g, endBalance].every(Number.isFinite) ||
    !(pv >= 0) ||
    !(withdrawal0 > 0) ||
    endBalance < 0
  ) {
    return null;
  }
  if (r <= -1 || 1 + g <= 0) return null;

  const type = timingType(timing);
  let bal = pv;
  let w = withdrawal0;
  let periods = 0;

  while (periods < MAX_PERIODS) {
    if (bal <= endBalance + 1e-9) {
      return { periods, neverDepletes: false };
    }

    // Interest-first vs withdrawal-first depends on timing.
    if (type === 1) {
      // Beginning: withdraw then earn interest on remainder
      if (bal - endBalance < w - 1e-12 && periods > 0) {
        // Partial final withdrawal would be needed; count this period if we withdraw
        return { periods, neverDepletes: false };
      }
      bal -= w;
      if (bal < endBalance - 1e-9) {
        return { periods: periods + 1, neverDepletes: false };
      }
      bal *= 1 + r;
    } else {
      // End: earn interest then withdraw
      bal *= 1 + r;
      if (bal - endBalance < w - 1e-12 && bal - endBalance > 0) {
        return { periods: periods + 1, neverDepletes: false };
      }
      bal -= w;
      if (bal < endBalance - 1e-9) {
        return { periods: periods + 1, neverDepletes: false };
      }
    }

    periods += 1;
    w *= 1 + g;

    // Detect perpetual growth (balance rising)
    if (periods > 24 && bal > pv * 1.5 && w < bal * r) {
      // Heuristic: withdrawals not keeping up — may never hit endBalance
      // Continue until MAX; caller checks neverDepletes
    }
  }

  return { periods: MAX_PERIODS, neverDepletes: true };
}

function buildYearlyBalances(params: {
  startingBalance: number;
  withdrawal0: number;
  r: number;
  g: number;
  timing: WithdrawalTiming;
  totalPeriods: number;
  periodsPerYear: number;
  retireAge: number;
  retirementStartYear: number;
  endBalance: number;
}): YearBalancePoint[] {
  const {
    startingBalance,
    withdrawal0,
    r,
    g,
    timing,
    totalPeriods,
    periodsPerYear,
    retireAge,
    retirementStartYear,
    endBalance,
  } = params;
  const type = timingType(timing);
  const points: YearBalancePoint[] = [
    {
      calendarYear: retirementStartYear,
      age: retireAge,
      balance: startingBalance,
    },
  ];

  let bal = startingBalance;
  let w = withdrawal0;
  const years = Math.ceil(totalPeriods / periodsPerYear);

  for (let y = 0; y < years; y++) {
    const periodsThisYear = Math.min(
      periodsPerYear,
      totalPeriods - y * periodsPerYear
    );
    for (let p = 0; p < periodsThisYear; p++) {
      if (type === 1) {
        bal -= w;
        bal *= 1 + r;
      } else {
        bal *= 1 + r;
        bal -= w;
      }
      w *= 1 + g;
      if (bal < 0) bal = 0;
    }
    if (bal < endBalance) bal = Math.max(0, bal);
    points.push({
      calendarYear: retirementStartYear + y + 1,
      age: retireAge + y + 1,
      balance: bal,
    });
  }

  return points;
}

function frequencyWord(freq: PaymentFrequency): string {
  switch (freq) {
    case 'annually':
      return 'year';
    case 'semiannually':
      return 'half-year';
    case 'quarterly':
      return 'quarter';
    case 'monthly':
      return 'month';
    case 'semimonthly':
      return 'semi-month';
    case 'biweekly':
      return 'biweek';
    case 'weekly':
      return 'week';
    case 'daily':
      return 'day';
    default:
      return 'period';
  }
}

/**
 * Core retirement-withdrawal engine (screenshot defaults → ≈ 600.25 PKR/mo).
 */
export function calculateRetirementWithdrawal(
  input: RetirementWithdrawalCanonicalInput
): RetirementWithdrawalResult | null {
  const {
    mode,
    currency,
    balanceAtRetirement,
    ageNow,
    retireAge,
    yearsInRetirement,
    withdrawalAmount,
    annualInterestRatePercent,
    inflationBeforePercent,
    inflationAfterPercent,
    paymentFrequency,
    compounding,
    timing,
    endBalance,
    baseCalendarYear,
  } = input;

  if (
    ![
      balanceAtRetirement,
      ageNow,
      retireAge,
      annualInterestRatePercent,
      inflationBeforePercent,
      inflationAfterPercent,
      endBalance,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(balanceAtRetirement >= 0) || endBalance < 0) return null;
  if (!(ageNow >= 0) || !(retireAge >= ageNow) || retireAge > 120) return null;
  if (annualInterestRatePercent < -99 || annualInterestRatePercent > 100) {
    return null;
  }
  if (inflationBeforePercent < -50 || inflationBeforePercent > 100) return null;
  if (inflationAfterPercent < -50 || inflationAfterPercent > 100) return null;

  const yearsToRetirement = retireAge - ageNow;
  const q = paymentsPerYear(paymentFrequency);
  const rNom = periodRateFromAnnual(
    annualInterestRatePercent,
    compounding,
    paymentFrequency
  );
  if (rNom === null || rNom <= -1) return null;

  const g = periodGrowthFromAnnual(inflationAfterPercent, paymentFrequency);
  if (g === null) return null;

  // Pre-retirement inflation: treat entered balance as today’s purchasing power
  // of the nest egg, grown to retirement-start nominal dollars.
  const startingBalance =
    balanceAtRetirement *
    Math.pow(1 + inflationBeforePercent / 100, yearsToRetirement);
  if (!Number.isFinite(startingBalance) || startingBalance < 0) return null;

  // Real rate approach when post-retirement inflation grows withdrawals:
  // first withdrawal is solved with nominal r and growth g.
  const symbol = getCurrencySymbol(currency);
  const freqLabel =
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === paymentFrequency)
      ?.label ?? 'Monthly';
  const timingPhrase =
    timing === 'beginning' ? 'beginning of' : 'end of';
  const periodWord = frequencyWord(paymentFrequency);
  const retirementStartYear = baseCalendarYear + yearsToRetirement;

  let withdrawal = 0;
  let years = yearsInRetirement;
  let totalPeriods = 0;
  let neverDepletes = false;

  if (mode === 'withdrawal') {
    if (!(yearsInRetirement > 0) || yearsInRetirement > 120) return null;
    totalPeriods = Math.round(yearsInRetirement * q);
    if (!(totalPeriods > 0)) return null;

    const w = firstWithdrawalGrowing(
      startingBalance,
      endBalance,
      rNom,
      g,
      totalPeriods,
      timing
    );
    if (w === null) return null;
    withdrawal = w;
  } else {
    if (!(withdrawalAmount > 0)) return null;
    withdrawal = withdrawalAmount;
    const solved = periodsUntilEndBalance(
      startingBalance,
      withdrawal,
      rNom,
      g,
      timing,
      endBalance
    );
    if (!solved) return null;
    neverDepletes = solved.neverDepletes;
    totalPeriods = solved.periods;
    years = totalPeriods / q;
  }

  const yearlyBalances = buildYearlyBalances({
    startingBalance,
    withdrawal0: withdrawal,
    r: rNom,
    g,
    timing,
    totalPeriods: neverDepletes
      ? Math.min(totalPeriods, q * 40)
      : totalPeriods,
    periodsPerYear: q,
    retireAge,
    retirementStartYear,
    endBalance,
  });

  const formattedWithdrawal = `${symbol}${formatRetirementMoney(withdrawal, currency)}`;
  const formattedStarting = `${symbol}${formatRetirementMoney(startingBalance, currency)}`;
  const formattedEnd = `${symbol}${formatRetirementMoney(endBalance, currency)}`;

  const yearsWhole = Math.floor(years);
  const monthsRem = Math.round((years - yearsWhole) * 12);
  const formattedDuration =
    neverDepletes
      ? 'Does not deplete within the modeled horizon'
      : yearsWhole > 0 && monthsRem > 0
        ? `${yearsWhole} yr ${monthsRem} mo`
        : yearsWhole > 0
          ? `${yearsWhole} year${yearsWhole === 1 ? '' : 's'}`
          : `${Math.max(1, Math.round(years * 12))} month${Math.round(years * 12) === 1 ? '' : 's'}`;

  const summaryMessage = neverDepletes
    ? `At ${formattedWithdrawal} per ${periodWord}, the balance does not fall to ${formattedEnd} within ${MAX_PERIODS / q} years under these rates — withdrawals may be sustainable indefinitely.`
    : mode === 'withdrawal'
      ? `You can withdraw ${formattedWithdrawal} at the ${timingPhrase} each ${periodWord} to reach about ${formattedEnd} by the end of your ${yearsInRetirement}-year retirement.`
      : `Withdrawing ${formattedWithdrawal} at the ${timingPhrase} each ${periodWord}, your money lasts about ${formattedDuration}.`;

  const depletedExactly =
    !neverDepletes &&
    endBalance === 0 &&
    yearlyBalances.length > 0 &&
    yearlyBalances[yearlyBalances.length - 1]!.balance < startingBalance * 0.02;

  return {
    mode,
    currency,
    balanceAtRetirementEntered: balanceAtRetirement,
    startingBalance,
    ageNow,
    retireAge,
    yearsToRetirement,
    yearsInRetirement: years,
    withdrawalAmount: withdrawal,
    endBalance,
    annualInterestRatePercent,
    inflationBeforePercent,
    inflationAfterPercent,
    paymentFrequency,
    compounding,
    timing,
    periodsPerYear: q,
    totalPeriods,
    periodRate: rNom,
    neverDepletes,
    depletedExactly,
    summaryMessage,
    frequencyLabel: freqLabel,
    timingPhrase,
    formattedWithdrawal,
    formattedStartingBalance: formattedStarting,
    formattedEndBalance: formattedEnd,
    formattedDuration,
    yearlyBalances,
    assumptionNotes: [
      `Period rate from ${annualInterestRatePercent}% APR with ${compounding} compounding and ${freqLabel.toLowerCase()} withdrawals.`,
      inflationBeforePercent !== 0
        ? `Pre-retirement inflation ${inflationBeforePercent}%/yr grows today’s nest-egg figure over ${yearsToRetirement} years to retirement.`
        : 'Pre-retirement inflation is 0% — entered balance is used at retirement start.',
      inflationAfterPercent !== 0
        ? `Withdrawals grow with ${inflationAfterPercent}%/yr post-retirement inflation.`
        : 'Post-retirement inflation is 0% — level withdrawals in nominal terms.',
      'Currency labels amounts only (no FX conversion).',
    ],
  };
}

/** Screenshot default worked example (yearly compound, monthly begin). */
export function screenshotDefaultWithdrawal(): number {
  const r = periodRateFromAnnual(4, 'annually', 'monthly');
  if (r === null) return NaN;
  const w = firstWithdrawalLevel(100_000, 0, r, 240, 'beginning');
  return w ?? NaN;
}
