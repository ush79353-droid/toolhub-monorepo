import type { FiveTwentyNineInput, FiveTwentyNineResult, FiveTwentyNineYearRow } from './types';
import { validateFiveTwentyNineInput } from './validation';

interface Projection {
  balanceAtCollegeStart: number;
  firstYearCost: number;
  totalEducationCost: number;
  totalScholarships: number;
  netEducationCost: number;
  totalContributions: number;
  investmentGrowth: number;
  investmentFees: number;
  coveredByPlan: number;
  fundingGap: number;
  surplusBalance: number;
  rows: FiveTwentyNineYearRow[];
  yearCosts: number[];
  yearScholarships: number[];
}

function yearCostSchedule(input: FiveTwentyNineInput): { costs: number[]; scholarships: number[] } {
  const yearsUntil = input.collegeStartAge - input.currentAge;
  const growth = 1 + input.educationInflationPercent / 100;
  const first = input.currentAnnualCost * growth ** yearsUntil;
  const costs: number[] = [];
  const scholarships: number[] = [];
  for (let year = 0; year < input.collegeYears; year += 1) {
    const cost = first * growth ** year;
    const scholarship = Math.min(input.annualScholarship * growth ** (yearsUntil + year), cost);
    costs.push(cost);
    scholarships.push(scholarship);
  }
  return { costs, scholarships };
}

function growMonth(balance: number, input: FiveTwentyNineInput): { balance: number; growth: number; fee: number } {
  const growth = balance * (input.annualReturnPercent / 100 / 12);
  const fee = balance * (input.annualFeePercent / 100 / 12);
  const next = balance + growth - fee;
  if (next <= 0) {
    return { balance: 0, growth, fee: Math.min(fee, Math.max(0, balance + growth)) };
  }
  return { balance: next, growth, fee };
}

function project(input: FiveTwentyNineInput): Projection {
  const yearsUntil = input.collegeStartAge - input.currentAge;
  const months = yearsUntil * 12;
  const { costs, scholarships } = yearCostSchedule(input);
  const rows: FiveTwentyNineYearRow[] = [];

  let balance = input.currentBalance + input.initialLumpSum;
  let totalContributions = input.initialLumpSum;
  let investmentGrowth = 0;
  let investmentFees = 0;
  let monthly = input.monthlyContribution;
  const growthFactor = 1 + input.annualContributionGrowthPercent / 100;

  for (let month = 0; month < months; month += 1) {
    let yearContributions = 0;
    let yearGrowth = 0;
    let yearFees = 0;
    if (month % 12 === 0) {
      if (month > 0) monthly *= growthFactor;
      balance += input.additionalAnnualContribution;
      totalContributions += input.additionalAnnualContribution;
      yearContributions += input.additionalAnnualContribution;
    }

    const yearStart = month;
    const yearEnd = Math.min(month + 12, months);
    for (let cursor = yearStart; cursor < yearEnd; cursor += 1) {
      if (input.contributionTiming === 'beginning') {
        balance += monthly;
        totalContributions += monthly;
        yearContributions += monthly;
      }
      const step = growMonth(balance, input);
      balance = step.balance;
      investmentGrowth += step.growth;
      investmentFees += step.fee;
      yearGrowth += step.growth;
      yearFees += step.fee;
      if (input.contributionTiming === 'end') {
        balance += monthly;
        totalContributions += monthly;
        yearContributions += monthly;
      }
    }

    rows.push({
      year: rows.length + 1,
      phase: 'saving',
      endingBalance: balance,
      contributions: yearContributions,
      growth: yearGrowth,
      fees: yearFees,
      withdrawal: 0,
      educationCost: 0,
      scholarship: 0,
    });
    month = yearEnd - 1;
  }

  const balanceAtCollegeStart = balance;
  let coveredByPlan = 0;

  for (let year = 0; year < costs.length; year += 1) {
    const netCost = costs[year]! - scholarships[year]!;
    let withdrawal = 0;
    let yearGrowth = 0;
    let yearFees = 0;

    if (input.collegePaymentTiming === 'start') {
      withdrawal = Math.min(balance, netCost);
      balance -= withdrawal;
    }
    for (let stepIndex = 0; stepIndex < 12; stepIndex += 1) {
      const step = growMonth(balance, input);
      balance = step.balance;
      investmentGrowth += step.growth;
      investmentFees += step.fee;
      yearGrowth += step.growth;
      yearFees += step.fee;
    }
    if (input.collegePaymentTiming === 'end') {
      withdrawal = Math.min(balance, netCost);
      balance -= withdrawal;
    }
    coveredByPlan += withdrawal;
    rows.push({
      year: rows.length + 1,
      phase: 'college',
      endingBalance: balance,
      contributions: 0,
      growth: yearGrowth,
      fees: yearFees,
      withdrawal,
      educationCost: costs[year]!,
      scholarship: scholarships[year]!,
    });
  }

  const totalEducationCost = costs.reduce((sum, cost) => sum + cost, 0);
  const totalScholarships = scholarships.reduce((sum, amount) => sum + amount, 0);
  const netEducationCost = totalEducationCost - totalScholarships;
  const fundingGap = Math.max(0, netEducationCost - coveredByPlan);

  return {
    balanceAtCollegeStart,
    firstYearCost: costs[0] ?? 0,
    totalEducationCost,
    totalScholarships,
    netEducationCost,
    totalContributions,
    investmentGrowth,
    investmentFees,
    coveredByPlan,
    fundingGap,
    surplusBalance: balance,
    rows,
    yearCosts: costs,
    yearScholarships: scholarships,
  };
}

