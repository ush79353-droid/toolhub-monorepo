'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ForwardPremiumEditedField,
  ForwardPremiumFieldErrors,
  ForwardPremiumInput,
  ForwardPremiumResult,
} from './types';
import { FORWARD_PREMIUM_DAY_COUNT_BASIS } from './types';

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

function SectionCard({
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
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-accent">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-primary" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary" aria-hidden />
        )}
      </button>
      {open ? <div className="space-y-3 border-t border-border px-4 py-3">{children}</div> : null}
    </div>
  );
}

interface ForwardPremiumFormProps {
  input: ForwardPremiumInput;
  errors: ForwardPremiumFieldErrors;
  result: ForwardPremiumResult | null;
  onChange: (input: ForwardPremiumInput) => void;
  onLoadExample: () => void;
}

export function ForwardPremiumForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: ForwardPremiumFormProps) {
  const [premiumOpen, setPremiumOpen] = useState(true);
  const [annualizedOpen, setAnnualizedOpen] = useState(true);

  const setField = (field: ForwardPremiumEditedField, value: string) => {
    onChange({ ...input, [field]: value, lastEdited: field });
  };

  const premiumDisplay =
    input.lastEdited === 'spotRate' ||
    input.lastEdited === 'forwardRate' ||
    input.lastEdited === 'durationDays'
      ? (result?.forwardPremiumPercent != null
          ? String(result.forwardPremiumPercent)
          : input.forwardPremiumPercent)
      : input.forwardPremiumPercent;

  const annualizedDisplay =
    input.lastEdited === 'annualizedForwardPremiumPercent'
      ? input.annualizedForwardPremiumPercent
      : result?.annualizedForwardPremiumPercent != null
        ? String(result.annualizedForwardPremiumPercent)
        : input.annualizedForwardPremiumPercent;

  const forwardDisplay =
    input.lastEdited === 'forwardPremiumPercent' ||
    input.lastEdited === 'annualizedForwardPremiumPercent'
      ? (result?.forwardRate != null ? String(result.forwardRate) : input.forwardRate)
      : input.forwardRate;

  const spotDisplay =
    input.lastEdited === 'forwardPremiumPercent' ||
    input.lastEdited === 'annualizedForwardPremiumPercent'
      ? input.spotRate !== ''
        ? input.spotRate
        : result?.spotRate != null
          ? String(result.spotRate)
          : ''
      : input.spotRate;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Forward premium % = ((forward − spot) / spot) × 100. Annualized premium
        uses a {FORWARD_PREMIUM_DAY_COUNT_BASIS}-day year: premium × (
        {FORWARD_PREMIUM_DAY_COUNT_BASIS} / days). Negative values are forward
        discounts. Spot and forward must share the same quote convention.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (1.25 / 1.28 · 90 days → 2.4% · ≈9.7333% ann.)
      </button>

      <SectionCard
        title="Forward Premium"
        open={premiumOpen}
        onToggle={() => setPremiumOpen((v) => !v)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="fp-spot" className={labelClass}>
              Spot rate
              <InfoTooltip
                label="Spot rate"
                text="The current exchange rate under your quote convention (for example, quote currency per 1 base). Must be greater than zero and consistent with the forward rate."
              />
            </label>
            <FieldShell error={errors.spotRate}>
              <input
                id="fp-spot"
                className={inputClass}
                inputMode="decimal"
                value={spotDisplay}
                onChange={(e) => setField('spotRate', e.target.value)}
                placeholder="1.25"
              />
            </FieldShell>
            {errors.spotRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.spotRate}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="fp-forward" className={labelClass}>
              Forward rate
              <InfoTooltip
                label="Forward rate"
                text="The agreed future exchange rate for the contract tenor, in the same quote units as the spot rate. Must be greater than zero."
              />
            </label>
            <FieldShell error={errors.forwardRate}>
              <input
                id="fp-forward"
                className={inputClass}
                inputMode="decimal"
                value={forwardDisplay}
                onChange={(e) => setField('forwardRate', e.target.value)}
                placeholder="1.28"
              />
            </FieldShell>
            {errors.forwardRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.forwardRate}</p>
            ) : null}
          </div>
        </div>
        <div>
          <label htmlFor="fp-premium" className={labelClass}>
            Forward premium
            <InfoTooltip
              label="Forward premium"
              text="Period premium as a percentage of spot: ((F − S) / S) × 100. Edit this field to reverse-solve the forward rate from spot (or spot from forward)."
            />
          </label>
          <FieldShell error={errors.forwardPremiumPercent}>
            <input
              id="fp-premium"
              className={inputClass}
              inputMode="decimal"
              value={premiumDisplay}
              onChange={(e) => setField('forwardPremiumPercent', e.target.value)}
              placeholder="2.4"
            />
            <span className="pr-3 text-sm font-medium text-primary">%</span>
          </FieldShell>
          {errors.forwardPremiumPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.forwardPremiumPercent}
            </p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        title="Annualized Forward Premium"
        open={annualizedOpen}
        onToggle={() => setAnnualizedOpen((v) => !v)}
      >
        <div>
          <label htmlFor="fp-duration" className={labelClass}>
            Forward contract duration
            <InfoTooltip
              label="Forward contract duration"
              text="Length of the forward contract in calendar days used for simple annualization. Must be greater than zero."
            />
          </label>
          <FieldShell error={errors.durationDays}>
            <input
              id="fp-duration"
              className={inputClass}
              inputMode="decimal"
              value={input.durationDays}
              onChange={(e) => setField('durationDays', e.target.value)}
              placeholder="90"
            />
            <span className="pr-3 text-sm text-muted-foreground">days</span>
          </FieldShell>
          {errors.durationDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.durationDays}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="fp-annualized" className={labelClass}>
            Annualized forward premium
            <InfoTooltip
              label="Annualized forward premium"
              text={`Simple annualization: period premium × (${FORWARD_PREMIUM_DAY_COUNT_BASIS} / days). Editing this field reverse-solves the period premium and linked forward rate.`}
            />
          </label>
          <FieldShell error={errors.annualizedForwardPremiumPercent}>
            <input
              id="fp-annualized"
              className={inputClass}
              inputMode="decimal"
              value={annualizedDisplay}
              onChange={(e) =>
                setField('annualizedForwardPremiumPercent', e.target.value)
              }
              placeholder="9.7333"
            />
            <span className="pr-3 text-sm font-medium text-primary">%</span>
          </FieldShell>
          {errors.annualizedForwardPremiumPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualizedForwardPremiumPercent}
            </p>
          ) : null}
        </div>
      </SectionCard>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
