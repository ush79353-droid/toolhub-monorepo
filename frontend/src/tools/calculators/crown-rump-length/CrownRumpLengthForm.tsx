'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { crlToMm, mmToCrlUnit } from './calculation';
import type {
  CrownRumpLengthFieldErrors,
  CrownRumpLengthInput,
  CrownRumpLengthResult,
  CrlUnit,
  GaDisplayUnit,
} from './types';
import {
  CRL_EXAMPLES,
  CRL_UNIT_LABELS,
  GA_DISPLAY_LABELS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatField(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface Props {
  input: CrownRumpLengthInput;
  errors: CrownRumpLengthFieldErrors;
  result: CrownRumpLengthResult | null;
  onChange: (input: CrownRumpLengthInput) => void;
  onLoadExample: (crlMm: number) => void;
}

export function CrownRumpLengthForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<CrownRumpLengthInput>) =>
    onChange({ ...input, ...patch });

  const switchCrlUnit = (next: CrlUnit) => {
    if (next === input.crlUnit) return;
    const raw = parseLoose(input.crlValue);
    let nextValue = input.crlValue;
    if (raw != null) {
      const mm = crlToMm(raw, input.crlUnit);
      if (mm != null) {
        nextValue = formatField(mmToCrlUnit(mm, next), next === 'mm' ? 1 : 3);
      }
    }
    set({ crlUnit: next, crlValue: nextValue });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational first-trimester dating from crown–rump length using the
        Robinson–Fleming equation. Entries stay in your browser only.
      </p>

      <div>
        <label className={labelClass} htmlFor="crl-length">
          <span>Crown rump length</span>
          <InfoTooltip
            label="Crown rump length"
            text="Ultrasound CRL from crown to rump. Converted to millimeters before dating. Supported educational range 5–84 mm (~first trimester)."
          />
        </label>
        <FieldShell error={errors.crlValue}>
          <input
            id="crl-length"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Crown rump length"
            value={input.crlValue}
            aria-invalid={Boolean(errors.crlValue)}
            onChange={(e) => set({ crlValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="CRL unit"
            value={input.crlUnit}
            onChange={(e) => switchCrlUnit(e.target.value as CrlUnit)}
          >
            {(Object.keys(CRL_UNIT_LABELS) as CrlUnit[]).map((u) => (
              <option key={u} value={u}>
                {CRL_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.crlValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.crlValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="crl-ga-out">
          <span>Gestational age</span>
          <InfoTooltip
            label="Gestational age"
            text="Estimated menstrual age from Robinson–Fleming. Read-only. Switch display between total days and weeks + days."
          />
        </label>
        <FieldShell muted>
          <output
            id="crl-ga-out"
            className="flex w-full items-center gap-2 px-3 text-sm tabular-nums text-accent"
            aria-live="polite"
          >
            {result && input.gaDisplayUnit === 'weeksDays' ? (
              <>
                <span className="font-medium">{result.weeks}</span>
                <span className="text-muted-foreground">wks</span>
                <span className="text-muted-foreground" aria-hidden>
                  |
                </span>
                <span className="font-medium">{result.daysRemainder}</span>
                <span className="text-muted-foreground">days</span>
              </>
            ) : result ? (
              <span className="font-medium">{result.gestationalAgeDays}</span>
            ) : (
              <span className="text-muted-foreground" />
            )}
          </output>
          <select
            className={selectClass}
            aria-label="Gestational age display unit"
            value={input.gaDisplayUnit}
            onChange={(e) =>
              set({ gaDisplayUnit: e.target.value as GaDisplayUnit })
            }
          >
            {(Object.keys(GA_DISPLAY_LABELS) as GaDisplayUnit[]).map((u) => (
              <option key={u} value={u}>
                {u === 'days' ? 'days' : 'wks'}
              </option>
            ))}
          </select>
        </FieldShell>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational CRL dating only — not a clinical diagnosis.'}
        </p>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Pregnancies over 14 weeks require different kinds of measurements. Try
        out the{' '}
        <Link
          href="/tools/fetal-weight-percentile-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          fetal weight tool
        </Link>
        .
      </p>

      <div className="rounded-xl border border-border bg-muted/15 p-3.5">
        <p className="text-[13px] font-semibold text-accent">
          Check our examples
        </p>
        <ul className="mt-2 space-y-1.5">
          {CRL_EXAMPLES.map((ex) => (
            <li key={ex.id}>
              <button
                type="button"
                onClick={() => onLoadExample(ex.crlMm)}
                className="text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                {ex.label}
              </button>
              <span className="text-xs text-muted-foreground">
                {' '}
                ({ex.crlMm} mm)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
