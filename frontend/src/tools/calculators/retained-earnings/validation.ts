import {
  calculateDividendsDistributed,
  calculateRetainedEarnings,
  calculateRetainedEarningsPerShare,
  calculateRetentionRatioPercent,
  formatReMoney,
  formatRePercent,
  formatReShares,
  interpretRetainedEarnings,
} from './calculation';
import type {
  RetainedEarningsFieldErrors,
  RetainedEarningsInput,
  RetainedEarningsResult,
  RetainedEarningsStatus,
} from './types';

export interface RetainedEarningsValidation {
  isValid: boolean;
  errors: RetainedEarningsFieldErrors;
  result: RetainedEarningsResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateRetainedEarningsInput(
  input: RetainedEarningsInput
): RetainedEarningsValidation {
  const errors: RetainedEarningsFieldErrors = {};
  const currency = input.currency;

  const earnings = parseNumber(input.earnings);
  const payout = parseNumber(input.dividendPayoutRatio);
  const shares = parseNumber(input.sharesOutstanding);

  if (!earnings.blank) {
    if (earnings.invalid || earnings.value === null) {
      errors.earnings = 'Enter a valid earnings (net income) amount.';
    }
  }
  if (!payout.blank) {
    if (payout.invalid || payout.value === null) {
      errors.dividendPayoutRatio = 'Enter a valid dividend payout ratio.';
    } else if (payout.value < 0) {
      errors.dividendPayoutRatio =
        'Dividend payout ratio cannot be negative.';
    }
  }
  if (!shares.blank) {
    if (shares.invalid || shares.value === null) {
      errors.sharesOutstanding = 'Enter a valid number of shares.';
    } else if (shares.value < 0) {
      errors.sharesOutstanding = 'Shares outstanding cannot be negative.';
    } else if (shares.value === 0) {
      errors.sharesOutstanding =
        'Shares outstanding must be greater than zero.';
    } else if (!Number.isInteger(shares.value)) {
      errors.sharesOutstanding =
        'Enter a whole number of shares outstanding.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    earnings.blank ||
    payout.blank ||
    earnings.value === null ||
    payout.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  // Conventional payout path requires positive earnings.
  if (earnings.value <= 0) {
    return {
      isValid: false,
      errors: {
        form:
          earnings.value === 0
            ? 'Conventional dividend payout ratio is not meaningful when earnings are zero — enter actual dividends separately in a full statement of retained earnings.'
            : 'Conventional dividend payout ratio is not meaningful for negative earnings (net loss). Do not infer dividends from a payout percentage.',
      },
      result: null,
    };
  }

  const dividendsDistributed = calculateDividendsDistributed(
    earnings.value,
    payout.value
  );
  if (dividendsDistributed === null) {
    return { isValid: false, errors, result: null };
  }

  const retainedEarnings = calculateRetainedEarnings(
    earnings.value,
    dividendsDistributed
  );
  if (retainedEarnings === null) {
    return { isValid: false, errors, result: null };
  }

  const retentionRatio = calculateRetentionRatioPercent(payout.value);
  if (retentionRatio === null) {
    return { isValid: false, errors, result: null };
  }

  let sharesOutstanding: number | null = null;
  let retainedEarningsPerShare: number | null = null;
  let status: RetainedEarningsStatus = 'valid';
  let warningMessage: string | null =
    'Current-period RE = Net income − Dividends. Payout % converts as percent÷100. This is not cumulative balance-sheet RE (needs beginning RE) and not EPS. Currency labels amounts only (no FX).';

  if (payout.value > 100) {
    status = 'payoutAbove100';
    warningMessage =
      'Payout ratio exceeds 100% — dividends exceed current-period earnings, producing negative current-period retained earnings (may use reserves or other funding).';
  }

  const sharesReady =
    !shares.blank &&
    shares.value !== null &&
    shares.value > 0 &&
    Number.isInteger(shares.value);

  if (sharesReady) {
    sharesOutstanding = shares.value;
    retainedEarningsPerShare = calculateRetainedEarningsPerShare(
      retainedEarnings,
      sharesOutstanding!
    );
  } else if (shares.blank) {
    status = status === 'payoutAbove100' ? status : 'partial';
    if (status === 'partial') {
      warningMessage =
        'Dividends and retained earnings calculated. Enter shares outstanding for retained earnings per share.';
    }
  }

  const result: RetainedEarningsResult = {
    earnings: earnings.value,
    dividendPayoutRatio: payout.value,
    dividendsDistributed,
    retainedEarnings,
    retentionRatio,
    sharesOutstanding,
    retainedEarningsPerShare,
    status,
    interpretation: interpretRetainedEarnings(
      earnings.value,
      dividendsDistributed,
      retainedEarnings,
      retainedEarningsPerShare
    ),
    warningMessage,
    currency,
    formattedEarnings: formatReMoney(earnings.value, currency),
    formattedPayoutRatio: `${formatRePercent(payout.value)}%`,
    formattedDividends: formatReMoney(dividendsDistributed, currency),
    formattedRetainedEarnings: formatReMoney(retainedEarnings, currency),
    formattedRetentionRatio: `${formatRePercent(retentionRatio)}%`,
    formattedShares:
      sharesOutstanding === null ? null : formatReShares(sharesOutstanding),
    formattedRetainedEarningsPerShare:
      retainedEarningsPerShare === null
        ? null
        : formatReMoney(retainedEarningsPerShare, currency),
  };

  return { isValid: true, errors, result };
}
