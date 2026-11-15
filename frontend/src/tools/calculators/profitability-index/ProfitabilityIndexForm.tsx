'use client';

import type { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type {
  ProfitabilityIndexFieldErrors,
  ProfitabilityIndexInput,
  ProfitabilityIndexResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({ error, muted, children }: { error?: string; muted?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface ProfitabilityIndexFormProps {
  input: ProfitabilityIndexInput;
  errors: ProfitabilityIndexFieldErrors;
  result: ProfitabilityIndexResult | null;
  onChange: (input: ProfitabilityIndexInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function ProfitabilityIndexForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: ProfitabilityIndexFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ProfitabilityIndexInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="pi-investment">
          <span>Initial investment</span>
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.initialInvestment}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="pi-investment"
              className={inputClass}
              inputMode="decimal"
              value={input.initialInvestment}
              aria-invalid={Boolean(errors.initialInvestment)}
              onChange={(event) => set({ initialInvestment: event.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="pi-investment-currency"
              value={input.currency}
              onChange={onCurrencyChange}
              aria-label="Initial investment currency"
            />
          </div>
        </div>
        {errors.initialInvestment ? (
          <p className="mt-1 text-xs text-rose-600">{errors.initialInvestment}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pi-pv">
          <span>PV of future cash flow</span>
          <InfoTooltip
            label="PV of future cash flow"
            text="Present value of expected future cash inflows. Must be known (or estimated) to compute PI."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.pvFutureCashFlow}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="pi-pv"
              className={inputClass}
              inputMode="decimal"
              value={input.pvFutureCashFlow}
              aria-invalid={Boolean(errors.pvFutureCashFlow)}
              onChange={(event) => set({ pvFutureCashFlow: event.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="pi-pv-currency"
              value={input.currency}
              onChange={onCurrencyChange}
              aria-label="PV of future cash flow currency"
            />
          </div>
        </div>
        {errors.pvFutureCashFlow ? (
          <p className="mt-1 text-xs text-rose-600">{errors.pvFutureCashFlow}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pi-result">
          Profitability index (PI)
        </label>
        <FieldShell muted>
          <input
            id="pi-result"
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={result?.piDisplay ?? ''}
            placeholder=""
            aria-live="polite"
          />
        </FieldShell>
        {result?.interpretation ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{result.interpretation}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-border"
          checked={input.pvUnknown}
          onChange={(event) => set({ pvUnknown: event.target.checked })}
        />
        <span>
          Calculate PI if the PV of future cash flow is unknown
          {input.pvUnknown ? (
            <span className="mt-1 block text-xs font-normal text-muted-foreground">
              Enter your best estimate of PV above. This simple calculator uses PI = PV ÷ investment —
              no extra cash-flow schedule.
            </span>
          ) : null}
        </span>
      </label>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
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
