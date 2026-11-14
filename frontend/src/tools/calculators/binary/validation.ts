import { formatGroupedInt, signedRange } from './calculation';
import type { BinaryWidth } from './types';

export function isIncompleteDecimal(raw: string): boolean {
  const cleaned = raw.trim().replace(/,/g, '');
  return cleaned === '' || cleaned === '-' || cleaned === '+';
}

export function parseDecimalInput(
  raw: string,
  bits: BinaryWidth
): { value: bigint | null; blank: boolean; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '' || isIncompleteDecimal(cleaned)) {
    return { value: null, blank: true };
  }

  if (/[eE.]/.test(cleaned) || /infinity|nan/i.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Enter a whole integer (no fractions or scientific notation).',
    };
  }

  if (!/^[+-]?\d+$/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Enter a valid decimal integer.',
    };
  }

  let value: bigint;
  try {
    value = BigInt(cleaned);
  } catch {
    return { value: null, blank: false, error: 'Enter a valid decimal integer.' };
  }

  const { min, max } = signedRange(bits);
  if (value < min || value > max) {
    return {
      value: null,
      blank: false,
      error: `${bits}-bit signed integers must be between ${formatGroupedInt(min)} and ${formatGroupedInt(max)}.`,
    };
  }

  return { value, blank: false };
}

export function parseBinaryInput(
  raw: string,
  bits: BinaryWidth
): { value: string | null; blank: boolean; error?: string } {
  const cleaned = raw.trim().replace(/[\s_]/g, '');
  if (cleaned === '') {
    return { value: null, blank: true };
  }

  if (/[^01]/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Invalid binary input. Only 0 and 1 are allowed.',
    };
  }

  if (cleaned.length < bits) {
    return {
      value: null,
      blank: true,
      error: undefined,
    };
  }

  if (cleaned.length > bits) {
    return {
      value: null,
      blank: false,
      error: `Enter exactly ${bits} binary digits (got ${cleaned.length}).`,
    };
  }

  return { value: cleaned, blank: false };
}

/** While typing a shorter binary string, treat as incomplete (no hard error yet). */
export function binaryIncompleteMessage(bits: BinaryWidth, length: number): string | undefined {
  if (length === 0) return undefined;
  if (length < bits) {
    return `Enter exactly ${bits} binary digits (${length} so far).`;
  }
  return undefined;
}
