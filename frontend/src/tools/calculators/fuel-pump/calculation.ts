/**
 * Fuel pump demand — canonical: mechanical hp, lb/(hp·hr), kg/L, bar, L/hr.
 */

import type {
  FlowUnit,
  FuelPumpCurvePoint,
  FuelPumpInput,
  FuelPumpResult,
  PowerUnit,
  PressureControlMode,
  PressureUnit,
} from './types';

export const WATTS_PER_HP = 745.699871582;
export const WATTS_PER_PS = 735.49875;
export const KG_PER_LB = 0.45359237;
export const LITERS_PER_US_GAL = 3.785411784;
export const KPA_PER_BAR = 100;
export const KPA_PER_PSI = 6.894757293168;

export function fmt(n: number, digits = 4): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function toHp(value: number, unit: PowerUnit): number {
  if (unit === 'hp') return value;
  if (unit === 'kW') return (value * 1000) / WATTS_PER_HP;
  return (value * WATTS_PER_PS) / WATTS_PER_HP;
}

export function fromHp(hp: number, unit: PowerUnit): number {
  if (unit === 'hp') return hp;
  if (unit === 'kW') return (hp * WATTS_PER_HP) / 1000;
  return (hp * WATTS_PER_HP) / WATTS_PER_PS;
}

export function toBar(value: number, unit: PressureUnit): number {
  if (unit === 'bar') return value;
  if (unit === 'kPa') return value / KPA_PER_BAR;
  return (value * KPA_PER_PSI) / KPA_PER_BAR;
}

export function fromBar(bar: number, unit: PressureUnit): number {
  if (unit === 'bar') return bar;
  if (unit === 'kPa') return bar * KPA_PER_BAR;
  return (bar * KPA_PER_BAR) / KPA_PER_PSI;
}

export function calculateFuelMassFlowLbPerHour(
  hp: number,
  bsfc: number,
): number | null {
  if (!(hp > 0) || !(bsfc > 0)) return null;
  return hp * bsfc;
}

export function calculateFuelVolumeFlowLPerHour(
  hp: number,
  bsfc: number,
  densityKgPerL: number,
): number | null {
  if (!(hp > 0) || !(bsfc > 0) || !(densityKgPerL > 0)) return null;
  return (hp * bsfc * KG_PER_LB) / densityKgPerL;
}

export function calculateTargetPumpFlow(
  fuelLPerHour: number,
  marginPercent: number,
): number | null {
  if (!(fuelLPerHour >= 0) || !(marginPercent >= 0)) return null;
  return fuelLPerHour * (1 + marginPercent / 100);
}

export function calculateFuelRailPressureBar(
  baseBar: number,
  boostBar: number,
  mode: PressureControlMode,
): number | null {
  if (!(baseBar > 0) || !Number.isFinite(boostBar)) return null;
  if (mode === 'manifoldReferenced') {
    if (boostBar < 0) return null;
    return baseBar + boostBar;
  }
  if (mode === 'fixedRail' || mode === 'electronic' || mode === 'custom') {
    return baseBar;
  }
  return baseBar;
}

export function calculateInjectorDifferentialPressureBar(
  railGaugeBar: number,
  manifoldGaugeBar: number,
): number {
  return railGaugeBar - manifoldGaugeBar;
}

export function calculatePumpOutletPressureBar(
  railBar: number,
  systemLossBar: number,
): number | null {
  if (!(railBar > 0) || !(systemLossBar >= 0)) return null;
  return railBar + systemLossBar;
}

export function fromLitersPerHour(
  lph: number,
  unit: FlowUnit,
  massLbPerHour: number,
  massKgPerHour: number,
): number | null {
  if (!(lph >= 0)) return null;
  switch (unit) {
    case 'L/hr':
      return lph;
    case 'L/min':
      return lph / 60;
    case 'mL/min':
    case 'cc/min':
      return (lph * 1000) / 60;
    case 'galUS/hr':
      return lph / LITERS_PER_US_GAL;
    case 'galUS/min':
      return lph / LITERS_PER_US_GAL / 60;
    case 'lb/hr':
      return massLbPerHour;
    case 'kg/hr':
      return massKgPerHour;
    default:
      return null;
  }
}

