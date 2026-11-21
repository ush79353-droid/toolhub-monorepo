/**
 * Amoxicillin pediatric dose math — informational conversion + labeled regimen tables.
 *
 * Sources (versioned):
 * - WHO 2017 consensus guidance on pediatric dosing for Access antibiotics (general PO/IV ranges cited by clinical pediatric calculators).
 * - CDC Group A Strep clinical guidance / IDSA 2012 pharyngitis guideline (oral amoxicillin once-daily / BID).
 * - AHA infective endocarditis prophylaxis wallet card (oral amoxicillin 50 mg/kg; IV uses ampicillin — not amoxicillin).
 *
 * Not a prescribing tool. No silent invented tables beyond cited regimens.
 */

import type {
  AgeUnit,
  AmoxicillinPediatricDosageResult,
  DoseDisplayUnit,
  Indication,
  Route,
  StrengthMgPer5mL,
  WeightUnit,
} from './types';

export const LB_TO_KG = 0.45359237;
export const MIN_AGE_MONTHS = 1;
export const MAX_AGE_MONTHS = 18 * 12; // 18 years

export const RULES_LABEL =
  'WHO 2017 (general ranges) · CDC/IDSA strep A (oral) · AHA IE prophylaxis (oral amoxicillin)';

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information, and contraindications on the leaflet. Consult your health provider before administering any medication. This tool cannot replace real medical consultation.';

