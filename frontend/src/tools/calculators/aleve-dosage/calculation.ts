/**
 * Aleve / naproxen label lookup engine (pure, ADR-018).
 *
 * Sources (educational; not personalized medical advice):
 * - FDA / DailyMed Aleve (naproxen sodium 220 mg) Drug Facts — adults & children
 *   12+: 1 unit every 8–12 h; first dose may be 2 within the first hour; max 2 per
 *   8–12 h period; max 3 per 24 h. Children under 12: ask a doctor.
 * - FDA prescription naproxen / naproxen sodium labels — pain / RA / OA / AS / gout
 *   schedules (mg of the labeled salt). Formulations are not interchangeable.
 *
 * Tablet equivalents are whole units only when doseMg % strengthMg === 0.
 * Never invent fractional counts (rejects the screenshot specimen “2.3 tablets”).
 */

import {
  getDrugType,
  getIndication,
  type AleveDosageInput,
  type AleveDosageResult,
  type AleveDrugTypeOption,
  type AleveIndicationId,
  type AleveIndicationOption,
  type ScheduleBullet,
} from './types';

const SOURCE_OTC =
  'FDA OTC Aleve (naproxen sodium 220 mg) Drug Facts — adults and children 12 years and older. Educational only; read your package label.';

const SOURCE_RX =
  'FDA prescription naproxen / naproxen sodium labeling (pain, arthritis, gout schedules). Educational only — follow your prescribed directions; formulations are not interchangeable.';

/** Whole unit count only; null if dose does not divide evenly into strength. */
export function wholeUnitCount(
  doseMg: number,
  strengthMg: number
): number | null {
  if (
    !Number.isFinite(doseMg) ||
    !Number.isFinite(strengthMg) ||
    strengthMg <= 0 ||
    doseMg < 0
  ) {
    return null;
  }
  const q = doseMg / strengthMg;
  const rounded = Math.round(q);
  if (Math.abs(q - rounded) > 1e-9) return null;
  if (rounded < 0) return null;
  return rounded;
}

function pluralUnits(count: number, noun: string): string {
  if (count === 1) return `1 ${noun}`;
  // liquid gel → liquid gels
  if (noun.endsWith('s')) return `${count} ${noun}`;
  return `${count} ${noun}s`;
}

function unitLine(
  doseMg: number,
  drug: AleveDrugTypeOption,
  context: string
): { line: string; hasWhole: boolean } {
  const n = wholeUnitCount(doseMg, drug.strengthMg);
  if (n == null) {
    return {
      line: `Unit equivalents unavailable for ${doseMg} mg with ${drug.strengthMg} mg ${drug.unitNoun}s — doses must match whole ${drug.unitNoun}s (no fractional units). ${context}`,
      hasWhole: false,
    };
  }
  return {
    line: `You’ll need ${pluralUnits(n, drug.unitNoun)} of ${drug.strengthMg} mg ${context}.`,
    hasWhole: true,
  };
}

function saltNote(drug: AleveDrugTypeOption): string {
  if (drug.salt === 'naproxen_sodium') {
    return `Naproxen sodium ${drug.strengthMg} mg corresponds to about ${drug.naproxenBaseMg} mg naproxen (base). Salt and base strengths are not 1:1 interchangeable across products.`;
  }
  return `Strength is labeled as naproxen (base) ${drug.strengthMg} mg. Naproxen sodium products use different milligram labels for a similar naproxen amount.`;
}

function otcSchedule(drug: AleveDrugTypeOption): Omit<
  AleveDosageResult,
  | 'indicationLabel'
  | 'drugLabel'
  | 'mismatchMessage'
  | 'channel'
  | 'strengthMg'
  | 'salt'
  | 'naproxenBaseMg'
  | 'unitNoun'
