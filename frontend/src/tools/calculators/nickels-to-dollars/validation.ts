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

export function parseNickelsInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  nickels: bigint | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, incomplete: false, nickels: null };
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      blank: false,
      incomplete: false,
      nickels: null,
      error: 'This value exceeds the supported input length.',
    };
  }
  if (isIncompleteNumber(trimmed)) {
    return { blank: false, incomplete: true, nickels: null };
  }
  if (!/^\d+$/.test(trimmed)) {
    if (/^-/.test(trimmed)) {
      return {
        blank: false,
        incomplete: false,
        nickels: null,
        error: 'Nickel counts cannot be negative.',
      };
    }
    if (/^\d*\.\d+$/.test(trimmed)) {
      return {
        blank: false,
        incomplete: false,
        nickels: null,
        error: 'Enter a whole number of nickels (physical coins are whole).',
      };
    }
    return {
      blank: false,
      incomplete: false,
      nickels: null,
      error: 'Enter a valid whole number of nickels.',
    };
  }
  try {
    return { blank: false, incomplete: false, nickels: BigInt(trimmed) };
  } catch {
    return {
      blank: false,
      incomplete: false,
      nickels: null,
      error: 'Enter a valid whole number of nickels.',
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
      error: 'This value exceeds the supported input length.',
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
      error: 'Dollar amounts cannot be negative.',
    };
  }
  if (!/^(?:\d+|\d*\.\d+)$/.test(trimmed)) {
    return {
      blank: false,
      incomplete: false,
      cents: null,
      error: 'Enter a valid dollar amount.',
    };
  }

  const [intPartRaw, fracRaw = ''] = trimmed.split('.');
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
    const cents = BigInt(intPart) * 100n + BigInt(frac);
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
