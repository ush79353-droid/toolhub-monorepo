'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AltmanZScoreFieldErrors,
  AltmanZScoreInput,
  AltmanZScoreResult,
  MarketEquitySource,
  RetainedEarningsSource,
  WorkingCapitalSource,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        {title}
        <span className="text-muted-foreground font-normal">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-3 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

interface AltmanZScoreFormProps {
  input: AltmanZScoreInput;
  errors: AltmanZScoreFieldErrors;
  result: AltmanZScoreResult | null;
  onChange: (input: AltmanZScoreInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function AltmanZScoreForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: AltmanZScoreFormProps) {
  const [openNwc, setOpenNwc] = useState(true);
  const [openMve, setOpenMve] = useState(true);
  const [openRe, setOpenRe] = useState(true);
  const [openZ, setOpenZ] = useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<AltmanZScoreInput>) =>
    onChange({ ...input, ...patch });

  const moneyField = (
    id: string,
    label: string,
    key: keyof AltmanZScoreInput,
    error: string | undefined,
    opts?: {
      tooltip?: string;
      tooltipLabel?: string;
      muted?: boolean;
      display?: string;
      placeholder?: string;
    }
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {opts?.tooltip ? (
          <InfoTooltip
            label={opts.tooltipLabel ?? label}
            text={opts.tooltip}
          />
        ) : null}
      </label>
      <FieldShell error={error} muted={opts?.muted}>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          readOnly={opts?.muted}
          aria-readonly={opts?.muted}
          value={opts?.muted ? (opts.display ?? '') : String(input[key])}
          onChange={(e) => set({ [key]: e.target.value })}
          placeholder={opts?.placeholder}
        />
      </FieldShell>
      {error ? (
        <p className="mt-1 text-xs text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Original five-factor Altman Z-Score for publicly traded manufacturing
        firms. Currency is denomination only (not FX). Keep sales and EBIT on
        the same reporting period as the balance-sheet figures. Screening model
 only; not a bankruptcy probability.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="az-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (Z ≈ 2.902 · grey zone)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <Section
        title="Net Working Capital Calculation"
        open={openNwc}
        onToggle={() => setOpenNwc((v) => !v)}
      >
        <div>
          <label htmlFor="az-nwc-src" className={labelClass}>
            Working capital method
          </label>
          <select
            id="az-nwc-src"
            className={selectClass}
            value={input.workingCapitalSource}
            onChange={(e) =>
              set({
                workingCapitalSource: e.target.value as WorkingCapitalSource,
              })
            }
          >
            <option value="balance-sheet">
 Full balance sheet (CA − CL): recommended
            </option>
            <option value="simplified">
              Simplified (AR + Inventory − AP)
            </option>
            <option value="direct">Enter NWC directly</option>
          </select>
        </div>
        {input.workingCapitalSource === 'balance-sheet' ? (
          <>
            {moneyField(
              'az-ca',
              'Current assets',
              'currentAssets',
              errors.currentAssets,
              { placeholder: '1500000' }
            )}
            {moneyField(
              'az-cl',
              'Current liabilities',
              'currentLiabilities',
              errors.currentLiabilities,
              { placeholder: '700000' }
            )}
          </>
        ) : null}
        {input.workingCapitalSource === 'simplified' ? (
          <>
            <p className="text-[11px] text-muted-foreground">
 Simplified estimate: omits cash, accruals, short-term debt, and
              other CA/CL items.
            </p>
            {moneyField(
              'az-ar',
              'Accounts receivable',
              'accountsReceivable',
              errors.accountsReceivable,
              {
                tooltip:
                  'Money owed to the company by customers for goods or services already delivered.',
                tooltipLabel: 'Accounts receivable',
                placeholder: '500000',
              }
            )}
            {moneyField(
              'az-inv',
              'Inventory',
              'inventory',
              errors.inventory,
              {
                tooltip: 'The value of goods held for sale or use in production.',
                tooltipLabel: 'Inventory',
                placeholder: '300000',
              }
            )}
            {moneyField(
              'az-ap',
              'Accounts payable',
              'accountsPayable',
              errors.accountsPayable,
              {
                tooltip:
                  'Amounts owed by the company to suppliers and vendors.',
                tooltipLabel: 'Accounts payable',
                placeholder: '200000',
              }
            )}
          </>
        ) : null}
        {input.workingCapitalSource === 'direct'
          ? moneyField(
              'az-wc-direct',
              'Net working capital',
              'workingCapital',
              errors.workingCapital,
              { placeholder: '800000' }
            )
          : moneyField(
              'az-wc-out',
              'Net working capital',
              'workingCapital',
              undefined,
              {
                muted: true,
                display: result?.formattedWorkingCapital ?? '',
                tooltip:
                  input.workingCapitalSource === 'simplified'
                    ? 'Simplified AR+I−AP estimate, not full CA−CL.'
                    : 'NWC = Current assets − Current liabilities.',
                tooltipLabel: 'Net working capital',
              }
            )}
      </Section>

      <Section
        title="Market Value of Equity Calculation"
        open={openMve}
        onToggle={() => setOpenMve((v) => !v)}
      >
        <div>
          <label htmlFor="az-mve-src" className={labelClass}>
            Equity input method
          </label>
          <select
            id="az-mve-src"
            className={selectClass}
            value={input.marketEquitySource}
            onChange={(e) =>
              set({
                marketEquitySource: e.target.value as MarketEquitySource,
              })
            }
          >
            <option value="direct">Enter market capitalization</option>
            <option value="shares">Shares × share price</option>
          </select>
        </div>
        {input.marketEquitySource === 'shares' ? (
          <>
            <div>
              <label htmlFor="az-shares" className={labelClass}>
                Shares outstanding
                <InfoTooltip
                  label="Shares outstanding"
                  text="Total company shares outstanding."
                />
              </label>
              <FieldShell error={errors.sharesOutstanding}>
                <input
                  id="az-shares"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.sharesOutstanding}
                  onChange={(e) => set({ sharesOutstanding: e.target.value })}
                  placeholder="10000000"
                />
                <span className="pr-3 text-xs text-muted-foreground">
                  shares
                </span>
              </FieldShell>
              {errors.sharesOutstanding ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.sharesOutstanding}
                </p>
              ) : null}
            </div>
            {moneyField(
              'az-price',
              'Share price',
              'sharePrice',
              errors.sharePrice,
              {
                tooltip: 'Current market price of one share.',
                tooltipLabel: 'Share price',
                placeholder: '50',
              }
            )}
          </>
        ) : null}
        {input.marketEquitySource === 'direct'
          ? moneyField(
              'az-mve-direct',
              'Market value of equity',
              'marketValueOfEquity',
              errors.marketValueOfEquity,
              {
                tooltip:
                  'Market capitalization; not book equity. Original Altman Z uses market value.',
                tooltipLabel: 'Market value of equity',
                placeholder: '3000000',
              }
            )
          : moneyField(
              'az-mve-out',
              'Market value of equity',
              'marketValueOfEquity',
              undefined,
              {
                muted: true,
                display: result?.formattedMve ?? '',
                tooltip:
                  'Market capitalization (shares × price), not book equity.',
                tooltipLabel: 'Market value of equity',
              }
            )}
      </Section>

