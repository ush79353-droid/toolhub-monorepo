/**
 * BSFC engine — canonical internals:
 * power kW, BSFC g/(kW·h), LHV MJ/kg, mass flow kg/h.
 *
 * η_b(%) = 360000 / (BSFC_g_per_kWh × LHV_MJ_per_kg)
 */

import {
  FUEL_DENSITY_KG_PER_L,
  FUEL_LHV_MJ_PER_KG,
  type BSFCInput,
  type BSFCResult,
  type BSFCUnit,
  type DensityUnit,
  type EfficiencyChartPoint,
  type FuelConsumptionChartPoint,
  type FuelType,
  type LHVUnit,
  type MassFlowUnit,
  type PowerUnit,
} from './types';

export const HP_TO_W = 745.699872;
export const PS_TO_W = 735.49875;
export const BTU_PER_LB_TO_J_PER_KG = 2326; // ≈ 1 BTU/lb

function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertPower(
  value: number,
  from: PowerUnit,
  to: PowerUnit,
): number {
  const toW: Record<PowerUnit, number> = {
    W: 1,
    kW: 1000,
    MW: 1_000_000,
    hp: HP_TO_W,
    PS: PS_TO_W,
  };
  return (value * toW[from]) / toW[to];
}

export function toKW(value: number, unit: PowerUnit): number {
  return convertPower(value, unit, 'kW');
}

export function fromKW(kW: number, unit: PowerUnit): number {
  return convertPower(kW, 'kW', unit);
}

/** Convert BSFC to canonical g/(kW·h). */
export function convertBSFC(
  value: number,
  from: BSFCUnit,
  to: BSFCUnit,
): number {
  const toGPerKWh: Record<BSFCUnit, number> = {
    'g/kWh': 1,
    'kg/kWh': 1000,
    // 1 g/kWh ≈ 0.001644 lb/(hp·h) ⇒ 1 lb/(hp·h) ≈ 608.277 g/kWh
    'lb/hph': 1 / 0.001644,
    // 1 g/(hp·h) = 1 / 0.745699872 g/kWh ≈ 1.34102 g/kWh
    'g/hph': 1 / 0.745699872,
    // 1 kg/J = 3.6e12 g/kWh  (1 kWh = 3.6e6 J; 1 kg = 1000 g)
    'kg/J': 3.6e12,
    // 1 kg/MJ = 3.6e6 g/kWh
    'kg/MJ': 3.6e6,
  };
  const gPerKWh = value * toGPerKWh[from];
  return gPerKWh / toGPerKWh[to];
}

export function toGPerKWh(value: number, unit: BSFCUnit): number {
  return convertBSFC(value, unit, 'g/kWh');
}

export function fromGPerKWh(gPerKWh: number, unit: BSFCUnit): number {
  return convertBSFC(gPerKWh, 'g/kWh', unit);
}

export function convertFuelHeatingValue(
  value: number,
  from: LHVUnit,
  to: LHVUnit,
): number {
  const toJPerKg: Record<LHVUnit, number> = {
    'J/kg': 1,
    'kJ/kg': 1000,
    'MJ/kg': 1_000_000,
    'BTU/lb': BTU_PER_LB_TO_J_PER_KG,
  };
  return (value * toJPerKg[from]) / toJPerKg[to];
}

export function toMJPerKg(value: number, unit: LHVUnit): number {
  return convertFuelHeatingValue(value, unit, 'MJ/kg');
}

export function convertFuelDensity(
  value: number,
  from: DensityUnit,
  to: DensityUnit,
): number {
  const toKgPerL: Record<DensityUnit, number> = {
    'kg/L': 1,
    'g/mL': 1, // 1 g/mL = 1 kg/L
    'lb/gal': 0.119826427, // US gal
  };
  return (value * toKgPerL[from]) / toKgPerL[to];
}

export function toKgPerL(value: number, unit: DensityUnit): number {
  return convertFuelDensity(value, unit, 'kg/L');
}

export function convertFuelFlow(
  value: number,
  from: MassFlowUnit,
  to: MassFlowUnit,
): number {
  const toKgPerH: Record<MassFlowUnit, number> = {
    'kg/h': 1,
    'g/h': 0.001,
    'kg/s': 3600,
    'g/s': 3.6,
    'g/min': 0.06,
    'lb/h': 0.45359237,
  };
  return (value * toKgPerH[from]) / toKgPerH[to];
}