const SOLVER_STEPS = 60;
const SOLVER_CEILING = 1_000_000_000;

function solveMonthly(input: FiveTwentyNineInput, target: number): { value: number | null; impossible: boolean } {
  if (target <= 0) return { value: 0, impossible: false };
  const months = (input.collegeStartAge - input.currentAge) * 12;
  const covered = (monthlyContribution: number) =>
    project({ ...input, monthlyContribution }).coveredByPlan;

  if (covered(input.monthlyContribution) >= target && input.monthlyContribution === 0 && covered(0) >= target) {
    return { value: 0, impossible: false };
  }
  if (covered(0) >= target) return { value: 0, impossible: false };
  if (months === 0) return { value: null, impossible: true };
  if (covered(SOLVER_CEILING) + 0.01 < target) return { value: null, impossible: true };

  let low = 0;
  let high = SOLVER_CEILING;
  for (let step = 0; step < SOLVER_STEPS; step += 1) {
    const mid = (low + high) / 2;
    if (covered(mid) >= target) high = mid;
    else low = mid;
  }
  return { value: high, impossible: false };
}

export function calculateFiveTwentyNine(input: FiveTwentyNineInput): FiveTwentyNineResult | null {
  if (!validateFiveTwentyNineInput(input).isValid) return null;

  const projection = project(input);
  const target = (input.targetFundingPercent / 100) * projection.netEducationCost;
  const solved = solveMonthly(input, target);
  const firstYearDeposits =
    input.monthlyContribution * 12 + input.additionalAnnualContribution + input.initialLumpSum;
  const percentFunded =
    projection.totalEducationCost > 0
      ? ((projection.coveredByPlan + projection.totalScholarships) / projection.totalEducationCost) * 100
      : null;

  return {
    currency: input.currency,
    yearsUntilCollege: input.collegeStartAge - input.currentAge,
    monthsUntilCollege: (input.collegeStartAge - input.currentAge) * 12,
    monthlyReturnRate: input.annualReturnPercent / 100 / 12,
    monthlyFeeRate: input.annualFeePercent / 100 / 12,
    balanceAtCollegeStart: projection.balanceAtCollegeStart,
    firstYearCost: projection.firstYearCost,
    totalEducationCost: projection.totalEducationCost,
    totalScholarships: projection.totalScholarships,
    netEducationCost: projection.netEducationCost,
    totalContributions: projection.totalContributions,
    investmentGrowth: projection.investmentGrowth,
    investmentFees: projection.investmentFees,
    coveredByPlan: projection.coveredByPlan,
    fundingGap: projection.fundingGap,
    surplusBalance: projection.surplusBalance,
    percentFunded,
    requiredMonthlyContribution: solved.value,
    requiredContributionImpossible: solved.impossible,
    contributionExceedsAlert:
      input.annualContributionAlert !== null && firstYearDeposits > input.annualContributionAlert,
    rows: projection.rows,
  };
}
