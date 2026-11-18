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

export function parsePenniesInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  pennies: bigint | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, incomplete: false, pennies: null };
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      blank: false,
      incomplete: false,
      pennies: null,
      error: 'This value exceeds the supported input length.',
    };
  }
  if (isIncompleteNumber(trimmed)) {
    return { blank: false, incomplete: true, pennies: null };
  }
  if (!/^\d+$/.test(trimmed)) {
    if (/^-/.test(trimmed)) {
      return {
        blank: false,
        incomplete: false,
        pennies: null,
        error: 'Penny counts cannot be negative.',
      };
    }
    if (/^\d*\.\d+$/.test(trimmed)) {
      return {
        blank: false,
        incomplete: false,
        pennies: null,
        error: 'Enter a whole number of pennies (physical coins are whole).',
      };
    }
    return {
      blank: false,
      incomplete: false,
      pennies: null,
      error: 'Enter a valid whole number of pennies.',
    };
  }
  try {
    return { blank: false, incomplete: false, pennies: BigInt(trimmed) };
  } catch {
    return {
      blank: false,
      incomplete: false,
      pennies: null,
      error: 'Enter a valid whole number of pennies.',
    };
  }
}

/** Parse a non-negative dollar amount into integer pennies. Rejects >2 decimal places. */
export function parseDollarsInput(raw: string): {
  blank: boolean;
  incomplete: boolean;
  pennies: bigint | null;
  error?: string;
} {
  const trimmed = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (trimmed === '') return { blank: true, incomplete: false, pennies: null };
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return {
      blank: false,
      incomplete: false,
      pennies: null,
      error: 'This value exceeds the supported input length.',
    };
  }
  if (isIncompleteNumber(trimmed)) {
    return { blank: false, incomplete: true, pennies: null };
  }
  if (/^-/.test(trimmed)) {
    return {
      blank: false,
      incomplete: false,
      pennies: null,
      error: 'Dollar amounts cannot be negative.',
    };
  }
  if (!/^(?:\d+|\d*\.\d+)$/.test(trimmed)) {
    return {
      blank: false,
      incomplete: false,
      pennies: null,
      error: 'Enter a valid dollar amount.',
    };
  }

  const [intPartRaw, fracRaw = ''] = trimmed.split('.');
  if (fracRaw.length > 2) {
    return {
      blank: false,
      incomplete: false,
      pennies: null,
      error: 'Dollar amounts support at most two decimal places.',
    };
  }
  const intPart = intPartRaw === '' ? '0' : intPartRaw;
  const frac = fracRaw.padEnd(2, '0');
  try {
    const pennies = BigInt(intPart) * 100n + BigInt(frac);
    return { blank: false, incomplete: false, pennies };
  } catch {
    return {
      blank: false,
      incomplete: false,
      pennies: null,
      error: 'Enter a valid dollar amount.',
    };
  }
}
