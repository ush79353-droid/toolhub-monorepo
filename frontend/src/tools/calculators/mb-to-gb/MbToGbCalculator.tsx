'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  convertDecimalValue,
  convertMBGB,
  formatMbGbDisplay,
} from './calculation';
import { MbToGbForm, defaultDraft, emptyDraft, type MbToGbDraft } from './MbToGbForm';
import { MbToGbResults } from './MbToGbResults';
import {
  NUMBER_SYSTEM_LABELS,
  type DataUnit,
  type MbToGbFieldErrors,
} from './types';
import { parseMbGbInput } from './validation';

function draftFromSource(
  sourceText: string,
  sourceUnit: DataUnit,
  numberSystem: MbToGbDraft['numberSystem'],
  preserveSource: boolean
): MbToGbDraft {
  const other: DataUnit = sourceUnit === 'MB' ? 'GB' : 'MB';
  const otherValue = convertMBGB(sourceText, sourceUnit, other, numberSystem);
  return {
    texts: {
      MB: sourceUnit === 'MB' && preserveSource ? sourceText : sourceUnit === 'MB' ? sourceText : otherValue,
      GB: sourceUnit === 'GB' && preserveSource ? sourceText : sourceUnit === 'GB' ? sourceText : otherValue,
    },
    numberSystem,
    activeField: sourceUnit,
  };
}

function summaryText(values: Record<DataUnit, string>, numberSystem: MbToGbDraft['numberSystem']): string {
  const factor = numberSystem === 'decimal' ? '1000' : '1024';
  const lines = [
    'MB to GB Converter',
    'Omega Calculators',
    '',
    `Number System: ${NUMBER_SYSTEM_LABELS[numberSystem]}`,
    '',
    `Megabytes: ${values.MB} MB`,
    `Gigabytes: ${values.GB} GB`,
    '',
    'Formula:',
    `GB = MB / ${factor}`,
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function MbToGbConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MbToGbDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<MbToGbFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const systemRef = React.useRef(draft.numberSystem);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: MbToGbDraft) => {
    const systemChanged = next.numberSystem !== systemRef.current;
    systemRef.current = next.numberSystem;

    const field = next.activeField ?? 'MB';
    const sourceText = next.texts[field];
    const parsed = parseMbGbInput(sourceText);

    if (parsed.blank) {
      setDraft({
        texts: {
          MB: field === 'MB' ? sourceText : '',
          GB: field === 'GB' ? sourceText : '',
        },
        numberSystem: next.numberSystem,
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

    // Mode switch: keep the active (or MB) numeric text; recalculate the other unit.
    if (systemChanged) {
      const sourceUnit = next.activeField ?? 'MB';
      const text = next.texts[sourceUnit];
      const sourceParsed = parseMbGbInput(text);
      if (sourceParsed.value) {
        const other: DataUnit = sourceUnit === 'MB' ? 'GB' : 'MB';
        const converted = convertDecimalValue(
          sourceParsed.value,
          sourceUnit,
          other,
          next.numberSystem
        );
        setDraft({
          texts: {
            MB: sourceUnit === 'MB' ? text : formatMbGbDisplay(converted),
            GB: sourceUnit === 'GB' ? text : formatMbGbDisplay(converted),
          },
          numberSystem: next.numberSystem,
          activeField: sourceUnit,
        });
        setErrors({});
        setHasResult(true);
        return;
      }
    }

    setDraft(draftFromSource(sourceText, field, next.numberSystem, true));
    setErrors({});
    setHasResult(true);
  }, []);

  const clearAll = (reload: boolean) => {
    if (reload) {
      systemRef.current = 'decimal';
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      setDraft(emptyDraft(draft.numberSystem));
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const values = hasResult
    ? ({ MB: draft.texts.MB, GB: draft.texts.GB } as Record<DataUnit, string>)
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
          <p className="text-xs font-normal text-muted-foreground">MB · GB · SI or legacy 1024</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MbToGbForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'MB' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <MbToGbResults
            values={values}
            numberSystem={draft.numberSystem}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!values) return;
              void copyTextToClipboard(summaryText(values, draft.numberSystem)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!values || typeof navigator.share !== 'function') return;
              const payload = summaryText(values, draft.numberSystem);
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
        </MbToGbForm>
      </div>
    </section>
  );
}
