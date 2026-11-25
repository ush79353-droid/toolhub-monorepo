'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DicSyndromeFieldErrors,
  DicSyndromeInput,
  DicSyndromeResult,
  FibrinMarkerBand,
  FibrinogenBand,
  PlateletBand,
  PtProlongationBand,
} from './types';
import {
  FIBRIN_MARKER_OPTIONS,
  FIBRINOGEN_OPTIONS,
  PLATELET_OPTIONS,
  PT_PROLONGATION_OPTIONS,
} from './types';

const legendClass = 'text-[13px] font-medium text-accent';

function RadioGroup<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input type="radio" name={name} className="h-4 w-4 accent-primary" checked={value === opt.value} onChange={() => onChange(opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

interface Props {
  input: DicSyndromeInput;
  errors: DicSyndromeFieldErrors;
  result: DicSyndromeResult | null;
  onChange: (input: DicSyndromeInput) => void;
}

export function DicSyndromeForm({ input, result, onChange }: Props) {
  const set = (patch: Partial<DicSyndromeInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-5" noValidate autoComplete="off">
      <fieldset className="space-y-2">
        <legend className={legendClass}>Platelet count</legend>
        <RadioGroup<PlateletBand>
          name="platelets"
          value={input.platelets}
          onChange={(v) => set({ platelets: v })}
          options={PLATELET_OPTIONS}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={`${legendClass} flex items-center gap-1.5`}>
          Fibrin markers increase
          <InfoTooltip text="D-dimer, fibrin degradation products, or soluble fibrin above baseline in the clinical picture." />
        </legend>
        <RadioGroup<FibrinMarkerBand>
          name="fibrin"
          value={input.fibrinMarkers}
          onChange={(v) => set({ fibrinMarkers: v })}
          options={FIBRIN_MARKER_OPTIONS}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={legendClass}>Prothrombin time (prolongation above control)</legend>
        <RadioGroup<PtProlongationBand>
          name="pt"
          value={input.ptProlongation}
          onChange={(v) => set({ ptProlongation: v })}
          options={PT_PROLONGATION_OPTIONS}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={legendClass}>Fibrinogen level</legend>
        <RadioGroup<FibrinogenBand>
          name="fibrinogen"
          value={input.fibrinogen}
          onChange={(v) => set({ fibrinogen: v })}
          options={FIBRINOGEN_OPTIONS}
        />
      </fieldset>

      <div>
        <div className={legendClass}>Result</div>
        <div className="mt-1.5 flex h-11 items-center rounded-lg border border-border bg-muted/25 px-3 text-sm font-semibold tabular-nums text-primary" aria-live="polite">
          {result?.formattedScore ?? '0'}
        </div>
        {result ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{result.interpretation}</p> : null}
      </div>
    </form>
  );
}