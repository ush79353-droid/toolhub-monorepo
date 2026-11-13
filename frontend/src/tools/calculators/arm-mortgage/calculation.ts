import {
  structureTiming,
  type ArmMortgageInput,
  type ArmMortgageResult,
  type ArmScheduleRow,
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

/** Standard fully amortizing payment in cents. r is monthly decimal. */
export function amortizingPaymentCents(balanceCents: number, monthlyRate: number, remaining: number): number {
  if (remaining <= 0 || balanceCents <= 0) return 0;
  if (monthlyRate <= 0) return Math.round(balanceCents / remaining);
  const growth = (1 + monthlyRate) ** remaining;
  const payment = (balanceCents * monthlyRate * growth) / (growth - 1);
  return Math.round(payment);
}

function monthlyRateFromAnnual(annualPercent: number): number {
  return annualPercent / 100 / MONTHS;
}

function roundRate(rate: number): number {
  return Math.round(rate * 10000) / 10000;
}

/**
 * Apply increase caps and optional floor.
 * Downward moves are not periodically capped; only the optional floor and 0% bound them.
 */
export function applyRateCaps(options: {
  currentRate: number;
  initialRate: number;
  uncappedRate: number;
  isFirstAdjustment: boolean;
  initialCap: number;
  subsequentCap: number;
  lifetimeCap: number;
  rateFloor: number | null;
}): number {
  const cap = options.isFirstAdjustment ? options.initialCap : options.subsequentCap;
  let next = options.uncappedRate;
  if (next > options.currentRate + cap) next = options.currentRate + cap;
  const lifetimeMax = options.initialRate + options.lifetimeCap;
  if (next > lifetimeMax) next = lifetimeMax;
  if (options.rateFloor !== null && next < options.rateFloor) next = options.rateFloor;
  if (next < 0) next = 0;
  return roundRate(next);
}

function uncappedTarget(input: ArmMortgageInput, currentRate: number): number {
  if (input.useIndexMargin) return roundRate(input.indexRate + input.margin);
  if (input.scenario === 'rising') return roundRate(currentRate + input.scenarioStepPercent);
  if (input.scenario === 'falling') return roundRate(currentRate - input.scenarioStepPercent);
  return roundRate(input.projectedAnnualRate);
}

function isAdjustmentMonth(monthIndex: number, fixedMonths: number, every: number): boolean {
  if (monthIndex < fixedMonths) return false;
  return (monthIndex - fixedMonths) % every === 0;
}

export function calculateArmMortgage(input: ArmMortgageInput): ArmMortgageResult {
  const { fixedMonths, adjustEveryMonths } = structureTiming(input.structure);
  const totalMonths = Math.round(input.termYears * 12);
  let balance = Math.round(input.principal * 100);
  let annualRate = roundRate(input.initialAnnualRate);
  let payment = amortizingPaymentCents(balance, monthlyRateFromAnnual(annualRate), totalMonths);

  const schedule: ArmScheduleRow[] = [];
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalPaid = 0;
  let firstAdjusted: number | null = null;
  let firstAdjustmentNumber: number | null = null;
  let isFirstAdjustment = true;
  let minPayment = payment;
  let maxPayment = payment;

  for (let i = 0; i < totalMonths && balance > 0; i += 1) {
    let adjusted = false;
    const remaining = totalMonths - i;
    if (isAdjustmentMonth(i, fixedMonths, adjustEveryMonths)) {
      const nextRate = applyRateCaps({
        currentRate: annualRate,
        initialRate: input.initialAnnualRate,
        uncappedRate: uncappedTarget(input, annualRate),
        isFirstAdjustment,
        initialCap: input.initialCap,
        subsequentCap: input.subsequentCap,
        lifetimeCap: input.lifetimeCap,
        rateFloor: input.rateFloor,
      });
      annualRate = nextRate;
      payment = amortizingPaymentCents(balance, monthlyRateFromAnnual(annualRate), remaining);
      adjusted = true;
      isFirstAdjustment = false;
      if (firstAdjusted === null) {
        firstAdjusted = payment;
        firstAdjustmentNumber = i + 1;
      }
    }

    const rate = monthlyRateFromAnnual(annualRate);
    let interest = Math.round(balance * rate);
    if (interest < 0) interest = 0;
    let due = payment;
    if (due >= balance + interest || remaining === 1) {
      due = balance + interest;
    }
    let principal = due - interest;
    if (principal > balance) {
      principal = balance;
      due = principal + interest;
    }
    if (principal < 0) {
      principal = 0;
      interest = due;
    }
    balance -= principal;
    if (balance < 0) balance = 0;

    totalInterest += interest;
    totalPrincipal += principal;
    totalPaid += due;
    minPayment = Math.min(minPayment, due);
    maxPayment = Math.max(maxPayment, due);

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

  const extras = Math.round(
    (input.propertyTaxMonthly +
      input.insuranceMonthly +
      input.hoaMonthly +
      input.mortgageInsuranceMonthly) *
      100
  );

  const stride = Math.max(1, Math.ceil(schedule.length / 120));
  const balanceCurve = schedule
    .filter((_, index) => index % stride === 0 || index === schedule.length - 1)
    .map((row) => ({ month: row.paymentNumber, balanceCents: row.balanceCents }));
  const paymentCurve = schedule
    .filter((row, index) => row.rateAdjusted || index % stride === 0 || index === schedule.length - 1)
    .map((row) => ({
      month: row.paymentNumber,
      paymentCents: row.paymentCents,
      adjusted: row.rateAdjusted,
    }));

  return {
    currency: input.currency,
    fixedMonths,
    adjustEveryMonths,
    initialPaymentCents: schedule[0]?.paymentCents ?? 0,
    firstAdjustedPaymentCents: firstAdjusted,
    firstAdjustmentPaymentNumber: firstAdjustmentNumber,
    maxPaymentCents: maxPayment,
    minPaymentCents: minPayment,
    totalInterestCents: totalInterest,
    totalPrincipalCents: totalPrincipal,
    totalPaymentsCents: totalPaid,
    payoffDate: schedule[schedule.length - 1]?.date ?? input.startDate,
    paymentCount: schedule.length,
    housingExtrasCents: extras,
    initialHousingPaymentCents: (schedule[0]?.paymentCents ?? 0) + extras,
    schedule,
    balanceCurve,
    paymentCurve,
  };
}
