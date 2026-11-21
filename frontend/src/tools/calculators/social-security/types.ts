import type { ClaimAge, ClaimAgeScenario } from './calculation';

export interface SocialSecurityInput {
  birthYear: string;
  lifeExpectancy: string;
  investmentReturn: string;
  cola: string;
  /** Estimated monthly benefit at FRA (PIA). Required — never invented silently. */
  piaMonthly: string;
}

export interface SocialSecurityResult {
  birthYear: number;
  lifeExpectancy: number;
  annualReturnPercent: number;
  colaPercent: number;
  piaMonthly: number;
  fraLabel: string;
  idealClaimAge: ClaimAge;
  idealStartingMonthly: number;
  idealCumulativeNominal: number;
  idealInvestedTerminal: number;
  breakEvenVs62Age: number | null;
  scenarios: ClaimAgeScenario[];
  formattedPiaMonthly: string;
  formattedIdealStartingMonthly: string;
  formattedIdealCumulative: string;
  formattedIdealInvested: string;
  formattedBreakEvenVs62: string | null;
  rulesSource: string;
  rulesEffective: string;
  timingNote: string;
  disclaimer: string;
}

export type SocialSecurityFieldErrors = {
  form?: string;
  birthYear?: string;
  lifeExpectancy?: string;
  investmentReturn?: string;
  cola?: string;
  piaMonthly?: string;
};

/**
 * Screenshot defaults: birth 1970, LE 83, return 5%, COLA 3%.
 * PIA default uses SSA Dec 2024 average retired-worker benefit (~$1,922),
 * labeled as an illustrative US starting estimate — user should replace with
 * their own SSA statement / estimator figure.
 */
export function createDefaultInput(): SocialSecurityInput {
  return {
    birthYear: '1970',
    lifeExpectancy: '83',
    investmentReturn: '5',
    cola: '3',
    piaMonthly: '1922',
  };
}

export function createEmptyInput(): SocialSecurityInput {
  return {
    birthYear: '',
    lifeExpectancy: '',
    investmentReturn: '',
    cola: '',
    piaMonthly: '',
  };
}

export function inputsEqual(
  a: SocialSecurityInput,
  b: SocialSecurityInput
): boolean {
  return (
    a.birthYear === b.birthYear &&
    a.lifeExpectancy === b.lifeExpectancy &&
    a.investmentReturn === b.investmentReturn &&
    a.cola === b.cola &&
    a.piaMonthly === b.piaMonthly
  );
}