> {
  const u = drug.unitNoun;
  const perDose = unitLine(220, drug, 'per dose (typical)');
  const dailyMax = unitLine(660, drug, 'at the 24-hour maximum');
  return {
    typicalDosageLine: `Typical dosage for this indication: 1 ${u} (${drug.strengthMg} mg naproxen sodium) every 8 to 12 hours while symptoms last.`,
    unitEquivalenceLine: perDose.line,
    hasWholeUnitCount: perDose.hasWhole,
    initialLine: `For the first dose you may take 2 ${u}s within the first hour.`,
    followUpBullets: [
      {
        text: `Then take 1 ${u} every 8 to 12 hours as needed.`,
      },
    ],
    maxLines: [
      `Do not exceed 2 ${u}s in any 8- to 12-hour period.`,
      `Do not exceed 3 ${u}s (${drug.strengthMg * 3} mg naproxen sodium) in a 24-hour period.`,
      dailyMax.hasWhole ? dailyMax.line : '',
    ].filter(Boolean),
    saltNote: saltNote(drug),
    warnings: [
      'Educational label summary only — not medical advice. Read Drug Facts; ask a doctor or pharmacist about stomach bleeding, heart, allergy, pregnancy (especially ≥20 weeks), and drug interactions.',
      'Children under 12 years: ask a doctor.',
      'Do not combine with other naproxen or NSAID products unless a clinician directs you to.',
      'Drink a full glass of water with each dose; use the smallest effective dose.',
    ],
    sourceNote: SOURCE_OTC,
  };
}

type RxPainKind = 'naproxen' | 'naproxen_sodium';

function rxPainSchedule(
  drug: AleveDrugTypeOption,
  kind: RxPainKind
): ReturnType<typeof otcSchedule> {
  if (kind === 'naproxen') {
    // Starting 500 mg; then 500 q12h or 250 q6–8h; initial day ≤1250 mg; later often ≤1000 mg/day.
    const initial = unitLine(500, drug, 'for the initial 500 mg dose');
    const q12 = unitLine(500, drug, 'every 12 hours');
    const q68 = unitLine(250, drug, 'every 6 to 8 hours');
    const bullets: ScheduleBullet[] = [];
    if (q68.hasWhole) {
      bullets.push({ text: `${q68.line.replace(/^You’ll need /, '')}` });
    } else {
      bullets.push({
        text: '250 mg every 6 to 8 hours as required (use a matching strength or a scored tablet only as labeled — no invented fractions).',
      });
    }
    if (q12.hasWhole) {
      bullets.push({ text: `${q12.line.replace(/^You’ll need /, '')}` });
    } else {
      bullets.push({
        text: '500 mg every 12 hours as required when the strength matches.',
      });
    }
    return {
      typicalDosageLine:
        'Typical dosage for this indication: 500 mg naproxen initially, then 250 mg every 6–8 hours or 500 mg every 12 hours as needed.',
      unitEquivalenceLine: initial.line,
      hasWholeUnitCount: initial.hasWhole,
      initialLine: 'Take 500 mg initially, then follow with:',
      followUpBullets: bullets,
      maxLines: [
        'Initial total daily dose should not exceed 1,250 mg of naproxen.',
        'Thereafter, total daily dose commonly should not exceed 1,000 mg of naproxen unless a clinician directs otherwise.',
        'Do not exceed labeled maxima or combine naproxen products.',
      ],
      saltNote: saltNote(drug),
      warnings: [
        'Prescription information only — follow your clinician’s directions. This is not a substitute for the dispensed label.',
        'Different naproxen formulations and strengths are not necessarily bioequivalent or interchangeable.',
      ],
      sourceNote: SOURCE_RX,
    };
  }

  // Naproxen sodium pain: 550 initial; 550 q12h or 275 q6–8h; initial day ≤1375; then ≤1100.
  const initial = unitLine(550, drug, 'for the initial 550 mg dose');
  const q12 = unitLine(550, drug, 'every 12 hours');
  const q68 = unitLine(275, drug, 'every 6 to 8 hours');
  const bullets: ScheduleBullet[] = [];
  if (q68.hasWhole) {
    bullets.push({ text: `${q68.line.replace(/^You’ll need /, '')}` });
  } else {
    bullets.push({
      text: '275 mg every 6 to 8 hours as required when the strength matches (no fractional units invented).',
    });
  }
  if (q12.hasWhole) {
    bullets.push({ text: `${q12.line.replace(/^You’ll need /, '')}` });
  } else {
    bullets.push({
      text: '550 mg every 12 hours as required when the strength matches.',
    });
  }
  return {
    typicalDosageLine:
      'Typical dosage for this indication: 550 mg naproxen sodium initially, then 275 mg every 6–8 hours or 550 mg every 12 hours as needed.',
    unitEquivalenceLine: initial.line,
    hasWholeUnitCount: initial.hasWhole,
    initialLine: 'Take 550 mg initially, then follow with:',
    followUpBullets: bullets,
    maxLines: [
      'Initial total daily dose should not exceed 1,375 mg of naproxen sodium.',
      'Thereafter, total daily dose should not exceed 1,100 mg of naproxen sodium unless a clinician directs otherwise.',
      'Do not exceed labeled maxima or combine naproxen products.',
    ],
    saltNote: saltNote(drug),
    warnings: [
      'Prescription information only — follow your clinician’s directions. This is not a substitute for the dispensed label.',
      'Different naproxen formulations and strengths are not necessarily bioequivalent or interchangeable.',
    ],
    sourceNote: SOURCE_RX,
  };
}

