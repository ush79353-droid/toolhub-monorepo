'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { billionToNumber, buildResult, defaultAbsolute } from './calculation';
import {
  NumberToBillionForm,
  defaultDraft,
  emptyDraft,
  type NumberToBillionDraft,
} from './NumberToBillionForm';
import { NumberToBillionResults } from './NumberToBillionResults';
import type {
  DecimalValue,
  NumberBillionFieldErrors,
  NumberBillionResult,
} from './types';
import { parseFieldInput } from './validation';

function summaryText(result: NumberBillionResult): string {
  return [
    'Number to Billion Converter',
    'Omega Calculators',
    '',
    `Number: ${result.numberGrouped}`,
    `Billions: ${result.billionDisplay}`,
    `Scientific notation: ${result.scientificNotation}`,
    '',
    `${result.numberGrouped} = ${result.billionDisplay} billion`,
  ].join('\n');
}

function draftFromAbsolute(
  absolute: DecimalValue,
  sourceField: NumberToBillionDraft['sourceField'],
  preserveRaw?: Partial<Pick<NumberToBillionDraft, 'number' | 'billion' | 'scientific'>>
): NumberToBillionDraft {
  const result = buildResult(absolute);
  return {
    sourceField,
    number: preserveRaw?.number ?? result.numberDisplay,
    billion: preserveRaw?.billion ?? result.billionDisplay,
    scientific: preserveRaw?.scientific ?? result.scientificNotation,
  };
}

export function NumberToBillionConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<NumberToBillionDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<NumberBillionFieldErrors>({});
  const [result, setResult] = React.useState<NumberBillionResult | null>(() =>
    buildResult(defaultAbsolute())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: NumberToBillionDraft) => {
    const field = next.sourceField;
    const raw =
      field === 'number'
        ? next.number
        : field === 'billion'
          ? next.billion
          : next.scientific;

    const parsed = parseFieldInput(raw, field);
    if (parsed.blank) {
      setErrors({});
      setResult(null);
      if (field === 'number') {
        setDraft({ ...next, billion: '', scientific: '' });
      } else if (field === 'billion') {
        setDraft({ ...next, number: '', scientific: '' });
      } else {
        setDraft({ ...next, number: '', billion: '' });
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
      field === 'billion' ? billionToNumber(parsed.value) : parsed.value;

    const nextResult = buildResult(absolute);
    setErrors({});
    setResult(nextResult);
    setDraft(
      draftFromAbsolute(absolute, field, {
        number: field === 'number' ? next.number : nextResult.numberDisplay,
        billion: field === 'billion' ? next.billion : nextResult.billionDisplay,
        scientific:
          field === 'scientific' ? next.scientific : nextResult.scientificNotation,
      })
    );
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, NumberToBillionDraft> = {
        1: { sourceField: 'number', number: '1000000000', billion: '', scientific: '' },
        2: { sourceField: 'number', number: '2500000000', billion: '', scientific: '' },
        3: { sourceField: 'number', number: '500000000', billion: '', scientific: '' },
        4: { sourceField: 'billion', number: '', billion: '7.5', scientific: '' },
        5: { sourceField: 'scientific', number: '', billion: '', scientific: '1e12' },
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
            Short scale · 1 billion = 10⁹
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <NumberToBillionForm
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
        <NumberToBillionResults
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
