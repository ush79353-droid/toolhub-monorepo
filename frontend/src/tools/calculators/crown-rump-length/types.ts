/** CRL display unit (canonical math uses mm). */
export type CrlUnit = 'mm' | 'cm' | 'in';

/** How gestational age is shown in the results field. */
export type GaDisplayUnit = 'weeksDays' | 'days';

export interface CrownRumpLengthInput {
  crlValue: string;
  crlUnit: CrlUnit;
  gaDisplayUnit: GaDisplayUnit;
}

export interface CrownRumpLengthResult {
  crlMm: number;
  gestationalAgeDays: number;
  weeks: number;
  daysRemainder: number;
  formattedCrl: string;
  formattedGestationalAge: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type CrownRumpLengthFieldErrors = {
  form?: string;
  crlValue?: string;
};

export const CRL_UNIT_LABELS: Record<CrlUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  in: 'in',
};

export const GA_DISPLAY_LABELS: Record<GaDisplayUnit, string> = {
  weeksDays: 'wks + days',
  days: 'days',
};

/** Screenshot defaults: blank CRL (mm); GA blank; display unit days. */
export function createDefaultInput(): CrownRumpLengthInput {
  return {
    crlValue: '',
    crlUnit: 'mm',
    gaDisplayUnit: 'days',
  };
}

export function createEmptyInput(): CrownRumpLengthInput {
  return createDefaultInput();
}

/** Mid first-trimester fixture (~30 mm → Robinson ≈ 9w6d). */
export function createExampleInput(): CrownRumpLengthInput {
  return {
    crlValue: '30',
    crlUnit: 'mm',
    gaDisplayUnit: 'weeksDays',
  };
}

export function inputsEqual(
  a: CrownRumpLengthInput,
  b: CrownRumpLengthInput
): boolean {
  return (
    a.crlValue === b.crlValue &&
    a.crlUnit === b.crlUnit &&
    a.gaDisplayUnit === b.gaDisplayUnit
  );
}

/** Named educational examples (Early / Mid / Late first trimester). */
export const CRL_EXAMPLES: readonly {
  id: 'early' | 'mid' | 'late';
  label: string;
  crlMm: number;
}[] = [
  { id: 'early', label: 'Early first trimester', crlMm: 10 },
  { id: 'mid', label: 'Mid first trimester', crlMm: 30 },
  { id: 'late', label: 'Late first trimester', crlMm: 60 },
];
