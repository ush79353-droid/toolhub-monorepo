/**
 * Transferrin saturation (TSAT) — two independent methods (ADR-023 screenshot).
 */

export type IronUnit = 'ug_dl' | 'umol_l';
export type TransferrinUnit = 'mg_dl' | 'g_l';

export interface TransferrinSaturationInput {
  /** Method 1: Fe + TIBC */
  method1Open: boolean;
  fe1Text: string;
  fe1Unit: IronUnit;
  tibcText: string;
  tibcUnit: IronUnit;
  /** Method 2: Fe + transferrin */
  method2Open: boolean;
  fe2Text: string;
  fe2Unit: IronUnit;
  tfText: string;
  tfUnit: TransferrinUnit;
}

export interface TransferrinSaturationResult {
  tsat1: number | null;
  formattedTsat1: string;
  tsat2: number | null;
  formattedTsat2: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type TransferrinSaturationFieldErrors = {
  fe1Text?: string;
  tibcText?: string;
  fe2Text?: string;
  tfText?: string;
};

/** Screenshot defaults: both panels expanded; µg/dL / mg/dL; blanks. */
export function createDefaultInput(): TransferrinSaturationInput {
  return {
    method1Open: true,
    fe1Text: '',
    fe1Unit: 'ug_dl',
    tibcText: '',
    tibcUnit: 'ug_dl',
    method2Open: true,
    fe2Text: '',
    fe2Unit: 'ug_dl',
    tfText: '',
    tfUnit: 'mg_dl',
  };
}

export function createEmptyInput(): TransferrinSaturationInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: TransferrinSaturationInput,
  b: TransferrinSaturationInput,
): boolean {
  return (
    a.method1Open === b.method1Open &&
    a.fe1Text === b.fe1Text &&
    a.fe1Unit === b.fe1Unit &&
    a.tibcText === b.tibcText &&
    a.tibcUnit === b.tibcUnit &&
    a.method2Open === b.method2Open &&
    a.fe2Text === b.fe2Text &&
    a.fe2Unit === b.fe2Unit &&
    a.tfText === b.tfText &&
    a.tfUnit === b.tfUnit
  );
}
