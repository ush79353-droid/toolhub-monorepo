import {
  structureTiming,
  type ArmMortgageInput,
  type ArmMortgageResult,
  type ArmScheduleRow,
  type ArmYearRow,
} from './types';

const MONTHS = 12;

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

/** Standard fully amortizing payment in cents. r is the monthly decimal rate. */
export function amortizingPaymentCents(balanceCents: number, monthlyRate: number, remaining: number): number {
  if (remaining <= 0 || balanceCents <= 0) return 0;
  if (monthlyRate <= 0) return Math.round(balanceCents / remaining);
  const growth = (1 + monthlyRate) ** remaining;
  const payment = (balanceCents * monthlyRate * growth) / (growth - 1);
  return Math.round(payment);
}

export function financingCents(
  input: Pick<ArmMortgageInput, 'homePrice' | 'downPayment' | 'downPaymentMode'>
): { priceCents: number; downCents: number; principalCents: number } {
  const priceCents = Math.round(input.homePrice * 100);
  const downCents =
    input.downPaymentMode === 'percent'
      ? Math.round((priceCents * input.downPayment) / 100)
      : Math.round(input.downPayment * 100);
  return { priceCents, downCents, principalCents: priceCents - downCents };
}

function monthlyRateFromAnnual(annualPercent: number): number {
  return annualPercent / 100 / MONTHS;
}

function roundRate(rate: number): number {
  return Math.round(rate * 10000) / 10000;
}

export function lifetimeRateBounds(initialRate: number, increaseCap: number, decreaseCap: number): {
  ceiling: number;
  floor: number;
} {
  return {
    ceiling: roundRate(initialRate + increaseCap),
    floor: roundRate(Math.max(0, initialRate - decreaseCap)),
  };
}

/**
 * Clamp an uncapped reset to the periodic band, then to the lifetime ceiling and floor.
 * The periodic cap limits both increases and decreases. The lifetime bounds win if they
 * sit inside that band.
 */
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
  const { ceiling, floor } = lifetimeRateBounds(
    options.initialRate,
    options.lifetimeIncreaseCap,
    options.lifetimeDecreaseCap
  );
  if (next > ceiling) next = ceiling;
  if (next < floor) next = floor;
  if (next < 0) next = 0;
  return roundRate(next);
}

function isAdjustmentMonth(monthIndex: number, fixedMonths: number, every: number): boolean {
  if (every < 1 || monthIndex < fixedMonths) return false;
  return (monthIndex - fixedMonths) % every === 0;
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
}

