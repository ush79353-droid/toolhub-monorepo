import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import {
  CENTIMETERS_PER_FOOT,
  EXTRA_LENGTH_UNITS,
  type ExtraLengthUnit,
  type FootToCmInput,
  type FootToCmResult,
} from './types';

export function formatLength(value: number): string {
  return formatSharedLength(value);
}

export function feetToCentimeters(feet: number): number {
  return feet * CENTIMETERS_PER_FOOT;
}

export function centimetersToFeet(centimeters: number): number {
  return centimeters / CENTIMETERS_PER_FOOT;
}

/** Shared-engine check: ft↔cm must match exact 30.48. */
export function feetToCentimetersViaRegistry(feet: number): number {
  return convertLength(feet, 'ft', 'cm');
}

function extrasFromFeet(feet: number): Record<ExtraLengthUnit, number> {
  const out = {} as Record<ExtraLengthUnit, number>;
  for (const unit of EXTRA_LENGTH_UNITS) {
    out[unit] = convertLength(feet, 'ft', unit);
  }
  return out;
}

export function calculateFootToCm(input: FootToCmInput): FootToCmResult {
  let feet: number;

  if (input.source === 'feet') {
    feet = input.value!;
  } else if (input.source === 'centimeters') {
    feet = centimetersToFeet(input.value!);
  } else {
    feet = convertLength(input.value!, input.source, 'ft');
  }

  const centimeters = feetToCentimeters(feet);
  const extras = extrasFromFeet(feet);

  const explanation =
    input.source === 'feet'
      ? `${formatLength(feet)} ft × ${CENTIMETERS_PER_FOOT} = ${formatLength(centimeters)} cm`
      : input.source === 'centimeters'
        ? `${formatLength(centimeters)} cm ÷ ${CENTIMETERS_PER_FOOT} = ${formatLength(feet)} ft`
        : `${formatLength(input.value!)} ${input.source} → ${formatLength(feet)} ft = ${formatLength(centimeters)} cm`;

  return {
    source: input.source,
    feet,
    centimeters,
    extras,
    explanation,
  };
}

export function shareResultText(result: FootToCmResult): string {
  return [
    'Foot to Centimeter Converter — Omega Calculators',
    '',
    `${formatLength(result.feet)} ft = ${formatLength(result.centimeters)} cm`,
    '',
    'Formula:',
    'cm = ft × 30.48',
    result.explanation,
  ].join('\n');
}
