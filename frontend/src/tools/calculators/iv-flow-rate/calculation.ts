/**
 * IV Flow Rate — educational (ADR-018).
 *
 * volume_flow = volume_mL / time_min
 * drops/min   = volume_flow × drop_factor (gtts/mL)
 *
 * Fixture: 500 mL over 4 h at 20 gtts/mL → 125 mL/h · ≈41.67 gtts/min.
 */

import type {
  FlowTimeUnit,
  FlowVolumeUnit,
  IvFlowInput,
  IvFlowResult,
  TimeUnit,
  VolumeUnit,
} from './types';

export const SOURCE_NOTE =
  'IV flow (mL/min) = volume (mL) ÷ time (min). Drops/min = flow (mL/min) × tubing drop factor (gtts/mL). Educational only.';

export const DISCLAIMER =
  'Educational worksheet — not a pump program or clinical order. Confirm drop factor and orders with a licensed clinician.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function volumeToMl(value: number, unit: VolumeUnit): number {
  return unit === 'L' ? value * 1000 : value;
}

export function mlToVolume(ml: number, unit: VolumeUnit): number {
  return unit === 'L' ? ml / 1000 : ml;
}

export function timeToMinutes(value: number, unit: TimeUnit): number {
  return unit === 'h' ? value * 60 : value;
}

export function minutesToTime(min: number, unit: TimeUnit): number {
  return unit === 'h' ? min / 60 : min;
}

/** Flow in mL/min from volume mL and time minutes. */
export function flowMlPerMin(volumeMl: number, timeMin: number): number {
  if (!(timeMin > 0) || !Number.isFinite(timeMin)) {
    throw new RangeError('Infusion time must be positive.');
  }
  if (!(volumeMl > 0) || !Number.isFinite(volumeMl)) {
    throw new RangeError('Volume must be positive.');
  }
  return volumeMl / timeMin;
}

export function dropsPerMinute(flowMlPerMinValue: number, dropFactor: number): number {
  if (!(dropFactor > 0) || !Number.isFinite(dropFactor)) {
    throw new RangeError('Drop factor must be positive.');
  }
  return flowMlPerMinValue * dropFactor;
}

/** Convert mL/min into display volume/time units. */
export function formatFlowDisplay(
  flowMlPerMinValue: number,
  volumeUnit: FlowVolumeUnit,
  timeUnit: FlowTimeUnit,
): number {
  let v = flowMlPerMinValue; // mL per min
  if (timeUnit === 'h') v *= 60; // mL per h
  if (volumeUnit === 'L') v /= 1000;
  return v;
}

export function formatNumber(value: number, digits = 4): string {
  return String(Number(value.toFixed(digits)));
}

function emptyResult(partial?: Partial<IvFlowResult>): IvFlowResult {
  return {
    volumeMl: null,
    timeMin: null,
    dropFactor: null,
    dropsPerMin: null,
    flowMlPerMin: null,
    formattedDrops: '',
    formattedFlow: '',
    statusHeadline: 'Enter drop factor, volume, and infusion time.',
    statusDetail: 'Flow rates update when all three values are positive.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateIvFlow(input: IvFlowInput): IvFlowResult {
  const dfRaw = parseNumber(input.dropFactorText);
  const volRaw = parseNumber(input.volumeText);
  const timeRaw = parseNumber(input.timeText);
  if (dfRaw === null || volRaw === null || timeRaw === null) {
    return emptyResult();
  }
  if (!(dfRaw > 0) || !(volRaw > 0) || !(timeRaw > 0)) {
    return emptyResult({
      statusHeadline: 'All inputs must be greater than zero.',
      statusDetail: 'Drop factor, volume, and time must be positive finite numbers.',
    });
  }

  const volumeMl = volumeToMl(volRaw, input.volumeUnit);
  const timeMin = timeToMinutes(timeRaw, input.timeUnit);

  try {
    const flow = flowMlPerMin(volumeMl, timeMin);
    const drops = dropsPerMinute(flow, dfRaw);
    if (!Number.isFinite(flow) || !Number.isFinite(drops)) {
      return emptyResult({
        statusHeadline: 'Unable to compute IV flow rates.',
        statusDetail: 'Result was non-finite.',
      });
    }
    const flowDisplay = formatFlowDisplay(
      flow,
      input.flowVolumeUnit,
      input.flowTimeUnit,
    );
    return {
      volumeMl,
      timeMin,
      dropFactor: dfRaw,
      dropsPerMin: drops,
      flowMlPerMin: flow,
      formattedDrops: formatNumber(drops, 4),
      formattedFlow: formatNumber(flowDisplay, 4),
      statusHeadline: 'IV flow rates computed.',
      statusDetail: 'Drops/min from volume, time, and tubing drop factor.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute IV flow rates.',
      statusDetail: 'Check that volume, time, and drop factor are positive.',
    });
  }
}
