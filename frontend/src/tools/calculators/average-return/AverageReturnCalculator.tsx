'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { shareAverageText, shareCashFlowText } from './calculation';
import {
  createAverageExampleInput,
  createCashFlowExampleInput,
  createDefaultAverageInput,
  createDefaultCashFlowInput,
  type AverageFieldErrors,
  type AverageSectionInput,
  type AverageSectionResult,
  type CashFlowFieldErrors,
  type CashFlowSectionInput,
  type CashFlowSectionResult,
} from './types';
import { validateAverageSection, validateCashFlowSection } from './validation';
import { AverageReturnForm } from './AverageReturnForm';

export function AverageReturnCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [cashFlow, setCashFlow] = React.useState<CashFlowSectionInput>(() =>
    createDefaultCashFlowInput(),
  );
  const [cashFlowErrors, setCashFlowErrors] = React.useState<CashFlowFieldErrors>({});
  const [cashFlowResult, setCashFlowResult] =
    React.useState<CashFlowSectionResult | null>(null);

  const [average, setAverage] = React.useState<AverageSectionInput>(() =>
    createDefaultAverageInput(),
  );
  const [averageErrors, setAverageErrors] = React.useState<AverageFieldErrors>({});
  const [averageResult, setAverageResult] =
    React.useState<AverageSectionResult | null>(null);

  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const [shareSource, setShareSource] = React.useState<'cash' | 'average'>('cash');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleCalculateCashFlow = () => {
    const validation = validateCashFlowSection(cashFlow);
    setCashFlowErrors(validation.errors);
    setCashFlowResult(validation.isValid ? validation.result : null);
    if (validation.isValid) setShareSource('cash');
  };

  const handleClearCashFlow = () => {
    setCashFlow({
      ...createDefaultCashFlowInput(),
      currency: cashFlow.currency,
    });
    setCashFlowErrors({});
    setCashFlowResult(null);
  };

  const handleCalculateAverage = () => {
    const validation = validateAverageSection(average);
    setAverageErrors(validation.errors);
    setAverageResult(validation.isValid ? validation.result : null);
    if (validation.isValid) setShareSource('average');
  };

  const handleClearAverage = () => {
    setAverage(createDefaultAverageInput());
    setAverageErrors({});
    setAverageResult(null);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    setCashFlow({ ...cashFlow, currency });
    if (cashFlowResult) {
      const validation = validateCashFlowSection({ ...cashFlow, currency });
      setCashFlowResult(validation.isValid ? validation.result : cashFlowResult);
    }
  };

  const summary =
    shareSource === 'cash' && cashFlowResult
      ? shareCashFlowText(cashFlowResult)
      : shareSource === 'average' && averageResult
        ? shareAverageText(averageResult)
        : cashFlowResult
          ? shareCashFlowText(cashFlowResult)
          : averageResult
            ? shareAverageText(averageResult)
            : '';

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
            Cash-flow XIRR · average & cumulative period returns
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <AverageReturnForm
          cashFlow={cashFlow}
          cashFlowErrors={cashFlowErrors}
          cashFlowResult={cashFlowResult}
          average={average}
          averageErrors={averageErrors}
          averageResult={averageResult}
          onCashFlowChange={(next) => {
            setCashFlow(next);
            setCashFlowResult(null);
          }}
          onAverageChange={(next) => {
            setAverage(next);
            setAverageResult(null);
          }}
          onCurrencyChange={handleCurrencyChange}
          onCalculateCashFlow={handleCalculateCashFlow}
          onClearCashFlow={handleClearCashFlow}
          onCalculateAverage={handleCalculateAverage}
          onClearAverage={handleClearAverage}
          onLoadCashFlowExample={() => {
            const next = createCashFlowExampleInput();
            setCashFlow(next);
            const validation = validateCashFlowSection(next);
            setCashFlowErrors(validation.errors);
            setCashFlowResult(validation.isValid ? validation.result : null);
            setShareSource('cash');
          }}
          onLoadAverageExample={() => {
            const next = createAverageExampleInput();
            setAverage(next);
            const validation = validateAverageSection(next);
            setAverageErrors(validation.errors);
            setAverageResult(validation.isValid ? validation.result : null);
            setShareSource('average');
          }}
        />

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-1.5"
            disabled={!cashFlowResult && !averageResult}
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
