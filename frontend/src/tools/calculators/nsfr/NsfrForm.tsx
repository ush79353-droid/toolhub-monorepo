'use client';

import { useState, type ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { NsfrFieldErrors, NsfrInput, NsfrResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface NsfrFormProps {
  input: NsfrInput;
  errors: NsfrFieldErrors;
  result: NsfrResult | null;
  onChange: (input: NsfrInput) => void;
  onLoadExample: () => void;
  onLoadAsfExample: () => void;
}

export function NsfrForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
  onLoadAsfExample,
}: NsfrFormProps) {
  const [showAsf, setShowAsf] = useState(false);
  const [showRsf, setShowRsf] = useState(false);
  const set = (patch: Partial<NsfrInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
 NSFR = ASF ÷ RSF × 100. Educational Basel III–style estimate; not a
        regulatory filing or compliance determination. Fixed USD formatting.
      </p>

      <div className="flex flex-wrap gap-3 text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example ($170M / $150M → 113.33%)
        </button>
        <button
          type="button"
          onClick={onLoadAsfExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load ASF helper example
        </button>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setShowAsf((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-accent"
          aria-expanded={showAsf}
        >
          Calculate Available Stable Funding
          <span className="text-xs font-normal text-muted-foreground">
            {showAsf ? 'Hide' : 'Show'}
          </span>
        </button>
        {showAsf ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Illustrative ASF factors: capital 100%, stable deposits 95%,
              less-stable 90%, qualifying wholesale 50%, certain short-term 0%.
              When filled, weighted ASF replaces the manual ASF field.
            </p>
            {(
              [
                [
                  'regulatoryCapital',
                  'Eligible regulatory capital',
                  '100% ASF where eligible',
                  errors.regulatoryCapital,
                ],
                [
                  'stableDeposits',
                  'Stable retail / SMB deposits',
                  '95% ASF where eligible',
                  errors.stableDeposits,
                ],
                [
                  'lessStableDeposits',
                  'Less-stable retail / SMB deposits',
                  '90% ASF where eligible',
                  errors.lessStableDeposits,
                ],
                [
                  'funding50Percent',
                  'Qualifying 50% ASF funding',
                  '50% ASF',
                  errors.funding50Percent,
                ],
                [
                  'funding0Percent',
                  '0% ASF funding',
                  '0% ASF',
                  errors.funding0Percent,
                ],
              ] as const
            ).map(([key, label, tip, err]) => (
              <div key={key}>
                <label htmlFor={`nsfr-${key}`} className={labelClass}>
                  {label}
                  <InfoTooltip label={label} text={tip} />
                </label>
                <FieldShell error={err}>
                  <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                    $
                  </span>
                  <input
                    id={`nsfr-${key}`}
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input[key]}
                    onChange={(e) => set({ [key]: e.target.value })}
                    placeholder="0"
                  />
                </FieldShell>
                {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
              </div>
            ))}
            {result?.asfHelper ? (
              <div className="rounded-lg bg-muted/20 px-3 py-2 text-xs text-accent">
                <p>
                  Unweighted total:{' '}
                  <span className="font-semibold tabular-nums">
                    {result.asfHelper.formattedUnweighted}
                  </span>
                </p>
                <p>
                  Weighted ASF:{' '}
                  <span className="font-semibold tabular-nums">
                    {result.asfHelper.formattedWeighted}
                  </span>
                </p>
                <p className="mt-1 text-muted-foreground">
                  {result.asfHelper.note}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setShowRsf((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-accent"
          aria-expanded={showRsf}
        >
          Optional: calculate Required Stable Funding
          <span className="text-xs font-normal text-muted-foreground">
            {showRsf ? 'Hide' : 'Show'}
          </span>
        </button>
        {showRsf ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <p className="text-xs text-muted-foreground">
              Illustrative RSF factors (0%–100% + 5% OBS). When filled, weighted
              RSF replaces the manual RSF field.
            </p>
            {(
              [
                ['cashAndCentralBankReserves', 'Cash & CB reserves (0%)'],
                ['unencumberedLevel1Hqla', 'Level 1 HQLA (5%)'],
                [
                  'shortTermFinancialInstitution',
                  'Short-term FI exposures (15%)',
                ],
                ['level2AHqla', 'Level 2A HQLA (15%)'],
                ['level2BAndShortTerm', 'Level 2B / short-term (50%)'],
                ['residentialMortgages', 'Residential mortgages (65%)'],
                ['otherPerformingLoans', 'Other performing loans (85%)'],
                ['highRsfAssets', 'High-RSF assets (100%)'],
                [
                  'offBalanceSheetCommitments',
                  'Off-balance-sheet commitments (5%)',
                ],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label htmlFor={`nsfr-${key}`} className={labelClass}>
                  {label}
                </label>
                <FieldShell error={errors[key]}>
                  <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                    $
                  </span>
                  <input
                    id={`nsfr-${key}`}
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input[key]}
                    onChange={(e) => set({ [key]: e.target.value })}
                    placeholder="0"
                  />
                </FieldShell>
                {errors[key] ? (
                  <p className="mt-1 text-xs text-rose-600">{errors[key]}</p>
                ) : null}
              </div>
            ))}
            {result?.rsfHelper ? (
              <div className="rounded-lg bg-muted/20 px-3 py-2 text-xs text-accent">
                <p>
                  Weighted RSF:{' '}
                  <span className="font-semibold tabular-nums">
                    {result.rsfHelper.formattedWeighted}
                  </span>
                </p>
                <p className="mt-1 text-muted-foreground">
                  {result.rsfHelper.note}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="nsfr-asf" className={labelClass}>
          Available Stable Funding (ASF)
          <InfoTooltip
            label="ASF"
            text="Weighted stable funding (capital and liabilities) under the selected educational factors."
          />
        </label>
        <FieldShell
          error={errors.availableStableFunding}
          muted={Boolean(result?.asfHelper)}
        >
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="nsfr-asf"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={
              result?.asfHelper
                ? result.asfHelper.formattedWeighted.replace(/^\$/, '')
                : input.availableStableFunding
            }
            readOnly={Boolean(result?.asfHelper)}
            onChange={(e) => set({ availableStableFunding: e.target.value })}
            placeholder="170,000,000"
          />
        </FieldShell>
        {errors.availableStableFunding ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.availableStableFunding}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="nsfr-rsf" className={labelClass}>
          Required Stable Funding (RSF)
          <InfoTooltip
            label="RSF"
            text="Weighted funding needed for assets and OBS items under illustrative factors."
          />
        </label>
        <FieldShell
          error={errors.requiredStableFunding}
          muted={Boolean(result?.rsfHelper)}
        >
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="nsfr-rsf"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={
              result?.rsfHelper
                ? result.rsfHelper.formattedWeighted.replace(/^\$/, '')
                : input.requiredStableFunding
            }
            readOnly={Boolean(result?.rsfHelper)}
            onChange={(e) => set({ requiredStableFunding: e.target.value })}
            placeholder="150,000,000"
          />
        </FieldShell>
        {errors.requiredStableFunding ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.requiredStableFunding}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="nsfr-out" className={labelClass}>
          Net Stable Funding Ratio (NSFR)
        </label>
        <FieldShell muted>
          <input
            id="nsfr-out"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold`}
            value={result?.formattedNsfr ?? ''}
            placeholder="—"
          />
        </FieldShell>
      </div>
    </form>
  );
}
