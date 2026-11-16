'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  allFromGray,
  allFromSievert,
  formatDose,
  shareResultText,
} from './calculation';
import { emptyDraft, RadiationForm, type RadiationDraft } from './RadiationForm';
import { RadiationResults } from './RadiationResults';
import {
  ABSORBED_UNITS,
  EQUIVALENT_UNITS,
  RADIATION_UNIT_SYMBOLS,
  isAbsorbedUnit,
  type AbsorbedUnit,
  type EquivalentUnit,
  type RadiationFieldErrors,
  type RadiationUnit,
} from './types';
import { grayFromUnit, parseDoseInput, sievertFromUnit } from './validation';

type OpenState = Pick<RadiationDraft, 'absorbedOpen' | 'equivalentOpen'>;

function emptyAbsorbedTexts(): Record<AbsorbedUnit, string> {
  return { milliGray: '', gray: '', rad: '' };
}

function emptyEquivalentTexts(): Record<EquivalentUnit, string> {
  return { microSievert: '', milliSievert: '', rem: '' };
}

export function RadiationConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<RadiationDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<RadiationFieldErrors>({});
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const grayRef = React.useRef<number | null>(null);
  const sievertRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: RadiationDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const open: OpenState = {
      absorbedOpen: next.absorbedOpen,
      equivalentOpen: next.equivalentOpen,
    };
    const source = next.texts[field];
    const parsed = parseDoseInput(source);

    if (isAbsorbedUnit(field)) {
      if (parsed.blank) {
        grayRef.current = null;
        setDraft({
          ...next,
          texts: { ...next.texts, ...emptyAbsorbedTexts() },
          activeField: field,
          ...open,
        });
        setErrors({});
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
        grayRef.current = null;
        return;
      }
      const converted = grayFromUnit(parsed.value, field);
      if (!converted.ok) {
        setDraft(next);
        setErrors({ [field]: converted.error });
        grayRef.current = null;
        return;
      }
      grayRef.current = converted.gray;
      const amounts = allFromGray(converted.gray);
      const texts = { ...next.texts } as Record<RadiationUnit, string>;
      for (const unit of ABSORBED_UNITS) {
        texts[unit] = unit === field ? source : formatDose(amounts[unit]);
      }
      setDraft({ texts, activeField: field, ...open });
      setErrors({});
      return;
    }

    // Equivalent dose family
    if (parsed.blank) {
      sievertRef.current = null;
      setDraft({
        ...next,
        texts: { ...next.texts, ...emptyEquivalentTexts() },
        activeField: field,
        ...open,
      });
      setErrors({});
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
      sievertRef.current = null;
      return;
    }
    const converted = sievertFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      sievertRef.current = null;
      return;
    }
    sievertRef.current = converted.sievert;
    const amounts = allFromSievert(converted.sievert);
    const texts = { ...next.texts } as Record<RadiationUnit, string>;
    for (const unit of EQUIVALENT_UNITS) {
      texts[unit] = unit === field ? source : formatDose(amounts[unit]);
    }
    setDraft({ texts, activeField: field, ...open });
    setErrors({});
  };

  const clearFields = () => {
    grayRef.current = null;
    sievertRef.current = null;
    setDraft({
      ...emptyDraft(),
      absorbedOpen: draft.absorbedOpen,
      equivalentOpen: draft.equivalentOpen,
    });
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    grayRef.current = null;
    sievertRef.current = null;
    setDraft(emptyDraft());
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const gray = grayRef.current;
  const sievert = sievertRef.current;
  const absorbedLines =
    gray != null
      ? ABSORBED_UNITS.map((unit) => {
          const a = allFromGray(gray);
          return `${formatDose(a[unit])} ${RADIATION_UNIT_SYMBOLS[unit]}`;
        })
      : null;
  const equivalentLines =
    sievert != null
      ? EQUIVALENT_UNITS.map((unit) => {
          const e = allFromSievert(sievert);
          return `${formatDose(e[unit])} ${RADIATION_UNIT_SYMBOLS[unit]}`;
        })
      : null;
  const payload =
    gray != null || sievert != null ? shareResultText({ gray, sievert }) : '';

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
            Gy · rad · Sv · rem (independent categories)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <RadiationForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'milliGray' });
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <RadiationResults
            absorbedLines={absorbedLines}
            equivalentLines={equivalentLines}
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(payload)}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
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
                  ? `${payload}\n\nExplore: ${window.location.href}`
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
        </RadiationForm>
      </div>
    </section>
  );
}
