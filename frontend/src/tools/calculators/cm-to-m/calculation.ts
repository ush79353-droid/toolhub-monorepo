import { formatLength as formatShared } from '../centimeter/calculation';
import { convertLength, UNIT_SYMBOLS } from '../centimeter/units';
import {
  CM_PER_METER,
  type CmToMInput,
  type CmToMResult,
  type OtherLengthUnit,
} from './types';

export { formatShared as formatLength };

/** Alias matching the brief API name. */
export function centimetersToMeters(cm: number): number {
  return convertLength(cm, 'cm', 'm');
}

/** Alias matching the brief API name. */
export function metersToCentimeters(meters: number): number {
  return convertLength(meters, 'm', 'cm');
}

/** Alias matching the brief API name. */
export function centimetersToInches(cm: number): number {
  return convertLength(cm, 'cm', 'in');
}

export function centimetersToOther(cm: number, unit: OtherLengthUnit): number {
  return convertLength(cm, 'cm', unit);
}

export function otherToCentimeters(value: number, unit: OtherLengthUnit): number {
  return convertLength(value, unit, 'cm');
}

export function calculateCmToM(input: CmToMInput): CmToMResult {
  const otherUnit = input.otherUnit;
  let centimeters: number;

  if (input.source === 'cm') {
    centimeters = input.value!;
  } else if (input.source === 'm') {
    centimeters = metersToCentimeters(input.value!);
  } else {
    centimeters = otherToCentimeters(input.value!, otherUnit);
  }

  const meters = centimetersToMeters(centimeters);
  const other = centimetersToOther(centimeters, otherUnit);

  const explanation =
    input.source === 'cm'
      ? `${formatShared(centimeters)} cm ÷ ${CM_PER_METER} = ${formatShared(meters)} m`
      : input.source === 'm'
        ? `${formatShared(meters)} m × ${CM_PER_METER} = ${formatShared(centimeters)} cm`
        : `${formatShared(input.value!)} ${UNIT_SYMBOLS[otherUnit]} → ${formatShared(centimeters)} cm = ${formatShared(meters)} m`;

  return {
    source: input.source,
    centimeters,
    meters,
    other,
    otherUnit,
    explanation,
  };
}

export function shareResultText(result: CmToMResult): string {
  return [
    'CM to M Converter — Omega Calculators',
    '',
    `${formatShared(result.centimeters)} cm = ${formatShared(result.meters)} m`,
    `${formatShared(result.other)} ${UNIT_SYMBOLS[result.otherUnit]}`,
  ].join('\n');
}
