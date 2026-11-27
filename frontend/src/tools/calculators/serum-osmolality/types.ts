/** Serum osmolality (improved + alcohol) — screenshot-first (ADR-023). */

export type GlucoseUnit = 'mg_dl' | 'mmol_l';
export type BunUnit = 'mg_dl_bun' | 'mmol_l_urea' | 'mg_dl_urea';
export type EthanolUnit = 'mmol_l' | 'mg_dl';
export type OsmolalityUnit = 'mosm_kg' | 'mosm_l';

export interface SerumOsmolalityInput {
  sodiumText: string;
  bunText: string;
  bunUnit: BunUnit;
  glucoseText: string;
  glucoseUnit: GlucoseUnit;
  ethanolText: string;
  ethanolUnit: EthanolUnit;
  measuredText: string;
  measuredUnit: OsmolalityUnit;
  resultUnit: OsmolalityUnit;
}

export interface SerumOsmolalityResult {
  osmolality: number | null;
  formattedOsmolality: string;
  osmoticGap: number | null;
  formattedGap: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type SerumOsmolalityFieldErrors = {
  sodiumText?: string;
  bunText?: string;
  glucoseText?: string;
  ethanolText?: string;
  measuredText?: string;
};

export function createDefaultInput(): SerumOsmolalityInput {
  return {
    sodiumText: '',
    bunText: '',
    bunUnit: 'mg_dl_bun',
    glucoseText: '',
    glucoseUnit: 'mg_dl',
    ethanolText: '',
    ethanolUnit: 'mmol_l',
    measuredText: '',
    measuredUnit: 'mosm_kg',
    resultUnit: 'mosm_kg',
  };
}

export function createEmptyInput(): SerumOsmolalityInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: SerumOsmolalityInput,
  b: SerumOsmolalityInput,
): boolean {
  return (
    a.sodiumText === b.sodiumText &&
    a.bunText === b.bunText &&
    a.bunUnit === b.bunUnit &&
    a.glucoseText === b.glucoseText &&
    a.glucoseUnit === b.glucoseUnit &&
    a.ethanolText === b.ethanolText &&
    a.ethanolUnit === b.ethanolUnit &&
    a.measuredText === b.measuredText &&
    a.measuredUnit === b.measuredUnit &&
    a.resultUnit === b.resultUnit
  );
}
