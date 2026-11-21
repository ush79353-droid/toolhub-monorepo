'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMegaMoney, formatMegaPercent } from './calculation';
import type {
  FilingStatus,
  MegaMillionsPayoutFieldErrors,
  MegaMillionsPayoutInput,
  MegaMillionsPayoutResult,
} from './types';
import { FILING_STATUS_OPTIONS } from './types';
import { US_STATE_OPTIONS } from './us-states';

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

interface MegaMillionsPayoutFormProps {
  input: MegaMillionsPayoutInput;
  errors: MegaMillionsPayoutFieldErrors;
  result: MegaMillionsPayoutResult | null;
  onChange: (next: MegaMillionsPayoutInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function MegaMillionsPayoutForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: MegaMillionsPayoutFormProps) {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [stateQuery, setStateQuery] = React.useState('');

  const set = (patch: Partial<MegaMillionsPayoutInput>) => {
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

  const money = (v: number) => formatMegaMoney(v);
  const lumpNetHigher =
    result !== null && result.lumpSum.netPayout >= result.annuity.netPayout;
  const annuityGrossHigher =
    result !== null && result.annuity.grossPayout > result.lumpSum.grossPayout;

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
          Compare Mega Millions lump-sum and 30-payment annuity options with
          estimated federal and state taxes. USD only. Estimates assume no other
          taxable income.
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
            <label htmlFor="mm-jackpot">How much did you win?</label>
            <InfoTooltip
              label="Advertised jackpot"
              text="Enter the advertised Mega Millions annuity jackpot, not the cash option amount."
              align="left"
            />
          </div>
          <FieldShell error={errors.jackpot}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">
              $
            </span>
            <input
              id="mm-jackpot"
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
            <label htmlFor="mm-annuity-rate">Annuity rate (%)</label>
            <InfoTooltip
              label="Annuity rate"
              text="Annual growth used for graduated annuity payments. Mega Millions typically uses 5%."
              align="left"
            />
          </div>
          <FieldShell error={errors.annuityRatePercent}>
            <input
              id="mm-annuity-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.annuityRatePercent}
              onChange={(e) => set({ annuityRatePercent: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.annuityRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annuityRatePercent}
            </p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="mm-filing">What is your filing status?</label>
          </div>
          <select
            id="mm-filing"
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
          {errors.filingStatus ? (
            <p className="mt-1 text-xs text-rose-600">{errors.filingStatus}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="mm-state-search">Where do you live?</label>
            <InfoTooltip
              label="State of residence"
              text="Used only for estimated state income tax. This is not based on your device location. Choose a no-income-tax state when applicable."
              align="left"
            />
          </div>
          <input
            id="mm-state-search"
            className={`${selectClass} mb-2`}
            placeholder="Search states…"
            value={stateQuery}
            onChange={(e) => setStateQuery(e.target.value)}
            aria-label="Search US states"
          />
          <select
            id="mm-state"
            className={selectClass}
            value={input.state}
            onChange={(e) =>
              set({
                state: e.target.value as MegaMillionsPayoutInput['state'],
              })
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

        <div>
          <div className={labelClass}>
            <label htmlFor="mm-lump-pct">Lump sum payout percentage (%)</label>
            <InfoTooltip
              label="Lump-sum percentage"
              text="Cash option as a percent of the advertised jackpot. Official cash values are set by the lottery and can differ."
              align="left"
            />
          </div>
          <FieldShell error={errors.lumpSumPercent}>
            <input
              id="mm-lump-pct"
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
              Tax year {result.taxYear} · no other income assumed
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
                    {annuityGrossHigher ? (
                      <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                        (higher nominal)
                      </span>
                    ) : null}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(
                  [
                    ['Gross Payout', result.lumpSum.grossPayout, result.annuity.grossPayout],
                    ['Federal Tax', result.lumpSum.federalTax, result.annuity.federalTax],
                    ['State Tax', result.lumpSum.stateTax, result.annuity.stateTax],
                    [
                      'Total Estimated Taxes',
                      result.lumpSum.totalTax,
                      result.annuity.totalTax,
                    ],
                    ['Net Payout', result.lumpSum.netPayout, result.annuity.netPayout],
                  ] as const
                ).map(([label, lump, annuity]) => {
                  const emphasize =
                    label === 'Net Payout' || label === 'Total Estimated Taxes';
                  return (
                    <tr
                      key={label}
                      className={emphasize ? 'bg-brand-softTeal/25' : undefined}
                    >
                      <td className="px-3 py-2 font-medium text-accent">
                        {label}
                      </td>
                      <td
                        className={`px-3 py-2 tabular-nums ${
                          label === 'Net Payout' && lumpNetHigher
                            ? 'font-semibold text-primary'
                            : 'text-foreground'
                        }`}
                      >
                        {money(lump)}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-foreground">
                        {money(annuity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Annuity taxes are estimated on each annual payment (not on the full
            jackpot in one year). A larger nominal annuity total is not
            necessarily a higher present-day economic value.{' '}
            {result.futureTaxAssumptionNote}
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Tax estimates are illustrative and may differ from your actual tax
            liability. Your final tax situation depends on your income,
            deductions, residence, applicable tax laws, and other personal
            circumstances.
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
              <p className="text-[11px] text-muted-foreground">
                Lump-sum cash %
              </p>
              <p className="text-sm font-semibold tabular-nums text-accent">
                {formatMegaPercent(result.lumpSumPercent)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-accent"
              onClick={() => setScheduleOpen((open) => !open)}
              aria-expanded={scheduleOpen}
            >
              <span>Yearly Annuity Payouts</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  scheduleOpen ? 'rotate-180' : ''
                }`}
                aria-hidden
              />
            </button>
            {scheduleOpen ? (
              <div className="max-h-80 overflow-auto border-t border-border">
                <table className="min-w-full text-left text-[11px] sm:text-xs">
                  <thead className="sticky top-0 bg-muted/80 text-accent backdrop-blur">
                    <tr>
                      <th className="px-2 py-2 font-semibold">#</th>
                      <th className="px-2 py-2 font-semibold">Gross</th>
                      <th className="px-2 py-2 font-semibold">Federal</th>
                      <th className="px-2 py-2 font-semibold">State</th>
                      <th className="px-2 py-2 font-semibold">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.annuitySchedule.map((row) => (
                      <tr key={row.paymentNumber}>
                        <td className="px-2 py-1.5 tabular-nums">
                          {row.paymentNumber}
                        </td>
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
