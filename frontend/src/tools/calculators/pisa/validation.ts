import {
  DEFAULT_ALPHA_DEG,
  DISCLAIMER,
  SOURCE_LABEL,
  angleCorrectedPisaCm2,
  areaToDisplay,
  flowToDisplay,
  formatFixed,
  lengthToCm,
  orificeAreaCm2,
  regurgitantVolumeMl,
  speedToCmPerS,
  volumeToDisplay,
  volumeFlowRateMlPerS,
} from './calculation';
import type { PisaFieldErrors, PisaInput, PisaResult } from './types';

export interface PisaValidation {
  isValid: boolean;
  errors: PisaFieldErrors;
  result: PisaResult | null;
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

export function validatePisaInput(input: PisaInput): PisaValidation {
  const errors: PisaFieldErrors = {};

  const vmaxP = parseNumber(input.vmax);
  const rP = parseNumber(input.radius);
  const vrP = parseNumber(input.vr);
  const alphaP = parseNumber(input.alpha);
  const vtiP = parseNumber(input.vti);

  let vmaxCm: number | null = null;
  let rCm: number | null = null;
  let vrCm: number | null = null;
  let alphaDeg: number = DEFAULT_ALPHA_DEG;
  let vtiCm: number | null = null;

  if (!rP.blank) {
    if (rP.invalid || rP.value == null || rP.value <= 0) {
      errors.radius = 'Enter a positive PISA radius.';
    } else {
      rCm = lengthToCm(rP.value, input.radiusUnit);
      if (rCm == null || rCm <= 0) errors.radius = 'Enter a positive PISA radius.';
    }
  }

  if (!vrP.blank) {
    if (vrP.invalid || vrP.value == null || vrP.value <= 0) {
      errors.vr = 'Enter a positive aliasing speed (Vr).';
    } else {
      vrCm = speedToCmPerS(vrP.value, input.vrUnit);
      if (vrCm == null || vrCm <= 0) {
        errors.vr = 'Enter a positive aliasing speed (Vr).';
      }
    }
  }

  if (!alphaP.blank) {
    if (
      alphaP.invalid ||
      alphaP.value == null ||
      alphaP.value <= 0 ||
      alphaP.value > 180
    ) {
      errors.alpha = 'Enter α in degrees between 0 (exclusive) and 180.';
    } else {
      alphaDeg = alphaP.value;
    }
  }

  if (!vmaxP.blank) {
    if (vmaxP.invalid || vmaxP.value == null || vmaxP.value <= 0) {
      errors.vmax = 'Enter a positive Vmax (must be > 0 for orifice area).';
    } else {
      vmaxCm = speedToCmPerS(vmaxP.value, input.vmaxUnit);
      if (vmaxCm == null || vmaxCm <= 0) {
        errors.vmax = 'Enter a positive Vmax (must be > 0 for orifice area).';
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

  const pisa =
    rCm != null ? angleCorrectedPisaCm2(rCm, alphaDeg) : null;
  const vfr =
    pisa != null && vrCm != null ? volumeFlowRateMlPerS(pisa, vrCm) : null;
  const orifice =
    vfr != null && vmaxCm != null ? orificeAreaCm2(vfr, vmaxCm) : null;
  const rvol =
    orifice != null && vtiCm != null
      ? regurgitantVolumeMl(orifice, vtiCm)
      : null;

  if (pisa == null && vfr == null && orifice == null && rvol == null) {
    return { isValid: false, errors, result: null };
  }

  const parts: string[] = [];
  if (pisa != null) {
    parts.push(
      `PISA = 2πr²×(α/180) ≈ ${formatFixed(pisa, 3)} cm² (α=${formatFixed(alphaDeg, 0)}°${alphaP.blank ? ', blank→180°' : ''}).`
    );
  }
  if (vfr != null) {
    parts.push(`VFR = PISA×Vr ≈ ${formatFixed(vfr, 2)} mL/s.`);
  }
  if (orifice != null) {
    parts.push(
      `MVA/EROA = VFR/Vmax ≈ ${formatFixed(orifice, 3)} cm² (${formatFixed(orifice * 100, 1)} mm²).`
    );
  }
  if (rvol != null) {
    parts.push(`RVol = EROA×VTI ≈ ${formatFixed(rvol, 2)} mL/beat.`);
  }

  const result: PisaResult = {
    pisaCm2: pisa,
    vfrMlPerS: vfr,
    mvaCm2: orifice,
    eroaCm2: orifice,
    regurgitantVolumeMl: rvol,
    alphaUsedDeg: alphaDeg,
    formattedPisa:
      pisa != null ? formatFixed(areaToDisplay(pisa, input.pisaUnit), 3) : '',
    formattedVfr:
      vfr != null ? formatFixed(flowToDisplay(vfr, input.vfrUnit), 2) : '',
    formattedMva:
      orifice != null
        ? formatFixed(areaToDisplay(orifice, input.mvaUnit), 3)
        : '',
    formattedEroa:
      orifice != null
        ? formatFixed(areaToDisplay(orifice, input.eroaUnit), 2)
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
