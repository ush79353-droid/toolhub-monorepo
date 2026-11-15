'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatPowerNumber,
  fromNewtonMeters,
  fromRadiansPerSecond,
  fromWatts,
  horsepowerToWatts,
  toNewtonMeters,
  toRadiansPerSecond,
  toWatts,
  wattsToHorsepower,
} from './calculation';
import {
  WATTS_PER_MECHANICAL_HP,
  type HpUnit,
  type IndependentKind,
  type PowerUnit,
  type SpeedUnit,
  type TorqueToHpFieldErrors,
  type TorqueToHpInput,
  type TorqueUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface TorqueToHpDraft {
  primary: IndependentKind;
  secondary: IndependentKind;
  powerVia: 'power' | 'horsepower';
  torque: string;
  speed: string;
  power: string;
  horsepower: string;
  torqueUnit: TorqueUnit;
  speedUnit: SpeedUnit;
  powerUnit: PowerUnit;
  hpUnit: HpUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

function bumpPair(
  draft: TorqueToHpDraft,
  edited: IndependentKind,
  powerVia?: 'power' | 'horsepower'
): Pick<TorqueToHpDraft, 'primary' | 'secondary' | 'powerVia'> {
  const nextVia = powerVia ?? draft.powerVia;
  if (draft.primary === edited) {
    return { primary: edited, secondary: draft.secondary, powerVia: nextVia };
  }
  return { primary: edited, secondary: draft.primary, powerVia: nextVia };
}

export function inputToDraft(input: TorqueToHpInput): TorqueToHpDraft {
  return {
    primary: input.primary,
    secondary: input.secondary,
    powerVia: input.powerVia,
    torque: input.torque === null ? '' : formatPowerNumber(input.torque),
    speed: input.speed === null ? '' : formatPowerNumber(input.speed),
    power: input.power === null ? '' : formatPowerNumber(input.power),
    horsepower: input.horsepower === null ? '' : formatPowerNumber(input.horsepower),
    torqueUnit: input.torqueUnit,
    speedUnit: input.speedUnit,
    powerUnit: input.powerUnit,
    hpUnit: input.hpUnit,
  };
}

export function draftToInput(draft: TorqueToHpDraft): TorqueToHpInput {
  return {
    primary: draft.primary,
    secondary: draft.secondary,
    powerVia: draft.powerVia,
    torque: parseOptionalNumber(draft.torque),
    speed: parseOptionalNumber(draft.speed),
    power: parseOptionalNumber(draft.power),
    horsepower: parseOptionalNumber(draft.horsepower),
    torqueUnit: draft.torqueUnit,
    speedUnit: draft.speedUnit,
    powerUnit: draft.powerUnit,
    hpUnit: draft.hpUnit,
  };
}

interface TorqueToHpFormProps {
  draft: TorqueToHpDraft;
  errors: TorqueToHpFieldErrors;
  onDraftChange: (draft: TorqueToHpDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TorqueToHpForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: TorqueToHpFormProps) {
  const set = (patch: Partial<TorqueToHpDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Shaft power from P = τ × ω. Torque alone cannot become horsepower — rotational speed is
        required. Default horsepower is mechanical (1 hp ={' '}
        {formatPowerNumber(WATTS_PER_MECHANICAL_HP)} W). Metric PS is a separate unit.
      </div>

      {errors.pair ? (
        <p className="text-xs text-red-600" role="alert">
          {errors.pair}
        </p>
      ) : null}

      <FieldShell
        label="Torque"
        htmlFor="tq-hp-torque"
        tip="Rotational moment. Not energy — keep N·m separate from joules."
        error={errors.torque}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="tq-hp-torque"
              inputMode="decimal"
              className={inputClass}
              value={draft.torque}
              placeholder="Enter torque"
              aria-invalid={Boolean(errors.torque)}
              onChange={(event) =>
                set({
                  torque: event.target.value,
                  ...bumpPair(draft, 'torque'),
                })
              }
            />
          </div>
          <select
            className={selectClass}
            value={draft.torqueUnit}
            aria-label="Torque unit"
            onChange={(event) => {
              const next = event.target.value as TorqueUnit;
              const raw = parseOptionalNumber(draft.torque);
              set({
                torqueUnit: next,
                torque:
                  raw === null || !Number.isFinite(raw)
                    ? draft.torque
                    : formatPowerNumber(
                        fromNewtonMeters(toNewtonMeters(raw, draft.torqueUnit), next)
                      ),
              });
            }}
          >
            <option value="Nm">N·m</option>
            <option value="kNm">kN·m</option>
            <option value="Ncm">N·cm</option>
            <option value="ftlbf">ft·lbf</option>
            <option value="inlbf">in·lbf</option>
            <option value="kgfm">kgf·m</option>
            <option value="kgfcm">kgf·cm</option>
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Speed"
        htmlFor="tq-hp-speed"
        tip="Rotational speed. Converted internally to rad/s."
        error={errors.speed}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="tq-hp-speed"
              inputMode="decimal"
              className={inputClass}
              value={draft.speed}
              placeholder="Enter rotational speed"
              aria-invalid={Boolean(errors.speed)}
              onChange={(event) =>
                set({
                  speed: event.target.value,
                  ...bumpPair(draft, 'speed'),
                })
              }
            />
          </div>
          <select
            className={selectClass}
            value={draft.speedUnit}
            aria-label="Speed unit"
            onChange={(event) => {
              const next = event.target.value as SpeedUnit;
              const raw = parseOptionalNumber(draft.speed);
              set({
                speedUnit: next,
                speed:
                  raw === null || !Number.isFinite(raw)
                    ? draft.speed
                    : formatPowerNumber(
                        fromRadiansPerSecond(toRadiansPerSecond(raw, draft.speedUnit), next)
                      ),
              });
            }}
          >
            <option value="rpm">rpm</option>
            <option value="revs">rev/s</option>
            <option value="rads">rad/s</option>
            <option value="degs">°/s</option>
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Power"
        htmlFor="tq-hp-power"
        tip="Mechanical shaft power. Editing this with speed solves for torque."
        error={errors.power}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="tq-hp-power"
              inputMode="decimal"
              className={inputClass}
              value={draft.power}
              placeholder="Calculated power"
              aria-invalid={Boolean(errors.power)}
              onChange={(event) =>
                set({
                  power: event.target.value,
                  ...bumpPair(draft, 'power', 'power'),
                })
              }
            />
          </div>
          <select
            className={selectClass}
            value={draft.powerUnit}
            aria-label="Power unit"
            onChange={(event) => {
              const next = event.target.value as PowerUnit;
              const raw = parseOptionalNumber(draft.power);
              set({
                powerUnit: next,
                power:
                  raw === null || !Number.isFinite(raw)
                    ? draft.power
                    : formatPowerNumber(fromWatts(toWatts(raw, draft.powerUnit), next)),
              });
            }}
          >
            <option value="W">W</option>
            <option value="kW">kW</option>
            <option value="MW">MW</option>
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Horsepower"
        htmlFor="tq-hp-hp"
        tip="Mechanical hp by default; PS is metric horsepower (735.49875 W)."
        error={errors.horsepower}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="tq-hp-hp"
              inputMode="decimal"
              className={inputClass}
              value={draft.horsepower}
              placeholder="Calculated horsepower"
              aria-invalid={Boolean(errors.horsepower)}
              onChange={(event) =>
                set({
                  horsepower: event.target.value,
                  ...bumpPair(draft, 'power', 'horsepower'),
                })
              }
            />
          </div>
          <select
            className={selectClass}
            value={draft.hpUnit}
            aria-label="Horsepower unit"
            onChange={(event) => {
              const next = event.target.value as HpUnit;
              const raw = parseOptionalNumber(draft.horsepower);
              set({
                hpUnit: next,
                horsepower:
                  raw === null || !Number.isFinite(raw)
                    ? draft.horsepower
                    : formatPowerNumber(
                        wattsToHorsepower(horsepowerToWatts(raw, draft.hpUnit), next)
                      ),
              });
            }}
          >
            <option value="hp">hp (mech.)</option>
            <option value="PS">PS (metric)</option>
          </select>
        </div>
      </FieldShell>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
