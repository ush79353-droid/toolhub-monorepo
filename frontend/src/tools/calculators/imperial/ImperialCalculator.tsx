'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateImperial, formatImperial, shareResultText } from './calculation';
import {
  ImperialForm,
  draftToValue,
  emptyDraft,
  emptyValues,
  type ImperialDraft,
} from './ImperialForm';
import { ImperialResults } from './ImperialResults';
import {
  fieldsForCategory,
  type ImperialCategory,
  type ImperialFieldErrors,
  type ImperialResult,
} from './types';
import { isIncompleteNumber, validateImperial } from './validation';

function syncDraftFromResult(draft: ImperialDraft, result: ImperialResult): ImperialDraft {
  const nextValues: Record<string, string> = { ...draft.values };
  for (const field of fieldsForCategory(result.category)) {
    if (field.key === draft.sourceKey) {
      nextValues[field.key] = draft.values[field.key] ?? '';
    } else {
      nextValues[field.key] = formatImperial(result.values[field.key]!, result.category);
    }
  }
  return { ...draft, values: nextValues };
}

function clearNonSource(draft: ImperialDraft): ImperialDraft {
  const nextValues = emptyValues(draft.category);
  nextValues[draft.sourceKey] = draft.values[draft.sourceKey] ?? '';
  return { ...draft, values: nextValues };
}

function sourceIncomplete(draft: ImperialDraft): boolean {
  const raw = (draft.values[draft.sourceKey] ?? '').trim().replace(/,/g, '');
  return raw === '' || isIncompleteNumber(raw);
}

export interface ImperialPanelProps extends ToolComponentProps {
  /** Share / clipboard brand line. */
  brandName?: string;
  /** Subtitle under Calculator heading. */
  panelSubtitle?: string;
  /** Results card eyebrow. */
  resultHeading?: string;
}

export function ImperialCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
  brandName = 'Imperial Calculator',
  panelSubtitle = 'Imperial / US ↔ metric by category',
  resultHeading = 'Imperial conversion',
}: ImperialPanelProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ImperialDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<ImperialFieldErrors>({});
  const [result, setResult] = React.useState<ImperialResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: ImperialDraft) => {
    if (sourceIncomplete(next)) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const value = draftToValue(next);
    const input = { category: next.category, sourceKey: next.sourceKey, value };
    const validation = validateImperial(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateImperial(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const changeCategory = (category: ImperialCategory) => {
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setDraft(emptyDraft(category));
  };

  const payload = result ? shareResultText(result, brandName) : '';

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
          <p className="text-xs font-normal text-muted-foreground">{panelSubtitle}</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ImperialForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onCategoryChange={changeCategory}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft('length'));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft((prev) => emptyDraft(prev.category));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <ImperialResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            resultHeading={resultHeading}
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
        </ImperialForm>
      </div>
    </section>
  );
}
