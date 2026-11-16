'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCmToM,
  centimetersToOther,
  formatLength,
  shareResultText,
} from './calculation';
import { CmToMForm, draftToInput, emptyDraft, type CmToMDraft } from './CmToMForm';
import { CmToMResults } from './CmToMResults';
import type { CmToMFieldErrors, CmToMResult, OtherLengthUnit } from './types';
import { parseOptionalNumber, validateCmToM } from './validation';

function syncDraftFromResult(draft: CmToMDraft, result: CmToMResult): CmToMDraft {
  return {
    ...draft,
    centimeters: draft.source === 'cm' ? draft.centimeters : formatLength(result.centimeters),
    meters: draft.source === 'm' ? draft.meters : formatLength(result.meters),
    other: draft.source === 'other' ? draft.other : formatLength(result.other),
    otherUnit: result.otherUnit,
  };
}

function clearNonSource(draft: CmToMDraft): CmToMDraft {
  if (draft.source === 'cm') {
    return { ...draft, meters: '', other: '' };
  }
  if (draft.source === 'm') {
    return { ...draft, centimeters: '', other: '' };
  }
  return { ...draft, centimeters: '', meters: '' };
}

export function CmToMConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CmToMDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CmToMFieldErrors>({});
  const [result, setResult] = React.useState<CmToMResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CmToMDraft) => {
    const input = draftToInput(next);
    const validation = validateCmToM(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(input.value === null ? clearNonSource(next) : next);
      return;
    }
    const nextResult = calculateCmToM(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const handleOtherUnitChange = (unit: OtherLengthUnit) => {
    if (result) {
      const next: CmToMDraft = {
        ...draft,
        otherUnit: unit,
        other: formatLength(centimetersToOther(result.centimeters, unit)),
        source: draft.source === 'other' ? 'cm' : draft.source,
      };
      // Keep centimeters as the source of truth when only the unit label changes.
      if (draft.source === 'other') {
        next.centimeters = formatLength(result.centimeters);
        next.source = 'cm';
      }
      evaluate(next);
      return;
    }

    const cm = parseOptionalNumber(draft.centimeters);
    if (cm != null && Number.isFinite(cm) && cm >= 0) {
      evaluate({
        ...draft,
        source: 'cm',
        otherUnit: unit,
        other: formatLength(centimetersToOther(cm, unit)),
      });
      return;
    }

    setDraft({ ...draft, otherUnit: unit, other: '' });
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
          <p className="text-xs font-normal text-muted-foreground">1 m = 100 cm exactly</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CmToMForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onOtherUnitChange={handleOtherUnitChange}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
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
          <CmToMResults
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
        </CmToMForm>
      </div>
    </section>
  );
}
