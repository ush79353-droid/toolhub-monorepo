import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  type CompoundFrequency,
  type DepositTiming,
  type MillionaireInput,
  type MillionaireResult,
  type SavingsProjectionRow,
} from './types';

/** Cap search / projection horizon at 150 years. */
export const MAX_YEARS = 150;

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function getCompoundingMeta(frequency: CompoundFrequency) {
  return (
    COMPOUNDING_OPTIONS.find((o) => o.value === frequency) ??
    COMPOUNDING_OPTIONS.find((o) => o.value === 'monthly')!
  );
}

/**
 * Periodic interest rate i for the deposit/compound cadence.
 * Discrete: r/m. Continuous (monthly deposits): e^(r/m) − 1.
 */
export function calculatePeriodicInterestRate(
  annualRateDecimal: number,
  frequency: CompoundFrequency,
): number | null {
  if (!Number.isFinite(annualRateDecimal) || annualRateDecimal < 0) return null;
  const meta = getCompoundingMeta(frequency);
  const m = meta.periodsPerYear;
  if (!(m > 0)) return null;
  if (annualRateDecimal === 0) return 0;
  if (meta.continuous) {
    const i = Math.exp(annualRateDecimal / m) - 1;
    return Number.isFinite(i) && i > -1 ? i : null;
  }
  const i = annualRateDecimal / m;
  return Number.isFinite(i) && i > -1 ? i : null;
}

export function calculateSavingsFutureValue(input: {
  initialSavings: number;
  periodicDeposit: number;
  periodicRate: number;
  numberOfPeriods: number;
  depositTiming: DepositTiming;
}): number | null {
  const {
    initialSavings: pv,
    periodicDeposit: pmt,
    periodicRate: i,
    numberOfPeriods: n,
    depositTiming,
  } = input;

  if (![pv, pmt, i, n].every(Number.isFinite)) return null;
  if (pv < 0 || pmt < 0 || i < 0 || n < 0) return null;

  if (n === 0) return pv;

  if (Math.abs(i) < 1e-15) {
    return pv + pmt * n;
  }

  const growth = Math.pow(1 + i, n);
  if (!Number.isFinite(growth)) return null;
  const annuity = ((growth - 1) / i) * (depositTiming === 'beginning' ? 1 + i : 1);
  const fv = pv * growth + pmt * annuity;
  return Number.isFinite(fv) ? fv : null;
}

/**
 * Exact periods n to reach target (may be fractional). Null if unreachable.
 */
export function calculatePeriodsToGoal(input: {
  targetAmount: number;
  initialSavings: number;
  periodicDeposit: number;
  periodicRate: number;
  depositTiming: DepositTiming;
  maxPeriods: number;
}): number | null {
  const {
    targetAmount: fv,
    initialSavings: pv,
    periodicDeposit: pmt,
    periodicRate: i,
    depositTiming,
    maxPeriods,
  } = input;

  if (![fv, pv, pmt, i, maxPeriods].every(Number.isFinite)) return null;
  if (!(fv > 0) || pv < 0 || pmt < 0 || i < 0 || !(maxPeriods > 0)) return null;

  if (pv >= fv) return 0;

  if (Math.abs(i) < 1e-15) {
    if (pmt <= 0) return null;
    const n = (fv - pv) / pmt;
    if (!(n >= 0) || !Number.isFinite(n)) return null;
    return n <= maxPeriods ? n : null;
  }

  if (pmt === 0) {
    if (!(pv > 0)) return null;
    const n = Math.log(fv / pv) / Math.log(1 + i);
    if (!(n >= 0) || !Number.isFinite(n)) return null;
    return n <= maxPeriods ? n : null;
  }

  // Closed form from FV equation
  const due = depositTiming === 'beginning' ? 1 + i : 1;
  const numerator = fv + (pmt * due) / i;
  const denominator = pv + (pmt * due) / i;
  if (!(numerator > 0) || !(denominator > 0)) return null;
  const ratio = numerator / denominator;
  if (!(ratio > 1)) {
    // ratio <= 1 means already at/over goal or cannot grow toward it
    return pv >= fv ? 0 : null;
  }
  const n = Math.log(ratio) / Math.log(1 + i);
  if (!(n >= 0) || !Number.isFinite(n)) return null;
  return n <= maxPeriods ? n : null;
}

export function calculateInflationAdjustedValue(
  futureValue: number,
  inflationRateDecimal: number,
  years: number,
): number | null {
  if (![futureValue, inflationRateDecimal, years].every(Number.isFinite)) {
    return null;
  }
  if (futureValue < 0 || years < 0 || inflationRateDecimal <= -1) return null;
  if (Math.abs(inflationRateDecimal) < 1e-15) return futureValue;
  const pv = futureValue / Math.pow(1 + inflationRateDecimal, years);
  return Number.isFinite(pv) ? pv : null;
}

function ceilPeriods(n: number): number {
  if (!(n > 0)) return 0;
  return Math.max(1, Math.ceil(n - 1e-12));
}

