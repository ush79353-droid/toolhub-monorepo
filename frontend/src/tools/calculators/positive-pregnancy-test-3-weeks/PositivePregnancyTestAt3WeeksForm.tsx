'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatDisplayDate,
  parseCycleLength,
  suggestOvulationIso,
} from '../urine-home-pregnancy-test/calculation';
import type {
  EmbryoAgeDays,
  PositivePregnancyTestAt3WeeksFieldErrors,
  PositivePregnancyTestAt3WeeksInput,
  PositivePregnancyTestAt3WeeksResult,
  TestSensitivityMiu,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function SensitivitySelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: TestSensitivityMiu;
  onChange: (next: TestSensitivityMiu) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        Urine test sensitivity
        <InfoTooltip text="Educational labeled detection threshold. Lower mIU/mL may allow earlier testing; package inserts differ. Shared Omega assay bands: 10–25 mIU/mL." />
      </label>
      <FieldShell>
        <select
          id={id}
          className={`${inputClass} cursor-pointer appearance-none`}
          value={value}
          onChange={(e) => onChange(e.target.value as TestSensitivityMiu)}
        >
          <option value="10">10 mIU/mL (early)</option>
          <option value="15">15 mIU/mL</option>
          <option value="20">20 mIU/mL</option>
          <option value="25">25 mIU/mL (typical)</option>
        </select>
      </FieldShell>
    </div>
  );
}

interface FormProps {
  input: PositivePregnancyTestAt3WeeksInput;
  errors: PositivePregnancyTestAt3WeeksFieldErrors;
  result: PositivePregnancyTestAt3WeeksResult | null;
  onChange: (input: PositivePregnancyTestAt3WeeksInput) => void;
}

export function PositivePregnancyTestAt3WeeksForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<PositivePregnancyTestAt3WeeksInput>) =>
    onChange({ ...input, ...patch });

  const onLastPeriod = (value: string) => {
    const cycle = parseCycleLength(input.cycleLengthDaysText);
    if (!input.ovulationManual && cycle !== 'invalid' && value) {
      set({
        lastPeriodIso: value,
        ovulationIso: suggestOvulationIso(value, cycle),
        ovulationManual: false,
      });
      return;
    }
    set({ lastPeriodIso: value });
  };

  const onCycleLength = (value: string) => {
    const cycle = parseCycleLength(value);
    if (!input.ovulationManual && cycle !== 'invalid' && input.lastPeriodIso) {
      set({
        cycleLengthDaysText: value,
        ovulationIso: suggestOvulationIso(input.lastPeriodIso, cycle),
      });
      return;
    }
    set({ cycleLengthDaysText: value });
  };

  return (
    <div className="space-y-4">
      <section className={sectionClass} aria-labelledby="ppt3-natural-heading">
        <h3
          id="ppt3-natural-heading"
          className="text-sm font-semibold text-accent"
        >
          Natural conception
        </h3>

        <div>
          <label htmlFor="ppt3-cycle" className={labelClass}>
            Menstrual cycle length
            <InfoTooltip text="Typical cycles are about 21–35 days. Ovulation is estimated as cycle length minus 14 days from the first day of your last period." />
          </label>
          <FieldShell error={errors.cycleLengthDaysText}>
            <input
              id="ppt3-cycle"
              type="text"
              inputMode="numeric"
              className={`${inputClass} tabular-nums`}
              value={input.cycleLengthDaysText}
              onChange={(e) => onCycleLength(e.target.value)}
            />
            <span className="shrink-0 border-l border-border px-3 text-sm text-primary">
              days
            </span>
          </FieldShell>
          {errors.cycleLengthDaysText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.cycleLengthDaysText}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ppt3-lmp" className={labelClass}>
            Your last period
          </label>
          <FieldShell error={errors.lastPeriodIso}>
            <input
              id="ppt3-lmp"
              type="date"
              className={inputClass}
              value={input.lastPeriodIso}
              onChange={(e) => onLastPeriod(e.target.value)}
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="ppt3-ovulation" className={labelClass}>
            Ovulation day
          </label>
          <FieldShell error={errors.ovulationIso}>
            <input
              id="ppt3-ovulation"
              type="date"
              className={inputClass}
              value={input.ovulationIso}
              onChange={(e) =>
                set({ ovulationIso: e.target.value, ovulationManual: true })
              }
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="ppt3-nat-urine" className={labelClass}>
            Urine test date
          </label>
          <FieldShell>
            <input
              id="ppt3-nat-urine"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={
                result?.naturalUrineIso
                  ? formatDisplayDate(result.naturalUrineIso)
                  : ''
              }
              placeholder="MM/DD/YYYY"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="ppt3-nat-blood" className={labelClass}>
            Blood test date
          </label>
          <FieldShell>
            <input
              id="ppt3-nat-blood"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={
                result?.naturalBloodIso
                  ? formatDisplayDate(result.naturalBloodIso)
                  : ''
              }
              placeholder="MM/DD/YYYY"
            />
          </FieldShell>
        </div>

        <SensitivitySelect
          id="ppt3-nat-sens"
          value={input.naturalSensitivityMiu}
          onChange={(naturalSensitivityMiu) =>
            set({ naturalSensitivityMiu, showNaturalSensitivity: true })
          }
        />
      </section>

      <section className={sectionClass} aria-labelledby="ppt3-ivf-heading">
        <h3 id="ppt3-ivf-heading" className="text-sm font-semibold text-accent">
          In vitro fertilization
        </h3>

        <div>
          <label htmlFor="ppt3-transfer" className={labelClass}>
            IVF transfer day
          </label>
          <FieldShell error={errors.ivfTransferIso}>
            <input
              id="ppt3-transfer"
              type="date"
              className={inputClass}
              value={input.ivfTransferIso}
              onChange={(e) => set({ ivfTransferIso: e.target.value })}
            />
          </FieldShell>
        </div>

        <div>
          <div className={labelClass}>
            Embryo&apos;s age
            <InfoTooltip text="Screenshot radios: 3-day cleavage, 5-day or 6-day blastocyst. Day-5 is the default." />
          </div>
          <div
            className="flex flex-col gap-2"
            role="radiogroup"
            aria-label="Embryo's age"
          >
            {(
              [
                [3, '3 days (cleavage stage)'],
                [5, '5 days (blastocyst stage)'],
                [6, '6 days (blastocyst stage)'],
              ] as const
            ).map(([days, label]) => (
              <label
                key={days}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ppt3-embryo"
                  className="h-4 w-4 accent-primary"
                  checked={input.embryoAgeDays === days}
                  onChange={() =>
                    set({ embryoAgeDays: days as EmbryoAgeDays })
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="ppt3-ivf-urine" className={labelClass}>
            Urine test date
          </label>
          <FieldShell>
            <input
              id="ppt3-ivf-urine"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={
                result?.ivfUrineIso ? formatDisplayDate(result.ivfUrineIso) : ''
              }
              placeholder="MM/DD/YYYY"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="ppt3-ivf-blood" className={labelClass}>
            Blood test date
          </label>
          <FieldShell>
            <input
              id="ppt3-ivf-blood"
              type="text"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={
                result?.ivfBloodIso ? formatDisplayDate(result.ivfBloodIso) : ''
              }
              placeholder="MM/DD/YYYY"
            />
          </FieldShell>
        </div>

        <SensitivitySelect
          id="ppt3-ivf-sens"
          value={input.ivfSensitivityMiu}
          onChange={(ivfSensitivityMiu) =>
            set({ ivfSensitivityMiu, showIvfSensitivity: true })
          }
        />
      </section>
    </div>
  );
}
