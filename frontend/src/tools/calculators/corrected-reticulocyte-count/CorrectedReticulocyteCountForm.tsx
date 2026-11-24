'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatPercent } from './calculation';
import type {
  CorrectedReticulocyteCountFieldErrors,
  CorrectedReticulocyteCountInput,
  CorrectedReticulocyteCountResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

interface Props {
  input: CorrectedReticulocyteCountInput;
  errors: CorrectedReticulocyteCountFieldErrors;
  result: CorrectedReticulocyteCountResult | null;
  onChange: (input: CorrectedReticulocyteCountInput) => void;
}

export function CorrectedReticulocyteCountForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<CorrectedReticulocyteCountInput>) =>
    onChange({ ...input, ...patch });

  const crcDisplay =
    result?.correctedReticulocytePercent != null
      ? formatPercent(result.correctedReticulocytePercent)
      : '';

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <div>
        <label className={labelClass} htmlFor="crc-hct">
          Hematocrit (Hct)
          <InfoTooltip text="Patient hematocrit from the CBC (%)." />
        </label>
        <div className={`flex h-11 items-center rounded-lg border ${errors.hematocritPercentText ? 'border-rose-400' : 'border-border'}`}>
          <input id="crc-hct" type="text" inputMode="decimal" className={inputClass} value={input.hematocritPercentText} onChange={(e) => set({ hematocritPercentText: e.target.value })} />
          <span className={unitFixed}>%</span>
        </div>
        {errors.hematocritPercentText ? <p className="mt-1 text-xs text-rose-600">{errors.hematocritPercentText}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="crc-retic">
          Reticulocytes
          <InfoTooltip text="Reticulocyte differential (%)." />
        </label>
        <div className={`flex h-11 items-center rounded-lg border ${errors.reticulocytePercentText ? 'border-rose-400' : 'border-border'}`}>
          <input id="crc-retic" type="text" inputMode="decimal" className={inputClass} value={input.reticulocytePercentText} onChange={(e) => set({ reticulocytePercentText: e.target.value })} />
          <span className={unitFixed}>%</span>
        </div>
        {errors.reticulocytePercentText ? <p className="mt-1 text-xs text-rose-600">{errors.reticulocytePercentText}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="crc-out">
          Corrected reticulocyte count (CRC)
        </label>
        <div className="flex h-11 items-center rounded-lg border border-sky-200 bg-sky-50/60">
          <input id="crc-out" readOnly className={`${inputClass} text-muted-foreground`} value={crcDisplay} aria-live="polite" />
          <span className={unitFixed}>%</span>
        </div>
        {result?.statusDetail ? <p className="mt-2 text-xs text-muted-foreground">{result.statusDetail}</p> : null}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
        <input type="checkbox" className="h-4 w-4 accent-primary" checked={input.showMaturationIndex} onChange={(e) => set({ showMaturationIndex: e.target.checked })} />
        Show maturation
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
        <input type="checkbox" className="h-4 w-4 accent-primary" checked={input.useCustomReferenceHematocrit} onChange={(e) => set({ useCustomReferenceHematocrit: e.target.checked })} />
        Set a custom value of normal hematocrit
      </label>

      {input.useCustomReferenceHematocrit ? (
        <div>
          <label className={labelClass} htmlFor="crc-ref-hct">Normal hematocrit</label>
          <div className={`flex h-11 items-center rounded-lg border ${errors.referenceHematocritPercentText ? 'border-rose-400' : 'border-border'}`}>
            <input id="crc-ref-hct" type="text" inputMode="decimal" className={inputClass} value={input.referenceHematocritPercentText} onChange={(e) => set({ referenceHematocritPercentText: e.target.value })} />
            <span className={unitFixed}>%</span>
          </div>
          {errors.referenceHematocritPercentText ? <p className="mt-1 text-xs text-rose-600">{errors.referenceHematocritPercentText}</p> : null}
        </div>
      ) : null}
    </form>
  );
}