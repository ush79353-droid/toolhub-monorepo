import {
  structureTiming,
  type ArmAdjustmentMilestone,
  type ArmMortgageInput,
  type ArmMortgageResult,
  type ArmScheduleRow,
  type ArmYearRow,
  type CompoundingFrequency,
} from './types';

function addMonths(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1 + months, 1));
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  const day = Math.min(d, last);
  const out = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), day));
  const mm = String(out.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(out.getUTCDate()).padStart(2, '0');
  return `${out.getUTCFullYear()}-${mm}-${dd}`;
}

export function effectiveMonthlyRate(
  annualPercent: number,
  compounding: CompoundingFrequency = 'monthly'
): number {
  const r = annualPercent / 100;
  if (r <= 0) return 0;
  if (compounding === 'semi-annual') {
    return (1 + r / 2) ** (2 / 12) - 1;
  }
  if (compounding === 'annual') {
    return (1 + r) ** (1 / 12) - 1;
  }
  return r / 12;
}

/** Standard fully amortizing payment in cents. r is the effective monthly decimal rate. */
export function amortizingPaymentCents(
  balanceCents: number,
  monthlyRate: number,
  remaining: number
): number {
  if (remaining <= 0 || balanceCents <= 0) return 0;
  if (monthlyRate <= 0) return Math.round(balanceCents / remaining);
  const growth = (1 + monthlyRate) ** remaining;
  const payment = (balanceCents * monthlyRate * growth) / (growth - 1);
  return Math.round(payment);
}

export function financingCents(
  input: Pick<ArmMortgageInput, 'balanceMode' | 'mortgageBalance' | 'homePrice' | 'downPayment' | 'downPaymentMode'>
): { priceCents: number; downCents: number; principalCents: number } {
  if (input.balanceMode === 'balance') {
    const principalCents = Math.round(Math.max(0, input.mortgageBalance ?? 0) * 100);
    return {
      priceCents: principalCents,
      downCents: 0,
      principalCents,
    };
  }
  const priceCents = Math.round(Math.max(0, input.homePrice ?? 0) * 100);
  const downCents =
    input.downPaymentMode === 'percent'
      ? Math.round((priceCents * Math.max(0, input.downPayment ?? 0)) / 100)
      : Math.round(Math.max(0, input.downPayment ?? 0) * 100);
  return { priceCents, downCents, principalCents: Math.max(0, priceCents - downCents) };
}

function roundRate(rate: number): number {
  return Math.round(rate * 10000) / 10000;
}

export function lifetimeRateBounds(
  input: Pick<ArmMortgageInput, 'adjustmentMethod' | 'initialAnnualRate' | 'rateCap' | 'rateFloor' | 'lifetimeIncreaseCap' | 'lifetimeDecreaseCap'>
): { ceiling: number; floor: number } {
  if (input.adjustmentMethod === 'expected-rate') {
    return {
      ceiling: roundRate(input.rateCap),
      floor: roundRate(Math.max(0, input.rateFloor)),
    };
  }
  return {
    ceiling: roundRate(input.initialAnnualRate + input.lifetimeIncreaseCap),
    floor: roundRate(Math.max(0, input.initialAnnualRate - input.lifetimeDecreaseCap)),
  };
}

export function applyRateCaps(options: {
  currentRate: number;
  initialRate: number;
  uncappedRate: number;
  isFirstAdjustment: boolean;
  initialCap: number;
  subsequentCap: number;
  lifetimeIncreaseCap: number;
  lifetimeDecreaseCap: number;
}): number {
  const cap = options.isFirstAdjustment ? options.initialCap : options.subsequentCap;
  let next = options.uncappedRate;
  if (next > options.currentRate + cap) next = options.currentRate + cap;
  if (next < options.currentRate - cap) next = options.currentRate - cap;
  const ceiling = roundRate(options.initialRate + options.lifetimeIncreaseCap);
  const floor = roundRate(Math.max(0, options.initialRate - options.lifetimeDecreaseCap));
  if (next > ceiling) next = ceiling;
  if (next < floor) next = floor;
  if (next < 0) next = 0;
  return roundRate(next);
}

function isAdjustmentMonth(monthIndex: number, fixedMonths: number, every: number): boolean {
  if (every < 1 || monthIndex < fixedMonths) return false;
  return (monthIndex - fixedMonths) % every === 0;
}

