/**
 * Blood Pressure Calculator — educational office BP category lookup.
 *
 * American path: ACC/AHA adult categories (2017 Whelton Table retained in the
 * 2025 AHA/ACC adult BP guideline Table 4) plus the public AHA “severe”
 * band (SBP >180 and/or DBP >120).
 *
 * European path: 2018 joint ESC/ESH Guidelines Table 3 (office BP), including
 * graded isolated systolic hypertension. Later separate ESC (2024) / ESH
 * editions are intentionally not mixed into this mode — the screenshot labels
 * the joint ESC and ESH option.
 *
 * Precedence: classify systolic and diastolic independently, then assign the
 * higher applicable category. Boundary inclusion follows each published table
 * (open upper bounds use exclusive “less than”; closed ranges use inclusive
 * endpoints as printed).
 *
 * Output is a single-reading category with measurement context — not a
 * clinical diagnosis (guidelines require averaged readings on ≥2 occasions).
 */

import type {
  AccAhaCategory,
  BloodPressureInput,
  BloodPressureResult,
  BpGuideline,
  EscEshCategory,
} from './types';

export const ACC_AHA_SOURCE =
  'ACC/AHA adult office BP categories: 2025 AHA/ACC hypertension guideline Table 4 (adapted from Whelton et al. 2017/2018); severe band per AHA public BP category chart (SBP >180 and/or DBP >120).';

export const ESC_ESH_2018_SOURCE =
  '2018 ESC/ESH Guidelines for the management of arterial hypertension, Table 3 (joint office BP classification, ages ≥16). Later separate ESC 2024 / ESH editions are not applied in this mode.';

export const DISCLAIMER =
  'Educational office-reading category only. Guidelines classify average BP from repeated careful measurements — a single pair of numbers is not a diagnosis. Not medical advice.';

export const CONTEXT_NOTE =
  'Category applies to this entered office-style reading (systolic/diastolic mmHg). Clinical classification normally uses the average of ≥2 careful readings on ≥2 occasions.';

const ACC_AHA_RANK: Record<AccAhaCategory, number> = {
  normal: 0,
  elevated: 1,
  stage1: 2,
  stage2: 3,
  severe: 4,
};

const ESC_RANK: Record<EscEshCategory, number> = {
  optimal: 0,
  normal: 1,
  highNormal: 2,
  grade1: 3,
  grade2: 4,
  grade3: 5,
  ishGrade1: 3,
  ishGrade2: 4,
  ishGrade3: 5,
};

export const ACC_AHA_LABELS: Record<AccAhaCategory, string> = {
  normal: 'Normal',
  elevated: 'Elevated',
  stage1: 'Stage 1 hypertension',
  stage2: 'Stage 2 hypertension',
  severe: 'Severe hypertension',
};

export const ESC_ESH_LABELS: Record<EscEshCategory, string> = {
  optimal: 'Optimal',
  normal: 'Normal',
  highNormal: 'High normal',
  grade1: 'Grade 1 hypertension',
  grade2: 'Grade 2 hypertension',
  grade3: 'Grade 3 hypertension',
  ishGrade1: 'Isolated systolic hypertension (Grade 1)',
  ishGrade2: 'Isolated systolic hypertension (Grade 2)',
  ishGrade3: 'Isolated systolic hypertension (Grade 3)',
};

export function guidelineLabel(guideline: BpGuideline): string {
  return guideline === 'accAha'
    ? 'American (ACC/AHA)'
    : 'European (ESC/ESH 2018 joint)';
}

/**
 * ACC/AHA systolic-only band before combining with diastolic.
 * Severe uses exclusive >180 per AHA public chart / guideline wording.
 */
export function classifyAccAhaSystolic(sbp: number): AccAhaCategory {
  if (sbp > 180) return 'severe';
  if (sbp >= 140) return 'stage2';
  if (sbp >= 130) return 'stage1';
  if (sbp >= 120) return 'elevated';
  return 'normal';
}

/** ACC/AHA diastolic-only band; severe uses exclusive >120. */
export function classifyAccAhaDiastolic(dbp: number): AccAhaCategory {
  if (dbp > 120) return 'severe';
  if (dbp >= 90) return 'stage2';
  if (dbp >= 80) return 'stage1';
  return 'normal';
}

/**
 * Combine ACC/AHA SBP/DBP bands: higher category wins.
 * Elevated requires SBP 120–129 AND DBP <80 (both sides must allow it).
 */
export function classifyAccAha(sbp: number, dbp: number): AccAhaCategory {
  const s = classifyAccAhaSystolic(sbp);
  const d = classifyAccAhaDiastolic(dbp);

  if (s === 'severe' || d === 'severe') return 'severe';
  if (s === 'stage2' || d === 'stage2') return 'stage2';
  if (s === 'stage1' || d === 'stage1') return 'stage1';

  // Elevated is SBP-only with DBP still <80 (DBP band is "normal").
  if (s === 'elevated' && d === 'normal') return 'elevated';
  if (s === 'elevated' && d !== 'normal') {
    // DBP already handled above if ≥80; defensive fallback.
    return ACC_AHA_RANK[d] > ACC_AHA_RANK.elevated ? d : 'elevated';
  }

  return 'normal';
}

/** ESC/ESH 2018 systolic office band (before ISH overlay). */
export function classifyEscEshSystolic(sbp: number): EscEshCategory {
  if (sbp >= 180) return 'grade3';
  if (sbp >= 160) return 'grade2';
  if (sbp >= 140) return 'grade1';
  if (sbp >= 130) return 'highNormal';
  if (sbp >= 120) return 'normal';
  return 'optimal';
}

