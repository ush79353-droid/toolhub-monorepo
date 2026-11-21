import { getProductLabel } from './products';
import type {
  BenadrylDosageInput,
  BenadrylDosageResult,
  DoseStatus,
} from './types';

const DISCLAIMER =
  'Educational Drug Facts summary only — not medical advice. Confirm the carton in hand. In overdose, contact Poison Control (US: 1-800-222-1222).';

export function parseAgeYears(raw: string): number | null | 'invalid' {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return 'invalid';
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0 || value > 120) return 'invalid';
  return value;
}

function bandForAge(
  ageYears: number,
  bands: ReturnType<typeof getProductLabel>['bands'],
) {
  return (
    bands.find((band) => {
      const aboveMin = ageYears >= band.minYearsInclusive;
      const belowMax =
        band.maxYearsExclusive == null || ageYears < band.maxYearsExclusive;
      return aboveMin && belowMax;
    }) ?? null
  );
}

function interpretationFor(
  status: DoseStatus,
  productLabel: string,
  doseLine: string | null,
): string {
  switch (status) {
    case 'awaiting_age':
      return 'Enter age in years to see the matching label dose band.';
    case 'labeled_dose':
      return `${productLabel}: ${doseLine} per dose, following the frequency and 24-hour limit on the label.`;
    case 'do_not_use':
      return `Label directions for ${productLabel}: do not use at this age.`;
    case 'doctor_directed_only':
      return `Label directions for ${productLabel}: do not use unless directed by a doctor.`;
    case 'not_labeled_for_age':
      return `This children's liquid product is not labeled for ages 12+. Use an adult-labeled Benadryl® product or ask a pharmacist/clinician.`;
    default:
      return DISCLAIMER;
  }
}

export function calculateBenadrylDosage(
  input: BenadrylDosageInput,
): BenadrylDosageResult {
  const product = getProductLabel(input.productId);
  const parsed = parseAgeYears(input.ageYearsText);

  if (parsed === 'invalid') {
    // Caller should validate; keep a safe empty educational shell.
    return {
      productId: product.id,
      productLabel: product.label,
      activeIngredient: product.activeIngredient,
      indicationHtmlSafe: product.indication,
      maxDosesPer24Hours: product.maxDosesPer24Hours,
      maxDosesNote: product.maxDosesNote,
      frequencyNote: product.frequencyNote,
      status: 'awaiting_age',
      doseLine: null,
      ageYears: null,
      interpretation: 'Enter a valid age in years.',
      disclaimer: DISCLAIMER,
      sourceNote: product.sourceNote,
    };
  }

  if (parsed === null) {
    return {
      productId: product.id,
      productLabel: product.label,
      activeIngredient: product.activeIngredient,
      indicationHtmlSafe: product.indication,
      maxDosesPer24Hours: product.maxDosesPer24Hours,
      maxDosesNote: product.maxDosesNote,
      frequencyNote: product.frequencyNote,
      status: 'awaiting_age',
      doseLine: null,
      ageYears: null,
      interpretation: interpretationFor('awaiting_age', product.label, null),
      disclaimer: DISCLAIMER,
      sourceNote: product.sourceNote,
    };
  }

  const band = bandForAge(parsed, product.bands);
  const status: DoseStatus = band?.status ?? 'not_labeled_for_age';
  const doseLine = band?.doseLine ?? null;

  return {
    productId: product.id,
    productLabel: product.label,
    activeIngredient: product.activeIngredient,
    indicationHtmlSafe: product.indication,
    maxDosesPer24Hours: product.maxDosesPer24Hours,
    maxDosesNote: product.maxDosesNote,
    frequencyNote: product.frequencyNote,
    status,
    doseLine,
    ageYears: parsed,
    interpretation: interpretationFor(status, product.label, doseLine),
    disclaimer: DISCLAIMER,
    sourceNote: product.sourceNote,
  };
}
