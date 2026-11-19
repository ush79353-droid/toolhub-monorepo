'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { UnemploymentForm } from './UnemploymentForm';
import {
  createDefaultInput,
  createExampleInput,
  type PopulationUnit,
  type UnemploymentFieldErrors,
  type UnemploymentInput,
  type UnemploymentResult,
} from './types';

function inputsEqual(a: UnemploymentInput, b: UnemploymentInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * UI shell — live validation/results are wired in the engine commit.
 * ponytail: temporary no-op apply until calculation.ts / validation.ts land.
 */
function applyUiOnly(next: UnemploymentInput): {
  errors: UnemploymentFieldErrors;
  result: UnemploymentResult | null;
} {
  void next;
  return { errors: {}, result: null };
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
    const outcome = applyUiOnly(next);
    setInput(next);
    setErrors(outcome.errors);
    setResult(outcome.result);
  };

  const handleUnitChange = (
    field: 'employedUnit' | 'unemployedUnit' | 'laborForceUnit' | 'workingAgeUnit',
    unit: PopulationUnit
  ) => {
    if (unit === input[field]) return;
    // Unit conversion preserving people count lands with the engine commit.
    apply({ ...input, [field]: unit });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
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

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        result.formattedUnemploymentRate
          ? `Unemployment rate: ${result.formattedUnemploymentRate}%`
          : 'Unemployment rate: undefined (labor force is zero)',
        `Employed: ${result.employedPeople.toLocaleString('en-US')} people`,
        `Unemployed: ${result.unemployedPeople.toLocaleString('en-US')} people`,
        `Labor force: ${result.laborForcePeople.toLocaleString('en-US')} people`,
        result.formattedParticipationRate
          ? `Labor force participation rate: ${result.formattedParticipationRate}%`
          : null,
        result.interpretation,
        '/tools/unemployment-calculator-unemployment-rate',
      ]
        .filter(Boolean)
        .join('\n')
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
          onLoadExample={() => apply(createExampleInput())}
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
