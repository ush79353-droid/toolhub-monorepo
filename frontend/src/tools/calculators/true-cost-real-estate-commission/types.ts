import type { SupportedCurrency } from '@/tools/shared/currency';

export interface TrueCostRealEstateCommissionInput {
  propertyPrice: string;
  /** Canonical calculation currency for property price / normalized money. */
  propertyPriceCurrency: SupportedCurrency;
  downPayment: string;
  /** Independent currency of the entered down payment. */
  downPaymentCurrency: SupportedCurrency;
  sellerCommissionPercent: string;
  buyerCommissionPercent: string;
  termYears: string;
  termMonths: string;
  interestRatePercent: string;
  propertySectionOpen: boolean;
  mortgageSectionOpen: boolean;
  /** Independent display currencies for mortgage outputs. */
  loanAmountCurrency: SupportedCurrency;
  loanCommissionCurrency: SupportedCurrency;
  monthlyPaymentCurrency: SupportedCurrency;
  monthlyCommissionCurrency: SupportedCurrency;
  totalPaymentsCurrency: SupportedCurrency;
  /** Independent display currencies for commission-cost outputs. */
  apparentCommissionCurrency: SupportedCurrency;
  commissionAmountCurrency: SupportedCurrency;
  realCommissionCostCurrency: SupportedCurrency;
}

export interface TrueCostRealEstateCommissionResult {
  loanAmount: number;
  loanCommission: number;
  monthlyPayment: number;
  monthlyCommission: number;
  totalPayments: number;
  apparentCommission: number;
  commissionAmount: number;
  realCommissionCost: number;
  numberOfPayments: number;
  calcCurrency: SupportedCurrency;
  formattedLoanAmount: string;
  formattedLoanCommission: string;
  formattedMonthlyPayment: string;
  formattedMonthlyCommission: string;
  formattedTotalPayments: string;
  formattedApparentCommission: string;
  formattedCommissionAmount: string;
  formattedRealCommissionCost: string;
}

export type TrueCostRealEstateCommissionFieldErrors = {
  propertyPrice?: string;
  downPayment?: string;
  sellerCommissionPercent?: string;
  buyerCommissionPercent?: string;
  termYears?: string;
  termMonths?: string;
  interestRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): TrueCostRealEstateCommissionInput {
  return {
    propertyPrice: '300000',
    propertyPriceCurrency: 'PKR',
    downPayment: '60000',
    downPaymentCurrency: 'PKR',
    sellerCommissionPercent: '6',
    buyerCommissionPercent: '0',
    termYears: '30',
    termMonths: '0',
    interestRatePercent: '7.83',
    propertySectionOpen: true,
    mortgageSectionOpen: true,
    loanAmountCurrency: 'PKR',
    loanCommissionCurrency: 'PKR',
    monthlyPaymentCurrency: 'PKR',
    monthlyCommissionCurrency: 'PKR',
    totalPaymentsCurrency: 'PKR',
    apparentCommissionCurrency: 'PKR',
    commissionAmountCurrency: 'PKR',
    realCommissionCostCurrency: 'PKR',
  };
}
