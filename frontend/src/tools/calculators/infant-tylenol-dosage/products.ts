import type { InfantTylenolProductId } from './types';

export type BandStatus = 'labeled_dose' | 'ask_doctor' | 'do_not_use' | 'not_labeled';

export interface WeightBand {
  /** Inclusive lower bound in pounds. */
  minLbInclusive: number;
  /** Exclusive upper bound; null = open-ended within pediatric chart. */
  maxLbExclusive: number | null;
  status: BandStatus;
  /** Whole/half tablet or packet count when applicable. */
  units: number | null;
  /** Liquid dose in mL when applicable. */
  ml: number | null;
  doseLine: string | null;
}

export interface InfantTylenolProductLabel {
  id: InfantTylenolProductId;
  label: string;
  activeIngredient: string;
  form: 'liquid' | 'tablet' | 'packet';
  mgPerUnit: number;
  /** Liquids: mg per mL (160 mg / 5 mL = 32). */
  mgPerMl: number | null;
  bands: readonly WeightBand[];
  sourceNote: string;
}

/**
 * US OTC Tylenol® (acetaminophen) pediatric label bands.
 * Prefer weight; sources: DailyMed Infants’ TYLENOL + tylenol.com children’s dosing chart.
 * Not medical advice — confirm the carton in hand.
 */
