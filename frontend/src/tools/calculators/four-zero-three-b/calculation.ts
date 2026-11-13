import {
  MAX_MATCH_RATE,
  MAX_MONEY,
  MONEY_STEP,
  PERCENT_STEP,
  type ContributionFrequency,
  type FourZeroThreeBInput,
  type FourZeroThreeBResult,
  type ProjectionYear,
  type RateConvention,
} from './types';

/**
 * Default compounding is nominal: periodRate = annualRate / periodsPerYear.
 * Effective annual compounding is used only when rateConvention is `effective`:
 * periodRate = (1 + annualRate) ^ (1 / periods) − 1.
 * A single run never mixes the two. The fee uses the same convention as the return.
 * Growth and fees are simple multiples of the balance invested that period
 * (they do not compound on each other inside the period). Contributions at the
 * beginning of the period are invested immediately. Contributions at the end
 * earn nothing that period. Every dollar is an integer number of cents, and
 * starting balance + employee deposits + vested employer deposits + growth − fees
 * equals the ending balance.
 */

export function periodsPerYear(frequency: ContributionFrequency): number {
  if (frequency === 'monthly') return 12;
  if (frequency === 'biweekly') return 26;
  return 1;
}

export function periodRate(
  annualRate: number,
  periods: number,
  convention: RateConvention,
): number {
  if (periods <= 0 || !Number.isFinite(annualRate)) return Number.NaN;
  if (convention === 'effective') {
    if (annualRate <= -1) return Number.NaN;
    return (1 + annualRate) ** (1 / periods) - 1;
  }
  return annualRate / periods;
}

function toCents(amount: number): number {
  return Math.round(amount * 100);
}

function fromCents(cents: number): number {
  return cents / 100;
}

function splitCents(total: number, parts: number): number[] {
  const base = Math.trunc(total / parts);
  const remainder = total - base * parts;
  const out = Array.from({ length: parts }, () => base);
  for (let i = 0; i < remainder; i += 1) out[i] += 1;
  return out;
}

function deflateCents(cents: number, inflationRate: number, years: number): number {
  if (inflationRate === 0 || years === 0) return cents;
  return Math.round(cents / (1 + inflationRate) ** years);
}

function salaryCentsForYear(annualSalary: number, growth: number, year: number): number {
  return Math.max(0, toCents(annualSalary * (1 + growth) ** year));
}

function employeePercentForYear(input: FourZeroThreeBInput, year: number): number {
  return Math.min(1, Math.max(0, input.employeePercent + input.contributionIncrease * year));
}

function employeeAnnualCents(input: FourZeroThreeBInput, salaryCents: number, year: number): number {
  if (input.contributionKind === 'fixed') {
    const grown = input.employeeFixedAnnual * (1 + input.contributionIncrease) ** year;
    return Math.max(0, toCents(grown));
  }
  return Math.max(0, Math.round(salaryCents * employeePercentForYear(input, year)));
}

function grossEmployerCents(
  input: FourZeroThreeBInput,
  salaryCents: number,
  employeeCents: number,
): number {
  if (input.matchKind === 'none' || salaryCents <= 0) return 0;
  if (input.matchKind === 'fixed-percent') {
    return Math.max(0, Math.round(salaryCents * input.fixedEmployerPercent));
  }
  const eligible = Math.min(employeeCents, Math.max(0, Math.round(salaryCents * input.matchUpToPercent)));
  return Math.max(0, Math.round(eligible * input.matchRate));
}

function applyContributionLimits(
  input: FourZeroThreeBInput,
  age: number,
  employeeCents: number,
  employerCents: number,
): { employee: number; employer: number; reduced: boolean } {
  if (!input.applyLimits || input.electiveDeferralLimit === null) {
    return { employee: employeeCents, employer: employerCents, reduced: false };
  }
  let employeeCap = toCents(input.electiveDeferralLimit);
  const catchUpApplies =
    input.catchUpAmount !== null &&
    input.catchUpAmount > 0 &&
    input.catchUpAge !== null &&
    age >= input.catchUpAge;
  if (catchUpApplies && input.catchUpAmount !== null) {
    employeeCap += toCents(input.catchUpAmount);
  }
  let employee = Math.min(employeeCents, Math.max(0, employeeCap));
  let employer = employerCents;
  if (input.annualAdditionsLimit !== null) {
    const additions = Math.max(0, toCents(input.annualAdditionsLimit));
    employee = Math.min(employee, additions);
    employer = Math.min(employer, Math.max(0, additions - employee));
  }
  return {
    employee,
    employer,
    reduced: employee !== employeeCents || employer !== employerCents,
  };
}

