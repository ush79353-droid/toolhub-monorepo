'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CaliforniaSalesTaxForm } from './CaliforniaSalesTaxForm';
import { CaliforniaSalesTaxResults } from './CaliforniaSalesTaxResults';
import {
  createDefaultInput,
  inputsEqual,
  type CaliforniaSalesTaxFieldErrors,
  type CaliforniaSalesTaxInput,
  type CaliforniaSalesTaxResult,
} from './types';
import { validateCaliforniaSalesTaxFields } from './validation';

export function CaliforniaSalesTaxCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<CaliforniaSalesTaxInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<CaliforniaSalesTaxInput>(
    () => defaults
  );
  const [errors, setErrors] = React.useState<CaliforniaSalesTaxFieldErrors>({});
  const [result, setResult] = React.useState<CaliforniaSalesTaxResult | null>(
    null
  );
  const [lookingUp, setLookingUp] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const lookupSeq = React.useRef(0);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const runLookup = React.useCallback(async (next: CaliforniaSalesTaxInput) => {
    const validation = validateCaliforniaSalesTaxFields(next);
    setErrors(validation.errors);
    if (!validation.isValid || !validation.parsed) {
      setResult(null);
      setLookingUp(false);
      return;
    }

    const seq = ++lookupSeq.current;
    setLookingUp(true);
    try {
      const response = await fetch('/api/tax/california-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseAmount: validation.parsed.purchaseAmount,
          streetAddress: validation.parsed.streetAddress,
          city: validation.parsed.city,
          zipCode: validation.parsed.zipCode,
        }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        result?: CaliforniaSalesTaxResult;
        error?: string;
      };
      if (seq !== lookupSeq.current) return;
      if (!payload.ok || !payload.result) {
        setErrors((prev) => ({
          ...prev,
          form:
            payload.error ??
            'Unable to look up a California sales tax rate for this address.',
        }));
        setResult(null);
        return;
      }
      setResult(payload.result);
    } catch {
      if (seq !== lookupSeq.current) return;
      setErrors((prev) => ({
        ...prev,
        form: 'Network error while contacting the California tax rate service.',
      }));
      setResult(null);
    } finally {
      if (seq === lookupSeq.current) setLookingUp(false);
    }
  }, []);

  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      void runLookup(input);
    }, 450);
    return () => window.clearTimeout(handle);
  }, [input, runLookup]);

  const handleChange = (next: CaliforniaSalesTaxInput) => {
    setInput(next);
  };

  const handleReset = () => {
    lookupSeq.current += 1;
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
    setLookingUp(false);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const summary = result ? result.summaryText : '';

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
            California · CDTFA address lookup · fixed USD
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
            <CaliforniaSalesTaxForm
              input={input}
              errors={errors}
              onChange={handleChange}
              disabled={false}
            />
          </div>
          <CaliforniaSalesTaxResults result={result} lookingUp={lookingUp} />
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
              onClick={handleReset}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={handleReset}
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
