import { formatAngle } from '../coordinates/calculation';
import { MODE_LABELS, MODE_META, type ConversionMode } from './types';

export function formatPower(value: number): string {
  return formatAngle(value, 12);
}

export function dbmToWatts(dbm: number): number {
  return 10 ** ((dbm - 30) / 10);
}

export function dbmToMilliwatts(dbm: number): number {
  return 10 ** (dbm / 10);
}

export function wattsToDbm(watts: number): number {
  return 10 * Math.log10(watts) + 30;
}

export function milliwattsToDbm(milliwatts: number): number {
  return 10 * Math.log10(milliwatts);
}

export type ConvertOk = { ok: true; value: number };
export type ConvertErr = { ok: false; error: string };
export type ConvertResult = ConvertOk | ConvertErr;

export function convert(mode: ConversionMode, input: number): ConvertResult {
  if (!Number.isFinite(input)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }

  let value: number;
  switch (mode) {
    case 'dbmToWatts':
      if (Math.abs(input) > 300) {
        return { ok: false, error: 'This dBm value is outside the supported range.' };
      }
      value = dbmToWatts(input);
      break;
    case 'dbmToMilliwatts':
      if (Math.abs(input) > 300) {
        return { ok: false, error: 'This dBm value is outside the supported range.' };
      }
      value = dbmToMilliwatts(input);
      break;
    case 'wattsToDbm':
      if (input <= 0) {
        return {
          ok: false,
          error: 'Power in watts must be greater than zero to convert to dBm.',
        };
      }
      value = wattsToDbm(input);
      break;
    case 'milliwattsToDbm':
      if (input <= 0) {
        return {
          ok: false,
          error: 'Power in milliwatts must be greater than zero to convert to dBm.',
        };
      }
      value = milliwattsToDbm(input);
      break;
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      error: 'Result is outside the finite numeric range for this input.',
    };
  }
  return { ok: true, value };
}

export function shareResultText(input: {
  mode: ConversionMode;
  inputValue: string;
  outputValue: string;
}): string {
  const meta = MODE_META[input.mode];
  return [
    'dBm to Watts Calculator | Omega Calculators',
    '',
    `Conversion: ${MODE_LABELS[input.mode]}`,
    '',
    `Input: ${input.inputValue} ${meta.inputUnit}`,
    `Result: ${input.outputValue} ${meta.outputUnit}`,
    '',
    'Formula:',
    meta.formulaShare,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
