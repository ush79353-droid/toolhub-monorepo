import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import { METERS_PER_YARD, type YardsToMetersInput, type YardsToMetersResult } from './types';

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

export function calculateYardsToMeters(input: YardsToMetersInput): YardsToMetersResult {
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

  return { source: input.source, yards, meters, explanation };
}

export function shareResultText(result: YardsToMetersResult): string {
  return [
    'Yards to Meters Conversion',
    'Omega Calculators',
    '',
    `${formatLength(result.yards)} yards = ${formatLength(result.meters)} meters`,
    '',
    'Formula:',
    `Meters = Yards × ${METERS_PER_YARD}`,
    result.explanation,
    '',
    '/tools/yards-to-meters-conversion',
  ].join('\n');
}
