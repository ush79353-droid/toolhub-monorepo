import { mpsFromField, parseSpeedInput } from '../speed/validation';
import type { KnotsMphField } from './types';

export { parseSpeedInput };

export function mpsFromKnotsMphField(
  value: number,
  field: KnotsMphField,
): { ok: true; mps: number } | { ok: false; error: string } {
  return mpsFromField(value, field);
}
