import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  CellPhonePlanResult,
  RecommendedPhonePlanOption,
  SavingsSimulation,
} from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function calculateOutrightCost(
  phonePrice: number,
  monthlyBill: number,
  contractDuration: number,
): number | null {
  if (
    ![phonePrice, monthlyBill, contractDuration].every(Number.isFinite) ||
    phonePrice < 0 ||
    monthlyBill < 0 ||
    contractDuration <= 0 ||
    !Number.isInteger(contractDuration)
  ) {
    return null;
  }
  return phonePrice + monthlyBill * contractDuration;
}

/** Carrier bill minus own-phone bill; never negative. */
export function calculateMonthlySavingsWithdrawal(
  outrightMonthlyBill: number,
  carrierMonthlyBill: number,
): number | null {
  if (
    ![outrightMonthlyBill, carrierMonthlyBill].every(Number.isFinite) ||
    outrightMonthlyBill < 0 ||
    carrierMonthlyBill < 0
  ) {
    return null;
  }
  return Math.max(0, carrierMonthlyBill - outrightMonthlyBill);
}

/**
 * Monthly savings: withdraw first, then compound interest on the remainder.
 * ponytail: Omni reference ($35.73 on $800 / $30 / 24 / 4%) matches withdraw-then-interest;
 * interest-then-withdraw yields ~$38.23. Ceiling: document if product switches timing.
 */
export function simulateSavingsAccount(
  initialDeposit: number,
  monthlyWithdrawal: number,
  annualInterestRatePercent: number,
  contractDuration: number,
): SavingsSimulation | null {
  if (
    ![
      initialDeposit,
      monthlyWithdrawal,
      annualInterestRatePercent,
      contractDuration,
    ].every(Number.isFinite) ||
    initialDeposit < 0 ||
    monthlyWithdrawal < 0 ||
    annualInterestRatePercent < 0 ||
    contractDuration <= 0 ||
    !Number.isInteger(contractDuration)
  ) {
    return null;
  }

  const monthlyInterestRate = annualInterestRatePercent / 100 / 12;
  let balance = initialDeposit;
  let totalInterestEarned = 0;
  let isFeasible = true;

  for (let month = 0; month < contractDuration; month += 1) {
    if (balance + 1e-12 < monthlyWithdrawal) {
      isFeasible = false;
      break;
    }
    balance -= monthlyWithdrawal;
    const interest = balance * monthlyInterestRate;
    totalInterestEarned += interest;
    balance += interest;
  }

  const totalWithdrawals = monthlyWithdrawal * contractDuration;

  return {
    initialDeposit,
    monthlyWithdrawal,
    monthlyInterestRate,
    finalBalance: isFeasible ? balance : 0,
    totalInterestEarned: isFeasible ? totalInterestEarned : 0,
    totalWithdrawals: isFeasible ? totalWithdrawals : 0,
    isFeasible,
  };
}

export function calculateCarrierPlanCost(
  carrierMonthlyBill: number,
  contractDuration: number,
  interestEarned: number,
): number | null {
  if (
    ![carrierMonthlyBill, contractDuration, interestEarned].every(Number.isFinite) ||
    carrierMonthlyBill < 0 ||
    contractDuration <= 0 ||
    interestEarned < 0
  ) {
    return null;
  }
  return carrierMonthlyBill * contractDuration - interestEarned;
}

