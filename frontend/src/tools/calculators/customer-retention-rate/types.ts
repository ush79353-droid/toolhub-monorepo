export interface CustomerRetentionInput {
  existingCustomers: number;
  newCustomers: number;
  totalCustomers: number;
}

export interface CustomerRetentionResult {
  existingCustomers: number;
  newCustomers: number;
  totalCustomers: number;
  retainedCustomers: number;
  retentionRatePercent: number;
  attritionRatePercent: number;
  retentionDisplay: string;
  attritionDisplay: string;
}

export type CustomerRetentionField =
  | 'existingCustomers'
  | 'newCustomers'
  | 'totalCustomers';

export type CustomerRetentionFieldErrors = Partial<
  Record<CustomerRetentionField | 'form', string>
>;
