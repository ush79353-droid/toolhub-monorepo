import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_CREDIT_LINES = 20;
export const DEFAULT_TARGET_UTILIZATION = '30';

export type CreditUtilizationStatus =
  | 'valid'
  | 'partial'
  | 'incomplete'
  | 'invalid'
  | 'empty';

export interface CreditLineEntry {
  id: string;
  moneyUsed: string;
  creditLimit: string;
}

export interface CreditUtilizationInput {
  lines: CreditLineEntry[];
  currency: SupportedCurrency;
  targetUtilization: string;
}

export interface CreditLineBreakdown {
  id: string;
  index: number;
  moneyUsed: number;
  creditLimit: number;
  utilizationPercentage: number;
  availableCredit: number;
}

export interface CreditUtilizationResult {
  totalCreditUsed: number;
  totalCreditLimit: number;
  overallUtilization: number;
  remainingAvailableCredit: number;
  overLimitAmount: number;
  creditLineCount: number;
  targetUtilization: number;
  targetBalance: number;
  requiredBalanceReduction: number;
  additionalCreditLimitNeeded: number | null;
  additionalLimitUnavailableReason: string | null;
  creditLineResults: CreditLineBreakdown[];
  interpretationBand: string;
  status: CreditUtilizationStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedTotalUsed: string;
  formattedTotalLimit: string;
  formattedAvailable: string;
  formattedUtilization: string;
  formattedTargetBalance: string;
  formattedReduction: string;
  formattedAdditionalLimit: string | null;
}

export type CreditUtilizationFieldErrors = {
  form?: string;
  targetUtilization?: string;
  lines?: Record<string, { moneyUsed?: string; creditLimit?: string }>;
};

let entrySeq = 0;

export function createLineId(): string {
  entrySeq += 1;
  return `cu-${Date.now().toString(36)}-${entrySeq}`;
}

export function createEmptyLines(): CreditLineEntry[] {
  return [
    { id: createLineId(), moneyUsed: '', creditLimit: '' },
    { id: createLineId(), moneyUsed: '', creditLimit: '' },
  ];
}

export function createDefaultInput(): CreditUtilizationInput {
  return {
    lines: createEmptyLines(),
    currency: 'PKR',
    targetUtilization: DEFAULT_TARGET_UTILIZATION,
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): CreditUtilizationInput {
  return {
    lines: createEmptyLines(),
    currency,
    targetUtilization: DEFAULT_TARGET_UTILIZATION,
  };
}
