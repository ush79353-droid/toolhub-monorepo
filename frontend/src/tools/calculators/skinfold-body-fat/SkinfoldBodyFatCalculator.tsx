'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { SkinfoldBodyFatForm } from './SkinfoldBodyFatForm';
import { SkinfoldBodyFatResults } from './SkinfoldBodyFatResults';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleFemaleInput,
  createExampleMaleInput,
  inputsEqual,
  type SkinfoldBodyFatFieldErrors,
  type SkinfoldBodyFatInput,
  type SkinfoldBodyFatResult,
} from './types';
import { validateSkinfoldBodyFatInput } from './validation';

export function SkinfoldBodyFatCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState<SkinfoldBodyFatInput>(
    () => initial
  );
  const [input, setInput] = React.useState<SkinfoldBodyFatInput>(() => initial);
  const [errors, setErrors] = React.useState<SkinfoldBodyFatFieldErrors>({});
  const [result, setResult] = React.useState<SkinfoldBodyFatResult | null>(null);
  const [gateMessage, setGateMessage] = React.useState<string | null>(
    'Age under 17 is outside the adult Durnin–Womersley bands used here. Select 17–19 or an older band to estimate body fat %.'
  );
  const [aboutOpen, setAboutOpen] = React.useState(true);
  const [sitesOpen, setSitesOpen] = React.useState(true);
  const [resultOpen, setResultOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: SkinfoldBodyFatInput) => {
    const validation = validateSkinfoldBodyFatInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
    setGateMessage(validation.gateMessage);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    const validation = validateSkinfoldBodyFatInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setGateMessage(validation.gateMessage);
    setAboutOpen(true);
    setSitesOpen(true);
    setResultOpen(true);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const empty = createEmptyInput();
    const validation = validateSkinfoldBodyFatInput(empty);
    setInput(empty);
    setErrors(validation.errors);
    setResult(validation.result);
    setGateMessage(validation.gateMessage);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const loadExample = (kind: 'male' | 'female') => {
    apply(kind === 'male' ? createExampleMaleInput() : createExampleFemaleInput());
  };

  const dirty = !inputsEqual(input, baseline);

  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[0]
      : `/tools/${metadata.slug}`;

  // Medical privacy: share page URL only (no measurements).
  const summary = [
    `${metadata.title} | Omega Calculators`,
    'Educational Durnin–Womersley skinfold body-fat estimate — not medical advice.',
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

      <SkinfoldBodyFatForm
        input={input}
        errors={errors}
        gateMessage={gateMessage}
        aboutOpen={aboutOpen}
        sitesOpen={sitesOpen}
        resultOpen={resultOpen}
        onAboutOpenChange={setAboutOpen}
        onSitesOpenChange={setSitesOpen}
        onResultOpenChange={setResultOpen}
        onChange={apply}
        formattedBodyFat={result?.formattedBodyFatPercent ?? ''}
      />

      <SkinfoldBodyFatResults result={result} />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="text-muted-foreground">Check our examples:</span>
        <button
          type="button"
          className="font-medium text-primary underline-offset-2 hover:underline"
          onClick={() => loadExample('male')}
        >
          Example 1 — Male
        </button>
        <button
          type="button"
          className="font-medium text-primary underline-offset-2 hover:underline"
          onClick={() => loadExample('female')}
        >
          Example 2 — Female
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={handleShare}
        >
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
          disabled={!dirty && !result}
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
