import {
  degreesToGradians,
  degreesToRadians,
  degreesToTurns,
  formatAngleDisplay,
  fromRadians,
  radiansToDegrees,
} from '../angle-conversion/calculation';
import {
  EXTRA_ANGLE_FIELDS,
  type ExtraAngleField,
  type RadiansToDegreesInput,
  type RadiansToDegreesResult,
} from './types';

export {
  degreesToRadians,
  formatAngleDisplay,
  radiansToDegrees,
} from '../angle-conversion/calculation';

export function formatAngleValue(value: number): string {
  return formatAngleDisplay(value);
}

/** Common exact π labels keyed by degrees. */
const PI_LABEL_BY_DEGREES: ReadonlyArray<{ degrees: number; label: string }> = [
  { degrees: 0, label: '0' },
  { degrees: 15, label: 'π/12' },
  { degrees: 30, label: 'π/6' },
  { degrees: 45, label: 'π/4' },
  { degrees: 60, label: 'π/3' },
  { degrees: 90, label: 'π/2' },
  { degrees: 120, label: '2π/3' },
  { degrees: 135, label: '3π/4' },
  { degrees: 180, label: 'π' },
  { degrees: 270, label: '3π/2' },
  { degrees: 360, label: '2π' },
];

export function piLabelForDegrees(degrees: number): string | null {
  if (!Number.isFinite(degrees)) return null;
  for (const row of PI_LABEL_BY_DEGREES) {
    if (Math.abs(degrees - row.degrees) <= 1e-9) return row.label;
    if (Math.abs(degrees + row.degrees) <= 1e-9 && row.degrees !== 0) {
      return `−${row.label}`;
    }
  }
  return null;
}

export function extrasFromRadians(radians: number): Record<ExtraAngleField, number> {
  const degrees = radiansToDegrees(radians);
  return {
    gradians: degreesToGradians(degrees),
    turns: degreesToTurns(degrees),
    arcminutes: fromRadians(radians, 'arcminutes'),
    arcseconds: fromRadians(radians, 'arcseconds'),
    milliradians: radians * 1000,
  };
}

export function radiansFromExtra(value: number, unit: ExtraAngleField): number {
  switch (unit) {
    case 'gradians':
      return degreesToRadians(value * 0.9);
    case 'turns':
      return value * 2 * Math.PI;
    case 'arcminutes':
      return degreesToRadians(value / 60);
    case 'arcseconds':
      return degreesToRadians(value / 3600);
    case 'milliradians':
      return value / 1000;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function calculateRadiansToDegrees(
  input: RadiansToDegreesInput,
): RadiansToDegreesResult {
  if (input.value === null) {
    throw new Error('Missing angle value');
  }

  let radians: number;
  let degrees: number;

  if (input.source === 'radians') {
    radians = input.value;
    degrees = radiansToDegrees(radians);
  } else if (input.source === 'degrees') {
    degrees = input.value;
    radians = degreesToRadians(degrees);
  } else {
    radians = radiansFromExtra(input.value, input.source);
    degrees = radiansToDegrees(radians);
  }

  return {
    source: input.source,
    degrees,
    radians,
    extras: extrasFromRadians(radians),
    piLabel: piLabelForDegrees(degrees),
  };
}

export function shareResultText(result: RadiansToDegreesResult): string {
  const lines = [
    'Radians to Degrees Converter',
    'Omega Calculators',
    '',
    `${formatAngleValue(result.radians)} rad = ${formatAngleValue(result.degrees)}°`,
  ];
  if (result.piLabel) {
    lines.push(`π form: ${result.piLabel}`);
  }
  lines.push('', '/tools/radians-to-degrees-converter');
  return lines.join('\n');
}

export const RADIANS_DEGREES_TABLE: readonly {
  radiansLabel: string;
  degrees: number;
}[] = [
  { radiansLabel: '0', degrees: 0 },
  { radiansLabel: 'π/12', degrees: 15 },
  { radiansLabel: 'π/6', degrees: 30 },
  { radiansLabel: 'π/4', degrees: 45 },
  { radiansLabel: 'π/3', degrees: 60 },
  { radiansLabel: 'π/2', degrees: 90 },
  { radiansLabel: '2π/3', degrees: 120 },
  { radiansLabel: '3π/4', degrees: 135 },
  { radiansLabel: 'π', degrees: 180 },
  { radiansLabel: '3π/2', degrees: 270 },
  { radiansLabel: '2π', degrees: 360 },
] as const;

/** Ensure EXTRA_ANGLE_FIELDS stays in sync with extrasFromRadians. */
void EXTRA_ANGLE_FIELDS;
