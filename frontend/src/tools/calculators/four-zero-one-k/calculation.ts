import {
  MAX_MONEY,
  MONEY_STEP,
  PERCENT_STEP,
  type ContributionFrequency,
  type FourZeroOneKInput,
  type FourZeroOneKResult,
  type ProjectionYear,
} from './types';

/**
 * Effective annual compounding only:
 * periodRate = (1 + annualRate) ^ (1 / periodsPerYear) − 1.
 * The fee uses the same convention. Growth and fees are simple multiples of the
 * balance invested that period. Beginning-of-period contributions are invested
 * immediately. End-of-period contributions earn nothing that period.
 * Every dollar is an integer number of cents. Starting balance + employee
 * deposits + vested employer deposits + growth − fees equals the ending balance.
 * Traditional and Roth use the same projection. The account type does not change a dollar.
 */

export function periodsPerYear(frequency: ContributionFrequency): number {
  if (frequency === 'monthly') return 12;
  if (frequency === 'biweekly') return 26;
  return 1;
}

export function periodRate(annualRate: number, periods: number): number {
  if (periods <= 0 || !Number.isFinite(annualRate) || annualRate <= -1) return Number.NaN;
  return (1 + annualRate) ** (1 / periods) - 1;
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

function salaryCentsForYear(input: FourZeroOneKInput, year: number): number {
  const grown = Math.max(0, toCents(input.annualSalary * (1 + input.salaryGrowthRate) ** year));
  if (input.salaryCap === null) return grown;
  return Math.min(grown, Math.max(0, toCents(input.salaryCap)));
}

function employeePercentForYear(input: FourZeroOneKInput, year: number): number {
  return Math.min(1, Math.max(0, input.employeePercent + input.contributionIncrease * year));
}

function employeeAnnualCents(input: FourZeroOneKInput, salaryCents: number, year: number): number {
  if (input.contributionKind === 'fixed') {
    const grown = input.employeeFixedAnnual * (1 + input.contributionIncrease) ** year;
    return Math.max(0, toCents(grown));
  }
  return Math.max(0, Math.round(salaryCents * employeePercentForYear(input, year)));
}

function grossEmployerCents(
  input: FourZeroOneKInput,
  salaryCents: number,
  employeeCents: number,
): number {
  let match = 0;
  if (salaryCents > 0 && (input.matchKind === 'dollar-for-dollar' || input.matchKind === 'partial')) {
    const rate = input.matchKind === 'dollar-for-dollar' ? 1 : input.matchRate;
    const eligible = Math.min(employeeCents, Math.max(0, Math.round(salaryCents * input.matchUpToPercent)));
    match = Math.max(0, Math.round(eligible * rate));
  } else if (salaryCents > 0 && input.matchKind === 'fixed') {
    match = Math.max(0, Math.round(salaryCents * input.fixedEmployerPercent));
  }
  return match + Math.max(0, toCents(input.extraEmployerAnnual));
}

function limitsActive(input: FourZeroOneKInput): boolean {
  return input.applyLimits && input.currency === 'USD' && input.electiveDeferralLimit !== null;
}

function capEmployeeDeferral(
  input: FourZeroOneKInput,
  age: number,
  employeeCents: number,
): { employee: number; reduced: boolean } {
  if (!limitsActive(input) || input.electiveDeferralLimit === null) {
    return { employee: employeeCents, reduced: false };
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
  const employee = Math.min(employeeCents, Math.max(0, employeeCap));
  return { employee, reduced: employee !== employeeCents };
}

function applyAnnualAdditions(
  input: FourZeroOneKInput,
  employeeCents: number,
  employerCents: number,
  alreadyReduced: boolean,
): { employee: number; employer: number; reduced: boolean } {
  if (!limitsActive(input) || input.annualAdditionsLimit === null) {
    return { employee: employeeCents, employer: employerCents, reduced: alreadyReduced };
  }
  const additions = Math.max(0, toCents(input.annualAdditionsLimit));
  const employee = Math.min(employeeCents, additions);
  const employer = Math.min(employerCents, Math.max(0, additions - employee));
  return {
    employee,
    employer,
    reduced: alreadyReduced || employee !== employeeCents || employer !== employerCents,
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

function projectLedger(input: FourZeroOneKInput): Ledger | null {
  const years = input.retirementAge - input.currentAge;
  const periods = periodsPerYear(input.frequency);
  const returnRate = periodRate(input.annualReturn, periods);
  const feeRate = periodRate(input.annualFeeRate, periods);
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
    const salaryCents = salaryCentsForYear(input, year);
    const desiredEmployee = employeeAnnualCents(input, salaryCents, year);
    const employeeAfterDeferralCap = capEmployeeDeferral(input, age, desiredEmployee);
    const desiredEmployer = grossEmployerCents(input, salaryCents, employeeAfterDeferralCap.employee);
    const capped = applyAnnualAdditions(
      input,
      employeeAfterDeferralCap.employee,
      desiredEmployer,
      employeeAfterDeferralCap.reduced,
    );
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

  if (balance !== toCents(input.balance) + employeeTotal + vestedTotal + growthTotal - feeTotal) {
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

function fundingProgress(input: FourZeroOneKInput, balanceCents: number): number | null {
  if (input.targetBalance === null || input.targetBalance <= 0) return null;
  return fromCents(balanceCents) / input.targetBalance;
}

function withdrawalCents(balanceCents: number, rate: number | null): { annual: number | null; monthly: number | null } {
  if (rate === null) return { annual: null, monthly: null };
  const annual = Math.round(balanceCents * rate);
  return { annual: fromCents(annual), monthly: fromCents(Math.round(annual / 12)) };
}

function ledgerResult(
  input: FourZeroOneKInput,
  ledger: Ledger,
  solved: Pick<FourZeroOneKResult, 'impossible' | 'solvedEmployeePercent' | 'solvedEmployeeFixedAnnual'>,
): FourZeroOneKResult {
  const years = input.retirementAge - input.currentAge;
  const periods = periodsPerYear(input.frequency);
  const withdrawal = withdrawalCents(ledger.balance, input.withdrawalRate);
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
    totalContributions: fromCents(ledger.employee + ledger.employer),
    startingBalance: fromCents(toCents(input.balance)),
    years,
    firstYearSalary: ledger.firstYearSalary,
    firstYearEmployeeContribution: ledger.firstYearEmployee,
    firstYearEmployerContribution: ledger.firstYearEmployer,
    firstYearEmployeePercent: ledger.firstYearEmployeePercent,
    employeePerPeriod: fromCents(Math.round(toCents(ledger.firstYearEmployee) / periods)),
    employerPerPeriod: fromCents(Math.round(toCents(ledger.firstYearEmployer) / periods)),
    fundingProgress: fundingProgress(input, ledger.balance),
    solvedEmployeePercent: solved.solvedEmployeePercent,
    solvedEmployeeFixedAnnual: solved.solvedEmployeeFixedAnnual,
    limitsReducedAContribution: ledger.limitsReduced,
    limitsApplied: limitsActive(input),
    accountType: input.accountType,
    frequency: input.frequency,
    estimatedAnnualWithdrawal: withdrawal.annual,
    estimatedMonthlyWithdrawal: withdrawal.monthly,
    yearly: ledger.yearly,
  };
}

const UNSOLVED = {
  impossible: false,
  solvedEmployeePercent: null,
  solvedEmployeeFixedAnnual: null,
} as const;

function balanceAt(input: FourZeroOneKInput): number | null {
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

function inputCanProject(input: FourZeroOneKInput): boolean {
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
    input.extraEmployerAnnual,
  ];
  if (rates.some((value) => !Number.isFinite(value))) return false;
  if (input.balance < 0 || input.annualSalary < 0 || input.vestingPercent < 0 || input.vestingPercent > 1) {
    return false;
  }
  if (input.salaryCap !== null && (!Number.isFinite(input.salaryCap) || input.salaryCap < 0)) return false;
  if (input.withdrawalRate !== null && (!Number.isFinite(input.withdrawalRate) || input.withdrawalRate < 0)) {
    return false;
  }
  const periods = periodsPerYear(input.frequency);
  const earned = periodRate(input.annualReturn, periods);
  const fee = periodRate(input.annualFeeRate, periods);
  if (!Number.isFinite(earned) || !Number.isFinite(fee) || 1 + earned - fee < 0) return false;
  if (input.mode === 'required') {
    if (input.targetBalance === null || !Number.isFinite(input.targetBalance) || input.targetBalance <= 0) {
      return false;
    }
  }
  if (input.applyLimits && input.currency !== 'USD') return false;
  return true;
}

export function calculateFourZeroOneK(input: FourZeroOneKInput): FourZeroOneKResult | null {
  if (!inputCanProject(input)) return null;
  if (input.mode === 'balance') {
    const ledger = projectLedger(input);
    if (!ledger) return null;
    return ledgerResult(input, ledger, UNSOLVED);
  }

  const target = input.targetBalance;
  if (target === null) return null;
  const targetCents = toCents(target);

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
