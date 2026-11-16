/** Format integer pennies as a grouped whole-number string. */
export function formatPenniesDisplay(pennies: bigint): string {
  return pennies.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Format integer pennies as USD dollars with exactly two decimals. */
export function formatDollarsDisplay(pennies: bigint): string {
  const whole = pennies / 100n;
  const frac = pennies % 100n;
  const groupedWhole = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${groupedWhole}.${frac.toString().padStart(2, '0')}`;
}

export function formatDollarsCurrency(pennies: bigint): string {
  return `$${formatDollarsDisplay(pennies)}`;
}

export function shareResultText(pennies: bigint): string {
  return [
    'Pennies to Dollars Calculator',
    'Omega Calculators',
    '',
    `Pennies: ${formatPenniesDisplay(pennies)}`,
    `Dollars: ${formatDollarsCurrency(pennies)}`,
    '',
    'Conversion:',
    `${formatPenniesDisplay(pennies)} ÷ 100 = ${formatDollarsDisplay(pennies)}`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
