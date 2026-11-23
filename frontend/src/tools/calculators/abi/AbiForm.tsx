'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { AbiFieldErrors, AbiInput, AbiResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitClass =
  'shrink-0 pr-3 text-sm text-muted-foreground';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

function FieldShell({
  error,
  muted,
  children,
  suffix,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
  suffix?: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
      {suffix}
    </div>
  );
}

interface Props {
  input: AbiInput;
  errors: AbiFieldErrors;
  result: AbiResult;
  rightOpen: boolean;
  leftOpen: boolean;
  onRightOpenChange: (open: boolean) => void;
  onLeftOpenChange: (open: boolean) => void;
  onChange: (input: AbiInput) => void;
}

export function AbiForm({
  input,
  errors,
  result,
  rightOpen,
  leftOpen,
  onRightOpenChange,
  onLeftOpenChange,
  onChange,
}: Props) {
  const set = (patch: Partial<AbiInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Measure the blood pressure in both arms and enter the higher of the
          two numbers below.
        </p>
        <div>
          <label className={labelClass} htmlFor="abi-arm">
            <span>Highest arm blood pressure</span>
            <InfoTooltip
              label="Highest arm blood pressure"
              text="Use the higher of the two brachial systolic pressures (mmHg), typically measured with a Doppler probe."
            />
          </label>
          <FieldShell error={errors.armMmHg} suffix={<span className={unitClass}>mmHg</span>}>
            <input
              id="abi-arm"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.armMmHg}
              onChange={(e) => set({ armMmHg: e.target.value })}
              aria-invalid={Boolean(errors.armMmHg)}
            />
          </FieldShell>
          {errors.armMmHg ? (
            <p className="mt-1 text-xs text-rose-600">{errors.armMmHg}</p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={rightOpen}
          onClick={() => onRightOpenChange(!rightOpen)}
        >
          <span>ABI for the right leg</span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${
              rightOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {rightOpen ? (
          <div className="space-y-3.5 pt-1">
            <div>
              <label className={labelClass} htmlFor="abi-right-foot">
                <span>Highest pressure in right foot</span>
                <InfoTooltip
                  label="Highest pressure in right foot"
                  text="Higher of right dorsalis pedis and posterior tibial systolic pressures (mmHg)."
                />
              </label>
              <FieldShell
                error={errors.rightFootMmHg}
                suffix={<span className={unitClass}>mmHg</span>}
              >
                <input
                  id="abi-right-foot"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.rightFootMmHg}
                  onChange={(e) => set({ rightFootMmHg: e.target.value })}
                  aria-invalid={Boolean(errors.rightFootMmHg)}
                />
              </FieldShell>
              {errors.rightFootMmHg ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.rightFootMmHg}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="abi-right-result">
                <span>Right ABI</span>
                <InfoTooltip
                  label="Right ABI"
                  text="Right foot systolic ÷ highest arm systolic. Blank until both values are valid and arm &gt; 0."
                />
              </label>
              <FieldShell muted>
                <input
                  id="abi-right-result"
                  type="text"
                  readOnly
                  className={`${inputClass} cursor-default text-muted-foreground`}
                  value={result.right?.formattedAbi ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={leftOpen}
          onClick={() => onLeftOpenChange(!leftOpen)}
        >
          <span>ABI for the left leg</span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${
              leftOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {leftOpen ? (
          <div className="space-y-3.5 pt-1">
            <div>
              <label className={labelClass} htmlFor="abi-left-foot">
                <span>Highest pressure in left foot</span>
                <InfoTooltip
                  label="Highest pressure in left foot"
                  text="Higher of left dorsalis pedis and posterior tibial systolic pressures (mmHg)."
                />
              </label>
              <FieldShell
                error={errors.leftFootMmHg}
                suffix={<span className={unitClass}>mmHg</span>}
              >
                <input
                  id="abi-left-foot"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.leftFootMmHg}
                  onChange={(e) => set({ leftFootMmHg: e.target.value })}
                  aria-invalid={Boolean(errors.leftFootMmHg)}
                />
              </FieldShell>
              {errors.leftFootMmHg ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.leftFootMmHg}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="abi-left-result">
                <span>Left ABI</span>
                <InfoTooltip
                  label="Left ABI"
                  text="Left foot systolic ÷ highest arm systolic. Blank until both values are valid and arm &gt; 0."
                />
              </label>
              <FieldShell muted>
                <input
                  id="abi-left-result"
                  type="text"
                  readOnly
                  className={`${inputClass} cursor-default text-muted-foreground`}
                  value={result.left?.formattedAbi ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
