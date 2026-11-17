import type { SupportedCurrency } from '@/tools/shared/currency';

export type MoveStatus = 'moving-in' | 'moving-out';

export interface ProratedRentInput {
  moveStatus: MoveStatus;
  /** ISO date `YYYY-MM-DD`. */
  movingDate: string;
  monthlyRent: string;
  monthlyRentCurrency: SupportedCurrency;
  proratedRentCurrency: SupportedCurrency;
}

export interface ProratedRentResult {
  daysInMonth: number;
  chargeableDays: number;
  dailyRent: number;
  proratedRentInMonthly: number;
  proratedRent: number;
  calcCurrency: SupportedCurrency;
  resultCurrency: SupportedCurrency;
  formattedProratedRent: string;
}

export type ProratedRentFieldErrors = {
  movingDate?: string;
  monthlyRent?: string;
  form?: string;
};

/** Screenshot example date: 11/17/2026. */
export function createDefaultInput(): ProratedRentInput {
  return {
    moveStatus: 'moving-in',
    movingDate: '2026-11-17',
    monthlyRent: '',
    monthlyRentCurrency: 'PKR',
    proratedRentCurrency: 'PKR',
  };
}
