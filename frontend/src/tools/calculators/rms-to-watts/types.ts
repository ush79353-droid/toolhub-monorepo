export const SQRT_2 = Math.SQRT2;

export type WaveformField = 'rms' | 'peak';

export const ADVANCED_MODES = [
  'voltageCurrent',
  'voltageResistance',
  'currentResistance',
  'peakVoltageResistance',
] as const;
export type AdvancedMode = (typeof ADVANCED_MODES)[number];

export const ADVANCED_MODE_LABELS: Record<AdvancedMode, string> = {
  voltageCurrent: 'RMS voltage & current',
  voltageResistance: 'RMS voltage & resistance',
  currentResistance: 'RMS current & resistance',
  peakVoltageResistance: 'Peak voltage & resistance',
};

export type RmsToWattsFieldErrors = {
  rms?: string;
  peak?: string;
  voltage?: string;
  current?: string;
  resistance?: string;
  powerFactor?: string;
  peakVoltage?: string;
};

export const MAX_ABS_POWER = 1e30;
