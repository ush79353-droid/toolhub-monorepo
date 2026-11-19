import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  ANNUAL_EXPENSE_KEYS,
  MONTHLY_EXPENSE_KEYS,
  SAVINGS_KEYS,
  type BudgetFieldErrors,
  type BudgetInput,
  type BudgetResult,
  type MoneyFieldKey,
  type MoneyLine,
} from './types';
import {
  calculateBudget,
  formatBudgetAmount,
} from './calculation';

export interface BudgetValidation {
  isValid: boolean;
  errors: BudgetFieldErrors;
  result: BudgetResult | null;
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

function parseMoneyLine(
  key: MoneyFieldKey,
  line: MoneyLine,
  errors: BudgetFieldErrors,
  label: string
): number | null {
  const parsed = parseNumber(line.amount);
  if (parsed.blank) {
    // Screenshot defaults are 0 — treat blank like 0 for live totals.
    return 0;
  }
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
    return null;
  }
  if (parsed.value < 0) {
    errors[key] = `${label} cannot be negative.`;
    return null;
  }
  return parsed.value;
}

/**
 * Validates budget inputs, converts every money line into salary currency,
 * then runs the pure budget engine.
 */
export function validateBudgetInput(
  input: BudgetInput,
  rates?: CurrencyRatesSnapshot | null
): BudgetValidation {
  const errors: BudgetFieldErrors = {};
  const target = input.salary.currency;

  const taxParsed = parseNumber(input.taxRate);
  let taxRatePercent = 0;
  if (taxParsed.blank) {
    taxRatePercent = 0;
  } else if (taxParsed.invalid || taxParsed.value === null) {
    errors.taxRate = 'Enter a valid tax rate.';
  } else if (taxParsed.value < 0) {
    errors.taxRate = 'Tax rate cannot be negative.';
  } else {
    taxRatePercent = taxParsed.value;
  }

  const convertLine = (
    key: MoneyFieldKey,
    label: string
  ): { amount: number; frequency: MoneyLine['frequency'] } | null => {
    const line = input[key] as MoneyLine;
    const amount = parseMoneyLine(key, line, errors, label);
    if (amount === null) return null;
    const converted = convertMoney(amount, line.currency, target, rates);
    if (!converted.ok) {
      errors.form = converted.message;
      return null;
    }
    return { amount: converted.amount, frequency: line.frequency };
  };

  const salary = convertLine('salary', 'salary');
  const pension = convertLine('pension', 'pension / social security');
  const otherMonthlyIncome = convertLine(
    'otherMonthlyIncome',
    'other monthly income'
  );
  const taxRefunds = convertLine('taxRefunds', 'tax refunds');
  const otherAnnualIncome = convertLine(
    'otherAnnualIncome',
    'other annual income'
  );

  const savings = SAVINGS_KEYS.map((key) => convertLine(key, 'savings amount'));
  const monthlyExpenses = MONTHLY_EXPENSE_KEYS.map((key) =>
    convertLine(key, 'monthly expense')
  );
  const annualExpenses = ANNUAL_EXPENSE_KEYS.map((key) =>
    convertLine(key, 'annual expense')
  );

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  if (
    !salary ||
    !pension ||
    !otherMonthlyIncome ||
    !taxRefunds ||
    !otherAnnualIncome ||
    savings.some((line) => line === null) ||
    monthlyExpenses.some((line) => line === null) ||
    annualExpenses.some((line) => line === null)
  ) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateBudget({
    salary: salary.amount,
    salaryFrequency: salary.frequency,
    taxRatePercent,
    pension: pension.amount,
    pensionFrequency: pension.frequency,
    otherMonthlyIncome: otherMonthlyIncome.amount,
    otherMonthlyIncomeFrequency: otherMonthlyIncome.frequency,
    taxRefunds: taxRefunds.amount,
    taxRefundsFrequency: taxRefunds.frequency,
    otherAnnualIncome: otherAnnualIncome.amount,
    otherAnnualIncomeFrequency: otherAnnualIncome.frequency,
    savings: savings as { amount: number; frequency: MoneyLine['frequency'] }[],
    monthlyExpenses: monthlyExpenses as {
      amount: number;
      frequency: MoneyLine['frequency'];
    }[],
    annualExpenses: annualExpenses as {
      amount: number;
      frequency: MoneyLine['frequency'];
    }[],
    currency: target,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: BudgetResult = {
    currency: computed.currency,
    monthlyIncome: computed.monthlyIncome,
    monthlySavings: computed.monthlySavings,
    monthlyExpenses: computed.monthlyExpenses,
    annualExpenses: computed.annualExpenses,
    monthlyBudgetBalance: computed.monthlyBudgetBalance,
    annualBudgetBalance: computed.annualBudgetBalance,
    formattedMonthlyIncome: formatBudgetAmount(computed.monthlyIncome),
    formattedMonthlySavings: formatBudgetAmount(computed.monthlySavings),
    formattedMonthlyExpenses: formatBudgetAmount(computed.monthlyExpenses),
    formattedAnnualExpenses: formatBudgetAmount(computed.annualExpenses),
    formattedMonthlyBudgetBalance: formatBudgetAmount(
      computed.monthlyBudgetBalance
    ),
    formattedAnnualBudgetBalance: formatBudgetAmount(
      computed.annualBudgetBalance
    ),
  };

  return { isValid: true, errors, result };
}
