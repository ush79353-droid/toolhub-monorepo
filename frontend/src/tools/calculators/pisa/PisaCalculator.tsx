'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { PisaForm } from './PisaForm';
import {
  createEmptyInput,
  createExampleInput,
  inputsEqual,
  type PisaFieldErrors,
  type PisaInput,
  type PisaResult,
} from './types';
import { validatePisaInput } from './validation';

export function PisaCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createEmptyInput();
  const [baseline, setBaseline] = React.useState(() => initial);
  const [input, setInput] = React.useState(() => initial);
  const [errors, setErrors] = React.useState<PisaFieldErrors>({});
  const [result, setResult] = React.useState<PisaResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: PisaInput) => {
    const validation = validatePisaInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    setInput(createEmptyInput());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  const summary = [
    'PISA Calculator',
    '',
    'Educational proximal isovelocity surface area worksheet.',
    'Not medical advice.',
    '',
    pageUrl,
    '',
    'Omega Calculators',
  ].join('\n');

  const handleCopy = async () => {
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text: 'PISA Calculator on Omega Calculators',
          url: pageUrl,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through
      }
    }
    await handleCopy();
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
            PISA with optional α/180 correction (educational).
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <PisaForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onLoadExample={() => apply(createExampleInput())}
        />

        <div className="grid grid-cols-[auto_auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-xs">
              {shared || copied ? (
                <span className="text-xs font-bold">✓</span>
              ) : (
                <Share2 className="h-4 w-4" aria-hidden />
              )}
            </div>
            <span className="text-xs font-semibold text-accent">
              {shared ? 'Shared!' : copied ? 'Copied!' : 'Share result'}
            </span>
          </button>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-center px-4 text-sm font-semibold"
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-center px-4 text-sm font-semibold"
              onClick={handleClear}
              disabled={!dirty && !result}
            >
              Clear all changes
            </Button>
          </div>

          <div className="flex flex-col justify-end gap-2 sm:items-end">
            <p className="text-xs text-muted-foreground">
              Did we solve your problem today?
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={feedback === 'yes' ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5"
                onClick={() => setFeedback('yes')}
              >
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                Yes
              </Button>
              <Button
                type="button"
                variant={feedback === 'no' ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5"
                onClick={() => setFeedback('no')}
              >
                <ThumbsDown className="h-3.5 w-3.5" aria-hidden />
                No
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
