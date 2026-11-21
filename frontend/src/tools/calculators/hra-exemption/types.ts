import type { SupportedCurrency } from '@/tools/shared/currency';
import type { CityOption, InputFrequency, TaxRegime, TaxYearId } from './tax-rules';

export interface HraInput {
  currency: SupportedCurrency;
  basicSalary: string;
  dearnessAllowance: string;
  daEligibleForRetirementBenefits: boolean;
  hraReceived: string;
  rentPaid: string;
  city: CityOption | string;
  taxYear: TaxYearId | string;
  taxRegime: TaxRegime;
  frequency: InputFrequency;
  /** Months of qualifying rented stay / HRA (1–12). Default 12. */
  enablePartialYear: boolean;
  eligibleMonths: string;
}

export type LimitingCondition =
  | 'actual-hra'
  | 'rent-minus-10pct'
  | 'city-salary-limit'
  | 'new-regime'
  | 'zero'
  | 'unavailable';

export interface HraBreakdownRow {
  label: string;
  amount: number;
  isLimit?: boolean;
}

export interface HraResult {
  currency: SupportedCurrency;
  taxYear: string;
  taxYearLabel: string;
  taxRegime: TaxRegime;
  frequency: InputFrequency;
  city: string;
  cityRuleNote: string;
  eligibleMonths: number;
  claimable: boolean;
  qualifyingSalaryMonthly: number;
  qualifyingSalaryAnnual: number;
  actualHRAMonthly: number;
  actualHRAAnnual: number;
  rentPaidMonthly: number;
  rentPaidAnnual: number;
  tenPercentOfSalaryMonthly: number;
  rentAboveTenPercentMonthly: number;
  applicableCityPercentage: number;
  salaryPercentageLimitMonthly: number;
  exemptHRAMonthly: number;
  taxableHRAMonthly: number;
  annualExemptHRA: number;
  annualTaxableHRA: number;
  monthlyExemptHRA: number;
  monthlyTaxableHRA: number;
  limitingCondition: LimitingCondition;
  limitingLabel: string;
  breakdown: HraBreakdownRow[];
  formattedAnnualExempt: string;
  formattedAnnualTaxable: string;
  steps: string[];
  formulaBreakdown: string;
  interpretation: string;
  explanation: string;
}

export type HraFieldErrors = {
  form?: string;
  basicSalary?: string;
  dearnessAllowance?: string;
  hraReceived?: string;
  rentPaid?: string;
  city?: string;
  taxYear?: string;
  eligibleMonths?: string;
};

export function createDefaultInput(): HraInput {
  return {
    currency: 'INR',
    basicSalary: '',
    dearnessAllowance: '0',
    daEligibleForRetirementBenefits: true,
    hraReceived: '',
    rentPaid: '',
    city: 'Delhi',
    taxYear: '2025-26',
    taxRegime: 'old',
    frequency: 'monthly',
    enablePartialYear: false,
    eligibleMonths: '12',
  };
}

export function createEmptyInput(): HraInput {
  return {
    currency: 'INR',
    basicSalary: '',
    dearnessAllowance: '',
    daEligibleForRetirementBenefits: true,
    hraReceived: '',
    rentPaid: '',
    city: 'Delhi',
    taxYear: '2025-26',
    taxRegime: 'old',
    frequency: 'monthly',
    enablePartialYear: false,
    eligibleMonths: '',
  };
}

/** Reference: ₹50k basic · ₹5k DA · ₹20k HRA · ₹18k rent · Delhi · old → exempt ₹12,500/mo */
export function createExampleInput(): HraInput {
  return {
    currency: 'INR',
    basicSalary: '50000',
    dearnessAllowance: '5000',
    daEligibleForRetirementBenefits: true,
    hraReceived: '20000',
    rentPaid: '18000',
    city: 'Delhi',
    taxYear: '2025-26',
    taxRegime: 'old',
    frequency: 'monthly',
    enablePartialYear: false,
    eligibleMonths: '12',
  };
}
