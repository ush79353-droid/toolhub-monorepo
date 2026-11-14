/** PI = PV of future cash flow / Initial investment */
export function calculateProfitabilityIndex(
  initialInvestment: number,
  pvFutureCashFlow: number
): number | null {
  if (!Number.isFinite(initialInvestment) || !Number.isFinite(pvFutureCashFlow)) return null;
  if (!(initialInvestment > 0)) return null;
  if (pvFutureCashFlow < 0) return null;
  const pi = pvFutureCashFlow / initialInvestment;
  return Number.isFinite(pi) ? pi : null;
}

export function formatPi(value: number): string {
  return Number(value.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

export function interpretPi(pi: number): string {
  if (!Number.isFinite(pi)) return '';
  if (pi > 1) return 'PI > 1 — the investment may be attractive.';
  if (pi === 1 || Math.abs(pi - 1) < 1e-9) {
    return 'PI = 1 — break-even type scenario.';
  }
  return 'PI < 1 — the investment may be unattractive.';
}
