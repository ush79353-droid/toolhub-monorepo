'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AreaFieldErrors,
  AreaInput,
  AreaSource,
  LengthFieldErrors,
  LengthInput,
  LengthSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface GajToSqYdDraft {
  areaSource: AreaSource;
  gaj: string;
  squareYards: string;
  lengthSource: LengthSource;
  linearGaj: string;
  yards: string;
  lengthOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function emptyDraft(): GajToSqYdDraft {
  return {
    areaSource: 'gaj',
    gaj: '',
    squareYards: '',
    lengthSource: 'linearGaj',
    linearGaj: '',
    yards: '',
    lengthOpen: false,
  };
}

export function draftToAreaInput(draft: GajToSqYdDraft): AreaInput {
  return {
    source: draft.areaSource,
    gaj: parseOptionalNumber(draft.gaj),
    squareYards: parseOptionalNumber(draft.squareYards),
  };
}

export function draftToLengthInput(draft: GajToSqYdDraft): LengthInput {
  return {
    source: draft.lengthSource,
    linearGaj: parseOptionalNumber(draft.linearGaj),
    yards: parseOptionalNumber(draft.yards),
  };
}

interface GajToSqYdFormProps {
  draft: GajToSqYdDraft;
  areaErrors: AreaFieldErrors;
  lengthErrors: LengthFieldErrors;
  onDraftChange: (draft: GajToSqYdDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
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

export function GajToSqYdForm({
  draft,
  areaErrors,
  lengthErrors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GajToSqYdFormProps) {
  const set = (patch: Partial<GajToSqYdDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Land-area gaj equals one square yard (1 gaj = 1 yd² = 9 ft²). Do not multiply by 9 when
 converting to square yards; that factor only applies for square feet. Linear gaj (length)
        is a separate 1:1 conversion with yards below.
      </div>

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Land area</p>

        <FieldShell
          label="Area in gaj"
          htmlFor="gaj-yd2-gaj"
          tip="Land-area gaj. Square yards = gaj × 1."
          error={areaErrors.gaj}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="gaj-yd2-gaj"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.gaj}
                placeholder="Enter gaj"
                aria-invalid={Boolean(areaErrors.gaj)}
                onChange={(event) => set({ areaSource: 'gaj', gaj: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              gaj
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Area in square yards"
          htmlFor="gaj-yd2-yd2"
          tip="Square yards. Gaj = square yards × 1."
          error={areaErrors.squareYards}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="gaj-yd2-yd2"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.squareYards}
                placeholder="Enter square yards"
                aria-invalid={Boolean(areaErrors.squareYards)}
                onChange={(event) =>
                  set({ areaSource: 'squareYards', squareYards: event.target.value })
                }
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              yd²
            </span>
          </div>
        </FieldShell>

        <p className="text-xs text-muted-foreground">1 gaj = 1 yd² = 9 ft²</p>
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-accent"
          onClick={() => set({ lengthOpen: !draft.lengthOpen })}
          aria-expanded={draft.lengthOpen}
        >
          Gaj as a unit of length
          {draft.lengthOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {draft.lengthOpen ? (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-muted-foreground">
              Gaj can refer to a unit of length or land area. Select the appropriate measurement type
              to avoid mixing length and area. This section does not change the land-area fields
              above.
            </p>

            <FieldShell
              label="Length in gaj"
              htmlFor="gaj-yd-linear"
              tip="Linear gaj. Yards = linear gaj × 1."
              error={lengthErrors.linearGaj}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="gaj-yd-linear"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.linearGaj}
                    placeholder="Enter linear gaj"
                    aria-invalid={Boolean(lengthErrors.linearGaj)}
                    onChange={(event) =>
                      set({ lengthSource: 'linearGaj', linearGaj: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  gaj
                </span>
              </div>
            </FieldShell>

            <FieldShell
              label="Length in yards"
              htmlFor="gaj-yd-yards"
              tip="Yards. Linear gaj = yards × 1."
              error={lengthErrors.yards}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="gaj-yd-yards"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.yards}
                    placeholder="Enter yards"
                    aria-invalid={Boolean(lengthErrors.yards)}
                    onChange={(event) =>
                      set({ lengthSource: 'yards', yards: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  yd
                </span>
              </div>
            </FieldShell>

            <p className="text-xs text-muted-foreground">1 linear gaj = 1 yd</p>
          </div>
        ) : null}
      </div>

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
