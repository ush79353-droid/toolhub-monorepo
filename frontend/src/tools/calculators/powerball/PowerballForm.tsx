'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { US_STATE_OPTIONS } from '../mega-millions-payout/us-states';
import { formatPowerballMoney } from './calculation';
import type {
  FilingStatus,
  PowerballFieldErrors,
  PowerballInput,
  PowerballResult,
} from './types';
import { FILING_STATUS_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface PowerballFormProps {
  input: PowerballInput;
  errors: PowerballFieldErrors;
  result: PowerballResult | null;
  onChange: (next: PowerballInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function PowerballForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: PowerballFormProps) {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [stateQuery, setStateQuery] = React.useState('');

  const set = (patch: Partial<PowerballInput>) => {
    onChange({ ...input, ...patch });
  };

  const filteredStates = React.useMemo(() => {
    const q = stateQuery.trim().toLowerCase();
    if (!q) return US_STATE_OPTIONS;
    return US_STATE_OPTIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q),
    );
  }, [stateQuery]);

  const money = (v: number) => formatPowerballMoney(v);
  const lumpNetHigher =
    result !== null && result.lumpSum.netPayout >= result.annuity.netPayout;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Compare Powerball lump-sum and 30-payment annuity options with
          estimated federal and state taxes (USD). Estimates assume no other
          taxable income. Federal withholding is not your final tax bill.
        </p>
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 text-xs"
          onClick={onLoadExample}
        >
          Load example
        </Button>
      </div>

      <section className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <div className={labelClass}>
            <label htmlFor="pb-jackpot">How much did you win?</label>
          </div>
          <FieldShell error={errors.jackpot}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">
              $
            </span>
            <input
              id="pb-jackpot"
              className={inputClass}
              inputMode="decimal"
              value={input.jackpot}
              onChange={(e) => set({ jackpot: e.target.value })}
            />
          </FieldShell>
          {errors.jackpot ? (
            <p className="mt-1 text-xs text-rose-600">{errors.jackpot}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="pb-lump">Lump sum payout percentage (%)</label>
            <InfoTooltip
              label="Lump-sum percentage"
              text="Cash option as a percent of the advertised annuity jackpot. Official cash values are set by the lottery."
              align="left"
            />
          </div>
          <FieldShell error={errors.lumpSumPercent}>
            <input
              id="pb-lump"
              className={inputClass}
              inputMode="decimal"
              value={input.lumpSumPercent}
              onChange={(e) => set({ lumpSumPercent: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.lumpSumPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lumpSumPercent}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="pb-filing">What is your filing status?</label>
          </div>
          <select
            id="pb-filing"
            className={selectClass}
            value={input.filingStatus}
            onChange={(e) =>
              set({ filingStatus: e.target.value as FilingStatus })
            }
          >
            {FILING_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="pb-state-search">Where do you live?</label>
            <InfoTooltip
              label="State of residence"
              text="Used for estimated state income tax. California lottery winnings are generally CA-state-tax exempt in this estimate. Local taxes omitted."
              align="left"
            />
          </div>
          <input
            id="pb-state-search"
            className={`${selectClass} mb-2`}
            placeholder="Search states…"
            value={stateQuery}
            onChange={(e) => setStateQuery(e.target.value)}
            aria-label="Search US states"
          />
          <select
            id="pb-state"
            className={selectClass}
            value={input.state}
            onChange={(e) =>
              set({ state: e.target.value as PowerballInput['state'] })
            }
          >
            <option value="">Select state or DC</option>
            {filteredStates.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state ? (
            <p className="mt-1 text-xs text-rose-600">{errors.state}</p>
          ) : null}
        </div>
      </section>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {result ? (
        <section className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="text-sm font-semibold text-accent">
              Payout Comparison
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Tax year {result.taxYear} · 5% annuity growth
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/40 text-accent">
                <tr>
                  <th className="px-3 py-2 font-semibold">Payout Details</th>
                  <th className="px-3 py-2 font-semibold tabular-nums">
                    Lump Sum
                    {lumpNetHigher ? (
                      <span className="ml-1 text-[10px] font-medium text-primary">
                        (higher net)
                      </span>
                    ) : null}
                  </th>
                  <th className="px-3 py-2 font-semibold tabular-nums">
                    Annuity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(
                  [
                    ['Gross Payout', result.lumpSum.grossPayout, result.annuity.grossPayout],
                    [
                      'Federal Withholding (24%)',
                      result.lumpSum.federalWithholding,
                      result.annuity.federalWithholding,
                    ],
                    ['Est. Federal Tax Liability', result.lumpSum.federalTax, result.annuity.federalTax],
                    ['State Tax', result.lumpSum.stateTax, result.annuity.stateTax],
                    ['Total Estimated Taxes', result.lumpSum.totalTax, result.annuity.totalTax],
                    ['Net Payout', result.lumpSum.netPayout, result.annuity.netPayout],
                  ] as const
                ).map(([label, lump, annuity]) => (
                  <tr
                    key={label}
                    className={
                      label === 'Net Payout' || label === 'Total Estimated Taxes'
                        ? 'bg-brand-softTeal/25'
                        : undefined
                    }
                  >
                    <td className="px-3 py-2 font-medium text-accent">{label}</td>
                    <td
                      className={`px-3 py-2 tabular-nums ${
                        label === 'Net Payout' && lumpNetHigher
                          ? 'font-semibold text-primary'
                          : ''
                      }`}
                    >
                      {money(lump)}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{money(annuity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Annuity taxes are estimated on each annual payment. Federal
            withholding is shown separately from estimated final federal tax
            liability. A larger nominal annuity total is not necessarily higher
            present-day value. {result.futureTaxAssumptionNote}
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Tax estimates are illustrative and may differ from your actual tax
            liability.
          </p>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">First payment</p>
              <p className="text-sm font-semibold tabular-nums text-accent">
                {money(result.annuityFirstPayment)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Last payment</p>
              <p className="text-sm font-semibold tabular-nums text-accent">
                {money(result.annuityLastPayment)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Cash option %</p>
              <p className="text-sm font-semibold tabular-nums text-accent">
                {result.lumpSumPercent}%
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-accent"
              onClick={() => setScheduleOpen((o) => !o)}
              aria-expanded={scheduleOpen}
            >
              <span>Yearly annuity payouts</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${scheduleOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
            {scheduleOpen ? (
              <div className="max-h-80 overflow-auto border-t border-border">
                <table className="min-w-full text-left text-[11px] sm:text-xs">
                  <thead className="sticky top-0 bg-muted/80 text-accent backdrop-blur">
                    <tr>
                      <th className="px-2 py-2 font-semibold">Year</th>
                      <th className="px-2 py-2 font-semibold">Gross</th>
                      <th className="px-2 py-2 font-semibold">Federal</th>
                      <th className="px-2 py-2 font-semibold">State</th>
                      <th className="px-2 py-2 font-semibold">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.annualPayments.map((row) => (
                      <tr key={row.year}>
                        <td className="px-2 py-1.5 tabular-nums">{row.year}</td>
                        <td className="px-2 py-1.5 tabular-nums">
                          {money(row.grossPayment)}
                        </td>
                        <td className="px-2 py-1.5 tabular-nums">
                          {money(row.federalTax)}
                        </td>
                        <td className="px-2 py-1.5 tabular-nums">
                          {money(row.stateTax)}
                        </td>
                        <td className="px-2 py-1.5 tabular-nums font-medium">
                          {money(row.netPayment)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="h-10">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-10" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="ghost" className="h-10" onClick={onClear}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
