import type { SupportedCurrency } from '@/tools/shared/currency';

export type FilingStatus =
  | 'single'
  | 'married-joint'
  | 'married-separate'
  | 'head-of-household'
  | 'qualifying-surviving-spouse';

export type HsaCoverage = 'self-only' | 'family';

export type MoneyFieldKey =
  | 'wages'
  | 'business'
  | 'interestDividends'
  | 'capitalGains'
  | 'retirementDistributions'
  | 'unemployment'
  | 'alimonyReceived'
  | 'taxableSocialSecurity'
  | 'otherIncome'
  | 'iraContributions'
  | 'studentLoanInterest'
  | 'educatorExpenses'
  | 'hsaContributions'
  | 'healthInsurancePremiums'
  | 'earlyWithdrawalPenalty'
  | 'alimonyPaid'
  | 'movingExpenses';

export type ResultCurrencyKey =
  | 'grossIncomeCurrency'
  | 'totalAdjustmentsCurrency'
  | 'agiCurrency';

export interface AdjustedGrossIncomeInput {
  filingStatus: FilingStatus;
  /** Age 50+ enables traditional IRA catch-up. */
  age50OrOver: boolean;
  /** Age 55+ enables HSA catch-up. */
  age55OrOver: boolean;
  /** Workplace retirement plan coverage — IRA deduction phaseout. */
  coveredByWorkplacePlan: boolean;
  hsaCoverage: HsaCoverage;
  /**
   * Self-employed health insurance eligibility (Schedule 1).
   * Premiums are ignored unless this is true and business income > 0.
   */
  selfEmployedHealthInsurance: boolean;
  /** Alimony received only under instruments executed on or before 12/31/2018. */
  alimonyReceivedPre2019: boolean;
  /** Alimony paid only under instruments executed on or before 12/31/2018. */
  alimonyPaidPre2019: boolean;
  /** Armed Forces moving expenses only (TCJA). */
  armedForcesMove: boolean;

  wages: string;
  wagesCurrency: SupportedCurrency;
  business: string;
  businessCurrency: SupportedCurrency;
  interestDividends: string;
  interestDividendsCurrency: SupportedCurrency;
  capitalGains: string;
  capitalGainsCurrency: SupportedCurrency;
  retirementDistributions: string;
  retirementDistributionsCurrency: SupportedCurrency;
  showMoreIncome: boolean;
  unemployment: string;
  unemploymentCurrency: SupportedCurrency;
  alimonyReceived: string;
  alimonyReceivedCurrency: SupportedCurrency;
  taxableSocialSecurity: string;
  taxableSocialSecurityCurrency: SupportedCurrency;
  otherIncome: string;
  otherIncomeCurrency: SupportedCurrency;

  iraContributions: string;
  iraContributionsCurrency: SupportedCurrency;
  studentLoanInterest: string;
  studentLoanInterestCurrency: SupportedCurrency;
  educatorExpenses: string;
  educatorExpensesCurrency: SupportedCurrency;
  hsaContributions: string;
  hsaContributionsCurrency: SupportedCurrency;
  healthInsurancePremiums: string;
  healthInsurancePremiumsCurrency: SupportedCurrency;
  showMoreDeductions: boolean;
  earlyWithdrawalPenalty: string;
  earlyWithdrawalPenaltyCurrency: SupportedCurrency;
  alimonyPaid: string;
  alimonyPaidCurrency: SupportedCurrency;
  movingExpenses: string;
  movingExpensesCurrency: SupportedCurrency;

  grossIncomeCurrency: SupportedCurrency;
  totalAdjustmentsCurrency: SupportedCurrency;
  agiCurrency: SupportedCurrency;

  grossIncomeOpen: boolean;
  deductionsOpen: boolean;
  resultsOpen: boolean;
  filingDetailsOpen: boolean;
}

export interface AdjustedGrossIncomeResult {
  grossIncomeUsd: number;
  totalAdjustmentsUsd: number;
  agiUsd: number;
  capitalLossAppliedUsd: number;
  iraDeductionUsd: number;
  studentLoanDeductionUsd: number;
  educatorDeductionUsd: number;
  hsaDeductionUsd: number;
  seHealthDeductionUsd: number;
  halfSeTaxUsd: number;
  earlyWithdrawalUsd: number;
  alimonyPaidUsd: number;
  movingUsd: number;
  notes: string[];
  grossIncome: number;
  totalAdjustments: number;
  agi: number;
  grossIncomeCurrency: SupportedCurrency;
  totalAdjustmentsCurrency: SupportedCurrency;
  agiCurrency: SupportedCurrency;
  formattedGrossIncome: string;
  formattedTotalAdjustments: string;
  formattedAgi: string;
}

export type AdjustedGrossIncomeFieldErrors = Partial<
  Record<MoneyFieldKey | 'form' | 'filingStatus', string>
>;

const PKR = 'PKR' as const;

export function createDefaultInput(): AdjustedGrossIncomeInput {
  return {
    filingStatus: 'single',
    age50OrOver: false,
    age55OrOver: false,
    coveredByWorkplacePlan: false,
    hsaCoverage: 'self-only',
    selfEmployedHealthInsurance: false,
    alimonyReceivedPre2019: false,
    alimonyPaidPre2019: false,
    armedForcesMove: false,

    wages: '0',
    wagesCurrency: PKR,
    business: '0',
    businessCurrency: PKR,
    interestDividends: '0',
    interestDividendsCurrency: PKR,
    capitalGains: '0',
    capitalGainsCurrency: PKR,
    retirementDistributions: '0',
    retirementDistributionsCurrency: PKR,
    showMoreIncome: false,
    unemployment: '0',
    unemploymentCurrency: PKR,
    alimonyReceived: '0',
    alimonyReceivedCurrency: PKR,
    taxableSocialSecurity: '0',
    taxableSocialSecurityCurrency: PKR,
    otherIncome: '0',
    otherIncomeCurrency: PKR,

    iraContributions: '0',
    iraContributionsCurrency: PKR,
    studentLoanInterest: '0',
    studentLoanInterestCurrency: PKR,
    educatorExpenses: '0',
    educatorExpensesCurrency: PKR,
    hsaContributions: '0',
    hsaContributionsCurrency: PKR,
    healthInsurancePremiums: '0',
    healthInsurancePremiumsCurrency: PKR,
    showMoreDeductions: false,
    earlyWithdrawalPenalty: '0',
    earlyWithdrawalPenaltyCurrency: PKR,
    alimonyPaid: '0',
    alimonyPaidCurrency: PKR,
    movingExpenses: '0',
    movingExpensesCurrency: PKR,

    grossIncomeCurrency: PKR,
    totalAdjustmentsCurrency: PKR,
    agiCurrency: PKR,

    grossIncomeOpen: true,
    deductionsOpen: true,
    resultsOpen: true,
    filingDetailsOpen: false,
  };
}
