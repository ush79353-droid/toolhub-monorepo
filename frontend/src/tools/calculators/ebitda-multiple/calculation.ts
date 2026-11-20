import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface EnterpriseValueInput {
  marketCapitalization: number;
  debt: number;
  minorityInterest: number;
  preferredEquity: number;
  cashAndCashEquivalents: number;
}

export interface EbitdaMultipleMathResult {
  enterpriseValue: number;
  ebitdaMultiple: number | null;
  warning: string | null;
}

/**
 * EV = Market Cap + Debt + Minority Interest + Preferred Equity − Cash
 * Multiple = EV / EBITDA (undefined when EBITDA = 0)
 */
export function calculateEnterpriseValue(
  input: EnterpriseValueInput
): number | null {
  const {
    marketCapitalization,
    debt,
    minorityInterest,
    preferredEquity,
    cashAndCashEquivalents,
  } = input;

  const values = [
    marketCapitalization,
    debt,
    minorityInterest,
    preferredEquity,
    cashAndCashEquivalents,
  ];
  if (!values.every(Number.isFinite)) return null;
  if (values.some((v) => v < 0)) return null;

  const enterpriseValue =
    marketCapitalization +
    debt +
    minorityInterest +
    preferredEquity -
    cashAndCashEquivalents;

  return Number.isFinite(enterpriseValue) ? enterpriseValue : null;
}

export function calculateEbitdaMultiple(
  enterpriseValue: number,
  ebitda: number
): { multiple: number | null; warning: string | null } {
  if (!Number.isFinite(enterpriseValue) || !Number.isFinite(ebitda)) {
    return { multiple: null, warning: null };
  }
  if (ebitda === 0) {
    return {
      multiple: null,
      warning:
        'The EV/EBITDA multiple cannot be calculated when EBITDA is zero.',
    };
  }

  const multiple = enterpriseValue / ebitda;
  if (!Number.isFinite(multiple)) {
    return { multiple: null, warning: 'Calculated multiple is invalid.' };
  }

  const warnings: string[] = [];
  if (ebitda < 0) {
    warnings.push(
      'Negative EBITDA makes conventional EV/EBITDA valuation comparisons less meaningful.'
    );
  }
  if (enterpriseValue < 0) {
    warnings.push(
      'Enterprise value is negative — review cash, debt, and equity components or valuation methodology.'
    );
  }

  return {
    multiple,
    warning: warnings.length > 0 ? warnings.join(' ') : null,
  };
}

export function calculateValuation(input: {
  cashAndCashEquivalents: number;
  marketCapitalization: number;
  minorityInterest: number;
  preferredEquity: number;
  debt: number;
  ebitda: number;
}): EbitdaMultipleMathResult | null {
  const enterpriseValue = calculateEnterpriseValue({
    marketCapitalization: input.marketCapitalization,
    debt: input.debt,
    minorityInterest: input.minorityInterest,
    preferredEquity: input.preferredEquity,
    cashAndCashEquivalents: input.cashAndCashEquivalents,
  });
  if (enterpriseValue === null) return null;

  const { multiple, warning } = calculateEbitdaMultiple(
    enterpriseValue,
    input.ebitda
  );

  return {
    enterpriseValue,
    ebitdaMultiple: multiple,
    warning,
  };
}

export function formatMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMultiple(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function interpretMultiple(
  ev: number,
  multiple: number | null,
  symbol: string,
  currency: SupportedCurrency
): string {
  const evLabel = `${symbol}${formatMoneyAmount(ev, currency)}`;
  if (multiple == null) {
    return `Enterprise value is ${evLabel}. EV/EBITDA is unavailable for these inputs.`;
  }
  return `Enterprise value is ${evLabel}. EV/EBITDA is ${formatMultiple(multiple)}× — enterprise value is ${formatMultiple(multiple)} times the selected EBITDA figure.`;
}
