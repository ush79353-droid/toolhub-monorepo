'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  billionToNumber,
  buildResult,
  defaultAbsolute,
  millionToNumber,
} from './calculation';
import {
  MillionToBillionForm,
  defaultDraft,
  emptyDraft,
  type MillionToBillionDraft,
} from './MillionToBillionForm';
import { MillionToBillionResults } from './MillionToBillionResults';
import type {
  DecimalValue,
  MillionBillionFieldErrors,
  MillionBillionResult,
} from './types';
import { parseFieldInput } from './validation';

function summaryText(result: MillionBillionResult): string {
  return [
    'Million to Billion Converter',
    'Omega Calculators',
    '',
    `Millions: ${result.millionGrouped}`,
    `Billions: ${result.billionDisplay}`,
    `Full Number: ${result.fullNumberGrouped}`,
    '',
    `${result.millionGrouped} million = ${result.billionDisplay} billion`,
  ].join('\n');
}

function draftFromAbsolute(
  absolute: DecimalValue,
  sourceField: MillionToBillionDraft['sourceField'],
  preserveRaw?: Partial<
    Pick<MillionToBillionDraft, 'million' | 'billion' | 'fullNumber'>
  >
): MillionToBillionDraft {
  const result = buildResult(absolute);
  return {
    sourceField,
    million: preserveRaw?.million ?? result.millionDisplay,
    billion: preserveRaw?.billion ?? result.billionDisplay,
    fullNumber: preserveRaw?.fullNumber ?? result.fullNumberDisplay,
  };
}

export function MillionToBillionConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MillionToBillionDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<MillionBillionFieldErrors>({});
  const [result, setResult] = React.useState<MillionBillionResult | null>(() =>
    buildResult(defaultAbsolute())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: MillionToBillionDraft) => {
    const field = next.sourceField;
    const raw =
      field === 'million'
        ? next.million
        : field === 'billion'
          ? next.billion
          : next.fullNumber;

    const parsed = parseFieldInput(raw, field);
    if (parsed.blank) {
      setErrors({});
      setResult(null);
      if (field === 'million') {
        setDraft({ ...next, billion: '', fullNumber: '' });
      } else if (field === 'billion') {
        setDraft({ ...next, million: '', fullNumber: '' });
      } else {
        setDraft({ ...next, million: '', billion: '' });
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
      field === 'million'
        ? millionToNumber(parsed.value)
        : field === 'billion'
          ? billionToNumber(parsed.value)
          : parsed.value;

    const nextResult = buildResult(absolute);
    setErrors({});
    setResult(nextResult);
    setDraft(
      draftFromAbsolute(absolute, field, {
        million: field === 'million' ? next.million : nextResult.millionDisplay,
        billion: field === 'billion' ? next.billion : nextResult.billionDisplay,
        fullNumber:
          field === 'fullNumber' ? next.fullNumber : nextResult.fullNumberDisplay,
      })
    );
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, MillionToBillionDraft> = {
        1: { sourceField: 'million', million: '1000', billion: '', fullNumber: '' },
        2: { sourceField: 'million', million: '2500', billion: '', fullNumber: '' },
        3: { sourceField: 'million', million: '500', billion: '', fullNumber: '' },
        4: { sourceField: 'billion', million: '', billion: '1.25', fullNumber: '' },
        5: { sourceField: 'million', million: '12345', billion: '', fullNumber: '' },
      };
      evaluate(examples[id]);
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
            Short scale · 1 billion = 1,000 million
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MillionToBillionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(defaultDraft());
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
        <MillionToBillionResults
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
