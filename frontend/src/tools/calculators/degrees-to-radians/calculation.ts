import {
  degreesToRadians,
  formatAngleDisplay,
  radiansToDegrees,
} from '../angle-conversion/calculation';
import type { DegreesToRadiansInput, DegreesToRadiansResult } from './types';

export { degreesToRadians, radiansToDegrees } from '../angle-conversion/calculation';

export function formatAngleValue(value: number): string {
  return formatAngleDisplay(value);
}

/** Common exact π labels keyed by degrees (within a tiny tolerance of Math.PI scaling). */
const PI_LABEL_BY_DEGREES: ReadonlyArray<{ degrees: number; label: string }> = [
  { degrees: 0, label: '0' },
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

export function calculateDegreesToRadians(input: DegreesToRadiansInput): DegreesToRadiansResult {
  if (input.value === null) {
    throw new Error('Missing angle value');
  }
  if (input.source === 'degrees') {
    const degrees = input.value;
    const radians = degreesToRadians(degrees);
    return {
      source: 'degrees',
      degrees,
      radians,
      piLabel: piLabelForDegrees(degrees),
    };
  }
  const radians = input.value;
  const degrees = radiansToDegrees(radians);
  return {
    source: 'radians',
    degrees,
    radians,
    piLabel: piLabelForDegrees(degrees),
  };
}

export function shareResultText(result: DegreesToRadiansResult): string {
  const lines = [
    'Degrees to Radians Converter | Omega Calculators',
    '',
    `Degrees: ${formatAngleValue(result.degrees)}°`,
    `Radians: ${formatAngleValue(result.radians)} rad`,
  ];
  if (result.piLabel) {
    lines.push(`π form: ${result.piLabel}`);
  }
  lines.push(
    '',
    'Formula:',
    result.source === 'degrees'
      ? 'Radians = Degrees × π / 180'
      : 'Degrees = Radians × 180 / π',
  );
  return lines.join('\n');
}

export const DEGREES_RADIANS_TABLE: readonly {
  degrees: number;
  piLabel: string;
}[] = [
  { degrees: 0, piLabel: '0' },
  { degrees: 30, piLabel: 'π/6' },
  { degrees: 45, piLabel: 'π/4' },
  { degrees: 60, piLabel: 'π/3' },
  { degrees: 90, piLabel: 'π/2' },
  { degrees: 120, piLabel: '2π/3' },
  { degrees: 135, piLabel: '3π/4' },
  { degrees: 180, piLabel: 'π' },
  { degrees: 270, piLabel: '3π/2' },
  { degrees: 360, piLabel: '2π' },
] as const;
