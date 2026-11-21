'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { formatPercent, shareDrawdownText } from './calculation';
import { MaximumDrawdownForm } from './MaximumDrawdownForm';
import {
  createDefaultInput,
  createExampleInput,
  type MaximumDrawdownFieldErrors,
  type MaximumDrawdownInput,
  type MaximumDrawdownResult,
  type RecoveryResult,
} from './types';
import {
  validateMaximumDrawdownInput,
  validateRecoverySide,
} from './validation';

export function MaximumDrawdownCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<MaximumDrawdownInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<MaximumDrawdownFieldErrors>({});
  const [drawdown, setDrawdown] = React.useState<MaximumDrawdownResult | null>(null);
  const [recovery, setRecovery] = React.useState<RecoveryResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleCalculate = () => {
    const validation = validateMaximumDrawdownInput(input);
    setErrors(validation.errors);
    setDrawdown(validation.isValid ? validation.drawdown : null);
    setRecovery(validation.isValid ? validation.recovery : null);
    if (validation.isValid && validation.drawdown && input.recoverySynced) {
      setInput((prev) => ({
        ...prev,
        recoveryDrawdown: formatPercent(validation.drawdown!.maximumDrawdownPercent),
      }));
    }
  };

  const handleClear = () => {
    setInput({
      ...createDefaultInput(),
      currency: input.currency,
    });
    setErrors({});
    setDrawdown(null);
    setRecovery(null);
  };

  const handleChange = (next: MaximumDrawdownInput) => {
    const primaryChanged =
      next.peakValue !== input.peakValue ||
      next.lowestValueAfterPeak !== input.lowestValueAfterPeak ||
      next.currency !== input.currency;

    setInput(next);

    if (primaryChanged) {
      setDrawdown(null);
      setRecovery(null);
      return;
    }

    // Accordion / recovery-only edits: keep drawdown; refresh recovery estimate.
    if (!drawdown) {
      setRecovery(null);
      return;
    }

    const side = validateRecoverySide(
      next,
      next.recoverySynced ? drawdown.maximumDrawdownPercent : undefined,
    );
    setErrors((prev) => ({
      peakValue: prev.peakValue,
      lowestValueAfterPeak: prev.lowestValueAfterPeak,
      form: prev.form,
      recoveryDrawdown: side.errors.recoveryDrawdown,
      expectedAnnualGrowthRate: side.errors.expectedAnnualGrowthRate,
    }));
    setRecovery(side.result);
  };

  const summary = drawdown ? shareDrawdownText(drawdown, recovery) : '';

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
            Peak-to-trough drawdown · recovery time estimate
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <MaximumDrawdownForm
          input={input}
          errors={errors}
          drawdown={drawdown}
          recovery={recovery}
          onChange={handleChange}
          onCalculate={handleCalculate}
          onClear={handleClear}
          onLoadExample={() => {
            const next = createExampleInput();
            setInput(next);
            const validation = validateMaximumDrawdownInput(next);
            setErrors(validation.errors);
            setDrawdown(validation.isValid ? validation.drawdown : null);
            setRecovery(validation.isValid ? validation.recovery : null);
          }}
        />

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-1.5"
            disabled={!drawdown}
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
