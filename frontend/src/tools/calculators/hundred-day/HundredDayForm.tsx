'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { MAX_DAY_OFFSET } from './dates';
import type { HundredDayInput } from './calculation';

interface HundredDayFormProps {
  input: HundredDayInput;
  errors: Record<string, string>;
  onChange: (input: HundredDayInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

export function HundredDayForm({ input, errors, onChange, onSubmit, onReset }: HundredDayFormProps) {
  const set = (patch: Partial<HundredDayInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset>
        <legend className={labelClass}>Mode</legend>
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
          {(
            [
              ['offset', 'Add or subtract days'],
              ['between', 'Days between dates'],
            ] as const
          ).map(([mode, label]) => (
            <label
              key={mode}
              className={`flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${
                input.mode === mode ? 'border-primary bg-primary/5 text-accent' : 'border-border'
              }`}
            >
              <input
                type="radio"
                name="hundred-mode"
                checked={input.mode === mode}
                onChange={() => set({ mode })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {input.mode === 'offset' ? (
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="hd-start">
              Starting date
            </label>
            <input
              id="hd-start"
              type="date"
              className={`${inputClass} block`}
              value={input.startDate}
              onChange={(e) => set({ startDate: e.target.value })}
              aria-invalid={Boolean(errors.startDate)}
              aria-describedby={errors.startDate ? 'hd-start-error' : undefined}
            />
            {errors.startDate ? (
              <p id="hd-start-error" className="mt-1 text-xs text-rose-600">
                {errors.startDate}
              </p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="hd-days">
              Number of days
            </label>
            <input
              id="hd-days"
              inputMode="numeric"
              className={inputClass}
              value={Number.isFinite(input.dayCount) ? String(input.dayCount) : ''}
              onChange={(e) => {
                const raw = e.target.value.trim();
                if (raw === '') {
                  set({ dayCount: Number.NaN });
                  return;
                }
                set({ dayCount: Number(raw) });
              }}
              aria-invalid={Boolean(errors.dayCount)}
              aria-describedby={errors.dayCount ? 'hd-days-error' : 'hd-days-hint'}
            />
            <p id="hd-days-hint" className="mt-1 text-xs text-muted-foreground">
              Whole numbers from 1 to {MAX_DAY_OFFSET.toLocaleString('en-US')}. Default is 100.
            </p>
            {errors.dayCount ? (
              <p id="hd-days-error" className="mt-1 text-xs text-rose-600">
                {errors.dayCount}
              </p>
            ) : null}
          </div>
          <div className="min-[420px]:col-span-2">
            <label className={labelClass} htmlFor="hd-direction">
              Direction
            </label>
            <select
              id="hd-direction"
              className={inputClass}
              value={input.direction}
              onChange={(e) => set({ direction: e.target.value === 'before' ? 'before' : 'after' })}
            >
              <option value="after">Days after</option>
              <option value="before">Days before</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="hd-from">
              From date
            </label>
            <input
              id="hd-from"
              type="date"
              className={`${inputClass} block`}
              value={input.fromDate}
              onChange={(e) => set({ fromDate: e.target.value })}
              aria-invalid={Boolean(errors.fromDate)}
            />
            {errors.fromDate ? <p className="mt-1 text-xs text-rose-600">{errors.fromDate}</p> : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="hd-to">
              To date
            </label>
            <input
              id="hd-to"
              type="date"
              className={`${inputClass} block`}
              value={input.toDate}
              onChange={(e) => set({ toDate: e.target.value })}
              aria-invalid={Boolean(errors.toDate)}
            />
            {errors.toDate ? <p className="mt-1 text-xs text-rose-600">{errors.toDate}</p> : null}
          </div>
          <div className="min-[420px]:col-span-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 font-medium"
              onClick={() => set({ fromDate: input.toDate, toDate: input.fromDate })}
            >
              Swap dates
            </Button>
          </div>
        </div>
      )}

      <label className="flex items-start gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={input.includeStart}
          onChange={(e) => set({ includeStart: e.target.checked })}
        />
        <span>
          Include start date
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            {input.mode === 'offset'
              ? 'Unchecked: the start date is day 0. Checked: the start date counts as day 1.'
              : 'Unchecked: count the gap only. Checked: count both endpoint dates.'}
          </span>
        </span>
      </label>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="submit" className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
