/**
 * Adderall IR educational explorer + prescribed-dose tablet arithmetic.
 *
 * Sources:
 * - DailyMed Adderall IR (mixed amphetamine salts), setid
 *   f22635fe-821d-4cde-aa12-419f8b53db81 — IR tablet strengths 5–30 mg;
 *   ADHD/narcolepsy labeled populations; weekly titration language.
 * - Omni Adderall dosage article (functional reference for charts + tablet math:
 *   tablets = dose_mg / strength_mg). Where Omni XR rows appear, this tool
 *   intentionally omits XR (screenshot + DailyMed IR only).
 *
 * Does NOT auto-prescribe or titrate. Custom mode converts an already-prescribed
 * mg amount into tablet quantity only.
 */

import type {
  AdderallDosageInput,
  AdderallDosageResult,
  IndicationMode,
  TabletStrengthMg,
} from './types';

export const SOURCE_NOTE =
  'Educational IR tablet reference from DailyMed Adderall (setid f22635fe-821d-4cde-aa12-419f8b53db81) and Omni’s published age/indication charts for regular tablets. Not a prescription. Adderall XR is out of scope.';

export const DISCLAIMER =
  'Adderall (mixed amphetamine salts) is a Schedule II stimulant. This tool does not start, increase, or change therapy. Confirm the dispensed product, age eligibility, and directions with the prescribing clinician or pharmacist.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function tabletQuantity(
  prescribedDoseMg: number,
  strengthMg: TabletStrengthMg,
): number {
  if (!(prescribedDoseMg > 0) || !(strengthMg > 0)) {
    throw new Error('Dose and strength must be positive.');
  }
  return prescribedDoseMg / strengthMg;
}

function indicationLabel(mode: IndicationMode): string {
  if (mode === 'adhd') return 'ADHD';
  if (mode === 'narcolepsy') return 'Narcolepsy';
  return 'Custom prescribed dose';
}

/**
 * Educational IR starting dose (mg per administration teaching start) from
 * Omni/DailyMed-aligned charts for regular (non-XR) tablets.
 */
export function educationalStartingDoseMg(
  ageYears: number,
  indication: 'adhd' | 'narcolepsy',
): { doseMg: number | null; population: string; lines: string[]; unsupported?: string } {
  if (indication === 'adhd') {
    if (ageYears >= 3 && ageYears <= 5) {
      return {
        doseMg: 2.5,
        population: 'Children 3–5 years (ADHD, IR)',
        lines: [
          'Educational IR start: 2.5 mg once daily (may not match a whole listed tablet — clinician/pharmacist must choose a dispensable form).',
          'Label/Omni teaching: may increase by 2.5 mg weekly; usually once or twice daily.',
          'Adult ADHD max teaching ceiling commonly cited near 40 mg/day — not computed here.',
        ],
      };
    }
    if (ageYears >= 6 && ageYears < 18) {
      return {
        doseMg: 5,
        population: 'Children/adolescents 6–17 years (ADHD, IR)',
        lines: [
          'Educational IR start: 5 mg once or twice daily.',
          'Teaching titration: +5 mg weekly as directed by the clinician.',
        ],
      };
    }
    if (ageYears >= 18) {
      return {
        doseMg: 5,
        population: 'Adults (ADHD, IR)',
        lines: [
          'Educational IR start: 5 mg once or twice daily.',
          'Teaching titration: +5 mg weekly as directed by the clinician.',
          'Omni/label teaching max for ADHD ≈ 40 mg/day — clinician decides.',
        ],
      };
    }
    return {
      doseMg: null,
      population: 'Unsupported age for ADHD IR charts',
      lines: [],
      unsupported: 'ADHD IR educational charts begin at age 3 years.',
    };
  }

  // Narcolepsy
  if (ageYears >= 6 && ageYears <= 11) {
    return {
      doseMg: 5,
      population: 'Children 6–11 years (narcolepsy, IR)',
      lines: [
        'Educational IR start: 5 mg daily.',
        'Teaching titration: +5 mg weekly as directed by the clinician.',
      ],
    };
  }
  if (ageYears >= 12 && ageYears < 18) {
    return {
      doseMg: 10,
      population: 'Adolescents 12–17 years (narcolepsy, IR)',
      lines: [
        'Educational IR start: 10 mg daily.',
        'Teaching titration: +10 mg weekly as directed by the clinician.',
      ],
    };
  }
  if (ageYears >= 18) {
    return {
      doseMg: 10,
      population: 'Adults (narcolepsy, IR)',
      lines: [
        'Educational IR start: 10 mg daily.',
        'Teaching titration: +10 mg weekly as directed by the clinician.',
        'Omni/label teaching max for narcolepsy ≈ 60 mg/day — clinician decides.',
      ],
    };
  }
  return {
    doseMg: null,
    population: 'Unsupported age for narcolepsy IR charts',
    lines: [],
    unsupported: 'Narcolepsy IR educational charts begin at age 6 years.',
  };
}

