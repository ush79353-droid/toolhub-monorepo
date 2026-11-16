'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateMcgToMl,
  formatMeasure,
  fromMcg,
  fromMl,
  shareResultText,
} from './calculation';
import { McgToMlForm, draftToInput, emptyDraft, type McgToMlDraft } from './McgToMlForm';
import { McgToMlResults } from './McgToMlResults';
import {
  DEFAULT_MCG_TO_ML_INPUT,
  VITAMIN_B12_EXAMPLE_MCG_PER_ML,
  WATER_DENSITY_G_PER_ML,
  type McgToMlFieldErrors,
  type McgToMlResult,
} from './types';
import { validateMcgToMl } from './validation';

function syncDraftFromResult(draft: McgToMlDraft, result: McgToMlResult): McgToMlDraft {
  if (draft.source === 'mass') {
    return {
      ...draft,
      volumeDisplay: formatMeasure(fromMl(result.volumeMl, draft.volumeUnit)),
    };
  }
  return {
    ...draft,
    massDisplay: formatMeasure(fromMcg(result.massMcg, draft.massUnit)),
  };
}

function initialDraft(): McgToMlDraft {
  const initial = calculateMcgToMl(DEFAULT_MCG_TO_ML_INPUT);
  return {
    mode: 'medication',
    source: 'mass',
    massDisplay: formatMeasure(fromMcg(initial.massMcg, 'mcg')),
    volumeDisplay: formatMeasure(fromMl(initial.volumeMl, 'mL')),
    massUnit: 'mcg',
    volumeUnit: 'mL',
    medicationPreset: 'vitaminB12Example',
    concentrationValue: formatMeasure(VITAMIN_B12_EXAMPLE_MCG_PER_ML),
    concentrationUnit: 'mcgPerMl',
    densityValue: formatMeasure(WATER_DENSITY_G_PER_ML),
    densityUnit: 'gPerMl',
  };
}

export function McgToMlConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<McgToMlDraft>(initialDraft);
  const [errors, setErrors] = React.useState<McgToMlFieldErrors>({});
  const [result, setResult] = React.useState<McgToMlResult | null>(() =>
    calculateMcgToMl(DEFAULT_MCG_TO_ML_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: McgToMlDraft) => {
    const input = draftToInput(next);
    const validation = validateMcgToMl(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setDraft(next);
      setResult(null);
      return;
    }
    const nextResult = calculateMcgToMl(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const payload = result ? shareResultText(result) : '';

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
            mcg ↔ mL needs concentration or density
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <McgToMlForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(initialDraft());
            setErrors({});
            setResult(calculateMcgToMl(DEFAULT_MCG_TO_ML_INPUT));
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <McgToMlResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(text).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </McgToMlForm>
      </div>
    </section>
  );
}
