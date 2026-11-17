import {
  KGFCM2_TO_PSI,
  PASCALS_PER_KGFCM2,
  PASCALS_PER_PSI,
  type KgCmToPsiInput,
} from './types';

export { KGFCM2_TO_PSI, PASCALS_PER_KGFCM2, PASCALS_PER_PSI };

/** Readable pressure display without ugly trailing zeros. */
export function formatPressure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  const raw = String(rounded);
  if (raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function kgfCm2ToPsi(kgfCm2: number): number {
  return kgfCm2 * KGFCM2_TO_PSI;
}

export function psiToKgfCm2(psi: number): number {
  return psi / KGFCM2_TO_PSI;
}

export interface KgCmToPsiResult {
  source: 'kgfCm2' | 'psi';
  kgfCm2: number;
  psi: number;
  explanation: string;
}

export function calculateKgCmToPsi(input: KgCmToPsiInput): KgCmToPsiResult {
  let kgfCm2: number;
  let psi: number;

  if (input.source === 'kgfCm2') {
    kgfCm2 = input.kgfCm2!;
    psi = kgfCm2ToPsi(kgfCm2);
  } else {
    psi = input.psi!;
    kgfCm2 = psiToKgfCm2(psi);
  }

  const explanation =
    input.source === 'kgfCm2'
      ? `${formatPressure(kgfCm2)} kgf/cm² × ${formatPressure(KGFCM2_TO_PSI)} ≈ ${formatPressure(psi)} psi`
      : `${formatPressure(psi)} psi ÷ ${formatPressure(KGFCM2_TO_PSI)} ≈ ${formatPressure(kgfCm2)} kgf/cm²`;

  return { source: input.source, kgfCm2, psi, explanation };
}

export function shareResultText(result: KgCmToPsiResult): string {
  return [
    'kg/cm² to PSI Converter',
    'Omega Calculators',
    '',
    `${formatPressure(result.kgfCm2)} kgf/cm² ≈ ${formatPressure(result.psi)} psi`,
    '',
    'Formula:',
    `psi = kgf/cm² × ${formatPressure(KGFCM2_TO_PSI)}`,
    result.explanation,
    '',
    'Calculator:',
    '/tools/kgcm-to-psi-converter',
  ].join('\n');
}
