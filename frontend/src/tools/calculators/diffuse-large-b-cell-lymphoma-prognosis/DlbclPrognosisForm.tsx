'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { DEFAULT_LDH_ULN_U_PER_L } from './calculation';
import type {
  DlbclPrognosisFieldErrors,
  DlbclPrognosisInput,
  DlbclPrognosisResult,
} from './types';

const legendClass = 'mb-2 text-[13px] font-medium text-accent';

function BinaryRadio({
  name,
  lowLabel,
  highLabel,
  highSelected,
  onSelectLow,
  onSelectHigh,
  tooltip,
}: {
  name: string;
  lowLabel: string;
  highLabel: string;
  highSelected: boolean;
  onSelectLow: () => void;
  onSelectHigh: () => void;
  tooltip?: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className={`${legendClass} flex items-center gap-1.5`}>
        {name}
        {tooltip ? <InfoTooltip text={tooltip} /> : null}
      </legend>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
        <input type="radio" className="h-4 w-4 accent-primary" checked={!highSelected} onChange={onSelectLow} />
        {lowLabel}
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
        <input type="radio" className="h-4 w-4 accent-primary" checked={highSelected} onChange={onSelectHigh} />
        {highLabel}
      </label>
    </fieldset>
  );
}

interface Props {
  input: DlbclPrognosisInput;
  errors: DlbclPrognosisFieldErrors;
  result: DlbclPrognosisResult | null;
  onChange: (input: DlbclPrognosisInput) => void;
}

export function DlbclPrognosisForm({ input, result, onChange }: Props) {
  const set = (patch: Partial<DlbclPrognosisInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <BinaryRadio name="Age" lowLabel="< 60 years" highLabel="> 60 years" highSelected={input.ageOver60} onSelectLow={() => set({ ageOver60: false })} onSelectHigh={() => set({ ageOver60: true })} />
      <BinaryRadio name="Stage" lowLabel="I–II" highLabel="III–IV" highSelected={input.stageThreeFour} onSelectLow={() => set({ stageThreeFour: false })} onSelectHigh={() => set({ stageThreeFour: true })} tooltip="Ann Arbor stage grouping." />
      <BinaryRadio name="Extranodal site" lowLabel="0 or 1" highLabel="> 1" highSelected={input.extranodalOverOne} onSelectLow={() => set({ extranodalOverOne: false })} onSelectHigh={() => set({ extranodalOverOne: true })} />
      <BinaryRadio
        name="LDH"
        lowLabel={`Normal (≤ ${DEFAULT_LDH_ULN_U_PER_L} U/L)`}
        highLabel={`Elevated (> ${DEFAULT_LDH_ULN_U_PER_L} U/L)`}
        highSelected={input.ldhElevated}
        onSelectLow={() => set({ ldhElevated: false })}
        onSelectHigh={() => set({ ldhElevated: true })}
        tooltip="Use your laboratory ULN when available."
      />
      <BinaryRadio name="ECOG / Zubrod performance status" lowLabel="0–1" highLabel="2–4" highSelected={input.ecogTwoToFour} onSelectLow={() => set({ ecogTwoToFour: false })} onSelectHigh={() => set({ ecogTwoToFour: true })} />

      <div>
        <div className={legendClass}>Total points</div>
        <div className="flex h-11 items-center rounded-lg border border-border bg-muted/25 px-3 text-sm font-semibold tabular-nums text-primary" aria-live="polite">
          {result?.formattedScore ?? '0'}
        </div>
      </div>

      {result ? (
        <div className="space-y-2 rounded-lg border border-border bg-muted/15 p-3 text-xs text-muted-foreground">
          <p>Estimated 4-year progression-free survival: {result.progressionFreeSurvivalPercent}%</p>
          <p>Overall survival: {result.overallSurvivalPercent}%</p>
          <p className="font-medium text-accent">{result.prognosisLabel}</p>
        </div>
      ) : null}
    </form>
  );
}