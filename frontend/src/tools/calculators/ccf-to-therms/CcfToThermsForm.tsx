'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_CCF,
  DEFAULT_FACTOR,
  DEFAULT_HEATING_BTU_PER_FT3,
  type CcfThermsField,
  type CcfToThermsFieldErrors,
} from './types';
import { ccfToTherms, formatAmount } from './calculation';

export interface CcfToThermsDraft {
  ccf: string;
  therms: string;
  factor: string;
  heating: string;
  factorOpen: boolean;
  activeField: CcfThermsField | null;
  /** Last primary quantity edited — used when factor/heating changes. */
  primaryField: 'ccf' | 'therms';
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): CcfToThermsDraft {
  return {
    ccf: String(DEFAULT_CCF),
    therms: formatAmount(ccfToTherms(DEFAULT_CCF, DEFAULT_FACTOR)),
    factor: formatAmount(DEFAULT_FACTOR),
    heating: String(DEFAULT_HEATING_BTU_PER_FT3),
    factorOpen: false,
    activeField: null,
    primaryField: 'ccf',
  };
}

export function emptyDraft(keepFactor = true): CcfToThermsDraft {
  return {
    ccf: '',
    therms: '',
    factor: keepFactor ? formatAmount(DEFAULT_FACTOR) : '',
    heating: keepFactor ? String(DEFAULT_HEATING_BTU_PER_FT3) : '',
    factorOpen: false,
    activeField: null,
    primaryField: 'ccf',
  };
}

interface CcfToThermsFormProps {
  draft: CcfToThermsDraft;
  errors: CcfToThermsFieldErrors;
  onDraftChange: (draft: CcfToThermsDraft) => void;
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
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
          {unit}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CcfToThermsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CcfToThermsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        CCF measures volume; therms measure energy. The default factor 1.038 therms/CCF assumes an
        illustrative heating value of 1038 BTU/ft³ — not a universal utility billing rate. Use your
        bill&apos;s factor when available.
      </div>

      <UnitField
        id="ccf-input"
        label="CCF (hundred cubic feet of natural gas)"
        value={draft.ccf}
        unit="CCF"
        error={errors.ccf}
        onChange={(value) =>
          onDraftChange({ ...draft, ccf: value, activeField: 'ccf', primaryField: 'ccf' })
        }
      />

      <UnitField
        id="therms-input"
        label="Therms"
        value={draft.therms}
        unit="therm"
        error={errors.therms}
        onChange={(value) =>
          onDraftChange({
            ...draft,
            therms: value,
            activeField: 'therms',
            primaryField: 'therms',
          })
        }
      />

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.factorOpen}
          onClick={() => onDraftChange({ ...draft, factorOpen: !draft.factorOpen })}
        >
          <span>Custom Conversion Factor</span>
          {draft.factorOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.factorOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3.5">
            <UnitField
              id="factor-input"
              label="Therms per CCF"
              value={draft.factor}
              unit="therm/CCF"
              error={errors.factor}
              onChange={(value) =>
                onDraftChange({ ...draft, factor: value, activeField: 'factor' })
              }
            />
            <UnitField
              id="heating-input"
              label="Heating value (optional)"
              value={draft.heating}
              unit="BTU/ft³"
              error={errors.heating}
              onChange={(value) =>
                onDraftChange({ ...draft, heating: value, activeField: 'heating' })
              }
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              therms/CCF = (BTU/ft³) ÷ 1000. Editing either field updates the other and recalculates
              from your last CCF or therms entry.
            </p>
          </div>
        ) : null}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Convert
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
