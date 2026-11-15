'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MAX_SPRINT_DAYS, type BurndownChartFieldErrors } from './types';
import {
  resizeDailyBurn,
  type BurndownDraft,
} from './validation';

interface BurndownChartFormProps {
  draft: BurndownDraft;
  errors: BurndownChartFieldErrors;
  onChange: (draft: BurndownDraft) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function BurndownChartForm({
  draft,
  errors,
  onChange,
  onReset,
}: BurndownChartFormProps) {
  const setDuration = (value: string) => {
    const parsed = Number(value.trim());
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_SPRINT_DAYS) {
      const resized = resizeDailyBurn(draft.dailyBurn, parsed, draft.progressThroughDay);
      onChange({
        ...draft,
        sprintDuration: value,
        dailyBurn: resized.dailyBurn,
        progressThroughDay: resized.progressThroughDay,
      });
      return;
    }
    onChange({ ...draft, sprintDuration: value });
  };

  const setDayBurn = (index: number, value: string) => {
    const dailyBurn = draft.dailyBurn.map((v, i) => (i === index ? value : v));
    onChange({
      ...draft,
      dailyBurn,
      progressThroughDay: Math.max(draft.progressThroughDay, index + 1),
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details open className="rounded-xl border border-border bg-muted/20">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent">
          Sprint details
        </summary>
        <div className="space-y-3.5 px-4 pb-4">
          <div>
            <FieldLabel
              htmlFor="burndown-duration"
              label="Sprint duration"
              tip={`Number of working days in the sprint (1–${MAX_SPRINT_DAYS}). Daily burn fields update to match.`}
            />
            <div className="relative">
              <input
                id="burndown-duration"
                className={`${inputClass} pr-[7.5rem]`}
                inputMode="numeric"
                value={draft.sprintDuration}
                aria-invalid={Boolean(errors.sprintDuration)}
                onChange={(event) => setDuration(event.target.value)}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                working days
              </span>
            </div>
            {errors.sprintDuration ? (
              <p className="mt-1 text-xs text-rose-600">{errors.sprintDuration}</p>
            ) : null}
          </div>

          <div>
            <FieldLabel
              htmlFor="burndown-total"
              label="Total story points"
              tip="Story points planned for the sprint. Remaining work starts at this value on Day 0."
            />
            <input
              id="burndown-total"
              className={inputClass}
              inputMode="decimal"
              value={draft.totalStoryPoints}
              placeholder=""
              aria-invalid={Boolean(errors.totalStoryPoints)}
              onChange={(event) =>
                onChange({ ...draft, totalStoryPoints: event.target.value })
              }
            />
            {errors.totalStoryPoints ? (
              <p className="mt-1 text-xs text-rose-600">{errors.totalStoryPoints}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details open className="rounded-xl border border-border bg-muted/20">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent">
          Story points burnt each day
        </summary>
        <div className="space-y-3 px-4 pb-4">
          <p className="text-xs text-muted-foreground">
            Enter points completed each working day. Editing a day marks progress through that day
            on the actual burndown line.
          </p>
          {draft.dailyBurn.map((value, index) => (
            <div key={`day-${index + 1}`}>
              <FieldLabel
                htmlFor={`burndown-day-${index + 1}`}
                label={`Day ${index + 1}`}
                tip={`Story points completed on working day ${index + 1}.`}
              />
              <div className="relative">
                <input
                  id={`burndown-day-${index + 1}`}
                  className={`${inputClass} pr-[6.5rem]`}
                  inputMode="decimal"
                  value={value}
                  aria-invalid={Boolean(errors.dailyBurn)}
                  onChange={(event) => setDayBurn(index, event.target.value)}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  story points
                </span>
              </div>
            </div>
          ))}
          {errors.dailyBurn ? (
            <p className="text-xs text-rose-600">{errors.dailyBurn}</p>
          ) : null}
        </div>
      </details>

      {errors.form ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
