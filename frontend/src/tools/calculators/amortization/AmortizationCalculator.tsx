'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { AmortizationForm, draftToInput, inputToDraft, type AmortizationDraft } from './AmortizationForm';
import { AmortizationResults } from './AmortizationResults';
import { calculateAmortization } from './calculation';
import {
  createDefaultAmortizationInput,
  getTodayIsoDate,
  type AmortizationFieldErrors,
  type AmortizationResult,
} from './types';
import { validateAmortizationInput } from './validation';

const INITIAL_START_DATE = '2026-01-01';

export function AmortizationCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AmortizationDraft>(() =>
    inputToDraft(createDefaultAmortizationInput(INITIAL_START_DATE))
  );
  const [errors, setErrors] = React.useState<AmortizationFieldErrors>({});
  const [result, setResult] = React.useState<AmortizationResult | null>(() =>
    calculateAmortization(createDefaultAmortizationInput(INITIAL_START_DATE))
  );

  React.useEffect(() => {
    const today = getTodayIsoDate();
    if (today === INITIAL_START_DATE) return;
    setDraft((current) => {
      if (current.startDate !== INITIAL_START_DATE) return current;
      const next = { ...current, startDate: today };
      const parsed = draftToInput(next);
      if (validateAmortizationInput(parsed).isValid) {
        setResult(calculateAmortization(parsed));
      }
      return next;
    });
  }, []);

  const evaluateDraft = React.useCallback((nextDraft: AmortizationDraft) => {
    const parsed = draftToInput(nextDraft);
    const validation = validateAmortizationInput(parsed);
    setErrors(validation.errors);
    if (validation.isValid) {
      setResult(calculateAmortization(parsed));
    }
  }, []);

  const handleDraftChange = (nextDraft: AmortizationDraft) => {
    setDraft(nextDraft);
    evaluateDraft(nextDraft);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    evaluateDraft(draft);
  };

  const handleReset = () => {
    const fresh = createDefaultAmortizationInput(getTodayIsoDate());
    const freshDraft = inputToDraft(fresh);
    setDraft(freshDraft);
    setErrors({});
    setResult(calculateAmortization(fresh));
  };

  const hasErrors = Object.keys(errors).length > 0;
  const parsedInput = draftToInput(draft);

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed
          ? 'shadow-sm'
          : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      {/* Calculator Header Bar + Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Amortization Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Currency selection changes denomination only
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="amort-currency" className="sr-only">
              Display Currency
            </label>
            <CurrencySelect
              id="amort-currency"
              aria-label="Display currency"
              value={draft.currency}
              onChange={(currency) => handleDraftChange({ ...draft, currency })}
            />
          </div>
        </div>
      </div>

      {/* Calculator Body: Form -> Results */}
      <div className="space-y-6 p-4 sm:p-6">
        <AmortizationForm
          draft={draft}
          errors={errors}
          onChange={handleDraftChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        {result && !hasErrors ? (
          <AmortizationResults input={parsedInput} result={result} />
        ) : hasErrors ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center">
            <p className="text-xs font-medium text-destructive">
              Please correct the errors in the form above to see updated results.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

