'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { allFromKmPerLiter, formatFuel, shareResultText } from './calculation';
import { emptyDraft, MpgToL100Form, type MpgToL100Draft } from './MpgToL100Form';
import { MpgToL100Results } from './MpgToL100Results';
import {
  FUEL_UNITS,
  FUEL_UNIT_SYMBOLS,
  type FuelEconomyUnit,
  type FuelFieldErrors,
} from './types';
import { kmPerLiterFromUnit, parseFuelInput } from './validation';

function draftFromKmPerLiter(
  kmPerLiter: number,
  preserve: { field: FuelEconomyUnit; text: string } | null,
): MpgToL100Draft {
  const amounts = allFromKmPerLiter(kmPerLiter);
  const texts = {} as Record<FuelEconomyUnit, string>;
  for (const unit of FUEL_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatFuel(amounts[unit]);
  }
  return { texts, activeField: preserve?.field ?? null };
}

export function MpgToL100Converter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MpgToL100Draft>(emptyDraft);
  const [errors, setErrors] = React.useState<FuelFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const kmPerLiterRef = React.useRef<number | null>(null);
  const sourceRef = React.useRef<FuelEconomyUnit>('usMpg');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MpgToL100Draft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseFuelInput(source);
    if (parsed.blank) {
      kmPerLiterRef.current = null;
      setDraft(emptyDraft());
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
      setErrors({
        [field]:
          parsed.error ??
          'Fuel economy must be greater than zero for a finite conversion result.',
      });
      setHasResult(false);
      kmPerLiterRef.current = null;
      return;
    }

    const converted = kmPerLiterFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      kmPerLiterRef.current = null;
      return;
    }

    kmPerLiterRef.current = converted.kmPerLiter;
    sourceRef.current = field;
    setDraft(draftFromKmPerLiter(converted.kmPerLiter, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = () => {
    kmPerLiterRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const kmPerLiter = kmPerLiterRef.current;
  const summaryLines =
    hasResult && kmPerLiter != null
      ? FUEL_UNITS.map((unit) => {
          const amounts = allFromKmPerLiter(kmPerLiter);
          return `${formatFuel(amounts[unit])} ${FUEL_UNIT_SYMBOLS[unit]}`;
        })
      : null;
  const payload =
    hasResult && kmPerLiter != null
      ? shareResultText(kmPerLiter, sourceRef.current)
      : '';

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
            US mpg · UK mpg · L/100 km · km/L
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MpgToL100Form
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'usMpg' });
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <MpgToL100Results
            summaryLines={summaryLines}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
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
        </MpgToL100Form>
      </div>
    </section>
  );
}