export function calculateCellPhonePlan(input: {
  contractDuration: number;
  annualInterestRate: number;
  phonePrice: number;
  outrightMonthlyBill: number;
  carrierMonthlyBill: number;
  currency: SupportedCurrency;
}): CellPhonePlanResult | null {
  const outrightRaw = calculateOutrightCost(
    input.phonePrice,
    input.outrightMonthlyBill,
    input.contractDuration,
  );
  const withdrawal = calculateMonthlySavingsWithdrawal(
    input.outrightMonthlyBill,
    input.carrierMonthlyBill,
  );
  if (outrightRaw === null || withdrawal === null) return null;

  const simulation = simulateSavingsAccount(
    input.phonePrice,
    withdrawal,
    input.annualInterestRate,
    input.contractDuration,
  );
  if (!simulation) return null;

  const outrightTotalCost = roundMoney(outrightRaw, input.currency);
  const carrierTotalPayments = roundMoney(
    input.carrierMonthlyBill * input.contractDuration,
    input.currency,
  );

  if (!simulation.isFeasible) {
    return {
      contractDuration: input.contractDuration,
      annualInterestRate: input.annualInterestRate,
      phonePrice: roundMoney(input.phonePrice, input.currency),
      outrightMonthlyBill: roundMoney(input.outrightMonthlyBill, input.currency),
      carrierMonthlyBill: roundMoney(input.carrierMonthlyBill, input.currency),
      outrightTotalCost,
      carrierTotalPayments,
      interestEarned: 0,
      carrierEffectiveTotalCost: carrierTotalPayments,
      monthlyDifference: roundMoney(withdrawal, input.currency),
      costDifference: 0,
      absoluteCostDifference: 0,
      recommendedOption: 'infeasible',
      recommendationText:
        'The savings strategy is not feasible for these inputs — monthly withdrawals would exhaust the invested phone price before the contract ends.',
      savingsSimulation: {
        ...simulation,
        finalBalance: 0,
        totalInterestEarned: 0,
        totalWithdrawals: 0,
      },
      currency: input.currency,
    };
  }

  const interestEarned = roundMoney(
    simulation.totalInterestEarned,
    input.currency,
  );
  const carrierRaw = calculateCarrierPlanCost(
    input.carrierMonthlyBill,
    input.contractDuration,
    interestEarned,
  );
  if (carrierRaw === null) return null;

  const carrierEffectiveTotalCost = roundMoney(carrierRaw, input.currency);
  const costDifference = roundMoney(
    outrightTotalCost - carrierEffectiveTotalCost,
    input.currency,
  );
  const absoluteCostDifference = Math.abs(costDifference);

  let recommendedOption: RecommendedPhonePlanOption;
  let recommendationText: string;
  if (costDifference > 0) {
    recommendedOption = 'carrier';
    recommendationText = `The carrier plan is cheaper by ${formatMoney(absoluteCostDifference, input.currency)} over the selected contract duration.`;
  } else if (costDifference < 0) {
    recommendedOption = 'outright';
    recommendationText = `Buying outright is cheaper by ${formatMoney(absoluteCostDifference, input.currency)} over the selected contract duration.`;
  } else {
    recommendedOption = 'equal';
    recommendationText =
      'Both options have the same estimated cost over the selected contract duration.';
  }

  return {
    contractDuration: input.contractDuration,
    annualInterestRate: input.annualInterestRate,
    phonePrice: roundMoney(input.phonePrice, input.currency),
    outrightMonthlyBill: roundMoney(input.outrightMonthlyBill, input.currency),
    carrierMonthlyBill: roundMoney(input.carrierMonthlyBill, input.currency),
    outrightTotalCost,
    carrierTotalPayments,
    interestEarned,
    carrierEffectiveTotalCost,
    monthlyDifference: roundMoney(withdrawal, input.currency),
    costDifference,
    absoluteCostDifference,
    recommendedOption,
    recommendationText,
    savingsSimulation: {
      ...simulation,
      finalBalance: roundMoney(simulation.finalBalance, input.currency),
      totalInterestEarned: interestEarned,
      totalWithdrawals: roundMoney(simulation.totalWithdrawals, input.currency),
    },
    currency: input.currency,
  };
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareCellPhonePlanText(result: CellPhonePlanResult): string {
  return [
    'Cell Phone Plan Calculator — Omega Calculators',
    `Contract: ${result.contractDuration} months`,
    `Savings interest rate: ${result.annualInterestRate}%`,
    `Phone price: ${formatMoney(result.phonePrice, result.currency)}`,
    `Outright monthly bill: ${formatMoney(result.outrightMonthlyBill, result.currency)}`,
    `Carrier monthly bill: ${formatMoney(result.carrierMonthlyBill, result.currency)}`,
    `Outright total: ${formatMoney(result.outrightTotalCost, result.currency)}`,
    `Carrier effective total: ${formatMoney(result.carrierEffectiveTotalCost, result.currency)}`,
    `Interest earned: ${formatMoney(result.interestEarned, result.currency)}`,
    `Difference: ${formatMoney(result.absoluteCostDifference, result.currency)}`,
    `Recommendation: ${result.recommendationText}`,
  ].join('\n');
}
