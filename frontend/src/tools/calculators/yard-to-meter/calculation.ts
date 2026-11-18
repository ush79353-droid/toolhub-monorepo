import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import {
  METERS_PER_YARD,
  type OtherUnitRow,
  type YardToMeterInput,
  type YardToMeterResult,
} from './types';

export function formatLength(value: number): string {
  return formatSharedLength(value);
}

export function yardsToMeters(yards: number): number {
  return yards * METERS_PER_YARD;
}

export function metersToYards(meters: number): number {
  return meters / METERS_PER_YARD;
}

/** Shared-engine check: yd↔m must match the exact 0.9144 factor. */
export function yardsToMetersViaRegistry(yards: number): number {
  return convertLength(yards, 'yd', 'm');
}

function otherUnitsFromMeters(meters: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mm', label: 'Millimeters (mm)', value: convertLength(meters, 'm', 'mm') },
    { unit: 'cm', label: 'Centimeters (cm)', value: convertLength(meters, 'm', 'cm') },
    { unit: 'in', label: 'Inches (in)', value: convertLength(meters, 'm', 'in') },
    { unit: 'ft', label: 'Feet (ft)', value: convertLength(meters, 'm', 'ft') },
    { unit: 'km', label: 'Kilometers (km)', value: convertLength(meters, 'm', 'km') },
    { unit: 'mi', label: 'Miles (mi)', value: convertLength(meters, 'm', 'mi') },
  ];
}

export function calculateYardToMeter(input: YardToMeterInput): YardToMeterResult {
  let yards: number;
  let meters: number;

  if (input.source === 'yards') {
    yards = input.yards!;
    meters = yardsToMeters(yards);
  } else {
    meters = input.meters!;
    yards = metersToYards(meters);
  }

  const explanation =
    input.source === 'yards'
      ? `${formatLength(yards)} yd × ${METERS_PER_YARD} = ${formatLength(meters)} m`
      : `${formatLength(meters)} m ÷ ${METERS_PER_YARD} = ${formatLength(yards)} yd`;

  return {
    source: input.source,
    yards,
    meters,
    explanation,
    otherUnits: otherUnitsFromMeters(meters),
  };
}

export function shareResultText(result: YardToMeterResult): string {
  return [
    'Yard to Meter Converter',
    'Omega Calculators',
    '',
    `${formatLength(result.yards)} yards = ${formatLength(result.meters)} meters`,
    '',
    'Formula:',
    `Meters = Yards × ${METERS_PER_YARD}`,
    result.explanation,
    '',
    '/tools/yard-to-meter-converter',
  ].join('\n');
}