export function ageToMonths(value: number, unit: AgeUnit): number {
  return unit === 'mos' ? value : value * 12;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function mgPerMl(strength: StrengthMgPer5mL): number {
  return strength / 5;
}

export function doseMgFromRequirement(
  weightKg: number,
  mgPerKgPerDose: number
): number {
  return weightKg * mgPerKgPerDose;
}

export function requirementFromDoseMg(
  weightKg: number,
  doseMg: number
): number {
  if (weightKg <= 0) return NaN;
  return doseMg / weightKg;
}

export function volumeMlFromDoseMg(
  doseMg: number,
  strength: StrengthMgPer5mL
): number {
  return doseMg / mgPerMl(strength);
}

export function doseMgFromVolumeMl(
  volumeMl: number,
  strength: StrengthMgPer5mL
): number {
  return volumeMl * mgPerMl(strength);
}

export interface RegimenSuggestion {
  available: boolean;
  unavailableReason: string | null;
  /** null when the regimen is a fixed mg band (not mg/kg). */
  requirementMgPerKg: number | null;
  fixedDoseMg: number | null;
  maxDoseMg: number | null;
  dosesPerDay: number | null;
  frequencyNote: string;
  rangeNote: string | null;
  sourceNote: string;
}

/**
 * Labeled regimen suggestion for the selected indication/route/weight.
 * IV is enabled only for general dosing (WHO-style IV range). Strep A and
 * endocarditis stay oral-only under CDC/IDSA and AHA evidence used here.
 */
export function suggestRegimen(
  indication: Indication,
  route: Route,
  weightKg: number
): RegimenSuggestion {
  if (!(weightKg > 0) || !Number.isFinite(weightKg)) {
    return {
      available: false,
      unavailableReason: 'Enter a valid weight to apply a labeled regimen.',
      requirementMgPerKg: null,
      fixedDoseMg: null,
      maxDoseMg: null,
      dosesPerDay: null,
      frequencyNote: '',
      rangeNote: null,
      sourceNote: RULES_LABEL,
    };
  }

  if (indication === 'endocarditis') {
    if (route === 'iv') {
      return {
        available: false,
        unavailableReason:
          'AHA endocarditis prophylaxis uses ampicillin (or a cephalosporin) when the patient cannot take oral medication — not intravenous amoxicillin. Switch to Oral (PO) for the AHA amoxicillin 50 mg/kg single-dose regimen (max 2 g).',
        requirementMgPerKg: null,
        fixedDoseMg: null,
        maxDoseMg: 2000,
        dosesPerDay: 1,
        frequencyNote: 'Single dose 30–60 minutes before the procedure',
        rangeNote: null,
        sourceNote: 'AHA infective endocarditis prophylaxis card',
      };
    }
    return {
      available: true,
      unavailableReason: null,
      requirementMgPerKg: 50,
      fixedDoseMg: null,
      maxDoseMg: 2000,
      dosesPerDay: 1,
      frequencyNote: 'Single oral dose 30–60 minutes before the procedure',
      rangeNote: '50 mg/kg/dose (max 2 g)',
      sourceNote: 'AHA infective endocarditis prophylaxis (oral amoxicillin)',
    };
  }

  if (indication === 'strep_a') {
    if (route === 'iv') {
      return {
        available: false,
        unavailableReason:
          'CDC/IDSA Group A strep pharyngitis regimens cited here are oral amoxicillin (or penicillin). Intravenous amoxicillin is not enabled for this indication.',
        requirementMgPerKg: null,
        fixedDoseMg: null,
        maxDoseMg: 1000,
        dosesPerDay: 1,
        frequencyNote: 'Usually once daily for 10 days (oral)',
        rangeNote: null,
        sourceNote: 'CDC / IDSA Group A streptococcal pharyngitis',
      };
    }
    // CDC/IDSA: 50 mg/kg once daily (max 1000). Practical weight bands match common pediatric charts.
    if (weightKg < 15) {
      return {
        available: true,
        unavailableReason: null,
        requirementMgPerKg: 50,
        fixedDoseMg: null,
        maxDoseMg: 1000,
        dosesPerDay: 1,
        frequencyNote: 'Once daily for 10 days (alternate: 25 mg/kg twice daily)',
        rangeNote: '50 mg/kg once daily (max 1,000 mg)',
        sourceNote: 'CDC / IDSA Group A streptococcal pharyngitis (oral)',
      };
    }
    if (weightKg < 30) {
      return {
        available: true,
        unavailableReason: null,
        requirementMgPerKg: null,
        fixedDoseMg: 750,
        maxDoseMg: 1000,
        dosesPerDay: 1,
        frequencyNote: 'Once daily for 10 days (fixed-dose band for 15–29.9 kg)',
        rangeNote: '750 mg once daily',
        sourceNote: 'CDC / IDSA-aligned weight band (oral)',
      };
    }
    return {
      available: true,
      unavailableReason: null,
      requirementMgPerKg: null,
      fixedDoseMg: 1000,
      maxDoseMg: 1000,
      dosesPerDay: 1,
      frequencyNote: 'Once daily for 10 days (fixed-dose band for ≥30 kg)',
      rangeNote: '1,000 mg once daily',
      sourceNote: 'CDC / IDSA Group A streptococcal pharyngitis (oral)',
    };
  }

  // general
  if (route === 'iv') {
    return {
      available: true,
      unavailableReason: null,
      requirementMgPerKg: 30,
      fixedDoseMg: null,
      maxDoseMg: 1000,
      dosesPerDay: 3,
      frequencyNote: 'Every 8 hours (3 doses/day)',
      rangeNote: '30–60 mg/kg/dose IV (suggested start 30); max 1 g/dose; daily max 4 g',
      sourceNote: 'WHO 2017-style general IV pediatric range (informational)',
    };
  }

  return {
    available: true,
    unavailableReason: null,
    requirementMgPerKg: 15,
    fixedDoseMg: null,
    maxDoseMg: 500,
    dosesPerDay: 3,
    frequencyNote: 'Every 8 hours (3 doses/day)',
    rangeNote: '15–30 mg/kg/dose oral (suggested start 15); max 500 mg/dose; daily max 4 g',
    sourceNote: 'WHO 2017-style general oral pediatric range (informational)',
  };
}

export function applyMaxCap(
  doseMg: number,
  maxDoseMg: number | null
): { doseMg: number; capped: boolean } {
  if (maxDoseMg == null || !(maxDoseMg > 0)) {
    return { doseMg, capped: false };
  }
  if (doseMg > maxDoseMg) {
    return { doseMg: maxDoseMg, capped: true };
  }
  return { doseMg, capped: false };
}

export function formatFixed(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '';
  const rounded = Number(n.toFixed(digits));
  return String(rounded);
}

export interface CalculateAmoxicillinArgs {
  ageMonths: number;
  weightKg: number;
  strength: StrengthMgPer5mL;
  indication: Indication;
  route: Route;
  /** When set, overrides suggested mg/kg (clinician check). */
  clinicianRequirement: number | null;
  /** When set with mode dose, drives reverse requirement. */
  clinicianDoseMg: number | null;
  mode: 'suggest' | 'from_requirement' | 'from_dose';
  doseUnit: DoseDisplayUnit;
}

export function calculateAmoxicillinPediatricDosage(
  args: CalculateAmoxicillinArgs
): AmoxicillinPediatricDosageResult {
  const suggestion = suggestRegimen(
    args.indication,
    args.route,
    args.weightKg
  );

  const base: AmoxicillinPediatricDosageResult = {
    ageMonths: args.ageMonths,
    weightKg: args.weightKg,
    strength: args.strength,
    indication: args.indication,
    route: args.route,
    regimenAvailable: suggestion.available,
    unavailableReason: suggestion.unavailableReason,
    requirementMgPerKg: null,
    doseMg: null,
    doseMl: null,
    cappedToMax: false,
    maxDoseMg: suggestion.maxDoseMg,
    dosesPerDay: suggestion.dosesPerDay,
    frequencyNote: suggestion.frequencyNote,
    rangeNote: suggestion.rangeNote,
    sourceNote: suggestion.sourceNote,
    formattedRequirement: '',
    formattedDoseMg: '',
    formattedDoseMl: '',
    disclaimer: DISCLAIMER,
  };

  if (!suggestion.available) {
    return base;
  }

  let requirement = suggestion.requirementMgPerKg;
  let doseMg: number | null = suggestion.fixedDoseMg;

  if (args.mode === 'from_requirement' && args.clinicianRequirement != null) {
    requirement = args.clinicianRequirement;
    doseMg = doseMgFromRequirement(args.weightKg, requirement);
  } else if (args.mode === 'from_dose' && args.clinicianDoseMg != null) {
    doseMg = args.clinicianDoseMg;
    requirement =
      suggestion.fixedDoseMg != null
        ? null
        : requirementFromDoseMg(args.weightKg, doseMg);
  } else {
    // suggest
    if (suggestion.fixedDoseMg != null) {
      doseMg = suggestion.fixedDoseMg;
      requirement = null;
    } else if (suggestion.requirementMgPerKg != null) {
      requirement = suggestion.requirementMgPerKg;
      doseMg = doseMgFromRequirement(
        args.weightKg,
        suggestion.requirementMgPerKg
      );
    }
  }

  if (doseMg == null || !Number.isFinite(doseMg) || doseMg < 0) {
    return {
      ...base,
      requirementMgPerKg: requirement,
      formattedRequirement:
        requirement != null && Number.isFinite(requirement)
          ? formatFixed(requirement, 2)
          : '',
    };
  }

  const capped = applyMaxCap(doseMg, suggestion.maxDoseMg);
  doseMg = capped.doseMg;
  if (
    capped.capped &&
    requirement != null &&
    Number.isFinite(requirement) &&
    args.weightKg > 0
  ) {
    requirement = requirementFromDoseMg(args.weightKg, doseMg);
  }

  const doseMl =
    args.route === 'oral' ? volumeMlFromDoseMg(doseMg, args.strength) : null;

  return {
    ...base,
    requirementMgPerKg:
      requirement != null && Number.isFinite(requirement) ? requirement : null,
    doseMg,
    doseMl,
    cappedToMax: capped.capped,
    formattedRequirement:
      requirement != null && Number.isFinite(requirement)
        ? formatFixed(requirement, 2)
        : '',
    formattedDoseMg: formatFixed(doseMg, 2),
    formattedDoseMl:
      doseMl != null && Number.isFinite(doseMl) ? formatFixed(doseMl, 2) : '',
  };
}
