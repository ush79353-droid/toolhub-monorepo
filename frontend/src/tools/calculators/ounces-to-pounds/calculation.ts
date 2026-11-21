import {
  KG_PER_OUNCE,
  KG_PER_POUND,
  OUNCES_PER_POUND,
  type OuncesToPoundsInput,
  type OzLbSource,
} from './types';

export { KG_PER_OUNCE, KG_PER_POUND, OUNCES_PER_POUND };

/** Readable mass display without ugly trailing zeros. */
export function formatMass(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function ouncesToPounds(ounces: number): number {
  return ounces / OUNCES_PER_POUND;
}

export function poundsToOunces(pounds: number): number {
  return pounds * OUNCES_PER_POUND;
}

export function ouncesToKilograms(ounces: number): number {
  return ounces * KG_PER_OUNCE;
}

export function kilogramsToOunces(kilograms: number): number {
  return kilograms / KG_PER_OUNCE;
}

export function poundsToKilograms(pounds: number): number {
  return pounds * KG_PER_POUND;
}

export function kilogramsToPounds(kilograms: number): number {
  return kilograms / KG_PER_POUND;
}

/** Convert any source field to avoirdupois ounces (canonical). */
export function toOunces(input: OuncesToPoundsInput): number {
  if (input.source === 'oz') return input.oz!;
  if (input.source === 'lb') return poundsToOunces(input.lb!);
  return kilogramsToOunces(input.kg!);
}

export interface OuncesToPoundsResult {
  source: OzLbSource;
  oz: number;
  lb: number;
  kg: number;
  explanation: string;
}

export function calculateOuncesToPounds(input: OuncesToPoundsInput): OuncesToPoundsResult {
  const oz = toOunces(input);
  const lb = ouncesToPounds(oz);
  const kg = ouncesToKilograms(oz);

  let explanation: string;
  if (input.source === 'oz') {
    explanation = `${formatMass(oz)} oz ÷ ${OUNCES_PER_POUND} = ${formatMass(lb)} lb`;
  } else if (input.source === 'lb') {
    explanation = `${formatMass(lb)} lb × ${OUNCES_PER_POUND} = ${formatMass(oz)} oz`;
  } else {
    explanation = `${formatMass(kg)} kg ÷ ${KG_PER_OUNCE} = ${formatMass(oz)} oz`;
  }

  return { source: input.source, oz, lb, kg, explanation };
}

export function shareResultText(result: OuncesToPoundsResult): string {
  return [
    'Ounces to Pounds Converter | Omega Calculators',
    '',
    `${formatMass(result.oz)} oz = ${formatMass(result.lb)} lb = ${formatMass(result.kg)} kg`,
    '',
    '/tools/ounces-to-pounds-converter',
  ].join('\n');
}
