'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { DecimalValue } from '../billion-to-trillion/types';
import { formatCapDisplay, fromFarads, toFarads } from './calculation';
import {
  CapacitanceForm,
  defaultDraft,
  emptyDraft,
  type CapacitanceDraft,
} from './CapacitanceForm';
import { CapacitanceResults } from './CapacitanceResults';
import {
  CAPACITANCE_UNIT_BY_ID,
  CAP_FIELDS,
  type CapacitanceFieldErrors,
  type CapacitanceUnit,
} from './types';
import { parseCapacitanceInput } from './validation';

function draftFromFarads(
  farads: DecimalValue,
  preserve: { field: CapacitanceUnit; text: string } | null
): CapacitanceDraft {
  const texts = {} as Record<CapacitanceUnit, string>;
  for (const field of CAP_FIELDS) {
    texts[field] =
      preserve?.field === field
        ? preserve.text
        : formatCapDisplay(fromFarads(farads, field));
  }
  return { texts, activeField: preserve?.field ?? null };
}

function summaryText(values: Record<CapacitanceUnit, string>): string {
  const lines = [
    'Capacitance Converter',
    'Omega Calculators',
    '',
    ...CAP_FIELDS.map(
      (field) => `${CAPACITANCE_UNIT_BY_ID[field].label}: ${values[field]} ${CAPACITANCE_UNIT_BY_ID[field].symbol}`
    ),
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function CapacitanceConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CapacitanceDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<CapacitanceFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const faradsRef = React.useRef<DecimalValue | null>(
    toFarads({ sign: 1, digits: '1', exp: 0 }, 'F')
  );

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: CapacitanceDraft) => {
    const field = next.activeField ?? 'F';
    const sourceText = next.texts[field];
    const parsed = parseCapacitanceInput(sourceText);

    if (parsed.blank) {
      faradsRef.current = null;
      const texts = {} as Record<CapacitanceUnit, string>;
      for (const f of CAP_FIELDS) {
        texts[f] = f === field ? sourceText : '';
      }
      setDraft({ texts, activeField: field });
      setErrors({});
      setHasResult(false);
      return;
    }

    if (!parsed.value) {
      setDraft(next);
      if (parsed.error) {
        setErrors({ [field]: parsed.error });
        setHasResult(false);
        faradsRef.current = null;
      }
      return;
    }

    const farads = toFarads(parsed.value, field);
    faradsRef.current = farads;
    setDraft(draftFromFarads(farads, { field, text: sourceText }));
    setErrors({});
    setHasResult(true);
  }, []);

  const clearAll = (reload: boolean) => {
    if (reload) {
      faradsRef.current = toFarads({ sign: 1, digits: '1', exp: 0 }, 'F');
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      faradsRef.current = null;
      setDraft(emptyDraft());
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const values = hasResult
    ? ({
        F: draft.texts.F,
        mF: draft.texts.mF,
        uF: draft.texts.uF,
        nF: draft.texts.nF,
        pF: draft.texts.pF,
      } as Record<CapacitanceUnit, string>)
    : null;

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
          <p className="text-xs font-normal text-muted-foreground">F · mF · µF · nF · pF</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CapacitanceForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'F' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <CapacitanceResults
            values={values}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!values) return;
              void copyTextToClipboard(summaryText(values)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!values || typeof navigator.share !== 'function') return;
              const payload = summaryText(values);
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
            }}
          />
        </CapacitanceForm>
      </div>
    </section>
  );
}
