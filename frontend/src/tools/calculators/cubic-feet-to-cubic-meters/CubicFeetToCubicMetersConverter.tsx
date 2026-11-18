'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateCuFtToCuM, formatVolume, shareResultText } from './calculation';
import {
  CuFtToCuMForm,
  draftToInput,
  emptyDraft,
  type CuFtToCuMDraft,
} from './CuFtToCuMForm';
import { CuFtToCuMResults } from './CuFtToCuMResults';
import {
  EXTRA_VOLUME_UNITS,
  type CuFtToCuMFieldErrors,
  type CuFtToCuMResult,
  type ExtraVolumeUnit,
} from './types';
import { validateCuFtToCuM } from './validation';

function syncDraftFromResult(draft: CuFtToCuMDraft, result: CuFtToCuMResult): CuFtToCuMDraft {
  const extras = { ...draft.extras } as Partial<Record<ExtraVolumeUnit, string>>;
  for (const unit of EXTRA_VOLUME_UNITS) {
    if (draft.source === unit) continue;
    extras[unit] = formatVolume(result.extras[unit]);
  }

  return {
    ...draft,
    cubicFeet:
      draft.source === 'cubicFeet' ? draft.cubicFeet : formatVolume(result.cubicFeet),
    cubicMeters:
      draft.source === 'cubicMeters' ? draft.cubicMeters : formatVolume(result.cubicMeters),
    extras,
  };
}

function clearNonSource(draft: CuFtToCuMDraft): CuFtToCuMDraft {
  if (draft.source === 'cubicFeet') {
    return { ...draft, cubicMeters: '', extras: {} };
  }
  if (draft.source === 'cubicMeters') {
    return { ...draft, cubicFeet: '', extras: {} };
  }
  return {
    ...draft,
    cubicFeet: '',
    cubicMeters: '',
    extras: { [draft.source]: draft.extras[draft.source] },
  };
}

export function CubicFeetToCubicMetersConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CuFtToCuMDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CuFtToCuMFieldErrors>({});
  const [result, setResult] = React.useState<CuFtToCuMResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CuFtToCuMDraft) => {
    const input = draftToInput(next);
    const validation = validateCuFtToCuM(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(input.value === null ? clearNonSource(next) : next);
      return;
    }
    const nextResult = calculateCuFtToCuM(input);
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
            1 ft³ = 0.028316846592 m³ exactly
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CuFtToCuMForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
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
          <CuFtToCuMResults
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
        </CuFtToCuMForm>
      </div>
    </section>
  );
}
