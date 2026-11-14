'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { BusinessBudgetForm } from './BusinessBudgetForm';
import { BusinessBudgetResults } from './BusinessBudgetResults';
import {
  createDefaultInput,
  type BusinessBudgetFieldErrors,
  type BusinessBudgetInput,
  type BusinessBudgetResult,
} from './types';
import { validateBusinessBudget } from './validation';

function summaryText(metadataTitle: string, result: BusinessBudgetResult): string {
  return [
    `${metadataTitle} — Omega Calculators`,
    `Initial investment: ${result.initialInvestmentDisplay}`,
    `Total income: ${result.totalIncomeDisplay} / mo`,
    `Total expenses: ${result.totalExpensesDisplay} / mo`,
    `Budget balance: ${result.budgetBalanceDisplay} / mo`,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function BusinessBudgetCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<BusinessBudgetInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<BusinessBudgetFieldErrors>({});
  const [result, setResult] = React.useState<BusinessBudgetResult | null>(() => {
    const initial = validateBusinessBudget(createDefaultInput());
    return initial.isValid ? initial.result : null;
  });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: BusinessBudgetInput) => {
    const validation = validateBusinessBudget(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const resetAll = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setCopied(false);
    setShared(false);
    run(fresh);
  };

  const sharePayload = result ? summaryText(metadata.title, result) : '';
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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <BusinessBudgetForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
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
            void copyTextToClipboard(summaryText(metadata.title, result)).then((ok) => {
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
