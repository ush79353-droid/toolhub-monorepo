'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { fmt, fromPsi } from './calculation';
import { CompressionRatioToPsiForm } from './CompressionRatioToPsiForm';
import { CompressionRatioToPsiResults } from './CompressionRatioToPsiResults';
import {
  MODEL_LABELS,
  createEmptyInput,
  type CompressionRatioToPsiFieldErrors,
  type CompressionRatioToPsiInput,
  type CompressionRatioToPsiResult,
} from './types';
import { validateCompressionRatioToPsiInputs } from './validation';

function inputsEqual(
  a: CompressionRatioToPsiInput,
  b: CompressionRatioToPsiInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function CompressionRatioToPsiCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createEmptyInput();
  const initialValidation = validateCompressionRatioToPsiInputs(initial);
  const [baseline, setBaseline] = React.useState<CompressionRatioToPsiInput>(
    () => initial,
  );
  const [input, setInput] = React.useState<CompressionRatioToPsiInput>(
    () => initial,
  );
  const [errors, setErrors] =
    React.useState<CompressionRatioToPsiFieldErrors>(
      () => initialValidation.errors,
    );
  const [result, setResult] =
    React.useState<CompressionRatioToPsiResult | null>(
      () => initialValidation.result,
    );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const commit = (next: CompressionRatioToPsiInput) => {
    const validation = validateCompressionRatioToPsiInputs(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setBaseline(fresh);
    const validation = validateCompressionRatioToPsiInputs(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const blank: CompressionRatioToPsiInput = {
      ...createEmptyInput(),
      numerator: '',
      denominator: '',
      atmosphericPressure: '',
      compressionPressure: '',
      polytropicExponent: '',
    };
    setInput(blank);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const shareable = result != null;

  const summary = shareable
    ? [
        'Compression Ratio to PSI Calculator',
        '',
        `Direction: ${result!.direction}`,
        `Model: ${MODEL_LABELS[result!.model]}`,
        `Compression ratio: ${fmt(result!.normalizedCompressionRatio, 2)}:1`,
        `Atmosphere: ${fmt(result!.atmosphericPressurePsi)} psia`,
        `Absolute: ${fmt(fromPsi(result!.absolutePressurePsi, result!.resultPressureUnit))} ${result!.resultPressureUnit}`,
        `Gauge: ${fmt(fromPsi(result!.gaugePressurePsi, result!.resultPressureUnit))} ${result!.resultPressureUnit}`,
        result!.polytropicExponent != null
          ? `n = ${fmt(result!.polytropicExponent, 3)}`
          : null,
        '',
        ...result!.formulaSteps,
        '',
        result!.interpretation,
        '',
        'Omega Calculators',
        typeof window !== 'undefined'
          ? window.location.href
          : `/tools/${metadata.slug}`,
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  const handleCopy = async () => {
    if (!summary) return;
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

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
    await handleCopy();
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
          <h2 className="text-[15px] font-semibold text-accent">
            Compression Ratio → PSI
          </h2>
          <p className="text-xs font-normal text-muted-foreground">
            Theoretical pressure from CR &amp; atmosphere
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CompressionRatioToPsiForm
          input={input}
          errors={errors}
          onChange={commit}
        />
        <CompressionRatioToPsiResults result={result} />

        <div className="grid grid-cols-[auto_auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleCopy()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-xs text-xs font-bold">
              {copied ? '✓' : '⧉'}
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : 'Copy result'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 w-full text-xs"
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 w-full text-xs"
              disabled={!dirty && !result}
              onClick={handleClear}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>Was this helpful?</span>
          <button
            type="button"
            aria-pressed={feedback === 'yes'}
            onClick={() => setFeedback('yes')}
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${
              feedback === 'yes'
                ? 'border-primary text-primary'
                : 'border-border'
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" /> Yes
          </button>
          <button
            type="button"
            aria-pressed={feedback === 'no'}
            onClick={() => setFeedback('no')}
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${
              feedback === 'no'
                ? 'border-primary text-primary'
                : 'border-border'
            }`}
          >
            <ThumbsDown className="h-3.5 w-3.5" /> No
          </button>
        </div>
      </div>
    </section>
  );
}
