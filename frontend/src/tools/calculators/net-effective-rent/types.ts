import type { SupportedCurrency } from '@/tools/shared/currency';

/** Rent / operating-cost period for money inputs. */
export type MoneyPeriod = 'month' | 'year';

export const MONEY_PERIOD_OPTIONS: readonly { value: MoneyPeriod; label: string }[] = [
  { value: 'month', label: 'mo' },
  { value: 'year', label: 'yr' },
] as const;

export interface NetEffectiveRentInput {
  termSectionOpen: boolean;
  discountsSectionOpen: boolean;
  expensesSectionOpen: boolean;

  leaseYears: string;
  leaseMonths: string;

  monthlyRent: string;
  monthlyRentCurrency: SupportedCurrency;
  monthlyRentPeriod: MoneyPeriod;

  rentFreeMonths: string;

  tenantCashAllowance: string;
  tenantCashAllowanceCurrency: SupportedCurrency;

  operatingCosts: string;
  operatingCostsCurrency: SupportedCurrency;
  operatingCostsPeriod: MoneyPeriod;

  operatingCostsPercent: string;

  monthlyResultCurrency: SupportedCurrency;
  annualResultCurrency: SupportedCurrency;

  /** Screenshot checkbox — area mode not defined in reference formulas. */
  areaBasedEnabled: boolean;
}

export interface NetEffectiveRentResult {
  leaseMonths: number;
  grossMonthlyRent: number;
  netEffectiveRentMonthly: number;
  netEffectiveRentAnnual: number;
  calcCurrency: SupportedCurrency;
  displayMonthly: number;
  displayAnnual: number;
  formattedMonthly: string;
  formattedAnnual: string;
}

export type NetEffectiveRentFieldErrors = {
  leaseYears?: string;
  leaseMonths?: string;
  monthlyRent?: string;
  rentFreeMonths?: string;
  tenantCashAllowance?: string;
  operatingCosts?: string;
  operatingCostsPercent?: string;
  form?: string;
};

export function createDefaultInput(): NetEffectiveRentInput {
  return {
    termSectionOpen: true,
    discountsSectionOpen: true,
    expensesSectionOpen: true,
    leaseYears: '1',
    leaseMonths: '0',
    monthlyRent: '',
    monthlyRentCurrency: 'PKR',
    monthlyRentPeriod: 'month',
    rentFreeMonths: '0',
    tenantCashAllowance: '0',
    tenantCashAllowanceCurrency: 'PKR',
    operatingCosts: '0',
    operatingCostsCurrency: 'PKR',
    operatingCostsPeriod: 'month',
    operatingCostsPercent: '',
    monthlyResultCurrency: 'PKR',
    annualResultCurrency: 'PKR',
    areaBasedEnabled: false,
  };
}
