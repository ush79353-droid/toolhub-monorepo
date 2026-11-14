'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateInchesToFraction, formatDecimal } from './calculation';
import {
  InchesToFractionForm,
  defaultDraft,
  type InchesToFractionDraft,
} from './InchesToFractionForm';
import { InchesToFractionResults } from './InchesToFractionResults';
import {
  DEFAULT_INCHES_TO_FRACTION_INPUT,
  type InchesToFractionFieldErrors,
  type InchesToFractionResult,
} from './types';
import { validateInchesToFraction } from './validation';

function summaryText(result: InchesToFractionResult): string {
  const eq = result.isApproximate ? '≈' : '=';
  return [
    'Inches to Fraction Calculator — Omega Calculators',
    `${formatDecimal(result.inches)} inches ${eq} ${result.fractionLabel} inches`,
    `Precision: 1/${result.precision} inch`,
  ].join('\n');
}

export function InchesToFractionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<InchesToFractionDraft>(() => defaultDraft('1.375'));
  const [errors, setErrors] = React.useState<InchesToFractionFieldErrors>({});
  const [result, setResult] = React.useState<InchesToFractionResult | null>(() =>
    calculateInchesToFraction(DEFAULT_INCHES_TO_FRACTION_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: InchesToFractionDraft) => {
    const validation = validateInchesToFraction(next.distance);
    setErrors(validation.errors);
    setDraft(next);
    if (!validation.isValid || validation.parsedInches === null) {
      setResult(null);
      return;
    }
    setResult(
      calculateInchesToFraction({
        inches: validation.parsedInches,
        precision: next.precision,
      })
    );
  }, []);

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
            Decimal ↔ fraction · default 1/16&quot;
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <InchesToFractionForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(defaultDraft(''));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <InchesToFractionResults
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
