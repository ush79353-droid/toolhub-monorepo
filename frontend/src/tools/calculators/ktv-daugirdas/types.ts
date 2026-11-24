/**
 * Single-pool second-generation Daugirdas Kt/V + URR worksheet.
 * Source: Daugirdas JT, J Am Soc Nephrol 1993 / 1995 second-generation formula.
 */

export type BunUnit = 'mg/dL' | 'mmol/L';
export type DurationUnit = 'hrs' | 'min';
export type VolumeUnit = 'L' | 'mL';
export type WeightUnit = 'kg' | 'lb';

export interface KtvDaugirdasInput {
  preBun: string;
  preBunUnit: BunUnit;
  postBun: string;
  postBunUnit: BunUnit;
  duration: string;
  durationUnit: DurationUnit;
  ultrafiltrate: string;
  ultrafiltrateUnit: VolumeUnit;
  postWeight: string;
  postWeightUnit: WeightUnit;
}

export interface KtvDaugirdasResult {
  r: number;
  ktv: number;
  urrPercent: number;
  formattedKtv: string;
  formattedUrr: string;
  disclaimer: string;
}

export type KtvDaugirdasFieldErrors = {
  form?: string;
  preBun?: string;
  postBun?: string;
  duration?: string;
  ultrafiltrate?: string;
  postWeight?: string;
};

/** Screenshot defaults: blank BUN/UF/weight; duration 4 hrs. */
export function createEmptyInput(): KtvDaugirdasInput {
  return {
    preBun: '',
    preBunUnit: 'mg/dL',
    postBun: '',
    postBunUnit: 'mg/dL',
    duration: '4',
    durationUnit: 'hrs',
    ultrafiltrate: '',
    ultrafiltrateUnit: 'L',
    postWeight: '',
    postWeightUnit: 'kg',
  };
}

export function inputsEqual(a: KtvDaugirdasInput, b: KtvDaugirdasInput): boolean {
  return (
    a.preBun === b.preBun &&
    a.preBunUnit === b.preBunUnit &&
    a.postBun === b.postBun &&
    a.postBunUnit === b.postBunUnit &&
    a.duration === b.duration &&
    a.durationUnit === b.durationUnit &&
    a.ultrafiltrate === b.ultrafiltrate &&
    a.ultrafiltrateUnit === b.ultrafiltrateUnit &&
    a.postWeight === b.postWeight &&
    a.postWeightUnit === b.postWeightUnit
  );
}
