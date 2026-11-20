import type { SupportedCurrency } from '@/tools/shared/currency';

export type PitiStatus = 'valid' | 'incomplete' | 'invalid' | 'empty';

export interface PitiInput {
  principal: string;
  termYears: string;
  termMonths: string;
  annualInterestRate: string;
  annualPropertyTax: string;
  annualInsurance: string;
  currency: SupportedCurrency;
}

export interface PitiResult {
  totalTermMonths: number;
  monthlyInterestRate: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeownersInsurance: number;
  monthlyPITI: number;
  annualPITI: number;
  monthlyEscrow: number;
  totalMortgagePayments: number;
  totalMortgageInterest: number;
  status: PitiStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedPI: string;
  formattedTax: string;
  formattedInsurance: string;
  formattedPITI: string;
  formattedAnnualPITI: string;
  formattedTotalPayments: string;
  formattedTotalInterest: string;
  formattedEscrow: string;
}

export type PitiFieldErrors = {
  form?: string;
  principal?: string;
  termYears?: string;
  termMonths?: string;
  annualInterestRate?: string;
  annualPropertyTax?: string;
  annualInsurance?: string;
};

export function createDefaultInput(): PitiInput {
  return {
    principal: '200000',
    termYears: '30',
    termMonths: '0',
    annualInterestRate: '7',
    annualPropertyTax: '3600',
    annualInsurance: '1200',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): PitiInput {
  return {
    principal: '',
    termYears: '',
    termMonths: '',
    annualInterestRate: '',
    annualPropertyTax: '',
    annualInsurance: '',
    currency,
  };
}
