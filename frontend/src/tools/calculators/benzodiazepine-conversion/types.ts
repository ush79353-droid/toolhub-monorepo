import type { BenzodiazepineDrugId } from './drug-data';
import { BENZODIAZEPINE_DRUGS } from './drug-data';

export type BenzodiazepineDoseFields = Record<BenzodiazepineDrugId, string>;

export interface BenzodiazepineConversionInput {
  doses: BenzodiazepineDoseFields;
}

export interface BenzodiazepineConversionResult {
  convertedDoses: Partial<Record<BenzodiazepineDrugId, number>>;
  activeSourceId: BenzodiazepineDrugId | null;
  statusHeadline: string;
  statusDetail: string;
  disclaimer: string;
}

export type BenzodiazepineFieldErrors = Partial<
  Record<BenzodiazepineDrugId, string>
>;

export function createEmptyDoses(): BenzodiazepineDoseFields {
  return Object.fromEntries(
    BENZODIAZEPINE_DRUGS.map((d) => [d.id, '']),
  ) as BenzodiazepineDoseFields;
}

export function createDefaultInput(): BenzodiazepineConversionInput {
  return { doses: createEmptyDoses() };
}

export function createEmptyInput(): BenzodiazepineConversionInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: BenzodiazepineConversionInput,
  b: BenzodiazepineConversionInput,
): boolean {
  return BENZODIAZEPINE_DRUGS.every((d) => a.doses[d.id] === b.doses[d.id]);
}