function rxChronicArthritis(drug: AleveDrugTypeOption): ReturnType<typeof otcSchedule> {
  // 250 / 375 / 500 mg naproxen twice daily; NS often 275/550 twice daily.
  const twice =
    drug.salt === 'naproxen_sodium'
      ? drug.strengthMg === 275 || drug.strengthMg === 550
        ? unitLine(drug.strengthMg, drug, 'twice daily (matching strength)')
        : {
            line: `Use a prescribed naproxen sodium strength (commonly 275 mg or 550 mg) twice daily — not ${drug.strengthMg} mg OTC Aleve units.`,
            hasWhole: false,
          }
      : drug.strengthMg === 250 ||
          drug.strengthMg === 375 ||
          drug.strengthMg === 500
        ? unitLine(drug.strengthMg, drug, 'twice daily')
        : {
            line: 'Use the prescribed tablet strength twice daily.',
            hasWhole: false,
          };

  return {
    typicalDosageLine:
      drug.salt === 'naproxen_sodium'
        ? 'Typical dosage for this indication: naproxen sodium 275 mg or 550 mg twice daily (clinician-directed).'
        : 'Typical dosage for this indication: naproxen 250 mg, 375 mg, or 500 mg twice daily (clinician-directed).',
    unitEquivalenceLine: twice.line,
    hasWholeUnitCount: twice.hasWhole,
    initialLine: null,
    followUpBullets: [
      {
        text: 'Morning and evening doses need not be equal; more frequent than twice daily usually does not improve response.',
      },
      {
        text: 'Long-term dose may be adjusted; higher short-term ceilings (e.g., up to 1,500 mg/day naproxen for limited periods) require clinician oversight.',
      },
    ],
    maxLines: [
      'Use the lowest effective dose for the shortest duration consistent with treatment goals.',
      'Do not combine with other naproxen-containing products.',
    ],
    saltNote: saltNote(drug),
    warnings: [
      'Prescription chronic arthritis regimens are individualized — follow your clinician and dispensed label.',
    ],
    sourceNote: SOURCE_RX,
  };
}

function rxGout(drug: AleveDrugTypeOption): ReturnType<typeof otcSchedule> {
  // Naproxen: 750 mg start, then 250 mg q8h. NS often 825 start then 275 q8h.
  if (drug.salt === 'naproxen_sodium') {
    const initial = unitLine(825, drug, 'for the initial 825 mg dose');
    const follow = unitLine(275, drug, 'every 8 hours');
    return {
      typicalDosageLine:
        'Typical dosage for this indication: 825 mg naproxen sodium initially, then 275 mg every 8 hours until the attack subsides (clinician-directed).',
      unitEquivalenceLine: initial.line,
      hasWholeUnitCount: initial.hasWhole,
      initialLine: 'Take 825 mg initially, then follow with:',
      followUpBullets: [
        follow.hasWhole
          ? { text: follow.line.replace(/^You’ll need /, '') }
          : {
              text: '275 mg every 8 hours when a matching strength is prescribed (no fractional units invented).',
            },
      ],
      maxLines: [
        'Continue only as directed until the gout attack has subsided.',
        'Do not self-substitute OTC Aleve for a gout regimen.',
      ],
      saltNote: saltNote(drug),
      warnings: [
        'Prescription gout dosing only — follow your clinician. Not an OTC Aleve schedule.',
      ],
      sourceNote: SOURCE_RX,
    };
  }

  const initial = unitLine(750, drug, 'for the initial 750 mg dose');
  const follow = unitLine(250, drug, 'every 8 hours');
  return {
    typicalDosageLine:
      'Typical dosage for this indication: 750 mg naproxen initially, then 250 mg every 8 hours until the attack subsides (clinician-directed).',
    unitEquivalenceLine: initial.line,
    hasWholeUnitCount: initial.hasWhole,
    initialLine: 'Take 750 mg initially, then follow with:',
    followUpBullets: [
      follow.hasWhole
        ? { text: follow.line.replace(/^You’ll need /, '') }
        : {
            text: '250 mg every 8 hours when a matching strength is prescribed (no fractional units invented).',
          },
    ],
    maxLines: [
      'Continue only as directed until the gout attack has subsided.',
      'Do not self-substitute OTC Aleve for a gout regimen.',
    ],
    saltNote: saltNote(drug),
    warnings: [
      'Prescription gout dosing only — follow your clinician. Not an OTC Aleve schedule.',
    ],
    sourceNote: SOURCE_RX,
  };
}

