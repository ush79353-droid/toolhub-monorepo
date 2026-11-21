import {
  calculateFirstAnnuityPayment,
  calculateLumpSum,
  generateGrossAnnuityPayments,
  parseOptionalNumber,
} from '../mega-millions-payout/calculation';
import { calculateFederalIncomeTax, FEDERAL_TAX_YEAR } from '../mega-millions-payout/tax/federal';
import { getStateName } from '../mega-millions-payout/us-states';
import type { FilingStatus as MegaFilingStatus } from '../mega-millions-payout/types';
import { calculateLotteryStateIncomeTax } from './lottery-state-tax';
import type {
  AnnuityPaymentRow,
  FilingStatus,
  PayoutTaxBreakdown,
  PowerballInput,
  PowerballResult,
  UsStateCode,
} from './types';
import {
  FEDERAL_LOTTERY_WITHHOLDING_RATE,
  FILING_STATUS_OPTIONS,
  POWERBALL_ANNUITY_GROWTH,
  POWERBALL_PAYMENT_COUNT,
} from './types';

export { parseOptionalNumber, calculateLumpSum, calculateFirstAnnuityPayment };
export const TAX_YEAR = FEDERAL_TAX_YEAR;

export function estimateFederalLotteryWithholding(gross: number): number {
  if (!(gross > 5_000)) return 0;
  return gross * FEDERAL_LOTTERY_WITHHOLDING_RATE;
}

function taxBreakdown(
  gross: number,
  filingStatus: FilingStatus,
  state: UsStateCode,
): PayoutTaxBreakdown {
  const federal = calculateFederalIncomeTax(
    gross,
    filingStatus as MegaFilingStatus,
    TAX_YEAR,
  );
  const stateTax = calculateLotteryStateIncomeTax(
    gross,
    state,
    filingStatus,
    TAX_YEAR,
  );
  const federalTax = federal.available ? federal.tax : 0;
  const stateAmount = stateTax.available ? stateTax.tax : 0;
  return {
    grossPayout: gross,
    federalWithholding: estimateFederalLotteryWithholding(gross),
    federalTax,
    stateTax: stateAmount,
    totalTax: federalTax + stateAmount,
    netPayout: gross - federalTax - stateAmount,
  };
}

export function calculatePowerballPayout(input: {
  jackpot: number;
  lumpSumPercent: number;
  filingStatus: FilingStatus;
  state: UsStateCode;
}): PowerballResult | null {
  const { jackpot, lumpSumPercent, filingStatus, state } = input;
  if (
    ![jackpot, lumpSumPercent].every(Number.isFinite) ||
    !(jackpot > 0) ||
    lumpSumPercent < 0 ||
    lumpSumPercent > 100
  ) {
    return null;
  }

  const grossPayments = generateGrossAnnuityPayments(
    jackpot,
    POWERBALL_ANNUITY_GROWTH,
    POWERBALL_PAYMENT_COUNT,
  );
  if (!grossPayments) return null;

  const grossLumpSum = calculateLumpSum(jackpot, lumpSumPercent);
  const lumpSum = taxBreakdown(grossLumpSum, filingStatus, state);

  const annualPayments: AnnuityPaymentRow[] = [];
  let annuityFederal = 0;
  let annuityState = 0;
  let annuityNet = 0;

  for (let i = 0; i < grossPayments.length; i += 1) {
    const grossPayment = grossPayments[i]!;
    const taxes = taxBreakdown(grossPayment, filingStatus, state);
    annuityFederal += taxes.federalTax;
    annuityState += taxes.stateTax;
    annuityNet += taxes.netPayout;
    annualPayments.push({
      year: i + 1,
      grossPayment,
      federalTax: taxes.federalTax,
      stateTax: taxes.stateTax,
      totalTax: taxes.totalTax,
      netPayment: taxes.netPayout,
    });
  }

  const annuity: PayoutTaxBreakdown = {
    grossPayout: jackpot,
    federalWithholding: estimateFederalLotteryWithholding(
      annualPayments[0]?.grossPayment ?? 0,
    ),
    federalTax: annuityFederal,
    stateTax: annuityState,
    totalTax: annuityFederal + annuityState,
    netPayout: annuityNet,
  };

  const filingLabel =
    FILING_STATUS_OPTIONS.find((o) => o.value === filingStatus)?.label ??
    filingStatus;
  const stateName = getStateName(state);

  const summaryText = [
    `Powerball payout estimate (TY ${TAX_YEAR})`,
    `Advertised jackpot: ${formatPowerballMoney(jackpot)}`,
    `Lump-sum %: ${lumpSumPercent}% → gross ${formatPowerballMoney(grossLumpSum)}`,
    `Est. federal tax (liability): ${formatPowerballMoney(lumpSum.federalTax)} · withholding @ 24%: ${formatPowerballMoney(lumpSum.federalWithholding)}`,
    `Est. state tax: ${formatPowerballMoney(lumpSum.stateTax)}`,
    `Lump-sum net: ${formatPowerballMoney(lumpSum.netPayout)}`,
    `Annuity: ${POWERBALL_PAYMENT_COUNT} payments @ 5% growth · net total ${formatPowerballMoney(annuity.netPayout)}`,
    `First / last gross: ${formatPowerballMoney(annualPayments[0]!.grossPayment)} / ${formatPowerballMoney(annualPayments[annualPayments.length - 1]!.grossPayment)}`,
    `Filing: ${filingLabel}; state: ${stateName}`,
    'Estimates assume no other taxable income. Withholding ≠ final tax liability.',
  ].join('\n');

  return {
    taxYear: TAX_YEAR,
    advertisedJackpot: jackpot,
    lumpSumPercent,
    filingStatus,
    state,
    stateName,
    annuityGrowthPercent: POWERBALL_ANNUITY_GROWTH * 100,
    lumpSum,
    annuity,
    annuityFirstPayment: annualPayments[0]!.grossPayment,
    annuityLastPayment: annualPayments[annualPayments.length - 1]!.grossPayment,
    annualPayments,
    futureTaxAssumptionNote:
      'Future annuity-year tax estimates reuse current (TY 2025) federal and state rules; future rates are not guaranteed.',
    summaryText,
  };
}

export function formatPowerballMoney(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function sharePowerballText(result: PowerballResult): string {
  return result.summaryText;
}

export function isPowerballInputBlank(input: PowerballInput): boolean {
  return (
    input.jackpot.trim() === '' &&
    input.lumpSumPercent.trim() === '' &&
    input.state === ''
  );
}
