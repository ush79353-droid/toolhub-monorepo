import {
  PSI_PER_BAR,
  STANDARD_ATMOSPHERIC_BAR,
  type BarToPsigInput,
  type BarToPsigResult,
} from './types';

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
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 100) digits = 6;
  else if (abs >= 1) digits = 10;
  else if (abs >= 1e-6) digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function absoluteBarToPsig(
  barAbsolute: number,
  atmosphericBar = STANDARD_ATMOSPHERIC_BAR,
): number {
  if (
    !Number.isFinite(barAbsolute) ||
    !Number.isFinite(atmosphericBar) ||
    barAbsolute < 0 ||
    atmosphericBar < 0
  ) {
    throw new Error('Invalid pressure value');
  }
  return (barAbsolute - atmosphericBar) * PSI_PER_BAR;
}

export function gaugeBarToPsig(barGauge: number): number {
  if (!Number.isFinite(barGauge)) {
    throw new Error('Invalid gauge pressure');
  }
  return barGauge * PSI_PER_BAR;
}

export function psigToAbsoluteBar(
  psig: number,
  atmosphericBar = STANDARD_ATMOSPHERIC_BAR,
): number {
  if (!Number.isFinite(psig) || !Number.isFinite(atmosphericBar) || atmosphericBar < 0) {
    throw new Error('Invalid pressure value');
  }
  const absoluteBar = psig / PSI_PER_BAR + atmosphericBar;
  if (absoluteBar < 0) {
    throw new Error('Resulting absolute pressure cannot be negative');
  }
  return absoluteBar;
}

export function psigToGaugeBar(psig: number): number {
  if (!Number.isFinite(psig)) {
    throw new Error('Invalid gauge pressure');
  }
  return psig / PSI_PER_BAR;
}

export function calculateBarToPsig(input: BarToPsigInput): BarToPsigResult {
  const atmosphericBar = input.atmosphericBar ?? STANDARD_ATMOSPHERIC_BAR;
  let bar: number;
  let psig: number;

  if (input.reference === 'absolute') {
    if (input.source === 'bar') {
      bar = input.bar!;
      psig = absoluteBarToPsig(bar, atmosphericBar);
    } else {
      psig = input.psig!;
      bar = psigToAbsoluteBar(psig, atmosphericBar);
    }
  } else if (input.source === 'bar') {
    bar = input.bar!;
    psig = gaugeBarToPsig(bar);
  } else {
    psig = input.psig!;
    bar = psigToGaugeBar(psig);
  }

  const explanation =
    input.reference === 'absolute'
      ? input.source === 'bar'
        ? `(${formatPressure(bar)} − ${formatPressure(atmosphericBar)}) × ${PSI_PER_BAR} = ${formatPressure(psig)} PSIG`
        : `${formatPressure(psig)} / ${PSI_PER_BAR} + ${formatPressure(atmosphericBar)} = ${formatPressure(bar)} bar(a)`
      : input.source === 'bar'
        ? `${formatPressure(bar)} × ${PSI_PER_BAR} = ${formatPressure(psig)} PSIG`
        : `${formatPressure(psig)} / ${PSI_PER_BAR} = ${formatPressure(bar)} bar(g)`;

  return {
    source: input.source,
    bar,
    psig,
    reference: input.reference,
    atmosphericBar,
    explanation,
  };
}

export function shareResultText(result: BarToPsigResult): string {
  const barLabel = result.reference === 'absolute' ? 'bar(a)' : 'bar(g)';
  return [
    'Bar to PSIG Converter | Omega Calculators',
    '',
    'Pressure reference:',
    result.reference === 'absolute' ? 'Absolute pressure' : 'Gauge pressure',
    '',
    'Input:',
    result.source === 'bar'
      ? `${formatPressure(result.bar)} ${barLabel}`
      : `${formatPressure(result.psig)} PSIG`,
    '',
    ...(result.reference === 'absolute'
      ? ['Atmospheric pressure:', `${formatPressure(result.atmosphericBar)} bar`, '']
      : []),
    'Result:',
    result.source === 'bar'
      ? `${formatPressure(result.psig)} PSIG`
      : `${formatPressure(result.bar)} ${barLabel}`,
    '',
    'Formula:',
    result.reference === 'absolute'
      ? `PSIG = (bar(a) − atmospheric pressure) × ${PSI_PER_BAR}`
      : `PSIG = bar(g) × ${PSI_PER_BAR}`,
    result.explanation,
  ].join('\n');
}
