'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GREEK_ISOPSEPHY_DISPLAY_TABLE } from './mappings';
import { MAX_GREEK_GEMATRIA_INPUT_LENGTH } from './types';

export interface GreekGematriaDraft {
  text: string;
  stepsOpen: boolean;
  tableOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'min-h-[88px] w-full resize-y bg-transparent px-3 py-2.5 text-sm text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): GreekGematriaDraft {
  return {
    text: '',
    stepsOpen: true,
    tableOpen: false,
  };
}

export function emptyDraft(): GreekGematriaDraft {
  return defaultDraft();
}

interface GreekGematriaFormProps {
  draft: GreekGematriaDraft;
  error?: string;
  onDraftChange: (draft: GreekGematriaDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3 | 4 | 5) => void;
  children?: ReactNode;
}

function AccordionSection({
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
        {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">{children}</div>
      ) : null}
    </div>
  );
}

export function GreekGematriaForm({
  draft,
  error,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  children,
}: GreekGematriaFormProps) {
  const set = (patch: Partial<GreekGematriaDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Traditional Greek isopsephy: add letter values (units, tens, hundreds). Accents are
        normalized; Latin lookalikes are not treated as Greek. Totals are historical letter-number
 sums; not scientific predictions.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="greek-gematria-text" className={labelClass}>
          Text to translate
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <textarea
            id="greek-gematria-text"
            className={inputClass}
            value={draft.text}
            maxLength={MAX_GREEK_GEMATRIA_INPUT_LENGTH}
            placeholder="Enter Greek word or phrase"
            lang="el"
            aria-invalid={Boolean(error)}
            aria-describedby="greek-gematria-hint"
            onChange={(event) => set({ text: event.target.value })}
          />
        </div>
        <p id="greek-gematria-hint" className="text-xs text-muted-foreground">
          Greek letters (any case), accents, spaces, and punctuation. Max{' '}
          {MAX_GREEK_GEMATRIA_INPUT_LENGTH} characters.
        </p>
        {error ? (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {children}

      <AccordionSection
        title="Show Greek gematria table"
        open={draft.tableOpen}
        onToggle={() => set({ tableOpen: !draft.tableOpen })}
      >
        <p className="text-xs text-muted-foreground">
          Includes stigma/digamma (6), koppa (90), and sampi (900) from the historical numeral
 system; not the modern 24-letter alphabet alone. Final sigma (ς) = 200.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[280px] text-left text-sm">
            <caption className="sr-only">Greek isopsephy letter values</caption>
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  Letter
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {GREEK_ISOPSEPHY_DISPLAY_TABLE.map((row) => (
                <tr key={`${row.name}-${row.value}`} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-accent">
                    {row.uppercase} {row.lowercase}
                  </td>
                  <td className="px-3 py-2 text-accent">{row.name}</td>
                  <td className="px-3 py-2 tabular-nums text-accent">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionSection>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, 'ΑΛΦΑ → 532'],
              [2, 'ΛΟΓΟΣ → 373'],
              [3, 'ΙΗΣΟΥΣ → 888'],
              [4, 'λόγος → 373'],
              [5, 'σος → 470'],
            ] as const
          ).map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                className="text-left text-primary underline-offset-2 hover:underline"
                onClick={() => onApplyExample(id)}
              >
 Example {id}; {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
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
