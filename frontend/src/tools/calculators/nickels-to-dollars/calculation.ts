import { CENTS_PER_NICKEL, NICKELS_PER_DOLLAR } from './types';

/** Format a non-negative integer count with thousands separators. */
export function formatCount(value: bigint): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Format integer cents as USD dollars with exactly two decimals. */
export function formatDollarsDisplay(cents: bigint): string {
  const whole = cents / 100n;
  const frac = cents % 100n;
  const groupedWhole = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${groupedWhole}.${frac.toString().padStart(2, '0')}`;
}

export function formatDollarsCurrency(cents: bigint): string {
  return `$${formatDollarsDisplay(cents)}`;
}

export function nickelsToCents(nickels: bigint): bigint {
  return nickels * BigInt(CENTS_PER_NICKEL);
}

export interface NickelBreakdown {
  cents: bigint;
  /** Exact whole nickels when divisible; otherwise floor. */
  wholeNickels: bigint;
  remainderCents: bigint;
  exact: boolean;
  /** Mathematical nickel units for display (may include one decimal place). */
  nickelsDisplay: string;
}

/** Derive nickel count + remainder from integer cents. */
export function breakdownFromCents(cents: bigint): NickelBreakdown {
  const wholeNickels = cents / BigInt(CENTS_PER_NICKEL);
  const remainderCents = cents % BigInt(CENTS_PER_NICKEL);
  const exact = remainderCents === 0n;
  let nickelsDisplay: string;
  if (exact) {
    nickelsDisplay = formatCount(wholeNickels);
  } else {
    // remainder 1→.2, 2→.4, 3→.6, 4→.8 (cents ÷ 5)
    nickelsDisplay = `${formatCount(wholeNickels)}.${Number(remainderCents) * 2}`;
  }
  return { cents, wholeNickels, remainderCents, exact, nickelsDisplay };
}

export function shareResultText(breakdown: NickelBreakdown): string {
  const lines = [
    'Nickels to Dollars Calculator',
    'Omega Calculators',
    '',
    `Nickels: ${breakdown.nickelsDisplay}`,
    '',
    `Dollars: ${formatDollarsCurrency(breakdown.cents)}`,
    '',
  ];

  if (breakdown.exact) {
    lines.push(
      'Conversion:',
      `${breakdown.nickelsDisplay} × $0.05 = ${formatDollarsCurrency(breakdown.cents)}`,
    );
  } else {
    lines.push(
      'Note:',
      `Mathematical nickel units: ${breakdown.nickelsDisplay}`,
      `Whole nickels: ${formatCount(breakdown.wholeNickels)}`,
      `Remaining amount: ${formatDollarsCurrency(breakdown.remainderCents)}`,
      '(A physical nickel count must be a whole number.)',
    );
  }

  lines.push('', 'Calculated with Omega Calculators');
  return lines.join('\n');
}

export function conversionFormulaLine(nickels: bigint): string {
  return `${formatCount(nickels)} × $0.05 = ${formatDollarsCurrency(nickelsToCents(nickels))}`;
}

export { NICKELS_PER_DOLLAR, CENTS_PER_NICKEL };
