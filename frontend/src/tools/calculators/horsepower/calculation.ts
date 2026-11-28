/**
 * Quarter-mile HP estimates — internal: lb, mph, mechanical hp.
 */

import {
  ET_CONSTANT,
  TRAP_CONSTANT,
  type HorsepowerInput,
  type HorsepowerOutputUnit,
  type HorsepowerResult,
  type TrapSpeedUnit,
  type VehicleWeightUnit,
} from './types';

export const LB_PER_KG = 2.20462262185;
export const LB_PER_SHORT_TON = 2000;
export const KM_PER_MILE = 1.609344;
export const MPH_PER_MS = 2.2369362921;
export const WATTS_PER_HP = 745.699871582;
export const WATTS_PER_PS = 735.49875;

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertVehicleWeight(
  value: number,
  from: VehicleWeightUnit,
  to: VehicleWeightUnit,
): number {
  if (from === to) return value;
  const toLb: Record<VehicleWeightUnit, number> = {
    lb: 1,
    kg: LB_PER_KG,
    metricTon: 1000 * LB_PER_KG,
    shortTon: LB_PER_SHORT_TON,
  };
  return (value * toLb[from]) / toLb[to];
}

export function toPounds(value: number, unit: VehicleWeightUnit): number {
  return convertVehicleWeight(value, unit, 'lb');
}

export function fromPounds(lb: number, unit: VehicleWeightUnit): number {
  return convertVehicleWeight(lb, 'lb', unit);
}

export function convertTrapSpeed(
  value: number,
  from: TrapSpeedUnit,
  to: TrapSpeedUnit,
): number {
  if (from === to) return value;
  const toMph: Record<TrapSpeedUnit, number> = {
    mph: 1,
    'km/h': 1 / KM_PER_MILE,
    'm/s': MPH_PER_MS,
  };
  const fromMph: Record<TrapSpeedUnit, number> = {
    mph: 1,
    'km/h': KM_PER_MILE,
    'm/s': 1 / MPH_PER_MS,
  };
  return value * toMph[from] * fromMph[to];
}

export function toMph(value: number, unit: TrapSpeedUnit): number {
  return convertTrapSpeed(value, unit, 'mph');
}

export function fromMph(mph: number, unit: TrapSpeedUnit): number {
  return convertTrapSpeed(mph, 'mph', unit);
}

export function calculateHorsepowerFromElapsedTime(
  weightLb: number,
  etSeconds: number,
): number | null {
  if (!(weightLb > 0) || !(etSeconds > 0)) return null;
  const ratio = etSeconds / ET_CONSTANT;
  const cubed = ratio * ratio * ratio;
  if (!(cubed > 0) || !Number.isFinite(cubed)) return null;
  const hp = weightLb / cubed;
  return Number.isFinite(hp) ? hp : null;
}

export function calculateHorsepowerFromTrapSpeed(
  weightLb: number,
  trapMph: number,
): number | null {
  if (!(weightLb > 0) || !(trapMph > 0)) return null;
  const ratio = trapMph / TRAP_CONSTANT;
  const hp = weightLb * ratio * ratio * ratio;
  return Number.isFinite(hp) ? hp : null;
}

export function horsepowerToWatts(hp: number): number {
  return hp * WATTS_PER_HP;
}

export function horsepowerToKilowatts(hp: number): number {
  return hp * (WATTS_PER_HP / 1000);
}

export function horsepowerToMetricHorsepower(hp: number): number {
  return (hp * WATTS_PER_HP) / WATTS_PER_PS;
}

export function convertHorsepower(
  hp: number,
  to: HorsepowerOutputUnit,
): number {
  if (to === 'hp') return hp;
  if (to === 'PS') return horsepowerToMetricHorsepower(hp);
  if (to === 'W') return horsepowerToWatts(hp);
  return horsepowerToKilowatts(hp);
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateHorsepowerFromInput(
  input: HorsepowerInput,
): HorsepowerResult | null {
  const wRaw = parseNum(input.vehicleWeight);
  if (wRaw == null || !(wRaw > 0)) return null;
  const weightLb = toPounds(wRaw, input.vehicleWeightUnit);
  if (!(weightLb > 0)) return null;

  let hp: number;
  let et: number | null = null;
  let trap: number | null = null;
  const steps: string[] = [];

  steps.push(`Vehicle weight W = ${fmt(weightLb)} lb`);

  if (input.method === 'elapsedTime') {
    et = parseNum(input.quarterMileTime);
    if (et == null || !(et > 0)) return null;
    const result = calculateHorsepowerFromElapsedTime(weightLb, et);
    if (result == null) return null;
    hp = result;
    const ratio = et / ET_CONSTANT;
    steps.push(`Method: elapsed time (ET)`);
    steps.push(`ET = ${fmt(et, 3)} s`);
    steps.push(`ET / ${ET_CONSTANT} = ${fmt(ratio, 6)}`);
    steps.push(`(ET / ${ET_CONSTANT})³ = ${fmt(ratio ** 3, 6)}`);
    steps.push(
      `HP = W / (ET/${ET_CONSTANT})³ = ${fmt(weightLb)} / ${fmt(ratio ** 3, 6)} = ${fmt(hp)} hp`,
    );
  } else {
    const vRaw = parseNum(input.trapSpeed);
    if (vRaw == null || !(vRaw > 0)) return null;
    trap = toMph(vRaw, input.trapSpeedUnit);
    if (!(trap > 0)) return null;
    const result = calculateHorsepowerFromTrapSpeed(weightLb, trap);
    if (result == null) return null;
    hp = result;
    const ratio = trap / TRAP_CONSTANT;
    steps.push(`Method: trap speed`);
    steps.push(`V = ${fmt(trap)} mph`);
    steps.push(`V / ${TRAP_CONSTANT} = ${fmt(ratio, 6)}`);
    steps.push(`(V / ${TRAP_CONSTANT})³ = ${fmt(ratio ** 3, 6)}`);
    steps.push(
      `HP = W × (V/${TRAP_CONSTANT})³ = ${fmt(weightLb)} × ${fmt(ratio ** 3, 6)} = ${fmt(hp)} hp`,
    );
  }

  const ps = horsepowerToMetricHorsepower(hp);
  const watts = horsepowerToWatts(hp);
  const kw = horsepowerToKilowatts(hp);
  const display = convertHorsepower(hp, input.outputUnit);

  steps.push(`Mechanical hp → PS: ${fmt(ps)} PS`);
  steps.push(`→ ${fmt(watts, 2)} W · ${fmt(kw)} kW`);

  return {
    method: input.method,
    vehicleWeightLb: weightLb,
    quarterMileTimeSeconds: et,
    trapSpeedMph: trap,
    estimatedHorsepowerHp: hp,
    metricHorsepowerPs: ps,
    watts,
    kilowatts: kw,
    displayValue: display,
    displayUnit: input.outputUnit,
    formulaSteps: steps,
    interpretation:
      'Empirical quarter-mile estimate — not a dynamometer reading. Traction, drag, gearing, launch, and conditions can shift real power significantly.',
    formattedPrimary: `${fmt(display)} ${input.outputUnit}`,
  };
}
