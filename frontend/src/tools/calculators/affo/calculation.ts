import { PERIOD_LABELS, type AdjustmentLine, type AffoInput, type AffoResult } from './types';

function signedEffect(amount: number, treatment: 'add' | 'subtract'): number {
  return treatment === 'add' ? amount : -amount;
}

function buckets(amount: number, treatment: 'add' | 'subtract'): { additions: number; deductions: number } {
  const signed = signedEffect(amount, treatment);
  if (signed > 0) return { additions: signed, deductions: 0 };
  if (signed < 0) return { additions: 0, deductions: -signed };
  return { additions: 0, deductions: 0 };
}

function finiteOrNull(value: number | null): number | null {
  return value !== null && Number.isFinite(value) ? value : null;
}

/**
 * Simplified REIT bridge.
 * FFO = net income + eligible real-estate D&A + eligible property-sale losses − eligible property-sale gains.
 * Interest income is not applied, because a normal net-income figure already includes it.
 * AFFO = FFO − straight-line rent − recurring maintenance capex − incremental maintenance
 *        + noncash compensation + debt-issuance amortization + signed lease amortization.
 * This is not a full Nareit FFO reconciliation.
 */
export function calculateAffo(input: AffoInput): AffoResult {
  const ffoParts = [
    buckets(input.realEstateDepreciation, 'add'),
    buckets(input.propertySaleLosses, 'add'),
    buckets(input.propertySaleGains, 'subtract'),
  ];
  const affoParts = [
    buckets(input.straightLineRentAdjustment, 'subtract'),
    buckets(input.recurringMaintenanceCapex, 'subtract'),
    buckets(input.maintenanceAdjustment, 'subtract'),
    buckets(input.noncashCompensation, 'add'),
    buckets(input.debtIssuanceAmortization, 'add'),
    buckets(input.leaseAmortizationAdjustment, 'add'),
  ];

  const ffo =
    input.netIncome + input.realEstateDepreciation + input.propertySaleLosses - input.propertySaleGains;
  const affo =
    ffo -
    input.straightLineRentAdjustment -
    input.recurringMaintenanceCapex -
    input.maintenanceAdjustment +
    input.noncashCompensation +
    input.debtIssuanceAmortization +
    input.leaseAmortizationAdjustment;

  const shares = input.dilutedShares !== null && input.dilutedShares > 0 ? input.dilutedShares : null;
  const ffoPerShare = shares === null ? null : ffo / shares;
  const affoPerShare = shares === null ? null : affo / shares;
  const payoutRatio = input.dividends !== null && affo !== 0 ? input.dividends / affo : null;

  const lines: AdjustmentLine[] = [
    { id: 'net-income', label: 'Net income', amount: input.netIncome, treatment: 'base' },
    {
      id: 'depreciation',
      label: 'Eligible real-estate depreciation and amortization',
      amount: input.realEstateDepreciation,
      treatment: 'add',
    },
    {
      id: 'losses',
      label: 'Eligible losses on property sales',
      amount: input.propertySaleLosses,
      treatment: 'add',
    },
    {
      id: 'gains',
      label: 'Eligible gains on property sales',
      amount: input.propertySaleGains,
      treatment: 'subtract',
    },
    {
      id: 'interest',
      label: 'Interest income (already in net income, not adjusted again)',
      amount: input.interestIncome,
      treatment: 'note',
    },
    { id: 'ffo', label: 'Simplified FFO', amount: ffo, treatment: 'base' },
    {
      id: 'straight-line',
      label: 'Straight-line rent adjustment (noncash income in FFO)',
      amount: input.straightLineRentAdjustment,
      treatment: 'subtract',
    },
    {
      id: 'capex',
      label: 'Recurring maintenance capital expenditures',
      amount: input.recurringMaintenanceCapex,
      treatment: 'subtract',
    },
    {
      id: 'maintenance',
      label: 'Incremental maintenance adjustment not already in FFO',
      amount: input.maintenanceAdjustment,
      treatment: 'subtract',
    },
    {
      id: 'compensation',
      label: 'Noncash compensation add-back',
      amount: input.noncashCompensation,
      treatment: 'add',
    },
    {
      id: 'debt-costs',
      label: 'Debt issuance cost amortization add-back',
      amount: input.debtIssuanceAmortization,
      treatment: 'add',
    },
    {
      id: 'leases',
      label: 'Above/below-market lease amortization (signed)',
      amount: input.leaseAmortizationAdjustment,
      treatment: 'add',
    },
  ];

  return {
    currency: input.currency,
    period: input.period,
    periodLabel: PERIOD_LABELS[input.period],
    netIncome: input.netIncome,
    interestIncome: input.interestIncome,
    ffo,
    affo,
    affoAdjustment: affo - ffo,
    ffoAdditions: ffoParts.reduce((sum, part) => sum + part.additions, 0),
    ffoDeductions: ffoParts.reduce((sum, part) => sum + part.deductions, 0),
    affoAdditions: affoParts.reduce((sum, part) => sum + part.additions, 0),
    affoDeductions: affoParts.reduce((sum, part) => sum + part.deductions, 0),
    ffoPerShare: finiteOrNull(ffoPerShare),
    affoPerShare: finiteOrNull(affoPerShare),
    payoutRatio: finiteOrNull(payoutRatio),
    lines,
    simplified: true,
  };
}
