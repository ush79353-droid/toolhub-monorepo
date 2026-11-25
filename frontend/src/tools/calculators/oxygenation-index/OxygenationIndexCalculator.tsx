'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { OxygenationIndexForm } from './OxygenationIndexForm';
import {
  createEmptyInput,
  createExampleInput,
  inputsEqual,
  type OxygenationIndexFieldErrors,
  type OxygenationIndexInput,
  type OxygenationIndexResult,
} from './types';
import { validateOxygenationIndexInput } from './validation';

export function OxygenationIndexCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createEmptyInput();
  const initialValidation = validateOxygenationIndexInput(initial);
  const [baseline, setBaseline] = React.useState<OxygenationIndexInput>(
    () => initial,
  );
  const [input, setInput] = React.useState<OxygenationIndexInput>(
    () => initial,
  );
  const [errors, setErrors] = React.useState<OxygenationIndexFieldErrors>(
    () => initialValidation.errors,
  );
  const [result, setResult] = React.useState<OxygenationIndexResult | null>(
    () => initialValidation.result,
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: OxygenationIndexInput) => {
    const validation = validateOxygenationIndexInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createEmptyInput();
    const validation = validateOxygenationIndexInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const fresh = createEmptyInput();
    const validation = validateOxygenationIndexInput(fresh);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
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
    'Oxygenation Index Calculator',
    '',
    'Educational P/F and oxygenation index worksheet.',
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
          title: 'Oxygenation Index Calculator',
          text: summary,
          url: pageUrl,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        /* fall through to copy */
      }
    }
    await handleCopy();
  };

  return (
    <div
      className={`rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {!isEmbed && headerActions ? (
        <div className="mb-3 flex justify-end">{headerActions}</div>
      ) : null}

      <OxygenationIndexForm
        input={input}
        errors={errors}
        result={result}
        onChange={apply}
        onLoadExample={() => apply(createExampleInput())}
      />

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => void handleShare()}
        >
          <Share2 className="h-4 w-4" aria-hidden />
          {shared || copied ? 'Link ready' : 'Share result'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleReload}>
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!dirty}
          onClick={handleClear}
        >
          Clear all changes
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>Did we solve your problem today?</span>
        <Button
          type="button"
          variant={feedback === 'yes' ? 'default' : 'outline'}
          size="sm"
          className="gap-1"
          onClick={() => setFeedback('yes')}
        >
          <ThumbsUp className="h-4 w-4" aria-hidden />
          Yes
        </Button>
        <Button
          type="button"
          variant={feedback === 'no' ? 'default' : 'outline'}
          size="sm"
          className="gap-1"
          onClick={() => setFeedback('no')}
        >
          <ThumbsDown className="h-4 w-4" aria-hidden />
          No
        </Button>
      </div>
    </div>
  );
}
