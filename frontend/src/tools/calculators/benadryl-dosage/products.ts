import type { BenadrylProductId } from './types';

export interface AgeBandDose {
  /** Inclusive lower bound in whole years. */
  minYearsInclusive: number;
  /** Exclusive upper bound; null = no upper bound. */
  maxYearsExclusive: number | null;
  status: 'labeled_dose' | 'do_not_use' | 'doctor_directed_only' | 'not_labeled_for_age';
  doseLine: string | null;
}

export interface BenadrylProductLabel {
  id: BenadrylProductId;
  label: string;
  activeIngredient: string;
  /** Plain text with **markers** for bold segments matching the screenshot style. */
  indication: string;
  frequencyNote: string;
  maxDosesPer24Hours: number | null;
  maxDosesNote: string | null;
  bands: readonly AgeBandDose[];
  sourceNote: string;
}

/**
 * US OTC Drug Facts / DailyMed label bands (diphenhydramine HCl products).
 * Not medical advice — always follow the carton in hand.
 */
export const BENADRYL_PRODUCTS: readonly BenadrylProductLabel[] = [
  {
    id: 'ultratab',
    label: 'Benadryl® Allergy ULTRATAB',
    activeIngredient: 'Diphenhydramine HCl 25 mg per tablet',
    indication:
      'This medication temporarily relieves the symptoms of **hay fever** and other upper respiratory allergies: runny nose, sneezing, itchy and watery eyes, and itching of the nose or throat. It also relieves symptoms of the **common cold**, such as runny nose and sneezing.',
    frequencyNote: 'Take every 4 to 6 hours, or as directed by a doctor.',
    maxDosesPer24Hours: 6,
    maxDosesNote: 'Administer a maximum of 6 doses over 24 hours.',
    bands: [
      {
        minYearsInclusive: 0,
        maxYearsExclusive: 6,
        status: 'do_not_use',
        doseLine: null,
      },
      {
        minYearsInclusive: 6,
        maxYearsExclusive: 12,
        status: 'labeled_dose',
        doseLine: '1 tablet',
      },
      {
        minYearsInclusive: 12,
        maxYearsExclusive: null,
        status: 'labeled_dose',
        doseLine: '1 to 2 tablets',
      },
    ],
    sourceNote:
      'DailyMed — BENADRYL ALLERGY ULTRATAB (diphenhydramine HCl 25 mg tablet); directions: every 4–6 hours, do not take more than 6 times in 24 hours.',
  },
  {
    id: 'extraStrength',
    label: 'Benadryl® Extra Strength Allergy Relief (50 mg)',
    activeIngredient: 'Diphenhydramine HCl 50 mg per tablet',
    indication:
      'This medication temporarily relieves the symptoms of **hay fever** and other upper respiratory allergies: runny nose, sneezing, itchy and watery eyes, and itching of the nose or throat.',
    frequencyNote: 'Take every 4 to 6 hours, or as directed by a doctor.',
    maxDosesPer24Hours: 6,
    maxDosesNote: 'Administer a maximum of 6 doses over 24 hours.',
    bands: [
      {
        minYearsInclusive: 0,
        maxYearsExclusive: 12,
        status: 'do_not_use',
        doseLine: null,
      },
      {
        minYearsInclusive: 12,
        maxYearsExclusive: null,
        status: 'labeled_dose',
        doseLine: '1 tablet',
      },
    ],
    sourceNote:
      'Brand dosing guide / Drug Facts for Extra Strength Allergy Relief (50 mg diphenhydramine HCl): ages 12+ take 1 tablet every 4–6 hours; do not take more than 6 times in 24 hours; under 12 do not use.',
  },
  {
    id: 'childrensLiquid',
    label: "Children's Benadryl® Allergy Liquid",
    activeIngredient: 'Diphenhydramine HCl 12.5 mg per 5 mL',
    indication:
      'This medication temporarily relieves the symptoms of **hay fever** and other upper respiratory allergies: runny nose, sneezing, itchy and watery eyes, and itching of the nose or throat.',
    frequencyNote: 'Take every 4 to 6 hours, or as directed by a doctor. Use only the enclosed dosing cup.',
    maxDosesPer24Hours: 6,
    maxDosesNote: 'Administer a maximum of 6 doses over 24 hours.',
    bands: [
      {
        minYearsInclusive: 0,
        maxYearsExclusive: 2,
        status: 'do_not_use',
        doseLine: null,
      },
      {
        minYearsInclusive: 2,
        maxYearsExclusive: 6,
        status: 'doctor_directed_only',
        doseLine: null,
      },
      {
        minYearsInclusive: 6,
        maxYearsExclusive: 12,
        status: 'labeled_dose',
        doseLine: '5 mL to 10 mL',
      },
      {
        minYearsInclusive: 12,
        maxYearsExclusive: null,
        status: 'not_labeled_for_age',
        doseLine: null,
      },
    ],
    sourceNote:
      "DailyMed — CHILDREN'S BENADRYL ALLERGY (diphenhydramine HCl 12.5 mg/5 mL); ages 6–11: 5–10 mL every 4–6 hours; max 6 doses/24 h; under 2 do not use; ages 2–5 only if directed by a doctor.",
  },
  {
    id: 'dyeFreeLiquid',
    label: "Children's Benadryl® Dye-Free Allergy Liquid",
    activeIngredient: 'Diphenhydramine HCl 12.5 mg per 5 mL (dye-free)',
    indication:
      'This medication temporarily relieves the symptoms of **hay fever** and other upper respiratory allergies: runny nose, sneezing, itchy and watery eyes, and itching of the nose or throat.',
    frequencyNote: 'Take every 4 to 6 hours, or as directed by a doctor. Use only the enclosed dosing cup.',
    maxDosesPer24Hours: 6,
    maxDosesNote: 'Administer a maximum of 6 doses over 24 hours.',
    bands: [
      {
        minYearsInclusive: 0,
        maxYearsExclusive: 2,
        status: 'do_not_use',
        doseLine: null,
      },
      {
        minYearsInclusive: 2,
        maxYearsExclusive: 6,
        status: 'doctor_directed_only',
        doseLine: null,
      },
      {
        minYearsInclusive: 6,
        maxYearsExclusive: 12,
        status: 'labeled_dose',
        doseLine: '5 mL to 10 mL',
      },
      {
        minYearsInclusive: 12,
        maxYearsExclusive: null,
        status: 'not_labeled_for_age',
        doseLine: null,
      },
    ],
    sourceNote:
      "DailyMed — CHILDREN'S BENADRYL DYE-FREE ALLERGY (diphenhydramine HCl 12.5 mg/5 mL); same age bands as Children's Allergy Liquid.",
  },
] as const;

export function getProductLabel(id: BenadrylProductId): BenadrylProductLabel {
  const found = BENADRYL_PRODUCTS.find((p) => p.id === id);
  if (!found) {
    throw new Error(`Unknown Benadryl product: ${id}`);
  }
  return found;
}

export function productOptions(): { value: BenadrylProductId; label: string }[] {
  return BENADRYL_PRODUCTS.map((p) => ({ value: p.id, label: p.label }));
}
