import { DISCLAIMER, SOURCE_LABEL } from './content';
import type {
  MeanAirwayPressureInput,
  MeanAirwayPressureResult,
  TimeUnit,
} from './types';

export { DISCLAIMER, SOURCE_LABEL };

export function toSeconds(value: number, unit: TimeUnit): number {
  return unit === 'sec' ? value : value / 1000;
}

/**
 * Pmean = PEEP + k × (PIP − PEEP) × (Ti / Ttot)
 * Frequency mode: Ttot_sec = 60 / f
 */
export function calculateMeanAirwayPressure(
  input: MeanAirwayPressureInput,
): MeanAirwayPressureResult {
  const peep = input.peep as number;
  const pip = input.pip as number;
  const k = input.k as number;
  const tiSec = toSeconds(input.inspiratoryTime as number, input.timeUnit);
  const ttotSec =
    input.mode === 'frequency'
      ? 60 / (input.frequency as number)
      : toSeconds(input.totalCycleTime as number, input.timeUnit);
  const duty = tiSec / ttotSec;
  const mean = peep + k * (pip - peep) * duty;
  const rounded = Math.round(mean * 1000) / 1000;

  return {
    meanAirwayPressure: mean,
    formatted: String(rounded),
    dutyFraction: duty,
    explanation: `Pmean = PEEP + k×(PIP−PEEP)×(Ti/Ttot) = ${peep} + ${k}×(${pip}−${peep})×(${Math.round(duty * 1000) / 1000}) ≈ ${rounded} cmH₂O.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
