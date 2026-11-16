'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  allFromKnotsField,
  formatSpeed,
  shareResultText,
} from './calculation';
import { emptyDraft, KnotsToKphForm, type KnotsToKphDraft } from './KnotsToKphForm';
import { KnotsToKphResults } from './KnotsToKphResults';
import {
  KNOTS_KPH_FIELDS,
  type KnotsKphField,
  type KnotsKphFieldErrors,
} from './types';
import { mpsFromKnotsField, parseSpeedInput } from './validation';

function draftFromSource(
  value: number,
  source: KnotsKphField,
  preserveText: string,
  moreOpen: boolean,
): KnotsToKphDraft {
  const amounts = allFromKnotsField(value, source);
  const texts = {} as Record<KnotsKphField, string>;
  for (const field of KNOTS_KPH_FIELDS) {
    texts[field] = field === source ? preserveText : formatSpeed(amounts[field]);
  }
  return { texts, activeField: source, moreOpen };
}

export function KnotsToKphConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<KnotsToKphDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<KnotsKphFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const amountsRef = React.useRef<Record<KnotsKphField, number> | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: KnotsToKphDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseSpeedInput(source);
    if (parsed.blank) {
      amountsRef.current = null;
      setDraft({ ...emptyDraft(), moreOpen: next.moreOpen, activeField: field });
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
      amountsRef.current = null;
      setHasResult(false);
      return;
    }

    const converted = mpsFromKnotsField(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      amountsRef.current = null;
      setHasResult(false);
      return;
    }

    const amounts = allFromKnotsField(parsed.value, field);
    amountsRef.current = amounts;
    setDraft(draftFromSource(parsed.value, field, source, next.moreOpen));
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    amountsRef.current = null;
    setDraft({ ...emptyDraft(), moreOpen: draft.moreOpen });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    amountsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const amounts = amountsRef.current;
  const summaryLines =
    amounts != null && hasResult
      ? [
          `${formatSpeed(amounts.knot)} kn`,
          `${formatSpeed(amounts.kmh)} km/h`,
          `${formatSpeed(amounts.mph)} mph`,
          `${formatSpeed(amounts.mps)} m/s`,
          `${formatSpeed(amounts.ftPerSec)} ft/s`,
        ]
      : null;
  const payload = amounts != null && hasResult ? shareResultText(amounts) : '';

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
          <p className="text-xs font-normal text-muted-foreground">1 kn = 1.852 km/h</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <KnotsToKphForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'knot' });
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <KnotsToKphResults
            summaryLines={summaryLines}
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
        </KnotsToKphForm>
      </div>
    </section>
  );
}
