import { formatAngle } from '../coordinates/calculation';
import {
  ENERGY_UNIT_DEFS,
  J_PER_BTU_IT,
  J_PER_ENERGY,
  J_PER_KWH,
  M3_PER_FT3,
  M3_PER_VOLUME,
  VOLUME_UNIT_DEFS,
  type EnergyUnit,
  type HeatingUnit,
  type VolumeUnit,
} from './types';

export function formatAmount(value: number): string {
  return formatAngle(value, 12);
}

export function volumeToM3(value: number, unit: VolumeUnit): number {
  return value * M3_PER_VOLUME[unit];
}

export function m3ToVolume(m3: number, unit: VolumeUnit): number {
  return m3 / M3_PER_VOLUME[unit];
}

export function energyToJoules(value: number, unit: EnergyUnit): number {
  return value * J_PER_ENERGY[unit];
}

export function joulesToEnergy(joules: number, unit: EnergyUnit): number {
  return joules / J_PER_ENERGY[unit];
}

export function volumeToFt3(value: number, unit: VolumeUnit): number {
  return volumeToM3(value, unit) / M3_PER_FT3;
}

export function ft3ToVolume(ft3: number, unit: VolumeUnit): number {
  return m3ToVolume(ft3 * M3_PER_FT3, unit);
}

/** Convert heating value into BTU_IT per cubic foot. */
export function toBtuPerFt3(value: number, unit: HeatingUnit): number {
  if (unit === 'btu_ft3') return value;
  const jPerM3 = unit === 'mj_m3' ? value * 1_000_000 : value * J_PER_KWH;
  return (jPerM3 * M3_PER_FT3) / J_PER_BTU_IT;
}

export function fromBtuPerFt3(btuPerFt3: number, unit: HeatingUnit): number {
  if (unit === 'btu_ft3') return btuPerFt3;
  const jPerM3 = (btuPerFt3 * J_PER_BTU_IT) / M3_PER_FT3;
  return unit === 'mj_m3' ? jPerM3 / 1_000_000 : jPerM3 / J_PER_KWH;
}

/** Volume → energy using heating value in BTU/ft³. */
export function volumeToEnergy(
  volume: number,
  volumeUnit: VolumeUnit,
  energyUnit: EnergyUnit,
  heatingBtuPerFt3: number,
): number {
  const ft3 = volumeToFt3(volume, volumeUnit);
  const btu = ft3 * heatingBtuPerFt3;
  return joulesToEnergy(btu * J_PER_BTU_IT, energyUnit);
}

/** Energy → volume using heating value in BTU/ft³. */
export function energyToVolume(
  energy: number,
  energyUnit: EnergyUnit,
  volumeUnit: VolumeUnit,
  heatingBtuPerFt3: number,
): number {
  const btu = energyToJoules(energy, energyUnit) / J_PER_BTU_IT;
  const ft3 = btu / heatingBtuPerFt3;
  return ft3ToVolume(ft3, volumeUnit);
}

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
  if (from === to) return value;
  return m3ToVolume(volumeToM3(value, from), to);
}

export function convertEnergy(value: number, from: EnergyUnit, to: EnergyUnit): number {
  if (from === to) return value;
  return joulesToEnergy(energyToJoules(value, from), to);
}

export function shareResultText(input: {
  volume: string;
  volumeUnit: VolumeUnit;
  energy: string;
  energyUnit: EnergyUnit;
  heating: string;
  heatingUnit: HeatingUnit;
  equivalentMmbtu: string;
}): string {
  return [
    'Natural Gas Converter',
    'Omega Calculators',
    '',
    'Volume:',
    `${input.volume} ${VOLUME_UNIT_DEFS[input.volumeUnit].symbol}`,
    '',
    'Heating Value:',
    `${input.heating} ${input.heatingUnit === 'btu_ft3' ? 'BTU/ft³' : input.heatingUnit === 'mj_m3' ? 'MJ/m³' : 'kWh/m³'}`,
    '',
    'Energy:',
    `${input.energy} ${ENERGY_UNIT_DEFS[input.energyUnit].symbol}`,
    '',
    'Equivalent:',
    `${input.equivalentMmbtu} MMBTU`,
    '',
    'Formula:',
    'Energy = Volume × Heating Value',
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}
