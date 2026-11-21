import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  CollegeCostResult,
  CollegeFinancialStatus,
  CollegeYearCost,
} from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function calculateAfterTaxReturn(
  investmentReturnRatePercent: number,
  taxRatePercent: number,
): number | null {
  if (
    !Number.isFinite(investmentReturnRatePercent) ||
    !Number.isFinite(taxRatePercent) ||
    investmentReturnRatePercent < 0 ||
    taxRatePercent < 0 ||
    taxRatePercent > 100
  ) {
    return null;
  }
  return (investmentReturnRatePercent / 100) * (1 - taxRatePercent / 100);
}

export function calculateFutureAnnualCollegeCost(
  currentAnnualCost: number,
  inflationRatePercent: number,
  yearsUntilCollege: number,
  academicYearIndex = 0,
): number | null {
  if (
    ![currentAnnualCost, inflationRatePercent, yearsUntilCollege, academicYearIndex].every(
      Number.isFinite,
    ) ||
    currentAnnualCost < 0 ||
    inflationRatePercent < 0 ||
    yearsUntilCollege < 0 ||
    academicYearIndex < 0 ||
    !Number.isInteger(yearsUntilCollege) ||
    !Number.isInteger(academicYearIndex)
  ) {
    return null;
  }
  const i = inflationRatePercent / 100;
  return currentAnnualCost * (1 + i) ** (yearsUntilCollege + academicYearIndex);
}

export function buildAnnualCostBreakdown(
  currentAnnualCost: number,
  inflationRatePercent: number,
  yearsUntilCollege: number,
  attendanceDuration: number,
  percentFromSavings: number,
  currency: SupportedCurrency,
): CollegeYearCost[] | null {
  if (
    attendanceDuration <= 0 ||
    !Number.isInteger(attendanceDuration) ||
    percentFromSavings < 0 ||
    percentFromSavings > 100
  ) {
    return null;
  }
  const rows: CollegeYearCost[] = [];
  for (let n = 0; n < attendanceDuration; n += 1) {
    const raw = calculateFutureAnnualCollegeCost(
      currentAnnualCost,
      inflationRatePercent,
      yearsUntilCollege,
      n,
    );
    if (raw === null) return null;
    const projectedAnnualCost = roundMoney(raw, currency);
    const savingsFundedAmount = roundMoney(
      projectedAnnualCost * (percentFromSavings / 100),
      currency,
    );
    const otherFundingAmount = roundMoney(
      projectedAnnualCost - savingsFundedAmount,
      currency,
    );
    rows.push({
      academicYear: n + 1,
      projectedAnnualCost,
      savingsFundedAmount,
      otherFundingAmount,
    });
  }
  return rows;
}

export function calculateTotalCollegeCost(
  currentAnnualCost: number,
  inflationRatePercent: number,
  yearsUntilCollege: number,
  attendanceDuration: number,
): number | null {
  if (attendanceDuration <= 0 || !Number.isInteger(attendanceDuration)) return null;
  let total = 0;
  for (let n = 0; n < attendanceDuration; n += 1) {
    const year = calculateFutureAnnualCollegeCost(
      currentAnnualCost,
      inflationRatePercent,
      yearsUntilCollege,
      n,
    );
    if (year === null) return null;
    total += year;
  }
  return total;
}

export function calculateSavingsFundedTarget(
  totalCollegeCost: number,
  savingsPercentage: number,
): number | null {
  if (
    !Number.isFinite(totalCollegeCost) ||
    !Number.isFinite(savingsPercentage) ||
    totalCollegeCost < 0 ||
    savingsPercentage < 0 ||
    savingsPercentage > 100
  ) {
    return null;
  }
  return totalCollegeCost * (savingsPercentage / 100);
}

export function calculateProjectedSavings(
  currentSavings: number,
  afterTaxReturnDecimal: number,
  yearsUntilCollege: number,
): number | null {
  if (
    ![currentSavings, afterTaxReturnDecimal, yearsUntilCollege].every(Number.isFinite) ||
    currentSavings < 0 ||
    afterTaxReturnDecimal < 0 ||
    yearsUntilCollege < 0 ||
    !Number.isInteger(yearsUntilCollege)
  ) {
    return null;
  }
  return currentSavings * (1 + afterTaxReturnDecimal) ** yearsUntilCollege;
}