interface Ledger {
  balance: number;
  employee: number;
  employer: number;
  vested: number;
  growth: number;
  fees: number;
  yearly: ProjectionYear[];
  firstYearSalary: number;
  firstYearEmployee: number;
  firstYearEmployer: number;
  firstYearEmployeePercent: number;
  limitsReduced: boolean;
}

function projectLedger(input: FourZeroThreeBInput): Ledger | null {
  const years = input.retirementAge - input.currentAge;
  const periods = periodsPerYear(input.frequency);
  const returnRate = periodRate(input.annualReturn, periods, input.rateConvention);
  const feeRate = periodRate(input.annualFeeRate, periods, input.rateConvention);
  if (!Number.isFinite(returnRate) || !Number.isFinite(feeRate) || 1 + returnRate - feeRate < 0) {
    return null;
  }

  let balance = toCents(input.balance);
  let employeeTotal = 0;
  let employerTotal = 0;
  let vestedTotal = 0;
  let growthTotal = 0;
  let feeTotal = 0;
  let limitsReduced = false;
  const yearly: ProjectionYear[] = [];
  let firstYearSalary = 0;
  let firstYearEmployee = 0;
  let firstYearEmployer = 0;
  let firstYearEmployeePercent = 0;

  for (let year = 0; year < years; year += 1) {
    const age = input.currentAge + year;
    const salaryCents = salaryCentsForYear(input.annualSalary, input.salaryGrowthRate, year);
    const desiredEmployee = employeeAnnualCents(input, salaryCents, year);
    const desiredEmployer = grossEmployerCents(input, salaryCents, desiredEmployee);
    const capped = applyContributionLimits(input, age, desiredEmployee, desiredEmployer);
    if (capped.reduced) limitsReduced = true;
    const vested = Math.max(0, Math.round(capped.employer * input.vestingPercent));
    const employeeParts = splitCents(capped.employee, periods);
    const vestedParts = splitCents(vested, periods);
    let yearGrowth = 0;
    let yearFees = 0;

    for (let period = 0; period < periods; period += 1) {
      const contrib = employeeParts[period] + vestedParts[period];
      const invested = input.timing === 'beginning' ? balance + contrib : balance;
      const growth = Math.round(invested * returnRate);
      const fee = Math.round(invested * feeRate);
      balance = invested + growth - fee + (input.timing === 'end' ? contrib : 0);
      if (!Number.isSafeInteger(balance)) return null;
      yearGrowth += growth;
      yearFees += fee;
    }

    employeeTotal += capped.employee;
    employerTotal += capped.employer;
    vestedTotal += vested;
    growthTotal += yearGrowth;
    feeTotal += yearFees;
    if (year === 0) {
      firstYearSalary = fromCents(salaryCents);
      firstYearEmployee = fromCents(capped.employee);
      firstYearEmployer = fromCents(capped.employer);
      firstYearEmployeePercent = salaryCents > 0 ? capped.employee / salaryCents : 0;
    }
    yearly.push({
      year: year + 1,
      age,
      salary: fromCents(salaryCents),
      employeeContribution: fromCents(capped.employee),
      employerContribution: fromCents(capped.employer),
      vestedEmployerContribution: fromCents(vested),
      investmentGrowth: fromCents(yearGrowth),
      fees: fromCents(yearFees),
      endBalance: fromCents(balance),
      inflationAdjustedBalance: fromCents(deflateCents(balance, input.inflationRate, year + 1)),
    });
  }

  if (
    balance !==
    toCents(input.balance) + employeeTotal + vestedTotal + growthTotal - feeTotal
  ) {
    return null;
  }

  return {
    balance,
    employee: employeeTotal,
    employer: employerTotal,
    vested: vestedTotal,
    growth: growthTotal,
    fees: feeTotal,
    yearly,
    firstYearSalary,
    firstYearEmployee,
    firstYearEmployer,
    firstYearEmployeePercent,
    limitsReduced,
  };
}

