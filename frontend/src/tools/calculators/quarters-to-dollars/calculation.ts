import { CENTS_PER_QUARTER, QUARTERS_PER_DOLLAR } from './types';

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

export function quartersToCents(quarters: bigint): bigint {
  return quarters * BigInt(CENTS_PER_QUARTER);
}

export interface QuarterBreakdown {
  cents: bigint;
  /** Exact whole quarters when divisible; otherwise floor. */
  wholeQuarters: bigint;
  remainderCents: bigint;
  exact: boolean;
  /** Mathematical quarter units / quarter-equivalents for display. */
  quartersDisplay: string;
}

/** Derive quarter count + remainder from integer cents. */
export function breakdownFromCents(cents: bigint): QuarterBreakdown {
  const wholeQuarters = cents / BigInt(CENTS_PER_QUARTER);
  const remainderCents = cents % BigInt(CENTS_PER_QUARTER);
  const exact = remainderCents === 0n;
  let quartersDisplay: string;
  if (exact) {
    quartersDisplay = formatCount(wholeQuarters);
  } else {
    // rem 1–24¢ → fraction of a quarter (e.g. 10¢ → .4)
    const frac = (Number(remainderCents) / CENTS_PER_QUARTER).toString().slice(1); // ".4"
    quartersDisplay = `${formatCount(wholeQuarters)}${frac}`;
  }
  return { cents, wholeQuarters, remainderCents, exact, quartersDisplay };
}

export function shareResultText(breakdown: QuarterBreakdown): string {
  const lines = [
    'Quarters to Dollars Calculator',
    'Omega Calculators',
    '',
    breakdown.exact
      ? `Quarters: ${breakdown.quartersDisplay}`
      : `Quarter-equivalents: ${breakdown.quartersDisplay}`,
    '',
    `Dollars: ${formatDollarsCurrency(breakdown.cents)}`,
    '',
  ];

  if (breakdown.exact) {
    lines.push(
      'Conversion:',
      `${breakdown.quartersDisplay} × $0.25 = ${formatDollarsCurrency(breakdown.cents)}`,
    );
  } else {
    lines.push(
      'Note:',
      `This amount is equivalent to ${breakdown.quartersDisplay} quarters. Whole quarters alone cannot make this exact amount.`,
      `Whole quarters: ${formatCount(breakdown.wholeQuarters)}`,
      `Remaining amount: ${formatDollarsCurrency(breakdown.remainderCents)}`,
      '(A physical quarter count must be a whole number.)',
    );
  }

  lines.push('', 'Calculated with Omega Calculators');
  return lines.join('\n');
}

export function conversionFormulaLine(quarters: bigint): string {
  return `${formatCount(quarters)} × $0.25 = ${formatDollarsCurrency(quartersToCents(quarters))}`;
}

export { QUARTERS_PER_DOLLAR, CENTS_PER_QUARTER };
