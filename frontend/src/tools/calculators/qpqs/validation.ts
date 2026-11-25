import { calculateQpQs } from './calculation';
import type { QpQsFieldErrors, QpQsInput, QpQsResult } from './types';

export interface QpQsValidation {
  isValid: boolean;
  errors: QpQsFieldErrors;
  result: QpQsResult | null;
}

function finite(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

function positive(v: number): boolean {
  return v > 0;
}

export function validateQpQsInput(input: QpQsInput): QpQsValidation {
  const errors: QpQsFieldErrors = {};

  if (input.method === 'echo') {
    if (!finite(input.rvotDiameter)) errors.rvotDiameter = 'Required';
    else if (!positive(input.rvotDiameter))
      errors.rvotDiameter = 'Diameter must be greater than 0.';

    if (!finite(input.rvotVti)) errors.rvotVti = 'Required';
    else if (!positive(input.rvotVti))
      errors.rvotVti = 'VTI must be greater than 0.';

    if (!finite(input.lvotDiameter)) errors.lvotDiameter = 'Required';
    else if (!positive(input.lvotDiameter))
      errors.lvotDiameter = 'Diameter must be greater than 0.';

    if (!finite(input.lvotVti)) errors.lvotVti = 'Required';
    else if (!positive(input.lvotVti))
      errors.lvotVti = 'VTI must be greater than 0.';
  } else if (input.method === 'fick') {
    const fields: Array<{
      key: keyof QpQsFieldErrors;
      value: number | null;
      label: string;
    }> = [
      {
        key: 'systemicArterialContent',
        value: input.systemicArterialContent,
        label: 'Systemic arterial content',
      },
      {
        key: 'mixedVenousContent',
        value: input.mixedVenousContent,
        label: 'Mixed venous content',
      },
      {
        key: 'pulmonaryVenousContent',
        value: input.pulmonaryVenousContent,
        label: 'Pulmonary venous content',
      },
      {
        key: 'pulmonaryArterialContent',
        value: input.pulmonaryArterialContent,
        label: 'Pulmonary arterial content',
      },
    ];
    for (const { key, value, label } of fields) {
      if (!finite(value)) errors[key] = 'Required';
      else if (value < 0) errors[key] = `${label} cannot be negative.`;
    }

    if (
      finite(input.systemicArterialContent) &&
      finite(input.mixedVenousContent) &&
      input.systemicArterialContent <= input.mixedVenousContent
    ) {
      errors.form =
        'Systemic arterial O₂ content must exceed mixed venous content.';
    }

    if (
      finite(input.pulmonaryVenousContent) &&
      finite(input.pulmonaryArterialContent) &&
      input.pulmonaryVenousContent <= input.pulmonaryArterialContent
    ) {
      errors.form =
        'Pulmonary venous O₂ content must exceed pulmonary arterial content.';
    }

    const pulmonaryStep =
      finite(input.pulmonaryVenousContent) &&
      finite(input.pulmonaryArterialContent)
        ? input.pulmonaryVenousContent - input.pulmonaryArterialContent
        : null;
    if (pulmonaryStep !== null && pulmonaryStep === 0) {
      errors.form =
        'Pulmonary venous − arterial content must be non-zero (zero denominator).';
    }

    const systemicStep =
      finite(input.systemicArterialContent) &&
      finite(input.mixedVenousContent)
        ? input.systemicArterialContent - input.mixedVenousContent
        : null;
    if (systemicStep !== null && systemicStep === 0) {
      errors.form =
        'Systemic arterial − mixed venous content must be non-zero.';
    }
  } else {
    if (!finite(input.qpFlow)) errors.qpFlow = 'Required';
    else if (!positive(input.qpFlow))
      errors.qpFlow = 'Qp must be greater than 0.';

    if (!finite(input.qsFlow)) errors.qsFlow = 'Required';
    else if (!positive(input.qsFlow))
      errors.qsFlow = 'Qs must be greater than 0.';
  }

  const hasFieldErrors = Object.keys(errors).some((k) => k !== 'form');
  if (hasFieldErrors || errors.form) {
    if (!errors.form) {
      errors.form = 'Complete all required fields for the selected method.';
    }
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateQpQs(input),
  };
}