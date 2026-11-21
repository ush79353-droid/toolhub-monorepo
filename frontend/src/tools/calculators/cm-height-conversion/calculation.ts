import {
  CM_PER_FOOT,
  CM_PER_INCH,
  CM_PER_METER,
  INCHES_PER_FOOT,
  LENGTH_TO_CM,
  MM_PER_CM,
  type CmHeightInput,
  type CmHeightResult,
  type HeightUnit,
} from './types';

/** Readable length display without ugly trailing zeros. */
export function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e')
      .replace(/e\+?/i, 'e');
  }

  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 10;
  else digits = 12;

  const rounded = Number(value.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

/** Friendly inches for mixed height labels (e.g. 8.90). */
export function formatInchesFriendly(inches: number): string {
  if (!Number.isFinite(inches)) return '';
  if (Object.is(inches, -0) || inches === 0) return '0';
  const rounded = Number(inches.toFixed(2));
  return String(rounded);
}

export function convertHeight(value: number, from: HeightUnit, to: HeightUnit): number {
  const centimeters = value * LENGTH_TO_CM[from];
  return centimeters / LENGTH_TO_CM[to];
}

export function feetAndInchesToCm(feet: number, inches: number): number {
  return feet * CM_PER_FOOT + inches * CM_PER_INCH;
}

export function cmToFeetAndInches(cm: number): { feet: number; inches: number } {
  if (!Number.isFinite(cm) || cm === 0) return { feet: 0, inches: 0 };
  const totalInches = cm / CM_PER_INCH;
  let feet = Math.floor(totalInches / INCHES_PER_FOOT);
  let inches = totalInches - feet * INCHES_PER_FOOT;
  // Floating-point guard: rem extremely close to 12 → next foot.
  if (inches >= INCHES_PER_FOOT - 1e-12) {
    feet += 1;
    inches = 0;
  }
  return { feet, inches };
}

export function millimetersToInches(mm: number): number {
  return convertHeight(mm, 'mm', 'in');
}

export function centimetersToInches(cm: number): number {
  return convertHeight(cm, 'cm', 'in');
}

export function metersToInches(meters: number): number {
  return convertHeight(meters, 'm', 'in');
}

export function inchesToCentimeters(inches: number): number {
  return convertHeight(inches, 'in', 'cm');
}

export function inchesToMeters(inches: number): number {
  return convertHeight(inches, 'in', 'm');
}

function buildExplanation(result: Omit<CmHeightResult, 'explanation' | 'mixedLabel'>): string {
  return [
    `${formatLength(result.centimeters)} cm`,
    `≈ ${formatLength(result.feet)} ft ${formatInchesFriendly(result.inches)} in`,
    `${formatLength(result.meters)} m · ${formatLength(result.millimeters)} mm`,
    `${formatLength(result.totalInches)} in · ${formatLength(result.decimalFeet)} decimal ft`,
  ].join('\n');
}

export function calculateCmHeight(input: CmHeightInput): CmHeightResult {
  let centimeters: number;

  if (input.source === 'centimeters') {
    centimeters = input.centimeters!;
  } else if (input.source === 'feetInches') {
    centimeters = feetAndInchesToCm(input.feet ?? 0, input.inches ?? 0);
  } else if (input.source === 'meters') {
    centimeters = input.meters! * CM_PER_METER;
  } else if (input.source === 'millimeters') {
    centimeters = input.millimeters! / MM_PER_CM;
  } else if (input.source === 'totalInches') {
    centimeters = input.totalInches! * CM_PER_INCH;
  } else {
    centimeters = input.decimalFeet! * CM_PER_FOOT;
  }

  const { feet, inches } = cmToFeetAndInches(centimeters);
  const meters = centimeters / CM_PER_METER;
  const millimeters = centimeters * MM_PER_CM;
  const totalInches = centimeters / CM_PER_INCH;
  const decimalFeet = centimeters / CM_PER_FOOT;
  const mixedLabel = `${formatLength(feet)} ft ${formatInchesFriendly(inches)} in`;

  const base = {
    source: input.source,
    centimeters,
    feet,
    inches,
    meters,
    millimeters,
    totalInches,
    decimalFeet,
  };

  return {
    ...base,
    mixedLabel,
    explanation: buildExplanation(base),
  };
}

export function shareResultText(result: CmHeightResult): string {
  return [
    'CM Height Conversion Calculator | Omega Calculators',
    '',
    `${formatLength(result.centimeters)} cm ≈ ${result.mixedLabel}`,
    `${formatLength(result.centimeters)} cm = ${formatLength(result.meters)} m`,
    `${formatLength(result.centimeters)} cm = ${formatLength(result.millimeters)} mm`,
  ].join('\n');
}
