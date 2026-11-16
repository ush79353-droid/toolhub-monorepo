/** Format integer cents as a grouped whole-number string (e.g. 123456 → "123,456"). */
export function formatCentsDisplay(cents: bigint): string {
  const negative = cents < 0n;
  const abs = negative ? -cents : cents;
  const grouped = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return negative ? `-${grouped}` : grouped;
}

/** Format integer cents as USD dollars with exactly two decimals (e.g. 250 → "2.50"). */
export function formatDollarsDisplay(cents: bigint): string {
  const negative = cents < 0n;
  const abs = negative ? -cents : cents;
  const whole = abs / 100n;
  const frac = abs % 100n;
  const fracStr = frac.toString().padStart(2, '0');
  const groupedWhole = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}${groupedWhole}.${fracStr}`;
}

export function formatDollarsCurrency(cents: bigint): string {
  return `$${formatDollarsDisplay(cents)}`;
}

export function shareResultText(cents: bigint): string {
  return [
    'Cents to Dollars Calculator',
    'Omega Calculators',
    '',
    `Cents: ${formatCentsDisplay(cents)}`,
    `Dollars: ${formatDollarsCurrency(cents)}`,
    '',
    'Formula:',
    'Dollars = Cents ÷ 100',
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}
