'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_JOULES,
  DEFAULT_NEWTONS,
  DEFAULT_WORK_ANGLE_DEG,
  DEFAULT_WORK_DISTANCE,
  DEFAULT_WORK_FORCE,
  type EnergyField,
  type ForceField,
  type NmToJoulesFieldErrors,
  type WorkCalcField,
} from './types';
import { calculateWork, formatAmount } from './calculation';

export type ActiveNmField = ForceField | EnergyField | WorkCalcField;

export interface NmToJoulesDraft {
  forceOpen: boolean;
  energyOpen: boolean;
  workOpen: boolean;
  newtons: string;
  joulesPerMeter: string;
  joules: string;
  newtonMeters: string;
  workForce: string;
  workDistance: string;
  workAngle: string;
  workResult: string;
  activeField: ActiveNmField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): NmToJoulesDraft {
  const work = calculateWork(DEFAULT_WORK_FORCE, DEFAULT_WORK_DISTANCE, DEFAULT_WORK_ANGLE_DEG);
  return {
    forceOpen: true,
    energyOpen: true,
    workOpen: false,
    newtons: String(DEFAULT_NEWTONS),
    joulesPerMeter: formatAmount(DEFAULT_NEWTONS),
    joules: String(DEFAULT_JOULES),
    newtonMeters: formatAmount(DEFAULT_JOULES),
    workForce: String(DEFAULT_WORK_FORCE),
    workDistance: String(DEFAULT_WORK_DISTANCE),
    workAngle: String(DEFAULT_WORK_ANGLE_DEG),
    workResult: formatAmount(work),
    activeField: null,
  };
}

export function emptyDraft(): NmToJoulesDraft {
  return {
    forceOpen: true,
    energyOpen: true,
    workOpen: false,
    newtons: '',
    joulesPerMeter: '',
    joules: '',
    newtonMeters: '',
    workForce: '',
    workDistance: '',
    workAngle: '0',
    workResult: '',
    activeField: null,
  };
}

interface NmToJoulesFormProps {
  draft: NmToJoulesDraft;
  errors: NmToJoulesFieldErrors;
  onDraftChange: (draft: NmToJoulesDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function UnitField({
  id,
  label,
  value,
  unit,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  unit: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={value}
            placeholder="Enter value"
            aria-invalid={Boolean(error)}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
          {unit}
        </span>
      </div>
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
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
    <div className="rounded-xl border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open ? <div className="space-y-3 border-t border-border px-3.5 py-3.5">{children}</div> : null}
    </div>
  );
}

export function NmToJoulesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: NmToJoulesFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        1 N = 1 J/m and 1 J = 1 N·m for work/energy. Force and work/energy sections are independent.
        Newton-meters of torque are not automatically interchangeable with joules of energy.
      </div>

      <Section
        title="Force conversion"
        open={draft.forceOpen}
        onToggle={() => onDraftChange({ ...draft, forceOpen: !draft.forceOpen })}
      >
        <UnitField
          id="nmj-newtons"
          label="Newtons"
          value={draft.newtons}
          unit="N"
          error={errors.newtons}
          onChange={(value) =>
            onDraftChange({ ...draft, newtons: value, activeField: 'newtons' })
          }
        />
        <UnitField
          id="nmj-jpm"
          label="Joules per meter"
          value={draft.joulesPerMeter}
          unit="J/m"
          error={errors.joulesPerMeter}
          onChange={(value) =>
            onDraftChange({ ...draft, joulesPerMeter: value, activeField: 'joulesPerMeter' })
          }
        />
      </Section>

      <Section
        title="Work/energy conversion"
        open={draft.energyOpen}
        onToggle={() => onDraftChange({ ...draft, energyOpen: !draft.energyOpen })}
      >
        <UnitField
          id="nmj-joules"
          label="Joules"
          value={draft.joules}
          unit="J"
          error={errors.joules}
          onChange={(value) => onDraftChange({ ...draft, joules: value, activeField: 'joules' })}
        />
        <UnitField
          id="nmj-nm"
          label="Newton-meters"
          value={draft.newtonMeters}
          unit="N·m"
          error={errors.newtonMeters}
          onChange={(value) =>
            onDraftChange({ ...draft, newtonMeters: value, activeField: 'newtonMeters' })
          }
        />
      </Section>

      <Section
        title="Calculate work (optional)"
        open={draft.workOpen}
        onToggle={() => onDraftChange({ ...draft, workOpen: !draft.workOpen })}
      >
        <p className="text-xs leading-relaxed text-muted-foreground">
          W = F d cos(θ). Force alone cannot be converted to joules without displacement.
        </p>
        <UnitField
          id="nmj-work-force"
          label="Force"
          value={draft.workForce}
          unit="N"
          error={errors.force}
          onChange={(value) =>
            onDraftChange({ ...draft, workForce: value, activeField: 'force' })
          }
        />
        <UnitField
          id="nmj-work-distance"
          label="Displacement"
          value={draft.workDistance}
          unit="m"
          error={errors.distance}
          onChange={(value) =>
            onDraftChange({ ...draft, workDistance: value, activeField: 'distance' })
          }
        />
        <UnitField
          id="nmj-work-angle"
          label="Angle between force and displacement"
          value={draft.workAngle}
          unit="°"
          error={errors.angle}
          onChange={(value) =>
            onDraftChange({ ...draft, workAngle: value, activeField: 'angle' })
          }
        />
        <UnitField
          id="nmj-work-result"
          label="Work"
          value={draft.workResult}
          unit="J"
          error={errors.work}
          onChange={(value) =>
            onDraftChange({ ...draft, workResult: value, activeField: 'work' })
          }
        />
      </Section>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
