'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { PercFieldErrors, PercInput, PercResult } from './types';
import { CRITERION_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

interface Props {
  input: PercInput;
  errors: PercFieldErrors;
  result: PercResult | null;
  onChange: (input: PercInput) => void;
  onLoadExample: () => void;
}

export function PercForm({
  input,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const setCriterion = (key: keyof PercInput['criteria'], checked: boolean) => {
    onChange({
      ...input,
      criteria: { ...input.criteria, [key]: checked },
    });
  };

  const showRuleOut = result?.interpretationKind === 'rule_out';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm leading-relaxed text-accent">
        Use this scale to rule out pulmonary embolism if the clinical probability
        is low (&lt;15%) and no tests were run beforehand. Remember that the PERC
        rule has limitations — see the guide for safety context.
      </p>

      <div className="space-y-3">
        <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-medium leading-relaxed text-accent">
          Prerequisite: low clinical pretest probability for PE (&lt;15%) without
          prior definitive PE testing in this workup.
        </p>
        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            checked={input.lowPretestProbabilityConfirmed}
            onChange={(e) =>
              onChange({
                ...input,
                lowPretestProbabilityConfirmed: e.target.checked,
              })
            }
          />
          <span>
            I confirm this patient&apos;s pretest probability for pulmonary
            embolism is low (&lt;15%)
          </span>
        </label>
      </div>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational PERC checklist only — not an imaging or treatment order.
        Clinical values stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (none ticked, low-risk eligible → count 0)
        </button>
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-accent">Please tick all that apply…</p>
        </div>
        <ul className="space-y-2">
          {CRITERION_OPTIONS.map((opt) => (
            <li key={opt.key}>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent transition-colors hover:bg-muted/10">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  checked={input.criteria[opt.key]}
                  onChange={(e) => setCriterion(opt.key, e.target.checked)}
                />
                <span className="flex items-start gap-1.5">
                  <span>{opt.label}</span>
                  <InfoTooltip label={opt.label} text={opt.tip} />
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-muted/10 px-3 py-2.5 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
          checked={input.allCriteriaAssessed}
          onChange={(e) =>
            onChange({ ...input, allCriteriaAssessed: e.target.checked })
          }
        />
        <span>
          I have reviewed all eight PERC criteria; unchecked items above are
          absent (not merely unknown).
        </span>
      </label>

      {result ? (
        <div
          className="space-y-2 rounded-xl border border-border bg-muted/15 px-4 py-3"
          aria-live="polite"
        >
          <p className="text-[13px] font-semibold text-accent">Result</p>
          <div
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              showRuleOut ? 'bg-primary/15' : 'bg-muted/30'
            }`}
          >
            <div
              className={`text-2xl font-bold tabular-nums ${
                showRuleOut ? 'text-primary' : 'text-accent'
              }`}
            >
              {result.formattedPositiveCount}
            </div>
            <p className="text-sm text-accent">{result.interpretation}</p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.detailNote}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        </div>
      ) : null}
    </form>
  );
}