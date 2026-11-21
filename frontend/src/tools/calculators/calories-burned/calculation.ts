/**
 * Calories Burned Calculator — pure engine (ADR-018).
 *
 * Gross energy expenditure (Adult Compendium convention):
 *   kcal = MET × 3.5 × weightKg × minutes / 200
 *
 * Distance mode (walk/run/cycle with documented pace):
 *   minutes = (distanceMiles / speedMph) × 60
 *
 * MET values: 2011 Compendium of Physical Activities (Ainsworth et al.).
 */

import type { CaloriesBurnedResult, WeightUnit } from './types';

export const LB_TO_KG = 0.45359237;

export function weightToKg(value: number, unit: WeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function totalMinutes(hours: number, minutes: number): number {
  const h = Number.isFinite(hours) && hours > 0 ? hours : 0;
  const m = Number.isFinite(minutes) && minutes > 0 ? minutes : 0;
  return h * 60 + m;
}

/** Gross kcal from MET, body mass, and duration (Compendium × 3.5 convention). */
export function caloriesFromMet(
  met: number,
  weightKg: number,
  minutes: number,
): number | null {
  if (![met, weightKg, minutes].every((n) => Number.isFinite(n) && n > 0)) {
    return null;
  }
  const kcal = (met * 3.5 * weightKg * minutes) / 200;
  return Number.isFinite(kcal) && kcal > 0 ? kcal : null;
}

/** Time from distance at a constant compendium-referenced speed (mph). */
export function minutesFromDistance(
  distanceMiles: number,
  speedMph: number,
): number | null {
  if (!Number.isFinite(distanceMiles) || distanceMiles <= 0) return null;
  if (!Number.isFinite(speedMph) || speedMph <= 0) return null;
  const minutes = (distanceMiles / speedMph) * 60;
  return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
}

export function formatKcal(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return Math.round(n).toLocaleString('en-US');
}

function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes - h * 60);
  if (h <= 0) return `${m} min`;
  if (m <= 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export interface CalculateCaloriesBurnedParams {
  activityId: string;
  activityLabel: string;
  met: number;
  weightKg: number;
  durationMinutes: number;
  usedDistanceMode: boolean;
  distanceMiles: number | null;
}

export function calculateCaloriesBurned(
  params: CalculateCaloriesBurnedParams,
): CaloriesBurnedResult | null {
  const kcal = caloriesFromMet(
    params.met,
    params.weightKg,
    params.durationMinutes,
  );
  if (kcal == null) return null;

  const hours = params.durationMinutes / 60;
  const kcalPerHour = hours > 0 ? kcal / hours : 0;
  if (!Number.isFinite(kcalPerHour)) return null;

  const formattedCalories = formatKcal(kcal);
  const formattedCaloriesPerHour = formatKcal(kcalPerHour);
  const formattedDuration = formatDuration(params.durationMinutes);

  return {
    activityId: params.activityId,
    activityLabel: params.activityLabel,
    met: params.met,
    weightKg: params.weightKg,
    durationMinutes: params.durationMinutes,
    caloriesKcal: kcal,
    caloriesPerHour: kcalPerHour,
    usedDistanceMode: params.usedDistanceMode,
    distanceMiles: params.distanceMiles,
    formattedCalories,
    formattedCaloriesPerHour,
    formattedDuration,
    formulaLine: `${params.met} × 3.5 × ${params.weightKg.toFixed(2)} kg × ${params.durationMinutes} min ÷ 200 ≈ ${formattedCalories} kcal`,
    explanation: params.usedDistanceMode
      ? `About ${formattedCalories} kcal for ${params.activityLabel} at ${formattedDuration} inferred from ${params.distanceMiles?.toFixed(2)} mi at the selected pace (MET ${params.met}).`
      : `About ${formattedCalories} kcal for ${params.activityLabel} over ${formattedDuration} (MET ${params.met}).`,
  };
}