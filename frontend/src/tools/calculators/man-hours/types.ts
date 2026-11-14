import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ManHoursInput {
  people: string;
  hoursPerPerson: string;
  hourlyPay: string;
  currency: SupportedCurrency;
}

export interface ManHoursResult {
  people: number;
  hoursPerPerson: number;
  hourlyPay: number;
  manHours: number;
  costPerPerson: number;
  totalCost: number;
  currency: SupportedCurrency;
  manHoursDisplay: string;
  costPerPersonDisplay: string;
  totalCostDisplay: string;
  shareManHours: string;
  shareCostPerPerson: string;
  shareTotalCost: string;
}

export type ManHoursFieldErrors = {
  people?: string;
  hoursPerPerson?: string;
  hourlyPay?: string;
  currency?: string;
  form?: string;
};

export function createDefaultInput(): ManHoursInput {
  return {
    people: '',
    hoursPerPerson: '',
    hourlyPay: '',
    currency: 'PKR',
  };
}
