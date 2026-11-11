'use client';

import * as React from 'react';
import { Calculator } from 'lucide-react';
import type { ToolComponentProps } from '@/tools/types';
import { AmortizationTable } from './AmortizationTable';
import {
  AutoLoanForm,
  draftToInput,
  inputToDraft,
  type AutoLoanDraft,
} from './AutoLoanForm';
import { AutoLoanResults } from './AutoLoanResults';
import { buildResultsSummaryText, calculateAutoLoan } from './calculation';
import {
  createDefaultAutoLoanInput,
  getTodayIsoDate,
  type AutoLoanFieldErrors,
  type AutoLoanResult,
} from './types';
import { validateAutoLoanInput } from './validation';

const INITIAL_START_DATE = '2026-11-11';

export function AutoLoanCalculator({ metadata, className = '' }: ToolComponentProps) {
  const [draft, setDraft] = React.useState<AutoLoanDraft>(() =>
    inputToDraft(createDefaultAutoLoanInput(INITIAL_START_DATE))
  );
  const [errors, setErrors] = React.useState<AutoLoanFieldErrors>({});
  const [result, setResult] = React.useState<AutoLoanResult | null>(() =>
    calculateAutoLoan(createDefaultAutoLoanInput(INITIAL_START_DATE))
  );
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const today = getTodayIsoDate();
    if (today === INITIAL_START_DATE) return;
    setDraft((current) => {
      if (current.startDate !== INITIAL_START_DATE) return current;
      const next = { ...current, startDate: today };
      const parsed = draftToInput(next);
      if (validateAutoLoanInput(parsed).isValid) {
        setResult(calculateAutoLoan(parsed));
      }
      return next;
    });
  }, []);

  const evaluateDraft = React.useCallback((nextDraft: AutoLoanDraft) => {
    const parsed = draftToInput(nextDraft);
    const validation = validateAutoLoanInput(parsed);
    setErrors(validation.errors);
    if (validation.isValid) {
      setResult(calculateAutoLoan(parsed));
    }
  }, []);

  const handleDraftChange = (nextDraft: AutoLoanDraft) => {
    setDraft(nextDraft);
    evaluateDraft(nextDraft);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    evaluateDraft(draft);
  };

  const handleReset = () => {
    const fresh = createDefaultAutoLoanInput(getTodayIsoDate());
    const freshDraft = inputToDraft(fresh);
    setDraft(freshDraft);
    setErrors({});
    setResult(calculateAutoLoan(fresh));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const summary = buildResultsSummaryText(draftToInput(draft), result);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-white shadow-sm ${className}`}
    >
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/60 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-accent sm:text-base">{metadata.title}</h2>
            <p className="text-xs text-muted-foreground">
              Fixed-rate in-browser calculator • All computations stay on your device
            </p>
          </div>
        </div>
      </div>

      {/* Main Split: Inputs Left, Results Right on Desktop; Inputs First, Results Next on Mobile */}
      <div className="p-5 sm:p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <AutoLoanForm
              draft={draft}
              errors={errors}
              onDraftChange={handleDraftChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
          </div>

          <div className="lg:col-span-7">
            <AutoLoanResults
              result={result}
              hasErrors={hasErrors}
              onCopy={handleCopy}
              copied={copied}
            />
          </div>
        </div>

        {/* Amortization Schedule Full-Width Below */}
        {result && !hasErrors && <AmortizationTable result={result} />}
      </div>
    </div>
  );
}
