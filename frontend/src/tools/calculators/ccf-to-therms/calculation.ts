import { formatAngle } from '../coordinates/calculation';
import {
  BTU_PER_THERM,
  CUBIC_FEET_PER_CCF,
  DEFAULT_FACTOR,
} from './types';

export function formatAmount(value: number): string {
  return formatAngle(value, 12);
}

export function factorFromHeating(btuPerFt3: number): number {
  return btuPerFt3 / 1000;
}

export function heatingFromFactor(thermsPerCcf: number): number {
  return thermsPerCcf * 1000;
}

export function ccfToTherms(ccf: number, factor: number = DEFAULT_FACTOR): number {
  return ccf * factor;
}

export function thermsToCcf(therms: number, factor: number = DEFAULT_FACTOR): number {
  return therms / factor;
}

/** Energy in BTU for a given CCF at a heating value (BTU/ft³). */
export function ccfToBtu(ccf: number, btuPerFt3: number): number {
  return ccf * CUBIC_FEET_PER_CCF * btuPerFt3;
}

export function thermsFromBtu(btu: number): number {
  return btu / BTU_PER_THERM;
}

export function shareResultText(input: {
  ccf: string;
  therms: string;
  factor: string;
  heating: string;
}): string {
  return [
    'CCF to Therms Calculator',
    'Omega Calculators',
    '',
    'Input:',
    `${input.ccf} CCF`,
    '',
    'Heating Value:',
    `${input.heating} BTU/ft³`,
    '',
    'Conversion Factor:',
    `${input.factor} therms per CCF`,
    '',
    'Result:',
    `${input.therms} therms`,
    '',
    'Formula:',
    'Therms = CCF × Conversion Factor',
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}
