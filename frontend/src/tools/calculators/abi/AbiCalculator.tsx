'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { AbiForm } from './AbiForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type AbiInput,
} from './types';
import { validateAbiInput } from './validation';

export function AbiCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState<AbiInput>(() => initial);
  const [input, setInput] = React.useState<AbiInput>(() => initial);
  const [errors, setErrors] = React.useState(() => validateAbiInput(initial).errors);
  const [result, setResult] = React.useState(() => validateAbiInput(initial).result);
  const [rightOpen, setRightOpen] = React.useState(true);
  const [leftOpen, setLeftOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: AbiInput) => {
    const validation = validateAbiInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    const validation = validateAbiInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setRightOpen(true);
    setLeftOpen(true);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const empty = createEmptyInput();
    const validation = validateAbiInput(empty);
    setInput(empty);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const hasResult = Boolean(result.right || result.left);

  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[0]
      : `/tools/${metadata.slug}`;

  const summary = [
    `${metadata.title} | Omega Calculators`,
    'Educational ankle-brachial index ratio — not a PAD diagnosis.',
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

      <AbiForm
        input={input}
        errors={errors}
        result={result}
        rightOpen={rightOpen}
        leftOpen={leftOpen}
        onRightOpenChange={setRightOpen}
        onLeftOpenChange={setLeftOpen}
        onChange={apply}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button type="button" className="w-full sm:w-auto" onClick={handleShare}>
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
          disabled={!dirty && !hasResult}
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
