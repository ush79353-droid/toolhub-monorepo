'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { DecimalValue } from '../billion-to-trillion/types';
import {
  formatYearsDecades,
  formatYearsDecadesGrouped,
  fromYears,
  shareResultText,
  toYears,
} from './calculation';
import {
  YearsToDecadesForm,
  defaultDraft,
  emptyDraft,
  type YearsToDecadesDraft,
} from './YearsToDecadesForm';
import { YearsToDecadesResults } from './YearsToDecadesResults';
import type { YearsDecadesField, YearsToDecadesFieldErrors } from './types';
import { parseYearsDecadesInput } from './validation';

function draftFromYears(
  years: DecimalValue,
  preserve: { field: YearsDecadesField; text: string } | null,
): YearsToDecadesDraft {
  return {
    years: preserve?.field === 'years' ? preserve.text : formatYearsDecades(fromYears(years, 'years')),
    decades:
      preserve?.field === 'decades' ? preserve.text : formatYearsDecades(fromYears(years, 'decades')),
    activeField: preserve?.field ?? null,
  };
}

function groupedFields(years: DecimalValue | null, draft: YearsToDecadesDraft) {
  if (!years) return { years: draft.years, decades: draft.decades };
  return {
    years: formatYearsDecadesGrouped(fromYears(years, 'years')),
    decades: formatYearsDecadesGrouped(fromYears(years, 'decades')),
  };
}

function summaryText(years: string, decades: string): string {
  const body = shareResultText(years, decades);
  if (typeof window !== 'undefined') {
    return `${body}\n\nExplore: ${window.location.href}`;
  }
  return body;
}

export function YearsToDecadesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<YearsToDecadesDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<YearsToDecadesFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const yearsRef = React.useRef<DecimalValue | null>({ sign: 1, digits: '25', exp: 0 });

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: YearsToDecadesDraft) => {
    const field = next.activeField ?? 'years';
    const source = next[field];
    const parsed = parseYearsDecadesInput(source);

    if (parsed.blank) {
      yearsRef.current = null;
      setDraft({ years: field === 'years' ? source : '', decades: field === 'decades' ? source : '', activeField: field });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.incomplete) {
      setDraft(next);
      setErrors({});
      return;
    }
    if (!parsed.value) {
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Please enter a valid finite number.' });
      setHasResult(false);
      yearsRef.current = null;
      return;
    }

    const years = toYears(parsed.value, field);
    yearsRef.current = years;
    setDraft(draftFromYears(years, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      yearsRef.current = { sign: 1, digits: '25', exp: 0 };
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      yearsRef.current = null;
      setDraft(emptyDraft());
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

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
          <p className="text-xs font-normal text-muted-foreground">Years · decades · 1 decade = 10 years</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <YearsToDecadesForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'years' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <YearsToDecadesResults
            years={hasResult ? groupedFields(yearsRef.current, draft).years : null}
            decades={hasResult ? groupedFields(yearsRef.current, draft).decades : null}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!hasResult) return;
              const shown = groupedFields(yearsRef.current, draft);
              void copyTextToClipboard(summaryText(shown.years, shown.decades)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!hasResult) return;
              const shown = groupedFields(yearsRef.current, draft);
              const payload = summaryText(shown.years, shown.decades);
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text: payload,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(payload).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(payload).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </YearsToDecadesForm>
      </div>
    </section>
  );
}
