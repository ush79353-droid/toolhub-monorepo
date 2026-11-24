'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '@/tools/calculators/auto-loan/InfoTooltip';
import type {
  BleedingStatus,
  DosePeriod,
  TargetInrRange,
  WarfarinDosingFieldErrors,
  WarfarinDosingInput,
  WarfarinDosingResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const inputClass =
  'h-11 w-full min-w-0 flex-1 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-primary outline-none';
const radioStack = 'space-y-2 text-sm text-accent';

function formatMg(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/\.?0+$/, '');
}

function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toPrecision(10)));
}

interface Props {
  input: WarfarinDosingInput;
  errors: WarfarinDosingFieldErrors;
  result: WarfarinDosingResult | null;
  onChange: (input: WarfarinDosingInput) => void;
}

export function WarfarinDosingForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<WarfarinDosingInput>) =>
    onChange({ ...input, ...patch });

  const switchDosePeriod = (next: DosePeriod) => {
    if (next === input.dosePeriod) return;
    const raw = input.doseText.trim().replace(/,/g, '');
    if (raw === '') {
      set({ dosePeriod: next });
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      set({ dosePeriod: next });
      return;
    }
    // Preserve physical weekly total: day ↔ week via ×7 / ÷7.
    const weekly = input.dosePeriod === 'wk' ? n : n * 7;
    const converted = next === 'wk' ? weekly : weekly / 7;
    set({ dosePeriod: next, doseText: formatConverted(converted) });
  };

  const showNumeric =
    result != null &&
    result.kind !== 'incomplete' &&
    result.kind !== 'bleeding_escalation' &&
    result.adjustedWeeklyLowMg != null &&
    result.adjustedWeeklyHighMg != null;

  const showInRange =
    result != null && result.kind === 'in_range' && result.weeklyDoseMg != null;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Educational maintenance worksheet — not a prescription
        </p>
        <p className="mt-1.5 text-foreground/85">
          Uses published clinic INR adjustment bands and ACCP bleeding
          pathways. Serious or life-threatening bleeding needs immediate
          clinical escalation — numeric dose output is suppressed. Entries
          stay in your browser only.
        </p>
      </div>

      <section className={sectionClass} aria-label="Warfarin dosing inputs">
        <Field
          label="Current INR"
          htmlFor="warfarin-inr"
          error={errors.inrText}
          tooltip="Most recent International Normalized Ratio from the laboratory or point-of-care device used for this visit."
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.inrText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="warfarin-inr"
              className={inputClass}
              value={input.inrText}
              inputMode="decimal"
              placeholder=""
              aria-invalid={Boolean(errors.inrText)}
              onChange={(e) => set({ inrText: e.target.value })}
            />
          </div>
        </Field>

        <fieldset>
          <legend className={labelClass}>
            <span>Bleeding</span>
            <InfoTooltip
              label="Bleeding"
              text="No significant bleeding uses the maintenance adjustment nomogram. Serious or life-threatening bleeding follows ACCP escalation guidance and suppresses numeric dose changes."
            />
          </legend>
          <div
            className={radioStack}
            role="radiogroup"
            aria-label="Bleeding"
          >
            {(
              [
                { value: 'none', label: 'No significant bleeding' },
                { value: 'serious', label: 'Serious bleeding' },
                {
                  value: 'life_threatening',
                  label: 'Life-threatening bleeding',
                },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-start gap-2"
              >
                <input
                  type="radio"
                  name="warfarin-bleeding"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  checked={input.bleeding === opt.value}
                  onChange={() =>
                    set({ bleeding: opt.value as BleedingStatus })
                  }
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          label="Total warfarin dose"
          htmlFor="warfarin-dose"
          error={errors.doseText}
          tooltip="Sum of warfarin milligrams over one week (or enter average daily dose and switch the unit). Day ↔ week conversion preserves the same weekly total (×7 / ÷7)."
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.doseText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="warfarin-dose"
              className={inputClass}
              value={input.doseText}
              inputMode="decimal"
              placeholder=""
              aria-invalid={Boolean(errors.doseText)}
              onChange={(e) => set({ doseText: e.target.value })}
            />
            <span className="shrink-0 pl-1 font-mono text-xs text-muted-foreground">
              mg /
            </span>
            <select
              className={selectClass}
              value={input.dosePeriod}
              aria-label="Dose period"
              onChange={(e) =>
                switchDosePeriod(e.target.value as DosePeriod)
              }
            >
              <option value="wk">wk</option>
              <option value="day">day</option>
            </select>
          </div>
        </Field>

        <fieldset>
          <legend className={labelClass}>
            <span>Target INR</span>
            <InfoTooltip
              label="Target INR"
              text="2–3 is the usual intensity target (e.g. AF, VTE). 2.5–3.5 is the higher-intensity column used for some mechanical valves. Use the range ordered for this patient."
            />
          </legend>
          <div
            className="flex flex-wrap gap-4 text-sm text-accent"
            role="radiogroup"
            aria-label="Target INR"
          >
            {(
              [
                { value: '2_3', label: '2-3' },
                { value: '2_5_3_5', label: '2.5-3.5' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="radio"
                  name="warfarin-target"
                  className="h-4 w-4 accent-primary"
                  checked={input.targetRange === opt.value}
                  onChange={() =>
                    set({ targetRange: opt.value as TargetInrRange })
                  }
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section
        className={sectionClass}
        aria-label="Warfarin dosing results"
        aria-live="polite"
      >
        <p className="text-sm font-semibold text-accent">
          {result?.statusHeadline ?? 'Enter INR and total dose'}
        </p>
        <p className="text-sm leading-relaxed text-accent">
          {result?.statusDetail ??
            'Results appear after current INR and total warfarin dose are entered.'}
        </p>

        {showInRange ? (
          <p className="text-sm tabular-nums text-accent">
            Current weekly dose{' '}
            <span className="font-semibold">
              {formatMg(result.weeklyDoseMg)} mg/wk
            </span>{' '}
            · no published % change while INR is in the selected target range.
          </p>
        ) : null}

        {showNumeric ? (
          <div className="space-y-1.5 text-sm text-accent">
            <p className="tabular-nums">
              Published band{' '}
              <span className="font-semibold">
                {result.percentLow != null && result.percentHigh != null
                  ? `${result.percentLow > 0 ? '+' : ''}${result.percentLow}% to ${result.percentHigh > 0 ? '+' : ''}${result.percentHigh}%`
                  : '—'}
              </span>{' '}
              of current weekly dose
            </p>
            <p className="tabular-nums">
              Suggested weekly range{' '}
              <span className="font-semibold">
                {formatMg(result.adjustedWeeklyLowMg)}–
                {formatMg(result.adjustedWeeklyHighMg)} mg/wk
              </span>
              {result.adjustedDailyLowMg != null &&
              result.adjustedDailyHighMg != null ? (
                <>
                  {' '}
                  · avg{' '}
                  <span className="font-semibold">
                    {formatMg(result.adjustedDailyLowMg)}–
                    {formatMg(result.adjustedDailyHighMg)} mg/day
                  </span>
                </>
              ) : null}
            </p>
          </div>
        ) : null}

        {result?.actionNotes && result.actionNotes.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted-foreground">
            {result.actionNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}

        {result?.recheckNote ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.recheckNote}
          </p>
        ) : null}

        {result?.sourceNote ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.sourceNote}
          </p>
        ) : null}
      </section>

      {result?.disclaimer ? (
        <p className="text-xs italic leading-relaxed text-muted-foreground">
          {result.disclaimer}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  tooltip,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  tooltip?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={htmlFor}>
        <span>{label}</span>
        {tooltip ? <InfoTooltip label={label} text={tooltip} /> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
