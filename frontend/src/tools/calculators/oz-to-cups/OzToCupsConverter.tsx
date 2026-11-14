'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateOzToCups, formatVolume } from './calculation';
import {
  draftToInput,
  inputToDraft,
  OzToCupsForm,
  type OzToCupsDraft,
} from './OzToCupsForm';
import { OzToCupsResults } from './OzToCupsResults';
import {
  CUP_STANDARD_OPTIONS,
  DEFAULT_OZ_TO_CUPS_INPUT,
  EMPTY_OZ_TO_CUPS_INPUT,
  FL_OZ_STANDARD_OPTIONS,
  type OzToCupsFieldErrors,
  type OzToCupsResult,
} from './types';
import { validateOzToCups } from './validation';

function summaryText(result: OzToCupsResult): string {
  const flLabel =
    FL_OZ_STANDARD_OPTIONS.find((o) => o.value === result.flOzStandard)?.label ??
    result.flOzStandard;
  const cupLabel =
    CUP_STANDARD_OPTIONS.find((o) => o.value === result.cupStandard)?.label ??
    result.cupStandard;
  if (result.source === 'flOz') {
    return [
      'oz to Cups Converter – Omega Calculators',
      `Source: ${formatVolume(result.flOz)} ${flLabel}`,
      `Cup Standard: ${cupLabel}`,
      `Result: ${formatVolume(result.cups)} cups`,
    ].join('\n');
  }
  return [
    'oz to Cups Converter – Omega Calculators',
    `Source: ${formatVolume(result.cups)} (${cupLabel})`,
    `Fluid Ounce Standard: ${flLabel}`,
    `Result: ${formatVolume(result.flOz)} fl oz`,
  ].join('\n');
}

function syncDraftFromResult(
  draft: OzToCupsDraft,
  result: OzToCupsResult
): OzToCupsDraft {
  if (draft.source === 'flOz') {
    return { ...draft, cups: formatVolume(result.cups) };
  }
  return { ...draft, flOz: formatVolume(result.flOz) };
}

export function OzToCupsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<OzToCupsDraft>(() => {
    const initial = calculateOzToCups(DEFAULT_OZ_TO_CUPS_INPUT);
    return {
      ...inputToDraft(DEFAULT_OZ_TO_CUPS_INPUT),
      flOz: formatVolume(initial.flOz),
      cups: formatVolume(initial.cups),
    };
  });
  const [errors, setErrors] = React.useState<OzToCupsFieldErrors>({});
  const [result, setResult] = React.useState<OzToCupsResult | null>(() =>
    calculateOzToCups(DEFAULT_OZ_TO_CUPS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: OzToCupsDraft) => {
      if (
        next.flOz === draft.flOz &&
        next.cups === draft.cups &&
        next.source === draft.source &&
        next.flOzStandard === draft.flOzStandard &&
        next.cupStandard === draft.cupStandard &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateOzToCups(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateOzToCups(parsed);
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
          <h2 className="text-[15px] font-semibold text-accent">Converter</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Fluid ounces ↔ cups (volume only)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <OzToCupsForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_OZ_TO_CUPS_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <OzToCupsResults
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