export function generateSavingsProjection(input: {
  initialSavings: number;
  periodicDeposit: number;
  periodicRate: number;
  periodsPerYear: number;
  totalPeriods: number;
  depositTiming: DepositTiming;
}): SavingsProjectionRow[] {
  const {
    initialSavings,
    periodicDeposit,
    periodicRate,
    periodsPerYear,
    totalPeriods,
    depositTiming,
  } = input;

  const rows: SavingsProjectionRow[] = [];
  const yearsSpan = Math.max(1, Math.ceil(totalPeriods / periodsPerYear));
  const yearStep = yearsSpan > 40 ? Math.ceil(yearsSpan / 40) : 1;

  const pushAt = (periods: number, yearLabel: number) => {
    const balance =
      calculateSavingsFutureValue({
        initialSavings,
        periodicDeposit,
        periodicRate,
        numberOfPeriods: periods,
        depositTiming,
      }) ?? initialSavings;
    const contributions = periodicDeposit * periods;
    const interestEarned = Math.max(
      0,
      balance - initialSavings - contributions,
    );
    rows.push({
      year: yearLabel,
      balance,
      contributions,
      interestEarned,
      initialSavings,
    });
  };

  pushAt(0, 0);
  for (let y = yearStep; y < yearsSpan; y += yearStep) {
    const periods = Math.min(totalPeriods, Math.round(y * periodsPerYear));
    pushAt(periods, y);
  }
  if (totalPeriods > 0) {
    const lastYear = Math.max(1, Math.round((totalPeriods / periodsPerYear) * 100) / 100);
    const last = rows[rows.length - 1];
    if (!last || last.year !== lastYear) {
      pushAt(totalPeriods, Math.ceil(totalPeriods / periodsPerYear));
    } else {
      // Refresh last row at exact total periods
      rows[rows.length - 1] = {
        year: Math.ceil(totalPeriods / periodsPerYear),
        balance:
          calculateSavingsFutureValue({
            initialSavings,
            periodicDeposit,
            periodicRate,
            numberOfPeriods: totalPeriods,
            depositTiming,
          }) ?? last.balance,
        contributions: periodicDeposit * totalPeriods,
        interestEarned: Math.max(
          0,
          (calculateSavingsFutureValue({
            initialSavings,
            periodicDeposit,
            periodicRate,
            numberOfPeriods: totalPeriods,
            depositTiming,
          }) ?? last.balance) -
            initialSavings -
            periodicDeposit * totalPeriods,
        ),
        initialSavings,
      };
    }
  }

  return rows;
}

export function formatMillionaireMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMoneyWithSymbol(
  amount: number,
  currency: SupportedCurrency,
): string {
  return `${getCurrencySymbol(currency)}${formatMillionaireMoney(amount, currency)}`;
}

export function formatDurationLabel(
  years: number,
  months: number,
): string {
  const yearPart =
    years <= 0 ? '' : years === 1 ? '1 year' : `${years} years`;
  const monthPart =
    months <= 0 ? '' : months === 1 ? '1 month' : `${months} months`;
  if (yearPart && monthPart) return `${yearPart} and ${monthPart}`;
  if (yearPart) return yearPart;
  if (monthPart) return monthPart;
  return '0 months';
}

