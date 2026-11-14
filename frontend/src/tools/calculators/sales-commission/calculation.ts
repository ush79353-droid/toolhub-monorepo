import {
  COMMISSION_BASE_LABELS,
  usesBasePayTarget,
  usesGrossMarginTarget,
  type SalesCommissionInput,
  type SalesCommissionResult,
} from './types';

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundPercent1(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function empty(
  input: SalesCommissionInput,
  explanation: string
): SalesCommissionResult {
  return {
    defined: false,
    explanation,
    revenue: input.revenue,
    cogs: input.cogs,
    grossProfit: 0,
    sellingExpenses: input.sellingExpenses,
    discountRatePercent: input.discountRatePercent,
    discount: 0,
    baseSalary: input.baseSalary,
    commissionRatePercent: input.commissionRatePercent,
    commissionBase: input.commissionBase,
    basePayTargetPercent: usesBasePayTarget(input.commissionBase)
      ? input.basePayTargetPercent
      : null,
    grossMarginTargetPercent: usesGrossMarginTarget(input.commissionBase)
      ? input.grossMarginTargetPercent
      : null,
    salesThreshold: null,
    commissionBaseAmount: 0,
    commission: 0,
    totalLaborCost: 0,
    operationalCost: 0,
    operationalProfit: 0,
    grossSalesMargin: 0,
    operationalMarginPercent: null,
    grossMarginRatePercent: null,
    laborCostToSalesPercent: null,
    currency: input.currency,
  };
}

/**
 * Combined Omni/Dash threshold: H = (B × m) / (b × g)
 * where g = grossProfit / revenue, m = margin target, b = base-pay target.
 */
export function thresholdFromMarginAndBasePay(
  revenue: number,
  grossProfit: number,
  baseSalary: number,
  basePayTargetPercent: number,
  grossMarginTargetPercent: number
): number | null {
  if (revenue <= 0 || grossProfit <= 0) return null;
  if (basePayTargetPercent <= 0 || grossMarginTargetPercent <= 0) return null;
  const g = grossProfit / revenue;
  const b = basePayTargetPercent / 100;
  const m = grossMarginTargetPercent / 100;
  if (g <= 0 || b <= 0 || m <= 0) return null;
  return (baseSalary * m) / (b * g);
}

/**
 * Pre-commission sales needed for target operating margin (Dash closed form).
 * With percent discount d: H = (COGS + selling + salary) / (1 − m − d).
 */
export function thresholdFromMarginTarget(
  cogs: number,
  sellingExpenses: number,
  baseSalary: number,
  discountRatePercent: number,
  grossMarginTargetPercent: number
): number | null {
  const m = grossMarginTargetPercent / 100;
  const d = discountRatePercent / 100;
  const denom = 1 - m - d;
  if (denom <= 0) return null;
  return (cogs + sellingExpenses + baseSalary) / denom;
}

function eligibleBase(input: SalesCommissionInput, grossProfit: number, discount: number): {
  amount: number;
  threshold: number | null;
  error: string | null;
} {
  const { revenue, cogs, sellingExpenses, baseSalary, commissionBase } = input;
  const rate = input.commissionRatePercent / 100;

  if (commissionBase === 'gross-sales') {
    return { amount: Math.max(0, revenue), threshold: null, error: null };
  }

  if (commissionBase === 'sales-profit') {
    // Profit before commission: revenue − COGS − selling − salary − discount.
    const profit = revenue - cogs - sellingExpenses - baseSalary - discount;
    return { amount: Math.max(0, profit), threshold: null, error: null };
  }

  if (commissionBase === 'excess-above-threshold') {
    const h = input.salesQuota;
    return { amount: Math.max(0, revenue - h), threshold: h, error: null };
  }

  if (commissionBase === 'excess-above-margin-target') {
    const h = thresholdFromMarginTarget(
      cogs,
      sellingExpenses,
      baseSalary,
      input.discountRatePercent,
      input.grossMarginTargetPercent
    );
    if (h === null) {
      return {
        amount: 0,
        threshold: null,
        error:
          'Margin target plus discount rate must stay below 100% so a sales threshold can be derived.',
      };
    }
    return { amount: Math.max(0, revenue - h), threshold: h, error: null };
  }

  // gross-margin-and-base-pay-target
  const h = thresholdFromMarginAndBasePay(
    revenue,
    grossProfit,
    baseSalary,
    input.basePayTargetPercent,
    input.grossMarginTargetPercent
  );
  if (h === null) {
    return {
      amount: 0,
      threshold: null,
      error:
        'Gross margin and base-pay targets need positive revenue, positive gross profit, and positive target percents.',
    };
  }
  void rate;
  return { amount: Math.max(0, revenue - h), threshold: h, error: null };
}

export function calculateSalesCommission(input: SalesCommissionInput): SalesCommissionResult {
  const {
    revenue,
    cogs,
    sellingExpenses,
    discountRatePercent,
    baseSalary,
    commissionRatePercent,
    commissionBase,
  } = input;

  if (![revenue, cogs, sellingExpenses, discountRatePercent, baseSalary, commissionRatePercent].every(finite)) {
    return empty(input, 'Enter finite amounts for every required field.');
  }

  const grossProfit = roundMoney(revenue - cogs);
  const discount = roundMoney(revenue * (discountRatePercent / 100));
  if (![grossProfit, discount].every(finite)) {
    return empty(input, 'This combination does not produce a finite money result.');
  }

  const eligible = eligibleBase(input, grossProfit, discount);
  if (eligible.error) {
    return empty(input, eligible.error);
  }

  const commissionBaseAmount = roundMoney(eligible.amount);
  const commission = roundMoney(commissionBaseAmount * (commissionRatePercent / 100));
  const totalLaborCost = roundMoney(baseSalary + commission);
  const operationalCost = roundMoney(totalLaborCost + sellingExpenses + discount);
  const operationalProfit = roundMoney(grossProfit - operationalCost);
  const grossSalesMargin = roundMoney(grossProfit - discount - sellingExpenses);
  const salesThreshold =
    eligible.threshold === null ? null : roundMoney(eligible.threshold);

  if (
    ![
      commissionBaseAmount,
      commission,
      totalLaborCost,
      operationalCost,
      operationalProfit,
      grossSalesMargin,
    ].every(finite)
  ) {
    return empty(input, 'This combination does not produce a finite money result.');
  }

  const operationalMarginPercent =
    revenue === 0 ? null : roundPercent1((operationalProfit / revenue) * 100);
  const grossMarginRatePercent =
    revenue === 0 ? null : roundPercent1((grossProfit / revenue) * 100);
  const laborCostToSalesPercent =
    revenue === 0 ? null : roundPercent1((totalLaborCost / revenue) * 100);

  return {
    defined: true,
    explanation: null,
    revenue: roundMoney(revenue),
    cogs: roundMoney(cogs),
    grossProfit,
    sellingExpenses: roundMoney(sellingExpenses),
    discountRatePercent,
    discount,
    baseSalary: roundMoney(baseSalary),
    commissionRatePercent,
    commissionBase,
    basePayTargetPercent: usesBasePayTarget(commissionBase)
      ? input.basePayTargetPercent
      : null,
    grossMarginTargetPercent: usesGrossMarginTarget(commissionBase)
      ? input.grossMarginTargetPercent
      : null,
    salesThreshold,
    commissionBaseAmount,
    commission,
    totalLaborCost,
    operationalCost,
    operationalProfit,
    grossSalesMargin,
    operationalMarginPercent,
    grossMarginRatePercent,
    laborCostToSalesPercent,
    currency: input.currency,
  };
}

export function methodLabel(base: SalesCommissionInput['commissionBase']): string {
  return COMMISSION_BASE_LABELS[base];
}