/** End-of-month deposits over M = 12Y months. */
export function calculateRequiredMonthlySavings(
  fundingGap: number,
  afterTaxReturnDecimal: number,
  yearsUntilCollege: number,
): number | null {
  if (
    ![fundingGap, afterTaxReturnDecimal, yearsUntilCollege].every(Number.isFinite) ||
    fundingGap < 0 ||
    afterTaxReturnDecimal < 0 ||
    yearsUntilCollege < 0 ||
    !Number.isInteger(yearsUntilCollege)
  ) {
    return null;
  }
  if (fundingGap === 0) return 0;
  if (yearsUntilCollege === 0) return null; // no pre-college contribution window

  const months = 12 * yearsUntilCollege;
  if (afterTaxReturnDecimal === 0) return fundingGap / months;

  const rm = (1 + afterTaxReturnDecimal) ** (1 / 12) - 1;
  if (!(rm > 0)) return fundingGap / months;
  return fundingGap * (rm / ((1 + rm) ** months - 1));
}

export function calculateRequiredAnnualSavings(
  fundingGap: number,
  afterTaxReturnDecimal: number,
  yearsUntilCollege: number,
): number | null {
  if (
    ![fundingGap, afterTaxReturnDecimal, yearsUntilCollege].every(Number.isFinite) ||
    fundingGap < 0 ||
    afterTaxReturnDecimal < 0 ||
    yearsUntilCollege < 0 ||
    !Number.isInteger(yearsUntilCollege)
  ) {
    return null;
  }
  if (fundingGap === 0) return 0;
  if (yearsUntilCollege === 0) return null;

  // End-of-year ordinary annuity (consistent end-of-period timing)
  if (afterTaxReturnDecimal === 0) return fundingGap / yearsUntilCollege;
  const r = afterTaxReturnDecimal;
  return fundingGap * (r / ((1 + r) ** yearsUntilCollege - 1));
}

export function calculateCollegeCost(input: {
  annualCollegeCost: number;
  collegeCostIncreaseRate: number;
  attendanceDuration: number;
  percentFromSavings: number;
  currentSavingsBalance: number;
  investmentReturnRate: number;
  taxRate: number;
  yearsUntilCollege: number;
  currency: SupportedCurrency;
}): CollegeCostResult | null {
  const afterTax = calculateAfterTaxReturn(
    input.investmentReturnRate,
    input.taxRate,
  );
  if (afterTax === null) return null;

  const breakdown = buildAnnualCostBreakdown(
    input.annualCollegeCost,
    input.collegeCostIncreaseRate,
    input.yearsUntilCollege,
    input.attendanceDuration,
    input.percentFromSavings,
    input.currency,
  );
  if (!breakdown || breakdown.length === 0) return null;

  const totalRaw = calculateTotalCollegeCost(
    input.annualCollegeCost,
    input.collegeCostIncreaseRate,
    input.yearsUntilCollege,
    input.attendanceDuration,
  );
  const targetRaw = calculateSavingsFundedTarget(
    totalRaw ?? Number.NaN,
    input.percentFromSavings,
  );
  const futureRaw = calculateProjectedSavings(
    input.currentSavingsBalance,
    afterTax,
    input.yearsUntilCollege,
  );
  if (totalRaw === null || targetRaw === null || futureRaw === null) return null;

  const totalProjectedCollegeCost = roundMoney(totalRaw, input.currency);
  const firstYearFutureCost = breakdown[0]!.projectedAnnualCost;
  const savingsFundedTarget = roundMoney(targetRaw, input.currency);
  const otherFundingTarget = roundMoney(
    totalProjectedCollegeCost - savingsFundedTarget,
    input.currency,
  );
  const projectedCurrentSavings = roundMoney(futureRaw, input.currency);

  const rawGap = savingsFundedTarget - projectedCurrentSavings;
  const fundingGap = roundMoney(Math.max(0, rawGap), input.currency);
  const savingsSurplus = roundMoney(Math.max(0, -rawGap), input.currency);

  let financialStatus: CollegeFinancialStatus;
  if (fundingGap === 0 && savingsSurplus === 0) {
    financialStatus = 'fully-funded';
  } else if (savingsSurplus > 0) {
    financialStatus = 'savings-surplus';
  } else {
    financialStatus = 'additional-savings-required';
  }

  const monthlyRaw = calculateRequiredMonthlySavings(
    fundingGap,
    afterTax,
    input.yearsUntilCollege,
  );
  const annualRaw = calculateRequiredAnnualSavings(
    fundingGap,
    afterTax,
    input.yearsUntilCollege,
  );

  const requiredMonthlySavings =
    monthlyRaw === null ? 0 : roundMoney(Math.max(0, monthlyRaw), input.currency);
  const requiredAnnualSavings =
    annualRaw === null ? 0 : roundMoney(Math.max(0, annualRaw), input.currency);

  const savingsCoveragePercentage =
    savingsFundedTarget === 0
      ? 100
      : roundMoney(
          Math.min(100, (projectedCurrentSavings / savingsFundedTarget) * 100),
          input.currency,
        );

  const afterTaxInvestmentReturnPercent = roundMoney(afterTax * 100, input.currency);

  const explanation = buildExplanation({
    totalProjectedCollegeCost,
    percentFromSavings: input.percentFromSavings,
    savingsFundedTarget,
    projectedCurrentSavings,
    fundingGap,
    savingsSurplus,
    requiredMonthlySavings,
    yearsUntilCollege: input.yearsUntilCollege,
    financialStatus,
    currency: input.currency,
  });

  return {
    firstYearFutureCost,
    totalProjectedCollegeCost,
    savingsFundedTarget,
    otherFundingTarget,
    afterTaxInvestmentReturnPercent,
    projectedCurrentSavings,
    fundingGap,
    savingsSurplus,
    requiredMonthlySavings,
    requiredAnnualSavings,
    savingsCoveragePercentage,
    annualCostBreakdown: breakdown,
    financialStatus,
    explanation,
    yearsUntilCollege: input.yearsUntilCollege,
    attendanceDuration: input.attendanceDuration,
    percentFromSavings: input.percentFromSavings,
    currency: input.currency,
  };
}

