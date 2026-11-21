import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CarLeaseInput {
  msrp: string;
  msrpCurrency: SupportedCurrency;
  negotiatedPrice: string;
  negotiatedPriceCurrency: SupportedCurrency;
  leaseTermMonths: string;
  salesTaxPercent: string;
  residualFactorPercent: string;
  moneyFactor: string;
  dealerFee: string;
  dealerFeeCurrency: SupportedCurrency;
  registrationFee: string;
  registrationFeeCurrency: SupportedCurrency;
  downPayment: string;
  downPaymentCurrency: SupportedCurrency;
  tradeInValue: string;
  tradeInValueCurrency: SupportedCurrency;
  otherReductions: string;
  otherReductionsCurrency: SupportedCurrency;
  netCapCostCurrency: SupportedCurrency;
  residualValueCurrency: SupportedCurrency;
  monthlyDepreciationCurrency: SupportedCurrency;
  monthlyLeaseFeeCurrency: SupportedCurrency;
  monthlyBasePaymentCurrency: SupportedCurrency;
  monthlySalesTaxCurrency: SupportedCurrency;
  monthlyLeasePaymentCurrency: SupportedCurrency;
  basicOpen: boolean;
  additionalOpen: boolean;
  resultsOpen: boolean;
}

export interface CarLeaseResult {
  netCapitalizedCostCanonical: number;
  residualValueCanonical: number;
  monthlyDepreciationCanonical: number;
  monthlyLeaseFeeCanonical: number;
  monthlyBasePaymentCanonical: number;
  monthlySalesTaxCanonical: number;
  monthlyLeasePaymentCanonical: number;
  netCapitalizedCost: number;
  residualValue: number;
  monthlyDepreciation: number;
  monthlyLeaseFee: number;
  monthlyBasePayment: number;
  monthlySalesTax: number;
  monthlyLeasePayment: number;
  calculationCurrency: SupportedCurrency;
  netCapCostCurrency: SupportedCurrency;
  residualValueCurrency: SupportedCurrency;
  monthlyDepreciationCurrency: SupportedCurrency;
  monthlyLeaseFeeCurrency: SupportedCurrency;
  monthlyBasePaymentCurrency: SupportedCurrency;
  monthlySalesTaxCurrency: SupportedCurrency;
  monthlyLeasePaymentCurrency: SupportedCurrency;
  formattedNetCapitalizedCost: string;
  formattedResidualValue: string;
  formattedMonthlyDepreciation: string;
  formattedMonthlyLeaseFee: string;
  formattedMonthlyBasePayment: string;
  formattedMonthlySalesTax: string;
  formattedMonthlyLeasePayment: string;
}

export type CarLeaseFieldErrors = {
  msrp?: string;
  negotiatedPrice?: string;
  leaseTermMonths?: string;
  salesTaxPercent?: string;
  residualFactorPercent?: string;
  moneyFactor?: string;
  dealerFee?: string;
  registrationFee?: string;
  downPayment?: string;
  tradeInValue?: string;
  otherReductions?: string;
  form?: string;
};

export function createDefaultInput(): CarLeaseInput {
  return {
    msrp: '',
    msrpCurrency: 'PKR',
    negotiatedPrice: '',
    negotiatedPriceCurrency: 'PKR',
    leaseTermMonths: '36',
    salesTaxPercent: '5',
    residualFactorPercent: '58',
    moneyFactor: '0.001',
    dealerFee: '0',
    dealerFeeCurrency: 'PKR',
    registrationFee: '0',
    registrationFeeCurrency: 'PKR',
    downPayment: '0',
    downPaymentCurrency: 'PKR',
    tradeInValue: '0',
    tradeInValueCurrency: 'PKR',
    otherReductions: '0',
    otherReductionsCurrency: 'PKR',
    netCapCostCurrency: 'PKR',
    residualValueCurrency: 'PKR',
    monthlyDepreciationCurrency: 'PKR',
    monthlyLeaseFeeCurrency: 'PKR',
    monthlyBasePaymentCurrency: 'PKR',
    monthlySalesTaxCurrency: 'PKR',
    monthlyLeasePaymentCurrency: 'PKR',
    basicOpen: true,
    additionalOpen: true,
    resultsOpen: true,
  };
}
