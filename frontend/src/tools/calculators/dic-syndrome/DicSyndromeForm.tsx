'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DicSyndromeFieldErrors,
  DicSyndromeInput,
  DicSyndromeResult,
  FibrinMarkerBand,
  FibrinogenBand,
  PlateletBand,
  PtBand,
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
  options: { value: T; label: string }[];
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
          value={input.plateletBand}
          onChange={(v) => set({ plateletBand: v })}
          options={[
            { value: 'gt100k', label: '>100,000/µL' },
            { value: '50to100k', label: '50,000–100,000/µL' },
            { value: 'lt50k', label: '<50,000/µL' },
          ]}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={`${legendClass} flex items-center gap-1.5`}>
          Fibrin markers increase
          <InfoTooltip text="D-dimer, fibrin degradation products, or soluble fibrin above baseline in the clinical picture." />
        </legend>
        <RadioGroup<FibrinMarkerBand>
          name="fibrin"
          value={input.fibrinMarkerBand}
          onChange={(v) => set({ fibrinMarkerBand: v })}
          options={[
            { value: 'noChange', label: 'No change' },
            { value: 'moderate', label: 'Moderate rise' },
            { value: 'strong', label: 'Strong rise' },
          ]}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={legendClass}>Prothrombin time (prolongation above control)</legend>
        <RadioGroup<PtBand>
          name="pt"
          value={input.ptBand}
          onChange={(v) => set({ ptBand: v })}
          options={[
            { value: 'lt3s', label: '<3 seconds' },
            { value: '3to6s', label: '3–6 seconds' },
            { value: 'gt6s', label: '>6 seconds' },
          ]}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={legendClass}>Fibrinogen level</legend>
        <RadioGroup<FibrinogenBand>
          name="fibrinogen"
          value={input.fibrinogenBand}
          onChange={(v) => set({ fibrinogenBand: v })}
          options={[
            { value: 'gte1gL', label: '≥1 g/L' },
            { value: 'lt1gL', label: '<1 g/L' },
          ]}
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