import {
  ASTM_E11_BY_DESIGNATION,
  MAX_ABS_VALUE,
  type MeshToMicronFieldErrors,
  type MeshToMicronInput,
} from './types';
import { pitchMm, wireToMm } from './calculation';

export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.')
  );
}

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function validateMeshToMicron(input: MeshToMicronInput): {
  isValid: boolean;
  errors: MeshToMicronFieldErrors;
} {
  const errors: MeshToMicronFieldErrors = {};

  if (input.mode === 'standard') {
    if (!ASTM_E11_BY_DESIGNATION[input.sieveDesignation]) {
      errors.sieve = 'Select a supported ASTM E11 sieve designation.';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  if (input.mode === 'reverse') {
    const um = input.reverseUm;
    if (um === null) return { isValid: false, errors };
    if (!Number.isFinite(um)) errors.reverseUm = 'Enter a valid opening in micrometers.';
    else if (um < 0) errors.reverseUm = 'Opening cannot be negative.';
    else if (um > MAX_ABS_VALUE) errors.reverseUm = 'Enter a smaller value.';
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  // Custom mode.
  const mesh = input.meshCount;
  const wire = input.wireDiameter;
  let blank = false;

  if (mesh === null) blank = true;
  else if (!Number.isFinite(mesh)) errors.meshCount = 'Enter a valid mesh count.';
  else if (mesh <= 0) errors.meshCount = 'Mesh count must be greater than zero.';
  else if (mesh > MAX_ABS_VALUE) errors.meshCount = 'Enter a smaller mesh count.';

  if (wire === null) blank = true;
  else if (!Number.isFinite(wire)) errors.wireDiameter = 'Enter a valid wire diameter.';
  else if (wire < 0) errors.wireDiameter = 'Wire diameter cannot be negative.';
  else if (wire > MAX_ABS_VALUE) errors.wireDiameter = 'Enter a smaller wire diameter.';

  if (
    mesh !== null &&
    wire !== null &&
    Number.isFinite(mesh) &&
    Number.isFinite(wire) &&
    mesh > 0 &&
    wire >= 0 &&
    !errors.meshCount &&
    !errors.wireDiameter
  ) {
    const wireMm = wireToMm(wire, input.wireUnit);
    const pitch = pitchMm(mesh);
    if (wireMm >= pitch) {
      errors.wireDiameter = 'Wire diameter must be smaller than the mesh pitch.';
    }
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
