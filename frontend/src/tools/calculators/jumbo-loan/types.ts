import type { SupportedCurrency } from '@/tools/shared/currency';

export type DownPaymentSource = 'percent' | 'amount';

export interface JumboLoanInput {
  propertyPrice: string;
  propertyPriceCurrency: SupportedCurrency;
  downPayment: string;
  downPaymentCurrency: SupportedCurrency;
  downPaymentPercent: string;
  /** Tracks last edited down-payment control to avoid circular updates. */
  downPaymentSource: DownPaymentSource;
  jumboLoanAmountCurrency: SupportedCurrency;
  termYears: string;
  termMonths: string;
  interestRatePercent: string;
  firstDay: string;
  monthlyPaymentCurrency: SupportedCurrency;
}

export interface JumboLoanResult {
  downPaymentCalc: number;
  downPaymentDisplay: number;
  jumboLoanAmountCalc: number;
  jumboLoanAmountDisplay: number;
  paymentCount: number;
  monthlyPaymentCalc: number;
  monthlyPaymentDisplay: number;
  payoffDate: string;
  calcCurrency: SupportedCurrency;
  formattedDownPayment: string;
  formattedJumboLoanAmount: string;
  formattedMonthlyPayment: string;
  formattedPayoffDate: string;
}

export type JumboLoanFieldErrors = {
  propertyPrice?: string;
  downPayment?: string;
  downPaymentPercent?: string;
  termYears?: string;
  termMonths?: string;
  interestRatePercent?: string;
  firstDay?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): JumboLoanInput {
  return {
    propertyPrice: '750000',
    propertyPriceCurrency: 'PKR',
    downPayment: '150000',
    downPaymentCurrency: 'PKR',
    downPaymentPercent: '20',
    downPaymentSource: 'percent',
    jumboLoanAmountCurrency: 'PKR',
    termYears: '30',
    termMonths: '0',
    interestRatePercent: '6.5',
    firstDay: todayIsoDate(),
    monthlyPaymentCurrency: 'PKR',
  };
}
