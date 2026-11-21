import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  EQUITY_OPTION_CONTRACT_MULTIPLIER,
  type CallOptionResult,
  type OptionMode,
} from './types';

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatOptionMoney(
  amount: number,
  currency: CallOptionResult['currency']
): string {
  return formatCurrencyValue(amount, currency);
}

function moneynessLabel(
  mode: OptionMode,
  asset: number,
  strike: number
): CallOptionResult['moneyness'] {
  if (asset === strike) return 'atm';
  if (mode === 'call') return asset > strike ? 'itm' : 'otm';
  return asset < strike ? 'itm' : 'otm';
}

/**
 * Equity-style call/put premium cost.
 * Total premium = quoted premium per share × 100 × number of contracts.
 * Break-even and intrinsic use the asset/target and strike for context only.
 */
export function calculateCallOption(input: {
  mode: OptionMode;
  assetPrice: number;
  strikePrice: number;
  optionPrice: number;
  contracts: number;
  currency: CallOptionResult['currency'];
}): CallOptionResult | null {
  const { mode, currency } = input;
  const assetPrice = input.assetPrice;
  const strikePrice = input.strikePrice;
  const optionPrice = input.optionPrice;
  const contracts = input.contracts;
  const multiplier = EQUITY_OPTION_CONTRACT_MULTIPLIER;

  if (
    ![assetPrice, strikePrice, optionPrice, contracts].every(Number.isFinite)
  ) {
    return null;
  }
  if (assetPrice < 0 || strikePrice < 0 || optionPrice < 0 || contracts < 0) {
    return null;
  }
  if (!Number.isInteger(contracts)) {
    return null;
  }

  const totalPremiumCost = roundMoney(optionPrice * multiplier * contracts);
  const breakEvenPrice = roundMoney(
    mode === 'call' ? strikePrice + optionPrice : strikePrice - optionPrice
  );
  const intrinsicRaw =
    mode === 'call'
      ? Math.max(0, assetPrice - strikePrice)
      : Math.max(0, strikePrice - assetPrice);
  const intrinsicPerShare = roundMoney(intrinsicRaw);
  const timeValuePerShare = roundMoney(optionPrice - intrinsicPerShare);
  const profitLossAtAsset = roundMoney(
    (intrinsicPerShare - optionPrice) * multiplier * contracts
  );
  const moneyness = moneynessLabel(mode, assetPrice, strikePrice);

  const modeLabel = mode === 'call' ? 'call' : 'put';
  const moneynessText =
    moneyness === 'atm'
      ? 'at the money'
      : moneyness === 'itm'
        ? 'in the money'
        : 'out of the money';

  const explanation = [
    `Total ${modeLabel} premium = ${formatOptionMoney(optionPrice, currency)} × ${multiplier} × ${contracts} = ${formatOptionMoney(totalPremiumCost, currency)}.`,
    `At the given asset/target price the option is ${moneynessText}.`,
    `Break-even (per share, ignoring fees/taxes) ≈ ${formatOptionMoney(breakEvenPrice, currency)}.`,
  ].join(' ');

  return {
    mode,
    currency,
    assetPrice,
    strikePrice,
    optionPrice,
    contracts,
    contractMultiplier: multiplier,
    totalPremiumCost,
    breakEvenPrice,
    intrinsicPerShare,
    timeValuePerShare,
    profitLossAtAsset,
    moneyness,
    formattedTotalPremiumCost: formatOptionMoney(totalPremiumCost, currency),
    formattedBreakEvenPrice: formatOptionMoney(breakEvenPrice, currency),
    formattedIntrinsicPerShare: formatOptionMoney(intrinsicPerShare, currency),
    formattedTimeValuePerShare: formatOptionMoney(timeValuePerShare, currency),
    formattedProfitLossAtAsset: formatOptionMoney(profitLossAtAsset, currency),
    explanation,
  };
}