export function calculateMillionaireGoal(input: {
  targetAmount: number;
  initialSavings: number;
  annualInterestRatePercent: number;
  compoundFrequency: CompoundFrequency;
  additionalDeposit: number;
  depositTiming: DepositTiming;
  inflationRatePercent: number;
  currency: SupportedCurrency;
}): MillionaireResult | null {
  const {
    targetAmount,
    initialSavings,
    annualInterestRatePercent,
    compoundFrequency,
    additionalDeposit,
    depositTiming,
    inflationRatePercent,
    currency,
  } = input;

  if (
    ![
      targetAmount,
      initialSavings,
      annualInterestRatePercent,
      additionalDeposit,
      inflationRatePercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(targetAmount > 0) || initialSavings < 0 || additionalDeposit < 0) {
    return null;
  }
  if (annualInterestRatePercent < 0 || inflationRatePercent < -99) return null;

  const meta = getCompoundingMeta(compoundFrequency);
  const periodsPerYear = meta.periodsPerYear;
  const r = annualInterestRatePercent / 100;
  const i = calculatePeriodicInterestRate(r, compoundFrequency);
  if (i === null) return null;

  const maxPeriods = MAX_YEARS * periodsPerYear;
  const money = (v: number) => formatMoneyWithSymbol(v, currency);

  if (initialSavings >= targetAmount) {
    const inflationAdjusted =
      calculateInflationAdjustedValue(initialSavings, inflationRatePercent / 100, 0) ??
      initialSavings;
    return {
      targetAmount,
      initialSavings,
      annualInterestRatePercent,
      compoundFrequency,
      additionalDeposit,
      depositTiming,
      inflationRatePercent,
      periodsPerYear,
      totalPeriods: 0,
      yearsToGoal: 0,
      monthsToGoal: 0,
      totalMonths: 0,
      fractionalYears: 0,
      finalSavings: initialSavings,
      totalContributions: 0,
      totalInterest: 0,
      inflationAdjustedValue: inflationAdjusted,
      goalAlreadyAchieved: true,
      goalReachable: true,
      status: 'achieved',
      statusMessage: 'You have already reached your savings goal!',
      durationLabel: '0 months',
      summaryText: [
        `Millionaire Calculator`,
        `Goal: ${money(targetAmount)}; already reached with ${money(initialSavings)}.`,
      ].join('\n'),
      projection: [
        {
          year: 0,
          balance: initialSavings,
          contributions: 0,
          interestEarned: 0,
          initialSavings,
        },
      ],
      currency,
    };
  }

  const rawPeriods = calculatePeriodsToGoal({
    targetAmount,
    initialSavings,
    periodicDeposit: additionalDeposit,
    periodicRate: i,
    depositTiming,
    maxPeriods,
  });

  if (rawPeriods === null) {
    return {
      targetAmount,
      initialSavings,
      annualInterestRatePercent,
      compoundFrequency,
      additionalDeposit,
      depositTiming,
      inflationRatePercent,
      periodsPerYear,
      totalPeriods: 0,
      yearsToGoal: 0,
      monthsToGoal: 0,
      totalMonths: 0,
      fractionalYears: 0,
      finalSavings: initialSavings,
      totalContributions: 0,
      totalInterest: 0,
      inflationAdjustedValue: initialSavings,
      goalAlreadyAchieved: false,
      goalReachable: false,
      status: 'unreachable',
      statusMessage:
        'Your savings goal cannot be reached with the current inputs. Increase your periodic contributions or adjust your investment assumptions.',
      durationLabel: '—',
      summaryText: [
        `Millionaire Calculator`,
        `Goal: ${money(targetAmount)}; unreachable with current inputs.`,
      ].join('\n'),
      projection: [],
      currency,
    };
  }

  const totalPeriods = ceilPeriods(rawPeriods);
  const finalSavings =
    calculateSavingsFutureValue({
      initialSavings,
      periodicDeposit: additionalDeposit,
      periodicRate: i,
      numberOfPeriods: totalPeriods,
      depositTiming,
    }) ?? targetAmount;

  const totalContributions = additionalDeposit * totalPeriods;
  const totalInterest = Math.max(
    0,
    finalSavings - initialSavings - totalContributions,
  );

  const fractionalYears = totalPeriods / periodsPerYear;
  const totalMonths = Math.round(fractionalYears * 12);
  const yearsToGoal = Math.floor(totalMonths / 12);
  const monthsToGoal = totalMonths % 12;
  const durationLabel = formatDurationLabel(yearsToGoal, monthsToGoal);

  const inflationAdjustedValue =
    calculateInflationAdjustedValue(
      finalSavings,
      inflationRatePercent / 100,
      fractionalYears,
    ) ?? finalSavings;

  const projection = generateSavingsProjection({
    initialSavings,
    periodicDeposit: additionalDeposit,
    periodicRate: i,
    periodsPerYear,
    totalPeriods,
    depositTiming,
  });

  const statusMessage = `You can reach your ${money(targetAmount)} savings goal in approximately ${durationLabel}.`;

  const freqLabel =
    COMPOUNDING_OPTIONS.find((o) => o.value === compoundFrequency)?.label ??
    compoundFrequency;
  const timingLabel =
    depositTiming === 'beginning' ? 'beginning of period' : 'end of period';

  const summaryText = [
    'Millionaire Calculator',
    `Goal: ${money(targetAmount)}`,
    `Initial: ${money(initialSavings)} · Deposit: ${money(additionalDeposit)} / ${freqLabel.toLowerCase()} (${timingLabel})`,
    `Rate: ${annualInterestRatePercent}% · Duration: ${durationLabel}`,
    `Contributions: ${money(totalContributions)} · Interest: ${money(totalInterest)} · Final: ${money(finalSavings)}`,
    `Inflation ${inflationRatePercent}% → today’s purchasing power ≈ ${money(inflationAdjustedValue)}`,
  ].join('\n');

  return {
    targetAmount,
    initialSavings,
    annualInterestRatePercent,
    compoundFrequency,
    additionalDeposit,
    depositTiming,
    inflationRatePercent,
    periodsPerYear,
    totalPeriods,
    yearsToGoal,
    monthsToGoal,
    totalMonths,
    fractionalYears,
    finalSavings,
    totalContributions,
    totalInterest,
    inflationAdjustedValue,
    goalAlreadyAchieved: false,
    goalReachable: true,
    status: 'reachable',
    statusMessage,
    durationLabel,
    summaryText,
    projection,
    currency,
  };
}

export function shareMillionaireText(result: MillionaireResult): string {
  return result.summaryText;
}

export function isMillionaireInputBlank(input: MillionaireInput): boolean {
  return (
    input.targetAmount.trim() === '' &&
    input.initialSavings.trim() === '' &&
    input.annualInterestRate.trim() === '' &&
    input.additionalDeposit.trim() === '' &&
    input.inflationRate.trim() === ''
  );
}
