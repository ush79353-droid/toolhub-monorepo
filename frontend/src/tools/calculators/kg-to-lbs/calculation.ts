import { formatMass } from '../weight-converter/calculation';
import { KG_PER_POUND, LBS_PER_KG, type KgToLbsInput } from './types';

export { formatMass, KG_PER_POUND, LBS_PER_KG };

export function kgToLbs(kilograms: number): number {
  return kilograms / KG_PER_POUND;
}

export function lbsToKg(pounds: number): number {
  return pounds * KG_PER_POUND;
}

export interface KgToLbsResult {
  source: 'kg' | 'lbs';
  kg: number;
  lbs: number;
  explanation: string;
}

export function calculateKgToLbs(input: KgToLbsInput): KgToLbsResult {
  let kg: number;
  let lbs: number;

  if (input.source === 'kg') {
    kg = input.kg!;
    lbs = kgToLbs(kg);
  } else {
    lbs = input.lbs!;
    kg = lbsToKg(lbs);
  }

  const explanation =
    input.source === 'kg'
      ? `${formatMass(kg)} kg ÷ ${KG_PER_POUND} = ${formatMass(lbs)} lb`
      : `${formatMass(lbs)} lb × ${KG_PER_POUND} = ${formatMass(kg)} kg`;

  return { source: input.source, kg, lbs, explanation };
}

export function shareResultText(result: KgToLbsResult): string {
  return [
    'kg to lbs Converter',
    'Omega Calculators',
    '',
    `${formatMass(result.kg)} kg = ${formatMass(result.lbs)} lb`,
    '',
    'Formula:',
    `lb = kg ÷ ${KG_PER_POUND}`,
    result.explanation,
    '',
    'Calculator:',
    '/tools/kg-to-lbs-converter',
  ].join('\n');
}
