import type { SupportedCurrency } from '@/tools/shared/currency';

export type PeriodUnit = 'days' | 'weeks' | 'months' | 'years';
export type ExpenseFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type OfficeSpaceType = 'lease' | 'own';
export type CheaperOption = 'remote' | 'on-location' | 'equal';

export interface ExtraExpenseRow {
  id: string;
  name: string;
  amount: string;
  frequency: ExpenseFrequency;
}

export interface SideExpenses {
  stationery: string;
  stationeryFrequency: ExpenseFrequency;
  internet: string;
  internetFrequency: ExpenseFrequency;
  miscellaneous: string;
  miscellaneousFrequency: ExpenseFrequency;
  recurring: string;
  recurringFrequency: ExpenseFrequency;
  showAdditional: boolean;
  additional: ExtraExpenseRow[];
}

export interface RemoteVsOnLocationInput {
  periodValue: string;
  periodUnit: PeriodUnit;
  currency: SupportedCurrency;

  remoteEmployees: string;
  remoteOneTimeAllowance: string;
  remote: SideExpenses;

  onLocationEmployees: string;
  officeSpaceType: OfficeSpaceType;
  onLocationOneTime: string;
  officeLease: string;
  officeLeaseFrequency: ExpenseFrequency;
  onLocation: SideExpenses;

  remoteOpen: boolean;
  onLocationOpen: boolean;
}

export interface RemoteVsOnLocationResult {
  comparisonPeriodMonths: number;
  periodLabel: string;

  remoteOneTimeCost: number;
  remoteRecurringCost: number;
  totalRemoteCost: number;
  remoteCostPerEmployee: number | null;

  onLocationOneTimeCost: number;
  onLocationRecurringCost: number;
  totalOnLocationCost: number;
  onLocationCostPerEmployee: number | null;

  costDifference: number;
  remoteSavingsPercentage: number | null;
  onLocationSavingsPercentage: number | null;
  cheaperOption: CheaperOption;
  interpretation: string;

  remoteEmployees: number;
  onLocationEmployees: number;
  currency: SupportedCurrency;

  formattedRemoteOneTimeCost: string;
  formattedRemoteRecurringCost: string;
  formattedTotalRemoteCost: string;
  formattedRemoteCostPerEmployee: string;
  formattedOnLocationOneTimeCost: string;
  formattedOnLocationRecurringCost: string;
  formattedTotalOnLocationCost: string;
  formattedOnLocationCostPerEmployee: string;
  formattedCostDifference: string;
  formattedRemoteSavingsPercentage: string;
  formattedOnLocationSavingsPercentage: string;
}

export type RemoteVsOnLocationFieldErrors = {
  periodValue?: string;
  remoteEmployees?: string;
  remoteOneTimeAllowance?: string;
  onLocationEmployees?: string;
  onLocationOneTime?: string;
  officeLease?: string;
  form?: string;
} & Partial<Record<string, string>>;

export const FREQUENCY_OPTIONS: readonly { value: ExpenseFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export const PERIOD_UNIT_OPTIONS: readonly { value: PeriodUnit; label: string }[] = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
];

let extraId = 0;
export function createExtraExpenseRow(): ExtraExpenseRow {
  extraId += 1;
  return {
    id: `extra-${extraId}`,
    name: '',
    amount: '',
    frequency: 'monthly',
  };
}

export function createSideExpenses(): SideExpenses {
  return {
    stationery: '',
    stationeryFrequency: 'monthly',
    internet: '',
    internetFrequency: 'monthly',
    miscellaneous: '',
    miscellaneousFrequency: 'monthly',
    recurring: '',
    recurringFrequency: 'monthly',
    showAdditional: false,
    additional: [],
  };
}

export function createDefaultInput(): RemoteVsOnLocationInput {
  return {
    periodValue: '6',
    periodUnit: 'years',
    currency: 'PKR',
    remoteEmployees: '',
    remoteOneTimeAllowance: '',
    remote: createSideExpenses(),
    onLocationEmployees: '',
    officeSpaceType: 'lease',
    onLocationOneTime: '',
    officeLease: '',
    officeLeaseFrequency: 'monthly',
    onLocation: createSideExpenses(),
    remoteOpen: true,
    onLocationOpen: true,
  };
}

/** Spec-aligned worked example: remote 800k vs on-location own 750k over 12 months. */
export function createExampleInput(): RemoteVsOnLocationInput {
  return {
    periodValue: '12',
    periodUnit: 'months',
    currency: 'PKR',
    remoteEmployees: '10',
    remoteOneTimeAllowance: '20000',
    remote: {
      ...createSideExpenses(),
      recurring: '5000',
      recurringFrequency: 'monthly',
    },
    onLocationEmployees: '10',
    officeSpaceType: 'own',
    onLocationOneTime: '150000',
    officeLease: '',
    officeLeaseFrequency: 'monthly',
    onLocation: {
      ...createSideExpenses(),
      recurring: '50000',
      recurringFrequency: 'monthly',
    },
    remoteOpen: true,
    onLocationOpen: true,
  };
}
