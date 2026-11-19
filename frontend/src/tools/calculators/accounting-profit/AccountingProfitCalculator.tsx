'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { AccountingProfitForm } from './AccountingProfitForm';
import {
  createDefaultInput,
  type AccountingProfitFieldErrors,
  type AccountingProfitInput,
  type AccountingProfitResult,
} from './types';

const FX_NOTE =
  'Revenue, each expense, total explicit costs, and accounting profit each have their own currency. Math normalizes amounts into the total-revenue currency; results convert for display. Missing rates block conversion; stale rates warn but still convert.';

function inputsEqual(
  a: AccountingProfitInput,
  b: AccountingProfitInput
): boolean {
  return (
    a.totalRevenue === b.totalRevenue &&
    a.totalRevenueCurrency === b.totalRevenueCurrency &&
    a.operationExpenses === b.operationExpenses &&
    a.operationExpensesCurrency === b.operationExpensesCurrency &&
    a.interest === b.interest &&
    a.interestCurrency === b.interestCurrency &&
    a.depreciation === b.depreciation &&
    a.depreciationCurrency === b.depreciationCurrency &&
    a.taxes === b.taxes &&
    a.taxesCurrency === b.taxesCurrency &&
    a.totalExplicitCostsCurrency === b.totalExplicitCostsCurrency &&
    a.accountingProfitCurrency === b.accountingProfitCurrency
  );
}

export function AccountingProfitCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<AccountingProfitInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<AccountingProfitInput>(
    () => defaults
  );
  const [errors, setErrors] = React.useState<AccountingProfitFieldErrors>({});
  const [result, setResult] = React.useState<AccountingProfitResult | null>(
    null
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  // UI shell — live math and FX land in the engine commit.
  const apply = (next: AccountingProfitInput) => {
    setConversionError(null);
    setInput(next);
    setErrors({});
    setResult(null);
  };

  const handleCurrencyOnly = (
    key: keyof AccountingProfitInput,
    next: SupportedCurrency
  ) => {
    apply({ ...input, [key]: next });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
    setConversionError(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Total revenue: ${getCurrencySymbol(input.totalRevenueCurrency)}${input.totalRevenue} ${input.totalRevenueCurrency}`,
        `Total explicit costs: ${getCurrencySymbol(result.totalExplicitCostsCurrency)}${result.formattedTotalExplicitCosts} ${result.totalExplicitCostsCurrency}`,
        `Accounting profit: ${getCurrencySymbol(result.accountingProfitCurrency)}${result.formattedAccountingProfit} ${result.accountingProfitCurrency}`,
        FX_NOTE,
      ].join('\n')
    : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, text: summary });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through
      }
    }
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

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
          <p className="text-xs font-normal text-muted-foreground">{FX_NOTE}</p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <AccountingProfitForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onTotalRevenueCurrencyChange={(next) =>
            handleCurrencyOnly('totalRevenueCurrency', next)
          }
          onOperationExpensesCurrencyChange={(next) =>
            handleCurrencyOnly('operationExpensesCurrency', next)
          }
          onInterestCurrencyChange={(next) =>
            handleCurrencyOnly('interestCurrency', next)
          }
          onDepreciationCurrencyChange={(next) =>
            handleCurrencyOnly('depreciationCurrency', next)
          }
          onTaxesCurrencyChange={(next) =>
            handleCurrencyOnly('taxesCurrency', next)
          }
          onTotalExplicitCostsCurrencyChange={(next) =>
            handleCurrencyOnly('totalExplicitCostsCurrency', next)
          }
          onAccountingProfitCurrencyChange={(next) =>
            handleCurrencyOnly('accountingProfitCurrency', next)
          }
          conversionError={conversionError}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={handleReset}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={handleReset}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
