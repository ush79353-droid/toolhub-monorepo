'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMeasure, syncSourceDraft } from './calculation';
import {
  AGE_BAND_OPTIONS,
  SOURCE_OPTIONS,
  type VitaminAAgeBand,
  type VitaminAFieldErrors,
  type VitaminAInput,
  type VitaminAPairSource,
  type VitaminAResult,
  type VitaminASex,
  type VitaminASourceId,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

interface Props {
  input: VitaminAInput;
  errors: VitaminAFieldErrors;
  result: VitaminAResult | null;
  onChange: (input: VitaminAInput) => void;
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

function CollapsibleCard({
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
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-accent">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        )}
      </button>
      {open ? <div className="space-y-3.5 border-t border-border px-4 py-3">{children}</div> : null}
    </div>
  );
}

function sourceErrorKey(
  id: VitaminASourceId,
  side: VitaminAPairSource
): keyof VitaminAFieldErrors {
  if (side === 'iu') {
    if (id === 'retinol') return 'retinolIu';
    if (id === 'dietaryBetaCarotene') return 'dietaryBetaCaroteneIu';
    if (id === 'supplementalBetaCarotene') return 'supplementalBetaCaroteneIu';
    return 'dietaryOtherCarotenoidsIu';
  }
  if (id === 'retinol') return 'retinolRae';
  if (id === 'dietaryBetaCarotene') return 'dietaryBetaCaroteneRae';
  if (id === 'supplementalBetaCarotene') return 'supplementalBetaCaroteneRae';
  return 'dietaryOtherCarotenoidsRae';
}

export function VitaminAForm({ input, errors, result, onChange }: Props) {
  const [rdaOpen, setRdaOpen] = useState(true);
  const [openSources, setOpenSources] = useState<Record<VitaminASourceId, boolean>>({
    retinol: true,
    dietaryBetaCarotene: true,
    supplementalBetaCarotene: true,
    dietaryOtherCarotenoids: true,
  });

  const set = (patch: Partial<VitaminAInput>) => onChange({ ...input, ...patch });

  const setSex = (sex: VitaminASex) => set({ sex });
  const setAgeBand = (ageBand: VitaminAAgeBand) => set({ ageBand });

  const editSource = (id: VitaminASourceId, side: VitaminAPairSource, raw: string) => {
    const current = input.sources[id];
    const nextDraft =
      side === 'iu'
        ? syncSourceDraft(id, { ...current, iuText: raw, lastEdited: 'iu' })
        : syncSourceDraft(id, { ...current, raeText: raw, lastEdited: 'rae' });
    set({
      sources: {
        ...input.sources,
        [id]: nextDraft,
      },
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <CollapsibleCard
        title="Recommended Daily Allowance"
        open={rdaOpen}
        onToggle={() => setRdaOpen((v) => !v)}
      >
        <fieldset>
          <legend className={labelClass}>Gender</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Gender">
            {(
              [
                { id: 'female', label: 'Female' },
                { id: 'male', label: 'Male' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="vitamin-a-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === opt.id}
                  onChange={() => setSex(opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <FieldShell
          label="Age"
          htmlFor="vitamin-a-age-band"
          tip="NIH ODS vitamin A RDA/AI bands (mcg RAE). Pregnancy and lactation rows are not on this worksheet."
          error={errors.ageBand}
        >
          <select
            id="vitamin-a-age-band"
            className={selectClass}
            value={input.ageBand}
            onChange={(e) => setAgeBand(e.target.value as VitaminAAgeBand)}
          >
            {AGE_BAND_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>

        {result ? (
          <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.rdaLabel}</span>
            {': '}
            {formatMeasure(result.rdaMcgRae)} mcg RAE/day ({result.rdaKind.toUpperCase()}).{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </CollapsibleCard>

      {SOURCE_OPTIONS.map((source) => {
        const draft = input.sources[source.id];
        const open = openSources[source.id];
        return (
          <CollapsibleCard
            key={source.id}
            title={source.label}
            open={open}
            onToggle={() =>
              setOpenSources((prev) => ({ ...prev, [source.id]: !prev[source.id] }))
            }
          >
            <FieldShell
              label="International Units"
              htmlFor={`vitamin-a-${source.id}-iu`}
              tip={source.factorNote}
              error={errors[sourceErrorKey(source.id, 'iu')]}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id={`vitamin-a-${source.id}-iu`}
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.iuText}
                    aria-invalid={Boolean(errors[sourceErrorKey(source.id, 'iu')])}
                    onChange={(e) => editSource(source.id, 'iu', e.target.value)}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  IU
                </span>
              </div>
            </FieldShell>

            <FieldShell
              label="Retinol Activity Equivalents"
              htmlFor={`vitamin-a-${source.id}-rae`}
              tip="mcg RAE for this source only. Editing RAE updates IU with the same NIH factor; total RAE sums each source once."
              error={errors[sourceErrorKey(source.id, 'rae')]}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id={`vitamin-a-${source.id}-rae`}
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.raeText}
                    aria-invalid={Boolean(errors[sourceErrorKey(source.id, 'rae')])}
                    onChange={(e) => editSource(source.id, 'rae', e.target.value)}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  mcg
                </span>
              </div>
            </FieldShell>
          </CollapsibleCard>
        );
      })}
    </form>
  );
}
