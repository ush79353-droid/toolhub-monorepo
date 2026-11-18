'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { allFromPascals, formatPressure, shareResultText } from './calculation';
import { PsiConverterForm, emptyDraft, type PsiDraft } from './PsiConverterForm';
import { PsiConverterResults } from './PsiConverterResults';
import {
  DEFAULT_PASCALS,
  PSI_UNITS,
  UNIT_SYMBOLS,
  type PsiFieldErrors,
  type PsiUnit,
} from './types';
import { parsePressureInput, pascalsFromField } from './validation';

function draftFromPascals(
  pascals: number,
  preserve: { field: PsiUnit; text: string } | null,
  otherOpen: boolean,
  moreOpen: boolean,
): PsiDraft {
  const values = allFromPascals(pascals);
  const texts = emptyDraft().texts;
  for (const unit of PSI_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatPressure(values[unit]);
  }
  return { texts, activeField: preserve?.field ?? null, otherOpen, moreOpen };
}

function initialDraft(): PsiDraft {
  return draftFromPascals(DEFAULT_PASCALS, null, true, false);
}

export function PsiConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PsiDraft>(initialDraft);
  const [errors, setErrors] = React.useState<PsiFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const pascalsRef = React.useRef<number | null>(DEFAULT_PASCALS);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PsiDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parsePressureInput(source);

    if (parsed.blank) {
      pascalsRef.current = null;
      setDraft({
        ...emptyDraft(),
        otherOpen: next.otherOpen,
        moreOpen: next.moreOpen,
        activeField: field,
      });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.incomplete) {
      setDraft(next);
      setErrors({});
      return;
    }
    if (parsed.value == null) {
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Enter a valid finite number.' });
      setHasResult(false);
      pascalsRef.current = null;
      return;
    }

    const converted = pascalsFromField(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      pascalsRef.current = null;
      return;
    }

    pascalsRef.current = converted.pascals;
    setDraft(
      draftFromPascals(converted.pascals, { field, text: source }, next.otherOpen, next.moreOpen),
    );
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    pascalsRef.current = null;
    setDraft({ ...emptyDraft(), otherOpen: draft.otherOpen, moreOpen: draft.moreOpen });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    pascalsRef.current = DEFAULT_PASCALS;
    setDraft(initialDraft());
    setHasResult(true);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const pascals = pascalsRef.current;
  const values = pascals != null && hasResult ? allFromPascals(pascals) : null;
  const summaryLines = values
    ? (['psi', 'bar', 'atm', 'Pa', 'kPa'] as const).map(
        (unit) => `${formatPressure(values[unit])} ${UNIT_SYMBOLS[unit]}`,
      )
    : null;
  const payload = pascals != null && hasResult ? shareResultText(pascals) : '';

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
            1 psi ≈ {formatPressure(DEFAULT_PASCALS)} Pa
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PsiConverterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <PsiConverterResults
            summaryLines={summaryLines}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(summaryLines)}
            onCopy={() => {
              if (!payload) return;
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
              if (!payload) return;
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
        </PsiConverterForm>
      </div>
    </section>
  );
}
