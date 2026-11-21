/**
 * Tylenol Dosage Calculator — pure label lookup (ADR-018).
 * Schedules from DailyMed / Drug Facts for US OTC TYLENOL products.
 */

import {
  getProduct,
  getSymptom,
  type TylenolDosageInput,
  type TylenolDosageResult,
  type TylenolProductOption,
} from './types';

const DISCLAIMER =
  'Educational Drug Facts summary only — not medical advice. Read your carton; do not combine with other acetaminophen products; ask a doctor or pharmacist about liver disease, alcohol use, pregnancy, and interactions.';

function pluralUnits(count: number, noun: string): string {
  if (count === 1) return `1 ${noun}`;
  return `${count} ${noun}s`;
}

export function productMatchesSymptom(
  product: TylenolProductOption,
  symptomId: TylenolDosageInput['symptom'],
): boolean {
  return product.symptoms.includes(symptomId);
}

export function buildDoseLine(product: TylenolProductOption): string {
  const units = pluralUnits(product.unitsPerDose, product.unitNoun);
  if (product.intervalPhrase.startsWith('at ')) {
    return `Take ${units} ${product.intervalPhrase}.`;
  }
  return `Take ${units} ${product.intervalPhrase}.`;
}

export function buildMaxLine(product: TylenolProductOption): string {
  const units = pluralUnits(product.maxUnitsPer24Hours, product.unitNoun);
  return `Do not exceed ${units} in 24 hours (unless directed by a doctor). Product 24-hour acetaminophen ceiling from this carton: ${product.maxAcetaminophenMgPer24Hours.toLocaleString('en-US')} mg.`;
}

export function calculateTylenolDosage(
  input: TylenolDosageInput,
): TylenolDosageResult {
  const symptom = getSymptom(input.symptom);
  const product = getProduct(input.product);
  const match = productMatchesSymptom(product, input.symptom);

  const ingredientsParts = [
    `Acetaminophen ${product.acetaminophenMgPerUnit} mg per ${product.unitNoun}`,
  ];
  if (product.otherActives.trim()) {
    ingredientsParts.push(product.otherActives.trim());
  }

  return {
    symptomLabel: symptom.label,
    productLabel: product.label,
    doseLine: buildDoseLine(product),
    maxLine: buildMaxLine(product),
    ingredientsLine: ingredientsParts.join('. '),
    ageLine: `Labeled for adults and children ${product.minAgeYears} years and over. Children under ${product.minAgeYears}: ask a doctor (or do not use — see carton).`,
    comboWarning:
      'Do not use with any other drug containing acetaminophen (prescription or nonprescription). Combination products already include acetaminophen — stacking duplicates raises overdose risk.',
    mismatchMessage: match
      ? null
      : `“${product.label}” is not a usual match for “${symptom.label}”. Choose a product listed for that symptom, or change the symptom.`,
    sourceNote: product.sourceNote,
    disclaimer: DISCLAIMER,
  };
}
