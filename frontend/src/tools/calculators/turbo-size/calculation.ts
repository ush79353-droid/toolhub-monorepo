/**
 * Turbo Size Calculator — pure sizing heuristics + optional advanced airflow.
 * Corrected flow uses SAE-style references: T_ref = 545 R (302.78 K), P_ref = 28.4 inHg abs ≈ 96.23 kPa.
 */

import type {
  CapacityUnit,
  PowerUnit,
  PressureUnit,
  TemperatureUnit,
  TurboSizeResult,
} from './types';

export const CC_PER_L = 1000;
export const CC_PER_CU_IN = 16.387064;
export const KW_PER_HP = 0.745699872;
export const KW_PER_PS = 0.73549875;
export const KG_PER_LB = 0.45359237;
export const R_DRY_AIR = 287.05; // J/(kg·K)
export const T_REF_K = 302.78; // ≈ 545 R
export const P_REF_PA = 96227; // ≈ 28.4 inHg abs

export function convertCapacityToLiters(
  value: number,
  unit: CapacityUnit,
): number {
  if (unit === 'L') return value;
  if (unit === 'cc') return value / CC_PER_L;
  return (value * CC_PER_CU_IN) / CC_PER_L;
}

export function convertCapacity(
  value: number,
  from: CapacityUnit,
  to: CapacityUnit,
): number {
  const liters = convertCapacityToLiters(value, from);
  if (to === 'L') return liters;
  if (to === 'cc') return liters * CC_PER_L;
  return (liters * CC_PER_L) / CC_PER_CU_IN;
}

export function convertPowerToHorsepower(
  value: number,
  unit: PowerUnit,
): number {
  if (unit === 'hp') return value;
  if (unit === 'kW') return value / KW_PER_HP;
  return (value * KW_PER_PS) / KW_PER_HP; // PS → kW → hp
}

export function convertPower(
  value: number,
  from: PowerUnit,
  to: PowerUnit,
): number {
  const hp = convertPowerToHorsepower(value, from);
  if (to === 'hp') return hp;
  if (to === 'kW') return hp * KW_PER_HP;
  return (hp * KW_PER_HP) / KW_PER_PS;
}

export function convertAirflowLbMinToKgMin(lbMin: number): number {
  return lbMin * KG_PER_LB;
}

export function convertAirflowKgSToLbMin(kgS: number): number {
  return (kgS * 60) / KG_PER_LB;
}

export function convertPressureToPascals(
  value: number,
  unit: PressureUnit,
): number {
  if (unit === 'kPa') return value * 1000;
  if (unit === 'bar') return value * 100000;
  return value * 6894.757293; // psi
}

export function convertPressureFromPascals(
  pa: number,
  unit: PressureUnit,
): number {
  if (unit === 'kPa') return pa / 1000;
  if (unit === 'bar') return pa / 100000;
  return pa / 6894.757293;
}

export function convertPressure(
  value: number,
  from: PressureUnit,
  to: PressureUnit,
): number {
  return convertPressureFromPascals(convertPressureToPascals(value, from), to);
}

export function convertTemperatureToKelvin(
  value: number,
  unit: TemperatureUnit,
): number {
  if (unit === 'K') return value;
  if (unit === 'C') return value + 273.15;
  return ((value - 32) * 5) / 9 + 273.15;
}

export function convertTemperatureFromKelvin(
  k: number,
  unit: TemperatureUnit,
): number {
  if (unit === 'K') return k;
  if (unit === 'C') return k - 273.15;
  return ((k - 273.15) * 9) / 5 + 32;
}

export function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number {
  return convertTemperatureFromKelvin(
    convertTemperatureToKelvin(value, from),
    to,
  );
}

export function calculateRequiredTurboAirflow(
  horsepower: number,
  hpPerLbMin: number,
): number {
  return horsepower / hpPerLbMin;
}

export function calculateHorsepowerPerLiter(
  horsepower: number,
  liters: number,
): number {
  return horsepower / liters;
}

/** Four-stroke: V̇ = Vd × RPM × VE / 120  (m³/s when Vd in m³) */
export function calculateEngineVolumetricAirflow(
  displacementM3: number,
  rpm: number,
  veDecimal: number,
): number {
  return (displacementM3 * rpm * veDecimal) / 120;
}

export function calculateIntakeAirDensity(
  pressurePa: number,
  temperatureK: number,
): number {
  return pressurePa / (R_DRY_AIR * temperatureK);
}

export function calculateEngineMassAirflow(
  densityKgM3: number,
  volumetricM3S: number,
): number {
  return densityKgM3 * volumetricM3S;
}

export function calculateCompressorPressureRatio(
  poutAbsPa: number,
  pinAbsPa: number,
): number {
  return poutAbsPa / pinAbsPa;
}

/**
 * Corrected mass flow (lb/min) using inlet conditions vs documented refs.
 * ṁ_corr = ṁ_actual × √(T_in/T_ref) / (P_in/P_ref)
 */
export function calculateCorrectedAirflow(
  actualKgS: number,
  tinK: number,
  pinPa: number,
): number {
  const actualLbMin = convertAirflowKgSToLbMin(actualKgS);
  return (
    (actualLbMin * Math.sqrt(tinK / T_REF_K)) / (pinPa / P_REF_PA)
  );
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return String(Number(n.toFixed(digits)));
}

