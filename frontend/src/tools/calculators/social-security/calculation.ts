import {
  formatFraLabel,
  fullRetirementAgeForBirthYear,
  piaMultiplierForClaimAge,
  SSA_RULES_EFFECTIVE,
  SSA_RULES_SOURCE,
  type FullRetirementAge,
} from './ssa-rules';

export const CLAIM_AGES = [62, 63, 64, 65, 66, 67, 68, 69, 70] as const;

export type ClaimAge = (typeof CLAIM_AGES)[number];

export interface SocialSecurityMathInput {
  birthYear: number;
  lifeExpectancy: number;
  annualReturnPercent: number;
  colaPercent: number;
  /** Estimated monthly benefit at full retirement age (PIA). User-supplied. */
  piaMonthly: number;
}

export interface ClaimAgeScenario {
  claimAge: ClaimAge;
  multiplier: number;
  startingMonthlyBenefit: number;
  /** Undiscounted sum of COLA-adjusted monthly checks through life expectancy. */
  cumulativeNominal: number;
  /**
   * Future value at life expectancy of investing each benefit check at the
   * stated annual return (monthly effective compounding).
   */
  investedTerminalValue: number;
  monthsPaid: number;
}

export interface SocialSecurityMathResult {
  fra: FullRetirementAge;
  fraLabel: string;
  scenarios: ClaimAgeScenario[];
  idealClaimAge: ClaimAge;
  idealScenario: ClaimAgeScenario;
  /** First whole age where cumulative nominal of ideal catches claim-at-62 (if later). */
  breakEvenVs62Age: number | null;
  rulesSource: string;
  rulesEffective: string;
  timingNote: string;
}

export function monthlyRateFromAnnualPercent(annualReturnPercent: number): number {
  return Math.pow(1 + annualReturnPercent / 100, 1 / 12) - 1;
}

/**
 * Simulate COLA-adjusted monthly benefits from claim birthday through life
 * expectancy, optionally compounding each check in a portfolio.
 *
 * - COLA applies once per completed claim year (anniversary model).
 * - Portfolio: grow prior balance by monthly rate, then add this month's check.
 * - Life expectancy is treated as an attained age in whole years (payments stop
 *   at LE × 12 months from birth).
 */
export function simulateClaimPath(
  claimAge: ClaimAge,
  piaMonthly: number,
  multiplier: number,
  lifeExpectancy: number,
  colaPercent: number,
  annualReturnPercent: number
): Omit<ClaimAgeScenario, 'claimAge' | 'multiplier'> | null {
  if (!(piaMonthly > 0) || !Number.isFinite(piaMonthly)) return null;
  if (!(lifeExpectancy > claimAge) || !Number.isFinite(lifeExpectancy)) {
    return null;
  }
  if (!Number.isFinite(colaPercent) || colaPercent <= -100) return null;
  if (!Number.isFinite(annualReturnPercent) || annualReturnPercent <= -100) {
    return null;
  }

  const startMonth = claimAge * 12;
  const endMonth = Math.floor(lifeExpectancy * 12);
  if (!(endMonth > startMonth)) return null;

  const baseMonthly = piaMonthly * multiplier;
  if (!Number.isFinite(baseMonthly) || baseMonthly < 0) return null;

  const rm = monthlyRateFromAnnualPercent(annualReturnPercent);
  if (!Number.isFinite(rm) || rm <= -1) return null;

  const colaFactor = 1 + colaPercent / 100;
  let portfolio = 0;
  let nominal = 0;
  let monthsPaid = 0;

  for (let m = startMonth; m < endMonth; m++) {
    const yearsSinceClaim = Math.floor((m - startMonth) / 12);
    const pay = baseMonthly * Math.pow(colaFactor, yearsSinceClaim);
    if (!Number.isFinite(pay)) return null;
    portfolio = portfolio * (1 + rm) + pay;
    nominal += pay;
    monthsPaid += 1;
  }

  if (!Number.isFinite(portfolio) || !Number.isFinite(nominal)) return null;

  return {
    startingMonthlyBenefit: baseMonthly,
    cumulativeNominal: nominal,
    investedTerminalValue: portfolio,
    monthsPaid,
  };
}

