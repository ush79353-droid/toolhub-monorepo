import {
  CM_PER_INCH,
  INCHES_PER_FOOT,
  M_PER_INCH,
  type HeightInInchesInput,
  type HeightInInchesResult,
} from './types';

/** Readable length display without ugly trailing zeros. */
export function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 6;
  if (abs >= 1_000_000) digits = 2;
  else if (abs >= 1) digits = 6;
  else if (abs >= 1e-6) digits = 10;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function totalInchesFromFeetInches(feet: number, inches: number): number {
  return feet * INCHES_PER_FOOT + inches;
}

/** Split total inches into whole feet and remaining inches. Excess inches carry into feet. */
export function normalizeFeetInches(totalInches: number): { feet: number; inches: number } {
  if (!Number.isFinite(totalInches) || totalInches === 0) {
    return { feet: 0, inches: 0 };
  }
  const feet = Math.floor(totalInches / INCHES_PER_FOOT);
  const inches = totalInches - feet * INCHES_PER_FOOT;
  return { feet, inches };
}

export function inchesFromCentimeters(cm: number): number {
  return cm / CM_PER_INCH;
}

export function centimetersFromInches(inches: number): number {
  return inches * CM_PER_INCH;
}

export function inchesFromMeters(meters: number): number {
  return meters / M_PER_INCH;
}

export function metersFromInches(inches: number): number {
  return inches * M_PER_INCH;
}

function buildExplanation(feet: number, inches: number, totalInches: number, cm: number, meters: number): string {
  const ftPart = formatLength(feet);
  const inPart = formatLength(inches);
  const total = formatLength(totalInches);
  return [
    `${ftPart} ft ${inPart} in`,
    `(${ftPart} × 12) + ${inPart} = ${total} in`,
    `${total} × 2.54 = ${formatLength(cm)} cm`,
    `${total} × 0.0254 = ${formatLength(meters)} m`,
  ].join('\n');
}

export function calculateHeightInInches(input: HeightInInchesInput): HeightInInchesResult {
  let totalInches: number;

  if (input.source === 'feetInches') {
    const feet = input.feet ?? 0;
    const inches = input.inches ?? 0;
    totalInches = totalInchesFromFeetInches(feet, inches);
  } else if (input.source === 'totalInches') {
    totalInches = input.totalInches!;
  } else if (input.source === 'centimeters') {
    totalInches = inchesFromCentimeters(input.centimeters!);
  } else {
    totalInches = inchesFromMeters(input.meters!);
  }

  const { feet, inches } = normalizeFeetInches(totalInches);
  const centimeters = centimetersFromInches(totalInches);
  const meters = metersFromInches(totalInches);

  return {
    source: input.source,
    feet,
    inches,
    totalInches,
    centimeters,
    meters,
    explanation: buildExplanation(feet, inches, totalInches, centimeters, meters),
  };
}