function simulate(
  input: ArmMortgageInput,
  principalCents: number,
  targetAtReset: (adjustmentIndex: number) => number
): Simulation {
  const { fixedMonths, adjustEveryMonths } = structureTiming(input);
  const totalMonths = Math.round(input.termYears * 12);
  let balance = principalCents;
  let annualRate = roundRate(input.initialAnnualRate);
  let payment = amortizingPaymentCents(balance, monthlyRateFromAnnual(annualRate), totalMonths);

  const schedule: ArmScheduleRow[] = [];
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalPaid = 0;
  let firstAdjusted: number | null = null;
  let firstAdjustmentNumber: number | null = null;
  let firstAdjustedRate: number | null = null;
  let isFirstAdjustment = true;
  let adjustmentIndex = 0;
  let minPayment = Number.POSITIVE_INFINITY;
  let maxPayment = 0;
  let maxRate = annualRate;

  for (let i = 0; i < totalMonths && balance > 0; i += 1) {
    let adjusted = false;
    const remaining = totalMonths - i;
    if (isAdjustmentMonth(i, fixedMonths, adjustEveryMonths)) {
      annualRate = applyRateCaps({
        currentRate: annualRate,
        initialRate: input.initialAnnualRate,
        uncappedRate: targetAtReset(adjustmentIndex),
        isFirstAdjustment,
        initialCap: input.initialCap,
        subsequentCap: input.subsequentCap,
        lifetimeIncreaseCap: input.lifetimeIncreaseCap,
        lifetimeDecreaseCap: input.lifetimeDecreaseCap,
      });
      payment = amortizingPaymentCents(balance, monthlyRateFromAnnual(annualRate), remaining);
      adjusted = true;
      isFirstAdjustment = false;
      adjustmentIndex += 1;
      if (firstAdjusted === null) {
        firstAdjusted = payment;
        firstAdjustmentNumber = i + 1;
        firstAdjustedRate = annualRate;
      }
    }

    const rate = monthlyRateFromAnnual(annualRate);
    const interest = Math.max(0, Math.round(balance * rate));
    let due = payment;
    if (due >= balance + interest || remaining === 1) {
      due = balance + interest;
    }
    let principal = due - interest;
    if (principal < 0) {
      // A rounded payment can fall a cent short of interest. Raise it so the balance does not grow.
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
    minPayment = Math.min(minPayment, due);
    maxPayment = Math.max(maxPayment, due);
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
  };
}

/** Uncapped fully indexed rate at reset `adjustmentIndex` (0 = first reset). */
export function assumedFullyIndexedRate(input: ArmMortgageInput, adjustmentIndex: number): number {
  const base = input.indexRate + input.margin;
  if (input.scenario === 'rising') return roundRate(base + input.scenarioStepPercent * adjustmentIndex);
  if (input.scenario === 'falling') return roundRate(base - input.scenarioStepPercent * adjustmentIndex);
  return roundRate(base);
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

export function calculateArmMortgage(input: ArmMortgageInput): ArmMortgageResult {
  const { fixedMonths, adjustEveryMonths } = structureTiming(input);
  const { downCents, principalCents } = financingCents(input);
  const { ceiling, floor } = lifetimeRateBounds(
    input.initialAnnualRate,
    input.lifetimeIncreaseCap,
    input.lifetimeDecreaseCap
  );
  const fullyIndexed = roundRate(input.indexRate + input.margin);
  const extras = Math.round(
    (input.propertyTaxMonthly + input.insuranceMonthly + input.hoaMonthly + input.mortgageInsuranceMonthly) * 100
  );

  const emptyPayment = amortizingPaymentCents(
    Math.max(0, principalCents),
    monthlyRateFromAnnual(input.initialAnnualRate),
    Math.max(1, Math.round(input.termYears * 12))
  );

  if (principalCents <= 0 || input.termYears <= 0) {
    return {
      currency: input.currency,
      principalCents: Math.max(0, principalCents),
      downPaymentCents: downCents,
      fixedMonths,
      adjustEveryMonths,
      initialRate: input.initialAnnualRate,
      fullyIndexedRate: fullyIndexed,
      projectedRateAfterFirstReset: null,
      maximumPermittedRate: ceiling,
      minimumPermittedRate: floor,
      initialPaymentCents: 0,
      firstAdjustedPaymentCents: null,
      firstAdjustmentPaymentNumber: null,
      paymentDifferenceCents: null,
      maxProjectedPaymentCents: 0,
      minProjectedPaymentCents: 0,
      maxProjectedRate: input.initialAnnualRate,
      contractualMaxPaymentCents: 0,
      totalInterestCents: 0,
      totalPrincipalCents: 0,
      totalPaymentsCents: 0,
      payoffDate: input.startDate,
      paymentCount: 0,
      housingExtrasCents: extras,
      initialHousingPaymentCents: extras,
      schedule: [],
      yearlySchedule: [],
    };
  }

  const modeled = simulate(input, principalCents, (index) => assumedFullyIndexedRate(input, index));
  const cappedPath = simulate(input, principalCents, () => ceiling + 1);
  const initialPayment = emptyPayment;

  return {
    currency: input.currency,
    principalCents,
    downPaymentCents: downCents,
    fixedMonths,
    adjustEveryMonths,
    initialRate: roundRate(input.initialAnnualRate),
    fullyIndexedRate: fullyIndexed,
    projectedRateAfterFirstReset: modeled.firstAdjustedRate,
    maximumPermittedRate: ceiling,
    minimumPermittedRate: floor,
    initialPaymentCents: initialPayment,
    firstAdjustedPaymentCents: modeled.firstAdjusted,
    firstAdjustmentPaymentNumber: modeled.firstAdjustmentNumber,
    paymentDifferenceCents:
      modeled.firstAdjusted === null ? null : modeled.firstAdjusted - initialPayment,
    maxProjectedPaymentCents: modeled.maxPayment,
    minProjectedPaymentCents: modeled.minPayment,
    maxProjectedRate: modeled.maxRate,
    contractualMaxPaymentCents: cappedPath.maxPayment,
    totalInterestCents: modeled.totalInterest,
    totalPrincipalCents: modeled.totalPrincipal,
    totalPaymentsCents: modeled.totalPaid,
    payoffDate: modeled.schedule[modeled.schedule.length - 1]?.date ?? input.startDate,
    paymentCount: modeled.schedule.length,
    housingExtrasCents: extras,
    initialHousingPaymentCents: initialPayment + extras,
    schedule: modeled.schedule,
    yearlySchedule: buildYearly(modeled.schedule),
  };
}
