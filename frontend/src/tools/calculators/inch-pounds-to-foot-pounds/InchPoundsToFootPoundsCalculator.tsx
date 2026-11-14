'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateInchPoundsToFootPounds, formatTorque } from './calculation';
import {
  InchPoundsToFootPoundsForm,
  draftToInput,
  inputToDraft,
  type InchPoundsToFootPoundsDraft,
} from './InchPoundsToFootPoundsForm';
import { InchPoundsToFootPoundsResults } from './InchPoundsToFootPoundsResults';
import {
  DEFAULT_INCH_POUNDS_TO_FOOT_POUNDS_INPUT,
  EMPTY_INCH_POUNDS_TO_FOOT_POUNDS_INPUT,
  INCH_POUNDS_PER_FOOT_POUND,
  type InchPoundsToFootPoundsFieldErrors,
  type InchPoundsToFootPoundsResult,
} from './types';
import { validateInchPoundsToFootPounds } from './validation';

function summaryText(result: InchPoundsToFootPoundsResult): string {
  return [
    'Inch-Pounds to Foot-Pounds Converter',
    'Omega Calculators',
    '',
    `Inch-pounds: ${formatTorque(result.inlbf)} in·lbf`,
    `Foot-pounds: ${formatTorque(result.ftlbf)} ft·lbf`,
    '',
    result.source === 'inlbf'
      ? `Formula: ft·lbf = in·lbf / ${INCH_POUNDS_PER_FOOT_POUND}`
      : `Formula: in·lbf = ft·lbf × ${INCH_POUNDS_PER_FOOT_POUND}`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: InchPoundsToFootPoundsDraft,
  result: InchPoundsToFootPoundsResult
): InchPoundsToFootPoundsDraft {
  if (draft.source === 'inlbf') {
    return { ...draft, ftlbf: formatTorque(result.ftlbf) };
  }
  return { ...draft, inlbf: formatTorque(result.inlbf) };
}

export function InchPoundsToFootPoundsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<InchPoundsToFootPoundsDraft>(() => {
    const initial = calculateInchPoundsToFootPounds(DEFAULT_INCH_POUNDS_TO_FOOT_POUNDS_INPUT);
    return {
      source: 'inlbf',
      inlbf: formatTorque(initial.inlbf),
      ftlbf: formatTorque(initial.ftlbf),
    };
  });
  const [errors, setErrors] = React.useState<InchPoundsToFootPoundsFieldErrors>({});
  const [result, setResult] = React.useState<InchPoundsToFootPoundsResult | null>(() =>
    calculateInchPoundsToFootPounds(DEFAULT_INCH_POUNDS_TO_FOOT_POUNDS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: InchPoundsToFootPoundsDraft) => {
      const parsed = draftToInput(next);
      const validation = validateInchPoundsToFootPounds(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateInchPoundsToFootPounds(parsed);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
    },
    []
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
            1 ft·lbf = {INCH_POUNDS_PER_FOOT_POUND} in·lbf
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <InchPoundsToFootPoundsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_INCH_POUNDS_TO_FOOT_POUNDS_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <InchPoundsToFootPoundsResults
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
