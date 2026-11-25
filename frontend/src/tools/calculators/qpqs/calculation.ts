import { DISCLAIMER, SOURCE_LABEL } from './content';
import type {
  DiameterUnit,
  FlowUnit,
  QpQsInput,
  QpQsMethod,
  QpQsResult,
} from './types';

export { DISCLAIMER, SOURCE_LABEL };

export function diameterToCm(value: number, unit: DiameterUnit): number {
  return unit === 'cm' ? value : value / 10;
}

export function flowToLMin(value: number, unit: FlowUnit): number {
  return unit === 'L_min' ? value : value / 1000;
}

export function formatQpQsRatio(ratio: number): string {
  const rounded = Math.round(ratio * 1000) / 1000;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(rounded);
}

const METHOD_LABELS: Record<QpQsMethod, string> = {
  echo: 'Echocardiography (RVOT/LVOT)',
  fick: 'Fick (oxygen content)',
  direct: 'Direct Qp and Qs',
};

/**
 * Echo proxy: Qp/Qs = (RVOT Ø² × RVOT VTI) / (LVOT Ø² × LVOT VTI)
 * after converting diameters to the same length unit (cm). π cancels in the ratio.
 */
export function calculateEchoQpQs(input: QpQsInput): number {
  const rvotD = diameterToCm(
    input.rvotDiameter as number,
    input.rvotDiameterUnit,
  );
  const lvotD = diameterToCm(
    input.lvotDiameter as number,
    input.lvotDiameterUnit,
  );
  const rvotVti = input.rvotVti as number;
  const lvotVti = input.lvotVti as number;
  const numerator = rvotD * rvotD * rvotVti;
  const denominator = lvotD * lvotD * lvotVti;
  return numerator / denominator;
}

/** Fick content step-up ratio per mission spec (systemic − mixed) / (pulmonary vein − pulmonary artery). */
export function calculateFickQpQs(input: QpQsInput): number {
  const systemicStep =
    (input.systemicArterialContent as number) -
    (input.mixedVenousContent as number);
  const pulmonaryStep =
    (input.pulmonaryVenousContent as number) -
    (input.pulmonaryArterialContent as number);
  return systemicStep / pulmonaryStep;
}

export function calculateDirectQpQs(input: QpQsInput): number {
  const qp = flowToLMin(input.qpFlow as number, input.flowUnit);
  const qs = flowToLMin(input.qsFlow as number, input.flowUnit);
  return qp / qs;
}

export function calculateQpQs(input: QpQsInput): QpQsResult {
  let ratio: number;
  let detail: string;

  if (input.method === 'echo') {
    ratio = calculateEchoQpQs(input);
    detail =
      'Stroke-volume proxy from RVOT and LVOT (diameter² × VTI). Diameters normalized to cm before squaring.';
  } else if (input.method === 'fick') {
    ratio = calculateFickQpQs(input);
    detail =
      '(Systemic arterial − mixed venous O₂ content) ÷ (pulmonary venous − pulmonary arterial O₂ content).';
  } else {
    ratio = calculateDirectQpQs(input);
    detail = 'Qp ÷ Qs using matched flow units.';
  }

  const rounded = Math.round(ratio * 1000) / 1000;

  return {
    qpQsRatio: rounded,
    formattedRatio: formatQpQsRatio(rounded),
    methodLabel: METHOD_LABELS[input.method],
    explanation: `${METHOD_LABELS[input.method]}: ${detail} Qp/Qs = ${formatQpQsRatio(rounded)}.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}