export function toKgPerHour(value: number, unit: MassFlowUnit): number {
  return convertFuelFlow(value, unit, 'kg/h');
}

export function fromKgPerHour(kgPerH: number, unit: MassFlowUnit): number {
  return convertFuelFlow(kgPerH, 'kg/h', unit);
}

export function resolveFuelLHV(
  fuelType: FuelType,
  customLHV: number | null,
  lhvUnit: LHVUnit,
): number | null {
  if (fuelType === 'custom') {
    if (customLHV == null || !(customLHV > 0)) return null;
    return toMJPerKg(customLHV, lhvUnit);
  }
  return FUEL_LHV_MJ_PER_KG[fuelType];
}

export function resolveFuelDensity(
  fuelType: FuelType,
  customDensity: number | null,
  densityUnit: DensityUnit,
  enableVolume: boolean,
): number | null {
  if (!enableVolume) return null;
  if (fuelType === 'custom') {
    if (customDensity == null || !(customDensity > 0)) return null;
    return toKgPerL(customDensity, densityUnit);
  }
  if (customDensity != null && customDensity > 0) {
    return toKgPerL(customDensity, densityUnit);
  }
  return FUEL_DENSITY_KG_PER_L[fuelType] ?? null;
}

/** η_b(%) from BSFC g/(kW·h) and LHV MJ/kg. */
export function calculateBrakeThermalEfficiency(
  bsfcGPerKWh: number,
  lhvMJPerKg: number,
): number | null {
  if (
    ![bsfcGPerKWh, lhvMJPerKg].every(Number.isFinite) ||
    !(bsfcGPerKWh > 0) ||
    !(lhvMJPerKg > 0)
  ) {
    return null;
  }
  return 360_000 / (bsfcGPerKWh * lhvMJPerKg);
}

/** BSFC g/(kW·h) from η_b(%) and LHV MJ/kg. */
export function calculateBSFC(
  efficiencyPercent: number,
  lhvMJPerKg: number,
): number | null {
  if (
    ![efficiencyPercent, lhvMJPerKg].every(Number.isFinite) ||
    !(efficiencyPercent > 0) ||
    !(lhvMJPerKg > 0)
  ) {
    return null;
  }
  return 360_000 / (efficiencyPercent * lhvMJPerKg);
}

/** Fuel mass flow kg/h from BSFC g/(kW·h) and power kW. */
export function calculateFuelConsumptionRate(
  bsfcGPerKWh: number,
  powerKW: number,
): number | null {
  if (
    ![bsfcGPerKWh, powerKW].every(Number.isFinite) ||
    !(bsfcGPerKWh >= 0) ||
    !(powerKW >= 0)
  ) {
    return null;
  }
  return (bsfcGPerKWh * powerKW) / 1000;
}

/** Required brake power kW from mass flow kg/h and BSFC g/(kW·h). */
export function calculateRequiredBrakePower(
  fuelKgPerHour: number,
  bsfcGPerKWh: number,
): number | null {
  if (
    ![fuelKgPerHour, bsfcGPerKWh].every(Number.isFinite) ||
    !(fuelKgPerHour >= 0) ||
    !(bsfcGPerKWh > 0)
  ) {
    return null;
  }
  return (fuelKgPerHour * 1000) / bsfcGPerKWh;
}

export function calculateFuelEnergyInput(
  fuelKgPerHour: number,
  lhvMJPerKg: number,
): number | null {
  if (
    ![fuelKgPerHour, lhvMJPerKg].every(Number.isFinite) ||
    !(fuelKgPerHour >= 0) ||
    !(lhvMJPerKg > 0)
  ) {
    return null;
  }
  return fuelKgPerHour * lhvMJPerKg;
}

/** Useful energy output MJ/h from power kW (1 kW = 3.6 MJ/h). */
export function calculateUsefulEnergyOutput(powerKW: number): number | null {
  if (!Number.isFinite(powerKW) || powerKW < 0) return null;
  return powerKW * 3.6;
}

