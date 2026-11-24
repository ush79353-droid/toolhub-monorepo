'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { VitaminAForm } from './VitaminAForm';
import { VitaminAResults } from './VitaminAResults';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type VitaminAFieldErrors,
  type VitaminAInput,
  type VitaminAResult,
} from './types';
import { validateVitaminA } from './validation';

export function VitaminACalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState(initial);
  const [input, setInput] = React.useState(initial);
  const [errors, setErrors] = React.useState<VitaminAFieldErrors>({});
  const [result, setResult] = React.useState<VitaminAResult | null>(() =>
    validateVitaminA(initial).result
  );
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: VitaminAInput) => {
    const v = validateVitaminA(next);
    setInput(next);
    setErrors(v.errors);
    setResult(v.result);
  };

  const reload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(validateVitaminA(fresh).result);
    setShared(false);
    setFeedback(null);
  };

  const clear = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setErrors({});
    setResult(validateVitaminA(fresh).result);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  // Nutrition privacy: share public page URL only — never intakes or demographics.
  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text: 'Vitamin A Calculator | Omega Calculators',
          url: pageUrl,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        /* fall through */
      }
    }
    if (await copyTextToClipboard(pageUrl)) {
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    }
  };

  const invalid = Object.keys(errors).length > 0;

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
            NIH ODS vitamin A IU ↔ mcg RAE by source · age/sex RDA
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <VitaminAForm input={input} errors={errors} result={result} onChange={apply} />

        <VitaminAResults result={result} invalid={invalid} />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={reload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={clear}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        {!isEmbed ? (
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
                <ThumbsUp className="h-3 w-3" aria-hidden />
                Yes
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
                <ThumbsDown className="h-3 w-3" aria-hidden />
                No
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
