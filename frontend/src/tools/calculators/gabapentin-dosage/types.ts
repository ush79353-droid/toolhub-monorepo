export type GabapentinIndicationId =
  | 'epilepsy'
  | 'rls'
  | 'phn'
  | 'neuropathy'
  | 'anxiety';

export type LabelScope =
  | 'awaiting_input'
  | 'fda_labeled'
  | 'age_not_labeled'
  | 'off_label_informational'
  | 'alternate_product';

export interface GabapentinDosageInput {
  indication: GabapentinIndicationId | null;
  ageYearsText: string;
}

export interface GabapentinDosageFieldErrors {
  indication?: string;
  ageYearsText?: string;
}

export interface GabapentinDosageResult {
  indication: GabapentinIndicationId | null;
  indicationLabel: string;
  ageYears: number | null;
  scope: LabelScope;
  productNote: string;
  approvalNote: string;
  doseLines: string[];
  renalNote: string;
  interpretation: string;
  disclaimer: string;
  sourceNote: string;
}

export const INDICATION_OPTIONS: {
  id: GabapentinIndicationId;
  label: string;
}[] = [
  { id: 'epilepsy', label: 'Epilepsy' },
  { id: 'rls', label: 'Restless legs syndrome' },
  { id: 'phn', label: 'Postherpetic neuralgia' },
  { id: 'neuropathy', label: 'Peripheral neuropathy' },
  { id: 'anxiety', label: 'Anxiety' },
];

export function createEmptyInput(): GabapentinDosageInput {
  return {
    indication: null,
    ageYearsText: '',
  };
}