/** ESC/ESH 2018 diastolic office band. */
export function classifyEscEshDiastolic(dbp: number): EscEshCategory {
  if (dbp >= 110) return 'grade3';
  if (dbp >= 100) return 'grade2';
  if (dbp >= 90) return 'grade1';
  if (dbp >= 85) return 'highNormal';
  if (dbp >= 80) return 'normal';
  return 'optimal';
}

function maxEsc(a: EscEshCategory, b: EscEshCategory): EscEshCategory {
  return ESC_RANK[a] >= ESC_RANK[b] ? a : b;
}

/**
 * ESC/ESH 2018: higher of SBP/DBP category; when SBP ≥140 and DBP <90,
 * report graded isolated systolic hypertension.
 */
export function classifyEscEsh2018(sbp: number, dbp: number): EscEshCategory {
  if (sbp >= 140 && dbp < 90) {
    if (sbp >= 180) return 'ishGrade3';
    if (sbp >= 160) return 'ishGrade2';
    return 'ishGrade1';
  }

  return maxEsc(classifyEscEshSystolic(sbp), classifyEscEshDiastolic(dbp));
}

function explanationFor(
  guideline: BpGuideline,
  category: AccAhaCategory | EscEshCategory,
  sbp: number,
  dbp: number
): string {
  if (guideline === 'accAha') {
    const label = ACC_AHA_LABELS[category as AccAhaCategory];
    switch (category as AccAhaCategory) {
      case 'normal':
        return `${sbp}/${dbp} mmHg maps to ${label} under ACC/AHA (SBP <120 and DBP <80).`;
      case 'elevated':
        return `${sbp}/${dbp} mmHg maps to ${label} (SBP 120–129 and DBP <80).`;
      case 'stage1':
        return `${sbp}/${dbp} mmHg maps to ${label} (SBP 130–139 or DBP 80–89; higher category used when mixed).`;
      case 'stage2':
        return `${sbp}/${dbp} mmHg maps to ${label} (SBP ≥140 or DBP ≥90).`;
      case 'severe':
        return `${sbp}/${dbp} mmHg maps to ${label} (SBP >180 and/or DBP >120 on the AHA public chart). Seek urgent care guidance if symptoms of hypertensive emergency are present.`;
      default:
        return `${sbp}/${dbp} mmHg → ${label}.`;
    }
  }

  const label = ESC_ESH_LABELS[category as EscEshCategory];
  switch (category as EscEshCategory) {
    case 'optimal':
      return `${sbp}/${dbp} mmHg maps to ${label} (SBP <120 and DBP <80) on the 2018 ESC/ESH office table.`;
    case 'normal':
      return `${sbp}/${dbp} mmHg maps to ${label} (SBP 120–129 and/or DBP 80–84; higher band wins).`;
    case 'highNormal':
      return `${sbp}/${dbp} mmHg maps to ${label} (SBP 130–139 and/or DBP 85–89).`;
    case 'grade1':
      return `${sbp}/${dbp} mmHg maps to ${label} (SBP 140–159 and/or DBP 90–99).`;
    case 'grade2':
      return `${sbp}/${dbp} mmHg maps to ${label} (SBP 160–179 and/or DBP 100–109).`;
    case 'grade3':
      return `${sbp}/${dbp} mmHg maps to ${label} (SBP ≥180 and/or DBP ≥110).`;
    case 'ishGrade1':
    case 'ishGrade2':
    case 'ishGrade3':
      return `${sbp}/${dbp} mmHg maps to ${label}: SBP ≥140 with DBP <90, graded by systolic band on the 2018 ESC/ESH table.`;
    default:
      return `${sbp}/${dbp} mmHg → ${label}.`;
  }
}

export function calculateBloodPressure(
  input: Pick<BloodPressureInput, 'guideline'>,
  systolicMmHg: number,
  diastolicMmHg: number
): BloodPressureResult {
  const inconsistentOrder = systolicMmHg <= diastolicMmHg;
  const guideline = input.guideline;

  if (guideline === 'accAha') {
    const categoryId = classifyAccAha(systolicMmHg, diastolicMmHg);
    return {
      guideline,
      guidelineLabel: guidelineLabel(guideline),
      systolicMmHg,
      diastolicMmHg,
      readingLabel: `${systolicMmHg}/${diastolicMmHg} mmHg`,
      categoryId,
      categoryLabel: ACC_AHA_LABELS[categoryId],
      explanation: explanationFor(
        guideline,
        categoryId,
        systolicMmHg,
        diastolicMmHg
      ),
      contextNote: CONTEXT_NOTE,
      disclaimer: DISCLAIMER,
      sourceLabel: ACC_AHA_SOURCE,
      inconsistentOrder,
    };
  }

  const categoryId = classifyEscEsh2018(systolicMmHg, diastolicMmHg);
  return {
    guideline,
    guidelineLabel: guidelineLabel(guideline),
    systolicMmHg,
    diastolicMmHg,
    readingLabel: `${systolicMmHg}/${diastolicMmHg} mmHg`,
    categoryId,
    categoryLabel: ESC_ESH_LABELS[categoryId],
    explanation: explanationFor(
      guideline,
      categoryId,
      systolicMmHg,
      diastolicMmHg
    ),
    contextNote: CONTEXT_NOTE,
    disclaimer: DISCLAIMER,
    sourceLabel: ESC_ESH_2018_SOURCE,
    inconsistentOrder,
  };
}
