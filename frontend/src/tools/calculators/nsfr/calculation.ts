/**
 * NSFR = ASF / RSF × 100
 * ASF = Σ Funding_i × ASFWeight_i
 * RSF = Σ Asset_j × RSFWeight_j (+ OBS)
 * Educational estimate — not a supervisory filing.
 */

import { ASF_FACTORS, RSF_FACTORS } from './factors';
import type { FundingSensitivityRow } from './types';

export function calculateNSFR(asf: number, rsf: number): number | null {
  if (
    !Number.isFinite(asf) ||
    !Number.isFinite(rsf) ||
    asf < 0 ||
    rsf <= 0
  ) {
    return null;
  }
  return (asf / rsf) * 100;
}

export function calculateFundingGap(asf: number, rsf: number): number | null {
  if (!Number.isFinite(asf) || !Number.isFinite(rsf)) return null;
  return asf - rsf;
}

export function calculateFundingShortfall(
  asf: number,
  rsf: number
): number | null {
  if (!Number.isFinite(asf) || !Number.isFinite(rsf)) return null;
  return Math.max(0, rsf - asf);
}

export function calculateFundingSurplus(
  asf: number,
  rsf: number
): number | null {
  if (!Number.isFinite(asf) || !Number.isFinite(rsf)) return null;
  return Math.max(0, asf - rsf);
}

export function calculateCoverageMultiple(
  asf: number,
  rsf: number
): number | null {
  if (!Number.isFinite(asf) || !Number.isFinite(rsf) || rsf <= 0) return null;
  return asf / rsf;
}

export function calculateASF(components: {
  regulatoryCapital: number;
  stableDeposits: number;
  lessStableDeposits: number;
  funding50Percent: number;
  funding0Percent: number;
}): {
  lines: {
    key: string;
    label: string;
    amount: number;
    factor: number;
    weighted: number;
  }[];
  unweightedTotal: number;
  weightedTotal: number;
} {
  const rows = [
    {
      key: 'regulatoryCapital',
      label: 'Eligible regulatory capital (≥1y qualifying)',
      amount: components.regulatoryCapital,
      factor: ASF_FACTORS.regulatoryCapital,
    },
    {
      key: 'stableDeposits',
      label: 'Stable retail / small-business deposits',
      amount: components.stableDeposits,
      factor: ASF_FACTORS.stableDeposits,
    },
    {
      key: 'lessStableDeposits',
      label: 'Less-stable retail / small-business deposits',
      amount: components.lessStableDeposits,
      factor: ASF_FACTORS.lessStableDeposits,
    },
    {
      key: 'funding50Percent',
      label: 'Qualifying shorter-term wholesale funding (50% ASF)',
      amount: components.funding50Percent,
      factor: ASF_FACTORS.funding50Percent,
    },
    {
      key: 'funding0Percent',
      label: 'Certain other short-term liabilities (0% ASF)',
      amount: components.funding0Percent,
      factor: ASF_FACTORS.funding0Percent,
    },
  ];

  for (const r of rows) {
    assertNonNeg(r.amount, r.label);
  }

  const lines = rows.map((r) => ({
    ...r,
    weighted: r.amount * r.factor,
  }));
  const unweightedTotal = lines.reduce((s, l) => s + l.amount, 0);
  const weightedTotal = lines.reduce((s, l) => s + l.weighted, 0);
  return { lines, unweightedTotal, weightedTotal };
}

