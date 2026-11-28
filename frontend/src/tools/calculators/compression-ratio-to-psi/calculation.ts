/**
 * CR → PSI — canonical pressure in psi.
 * Simplified: P_abs = r × P_atm
 * Polytropic: P_abs = P_atm × r^n
 * Gauge: P_g = P_abs − P_atm
 */

import type {
  CompressionModel,
  CompressionRatioToPsiInput,
  CompressionRatioToPsiResult,
  PressureUnit,
} from './types';

export const PSI_TO_KPA = 6.894757293;
export const ATM_TO_KPA = 101.325;

function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertPressure(
  value: number,
  from: PressureUnit,
  to: PressureUnit,
): number {
  if (from === to) return value;
  const toKpa: Record<PressureUnit, number> = {
    psi: PSI_TO_KPA,
    bar: 100,
    kPa: 1,
    MPa: 1000,
    Pa: 0.001,
    atm: ATM_TO_KPA,
  };
  return (value * toKpa[from]) / toKpa[to];
}

export function toPsi(value: number, unit: PressureUnit): number {
  return convertPressure(value, unit, 'psi');
}

export function fromPsi(psi: number, unit: PressureUnit): number {
  return convertPressure(psi, 'psi', unit);
}

export function normalizeCompressionRatio(
  numerator: number,
  denominator: number,
): number | null {
  if (
    ![numerator, denominator].every(Number.isFinite) ||
    !(numerator > 0) ||
    !(denominator > 0)
  ) {
    return null;
  }
  return numerator / denominator;
}

export function calculateSimplifiedCompressionPressure(
  ratio: number,
  atmPsi: number,
): number | null {
  if (!(ratio >= 1) || !(atmPsi > 0)) return null;
  return ratio * atmPsi;
}

export function calculatePolytropicCompressionPressure(
  ratio: number,
  atmPsi: number,
  n: number,
): number | null {
  if (!(ratio >= 1) || !(atmPsi > 0) || !Number.isFinite(n) || n <= 0) {
    return null;
  }
  return atmPsi * Math.pow(ratio, n);
}

export function calculateGaugePressure(
  absolutePsi: number,
  atmPsi: number,
): number | null {
  if (!(absolutePsi > 0) || !(atmPsi > 0)) return null;
  return absolutePsi - atmPsi;
}

export function calculateAbsolutePressure(
  gaugePsi: number,
  atmPsi: number,
): number | null {
  if (!Number.isFinite(gaugePsi) || !(atmPsi > 0)) return null;
  const abs = gaugePsi + atmPsi;
  if (!(abs > 0)) return null;
  return abs;
}

export function calculatePressureIncrease(
  absolutePsi: number,
  atmPsi: number,
): number | null {
  return calculateGaugePressure(absolutePsi, atmPsi);
}

