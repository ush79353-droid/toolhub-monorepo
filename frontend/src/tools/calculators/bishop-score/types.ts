/** Cervical dilation display unit (canonical math uses cm). */
export type DilationUnit = 'cm' | 'mm';

/** Classic Bishop effacement bands (0–3 points). */
export type EffacementBand = '0-30' | '40-50' | '60-70' | '80+';

/** Cervical consistency (0–2 points). */
export type ConsistencyBand = 'firm' | 'moderatelyFirm' | 'soft';

/** Fetal station bands used by the classic Bishop table (−3…+2). */
export type StationBand = 'minus3' | 'minus2' | 'minus1Or0' | 'plus1Or2';

/** Cervical position (screenshot label: “baby's head position”). */
export type CervicalPositionBand = 'posterior' | 'mid' | 'anterior';

export interface BishopScoreInput {
  dilationValue: string;
  dilationUnit: DilationUnit;
  effacement: EffacementBand;
  consistency: ConsistencyBand;
  station: StationBand;
  position: CervicalPositionBand;
}

export interface BishopScoreBreakdown {
  dilationPoints: number;
  effacementPoints: number;
  consistencyPoints: number;
  stationPoints: number;
  positionPoints: number;
}

export interface BishopScoreResult {
  totalScore: number;
  breakdown: BishopScoreBreakdown;
  dilationCm: number;
  formattedScore: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type BishopScoreFieldErrors = {
  form?: string;
  dilationValue?: string;
};

/**
 * Screenshot defaults: blank dilation (cm), radios at zero-point bands.
 * Score stays inactive until dilation is a valid clinical finding entry.
 */
export function createDefaultInput(): BishopScoreInput {
  return {
    dilationValue: '',
    dilationUnit: 'cm',
    effacement: '0-30',
    consistency: 'firm',
    station: 'minus3',
    position: 'posterior',
  };
}

export function createEmptyInput(): BishopScoreInput {
  return createDefaultInput();
}

/** Educational fixture: closed cervix + zero-point bands → score 0. */
export function createExampleInput(): BishopScoreInput {
  return {
    dilationValue: '0',
    dilationUnit: 'cm',
    effacement: '0-30',
    consistency: 'firm',
    station: 'minus3',
    position: 'posterior',
  };
}

export function inputsEqual(a: BishopScoreInput, b: BishopScoreInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const EFFACEMENT_OPTIONS: readonly {
  value: EffacementBand;
  label: string;
}[] = [
  { value: '0-30', label: '0 – 30%' },
  { value: '40-50', label: '40 – 50%' },
  { value: '60-70', label: '60 – 70%' },
  { value: '80+', label: '≥80%' },
];

export const CONSISTENCY_OPTIONS: readonly {
  value: ConsistencyBand;
  label: string;
}[] = [
  { value: 'firm', label: 'Firm' },
  { value: 'moderatelyFirm', label: 'Moderately firm' },
  { value: 'soft', label: 'Soft' },
];

export const STATION_OPTIONS: readonly {
  value: StationBand;
  label: string;
}[] = [
  {
    value: 'minus3',
    label: '−3, the head has not reached the vaginal canal',
  },
  { value: 'minus2', label: '−2' },
  {
    value: 'minus1Or0',
    label: '−1 or 0, the head has reached the ischial spines',
  },
  {
    value: 'plus1Or2',
    label: '+1 or +2, the head is already at the end of the canal',
  },
];

export const POSITION_OPTIONS: readonly {
  value: CervicalPositionBand;
  label: string;
}[] = [
  { value: 'posterior', label: 'Posterior' },
  { value: 'mid', label: 'Mid-position' },
  { value: 'anterior', label: 'Anterior' },
];

export const DILATION_UNIT_LABELS: Record<DilationUnit, string> = {
  cm: 'cm',
  mm: 'mm',
};
