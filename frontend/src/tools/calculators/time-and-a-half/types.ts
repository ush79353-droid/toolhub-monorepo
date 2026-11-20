import type { SupportedCurrency } from '@/tools/shared/currency';

export interface TimeAndAHalfInput {
  /** Standard hourly rate (authoritative). */
  standardRate: string;
  standardRateCurrency: SupportedCurrency;
  timeAndHalfRateCurrency: SupportedCurrency;
  doubleTimeRateCurrency: SupportedCurrency;
  tripleTimeRateCurrency: SupportedCurrency;
  standardHours: string;
  timeAndHalfHours: string;
  doubleTimeHours: string;
  tripleTimeHours: string;
  standardPayCurrency: SupportedCurrency;
  timeAndHalfPayCurrency: SupportedCurrency;
  doubleTimePayCurrency: SupportedCurrency;
  tripleTimePayCurrency: SupportedCurrency;
  totalPayCurrency: SupportedCurrency;
  ratesOpen: boolean;
  hoursOpen: boolean;
  earningsOpen: boolean;
}

export interface TimeAndAHalfResult {
  standardRateCanonical: number;
  timeAndHalfRateCanonical: number;
  doubleTimeRateCanonical: number;
  tripleTimeRateCanonical: number;
  standardPayCanonical: number;
  timeAndHalfPayCanonical: number;
  doubleTimePayCanonical: number;
  tripleTimePayCanonical: number;
  totalPayCanonical: number;
  standardRate: number;
  timeAndHalfRate: number;
  doubleTimeRate: number;
  tripleTimeRate: number;
  standardPay: number;
  timeAndHalfPay: number;
  doubleTimePay: number;
  tripleTimePay: number;
  totalPay: number;
  standardRateCurrency: SupportedCurrency;
  timeAndHalfRateCurrency: SupportedCurrency;
  doubleTimeRateCurrency: SupportedCurrency;
  tripleTimeRateCurrency: SupportedCurrency;
  standardPayCurrency: SupportedCurrency;
  timeAndHalfPayCurrency: SupportedCurrency;
  doubleTimePayCurrency: SupportedCurrency;
  tripleTimePayCurrency: SupportedCurrency;
  totalPayCurrency: SupportedCurrency;
  sourceCurrency: SupportedCurrency;
  formattedStandardRate: string;
  formattedTimeAndHalfRate: string;
  formattedDoubleTimeRate: string;
  formattedTripleTimeRate: string;
  formattedStandardPay: string;
  formattedTimeAndHalfPay: string;
  formattedDoubleTimePay: string;
  formattedTripleTimePay: string;
  formattedTotalPay: string;
}

export type TimeAndAHalfFieldErrors = {
  standardRate?: string;
  standardHours?: string;
  timeAndHalfHours?: string;
  doubleTimeHours?: string;
  tripleTimeHours?: string;
  form?: string;
};

export function createDefaultInput(): TimeAndAHalfInput {
  return {
    standardRate: '',
    standardRateCurrency: 'PKR',
    timeAndHalfRateCurrency: 'PKR',
    doubleTimeRateCurrency: 'PKR',
    tripleTimeRateCurrency: 'PKR',
    standardHours: '',
    timeAndHalfHours: '',
    doubleTimeHours: '',
    tripleTimeHours: '',
    standardPayCurrency: 'PKR',
    timeAndHalfPayCurrency: 'PKR',
    doubleTimePayCurrency: 'PKR',
    tripleTimePayCurrency: 'PKR',
    totalPayCurrency: 'PKR',
    ratesOpen: true,
    hoursOpen: true,
    earningsOpen: true,
  };
}
