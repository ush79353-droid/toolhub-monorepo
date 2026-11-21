import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  ROTH_RULE_YEAR,
  eligibleRothContributionUsd,
  type RothFilingStatus,
} from './roth-limits';
import type { RothIraResult } from './types';

export interface RothIraCanonicalInput {
  currency: SupportedCurrency;
  magi: number;
  currentAge: number;
  retirementAge: number;
  filingStatus: RothFilingStatus;
  incomeTaxRatePercent: number;
  annualReturnPercent: number;
}

export function formatRothMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Future value of end-of-year level contributions (ordinary annuity).
 * FV = PMT × ((1+r)^n − 1) / r ; when r=0, FV = PMT × n.
 */
export function futureValueAnnualContributions(
  annualContribution: number,
  annualReturnPercent: number,
  years: number
): number | null {
  if (
    ![annualContribution, annualReturnPercent, years].every(Number.isFinite) ||
    annualContribution < 0 ||
    years < 0
  ) {
    return null;
  }
  if (years === 0 || annualContribution === 0) return 0;
  const r = annualReturnPercent / 100;
  if (Math.abs(r) < 1e-15) return annualContribution * years;
  if (r <= -1) return null;
  const growth = Math.pow(1 + r, years);
  if (!Number.isFinite(growth)) return null;
  const fv = (annualContribution * (growth - 1)) / r;
  return Number.isFinite(fv) ? fv : null;
}

export function calculateRothIra(
  input: RothIraCanonicalInput
): RothIraResult | null {
  const {
    currency,
    magi,
    currentAge,
    retirementAge,
    filingStatus,
    incomeTaxRatePercent,
    annualReturnPercent,
  } = input;

  if (
    ![
      magi,
      currentAge,
      retirementAge,
      incomeTaxRatePercent,
      annualReturnPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (magi < 0 || currentAge < 0 || retirementAge < currentAge) return null;
  if (incomeTaxRatePercent < 0 || incomeTaxRatePercent >= 100) return null;
  if (annualReturnPercent < -99 || annualReturnPercent > 100) return null;
  if (currentAge > 120 || retirementAge > 120) return null;

  const contributionYears = retirementAge - currentAge;
  const { maxContribution, eligible, phaseOutPercent } =
    eligibleRothContributionUsd(magi, filingStatus, currentAge);

  const eligibleAfterTax = eligible * (1 - incomeTaxRatePercent / 100);
  const balance = futureValueAnnualContributions(
    eligible,
    annualReturnPercent,
    contributionYears
  );
  if (balance === null) return null;

  const symbol = getCurrencySymbol(currency);
  const money = (n: number) => `${symbol}${formatRothMoney(n, currency)}`;

  const filingLabel =
    filingStatus === 'single'
      ? 'single'
      : filingStatus === 'married_joint'
        ? 'married filing jointly'
        : 'married filing separately';

  return {
    ruleYear: ROTH_RULE_YEAR,
    currency,
    magi,
    currentAge,
    retirementAge,
    contributionYears,
    filingStatus,
    incomeTaxRatePercent,
    annualReturnPercent,
    maxContribution,
    eligibleContribution: eligible,
    eligibleAfterTax,
    phaseOutPercent,
    balanceAtRetirement: balance,
    formattedMaxContribution: money(maxContribution),
    formattedEligible: money(eligible),
    formattedEligibleAfterTax: money(eligibleAfterTax),
    formattedBalance: money(balance),
    summaryMessage:
      contributionYears === 0
        ? `You are at or past retirement age. ${ROTH_RULE_YEAR} eligible Roth contribution: ${money(eligible)} (${filingLabel}).`
        : `For tax year ${ROTH_RULE_YEAR}, your eligible Roth contribution is ${money(eligible)}. Contributing that amount each year for ${contributionYears} years at ${annualReturnPercent}% grows to about ${money(balance)} by age ${retirementAge} (end-of-year deposits).`,
    assumptionNotes: [
      `IRS ${ROTH_RULE_YEAR} Roth IRA limit and MAGI phase-outs (Notice 2025-67 / Pub 590-A).`,
      'MAGI is compared to USD statutory thresholds; currency selection formats amounts only (no FX).',
      'Earned-income limit is not modeled — assume compensation ≥ eligible contribution.',
      'Projection compounds eligible annual contributions at year-end; returns are constant and illustrative.',
      'Eligible after-tax = eligible × (1 − income tax rate), an illustrative tax-cost view — not payroll withholding.',
    ],
  };
}