function ledgerResult(
  input: FourZeroThreeBInput,
  ledger: Ledger,
  solved: Pick<
    FourZeroThreeBResult,
    'impossible' | 'solvedEmployeePercent' | 'solvedEmployeeFixedAnnual' | 'solvedSalary' | 'solvedEmployerRate'
  >,
): FourZeroThreeBResult {
  const years = input.retirementAge - input.currentAge;
  return {
    mode: input.mode,
    impossible: solved.impossible,
    finalBalance: fromCents(ledger.balance),
    inflationAdjustedBalance: fromCents(deflateCents(ledger.balance, input.inflationRate, years)),
    employeeContributions: fromCents(ledger.employee),
    employerContributions: fromCents(ledger.employer),
    vestedEmployerContributions: fromCents(ledger.vested),
    investmentGrowth: fromCents(ledger.growth),
    fees: fromCents(ledger.fees),
    startingBalance: fromCents(toCents(input.balance)),
    years,
    firstYearSalary: ledger.firstYearSalary,
    firstYearEmployeeContribution: ledger.firstYearEmployee,
    firstYearEmployerContribution: ledger.firstYearEmployer,
    firstYearEmployeePercent: ledger.firstYearEmployeePercent,
    solvedEmployeePercent: solved.solvedEmployeePercent,
    solvedEmployeeFixedAnnual: solved.solvedEmployeeFixedAnnual,
    solvedSalary: solved.solvedSalary,
    solvedEmployerRate: solved.solvedEmployerRate,
    limitsReducedAContribution: ledger.limitsReduced,
    accountType: input.accountType,
    rateConvention: input.rateConvention,
    frequency: input.frequency,
    yearly: ledger.yearly,
  };
}

const UNSOLVED = {
  impossible: false,
  solvedEmployeePercent: null,
  solvedEmployeeFixedAnnual: null,
  solvedSalary: null,
  solvedEmployerRate: null,
} as const;

function balanceAt(input: FourZeroThreeBInput): number | null {
  const ledger = projectLedger(input);
  return ledger ? ledger.balance : null;
}

/**
 * Lowest multiple of `step` in [0, max] whose projection reaches `targetCents`.
 * ponytail: integer binary search on the step grid. A closed form would need a
 * schedule with no caps, no vesting fraction, and no per-period rounding.
 */
function solveMinimum(
  max: number,
  step: number,
  targetCents: number,
  project: (value: number) => number | null,
): { value: number; impossible: boolean } | null {
  const decimals = step < 1 ? 4 : 2;
  const fromTick = (tick: number) => Number((tick * step).toFixed(decimals));
  const maxTick = Math.round(max / step);
  const at = (tick: number) => project(fromTick(tick));
  const atMax = at(maxTick);
  const atZero = at(0);
  if (atMax === null || atZero === null) return null;
  if (atMax < targetCents) return { value: fromTick(maxTick), impossible: true };
  if (atZero >= targetCents) return { value: 0, impossible: false };

  let low = 0;
  let high = maxTick;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const midBalance = at(mid);
    if (midBalance === null) return null;
    if (midBalance >= targetCents) high = mid;
    else low = mid + 1;
  }
  const reached = at(low);
  if (reached === null) return null;
  return { value: fromTick(low), impossible: reached < targetCents };
}

function projectSolved(input: FourZeroThreeBInput): FourZeroThreeBResult | null {
  const ledger = projectLedger(input);
  if (!ledger) return null;
  return ledgerResult(input, ledger, UNSOLVED);
}

