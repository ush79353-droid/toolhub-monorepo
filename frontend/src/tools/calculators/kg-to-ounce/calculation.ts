import { formatMass, fromKilograms, toKilograms } from '../weight-converter/calculation';
import {
  KG_PER_OUNCE,
  KG_PER_POUND,
  KG_PER_TROY_OUNCE,
  OZ_PER_KG,
  OZ_PER_LB,
  type KgOzSource,
  type KgToOunceInput,
  type MoreMassUnit,
} from './types';

export {
  formatMass,
  KG_PER_OUNCE,
  KG_PER_POUND,
  KG_PER_TROY_OUNCE,
  OZ_PER_KG,
  OZ_PER_LB,
};

export function kgToOunces(kg: number): number {
  return kg / KG_PER_OUNCE;
}

export function ouncesToKg(oz: number): number {
  return oz * KG_PER_OUNCE;
}

export function kgToTroyOunces(kg: number): number {
  return kg / KG_PER_TROY_OUNCE;
}

export function troyOuncesToKg(troyOz: number): number {
  return troyOz * KG_PER_TROY_OUNCE;
}

export function kgToPounds(kg: number): number {
  return kg / KG_PER_POUND;
}

export function poundsToKg(lb: number): number {
  return lb * KG_PER_POUND;
}

export interface MixedLbOz {
  pounds: number;
  ounces: number;
}

/** Normalize nonnegative total avoirdupois ounces to whole lb + remainder oz in [0, 16). */
export function normalizeLbOz(totalOunces: number): MixedLbOz {
  if (!Number.isFinite(totalOunces) || totalOunces === 0) {
    return { pounds: 0, ounces: 0 };
  }
  const pounds = Math.floor(totalOunces / OZ_PER_LB);
  let ounces = totalOunces - pounds * OZ_PER_LB;
  if (ounces >= OZ_PER_LB - 1e-12) {
    return { pounds: pounds + 1, ounces: 0 };
  }
  if (ounces < 0 && ounces > -1e-12) ounces = 0;
  return { pounds, ounces };
}

export function mixedLbOzToKg(pounds: number, ounces: number): number {
  return ouncesToKg(pounds * OZ_PER_LB + ounces);
}

export function moreToKg(value: number, unit: MoreMassUnit): number {
  return toKilograms(value, unit);
}

export function kgToMore(kg: number, unit: MoreMassUnit): number {
  return fromKilograms(kg, unit);
}

export interface KgToOunceResult {
  source: KgOzSource;
  kg: number;
  oz: number;
  troyOz: number;
  lbPart: number;
  ozPart: number;
  moreUnit: MoreMassUnit;
  moreValue: number;
  explanation: string;
}

function resolveKilograms(input: KgToOunceInput): number {
  switch (input.source) {
    case 'kg':
      return input.kg!;
    case 'oz':
      return ouncesToKg(input.oz!);
    case 'troyOz':
      return troyOuncesToKg(input.troyOz!);
    case 'lbOz':
      return mixedLbOzToKg(input.lbPart ?? 0, input.ozPart ?? 0);
    case 'more':
      return moreToKg(input.moreValue!, input.moreUnit);
  }
}

export function calculateKgToOunce(input: KgToOunceInput): KgToOunceResult {
  const kg = resolveKilograms(input);
  const oz = kgToOunces(kg);
  const troyOz = kgToTroyOunces(kg);
  const mixed = normalizeLbOz(oz);
  const moreValue = kgToMore(kg, input.moreUnit);

  const explanation =
    input.source === 'kg'
      ? `${formatMass(kg)} kg × ${OZ_PER_KG} = ${formatMass(oz)} oz`
      : input.source === 'oz'
        ? `${formatMass(oz)} oz × ${KG_PER_OUNCE} = ${formatMass(kg)} kg`
        : input.source === 'troyOz'
          ? `${formatMass(troyOz)} oz t × ${KG_PER_TROY_OUNCE} = ${formatMass(kg)} kg`
          : input.source === 'lbOz'
            ? `${formatMass(mixed.pounds)} lb ${formatMass(mixed.ounces)} oz = ${formatMass(kg)} kg`
            : `${formatMass(moreValue)} ${input.moreUnit} = ${formatMass(kg)} kg`;

  return {
    source: input.source,
    kg,
    oz,
    troyOz,
    lbPart: mixed.pounds,
    ozPart: mixed.ounces,
    moreUnit: input.moreUnit,
    moreValue,
    explanation,
  };
}

export function shareResultText(result: KgToOunceResult): string {
  return [
    'kg to Ounce Converter',
    'Omega Calculators',
    '',
    `Kilograms: ${formatMass(result.kg)} kg`,
    `Ounces: ${formatMass(result.oz)} oz`,
    `Troy ounces: ${formatMass(result.troyOz)} oz t`,
    `Pounds and ounces: ${formatMass(result.lbPart)} lb ${formatMass(result.ozPart)} oz`,
    '',
    'Formula:',
    `oz = kg × ${OZ_PER_KG}`,
    '',
    '/tools/kg-to-ounce-converter',
  ].join('\n');
}
