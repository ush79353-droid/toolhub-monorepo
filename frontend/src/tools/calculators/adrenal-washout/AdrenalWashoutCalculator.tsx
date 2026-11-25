'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { AdrenalWashoutForm } from './AdrenalWashoutForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type AdrenalWashoutFieldErrors,
  type AdrenalWashoutInput,
  type AdrenalWashoutResult,
} from './types';
import { validateAdrenalWashoutInput } from './validation';

export function AdrenalWashoutCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState(() => initial);
  const [input, setInput] = React.useState(() => initial);
  const [errors, setErrors] = React.useState<AdrenalWashoutFieldErrors>({});
  const [result, setResult] = React.useState<AdrenalWashoutResult | null>(() =>
    validateAdrenalWashoutInput(initial).result,
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: AdrenalWashoutInput) => {
    const validation = validateAdrenalWashoutInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(validateAdrenalWashoutInput(fresh).result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setErrors({});
    setResult(validateAdrenalWashoutInput(fresh).result);
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
    'Adrenal Washout Calculator',
    '',
    result?.statusHeadline ?? 'Enter three HU values',
    result?.statusDetail ?? '',
    result
      ? `Absolute washout: ${result.formattedAbsolute || '—'}%`
      : '',
    result
      ? `Relative washout: ${result.formattedRelative || '—'}%`
      : '',
    '',
    'Educational imaging worksheet — not a diagnosis.',
    pageUrl,
    '',
    'Omega Calculators',
  ]
    .filter((line) => line !== undefined)
    .join('\n');

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
          text: summary,
          url: pageUrl,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        /* fall through */
      }
    }
    await handleCopy();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!isEmbed && headerActions ? (
        <div className="flex justify-end">{headerActions}</div>
      ) : null}

      <AdrenalWashoutForm
        input={input}
        errors={errors}
        result={result}
        onChange={apply}
      />

      <div className="flex flex-wrap items-start gap-3 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-11 flex-col gap-1 px-4 py-2"
          onClick={() => void handleShare()}
        >
          <Share2 className="h-5 w-5 text-rose-500" aria-hidden />
          <span className="text-xs">
            {shared || copied ? 'Link copied' : 'Share result'}
          </span>
        </Button>
        <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
          <Button type="button" variant="outline" onClick={handleReload}>
            Reload calculator
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={!dirty}
            onClick={handleClear}
          >
            Clear all changes
          </Button>
        </div>
      </div>

      {!isEmbed ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <Button
            type="button"
            size="sm"
            variant={feedback === 'yes' ? 'default' : 'outline'}
            onClick={() => setFeedback('yes')}
          >
            <ThumbsUp className="mr-1 h-3.5 w-3.5" aria-hidden />
            Yes
          </Button>
          <Button
            type="button"
            size="sm"
            variant={feedback === 'no' ? 'default' : 'outline'}
            onClick={() => setFeedback('no')}
          >
            <ThumbsDown className="mr-1 h-3.5 w-3.5" aria-hidden />
            No
          </Button>
        </div>
      ) : null}

      {result ? (
        <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
      ) : null}
    </div>
  );
}
