import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

const UNIT_TOLERANCE = 1e-9;

/**
 * DOL = %ΔEBIT / %ΔSales.
 * Returns null when sales change is 0 (undefined).
 */
export function calculateDegreeOfOperatingLeverage(
  ebitChangePercentage: number,
  salesChangePercentage: number
): number | null {
  if (
    !Number.isFinite(ebitChangePercentage) ||
    !Number.isFinite(salesChangePercentage)
  ) {
    return null;
  }
  if (Math.abs(salesChangePercentage) < UNIT_TOLERANCE) return null;
  const dol = ebitChangePercentage / salesChangePercentage;
  return Number.isFinite(dol) ? dol : null;
}

/** %ΔEBIT = DOL × %ΔSales */
export function calculateEBITChangeFromDOL(
  dol: number,
  salesChangePercentage: number
): number | null {
  if (!Number.isFinite(dol) || !Number.isFinite(salesChangePercentage)) {
    return null;
  }
  const ebit = dol * salesChangePercentage;
  return Number.isFinite(ebit) ? ebit : null;
}

/** %ΔSales = %ΔEBIT / DOL. DOL must be nonzero. */
export function calculateSalesChangeFromDOL(
  ebitChangePercentage: number,
  dol: number
): number | null {
  if (
    !Number.isFinite(ebitChangePercentage) ||
    !Number.isFinite(dol) ||
    Math.abs(dol) < UNIT_TOLERANCE
  ) {
    return null;
  }
  const sales = ebitChangePercentage / dol;
  return Number.isFinite(sales) ? sales : null;
}

/** CM = Sales − Variable Costs */
export function calculateContributionMargin(
  salesRevenue: number,
  variableCosts: number
): number | null {
  if (
    !Number.isFinite(salesRevenue) ||
    salesRevenue < 0 ||
    !Number.isFinite(variableCosts) ||
    variableCosts < 0
  ) {
    return null;
  }
  const cm = salesRevenue - variableCosts;
  return Number.isFinite(cm) ? cm : null;
}

/** EBIT = CM − Fixed Operating Costs */
export function calculateEBIT(
  contributionMargin: number,
  fixedOperatingCosts: number
): number | null {
  if (
    !Number.isFinite(contributionMargin) ||
    !Number.isFinite(fixedOperatingCosts) ||
    fixedOperatingCosts < 0
  ) {
    return null;
  }
  const ebit = contributionMargin - fixedOperatingCosts;
  return Number.isFinite(ebit) ? ebit : null;
}

/** DOL = CM / EBIT. EBIT must be nonzero. */
export function calculateContributionMarginDOL(
  contributionMargin: number,
  ebit: number
): number | null {
  if (
    !Number.isFinite(contributionMargin) ||
    !Number.isFinite(ebit) ||
    Math.abs(ebit) < UNIT_TOLERANCE
  ) {
    return null;
  }
  const dol = contributionMargin / ebit;
  return Number.isFinite(dol) ? dol : null;
}

export function interpretOperatingLeverage(
  dol: number,
  method: 'periodChange' | 'contributionMargin'
): string {
  if (!Number.isFinite(dol)) {
    return 'Degree of operating leverage could not be interpreted.';
  }

  const abs = Math.abs(dol);
  const parts: string[] = [];

  if (dol < 0) {
    parts.push(
      method === 'contributionMargin'
        ? 'Negative DOL can arise when EBIT is negative while contribution margin is positive under a linear CVP model — interpret carefully.'
        : 'Negative observed DOL means sales and EBIT percentage changes moved in opposite directions over the measured interval — not automatically a calculation error.'
    );
  } else if (Math.abs(dol - 1) < UNIT_TOLERANCE) {
    parts.push(
      'DOL ≈ 1 indicates equal proportional changes in EBIT and sales under the selected assumptions.'
    );
  } else if (dol > 1) {
    parts.push(
      `DOL of about ${formatDol(dol)} means a 1% sales change corresponds to roughly a ${formatDol(dol)}% EBIT change under the stated assumptions (for small changes around the relevant operating level).`
    );
  } else if (dol > 0 && dol < 1) {
    parts.push(
      'Positive DOL below 1 means EBIT changed by a smaller percentage than sales under the measured conditions.'
    );
  } else if (Math.abs(dol) < UNIT_TOLERANCE) {
    parts.push(
      'DOL is zero when EBIT percentage change is zero while sales percentage change is nonzero.'
    );
  }

  if (abs > 5) {
    parts.push(
      'A large absolute DOL indicates high sensitivity and can also appear when EBIT is near zero — not automatically a healthy or unhealthy condition.'
    );
  }

  if (parts.length === 0) {
    return `Degree of operating leverage ≈ ${formatDol(dol)}.`;
  }
  return parts.join(' ');
}

export function formatDol(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value);
}

export function formatDolMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
