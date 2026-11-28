/**
 * Boat Speed — Crouch's formula (educational / empirical).
 *
 * Reference units: S mph, P mechanical hp, D pounds.
 * S = C × √(P / D)
 * P = D × (S / C)²
 * D = P / (S / C)²
 * C = S × √(D / P)
 */

import {
  BOAT_TYPES,
  type BoatDisplacementUnit,
  type BoatPowerUnit,
  type BoatSpeedInput,
  type BoatSpeedResult,
  type BoatSpeedUnit,
  type HorsepowerSpeedPoint,
} from './types';

/** Mechanical horsepower → watts */
export const HP_TO_W = 745.699872;
/** Metric horsepower → watts */
export const PS_TO_W = 735.49875;
export const LB_TO_KG = 0.45359237;
export const SHORT_TON_LB = 2000;
export const LONG_TON_LB = 2240;
export const KG_PER_TONNE = 1000;

export const MPH_TO_KMH = 1.609344;
export const MPH_TO_KNOTS = 0.86897624;
export const MPH_TO_MS = 0.44704;
export const MPH_TO_FTS = 1.4666666667;

function round(n: number, digits = 6): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertPower(
  value: number,
  from: BoatPowerUnit,
  to: BoatPowerUnit,
): number {
  const toW: Record<BoatPowerUnit, number> = {
    hp: HP_TO_W,
    kW: 1000,
    W: 1,
    PS: PS_TO_W,
  };
  return (value * toW[from]) / toW[to];
}

export function toMechanicalHp(value: number, unit: BoatPowerUnit): number {
  return convertPower(value, unit, 'hp');
}

export function fromMechanicalHp(hp: number, unit: BoatPowerUnit): number {
  return convertPower(hp, 'hp', unit);
}

export function convertDisplacement(
  value: number,
  from: BoatDisplacementUnit,
  to: BoatDisplacementUnit,
): number {
  const toLb: Record<BoatDisplacementUnit, number> = {
    lb: 1,
    kg: 1 / LB_TO_KG,
    t: KG_PER_TONNE / LB_TO_KG,
    shortTon: SHORT_TON_LB,
    longTon: LONG_TON_LB,
  };
  return (value * toLb[from]) / toLb[to];
}

export function toPounds(value: number, unit: BoatDisplacementUnit): number {
  return convertDisplacement(value, unit, 'lb');
}

export function fromPounds(lb: number, unit: BoatDisplacementUnit): number {
  return convertDisplacement(lb, 'lb', unit);
}

export function convertSpeed(
  value: number,
  from: BoatSpeedUnit,
  to: BoatSpeedUnit,
): number {
  const toMph: Record<BoatSpeedUnit, number> = {
    mph: 1,
    kmh: 1 / MPH_TO_KMH,
    knots: 1 / MPH_TO_KNOTS,
    ms: 1 / MPH_TO_MS,
    fts: 1 / MPH_TO_FTS,
  };
  return (value * toMph[from]) / toMph[to];
}

export function toMph(value: number, unit: BoatSpeedUnit): number {
  return convertSpeed(value, unit, 'mph');
}

export function fromMph(mph: number, unit: BoatSpeedUnit): number {
  return convertSpeed(mph, 'mph', unit);
}

export function calculateBoatSpeed(
  horsepowerHp: number,
  displacementLb: number,
  crouchConstant: number,
): number | null {
  if (
    ![horsepowerHp, displacementLb, crouchConstant].every(Number.isFinite) ||
    horsepowerHp < 0 ||
    displacementLb <= 0 ||
    crouchConstant <= 0
  ) {
    return null;
  }
  return crouchConstant * Math.sqrt(horsepowerHp / displacementLb);
}

export function calculateRequiredHorsepower(
  speedMph: number,
  displacementLb: number,
  crouchConstant: number,
): number | null {
  if (
    ![speedMph, displacementLb, crouchConstant].every(Number.isFinite) ||
    speedMph < 0 ||
    displacementLb <= 0 ||
    crouchConstant <= 0
  ) {
    return null;
  }
  return displacementLb * (speedMph / crouchConstant) ** 2;
}

