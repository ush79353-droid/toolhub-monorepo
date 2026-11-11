'use client';

import * as React from 'react';
import { Calculator } from 'lucide-react';
import { Select } from '@/components/ui/select';
import type { ToolComponentProps } from '@/tools/types';
import { LoanAmortizationTable } from './LoanAmortizationTable';
import { LoanForm, draftToInput, inputToDraft, type LoanDraft } from './LoanForm';
import { LoanResults } from './LoanResults';
import { buildLoanSummaryText, calculateLoan } from './calculation';
import {
  CURRENCY_OPTIONS,
  createDefaultLoanInput,
  getTodayIsoDate,
  type LoanFieldErrors,
  type LoanResult,
  type SupportedCurrency,
} from './types';
import { validateLoanInput } from './validation';

const INITIAL_START_DATE = '2026-11-11';

const CURRENCY_SHORT_LABELS: Record<SupportedCurrency, string> = {
  USD: 'USD ($)',
  EUR: 'EUR (€)',
  GBP: 'GBP (£)',
  CAD: 'CAD (C$)',
  AUD: 'AUD (A$)',
  INR: 'INR (₹)',
  PKR: 'PKR (Rs)',
  AED: 'AED (د.إ)',
};

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
      className={`overflow-hidden rounded-2xl border border-border bg-white shadow-xs ${className}`}
    >
      {/* Compact Calculator Header + Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-background/50 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <Calculator className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
            <p className="text-xs font-normal text-muted-foreground">Formatting currency only</p>
          </div>
        </div>

        <div className="w-[140px] shrink-0">
          <label htmlFor="loan-currency" className="sr-only">
            Display Currency
          </label>
          <Select
            id="loan-currency"
            aria-label="Display currency"
            title="Changes symbol formatting only (no exchange-rate conversion)"
            value={draft.currency}
            onChange={(e) =>
              handleDraftChange({ ...draft, currency: e.target.value as SupportedCurrency })
            }
            className="h-9 text-xs font-medium"
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {CURRENCY_SHORT_LABELS[option.code]}
              </option>
            ))}
          </Select>
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

