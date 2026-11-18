'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateSquareFeetConverter,
  convertArea,
  formatArea,
  shareResultText,
} from './calculation';
import {
  SquareFeetConverterForm,
  draftToInput,
  emptyDraft,
  type SquareFeetConverterDraft,
} from './SquareFeetConverterForm';
import { SquareFeetConverterResults } from './SquareFeetConverterResults';
import type { SquareFeetConverterFieldErrors, SquareFeetConverterResult } from './types';
import { isIncompleteNumber, parseOptionalNumber, validateSquareFeetConverter } from './validation';

function syncDraftFromResult(
  draft: SquareFeetConverterDraft,
  result: SquareFeetConverterResult,
): SquareFeetConverterDraft {
  return {
    ...draft,
    squareFeet:
      draft.source === 'squareFeet' ? draft.squareFeet : formatArea(result.squareFeet),
    conversion:
      draft.source === 'conversion' ? draft.conversion : formatArea(result.converted),
    targetUnit: result.targetUnit,
  };
}

function clearNonSource(draft: SquareFeetConverterDraft): SquareFeetConverterDraft {
  if (draft.source === 'squareFeet') {
    return { ...draft, conversion: '' };
  }
  return { ...draft, squareFeet: '' };
}

/** Unit change: keep square feet, recalculate conversion. */
function applyUnitChange(
  previous: SquareFeetConverterDraft,
  next: SquareFeetConverterDraft,
): SquareFeetConverterDraft {
  const ftRaw = previous.squareFeet.trim();
  const ftParsed = parseOptionalNumber(previous.squareFeet);

  if (ftRaw === '' || isIncompleteNumber(ftRaw.replace(/,/g, '')) || ftParsed === null) {
    return { ...next, source: 'squareFeet', conversion: '' };
  }
  if (!Number.isFinite(ftParsed) || ftParsed < 0) {
    return { ...next, source: 'squareFeet' };
  }

  try {
    const converted = convertArea(ftParsed, 'ft2', next.targetUnit);
    return {
      ...next,
      source: 'squareFeet',
      squareFeet: previous.squareFeet,
      conversion: formatArea(converted),
    };
  } catch {
    return { ...next, source: 'squareFeet', squareFeet: previous.squareFeet };
  }
}

export function SquareFeetConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SquareFeetConverterDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<SquareFeetConverterFieldErrors>({});
  const [result, setResult] = React.useState<SquareFeetConverterResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: SquareFeetConverterDraft) => {
    const sourceRaw = next.source === 'squareFeet' ? next.squareFeet : next.conversion;

    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateSquareFeetConverter(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateSquareFeetConverter(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const onDraftChange = (next: SquareFeetConverterDraft) => {
    if (next.targetUnit !== draft.targetUnit) {
      const withUnit = applyUnitChange(draft, next);
      const ftOk =
        withUnit.squareFeet.trim() !== '' &&
        !isIncompleteNumber(withUnit.squareFeet.trim().replace(/,/g, '')) &&
        parseOptionalNumber(withUnit.squareFeet) != null &&
        Number.isFinite(parseOptionalNumber(withUnit.squareFeet)!) &&
        parseOptionalNumber(withUnit.squareFeet)! >= 0;

      if (ftOk) {
        const input = draftToInput({ ...withUnit, source: 'squareFeet' });
        const validation = validateSquareFeetConverter(input);
        setErrors(validation.errors);
        if (validation.isValid) {
          const nextResult = calculateSquareFeetConverter(input);
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
            Square feet ↔ other area units (1 ft² = 0.09290304 m²)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SquareFeetConverterForm
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
          <SquareFeetConverterResults
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
        </SquareFeetConverterForm>
      </div>
    </section>
  );
}