export function assumedFullyIndexedRate(input: ArmMortgageInput, adjustmentIndex: number): number {
  const base = input.indexRate + input.margin;
  if (input.scenario === 'rising') return roundRate(base + input.scenarioStepPercent * adjustmentIndex);
  if (input.scenario === 'falling') return roundRate(base - input.scenarioStepPercent * adjustmentIndex);
  return roundRate(base);
}

export function calculateActuarialApr(
  netPrincipalCents: number,
  paymentCentsList: number[]
): number {
  if (netPrincipalCents <= 0 || paymentCentsList.length === 0) return 0;
  const target = netPrincipalCents;
  const pv = (monthlyRate: number): number => {
    let sum = 0;
    for (let i = 0; i < paymentCentsList.length; i += 1) {
      sum += paymentCentsList[i] / (1 + monthlyRate) ** (i + 1);
    }
    return sum;
  };
  let low = 0;
  let high = 1.0;
  if (pv(0) <= target) return 0;
  for (let iter = 0; iter < 60; iter += 1) {
    const mid = (low + high) / 2;
    if (pv(mid) > target) {
      low = mid;
    } else {
      high = mid;
    }
  }
  const monthlyIrr = (low + high) / 2;
  return roundRate(monthlyIrr * 12 * 100);
}

interface Simulation {
  schedule: ArmScheduleRow[];
  totalInterest: number;
  totalPrincipal: number;
  totalPaid: number;
  firstAdjusted: number | null;
  firstAdjustmentNumber: number | null;
  firstAdjustedRate: number | null;
  minPayment: number;
  maxPayment: number;
  maxRate: number;
  yearlyEndingRates: number[];
}

function simulate(
  input: ArmMortgageInput,
  principalCents: number,
  targetAtReset: (adjustmentIndex: number, currentRate: number) => number
): Simulation {
  const { fixedMonths, adjustEveryMonths } = structureTiming(input);
  const totalMonths = Math.round(input.termYears * 12);
  let balance = principalCents;
  let annualRate = roundRate(input.initialAnnualRate);
  let monthlyRate = effectiveMonthlyRate(annualRate, input.compounding);
  let payment = amortizingPaymentCents(balance, monthlyRate, totalMonths);

  const schedule: ArmScheduleRow[] = [];
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalPaid = 0;
  let firstAdjusted: number | null = null;
  let firstAdjustmentNumber: number | null = null;
  let firstAdjustedRate: number | null = null;
  let isFirstAdjustment = true;
  let adjustmentIndex = 0;
  let minPayment = payment;
  let maxPayment = payment;
  let maxRate = annualRate;
  const yearlyEndingRates: number[] = [];

  for (let i = 0; i < totalMonths && balance > 0; i += 1) {
    let adjusted = false;
    const remaining = totalMonths - i;
    if (isAdjustmentMonth(i, fixedMonths, adjustEveryMonths)) {
      const nextRate = targetAtReset(adjustmentIndex, annualRate);
      if (nextRate !== annualRate || isFirstAdjustment) {
        annualRate = nextRate;
        monthlyRate = effectiveMonthlyRate(annualRate, input.compounding);
        payment = amortizingPaymentCents(balance, monthlyRate, remaining);
      }
      adjusted = true;
      if (firstAdjusted === null) {
        firstAdjusted = payment;
        firstAdjustmentNumber = i + 1;
        firstAdjustedRate = annualRate;
      }
      isFirstAdjustment = false;
      adjustmentIndex += 1;
    }

    const rate = effectiveMonthlyRate(annualRate, input.compounding);
    const interest = Math.max(0, Math.round(balance * rate));
    let due = payment;
    if (due >= balance + interest || remaining === 1) {
      due = balance + interest;
    }
    let principal = due - interest;
    if (principal < 0) {
      principal = 0;
      due = interest;
    }
    if (principal > balance) {
      principal = balance;
      due = principal + interest;
    }
    balance -= principal;

    totalInterest += interest;
    totalPrincipal += principal;
    totalPaid += due;

    // We track scheduled monthly payment range
    minPayment = Math.min(minPayment, payment);
    maxPayment = Math.max(maxPayment, payment);
    maxRate = Math.max(maxRate, annualRate);

    schedule.push({
      paymentNumber: i + 1,
      date: addMonths(input.startDate, i + 1),
      annualRate,
      paymentCents: due,
      principalCents: principal,
      interestCents: interest,
      balanceCents: balance,
      rateAdjusted: adjusted,
    });

    if ((i + 1) % 12 === 0 || i === totalMonths - 1) {
      yearlyEndingRates.push(annualRate);
    }
  }

  return {
    schedule,
    totalInterest,
    totalPrincipal,
    totalPaid,
    firstAdjusted,
    firstAdjustmentNumber,
    firstAdjustedRate,
    minPayment,
    maxPayment,
    maxRate,
    yearlyEndingRates,
  };
}

