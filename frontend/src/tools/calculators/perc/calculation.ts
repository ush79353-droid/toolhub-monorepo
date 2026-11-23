/**
 * PERC — Pulmonary Embolism Rule-Out Criteria (Kline et al., J Thromb Haemost 2004;
 * ACEP Clinical Policy). Educational negative-predictive rule only when pretest
 * probability is low (&lt;15%) and every criterion is explicitly absent.
 */

import type {
  PercCriteriaFlags,
  PercInput,
  PercInterpretationKind,
  PercResult,
} from './types';

export const SOURCE_LABEL =
  'Kline JA et al. Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism. J Thromb Haemost. 2004;2(8):1247–1252; ACEP Clinical Policy: Critical Issues in the Evaluation and Management of Adult Patients with Suspected Acute Pulmonary Embolism.';

export const DISCLAIMER =
  'Educational PERC checklist only. It does not order imaging, labs, or treatment. Rule-out language applies only when you confirm low pretest probability and that every criterion was assessed as absent.';

/** Age ≥50 (50 inclusive). */
export function ageMeetsPercCriterion(ageYears: number): boolean {
  if (!Number.isFinite(ageYears) || ageYears < 0) {
    throw new Error('Age must be a non-negative finite number.');
  }
  return ageYears >= 50;
}

/** Heart rate ≥100 bpm (100 inclusive). */
export function heartRateMeetsPercCriterion(heartRateBpm: number): boolean {
  if (!Number.isFinite(heartRateBpm) || heartRateBpm < 0) {
    throw new Error('Heart rate must be a non-negative finite number.');
  }
  return heartRateBpm >= 100;
}

/** Room-air SpO₂ &lt;95% (95% does not meet). */
export function o2SaturationMeetsPercCriterion(spo2Percent: number): boolean {
  if (!Number.isFinite(spo2Percent) || spo2Percent < 0 || spo2Percent > 100) {
    throw new Error('SpO₂ must be between 0 and 100%.');
  }
  return spo2Percent < 95;
}

export function countPositiveCriteria(criteria: PercCriteriaFlags): number {
  let n = 0;
  for (const v of Object.values(criteria)) {
    if (v) n += 1;
  }
  return n;
}

export function resolveInterpretation(input: PercInput): {
  kind: PercInterpretationKind;
  interpretation: string;
  detailNote: string;
} {
  const n = countPositiveCriteria(input.criteria);

  if (n > 0) {
    return {
      kind: 'positive_criterion',
      interpretation:
        'PERC is insufficient to exclude pulmonary embolism because at least one criterion is present.',
      detailNote: `${n} of 8 PERC criterion${n === 1 ? '' : 'ia'} marked present.`,
    };
  }

  if (!input.lowPretestProbabilityConfirmed) {
    return {
      kind: 'ineligible_pretest',
      interpretation:
        'Confirm low clinical pretest probability for PE (&lt;15%) before applying the PERC rule-out interpretation.',
      detailNote:
        'PERC is validated only when the clinician judges PE probability low without prior definitive testing.',
    };
  }

  if (!input.allCriteriaAssessed) {
    return {
      kind: 'incomplete_assessment',
      interpretation:
        'Complete assessment of all eight PERC criteria before a rule-out interpretation.',
      detailNote:
        'Unchecked boxes do not silently mean “absent” until you confirm all eight criteria were reviewed.',
    };
  }

  return {
    kind: 'rule_out',
    interpretation:
      'Pulmonary embolism can be ruled out in this patient, as the overall risk is below 2%.',
    detailNote:
      'Educational wording from the PERC validation cohort when pretest probability is low and no PERC criterion is present.',
  };
}

export function calculatePerc(input: PercInput): PercResult {
  const positiveCount = countPositiveCriteria(input.criteria);
  const { kind, interpretation, detailNote } = resolveInterpretation(input);

  return {
    positiveCount,
    formattedPositiveCount: String(positiveCount),
    interpretationKind: kind,
    interpretation,
    detailNote,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}