'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateSquareMetersToSquareFeet,
  convertArea,
  formatArea,
  shareResultText,
  squareMetersToSquareFeet,
} from './calculation';
import {
  SquareMetersToSquareFeetForm,
  draftToInput,
  emptyDraft,
  type SquareMetersToSquareFeetDraft,
} from './SquareMetersToSquareFeetForm';
import { SquareMetersToSquareFeetResults } from './SquareMetersToSquareFeetResults';
import type {
  SquareMetersToSquareFeetFieldErrors,
  SquareMetersToSquareFeetResult,
} from './types';
import {
  isIncompleteNumber,
  parseOptionalNumber,
  validateSquareMetersToSquareFeet,
} from './validation';

function syncDraftFromResult(
  draft: SquareMetersToSquareFeetDraft,
  result: SquareMetersToSquareFeetResult,
): SquareMetersToSquareFeetDraft {
  return {
    ...draft,
    squareMeters:
      draft.source === 'squareMeters' ? draft.squareMeters : formatArea(result.squareMeters),
    squareFeet:
      draft.source === 'squareFeet' ? draft.squareFeet : formatArea(result.squareFeet),
    other: draft.source === 'other' ? draft.other : formatArea(result.otherValue),
    otherUnit: result.otherUnit,
  };
}

function clearNonSource(
  draft: SquareMetersToSquareFeetDraft,
): SquareMetersToSquareFeetDraft {
  if (draft.source === 'squareMeters') {
    return { ...draft, squareFeet: '', other: '' };
  }
  if (draft.source === 'squareFeet') {
    return { ...draft, squareMeters: '', other: '' };
  }
  return { ...draft, squareMeters: '', squareFeet: '' };
}

/** Unit change: keep square meters, recalculate ft² + other. */
function applyOtherUnitChange(
  previous: SquareMetersToSquareFeetDraft,
  next: SquareMetersToSquareFeetDraft,
): SquareMetersToSquareFeetDraft {
  const m2Raw = previous.squareMeters.trim();
  const m2Parsed = parseOptionalNumber(previous.squareMeters);

  if (m2Raw === '' || isIncompleteNumber(m2Raw.replace(/,/g, '')) || m2Parsed === null) {
    return { ...next, source: 'squareMeters', other: '', squareFeet: previous.squareFeet };
  }
  if (!Number.isFinite(m2Parsed) || m2Parsed < 0) {
    return { ...next, source: 'squareMeters', squareMeters: previous.squareMeters };
  }

  try {
    const squareFeet = squareMetersToSquareFeet(m2Parsed);
    const other = convertArea(m2Parsed, 'm2', next.otherUnit);
    return {
      ...next,
      source: 'squareMeters',
      squareMeters: previous.squareMeters,
      squareFeet: formatArea(squareFeet),
      other: formatArea(other),
    };
  } catch {
    return { ...next, source: 'squareMeters', squareMeters: previous.squareMeters };
  }
}

export function SquareMetersToSquareFeetConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SquareMetersToSquareFeetDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<SquareMetersToSquareFeetFieldErrors>({});
  const [result, setResult] = React.useState<SquareMetersToSquareFeetResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: SquareMetersToSquareFeetDraft) => {
    const sourceRaw =
      next.source === 'squareMeters'
        ? next.squareMeters
        : next.source === 'squareFeet'
          ? next.squareFeet
          : next.other;

    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateSquareMetersToSquareFeet(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateSquareMetersToSquareFeet(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const onDraftChange = (next: SquareMetersToSquareFeetDraft) => {
    if (next.otherOpen !== draft.otherOpen && next.otherUnit === draft.otherUnit) {
      const onlyToggle =
        next.squareMeters === draft.squareMeters &&
        next.squareFeet === draft.squareFeet &&
        next.other === draft.other &&
        next.source === draft.source;
      if (onlyToggle) {
        setDraft(next);
        return;
      }
    }

    if (next.otherUnit !== draft.otherUnit) {
      const withUnit = applyOtherUnitChange(draft, next);
      const m2Ok =
        withUnit.squareMeters.trim() !== '' &&
        !isIncompleteNumber(withUnit.squareMeters.trim().replace(/,/g, '')) &&
        parseOptionalNumber(withUnit.squareMeters) != null &&
        Number.isFinite(parseOptionalNumber(withUnit.squareMeters)!) &&
        parseOptionalNumber(withUnit.squareMeters)! >= 0;

      if (m2Ok) {
        const input = draftToInput({ ...withUnit, source: 'squareMeters' });
        const validation = validateSquareMetersToSquareFeet(input);
        setErrors(validation.errors);
        if (validation.isValid) {
          const nextResult = calculateSquareMetersToSquareFeet(input);
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
            Square meters ↔ square feet (1 m² ≈ 10.7639 ft²)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SquareMetersToSquareFeetForm
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
          <SquareMetersToSquareFeetResults
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
        </SquareMetersToSquareFeetForm>
      </div>
    </section>
  );
}
