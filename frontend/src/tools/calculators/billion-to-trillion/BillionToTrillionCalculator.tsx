'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  absoluteFromBillion,
  absoluteFromTrillion,
  buildResult,
  defaultAbsolute,
} from './calculation';
import {
  BillionToTrillionForm,
  defaultDraft,
  emptyDraft,
  type BillionToTrillionDraft,
} from './BillionToTrillionForm';
import { BillionToTrillionResults } from './BillionToTrillionResults';
import type {
  BillionTrillionFieldErrors,
  BillionTrillionResult,
  DecimalValue,
} from './types';
import { parseFieldInput } from './validation';

function summaryText(result: BillionTrillionResult): string {
  return [
    'Billion to Trillion Converter',
    'Omega Calculators',
    '',
    `Billion: ${result.billionDisplay}`,
    `Trillion: ${result.trillionDisplay}`,
    '',
    'Absolute Number:',
    result.absoluteGrouped,
    '',
    'Scientific Notation:',
    result.scientificNotation,
    '',
    'Conversion:',
    `${result.billionDisplay} billion = ${result.trillionDisplay} trillion`,
    '',
    'Numbering system: short scale (billion = 10⁹, trillion = 10¹²)',
  ].join('\n');
}

function draftFromAbsolute(
  absolute: DecimalValue,
  sourceField: BillionToTrillionDraft['sourceField'],
  preserveRaw?: Partial<Pick<BillionToTrillionDraft, 'billion' | 'trillion' | 'scientific'>>
): BillionToTrillionDraft {
  const result = buildResult(absolute);
  return {
    sourceField,
    billion: preserveRaw?.billion ?? result.billionDisplay,
    trillion: preserveRaw?.trillion ?? result.trillionDisplay,
    scientific: preserveRaw?.scientific ?? result.scientificNotation,
  };
}

export function BillionToTrillionConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<BillionToTrillionDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<BillionTrillionFieldErrors>({});
  const [result, setResult] = React.useState<BillionTrillionResult | null>(() =>
    buildResult(defaultAbsolute())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: BillionToTrillionDraft) => {
    const field = next.sourceField;
    const raw =
      field === 'billion'
        ? next.billion
        : field === 'trillion'
          ? next.trillion
          : next.scientific;

    const parsed = parseFieldInput(raw, field);
    if (parsed.blank) {
      setErrors({});
      setResult(null);
      if (field === 'billion') {
        setDraft({ ...next, trillion: '', scientific: '' });
      } else if (field === 'trillion') {
        setDraft({ ...next, billion: '', scientific: '' });
      } else {
        setDraft({ ...next, billion: '', trillion: '' });
      }
      return;
    }
    if (parsed.error || !parsed.value) {
      setErrors({ [field]: parsed.error ?? 'Enter a valid number.' });
      setResult(null);
      setDraft(next);
      return;
    }

    const absolute =
      field === 'billion'
        ? absoluteFromBillion(parsed.value)
        : field === 'trillion'
          ? absoluteFromTrillion(parsed.value)
          : parsed.value;

    const nextResult = buildResult(absolute);
    setErrors({});
    setResult(nextResult);
    setDraft(
      draftFromAbsolute(absolute, field, {
        billion: field === 'billion' ? next.billion : nextResult.billionDisplay,
        trillion: field === 'trillion' ? next.trillion : nextResult.trillionDisplay,
        scientific:
          field === 'scientific' ? next.scientific : nextResult.scientificNotation,
      })
    );
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4) => {
      if (id === 1) {
        evaluate({
          sourceField: 'billion',
          billion: '1',
          trillion: '',
          scientific: '',
        });
        return;
      }
      if (id === 2) {
        evaluate({
          sourceField: 'billion',
          billion: '1000',
          trillion: '',
          scientific: '',
        });
        return;
      }
      if (id === 3) {
        evaluate({
          sourceField: 'billion',
          billion: '500',
          trillion: '',
          scientific: '',
        });
        return;
      }
      evaluate({
        sourceField: 'trillion',
        billion: '',
        trillion: '2.5',
        scientific: '',
      });
    },
    [evaluate]
  );

  const sharePayload = result ? summaryText(result) : '';

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
            Short scale · 1 trillion = 1000 billion
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <BillionToTrillionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            const next = defaultDraft();
            setDraft(next);
            setErrors({});
            setResult(buildResult(defaultAbsolute()));
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
          onApplyExample={applyExample}
        />
        <BillionToTrillionResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
