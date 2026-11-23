'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatDisplayDate } from './calculation';
import type {
  ImplantationFieldErrors,
  ImplantationInput,
  ImplantationResult,
  OvulationKnowledge,
} from './types';

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

function Panel({
  title,
  panelId,
  open,
  onToggle,
  children,
}: {
  title: string;
  panelId: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="text-sm font-semibold text-accent">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-primary" />
        )}
      </button>
      {open ? (
        <div id={panelId} className="space-y-3.5 border-t border-border px-4 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

interface Props {
  input: ImplantationInput;
  errors: ImplantationFieldErrors;
  result: ImplantationResult | null;
  onChange: (input: ImplantationInput) => void;
}

export function ImplantationForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const [naturalOpen, setNaturalOpen] = useState(true);
  const [ivfOpen, setIvfOpen] = useState(true);

  const setNatural = (patch: Partial<ImplantationInput['natural']>) =>
    onChange({ ...input, natural: { ...input.natural, ...patch } });

  const setIvf = (patch: Partial<ImplantationInput['ivf']>) =>
    onChange({ ...input, ivf: { ...input.ivf, ...patch } });

  const onKnowsOvulation = (value: OvulationKnowledge) => {
    onChange({
      natural: {
        ...input.natural,
        knowsOvulation: value,
        ovulationIso: value === 'yes' ? input.natural.ovulationIso : '',
        lastPeriodIso: value === 'no' ? input.natural.lastPeriodIso : '',
        cycleLengthDaysText:
          value === 'no' ? input.natural.cycleLengthDaysText || '28' : '28',
      },
      ivf: input.ivf,
    });
  };

  const naturalImplantDisplay = result?.natural.window?.formattedTypical ?? '';
  const ivfImplantDisplay = result?.ivf.window?.formattedTypical ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational implantation timing from ovulation or IVF transfer. Entries
        stay in your browser — share copies the public page URL only.
      </p>

      <Panel
        title="Natural conception"
        panelId="implantation-natural"
        open={naturalOpen}
        onToggle={() => setNaturalOpen((v) => !v)}
      >
        <NaturalSection
          input={input}
          errors={errors}
          result={result}
          onKnowsOvulation={onKnowsOvulation}
          setNatural={setNatural}
          naturalImplantDisplay={naturalImplantDisplay}
        />
      </Panel>

      <Panel
        title="Fertility treatment"
        panelId="implantation-ivf"
        open={ivfOpen}
        onToggle={() => setIvfOpen((v) => !v)}
      >
        <div>
          <label htmlFor="impl-transfer" className={labelClass}>
            IVF transfer day
            <InfoTooltip text="Calendar day of embryo transfer. Implantation timing shown as an educational window without assuming embryo stage." />
          </label>
          <FieldShell error={errors.ivfTransfer}>
            <input
              id="impl-transfer"
              type="date"
              className={inputClass}
              value={input.ivf.transferIso}
              aria-invalid={Boolean(errors.ivfTransfer)}
              onChange={(e) => setIvf({ transferIso: e.target.value })}
            />
          </FieldShell>
          {!input.ivf.transferIso ? (
            <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
          ) : null}
          {errors.ivfTransfer ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ivfTransfer}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="impl-ivf-date" className={labelClass}>
            Implantation date
            <InfoTooltip text="Estimated typical day within an educational post-transfer window. Not ultrasound dating." />
          </label>
          <FieldShell muted>
            <output
              id="impl-ivf-date"
              className="w-full px-3 text-sm tabular-nums font-medium text-accent"
              aria-live="polite"
            >
              {ivfImplantDisplay}
            </output>
          </FieldShell>
          {!ivfImplantDisplay ? (
            <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
          ) : result?.ivf.window ? (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Estimated window: {result.ivf.window.formattedStart} –{' '}
              {result.ivf.window.formattedEnd}. {result.ivfNote}
            </p>
          ) : null}
        </div>
      </Panel>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result?.disclaimer ??
          'Educational estimate only — not medical advice or ultrasound confirmation.'}
      </p>
    </form>
  );
}

