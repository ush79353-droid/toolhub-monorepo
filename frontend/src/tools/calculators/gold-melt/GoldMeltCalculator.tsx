'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateBidAskFromSpread,
  formatGoldMoney,
  parseOptionalNumber,
  shareGoldMeltText,
} from './calculation';
import { GoldMeltForm } from './GoldMeltForm';
import {
  createBlankInput,
  createDefaultInput,
  type GoldMeltFieldErrors,
  type GoldMeltInput,
  type GoldMeltResult,
} from './types';
import { validateGoldMeltInput } from './validation';

function withDerivedTrade(input: GoldMeltInput): GoldMeltInput {
  const spot = parseOptionalNumber(input.marketPrice);
  const spread = parseOptionalNumber(input.spread);
  if (spot === null || spread === null) return input;
  const { bid, ask } = calculateBidAskFromSpread(spot, spread);
  return {
    ...input,
    bidPrice: input.bidPriceManuallySet
      ? input.bidPrice
      : formatGoldMoney(bid, input.currency),
    askPrice: input.askPriceManuallySet
      ? input.askPrice
      : formatGoldMoney(ask, input.currency),
  };
}

export function GoldMeltCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<GoldMeltInput>(() =>
    withDerivedTrade(createDefaultInput()),
  );
  const [errors, setErrors] = React.useState<GoldMeltFieldErrors>({});
  const [result, setResult] = React.useState<GoldMeltResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  const run = (next: GoldMeltInput) => {
    const validation = validateGoldMeltInput(next);
    setErrors(validation.incomplete ? {} : validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
    run(withDerivedTrade(createDefaultInput()));
  }, []);

  const handleCalculate = () => {
    const validation = validateGoldMeltInput(input);
    if (validation.incomplete) {
      setErrors({
        form: 'Enter gold weight and market price to estimate melt value.',
      });
      setResult(null);
      return;
    }
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleClear = () => {
    setInput(createBlankInput(input.currency));
    setErrors({});
    setResult(null);
  };

  const handleReload = () => {
    const next = withDerivedTrade({
      ...createDefaultInput(),
      currency: input.currency,
    });
    setInput(next);
    run(next);
  };

  const summary = result ? shareGoldMeltText(result, input) : '';

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
            Gold melt value from karat, weight, market price, and dealer spread
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <GoldMeltForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onCalculate={handleCalculate}
          onClear={handleClear}
          onReload={handleReload}
          onLoadExample={() => {
            const next = withDerivedTrade({
              ...createDefaultInput(),
              currency: input.currency,
            });
            setInput(next);
            run(next);
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
