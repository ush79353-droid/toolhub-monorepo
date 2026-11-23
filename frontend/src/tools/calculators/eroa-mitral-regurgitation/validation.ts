import {
  eroaCm2,
  formatFixed,
  lengthToCm,
  pisaFlowMlPerS,
  regurgitantVolumeMl,
  speedToCmPerS,
  flowToDisplay,
  areaToDisplay,
  volumeToDisplay,
  SOURCE_LABEL,
  DISCLAIMER,
} from './calculation';
import type {
  EroaFieldErrors,
  EroaMitralRegurgitationInput,
  EroaMitralRegurgitationResult,
} from './types';

export interface EroaValidation {
  isValid: boolean;
  errors: EroaFieldErrors;
  result: EroaMitralRegurgitationResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateEroaInput(
  input: EroaMitralRegurgitationInput
): EroaValidation {
  const errors: EroaFieldErrors = {};

  const vaP = parseNumber(input.aliasingSpeed);
  const rP = parseNumber(input.radius);
  const vmaxP = parseNumber(input.maxVelocity);
  const vtiP = parseNumber(input.vti);

  let vaCm: number | null = null;
  let rCm: number | null = null;
  let vmaxCm: number | null = null;
  let vtiCm: number | null = null;

  if (!vaP.blank) {
    if (vaP.invalid || vaP.value == null || vaP.value <= 0) {
      errors.aliasingSpeed = 'Enter a positive aliasing speed.';
    } else {
      vaCm = speedToCmPerS(vaP.value, input.aliasingSpeedUnit);
      if (vaCm == null || vaCm <= 0) {
        errors.aliasingSpeed = 'Enter a positive aliasing speed.';
      }
    }
  }

  if (!rP.blank) {
    if (rP.invalid || rP.value == null || rP.value <= 0) {
      errors.radius = 'Enter a positive PISA radius.';
    } else {
      rCm = lengthToCm(rP.value, input.radiusUnit);
      if (rCm == null || rCm <= 0) errors.radius = 'Enter a positive PISA radius.';
    }
  }

  if (!vmaxP.blank) {
    if (vmaxP.invalid || vmaxP.value == null || vmaxP.value <= 0) {
      errors.maxVelocity = 'Enter a positive maximal MR velocity (Vmax > 0).';
    } else {
      vmaxCm = speedToCmPerS(vmaxP.value, input.maxVelocityUnit);
      if (vmaxCm == null || vmaxCm <= 0) {
        errors.maxVelocity = 'Enter a positive maximal MR velocity (Vmax > 0).';
      }
    }
  }

  if (!vtiP.blank) {
    if (vtiP.invalid || vtiP.value == null || vtiP.value <= 0) {
      errors.vti = 'Enter a positive velocity-time integral.';
    } else {
      vtiCm = lengthToCm(vtiP.value, input.vtiUnit);
      if (vtiCm == null || vtiCm <= 0) {
        errors.vti = 'Enter a positive velocity-time integral.';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const flow =
    rCm != null && vaCm != null ? pisaFlowMlPerS(rCm, vaCm) : null;
  const eroa =
    flow != null && vmaxCm != null ? eroaCm2(flow, vmaxCm) : null;
  const rvol =
    eroa != null && vtiCm != null ? regurgitantVolumeMl(eroa, vtiCm) : null;

  if (flow == null && eroa == null && rvol == null) {
    return { isValid: false, errors, result: null };
  }

  const parts: string[] = [];
  if (flow != null) {
    parts.push(
      `Flow = 2πr²Va ≈ ${formatFixed(flow, 2)} mL/s (hemispherical PISA).`
    );
  }
  if (eroa != null) {
    parts.push(`EROA = flow/Vmax ≈ ${formatFixed(eroa, 3)} cm².`);
  }
  if (rvol != null) {
    parts.push(`RVol = EROA×VTI ≈ ${formatFixed(rvol, 2)} mL/beat.`);
  }

  const result: EroaMitralRegurgitationResult = {
    flowMlPerS: flow,
    eroaCm2: eroa,
    regurgitantVolumeMl: rvol,
    formattedFlow:
      flow != null
        ? formatFixed(flowToDisplay(flow, input.flowUnit), 2)
        : '',
    formattedEroa:
      eroa != null
        ? formatFixed(areaToDisplay(eroa, input.eroaUnit), 3)
        : '',
    formattedRvol:
      rvol != null
        ? formatFixed(volumeToDisplay(rvol, input.rvolUnit), 2)
        : '',
    explanation: parts.join(' '),
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };

  return { isValid: true, errors, result };
}