export function calculateVolumetricFuelConsumption(
  fuelKgPerHour: number,
  densityKgPerL: number,
): number | null {
  if (
    ![fuelKgPerHour, densityKgPerL].every(Number.isFinite) ||
    !(fuelKgPerHour >= 0) ||
    !(densityKgPerL > 0)
  ) {
    return null;
  }
  return fuelKgPerHour / densityKgPerL;
}

export function generateEfficiencyChartData(
  lhvMJPerKg: number,
  levels: readonly number[] = [150, 200, 250, 300, 350, 400, 450, 500],
): EfficiencyChartPoint[] {
  if (!(lhvMJPerKg > 0)) return [];
  return levels.map((bsfcGPerKWh) => ({
    bsfcGPerKWh,
    efficiencyPercent:
      calculateBrakeThermalEfficiency(bsfcGPerKWh, lhvMJPerKg) ?? 0,
  }));
}

export function generateFuelConsumptionChartData(
  bsfcGPerKWh: number,
  levels: readonly number[] = [25, 50, 75, 100, 125, 150, 175, 200],
): FuelConsumptionChartPoint[] {
  if (!(bsfcGPerKWh >= 0)) return [];
  return levels.map((powerKW) => ({
    powerKW,
    fuelKgPerHour:
      calculateFuelConsumptionRate(bsfcGPerKWh, powerKW) ?? 0,
  }));
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateBSFCFromInput(input: BSFCInput): BSFCResult | null {
  const customLHV = parseNum(input.customLHV);
  const lhv = resolveFuelLHV(input.fuelType, customLHV, input.lhvUnit);
  if (lhv == null || !(lhv > 0)) return null;

  const customDensity = parseNum(input.customDensity);
  const density = resolveFuelDensity(
    input.fuelType,
    customDensity,
    input.densityUnit,
    input.enableVolume,
  );

  let powerKW: number | null = null;
  let bsfcG: number | null = null;
  let efficiency: number | null = null;
  let fuelKgH: number | null = null;
  const steps: string[] = [];
  let primaryLabel = 'Brake Thermal Efficiency';
  let formattedPrimary = '';

  if (input.mode === 'efficiency') {
    const b = parseNum(input.bsfc);
    if (b == null || !(b > 0)) return null;
    bsfcG = toGPerKWh(b, input.bsfcUnit);
    if (!(bsfcG > 0)) return null;
    efficiency = calculateBrakeThermalEfficiency(bsfcG, lhv);
    if (efficiency == null) return null;

    const p = parseNum(input.power);
    if (p != null) {
      if (p < 0) return null;
      powerKW = toKW(p, input.powerUnit);
      fuelKgH = calculateFuelConsumptionRate(bsfcG, powerKW);
    }

    steps.push('Brake Efficiency = 360,000 / (BSFC × LHV)');
    steps.push(
      `Brake Efficiency = 360,000 / (${fmt(bsfcG)} × ${fmt(lhv)})`,
    );
    steps.push(`Brake Efficiency = ${fmt(efficiency)}%`);
    if (powerKW != null && fuelKgH != null) {
      steps.push('');
      steps.push(`Engine Power = ${fmt(powerKW)} kW`);
      steps.push('Fuel Consumption = BSFC × Power');
      steps.push(
        `Fuel Consumption = ${fmt(bsfcG)} × ${fmt(powerKW)} = ${fmt(bsfcG * powerKW)} g/h`,
      );
      steps.push(`Fuel Consumption = ${fmt(fuelKgH)} kg/h`);
    }
    formattedPrimary = `${fmt(efficiency)}%`;
  } else if (input.mode === 'bsfc') {
    const e = parseNum(input.efficiency);
    if (e == null || !(e > 0) || e > 100) return null;
    efficiency = e;
    bsfcG = calculateBSFC(efficiency, lhv);
    if (bsfcG == null) return null;

    const p = parseNum(input.power);
    if (p != null) {
      if (p < 0) return null;
      powerKW = toKW(p, input.powerUnit);
      fuelKgH = calculateFuelConsumptionRate(bsfcG, powerKW);
    }

    steps.push('BSFC = 360,000 / (η% × LHV)');
    steps.push(
      `BSFC = 360,000 / (${fmt(efficiency)} × ${fmt(lhv)})`,
    );
    steps.push(`BSFC = ${fmt(bsfcG)} g/(kW·h)`);
    primaryLabel = 'Brake Specific Fuel Consumption';
    formattedPrimary = `${fmt(fromGPerKWh(bsfcG, input.bsfcUnit))} ${input.bsfcUnit === 'g/kWh' ? 'g/(kW·h)' : input.bsfcUnit}`;
  } else if (input.mode === 'fuelConsumption') {
    const p = parseNum(input.power);
    const b = parseNum(input.bsfc);
    if (p == null || p < 0 || b == null || !(b > 0)) return null;
    powerKW = toKW(p, input.powerUnit);
    bsfcG = toGPerKWh(b, input.bsfcUnit);
    fuelKgH = calculateFuelConsumptionRate(bsfcG, powerKW);
    if (fuelKgH == null) return null;
    efficiency = calculateBrakeThermalEfficiency(bsfcG, lhv);

    steps.push('Fuel Consumption = BSFC × Power');
    steps.push(
      `Fuel Consumption = ${fmt(bsfcG)} × ${fmt(powerKW)} = ${fmt(bsfcG * powerKW)} g/h`,
    );
    steps.push(`Fuel Consumption = ${fmt(fuelKgH)} kg/h`);
    if (efficiency != null) {
      steps.push('');
      steps.push(
        `Brake Efficiency = 360,000 / (${fmt(bsfcG)} × ${fmt(lhv)}) = ${fmt(efficiency)}%`,
      );
    }
    primaryLabel = 'Fuel Consumption Rate';
    formattedPrimary = `${fmt(fuelKgH)} kg/h`;
  } else {
    // enginePower
    const m = parseNum(input.fuelMassFlow);
    const b = parseNum(input.bsfc);
    if (m == null || m < 0 || b == null || !(b > 0)) return null;
    fuelKgH = toKgPerHour(m, input.massFlowUnit);
    bsfcG = toGPerKWh(b, input.bsfcUnit);
    powerKW = calculateRequiredBrakePower(fuelKgH, bsfcG);
    if (powerKW == null) return null;
    efficiency = calculateBrakeThermalEfficiency(bsfcG, lhv);

    steps.push('Power = Fuel Mass Flow / BSFC');
    steps.push(
      `Power = ${fmt(fuelKgH)} kg/h / ${fmt(bsfcG)} g/(kW·h)`,
    );
    steps.push(`Power = ${fmt(powerKW)} kW`);
    primaryLabel = 'Required Engine Power';
    formattedPrimary = `${fmt(fromKW(powerKW, input.powerUnit))} ${input.powerUnit}`;
  }

  if (bsfcG == null || efficiency == null) return null;

  const energyIn =
    fuelKgH != null ? calculateFuelEnergyInput(fuelKgH, lhv) : null;
  const energyOut =
    powerKW != null ? calculateUsefulEnergyOutput(powerKW) : null;
  const volume =
    fuelKgH != null && density != null
      ? calculateVolumetricFuelConsumption(fuelKgH, density)
      : null;

  let efficiencyWarning: string | null = null;
  if (efficiency > 100) {
    efficiencyWarning =
      'Calculated efficiency exceeds 100% — check that BSFC and fuel heating value are consistent.';
  }

  if (energyIn != null && energyOut != null) {
    steps.push('');
    steps.push(`Fuel Energy Input = ${fmt(energyIn)} MJ/h`);
    steps.push(`Useful Energy Output = ${fmt(energyOut)} MJ/h`);
  }

  return {
    mode: input.mode,
    powerKW,
    bsfcGPerKWh: bsfcG,
    fuelType: input.fuelType,
    fuelLHV_MJPerKg: lhv,
    brakeThermalEfficiencyPercent: efficiency,
    fuelConsumptionKgPerHour: fuelKgH,
    fuelEnergyInputMJPerHour: energyIn,
    usefulEnergyOutputMJPerHour: energyOut,
    volumetricConsumptionLPerHour: volume,
    efficiencyWarning,
    formulaSteps: steps,
    efficiencyChart: generateEfficiencyChartData(lhv),
    fuelChart:
      bsfcG != null ? generateFuelConsumptionChartData(bsfcG) : [],
    interpretation:
      'Educational estimate using representative lower heating values. Real BSFC varies with load, speed, fuel composition, and measurement conditions.',
    formattedPrimary,
    primaryLabel,
  };
}

export { fmt };
