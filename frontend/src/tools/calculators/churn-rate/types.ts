export interface ChurnRateInput {
  startingCustomers: number;
  customersLost: number;
}

export interface ChurnRateResult {
  startingCustomers: number;
  customersLost: number;
  churnRatePercent: number;
  customerLifetimePeriods: number | null;
  churnRateDisplay: string;
  lifetimeDisplay: string;
}

export type ChurnRateField = 'startingCustomers' | 'customersLost';
export type ChurnRateFieldErrors = Partial<Record<ChurnRateField | 'form', string>>;
