'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateRadiansToDegrees,
  formatAngleValue,
  shareResultText,
} from './calculation';
import {
  RadiansToDegreesForm,
  defaultDraft,
  draftToInput,
  emptyDraft,
  type RadiansToDegreesDraft,
} from './RadiansToDegreesForm';
import { RadiansToDegreesResults } from './RadiansToDegreesResults';
import {
  EXTRA_ANGLE_FIELDS,
  type ExtraAngleField,
  type RadiansToDegreesFieldErrors,
  type RadiansToDegreesResult,
} from './types';
import { isIncompleteNumber, validateRadiansToDegrees } from './validation';

function syncDraftFromResult(
  draft: RadiansToDegreesDraft,
  result: RadiansToDegreesResult,
): RadiansToDegreesDraft {
  const extras = { ...draft.extras } as Partial<Record<ExtraAngleField, string>>;
  for (const unit of EXTRA_ANGLE_FIELDS) {
    if (draft.source === unit) continue;
    extras[unit] = formatAngleValue(result.extras[unit]);
  }

  return {
    ...draft,
    radians: draft.source === 'radians' ? draft.radians : formatAngleValue(result.radians),
    degrees: draft.source === 'degrees' ? draft.degrees : formatAngleValue(result.degrees),
    extras,
  };
}

function clearNonSource(draft: RadiansToDegreesDraft): RadiansToDegreesDraft {
  if (draft.source === 'radians') {
    return { ...draft, degrees: '', extras: {} };
  }
  if (draft.source === 'degrees') {
    return { ...draft, radians: '', extras: {} };
  }
  return {
    ...draft,
    radians: '',
    degrees: '',
    extras: { [draft.source]: draft.extras[draft.source] },
  };
}

function initialResult(): RadiansToDegreesResult {
  return calculateRadiansToDegrees({ source: 'radians', value: Math.PI });
}

export function RadiansToDegreesConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<RadiansToDegreesDraft>(() =>
    syncDraftFromResult(defaultDraft(), initialResult()),
  );
  const [errors, setErrors] = React.useState<RadiansToDegreesFieldErrors>({});
  const [result, setResult] = React.useState<RadiansToDegreesResult | null>(initialResult);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: RadiansToDegreesDraft) => {
    if (
      next.radians === draft.radians &&
      next.degrees === draft.degrees &&
      JSON.stringify(next.extras) === JSON.stringify(draft.extras) &&
      next.source === draft.source &&
      next.moreOpen !== draft.moreOpen
    ) {
      setDraft(next);
      return;
    }

    const sourceRaw =
      next.source === 'radians'
        ? next.radians
        : next.source === 'degrees'
          ? next.degrees
          : (next.extras[next.source] ?? '');

    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      // Incomplete π typing (e.g. "p", "pi/") — keep draft without syncing others.
      if (/[pπ]/i.test(sourceRaw) && !Number.isFinite(Number(sourceRaw.trim()))) {
        setErrors({});
        setResult(null);
        setDraft(clearNonSource(next));
        return;
      }
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateRadiansToDegrees(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateRadiansToDegrees(input);
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
          <p className="text-xs font-normal text-muted-foreground">π rad = 180°</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <RadiansToDegreesForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            const nextResult = initialResult();
            setDraft(syncDraftFromResult(defaultDraft(), nextResult));
            setErrors({});
            setResult(nextResult);
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
          <RadiansToDegreesResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\n${window.location.href}`
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
                  ? `${payload}\n\n${window.location.href}`
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
        </RadiansToDegreesForm>
      </div>
    </section>
  );
}