export interface SimpleParams {
  capacity: number;
  capacityUnit: CapacityUnit;
  power: number;
  powerUnit: PowerUnit;
  hpPerLbMin: number;
}

export interface AdvancedParams {
  rpm: number;
  vePercent: number;
  intakeManifoldPressure: number;
  intakePressureUnit: PressureUnit;
  compressorInletPressure: number;
  inletPressureUnit: PressureUnit;
  intakeTemperature: number;
  intakeTempUnit: TemperatureUnit;
  compressorInletTemperature: number;
  inletTempUnit: TemperatureUnit;
  compressorEfficiencyPercent: number;
}

export function computeTurboSize(
  simple: SimpleParams,
  advanced: AdvancedParams | null,
): TurboSizeResult {
  const liters = convertCapacityToLiters(simple.capacity, simple.capacityUnit);
  const hp = convertPowerToHorsepower(simple.power, simple.powerUnit);
  const requiredLbMin = calculateRequiredTurboAirflow(hp, simple.hpPerLbMin);
  const requiredKgMin = convertAirflowLbMinToKgMin(requiredLbMin);
  const hpPerL = calculateHorsepowerPerLiter(hp, liters);

  let volumetricAirflowM3PerS: number | null = null;
  let actualAirflowKgPerS: number | null = null;
  let actualAirflowLbMin: number | null = null;
  let compressorPressureRatio: number | null = null;
  let correctedAirflowLbMin: number | null = null;
  let estimatedHpFromAdvancedAirflow: number | null = null;

  const steps = [
    `ṁ_est ≈ HP / C = ${fmt(hp, 2)} / ${fmt(simple.hpPerLbMin, 2)} = ${fmt(requiredLbMin, 2)} lb/min (heuristic)`,
    `ṁ_est = ${fmt(requiredKgMin, 2)} kg/min`,
    `V = ${fmt(liters, 3)} L · P_d = ${fmt(hpPerL, 2)} hp/L`,
  ];

  if (advanced) {
    const vdM3 = liters / 1000;
    const ve = advanced.vePercent / 100;
    volumetricAirflowM3PerS = calculateEngineVolumetricAirflow(
      vdM3,
      advanced.rpm,
      ve,
    );
    const pMan = convertPressureToPascals(
      advanced.intakeManifoldPressure,
      advanced.intakePressureUnit,
    );
    const pIn = convertPressureToPascals(
      advanced.compressorInletPressure,
      advanced.inletPressureUnit,
    );
    const tMan = convertTemperatureToKelvin(
      advanced.intakeTemperature,
      advanced.intakeTempUnit,
    );
    const tIn = convertTemperatureToKelvin(
      advanced.compressorInletTemperature,
      advanced.inletTempUnit,
    );
    const rho = calculateIntakeAirDensity(pMan, tMan);
    actualAirflowKgPerS = calculateEngineMassAirflow(
      rho,
      volumetricAirflowM3PerS,
    );
    actualAirflowLbMin = convertAirflowKgSToLbMin(actualAirflowKgPerS);
    compressorPressureRatio = calculateCompressorPressureRatio(pMan, pIn);
    correctedAirflowLbMin = calculateCorrectedAirflow(
      actualAirflowKgPerS,
      tIn,
      pIn,
    );
    estimatedHpFromAdvancedAirflow =
      actualAirflowLbMin * simple.hpPerLbMin;

    steps.push(
      `V̇ = Vd×RPM×VE/120 = ${fmt(volumetricAirflowM3PerS, 4)} m³/s`,
      `ρ = P/(RT) @ manifold ≈ ${fmt(rho, 3)} kg/m³`,
      `ṁ_act = ρV̇ ≈ ${fmt(actualAirflowKgPerS, 4)} kg/s (${fmt(actualAirflowLbMin, 2)} lb/min)`,
      `PR ≈ P_man/P_in = ${fmt(compressorPressureRatio, 3)} (no intercooler loss model)`,
      `ṁ_corr ≈ ${fmt(correctedAirflowLbMin, 2)} lb/min (T_ref=${T_REF_K} K, P_ref≈${fmt(P_REF_PA / 1000, 2)} kPa)`,
      `η_c entered ${fmt(advanced.compressorEfficiencyPercent, 1)}% (shown for context; not applied to ṁ)`,
    );
  }

  return {
    engineCapacityLiters: liters,
    desiredHorsepower: hp,
    horsepowerPerLbMin: simple.hpPerLbMin,
    requiredAirflowLbMin: requiredLbMin,
    requiredAirflowKgMin: requiredKgMin,
    horsepowerPerLiter: hpPerL,
    volumetricAirflowM3PerS,
    actualAirflowKgPerS,
    actualAirflowLbMin,
    compressorPressureRatio,
    correctedAirflowLbMin,
    estimatedHpFromAdvancedAirflow,
    formulaSteps: steps,
    interpretation: `Estimated compressor airflow ≈ ${fmt(requiredLbMin, 2)} lb/min using ${fmt(simple.hpPerLbMin, 1)} hp per lb/min. This is a sizing heuristic — not a turbo model recommendation. Compare operating points on manufacturer compressor maps.`,
    requiredAirflowDisplay: `${fmt(requiredLbMin, 2)} lb/min`,
    powerDensityDisplay: `${fmt(hpPerL, 2)} hp/L`,
  };
}
