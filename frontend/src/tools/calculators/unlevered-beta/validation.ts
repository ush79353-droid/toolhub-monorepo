import {
  calculateDebtToEquity,
  calculateEffectiveTaxRate,
  calculateUnleveredBeta,
  formatUbBeta,
  formatUbPercent,
  formatUbRatio,
  interpretUnleveredBeta,
} from './calculation';
import type {
  UnleveredBetaFieldErrors,
  UnleveredBetaInput,
  UnleveredBetaResult,
} from './types';

export interface UnleveredBetaValidation {
  isValid: boolean;
  errors: UnleveredBetaFieldErrors;
  result: UnleveredBetaResult | null;
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

export function validateUnleveredBetaInput(
  input: UnleveredBetaInput
): UnleveredBetaValidation {
  const errors: UnleveredBetaFieldErrors = {};
  let hasError = false;

  let taxDecimal: number | null = null;

  if (input.taxRateMode === 'manual') {
    const tax = parseFinite(input.manualTaxRate);
    if (tax.blank) {
      errors.manualTaxRate = 'Enter a corporate tax rate.';
      hasError = true;
    } else if (tax.invalid || tax.value === null) {
      errors.manualTaxRate = 'Enter a valid tax rate.';
      hasError = true;
    } else if (tax.value < 0 || tax.value > 100) {
      errors.manualTaxRate = 'Tax rate must be between 0% and 100%.';
      hasError = true;
    } else {
      taxDecimal = tax.value / 100;
    }
  } else {
    const ni = parseFinite(input.netIncome);
    if (ni.blank) {
      errors.netIncome = 'Enter net income.';
      hasError = true;
    } else if (ni.invalid || ni.value === null) {
      errors.netIncome = 'Enter a valid net income.';
      hasError = true;
    }

    const pre = parseFinite(input.preTaxIncome);
    if (pre.blank) {
      errors.preTaxIncome = 'Enter pre-tax income.';
      hasError = true;
    } else if (pre.invalid || pre.value === null) {
      errors.preTaxIncome = 'Enter a valid pre-tax income.';
      hasError = true;
    } else if (pre.value === 0) {
      errors.preTaxIncome =
        'Pre-tax income must not be zero to estimate the effective tax rate.';
      hasError = true;
    }

    if (
      ni.value !== null &&
      !ni.invalid &&
      pre.value !== null &&
      !pre.invalid &&
      pre.value !== 0
    ) {
      taxDecimal = calculateEffectiveTaxRate(ni.value, pre.value);
      if (taxDecimal === null) {
        errors.form = 'Unable to calculate corporate tax rate.';
        hasError = true;
      } else if (taxDecimal < 0 || taxDecimal > 1) {
        errors.form =
          'Estimated effective tax rate is outside 0%–100%. Check income figures or enter a tax rate manually.';
        hasError = true;
        taxDecimal = null;
      }
    }
  }

  const debt = parseFinite(input.totalDebt);
  if (debt.blank) {
    errors.totalDebt = 'Enter total debt.';
    hasError = true;
  } else if (debt.invalid || debt.value === null) {
    errors.totalDebt = 'Enter a valid total debt amount.';
    hasError = true;
  } else if (debt.value < 0) {
    errors.totalDebt = 'Total debt cannot be negative.';
    hasError = true;
  }

  const equity = parseFinite(input.shareholdersEquity);
  if (equity.blank) {
    errors.shareholdersEquity = 'Enter total shareholders\' equity.';
    hasError = true;
  } else if (equity.invalid || equity.value === null) {
    errors.shareholdersEquity = 'Enter a valid equity amount.';
    hasError = true;
  } else if (equity.value <= 0) {
    errors.shareholdersEquity =
      "Shareholders' equity must be greater than zero to calculate the debt-to-equity ratio.";
    hasError = true;
  }

  const betaL = parseFinite(input.leveredBeta);
  if (betaL.blank) {
    errors.leveredBeta = 'Enter levered (equity) beta.';
    hasError = true;
  } else if (betaL.invalid || betaL.value === null) {
    errors.leveredBeta = 'Enter a valid levered beta.';
    hasError = true;
  }

  if (
    hasError ||
    taxDecimal === null ||
    debt.value === null ||
    equity.value === null ||
    betaL.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const de = calculateDebtToEquity(debt.value, equity.value);
  if (de === null) {
    errors.form = 'Unable to calculate debt-to-equity ratio.';
    return { isValid: false, errors, result: null };
  }

  const betaU = calculateUnleveredBeta(betaL.value, taxDecimal, de);
  if (betaU === null) {
    errors.form =
      'Unable to calculate unlevered beta. Check that the formula denominator is valid.';
    return { isValid: false, errors, result: null };
  }

  const taxPercent = taxDecimal * 100;
  const warnings: string[] = [
    'This uses a simplified Hamada-style unlevering model (debt beta ≈ 0). It is not universally identical to every valuation firm’s unlevering convention.',
  ];
  if (input.taxRateMode === 'calculated') {
    warnings.push(
      'The tax rate is an effective estimate from pre-tax and net income, which may differ from a statutory or normalized valuation tax rate.'
    );
  }
  if (betaL.value < 0) {
    warnings.push(
      'Negative levered beta indicates inverse estimated market sensitivity; interpret unlevered beta with the same caution.'
    );
  }
  if (de === 0) {
    warnings.push(
      'With zero debt, D/E = 0 and unlevered beta equals levered beta under this model.'
    );
  }

  const formulaBreakdown = `βU = ${formatUbBeta(betaL.value)} / [1 + (1 − ${formatUbPercent(taxPercent).replace('%', '')}/100) × ${formatUbRatio(de).replace('×', '')}] = ${formatUbBeta(betaU)}`;

  const result: UnleveredBetaResult = {
    corporateTaxRatePercent: taxPercent,
    debtToEquityRatio: de,
    leveredBeta: betaL.value,
    unleveredBeta: betaU,
    taxRateMode: input.taxRateMode,
    currency: input.currency,
    formattedTaxRate: formatUbPercent(taxPercent),
    formattedDebtToEquity: formatUbRatio(de),
    formattedLeveredBeta: formatUbBeta(betaL.value),
    formattedUnleveredBeta: formatUbBeta(betaU),
    interpretation: interpretUnleveredBeta(betaU),
    explanation: `Based on the selected tax and capital structure assumptions, the company's unlevered beta is approximately ${formatUbBeta(betaU)}. This estimates systematic business risk after removing the leverage effect represented by the model.`,
    formulaBreakdown,
    warningMessage: warnings.join(' '),
  };

  return { isValid: true, errors, result };
}
