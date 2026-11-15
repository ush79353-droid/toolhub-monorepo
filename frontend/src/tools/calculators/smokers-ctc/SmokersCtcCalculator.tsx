'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { SmokersCtcForm } from './SmokersCtcForm';
import { SmokersCtcResults } from './SmokersCtcResults';
import {
  createDefaultInput,
  type SmokersCtcFieldErrors,
  type SmokersCtcInput,
  type SmokersCtcResult,
} from './types';
import { validateSmokersCtc } from './validation';

export function SmokersCtcCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<SmokersCtcInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<SmokersCtcFieldErrors>({});
  const [result, setResult] = React.useState<SmokersCtcResult | null>(
    () => validateSmokersCtc(createDefaultInput()).result
  );
  const [workdayOpen, setWorkdayOpen] = React.useState(false);
  const [smokingTimeOpen, setSmokingTimeOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: SmokersCtcInput) => {
    const validation = validateSmokersCtc(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setWorkdayOpen(false);
    setSmokingTimeOpen(false);
    run(fresh);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary =
    result && (result.yearlyLaborCost !== null || result.yearlyCigaretteCost !== null)
      ? [
          `${metadata.title} — Omega Calculators`,
          `Daily smoking time: ${result.dailySmokingDisplay}`,
          result.yearlyLaborCost !== null
            ? `Yearly labor cost while smoking: ${symbol}${result.yearlyLaborDisplay}`
            : null,
          result.yearlyCigaretteCost !== null
            ? `Yearly cigarette cost (at work): ${symbol}${result.yearlyCigaretteDisplay}`
            : null,
          result.lifeExpectancyDisplay
            ? `Life expectancy cost (illustrative): ${result.lifeExpectancyDisplay} days`
            : null,
          CURRENCY_DENOMINATION_NOTE,
        ]
          .filter(Boolean)
          .join('\n')
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
            Estimate paid smoke-break time cost and workday cigarette spend.{' '}
            {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <SmokersCtcForm
          input={input}
          errors={errors}
          result={result}
          workdayOpen={workdayOpen}
          smokingTimeOpen={smokingTimeOpen}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onToggleWorkday={() => setWorkdayOpen((open) => !open)}
          onToggleSmokingTime={() => setSmokingTimeOpen((open) => !open)}
          onReset={handleReset}
          onReload={handleReset}
        />
        <SmokersCtcResults />
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
