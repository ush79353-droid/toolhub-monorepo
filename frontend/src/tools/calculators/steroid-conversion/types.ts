import type { SteroidDrugId } from './drug-data';
import { STEROID_DRUGS } from './drug-data';

export type SteroidDoseFields = Record<SteroidDrugId, string>;

export interface SteroidConversionInput {
  doses: SteroidDoseFields;
}

export interface SteroidConversionResult {
  convertedDoses: Partial<Record<SteroidDrugId, number>>;
  activeSourceId: SteroidDrugId | null;
  statusHeadline: string;
  statusDetail: string;
  disclaimer: string;
}

export type SteroidFieldErrors = Partial<Record<SteroidDrugId, string>>;

export function createEmptyDoses(): SteroidDoseFields {
  return Object.fromEntries(
    STEROID_DRUGS.map((d) => [d.id, '']),
  ) as SteroidDoseFields;
}

export function createDefaultInput(): SteroidConversionInput {
  return { doses: createEmptyDoses() };
}

export function createEmptyInput(): SteroidConversionInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: SteroidConversionInput,
  b: SteroidConversionInput,
): boolean {
  return STEROID_DRUGS.every((d) => a.doses[d.id] === b.doses[d.id]);
}