/**
 * Break-even attained age (years, fractional OK) where cumulative nominal
 * benefits of `later` catch `earlier`. Returns null if never within LE.
 */
export function nominalBreakEvenAge(
  earlier: ClaimAgeScenario,
  later: ClaimAgeScenario,
  lifeExpectancy: number,
  piaMonthly: number,
  colaPercent: number,
  birthYear: number
): number | null {
  if (later.claimAge <= earlier.claimAge) return null;
  if (later.cumulativeNominal < earlier.cumulativeNominal) return null;

  const earlierMult = piaMultiplierForClaimAge(birthYear, earlier.claimAge);
  const laterMult = piaMultiplierForClaimAge(birthYear, later.claimAge);
  if (earlierMult == null || laterMult == null) return null;

  const colaFactor = 1 + colaPercent / 100;
  const endMonth = Math.floor(lifeExpectancy * 12);
  let cumEarly = 0;
  let cumLate = 0;
  const startEarly = earlier.claimAge * 12;
  const startLate = later.claimAge * 12;

  for (let m = startEarly; m < endMonth; m++) {
    if (m >= startEarly) {
      const y = Math.floor((m - startEarly) / 12);
      cumEarly += piaMonthly * earlierMult * Math.pow(colaFactor, y);
    }
    if (m >= startLate) {
      const y = Math.floor((m - startLate) / 12);
      cumLate += piaMonthly * laterMult * Math.pow(colaFactor, y);
    }
    if (m >= startLate && cumLate >= cumEarly) {
      return m / 12;
    }
  }
  return null;
}

export function calculateSocialSecurity(
  input: SocialSecurityMathInput
): SocialSecurityMathResult | null {
  const {
    birthYear,
    lifeExpectancy,
    annualReturnPercent,
    colaPercent,
    piaMonthly,
  } = input;

  const fra = fullRetirementAgeForBirthYear(birthYear);
  if (!fra) return null;
  if (!(lifeExpectancy > 62)) return null;
  if (!(piaMonthly > 0)) return null;

  const scenarios: ClaimAgeScenario[] = [];
  for (const claimAge of CLAIM_AGES) {
    if (lifeExpectancy <= claimAge) continue;
    const multiplier = piaMultiplierForClaimAge(birthYear, claimAge);
    if (multiplier == null) continue;
    const path = simulateClaimPath(
      claimAge,
      piaMonthly,
      multiplier,
      lifeExpectancy,
      colaPercent,
      annualReturnPercent
    );
    if (!path) continue;
    scenarios.push({ claimAge, multiplier, ...path });
  }

  if (scenarios.length === 0) return null;

  let ideal = scenarios[0]!;
  for (const s of scenarios) {
    if (s.investedTerminalValue > ideal.investedTerminalValue) {
      ideal = s;
    } else if (
      s.investedTerminalValue === ideal.investedTerminalValue &&
      s.claimAge < ideal.claimAge
    ) {
      ideal = s;
    }
  }

  const at62 = scenarios.find((s) => s.claimAge === 62) ?? null;
  let breakEvenVs62Age: number | null = null;
  if (at62 && ideal.claimAge > 62) {
    breakEvenVs62Age = nominalBreakEvenAge(
      at62,
      ideal,
      lifeExpectancy,
      piaMonthly,
      colaPercent,
      birthYear
    );
  }

  return {
    fra,
    fraLabel: formatFraLabel(fra),
    scenarios,
    idealClaimAge: ideal.claimAge,
    idealScenario: ideal,
    breakEvenVs62Age,
    rulesSource: SSA_RULES_SOURCE,
    rulesEffective: SSA_RULES_EFFECTIVE,
    timingNote:
      'Benefits are modeled monthly from the claim birthday through life expectancy. COLA applies each claim anniversary. Investment growth uses monthly effective rate (1+r)^(1/12)−1 with end-of-month deposits. Birth month is unknown, so FRA months follow the SSA year-of-birth table and claim ages are whole birthdays.',
  };
}

export function formatUsd(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}

export function roundMoney2(n: number): number {
  return Math.round(n * 100) / 100;
}
