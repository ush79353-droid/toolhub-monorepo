'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { CompoundInterestBalances } from './CompoundInterestBalances';
import { CompoundInterestForm } from './CompoundInterestForm';
import {
  createDefaultDraft,
  type BalanceView,
  type CompoundInterestDraft,
  type CompoundInterestFieldErrors,
  type CompoundInterestResult,
} from './types';
import { validateCompoundInterestDraft } from './validation';

function summaryText(
  title: string,
  draft: CompoundInterestDraft,
  result: CompoundInterestResult
): string {
  return [
    `${title} — Omega Calculators`,
    `Initial balance: ${draft.initialBalance} ${draft.currency}`,
    `Interest rate: ${draft.interestRate}%`,
    `Term: ${draft.termYears} yrs, ${draft.termMonths} mos`,
    `Compounding: ${draft.compounding}`,
    `Additional deposits: ${draft.depositFrequency}`,
    `Final balance: ${result.formattedFinalBalance}`,
    `Total compound interest: ${result.formattedInterest}`,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function CompoundInterestCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CompoundInterestDraft>(createDefaultDraft);
  const [errors, setErrors] = React.useState<CompoundInterestFieldErrors>(() =>
    validateCompoundInterestDraft(createDefaultDraft()).errors
  );
  const [result, setResult] = React.useState<CompoundInterestResult | null>(() =>
    validateCompoundInterestDraft(createDefaultDraft()).result
  );
  const [depositsOpen, setDepositsOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CompoundInterestDraft) => {
    setDraft(next);
    const validation = validateCompoundInterestDraft(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const resetAll = () => {
    const fresh = createDefaultDraft();
    setDraft(fresh);
    setDepositsOpen(true);
    setCopied(false);
    setShared(false);
    const validation = validateCompoundInterestDraft(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const sharePayload = result ? summaryText(metadata.title, draft, result) : '';

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
            Compound interest with optional deposits. {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CompoundInterestForm
          draft={draft}
          errors={errors}
          result={result}
          depositsOpen={depositsOpen}
          onDepositsOpen={setDepositsOpen}
          onChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={resetAll}
        />

        {result ? (
          <CompoundInterestBalances
            draft={draft}
            result={result}
            onViewChange={(balanceView: BalanceView) => evaluate({ ...draft, balanceView })}
          />
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10"
            disabled={!result}
            onClick={() => {
              if (!result) return;
              void copyTextToClipboard(summaryText(metadata.title, draft, result)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
          >
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            {copied ? 'Copied' : 'Copy result'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={!result}
              onClick={() => {
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
                  .catch(() => undefined);
              }}
            >
              {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
              {shared ? 'Shared' : 'Share result'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
