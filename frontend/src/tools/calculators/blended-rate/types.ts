import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_BLENDED_LOANS = 20;

export type BlendedRateStatus =
  | 'valid'
  | 'partial'
  | 'incomplete'
  | 'invalid'
  | 'zeroBalance';

export interface BlendedRateEntry {
  id: string;
  balance: string;
  rate: string;
}

export interface BlendedRateInput {
  entries: BlendedRateEntry[];
  currency: SupportedCurrency;
}

export interface BlendedRateContribution {
  id: string;
  index: number;
  balance: number;
  rate: number;
  weight: number;
  rateContribution: number;
  annualInterest: number;
}

export interface BlendedRateResult {
  totalBalance: number;
  blendedRate: number;
  totalAnnualInterest: number;
  estimatedMonthlyInterest: number;
  includedLoans: number;
  minimumRate: number;
  maximumRate: number;
  contributions: BlendedRateContribution[];
  status: BlendedRateStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedTotalBalance: string;
  formattedBlendedRate: string;
  formattedAnnualInterest: string;
  formattedMonthlyInterest: string;
}

export type BlendedRateFieldErrors = {
  form?: string;
  entries?: Record<string, { balance?: string; rate?: string }>;
};

let entrySeq = 0;

export function createEntryId(): string {
  entrySeq += 1;
  return `br-${Date.now().toString(36)}-${entrySeq}`;
}

export function createDefaultEntries(): BlendedRateEntry[] {
  return [
    { id: createEntryId(), balance: '10000', rate: '10' },
    { id: createEntryId(), balance: '200', rate: '5' },
    { id: createEntryId(), balance: '', rate: '' },
  ];
}

export function createDefaultInput(): BlendedRateInput {
  return {
    entries: createDefaultEntries(),
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): BlendedRateInput {
  return {
    entries: [
      { id: createEntryId(), balance: '', rate: '' },
      { id: createEntryId(), balance: '', rate: '' },
      { id: createEntryId(), balance: '', rate: '' },
    ],
    currency,
  };
}
