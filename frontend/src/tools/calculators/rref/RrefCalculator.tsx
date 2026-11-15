'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateRref } from './calculation';
import { RrefForm, draftToInput, inputToDraft, type RrefDraft } from './RrefForm';
import { RrefResults } from './RrefResults';
import {
  MAX_COLS,
  MAX_ROWS,
  createDefaultRrefInput,
  type RrefFieldErrors,
  type RrefResult,
} from './types';
import { validateRrefInput } from './validation';

function buildSummaryText(result: RrefResult): string {
  const lines = [
    'RREF (Reduced Row Echelon Form) Calculator — Omega Calculators',
    '',
    'Original:',
    ...result.original.map((row) => `[ ${row.join('  ')} ]`),
    '',
    'RREF:',
    ...result.rref.map((row) => `[ ${row.join('  ')} ]`),
    '',
    `Rank: ${result.rank}`,
    `Nullity: ${result.nullity}`,
    `Pivot columns: ${result.pivotColumns.join(', ') || 'None'}`,
    `Free columns: ${result.freeColumns.join(', ') || 'None'}`,
  ];
  if (result.augmented) {
    lines.push('', `System: ${result.augmentedAnalysis.message}`);
    if (result.augmentedAnalysis.uniqueSolution) {
      lines.push(
        `Solution: ${result.augmentedAnalysis.uniqueSolution
          .map((v, i) => `x${i + 1}=${v}`)
          .join(', ')}`
      );
    }
  }
  return lines.join('\n');
}

export function RrefCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<RrefDraft>(() =>
    inputToDraft(createDefaultRrefInput())
  );
  const [errors, setErrors] = React.useState<RrefFieldErrors>({});
  const [result, setResult] = React.useState<RrefResult | null>(() =>
    calculateRref(createDefaultRrefInput())
  );
  const [copied, setCopied] = React.useState(false);

  const evaluateDraft = React.useCallback((nextDraft: RrefDraft) => {
    const parsed = draftToInput(nextDraft);
    const validation = validateRrefInput(parsed);
    setErrors(validation.errors);
    if (validation.isValid) {
      setResult(calculateRref(parsed));
    }
  }, []);

  const handleDraftChange = (nextDraft: RrefDraft) => {
    setDraft(nextDraft);
    // Live-validate dimensions/cells but only recompute when valid
    const parsed = draftToInput(nextDraft);
    const validation = validateRrefInput(parsed);
    setErrors(validation.errors);
    if (validation.isValid) {
      setResult(calculateRref(parsed));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    evaluateDraft(draft);
  };

  const handleReset = () => {
    const fresh = createDefaultRrefInput();
    setDraft(inputToDraft(fresh));
    setErrors({});
    setResult(calculateRref(fresh));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const ok = await copyTextToClipboard(buildSummaryText(result));
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed
          ? 'shadow-sm'
          : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Exact fractions · up to {MAX_ROWS}×{MAX_COLS} matrices
          </p>
        </div>
        {headerActions ? <div className="flex shrink-0 items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <RrefForm
          draft={draft}
          errors={errors}
          onChange={handleDraftChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
        <RrefResults result={result} copied={copied} onCopy={handleCopy} />
      </div>
    </section>
  );
}
