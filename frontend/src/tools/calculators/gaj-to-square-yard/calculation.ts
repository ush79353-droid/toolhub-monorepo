import { formatLength as formatShared } from '../meter-converter/calculation';
import {
  SQUARE_FEET_PER_SQUARE_YARD,
  SQUARE_METERS_PER_SQUARE_YARD,
  SQUARE_YARDS_PER_LAND_GAJ,
  YARDS_PER_LINEAR_GAJ,
  type AreaInput,
  type AreaResult,
  type LengthInput,
  type LengthResult,
} from './types';

export function formatMeasure(value: number): string {
  return formatShared(value);
}

export function gajToSquareYards(gaj: number): number {
  return gaj * SQUARE_YARDS_PER_LAND_GAJ;
}

export function squareYardsToGaj(squareYards: number): number {
  return squareYards / SQUARE_YARDS_PER_LAND_GAJ;
}

export function gajToSquareFeet(gaj: number): number {
  return gaj * SQUARE_FEET_PER_SQUARE_YARD;
}

export function squareFeetToGaj(squareFeet: number): number {
  return squareFeet / SQUARE_FEET_PER_SQUARE_YARD;
}

export function squareMetersToGaj(squareMeters: number): number {
  return squareMeters / SQUARE_METERS_PER_SQUARE_YARD;
}

export function linearGajToYards(gaj: number): number {
  return gaj * YARDS_PER_LINEAR_GAJ;
}

export function yardsToLinearGaj(yards: number): number {
  return yards / YARDS_PER_LINEAR_GAJ;
}

export function calculateArea(input: AreaInput): AreaResult {
  let gaj: number;
  let squareYards: number;

  if (input.source === 'gaj') {
    gaj = input.gaj!;
    squareYards = gajToSquareYards(gaj);
  } else {
    squareYards = input.squareYards!;
    gaj = squareYardsToGaj(squareYards);
  }

  const squareFeet = gajToSquareFeet(gaj);
  const explanation =
    input.source === 'gaj'
      ? `${formatMeasure(gaj)} gaj × ${SQUARE_YARDS_PER_LAND_GAJ} = ${formatMeasure(squareYards)} yd²`
      : `${formatMeasure(squareYards)} yd² ÷ ${SQUARE_YARDS_PER_LAND_GAJ} = ${formatMeasure(gaj)} gaj`;

  return { source: input.source, gaj, squareYards, squareFeet, explanation };
}

export function calculateLength(input: LengthInput): LengthResult {
  let linearGaj: number;
  let yards: number;

  if (input.source === 'linearGaj') {
    linearGaj = input.linearGaj!;
    yards = linearGajToYards(linearGaj);
  } else {
    yards = input.yards!;
    linearGaj = yardsToLinearGaj(yards);
  }

  const explanation =
    input.source === 'linearGaj'
      ? `${formatMeasure(linearGaj)} linear gaj × ${YARDS_PER_LINEAR_GAJ} = ${formatMeasure(yards)} yd`
      : `${formatMeasure(yards)} yd ÷ ${YARDS_PER_LINEAR_GAJ} = ${formatMeasure(linearGaj)} linear gaj`;

  return { source: input.source, linearGaj, yards, explanation };
}

export function shareResultText(area: AreaResult | null, length: LengthResult | null): string {
  const lines = ['Gaj to Square Yard Converter | Omega Calculators', ''];
  if (area) {
    lines.push(
      `${formatMeasure(area.gaj)} gaj = ${formatMeasure(area.squareYards)} yd²`,
      `(${formatMeasure(area.squareFeet)} ft²)`,
      area.explanation,
      '',
    );
  }
  if (length) {
    lines.push(
      `Length: ${formatMeasure(length.linearGaj)} gaj = ${formatMeasure(length.yards)} yd`,
      length.explanation,
    );
  }
  if (!area && !length) {
    lines.push('No conversion entered yet.');
  }
  return lines.join('\n');
}