      <Section
        title="Retained Earnings Calculation"
        open={openRe}
        onToggle={() => setOpenRe((v) => !v)}
      >
        <div>
          <label htmlFor="az-re-src" className={labelClass}>
            Retained earnings method
          </label>
          <select
            id="az-re-src"
            className={selectClass}
            value={input.retainedEarningsSource}
            onChange={(e) =>
              set({
                retainedEarningsSource: e.target
                  .value as RetainedEarningsSource,
              })
            }
          >
            <option value="direct">Enter balance-sheet RE</option>
            <option value="rollforward">
              Roll forward (RE_begin + NI − Dividends)
            </option>
          </select>
        </div>
        {input.retainedEarningsSource === 'rollforward' ? (
          <>
            {moneyField(
              'az-re-begin',
              'Beginning retained earnings',
              'beginningRetainedEarnings',
              errors.beginningRetainedEarnings,
              { placeholder: '150000000' }
            )}
            {moneyField(
              'az-ni',
              'Net income',
              'netIncome',
              errors.netIncome,
              {
                tooltip:
                  'Profit after expenses and taxes for the period (may be negative).',
                tooltipLabel: 'Net income',
                placeholder: '80000000',
              }
            )}
            {moneyField(
              'az-dps',
              'Dividend per share',
              'dividendPerShare',
              errors.dividendPerShare,
              { placeholder: '2' }
            )}
            <div>
              <label htmlFor="az-re-shares" className={labelClass}>
                Shares outstanding (for dividends)
              </label>
              <FieldShell error={errors.sharesOutstanding}>
                <input
                  id="az-re-shares"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.sharesOutstanding}
                  onChange={(e) => set({ sharesOutstanding: e.target.value })}
                  placeholder="10000000"
                />
              </FieldShell>
              {errors.sharesOutstanding ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.sharesOutstanding}
                </p>
              ) : null}
            </div>
            {moneyField(
              'az-other-div',
              'Other dividends / adjustments',
              'otherDividends',
              errors.otherDividends,
              { placeholder: '0' }
            )}
          </>
        ) : null}
        {input.retainedEarningsSource === 'direct'
          ? moneyField(
              'az-re-direct',
              'Retained earnings',
              'retainedEarnings',
              errors.retainedEarnings,
              {
                tooltip:
                  'Cumulative RE from the balance sheet; may be negative.',
                tooltipLabel: 'Retained earnings',
                placeholder: '1000000',
              }
            )
          : moneyField(
              'az-re-out',
              'Ending retained earnings',
              'retainedEarnings',
              undefined,
              {
                muted: true,
                display: result?.formattedRetainedEarnings ?? '',
              }
            )}
      </Section>

      <Section
        title="Altman Z-Score"
        open={openZ}
        onToggle={() => setOpenZ((v) => !v)}
      >
        {moneyField('az-sales', 'Sales', 'sales', errors.sales, {
          tooltip:
            'Net revenue for the same reporting period as EBIT; do not mix annual sales with quarterly EBIT.',
          tooltipLabel: 'Sales',
          placeholder: '6000000',
        })}
        {moneyField('az-ebit', 'EBIT', 'ebit', errors.ebit, {
          tooltip: 'Earnings before interest and taxes (may be negative).',
          tooltipLabel: 'EBIT',
          placeholder: '500000',
        })}
        {moneyField(
          'az-ta',
          'Total assets',
          'totalAssets',
          errors.totalAssets,
          { placeholder: '5000000' }
        )}
        {moneyField(
          'az-tl',
          'Total liabilities',
          'totalLiabilities',
          errors.totalLiabilities,
          { placeholder: '2000000' }
        )}
        {moneyField(
          'az-wc-z',
          'Net working capital',
          'workingCapital',
          undefined,
          {
            muted: true,
            display: result?.formattedWorkingCapital ?? '',
          }
        )}
        {moneyField(
          'az-mve-z',
          'Market value of equity',
          'marketValueOfEquity',
          undefined,
          { muted: true, display: result?.formattedMve ?? '' }
        )}
        {moneyField(
          'az-re-z',
          'Retained earnings',
          'retainedEarnings',
          undefined,
          {
            muted: true,
            display: result?.formattedRetainedEarnings ?? '',
          }
        )}
        <div>
          <label htmlFor="az-z" className={labelClass}>
            Altman Z-Score
          </label>
          <FieldShell muted>
            <input
              id="az-z"
              className={inputClass}
              readOnly
              aria-readonly
              value={result?.formattedZScore ?? ''}
              placeholder="0.000"
            />
          </FieldShell>
        </div>
      </Section>
    </form>
  );
}
