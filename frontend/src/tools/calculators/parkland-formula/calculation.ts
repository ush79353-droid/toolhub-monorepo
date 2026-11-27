/**
 * Parkland burn fluid estimate — educational (ADR-018).
 *
 * Total fluids (mL / 24 h) = 4 × weight_kg × TBSA_percentage_points
 * First 8 h: half of total; rate = half / 8
 * Next 16 h: half of total; rate = half / 16
 *
 * TBSA via Wallace rule of nines (adult) / modified child percentages (Omni).
 * Only 2nd/3rd-degree regions count. Groin selectable for both modes.
 */

import type {
  ParklandInput,
  ParklandResult,
  PatientAgeGroup,
  RegionBurn,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Parkland: 4 mL × kg × %TBSA. Half in first 8 h, half over next 16 h. TBSA from Wallace rule of nines (adult) or modified child chart (Omni). Educational estimate only.';

export const DISCLAIMER =
  'Not a resuscitation order. Estimates replace burn losses only — include daily maintenance fluids separately, especially in children.';

export const PARKLAND_ML_PER_KG_PER_PERCENT = 4;

const LB_TO_KG = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * LB_TO_KG : value;
}

export function fromKg(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / LB_TO_KG : kg;
}

/** Adult Wallace percentages for dropdown selections. */
const ADULT = {
  headEntire: 9,
  headSide: 4.5,
  torsoEntire: 36,
  torsoSide: 18,
  chestOrAbdomen: 9,
  armEntire: 9,
  armSide: 4.5,
  armHalfSide: 2.25,
  legEntire: 18,
  legSide: 9,
  legHalfSide: 4.5,
  groin: 1,
} as const;

/** Child modified rule of nines (Omni: head 18, leg 14). */
const CHILD = {
  headEntire: 18,
  headSide: 9,
  torsoEntire: 36,
  torsoSide: 18,
  chestOrAbdomen: 9,
  armEntire: 9,
  armSide: 4.5,
  armHalfSide: 2.25,
  legEntire: 14,
  legSide: 7,
  legHalfSide: 3.5,
  groin: 1,
} as const;

function chart(age: PatientAgeGroup) {
  return age === 'child' ? CHILD : ADULT;
}

export function regionPercent(
  age: PatientAgeGroup,
  region: 'head' | 'torso' | 'arm' | 'leg' | 'groin',
  choice: RegionBurn,
): number {
  if (choice === 'none') return 0;
  const c = chart(age);
  if (region === 'groin') {
    return choice === 'affected' || choice === 'entire' ? c.groin : 0;
  }
  if (region === 'head') {
    if (choice === 'entire') return c.headEntire;
    if (choice === 'front' || choice === 'back') return c.headSide;
    return 0;
  }
  if (region === 'torso') {
    if (choice === 'entire') return c.torsoEntire;
    if (choice === 'front' || choice === 'back') return c.torsoSide;
    if (choice === 'chest' || choice === 'abdomen') return c.chestOrAbdomen;
    return 0;
  }
  if (region === 'arm') {
    if (choice === 'entire') return c.armEntire;
    if (choice === 'front' || choice === 'back') return c.armSide;
    if (choice === 'halfFront' || choice === 'halfBack') return c.armHalfSide;
    return 0;
  }
  // leg
  if (choice === 'entire') return c.legEntire;
  if (choice === 'front' || choice === 'back') return c.legSide;
  if (choice === 'halfFront' || choice === 'halfBack') return c.legHalfSide;
  return 0;
}

export function calculateTbsaPercent(input: ParklandInput): number {
  return (
    regionPercent(input.ageGroup, 'head', input.head) +
    regionPercent(input.ageGroup, 'torso', input.torso) +
    regionPercent(input.ageGroup, 'arm', input.arm) +
    regionPercent(input.ageGroup, 'leg', input.leg) +
    regionPercent(input.ageGroup, 'groin', input.groin) +
    regionPercent(input.ageGroup, 'arm', input.additionalArm) +
    regionPercent(input.ageGroup, 'leg', input.additionalLeg)
  );
}

export function parklandTotalMl(weightKg: number, tbsaPercent: number): number {
  return PARKLAND_ML_PER_KG_PER_PERCENT * weightKg * tbsaPercent;
}

export function formatVolume(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return String(Number(rounded.toFixed(2)));
}

export function formatPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${Number(rounded.toFixed(1))}%`;
}

function emptyResult(partial?: Partial<ParklandResult>): ParklandResult {
  return {
    tbsaPercent: null,
    totalMl24h: null,
    first8Ml: null,
    next16Ml: null,
    first8MlPerHour: null,
    next16MlPerHour: null,
    formattedTbsa: '0%',
    formattedTotal24h: '',
    formattedFirst8: '',
    formattedNext16: '',
    formattedFirst8Rate: '',
    formattedNext16Rate: '',
    statusHeadline: 'Enter weight and mark burned regions.',
    statusDetail:
      'TBSA sums Rule of Nines selections. Fluids use 4 mL × kg × %TBSA.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateParkland(input: ParklandInput): ParklandResult {
  const tbsa = calculateTbsaPercent(input);
  const weightRaw = parseNumber(input.weightText);

  const base = emptyResult({
    tbsaPercent: tbsa,
    formattedTbsa: formatPercent(tbsa),
  });

  if (weightRaw === null) {
    return {
      ...base,
      statusHeadline:
        tbsa > 0
          ? 'Enter body weight to compute fluid volumes.'
          : 'Burn percentage is 0%. Mark affected regions and enter weight.',
      statusDetail: 'Only 2nd- and 3rd-degree burns count toward TBSA.',
    };
  }
  if (!(weightRaw > 0)) {
    return {
      ...base,
      statusHeadline: 'Weight must be greater than zero.',
      statusDetail: 'Parkland volume is undefined for non-positive weight.',
    };
  }

  const kg = toKg(weightRaw, input.weightUnit);
  if (!(kg > 0) || !Number.isFinite(kg)) {
    return {
      ...base,
      statusHeadline: 'Unable to interpret weight.',
      statusDetail: 'Check the weight value and unit.',
    };
  }

  if (!(tbsa > 0)) {
    return {
      ...base,
      statusHeadline: 'TBSA is 0% — no Parkland fluid volume.',
      statusDetail: 'Select burned body regions (partial-/full-thickness).',
    };
  }

  const total = parklandTotalMl(kg, tbsa);
  const half = total / 2;
  const rate8 = half / 8;
  const rate16 = half / 16;

  if (![total, half, rate8, rate16].every(Number.isFinite)) {
    return {
      ...base,
      statusHeadline: 'Unable to compute Parkland volumes.',
      statusDetail: 'Result was non-finite.',
    };
  }

  return {
    tbsaPercent: tbsa,
    totalMl24h: total,
    first8Ml: half,
    next16Ml: half,
    first8MlPerHour: rate8,
    next16MlPerHour: rate16,
    formattedTbsa: formatPercent(tbsa),
    formattedTotal24h: formatVolume(total),
    formattedFirst8: formatVolume(half),
    formattedNext16: formatVolume(half),
    formattedFirst8Rate: formatVolume(rate8),
    formattedNext16Rate: formatVolume(rate16),
    statusHeadline: 'Parkland fluid estimate computed.',
    statusDetail:
      'Half of the 24 h volume in the first 8 h, half over the next 16 h.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
