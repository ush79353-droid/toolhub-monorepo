import {
  computeFromDirect,
  computeFromObservations,
  convertDensityToVehiclesPerKm,
  convertFlowToVehiclesPerHour,
  convertSpeedToKilometersPerHour,
} from './calculation';
import type {
  TrafficDensityFieldErrors,
  TrafficDensityInput,
  TrafficDensityResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function parseNonnegInt(
  raw: string,
  label: string,
): { value: number | null; error?: string } {
  const n = parseNumber(raw);
  if (n == null) return { value: null, error: `Enter ${label}.` };
  if (!Number.isInteger(n) || n < 0)
    return {
      value: null,
      error: `${label} must be a nonnegative whole number.`,
    };
  return { value: n };
}

export function validateTrafficDensityInputs(input: TrafficDensityInput): {
  errors: TrafficDensityFieldErrors;
  result: TrafficDensityResult | null;
} {
  const errors: TrafficDensityFieldErrors = {};

  if (input.mode === 'observations') {
    const pass = parseNonnegInt(input.passingVehicles, 'passing vehicles');
    if (pass.error) errors.passingVehicles = pass.error;

    const time = parseNumber(input.observationTime);
    if (time == null) errors.observationTime = 'Enter observation time.';
    else if (time <= 0)
      errors.observationTime = 'Observation time must be greater than zero.';

    const seg = parseNonnegInt(input.segmentVehicles, 'segment vehicles');
    if (seg.error) errors.segmentVehicles = seg.error;

    const len = parseNumber(input.roadLength);
    if (len == null) errors.roadLength = 'Enter road length.';
    else if (len <= 0)
      errors.roadLength = 'Road length must be greater than zero.';

    if (Object.keys(errors).length > 0) return { errors, result: null };

    return {
      errors,
      result: computeFromObservations({
        passingVehicles: pass.value!,
        observationTime: time!,
        observationTimeUnit: input.observationTimeUnit,
        segmentVehicles: seg.value!,
        roadLength: len!,
        roadLengthUnit: input.roadLengthUnit,
        flowUnit: input.flowUnit,
        densityUnit: input.densityUnit,
        speedUnit: input.speedUnit,
        headwayUnit: input.headwayUnit,
      }),
    };
  }

  // Direct modes
  const flowN = parseNumber(input.directFlow);
  const densN = parseNumber(input.directDensity);
  const speedN = parseNumber(input.directSpeed);

  if (input.mode === 'calculate-speed' || input.mode === 'calculate-density') {
    if (flowN == null) errors.directFlow = 'Enter traffic flow.';
    else if (flowN < 0) errors.directFlow = 'Flow cannot be negative.';
  }
  if (input.mode === 'calculate-speed' || input.mode === 'calculate-flow') {
    if (densN == null) errors.directDensity = 'Enter traffic density.';
    else if (densN < 0) errors.directDensity = 'Density cannot be negative.';
  }
  if (input.mode === 'calculate-density' || input.mode === 'calculate-flow') {
    if (speedN == null) errors.directSpeed = 'Enter traffic speed.';
    else if (speedN < 0) errors.directSpeed = 'Speed cannot be negative.';
    else if (
      input.mode === 'calculate-density' &&
      speedN === 0
    ) {
      errors.directSpeed = 'Speed must be greater than zero to solve density.';
    }
  }

  if (Object.keys(errors).length > 0) return { errors, result: null };

  const flowVehPerH =
    flowN != null
      ? convertFlowToVehiclesPerHour(flowN, input.flowUnit)
      : null;
  const densityVehPerKm =
    densN != null
      ? convertDensityToVehiclesPerKm(densN, input.densityUnit)
      : null;
  const speedKmH =
    speedN != null
      ? convertSpeedToKilometersPerHour(speedN, input.speedUnit)
      : null;

  return {
    errors,
    result: computeFromDirect({
      mode: input.mode,
      flowVehPerH,
      densityVehPerKm,
      speedKmH,
      flowUnit: input.flowUnit,
      densityUnit: input.densityUnit,
      speedUnit: input.speedUnit,
      headwayUnit: input.headwayUnit,
    }),
  };
}
