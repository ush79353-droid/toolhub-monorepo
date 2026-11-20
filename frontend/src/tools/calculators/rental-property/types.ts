import type { SupportedCurrency } from '@/tools/shared/currency';

export type DownPaymentMode = 'amount' | 'percentage';
export type MoneyPeriod = 'monthly' | 'annually';
export type DurationUnit = 'years' | 'months';
export type SellingPriceMode = 'appreciation' | 'manual';

export interface RentalPropertyInput {
  currency: SupportedCurrency;

  purchasePrice: string;
  downPaymentMode: DownPaymentMode;
  downPaymentAmount: string;
  downPaymentPercentage: string;
  interestRate: string;
  loanTermValue: string;
  loanTermUnit: DurationUnit;

  rent: string;
  rentPeriod: MoneyPeriod;
  vacancyRate: string;
  managementFeeRate: string;

  propertyTax: string;
  propertyTaxPeriod: MoneyPeriod;
  insurance: string;
  insurancePeriod: MoneyPeriod;
  maintenance: string;
  maintenancePeriod: MoneyPeriod;
  hoaFee: string;
  hoaFeePeriod: MoneyPeriod;
  otherCosts: string;
  otherCostsPeriod: MoneyPeriod;

  appreciationRate: string;
  holdingPeriodValue: string;
  holdingPeriodUnit: DurationUnit;
  sellingPriceMode: SellingPriceMode;
  manualSellingPrice: string;
  sellingCostPercent: string;
  sellingCostFixed: string;

  closingCosts: string;
  renovationCosts: string;
  otherInitialCosts: string;
}

export interface RentalPropertyResult {
  currency: SupportedCurrency;

  purchasePrice: number;
  downPaymentAmount: number;
  downPaymentPercentage: number;
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  monthlyMortgagePayment: number;
  totalMortgagePayments: number;

  annualGrossRent: number;
  vacancyLoss: number;
  effectiveRentalIncome: number;
  managementFee: number;
  annualOperatingExpenses: number;
  noi: number;

  annualDebtService: number;
  annualCashFlow: number;
  monthlyCashFlow: number;
  monthlyOperatingExpenses: number;
  monthlyGrossIncome: number;

  initialCashInvestment: number;
  cashOnCashReturnPercent: number | null;
  capRatePercent: number | null;

  holdingPeriodMonths: number;
  sellingPrice: number;
  sellingCosts: number;
  outstandingLoanBalance: number;
  netSaleProceeds: number;
  cumulativeOperatingCashFlow: number;
  totalInvestmentProfit: number;
  totalRoiPercent: number | null;

  formattedPurchasePrice: string;
  formattedDownPaymentAmount: string;
  formattedDownPaymentPercentage: string;
  formattedLoanAmount: string;
  formattedMonthlyMortgagePayment: string;
  formattedTotalMortgagePayments: string;
  formattedAnnualGrossRent: string;
  formattedVacancyLoss: string;
  formattedEffectiveRentalIncome: string;
  formattedManagementFee: string;
  formattedAnnualOperatingExpenses: string;
  formattedMonthlyOperatingExpenses: string;
  formattedNoi: string;
  formattedAnnualDebtService: string;
  formattedAnnualCashFlow: string;
  formattedMonthlyCashFlow: string;
  formattedMonthlyGrossIncome: string;
  formattedInitialCashInvestment: string;
  formattedCashOnCashReturn: string | null;
  formattedCapRate: string | null;
  formattedSellingPrice: string;
  formattedSellingCosts: string;
  formattedOutstandingLoanBalance: string;
  formattedNetSaleProceeds: string;
  formattedCumulativeOperatingCashFlow: string;
  formattedTotalInvestmentProfit: string;
  formattedTotalRoi: string | null;
}

export type RentalPropertyFieldErrors = {
  purchasePrice?: string;
  downPaymentAmount?: string;
  downPaymentPercentage?: string;
  interestRate?: string;
  loanTermValue?: string;
  rent?: string;
  vacancyRate?: string;
  managementFeeRate?: string;
  propertyTax?: string;
  insurance?: string;
  maintenance?: string;
  hoaFee?: string;
  otherCosts?: string;
  appreciationRate?: string;
  holdingPeriodValue?: string;
  manualSellingPrice?: string;
  sellingCostPercent?: string;
  sellingCostFixed?: string;
  closingCosts?: string;
  renovationCosts?: string;
  otherInitialCosts?: string;
  form?: string;
};

export function createDefaultInput(): RentalPropertyInput {
  return {
    currency: 'PKR',
    purchasePrice: '',
    downPaymentMode: 'percentage',
    downPaymentAmount: '',
    downPaymentPercentage: '',
    interestRate: '',
    loanTermValue: '',
    loanTermUnit: 'years',
    rent: '',
    rentPeriod: 'monthly',
    vacancyRate: '0',
    managementFeeRate: '0',
    propertyTax: '',
    propertyTaxPeriod: 'annually',
    insurance: '',
    insurancePeriod: 'annually',
    maintenance: '',
    maintenancePeriod: 'annually',
    hoaFee: '',
    hoaFeePeriod: 'monthly',
    otherCosts: '',
    otherCostsPeriod: 'annually',
    appreciationRate: '0',
    holdingPeriodValue: '',
    holdingPeriodUnit: 'years',
    sellingPriceMode: 'appreciation',
    manualSellingPrice: '',
    sellingCostPercent: '0',
    sellingCostFixed: '0',
    closingCosts: '0',
    renovationCosts: '0',
    otherInitialCosts: '0',
  };
}
