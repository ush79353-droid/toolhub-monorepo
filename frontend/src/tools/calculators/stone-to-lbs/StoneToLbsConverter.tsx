'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateStoneToLbs,
  convertMass,
  formatMass,
  shareResultText,
  stoneToLbs,
} from './calculation';
import {
  StoneToLbsForm,
  draftToInput,
  emptyDraft,
  type StoneToLbsDraft,
} from './StoneToLbsForm';
import { StoneToLbsResults } from './StoneToLbsResults';
import type { StoneToLbsFieldErrors, StoneToLbsResult } from './types';
import {
  isIncompleteNumber,
  parseOptionalNumber,
  validateStoneToLbs,
} from './validation';

function syncDraftFromResult(
  draft: StoneToLbsDraft,
  result: StoneToLbsResult,
): StoneToLbsDraft {
  return {
    ...draft,
    st: draft.source === 'st' ? draft.st : formatMass(result.st),
    lb: draft.source === 'lb' ? draft.lb : formatMass(result.lb),
    other: draft.source === 'other' ? draft.other : formatMass(result.otherValue),
    otherUnit: result.otherUnit,
  };
}

function clearNonSource(draft: StoneToLbsDraft): StoneToLbsDraft {
  if (draft.source === 'st') return { ...draft, lb: '', other: '' };
  if (draft.source === 'lb') return { ...draft, st: '', other: '' };
  return { ...draft, st: '', lb: '' };
}

/** Unit change: keep stones, recalculate lb + other. */
function applyOtherUnitChange(
  previous: StoneToLbsDraft,
  next: StoneToLbsDraft,
): StoneToLbsDraft {
  const stRaw = previous.st.trim();
  const stParsed = parseOptionalNumber(previous.st);

  if (stRaw === '' || isIncompleteNumber(stRaw.replace(/,/g, '')) || stParsed === null) {
    return { ...next, source: 'st', other: '', lb: previous.lb };
  }
  if (!Number.isFinite(stParsed) || stParsed < 0) {
    return { ...next, source: 'st', st: previous.st };
  }

  try {
    const lb = stoneToLbs(stParsed);
    const other = convertMass(stParsed, 'st', next.otherUnit);
    return {
      ...next,
      source: 'st',
      st: previous.st,
      lb: formatMass(lb),
      other: formatMass(other),
    };
  } catch {
    return { ...next, source: 'st', st: previous.st };
  }
}

export function StoneToLbsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<StoneToLbsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<StoneToLbsFieldErrors>({});
  const [result, setResult] = React.useState<StoneToLbsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: StoneToLbsDraft) => {
    const sourceRaw =
      next.source === 'st' ? next.st : next.source === 'lb' ? next.lb : next.other;

    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateStoneToLbs(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateStoneToLbs(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const onDraftChange = (next: StoneToLbsDraft) => {
    if (next.otherUnit !== draft.otherUnit) {
      const withUnit = applyOtherUnitChange(draft, next);
      const stOk =
        withUnit.st.trim() !== '' &&
        !isIncompleteNumber(withUnit.st.trim().replace(/,/g, '')) &&
        parseOptionalNumber(withUnit.st) != null &&
        Number.isFinite(parseOptionalNumber(withUnit.st)!) &&
        parseOptionalNumber(withUnit.st)! >= 0;

      if (stOk) {
        const input = draftToInput({ ...withUnit, source: 'st' });
        const validation = validateStoneToLbs(input);
        setErrors(validation.errors);
        if (validation.isValid) {
          const nextResult = calculateStoneToLbs(input);
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
            Stones ↔ pounds (1 st = 14 lb) + other units
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <StoneToLbsForm
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
          <StoneToLbsResults
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
        </StoneToLbsForm>
      </div>
    </section>
  );
}
