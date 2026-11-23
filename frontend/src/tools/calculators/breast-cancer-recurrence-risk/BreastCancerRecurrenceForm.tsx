'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  GRADE_OPTIONS,
  LVI_OPTIONS,
  LYMPH_NODE_OPTIONS,
  type BreastCancerRecurrenceInput,
  type BreastCancerRecurrenceResult,
  type LviStatus,
  type LymphNodeStatus,
  type TumorGrade,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

interface Props {
  input: BreastCancerRecurrenceInput;
  result: BreastCancerRecurrenceResult | null;
  onChange: (input: BreastCancerRecurrenceInput) => void;
}

export function BreastCancerRecurrenceForm({
  input,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<BreastCancerRecurrenceInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-muted-foreground">
        Select tumor grade, lymph-node status, and lymphovascular invasion. The
        recurrence score and local-risk sentence appear only when all three are
        chosen. Educational historical index only.
      </p>

      <div className={sectionClass}>
        <div>
          <p id="bcr-grade-label" className={labelClass}>
            <span>Grade of tumor</span>
            <InfoTooltip
              label="Grade of tumor"
              text="Histologic tumor grade used in the O'Rourke local-recurrence index (I = 6, II = 12, III = 18 points)."
            />
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="bcr-grade-label"
          >
            {GRADE_OPTIONS.map((option) => {
              const id = `bcr-grade-${option.id}`;
              return (
                <label
                  key={option.id}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
                >
                  <input
                    id={id}
                    type="radio"
                    name="bcr-grade"
                    value={option.id}
                    checked={input.grade === option.id}
                    className="h-4 w-4 accent-primary"
                    onChange={() => set({ grade: option.id as TumorGrade })}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <p id="bcr-nodes-label" className={labelClass}>
            <span>Lymph nodes</span>
            <InfoTooltip
              label="Lymph nodes"
              text="Node-negative = 6 points; node-positive = 12 points in the published additive index."
            />
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="bcr-nodes-label"
          >
            {LYMPH_NODE_OPTIONS.map((option) => {
              const id = `bcr-nodes-${option.id}`;
              return (
                <label
                  key={option.id}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
                >
                  <input
                    id={id}
                    type="radio"
                    name="bcr-nodes"
                    value={option.id}
                    checked={input.lymphNodes === option.id}
                    className="h-4 w-4 accent-primary"
                    onChange={() =>
                      set({ lymphNodes: option.id as LymphNodeStatus })
                    }
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <p id="bcr-lvi-label" className={labelClass}>
            <span>Lymphatic or vascular invasion</span>
            <InfoTooltip
              label="Lymphatic or vascular invasion"
              text="None = 4 points; present = 8 points. Refers to lymphovascular invasion in the primary tumour."
            />
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="bcr-lvi-label"
          >
            {LVI_OPTIONS.map((option) => {
              const id = `bcr-lvi-${option.id}`;
              return (
                <label
                  key={option.id}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
                >
                  <input
                    id={id}
                    type="radio"
                    name="bcr-lvi"
                    value={option.id}
                    checked={input.lvi === option.id}
                    className="h-4 w-4 accent-primary"
                    onChange={() => set({ lvi: option.id as LviStatus })}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="bcr-score">
            <span>Breast cancer recurrence risk score</span>
            <InfoTooltip
              label="Recurrence risk score"
              text="Sum of the three factor weights (range 16–38 for valid combinations). Blank until all factors are selected."
            />
          </label>
          <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-border bg-muted/30">
            <input
              id="bcr-score"
              type="text"
              readOnly
              tabIndex={0}
              value={result?.formattedScore ?? ''}
              placeholder=""
              aria-live="polite"
              className={`${inputClass} cursor-default text-muted-foreground`}
            />
          </div>
        </div>

        <p className="text-sm leading-relaxed text-accent" aria-live="polite">
          {result ? (
            result.riskSentence
          ) : (
            <>
              According to your score, the breast cancer local recurrence risk
              is{' '}
              <span className="text-muted-foreground">—</span>
            </>
          )}
        </p>

        <p className="text-xs italic leading-relaxed text-muted-foreground">
          This tool can not replace the professional advice of a health care
          provider.
        </p>
      </div>
    </form>
  );
}
