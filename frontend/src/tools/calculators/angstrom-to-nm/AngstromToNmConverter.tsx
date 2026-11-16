'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateAngstromToNm, formatLength, shareResultText } from './calculation';
import {
  AngstromToNmForm,
  draftToInput,
  emptyDraft,
  type AngstromToNmDraft,
} from './AngstromToNmForm';
import { AngstromToNmResults } from './AngstromToNmResults';
import {
  DEFAULT_ANGSTROM_TO_NM_INPUT,
  type AngstromToNmFieldErrors,
  type AngstromToNmResult,
} from './types';
import { validateAngstromToNm } from './validation';

function syncDraftFromResult(
  draft: AngstromToNmDraft,
  result: AngstromToNmResult,
): AngstromToNmDraft {
  if (draft.source === 'angstroms') {
    return {
      ...draft,
      nanometers: formatLength(result.nanometers),
      mils: formatLength(result.mils),
    };
  }
  if (draft.source === 'nanometers') {
    return {
      ...draft,
      angstroms: formatLength(result.angstroms),
      mils: formatLength(result.mils),
    };
  }
  return {
    ...draft,
    angstroms: formatLength(result.angstroms),
    nanometers: formatLength(result.nanometers),
  };
}

function initialDraft(): AngstromToNmDraft {
  const initial = calculateAngstromToNm(DEFAULT_ANGSTROM_TO_NM_INPUT);
  return {
    source: 'angstroms',
    angstroms: formatLength(initial.angstroms),
    nanometers: formatLength(initial.nanometers),
    mils: formatLength(initial.mils),
  };
}

export function AngstromToNmConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AngstromToNmDraft>(initialDraft);
  const [errors, setErrors] = React.useState<AngstromToNmFieldErrors>({});
  const [result, setResult] = React.useState<AngstromToNmResult | null>(() =>
    calculateAngstromToNm(DEFAULT_ANGSTROM_TO_NM_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: AngstromToNmDraft) => {
    const input = draftToInput(next);
    const validation = validateAngstromToNm(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateAngstromToNm(input);
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
          <p className="text-xs font-normal text-muted-foreground">1 Å = 0.1 nm · 1 mil = 25,400 nm</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AngstromToNmForm
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
            setResult(calculateAngstromToNm(DEFAULT_ANGSTROM_TO_NM_INPUT));
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
          <AngstromToNmResults
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
        </AngstromToNmForm>
      </div>
    </section>
  );
}