function NaturalSection({
  input,
  errors,
  result,
  onKnowsOvulation,
  setNatural,
  naturalImplantDisplay,
}: {
  input: ImplantationInput;
  errors: ImplantationFieldErrors;
  result: ImplantationResult | null;
  onKnowsOvulation: (v: OvulationKnowledge) => void;
  setNatural: (patch: Partial<ImplantationInput['natural']>) => void;
  naturalImplantDisplay: string;
}) {
  return (
    <>
      <div>
        <div className={labelClass}>
          Know your ovulation date?
          <InfoTooltip text="Choose Yes to enter ovulation directly. Choose No to estimate ovulation from last period and cycle length." />
        </div>
        <div
          className="flex flex-wrap gap-4"
          role="radiogroup"
          aria-label="Know your ovulation date"
        >
          {(
            [
              ['yes', 'Yes'],
              ['no', 'No'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="impl-knows-ovulation"
                className="h-4 w-4 accent-primary"
                checked={input.natural.knowsOvulation === value}
                onChange={() => onKnowsOvulation(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {input.natural.knowsOvulation === 'yes' ? (
        <div>
          <label htmlFor="impl-ovulation" className={labelClass}>
            Ovulation date
          </label>
          <FieldShell error={errors.naturalOvulation}>
            <input
              id="impl-ovulation"
              type="date"
              className={inputClass}
              value={input.natural.ovulationIso}
              aria-invalid={Boolean(errors.naturalOvulation)}
              onChange={(e) => setNatural({ ovulationIso: e.target.value })}
            />
          </FieldShell>
          {!input.natural.ovulationIso ? (
            <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
          ) : null}
          {errors.naturalOvulation ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.naturalOvulation}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="impl-cycle" className={labelClass}>
              Menstrual cycle length
              <InfoTooltip text="Typical cycles 21–45 days. Ovulation estimated as cycle length minus 14 days from the first day of your last period." />
            </label>
            <FieldShell error={errors.naturalCycle}>
              <input
                id="impl-cycle"
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={input.natural.cycleLengthDaysText}
                onChange={(e) =>
                  setNatural({ cycleLengthDaysText: e.target.value })
                }
              />
              <span className="shrink-0 border-l border-border px-3 text-sm text-primary">
                days
              </span>
            </FieldShell>
            {errors.naturalCycle ? (
              <p className="mt-1 text-xs text-rose-600">{errors.naturalCycle}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="impl-lmp" className={labelClass}>
              Your last period
            </label>
            <FieldShell error={errors.naturalLmp}>
              <input
                id="impl-lmp"
                type="date"
                className={inputClass}
                value={input.natural.lastPeriodIso}
                onChange={(e) => setNatural({ lastPeriodIso: e.target.value })}
              />
            </FieldShell>
            {errors.naturalLmp ? (
              <p className="mt-1 text-xs text-rose-600">{errors.naturalLmp}</p>
            ) : null}
          </div>
          {result?.natural.ovulationEstimated && result.natural.ovulationIso ? (
            <p className="text-xs text-muted-foreground">
              Estimated ovulation:{' '}
              {formatDisplayDate(result.natural.ovulationIso)}
            </p>
          ) : null}
        </>
      )}

      <div>
        <label htmlFor="impl-natural-date" className={labelClass}>
          Implantation date
          <InfoTooltip text="Typical day within the 6–12 day post-ovulation educational window (Wilcox 1999)." />
        </label>
        <FieldShell muted>
          <output
            id="impl-natural-date"
            className="w-full px-3 text-sm tabular-nums font-medium text-accent"
            aria-live="polite"
          >
            {naturalImplantDisplay}
          </output>
        </FieldShell>
        {!naturalImplantDisplay ? (
          <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
        ) : result?.natural.window ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Estimated window: {result.natural.window.formattedStart} –{' '}
            {result.natural.window.formattedEnd}. {result.naturalNote}
          </p>
        ) : null}
      </div>
    </>
  );
}