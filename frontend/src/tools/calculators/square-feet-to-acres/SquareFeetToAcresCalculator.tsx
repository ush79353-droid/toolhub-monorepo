'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateSquareFeetToAcres,
  convertArea,
  formatArea,
  shareResultText,
  squareFeetToAcres,
} from './calculation';
import {
  SquareFeetToAcresForm,
  draftToInput,
  emptyDraft,
  type SquareFeetToAcresDraft,
} from './SquareFeetToAcresForm';
import { SquareFeetToAcresResults } from './SquareFeetToAcresResults';
import type { SquareFeetToAcresFieldErrors, SquareFeetToAcresResult } from './types';
import { isIncompleteNumber, parseOptionalNumber, validateSquareFeetToAcres } from './validation';

function syncDraftFromResult(
  draft: SquareFeetToAcresDraft,
  result: SquareFeetToAcresResult,
): SquareFeetToAcresDraft {
  return {
    ...draft,
    squareFeet:
      draft.source === 'squareFeet' ? draft.squareFeet : formatArea(result.squareFeet),
    acres: draft.source === 'acres' ? draft.acres : formatArea(result.acres),
    other: draft.source === 'other' ? draft.other : formatArea(result.otherValue),
    otherUnit: result.otherUnit,
  };
}

function clearNonSource(draft: SquareFeetToAcresDraft): SquareFeetToAcresDraft {
  if (draft.source === 'squareFeet') {
    return { ...draft, acres: '', other: '' };
  }
  if (draft.source === 'acres') {
    return { ...draft, squareFeet: '', other: '' };
  }
  return { ...draft, squareFeet: '', acres: '' };
}

/** Unit change: keep square feet, recalculate acres + other. */
function applyOtherUnitChange(
  previous: SquareFeetToAcresDraft,
  next: SquareFeetToAcresDraft,
): SquareFeetToAcresDraft {
  const ftRaw = previous.squareFeet.trim();
  const ftParsed = parseOptionalNumber(previous.squareFeet);

  if (ftRaw === '' || isIncompleteNumber(ftRaw.replace(/,/g, '')) || ftParsed === null) {
    return { ...next, source: 'squareFeet', other: '', acres: previous.acres };
  }
  if (!Number.isFinite(ftParsed) || ftParsed < 0) {
    return { ...next, source: 'squareFeet', squareFeet: previous.squareFeet };
  }

  try {
    const acres = squareFeetToAcres(ftParsed);
    const other = convertArea(ftParsed, 'ft2', next.otherUnit);
    return {
      ...next,
      source: 'squareFeet',
      squareFeet: previous.squareFeet,
      acres: formatArea(acres),
      other: formatArea(other),
    };
  } catch {
    return { ...next, source: 'squareFeet', squareFeet: previous.squareFeet };
  }
}

export function SquareFeetToAcresCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SquareFeetToAcresDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<SquareFeetToAcresFieldErrors>({});
  const [result, setResult] = React.useState<SquareFeetToAcresResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: SquareFeetToAcresDraft) => {
    const sourceRaw =
      next.source === 'squareFeet'
        ? next.squareFeet
        : next.source === 'acres'
          ? next.acres
          : next.other;

    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateSquareFeetToAcres(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateSquareFeetToAcres(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const onDraftChange = (next: SquareFeetToAcresDraft) => {
    if (next.otherOpen !== draft.otherOpen && next.otherUnit === draft.otherUnit) {
      const onlyToggle =
        next.squareFeet === draft.squareFeet &&
        next.acres === draft.acres &&
        next.other === draft.other &&
        next.source === draft.source;
      if (onlyToggle) {
        setDraft(next);
        return;
      }
    }

    if (next.otherUnit !== draft.otherUnit) {
      const withUnit = applyOtherUnitChange(draft, next);
      const ftOk =
        withUnit.squareFeet.trim() !== '' &&
        !isIncompleteNumber(withUnit.squareFeet.trim().replace(/,/g, '')) &&
        parseOptionalNumber(withUnit.squareFeet) != null &&
        Number.isFinite(parseOptionalNumber(withUnit.squareFeet)!) &&
        parseOptionalNumber(withUnit.squareFeet)! >= 0;

      if (ftOk) {
        const input = draftToInput({ ...withUnit, source: 'squareFeet' });
        const validation = validateSquareFeetToAcres(input);
        setErrors(validation.errors);
        if (validation.isValid) {
          const nextResult = calculateSquareFeetToAcres(input);
          setResult(nextResult);
          setDraft(syncDraftFromResult(withUnit, nextResult));
          return;
        }
      }
      setErrors({});
      setResult(null);
      setDraft(withUnit);
      return;
    }

    evaluate(next);
  };

  const clearFields = () => {
    setDraft(emptyDraft());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
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
            Square feet ↔ acres (1 acre = 43,560 ft²)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SquareFeetToAcresForm
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={clearFields}
          onReset={clearFields}
        >
          <SquareFeetToAcresResults
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
        </SquareFeetToAcresForm>
      </div>
    </section>
  );
}
