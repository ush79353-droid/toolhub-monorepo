import { HARD_STEEL_ROWS, SOFT_STEEL_ROWS } from './reference-data';
import {
  HARDNESS_REFERENCE,
  HARDNESS_SCALES,
  type HardnessConversionResult,
  type HardnessMaterial,
  type HardnessRow,
  type HardnessScale,
} from './types';

function lerp(x: number, x1: number, x2: number, y1: number, y2: number): number {
  if (x1 === x2) return y1;
  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
}

/** Round converted hardness to nearest whole number (ASTM E29-style for converted values). */
export function roundHardness(value: number): number {
  return Math.round(value);
}

export function formatHardness(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return String(roundHardness(value));
}

function rowsWithScale(rows: readonly HardnessRow[], scale: HardnessScale): HardnessRow[] {
  return rows.filter((row) => row[scale] != null);
}

function interpolateRow(
  rows: readonly HardnessRow[],
  scale: HardnessScale,
  value: number,
): HardnessRow | null {
  const defined = rowsWithScale(rows, scale);
  if (defined.length < 2 && defined.length === 1) {
    const only = defined[0]![scale]!;
    if (Math.abs(only - value) < 1e-9) return { ...defined[0]! };
    return null;
  }
  if (defined.length < 2) return null;

  const sorted = [...defined].sort((a, b) => a[scale]! - b[scale]!);
  const min = sorted[0]![scale]!;
  const max = sorted[sorted.length - 1]![scale]!;
  if (value < min - 1e-9 || value > max + 1e-9) return null;

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!;
    const b = sorted[i + 1]!;
    const x1 = a[scale]!;
    const x2 = b[scale]!;
    if (value < x1 - 1e-9 || value > x2 + 1e-9) continue;
    if (Math.abs(value - x1) < 1e-9) return { ...a };
    if (Math.abs(value - x2) < 1e-9) return { ...b };

    const out: HardnessRow = { HBW: null, HRB: null, HRC: null, HV: null };
    for (const key of HARDNESS_SCALES) {
      const y1 = a[key];
      const y2 = b[key];
      if (y1 == null || y2 == null) {
        out[key] = null;
      } else {
        out[key] = lerp(value, x1, x2, y1, y2);
      }
    }
    out[scale] = value;
    return out;
  }
  return null;
}

function emptyConverted(source: HardnessScale, value: number): Record<HardnessScale, number | null> {
  return {
    HBW: source === 'HBW' ? value : null,
    HRB: source === 'HRB' ? value : null,
    HRC: source === 'HRC' ? value : null,
    HV: source === 'HV' ? value : null,
  };
}

function finalizeRow(
  row: HardnessRow,
  source: HardnessScale,
  value: number,
): Record<HardnessScale, number | null> {
  const out = emptyConverted(source, value);
  for (const key of HARDNESS_SCALES) {
    if (key === source) {
      out[key] = value;
      continue;
    }
    const raw = row[key];
    out[key] = raw == null ? null : roundHardness(raw);
  }
  return out;
}

/**
 * Convert within non-austenitic steel soft (HRB) or hard (HRC) educational tables.
 * Soft and hard regimes are not merged into one continuum.
 */
export function convertHardness(opts: {
  value: number;
  scale: HardnessScale;
  material: HardnessMaterial;
}): HardnessConversionResult {
  const warnings: string[] = [
    'Hardness conversions are approximate and material-specific. They do not replace direct testing.',
  ];

  if (opts.material !== 'nonAusteniticSteel') {
    return {
      sourceScale: opts.scale,
      sourceValue: opts.value,
      material: opts.material,
      converted: emptyConverted(opts.scale, opts.value),
      reference: HARDNESS_REFERENCE,
      isApproximate: true,
      warnings: [
        ...warnings,
        'No verified conversion is available for this hardness value and material under the selected reference.',
      ],
    };
  }

  let row: HardnessRow | null = null;

  if (opts.scale === 'HRB') {
    row = interpolateRow(SOFT_STEEL_ROWS, 'HRB', opts.value);
    // Overlap: HRB ~98 appears on the hard table at HRC 20
    if (!row) row = interpolateRow(HARD_STEEL_ROWS, 'HRB', opts.value);
  } else if (opts.scale === 'HRC') {
    row = interpolateRow(HARD_STEEL_ROWS, 'HRC', opts.value);
  } else if (opts.scale === 'HBW' || opts.scale === 'HV') {
    // Prefer hard regime when the source value falls in that table; else soft.
    row = interpolateRow(HARD_STEEL_ROWS, opts.scale, opts.value);
    if (!row) row = interpolateRow(SOFT_STEEL_ROWS, opts.scale, opts.value);
  }

  if (!row) {
    return {
      sourceScale: opts.scale,
      sourceValue: opts.value,
      material: opts.material,
      converted: emptyConverted(opts.scale, opts.value),
      reference: HARDNESS_REFERENCE,
      isApproximate: true,
      warnings: [
        ...warnings,
        'No verified conversion is available for this hardness value and material under the selected reference.',
      ],
    };
  }

  return {
    sourceScale: opts.scale,
    sourceValue: opts.value,
    material: opts.material,
    converted: finalizeRow(row, opts.scale, opts.value),
    reference: HARDNESS_REFERENCE,
    isApproximate: true,
    warnings,
  };
}

export function shareResultText(result: HardnessConversionResult): string {
  const lines = [
    'Hardness Conversion Calculator — Omega Calculators',
    '',
    `Input: ${result.sourceValue} ${result.sourceScale}`,
    'Material: Non-austenitic steel',
    '',
    'Estimated equivalents:',
  ];
  for (const scale of HARDNESS_SCALES) {
    const v = result.converted[scale];
    lines.push(
      `  ${scale}: ${v == null ? 'Not available' : String(roundHardness(v))}`,
    );
  }
  lines.push('', result.reference, '', 'Calculated with Omega Calculators');
  return lines.join('\n');
}
