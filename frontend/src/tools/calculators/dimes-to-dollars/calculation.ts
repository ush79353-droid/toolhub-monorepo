import { CENTS_PER_DIME, DIMES_PER_DOLLAR } from './types';

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

export function dimesToCents(dimes: bigint): bigint {
  return dimes * BigInt(CENTS_PER_DIME);
}

export interface DimeBreakdown {
  cents: bigint;
  /** Exact whole dimes when divisible; otherwise floor. */
  wholeDimes: bigint;
  remainderCents: bigint;
  exact: boolean;
  /** Mathematical dime units / dime-equivalents for display (may include one decimal). */
  dimesDisplay: string;
}

/** Derive dime count + remainder from integer cents. */
export function breakdownFromCents(cents: bigint): DimeBreakdown {
  const wholeDimes = cents / BigInt(CENTS_PER_DIME);
  const remainderCents = cents % BigInt(CENTS_PER_DIME);
  const exact = remainderCents === 0n;
  let dimesDisplay: string;
  if (exact) {
    dimesDisplay = formatCount(wholeDimes);
  } else {
    // remainder 1–9 cents → tenths of a dime (e.g. 5¢ → .5)
    dimesDisplay = `${formatCount(wholeDimes)}.${remainderCents.toString()}`;
  }
  return { cents, wholeDimes, remainderCents, exact, dimesDisplay };
}

export function shareResultText(breakdown: DimeBreakdown): string {
  const lines = [
    'Dimes to Dollars Calculator',
    'Omega Calculators',
    '',
    breakdown.exact
      ? `Dimes: ${breakdown.dimesDisplay}`
      : `Dime-equivalents: ${breakdown.dimesDisplay}`,
    '',
    `Dollars: ${formatDollarsCurrency(breakdown.cents)}`,
    '',
  ];

  if (breakdown.exact) {
    lines.push(
      'Conversion:',
      `${breakdown.dimesDisplay} × $0.10 = ${formatDollarsCurrency(breakdown.cents)}`,
    );
  } else {
    lines.push(
      'Note:',
      `Mathematical dime-equivalents: ${breakdown.dimesDisplay}`,
      `Whole dimes: ${formatCount(breakdown.wholeDimes)}`,
      `Remaining amount: ${formatDollarsCurrency(breakdown.remainderCents)}`,
      '(A physical dime count must be a whole number.)',
    );
  }

  lines.push('', 'Calculated with Omega Calculators');
  return lines.join('\n');
}

export function conversionFormulaLine(dimes: bigint): string {
  return `${formatCount(dimes)} × $0.10 = ${formatDollarsCurrency(dimesToCents(dimes))}`;
}

export { DIMES_PER_DOLLAR, CENTS_PER_DIME };
