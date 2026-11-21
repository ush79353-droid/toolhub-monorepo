'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { BrexitForm } from './BrexitForm';
import { BrexitResults } from './BrexitResults';
import {
  createDefaultInput,
  createEmptyInput,
  type BrexitFieldErrors,
  type BrexitInput,
  type BrexitResult,
} from './types';
import { validateBrexitInput } from './validation';

function inputsEqual(a: BrexitInput, b: BrexitInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BrexitCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = React.useMemo(() => createDefaultInput(new Date()), []);
  const [baseline, setBaseline] = React.useState<BrexitInput>(() => initial);
  const [input, setInput] = React.useState<BrexitInput>(() => initial);
  const [nowMs, setNowMs] = React.useState(() => Date.now());
  const [errors, setErrors] = React.useState<BrexitFieldErrors>({});
  const [result, setResult] = React.useState<BrexitResult | null>(() =>
    validateBrexitInput(initial, { nowMs: Date.now() }).result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  // Live tick once per second when following the clock (or for live tick add-on).
  React.useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      setNowMs(now);
      setInput((prev) =>
        prev.tillFollowsNow
          ? { ...prev, tillIsoLocal: toDatetimeLocalValue(new Date(now)) }
          : prev
      );
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const recompute = React.useCallback(
    (next: BrexitInput, clockMs: number) => {
      const validation = validateBrexitInput(next, { nowMs: clockMs });
      setInput(next);
      setErrors(validation.errors);
      setResult(validation.result);
    },
    []
  );

  React.useEffect(() => {
    const validation = validateBrexitInput(input, { nowMs });
    setErrors(validation.errors);
    setResult(validation.result);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clock tick only
  }, [nowMs]);

  const apply = (next: BrexitInput) => {
    recompute(next, nowMs);
  };

  const handleReload = () => {
    const fresh = createDefaultInput(new Date());
    setBaseline(fresh);
    setNowMs(Date.now());
    recompute(fresh, Date.now());
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const empty = createEmptyInput();
    setInput(empty);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const shareable = result != null;

  const summary = shareable
    ? [
        `${metadata.title} | Omega Calculators`,
        '',
        `Cost so far: ${result!.formattedCostSoFar}`,
        `Current weekly rate: ${result!.formattedCurrentWeekly}`,
        `Government spending add-on: ${result!.formattedGovernmentSpending}`,
        '',
        result!.explanation,
        '',
        result!.sourceSummary,
        '',
        `Calculator: ${typeof window !== 'undefined' ? window.location.href : `/tools/${metadata.slug}`}`,
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
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed
          ? 'shadow-sm'
          : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Illustrative Brexit cost and opportunity comparisons (GBP).
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <BrexitForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
        />

        <BrexitResults result={result} />

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
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty && !result}
              onClick={handleClear}
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
