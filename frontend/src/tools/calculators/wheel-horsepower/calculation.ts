/**
 * Wheel Horsepower — pure drivetrain loss model.
 * WHP = HP × η; HP = WHP / η; η_total = Π η_i (series components).
 */

import type {
  DrivetrainType,
  PowerUnit,
  WheelHorsepowerResult,
} from './types';
import { DRIVETRAIN_PRESETS } from './types';

export const KW_PER_HP = 0.745699872;
export const KW_PER_PS = 0.73549875;

export function convertPowerToHorsepower(
  value: number,
  unit: PowerUnit,
): number {
  if (unit === 'hp') return value;
  if (unit === 'kW') return value / KW_PER_HP;
  return (value * KW_PER_PS) / KW_PER_HP;
}

export function convertHorsepowerToUnit(
  hp: number,
  unit: PowerUnit,
): number {
  if (unit === 'hp') return hp;
  if (unit === 'kW') return hp * KW_PER_HP;
  return (hp * KW_PER_HP) / KW_PER_PS;
}

export function convertPower(
  value: number,
  from: PowerUnit,
  to: PowerUnit,
): number {
  return convertHorsepowerToUnit(convertPowerToHorsepower(value, from), to);
}

export function calculateWheelHorsepower(
  engineHp: number,
  eta: number,
): number {
  return engineHp * eta;
}

export function calculateEngineHorsepower(
  wheelHp: number,
  eta: number,
): number {
  return wheelHp / eta;
}

export function calculateCombinedDrivetrainEfficiency(
  efficienciesDecimal: number[],
): number {
  return efficienciesDecimal.reduce((acc, e) => acc * e, 1);
}

export function calculateDrivetrainPowerLoss(
  engineHp: number,
  wheelHp: number,
): number {
  return engineHp - wheelHp;
}

export function calculateDrivetrainLossPercentage(eta: number): number {
  return 100 * (1 - eta);
}

export function calculateObservedDrivetrainEfficiency(
  wheelHp: number,
  engineHp: number,
): number {
  return wheelHp / engineHp;
}

export function getDrivetrainPreset(
  type: Exclude<DrivetrainType, 'CUSTOM'>,
): { efficiencyPercent: number; note: string } {
  return DRIVETRAIN_PRESETS[type];
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return String(Number(n.toFixed(digits)));
}

export function formatPower(hp: number, unit: PowerUnit): string {
  return `${fmt(convertHorsepowerToUnit(hp, unit), 2)} ${unit}`;
}

export interface ComputeParams {
  mode: 'engine-to-wheel' | 'wheel-to-engine' | 'measured-efficiency';
  efficiencyMode: 'overall' | 'components';
  enginePower: number | null;
  wheelPower: number | null;
  powerUnit: PowerUnit;
  overallEfficiencyPercent: number | null;
  gearboxPercent: number | null;
  propellerPercent: number | null;
  differentialPercent: number | null;
  driveshaftPercent: number | null;
  includePropellerShaft: boolean;
}