export function calculateCompressionRatioFromPressure(
  absolutePsi: number,
  atmPsi: number,
  model: CompressionModel,
  n: number | null,
): number | null {
  if (!(absolutePsi > 0) || !(atmPsi > 0)) return null;
  if (!(absolutePsi >= atmPsi)) return null;
  if (model === 'simplified') {
    return absolutePsi / atmPsi;
  }
  if (n == null || !(n > 0)) return null;
  return Math.pow(absolutePsi / atmPsi, 1 / n);
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function pressureUnitSuffix(unit: PressureUnit, absolute: boolean): string {
  if (unit === 'psi') return absolute ? 'psia' : 'psig';
  return absolute ? `${unit} abs` : `${unit} gauge`;
}

export function calculateCompressionRatioToPsiFromInput(
  input: CompressionRatioToPsiInput,
): CompressionRatioToPsiResult | null {
  const atmRaw = parseNum(input.atmosphericPressure);
  if (atmRaw == null || !(atmRaw > 0)) return null;
  const atmPsi = toPsi(atmRaw, input.atmosphericPressureUnit);
  if (!(atmPsi > 0)) return null;

  let n: number | null = null;
  if (input.model === 'polytropic') {
    n = parseNum(input.polytropicExponent);
    if (n == null || !(n > 0)) return null;
  }

  const steps: string[] = [];
  let ratio: number;
  let absolutePsi: number;

  if (input.direction === 'ratioToPressure') {
    const x = parseNum(input.numerator);
    const y = parseNum(input.denominator);
    if (x == null || y == null) return null;
    const r = normalizeCompressionRatio(x, y);
    if (r == null || !(r >= 1)) return null;
    ratio = r;

    absolutePsi =
      input.model === 'simplified'
        ? calculateSimplifiedCompressionPressure(ratio, atmPsi)!
        : calculatePolytropicCompressionPressure(ratio, atmPsi, n!)!;

    steps.push(`r = X / Y = ${fmt(x)} / ${fmt(y)} = ${fmt(ratio, 4)}`);
    steps.push(`P_atm = ${fmt(atmPsi)} psia`);
    if (input.model === 'simplified') {
      steps.push('Simplified: P_abs = r × P_atm');
      steps.push(
        `P_abs = ${fmt(ratio, 4)} × ${fmt(atmPsi)} = ${fmt(absolutePsi)} psia`,
      );
    } else {
      steps.push(`Polytropic: P_abs = P_atm × r^n (n = ${fmt(n!, 3)})`);
      steps.push(
        `P_abs = ${fmt(atmPsi)} × ${fmt(ratio, 4)}^${fmt(n!, 3)} = ${fmt(absolutePsi)} psia`,
      );
    }
  } else {
    const pRaw = parseNum(input.compressionPressure);
    if (pRaw == null) return null;
    let pPsi = toPsi(pRaw, input.compressionPressureUnit);
    if (input.pressureReference === 'gauge') {
      const abs = calculateAbsolutePressure(pPsi, atmPsi);
      if (abs == null) return null;
      pPsi = abs;
      steps.push(
        `P_abs = P_gauge + P_atm = ${fmt(toPsi(pRaw, input.compressionPressureUnit))} + ${fmt(atmPsi)} = ${fmt(pPsi)} psia`,
      );
    } else {
      if (!(pPsi > 0)) return null;
      steps.push(`P_abs = ${fmt(pPsi)} psia (entered absolute)`);
    }
    absolutePsi = pPsi;
    const r = calculateCompressionRatioFromPressure(
      absolutePsi,
      atmPsi,
      input.model,
      n,
    );
    if (r == null || !(r >= 1)) return null;
    ratio = r;
    if (input.model === 'simplified') {
      steps.push(`r = P_abs / P_atm = ${fmt(absolutePsi)} / ${fmt(atmPsi)} = ${fmt(ratio, 4)}`);
    } else {
      steps.push(
        `r = (P_abs / P_atm)^(1/n) = (${fmt(absolutePsi)} / ${fmt(atmPsi)})^(1/${fmt(n!, 3)}) = ${fmt(ratio, 4)}`,
      );
    }
    steps.push(
      `Model-implied volume ratio ≈ ${fmt(ratio, 2)}:1 — not a verified geometric CR.`,
    );
  }

  const gaugePsi = calculateGaugePressure(absolutePsi, atmPsi);
  if (gaugePsi == null) return null;
  const increase = gaugePsi;
  const pressureRatio = absolutePsi / atmPsi;

  steps.push(
    `P_gauge = P_abs − P_atm = ${fmt(absolutePsi)} − ${fmt(atmPsi)} = ${fmt(gaugePsi)} psig`,
  );

  const displayAbs = fromPsi(absolutePsi, input.resultPressureUnit);
  const unitAbs = pressureUnitSuffix(input.resultPressureUnit, true);

  return {
    direction: input.direction,
    model: input.model,
    normalizedCompressionRatio: ratio,
    atmosphericPressurePsi: atmPsi,
    absolutePressurePsi: absolutePsi,
    gaugePressurePsi: gaugePsi,
    pressureIncreasePsi: increase,
    pressureRatio,
    polytropicExponent: n,
    formulaSteps: steps,
    interpretation:
      input.model === 'simplified'
        ? 'Simplified linear estimate (P = r × P_atm). Not a compression-tester prediction — real PSI depends on IVC timing, sealing, cranking speed, temperature, and more.'
        : 'Polytropic estimate (P = P_atm × rⁿ). Still idealized — not a diagnosis of engine condition or a substitute for a measured compression test.',
    formattedPrimary: `${fmt(displayAbs)} ${unitAbs}`,
    primaryLabel:
      input.direction === 'ratioToPressure'
        ? 'Absolute compression pressure (estimate)'
        : 'Model-implied compression ratio',
    resultPressureUnit: input.resultPressureUnit,
  };
}

export { fmt };
