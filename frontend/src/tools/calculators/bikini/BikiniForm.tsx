'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertLength } from './calculation';
import { BikiniShapeIllustration } from './BikiniShapeIllustration';
import {
  LENGTH_UNIT_LABELS,
  createEmptyInput,
  type ActivityPref,
  type BikiniFieldErrors,
  type BikiniInput,
  type CoveragePref,
  type LengthUnit,
  type StylePref,
  type SupportPref,
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

interface BikiniFormProps {
  input: BikiniInput;
  errors: BikiniFieldErrors;
  onChange: (next: BikiniInput) => void;
}

export function BikiniForm({ input, errors, onChange }: BikiniFormProps) {
  const set = (patch: Partial<BikiniInput>) => onChange({ ...input, ...patch });

  const switchUnit = (next: LengthUnit) => {
    if (next === input.unit) return;
    const keys = ['bust', 'waist', 'highHip', 'hip'] as const;
    const patch: Partial<BikiniInput> = { unit: next };
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

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Explore bikini styles from four circumference measurements. Body-shape
        labels are approximate styling tools — not beauty standards. Calculations
        stay in your browser.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            onChange({
              ...createEmptyInput(),
              bust: '95',
              waist: '70',
              highHip: '88',
              hip: '96',
              unit: 'cm',
            })
          }
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (hourglass-like)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
        <BikiniShapeIllustration shape={null} />
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-accent">Units</span>
            <select
              aria-label="Length unit"
              className="h-9 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.unit}
              onChange={(e) => switchUnit(e.target.value as LengthUnit)}
            >
              {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
                <option key={u} value={u}>
                  {LENGTH_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>

          {(
            [
              {
                key: 'bust' as const,
                label: 'Bust circumference',
                tip: 'Measure around the fullest part of your bust while keeping the measuring tape level.',
                error: errors.bust,
              },
              {
                key: 'waist' as const,
                label: 'Waist circumference',
                tip: 'Measure around your natural waist, generally the narrowest part of your torso.',
                error: errors.waist,
              },
              {
                key: 'highHip' as const,
                label: 'High hip circumference',
                tip: 'Measure around the upper hip area, below your natural waist and above the fullest part of your hips.',
                error: errors.highHip,
              },
              {
                key: 'hip' as const,
                label: 'Hip circumference',
                tip: 'Measure around the fullest part of your hips and buttocks.',
                error: errors.hip,
              },
            ] as const
          ).map((f) => (
            <div key={f.key}>
              <label className={labelClass} htmlFor={`bikini-${f.key}`}>
                {f.label}
                <InfoTooltip content={f.tip} />
              </label>
              <FieldShell error={f.error}>
                <input
                  id={`bikini-${f.key}`}
                  className={inputClass}
                  inputMode="decimal"
                  value={input[f.key]}
                  onChange={(e) => set({ [f.key]: e.target.value })}
                />
                <span className="border-l border-border px-2 text-xs text-muted-foreground">
                  {LENGTH_UNIT_LABELS[input.unit]}
                </span>
              </FieldShell>
              {f.error ? (
                <p className="mt-1 text-xs text-rose-600">{f.error}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.showPreferences}
          onClick={() => set({ showPreferences: !input.showPreferences })}
        >
          Personalize recommendations (optional)
          <span className="text-xs font-normal text-muted-foreground">
            {input.showPreferences ? 'Hide' : 'Show'}
          </span>
        </button>
        {input.showPreferences ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="bikini-cov">
                Preferred coverage
              </label>
              <select
                id="bikini-cov"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.coverage}
                onChange={(e) =>
                  set({ coverage: e.target.value as CoveragePref })
                }
              >
                <option value="">No preference</option>
                <option value="minimal">Minimal</option>
                <option value="moderate">Moderate</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="bikini-sup">
                Bikini top support
              </label>
              <select
                id="bikini-sup"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.support}
                onChange={(e) =>
                  set({ support: e.target.value as SupportPref })
                }
              >
                <option value="">No preference</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="bikini-style">
                Preferred style
              </label>
              <select
                id="bikini-style"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.style}
                onChange={(e) => set({ style: e.target.value as StylePref })}
              >
                <option value="">No preference</option>
                <option value="classic">Classic</option>
                <option value="sporty">Sporty</option>
                <option value="trendy">Trendy</option>
                <option value="retro">Retro</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="bikini-act">
                Main activity
              </label>
              <select
                id="bikini-act"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.activity}
                onChange={(e) =>
                  set({ activity: e.target.value as ActivityPref })
                }
              >
                <option value="">No preference</option>
                <option value="swimming">Swimming</option>
                <option value="beach">Beach relaxation</option>
                <option value="water-sports">Water sports</option>
                <option value="poolside">Poolside wear</option>
              </select>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
