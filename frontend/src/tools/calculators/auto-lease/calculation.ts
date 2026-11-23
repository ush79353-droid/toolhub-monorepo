import type { AutoLeaseMode, AutoLeaseRateType, AutoLeaseResult } from './types';

/** Conventional approximate conversion used by many retail lease calculators. */
export const APR_TO_MONEY_FACTOR_DIVISOR = 2400;

export function formatAutoLeaseUsd(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  if (Object.is(rounded, -0) || rounded === 0) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function formatAutoLeaseMoneyFactor(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const text = value.toFixed(8).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

export function formatAutoLeasePercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e10) / 1e10;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  const text = rounded.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

/** Money Factor ≈ APR (%) / 2400 */
export function aprPercentToMoneyFactor(aprPercent: number): number | null {
  if (!Number.isFinite(aprPercent) || aprPercent < 0) return null;
  const mf = aprPercent / APR_TO_MONEY_FACTOR_DIVISOR;
  return Number.isFinite(mf) ? mf : null;
}

/** APR (%) ≈ Money Factor × 2400 */
export function moneyFactorToAprPercent(moneyFactor: number): number | null {
  if (!Number.isFinite(moneyFactor) || moneyFactor < 0) return null;
  const apr = moneyFactor * APR_TO_MONEY_FACTOR_DIVISOR;
  return Number.isFinite(apr) ? apr : null;
}

export function resolveMoneyFactor(
  rateType: AutoLeaseRateType,
  rateValue: number
): number | null {
  if (rateType === 'money-factor') {
    if (!Number.isFinite(rateValue) || rateValue < 0) return null;
    return rateValue;
  }
  return aprPercentToMoneyFactor(rateValue);
}

/**
 * Standard money-factor lease payment from a known auto price.
 * Cap = Price − Down − Trade-in
 * Dep/mo = (Cap − Residual) / n
 * Finance/mo = (Cap + Residual) × MF
 * Base = Dep + Finance
 * Payment = Base × (1 + tax/100)  (monthly-payment tax treatment)
 */
export function calculateLeaseFromAutoPrice(input: {
  autoPrice: number;
  leaseTermMonths: number;
  moneyFactor: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPercent: number;
  residualValue: number;
}): {
  capitalizedCost: number;
  monthlyDepreciation: number;
  monthlyFinanceCharge: number;
  baseMonthlyPayment: number;
  monthlySalesTax: number;
  monthlyPayment: number;
  totalLeasePayments: number;
  totalDepreciation: number;
  totalFinanceCharge: number;
  totalSalesTax: number;
  upfrontCost: number;
  totalLeaseCost: number;
} | null {
  const {
    autoPrice,
    leaseTermMonths,
    moneyFactor,
    downPayment,
    tradeInValue,
    salesTaxPercent,
    residualValue,
  } = input;

  if (
    ![
      autoPrice,
      leaseTermMonths,
      moneyFactor,
      downPayment,
      tradeInValue,
      salesTaxPercent,
      residualValue,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (leaseTermMonths <= 0 || !Number.isInteger(leaseTermMonths)) return null;
  if (
    autoPrice < 0 ||
    moneyFactor < 0 ||
    downPayment < 0 ||
    tradeInValue < 0 ||
    residualValue < 0 ||
    salesTaxPercent < 0
  ) {
    return null;
  }

  const capitalizedCost = autoPrice - downPayment - tradeInValue;
  if (!(capitalizedCost >= 0)) return null;

  const monthlyDepreciation = (capitalizedCost - residualValue) / leaseTermMonths;
  const monthlyFinanceCharge = (capitalizedCost + residualValue) * moneyFactor;
  const baseMonthlyPayment = monthlyDepreciation + monthlyFinanceCharge;
  if (!(baseMonthlyPayment >= 0) || !Number.isFinite(baseMonthlyPayment)) return null;

  const taxMultiplier = 1 + salesTaxPercent / 100;
  const monthlyPayment = baseMonthlyPayment * taxMultiplier;
  const monthlySalesTax = monthlyPayment - baseMonthlyPayment;
  const totalLeasePayments = monthlyPayment * leaseTermMonths;
  const totalDepreciation = monthlyDepreciation * leaseTermMonths;
  const totalFinanceCharge = monthlyFinanceCharge * leaseTermMonths;
  const totalSalesTax = monthlySalesTax * leaseTermMonths;
  const upfrontCost = downPayment;
  const totalLeaseCost = totalLeasePayments + upfrontCost;

  if (
    ![
      monthlyPayment,
      totalLeasePayments,
      totalDepreciation,
      totalFinanceCharge,
      totalSalesTax,
      totalLeaseCost,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    capitalizedCost,
    monthlyDepreciation,
    monthlyFinanceCharge,
    baseMonthlyPayment,
    monthlySalesTax,
    monthlyPayment,
    totalLeasePayments,
    totalDepreciation,
    totalFinanceCharge,
    totalSalesTax,
    upfrontCost,
    totalLeaseCost,
  };
}

/**
 * Solve auto price for a target monthly payment (tax-inclusive).
 * Cap = [M/(1+s) − R(f − 1/n)] / (1/n + f)
 * Price = Cap + Down + Trade-in
 */
export function solveAutoPriceFromMonthlyPayment(input: {
  monthlyPayment: number;
  leaseTermMonths: number;
  moneyFactor: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPercent: number;
  residualValue: number;
}): number | null {
  const {
    monthlyPayment,
    leaseTermMonths,
    moneyFactor,
    downPayment,
    tradeInValue,
    salesTaxPercent,
    residualValue,
  } = input;

  if (
    ![
      monthlyPayment,
      leaseTermMonths,
      moneyFactor,
      downPayment,
      tradeInValue,
      salesTaxPercent,
      residualValue,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (leaseTermMonths <= 0 || !Number.isInteger(leaseTermMonths)) return null;
  if (
    monthlyPayment < 0 ||
    moneyFactor < 0 ||
    downPayment < 0 ||
    tradeInValue < 0 ||
    residualValue < 0 ||
    salesTaxPercent < 0
  ) {
    return null;
  }

  const taxMultiplier = 1 + salesTaxPercent / 100;
  if (!(taxMultiplier > 0)) return null;

  const baseMonthly = monthlyPayment / taxMultiplier;
  const coeff = 1 / leaseTermMonths + moneyFactor;
  if (!(coeff > 0) || !Number.isFinite(coeff)) return null;

  const residualTerm = residualValue * (moneyFactor - 1 / leaseTermMonths);
  const capitalizedCost = (baseMonthly - residualTerm) / coeff;
  if (!Number.isFinite(capitalizedCost) || capitalizedCost < 0) return null;

  const autoPrice = capitalizedCost + downPayment + tradeInValue;
  return Number.isFinite(autoPrice) && autoPrice >= 0 ? autoPrice : null;
}

export function calculateAutoLease(input: {
  mode: AutoLeaseMode;
  autoPrice: number | null;
  monthlyPayment: number | null;
  leaseTermMonths: number;
  rateType: AutoLeaseRateType;
  rateValue: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPercent: number;
  residualValue: number;
}): AutoLeaseResult | null {
  const moneyFactor = resolveMoneyFactor(input.rateType, input.rateValue);
  if (moneyFactor === null) return null;
  const aprPercent = moneyFactorToAprPercent(moneyFactor);
  if (aprPercent === null) return null;

  let autoPrice = input.autoPrice;
  const monthlyTarget = input.monthlyPayment;

  if (input.mode === 'monthly-payment') {
    if (monthlyTarget === null) return null;
    autoPrice = solveAutoPriceFromMonthlyPayment({
      monthlyPayment: monthlyTarget,
      leaseTermMonths: input.leaseTermMonths,
      moneyFactor,
      downPayment: input.downPayment,
      tradeInValue: input.tradeInValue,
      salesTaxPercent: input.salesTaxPercent,
      residualValue: input.residualValue,
    });
    if (autoPrice === null) return null;
  } else if (autoPrice === null) {
    return null;
  }

  const lease = calculateLeaseFromAutoPrice({
    autoPrice,
    leaseTermMonths: input.leaseTermMonths,
    moneyFactor,
    downPayment: input.downPayment,
    tradeInValue: input.tradeInValue,
    salesTaxPercent: input.salesTaxPercent,
    residualValue: input.residualValue,
  });
  if (!lease) return null;

  const formattedAutoPrice = formatAutoLeaseUsd(autoPrice);
  const formattedMonthlyPayment = formatAutoLeaseUsd(lease.monthlyPayment);
  const summaryText =
    input.mode === 'monthly-payment'
      ? `Target payment $${formattedMonthlyPayment}/mo → max auto price $${formattedAutoPrice} over ${input.leaseTermMonths} months (money factor ${formatAutoLeaseMoneyFactor(moneyFactor)}).`
      : `Auto price $${formattedAutoPrice} → $${formattedMonthlyPayment}/mo for ${input.leaseTermMonths} months (money factor ${formatAutoLeaseMoneyFactor(moneyFactor)}).`;

  return {
    mode: input.mode,
    autoPrice,
    monthlyPayment: lease.monthlyPayment,
    leaseTermMonths: input.leaseTermMonths,
    moneyFactor,
    aprPercent,
    rateType: input.rateType,
    downPayment: input.downPayment,
    tradeInValue: input.tradeInValue,
    salesTaxPercent: input.salesTaxPercent,
    residualValue: input.residualValue,
    capitalizedCost: lease.capitalizedCost,
    monthlyDepreciation: lease.monthlyDepreciation,
    monthlyFinanceCharge: lease.monthlyFinanceCharge,
    baseMonthlyPayment: lease.baseMonthlyPayment,
    monthlySalesTax: lease.monthlySalesTax,
    totalLeasePayments: lease.totalLeasePayments,
    totalDepreciation: lease.totalDepreciation,
    totalFinanceCharge: lease.totalFinanceCharge,
    totalSalesTax: lease.totalSalesTax,
    upfrontCost: lease.upfrontCost,
    totalLeaseCost: lease.totalLeaseCost,
    formattedAutoPrice,
    formattedMonthlyPayment,
    formattedCapitalizedCost: formatAutoLeaseUsd(lease.capitalizedCost),
    formattedMonthlyDepreciation: formatAutoLeaseUsd(lease.monthlyDepreciation),
    formattedMonthlyFinanceCharge: formatAutoLeaseUsd(lease.monthlyFinanceCharge),
    formattedBaseMonthlyPayment: formatAutoLeaseUsd(lease.baseMonthlyPayment),
    formattedMonthlySalesTax: formatAutoLeaseUsd(lease.monthlySalesTax),
    formattedTotalLeasePayments: formatAutoLeaseUsd(lease.totalLeasePayments),
    formattedTotalDepreciation: formatAutoLeaseUsd(lease.totalDepreciation),
    formattedTotalFinanceCharge: formatAutoLeaseUsd(lease.totalFinanceCharge),
    formattedTotalSalesTax: formatAutoLeaseUsd(lease.totalSalesTax),
    formattedUpfrontCost: formatAutoLeaseUsd(lease.upfrontCost),
    formattedTotalLeaseCost: formatAutoLeaseUsd(lease.totalLeaseCost),
    formattedMoneyFactor: formatAutoLeaseMoneyFactor(moneyFactor),
    formattedAprPercent: formatAutoLeasePercent(aprPercent),
    summaryText,
  };
}
