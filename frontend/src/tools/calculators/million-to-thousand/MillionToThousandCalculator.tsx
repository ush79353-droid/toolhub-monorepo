'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  absoluteFromMillions,
  absoluteFromThousands,
  buildResult,
  defaultAbsolute,
} from './calculation';
import {
  MillionToThousandForm,
  defaultDraft,
  emptyDraft,
  type MillionToThousandDraft,
} from './MillionToThousandForm';
import { MillionToThousandResults } from './MillionToThousandResults';
import type {
  DecimalValue,
  MillionThousandFieldErrors,
  MillionThousandResult,
} from './types';
import { parseFieldInput } from './validation';

function summaryText(result: MillionThousandResult): string {
  return [
    'Million to Thousand Converter',
    'Omega Calculators',
    '',
    `Millions: ${result.millionsDisplay}`,
    `Thousands: ${result.thousandsDisplay}`,
    `Decimal Number: ${result.decimalGrouped}`,
    '',
    `${result.millionsDisplay} million = ${result.thousandsDisplay} thousand`,
    '',
    `Scientific: ${result.scientificNotation}`,
  ].join('\n');
}

function draftFromAbsolute(
  absolute: DecimalValue,
  sourceField: MillionToThousandDraft['sourceField'],
  preserveRaw?: Partial<Pick<MillionToThousandDraft, 'millions' | 'thousands' | 'decimal'>>
): MillionToThousandDraft {
  const result = buildResult(absolute);
  return {
    sourceField,
    millions: preserveRaw?.millions ?? result.millionsDisplay,
    thousands: preserveRaw?.thousands ?? result.thousandsDisplay,
    decimal: preserveRaw?.decimal ?? result.decimalDisplay,
  };
}

export function MillionToThousandConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MillionToThousandDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<MillionThousandFieldErrors>({});
  const [result, setResult] = React.useState<MillionThousandResult | null>(() =>
    buildResult(defaultAbsolute())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: MillionToThousandDraft) => {
    const field = next.sourceField;
    const raw =
      field === 'millions'
        ? next.millions
        : field === 'thousands'
          ? next.thousands
          : next.decimal;

    const parsed = parseFieldInput(raw, field);
    if (parsed.blank) {
      setErrors({});
      setResult(null);
      if (field === 'millions') {
        setDraft({ ...next, thousands: '', decimal: '' });
      } else if (field === 'thousands') {
        setDraft({ ...next, millions: '', decimal: '' });
      } else {
        setDraft({ ...next, millions: '', thousands: '' });
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
      field === 'millions'
        ? absoluteFromMillions(parsed.value)
        : field === 'thousands'
          ? absoluteFromThousands(parsed.value)
          : parsed.value;

    const nextResult = buildResult(absolute);
    setErrors({});
    setResult(nextResult);
    setDraft(
      draftFromAbsolute(absolute, field, {
        millions: field === 'millions' ? next.millions : nextResult.millionsDisplay,
        thousands: field === 'thousands' ? next.thousands : nextResult.thousandsDisplay,
        decimal: field === 'decimal' ? next.decimal : nextResult.decimalDisplay,
      })
    );
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, MillionToThousandDraft> = {
        1: { sourceField: 'millions', millions: '1', thousands: '', decimal: '' },
        2: { sourceField: 'millions', millions: '2.5', thousands: '', decimal: '' },
        3: { sourceField: 'millions', millions: '0.5', thousands: '', decimal: '' },
        4: { sourceField: 'thousands', millions: '', thousands: '2500', decimal: '' },
        5: { sourceField: 'decimal', millions: '', thousands: '', decimal: '1e9' },
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
            1 million = 1,000 thousands
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MillionToThousandForm
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
        <MillionToThousandResults
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
