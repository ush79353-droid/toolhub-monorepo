'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { ConsultingFeesForm } from './ConsultingFeesForm';
import { ConsultingFeesResults } from './ConsultingFeesResults';
import { formatDays, formatMoney } from './calculation';
import {
  createDefaultInput,
  type ConsultingFeesFieldErrors,
  type ConsultingFeesInput,
  type ConsultingFeesResult,
} from './types';
import { validateConsultingFees } from './validation';

export function ConsultingFeesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ConsultingFeesInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<ConsultingFeesFieldErrors>({});
  const [result, setResult] = React.useState<ConsultingFeesResult | null>(null);
  const [billableDays, setBillableDays] = React.useState<number | null>(() => {
    return validateConsultingFees(createDefaultInput()).billableDays;
  });
  const [annualOperatingCosts, setAnnualOperatingCosts] = React.useState(
    () => validateConsultingFees(createDefaultInput()).annualOperatingCosts
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: ConsultingFeesInput) => {
    const validation = validateConsultingFees(next);
    setErrors(validation.errors);
    setBillableDays(validation.billableDays);
    setAnnualOperatingCosts(validation.annualOperatingCosts);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    run(fresh);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Billable days: ${formatDays(result.billableDays)}`,
        `Annual operating costs: ${formatMoney(result.annualOperatingCosts, result.currency)}`,
        `Daily billable rate: ${formatMoney(result.dailyBillableRate, result.currency)}`,
        `Hourly rate: ${formatMoney(result.hourlyRate, result.currency)}`,
        CURRENCY_DENOMINATION_NOTE,
      ].join('\n')
    : '';

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
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ConsultingFeesForm
          input={input}
          errors={errors}
          result={result}
          billableDays={billableDays}
          annualOperatingCosts={annualOperatingCosts}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
        />
        <ConsultingFeesResults />
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
      </div>
    </section>
  );
}