export function calculateBoatDisplacement(
  horsepowerHp: number,
  speedMph: number,
  crouchConstant: number,
): number | null {
  if (
    ![horsepowerHp, speedMph, crouchConstant].every(Number.isFinite) ||
    horsepowerHp <= 0 ||
    speedMph <= 0 ||
    crouchConstant <= 0
  ) {
    return null;
  }
  return horsepowerHp / (speedMph / crouchConstant) ** 2;
}

export function calculateCrouchConstant(
  horsepowerHp: number,
  displacementLb: number,
  speedMph: number,
): number | null {
  if (
    ![horsepowerHp, displacementLb, speedMph].every(Number.isFinite) ||
    horsepowerHp <= 0 ||
    displacementLb <= 0 ||
    speedMph < 0
  ) {
    return null;
  }
  return speedMph * Math.sqrt(displacementLb / horsepowerHp);
}

export function generateHorsepowerSpeedData(
  displacementLb: number,
  crouchConstant: number,
  levels: readonly number[] = [500, 1000, 1500, 2000, 2500, 3000],
): HorsepowerSpeedPoint[] {
  if (!(displacementLb > 0) || !(crouchConstant > 0)) return [];
  return levels.map((hp) => ({
    horsepowerHp: hp,
    speedMph: crouchConstant * Math.sqrt(hp / displacementLb),
  }));
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function boatLabel(id: string): string {
  return BOAT_TYPES.find((t) => t.id === id)?.label ?? id;
}

export function calculateBoatSpeedFromInput(
  input: BoatSpeedInput,
): BoatSpeedResult | null {
  const C = parseNum(input.crouchConstant);
  if (C == null || C <= 0) return null;

  let P_hp: number | null = null;
  let D_lb: number | null = null;
  let S_mph: number | null = null;

  if (input.mode !== 'horsepower') {
    const p = parseNum(input.horsepower);
    if (p == null || p < 0) return null;
    if (input.mode !== 'speed' && p <= 0 && input.mode === 'displacement')
      return null;
    P_hp = toMechanicalHp(p, input.horsepowerUnit);
  }

  if (input.mode !== 'displacement') {
    const d = parseNum(input.displacement);
    if (d == null || d <= 0) return null;
    D_lb = toPounds(d, input.displacementUnit);
  }

  if (input.mode !== 'speed') {
    const s = parseNum(input.speed);
    if (s == null || s < 0) return null;
    if (input.mode !== 'crouchConstant' && s <= 0 && input.mode !== 'speed') {
      // for hp/displacement reverse, speed must be > 0
    }
    S_mph = toMph(s, input.speedUnit);
  }

  const steps: string[] = [];
  let primaryLabel = 'Estimated Boat Speed';
  let formattedPrimary = '';

  if (input.mode === 'speed') {
    if (P_hp == null || D_lb == null) return null;
    S_mph = calculateBoatSpeed(P_hp, D_lb, C);
    if (S_mph == null) return null;
    const ratio = P_hp / D_lb;
    steps.push('Speed = C × √(P / D)');
    steps.push(`Speed = ${fmt(C, 0)} × √(${fmt(P_hp, 2)} / ${fmt(D_lb, 2)})`);
    steps.push(`Speed = ${fmt(C, 0)} × √${fmt(ratio, 4)}`);
    steps.push(`Speed = ${fmt(S_mph, 2)} mph`);
    formattedPrimary = `${fmt(fromMph(S_mph, input.speedUnit), 2)} ${input.speedUnit === 'kmh' ? 'km/h' : input.speedUnit === 'knots' ? 'kn' : input.speedUnit === 'ms' ? 'm/s' : input.speedUnit === 'fts' ? 'ft/s' : 'mph'}`;
  } else if (input.mode === 'horsepower') {
    if (S_mph == null || D_lb == null || S_mph <= 0) return null;
    P_hp = calculateRequiredHorsepower(S_mph, D_lb, C);
    if (P_hp == null) return null;
    steps.push('P = D × (S / C)²');
    steps.push(
      `P = ${fmt(D_lb, 2)} × (${fmt(S_mph, 2)} / ${fmt(C, 0)})²`,
    );
    steps.push(`P = ${fmt(P_hp, 2)} hp`);
    primaryLabel = 'Required Shaft Horsepower';
    formattedPrimary = `${fmt(fromMechanicalHp(P_hp, input.horsepowerUnit), 2)} ${input.horsepowerUnit}`;
  } else if (input.mode === 'displacement') {
    if (P_hp == null || S_mph == null || P_hp <= 0 || S_mph <= 0) return null;
    D_lb = calculateBoatDisplacement(P_hp, S_mph, C);
    if (D_lb == null) return null;
    steps.push('D = P / (S / C)²');
    steps.push(
      `D = ${fmt(P_hp, 2)} / (${fmt(S_mph, 2)} / ${fmt(C, 0)})²`,
    );
    steps.push(`D = ${fmt(D_lb, 2)} lb`);
    primaryLabel = 'Estimated Displacement';
    formattedPrimary = `${fmt(fromPounds(D_lb, input.displacementUnit), 2)} ${input.displacementUnit === 'shortTon' ? 'US ton' : input.displacementUnit === 'longTon' ? 'long ton' : input.displacementUnit}`;
  } else {
    // crouchConstant
    const p = parseNum(input.horsepower);
    const d = parseNum(input.displacement);
    const s = parseNum(input.speed);
    if (p == null || p <= 0 || d == null || d <= 0 || s == null || s < 0)
      return null;
    P_hp = toMechanicalHp(p, input.horsepowerUnit);
    D_lb = toPounds(d, input.displacementUnit);
    S_mph = toMph(s, input.speedUnit);
    const cCalc = calculateCrouchConstant(P_hp, D_lb, S_mph);
    if (cCalc == null) return null;
    // overwrite C with calculated
    const Ccalc = cCalc;
    steps.push('C = S × √(D / P)');
    steps.push(
      `C = ${fmt(S_mph, 2)} × √(${fmt(D_lb, 2)} / ${fmt(P_hp, 2)})`,
    );
    steps.push(`C = ${fmt(Ccalc, 2)}`);
    primaryLabel = 'Estimated Crouch Constant';
    formattedPrimary = fmt(Ccalc, 2);
    const ratio = P_hp / D_lb;
    return {
      mode: input.mode,
      speedMph: S_mph,
      horsepowerHp: P_hp,
      displacementLb: D_lb,
      crouchConstant: Ccalc,
      boatType: input.boatType,
      boatTypeLabel: boatLabel(input.boatType),
      powerToDisplacementRatio: ratio,
      speedDisplay: fromMph(S_mph, input.speedUnit),
      speedUnit: input.speedUnit,
      horsepowerDisplay: fromMechanicalHp(P_hp, input.horsepowerUnit),
      horsepowerUnit: input.horsepowerUnit,
      displacementDisplay: fromPounds(D_lb, input.displacementUnit),
      displacementUnit: input.displacementUnit,
      formulaSteps: steps,
      comparison: generateHorsepowerSpeedData(D_lb, Ccalc),
      interpretation:
        'Empirical Crouch estimate using mph / mechanical hp / pounds. Not a guaranteed measured top speed.',
      formattedPrimary,
      primaryLabel,
    };
  }

  if (P_hp == null || D_lb == null || S_mph == null) return null;
  const ratio = P_hp / D_lb;

  return {
    mode: input.mode,
    speedMph: S_mph,
    horsepowerHp: P_hp,
    displacementLb: D_lb,
    crouchConstant: C,
    boatType: input.boatType,
    boatTypeLabel: boatLabel(input.boatType),
    powerToDisplacementRatio: ratio,
    speedDisplay: fromMph(S_mph, input.speedUnit),
    speedUnit: input.speedUnit,
    horsepowerDisplay: fromMechanicalHp(P_hp, input.horsepowerUnit),
    horsepowerUnit: input.horsepowerUnit,
    displacementDisplay: fromPounds(D_lb, input.displacementUnit),
    displacementUnit: input.displacementUnit,
    formulaSteps: steps,
    comparison: generateHorsepowerSpeedData(D_lb, C),
    interpretation:
      'Empirical Crouch estimate using mph / mechanical hp / pounds. Not a guaranteed measured top speed.',
    formattedPrimary,
    primaryLabel,
  };
}

export { round, fmt };