export const INFANT_TYLENOL_PRODUCTS: readonly InfantTylenolProductLabel[] = [
  {
    id: 'infantSuspension',
    label: "Infant’s Tylenol® suspension (160 mg/5 mL)",
    activeIngredient: 'Acetaminophen 160 mg per 5 mL',
    form: 'liquid',
    mgPerUnit: 160,
    mgPerMl: 32,
    bands: [
      {
        minLbInclusive: 0,
        maxLbExclusive: 24,
        status: 'ask_doctor',
        units: null,
        ml: null,
        doseLine: null,
      },
      {
        minLbInclusive: 24,
        maxLbExclusive: 36,
        status: 'labeled_dose',
        units: null,
        ml: 5,
        doseLine: '5 mL (160 mg)',
      },
      {
        minLbInclusive: 36,
        maxLbExclusive: null,
        status: 'ask_doctor',
        units: null,
        ml: null,
        doseLine: null,
      },
    ],
    sourceNote:
      'DailyMed Infants’ TYLENOL oral suspension (acetaminophen 160 mg/5 mL): under 24 lb / under 2 yr ask a doctor; 24–35 lb / 2–3 yr = 5 mL; every 4 hours; max 5 doses/24 h; use enclosed syringe only.',
  },
  {
    id: 'childrensSuspension',
    label: "Children’s Tylenol® suspension (160 mg/5 mL)",
    activeIngredient: 'Acetaminophen 160 mg per 5 mL',
    form: 'liquid',
    mgPerUnit: 160,
    mgPerMl: 32,
    bands: [
      {
        minLbInclusive: 0,
        maxLbExclusive: 24,
        status: 'ask_doctor',
        units: null,
        ml: null,
        doseLine: null,
      },
      {
        minLbInclusive: 24,
        maxLbExclusive: 36,
        status: 'labeled_dose',
        units: null,
        ml: 5,
        doseLine: '5 mL (160 mg)',
      },
      {
        minLbInclusive: 36,
        maxLbExclusive: 48,
        status: 'labeled_dose',
        units: null,
        ml: 7.5,
        doseLine: '7.5 mL (240 mg)',
      },
      {
        minLbInclusive: 48,
        maxLbExclusive: 60,
        status: 'labeled_dose',
        units: null,
        ml: 10,
        doseLine: '10 mL (320 mg)',
      },
      {
        minLbInclusive: 60,
        maxLbExclusive: 72,
        status: 'labeled_dose',
        units: null,
        ml: 12.5,
        doseLine: '12.5 mL (400 mg)',
      },
      {
        minLbInclusive: 72,
        maxLbExclusive: 96,
        status: 'labeled_dose',
        units: null,
        ml: 15,
        doseLine: '15 mL (480 mg)',
      },
      {
        minLbInclusive: 96,
        maxLbExclusive: null,
        status: 'not_labeled',
        units: null,
        ml: null,
        doseLine: null,
      },
    ],
    sourceNote:
      'Tylenol.com / Children’s TYLENOL oral suspension (160 mg/5 mL) weight chart through 72–95 lb; every 4 hours; max 5 doses/24 h; use enclosed dosing cup.',
  },
  {
    id: 'chewable',
    label: 'Chewable tablet (160 mg)',
    activeIngredient: 'Acetaminophen 160 mg per chewable tablet',
    form: 'tablet',
    mgPerUnit: 160,
    mgPerMl: null,
    bands: [
      {
        minLbInclusive: 0,
        maxLbExclusive: 24,
        status: 'ask_doctor',
        units: null,
        ml: null,
        doseLine: null,
      },
      {
        minLbInclusive: 24,
        maxLbExclusive: 36,
        status: 'labeled_dose',
        units: 1,
        ml: null,
        doseLine: '1 tablet (160 mg)',
      },
      {
        minLbInclusive: 36,
        maxLbExclusive: 48,
        status: 'labeled_dose',
        units: 1.5,
        ml: null,
        doseLine: '1½ tablets (240 mg)',
      },
      {
        minLbInclusive: 48,
        maxLbExclusive: 60,
        status: 'labeled_dose',
        units: 2,
        ml: null,
        doseLine: '2 tablets (320 mg)',
      },
      {
        minLbInclusive: 60,
        maxLbExclusive: 72,
        status: 'labeled_dose',
        units: 2.5,
        ml: null,
        doseLine: '2½ tablets (400 mg)',
      },
      {
        minLbInclusive: 72,
        maxLbExclusive: 96,
        status: 'labeled_dose',
        units: 3,
        ml: null,
        doseLine: '3 tablets (480 mg)',
      },
      {
        minLbInclusive: 96,
        maxLbExclusive: null,
        status: 'not_labeled',
        units: null,
        ml: null,
        doseLine: null,
      },
    ],
    sourceNote:
      'Tylenol.com Children’s TYLENOL chewables (160 mg): label allows 1½ / 2½ tablet steps; chew or crush completely; every 4 hours; max 5 doses/24 h.',
  },
  {
    id: 'dissolvePack',
    label: "Children’s Tylenol® dissolve pack (160 mg)",
    activeIngredient: 'Acetaminophen 160 mg per powder packet',
    form: 'packet',
    mgPerUnit: 160,
    mgPerMl: null,
    bands: [
      {
        minLbInclusive: 0,
        maxLbExclusive: 48,
        status: 'do_not_use',
        units: null,
        ml: null,
        doseLine: null,
      },
      {
        minLbInclusive: 48,
        maxLbExclusive: 72,
        status: 'labeled_dose',
        units: 2,
        ml: null,
        doseLine: '2 packets (320 mg)',
      },
      {
        minLbInclusive: 72,
        maxLbExclusive: 96,
        status: 'labeled_dose',
        units: 3,
        ml: null,
        doseLine: '3 packets (480 mg)',
      },
      {
        minLbInclusive: 96,
        maxLbExclusive: null,
        status: 'not_labeled',
        units: null,
        ml: null,
        doseLine: null,
      },
    ],
    sourceNote:
      'Tylenol.com Children’s TYLENOL Dissolve Packs (160 mg): under 48 lb / under 6 yr do not use; 48–71 lb = 2 packets; 72–95 lb = 3 packets; whole packets only; every 4 hours; max 5 doses/24 h.',
  },
];

export function getProductLabel(
  id: InfantTylenolProductId,
): InfantTylenolProductLabel {
  const found = INFANT_TYLENOL_PRODUCTS.find((p) => p.id === id);
  if (!found) {
    throw new Error(`Unknown Infant Tylenol product: ${id}`);
  }
  return found;
}

export const PRODUCT_OPTIONS: readonly {
  id: InfantTylenolProductId;
  label: string;
}[] = INFANT_TYLENOL_PRODUCTS.map((p) => ({ id: p.id, label: p.label }));