function buildExplanation(args: {
  totalProjectedCollegeCost: number;
  percentFromSavings: number;
  savingsFundedTarget: number;
  projectedCurrentSavings: number;
  fundingGap: number;
  savingsSurplus: number;
  requiredMonthlySavings: number;
  yearsUntilCollege: number;
  financialStatus: CollegeFinancialStatus;
  currency: SupportedCurrency;
}): string {
  const total = formatMoney(args.totalProjectedCollegeCost, args.currency);
  const target = formatMoney(args.savingsFundedTarget, args.currency);
  const projected = formatMoney(args.projectedCurrentSavings, args.currency);
  const pct = args.percentFromSavings;

  if (args.financialStatus === 'savings-surplus') {
    return `Your estimated college expenses are ${total}. Based on your selected ${pct}% savings target, you should have approximately ${target} available for college savings. Your current savings are projected to grow to ${projected} by the time college begins — about ${formatMoney(args.savingsSurplus, args.currency)} above the target.`;
  }
  if (args.financialStatus === 'fully-funded') {
    return `Your estimated college expenses are ${total}. Based on your selected ${pct}% savings target, you should have approximately ${target} available for college savings. Your current savings are projected to cover that target by the time college begins.`;
  }
  if (args.yearsUntilCollege === 0) {
    return `Your estimated college expenses are ${total}. Based on your selected ${pct}% savings target, you should have approximately ${target} available for college savings. Your current savings are projected at ${projected}. You need approximately ${formatMoney(args.fundingGap, args.currency)} more before college starts (no pre-college monthly savings window).`;
  }
  return `Your estimated college expenses are ${total}. Based on your selected ${pct}% savings target, you should have approximately ${target} available for college savings. Your current savings are projected to grow to ${projected} by the time college begins. You need approximately ${formatMoney(args.fundingGap, args.currency)} more, equivalent to about ${formatMoney(args.requiredMonthlySavings, args.currency)} per month.`;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareCollegeCostText(result: CollegeCostResult): string {
  return [
    'College Cost Calculator — Omega Calculators',
    `Total projected college cost: ${formatMoney(result.totalProjectedCollegeCost, result.currency)}`,
    `First-year cost: ${formatMoney(result.firstYearFutureCost, result.currency)}`,
    `Savings target (${result.percentFromSavings}%): ${formatMoney(result.savingsFundedTarget, result.currency)}`,
    `Projected savings: ${formatMoney(result.projectedCurrentSavings, result.currency)}`,
    `Funding gap: ${formatMoney(result.fundingGap, result.currency)}`,
    `Required monthly savings: ${formatMoney(result.requiredMonthlySavings, result.currency)}`,
    `Status: ${result.financialStatus}`,
  ].join('\n');
}
