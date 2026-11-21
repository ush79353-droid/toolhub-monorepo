import type { SupportedCurrency } from '@/tools/shared/currency';
import type { RothFilingStatus } from './roth-limits';

export type { RothFilingStatus };

export const FILING_OPTIONS: readonly {
  value: RothFilingStatus;
  label: string;
}[] = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married, filing jointly' },
  { value: 'married_separate', label: 'Married, filing separately' },
] as const;

export interface RothIraInput {
  currency: SupportedCurrency;
  magi: string;
  currentAge: string;
  retirementAge: string;
  filingStatus: RothFilingStatus;
  incomeTaxRate: string;
  annualReturn: string;
}

export interface RothIraResult {
  ruleYear: number;
  currency: SupportedCurrency;
  magi: number;
  currentAge: number;
  retirementAge: number;
  contributionYears: number;
  filingStatus: RothFilingStatus;
  incomeTaxRatePercent: number;
  annualReturnPercent: number;
  maxContribution: number;
  eligibleContribution: number;
  eligibleAfterTax: number;
  phaseOutPercent: number;
  balanceAtRetirement: number;
  formattedMaxContribution: string;
  formattedEligible: string;
  formattedEligibleAfterTax: string;
  formattedBalance: string;
  summaryMessage: string;
  assumptionNotes: string[];
}

export type RothIraFieldErrors = Partial<
  Record<keyof RothIraInput, string>
> & { form?: string };

export function createDefaultInput(): RothIraInput {
  return {
    currency: 'MXN',
    magi: '195000',
    currentAge: '32',
    retirementAge: '60',
    filingStatus: 'married_joint',
    incomeTaxRate: '24',
    annualReturn: '7',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'MXN'
): RothIraInput {
  return {
    currency,
    magi: '',
    currentAge: '',
    retirementAge: '',
    filingStatus: 'married_joint',
    incomeTaxRate: '',
    annualReturn: '',
  };
}
