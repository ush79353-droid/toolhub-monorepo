import type { SupportedCurrency } from '@/tools/shared/currency';

export type PeriodPreset = '1y' | '2y' | '3y' | '5y' | 'custom';
export type BillingFrequency = 'monthly' | 'quarterly' | 'annually' | 'one-time';

export interface AdvancedCostsInput {
  initialLicense: string;
  implementation: string;
  dataMigration: string;
  training: string;
  integration: string;
  subscriptionAmount: string;
  subscriptionFrequency: BillingFrequency;
  maintenance: string;
  maintenanceFrequency: BillingFrequency;
  implHours: string;
  loadedHourlyCost: string;
  otherCosts: string;
}

export interface AdvancedBenefitsInput {
  hrEmployees: string;
  hoursSavedPerWeek: string;
  adminHourlyCost: string;
  workingWeeks: string;
  payrollCurrentMonthly: string;
  payrollNewMonthly: string;
  annualHires: string;
  oldCostPerHire: string;
  newCostPerHire: string;
  retentionEmployees: string;
  oldTurnoverPercent: string;
  newTurnoverPercent: string;
  replacementCost: string;
  avoidedErrors: string;
  costPerError: string;
  docsCurrentMonthly: string;
  docsNewMonthly: string;
  thirdPartySavings: string;
  otherBenefits: string;
}

export interface HrSoftwareRoiInput {
  showAdvanced: boolean;
  /** Manually entered simple-mode totals (preserved when toggling). */
  simpleCost: string;
  simpleBenefit: string;
  periodPreset: PeriodPreset;
  customMonths: string;
  costs: AdvancedCostsInput;
  benefits: AdvancedBenefitsInput;
  currency: SupportedCurrency;
}

export type RoiOutcome = 'positive' | 'breakeven' | 'negative';

export interface HrSoftwareRoiResult {
  investmentCost: number;
  grossBenefit: number;
  netBenefit: number;
  roiPercentage: number;
  benefitCostRatio: number;
  periodMonths: number;
  periodLabel: string;
  outcome: RoiOutcome;
  interpretation: string;
  /** Years to recover one-time costs from net recurring annual benefit; null if none. */
  paybackYears: number | null;
  paybackMessage: string | null;
  fromAdvanced: boolean;
  currency: SupportedCurrency;
  formattedInvestmentCost: string;
  formattedGrossBenefit: string;
  formattedNetBenefit: string;
  formattedRoiPercentage: string;
  formattedBenefitCostRatio: string;
  formattedPaybackYears: string;
}

export type HrSoftwareRoiFieldErrors = {
  simpleCost?: string;
  simpleBenefit?: string;
  customMonths?: string;
  form?: string;
};

export function createEmptyAdvancedCosts(): AdvancedCostsInput {
  return {
    initialLicense: '',
    implementation: '',
    dataMigration: '',
    training: '',
    integration: '',
    subscriptionAmount: '',
    subscriptionFrequency: 'monthly',
    maintenance: '',
    maintenanceFrequency: 'annually',
    implHours: '',
    loadedHourlyCost: '',
    otherCosts: '',
  };
}

export function createEmptyAdvancedBenefits(): AdvancedBenefitsInput {
  return {
    hrEmployees: '',
    hoursSavedPerWeek: '',
    adminHourlyCost: '',
    workingWeeks: '52',
    payrollCurrentMonthly: '',
    payrollNewMonthly: '',
    annualHires: '',
    oldCostPerHire: '',
    newCostPerHire: '',
    retentionEmployees: '',
    oldTurnoverPercent: '',
    newTurnoverPercent: '',
    replacementCost: '',
    avoidedErrors: '',
    costPerError: '',
    docsCurrentMonthly: '',
    docsNewMonthly: '',
    thirdPartySavings: '',
    otherBenefits: '',
  };
}

export function createDefaultInput(): HrSoftwareRoiInput {
  return {
    showAdvanced: false,
    simpleCost: '',
    simpleBenefit: '',
    periodPreset: '1y',
    customMonths: '12',
    costs: createEmptyAdvancedCosts(),
    benefits: createEmptyAdvancedBenefits(),
    currency: 'PKR',
  };
}

/** Spec example: 500k cost / 750k benefit → 50% ROI */
export function createExampleInput(): HrSoftwareRoiInput {
  return {
    ...createDefaultInput(),
    simpleCost: '500000',
    simpleBenefit: '750000',
  };
}
