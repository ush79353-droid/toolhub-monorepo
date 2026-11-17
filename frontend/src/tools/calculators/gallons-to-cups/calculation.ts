import { formatMeasure } from '../cubic-feet/calculation';
import { CUPS_PER_US_GALLON, type GalToCupsInput, type GalToCupsResult } from './types';

export { formatMeasure as formatVolume };

export function gallonsToCups(gallons: number): number {
  if (!Number.isFinite(gallons) || gallons < 0) {
    throw new RangeError('Gallons must be a finite, non-negative number.');
  }
  return gallons * CUPS_PER_US_GALLON;
}

export function cupsToGallons(cups: number): number {
  if (!Number.isFinite(cups) || cups < 0) {
    throw new RangeError('Cups must be a finite, non-negative number.');
  }
  return cups / CUPS_PER_US_GALLON;
}

export function calculateGalToCups(input: GalToCupsInput): GalToCupsResult {
  let gallons: number;
  let cups: number;

  if (input.source === 'gallons') {
    gallons = input.gallons!;
    cups = gallonsToCups(gallons);
  } else {
    cups = input.cups!;
    gallons = cupsToGallons(cups);
  }

  const explanation =
    input.source === 'gallons'
      ? `${formatMeasure(gallons)} US gal × ${CUPS_PER_US_GALLON} = ${formatMeasure(cups)} US cups`
      : `${formatMeasure(cups)} US cups ÷ ${CUPS_PER_US_GALLON} = ${formatMeasure(gallons)} US gal`;

  return { source: input.source, gallons, cups, explanation };
}

export function shareResultText(result: GalToCupsResult): string {
  return [
    'Gallons to Cups Converter — Omega Calculators',
    '',
    `${formatMeasure(result.gallons)} US gallons = ${formatMeasure(result.cups)} US cups`,
    '',
    'Formula:',
    'Cups = Gallons × 16',
    result.explanation,
  ].join('\n');
}
