'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { EmvForm } from './EmvForm';
import { EmvResults } from './EmvResults';
import {
  createDefaultDraft,
  type EmvDraft,
  type EmvFieldErrors,
  type EmvResult,
} from './types';
import { validateEmvDraft } from './validation';

function summaryText(metadataTitle: string, result: EmvResult): string {
  const lines = [
    `${metadataTitle} — Omega Calculators`,
    `Risks: ${result.risks.length}`,
  ];
  result.risks.forEach((risk, index) => {
    lines.push(
      `Risk ${index + 1}: impact ${risk.impact}, probability ${risk.probability}%, EMV ${risk.riskEmv}`
    );
  });
  lines.push(`Total EMV: ${result.shareEmv}`);
  lines.push(
    'Convention: positive EMV = expected loss (threat); negative impact = expected gain (opportunity).'
  );
  lines.push(CURRENCY_DENOMINATION_NOTE);
  return lines.join('\n');
}

export function EmvCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<EmvDraft>(() => createDefaultDraft());
  const [errors, setErrors] = React.useState<EmvFieldErrors>({});
  const [result, setResult] = React.useState<EmvResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [openRisks, setOpenRisks] = React.useState<Record<number, boolean>>({ 0: true });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: EmvDraft) => {
    const validation = validateEmvDraft(next);
    setDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.isValid ? validation.result : null);
  };

  const resetAll = () => {
    setDraft(createDefaultDraft());
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setOpenRisks({ 0: true });
    setCopied(false);
    setShared(false);
  };

  const sharePayload = result ? summaryText(metadata.title, result) : '';
  const hasFieldErrors = Object.keys(errors).length > 0;

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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <EmvForm
          draft={draft}
          errors={errors}
          result={result}
          openRisks={openRisks}
          onDraftChange={run}
          onToggleRisk={(index) =>
            setOpenRisks((prev) => ({
              ...prev,
              [index]: prev[index] === false ? true : false,
            }))
          }
          onSubmit={(event) => {
            event.preventDefault();
            run(draft);
          }}
          onReset={resetAll}
        />
        <EmvResults
          result={result}
          invalid={hasFieldErrors}
          incomplete={incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(metadata.title, result)).then((ok) => {
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
