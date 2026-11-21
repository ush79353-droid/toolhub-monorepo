'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { type SupportedCurrency } from '@/tools/shared/currency';
import { BusinessBudgetForm } from './BusinessBudgetForm';
import { BusinessBudgetResults } from './BusinessBudgetResults';
import {
  createDefaultInput,
  type BusinessBudgetFieldErrors,
  type BusinessBudgetInput,
  type BusinessBudgetResult,
  type MoneyLine,
} from './types';
import { validateBusinessBudget } from './validation';

const MONEY_LINE_KEYS = [
  'income1',
  'income2',
  'income3',
  'income4',
  'interestIncome',
  'dividends',
  'gifts',
  'grants',
  'otherIncome',
  'managerSalary',
  'salaries',
  'commissions',
  'benefits',
  'rent',
  'advertisingMarketing',
  'healthInsurance',
  'businessInsurance',
  'inventory',
  'leases',
  'travel',
  'utilities',
  'officeSupplies',
] as const satisfies readonly (keyof BusinessBudgetInput)[];

const LUMP_KEYS = [
  'furniture',
  'startingInventory',
  'advertisingPromotion',
  'operatingCash',
  'otherOneTimeCosts',
] as const satisfies readonly (keyof BusinessBudgetInput)[];

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts all budget income, expense, and one-time amounts using stored exchange rates. Recurring periods and percentage shares stay the same.';

function summaryText(metadataTitle: string, result: BusinessBudgetResult, note: string): string {
  return [
    `${metadataTitle} | Omega Calculators`,
    `Initial investment: ${result.initialInvestmentDisplay}`,
    `Total income: ${result.totalIncomeDisplay} / mo`,
    `Total expenses: ${result.totalExpensesDisplay} / mo`,
    `Budget balance: ${result.budgetBalanceDisplay} / mo`,
    note,
  ].join('\n');
}

function convertBusinessBudgetMoney(
  input: BusinessBudgetInput,
  from: string,
  to: string,
  rates: Record<string, number>
): BusinessBudgetInput | null {
  const next: BusinessBudgetInput = { ...input, currency: to as SupportedCurrency };

  for (const key of MONEY_LINE_KEYS) {
    const line = input[key] as MoneyLine;
    let amount = line.amount;
    if (Number.isFinite(amount) && amount !== 0) {
      const converted = convertCurrency({ amount, from, to, rates });
      if (!converted.ok) return null;
      amount = converted.amount;
    }
    next[key] = { ...line, amount } as BusinessBudgetInput[typeof key];
  }

  for (const key of LUMP_KEYS) {
    const amount = input[key] as number;
    if (!Number.isFinite(amount)) {
      next[key] = amount;
      continue;
    }
    if (amount === 0) {
      next[key] = 0;
      continue;
    }
    const converted = convertCurrency({ amount, from, to, rates });
    if (!converted.ok) return null;
    next[key] = converted.amount;
  }

  return next;
}

export function BusinessBudgetCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<BusinessBudgetInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<BusinessBudgetFieldErrors>({});
  const [result, setResult] = React.useState<BusinessBudgetResult | null>(() => {
    const initial = validateBusinessBudget(createDefaultInput());
    return initial.isValid ? initial.result : null;
  });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const run = (next: BusinessBudgetInput) => {
    const validation = validateBusinessBudget(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleChange = (next: BusinessBudgetInput) => {
    setConversionError(null);
    setInput(next);
    run(next);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertBusinessBudgetMoney(input, input.currency, currency, rates.rates);
    if (!converted) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    handleChange(converted);
  };

  const resetAll = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setCopied(false);
    setShared(false);
    setConversionError(null);
    run(fresh);
  };

  const sharePayload = result ? summaryText(metadata.title, result, currencyNote) : '';
  const hasFieldErrors = Object.keys(errors).length > 0;

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">{currencyNote}</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <BusinessBudgetForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}
          onReset={resetAll}
        />
        <BusinessBudgetResults
          result={result}
          invalid={hasFieldErrors}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(metadata.title, result, currencyNote)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}