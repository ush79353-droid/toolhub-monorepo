import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { InvestmentFeeResult } from './types';

function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

/**
 * invested = initial × (1 − salesLoad)
 * effectiveReturn = annualReturn − operatingFees
 * beforeRedemption = invested × (1 + effective)^n − invested × turnover
 * final = beforeRedemption × (1 − redemption)
 * withoutFees = initial × (1 + annualReturn)^n
 * totalFees = withoutFees − final
 */
export function calculateInvestmentFee(input: {
  initialInvestment: number;
  salesLoadPercent: number;
  annualReturnPercent: number;
  annualOperatingFeesPercent: number;
  durationYears: number;
  turnoverCostPercent: number;
  redemptionFeesPercent: number;
  currency: SupportedCurrency;
}): InvestmentFeeResult | null {
  const {
    initialInvestment,
    salesLoadPercent,
    annualReturnPercent,
    annualOperatingFeesPercent,
    durationYears,
    turnoverCostPercent,
    redemptionFeesPercent,
    currency,
  } = input;

  if (
    ![
      initialInvestment,
      salesLoadPercent,
      annualReturnPercent,
      annualOperatingFeesPercent,
      durationYears,
      turnoverCostPercent,
      redemptionFeesPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(initialInvestment > 0)) return null;
  if (salesLoadPercent < 0 || salesLoadPercent >= 100) return null;
  if (annualOperatingFeesPercent < 0) return null;
  if (turnoverCostPercent < 0) return null;
  if (redemptionFeesPercent < 0 || redemptionFeesPercent >= 100) return null;
  if (!(durationYears > 0)) return null;

  const salesLoad = salesLoadPercent / 100;
  const annualReturn = annualReturnPercent / 100;
  const operating = annualOperatingFeesPercent / 100;
  const turnover = turnoverCostPercent / 100;
  const redemption = redemptionFeesPercent / 100;

  const investedAmount = initialInvestment * (1 - salesLoad);
  if (!(investedAmount > 0) || !Number.isFinite(investedAmount)) return null;

  const effectiveReturn = annualReturn - operating;
  if (effectiveReturn <= -1) return null;

  const grown = (1 + effectiveReturn) ** durationYears;
  if (!Number.isFinite(grown)) return null;

  const fundValueBeforeRedemption = investedAmount * grown - investedAmount * turnover;
  if (!Number.isFinite(fundValueBeforeRedemption)) return null;

  const finalFundValue = fundValueBeforeRedemption * (1 - redemption);
  if (!Number.isFinite(finalFundValue)) return null;

  if (annualReturn <= -1) return null;
  const withoutGrown = (1 + annualReturn) ** durationYears;
  if (!Number.isFinite(withoutGrown)) return null;
  const fundValueWithoutFees = initialInvestment * withoutGrown;
  if (!Number.isFinite(fundValueWithoutFees)) return null;

  const totalFees = fundValueWithoutFees - finalFundValue;
  if (!Number.isFinite(totalFees)) return null;

  const effectiveReturnPercent = effectiveReturn * 100;

  return {
    investedAmount,
    effectiveReturnPercent,
    fundValueBeforeRedemption,
    finalFundValue,
    fundValueWithoutFees,
    totalFees,
    currency,
    formattedInvestedAmount: formatMoney(investedAmount, currency),
    formattedEffectiveReturn: formatPercent(effectiveReturnPercent),
    formattedFundValueBeforeRedemption: formatMoney(fundValueBeforeRedemption, currency),
    formattedFinalFundValue: formatMoney(finalFundValue, currency),
    formattedFundValueWithoutFees: formatMoney(fundValueWithoutFees, currency),
    formattedTotalFees: formatMoney(totalFees, currency),
  };
}
