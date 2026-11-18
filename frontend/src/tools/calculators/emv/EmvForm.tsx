'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  MAX_RISKS,
  MIN_RISKS,
  type EmvDraft,
  type EmvFieldErrors,
  type EmvResult,
} from './types';
import { resizeRisks } from './validation';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-4 rounded-xl border border-border bg-muted/20 p-4';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

interface EmvFormProps {
  draft: EmvDraft;
  errors: EmvFieldErrors;
  result: EmvResult | null;
  openRisks: Record<number, boolean>;
  onDraftChange: (draft: EmvDraft) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onToggleRisk: (index: number) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function EmvForm({
  draft,
  errors,
  result,
  openRisks,
  onDraftChange,
  onCurrencyChange,
  onToggleRisk,
  onSubmit,
  onReset,
}: EmvFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const riskOptions = Array.from({ length: MAX_RISKS - MIN_RISKS + 1 }, (_, i) => i + MIN_RISKS);

  const setRisk = (index: number, patch: Partial<EmvDraft['risks'][number]>) => {
    const risks = draft.risks.map((risk, i) => (i === index ? { ...risk, ...patch } : risk));
    onDraftChange({ ...draft, risks });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <div>
        <label className={labelClass} htmlFor="emv-risk-count">
          How many risks are you considering in your EMV calculation?
        </label>
        <Select
          id="emv-risk-count"
          className="h-11"
          value={String(draft.riskCount)}
          aria-invalid={Boolean(errors.riskCount)}
          onChange={(event) => {
            onDraftChange(resizeRisks(draft, Number(event.target.value)));
          }}
        >
          {riskOptions.map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </Select>
        {errors.riskCount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.riskCount}</p>
        ) : null}
      </div>

      {draft.risks.slice(0, draft.riskCount).map((risk, index) => {
        const n = index + 1;
        const open = openRisks[index] !== false;
        const impactError = errors[`risk${n}Impact`];
        const probabilityError = errors[`risk${n}Probability`];

        return (
          <div key={n} className="rounded-xl border border-border">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[13px] font-semibold text-accent"
              aria-expanded={open}
              onClick={() => onToggleRisk(index)}
            >
              Risk {n}
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {open ? (
              <div className="space-y-4 border-t border-border px-4 py-4">
                <div>
                  <label className={labelClass} htmlFor={`emv-impact-${n}`}>
                    Impact of occurrence
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={impactError}>
                      <span
                        className="shrink-0 pl-3 text-sm text-muted-foreground"
                        aria-hidden="true"
                      >
                        {symbol}
                      </span>
                      <input
                        id={`emv-impact-${n}`}
                        className={inputClass}
                        inputMode="decimal"
                        value={risk.impact}
                        aria-invalid={Boolean(impactError)}
                        onChange={(event) => setRisk(index, { impact: event.target.value })}
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id={`emv-impact-currency-${n}`}
                        value={draft.currency}
                        onChange={onCurrencyChange}
                        aria-label={`Risk ${n} impact currency`}
                      />
                    </div>
                  </div>
                  {impactError ? (
                    <p className="mt-1 text-xs text-rose-600">{impactError}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass} htmlFor={`emv-probability-${n}`}>
                    Probability of occurrence
                  </label>
                  <div className="relative">
                    <FieldShell error={probabilityError}>
                      <input
                        id={`emv-probability-${n}`}
                        className={`${inputClass} pr-10`}
                        inputMode="decimal"
                        value={risk.probability}
                        aria-invalid={Boolean(probabilityError)}
                        onChange={(event) =>
                          setRisk(index, { probability: event.target.value })
                        }
                      />
                    </FieldShell>
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                  {probabilityError ? (
                    <p className="mt-1 text-xs text-rose-600">{probabilityError}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <section className={sectionClass} aria-labelledby="emv-result-heading">
        <h3 id="emv-result-heading" className="text-[13px] font-semibold text-accent">
          Expected monetary value (EMV)
        </h3>
        <div>
          <label className={labelClass} htmlFor="emv-total">
            EMV
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="emv-total"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.emvDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="emv-total-currency"
                value={draft.currency}
                onChange={onCurrencyChange}
                aria-label="EMV currency"
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Positive EMV means expected loss (threat); use a negative impact for expected gain
            (opportunity).
          </p>
        </div>
      </section>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
