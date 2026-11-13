'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { calculateAdr } from './calculation';
import type { AdrFieldErrors, AdrResult } from './types';
import { validateAdr } from './validation';
import { AdrForm, draftToInput, EMPTY_ADR_DRAFT, type AdrDraft } from './ADRForm';
import { formatAdrMoney, AdrResults } from './ADRResults';

function summaryText(result: AdrResult): string {
  const money = (value: number) => formatAdrMoney(value, result.currency);
  const lines = [
    'ADR Calculator — Omega Calculators',
    `Average daily rate: ${money(result.adr)}`,
    `Room revenue: ${money(result.roomRevenue)}`,
    `Room-nights sold: ${result.roomsSold}`,
    result.occupancyPercent !== null ? `Occupancy: ${result.occupancyPercent}%` : '',
    result.revpar !== null ? `RevPAR: ${money(result.revpar)}` : '',
    'ADR is room revenue per sold room-night, not a percentage.',
    CURRENCY_DENOMINATION_NOTE,
  ];
  return lines.filter(Boolean).join('\n');
}

export function ADRCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AdrDraft>(EMPTY_ADR_DRAFT);
  const [errors, setErrors] = React.useState<AdrFieldErrors>({});
  const [result, setResult] = React.useState<AdrResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [reportBlanks, setReportBlanks] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const evaluate = React.useCallback((next: AdrDraft, blanks: boolean) => {
    const parsed = draftToInput(next);
    const validation = validateAdr(parsed, { reportBlanks: blanks });
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.isValid ? calculateAdr(parsed) : null);
  }, []);

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
          <p className="text-xs font-normal text-muted-foreground">Formatting currency only</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="adr-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="adr-currency"
              aria-label="Display currency"
              value={draft.currency}
              onChange={(currency) => {
                const next = { ...draft, currency };
                setDraft(next);
                evaluate(next, reportBlanks);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AdrForm
          draft={draft}
          errors={errors}
          onDraftChange={(next) => {
            setDraft(next);
            evaluate(next, reportBlanks);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            setReportBlanks(true);
            evaluate(draft, true);
          }}
          onReset={() => {
            setDraft(EMPTY_ADR_DRAFT);
            setErrors({});
            setResult(null);
            setIncomplete(true);
            setReportBlanks(false);
            setCopied(false);
          }}
        />
        <AdrResults
          result={result}
          incomplete={incomplete}
          copied={copied}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(result)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
        />
      </div>
    </section>
  );
}
