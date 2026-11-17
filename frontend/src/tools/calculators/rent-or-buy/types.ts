import type { SupportedCurrency } from '@/tools/shared/currency';

export type DurationUnit = 'years' | 'months';
export type CostFrequency = 'week' | 'month' | 'year';

export interface RentOrBuyInput {
  stayingPeriod: string;
  stayingUnit: DurationUnit;
  moneyYouHave: string;
  moneyCurrency: SupportedCurrency;

  rentPrice: string;
  rentCurrency: SupportedCurrency;
  rentFrequency: CostFrequency;
  agentCommission: string;
  agentCommissionCurrency: SupportedCurrency;
  otherRentCosts: string;
  otherRentCostsCurrency: SupportedCurrency;
  depositInterestPercent: string;
  rentCostCurrency: SupportedCurrency;
  rentCostFrequency: CostFrequency;
  totalRentCostCurrency: SupportedCurrency;

  propertyCost: string;
  propertyCurrency: SupportedCurrency;
  mortgageRatePercent: string;
  loanTerm: string;
  loanTermUnit: DurationUnit;
  mortgageLeftCurrency: SupportedCurrency;
  buyingCommissionPercent: string;
  sellingCommissionPercent: string;
  otherFeesPercent: string;
  appreciationPercent: string;
  buyCostCurrency: SupportedCurrency;
  buyCostFrequency: CostFrequency;
  totalBuyCostCurrency: SupportedCurrency;
}

export interface RentOrBuyResult {
  stayingMonths: number;
  monthlyRent: number;
  depositInterestEarned: number;
  totalRentCost: number;
  rentCostPeriodic: number;

  loanAmount: number;
  monthlyMortgagePayment: number;
  mortgageLeft: number;
  futurePropertyValue: number;
  buyingCommissionAmount: number;
  sellingCommissionAmount: number;
  otherFeesTotal: number;
  totalMortgagePayments: number;
  totalBuyCost: number;
  buyCostPeriodic: number;

  calcCurrency: SupportedCurrency;
  rentCostDisplay: number;
  totalRentCostDisplay: number;
  mortgageLeftDisplay: number;
  buyCostDisplay: number;
  totalBuyCostDisplay: number;
  formattedRentCost: string;
  formattedTotalRentCost: string;
  formattedMortgageLeft: string;
  formattedBuyCost: string;
  formattedTotalBuyCost: string;
  preferBuy: boolean;
}

export type RentOrBuyFieldErrors = {
  stayingPeriod?: string;
  moneyYouHave?: string;
  rentPrice?: string;
  agentCommission?: string;
  otherRentCosts?: string;
  depositInterestPercent?: string;
  propertyCost?: string;
  mortgageRatePercent?: string;
  loanTerm?: string;
  buyingCommissionPercent?: string;
  sellingCommissionPercent?: string;
  otherFeesPercent?: string;
  appreciationPercent?: string;
  form?: string;
};

export function createDefaultInput(): RentOrBuyInput {
  return {
    stayingPeriod: '',
    stayingUnit: 'years',
    moneyYouHave: '',
    moneyCurrency: 'PKR',

    rentPrice: '',
    rentCurrency: 'PKR',
    rentFrequency: 'month',
    agentCommission: '0',
    agentCommissionCurrency: 'PKR',
    otherRentCosts: '0',
    otherRentCostsCurrency: 'PKR',
    depositInterestPercent: '2',
    rentCostCurrency: 'PKR',
    rentCostFrequency: 'month',
    totalRentCostCurrency: 'PKR',

    propertyCost: '',
    propertyCurrency: 'PKR',
    mortgageRatePercent: '5',
    loanTerm: '',
    loanTermUnit: 'years',
    mortgageLeftCurrency: 'PKR',
    buyingCommissionPercent: '4',
    sellingCommissionPercent: '7',
    otherFeesPercent: '2.3',
    appreciationPercent: '2',
    buyCostCurrency: 'PKR',
    buyCostFrequency: 'month',
    totalBuyCostCurrency: 'PKR',
  };
}
