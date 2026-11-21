import { calculateFederalIncomeTax, FEDERAL_TAX_YEAR } from './tax/federal';
import { calculateStateIncomeTax, STATE_TAX_YEAR } from './tax/state';
import type {
  AnnuityPaymentRow,
  FilingStatus,
  MegaMillionsPayoutInput,
  MegaMillionsPayoutResult,
  PayoutTaxBreakdown,
  UsStateCode,
} from './types';
import { FILING_STATUS_OPTIONS } from './types';
import { getStateName } from './us-states';

export const ANNUITY_PAYMENT_COUNT = 30;
export const TAX_YEAR = FEDERAL_TAX_YEAR;

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function calculateLumpSum(
  jackpot: number,
  payoutPercentage: number,
): number {
  return jackpot * (payoutPercentage / 100);
}

export function calculateFirstAnnuityPayment(
  jackpot: number,
  annualGrowthRate: number,
  numberOfPayments: number = ANNUITY_PAYMENT_COUNT,
): number | null {
  if (
    ![jackpot, annualGrowthRate, numberOfPayments].every(Number.isFinite) ||
    !(jackpot > 0) ||
    !(numberOfPayments > 0) ||
    !Number.isInteger(numberOfPayments) ||
    annualGrowthRate < 0
  ) {
    return null;
  }

  if (Math.abs(annualGrowthRate) < 1e-15) {
    return jackpot / numberOfPayments;
  }

  const g = annualGrowthRate;
  const factor = (Math.pow(1 + g, numberOfPayments) - 1) / g;
  if (!Number.isFinite(factor) || !(factor > 0)) return null;
  const first = jackpot / factor;
  return Number.isFinite(first) && first > 0 ? first : null;
}

export function generateGrossAnnuityPayments(
  jackpot: number,
  annualGrowthRate: number,
  numberOfPayments: number = ANNUITY_PAYMENT_COUNT,
): number[] | null {
  const first = calculateFirstAnnuityPayment(
    jackpot,
    annualGrowthRate,
    numberOfPayments,
  );
  if (first === null) return null;

  const payments: number[] = [];
  for (let n = 1; n <= numberOfPayments; n += 1) {
    const payment = first * Math.pow(1 + annualGrowthRate, n - 1);
    if (!Number.isFinite(payment)) return null;
    payments.push(payment);
  }
  return payments;
}

function taxBreakdown(
  gross: number,
  filingStatus: FilingStatus,
  state: UsStateCode,
): PayoutTaxBreakdown {
  const federal = calculateFederalIncomeTax(gross, filingStatus, TAX_YEAR);
  const stateTax = calculateStateIncomeTax(gross, state, filingStatus, TAX_YEAR);
  const federalTax = federal.available ? federal.tax : 0;
  const stateAmount = stateTax.available ? stateTax.tax : 0;
  const totalTax = federalTax + stateAmount;
  return {
    grossPayout: gross,
    federalTax,
    stateTax: stateAmount,
    additionalTax: 0,
    totalTax,
    netPayout: gross - totalTax,
  };
}

export function calculateMegaMillionsPayout(input: {
  jackpot: number;
  annuityRatePercent: number;
  filingStatus: FilingStatus;
  state: UsStateCode;
  lumpSumPercent: number;
}): MegaMillionsPayoutResult | null {
  const {
    jackpot,
    annuityRatePercent,
    filingStatus,
    state,
    lumpSumPercent,
  } = input;

  if (
    ![jackpot, annuityRatePercent, lumpSumPercent].every(Number.isFinite) ||
    !(jackpot > 0) ||
    annuityRatePercent < 0 ||
    lumpSumPercent < 0 ||
    lumpSumPercent > 100
  ) {
    return null;
  }

  const growth = annuityRatePercent / 100;
  const grossPayments = generateGrossAnnuityPayments(
    jackpot,
    growth,
    ANNUITY_PAYMENT_COUNT,
  );
  if (!grossPayments) return null;

  const grossLumpSum = calculateLumpSum(jackpot, lumpSumPercent);
  const lumpSum = taxBreakdown(grossLumpSum, filingStatus, state);

  const schedule: AnnuityPaymentRow[] = [];
  let cumulativeGross = 0;
  let cumulativeNet = 0;
  let annuityFederal = 0;
  let annuityState = 0;

  for (let i = 0; i < grossPayments.length; i += 1) {
    const grossPayment = grossPayments[i]!;
    const taxes = taxBreakdown(grossPayment, filingStatus, state);
    cumulativeGross += grossPayment;
    cumulativeNet += taxes.netPayout;
    annuityFederal += taxes.federalTax;
    annuityState += taxes.stateTax;
    schedule.push({
      paymentNumber: i + 1,
      grossPayment,
      federalTax: taxes.federalTax,
      stateTax: taxes.stateTax,
      netPayment: taxes.netPayout,
      cumulativeGross,
      cumulativeNet,
    });
  }

  const annuity: PayoutTaxBreakdown = {
    grossPayout: jackpot,
    federalTax: annuityFederal,
    stateTax: annuityState,
    additionalTax: 0,
    totalTax: annuityFederal + annuityState,
    netPayout: cumulativeNet,
  };

  const filingLabel =
    FILING_STATUS_OPTIONS.find((o) => o.value === filingStatus)?.label ??
    filingStatus;
  const stateName = getStateName(state);

  const summaryText = [
    `Mega Millions payout estimate (TY ${TAX_YEAR})`,
    `Advertised jackpot: ${formatMegaMoney(jackpot)}`,
    `Lump-sum %: ${formatMegaPercent(lumpSumPercent)} → gross ${formatMegaMoney(grossLumpSum)}`,
    `Lump-sum net: ${formatMegaMoney(lumpSum.netPayout)} (federal ${formatMegaMoney(lumpSum.federalTax)}, state ${formatMegaMoney(lumpSum.stateTax)})`,
    `Annuity: ${ANNUITY_PAYMENT_COUNT} payments @ ${formatMegaPercent(annuityRatePercent)} growth`,
    `First / last payment: ${formatMegaMoney(schedule[0]!.grossPayment)} / ${formatMegaMoney(schedule[schedule.length - 1]!.grossPayment)}`,
    `Annuity estimated net total: ${formatMegaMoney(annuity.netPayout)}`,
    `Filing: ${filingLabel}; state: ${stateName}`,
    'Estimates assume no other taxable income and current-year tax rules for all annuity years.',
  ].join('\n');

  return {
    taxYear: TAX_YEAR,
    jackpot,
    annuityRatePercent,
    lumpSumPercent,
    filingStatus,
    state,
    stateName,
    grossLumpSum,
    lumpSum,
    annuityFirstPayment: schedule[0]!.grossPayment,
    annuityLastPayment: schedule[schedule.length - 1]!.grossPayment,
    annuity,
    annuitySchedule: schedule,
    futureTaxAssumptionNote:
      'Future annuity-year tax estimates reuse current (TY 2025) federal and state rules; future rates are not guaranteed.',
    summaryText,
  };
}

export function formatMegaMoney(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatMegaPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(value)}%`;
}

export function shareMegaMillionsText(result: MegaMillionsPayoutResult): string {
  return result.summaryText;
}

export function isMegaMillionsInputBlank(
  input: MegaMillionsPayoutInput,
): boolean {
  return (
    input.jackpot.trim() === '' &&
    input.annuityRatePercent.trim() === '' &&
    input.lumpSumPercent.trim() === '' &&
    input.state === ''
  );
}

export { FEDERAL_TAX_YEAR, STATE_TAX_YEAR };
