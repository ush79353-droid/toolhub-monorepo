import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateAverageEquity,
  calculateRetentionRatio,
  calculateRoe,
  calculateSustainableGrowthRate,
  formatSgrMoney,
  formatSgrPercent,
  interpretSgr,
} from './calculation';
import type {
  SustainableGrowthRateFieldErrors,
  SustainableGrowthRateInput,
  SustainableGrowthRateResult,
} from './types';

export interface SustainableGrowthRateValidation {
  isValid: boolean;
  errors: SustainableGrowthRateFieldErrors;
  result: SustainableGrowthRateResult | null;
}

function parseFinite(raw: string): {
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

export function validateSustainableGrowthRateInput(
  input: SustainableGrowthRateInput
): SustainableGrowthRateValidation {
  const errors: SustainableGrowthRateFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  if (input.mode === 'direct') {
    const roe = parseFinite(input.roePercent);
    if (roe.blank) {
      errors.roePercent = 'Enter return on equity.';
      hasError = true;
    } else if (roe.invalid || roe.value === null) {
      errors.roePercent = 'Enter a valid ROE percentage.';
      hasError = true;
    }

    const ret = parseFinite(input.retentionPercent);
    if (ret.blank) {
      errors.retentionPercent = 'Enter retention ratio.';
      hasError = true;
    } else if (ret.invalid || ret.value === null) {
      errors.retentionPercent = 'Enter a valid retention percentage.';
      hasError = true;
    }

    if (hasError || roe.value === null || ret.value === null) {
      return { isValid: false, errors, result: null };
    }

    const sgr = calculateSustainableGrowthRate(roe.value, ret.value);
    if (sgr === null) {
      errors.form = 'Unable to calculate sustainable growth rate.';
      return { isValid: false, errors, result: null };
    }

    const warnings: string[] = [
      'Direct mode uses entered ROE and retention percentages. SGR = ROE × retention ÷ 100. Assumptions of stable policies still apply.',
    ];
    if (ret.value < 0) {
      warnings.push(
        'A negative retention ratio implies distributions exceeding earnings on a conventional basis.'
      );
    }

    const result: SustainableGrowthRateResult = {
      retainedEarnings: null,
      retentionRatioPercent: ret.value,
      returnOnEquityPercent: roe.value,
      sustainableGrowthRatePercent: sgr,
      equityBase: null,
      usedAverageEquity: false,
      usedDirectInputs: true,
      currency,
      formattedRetainedEarnings: null,
      formattedRetention: formatSgrPercent(ret.value),
      formattedRoe: formatSgrPercent(roe.value),
      formattedSgr: formatSgrPercent(sgr),
      interpretation: interpretSgr(sgr),
      explanation: `Under the simplified model, SGR ≈ ${formatSgrPercent(sgr)} from ROE ${formatSgrPercent(roe.value)} and retention ${formatSgrPercent(ret.value)}.`,
      warningMessage: warnings.join(' '),
    };
    return { isValid: true, errors, result };
  }

  const ni = parseFinite(input.netIncome);
  if (ni.blank) {
    errors.netIncome = 'Enter net income.';
    hasError = true;
  } else if (ni.invalid || ni.value === null) {
    errors.netIncome = 'Enter a valid net income.';
    hasError = true;
  } else if (ni.value === 0) {
    errors.netIncome =
      'Retention ratio is undefined when net income is zero.';
    hasError = true;
  }

  const div = parseFinite(input.dividendsPaid);
  if (div.blank) {
    errors.dividendsPaid = 'Enter dividends paid.';
    hasError = true;
  } else if (div.invalid || div.value === null) {
    errors.dividendsPaid = 'Enter a valid dividends amount.';
    hasError = true;
  } else if (div.value < 0) {
    errors.dividendsPaid = 'Dividends paid cannot be negative.';
    hasError = true;
  }

  let equityBase: number | null = null;

  if (input.useAverageEquity) {
    const begin = parseFinite(input.beginningEquity);
    if (begin.blank) {
      errors.beginningEquity = 'Enter beginning shareholders\' equity.';
      hasError = true;
    } else if (begin.invalid || begin.value === null) {
      errors.beginningEquity = 'Enter a valid beginning equity amount.';
      hasError = true;
    }

    const end = parseFinite(input.endingEquity);
    if (end.blank) {
      errors.endingEquity = 'Enter ending shareholders\' equity.';
      hasError = true;
    } else if (end.invalid || end.value === null) {
      errors.endingEquity = 'Enter a valid ending equity amount.';
      hasError = true;
    }

    if (
      begin.value !== null &&
      !begin.invalid &&
      end.value !== null &&
      !end.invalid
    ) {
      equityBase = calculateAverageEquity(begin.value, end.value);
      if (equityBase === null || equityBase <= 0) {
        errors.form =
          "Average shareholders' equity must be greater than zero for this SGR model.";
        hasError = true;
        equityBase = null;
      }
    }
  } else {
    const eq = parseFinite(input.shareholdersEquity);
    if (eq.blank) {
      errors.shareholdersEquity = 'Enter total shareholders\' equity.';
      hasError = true;
    } else if (eq.invalid || eq.value === null) {
      errors.shareholdersEquity = 'Enter a valid equity amount.';
      hasError = true;
    } else if (eq.value <= 0) {
      errors.shareholdersEquity =
        "Shareholders' equity must be greater than zero for this SGR model.";
      hasError = true;
    } else {
      equityBase = eq.value;
    }
  }

  if (hasError || ni.value === null || div.value === null || equityBase === null) {
    return { isValid: false, errors, result: null };
  }

  const retention = calculateRetentionRatio(ni.value, div.value);
  if (!retention) {
    errors.form = 'Unable to calculate retention ratio.';
    return { isValid: false, errors, result: null };
  }

  const roe = calculateRoe(ni.value, equityBase);
  if (roe === null) {
    errors.form = 'Unable to calculate return on equity.';
    return { isValid: false, errors, result: null };
  }

  const sgr = calculateSustainableGrowthRate(
    roe,
    retention.retentionRatioPercent
  );
  if (sgr === null) {
    errors.form = 'Unable to calculate sustainable growth rate.';
    return { isValid: false, errors, result: null };
  }

  const warnings: string[] = [
    'Sustainable growth is a theoretical planning measure under assumed stable ROE, payout policy, and capital structure; not a guaranteed growth forecast.',
  ];
  if (ni.value < 0) {
    warnings.push(
      'Negative net income can make the conventional retention ratio and sustainable growth interpretation misleading.'
    );
  }
  if (ni.value > 0 && div.value > ni.value) {
    warnings.push(
      'Dividends exceed current-period net income, resulting in a negative retention ratio.'
    );
  }
  if (input.useAverageEquity) {
    warnings.push(
      "ROE uses average shareholders' equity = (beginning + ending) ÷ 2."
    );
  }

  const result: SustainableGrowthRateResult = {
    retainedEarnings: retention.retainedEarnings,
    retentionRatioPercent: retention.retentionRatioPercent,
    returnOnEquityPercent: roe,
    sustainableGrowthRatePercent: sgr,
    equityBase,
    usedAverageEquity: input.useAverageEquity,
    usedDirectInputs: false,
    currency,
    formattedRetainedEarnings: `${symbol}${formatSgrMoney(retention.retainedEarnings, currency)}`,
    formattedRetention: formatSgrPercent(retention.retentionRatioPercent),
    formattedRoe: formatSgrPercent(roe),
    formattedSgr: formatSgrPercent(sgr),
    interpretation: interpretSgr(sgr),
    explanation: `Under the simplified model, the company could theoretically sustain approximately ${formatSgrPercent(sgr)} growth by reinvesting ${formatSgrPercent(retention.retentionRatioPercent)} of earnings while maintaining ROE of ${formatSgrPercent(roe)}.`,
    warningMessage: warnings.join(' '),
  };

  return { isValid: true, errors, result };
}
