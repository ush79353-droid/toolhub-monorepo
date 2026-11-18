import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import {
  INCHES_PER_FOOT,
  METERS_PER_INCH,
  type InchToMeterInput,
  type InchToMeterResult,
} from './types';

export function formatLength(value: number): string {
  return formatSharedLength(value);
}

export function inchesToMeters(inches: number): number {
  return inches * METERS_PER_INCH;
}

export function metersToInches(meters: number): number {
  return meters / METERS_PER_INCH;
}

export function feetAndInchesToMeters(feet: number, inches: number): number {
  return inchesToMeters(feet * INCHES_PER_FOOT + inches);
}

/** Shared-engine check: in↔m must match the exact 0.0254 factor. */
export function inchesToMetersViaRegistry(inches: number): number {
  return convertLength(inches, 'in', 'm');
}

/**
 * Normalize meters into whole feet + inch remainder in (-12, 12).
 * Avoids displaying values such as 4 ft 12 in (becomes 5 ft 0 in).
 * Signed lengths keep the sign on the feet component when possible.
 */
export function metersToFeetAndInches(meters: number): { feet: number; inches: number } {
  if (!Number.isFinite(meters) || meters === 0) {
    return { feet: 0, inches: 0 };
  }
  const totalInches = metersToInches(meters);
  let feet = Math.trunc(totalInches / INCHES_PER_FOOT);
  let inches = totalInches - feet * INCHES_PER_FOOT;
  if (inches >= INCHES_PER_FOOT - 1e-12) {
    feet += 1;
    inches = 0;
  } else if (inches <= -(INCHES_PER_FOOT - 1e-12)) {
    feet -= 1;
    inches = 0;
  }
  return { feet, inches };
}

export function normalizeFeetInches(
  feet: number,
  inches: number,
): { feet: number; inches: number } {
  return metersToFeetAndInches(feetAndInchesToMeters(feet, inches));
}

export function calculateInchToMeter(input: InchToMeterInput): InchToMeterResult {
  let inches: number;
  let meters: number;

  if (input.source === 'inches') {
    inches = input.inches!;
    meters = inchesToMeters(inches);
  } else if (input.source === 'meters') {
    meters = input.meters!;
    inches = metersToInches(meters);
  } else {
    meters = feetAndInchesToMeters(input.feetPart ?? 0, input.inchesPart ?? 0);
    inches = metersToInches(meters);
  }

  const { feet, inches: inchesPart } = metersToFeetAndInches(meters);
  const mixedLabel = `${formatLength(feet)} ft ${formatLength(inchesPart)} in`;
  const explanation =
    input.source === 'inches'
      ? `${formatLength(inches)} in × ${METERS_PER_INCH} = ${formatLength(meters)} m`
      : input.source === 'meters'
        ? `${formatLength(meters)} m ÷ ${METERS_PER_INCH} = ${formatLength(inches)} in`
        : `${mixedLabel} → ${formatLength(inches)} in = ${formatLength(meters)} m`;

  return {
    source: input.source,
    inches,
    meters,
    feetPart: feet,
    inchesPart,
    mixedLabel,
    explanation,
  };
}

export function shareResultText(result: InchToMeterResult): string {
  return [
    'Inch to Meter Calculator',
    'Omega Calculators',
    '',
    `Input: ${formatLength(result.inches)} inches`,
    `Result: ${formatLength(result.meters)} meters`,
    '',
    'Formula:',
    result.explanation,
    `Also: ${result.mixedLabel}`,
  ].join('\n');
}
