import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AdvancedBenefitsInput,
  AdvancedCostsInput,
  BillingFrequency,
  HrSoftwareRoiResult,
  PeriodPreset,
  RoiOutcome,
} from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatRatio(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function periodMonthsFromPreset(
  preset: PeriodPreset,
  customMonths: number | null,
): number | null {
  switch (preset) {
    case '1y':
      return 12;
    case '2y':
      return 24;
    case '3y':
      return 36;
    case '5y':
      return 60;
    case 'custom':
      if (customMonths === null || !(customMonths > 0)) return null;
      return customMonths;
  }
}

export function periodLabel(months: number): string {
  if (months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? '1 year' : `${years} years`;
  }
  return months === 1 ? '1 month' : `${months} months`;
}

/** Convert a billed amount into the evaluation period. One-time = once. */
export function amountOverPeriod(
  amount: number,
  frequency: BillingFrequency,
  periodMonths: number,
): number {
  if (!(amount >= 0) || !(periodMonths > 0)) return 0;
  switch (frequency) {
    case 'one-time':
      return amount;
    case 'monthly':
      return amount * periodMonths;
    case 'quarterly':
      return amount * (periodMonths / 3);
    case 'annually':
      return amount * (periodMonths / 12);
  }
}

export function calculateHRSoftwareROI(
  investmentCost: number,
  grossBenefit: number,
): {
  investmentCost: number;
  grossBenefit: number;
  netBenefit: number;
  roiPercentage: number;
  benefitCostRatio: number;
} | null {
  if (!Number.isFinite(investmentCost) || !(investmentCost > 0)) return null;
  if (!Number.isFinite(grossBenefit) || grossBenefit < 0) return null;

  const netBenefit = grossBenefit - investmentCost;
  const roiPercentage = (netBenefit / investmentCost) * 100;
  const benefitCostRatio = grossBenefit / investmentCost;
  if (![netBenefit, roiPercentage, benefitCostRatio].every(Number.isFinite)) return null;

  return {
    investmentCost,
    grossBenefit,
    netBenefit,
    roiPercentage,
    benefitCostRatio,
  };
}

export function outcomeFromRoi(roiPercentage: number): RoiOutcome {
  if (Math.abs(roiPercentage) < 1e-9) return 'breakeven';
  return roiPercentage > 0 ? 'positive' : 'negative';
}

export function interpretRoi(outcome: RoiOutcome): string {
  if (outcome === 'positive') {
    return 'Your HR software generated financial benefits exceeding its measured investment cost during the selected period.';
  }
  if (outcome === 'breakeven') {
    return 'The measured financial benefits equal the investment cost, resulting in break-even ROI.';
  }
  return 'The measured investment costs exceed the financial benefits for the selected period.';
}

function n(raw: string): number {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return 0;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function sumAdvancedCosts(
  costs: AdvancedCostsInput,
  periodMonths: number,
): number | null {
  const values = [
    n(costs.initialLicense),
    n(costs.implementation),
    n(costs.dataMigration),
    n(costs.training),
    n(costs.integration),
    n(costs.otherCosts),
    n(costs.implHours),
    n(costs.loadedHourlyCost),
    n(costs.subscriptionAmount),
    n(costs.maintenance),
  ];
  if (values.some((v) => Number.isNaN(v) || v < 0)) return null;

  const oneTime =
    n(costs.initialLicense) +
    n(costs.implementation) +
    n(costs.dataMigration) +
    n(costs.training) +
    n(costs.integration) +
    n(costs.otherCosts) +
    n(costs.implHours) * n(costs.loadedHourlyCost);

  const subscription = amountOverPeriod(
    n(costs.subscriptionAmount),
    costs.subscriptionFrequency,
    periodMonths,
  );
  const maintenance = amountOverPeriod(
    n(costs.maintenance),
    costs.maintenanceFrequency,
    periodMonths,
  );

  const total = oneTime + subscription + maintenance;
  return Number.isFinite(total) ? total : null;
}

export function sumAdvancedBenefits(
  benefits: AdvancedBenefitsInput,
  periodMonths: number,
): number | null {
  const nums = [
    n(benefits.hrEmployees),
    n(benefits.hoursSavedPerWeek),
    n(benefits.adminHourlyCost),
    n(benefits.workingWeeks),
    n(benefits.payrollCurrentMonthly),
    n(benefits.payrollNewMonthly),
    n(benefits.annualHires),
    n(benefits.oldCostPerHire),
    n(benefits.newCostPerHire),
    n(benefits.retentionEmployees),
    n(benefits.oldTurnoverPercent),
    n(benefits.newTurnoverPercent),
    n(benefits.replacementCost),
    n(benefits.avoidedErrors),
    n(benefits.costPerError),
    n(benefits.docsCurrentMonthly),
    n(benefits.docsNewMonthly),
    n(benefits.thirdPartySavings),
    n(benefits.otherBenefits),
  ];
  if (nums.some((v) => Number.isNaN(v) || v < 0)) return null;

  const years = periodMonths / 12;

  // Admin time savings for the period (working weeks scaled by years).
  const weeks = n(benefits.workingWeeks) * years;
  const adminSavings =
    n(benefits.hrEmployees) *
    n(benefits.hoursSavedPerWeek) *
    n(benefits.adminHourlyCost) *
    weeks;

  const payrollMonthly =
    n(benefits.payrollCurrentMonthly) - n(benefits.payrollNewMonthly);
  const payrollSavings = payrollMonthly * periodMonths;

  const recruitmentAnnual =
    n(benefits.annualHires) *
    (n(benefits.oldCostPerHire) - n(benefits.newCostPerHire));
  const recruitmentSavings = recruitmentAnnual * years;

  const avoidedDepartures =
    n(benefits.retentionEmployees) *
    ((n(benefits.oldTurnoverPercent) - n(benefits.newTurnoverPercent)) / 100);
  const retentionSavings = Math.max(0, avoidedDepartures) * n(benefits.replacementCost) * years;

  const errorSavings = n(benefits.avoidedErrors) * n(benefits.costPerError) * years;

  const docsMonthly = n(benefits.docsCurrentMonthly) - n(benefits.docsNewMonthly);
  const docsSavings = docsMonthly * periodMonths;

  const other =
    n(benefits.thirdPartySavings) * years + n(benefits.otherBenefits) * years;

  const total =
    adminSavings +
    payrollSavings +
    recruitmentSavings +
    retentionSavings +
    errorSavings +
    docsSavings +
    other;

  return Number.isFinite(total) ? total : null;
}

/**
 * Simplified payback: one-time costs / annual net recurring benefit.
 * Recurring benefit ≈ (period gross − period recurring costs) annualized;
 * one-time = total investment − recurring costs in period.
 */
export function calculatePaybackYears(args: {
  totalInvestment: number;
  totalBenefit: number;
  periodMonths: number;
  recurringCostsInPeriod: number;
}): { years: number | null; message: string | null } {
  const { totalInvestment, totalBenefit, periodMonths, recurringCostsInPeriod } = args;
  if (!(periodMonths > 0)) return { years: null, message: null };

  const oneTime = Math.max(0, totalInvestment - recurringCostsInPeriod);
  const periodNetRecurring = totalBenefit - recurringCostsInPeriod;
  const annualNetRecurring = periodNetRecurring * (12 / periodMonths);

  if (!(annualNetRecurring > 0) || !(oneTime > 0)) {
    return {
      years: null,
      message: 'No finite payback period under the current assumptions.',
    };
  }

  const years = oneTime / annualNetRecurring;
  if (!Number.isFinite(years) || years < 0) {
    return {
      years: null,
      message: 'No finite payback period under the current assumptions.',
    };
  }
  return { years, message: null };
}

export function recurringCostsInPeriod(
  costs: AdvancedCostsInput,
  periodMonths: number,
): number {
  return (
    amountOverPeriod(n(costs.subscriptionAmount), costs.subscriptionFrequency, periodMonths) +
    amountOverPeriod(n(costs.maintenance), costs.maintenanceFrequency, periodMonths)
  );
}

export function toHrSoftwareRoiResult(args: {
  investmentCost: number;
  grossBenefit: number;
  periodMonths: number;
  fromAdvanced: boolean;
  currency: SupportedCurrency;
  paybackYears: number | null;
  paybackMessage: string | null;
}): HrSoftwareRoiResult | null {
  const core = calculateHRSoftwareROI(args.investmentCost, args.grossBenefit);
  if (!core) return null;

  const outcome = outcomeFromRoi(core.roiPercentage);
  const investmentCost = roundMoney(core.investmentCost, args.currency);
  const grossBenefit = roundMoney(core.grossBenefit, args.currency);
  const netBenefit = roundMoney(core.netBenefit, args.currency);

  return {
    investmentCost,
    grossBenefit,
    netBenefit,
    roiPercentage: core.roiPercentage,
    benefitCostRatio: core.benefitCostRatio,
    periodMonths: args.periodMonths,
    periodLabel: periodLabel(args.periodMonths),
    outcome,
    interpretation: interpretRoi(outcome),
    paybackYears: args.paybackYears,
    paybackMessage: args.paybackMessage,
    fromAdvanced: args.fromAdvanced,
    currency: args.currency,
    formattedInvestmentCost: formatMoney(investmentCost, args.currency),
    formattedGrossBenefit: formatMoney(grossBenefit, args.currency),
    formattedNetBenefit: formatMoney(netBenefit, args.currency),
    formattedRoiPercentage: formatPercent(core.roiPercentage),
    formattedBenefitCostRatio: formatRatio(core.benefitCostRatio),
    formattedPaybackYears:
      args.paybackYears === null
        ? ''
        : new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
          }).format(args.paybackYears),
  };
}

export function shareResultText(
  result: HrSoftwareRoiResult,
  path = '/tools/hr-software-roi-calculator',
): string {
  const lines = [
    'HR Software ROI Calculator — Omega Calculators',
    '',
    `Evaluation period: ${result.periodLabel}`,
    `Investment cost: ${result.formattedInvestmentCost} ${result.currency}`,
    `Gross benefits: ${result.formattedGrossBenefit} ${result.currency}`,
    `Net benefit: ${result.formattedNetBenefit} ${result.currency}`,
    `ROI: ${result.formattedRoiPercentage}%`,
    `Benefit-cost ratio: ${result.formattedBenefitCostRatio}`,
  ];
  if (result.paybackYears !== null) {
    lines.push(`Estimated payback: ${result.formattedPaybackYears} years`);
  } else if (result.paybackMessage) {
    lines.push(result.paybackMessage);
  }
  lines.push('', result.interpretation, 'Currency changes formatting only.', path);
  return lines.join('\n');
}
