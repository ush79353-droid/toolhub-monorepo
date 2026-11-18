/** Exact international inch in millimeters (1 in = 0.0254 m). */
export const MM_PER_INCH = 25.4;

export const MAX_ABS_VALUE = 1e18;

export type MmInchesSource = 'mm' | 'in';

export interface MmToInchesInput {
  source: MmInchesSource;
  mm: number | null;
  inches: number | null;
}

export type MmToInchesFieldErrors = {
  mm?: string;
  inches?: string;
};

export interface MmToInchesResult {
  source: MmInchesSource;
  mm: number;
  inches: number;
  explanation: string;
}
