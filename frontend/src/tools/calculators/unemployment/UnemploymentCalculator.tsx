'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  convertPopulationDisplay,
  formatPopulationInput,
  shareResultText,
} from './calculation';
import { UnemploymentForm } from './UnemploymentForm';
import {
  createDefaultInput,
  createExampleInput,
  type PopulationUnit,
  type UnemploymentFieldErrors,
  type UnemploymentInput,
  type UnemploymentResult,
} from './types';
import { validateUnemploymentInput } from './validation';

function inputsEqual(a: UnemploymentInput, b: UnemploymentInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function parseOptionalAmount(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function UnemploymentCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<UnemploymentInput>(() => defaults);
  const [input, setInput] = React.useState<UnemploymentInput>(() => defaults);
  const [errors, setErrors] = React.useState<UnemploymentFieldErrors>({});
  const [result, setResult] = React.useState<UnemploymentResult | null>(null);
  const [participationOpen, setParticipationOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: UnemploymentInput) => {
    const validation = validateUnemploymentInput(next);
    // Write derived triad fields once — avoid circular re-entry by using synced display only.
    setInput(validation.syncedInput);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleUnitChange = (
    field: 'employedUnit' | 'unemployedUnit' | 'laborForceUnit' | 'workingAgeUnit',
    unit: PopulationUnit
  ) => {
    if (unit === input[field]) return;

    const amountField =
      field === 'employedUnit'
        ? 'employed'
        : field === 'unemployedUnit'
          ? 'unemployed'
          : field === 'laborForceUnit'
            ? 'laborForce'
            : 'workingAge';
    const fromUnit = input[field];
    const amount = parseOptionalAmount(input[amountField]);

    if (amount === null) {
      apply({ ...input, [field]: unit });
      return;
    }

    const converted = convertPopulationDisplay(amount, fromUnit, unit);
    apply({
      ...input,
      [field]: unit,
      [amountField]: formatPopulationInput(converted),
    });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateUnemploymentInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setParticipationOpen(false);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const cleared = createDefaultInput();
    setInput(cleared);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

  const dirty = !inputsEqual(input, baseline);
  const summary = result ? shareResultText(result) : '';

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
            Unemployment rate · unemployed ÷ labor force
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <UnemploymentForm
          input={input}
          errors={errors}
          result={result}
          participationOpen={participationOpen}
          dirty={dirty}
          onChange={apply}
          onUnitChange={handleUnitChange}
          onToggleParticipation={() => setParticipationOpen((open) => !open)}
          onLoadExample={() => {
            const example = createExampleInput();
            apply(example);
            setParticipationOpen(true);
          }}
          onClear={handleClear}
          onReset={handleReset}
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
