import { mpsFromField, parseSpeedInput } from '../speed/validation';
import type { KnotsKphField } from './types';

export { parseSpeedInput };

export function mpsFromKnotsField(
  value: number,
  field: KnotsKphField,
): { ok: true; mps: number } | { ok: false; error: string } {
  return mpsFromField(value, field);
}