export function calculateAdderallDosage(
  input: AdderallDosageInput,
): AdderallDosageResult {
  const base = {
    educationalStartingDoseMg: null as number | null,
    educationalLines: [] as string[],
    warnings: [
      'Schedule II controlled substance — misuse, addiction, and cardiovascular risks apply.',
      'This tool never recommends increasing a dose or switching formulations (IR vs XR).',
    ],
    tabletQuantity: null as number | null,
    tabletQuantityLabel: null as string | null,
    fractionalTabletNote: null as string | null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    indicationLabel: indicationLabel(input.indication),
  };

  const age = parseNumber(input.ageYearsText);
  if (age === null) {
    return {
      ...base,
      outcome: 'awaiting_age',
      ageYears: null,
      populationLabel: null,
      educationalLines: [
        'Enter age in years to see educational IR label/chart context for ADHD or narcolepsy, or switch to custom prescribed-dose tablet math.',
      ],
    };
  }
  if (!(age >= 0) || age > 120) {
    return {
      ...base,
      outcome: 'unsupported_age',
      ageYears: age,
      populationLabel: null,
      educationalLines: ['Enter a realistic age in years (0–120).'],
    };
  }

  if (input.indication === 'custom') {
    const dose = parseNumber(input.prescribedDoseMgText);
    if (dose === null) {
      return {
        ...base,
        outcome: 'custom_awaiting_dose',
        ageYears: age,
        populationLabel: 'Custom prescribed-dose arithmetic',
        educationalLines: [
          'Enter the mg amount your licensed prescriber already specified per administration. This mode only divides that amount by the selected IR tablet strength.',
        ],
      };
    }
    if (!(dose > 0)) {
      return {
        ...base,
        outcome: 'custom_invalid',
        ageYears: age,
        populationLabel: 'Custom prescribed-dose arithmetic',
        educationalLines: ['Prescribed dose must be a positive number of milligrams.'],
      };
    }
    const qty = tabletQuantity(dose, input.tabletStrengthMg);
    const whole = Number.isInteger(qty);
    return {
      ...base,
      outcome: 'custom_tablet_quantity',
      ageYears: age,
      populationLabel: 'Custom prescribed-dose arithmetic',
      tabletQuantity: qty,
      tabletQuantityLabel: `Tablet quantity for the entered prescribed dose: ${qty} × ${input.tabletStrengthMg} mg IR tablet(s)`,
      fractionalTabletNote: whole
        ? null
        : 'Result is fractional. Do not assume tablets may be split. Confirm formulation and dispensing with the prescribing clinician or pharmacist — never round into a different dose on your own.',
      educationalLines: [
        `Arithmetic only: ${dose} mg ÷ ${input.tabletStrengthMg} mg/tablet = ${qty} tablet(s).`,
        'This does not authorize changing the prescription, frequency, or daily total.',
      ],
    };
  }

  const chart = educationalStartingDoseMg(
    age,
    input.indication === 'adhd' ? 'adhd' : 'narcolepsy',
  );
  if (chart.unsupported || chart.doseMg === null) {
    return {
      ...base,
      outcome: 'unsupported_age',
      ageYears: age,
      populationLabel: chart.population,
      educationalLines: [chart.unsupported ?? 'Age/indication combination is outside the educational IR charts.'],
    };
  }

  const qtyForStart = tabletQuantity(chart.doseMg, input.tabletStrengthMg);
  return {
    ...base,
    outcome: 'label_reference',
    ageYears: age,
    populationLabel: chart.population,
    educationalStartingDoseMg: chart.doseMg,
    educationalLines: [
      ...chart.lines,
      `If a clinician prescribed exactly ${chart.doseMg} mg IR using ${input.tabletStrengthMg} mg tablets, arithmetic quantity = ${qtyForStart} tablet(s) — still not a new prescription.`,
      'Omni also documents Adderall XR charts; this calculator intentionally covers IR strengths only (screenshot + DailyMed IR).',
    ],
  };
}
