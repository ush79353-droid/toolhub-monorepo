/**
 * HEART score — History, ECG, Age, Risk factors, Troponin (Six et al., 2008).
 *
 * Each component 0–2 points; total 0–10. Age bands: &lt;45 (0), 45–64 (1), ≥65 (2).
 * Troponin tiers are relative to the assay upper reference limit (user-selected tier).
 *
 * Educational arithmetic only — not ED disposition or ACS management.
 */

import type {
  EcgCategory,
  HeartScoreComponentPoints,
  HeartScoreInput,
  HeartScoreResult,
  HistoryCategory,
  RiskFactorsCategory,
  TroponinCategory,
} from './types';
import {
  ECG_OPTIONS,
  HISTORY_OPTIONS,
  RISK_FACTOR_OPTIONS,
  TROPONIN_OPTIONS,
} from './types';

export const SOURCE_LABEL =
  'Six AJ et al. Chest pain in the emergency room: value of the HEART score. Neth Heart J. 2008;116(6):191–196; Backus BE et al. Prospective multicenter validation of the HEART score. Crit Pathw Cardiol. 2013;12(3):110–114.';

export const DISCLAIMER =
  'Educational HEART score (0–10) for chest-pain risk context only. It does not direct discharge, observation, or invasive testing. Troponin tier assumes comparison to your laboratory upper reference limit.';

const ECG_POINTS: Record<EcgCategory, 0 | 1 | 2> = Object.fromEntries(
  ECG_OPTIONS.map((o) => [o.value, o.points]),
) as Record<EcgCategory, 0 | 1 | 2>;

const HISTORY_POINTS: Record<HistoryCategory, 0 | 1 | 2> = Object.fromEntries(
  HISTORY_OPTIONS.map((o) => [o.value, o.points]),
) as Record<HistoryCategory, 0 | 1 | 2>;

const TROPONIN_POINTS: Record<TroponinCategory, 0 | 1 | 2> = Object.fromEntries(
  TROPONIN_OPTIONS.map((o) => [o.value, o.points]),
) as Record<TroponinCategory, 0 | 1 | 2>;

const RISK_POINTS: Record<RiskFactorsCategory, 0 | 1 | 2> = Object.fromEntries(
  RISK_FACTOR_OPTIONS.map((o) => [o.value, o.points]),
) as Record<RiskFactorsCategory, 0 | 1 | 2>;

/**
 * Age points per Six/Backus HEART: &lt;45 → 0; 45–64 → 1; ≥65 → 2.
 * Boundaries: 44 → 0; 45 → 1; 64 → 1; 65 → 2.
 */
export function agePoints(ageYears: number): 0 | 1 | 2 {
  if (!Number.isFinite(ageYears) || ageYears < 0) {
    throw new Error('Age must be a non-negative finite number.');
  }
  if (ageYears < 45) return 0;
  if (ageYears < 65) return 1;
  return 2;
}

export function componentPoints(input: HeartScoreInput, ageYears: number): HeartScoreComponentPoints {
  return {
    age: agePoints(ageYears),
    ecg: ECG_POINTS[input.ecg],
    history: HISTORY_POINTS[input.history],
    troponin: TROPONIN_POINTS[input.troponin],
    riskFactors: RISK_POINTS[input.riskFactors],
  };
}

export function totalHeartScore(components: HeartScoreComponentPoints): number {
  return (
    components.age +
    components.ecg +
    components.history +
    components.troponin +
    components.riskFactors
  );
}

export function calculateHeartScore(
  input: HeartScoreInput,
  ageYears: number,
): HeartScoreResult {
  const components = componentPoints(input, ageYears);
  const totalScore = totalHeartScore(components);
  return {
    totalScore,
    formattedTotalScore: String(totalScore),
    components,
    componentSummary: `H(${components.history}) + E(${components.ecg}) + A(${components.age}) + R(${components.riskFactors}) + T(${components.troponin}) = ${totalScore}.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

export function parseAgeYears(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (!/^\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}