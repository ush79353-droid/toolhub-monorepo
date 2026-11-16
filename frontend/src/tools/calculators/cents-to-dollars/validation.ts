import { MAX_INPUT_LENGTH } from './types';

function isIncompleteNumber(trimmed: string): boolean {
  return (
    trimmed === '-' ||
    trimmed === '+' ||
    trimmed === '.' ||
    trimmed === '-.' ||
    trimmed === '+.' ||
    /^[+-]?\d+\.$/.test(trimmed) ||
    /^[+-]?(?:\d+\.?\d*|\.\d+)[eE][+-]?$/.test(trimmed)
  );
}

export function parseCentsInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  cents: bigint | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, incomplete: false, cents: null };
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'This value exceeds the supported input length.',
    };
  }
  if (isIncompleteNumber(trimmed)) {
    return { blank: false, incomplete: true, cents: null };
  }
  if (!/^[+-]?\d+$/.test(trimmed)) {
    if (/^[+-]?\d*\.\d+$/.test(trimmed)) {
      return {
        blank: false,
        incomplete: false,
        cents: null,
        error: 'Enter whole cents only (no fractional cents).',
      };
    }
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Enter a valid whole number of cents.',
    };
  }
  try {
    return { blank: false, incomplete: false, cents: BigInt(trimmed) };
  } catch {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Enter a valid whole number of cents.',
    };
  }
}

/** Parse a dollar amount into integer cents. Rejects more than two decimal places. */
export function parseDollarsInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  cents: bigint | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (trimmed === '') return { blank: true, incomplete: false, cents: null };
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'This value exceeds the supported input length.',
    };
  }
  if (isIncompleteNumber(trimmed)) {
    return { blank: false, incomplete: true, cents: null };
  }
  if (!/^[+-]?(?:\d+|\d*\.\d+)$/.test(trimmed)) {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Enter a valid dollar amount.',
    };
  }

  const sign = trimmed.startsWith('-') ? -1n : 1n;
  const unsigned = trimmed.replace(/^[+-]/, '');
  const [intPartRaw, fracRaw = ''] = unsigned.split('.');
  if (fracRaw.length > 2) {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Dollar amounts support at most two decimal places.',
    };
  }
  const intPart = intPartRaw === '' ? '0' : intPartRaw;
  const frac = fracRaw.padEnd(2, '0');
  try {
    const cents = sign * (BigInt(intPart) * 100n + BigInt(frac));
    return { blank: false, incomplete: false, cents };
  } catch {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Enter a valid dollar amount.',
    };
  }
}
