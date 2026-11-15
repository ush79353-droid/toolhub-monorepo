'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertPreserveSource } from './calculation';
import {
  defaultDraft,
  emptyDraft,
  KbToMbForm,
  type KbToMbDraft,
} from './KbToMbForm';
import { KbToMbResults } from './KbToMbResults';
import type { FieldUnit, KbToMbFieldErrors, KiloUnit } from './types';
import { parseKbMbInput } from './validation';

function summaryText(values: Record<FieldUnit, string>, kiloUnit: KiloUnit): string {
  const kiloLabel = kiloUnit === 'kB' ? 'kB' : 'KiB';
  const lines = [
    'kB to MB Converter',
    'Omega Calculators',
    '',
    'Input:',
    `${values.kilo} ${kiloLabel}`,
    '',
    'Decimal:',
    `${values.MB} MB`,
    '',
    'Binary:',
    `${values.MiB} MiB`,
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function KbToMbConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<KbToMbDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<KbToMbFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const kiloUnitRef = React.useRef(draft.kiloUnit);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: KbToMbDraft) => {
    const unitChanged = next.kiloUnit !== kiloUnitRef.current;
    kiloUnitRef.current = next.kiloUnit;

    const field = next.activeField ?? 'kilo';
    const sourceText = next.texts[field];
    const parsed = parseKbMbInput(sourceText);

    if (parsed.blank) {
      setDraft({
        texts: {
          kilo: field === 'kilo' ? sourceText : '',
          MiB: field === 'MiB' ? sourceText : '',
          MB: field === 'MB' ? sourceText : '',
        },
        kiloUnit: next.kiloUnit,
        activeField: field,
      });
      setErrors({});
      setHasResult(false);
      return;
    }

    if (!parsed.value) {
      setDraft(next);
      if (parsed.error) {
        setErrors({ [field]: parsed.error });
        setHasResult(false);
      }
      return;
    }

    // Unit switch: keep edited numeric text; reinterpret with new kilo factor when source is kilo.
    if (unitChanged) {
      const sourceField = next.activeField ?? 'kilo';
      try {
        const texts = convertPreserveSource(
          next.texts[sourceField],
          sourceField,
          next.kiloUnit,
        );
        setDraft({
          texts,
          kiloUnit: next.kiloUnit,
          activeField: sourceField,
        });
        setErrors({});
        setHasResult(true);
      } catch {
        setDraft(next);
        setErrors({ [sourceField]: 'Please enter a valid non-negative data size.' });
        setHasResult(false);
      }
      return;
    }

    try {
      const texts = convertPreserveSource(sourceText, field, next.kiloUnit);
      setDraft({
        texts,
        kiloUnit: next.kiloUnit,
        activeField: field,
      });
      setErrors({});
      setHasResult(true);
    } catch {
      setDraft(next);
      setErrors({ [field]: 'Please enter a valid non-negative data size.' });
      setHasResult(false);
    }
  }, []);

  const clearAll = (reload: boolean) => {
    if (reload) {
      kiloUnitRef.current = 'kB';
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      setDraft(emptyDraft(draft.kiloUnit));
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const values = hasResult ? draft.texts : null;

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
          <p className="text-xs font-normal text-muted-foreground">kB · MB · MiB</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <KbToMbForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'kilo' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <KbToMbResults
            values={values}
            kiloUnit={draft.kiloUnit}
            copied={copied}
            shared={shared}
            canShare={canShare}
            onCopy={() => {
              if (!values) return;
              void copyTextToClipboard(summaryText(values, draft.kiloUnit)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!values) return;
              const payload = summaryText(values, draft.kiloUnit);
              const markShared = () => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              };
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text: payload,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(markShared)
                  .catch(() => {
                    void copyTextToClipboard(payload).then((ok) => {
                      if (ok) markShared();
                    });
                  });
                return;
              }
              void copyTextToClipboard(payload).then((ok) => {
                if (ok) markShared();
              });
            }}
          />
        </KbToMbForm>
      </div>
    </section>
  );
}
