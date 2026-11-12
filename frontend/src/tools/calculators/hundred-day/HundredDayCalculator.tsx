'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateHundredDay, type HundredDayInput, type HundredDayResult } from './calculation';
import { createDefaultHundredDayInput, PLACEHOLDER_START } from './defaults';
import { formatLongDate } from './dates';
import { HundredDayForm } from './HundredDayForm';
import { HundredDayResults } from './HundredDayResults';
import { validateHundredDay } from './validation';

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function HundredDayCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<HundredDayInput>(() => createDefaultHundredDayInput(PLACEHOLDER_START));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [result, setResult] = React.useState<HundredDayResult | null>(() =>
    calculateHundredDay(createDefaultHundredDayInput(PLACEHOLDER_START))
  );
  const [copied, setCopied] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const today = todayIso();
    const fresh = createDefaultHundredDayInput(today);
    setInput(fresh);
    setResult(calculateHundredDay(fresh));
    setHydrated(true);
  }, []);

  const run = (next: HundredDayInput) => {
    const validation = validateHundredDay(next);
    setErrors(validation.errors);
    if (validation.isValid) setResult(calculateHundredDay(next));
    else setResult(null);
  };

  const summary = result
    ? result.mode === 'offset'
      ? [
          `${metadata.title} — Omega Calculators`,
          formatLongDate(result.resultDate),
          `ISO ${result.resultDate}`,
          `${result.counting} count, ${result.direction}`,
        ].join('\n')
      : [
          `${metadata.title} — Omega Calculators`,
          `${result.absoluteCount} calendar days`,
          `Signed ${result.signedCount} (${result.counting})`,
          `${result.fromDate} to ${result.toDate}`,
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
          <p className="text-xs font-normal text-muted-foreground">
            {hydrated ? 'Calendar days in your local date' : 'Calendar days'}
          </p>
        </div>
        {headerActions}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <HundredDayForm
          input={input}
          errors={errors}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}
          onReset={() => {
            const fresh = createDefaultHundredDayInput(todayIso());
            setInput(fresh);
            setErrors({});
            setResult(calculateHundredDay(fresh));
          }}
        />
        <HundredDayResults
          result={result}
          copied={copied}
          onCopy={async () => {
            if (!summary) return;
            if (await copyTextToClipboard(summary)) {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }
          }}
        />
      </div>
    </section>
  );
}
