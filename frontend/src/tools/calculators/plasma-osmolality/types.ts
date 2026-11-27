/** Plasma osmolality — screenshot-first (ADR-023). */

export type GlucoseUnit = 'mg_dl' | 'mmol_l';

/** BUN nitrogen mg/dL, whole urea mmol/L, or whole urea mg/dL. */
export type BunUnit = 'mg_dl_bun' | 'mmol_l_urea' | 'mg_dl_urea';

export type OsmolalityUnit = 'mosm_kg' | 'mosm_l';

export interface PlasmaOsmolalityInput {
  sodiumText: string;
  glucoseText: string;
  glucoseUnit: GlucoseUnit;
  bunText: string;
  bunUnit: BunUnit;
  resultUnit: OsmolalityUnit;
}

export interface PlasmaOsmolalityResult {
  osmolality: number | null;
  formattedOsmolality: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type PlasmaOsmolalityFieldErrors = {
  sodiumText?: string;
  glucoseText?: string;
  bunText?: string;
};

export function createDefaultInput(): PlasmaOsmolalityInput {
  return {
    sodiumText: '',
    glucoseText: '',
    glucoseUnit: 'mg_dl',
    bunText: '',
    bunUnit: 'mg_dl_bun',
    resultUnit: 'mosm_kg',
  };
}

export function createEmptyInput(): PlasmaOsmolalityInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: PlasmaOsmolalityInput,
  b: PlasmaOsmolalityInput,
): boolean {
  return (
    a.sodiumText === b.sodiumText &&
    a.glucoseText === b.glucoseText &&
    a.glucoseUnit === b.glucoseUnit &&
    a.bunText === b.bunText &&
    a.bunUnit === b.bunUnit &&
    a.resultUnit === b.resultUnit
  );
}
