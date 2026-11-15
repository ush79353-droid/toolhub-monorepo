export interface BradfordFactorInput {
  spells: number;
  daysAbsent: number;
}

export interface BradfordFactorResult {
  spells: number;
  daysAbsent: number;
  bradfordFactor: number;
  factorDisplay: string;
}

export type BradfordFactorField = 'spells' | 'daysAbsent';

export type BradfordFactorFieldErrors = Partial<Record<BradfordFactorField, string>>;
