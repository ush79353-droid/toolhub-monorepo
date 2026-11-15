'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  convertFromLocal,
  convertFromZulu,
  formatLongDate,
  formatZuluLabel,
  shareResultText,
} from './calculation';
import { COUNTRY_BY_ID, countryForIana } from './countries';
import { ZuluTimeForm, defaultDraft, emptyDraft, type ZuluTimeDraft } from './ZuluTimeForm';
import { ZuluTimeResults } from './ZuluTimeResults';
import type { ZuluConversion, ZuluTimeFieldErrors } from './types';
import { parseDateField, parseTimeField } from './validation';

function payloadFrom(draft: ZuluTimeDraft, conversion: ZuluConversion): string {
  const country = COUNTRY_BY_ID[draft.countryId]?.name;
  return shareResultText({
    dateLabel: formatLongDate(conversion.zuluDate),
    country,
    iana: conversion.iana,
    zulu: `${conversion.zuluTime} UTC (${formatZuluLabel(conversion.zuluTime)})`,
    local: `${conversion.localTime} ${conversion.abbreviation}`,
    offset: conversion.offsetLabel,
    dst: conversion.dstActive ? 'Active' : 'Inactive',
  });
}

export function ZuluTimeConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ZuluTimeDraft>(() => defaultDraft());
  const [conversion, setConversion] = React.useState<ZuluConversion | null>(null);
  const [errors, setErrors] = React.useState<ZuluTimeFieldErrors>({});
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  const evaluate = React.useCallback((next: ZuluTimeDraft) => {
    const dateParsed = parseDateField(next.date);
    const zuluParsed = parseTimeField(next.zuluTime);
    const localParsed = parseTimeField(next.localTime);

    if (dateParsed.blank && zuluParsed.blank && localParsed.blank) {
      setDraft(next);
      setErrors({});
      setConversion(null);
      return;
    }
    if (dateParsed.incomplete || (next.source === 'zulu' ? zuluParsed.incomplete : localParsed.incomplete)) {
      setDraft(next);
      setErrors({});
      return;
    }

    const nextErrors: ZuluTimeFieldErrors = {};
    if (dateParsed.error) nextErrors.date = dateParsed.error;
    if (next.source === 'zulu' && zuluParsed.error) nextErrors.zulu = zuluParsed.error;
    if (next.source === 'local' && localParsed.error) nextErrors.local = localParsed.error;
    if (!next.iana) nextErrors.zone = 'Select a time zone.';

    if (dateParsed.blank) {
      nextErrors.date = 'Choose a conversion date.';
    }

    if (Object.keys(nextErrors).length > 0 || !dateParsed.date) {
      setDraft(next);
      setErrors(nextErrors);
      setConversion(null);
      return;
    }

    const result =
      next.source === 'local'
        ? convertFromLocal(dateParsed.date, localParsed.time24 ?? next.localTime, next.iana, next.disambiguation)
        : convertFromZulu(dateParsed.date, zuluParsed.time24 ?? next.zuluTime, next.iana);

    if (result.status === 'invalid') {
      setDraft(next);
      setErrors({ zone: 'This time zone is not available in this browser.' });
      setConversion(null);
      return;
    }

    if (result.status === 'nonexistent') {
      setDraft(next);
      setErrors({
        local: 'This local time does not exist (DST spring-forward). Choose a valid clock time.',
      });
      setConversion(result);
      return;
    }

    const country = countryForIana(next.iana);
    setDraft({
      ...next,
      countryId: country?.id ?? next.countryId,
      zuluTime: result.zuluTime.slice(0, 5),
      localTime: result.localTime.slice(0, 5),
      date: next.source === 'local' ? result.localDate : result.zuluDate,
    });
    setErrors({});
    setConversion(result);
  }, []);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
    evaluate(defaultDraft(new Date()));
  }, [evaluate]);

  const clearAll = (reload: boolean) => {
    if (reload) {
      evaluate(defaultDraft(new Date()));
    } else {
      setDraft(emptyDraft(draft));
      setConversion(null);
      setErrors({});
    }
    setCopied(false);
    setShared(false);
  };

  const shareBody = conversion ? payloadFrom(draft, conversion) : '';

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
          <p className="text-xs font-normal text-muted-foreground">Zulu = UTC · IANA offsets and DST</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ZuluTimeForm
          draft={draft}
          errors={errors}
          dstActive={conversion?.dstActive ?? false}
          ambiguous={conversion?.status === 'ambiguous'}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <ZuluTimeResults
            conversion={conversion}
            hourCycle={draft.hourCycle}
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(conversion)}
            onCopy={() => {
              if (!shareBody) return;
              const text =
                typeof window !== 'undefined' ? `${shareBody}\n\nExplore: ${window.location.href}` : shareBody;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!shareBody) return;
              const text =
                typeof window !== 'undefined' ? `${shareBody}\n\nExplore: ${window.location.href}` : shareBody;
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
        </ZuluTimeForm>
      </div>
    </section>
  );
}
