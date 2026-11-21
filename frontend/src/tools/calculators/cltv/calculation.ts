/**
 * CLTV Calculator — Customer Lifetime Value (ADR-018).
 *
 * ACV = APV × APF_annual
 * Revenue CLTV = ACV × L = APV × APF × L
 * GrossProfitCLTV = RevenueCLTV × margin
 * Optional discounted CLTV with constant annual contribution M
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CltvInput, CltvResult, ReportingPeriodKind } from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const f = 10 ** digits;
  return Math.round(amount * f) / f;
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(roundMoney(n, currency), currency);
}

export function calculateAveragePurchaseValue(
  totalRevenue: number,
  totalPurchases: number,
): number | null {
  if (
    !Number.isFinite(totalRevenue) ||
    !Number.isFinite(totalPurchases) ||
    totalRevenue < 0 ||
    totalPurchases <= 0
  ) {
    return null;
  }
  const apv = totalRevenue / totalPurchases;
  return Number.isFinite(apv) ? apv : null;
}

export function calculatePurchaseFrequency(
  totalPurchases: number,
  numberOfCustomers: number,
): number | null {
  if (
    !Number.isFinite(totalPurchases) ||
    !Number.isFinite(numberOfCustomers) ||
    totalPurchases < 0 ||
    numberOfCustomers <= 0
  ) {
    return null;
  }
  const apf = totalPurchases / numberOfCustomers;
  return Number.isFinite(apf) ? apf : null;
}

export function annualizePurchaseFrequency(
  periodFrequency: number,
  period: ReportingPeriodKind,
  customMonths: number,
): number | null {
  if (!Number.isFinite(periodFrequency) || periodFrequency < 0) return null;
  let factor: number;
  switch (period) {
    case 'annual':
      factor = 1;
      break;
    case 'quarterly':
      factor = 4;
      break;
    case 'monthly':
      factor = 12;
      break;
    case 'custom':
      if (!Number.isFinite(customMonths) || customMonths <= 0) return null;
      factor = 12 / customMonths;
      break;
    default:
      return null;
  }
  const annual = periodFrequency * factor;
  return Number.isFinite(annual) ? annual : null;
}

export function calculateAverageCustomerValue(
  averagePurchaseValue: number,
  annualPurchaseFrequency: number,
): number | null {
  if (
    !Number.isFinite(averagePurchaseValue) ||
    !Number.isFinite(annualPurchaseFrequency) ||
    averagePurchaseValue < 0 ||
    annualPurchaseFrequency < 0
  ) {
    return null;
  }
  const acv = averagePurchaseValue * annualPurchaseFrequency;
  return Number.isFinite(acv) ? acv : null;
}

export function calculateRevenueCLTV(
  annualCustomerValue: number,
  customerLifespanYears: number,
): number | null {
  if (
    !Number.isFinite(annualCustomerValue) ||
    !Number.isFinite(customerLifespanYears) ||
    annualCustomerValue < 0 ||
    customerLifespanYears <= 0
  ) {
    return null;
  }
  const cltv = annualCustomerValue * customerLifespanYears;
  return Number.isFinite(cltv) ? cltv : null;
}

export function calculateGrossProfitCLTV(
  revenueCLTV: number,
  grossMarginDecimal: number,
): number | null {
  if (
    !Number.isFinite(revenueCLTV) ||
    !Number.isFinite(grossMarginDecimal) ||
    revenueCLTV < 0 ||
    grossMarginDecimal < 0 ||
    grossMarginDecimal > 1
  ) {
    return null;
  }
  const g = revenueCLTV * grossMarginDecimal;
  return Number.isFinite(g) ? g : null;
}

export function calculateCLTVCACRatio(
  cltv: number,
  cac: number,
): number | null {
  if (
    !Number.isFinite(cltv) ||
    !Number.isFinite(cac) ||
    cltv < 0 ||
    cac <= 0
  ) {
    return null;
  }
  const ratio = cltv / cac;
  return Number.isFinite(ratio) ? ratio : null;
}

/** Constant annual contribution M for N whole years (N floored for sum). */
export function calculateDiscountedCLTV(
  annualContribution: number,
  annualDiscountRate: number,
  lifespanYears: number,
): number | null {
  if (
    !Number.isFinite(annualContribution) ||
    !Number.isFinite(annualDiscountRate) ||
    !Number.isFinite(lifespanYears) ||
    annualContribution < 0 ||
    annualDiscountRate <= -1 ||
    lifespanYears <= 0
  ) {
    return null;
  }
  const n = Math.floor(lifespanYears);
  if (n < 1) return null;
  let sum = 0;
  for (let t = 1; t <= n; t += 1) {
    const denom = (1 + annualDiscountRate) ** t;
    if (!Number.isFinite(denom) || denom === 0) return null;
    sum += annualContribution / denom;
  }
  return Number.isFinite(sum) ? sum : null;
}

