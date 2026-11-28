'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertLength,
  getRecommendedFullnessRatio,
} from './calculation';
import { CurtainPanelDiagram } from './CurtainPanelDiagram';
import {
  FABRIC_WEIGHT_LABELS,
  LENGTH_UNIT_LABELS,
  LENGTH_UNITS,
  PANEL_TYPE_LABELS,
  createEmptyInput,
  type CurtainPanelFieldErrors,
  type CurtainPanelInput,
  type CurtainPanelType,
  type FabricWeight,
  type LengthUnit,
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

interface CurtainPanelFormProps {
  input: CurtainPanelInput;
  errors: CurtainPanelFieldErrors;
  onChange: (next: CurtainPanelInput) => void;
}

export function CurtainPanelForm({
  input,
  errors,
  onChange,
}: CurtainPanelFormProps) {
  const set = (patch: Partial<CurtainPanelInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: LengthUnit) => {
    if (next === input.unit) return;
    const keys = [
      'rodWidth',
      'finishedLength',
      'fabricWidth',
      'sideHemAllowance',
      'topAllowance',
      'bottomAllowance',
      'joiningSeamAllowance',
      'patternRepeat',
    ] as const;
    const patch: Partial<CurtainPanelInput> = { unit: next };
    for (const key of keys) {
      const raw = input[key].trim();
      const n = Number(raw.replace(/,/g, ''));
      if (raw !== '' && Number.isFinite(n)) {
        patch[key] = String(
          Number(convertLength(n, input.unit, next).toFixed(4)),
        );
      }
    }
    set(patch);
  };

  const panelsN = Number(input.numberOfPanels) || 2;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Plan curtain coverage, panel cut sizes, fabric drops, and yardage.
        Fullness and hems are sewing conventions — adjust for your heading and
        fabric.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (200 cm rod · 2× fullness)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-white p-3.5">
            <h3 className="mb-2 text-[13px] font-semibold text-accent">
              Type of panel
            </h3>
            <fieldset>
              <legend className="sr-only">Curtain panel type</legend>
              <div className="flex flex-col gap-2">
                {(Object.keys(PANEL_TYPE_LABELS) as CurtainPanelType[]).map(
                  (t) => (
                    <label
                      key={t}
                      className="inline-flex items-center gap-2 text-sm text-accent"
                    >
                      <input
                        type="radio"
                        name="curtain-type"
                        className="h-4 w-4"
                        checked={input.panelType === t}
                        onChange={() => {
                          const next = { ...input, panelType: t };
                          if (input.fabricWeight !== 'custom') {
                            next.fullnessRatio = String(
                              getRecommendedFullnessRatio(
                                input.fabricWeight,
                                t,
                              ),
                            );
                          }
                          onChange(next);
                        }}
                      />
                      {PANEL_TYPE_LABELS[t]}
                    </label>
                  ),
                )}
              </div>
            </fieldset>
          </div>

          <div>
            <label className={labelClass} htmlFor="cp-weight">
              Curtain fabric type
            </label>
            <select
              id="cp-weight"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.fabricWeight}
              onChange={(e) => {
                const w = e.target.value as FabricWeight;
                const patch: Partial<CurtainPanelInput> = { fabricWeight: w };
                if (w !== 'custom') {
                  patch.fullnessRatio = String(
                    getRecommendedFullnessRatio(w, input.panelType),
                  );
                }
                set(patch);
              }}
            >
              {(Object.keys(FABRIC_WEIGHT_LABELS) as FabricWeight[]).map(
                (w) => (
                  <option key={w} value={w}>
                    {FABRIC_WEIGHT_LABELS[w]}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="cp-full">
              Fullness ratio
              <InfoTooltip content="Total flat curtain width ÷ rod width. Lightweight often ~2.5×; medium ~2×; heavy ~1.5×." />
            </label>
            <FieldShell error={errors.fullnessRatio}>
              <input
                id="cp-full"
                className={inputClass}
                inputMode="decimal"
                value={input.fullnessRatio}
                onChange={(e) =>
                  set({
                    fullnessRatio: e.target.value,
                    fabricWeight: 'custom',
                  })
                }
              />
              <span className="border-l border-border px-2 text-xs text-muted-foreground">
                ×
              </span>
            </FieldShell>
            {errors.fullnessRatio ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.fullnessRatio}
              </p>
            ) : null}
          </div>
        </div>
        <CurtainPanelDiagram
          panelType={input.panelType}
          numberOfPanels={panelsN}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="cp-unit">
          Units
        </label>
        <select
          id="cp-unit"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
          value={input.unit}
          onChange={(e) => switchUnit(e.target.value as LengthUnit)}
        >
          {LENGTH_UNITS.map((u) => (
            <option key={u} value={u}>
              {LENGTH_UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cp-rod">
            Curtain rod width
            <InfoTooltip content="Usually the installed rod/track span — not only the glass width." />
          </label>
          <FieldShell error={errors.rodWidth}>
            <input
              id="cp-rod"
              className={inputClass}
              inputMode="decimal"
              value={input.rodWidth}
              onChange={(e) => set({ rodWidth: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {LENGTH_UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.rodWidth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rodWidth}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="cp-len">
            Desired curtain length
            <InfoTooltip content="Finished length from your heading reference (rod/hook) to the hem." />
          </label>
          <FieldShell error={errors.finishedLength}>
            <input
              id="cp-len"
              className={inputClass}
              inputMode="decimal"
              value={input.finishedLength}
              onChange={(e) => set({ finishedLength: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {LENGTH_UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.finishedLength ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.finishedLength}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cp-panels">
            Number of panels
          </label>
          <FieldShell error={errors.numberOfPanels}>
            <input
              id="cp-panels"
              className={inputClass}
              inputMode="numeric"
              value={input.numberOfPanels}
              onChange={(e) => set({ numberOfPanels: e.target.value })}
            />
          </FieldShell>
          {errors.numberOfPanels ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.numberOfPanels}
            </p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="cp-fw">
            Fabric width (usable)
            <InfoTooltip content="Usable width before cutting — account for selvedges if needed." />
          </label>
          <FieldShell error={errors.fabricWidth}>
            <input
              id="cp-fw"
              className={inputClass}
              inputMode="decimal"
              value={input.fabricWidth}
              onChange={(e) => set({ fabricWidth: e.target.value })}
            />
            <span className="border-l border-border px-2 text-xs text-muted-foreground">
              {LENGTH_UNIT_LABELS[input.unit]}
            </span>
          </FieldShell>
          {errors.fabricWidth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.fabricWidth}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="cp-top">
            Top allowance
          </label>
          <FieldShell error={errors.topAllowance}>
            <input
              id="cp-top"
              className={inputClass}
              inputMode="decimal"
              value={input.topAllowance}
              onChange={(e) => set({ topAllowance: e.target.value })}
            />
          </FieldShell>
          {errors.topAllowance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.topAllowance}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="cp-bot">
            Bottom hem
          </label>
          <FieldShell error={errors.bottomAllowance}>
            <input
              id="cp-bot"
              className={inputClass}
              inputMode="decimal"
              value={input.bottomAllowance}
              onChange={(e) => set({ bottomAllowance: e.target.value })}
            />
          </FieldShell>
          {errors.bottomAllowance ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.bottomAllowance}
            </p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="cp-side">
            Side hem (each)
          </label>
          <FieldShell error={errors.sideHemAllowance}>
            <input
              id="cp-side"
              className={inputClass}
              inputMode="decimal"
              value={input.sideHemAllowance}
              onChange={(e) => set({ sideHemAllowance: e.target.value })}
            />
          </FieldShell>
          {errors.sideHemAllowance ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.sideHemAllowance}
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.showAdvanced}
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
        >
          Advanced (joins, repeat, shrinkage, waste)
          <span className="text-xs font-normal text-muted-foreground">
            {input.showAdvanced ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="cp-join">
                Joining seam (per raw edge)
              </label>
              <FieldShell error={errors.joiningSeamAllowance}>
                <input
                  id="cp-join"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.joiningSeamAllowance}
                  onChange={(e) =>
                    set({ joiningSeamAllowance: e.target.value })
                  }
                />
              </FieldShell>
              {errors.joiningSeamAllowance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.joiningSeamAllowance}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="cp-rep">
                Vertical pattern repeat
              </label>
              <FieldShell error={errors.patternRepeat}>
                <input
                  id="cp-rep"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.patternRepeat}
                  onChange={(e) => set({ patternRepeat: e.target.value })}
                />
              </FieldShell>
              {errors.patternRepeat ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.patternRepeat}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="cp-sh">
                Shrinkage %
              </label>
              <FieldShell error={errors.shrinkagePercentage}>
                <input
                  id="cp-sh"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.shrinkagePercentage}
                  onChange={(e) =>
                    set({ shrinkagePercentage: e.target.value })
                  }
                />
              </FieldShell>
              {errors.shrinkagePercentage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.shrinkagePercentage}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="cp-waste">
                Extra waste %
              </label>
              <FieldShell error={errors.wastePercentage}>
                <input
                  id="cp-waste"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.wastePercentage}
                  onChange={(e) => set({ wastePercentage: e.target.value })}
                />
              </FieldShell>
              {errors.wastePercentage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.wastePercentage}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