export function parsePumpCurve(
  raw: string,
): { points: FuelPumpCurvePoint[]; error?: string } {
  const t = raw.trim();
  if (t === '') return { points: [] };
  const points: FuelPumpCurvePoint[] = [];
  const parts = t.split(/[;\n]+/).map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    const m = part.split(/[,:\s]+/).filter(Boolean);
    if (m.length < 2) {
      return { points: [], error: 'Invalid pump curve format.' };
    }
    const pressureBar = Number(m[0]);
    const flowLitersPerHour = Number(m[1]);
    if (
      !Number.isFinite(pressureBar) ||
      !Number.isFinite(flowLitersPerHour) ||
      pressureBar < 0 ||
      flowLitersPerHour < 0
    ) {
      return { points: [], error: 'Invalid pump curve data points.' };
    }
    points.push({ pressureBar, flowLitersPerHour });
  }
  points.sort((a, b) => a.pressureBar - b.pressureBar);
  return { points };
}

/** Linear interpolate; null if outside tested range (no extrapolation). */
export function interpolateFuelPumpPerformance(
  points: FuelPumpCurvePoint[],
  pressureBar: number,
): { flow: number | null; warning: string | null } {
  if (points.length === 0) return { flow: null, warning: null };
  if (points.length === 1) {
    if (Math.abs(points[0].pressureBar - pressureBar) < 1e-9) {
      return { flow: points[0].flowLitersPerHour, warning: null };
    }
    return {
      flow: null,
      warning: 'Need at least two curve points to interpolate.',
    };
  }
  const minP = points[0].pressureBar;
  const maxP = points[points.length - 1].pressureBar;
  if (pressureBar < minP - 1e-12 || pressureBar > maxP + 1e-12) {
    return {
      flow: null,
      warning:
        'Operating pressure is outside the provided pump curve range — no extrapolation.',
    };
  }
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (pressureBar >= a.pressureBar && pressureBar <= b.pressureBar) {
      if (b.pressureBar === a.pressureBar) {
        return { flow: a.flowLitersPerHour, warning: null };
      }
      const t = (pressureBar - a.pressureBar) / (b.pressureBar - a.pressureBar);
      return {
        flow:
          a.flowLitersPerHour +
          t * (b.flowLitersPerHour - a.flowLitersPerHour),
        warning: null,
      };
    }
  }
  return { flow: null, warning: 'Unable to interpolate pump curve.' };
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateFuelPumpFromInput(
  input: FuelPumpInput,
): FuelPumpResult | null {
  const pRaw = parseNum(input.power);
  if (pRaw == null || !(pRaw > 0)) return null;
  const hp = toHp(pRaw, input.powerUnit);

  const bsfc = parseNum(input.bsfc);
  if (bsfc == null || !(bsfc > 0)) return null;

  const density = parseNum(input.fuelDensity);
  if (density == null || !(density > 0)) return null;

  const massLb = calculateFuelMassFlowLbPerHour(hp, bsfc);
  const volL = calculateFuelVolumeFlowLPerHour(hp, bsfc, density);
  if (massLb == null || volL == null) return null;
  const massKg = massLb * KG_PER_LB;

  const margin = parseNum(input.safetyMarginPercent) ?? 0;
  if (margin < 0) return null;
  const target = calculateTargetPumpFlow(volL, margin);
  if (target == null) return null;

  const baseRaw = parseNum(input.baseFuelPressure);
  if (baseRaw == null || !(baseRaw > 0)) return null;
  const boostRaw = parseNum(input.boostPressure);
  if (boostRaw == null || boostRaw < 0) return null;

  const baseBar = toBar(baseRaw, input.pressureUnit);
  const boostBar = toBar(boostRaw, input.pressureUnit);

  const rail = calculateFuelRailPressureBar(
    baseBar,
    boostBar,
    input.pressureControlMode,
  );
  if (rail == null) return null;

  const lossRaw = parseNum(input.pressureLoss) ?? 0;
  if (lossRaw < 0) return null;
  const lossBar = toBar(lossRaw, input.pressureUnit);
  const outlet = calculatePumpOutletPressureBar(rail, lossBar);
  if (outlet == null) return null;

  let diff: number | null = null;
  if (input.pressureControlMode === 'fixedRail') {
    diff = calculateInjectorDifferentialPressureBar(rail, boostBar);
  }

  const displayFlow = fromLitersPerHour(
    volL,
    input.resultFlowUnit,
    massLb,
    massKg,
  );
  if (displayFlow == null) return null;

  const displayRail = fromBar(rail, input.resultPressureUnit);
  const displayOutlet = fromBar(outlet, input.resultPressureUnit);

  const { points, error: curveParseError } = parsePumpCurve(input.pumpCurveRaw);
  let mfrFlow: number | null = null;
  let sufficient: boolean | null = null;
  let curveWarning: string | null = curveParseError ?? null;
  if (!curveParseError && points.length > 0) {
    const interp = interpolateFuelPumpPerformance(points, outlet);
    mfrFlow = interp.flow;
    curveWarning = interp.warning;
    if (mfrFlow != null) {
      sufficient = mfrFlow >= target;
    }
  }

  const steps: string[] = [];
  steps.push(`HP = ${fmt(hp)} hp`);
  steps.push(`BSFC = ${fmt(bsfc, 3)} lb/(hp·hr)`);
  steps.push(
    `Fuel mass flow = HP × BSFC = ${fmt(hp)} × ${fmt(bsfc, 3)} = ${fmt(massLb)} lb/hr (${fmt(massKg)} kg/hr)`,
  );
  steps.push(`Density ρ = ${fmt(density, 3)} kg/L`);
  steps.push(
    `Q = (HP × BSFC × 0.45359237) / ρ = ${fmt(volL)} L/hr`,
  );
  if (margin > 0) {
    steps.push(
      `Target with ${fmt(margin, 2)}% margin = ${fmt(target)} L/hr`,
    );
  }
  steps.push(
    `Pressure mode: ${input.pressureControlMode} · base ${fmt(baseBar)} bar · boost ${fmt(boostBar)} bar`,
  );
  steps.push(`Rail gauge pressure = ${fmt(rail)} bar`);
  steps.push(
    `Estimated pump outlet = rail + loss = ${fmt(rail)} + ${fmt(lossBar)} = ${fmt(outlet)} bar`,
  );
  if (diff != null) {
    steps.push(
      `Injector ΔP (fixed rail) ≈ rail − manifold = ${fmt(diff)} bar`,
    );
  }
  if (mfrFlow != null) {
    steps.push(
      `Curve delivery @ outlet ≈ ${fmt(mfrFlow)} L/hr (${sufficient ? '≥' : '<'} target)`,
    );
  }

  return {
    horsepower: hp,
    bsfcUsed: bsfc,
    densityUsed: density,
    fuelMassFlowLbPerHour: massLb,
    fuelMassFlowKgPerHour: massKg,
    requiredFuelFlowLitersPerHour: volL,
    targetPumpFlowLitersPerHour: target,
    formattedFlow: `${fmt(displayFlow)} ${input.resultFlowUnit}`,
    fuelRailPressureBar: rail,
    injectorDifferentialPressureBar: diff,
    estimatedPumpOutletPressureBar: outlet,
    formattedRailPressure: `${fmt(displayRail)} ${input.resultPressureUnit}`,
    formattedOutletPressure: `${fmt(displayOutlet)} ${input.resultPressureUnit}`,
    manufacturerPumpFlowAtPressure: mfrFlow,
    pumpCapacitySufficient: sufficient,
    pumpCurveWarning: curveWarning,
    formulaSteps: steps,
    interpretation:
      'Estimated engine fuel demand from HP × BSFC and density. Pump delivery falls with pressure — compare against manufacturer pressure–flow data, not free-flow ratings alone. Rail pressure ≠ pump outlet when line losses exist.',
  };
}
