'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatDisplayDate,
  parseCycleLength,
  suggestOvulationIso,
} from './calculation';
import type {
  EmbryoAgeDays,
  TestSensitivityMiu,
  UrineHomePregnancyTestFieldErrors,
  UrineHomePregnancyTestInput,
  UrineHomePregnancyTestResult,
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

function SensitivityBlock({
  idPrefix,
  checked,
  sensitivity,
  onToggle,
  onSensitivity,
}: {
  idPrefix: string;
  checked: boolean;
  sensitivity: TestSensitivityMiu;
  onToggle: (next: boolean) => void;
  onSensitivity: (next: TestSensitivityMiu) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
        />
        Show the urine test sensitivity threshold
      </label>
      {checked ? (
        <div>
          <label htmlFor={`${idPrefix}-sens`} className={labelClass}>
            Urine test sensitivity
          </label>
          <FieldShell>
            <select
              id={`${idPrefix}-sens`}
              className={`${inputClass} cursor-pointer appearance-none`}
              value={sensitivity}
              onChange={(e) =>
                onSensitivity(e.target.value as TestSensitivityMiu)
              }
            >
              <option value="10">10 mIU/mL (early)</option>
              <option value="15">15 mIU/mL</option>
              <option value="20">20 mIU/mL</option>
              <option value="25">25 mIU/mL (typical)</option>
            </select>
          </FieldShell>
        </div>
      ) : null}
    </div>
  );
}

interface UrineHomePregnancyTestFormProps {
  input: UrineHomePregnancyTestInput;
  errors: UrineHomePregnancyTestFieldErrors;
  result: UrineHomePregnancyTestResult | null;
  onChange: (input: UrineHomePregnancyTestInput) => void;
}

export function UrineHomePregnancyTestForm({
  input,
  errors,
  result,
  onChange,
}: UrineHomePregnancyTestFormProps) {
  const set = (patch: Partial<UrineHomePregnancyTestInput>) =>
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
      <section className={sectionClass} aria-labelledby="urine-natural-heading">
        <h3
          id="urine-natural-heading"
          className="text-sm font-semibold text-accent"
        >
          Natural conception
        </h3>

        <div>
          <label htmlFor="urine-cycle" className={labelClass}>
            Menstrual cycle length
            <InfoTooltip text="Typical cycles are about 21–35 days. Ovulation is estimated as cycle length minus 14 days from the first day of your last period." />
          </label>
          <FieldShell error={errors.cycleLengthDaysText}>
            <input
              id="urine-cycle"
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
          <label htmlFor="urine-lmp" className={labelClass}>
            Your last period
            <InfoTooltip text="First day of your last menstrual period (LMP)." />
          </label>
          <FieldShell error={errors.lastPeriodIso}>
            <input
              id="urine-lmp"
              type="date"
              className={inputClass}
              value={input.lastPeriodIso}
              onChange={(e) => onLastPeriod(e.target.value)}
            />
          </FieldShell>
          {errors.lastPeriodIso ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lastPeriodIso}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="urine-ovulation" className={labelClass}>
            Ovulation day
          </label>
          <FieldShell error={errors.ovulationIso}>
            <input
              id="urine-ovulation"
              type="date"
              className={inputClass}
              value={input.ovulationIso}
              onChange={(e) =>
                set({ ovulationIso: e.target.value, ovulationManual: true })
              }
            />
          </FieldShell>
          {errors.ovulationIso ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ovulationIso}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="urine-nat-urine" className={labelClass}>
            Urine test date
            <InfoTooltip text="Educational earliest urine home-test day from ovulation and optional sensitivity. Not a guarantee of accuracy." />
          </label>
          <FieldShell>
            <input
              id="urine-nat-urine"
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
          <label htmlFor="urine-nat-blood" className={labelClass}>
            Blood test date
            <InfoTooltip text="Educational earliest qualitative blood (serum) hCG timing — often earlier than urine. Clinics set their own schedules." />
          </label>
          <FieldShell>
            <input
              id="urine-nat-blood"
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

        <SensitivityBlock
          idPrefix="urine-nat"
          checked={input.showNaturalSensitivity}
          sensitivity={input.naturalSensitivityMiu}
          onToggle={(showNaturalSensitivity) => set({ showNaturalSensitivity })}
          onSensitivity={(naturalSensitivityMiu) =>
            set({ naturalSensitivityMiu })
          }
        />
      </section>

      <section className={sectionClass} aria-labelledby="urine-ivf-heading">
        <h3 id="urine-ivf-heading" className="text-sm font-semibold text-accent">
          In vitro fertilization
        </h3>

        <div>
          <label htmlFor="urine-transfer" className={labelClass}>
            IVF transfer day
          </label>
          <FieldShell error={errors.ivfTransferIso}>
            <input
              id="urine-transfer"
              type="date"
              className={inputClass}
              value={input.ivfTransferIso}
              onChange={(e) => set({ ivfTransferIso: e.target.value })}
            />
          </FieldShell>
          {errors.ivfTransferIso ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ivfTransferIso}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="urine-embryo" className={labelClass}>
            Embryo&apos;s age
            <InfoTooltip text="Day-5 blastocyst is common. Earlier embryos shift educational beta timing later from the transfer calendar day." />
          </label>
          <FieldShell>
            <select
              id="urine-embryo"
              className={`${inputClass} cursor-pointer appearance-none`}
              value={input.embryoAgeDays}
              onChange={(e) =>
                set({
                  embryoAgeDays: Number(e.target.value) as EmbryoAgeDays,
                })
              }
            >
              <option value={1}>1 day</option>
              <option value={2}>2 days</option>
              <option value={3}>3 days</option>
              <option value={4}>4 days</option>
              <option value={5}>5 days (blastocyst stage)</option>
              <option value={6}>6 days</option>
            </select>
          </FieldShell>
        </div>

        <div>
          <label htmlFor="urine-ivf-urine" className={labelClass}>
            Urine test date
            <InfoTooltip text="Educational home-test estimate after transfer. Follow your clinic’s instructions first." />
          </label>
          <FieldShell>
            <input
              id="urine-ivf-urine"
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
          <label htmlFor="urine-ivf-blood" className={labelClass}>
            Blood test date
            <InfoTooltip text="Educational clinic beta timing after transfer. Your clinic’s order date prevails." />
          </label>
          <FieldShell>
            <input
              id="urine-ivf-blood"
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

        <SensitivityBlock
          idPrefix="urine-ivf"
          checked={input.showIvfSensitivity}
          sensitivity={input.ivfSensitivityMiu}
          onToggle={(showIvfSensitivity) => set({ showIvfSensitivity })}
          onSensitivity={(ivfSensitivityMiu) => set({ ivfSensitivityMiu })}
        />
      </section>
    </div>
  );
}