function buildYearly(schedule: ArmScheduleRow[]): ArmYearRow[] {
  const years: ArmYearRow[] = [];
  for (const row of schedule) {
    const year = Math.floor((row.paymentNumber - 1) / 12) + 1;
    let bucket = years[years.length - 1];
    if (!bucket || bucket.year !== year) {
      bucket = {
        year,
        endingRate: row.annualRate,
        lastPaymentCents: row.paymentCents,
        principalCents: 0,
        interestCents: 0,
        balanceCents: row.balanceCents,
        adjusted: false,
      };
      years.push(bucket);
    }
    bucket.principalCents += row.principalCents;
    bucket.interestCents += row.interestCents;
    bucket.balanceCents = row.balanceCents;
    bucket.endingRate = row.annualRate;
    bucket.lastPaymentCents = row.paymentCents;
    bucket.adjusted = bucket.adjusted || row.rateAdjusted;
  }
  return years;
}

function buildMilestones(
  schedule: ArmScheduleRow[],
  yearly: ArmYearRow[]
): ArmAdjustmentMilestone[] {
  return yearly.map((yearRow) => {
    const paymentRow = schedule.find((r) => r.paymentNumber === (yearRow.year - 1) * 12 + 1) ?? schedule[0];
    return {
      year: yearRow.year,
      month: yearRow.year * 12,
      rate: yearRow.endingRate,
      monthlyPaymentCents: paymentRow?.paymentCents ?? yearRow.lastPaymentCents,
      annualInterestCents: yearRow.interestCents,
      annualPrincipalCents: yearRow.principalCents,
      endingBalanceCents: yearRow.balanceCents,
      isAdjustment: yearRow.adjusted,
    };
  });
}

