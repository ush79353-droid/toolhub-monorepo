'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { ProstateVolumeForm } from './ProstateVolumeForm';
import {
  createEmptyInput,
  inputsEqual,
  type ProstateVolumeFieldErrors,
  type ProstateVolumeInput,
  type ProstateVolumeResult,
} from './types';
import { validateProstateVolumeInput } from './validation';

export function ProstateVolumeCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createEmptyInput();
  const [baseline, setBaseline] = React.useState<ProstateVolumeInput>(
    () => initial,
  );
  const [input, setInput] = React.useState<ProstateVolumeInput>(() => initial);
  const [errors, setErrors] = React.useState<ProstateVolumeFieldErrors>({});
  const [result, setResult] = React.useState<ProstateVolumeResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: ProstateVolumeInput) => {
    const validation = validateProstateVolumeInput(next);
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
      ? window.location.href
      : `/tools/${metadata.slug}`;

  const summary = [
    metadata.title,
    '',
    'Calculate educational prostate volume on Omega Calculators.',
    pageUrl,
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
          text: 'Prostate Volume Calculator | Omega Calculators',
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
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-accent">
            {metadata.title}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ellipsoid and bullet TRUS/MRI volume
          </p>
        </div>
        {headerActions}
      </div>

      <div className="space-y-5 px-5 py-5">
        <ProstateVolumeForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 gap-2"
            onClick={() => void handleShare()}
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {shared ? 'Shared' : copied ? 'Link copied' : 'Share result'}
          </Button>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={handleReload}
          >
            Reload calculator
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={!dirty && !result}
            onClick={handleClear}
          >
            Clear all changes
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
          <p className="text-sm font-medium text-accent">
            Did we solve your problem today?
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={feedback === 'yes' ? 'default' : 'outline'}
              className="gap-1.5"
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
              Yes
            </Button>
            <Button
              type="button"
              size="sm"
              variant={feedback === 'no' ? 'default' : 'outline'}
              className="gap-1.5"
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" aria-hidden />
              No
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