function inputCanProject(input: FourZeroThreeBInput): boolean {
  const years = input.retirementAge - input.currentAge;
  if (!Number.isInteger(years) || years < 1 || years > 60) return false;
  const rates = [
    input.balance,
    input.annualSalary,
    input.salaryGrowthRate,
    input.annualReturn,
    input.annualFeeRate,
    input.inflationRate,
    input.vestingPercent,
    input.contributionIncrease,
  ];
  if (rates.some((value) => !Number.isFinite(value))) return false;
  if (input.balance < 0 || input.annualSalary < 0 || input.vestingPercent < 0 || input.vestingPercent > 1) {
    return false;
  }
  const periods = periodsPerYear(input.frequency);
  const earned = periodRate(input.annualReturn, periods, input.rateConvention);
  const fee = periodRate(input.annualFeeRate, periods, input.rateConvention);
  if (!Number.isFinite(earned) || !Number.isFinite(fee) || 1 + earned - fee < 0) return false;
  if (input.mode !== 'balance') {
    if (input.targetBalance === null || !Number.isFinite(input.targetBalance) || input.targetBalance <= 0) {
      return false;
    }
  }
  return true;
}

export function calculateFourZeroThreeB(input: FourZeroThreeBInput): FourZeroThreeBResult | null {
  if (!inputCanProject(input)) return null;
  if (input.mode === 'balance') return projectSolved(input);

  const target = input.targetBalance;
  if (target === null) return null;
  const targetCents = toCents(target);

  if (input.mode === 'employee-contribution') {
    if (input.contributionKind === 'fixed') {
      const solved = solveMinimum(MAX_MONEY, MONEY_STEP, targetCents, (amount) =>
        balanceAt({ ...input, employeeFixedAnnual: amount }),
      );
      if (!solved) return null;
      const next = { ...input, employeeFixedAnnual: solved.value };
      const ledger = projectLedger(next);
      if (!ledger) return null;
      return ledgerResult(next, ledger, {
        ...UNSOLVED,
        impossible: solved.impossible,
        solvedEmployeeFixedAnnual: solved.value,
      });
    }
    const solved = solveMinimum(1, PERCENT_STEP, targetCents, (percent) =>
      balanceAt({ ...input, contributionKind: 'percent', employeePercent: percent }),
    );
    if (!solved) return null;
    const next = { ...input, contributionKind: 'percent' as const, employeePercent: solved.value };
    const ledger = projectLedger(next);
    if (!ledger) return null;
    return ledgerResult(next, ledger, {
      ...UNSOLVED,
      impossible: solved.impossible,
      solvedEmployeePercent: solved.value,
    });
  }

  if (input.scenarioSolve === 'salary') {
    const solved = solveMinimum(MAX_MONEY, 1, targetCents, (salary) =>
      balanceAt({ ...input, annualSalary: salary }),
    );
    if (!solved) return null;
    const next = { ...input, annualSalary: solved.value };
    const ledger = projectLedger(next);
    if (!ledger) return null;
    return ledgerResult(next, ledger, {
      ...UNSOLVED,
      impossible: solved.impossible,
      solvedSalary: solved.value,
    });
  }

  const employerInput: FourZeroThreeBInput =
    input.matchKind === 'none'
      ? { ...input, matchKind: 'fixed-percent', fixedEmployerPercent: 0 }
      : input;
  const maxRate = employerInput.matchKind === 'percent-of-contribution' ? MAX_MATCH_RATE : 1;
  const solved = solveMinimum(maxRate, PERCENT_STEP, targetCents, (rate) =>
    balanceAt(
      employerInput.matchKind === 'fixed-percent'
        ? { ...employerInput, fixedEmployerPercent: rate }
        : { ...employerInput, matchRate: rate },
    ),
  );
  if (!solved) return null;
  const next: FourZeroThreeBInput =
    employerInput.matchKind === 'fixed-percent'
      ? { ...employerInput, fixedEmployerPercent: solved.value }
      : { ...employerInput, matchRate: solved.value };
  const ledger = projectLedger(next);
  if (!ledger) return null;
  return ledgerResult(next, ledger, {
    ...UNSOLVED,
    impossible: solved.impossible,
    solvedEmployerRate: solved.value,
  });
}
