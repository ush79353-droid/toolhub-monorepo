import type { SupportedCurrency } from '@/tools/shared/currency';

export type IraMoneyField = 'traditionalContribution' | 'rothContribution';

export interface IraInput {
  currentAge: string;
  retirementAge: string;
  withdrawalYears: string;
  contributionYears: string;
  taxBracketContributionPercent: string;
  taxBracketRetirementPercent: string;
  traditionalContribution: string;
  traditionalContributionCurrency: SupportedCurrency;
  rothContribution: string;
  rothContributionCurrency: SupportedCurrency;
  annualReturnPercent: string;
  /** Last-edited contribution drives optional Roth↔Traditional sync. */
  lastEditedContribution: IraMoneyField;
  balanceCurrency: SupportedCurrency;
  traditionalWithdrawalCurrency: SupportedCurrency;
  traditionalAfterTaxCurrency: SupportedCurrency;
  traditionalTakeHomeCurrency: SupportedCurrency;
  rothBalanceCurrency: SupportedCurrency;
  rothTakeHomeCurrency: SupportedCurrency;
}

export interface IraResult {
  ruleYear: number;
  contributionYears: number;
  withdrawalYears: number;
  annualReturnPercent: number;
  taxBracketContributionPercent: number;
  taxBracketRetirementPercent: number;
  traditionalContributionCanonical: number;
  rothContributionCanonical: number;
  calculationCurrency: SupportedCurrency;
  traditionalBalance: number;
  traditionalGrossWithdrawal: number;
  traditionalAnnualTax: number;
  traditionalTakeHome: number;
  rothBalance: number;
  rothTakeHome: number;
  iraLimitUsd: number;
  traditionalContributionUsd: number | null;
  rothContributionUsd: number | null;
  traditionalOverLimit: boolean;
  rothOverLimit: boolean;
  limitNote: string | null;
  formattedTraditionalBalance: string;
  formattedTraditionalGrossWithdrawal: string;
  formattedTraditionalAnnualTax: string;
  formattedTraditionalTakeHome: string;
  formattedRothBalance: string;
  formattedRothTakeHome: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type IraFieldErrors = {
  form?: string;
  currentAge?: string;
  retirementAge?: string;
  withdrawalYears?: string;
  contributionYears?: string;
  taxBracketContributionPercent?: string;
  taxBracketRetirementPercent?: string;
  traditionalContribution?: string;
  rothContribution?: string;
  annualReturnPercent?: string;
  conversion?: string;
};

export function createEmptyInput(): IraInput {
  return {
    currentAge: '',
    retirementAge: '',
    withdrawalYears: '',
    contributionYears: '',
    taxBracketContributionPercent: '',
    taxBracketRetirementPercent: '',
    traditionalContribution: '',
    traditionalContributionCurrency: 'USD',
    rothContribution: '',
    rothContributionCurrency: 'USD',
    annualReturnPercent: '',
    lastEditedContribution: 'traditionalContribution',
    balanceCurrency: 'USD',
    traditionalWithdrawalCurrency: 'USD',
    traditionalAfterTaxCurrency: 'USD',
    traditionalTakeHomeCurrency: 'USD',
    rothBalanceCurrency: 'USD',
    rothTakeHomeCurrency: 'USD',
  };
}

/** Worked example aligned with IRS 2026 under-50 limit. */
export function createExampleInput(): IraInput {
  return {
    currentAge: '30',
    retirementAge: '65',
    withdrawalYears: '20',
    contributionYears: '35',
    taxBracketContributionPercent: '24',
    taxBracketRetirementPercent: '22',
    traditionalContribution: '7500',
    traditionalContributionCurrency: 'USD',
    rothContribution: '5700',
    rothContributionCurrency: 'USD',
    annualReturnPercent: '7',
    lastEditedContribution: 'traditionalContribution',
    balanceCurrency: 'USD',
    traditionalWithdrawalCurrency: 'USD',
    traditionalAfterTaxCurrency: 'USD',
    traditionalTakeHomeCurrency: 'USD',
    rothBalanceCurrency: 'USD',
    rothTakeHomeCurrency: 'USD',
  };
}
