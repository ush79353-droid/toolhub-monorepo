export type CefdinirAgeGroup = 'adult' | 'pediatric';

export type AdultIndicationId =
  | 'community_acquired_pneumonia'
  | 'acute_exacerbations_chronic_bronchitis'
  | 'acute_maxillary_sinusitis'
  | 'pharyngitis_tonsillitis'
  | 'uncomplicated_skin';

export type PediatricIndicationId =
  | 'acute_bacterial_otitis_media'
  | 'acute_maxillary_sinusitis'
  | 'pharyngitis_tonsillitis'
  | 'uncomplicated_skin';

export type CefdinirIndicationId = AdultIndicationId | PediatricIndicationId;

export interface CefdinirDoseInput {
  ageGroup: CefdinirAgeGroup | '';
  indication: CefdinirIndicationId | '';
  /** Required when ageGroup is pediatric (kg). */
  weightKgText: string;
}

export interface CefdinirDoseResult {
  dosingSentence: string;
  renalNote: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
  /** Whole mg per dose for pediatric math; null when fixed adult dose. */
  doseMgPerAdministration: number | null;
  intervalHours: number | null;
  durationLabel: string;
}

export type CefdinirDoseFieldErrors = {
  ageGroup?: string;
  indication?: string;
  weightKgText?: string;
};

export function createDefaultInput(): CefdinirDoseInput {
  return {
    ageGroup: 'adult',
    indication: 'community_acquired_pneumonia',
    weightKgText: '',
  };
}

export function createEmptyInput(): CefdinirDoseInput {
  return {
    ageGroup: '',
    indication: '',
    weightKgText: '',
  };
}

export function inputsEqual(
  a: CefdinirDoseInput,
  b: CefdinirDoseInput,
): boolean {
  return (
    a.ageGroup === b.ageGroup &&
    a.indication === b.indication &&
    a.weightKgText === b.weightKgText
  );
}

export function indicationValidForAgeGroup(
  ageGroup: CefdinirAgeGroup,
  indication: CefdinirIndicationId,
): boolean {
  const adultIds: AdultIndicationId[] = [
    'community_acquired_pneumonia',
    'acute_exacerbations_chronic_bronchitis',
    'acute_maxillary_sinusitis',
    'pharyngitis_tonsillitis',
    'uncomplicated_skin',
  ];
  const pediatricIds: PediatricIndicationId[] = [
    'acute_bacterial_otitis_media',
    'acute_maxillary_sinusitis',
    'pharyngitis_tonsillitis',
    'uncomplicated_skin',
  ];
  if (ageGroup === 'adult') return (adultIds as string[]).includes(indication);
  return (pediatricIds as string[]).includes(indication);
}