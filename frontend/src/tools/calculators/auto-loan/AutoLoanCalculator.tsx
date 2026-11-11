'use client';

import * as React from 'react';
import { Calculator } from 'lucide-react';
import { Select } from '@/components/ui/select';
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
  CURRENCY_OPTIONS,
  createDefaultAutoLoanInput,
  getTodayIsoDate,
  type AutoLoanFieldErrors,
  type AutoLoanResult,
  type SupportedCurrency,
} from './types';
import { validateAutoLoanInput } from './validation';

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
          <label htmlFor="auto-loan-currency" className="sr-only">
            Display Currency
          </label>
          <Select
            id="auto-loan-currency"
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

      {/* Compact Vertical Flow: Inputs -> Results -> Chart & Breakdown -> Amortization Access */}
      <div className="space-y-4 p-4 sm:p-5">
        <AutoLoanForm
          draft={draft}
          errors={errors}
          onDraftChange={handleDraftChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        <div className="border-t border-border pt-4">
          <AutoLoanResults
            result={result}
            hasErrors={hasErrors}
            onCopy={handleCopy}
            copied={copied}
          />
        </div>

        {result && !hasErrors && <AmortizationTable result={result} />}
      </div>
    </section>
  );
}
