'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { MelatoninDosageForm } from './MelatoninDosageForm';
import { MelatoninDosageResults } from './MelatoninDosageResults';
import {
  createDefaultInput,
  createEmptyInput,
  type MelatoninDosageFieldErrors,
  type MelatoninDosageInput,
  type MelatoninDosageResult,
} from './types';
import { validateMelatoninDosageInput } from './validation';

function inputsEqual(a: MelatoninDosageInput, b: MelatoninDosageInput): boolean {
  return (
    a.indication === b.indication &&
    a.medicationType === b.medicationType &&
    a.durationText === b.durationText &&
    a.durationUnit === b.durationUnit
  );
}

export function MelatoninDosageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState<MelatoninDosageInput>(
    () => initial
  );
  const [input, setInput] = React.useState<MelatoninDosageInput>(() => initial);
  const [errors, setErrors] = React.useState<MelatoninDosageFieldErrors>({});
  const [result, setResult] = React.useState<MelatoninDosageResult | null>(() =>
    validateMelatoninDosageInput(initial).result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: MelatoninDosageInput) => {
    const validation = validateMelatoninDosageInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    const validation = validateMelatoninDosageInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const empty = createEmptyInput();
    const validation = validateMelatoninDosageInput(empty);
    setInput(empty);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);

  // Medical privacy: share the public page URL only (no regimen payload).
  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[0]
      : `/tools/${metadata.slug}`;

  const summary = [
    `${metadata.title} | Omega Calculators`,
    'Educational melatonin label / SmPC lookup — not medical advice.',
    pageUrl,
  ].join('\n');

  const handleShare = async () => {
    try {
      if (canShare && navigator.share) {
        await navigator.share({
          title: metadata.title,
          text: summary,
          url: pageUrl,
        });
        setShared(true);
        return;
      }
      const ok = await copyTextToClipboard(summary);
      if (ok) {
        setCopied(true);
        setShared(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!isEmbed && headerActions ? (
        <div className="flex justify-end">{headerActions}</div>
      ) : null}

      <MelatoninDosageForm input={input} errors={errors} onChange={apply} />

      <MelatoninDosageResults result={result} />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={handleShare}
          disabled={!result}
        >
          <Share2 className="mr-2 h-4 w-4" aria-hidden />
          {shared ? (copied ? 'Copied' : 'Shared') : 'Share result'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleReload}
        >
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleClear}
          disabled={!dirty}
        >
          Clear all changes
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>Did we solve your problem today?</span>
        <Button
          type="button"
          size="sm"
          variant={feedback === 'yes' ? 'default' : 'outline'}
          onClick={() => setFeedback('yes')}
          aria-pressed={feedback === 'yes'}
        >
          <ThumbsUp className="mr-1 h-3.5 w-3.5" aria-hidden />
          Yes
        </Button>
        <Button
          type="button"
          size="sm"
          variant={feedback === 'no' ? 'default' : 'outline'}
          onClick={() => setFeedback('no')}
          aria-pressed={feedback === 'no'}
        >
          <ThumbsDown className="mr-1 h-3.5 w-3.5" aria-hidden />
          No
        </Button>
      </div>
    </div>
  );
}
