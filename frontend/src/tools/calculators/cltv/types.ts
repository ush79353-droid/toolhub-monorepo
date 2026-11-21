import type { SupportedCurrency } from '@/tools/shared/currency';

export type ReportingPeriodKind = 'annual' | 'quarterly' | 'monthly' | 'custom';

export interface CltvInput {
  currency: SupportedCurrency;
  /** Direct APV (standard mode) */
  averagePurchaseValue: string;
  /** Direct APF annual purchases/customer/year */
  averagePurchaseFrequency: string;
  averageCustomerLifespan: string;
  useBusinessData: boolean;
  totalRevenue: string;
  totalPurchases: string;
  numberOfCustomers: string;
  reportingPeriod: ReportingPeriodKind;
  customPeriodMonths: string;
  useGrossMargin: boolean;
  grossProfitMargin: string;
  useCac: boolean;
  customerAcquisitionCost: string;
  useDiscounted: boolean;
  discountRate: string;
  /** Optional: estimate lifespan ≈ 1/churn */
  useChurnLifespan: boolean;
  annualChurnRate: string;
}

export interface CltvResult {
  currency: SupportedCurrency;
  averagePurchaseValue: number;
  annualPurchaseFrequency: number;
  averageCustomerValue: number;
  averageCustomerLifespan: number;
  revenueCLTV: number;
  grossProfitCLTV: number | null;
  grossMarginPercent: number | null;
  customerAcquisitionCost: number | null;
  cltvForRatio: number;
  cltvCACRatio: number | null;
  discountedCLTV: number | null;
  discountRatePercent: number | null;
  estimatedLifespanFromChurn: number | null;
  usedBusinessData: boolean;
  reportingPeriodLabel: string;
  formattedApv: string;
  formattedApf: string;
  formattedAcv: string;
  formattedLifespan: string;
  formattedRevenueCltv: string;
  formattedGrossProfitCltv: string;
  formattedCac: string;
  formattedRatio: string;
  formattedDiscounted: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type CltvFieldErrors = {
  form?: string;
  averagePurchaseValue?: string;
  averagePurchaseFrequency?: string;
  averageCustomerLifespan?: string;
  totalRevenue?: string;
  totalPurchases?: string;
  numberOfCustomers?: string;
  customPeriodMonths?: string;
  grossProfitMargin?: string;
  customerAcquisitionCost?: string;
  discountRate?: string;
  annualChurnRate?: string;
};

export function createDefaultInput(): CltvInput {
  return {
    currency: 'USD',
    averagePurchaseValue: '',
    averagePurchaseFrequency: '',
    averageCustomerLifespan: '',
    useBusinessData: false,
    totalRevenue: '',
    totalPurchases: '',
    numberOfCustomers: '',
    reportingPeriod: 'annual',
    customPeriodMonths: '12',
    useGrossMargin: false,
    grossProfitMargin: '',
    useCac: false,
    customerAcquisitionCost: '',
    useDiscounted: false,
    discountRate: '',
    useChurnLifespan: false,
    annualChurnRate: '',
  };
}

export function createEmptyInput(): CltvInput {
  return createDefaultInput();
}

/** Company Alpha simplified: APV $50 · APF 5 · L 3 → CLTV $750 */
export function createExampleInput(): CltvInput {
  return {
    currency: 'USD',
    averagePurchaseValue: '50',
    averagePurchaseFrequency: '5',
    averageCustomerLifespan: '3',
    useBusinessData: false,
    totalRevenue: '5000000',
    totalPurchases: '100000',
    numberOfCustomers: '20000',
    reportingPeriod: 'annual',
    customPeriodMonths: '12',
    useGrossMargin: false,
    grossProfitMargin: '40',
    useCac: false,
    customerAcquisitionCost: '100',
    useDiscounted: false,
    discountRate: '10',
    useChurnLifespan: false,
    annualChurnRate: '20',
  };
}
