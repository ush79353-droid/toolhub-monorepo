import {
  calculateCompressionFromInput,
  toMm,
} from './calculation';
import type {
  CompressionFieldErrors,
  CompressionRatioInput,
  CompressionRatioResult,
} from './types';

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

export interface CompressionValidation {
  isValid: boolean;
  errors: CompressionFieldErrors;
  result: CompressionRatioResult | null;
}

function hasErrors(errors: CompressionFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: CompressionRatioInput,
): CompressionFieldErrors {
  const errors: CompressionFieldErrors = {};

  if (input.mode === 'engineGeometry') {
    const n = parseNumber(input.cylinders);
    if (!n.blank) {
      if (
        n.invalid ||
        n.value == null ||
        !Number.isInteger(n.value) ||
        n.value < 1
      ) {
        errors.cylinders =
          'Number of cylinders must be a positive whole number.';
      }
    }

    const bore = parseNumber(input.bore);
    if (!bore.blank) {
      if (bore.invalid || bore.value == null || !(bore.value > 0)) {
        errors.bore = 'Bore diameter must be greater than zero.';
      }
    }

    const stroke = parseNumber(input.stroke);
    if (!stroke.blank) {
      if (stroke.invalid || stroke.value == null || !(stroke.value > 0)) {
        errors.stroke = 'Piston stroke must be greater than zero.';
      }
    }

    const chamber = parseNumber(input.chamberVolume);
    if (!chamber.blank) {
      if (chamber.invalid || chamber.value == null || chamber.value < 0) {
        errors.chamberVolume = 'Combustion chamber volume cannot be negative.';
      }
    }

    const gt = parseNumber(input.gasketThickness);
    if (!gt.blank && (gt.invalid || (gt.value != null && gt.value < 0))) {
      errors.gasketThickness = 'Please enter a valid numerical value.';
    }

    if (!input.useBoreForGasket) {
      const gb = parseNumber(input.gasketBore);
      if (!gb.blank && (gb.invalid || gb.value == null || !(gb.value > 0))) {
        errors.gasketBore = 'Bore diameter must be greater than zero.';
      }
    }

    if (input.enableDynamic) {
      const rod = parseNumber(input.rodLength);
      const stroke = parseNumber(input.stroke);
      if (!rod.blank) {
        if (rod.invalid || rod.value == null || !(rod.value > 0)) {
          errors.rodLength =
            'Connecting rod length is not physically valid for this stroke.';
        } else if (
          stroke.value != null &&
          stroke.value > 0 &&
          !stroke.invalid
        ) {
          const rodMm = toMm(rod.value, input.rodLengthUnit);
          const strokeMm = toMm(stroke.value, input.strokeUnit);
          if (!(rodMm > strokeMm / 2)) {
            errors.rodLength =
              'Connecting rod length is not physically valid for this stroke.';
          }
        }
      }
      const ivc = parseNumber(input.ivcAbdc);
      if (!ivc.blank) {
        if (
          ivc.invalid ||
          ivc.value == null ||
          ivc.value < 0 ||
          ivc.value >= 180
        ) {
          errors.ivcAbdc =
            'Please enter an intake valve closing angle within the supported range.';
        }
      }
    }
  }

  if (input.mode === 'knownVolumes') {
    const vs = parseNumber(input.displacementVolume);
    if (!vs.blank && (vs.invalid || vs.value == null || !(vs.value > 0))) {
      errors.displacementVolume = 'Please enter a valid numerical value.';
    }
    const vc = parseNumber(input.compressedVolume);
    if (!vc.blank && (vc.invalid || vc.value == null || !(vc.value > 0))) {
      errors.compressedVolume =
        'Total clearance volume must be greater than zero.';
    }
  }

  if (input.mode === 'clearanceFromRatio') {
    const vs = parseNumber(input.displacementVolume);
    if (!vs.blank && (vs.invalid || vs.value == null || !(vs.value > 0))) {
      errors.displacementVolume = 'Please enter a valid numerical value.';
    }
    const cr = parseNumber(input.targetCR);
    if (!cr.blank) {
      if (cr.invalid || cr.value == null || !(cr.value > 1)) {
        errors.targetCR = 'Compression ratio must be greater than 1.';
      }
    }
  }

  return errors;
}

export function validateCompressionInputs(
  input: CompressionRatioInput,
): CompressionValidation {
  const errors = collectFieldErrors(input);

  if (input.mode === 'engineGeometry') {
    if (parseNumber(input.bore).blank || parseNumber(input.stroke).blank) {
      return { isValid: false, errors, result: null };
    }
    if (parseNumber(input.chamberVolume).blank) {
      return { isValid: false, errors, result: null };
    }
    if (parseNumber(input.cylinders).blank) {
      errors.cylinders =
        'Number of cylinders must be a positive whole number.';
      return { isValid: false, errors, result: null };
    }
    if (!input.useBoreForGasket && parseNumber(input.gasketBore).blank) {
      return { isValid: false, errors, result: null };
    }
  } else if (input.mode === 'knownVolumes') {
    if (
      parseNumber(input.displacementVolume).blank ||
      parseNumber(input.compressedVolume).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  } else {
    if (
      parseNumber(input.displacementVolume).blank ||
      parseNumber(input.targetCR).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCompressionFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Clearance volume must be greater than zero. Check the chamber, gasket, deck, and piston volume inputs.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
