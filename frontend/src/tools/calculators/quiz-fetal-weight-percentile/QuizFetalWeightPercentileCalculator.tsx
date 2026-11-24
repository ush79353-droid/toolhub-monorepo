'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateQuizResult } from './calculation';
import { QuizFetalWeightPercentileForm } from './QuizFetalWeightPercentileForm';
import {
  createDefaultInput,
  hasQuizChanges,
  type QuizFetalWeightPercentileInput,
} from './types';

export function QuizFetalWeightPercentileCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = React.useMemo(() => createDefaultInput(), []);
  const [input, setInput] = React.useState(defaults);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const result = React.useMemo(() => calculateQuizResult(input), [input]);
  const dirty = hasQuizChanges(input);

  const handleReload = () => {
    setInput(defaults);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    setInput(createDefaultInput());
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  // Medical/educational privacy: share only the public page URL.
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  const handleShare = async () => {
    const shareData = {
      title: metadata.title || 'Quiz: Fetal Weight Percentile',
      text: 'Quiz: Fetal Weight Percentile — Omega Calculators (educational).',
      url: pageUrl,
    };
    try {
      if (canShare) {
        await navigator.share(shareData);
        setShared(true);
        return;
      }
      const ok = await copyTextToClipboard(`${shareData.text}\n${pageUrl}`);
      setCopied(ok);
      setShared(ok);
    } catch {
      const ok = await copyTextToClipboard(pageUrl);
      setCopied(ok);
      setShared(ok);
    }
  };

  return (
    <section
      aria-label={`${metadata.title} quiz panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${className}`}
    >
      <div className="space-y-4 p-4 sm:p-5">
        {!isEmbed && headerActions ? (
          <div className="flex justify-end">{headerActions}</div>
        ) : null}

        <QuizFetalWeightPercentileForm
          input={input}
          result={result}
          onChange={setInput}
        />

        <div className="flex flex-wrap items-stretch gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-auto min-h-11 flex-col gap-1 px-4 py-2"
            onClick={() => void handleShare()}
          >
            <Share2 className="h-4 w-4 text-rose-500" aria-hidden />
            <span className="text-xs">
              {shared || copied ? 'Link ready' : 'Share result'}
            </span>
          </Button>
          <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
            <Button type="button" variant="outline" onClick={handleReload}>
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!dirty}
              onClick={handleClear}
            >
              Clear all changes
            </Button>
          </div>
        </div>

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
      </div>
    </section>
  );
}
