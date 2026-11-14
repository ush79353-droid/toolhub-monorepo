'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { DaysOffForm } from './DaysOffForm';
import { DaysOffResults } from './DaysOffResults';
import { formatDaysOffPlainText, getDaysOffInfo } from './calculation';
import {
  CONTRACT_OPTIONS,
  COUNTRY_OPTIONS,
  DEFAULT_INPUT,
  type DaysOffInput,
  type DaysOffResult,
} from './types';

export function DaysOffCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<DaysOffInput>(DEFAULT_INPUT);
  const [result, setResult] = React.useState<DaysOffResult>(() =>
    getDaysOffInfo(DEFAULT_INPUT.country, DEFAULT_INPUT.contract)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleChange = (next: DaysOffInput) => {
    setInput(next);
    setResult(getDaysOffInfo(next.country, next.contract));
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(getDaysOffInfo(DEFAULT_INPUT.country, DEFAULT_INPUT.contract));
  };

  const countryLabel =
    COUNTRY_OPTIONS.find((o) => o.value === input.country)?.label ?? input.country;
  const contractLabel =
    CONTRACT_OPTIONS.find((o) => o.value === input.contract)?.label ?? input.contract;

  const summary = [
    `${metadata.title} — Omega Calculators`,
    `Country: ${countryLabel}`,
    `Contract: ${contractLabel}`,
    formatDaysOffPlainText(result),
  ].join('\n');

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
            Compare typical paid-leave rules by country and contract type
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <DaysOffForm
          input={input}
          result={result}
          onChange={handleChange}
          onReset={handleReset}
        />
        <DaysOffResults />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            onClick={async () => {
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
              onClick={async () => {
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
      </div>
    </section>
  );
}