function isOtcPainLike(id: AleveIndicationId): boolean {
  return (
    id === 'pain' ||
    id === 'arthritis' ||
    id === 'muscular_aches' ||
    id === 'backache' ||
    id === 'menstrual_cramps' ||
    id === 'headache' ||
    id === 'toothache' ||
    id === 'common_cold' ||
    id === 'fever'
  );
}

function mismatch(
  indication: AleveIndicationOption,
  drug: AleveDrugTypeOption
): string | null {
  if (indication.channel === 'rx' && drug.channel === 'otc') {
    return `“${indication.label}” is a prescription-labeled use. OTC Aleve (${drug.label}) is not labeled for clinician-managed ${indication.label.toLowerCase()}; ask a doctor — do not invent an OTC schedule for this indication.`;
  }
  if (indication.channel === 'otc' && drug.channel === 'rx') {
    return `You selected a prescription strength (${drug.label}) with an OTC-style indication (“${indication.label}”). Showing the prescription label schedule for pain/arthritis/gout as applicable — OTC Aleve 220 mg Drug Facts do not apply to prescription tablets.`;
  }
  return null;
}

export function calculateAleveDosage(
  input: AleveDosageInput
): AleveDosageResult | null {
  const indication = getIndication(input.indication);
  const drug = getDrugType(input.drugType);
  if (!indication || !drug) return null;

  const base = {
    indicationLabel: indication.label,
    drugLabel: drug.label,
    strengthMg: drug.strengthMg,
    salt: drug.salt,
    naproxenBaseMg: drug.naproxenBaseMg,
    unitNoun: drug.unitNoun,
    mismatchMessage: mismatch(indication, drug),
  };

  // OTC product + OTC indication → Drug Facts (same directions for all OTC uses).
  if (drug.channel === 'otc' && isOtcPainLike(indication.id)) {
    const body = otcSchedule(drug);
    return { ...base, channel: 'otc', ...body };
  }

  // OTC product + Rx-only indication → blocked schedule (message only).
  if (drug.channel === 'otc' && indication.channel === 'rx') {
    return {
      ...base,
      channel: 'otc',
      typicalDosageLine:
        'No OTC Aleve dosage is provided for this prescription-only indication.',
      unitEquivalenceLine:
        'Unit equivalents are not calculated for unsupported indication/product pairs.',
      hasWholeUnitCount: false,
      initialLine: null,
      followUpBullets: [],
      maxLines: [],
      saltNote: saltNote(drug),
      warnings: [
        'Ask a doctor. Do not use OTC Aleve to approximate a prescription arthritis or gout regimen.',
      ],
      sourceNote: SOURCE_OTC,
    };
  }

  // Prescription product paths.
  if (drug.channel === 'rx') {
    if (
      indication.id === 'rheumatoid_arthritis' ||
      indication.id === 'osteoarthritis' ||
      indication.id === 'ankylosing_spondylitis'
    ) {
      const body = rxChronicArthritis(drug);
      return { ...base, channel: 'rx', ...body };
    }
    if (indication.id === 'acute_gout') {
      const body = rxGout(drug);
      return { ...base, channel: 'rx', ...body };
    }
    // OTC-style or generic “Pain” with Rx product → acute pain schedule for that salt.
    if (isOtcPainLike(indication.id) || indication.id === 'pain') {
      const body = rxPainSchedule(
        drug,
        drug.salt === 'naproxen_sodium' ? 'naproxen_sodium' : 'naproxen'
      );
      return { ...base, channel: 'rx', ...body };
    }
  }

  return null;
}
