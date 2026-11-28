/**
 * Crosswind engine — internal speed in knots.
 * θ = normalized (W − H) to (−180, 180]
 * X = V sin(θ);  Hw = V cos(θ)
 */

import type {
  CrosswindDirection,
  CrosswindInput,
  CrosswindResult,
  LongitudinalWindType,
  WindSpeedUnit,
} from './types';

/** 1 kt = 1.852 km/h */
export const KT_TO_KMH = 1.852;
/** 1 kt ≈ 1.150779448 mph */
export const KT_TO_MPH = 1.150779448;
/** 1 kt = 1852/3600 m/s */
export const KT_TO_MS = 1852 / 3600;

const NEAR_ZERO = 1e-9;

export function fmt(n: number, digits = 2): string {
  const v = Math.abs(n) < NEAR_ZERO ? 0 : n;
  return v.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertWindSpeed(
  value: number,
  from: WindSpeedUnit,
  to: WindSpeedUnit,
): number {
  if (from === to) return value;
  const toKt: Record<WindSpeedUnit, number> = {
    kt: 1,
    'km/h': 1 / KT_TO_KMH,
    mph: 1 / KT_TO_MPH,
    'm/s': 1 / KT_TO_MS,
  };
  const fromKt: Record<WindSpeedUnit, number> = {
    kt: 1,
    'km/h': KT_TO_KMH,
    mph: KT_TO_MPH,
    'm/s': KT_TO_MS,
  };
  return value * toKt[from] * fromKt[to];
}

export function toKnots(value: number, unit: WindSpeedUnit): number {
  return convertWindSpeed(value, unit, 'kt');
}

export function fromKnots(knots: number, unit: WindSpeedUnit): number {
  return convertWindSpeed(knots, 'kt', unit);
}

export function normalizeAngle360(degrees: number): number {
  const n = ((degrees % 360) + 360) % 360;
  return Math.abs(n) < NEAR_ZERO || Math.abs(n - 360) < NEAR_ZERO ? 0 : n;
}

export function calculateRunwayHeading(runwayNumber: number): number {
  if (!Number.isInteger(runwayNumber) || runwayNumber < 1 || runwayNumber > 36) {
    throw new Error('Invalid runway number');
  }
  const h = runwayNumber * 10;
  return h === 360 ? 0 : h;
}

export function normalizeWindDirection(degrees: number): number {
  return normalizeAngle360(degrees);
}

/**
 * East-positive magnetic variation:
 * Magnetic = True − Variation
 */
export function trueToMagnetic(
  trueDegrees: number,
  variationEastPositive: number,
): number {
  return normalizeAngle360(trueDegrees - variationEastPositive);
}

export function calculateRelativeWindAngle(
  windDirectionDegrees: number,
  runwayHeadingDegrees: number,
): number {
  return (
    ((windDirectionDegrees - runwayHeadingDegrees + 540) % 360) - 180
  );
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculateSignedCrosswind(
  windSpeed: number,
  relativeAngleDegrees: number,
): number {
  const x = windSpeed * Math.sin(degreesToRadians(relativeAngleDegrees));
  return Math.abs(x) < NEAR_ZERO ? 0 : x;
}

export function calculateCrosswindMagnitude(signed: number): number {
  return Math.abs(signed);
}

export function calculateCrosswindDirection(
  signed: number,
): CrosswindDirection {
  if (Math.abs(signed) < NEAR_ZERO) return 'none';
  return signed > 0 ? 'right' : 'left';
}

export function calculateHeadwindComponent(
  windSpeed: number,
  relativeAngleDegrees: number,
): number {
  const h = windSpeed * Math.cos(degreesToRadians(relativeAngleDegrees));
  return Math.abs(h) < NEAR_ZERO ? 0 : h;
}

export function calculateTailwindComponent(signedHeadwind: number): number {
  return Math.max(0, -signedHeadwind);
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function longitudinalType(signedHw: number): LongitudinalWindType {
  if (Math.abs(signedHw) < NEAR_ZERO) return 'none';
  return signedHw > 0 ? 'headwind' : 'tailwind';
}

export function buildCrosswindChart(
  windSpeedKnots: number,
): { angleDeg: number; crosswindKt: number }[] {
  const points: { angleDeg: number; crosswindKt: number }[] = [];
  for (let a = -180; a <= 180; a += 5) {
    points.push({
      angleDeg: a,
      crosswindKt: calculateSignedCrosswind(windSpeedKnots, a),
    });
  }
  return points;
}

export function calculateWindComponentsFromInput(
  input: CrosswindInput,
): CrosswindResult | null {
  const runway = Number.parseInt(input.runwayNumber, 10);
  if (!Number.isInteger(runway) || runway < 1 || runway > 36) return null;

  let runwayHeading: number;
  if (input.useCustomHeading) {
    const h = parseNum(input.customRunwayHeading);
    if (h == null || h < 0 || h > 360) return null;
    runwayHeading = normalizeAngle360(h);
  } else {
    runwayHeading = calculateRunwayHeading(runway);
  }

  const windRaw = parseNum(input.windDirection);
  if (windRaw == null || windRaw < 0 || windRaw > 360) return null;

  let windMag: number;
  if (input.windReference === 'true') {
    const varE = parseNum(input.magneticVariation);
    if (varE == null || !Number.isFinite(varE) || Math.abs(varE) > 180) {
      return null;
    }
    windMag = trueToMagnetic(windRaw, varE);
  } else {
    windMag = normalizeWindDirection(windRaw);
  }

  const speedRaw = parseNum(input.windSpeed);
  if (speedRaw == null || speedRaw < 0) return null;
  const speedKt = toKnots(speedRaw, input.windSpeedUnit);

  const theta = calculateRelativeWindAngle(windMag, runwayHeading);
  const signedX = calculateSignedCrosswind(speedKt, theta);
  const magX = calculateCrosswindMagnitude(signedX);
  const dir = calculateCrosswindDirection(signedX);
  const signedHw = calculateHeadwindComponent(speedKt, theta);
  const headMag = Math.max(0, signedHw);
  const tailMag = calculateTailwindComponent(signedHw);
  const longType = longitudinalType(signedHw);

  const steps: string[] = [];
  steps.push(
    input.useCustomHeading
      ? `Runway heading H = ${fmt(runwayHeading, 1)}° (custom)`
      : `H = R × 10 = ${runway} × 10 → ${fmt(runwayHeading === 0 ? 360 : runwayHeading, 0)}° (stored as ${fmt(runwayHeading, 0)}°)`,
  );
  if (input.windReference === 'true') {
    steps.push(
      `Magnetic wind W = True − Variation = ${fmt(windRaw, 1)} − ${fmt(parseNum(input.magneticVariation) ?? 0, 1)} = ${fmt(windMag, 1)}°`,
    );
  } else {
    steps.push(`Wind direction W = ${fmt(windMag, 1)}° (magnetic, from)`);
  }
  steps.push(`V = ${fmt(speedKt)} kt`);
  steps.push(
    `θ = ((W − H + 540) mod 360) − 180 = ${fmt(theta, 1)}°`,
  );
  steps.push(
    `X = V sin(θ) = ${fmt(speedKt)} × sin(${fmt(theta, 1)}°) = ${fmt(signedX)} kt`,
  );
  steps.push(
    `Hw = V cos(θ) = ${fmt(speedKt)} × cos(${fmt(theta, 1)}°) = ${fmt(signedHw)} kt`,
  );

  const dirLabel =
    dir === 'right'
      ? 'from the right'
      : dir === 'left'
        ? 'from the left'
        : 'none';
  const longLabel =
    longType === 'headwind'
      ? `headwind ${fmt(headMag)} kt`
      : longType === 'tailwind'
        ? `tailwind ${fmt(tailMag)} kt`
        : 'no head/tail component';

  return {
    runwayNumber: runway.toString().padStart(2, '0'),
    runwayHeadingDegrees: runwayHeading,
    windDirectionMagneticDegrees: windMag,
    windSpeedKnots: speedKt,
    relativeWindAngleDegrees: theta,
    signedCrosswindKnots: signedX,
    crosswindMagnitudeKnots: magX,
    crosswindDirection: dir,
    signedHeadwindKnots: signedHw,
    headwindMagnitudeKnots: headMag,
    tailwindMagnitudeKnots: tailMag,
    longitudinalWindType: longType,
    formulaSteps: steps,
    interpretation: `Crosswind ${fmt(magX)} kt ${dirLabel}; ${longLabel}. Educational estimate only — not an aircraft operating limit.`,
    displayUnit: input.windSpeedUnit,
    chartPoints: buildCrosswindChart(speedKt),
  };
}
