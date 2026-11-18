import { formatAngle } from '../coordinates/calculation';
import {
  ETHANOL_DENSITY_G_PER_ML,
  KCAL_PER_G_ALCOHOL,
  KCAL_PER_G_CARBS,
  KCAL_PER_G_FAT,
  KCAL_PER_G_PROTEIN,
  type AlcoholMode,
} from './types';

export function formatKcal(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function formatGrams(value: number): string {
  return formatKcal(value);
}

export function alcoholGramsFromVolume(volumeMl: number, abvPercent: number): number {
  return volumeMl * (abvPercent / 100) * ETHANOL_DENSITY_G_PER_ML;
}

export interface MacroInputs {
  carbsG: number;
  proteinG: number;
  fatG: number;
  alcoholMode: AlcoholMode;
  alcoholGrams: number;
  volumeMl: number;
  abvPercent: number;
}

export interface CalorieBreakdown {
  carbsKcal: number;
  proteinKcal: number;
  fatKcal: number;
  alcoholKcal: number;
  alcoholGramsUsed: number;
  totalKcal: number;
  carbsPct: number | null;
  proteinPct: number | null;
  fatPct: number | null;
  alcoholPct: number | null;
}

export function resolveAlcoholGrams(input: MacroInputs): number {
  switch (input.alcoholMode) {
    case 'none':
      return 0;
    case 'grams':
      return input.alcoholGrams;
    case 'volume':
      return alcoholGramsFromVolume(input.volumeMl, input.abvPercent);
  }
}

export function calculateCalories(input: MacroInputs): CalorieBreakdown {
  const alcoholGramsUsed = resolveAlcoholGrams(input);
  const carbsKcal = input.carbsG * KCAL_PER_G_CARBS;
  const proteinKcal = input.proteinG * KCAL_PER_G_PROTEIN;
  const fatKcal = input.fatG * KCAL_PER_G_FAT;
  const alcoholKcal = alcoholGramsUsed * KCAL_PER_G_ALCOHOL;
  const totalKcal = carbsKcal + proteinKcal + fatKcal + alcoholKcal;

  const pct = (part: number): number | null =>
    totalKcal === 0 ? null : (part / totalKcal) * 100;

  return {
    carbsKcal,
    proteinKcal,
    fatKcal,
    alcoholKcal,
    alcoholGramsUsed,
    totalKcal,
    carbsPct: pct(carbsKcal),
    proteinPct: pct(proteinKcal),
    fatPct: pct(fatKcal),
    alcoholPct: pct(alcoholKcal),
  };
}

export function shareResultText(
  carbsG: number,
  proteinG: number,
  fatG: number,
  alcoholGramsUsed: number,
  result: CalorieBreakdown,
): string {
  return [
    'Grams to Calories Calculator — Omega Calculators',
    '',
    `Carbs: ${formatGrams(carbsG)} g → ${formatKcal(result.carbsKcal)} kcal`,
    `Protein: ${formatGrams(proteinG)} g → ${formatKcal(result.proteinKcal)} kcal`,
    `Fat: ${formatGrams(fatG)} g → ${formatKcal(result.fatKcal)} kcal`,
    `Alcohol: ${formatGrams(alcoholGramsUsed)} g → ${formatKcal(result.alcoholKcal)} kcal`,
    '',
    `Total: ${formatKcal(result.totalKcal)} kcal`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