export function computeWheelHorsepower(
  p: ComputeParams,
): WheelHorsepowerResult {
  let eta: number;
  let efficiencySource: 'overall' | 'components' | 'measured';
  let gearboxEfficiencyPercent: number | null = null;
  let propellerShaftEfficiencyPercent: number | null = null;
  let differentialEfficiencyPercent: number | null = null;
  let driveshaftEfficiencyPercent: number | null = null;

  if (p.mode === 'measured-efficiency') {
    const eng = convertPowerToHorsepower(p.enginePower!, p.powerUnit);
    const whp = convertPowerToHorsepower(p.wheelPower!, p.powerUnit);
    eta = calculateObservedDrivetrainEfficiency(whp, eng);
    efficiencySource = 'measured';
    const loss = calculateDrivetrainPowerLoss(eng, whp);
    const lossPct = calculateDrivetrainLossPercentage(eta);
    return {
      engineHorsepowerHp: eng,
      wheelHorsepowerHp: whp,
      overallEfficiencyDecimal: eta,
      overallEfficiencyPercent: eta * 100,
      drivetrainLossHorsepower: loss,
      drivetrainLossPercent: lossPct,
      gearboxEfficiencyPercent: null,
      propellerShaftEfficiencyPercent: null,
      differentialEfficiencyPercent: null,
      driveshaftEfficiencyPercent: null,
      efficiencySource,
      whpExceedsEngine: whp > eng,
      formulaSteps: [
        `η_obs = WHP/HP = ${fmt(whp, 2)} / ${fmt(eng, 2)} = ${fmt(eta * 100, 2)}%`,
        `P_loss = ${fmt(loss, 2)} hp`,
      ],
      interpretation: whp > eng
        ? 'Entered wheel power exceeds engine power under this simplified loss model — check units or measurement conditions.'
        : `Observed drivetrain efficiency ≈ ${fmt(eta * 100, 2)}% from the entered HP and WHP pair.`,
      engineDisplay: formatPower(eng, p.powerUnit),
      wheelDisplay: formatPower(whp, p.powerUnit),
      lossDisplay: formatPower(loss, p.powerUnit),
    };
  }

  if (p.efficiencyMode === 'components') {
    const parts: number[] = [];
    gearboxEfficiencyPercent = p.gearboxPercent;
    parts.push(p.gearboxPercent! / 100);
    if (p.includePropellerShaft) {
      propellerShaftEfficiencyPercent = p.propellerPercent;
      parts.push(p.propellerPercent! / 100);
    }
    differentialEfficiencyPercent = p.differentialPercent;
    parts.push(p.differentialPercent! / 100);
    driveshaftEfficiencyPercent = p.driveshaftPercent;
    parts.push(p.driveshaftPercent! / 100);
    eta = calculateCombinedDrivetrainEfficiency(parts);
    efficiencySource = 'components';
  } else {
    eta = p.overallEfficiencyPercent! / 100;
    efficiencySource = 'overall';
  }

  let engHp: number;
  let whpHp: number;

  if (p.mode === 'engine-to-wheel') {
    engHp = convertPowerToHorsepower(p.enginePower!, p.powerUnit);
    whpHp = calculateWheelHorsepower(engHp, eta);
  } else {
    whpHp = convertPowerToHorsepower(p.wheelPower!, p.powerUnit);
    engHp = calculateEngineHorsepower(whpHp, eta);
  }

  const loss = calculateDrivetrainPowerLoss(engHp, whpHp);
  const lossPct = calculateDrivetrainLossPercentage(eta);

  const steps = [
    efficiencySource === 'components'
      ? `η = Π η_i = ${fmt(eta * 100, 4)}%`
      : `η = ${fmt(eta * 100, 2)}%`,
    p.mode === 'engine-to-wheel'
      ? `WHP = HP × η = ${fmt(engHp, 2)} × ${fmt(eta, 4)} = ${fmt(whpHp, 2)} hp`
      : `HP = WHP / η = ${fmt(whpHp, 2)} / ${fmt(eta, 4)} = ${fmt(engHp, 2)} hp`,
    `P_loss = ${fmt(loss, 2)} hp · Loss% = ${fmt(lossPct, 2)}%`,
  ];

  return {
    engineHorsepowerHp: engHp,
    wheelHorsepowerHp: whpHp,
    overallEfficiencyDecimal: eta,
    overallEfficiencyPercent: eta * 100,
    drivetrainLossHorsepower: loss,
    drivetrainLossPercent: lossPct,
    gearboxEfficiencyPercent,
    propellerShaftEfficiencyPercent,
    differentialEfficiencyPercent,
    driveshaftEfficiencyPercent,
    efficiencySource,
    whpExceedsEngine: false,
    formulaSteps: steps,
    interpretation: `Estimated ${formatPower(whpHp, p.powerUnit)} at the wheels from ${formatPower(engHp, p.powerUnit)} crank with ${fmt(eta * 100, 2)}% drivetrain efficiency (${efficiencySource}). Presets are illustrative — not dyno measurements.`,
    engineDisplay: formatPower(engHp, p.powerUnit),
    wheelDisplay: formatPower(whpHp, p.powerUnit),
    lossDisplay: formatPower(loss, p.powerUnit),
  };
}
