'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cigarettesFromPacks,
  formatCount,
  formatTotal,
  packsFromCigarettes,
  parseNumber,
} from './calculation';
import type {
  CigaretteFieldErrors,
  CigaretteInput,
  CigaretteResult,
  TimeFrameUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: CigaretteInput;
  errors: CigaretteFieldErrors;
  result: CigaretteResult | null;
  onChange: (input: CigaretteInput) => void;
}

export function CigaretteForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<CigaretteInput>) =>
    onChange({ ...input, ...patch });

  const packSize = parseNumber(input.cigarettesInPackText);

  const onCigarettesChange = (raw: string) => {
    const n = parseNumber(raw);
    if (n !== null && packSize !== null && packSize > 0) {
      set({
        cigarettesPerDayText: raw,
        packsPerDayText: formatCount(packsFromCigarettes(n, packSize), 4),
        rateDriver: 'cigarettes',
      });
      return;
    }
    set({ cigarettesPerDayText: raw, rateDriver: 'cigarettes' });
  };

  const onPacksChange = (raw: string) => {
    const n = parseNumber(raw);
    if (n !== null && packSize !== null && packSize > 0) {
      set({
        packsPerDayText: raw,
        cigarettesPerDayText: formatCount(cigarettesFromPacks(n, packSize), 4),
        rateDriver: 'packs',
      });
      return;
    }
    set({ packsPerDayText: raw, rateDriver: 'packs' });
  };

  const onPackSizeChange = (raw: string) => {
    const size = parseNumber(raw);
    if (size !== null && size > 0) {
      if (input.rateDriver === 'packs') {
        const packs = parseNumber(input.packsPerDayText);
        if (packs !== null) {
          set({
            cigarettesInPackText: raw,
            cigarettesPerDayText: formatCount(
              cigarettesFromPacks(packs, size),
              4,
            ),
          });
          return;
        }
      } else {
        const cigs = parseNumber(input.cigarettesPerDayText);
        if (cigs !== null) {
          set({
            cigarettesInPackText: raw,
            packsPerDayText: formatCount(packsFromCigarettes(cigs, size), 4),
          });
          return;
        }
      }
    }
    set({ cigarettesInPackText: raw });
  };

  const totalDisplay =
    result?.totalCigarettes != null ? formatTotal(result.totalCigarettes) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Cigarette calculator inputs">
        <div>
          <label className={labelClass} htmlFor="cig-daily">
            Cigarettes daily
            <InfoTooltip text="Average cigarettes smoked per day. Syncs with packs/day using pack size." />
          </label>
          <FieldShell error={errors.cigarettesPerDayText}>
            <input
              id="cig-daily"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.cigarettesPerDayText}
              onChange={(e) => onCigarettesChange(e.target.value)}
              aria-invalid={Boolean(errors.cigarettesPerDayText)}
            />
            <span className={unitFixed}>/ day</span>
          </FieldShell>
          {errors.cigarettesPerDayText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.cigarettesPerDayText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cig-pack">
            Cigarettes in pack
            <InfoTooltip text="Typical pack size is 20. Must be greater than zero." />
          </label>
          <FieldShell error={errors.cigarettesInPackText}>
            <input
              id="cig-pack"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.cigarettesInPackText}
              onChange={(e) => onPackSizeChange(e.target.value)}
              aria-invalid={Boolean(errors.cigarettesInPackText)}
            />
          </FieldShell>
          {errors.cigarettesInPackText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.cigarettesInPackText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cig-packs">
            Packs daily
            <InfoTooltip text="Packs per day. Syncs with cigarettes/day via pack size." />
          </label>
          <FieldShell error={errors.packsPerDayText}>
            <input
              id="cig-packs"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.packsPerDayText}
              onChange={(e) => onPacksChange(e.target.value)}
              aria-invalid={Boolean(errors.packsPerDayText)}
            />
            <span className={unitFixed}>/ day</span>
          </FieldShell>
          {errors.packsPerDayText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.packsPerDayText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cig-time">
            Time frame
            <InfoTooltip text="Exposure duration without calendar dates: 1 year = 365 days; 1 month = 365/12 days." />
          </label>
          <FieldShell error={errors.timeFrameText}>
            <input
              id="cig-time"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.timeFrameText}
              onChange={(e) => set({ timeFrameText: e.target.value })}
              aria-invalid={Boolean(errors.timeFrameText)}
              placeholder={input.timeFrameUnit === 'years' ? 'yrs' : 'mos'}
            />
            <select
              className={unitSelectClass}
              value={input.timeFrameUnit}
              onChange={(e) =>
                set({ timeFrameUnit: e.target.value as TimeFrameUnit })
              }
              aria-label="Time frame unit"
            >
              <option value="years">yrs</option>
              <option value="months">mos</option>
            </select>
          </FieldShell>
          {errors.timeFrameText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.timeFrameText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Total smoked cigarettes">
        <h3 className="text-sm font-semibold text-accent">
          Total number of smoked cigarettes
        </h3>
        <div>
          <label className={labelClass} htmlFor="cig-total">
            Total cigarettes
            <InfoTooltip text="cigarettes/day × days in the chosen time frame." />
          </label>
          <FieldShell muted>
            <input
              id="cig-total"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={totalDisplay}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
        {result?.totalCigarettes != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
        <p className="text-sm">
          <a
            href="#how-it-works"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Check out <strong>how to use this calculator!</strong>
          </a>
        </p>
      </section>
    </form>
  );
}
