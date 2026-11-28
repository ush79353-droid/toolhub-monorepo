'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertPower } from './calculation';
import {
  DRIVETRAIN_LABELS,
  DRIVETRAIN_PRESETS,
  EFFICIENCY_MODE_LABELS,
  MODE_LABELS,
  POWER_UNIT_LABELS,
  createEmptyInput,
  type CalculationMode,
  type DrivetrainType,
  type EfficiencyMode,
  type PowerUnit,
  type WheelHorsepowerFieldErrors,
  type WheelHorsepowerInput,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-3.5">
      <button
        type="button"
        className="flex w-full items-center justify-between text-[13px] font-semibold text-accent"
        onClick={onToggle}
        aria-expanded={open}
      >
        {title}
        <span className="text-muted-foreground">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="mt-3 space-y-3">{children}</div> : null}
    </div>
  );
}

interface WheelHorsepowerFormProps {
  input: WheelHorsepowerInput;
  errors: WheelHorsepowerFieldErrors;
  onChange: (next: WheelHorsepowerInput) => void;
}

export function WheelHorsepowerForm({
  input,
  errors,
  onChange,
}: WheelHorsepowerFormProps) {
  const set = (patch: Partial<WheelHorsepowerInput>) =>
    onChange({ ...input, ...patch });

  const applyDrivetrain = (type: DrivetrainType) => {
    if (type === 'CUSTOM') {
      set({
        drivetrainType: type,
        includePropellerShaft: true,
      });
      return;
    }
    const preset = DRIVETRAIN_PRESETS[type];
    set({
      drivetrainType: type,
      overallEfficiency: String(preset.efficiencyPercent),
      includePropellerShaft: type !== 'FWD',
      efficiencyMode:
        input.efficiencyMode === 'components' ? 'components' : 'overall',
    });
  };

  const showEngine =
    input.calculationMode === 'engine-to-wheel' ||
    input.calculationMode === 'measured-efficiency';
  const showWheel =
    input.calculationMode === 'wheel-to-engine' ||
    input.calculationMode === 'measured-efficiency';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate wheel horsepower or crankshaft horsepower from drivetrain
        efficiency. Presets are illustrative — edit freely. Use overall or
        component mode, not both stacked.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (300 hp · 85%)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Drivetrain</h3>
        <fieldset>
          <legend className={labelClass}>Drivetrain type</legend>
          <div className="flex flex-col gap-2">
            {(Object.keys(DRIVETRAIN_LABELS) as DrivetrainType[]).map((t) => (
              <label
                key={t}
                className="inline-flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="whp-drivetrain"
                  className="h-4 w-4 border-border"
                  checked={input.drivetrainType === t}
                  onChange={() => applyDrivetrain(t)}
                />
                {DRIVETRAIN_LABELS[t]}
                {t !== 'CUSTOM' ? (
                  <span className="text-[11px] text-muted-foreground">
                    ({DRIVETRAIN_PRESETS[t].note})
                  </span>
                ) : null}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="whp-mode" className={labelClass}>
            Calculation mode
          </label>
          <select
            id="whp-mode"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.calculationMode}
            onChange={(e) =>
              set({ calculationMode: e.target.value as CalculationMode })
            }
          >
            {(Object.keys(MODE_LABELS) as CalculationMode[]).map((m) => (
              <option key={m} value={m}>
                {MODE_LABELS[m]}
              </option>
            ))}
          </select>
        </div>

        {showEngine ? (
          <div>
            <label htmlFor="whp-eng" className={labelClass}>
              Engine horsepower
              <InfoTooltip
                label="Crankshaft power"
                text="Power at the crankshaft / flywheel before drivetrain losses."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.engineHorsepower}>
                <input
                  id="whp-eng"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.engineHorsepower}
                  onChange={(e) => set({ engineHorsepower: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                value={input.powerUnit}
                aria-label="Power unit"
                onChange={(e) => {
                  const next = e.target.value as PowerUnit;
                  const nEng = Number(input.engineHorsepower.replace(/,/g, ''));
                  const nWhp = Number(input.wheelHorsepower.replace(/,/g, ''));
                  const patch: Partial<WheelHorsepowerInput> = {
                    powerUnit: next,
                  };
                  if (Number.isFinite(nEng) && nEng > 0) {
                    patch.engineHorsepower = String(
                      Number(
                        convertPower(nEng, input.powerUnit, next).toPrecision(
                          12,
                        ),
                      ),
                    );
                  }
                  if (Number.isFinite(nWhp) && nWhp > 0) {
                    patch.wheelHorsepower = String(
                      Number(
                        convertPower(nWhp, input.powerUnit, next).toPrecision(
                          12,
                        ),
                      ),
                    );
                  }
                  set(patch);
                }}
              >
                {(Object.keys(POWER_UNIT_LABELS) as PowerUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {POWER_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            {errors.engineHorsepower ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.engineHorsepower}
              </p>
            ) : null}
          </div>
        ) : null}

        {showWheel ? (
          <div>
            <label htmlFor="whp-whp" className={labelClass}>
              Wheel horsepower
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.wheelHorsepower}>
                <input
                  id="whp-whp"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.wheelHorsepower}
                  onChange={(e) => set({ wheelHorsepower: e.target.value })}
                />
              </FieldShell>
              <span className="flex h-11 items-center text-xs text-muted-foreground">
                {POWER_UNIT_LABELS[input.powerUnit]}
              </span>
            </div>
            {errors.wheelHorsepower ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.wheelHorsepower}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {input.calculationMode !== 'measured-efficiency' ? (
        <>
          <div className="rounded-xl border border-border bg-white p-3.5">
            <label htmlFor="whp-effmode" className={labelClass}>
              Efficiency mode
            </label>
            <select
              id="whp-effmode"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.efficiencyMode}
              onChange={(e) =>
                set({ efficiencyMode: e.target.value as EfficiencyMode })
              }
            >
              {(Object.keys(EFFICIENCY_MODE_LABELS) as EfficiencyMode[]).map(
                (m) => (
                  <option key={m} value={m}>
                    {EFFICIENCY_MODE_LABELS[m]}
                  </option>
                ),
              )}
            </select>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Overall mode uses one η. Component mode multiplies gearbox ×
              {input.includePropellerShaft ? ' prop shaft ×' : ''} differential
              × driveshaft only — no extra overall loss stacked.
            </p>
          </div>

          {input.efficiencyMode === 'overall' ? (
            <div className="rounded-xl border border-border bg-white p-3.5">
              <label htmlFor="whp-eta" className={labelClass}>
                Overall drivetrain efficiency
              </label>
              <FieldShell error={errors.overallEfficiency}>
                <input
                  id="whp-eta"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.overallEfficiency}
                  onChange={(e) => set({ overallEfficiency: e.target.value })}
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.overallEfficiency ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.overallEfficiency}
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <Section
                title="Gearbox"
                open={input.openGearbox}
                onToggle={() => set({ openGearbox: !input.openGearbox })}
              >
                <label htmlFor="whp-gb" className={labelClass}>
                  Gearbox efficiency
                </label>
                <FieldShell error={errors.gearboxEfficiency}>
                  <input
                    id="whp-gb"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.gearboxEfficiency}
                    onChange={(e) =>
                      set({ gearboxEfficiency: e.target.value })
                    }
                  />
                  <span className="pr-3 text-sm text-muted-foreground">%</span>
                </FieldShell>
                {errors.gearboxEfficiency ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.gearboxEfficiency}
                  </p>
                ) : null}
              </Section>

              {input.includePropellerShaft ? (
                <Section
                  title="Propeller shaft"
                  open={input.openProp}
                  onToggle={() => set({ openProp: !input.openProp })}
                >
                  <label htmlFor="whp-ps" className={labelClass}>
                    Propeller shaft efficiency
                  </label>
                  <FieldShell error={errors.propellerShaftEfficiency}>
                    <input
                      id="whp-ps"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.propellerShaftEfficiency}
                      onChange={(e) =>
                        set({ propellerShaftEfficiency: e.target.value })
                      }
                    />
                    <span className="pr-3 text-sm text-muted-foreground">%</span>
                  </FieldShell>
                  {errors.propellerShaftEfficiency ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.propellerShaftEfficiency}
                    </p>
                  ) : null}
                </Section>
              ) : null}

              <Section
                title="Differential"
                open={input.openDiff}
                onToggle={() => set({ openDiff: !input.openDiff })}
              >
                <label htmlFor="whp-diff" className={labelClass}>
                  Differential efficiency
                </label>
                <FieldShell error={errors.differentialEfficiency}>
                  <input
                    id="whp-diff"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.differentialEfficiency}
                    onChange={(e) =>
                      set({ differentialEfficiency: e.target.value })
                    }
                  />
                  <span className="pr-3 text-sm text-muted-foreground">%</span>
                </FieldShell>
                {errors.differentialEfficiency ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.differentialEfficiency}
                  </p>
                ) : null}
              </Section>

              <Section
                title="Driveshaft"
                open={input.openDrive}
                onToggle={() => set({ openDrive: !input.openDrive })}
              >
                <label htmlFor="whp-ds" className={labelClass}>
                  Driveshaft efficiency
                </label>
                <FieldShell error={errors.driveshaftEfficiency}>
                  <input
                    id="whp-ds"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.driveshaftEfficiency}
                    onChange={(e) =>
                      set({ driveshaftEfficiency: e.target.value })
                    }
                  />
                  <span className="pr-3 text-sm text-muted-foreground">%</span>
                </FieldShell>
                {errors.driveshaftEfficiency ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.driveshaftEfficiency}
                  </p>
                ) : null}
              </Section>
            </>
          )}
        </>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
