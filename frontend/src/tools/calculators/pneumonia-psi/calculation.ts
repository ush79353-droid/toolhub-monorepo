/**
 * Pneumonia Severity Index (PSI / PORT) — Fine et al. (NEJM 1997; derivation cohort).
 * Checklist worksheet: criteria checked when the published threshold is met.
 */

import type { PsiInput, PsiPointBreakdown, PsiResult, PsiRiskClass } from './types';

export const SOURCE_NOTE =
  'PSI/PORT (Fine MJ et al., N Engl J Med 1997): age points (men = age; women = age − 10, minimum 0) plus published comorbidity, examination, and laboratory weights. Class I when age < 50 years with no listed comorbidities and no abnormal findings.';

export const DISCLAIMER =
  'Educational pneumonia severity score only — not admission, discharge, or antibiotic orders. Confirm disposition with local CAP pathways and bedside assessment.';

export function parseAgeYears(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function agePoints(ageYears: number, sex: 'female' | 'male'): number {
  if (sex === 'male') return ageYears;
  return Math.max(0, ageYears - 10);
}

function comorbidityOrFindingSelected(input: PsiInput): boolean {
  return (
    input.nursingHome ||
    input.renalDisease ||
    input.cerebrovascularDisease ||
    input.liverDisease ||
    input.neoplasm ||
    input.chf ||
    input.alteredMentalStatus ||
    input.pleuralEffusion ||
    input.respiratoryRateOver30 ||
    input.pulseOver125 ||
    input.systolicBpUnder90 ||
    input.temperatureAbnormal ||
    input.bunOverThreshold ||
    input.hematocritUnder30 ||
    input.sodiumUnder130 ||
    input.glucoseOver250 ||
    input.arterialPhUnder735 ||
    input.po2Under60
  );
}

/** Fine Class I: age < 50, no comorbidities, no abnormal exam or labs. */
export function qualifiesClassI(input: PsiInput, ageYears: number): boolean {
  if (ageYears >= 50) return false;
  return !comorbidityOrFindingSelected(input);
}

export function computeBreakdown(
  input: PsiInput,
  ageYears: number,
  sex: 'female' | 'male',
): PsiPointBreakdown {
  return {
    age: agePoints(ageYears, sex),
    nursingHome: input.nursingHome ? 10 : 0,
    neoplasm: input.neoplasm ? 30 : 0,
    liverDisease: input.liverDisease ? 20 : 0,
    chf: input.chf ? 10 : 0,
    cerebrovascularDisease: input.cerebrovascularDisease ? 10 : 0,
    renalDisease: input.renalDisease ? 10 : 0,
    alteredMentalStatus: input.alteredMentalStatus ? 20 : 0,
    pleuralEffusion: input.pleuralEffusion ? 10 : 0,
    respiratoryRateOver30: input.respiratoryRateOver30 ? 20 : 0,
    pulseOver125: input.pulseOver125 ? 10 : 0,
    systolicBpUnder90: input.systolicBpUnder90 ? 20 : 0,
    temperatureAbnormal: input.temperatureAbnormal ? 15 : 0,
    bunOverThreshold: input.bunOverThreshold ? 20 : 0,
    hematocritUnder30: input.hematocritUnder30 ? 10 : 0,
    sodiumUnder130: input.sodiumUnder130 ? 20 : 0,
    glucoseOver250: input.glucoseOver250 ? 10 : 0,
    arterialPhUnder735: input.arterialPhUnder735 ? 30 : 0,
    po2Under60: input.po2Under60 ? 10 : 0,
  };
}

export function sumBreakdown(points: PsiPointBreakdown): number {
  return (Object.values(points) as number[]).reduce((a, b) => a + b, 0);
}

export function riskClassFromPoints(total: number): PsiRiskClass {
  if (total <= 70) return 'II';
  if (total <= 90) return 'III';
  if (total <= 130) return 'IV';
  return 'V';
}

export function riskClassLabel(riskClass: PsiRiskClass): string {
  switch (riskClass) {
    case 'I':
      return 'Risk class I (very low)';
    case 'II':
      return 'Risk class II';
    case 'III':
      return 'Risk class III';
    case 'IV':
      return 'Risk class IV';
    case 'V':
      return 'Risk class V';
  }
}

export function calculatePsi(input: PsiInput): PsiResult {
  const empty = {
    totalPoints: null,
    formattedPoints: '',
    riskClass: null,
    classLabel: null,
    classIPathway: false,
    points: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (input.sex === '') {
    return {
      ...empty,
      statusHeadline: 'Select sex and age',
      statusDetail: 'Sex and age in years are required to compute PSI/PORT points.',
    };
  }

  const age = parseAgeYears(input.ageText);
  if (age === null) {
    return {
      ...empty,
      statusHeadline: 'Enter age',
      statusDetail: 'Age in years is required for PSI/PORT.',
    };
  }

  if (age < 0 || age > 130) {
    return {
      ...empty,
      statusHeadline: 'Invalid age',
      statusDetail: 'Enter a plausible age in years (0–130).',
    };
  }

  const breakdown = computeBreakdown(input, age, input.sex);
  const total = sumBreakdown(breakdown);

  if (qualifiesClassI(input, age)) {
    return {
      totalPoints: total,
      formattedPoints: String(total),
      riskClass: 'I',
      classLabel: riskClassLabel('I'),
      classIPathway: true,
      points: breakdown,
      statusHeadline: 'PSI/PORT — Class I pathway',
      statusDetail: `Total ${total} points with age < 50 and no comorbidities or abnormal findings → risk class I (outpatient pathway in Fine derivation). Educational only.`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const riskClass = riskClassFromPoints(total);
  return {
    totalPoints: total,
    formattedPoints: String(total),
    riskClass,
    classLabel: riskClassLabel(riskClass),
    classIPathway: false,
    points: breakdown,
    statusHeadline: 'PSI/PORT score',
    statusDetail: `${total} points — ${riskClassLabel(riskClass)}. Mortality risk rises with class; not a disposition order.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}