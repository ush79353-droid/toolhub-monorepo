import type { SupportedCurrency } from '@/tools/shared/currency';

export type DtiProfile = 'conventional' | 'fha' | 'va' | 'custom';
export type DownPaymentMode = 'percentage' | 'amount';
export type CostMode = 'annualPercentage' | 'annualAmount' | 'monthlyAmount';
export type BindingLimit = 'front' | 'back' | 'tie' | 'budget';

export interface IncomeBasedInput {
  annualHouseholdIncome: string;
  mortgageTermYears: string;
  annualInterestRate: string;
  monthlyDebtPayments: string;
  downPaymentMode: DownPaymentMode;
  downPaymentValue: string;
  propertyTaxMode: CostMode;
  propertyTax: string;
  hoaMode: CostMode;
  hoaFee: string;
  insuranceMode: CostMode;
  insurance: string;
  dtiProfile: DtiProfile;
  customFrontEndDti: string;
  customBackEndDti: string;
  currency: SupportedCurrency;
}

export interface FixedBudgetInput {
  monthlyHousingBudget: string;
  mortgageTermYears: string;
  annualInterestRate: string;
  downPaymentMode: DownPaymentMode;
  downPaymentValue: string;
  includeTaxesAndFees: boolean;
  propertyTaxMode: CostMode;
  propertyTax: string;
  hoaMode: CostMode;
  hoaFee: string;
  insuranceMode: CostMode;
  insurance: string;
  maintenanceMode: CostMode;
  maintenance: string;
  currency: SupportedCurrency;
}

export interface IncomeBasedResult {
  housePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyPi: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  totalHousingPayment: number;
  frontEndDti: number;
  backEndDti: number;
  housingBudget: number;
  bindingLimit: BindingLimit;
  frontEndLimit: number;
  backEndLimit: number;
  dtiProfile: DtiProfile;
  profileNote: string;
  currency: SupportedCurrency;
  formattedHousePrice: string;
  formattedLoanAmount: string;
  formattedDownPayment: string;
  formattedMonthlyPi: string;
  formattedMonthlyTax: string;
  formattedMonthlyInsurance: string;
  formattedMonthlyHoa: string;
  formattedTotalHousing: string;
  formattedBudget: string;
}

export interface FixedBudgetResult {
  housePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyPi: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyMaintenance: number;
  totalMonthlyHousingCosts: number;
  monthlyHousingBudget: number;
  budgetDifference: number;
  includeTaxesAndFees: boolean;
  currency: SupportedCurrency;
  note: string;
  formattedHousePrice: string;
  formattedLoanAmount: string;
  formattedDownPayment: string;
  formattedMonthlyPi: string;
  formattedMonthlyTax: string;
  formattedMonthlyInsurance: string;
  formattedMonthlyHoa: string;
  formattedMonthlyMaintenance: string;
  formattedTotalHousing: string;
  formattedBudget: string;
  formattedBudgetDifference: string;
}

export type IncomeFieldErrors = Partial<
  Record<
    | 'annualHouseholdIncome'
    | 'mortgageTermYears'
    | 'annualInterestRate'
    | 'monthlyDebtPayments'
    | 'downPaymentValue'
    | 'propertyTax'
    | 'hoaFee'
    | 'insurance'
    | 'customFrontEndDti'
    | 'customBackEndDti'
    | 'form',
    string
  >
>;

export type FixedBudgetFieldErrors = Partial<
  Record<
    | 'monthlyHousingBudget'
    | 'mortgageTermYears'
    | 'annualInterestRate'
    | 'downPaymentValue'
    | 'propertyTax'
    | 'hoaFee'
    | 'insurance'
    | 'maintenance'
    | 'form',
    string
  >
>;

export const DTI_PROFILE_RATIOS: Record<
  Exclude<DtiProfile, 'custom'>,
  { front: number; back: number; note: string }
> = {
  conventional: {
    front: 28,
    back: 36,
    note: 'Illustrative conventional 28/36 guideline — not a universal lender rule.',
  },
  fha: {
    front: 31,
    back: 43,
    note: 'Illustrative FHA-style DTI assumptions only — not an FHA underwriting decision. Mortgage insurance is not modeled here.',
  },
  va: {
    front: 41,
    back: 41,
    note: 'Illustrative VA-style DTI-only estimate. Residual income and other VA requirements are not calculated.',
  },
};

export function createDefaultIncomeInput(): IncomeBasedInput {
  return {
    annualHouseholdIncome: '120000',
    mortgageTermYears: '30',
    annualInterestRate: '7.3',
    monthlyDebtPayments: '0',
    downPaymentMode: 'percentage',
    downPaymentValue: '20',
    propertyTaxMode: 'annualPercentage',
    propertyTax: '1.5',
    hoaMode: 'annualPercentage',
    hoaFee: '0',
    insuranceMode: 'annualPercentage',
    insurance: '0.5',
    dtiProfile: 'conventional',
    customFrontEndDti: '28',
    customBackEndDti: '36',
    currency: 'USD',
  };
}

export function createDefaultFixedBudgetInput(): FixedBudgetInput {
  return {
    monthlyHousingBudget: '3500',
    mortgageTermYears: '30',
    annualInterestRate: '7.3',
    downPaymentMode: 'percentage',
    downPaymentValue: '20',
    includeTaxesAndFees: true,
    propertyTaxMode: 'annualPercentage',
    propertyTax: '1.5',
    hoaMode: 'annualPercentage',
    hoaFee: '0',
    insuranceMode: 'annualPercentage',
    insurance: '0.5',
    maintenanceMode: 'annualPercentage',
    maintenance: '1.5',
    currency: 'USD',
  };
}
