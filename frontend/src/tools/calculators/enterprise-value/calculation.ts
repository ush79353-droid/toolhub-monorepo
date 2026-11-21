import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface EnterpriseValueMathInput {
  marketCapitalization: number;
  minorityInterest: number;
  preferredShares: number;
  debt: number;
  cashAndCashEquivalents: number;
}

export interface EnterpriseValueMathResult {
  enterpriseValue: number;
  totalClaims: number;
  netDebt: number;
}

/**
 * EV = Market Cap + Minority Interest + Preferred Shares + Debt − Cash
 */
export function calculateEnterpriseValue(
  input: EnterpriseValueMathInput
): EnterpriseValueMathResult | null {
  const {
    marketCapitalization,
    minorityInterest,
    preferredShares,
    debt,
    cashAndCashEquivalents,
  } = input;

  const values = [
    marketCapitalization,
    minorityInterest,
    preferredShares,
    debt,
    cashAndCashEquivalents,
  ];
  if (!values.every(Number.isFinite)) return null;
  if (values.some((v) => v < 0)) return null;

  const totalClaims =
    marketCapitalization + minorityInterest + preferredShares + debt;
  const netDebt = debt - cashAndCashEquivalents;
  const enterpriseValue = totalClaims - cashAndCashEquivalents;

  if (
    !Number.isFinite(totalClaims) ||
    !Number.isFinite(netDebt) ||
    !Number.isFinite(enterpriseValue)
  ) {
    return null;
  }

  return { enterpriseValue, totalClaims, netDebt };
}

export function formatEvMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function interpretEv(
  ev: number,
  symbol: string,
  currency: SupportedCurrency
): string {
  const label = `${symbol}${formatEvMoney(ev, currency)}`;
  if (ev < 0) {
    return `Enterprise value is ${label}. Cash exceeds combined financing claims under this simplified formula; interpret carefully.`;
  }
  if (ev === 0) {
    return 'Enterprise value is zero under these inputs.';
  }
  return `Enterprise value is ${label} using market capitalization, debt, minority interest, preferred equity, and cash.`;
}
