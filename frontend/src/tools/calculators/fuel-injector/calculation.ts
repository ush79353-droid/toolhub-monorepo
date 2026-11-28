/**
 * Fuel injector sizing — canonical: mechanical hp, lb/(hp·hr), lb/hr, bar.
 */

import type {
  FuelInjectorInput,
  FuelInjectorResult,
  InjectorFlowUnit,
  PowerUnit,
  PressureUnit,
} from './types';

export const WATTS_PER_HP = 745.699871582;
export const WATTS_PER_PS = 735.49875;
export const G_PER_LB = 453.59237;
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

export function calculateTotalFuelMassFlow(
  hp: number,
  bsfc: number,
): number | null {
  if (!(hp > 0) || !(bsfc > 0)) return null;
  return hp * bsfc;
}

export function calculateInjectorFlowRate(
  hp: number,
  bsfc: number,
  injectorCount: number,
  dutyCycleDecimal: number,
): number | null {
  if (!(hp > 0) || !(bsfc > 0)) return null;
  if (!(injectorCount > 0) || !Number.isInteger(injectorCount)) return null;
  if (!(dutyCycleDecimal > 0) || dutyCycleDecimal > 1) return null;
  return (hp * bsfc) / (injectorCount * dutyCycleDecimal);
}

export function calculatePressureAdjustedFlow(
  q1: number,
  deltaP1: number,
  deltaP2: number,
): number | null {
  if (!(q1 >= 0) || !(deltaP1 > 0) || !(deltaP2 > 0)) return null;
  if (deltaP1 === deltaP2) return q1;
  return q1 * Math.sqrt(deltaP2 / deltaP1);
}

export function calculateRequiredDutyCycle(
  hp: number,
  bsfc: number,
  injectorCount: number,
  injectorFlowLbPerHour: number,
): number | null {
  if (!(hp > 0) || !(bsfc > 0)) return null;
  if (!(injectorCount > 0) || !(injectorFlowLbPerHour > 0)) return null;
  return (hp * bsfc) / (injectorCount * injectorFlowLbPerHour);
}

/** Convert mass flow in lb/hr to other units; volume needs density g/mL. */
export function fromLbPerHour(
  lbPerHour: number,
  unit: InjectorFlowUnit,
  densityGPerMl: number | null,
): number | null {
  if (!(lbPerHour >= 0)) return null;
  if (unit === 'lb/hr') return lbPerHour;
  if (unit === 'g/min') return (lbPerHour * G_PER_LB) / 60;
  if (unit === 'kg/hr') return (lbPerHour * G_PER_LB) / 1000;
  if (densityGPerMl == null || !(densityGPerMl > 0)) return null;
  const gPerMin = (lbPerHour * G_PER_LB) / 60;
  const mlPerMin = gPerMin / densityGPerMl;
  if (unit === 'cc/min' || unit === 'mL/min') return mlPerMin;
  return null;
}

