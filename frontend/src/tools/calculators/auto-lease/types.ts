/** Calculation direction from the screenshot tabs. */
export type AutoLeaseMode = 'total-price' | 'monthly-payment';

/** Interest entry style shown in the Rate Type dropdown. */
export type AutoLeaseRateType = 'money-factor' | 'apr';

export interface AutoLeaseInput {
  mode: AutoLeaseMode;
  autoPrice: string;
  monthlyPayment: string;
  leaseTermMonths: string;
  rateType: AutoLeaseRateType;
  /** Money factor when rateType is money-factor; APR % when rateType is apr. */
  rateValue: string;
  downPayment: string;
  tradeInValue: string;
  salesTaxPercent: string;
  residualValue: string;
}

export interface AutoLeaseResult {
  mode: AutoLeaseMode;
  autoPrice: number;
  monthlyPayment: number;
  leaseTermMonths: number;
  moneyFactor: number;
  aprPercent: number;
  rateType: AutoLeaseRateType;
  downPayment: number;
  tradeInValue: number;
  salesTaxPercent: number;
  residualValue: number;
  capitalizedCost: number;
  monthlyDepreciation: number;
  monthlyFinanceCharge: number;
  baseMonthlyPayment: number;
  monthlySalesTax: number;
  totalLeasePayments: number;
  totalDepreciation: number;
  totalFinanceCharge: number;
  totalSalesTax: number;
  upfrontCost: number;
  totalLeaseCost: number;
  formattedAutoPrice: string;
  formattedMonthlyPayment: string;
  formattedCapitalizedCost: string;
  formattedMonthlyDepreciation: string;
  formattedMonthlyFinanceCharge: string;
  formattedBaseMonthlyPayment: string;
  formattedMonthlySalesTax: string;
  formattedTotalLeasePayments: string;
  formattedTotalDepreciation: string;
  formattedTotalFinanceCharge: string;
  formattedTotalSalesTax: string;
  formattedUpfrontCost: string;
  formattedTotalLeaseCost: string;
  formattedMoneyFactor: string;
  formattedAprPercent: string;
  summaryText: string;
}

export type AutoLeaseFieldErrors = {
  autoPrice?: string;
  monthlyPayment?: string;
  leaseTermMonths?: string;
  rateValue?: string;
  downPayment?: string;
  tradeInValue?: string;
  salesTaxPercent?: string;
  residualValue?: string;
  form?: string;
};

/** Screenshot defaults for the Total Price tab. */
export function createDefaultInput(): AutoLeaseInput {
  return {
    mode: 'total-price',
    autoPrice: '50000',
    monthlyPayment: '',
    leaseTermMonths: '36',
    rateType: 'money-factor',
    rateValue: '0.00208',
    downPayment: '10000',
    tradeInValue: '0',
    salesTaxPercent: '7',
    residualValue: '24000',
  };
}
