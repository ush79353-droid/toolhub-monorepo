'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateMonthsToYears,
  formatDuration,
  MONTHS_PER_YEAR,
  shareResultText,
} from './calculation';
import {
  MonthsToYearsForm,
  draftToInput,
  emptyDraft,
  type MonthsToYearsDraft,
} from './MonthsToYearsForm';
import { MonthsToYearsResults } from './MonthsToYearsResults';
import type { MonthsToYearsFieldErrors, MonthsToYearsResult } from './types';
import { isIncompleteNumber, validateMonthsToYears } from './validation';

function syncDraftFromResult(
  draft: MonthsToYearsDraft,
  result: MonthsToYearsResult,
): MonthsToYearsDraft {
  if (draft.source === 'months') {
    return {
      ...draft,
      years: formatDuration(result.years),
      yearsPart: formatDuration(result.yearsPart),
      monthsPart: formatDuration(result.monthsPart),
    };
  }
  if (draft.source === 'years') {
    return {
      ...draft,
      months: formatDuration(result.months),
      yearsPart: formatDuration(result.yearsPart),
      monthsPart: formatDuration(result.monthsPart),
    };
  }
  return {
    ...draft,
    months: formatDuration(result.months),
    years: formatDuration(result.years),
    yearsPart: formatDuration(result.yearsPart),
    monthsPart: formatDuration(result.monthsPart),
  };
}

function clearNonSource(draft: MonthsToYearsDraft): MonthsToYearsDraft {
  if (draft.source === 'months') {
    return { ...draft, years: '', yearsPart: '', monthsPart: '' };
  }
  if (draft.source === 'years') {
    return { ...draft, months: '', yearsPart: '', monthsPart: '' };
  }
  return { ...draft, months: '', years: '' };
}

function sourceIncomplete(draft: MonthsToYearsDraft): boolean {
  if (draft.source === 'yearsMonths') {
    const yr = draft.yearsPart.trim().replace(/,/g, '');
    const mo = draft.monthsPart.trim().replace(/,/g, '');
    if (yr === '' && mo === '') return true;
    if (yr !== '' && isIncompleteNumber(yr)) return true;
    if (mo !== '' && isIncompleteNumber(mo)) return true;
    return false;
  }
  const raw = (draft.source === 'months' ? draft.months : draft.years).trim().replace(/,/g, '');
  return raw === '' || isIncompleteNumber(raw);
}

export function MonthsToYearsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MonthsToYearsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<MonthsToYearsFieldErrors>({});
  const [result, setResult] = React.useState<MonthsToYearsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MonthsToYearsDraft) => {
    if (sourceIncomplete(next)) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateMonthsToYears(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateMonthsToYears(input);
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
            1 yr = {MONTHS_PER_YEAR} mo exactly
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MonthsToYearsForm
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
          <MonthsToYearsResults
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
        </MonthsToYearsForm>
      </div>
    </section>
  );
}
