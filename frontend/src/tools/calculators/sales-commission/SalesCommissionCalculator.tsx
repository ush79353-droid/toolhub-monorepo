'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import {
  SalesCommissionForm,
  draftToInput,
  inputToDraft,
  type SalesCommissionDraft,
} from './SalesCommissionForm';
import { SalesCommissionResults } from './SalesCommissionResults';
import { calculateSalesCommission, methodLabel } from './calculation';
import {
  createDefaultSalesCommissionInput,
  type SalesCommissionFieldErrors,
  type SalesCommissionResult,
} from './types';
import { validateSalesCommission } from './validation';

function summaryText(title: string, result: SalesCommissionResult): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  return [
    `${title} — Omega Calculators`,
    `Method: ${methodLabel(result.commissionBase)}`,
    `Gross sales: ${money(result.revenue)}`,
    `Gross profit: ${money(result.grossProfit)}`,
    `Commission base: ${money(result.commissionBaseAmount)}`,
    `Commission: ${money(result.commission)}`,
    `Total labor cost (OTE): ${money(result.totalLaborCost)}`,
    `Operational profit: ${money(result.operationalProfit)}`,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function SalesCommissionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SalesCommissionDraft>(() =>
    inputToDraft(createDefaultSalesCommissionInput())
  );
  const [errors, setErrors] = React.useState<SalesCommissionFieldErrors>({});
  const [result, setResult] = React.useState<SalesCommissionResult | null>(() =>
    calculateSalesCommission(createDefaultSalesCommissionInput())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (nextDraft: SalesCommissionDraft) => {
    const input = draftToInput(nextDraft);
    const validation = validateSalesCommission(input);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateSalesCommission(input) : null);
  };

  const summary = result?.defined ? summaryText(metadata.title, result) : '';

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
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="sc-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="sc-currency"
              value={draft.currency}
              onChange={(currency) => {
                const next = { ...draft, currency };
                setDraft(next);
                run(next);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SalesCommissionForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={(next) => {
            setDraft(next);
            run(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            run(draft);
          }}
          onReset={() => {
            const fresh = createDefaultSalesCommissionInput();
            const nextDraft = inputToDraft(fresh);
            setDraft(nextDraft);
            setErrors({});
            setResult(calculateSalesCommission(fresh));
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <SalesCommissionResults result={result} invalid={Object.keys(errors).length > 0} />
      </div>
    </section>
  );
}
