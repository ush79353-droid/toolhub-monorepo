'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { FixedBudgetForm } from './FixedBudgetForm';
import { FixedBudgetResults } from './FixedBudgetResults';
import { IncomeAffordabilityForm } from './IncomeAffordabilityForm';
import { IncomeAffordabilityResults } from './IncomeAffordabilityResults';
import {
  createDefaultFixedBudgetInput,
  createDefaultIncomeInput,
  type FixedBudgetFieldErrors,
  type FixedBudgetInput,
  type FixedBudgetResult,
  type IncomeBasedInput,
  type IncomeBasedResult,
  type IncomeFieldErrors,
} from './types';
import {
  validateFixedBudgetInput,
  validateIncomeBasedInput,
} from './validation';

export function HouseAffordabilityCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';

  const [incomeInput, setIncomeInput] = React.useState(createDefaultIncomeInput);
  const [incomeErrors, setIncomeErrors] = React.useState<IncomeFieldErrors>({});
  const [incomeResult, setIncomeResult] =
    React.useState<IncomeBasedResult | null>(null);
  const [incomeStale, setIncomeStale] = React.useState(false);

  const [budgetInput, setBudgetInput] = React.useState(
    createDefaultFixedBudgetInput
  );
  const [budgetErrors, setBudgetErrors] =
    React.useState<FixedBudgetFieldErrors>({});
  const [budgetResult, setBudgetResult] =
    React.useState<FixedBudgetResult | null>(null);
  const [budgetStale, setBudgetStale] = React.useState(false);

  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleIncomeChange = (next: IncomeBasedInput) => {
    setIncomeInput(next);
    if (incomeResult) setIncomeStale(true);
  };

  const handleBudgetChange = (next: FixedBudgetInput) => {
    setBudgetInput(next);
    if (budgetResult) setBudgetStale(true);
  };

  const calculateIncome = () => {
    const validation = validateIncomeBasedInput(incomeInput);
    setIncomeErrors(validation.errors);
    setIncomeResult(validation.result);
    setIncomeStale(false);
  };

  const clearIncome = () => {
    setIncomeInput(createDefaultIncomeInput());
    setIncomeErrors({});
    setIncomeResult(null);
    setIncomeStale(false);
  };

  const calculateBudget = () => {
    const validation = validateFixedBudgetInput(budgetInput);
    setBudgetErrors(validation.errors);
    setBudgetResult(validation.result);
    setBudgetStale(false);
  };

  const clearBudget = () => {
    setBudgetInput(createDefaultFixedBudgetInput());
    setBudgetErrors({});
    setBudgetResult(null);
    setBudgetStale(false);
  };

  const handleReloadAll = () => {
    clearIncome();
    clearBudget();
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const summaryParts: string[] = [`${metadata.title} | Omega Calculators`];
  if (incomeResult) {
    const s = getCurrencySymbol(incomeResult.currency);
    summaryParts.push(
      `Income-based max price: ${s}${incomeResult.formattedHousePrice}`,
      `Total housing: ${s}${incomeResult.formattedTotalHousing}/mo`
    );
  }
  if (budgetResult) {
    const s = getCurrencySymbol(budgetResult.currency);
    summaryParts.push(
      `Fixed-budget max price: ${s}${budgetResult.formattedHousePrice}`,
      `Total housing costs: ${s}${budgetResult.formattedTotalHousing}/mo`
    );
  }
  const summary =
    incomeResult || budgetResult
      ? [...summaryParts, 'Estimate only; not a mortgage preapproval.'].join(
          '\n'
        )
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
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
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
          <p className="text-xs font-normal text-muted-foreground">
            Two independent estimators: income &amp; DTI, and fixed monthly
            budget.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-6 p-4 sm:p-5">
        <div className="space-y-4 rounded-xl border border-border p-3.5 sm:p-4">
          <IncomeAffordabilityForm
            input={incomeInput}
            errors={incomeErrors}
            stale={incomeStale}
            onChange={handleIncomeChange}
            onCalculate={calculateIncome}
            onClear={clearIncome}
          />
          <IncomeAffordabilityResults result={incomeResult} />
        </div>

        <div className="space-y-4 rounded-xl border border-border p-3.5 sm:p-4">
          <FixedBudgetForm
            input={budgetInput}
            errors={budgetErrors}
            stale={budgetStale}
            onChange={handleBudgetChange}
            onCalculate={calculateBudget}
            onClear={clearBudget}
          />
          <FixedBudgetResults result={budgetResult} />
        </div>

        <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
          Check out{' '}
          <a
            href="#how-to-use"
            className="font-semibold text-primary underline underline-offset-2"
          >
            how to use this calculator!
          </a>
        </div>

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
              onClick={handleReloadAll}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={handleReloadAll}
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
