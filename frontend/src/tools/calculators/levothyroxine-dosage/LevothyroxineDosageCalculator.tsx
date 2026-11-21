'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { LevothyroxineDosageForm } from './LevothyroxineDosageForm';
import { LevothyroxineDosageResults } from './LevothyroxineDosageResults';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type LevothyroxineDosageFieldErrors,
  type LevothyroxineDosageInput,
  type LevothyroxineDosageResult,
} from './types';
import { validateLevothyroxineDosageInput } from './validation';

function shareText(pageUrl: string): string {
  return [
    'Levothyroxine Dosage Calculator | Omega Calculators',
    '',
    'Educational eligibility explorer — not a prescription. mcg/day is not published without clinical approval.',
    pageUrl,
  ].join('\n');
}

export function LevothyroxineDosageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState(defaults);
  const [input, setInput] = React.useState(defaults);
  const [errors, setErrors] = React.useState<LevothyroxineDosageFieldErrors>(
    {},
  );
  const [result, setResult] = React.useState<LevothyroxineDosageResult | null>(
    () => validateLevothyroxineDosageInput(defaults).result,
  );
  const [personalOpen, setPersonalOpen] = React.useState(true);
  const [healthOpen, setHealthOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: LevothyroxineDosageInput) => {
    const validation = validateLevothyroxineDosageInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(validateLevothyroxineDosageInput(fresh).result);
    setPersonalOpen(true);
    setHealthOpen(true);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setErrors({});
    setResult(validateLevothyroxineDosageInput(fresh).result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;
  const summary = shareText(pageUrl);

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
          text: 'Levothyroxine Dosage Calculator | Omega Calculators',
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
        isEmbed
          ? 'shadow-sm'
          : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Screenshot fields + clinical gate — no unapproved mcg/day dose.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <LevothyroxineDosageForm
          input={input}
          errors={errors}
          personalOpen={personalOpen}
          healthOpen={healthOpen}
          onTogglePersonal={() => setPersonalOpen((v) => !v)}
          onToggleHealth={() => setHealthOpen((v) => !v)}
          onChange={apply}
        />
        <LevothyroxineDosageResults result={result} />

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
              disabled={!dirty}
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
              className={`flex items-center gap-1 rounded-md border px-2 py-1 ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              No
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LevothyroxineDosageCalculator;
