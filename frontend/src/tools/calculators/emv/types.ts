import type { SupportedCurrency } from '@/tools/shared/currency';

export const MIN_RISKS = 1;
export const MAX_RISKS = 10;

export interface EmvRiskDraft {
  impact: string;
  probability: string;
}

export interface EmvDraft {
  riskCount: number;
  risks: EmvRiskDraft[];
  currency: SupportedCurrency;
}

export interface EmvRiskValues {
  impact: number;
  probability: number;
  riskEmv: number;
}

export interface EmvResult {
  risks: EmvRiskValues[];
  totalEmv: number;
  currency: SupportedCurrency;
  emvDisplay: string;
  shareEmv: string;
}

export type EmvFieldErrors = Record<string, string>;

export function emptyRisk(): EmvRiskDraft {
  return { impact: '', probability: '' };
}

export function createDefaultDraft(): EmvDraft {
  return {
    riskCount: 1,
    risks: [emptyRisk()],
    currency: 'PKR',
  };
}