export function estimateLifespanFromChurn(
  annualChurnRateDecimal: number,
): number | null {
  if (
    !Number.isFinite(annualChurnRateDecimal) ||
    annualChurnRateDecimal <= 0 ||
    annualChurnRateDecimal > 1
  ) {
    return null;
  }
  const life = 1 / annualChurnRateDecimal;
  return Number.isFinite(life) ? life : null;
}

function periodLabel(
  period: ReportingPeriodKind,
  customMonths: number | null,
): string {
  switch (period) {
    case 'annual':
      return 'Annual';
    case 'quarterly':
      return 'Quarterly';
    case 'monthly':
      return 'Monthly';
    case 'custom':
      return customMonths != null
        ? `Custom (${customMonths} months)`
        : 'Custom';
    default:
      return '—';
  }
}

export function calculateCltvFromInput(input: CltvInput): CltvResult | null {
  const { currency } = input;

  let apv: number;
  let apfAnnual: number;
  let customMonths: number | null = null;

  if (input.useBusinessData) {
    const revenue = num(input.totalRevenue);
    const purchases = num(input.totalPurchases);
    const customers = num(input.numberOfCustomers);
    if (revenue == null || purchases == null || customers == null) return null;

    const derivedApv = calculateAveragePurchaseValue(revenue, purchases);
    const periodApf = calculatePurchaseFrequency(purchases, customers);
    if (derivedApv == null || periodApf == null) return null;

    if (input.reportingPeriod === 'custom') {
      customMonths = num(input.customPeriodMonths);
      if (customMonths == null || customMonths <= 0) return null;
    }

    const annual = annualizePurchaseFrequency(
      periodApf,
      input.reportingPeriod,
      customMonths ?? 12,
    );
    if (annual == null) return null;
    apv = derivedApv;
    apfAnnual = annual;
  } else {
    const directApv = num(input.averagePurchaseValue);
    const directApf = num(input.averagePurchaseFrequency);
    if (directApv == null || directApf == null) return null;
    if (directApv < 0 || directApf < 0) return null;
    apv = directApv;
    apfAnnual = directApf;
  }

  let lifespan = num(input.averageCustomerLifespan);
  let estimatedFromChurn: number | null = null;

  if (input.useChurnLifespan) {
    const churnPct = num(input.annualChurnRate);
    if (churnPct == null || churnPct <= 0 || churnPct > 100) return null;
    estimatedFromChurn = estimateLifespanFromChurn(churnPct / 100);
    if (estimatedFromChurn == null) return null;
    // When churn helper is on, use estimated lifespan unless user already set L
    if (lifespan == null || lifespan <= 0) {
      lifespan = estimatedFromChurn;
    }
  }

  if (lifespan == null || lifespan <= 0) return null;

  const acv = calculateAverageCustomerValue(apv, apfAnnual);
  if (acv == null) return null;

  const revenueCLTV = calculateRevenueCLTV(acv, lifespan);
  if (revenueCLTV == null) return null;

  let grossProfitCLTV: number | null = null;
  let grossMarginPercent: number | null = null;
  if (input.useGrossMargin) {
    const marginPct = num(input.grossProfitMargin);
    if (marginPct == null || marginPct < 0 || marginPct > 100) return null;
    grossMarginPercent = marginPct;
    grossProfitCLTV = calculateGrossProfitCLTV(revenueCLTV, marginPct / 100);
    if (grossProfitCLTV == null) return null;
  }

  const cltvForRatio = grossProfitCLTV ?? revenueCLTV;

  let customerAcquisitionCost: number | null = null;
  let cltvCACRatio: number | null = null;
  if (input.useCac) {
    const cac = num(input.customerAcquisitionCost);
    if (cac == null || cac < 0) return null;
    customerAcquisitionCost = cac;
    if (cac > 0) {
      cltvCACRatio = calculateCLTVCACRatio(cltvForRatio, cac);
    }
  }

  let discountedCLTV: number | null = null;
  let discountRatePercent: number | null = null;
  if (input.useDiscounted) {
    const ratePct = num(input.discountRate);
    if (ratePct == null || ratePct <= -100) return null;
    discountRatePercent = ratePct;
    // Annual contribution = ACV (revenue) or ACV×margin when margin enabled
    const annualM =
      grossMarginPercent != null ? acv * (grossMarginPercent / 100) : acv;
    discountedCLTV = calculateDiscountedCLTV(
      annualM,
      ratePct / 100,
      lifespan,
    );
    if (discountedCLTV == null) return null;
  }

  const steps: string[] = [];
  if (input.useBusinessData) {
    steps.push(
      `APV = Total revenue ÷ Purchases = ${money(apv, currency)}`,
      `Period APF annualized (${periodLabel(input.reportingPeriod, customMonths)}) → ${apfAnnual.toLocaleString('en-US', { maximumFractionDigits: 4 })} purchases/customer/year`,
    );
  } else {
    steps.push(
      `APV = ${money(apv, currency)}`,
      `APF (annual) = ${apfAnnual.toLocaleString('en-US', { maximumFractionDigits: 4 })}`,
    );
  }
  steps.push(
    `ACV = APV × APF = ${money(acv, currency)} / year`,
    `Revenue CLTV = ACV × L = ${money(acv, currency)} × ${lifespan} = ${money(revenueCLTV, currency)}`,
  );
  if (grossProfitCLTV != null && grossMarginPercent != null) {
    steps.push(
      `Gross profit CLTV = ${money(revenueCLTV, currency)} × ${grossMarginPercent}% = ${money(grossProfitCLTV, currency)}`,
    );
  }
  if (cltvCACRatio != null && customerAcquisitionCost != null) {
    steps.push(
      `CLTV:CAC = ${money(cltvForRatio, currency)} ÷ ${money(customerAcquisitionCost, currency)} = ${cltvCACRatio.toLocaleString('en-US', { maximumFractionDigits: 2 })}:1`,
    );
  }
  if (discountedCLTV != null && discountRatePercent != null) {
    steps.push(
      `Discounted CLTV (constant annual contribution, r=${discountRatePercent}%) = ${money(discountedCLTV, currency)}`,
    );
  }

  const formulaBreakdown = [
    'CLTV = APV × APF_annual × L',
    `= ${money(apv, currency)} × ${apfAnnual.toLocaleString('en-US', { maximumFractionDigits: 4 })} × ${lifespan}`,
    `= ${money(revenueCLTV, currency)} (revenue-based, undiscounted)`,
  ].join('\n');

  const interpretation = `Under simplified assumptions of steady annual spending, revenue CLTV is about ${money(revenueCLTV, currency)} per customer over ${lifespan.toLocaleString('en-US', { maximumFractionDigits: 2 })} years. This is not a net-profit forecast.`;

  const explanation =
    'This model assumes constant average annual customer spending over the lifespan and does not discount cash flows unless the discounted mode is enabled. Gross-profit CLTV applies margin only — it still excludes CAC, overhead, and financing costs unless you compare them separately.';

  return {
    currency,
    averagePurchaseValue: apv,
    annualPurchaseFrequency: apfAnnual,
    averageCustomerValue: acv,
    averageCustomerLifespan: lifespan,
    revenueCLTV,
    grossProfitCLTV,
    grossMarginPercent,
    customerAcquisitionCost,
    cltvForRatio,
    cltvCACRatio,
    discountedCLTV,
    discountRatePercent,
    estimatedLifespanFromChurn: estimatedFromChurn,
    usedBusinessData: input.useBusinessData,
    reportingPeriodLabel: periodLabel(input.reportingPeriod, customMonths),
    formattedApv: money(apv, currency),
    formattedApf: apfAnnual.toLocaleString('en-US', {
      maximumFractionDigits: 4,
    }),
    formattedAcv: money(acv, currency),
    formattedLifespan: `${lifespan.toLocaleString('en-US', { maximumFractionDigits: 2 })} years`,
    formattedRevenueCltv: money(revenueCLTV, currency),
    formattedGrossProfitCltv:
      grossProfitCLTV != null ? money(grossProfitCLTV, currency) : '—',
    formattedCac:
      customerAcquisitionCost != null
        ? money(customerAcquisitionCost, currency)
        : '—',
    formattedRatio:
      cltvCACRatio != null
        ? `${cltvCACRatio.toLocaleString('en-US', {
            maximumFractionDigits: 2,
          })}:1`
        : '—',
    formattedDiscounted:
      discountedCLTV != null ? money(discountedCLTV, currency) : '—',
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