export function calculateRSF(components: {
  cashAndCentralBankReserves: number;
  unencumberedLevel1Hqla: number;
  shortTermFinancialInstitution: number;
  level2AHqla: number;
  level2BAndShortTerm: number;
  residentialMortgages: number;
  otherPerformingLoans: number;
  highRsfAssets: number;
  offBalanceSheetCommitments: number;
}): {
  lines: {
    key: string;
    label: string;
    amount: number;
    factor: number;
    weighted: number;
  }[];
  unweightedTotal: number;
  weightedTotal: number;
} {
  const rows = [
    {
      key: 'cashAndCentralBankReserves',
      label: 'Cash & qualifying central-bank reserves',
      amount: components.cashAndCentralBankReserves,
      factor: RSF_FACTORS.cashAndCentralBankReserves,
    },
    {
      key: 'unencumberedLevel1Hqla',
      label: 'Unencumbered Level 1 HQLA (illustrative 5%)',
      amount: components.unencumberedLevel1Hqla,
      factor: RSF_FACTORS.unencumberedLevel1Hqla,
    },
    {
      key: 'shortTermFinancialInstitution',
      label: 'Short-term FI exposures (illustrative 15%)',
      amount: components.shortTermFinancialInstitution,
      factor: RSF_FACTORS.shortTermFinancialInstitution,
    },
    {
      key: 'level2AHqla',
      label: 'Level 2A HQLA (illustrative 15%)',
      amount: components.level2AHqla,
      factor: RSF_FACTORS.level2AHqla,
    },
    {
      key: 'level2BAndShortTerm',
      label: 'Level 2B / short-term (illustrative 50%)',
      amount: components.level2BAndShortTerm,
      factor: RSF_FACTORS.level2BAndShortTerm,
    },
    {
      key: 'residentialMortgages',
      label: 'Qualifying residential mortgages (illustrative 65%)',
      amount: components.residentialMortgages,
      factor: RSF_FACTORS.residentialMortgages,
    },
    {
      key: 'otherPerformingLoans',
      label: 'Other qualifying performing loans (illustrative 85%)',
      amount: components.otherPerformingLoans,
      factor: RSF_FACTORS.otherPerformingLoans,
    },
    {
      key: 'highRsfAssets',
      label: 'High-RSF assets (illustrative 100%)',
      amount: components.highRsfAssets,
      factor: RSF_FACTORS.highRsfAssets,
    },
    {
      key: 'offBalanceSheetCommitments',
      label: 'Off-balance-sheet commitments (illustrative 5%)',
      amount: components.offBalanceSheetCommitments,
      factor: RSF_FACTORS.offBalanceSheetCommitments,
    },
  ];

  for (const r of rows) {
    assertNonNeg(r.amount, r.label);
  }

  const lines = rows.map((r) => ({
    ...r,
    weighted: r.amount * r.factor,
  }));
  const unweightedTotal = lines.reduce((s, l) => s + l.amount, 0);
  const weightedTotal = lines.reduce((s, l) => s + l.weighted, 0);
  return { lines, unweightedTotal, weightedTotal };
}

export function calculateFundingSensitivity(
  asf: number,
  rsf: number
): FundingSensitivityRow[] {
  const scenarios: { label: string; asfMul: number; rsfMul: number }[] = [
    { label: 'Base case', asfMul: 1, rsfMul: 1 },
    { label: 'ASF +5%', asfMul: 1.05, rsfMul: 1 },
    { label: 'ASF −5%', asfMul: 0.95, rsfMul: 1 },
    { label: 'RSF +5%', asfMul: 1, rsfMul: 1.05 },
    { label: 'RSF −5%', asfMul: 1, rsfMul: 0.95 },
  ];
  return scenarios.map((s) => {
    const a = asf * s.asfMul;
    const r = rsf * s.rsfMul;
    const nsfr = calculateNSFR(a, r);
    return {
      label: s.label,
      asf: a,
      rsf: r,
      nsfrPercent: nsfr,
      formattedNsfr: nsfr != null ? formatPercent(nsfr) : '—',
    };
  });
}

function assertNonNeg(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite number ≥ 0.`);
  }
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function formatMultiple(value: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}×`;
}

export function interpretNsfr(nsfrPercent: number): {
  status: 'above' | 'equal' | 'below';
  interpretation: string;
} {
  if (Math.abs(nsfrPercent - 100) < 0.005) {
    return {
      status: 'equal',
      interpretation:
        'Available stable funding equals required stable funding. The ratio meets the standard minimum threshold without an additional numerical buffer.',
    };
  }
  if (nsfrPercent > 100) {
    const excess = nsfrPercent - 100;
    return {
      status: 'above',
      interpretation: `Available stable funding exceeds required stable funding by approximately ${formatPercent(excess)} of RSF. Under the standard Basel III NSFR threshold, this result exceeds the minimum requirement.`,
    };
  }
  const short = 100 - nsfrPercent;
  return {
    status: 'below',
    interpretation: `Available stable funding is below required stable funding. The calculated shortfall is equivalent to ${formatPercent(short)} of RSF.`,
  };
}
