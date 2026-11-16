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

export function parseDimesInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  dimes: bigint | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, incomplete: false, dimes: null };
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      blank: false,
      incomplete: false,
      dimes: null,
      error: 'This number exceeds the supported calculation range.',
    };
  }
  if (isIncompleteNumber(trimmed)) {
    return { blank: false, incomplete: true, dimes: null };
  }
  if (!/^\d+$/.test(trimmed)) {
    if (/^-/.test(trimmed)) {
      return {
        blank: false,
        incomplete: false,
        dimes: null,
        error: 'Enter a valid non-negative whole number of dimes.',
      };
    }
    if (/^\d*\.\d+$/.test(trimmed)) {
      return {
        blank: false,
        incomplete: false,
        dimes: null,
        error: 'Enter a valid non-negative whole number of dimes.',
      };
    }
    return {
      blank: false,
      incomplete: false,
      dimes: null,
      error: 'Enter a valid non-negative whole number of dimes.',
    };
  }
  try {
    return { blank: false, incomplete: false, dimes: BigInt(trimmed) };
  } catch {
    return {
      blank: false,
      incomplete: false,
      dimes: null,
      error: 'Enter a valid non-negative whole number of dimes.',
    };
  }
}

/** Parse a non-negative dollar amount into integer cents. Rejects >2 decimal places. */
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
      error: 'This number exceeds the supported calculation range.',
    };
  }
  if (isIncompleteNumber(trimmed)) {
    return { blank: false, incomplete: true, cents: null };
  }
  if (/^-/.test(trimmed)) {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Enter a valid non-negative dollar amount.',
    };
  }
  if (!/^(?:\d+|\d*\.\d+)$/.test(trimmed)) {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Enter a valid non-negative dollar amount.',
    };
  }

  const [intPartRaw, fracRaw = ''] = trimmed.split('.');
  if (fracRaw.length > 2) {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Enter a valid non-negative dollar amount.',
    };
  }
  const intPart = intPartRaw === '' ? '0' : intPartRaw;
  const frac = fracRaw.padEnd(2, '0');
  try {
    const cents = BigInt(intPart) * 100n + BigInt(frac);
    return { blank: false, incomplete: false, cents };
  } catch {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Enter a valid non-negative dollar amount.',
    };
  }
}
