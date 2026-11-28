/**
 * Bra Size Calculator — regional band/cup estimates from underbust + bust.
 * Results are starting estimates; brands vary. Client-side only.
 */

export type LengthUnit = 'cm' | 'in';

export type BraSizingRegion = 'US' | 'UK' | 'EU' | 'AU' | 'FR';

/** Modern nearest-even underbust vs traditional +4 (US/UK only). */
export type UsUkBandMethod = 'modern' | 'plus4';

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  cm: 'cm',
  in: 'in',
};

export const REGION_LABELS: Record<BraSizingRegion, string> = {
  US: 'United States',
  UK: 'United Kingdom',
  EU: 'European Union',
  AU: 'Australia / New Zealand',
  FR: 'France / Spain',
};

export const METHOD_LABELS: Record<UsUkBandMethod, string> = {
  modern: 'Modern (no +4)',
  plus4: 'Traditional +4 (optional)',
};

export interface BraInput {
  underbust: string;
  bust: string;
  unit: LengthUnit;
  region: BraSizingRegion;
  bandMethod: UsUkBandMethod;
  showMeasureHelp: boolean;
}

export interface BraSize {
  band: string;
  cup: string;
  region: BraSizingRegion;
  fullSize: string;
}

export interface SisterSizeResults {
  smallerBand: BraSize | null;
  primary: BraSize;
  largerBand: BraSize | null;
}

export interface BraResult {
  underbustCm: number;
  bustCm: number;
  measurementDifferenceCm: number;
  estimatedSize: BraSize;
  sisterSizes: SisterSizeResults;
  regionalConversions: Partial<Record<BraSizingRegion, BraSize>>;
  fittingGuidance: string[];
  disclaimer: string;
  warnings: string[];
  formulaSteps: string[];
  outOfRange: boolean;
}

export type BraFieldErrors = {
  underbust?: string;
  bust?: string;
  form?: string;
};

export function createEmptyInput(): BraInput {
  return {
    underbust: '75',
    bust: '90',
    unit: 'cm',
    region: 'US',
    bandMethod: 'modern',
    showMeasureHelp: false,
  };
}

export function createBlankInput(): BraInput {
  return {
    ...createEmptyInput(),
    underbust: '',
    bust: '',
  };
}
