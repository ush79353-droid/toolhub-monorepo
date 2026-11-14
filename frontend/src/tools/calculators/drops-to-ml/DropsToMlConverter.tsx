'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateDropsToMl, formatMeasure } from './calculation';
import {
  draftToInput,
  DropsToMlForm,
  inputToDraft,
  type DropsToMlDraft,
} from './DropsToMlForm';
import { DropsToMlResults } from './DropsToMlResults';
import {
  DEFAULT_DROPS_TO_ML_INPUT,
  EMPTY_DROPS_TO_ML_INPUT,
  type DropsToMlFieldErrors,
  type DropsToMlResult,
} from './types';
import { validateDropsToMl } from './validation';

function summaryText(result: DropsToMlResult): string {
  const factorNote = result.factorAssumed ? ' (assumed)' : ' (custom)';
  if (result.source === 'drops') {
    return [
      'Drops to mL Conversion – Omega Calculators',
      `Drops: ${formatMeasure(result.drops)}`,
      `Drop Factor: ${formatMeasure(result.dropsPerMl)} drops/mL${factorNote}`,
      `Volume: ≈ ${formatMeasure(result.ml)} mL`,
    ].join('\n');
  }
  return [
    'Drops to mL Conversion – Omega Calculators',
    `Milliliters: ${formatMeasure(result.ml)} mL`,
    `Drop Factor: ${formatMeasure(result.dropsPerMl)} drops/mL${factorNote}`,
    `Estimated Drops: ${formatMeasure(result.drops)}`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: DropsToMlDraft,
  result: DropsToMlResult
): DropsToMlDraft {
  if (draft.source === 'drops') {
    return { ...draft, ml: formatMeasure(result.ml) };
  }
  return { ...draft, drops: formatMeasure(result.drops) };
}

export function DropsToMlConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<DropsToMlDraft>(() => {
    const initial = calculateDropsToMl(DEFAULT_DROPS_TO_ML_INPUT);
    return inputToDraft({
      ...DEFAULT_DROPS_TO_ML_INPUT,
      drops: initial.drops,
      ml: initial.ml,
    });
  });
  const [errors, setErrors] = React.useState<DropsToMlFieldErrors>({});
  const [result, setResult] = React.useState<DropsToMlResult | null>(() =>
    calculateDropsToMl(DEFAULT_DROPS_TO_ML_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: DropsToMlDraft) => {
      const measuresSame =
        next.drops === draft.drops &&
        next.ml === draft.ml &&
        next.dropsPerMl === draft.dropsPerMl &&
        next.source === draft.source;

      if (measuresSame) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateDropsToMl(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateDropsToMl(parsed);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
    },
    [draft]
  );

  const sharePayload = result ? summaryText(result) : '';

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
            drops ↔ mL uses an assumed drop factor
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <DropsToMlForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_DROPS_TO_ML_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <DropsToMlResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
