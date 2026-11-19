import type { DartRateResult } from './types';

export const DART_NORMALIZATION_FACTOR = 200_000;

export interface DartBreakdown {
  incidents: number;
  incidentsEstimated: boolean;
  hoursWorked: number;
  dartRate: number;
  normalizationFactor: number;
  interpretation: string;
}

export function formatDartRate(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatHours(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatIncidents(value: number, estimated: boolean): string {
  if (estimated) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

function buildInterpretation(dartRate: number): string {
  return `Your DART rate is ${formatDartRate(dartRate)} qualifying cases per 100 full-time-equivalent workers. Compare this result with your organization's historical rates and relevant industry-specific injury and illness statistics.`;
}

/** Forward: rate = (N × 200,000) / EH */
export function calculateDartRate(
  incidents: number,
  hoursWorked: number,
): DartBreakdown | null {
  if (!Number.isSafeInteger(incidents) || incidents < 0) return null;
  if (!Number.isFinite(hoursWorked) || !(hoursWorked > 0)) return null;

  const dartRate = (incidents * DART_NORMALIZATION_FACTOR) / hoursWorked;
  if (!Number.isFinite(dartRate) || dartRate < 0) return null;

  return {
    incidents,
    incidentsEstimated: false,
    hoursWorked,
    dartRate,
    normalizationFactor: DART_NORMALIZATION_FACTOR,
    interpretation: buildInterpretation(dartRate),
  };
}

/** Hours = (N × 200,000) / rate */
export function solveHoursWorked(
  incidents: number,
  dartRate: number,
): DartBreakdown | null {
  if (!Number.isSafeInteger(incidents) || incidents < 0) return null;
  if (!Number.isFinite(dartRate) || !(dartRate > 0)) return null;
  if (incidents === 0) return null;

  const hoursWorked = (incidents * DART_NORMALIZATION_FACTOR) / dartRate;
  if (!Number.isFinite(hoursWorked) || !(hoursWorked > 0)) return null;

  return {
    incidents,
    incidentsEstimated: false,
    hoursWorked,
    dartRate,
    normalizationFactor: DART_NORMALIZATION_FACTOR,
    interpretation: buildInterpretation(dartRate),
  };
}

/** Estimated incidents = rate × hours / 200,000 (may be fractional). */
export function solveEstimatedIncidents(
  dartRate: number,
  hoursWorked: number,
): DartBreakdown | null {
  if (!Number.isFinite(dartRate) || dartRate < 0) return null;
  if (!Number.isFinite(hoursWorked) || !(hoursWorked > 0)) return null;

  const incidents = (dartRate * hoursWorked) / DART_NORMALIZATION_FACTOR;
  if (!Number.isFinite(incidents) || incidents < 0) return null;

  return {
    incidents,
    incidentsEstimated: true,
    hoursWorked,
    dartRate,
    normalizationFactor: DART_NORMALIZATION_FACTOR,
    interpretation: buildInterpretation(dartRate),
  };
}

export function toDartRateResult(breakdown: DartBreakdown): DartRateResult {
  return {
    ...breakdown,
    formattedIncidents: formatIncidents(
      breakdown.incidents,
      breakdown.incidentsEstimated,
    ),
    formattedHoursWorked: formatHours(breakdown.hoursWorked),
    formattedDartRate: formatDartRate(breakdown.dartRate),
  };
}

export function shareResultText(
  result: DartRateResult,
  path = '/tools/dart-rate-calculator',
): string {
  const caseLine = result.incidentsEstimated
    ? `Estimated DART cases: ${result.formattedIncidents}`
    : `Total qualifying cases: ${result.formattedIncidents}`;
  return [
    'DART Rate Calculator — Omega Calculators',
    '',
    `DART Rate: ${result.formattedDartRate}`,
    caseLine,
    `Total hours worked: ${result.formattedHoursWorked}`,
    `Normalization: ${DART_NORMALIZATION_FACTOR.toLocaleString('en-US')} hours (100 FTE × 40 × 50)`,
    '',
    result.interpretation,
    path,
  ].join('\n');
}
