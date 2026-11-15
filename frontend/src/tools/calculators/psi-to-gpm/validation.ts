import {
  MAX_ABS_PRESSURE_PSI,
  MAX_DENSITY,
  MAX_DIAMETER_M,
  type PsiToGpmFieldErrors,
  type PsiToGpmInput,
} from './types';
import { psiToPascal, resolveGeometry } from './calculation';

/** Half-typed values such as `1.` stay incomplete. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  );
}

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function validatePsiToGpm(input: PsiToGpmInput): {
  isValid: boolean;
  errors: PsiToGpmFieldErrors;
} {
  const errors: PsiToGpmFieldErrors = {};

  if (input.inletPsi === null) {
    // blank inlet — not ready
  } else if (!Number.isFinite(input.inletPsi)) {
    errors.inlet = 'Enter a valid inlet pressure.';
  } else if (input.pressureReference === 'absolute' && input.inletPsi < 0) {
    errors.inlet = 'Absolute pressure cannot be negative.';
  } else if (Math.abs(input.inletPsi) > MAX_ABS_PRESSURE_PSI) {
    errors.inlet = 'Enter a smaller absolute pressure.';
  }

  if (input.outletPsi === null) {
    errors.outlet = 'Enter an exit pressure.';
  } else if (!Number.isFinite(input.outletPsi)) {
    errors.outlet = 'Enter a valid exit pressure.';
  } else if (input.pressureReference === 'absolute' && input.outletPsi < 0) {
    errors.outlet = 'Absolute pressure cannot be negative.';
  } else if (Math.abs(input.outletPsi) > MAX_ABS_PRESSURE_PSI) {
    errors.outlet = 'Enter a smaller absolute pressure.';
  }

  if (input.geometrySource === 'diameter') {
    if (input.diameterM === null) {
      // blank
    } else if (!Number.isFinite(input.diameterM) || input.diameterM <= 0) {
      errors.diameter = 'Pipe diameter must be greater than zero.';
    } else if (input.diameterM > MAX_DIAMETER_M) {
      errors.diameter = 'Enter a smaller diameter.';
    }
  } else if (input.areaM2 === null) {
    // blank
  } else if (!Number.isFinite(input.areaM2) || input.areaM2 <= 0) {
    errors.area = 'Flow area must be greater than zero.';
  }

  if (!Number.isFinite(input.densityKgM3) || input.densityKgM3 <= 0) {
    errors.density = 'Fluid density must be greater than zero.';
  } else if (input.densityKgM3 > MAX_DENSITY) {
    errors.density = 'Enter a smaller density.';
  }

  if (
    !Number.isFinite(input.dischargeCoefficient) ||
    input.dischargeCoefficient <= 0 ||
    input.dischargeCoefficient > 1.2
  ) {
    errors.cd = 'Discharge coefficient must be between 0 and 1.2 (ideal Cd = 1).';
  }

  const hasGeometry =
    input.geometrySource === 'diameter'
      ? input.diameterM !== null && !errors.diameter
      : input.areaM2 !== null && !errors.area;

  const pressuresOk =
    input.inletPsi !== null &&
    input.outletPsi !== null &&
    !errors.inlet &&
    !errors.outlet;

  if (pressuresOk && hasGeometry && !errors.density && !errors.cd) {
    const deltaP = psiToPascal(input.inletPsi!) - psiToPascal(input.outletPsi!);
    if (deltaP < 0) {
      errors.deltaP =
        'Inlet pressure must be at least the exit pressure for forward ideal flow.';
    } else {
      try {
        resolveGeometry(input);
      } catch {
        errors.diameter = 'Unable to resolve pipe geometry.';
      }
    }
  }

  const ready =
    pressuresOk &&
    hasGeometry &&
    !errors.density &&
    !errors.cd &&
    !errors.deltaP &&
    Object.keys(errors).length === 0;

  return { isValid: ready, errors };
}