export function toLbPerHour(
  value: number,
  unit: InjectorFlowUnit,
  densityGPerMl: number | null,
): number | null {
  if (!(value >= 0)) return null;
  if (unit === 'lb/hr') return value;
  if (unit === 'g/min') return (value * 60) / G_PER_LB;
  if (unit === 'kg/hr') return (value * 1000) / G_PER_LB;
  if (densityGPerMl == null || !(densityGPerMl > 0)) return null;
  if (unit === 'cc/min' || unit === 'mL/min') {
    const gPerMin = value * densityGPerMl;
    return (gPerMin * 60) / G_PER_LB;
  }
  return null;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateFuelInjectorFromInput(
  input: FuelInjectorInput,
): FuelInjectorResult | null {
  const engineRaw = parseNum(input.engineHorsepower);
  const targetRaw = parseNum(input.targetHorsepower);

  let hp: number;
  let source: 'engine' | 'target';
  if (targetRaw != null && targetRaw > 0) {
    hp = toHp(targetRaw, input.horsepowerUnit);
    source = 'target';
  } else if (engineRaw != null && engineRaw > 0) {
    hp = toHp(engineRaw, input.horsepowerUnit);
    source = 'engine';
  } else {
    return null;
  }

  const bsfc = parseNum(input.bsfc);
  if (bsfc == null || !(bsfc > 0)) return null;

  const injectors = parseNum(input.numberOfInjectors);
  if (
    injectors == null ||
    !(injectors > 0) ||
    !Number.isInteger(injectors)
  ) {
    return null;
  }

  const dutyPct = parseNum(input.maxDutyCycle);
  if (dutyPct == null || !(dutyPct > 0) || dutyPct > 100) return null;
  const dc = dutyPct / 100;

  const density = parseNum(input.fuelDensity);
  if (density == null || !(density > 0)) return null;

  const total = calculateTotalFuelMassFlow(hp, bsfc);
  if (total == null) return null;

  const ifr = calculateInjectorFlowRate(hp, bsfc, injectors, dc);
  if (ifr == null) return null;

  const refP = parseNum(input.referenceDifferentialPressure);
  const actP = parseNum(input.actualDifferentialPressure);
  let adjusted: number | null = null;
  if (refP != null && actP != null && refP > 0 && actP > 0) {
    const refBar = toBar(refP, input.pressureUnit);
    const actBar = toBar(actP, input.pressureUnit);
    adjusted = calculatePressureAdjustedFlow(ifr, refBar, actBar);
  }

  const flowForDisplay = adjusted ?? ifr;
  const displayVal = fromLbPerHour(
    flowForDisplay,
    input.resultFlowUnit,
    density,
  );
  if (displayVal == null) return null;

  const ccPerMin = fromLbPerHour(flowForDisplay, 'cc/min', density);

  let existingDc: number | null = null;
  let existingExceeds: boolean | null = null;
  const existRaw = parseNum(input.existingInjectorFlow);
  if (existRaw != null && existRaw > 0) {
    const existLb = toLbPerHour(
      existRaw,
      input.existingInjectorFlowUnit,
      density,
    );
    if (existLb != null && existLb > 0) {
      const req = calculateRequiredDutyCycle(hp, bsfc, injectors, existLb);
      if (req != null) {
        existingDc = req * 100;
        existingExceeds = existingDc > dutyPct;
      }
    }
  }

  const steps: string[] = [];
  steps.push(
    `HP used = ${fmt(hp)} hp (${source === 'target' ? 'target crankshaft' : 'engine'})`,
  );
  steps.push(`BSFC = ${fmt(bsfc, 3)} lb/(hp·hr) (estimate or override)`);
  steps.push(
    `Total fuel mass flow = HP × BSFC = ${fmt(hp)} × ${fmt(bsfc, 3)} = ${fmt(total)} lb/hr`,
  );
  steps.push(`Injectors N = ${injectors}`);
  steps.push(`Duty cycle DC = ${fmt(dutyPct, 2)}% = ${fmt(dc, 4)}`);
  steps.push(
    `IFR = (HP × BSFC) / (N × DC) = ${fmt(total)} / (${injectors} × ${fmt(dc, 4)}) = ${fmt(ifr)} lb/hr`,
  );
  if (adjusted != null && Math.abs(adjusted - ifr) > 1e-12) {
    steps.push(
      `Pressure adjust Q₂ = Q₁ √(ΔP₂/ΔP₁) → ${fmt(adjusted)} lb/hr`,
    );
  }
  if (ccPerMin != null) {
    steps.push(
      `≈ ${fmt(ccPerMin)} cc/min at density ${fmt(density, 3)} g/mL (approx.)`,
    );
  }
  if (existingDc != null) {
    steps.push(
      `Existing injector → required DC ≈ ${fmt(existingDc, 2)}%${existingExceeds ? ' (above max)' : ''}`,
    );
  }

  return {
    horsepowerUsed: hp,
    horsepowerSource: source,
    bsfcUsed: bsfc,
    injectorCount: injectors,
    dutyCycleDecimal: dc,
    totalFuelMassFlowLbPerHour: total,
    requiredFlowLbPerHour: ifr,
    requiredFlowDisplay: `${fmt(displayVal)} ${input.resultFlowUnit}`,
    requiredFlowCcPerMinute: ccPerMin,
    densityUsed: density,
    pressureAdjustedFlowLbPerHour: adjusted,
    existingInjectorRequiredDutyCyclePercent: existingDc,
    existingExceedsMax: existingExceeds,
    formulaSteps: steps,
    interpretation:
      'Estimated injector mass-flow requirement for planning. BSFC and density are assumptions; real injectors, rail pressure, and differential pressure across the nozzle may differ. Not a substitute for manufacturer data or dyno calibration.',
  };
}