export function calculateArmMortgage(input: ArmMortgageInput): ArmMortgageResult {
  const { fixedMonths, adjustEveryMonths } = structureTiming(input);
  const { downCents, principalCents } = financingCents(input);
  const { ceiling, floor } = lifetimeRateBounds(input);
  const fullyIndexed = roundRate(input.indexRate + input.margin);
  const housingExtrasMonthly = Math.round(
    (input.propertyTaxMonthly + input.insuranceMonthly + input.hoaMonthly + input.mortgageInsuranceMonthly) * 100
  );
  const totalMonths = Math.max(1, Math.round(input.termYears * 12));
  const totalHousingExtras = housingExtrasMonthly * totalMonths;
  const upfrontFeesCents = Math.round(Math.max(0, input.upfrontFees ?? 0) * 100);
  const additionalCostsCents = upfrontFeesCents + totalHousingExtras;

  const emptyPayment = amortizingPaymentCents(
    Math.max(0, principalCents),
    effectiveMonthlyRate(input.initialAnnualRate, input.compounding),
    totalMonths
  );

  if (principalCents <= 0 || input.termYears <= 0) {
    return {
      currency: input.currency,
      principalCents: Math.max(0, principalCents),
      downPaymentCents: downCents,
      termYears: input.termYears,
      fixedMonths,
      adjustEveryMonths,
      initialRate: input.initialAnnualRate,
      rateCap: ceiling,
      rateFloor: floor,
      fullyIndexedRate: fullyIndexed,
      projectedRateAfterFirstReset: null,
      maximumPermittedRate: ceiling,
      minimumPermittedRate: floor,
      initialPaymentCents: 0,
      firstAdjustedPaymentCents: null,
      firstAdjustmentPaymentNumber: null,
      paymentDifferenceCents: null,
      minPaymentCents: 0,
      maxPaymentCents: 0,
      paymentRangeDisplay: '0',
      averageRate: input.initialAnnualRate,
      actuarialApr: input.initialAnnualRate,
      maxProjectedPaymentCents: 0,
      minProjectedPaymentCents: 0,
      maxProjectedRate: input.initialAnnualRate,
      contractualMaxPaymentCents: 0,
      totalInterestCents: 0,
      totalPrincipalCents: 0,
      totalPaymentsCents: upfrontFeesCents,
      upfrontFeesCents,
      additionalCostsCents,
      totalCostWithExtrasCents: additionalCostsCents,
      payoffDate: input.startDate,
      paymentCount: 0,
      housingExtrasCents: housingExtrasMonthly,
      initialHousingPaymentCents: housingExtrasMonthly,
      adjustmentMilestones: [],
      schedule: [],
      yearlySchedule: [],
    };
  }

  const resolveTargetRate = (
    adjustmentIndex: number,
    currentRate: number,
    forceMax = false
  ): number => {
    if (input.adjustmentMethod === 'expected-rate') {
      const step = forceMax
        ? input.periodicCap > 0
          ? input.periodicCap
          : Math.max(input.expectedAdjustment, 1)
        : input.expectedAdjustment;
      let next = currentRate + step;
      if (input.periodicCap > 0) {
        if (next > currentRate + input.periodicCap) next = currentRate + input.periodicCap;
        if (next < currentRate - input.periodicCap) next = currentRate - input.periodicCap;
      }
      if (next > ceiling) next = ceiling;
      if (next < floor) next = floor;
      return roundRate(next);
    }
    const uncapped = forceMax ? ceiling + 1 : assumedFullyIndexedRate(input, adjustmentIndex);
    return applyRateCaps({
      currentRate,
      initialRate: input.initialAnnualRate,
      uncappedRate: uncapped,
      isFirstAdjustment: adjustmentIndex === 0,
      initialCap: input.initialCap,
      subsequentCap: input.subsequentCap,
      lifetimeIncreaseCap: input.lifetimeIncreaseCap,
      lifetimeDecreaseCap: input.lifetimeDecreaseCap,
    });
  };

  const modeled = simulate(input, principalCents, (index, curRate) => resolveTargetRate(index, curRate, false));
  const cappedPath = simulate(input, principalCents, (index, curRate) => resolveTargetRate(index, curRate, true));
  const initialPayment = emptyPayment;
  const yearlySchedule = buildYearly(modeled.schedule);
  const milestones = buildMilestones(modeled.schedule, yearlySchedule);

  const averageRate =
    yearlySchedule.length > 0
      ? roundRate(yearlySchedule.reduce((sum, row) => sum + row.endingRate, 0) / yearlySchedule.length)
      : input.initialAnnualRate;

  const paymentCentsList = modeled.schedule.map((r) => r.paymentCents);
  const netPrincipalCents = principalCents - upfrontFeesCents;
  const actuarialApr = calculateActuarialApr(netPrincipalCents, paymentCentsList);

  const minPayment = modeled.minPayment;
  const maxPayment = modeled.maxPayment;

  return {
    currency: input.currency,
    principalCents,
    downPaymentCents: downCents,
    termYears: input.termYears,
    fixedMonths,
    adjustEveryMonths,
    initialRate: roundRate(input.initialAnnualRate),
    rateCap: ceiling,
    rateFloor: floor,
    fullyIndexedRate: fullyIndexed,
    projectedRateAfterFirstReset: modeled.firstAdjustedRate,
    maximumPermittedRate: ceiling,
    minimumPermittedRate: floor,
    initialPaymentCents: initialPayment,
    firstAdjustedPaymentCents: modeled.firstAdjusted,
    firstAdjustmentPaymentNumber: modeled.firstAdjustmentNumber,
    paymentDifferenceCents:
      modeled.firstAdjusted === null ? null : modeled.firstAdjusted - initialPayment,
    minPaymentCents: minPayment,
    maxPaymentCents: maxPayment,
    paymentRangeDisplay: `${minPayment} – ${maxPayment}`,
    averageRate,
    actuarialApr,
    maxProjectedPaymentCents: modeled.maxPayment,
    minProjectedPaymentCents: modeled.minPayment,
    maxProjectedRate: modeled.maxRate,
    contractualMaxPaymentCents: cappedPath.maxPayment,
    totalInterestCents: modeled.totalInterest,
    totalPrincipalCents: modeled.totalPrincipal,
    totalPaymentsCents: modeled.totalPaid + upfrontFeesCents,
    upfrontFeesCents,
    additionalCostsCents,
    totalCostWithExtrasCents: modeled.totalPaid + additionalCostsCents,
    payoffDate: modeled.schedule[modeled.schedule.length - 1]?.date ?? input.startDate,
    paymentCount: modeled.schedule.length,
    housingExtrasCents: housingExtrasMonthly,
    initialHousingPaymentCents: initialPayment + housingExtrasMonthly,
    adjustmentMilestones: milestones,
    schedule: modeled.schedule,
    yearlySchedule,
  };
}
