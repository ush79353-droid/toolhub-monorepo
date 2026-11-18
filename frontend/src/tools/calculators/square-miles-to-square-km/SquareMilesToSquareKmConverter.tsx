'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateSquareMilesToSquareKm,
  convertArea,
  formatArea,
  shareResultText,
  squareMilesToSquareKilometers,
} from './calculation';
import {
  SquareMilesToSquareKmForm,
  draftToInput,
  emptyDraft,
  type SquareMilesToSquareKmDraft,
} from './SquareMilesToSquareKmForm';
import { SquareMilesToSquareKmResults } from './SquareMilesToSquareKmResults';
import type {
  SquareMilesToSquareKmFieldErrors,
  SquareMilesToSquareKmResult,
} from './types';
import {
  isIncompleteNumber,
  parseOptionalNumber,
  validateSquareMilesToSquareKm,
} from './validation';

function syncDraftFromResult(
  draft: SquareMilesToSquareKmDraft,
  result: SquareMilesToSquareKmResult,
): SquareMilesToSquareKmDraft {
  return {
    ...draft,
    squareMiles:
      draft.source === 'squareMiles' ? draft.squareMiles : formatArea(result.squareMiles),
    squareKilometers:
      draft.source === 'squareKilometers'
        ? draft.squareKilometers
        : formatArea(result.squareKilometers),
    other: draft.source === 'other' ? draft.other : formatArea(result.otherValue),
    otherUnit: result.otherUnit,
  };
}

function clearNonSource(draft: SquareMilesToSquareKmDraft): SquareMilesToSquareKmDraft {
  if (draft.source === 'squareMiles') {
    return { ...draft, squareKilometers: '', other: '' };
  }
  if (draft.source === 'squareKilometers') {
    return { ...draft, squareMiles: '', other: '' };
  }
  return { ...draft, squareMiles: '', squareKilometers: '' };
}

/** Unit change: keep square miles, recalculate km² + other. */
function applyOtherUnitChange(
  previous: SquareMilesToSquareKmDraft,
  next: SquareMilesToSquareKmDraft,
): SquareMilesToSquareKmDraft {
  const mi2Raw = previous.squareMiles.trim();
  const mi2Parsed = parseOptionalNumber(previous.squareMiles);

  if (mi2Raw === '' || isIncompleteNumber(mi2Raw.replace(/,/g, '')) || mi2Parsed === null) {
    return {
      ...next,
      source: 'squareMiles',
      other: '',
      squareKilometers: previous.squareKilometers,
    };
  }
  if (!Number.isFinite(mi2Parsed) || mi2Parsed < 0) {
    return { ...next, source: 'squareMiles', squareMiles: previous.squareMiles };
  }

  try {
    const squareKilometers = squareMilesToSquareKilometers(mi2Parsed);
    const other = convertArea(mi2Parsed, 'mi2', next.otherUnit);
    return {
      ...next,
      source: 'squareMiles',
      squareMiles: previous.squareMiles,
      squareKilometers: formatArea(squareKilometers),
      other: formatArea(other),
    };
  } catch {
    return { ...next, source: 'squareMiles', squareMiles: previous.squareMiles };
  }
}

export function SquareMilesToSquareKmConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SquareMilesToSquareKmDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<SquareMilesToSquareKmFieldErrors>({});
  const [result, setResult] = React.useState<SquareMilesToSquareKmResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: SquareMilesToSquareKmDraft) => {
    const sourceRaw =
      next.source === 'squareMiles'
        ? next.squareMiles
        : next.source === 'squareKilometers'
          ? next.squareKilometers
          : next.other;

    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateSquareMilesToSquareKm(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateSquareMilesToSquareKm(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const onDraftChange = (next: SquareMilesToSquareKmDraft) => {
    if (next.otherOpen !== draft.otherOpen && next.otherUnit === draft.otherUnit) {
      const onlyToggle =
        next.squareMiles === draft.squareMiles &&
        next.squareKilometers === draft.squareKilometers &&
        next.other === draft.other &&
        next.source === draft.source;
      if (onlyToggle) {
        setDraft(next);
        return;
      }
    }

    if (next.otherUnit !== draft.otherUnit) {
      const withUnit = applyOtherUnitChange(draft, next);
      const mi2Ok =
        withUnit.squareMiles.trim() !== '' &&
        !isIncompleteNumber(withUnit.squareMiles.trim().replace(/,/g, '')) &&
        parseOptionalNumber(withUnit.squareMiles) != null &&
        Number.isFinite(parseOptionalNumber(withUnit.squareMiles)!) &&
        parseOptionalNumber(withUnit.squareMiles)! >= 0;

      if (mi2Ok) {
        const input = draftToInput({ ...withUnit, source: 'squareMiles' });
        const validation = validateSquareMilesToSquareKm(input);
        setErrors(validation.errors);
        if (validation.isValid) {
          const nextResult = calculateSquareMilesToSquareKm(input);
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
            Square miles ↔ square kilometers (1 mi² = 2.589988110336 km²)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SquareMilesToSquareKmForm
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
          <SquareMilesToSquareKmResults
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
        </SquareMilesToSquareKmForm>
      </div>
    </section>
  );
}
