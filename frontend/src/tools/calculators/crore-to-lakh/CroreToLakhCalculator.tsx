'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  absoluteFromCrore,
  absoluteFromLakh,
  buildResult,
  defaultAbsolute,
} from './calculation';
import {
  CroreToLakhForm,
  defaultDraft,
  emptyDraft,
  type CroreToLakhDraft,
} from './CroreToLakhForm';
import { CroreToLakhResults } from './CroreToLakhResults';
import type { CroreLakhFieldErrors, CroreLakhResult, DecimalValue } from './types';
import { parseFieldInput } from './validation';

function summaryText(result: CroreLakhResult): string {
  return [
    'Crore to Lakh Converter',
    'Omega Calculators',
    '',
    `Crores: ${result.croreDisplay}`,
    `Lakhs: ${result.lakhDisplay}`,
    '',
    'Conversion:',
    `${result.croreDisplay} crore = ${result.lakhDisplay} lakh`,
    '',
    `International: ${result.absoluteInternational}`,
    `Indian: ${result.absoluteIndian}`,
  ].join('\n');
}

function draftFromAbsolute(
  absolute: DecimalValue,
  sourceField: CroreToLakhDraft['sourceField'],
  preserveRaw?: Partial<Pick<CroreToLakhDraft, 'crore' | 'lakh'>>
): CroreToLakhDraft {
  const result = buildResult(absolute);
  return {
    sourceField,
    crore: preserveRaw?.crore ?? result.croreDisplay,
    lakh: preserveRaw?.lakh ?? result.lakhDisplay,
  };
}

export function CroreToLakhConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CroreToLakhDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<CroreLakhFieldErrors>({});
  const [result, setResult] = React.useState<CroreLakhResult | null>(() =>
    buildResult(defaultAbsolute())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: CroreToLakhDraft) => {
    const field = next.sourceField;
    const raw = field === 'crore' ? next.crore : next.lakh;
    const parsed = parseFieldInput(raw, field);

    if (parsed.blank) {
      setErrors({});
      setResult(null);
      setDraft(field === 'crore' ? { ...next, lakh: '' } : { ...next, crore: '' });
      return;
    }
    if (parsed.error || !parsed.value) {
      setErrors({ [field]: parsed.error ?? 'Enter a valid number.' });
      setResult(null);
      setDraft(next);
      return;
    }

    const absolute =
      field === 'crore' ? absoluteFromCrore(parsed.value) : absoluteFromLakh(parsed.value);
    const nextResult = buildResult(absolute);
    setErrors({});
    setResult(nextResult);
    setDraft(
      draftFromAbsolute(absolute, field, {
        crore: field === 'crore' ? next.crore : nextResult.croreDisplay,
        lakh: field === 'lakh' ? next.lakh : nextResult.lakhDisplay,
      })
    );
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, CroreToLakhDraft> = {
        1: { sourceField: 'crore', crore: '1', lakh: '' },
        2: { sourceField: 'crore', crore: '2.7', lakh: '' },
        3: { sourceField: 'crore', crore: '0.5', lakh: '' },
        4: { sourceField: 'lakh', crore: '', lakh: '250' },
        5: { sourceField: 'crore', crore: '0.125', lakh: '' },
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
          <p className="text-xs font-normal text-muted-foreground">1 crore = 100 lakh</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CroreToLakhForm
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
        <CroreToLakhResults
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
