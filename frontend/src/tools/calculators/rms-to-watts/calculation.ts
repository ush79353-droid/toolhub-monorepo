import { formatAngle } from '../coordinates/calculation';
import { SQRT_2, type AdvancedMode } from './types';

/** Format watts for display (~4–6 significant digits via formatAngle). */
export function formatWatts(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

/**
 * Peak of a sinusoidal *power* waveform from its RMS value.
 * Assumption: the quantity whose RMS is taken is itself a sinusoid of power — not a universal amp rating.
 */
export function rmsToPeak(rms: number): number {
  return rms * SQRT_2;
}

/**
 * RMS of a sinusoidal *power* waveform from its peak value.
 * Same sinusoidal-power-waveform assumption as rmsToPeak.
 */
export function peakToRms(peak: number): number {
  return peak / SQRT_2;
}

export function calculateApparentPower(vRms: number, iRms: number): number {
  return vRms * iRms;
}

export function calculateRealPower(vRms: number, iRms: number, pf: number): number {
  return vRms * iRms * pf;
}

export function powerFromVoltageResistance(vRms: number, resistance: number): number {
  return (vRms * vRms) / resistance;
}

export function powerFromCurrentResistance(iRms: number, resistance: number): number {
  return iRms * iRms * resistance;
}

export function vRmsFromPeak(vPeak: number): number {
  return vPeak / SQRT_2;
}

/** Average power for sinusoidal voltage into a pure resistance: V_peak² / (2R). */
export function averagePowerFromPeakVoltage(vPeak: number, resistance: number): number {
  return (vPeak * vPeak) / (2 * resistance);
}

export type AdvancedResult = {
  lines: readonly string[];
  assumptions: readonly string[];
};

export function computeAdvanced(
  mode: AdvancedMode,
  inputs: {
    voltage: number | null;
    current: number | null;
    resistance: number | null;
    powerFactor: number | null;
    peakVoltage: number | null;
  },
): AdvancedResult | null {
  switch (mode) {
    case 'voltageCurrent': {
      if (inputs.voltage == null || inputs.current == null || inputs.powerFactor == null) {
        return null;
      }
      const s = calculateApparentPower(inputs.voltage, inputs.current);
      const p = calculateRealPower(inputs.voltage, inputs.current, inputs.powerFactor);
      return {
        lines: [
          `Apparent power S = ${formatWatts(s)} VA`,
          `Real power P = ${formatWatts(p)} W`,
        ],
        assumptions: [
          'P = V_RMS × I_RMS × PF. Apparent power S = V_RMS × I_RMS (VA).',
        ],
      };
    }
    case 'voltageResistance': {
      if (inputs.voltage == null || inputs.resistance == null) return null;
      const p = powerFromVoltageResistance(inputs.voltage, inputs.resistance);
      return {
        lines: [`Average power P = ${formatWatts(p)} W`],
        assumptions: ['Purely resistive load: P = V_RMS² / R.'],
      };
    }
    case 'currentResistance': {
      if (inputs.current == null || inputs.resistance == null) return null;
      const p = powerFromCurrentResistance(inputs.current, inputs.resistance);
      return {
        lines: [`Average power P = ${formatWatts(p)} W`],
        assumptions: ['Purely resistive load: P = I_RMS² × R.'],
      };
    }
    case 'peakVoltageResistance': {
      if (inputs.peakVoltage == null || inputs.resistance == null) return null;
      const vRms = vRmsFromPeak(inputs.peakVoltage);
      const p = averagePowerFromPeakVoltage(inputs.peakVoltage, inputs.resistance);
      return {
        lines: [
          `V_RMS = ${formatWatts(vRms)} V`,
          `Average power P = ${formatWatts(p)} W`,
        ],
        assumptions: [
          'Sinusoidal voltage into a pure resistance: V_RMS = V_peak/√2; P = V_peak²/(2R).',
        ],
      };
    }
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

export function shareWaveformText(rms: number, peak: number): string {
  return [
    'RMS to Watts Converter | Omega Calculators',
    '',
    'Mode: sinusoidal power waveform (RMS ↔ peak)',
    `RMS: ${formatWatts(rms)} W`,
    `Peak: ${formatWatts(peak)} W`,
    '',
    'Assumption: P_peak = P_RMS × √2 for a sinusoidal power waveform.',
    'Not a universal amplifier RMS↔peak rating conversion.',
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}

export function shareAdvancedText(mode: AdvancedMode, result: AdvancedResult): string {
  return [
    'RMS to Watts Converter | Omega Calculators',
    '',
    `Mode: electrical power (${mode})`,
    ...result.lines,
    '',
    ...result.assumptions,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
