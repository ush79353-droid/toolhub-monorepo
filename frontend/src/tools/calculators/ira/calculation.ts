/**
 * IRA Calculator — pure engine (ADR-018).
 *
 * Accumulation (end-of-year ordinary annuity):
 *   FV = C × ((1+r)^n − 1) / r   (r = 0 → C×n)
 *
 * Level withdrawals over W years with the same annual return:
 *   PMT = FV × r / (1 − (1+r)^(−W))   (r = 0 → FV/W)
 *
 * Traditional: contributions assumed deductible; withdrawals taxed at retirement bracket.
 * Roth: after-tax contributions; qualified withdrawals modeled as tax-free.
 * Traditional/SEP/SIMPLE share this accumulation path for the entered contribution
 * (employer SEP/SIMPLE formulas are not separately modeled).
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  IRA_RULE_YEAR,
  iraAnnualLimitUsd,
} from './ira-limits';
import type { IraInput, IraResult } from './types';

export function futureValueOrdinaryAnnuity(
  annualContribution: number,
  annualReturnDecimal: number,
  years: number,
): number | null {
  if (
    ![annualContribution, annualReturnDecimal, years].every(Number.isFinite) ||
    annualContribution < 0 ||
    years < 0 ||
    annualReturnDecimal <= -1
  ) {
    return null;
  }
  if (years === 0) return 0;
  if (annualReturnDecimal === 0) return annualContribution * years;
  const growth = Math.pow(1 + annualReturnDecimal, years);
  if (!Number.isFinite(growth)) return null;
  const fv = (annualContribution * (growth - 1)) / annualReturnDecimal;
  return Number.isFinite(fv) ? fv : null;
}

export function amortizedAnnualWithdrawal(
  balance: number,
  annualReturnDecimal: number,
  withdrawalYears: number,
): number | null {
  if (
    ![balance, annualReturnDecimal, withdrawalYears].every(Number.isFinite) ||
    balance < 0 ||
    withdrawalYears <= 0 ||
    annualReturnDecimal <= -1
  ) {
    return null;
  }
  if (annualReturnDecimal === 0) return balance / withdrawalYears;
  const factor = Math.pow(1 + annualReturnDecimal, -withdrawalYears);
  if (!Number.isFinite(factor) || factor === 1) return null;
  const pmt = (balance * annualReturnDecimal) / (1 - factor);
  return Number.isFinite(pmt) ? pmt : null;
}

export function rothContributionFromTraditional(
  traditionalContribution: number,
  taxBracketContributionPercent: number,
): number | null {
  if (
    !Number.isFinite(traditionalContribution) ||
    !Number.isFinite(taxBracketContributionPercent) ||
    traditionalContribution < 0 ||
    taxBracketContributionPercent < 0 ||
    taxBracketContributionPercent >= 100
  ) {
    return null;
  }
  const after =
    traditionalContribution * (1 - taxBracketContributionPercent / 100);
  return Number.isFinite(after) ? after : null;
}

export function traditionalContributionFromRoth(
  rothContribution: number,
  taxBracketContributionPercent: number,
): number | null {
  if (
    !Number.isFinite(rothContribution) ||
    !Number.isFinite(taxBracketContributionPercent) ||
    rothContribution < 0 ||
    taxBracketContributionPercent < 0 ||
    taxBracketContributionPercent >= 100
  ) {
    return null;
  }
  const retention = 1 - taxBracketContributionPercent / 100;
  if (retention <= 0) return null;
  const preTax = rothContribution / retention;
  return Number.isFinite(preTax) ? preTax : null;
}

export interface IraMathInput {
  currentAge: number;
  contributionYears: number;
  withdrawalYears: number;
  taxBracketContributionPercent: number;
  taxBracketRetirementPercent: number;
  traditionalContribution: number;
  rothContribution: number;
  annualReturnPercent: number;
  calculationCurrency: SupportedCurrency;
  traditionalContributionUsd: number | null;
  rothContributionUsd: number | null;
  format: (amount: number, currency: SupportedCurrency) => string;
  balanceCurrency: SupportedCurrency;
  traditionalWithdrawalCurrency: SupportedCurrency;
  traditionalAfterTaxCurrency: SupportedCurrency;
  traditionalTakeHomeCurrency: SupportedCurrency;
  rothBalanceCurrency: SupportedCurrency;
  rothTakeHomeCurrency: SupportedCurrency;
  convertOut: (
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency,
  ) => number | null;
}

export function calculateIra(math: IraMathInput): IraResult | null {
  const r = math.annualReturnPercent / 100;
  const tradFv = futureValueOrdinaryAnnuity(
    math.traditionalContribution,
    r,
    math.contributionYears,
  );
  const rothFv = futureValueOrdinaryAnnuity(
    math.rothContribution,
    r,
    math.contributionYears,
  );
  if (tradFv == null || rothFv == null) return null;

  const tradGross = amortizedAnnualWithdrawal(
    tradFv,
    r,
    math.withdrawalYears,
  );
  const rothPmt = amortizedAnnualWithdrawal(rothFv, r, math.withdrawalYears);
  if (tradGross == null || rothPmt == null) return null;

  const tRet = math.taxBracketRetirementPercent / 100;
  const tradTax = tradGross * tRet;
  const tradTakeHome = tradGross - tradTax;

  const out = (
    amount: number,
    to: SupportedCurrency,
  ): number | null => {
    if (to === math.calculationCurrency) return amount;
    return math.convertOut(amount, math.calculationCurrency, to);
  };

  const traditionalBalance = out(tradFv, math.balanceCurrency);
  const traditionalGrossWithdrawal = out(
    tradGross,
    math.traditionalWithdrawalCurrency,
  );
  const traditionalAnnualTax = out(tradTax, math.traditionalAfterTaxCurrency);
  const traditionalTakeHome = out(
    tradTakeHome,
    math.traditionalTakeHomeCurrency,
  );
  const rothBalance = out(rothFv, math.rothBalanceCurrency);
  const rothTakeHome = out(rothPmt, math.rothTakeHomeCurrency);

  if (
    [
      traditionalBalance,
      traditionalGrossWithdrawal,
      traditionalAnnualTax,
      traditionalTakeHome,
      rothBalance,
      rothTakeHome,
    ].some((v) => v == null)
  ) {
    return null;
  }

  const iraLimitUsd = iraAnnualLimitUsd(math.currentAge);
  const traditionalOverLimit =
    math.traditionalContributionUsd != null &&
    math.traditionalContributionUsd > iraLimitUsd + 1e-9;
  const rothOverLimit =
    math.rothContributionUsd != null &&
    math.rothContributionUsd > iraLimitUsd + 1e-9;

  let limitNote: string | null = null;
  if (traditionalOverLimit || rothOverLimit) {
    limitNote = `IRS TY${IRA_RULE_YEAR} combined IRA contribution limit is $${iraLimitUsd.toLocaleString('en-US')} at age ${Math.floor(math.currentAge)} (base + catch-up when age ≥ 50). Entered contribution(s) exceed that USD limit after conversion. Excess contributions may face a 6% excise tax; this tool does not model excess-tax remediation.`;
  }

  const formulaBreakdown = [
    `FV = C × ((1+r)^n − 1) / r  (end-of-year contributions)`,
    `Traditional FV ≈ ${math.format(tradFv, math.calculationCurrency)}`,
    `Roth FV ≈ ${math.format(rothFv, math.calculationCurrency)}`,
    `PMT = FV × r / (1 − (1+r)^(−W))`,
    `Traditional gross withdrawal ≈ ${math.format(tradGross, math.calculationCurrency)}`,
    `Traditional tax @ ${math.taxBracketRetirementPercent}% ≈ ${math.format(tradTax, math.calculationCurrency)}`,
    `Roth tax-free withdrawal ≈ ${math.format(rothPmt, math.calculationCurrency)}`,
  ].join('\n');

  const steps = [
    `Contribution years n = ${math.contributionYears}`,
    `Annual return r = ${math.annualReturnPercent}%`,
    `Traditional annual contribution = ${math.format(math.traditionalContribution, math.calculationCurrency)}`,
    `Roth annual contribution = ${math.format(math.rothContribution, math.calculationCurrency)}`,
    `Withdrawal years W = ${math.withdrawalYears}`,
    `Retirement tax bracket = ${math.taxBracketRetirementPercent}%`,
  ];

  const interpretation = `After ${math.contributionYears} years of end-of-year contributions at ${math.annualReturnPercent}% annual return, the Traditional/SEP/SIMPLE path reaches about ${math.format(traditionalBalance!, math.balanceCurrency)} and supports an estimated gross withdrawal of ${math.format(traditionalGrossWithdrawal!, math.traditionalWithdrawalCurrency)} per year for ${math.withdrawalYears} years (${math.format(traditionalTakeHome!, math.traditionalTakeHomeCurrency)} after ${math.taxBracketRetirementPercent}% tax). The Roth path reaches about ${math.format(rothBalance!, math.rothBalanceCurrency)} with tax-free take-home of ${math.format(rothTakeHome!, math.rothTakeHomeCurrency)} per year under these assumptions.`;

  const explanation =
    'Estimates only. Assumes constant annual contributions and returns, end-of-year contribution timing, deductible Traditional contributions, and tax-free Roth qualified withdrawals. Does not model RMDs, early-withdrawal penalties, NIIT, state tax, employer SEP/SIMPLE formulas, income-phaseout eligibility, or investment fees.';

  return {
    ruleYear: IRA_RULE_YEAR,
    contributionYears: math.contributionYears,
    withdrawalYears: math.withdrawalYears,
    annualReturnPercent: math.annualReturnPercent,
    taxBracketContributionPercent: math.taxBracketContributionPercent,
    taxBracketRetirementPercent: math.taxBracketRetirementPercent,
    traditionalContributionCanonical: math.traditionalContribution,
    rothContributionCanonical: math.rothContribution,
    calculationCurrency: math.calculationCurrency,
    traditionalBalance: traditionalBalance!,
    traditionalGrossWithdrawal: traditionalGrossWithdrawal!,
    traditionalAnnualTax: traditionalAnnualTax!,
    traditionalTakeHome: traditionalTakeHome!,
    rothBalance: rothBalance!,
    rothTakeHome: rothTakeHome!,
    iraLimitUsd,
    traditionalContributionUsd: math.traditionalContributionUsd,
    rothContributionUsd: math.rothContributionUsd,
    traditionalOverLimit,
    rothOverLimit,
    limitNote,
    formattedTraditionalBalance: math.format(
      traditionalBalance!,
      math.balanceCurrency,
    ),
    formattedTraditionalGrossWithdrawal: math.format(
      traditionalGrossWithdrawal!,
      math.traditionalWithdrawalCurrency,
    ),
    formattedTraditionalAnnualTax: math.format(
      traditionalAnnualTax!,
      math.traditionalAfterTaxCurrency,
    ),
    formattedTraditionalTakeHome: math.format(
      traditionalTakeHome!,
      math.traditionalTakeHomeCurrency,
    ),
    formattedRothBalance: math.format(rothBalance!, math.rothBalanceCurrency),
    formattedRothTakeHome: math.format(
      rothTakeHome!,
      math.rothTakeHomeCurrency,
    ),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}

export function formatMoneyAmount(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const body = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
  return `${currency} ${body}`;
}

/** Sync peer contribution string when tax bracket or opposite contribution changes. */
export function syncPeerContribution(input: IraInput): Partial<IraInput> {
  const tax = Number(input.taxBracketContributionPercent.trim());
  if (!Number.isFinite(tax) || tax < 0 || tax >= 100) return {};
  if (input.lastEditedContribution === 'traditionalContribution') {
    const c = Number(input.traditionalContribution.trim().replace(/,/g, ''));
    if (!Number.isFinite(c) || c < 0) return {};
    const roth = rothContributionFromTraditional(c, tax);
    if (roth == null) return {};
    return { rothContribution: String(roth) };
  }
  const c = Number(input.rothContribution.trim().replace(/,/g, ''));
  if (!Number.isFinite(c) || c < 0) return {};
  const trad = traditionalContributionFromRoth(c, tax);
  if (trad == null) return {};
  return { traditionalContribution: String(trad) };
}
