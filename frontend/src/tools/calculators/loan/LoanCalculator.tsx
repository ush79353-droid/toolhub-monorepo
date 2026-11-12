'use client';

import * as React from 'react';
import { Calculator } from 'lucide-react';
import type { ToolComponentProps } from '@/tools/types';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { LoanAmortizationTable } from './LoanAmortizationTable';
import { LoanForm, draftToInput, inputToDraft, type LoanDraft } from './LoanForm';
import { LoanResults } from './LoanResults';
import { buildLoanSummaryText, calculateLoan } from './calculation';
import {
  createDefaultLoanInput,
  getTodayIsoDate,
  type LoanFieldErrors,
  type LoanResult,
} from './types';
import { validateLoanInput } from './validation';

const INITIAL_START_DATE = '2026-11-11';

export function LoanCalculator({ metadata, className = '' }: ToolComponentProps) {
  const [draft, setDraft] = React.useState<LoanDraft>(() =>
    inputToDraft(createDefaultLoanInput(INITIAL_START_DATE))
  );
  const [errors, setErrors] = React.useState<LoanFieldErrors>({});
  const [result, setResult] = React.useState<LoanResult | null>(() =>
    calculateLoan(createDefaultLoanInput(INITIAL_START_DATE))
  );
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const today = getTodayIsoDate();
    if (today === INITIAL_START_DATE) return;
    setDraft((current) => {
      if (current.startDate !== INITIAL_START_DATE) return current;
      const next = { ...current, startDate: today };
      const parsed = draftToInput(next);
      if (validateLoanInput(parsed).isValid) {
        setResult(calculateLoan(parsed));
      }
      return next;
    });
  }, []);

  const evaluateDraft = React.useCallback((nextDraft: LoanDraft) => {
    const parsed = draftToInput(nextDraft);
    const validation = validateLoanInput(parsed);
    setErrors(validation.errors);
    if (validation.isValid) {
      setResult(calculateLoan(parsed));
    }
  }, []);

  const handleDraftChange = (nextDraft: LoanDraft) => {
    setDraft(nextDraft);
    evaluateDraft(nextDraft);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    evaluateDraft(draft);
  };

  const handleReset = () => {
    const fresh = createDefaultLoanInput(getTodayIsoDate());
    const freshDraft = inputToDraft(fresh);
    setDraft(freshDraft);
    setErrors({});
    setResult(calculateLoan(fresh));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const summary = buildLoanSummaryText(draftToInput(draft), result);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)] ${className}`}
    >
      {/* Compact Calculator Header + Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <Calculator className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
            <p className="text-xs font-normal text-muted-foreground">Formatting currency only</p>
          </div>
        </div>

        <div className="w-[148px] shrink-0 sm:w-[160px]">
          <label htmlFor="loan-currency" className="sr-only">
            Display Currency
          </label>
          <CurrencySelect
            id="loan-currency"
            aria-label="Display currency"
            value={draft.currency}
            onChange={(currency) => handleDraftChange({ ...draft, currency })}
          />
        </div>
      </div>

      {/* Vertical Flow: Inputs -> Results -> Chart & Breakdown -> Amortization Table */}
      <div className="space-y-4 p-4 sm:p-5">
        <LoanForm
          draft={draft}
          errors={errors}
          onDraftChange={handleDraftChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        <LoanResults result={result} hasErrors={hasErrors} onCopy={handleCopy} copied={copied} />

        {result && !hasErrors && <LoanAmortizationTable result={result} />}
      </div>
    </section>
  );
}

