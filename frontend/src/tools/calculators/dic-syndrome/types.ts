/** ISTH overt DIC score (Taylor et al. Thromb Haemost 2001) — educational. */

export type PlateletBand = 'gt100' | '50to100' | 'lt50';

export type FibrinMarkerBand = 'no_increase' | 'moderate_increase' | 'strong_increase';

export type PtProlongationBand = 'lt3' | '3to6' | 'gt6';

export type FibrinogenBand = 'ge1' | 'lt1';

export interface DicSyndromeInput {
  platelets: PlateletBand;
  fibrinMarkers: FibrinMarkerBand;
  ptProlongation: PtProlongationBand;
  fibrinogen: FibrinogenBand;
}

export interface DicSyndromeResult {
  score: number;
  formattedScore: string;
  plateletPoints: number;
  fibrinMarkerPoints: number;
  ptPoints: number;
  fibrinogenPoints: number;
  meetsOvertThreshold: boolean;
  interpretation: string;
  statusHeadline: string;
  statusDetail: string;
  disclaimer: string;
  sourceNote: string;
}

export type DicSyndromeFieldErrors = { form?: string };

export function createDefaultInput(): DicSyndromeInput {
  return {
    platelets: 'gt100',
    fibrinMarkers: 'no_increase',
    ptProlongation: 'lt3',
    fibrinogen: 'ge1',
  };
}

export function createEmptyInput(): DicSyndromeInput {
  return createDefaultInput();
}

export function inputsEqual(a: DicSyndromeInput, b: DicSyndromeInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const PLATELET_OPTIONS: readonly { value: PlateletBand; label: string }[] = [
  { value: 'gt100', label: '> 100,000/µL (×10⁹/L)' },
  { value: '50to100', label: '50,000–100,000/µL' },
  { value: 'lt50', label: '< 50,000/µL' },
];

export const FIBRIN_MARKER_OPTIONS: readonly {
  value: FibrinMarkerBand;
  label: string;
}[] = [
  { value: 'no_increase', label: 'No increase' },
  { value: 'moderate_increase', label: 'Moderate increase' },
  { value: 'strong_increase', label: 'Strong increase' },
];

export const PT_PROLONGATION_OPTIONS: readonly {
  value: PtProlongationBand;
  label: string;
}[] = [
  { value: 'lt3', label: '< 3 seconds above control' },
  { value: '3to6', label: '3 – < 6 seconds' },
  { value: 'gt6', label: '≥ 6 seconds' },
];

export const FIBRINOGEN_OPTIONS: readonly { value: FibrinogenBand; label: string }[] = [
  { value: 'ge1', label: '≥ 1 g/L' },
  { value: 'lt1', label: '< 1 g/L' },
];