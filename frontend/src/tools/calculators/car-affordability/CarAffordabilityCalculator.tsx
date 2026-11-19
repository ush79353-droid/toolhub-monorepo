'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { shareCarAffordabilityText } from './calculation';
import { CarAffordabilityForm } from './CarAffordabilityForm';
import {
  createDefaultInput,
  createExampleInput,
  type CarAffordabilityFieldErrors,
  type CarAffordabilityInput,
  type CarAffordabilityResult,
} from './types';
import { validateCarAffordabilityInput } from './validation';

export function CarAffordabilityCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<CarAffordabilityInput>(() =>
    createDefaultInput(),
  );
  const [errors, setErrors] = React.useState<CarAffordabilityFieldErrors>({});
  const [result, setResult] = React.useState<CarAffordabilityResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleCalculate = () => {
    const validation = validateCarAffordabilityInput(input);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleClear = () => {
    setInput({
      ...createDefaultInput(),
      currency: input.currency,
    });
    setErrors({});
    setResult(null);
  };

  const handleReload = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
  };

  const handleChange = (next: CarAffordabilityInput) => {
    setInput(next);
    setResult(null);
  };

  const summary = result ? shareCarAffordabilityText(result) : '';

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
            Maximum car price from your monthly payment budget
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CarAffordabilityForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCalculate={handleCalculate}
          onClear={handleClear}
          onReload={handleReload}
          onLoadExample={() => {
            const next = createExampleInput();
            setInput(next);
            const validation = validateCarAffordabilityInput(next);
            setErrors(validation.errors);
            setResult(validation.isValid ? validation.result : null);
          }}
        />

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-1.5"
            disabled={!result}
            onClick={() => void handleShare()}
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {shared ? 'Shared' : copied ? 'Copied' : 'Share result'}
          </Button>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Did we solve your problem today?</span>
            <Button
              type="button"
              size="icon"
              variant={feedback === 'yes' ? 'default' : 'outline'}
              className="h-8 w-8"
              aria-label="Yes, helpful"
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={feedback === 'no' ? 'default' : 'outline'}
              className="h-8 w-8"
              aria-label="No, not helpful"
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
