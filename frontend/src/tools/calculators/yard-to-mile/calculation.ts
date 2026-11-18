import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import {
  YARDS_PER_MILE,
  type OtherUnitRow,
  type YardToMileInput,
  type YardToMileResult,
} from './types';

export function formatLength(value: number): string {
  return formatSharedLength(value);
}

export function yardsToMiles(yards: number): number {
  return yards / YARDS_PER_MILE;
}

export function milesToYards(miles: number): number {
  return miles * YARDS_PER_MILE;
}

/** Shared-engine check: yd↔mi must match the exact 1760:1 ratio. */
export function yardsToMilesViaRegistry(yards: number): number {
  return convertLength(yards, 'yd', 'mi');
}

function otherUnitsFromYards(yards: number): readonly OtherUnitRow[] {
  return [
    { unit: 'in', label: 'Inches (in)', value: convertLength(yards, 'yd', 'in') },
    { unit: 'ft', label: 'Feet (ft)', value: convertLength(yards, 'yd', 'ft') },
    { unit: 'cm', label: 'Centimeters (cm)', value: convertLength(yards, 'yd', 'cm') },
    { unit: 'm', label: 'Meters (m)', value: convertLength(yards, 'yd', 'm') },
    { unit: 'km', label: 'Kilometers (km)', value: convertLength(yards, 'yd', 'km') },
  ];
}

export function calculateYardToMile(input: YardToMileInput): YardToMileResult {
  let yards: number;
  let miles: number;

  if (input.source === 'yards') {
    yards = input.yards!;
    miles = yardsToMiles(yards);
  } else {
    miles = input.miles!;
    yards = milesToYards(miles);
  }

  const explanation =
    input.source === 'yards'
      ? `${formatLength(yards)} yd ÷ ${YARDS_PER_MILE} = ${formatLength(miles)} mi`
      : `${formatLength(miles)} mi × ${YARDS_PER_MILE} = ${formatLength(yards)} yd`;

  return {
    source: input.source,
    yards,
    miles,
    explanation,
    otherUnits: otherUnitsFromYards(yards),
  };
}

export function shareResultText(result: YardToMileResult): string {
  return [
    'Yard to Mile Converter',
    'Omega Calculators',
    '',
    `${formatLength(result.yards)} yards = ${formatLength(result.miles)} miles`,
    '',
    'Formula:',
    `Miles = Yards ÷ ${YARDS_PER_MILE}`,
    result.explanation,
    '',
    '/tools/yard-to-mile-converter',
  ].join('\n');
}
