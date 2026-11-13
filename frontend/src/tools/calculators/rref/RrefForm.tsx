'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  MAX_COLS,
  MAX_ROWS,
  MIN_COLS,
  MIN_ROWS,
  createDefaultRrefInput,
  createEmptyDraft,
  resizeDraft,
  type MatrixDraft,
  type RrefFieldErrors,
  type RrefInput,
} from './types';

export interface RrefDraft {
  rows: number;
  cols: number;
  cells: MatrixDraft;
  augmented: boolean;
}

export function inputToDraft(input: RrefInput): RrefDraft {
  return {
    rows: input.rows,
    cols: input.cols,
    cells: input.cells.map((row) => [...row]),
    augmented: input.augmented,
  };
}

export function draftToInput(draft: RrefDraft): RrefInput {
  return {
    rows: draft.rows,
    cols: draft.cols,
    cells: draft.cells.map((row) => row.map((c) => c.trim() || '0')),
    augmented: draft.augmented,
  };
}

const EXAMPLES: { label: string; input: RrefInput }[] = [
  {
    label: 'Default 3×3',
    input: createDefaultRrefInput(),
  },
  {
    label: 'Identity 2×2',
    input: {
      rows: 2,
      cols: 2,
      cells: [
        ['1', '0'],
        ['0', '1'],
      ],
      augmented: false,
    },
  },
  {
    label: 'Augmented unique',
    input: {
      rows: 2,
      cols: 3,
      cells: [
        ['1', '1', '5'],
        ['0', '1', '2'],
      ],
      augmented: true,
    },
  },
];

interface RrefFormProps {
  draft: RrefDraft;
  errors: RrefFieldErrors;
  onChange: (draft: RrefDraft) => void;
  onSubmit: (event: React.FormEvent) => void;
  onReset: () => void;
}

export function RrefForm({ draft, errors, onChange, onSubmit, onReset }: RrefFormProps) {
  const setRows = (rows: number) => {
    const nextRows = Math.min(MAX_ROWS, Math.max(MIN_ROWS, rows));
    onChange({
      ...draft,
      rows: nextRows,
      cells: resizeDraft(draft.cells, nextRows, draft.cols),
    });
  };

  const setCols = (cols: number) => {
    const nextCols = Math.min(MAX_COLS, Math.max(MIN_COLS, cols));
    onChange({
      ...draft,
      cols: nextCols,
      cells: resizeDraft(draft.cells, draft.rows, nextCols),
    });
  };

  const setCell = (row: number, col: number, value: string) => {
    const cells = draft.cells.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? value : c)) : [...r]
    );
    onChange({ ...draft, cells });
  };

  const clearMatrix = () => {
    onChange({
      ...draft,
      cells: createEmptyDraft(draft.rows, draft.cols, '0'),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div>
          <label htmlFor="rref-rows" className="mb-1.5 block text-[13px] font-medium text-accent">
            Rows
          </label>
          <div className="flex h-11 items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-11 shrink-0 px-0"
              onClick={() => setRows(draft.rows - 1)}
              disabled={draft.rows <= MIN_ROWS}
              aria-label="Decrease rows"
            >
              −
            </Button>
            <input
              id="rref-rows"
              type="number"
              min={MIN_ROWS}
              max={MAX_ROWS}
              value={draft.rows}
              onChange={(e) => setRows(Number(e.target.value) || MIN_ROWS)}
              className="h-11 w-full rounded-lg border border-border bg-white px-2 text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="off"
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 w-11 shrink-0 px-0"
              onClick={() => setRows(draft.rows + 1)}
              disabled={draft.rows >= MAX_ROWS}
              aria-label="Increase rows"
            >
              +
            </Button>
          </div>
          {errors.rows ? (
            <p className="mt-1 text-xs font-normal text-rose-600">{errors.rows}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="rref-cols" className="mb-1.5 block text-[13px] font-medium text-accent">
            Columns
          </label>
          <div className="flex h-11 items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-11 shrink-0 px-0"
              onClick={() => setCols(draft.cols - 1)}
              disabled={draft.cols <= MIN_COLS}
              aria-label="Decrease columns"
            >
              −
            </Button>
            <input
              id="rref-cols"
              type="number"
              min={MIN_COLS}
              max={MAX_COLS}
              value={draft.cols}
              onChange={(e) => setCols(Number(e.target.value) || MIN_COLS)}
              className="h-11 w-full rounded-lg border border-border bg-white px-2 text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="off"
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 w-11 shrink-0 px-0"
              onClick={() => setCols(draft.cols + 1)}
              disabled={draft.cols >= MAX_COLS}
              aria-label="Increase columns"
            >
              +
            </Button>
          </div>
          {errors.cols ? (
            <p className="mt-1 text-xs font-normal text-rose-600">{errors.cols}</p>
          ) : null}
        </div>

        <div className="col-span-2">
          <p className="mb-1.5 text-[13px] font-medium text-accent">Example</p>
          <select
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            defaultValue=""
            onChange={(e) => {
              const example = EXAMPLES.find((item) => item.label === e.target.value);
              if (!example) return;
              onChange(inputToDraft(example.input));
              e.target.value = '';
            }}
            aria-label="Load example matrix"
          >
            <option value="" disabled>
              Load an example…
            </option>
            {EXAMPLES.map((example) => (
              <option key={example.label} value={example.label}>
                {example.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] font-medium text-accent">Matrix entries</p>
          <p className="text-xs font-normal text-muted-foreground">
            Integers, decimals, or fractions like 1/2
          </p>
        </div>

        <div className="overflow-x-auto overscroll-x-contain rounded-xl border border-border bg-background/50 p-3">
          <div className="inline-flex items-stretch gap-1.5">
            <span
              aria-hidden="true"
              className="w-1.5 shrink-0 rounded-l-md border-y border-l border-accent/70"
            />
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${draft.cols}, minmax(4.5rem, 1fr))`,
              }}
            >
              {draft.cells.map((row, i) =>
                row.map((cell, j) => {
                  const key = `cell-${i}-${j}`;
                  const error = errors[key];
                  const isAugCol = draft.augmented && j === draft.cols - 1;
                  return (
                    <div key={key} className="min-w-0">
                      <label className="sr-only" htmlFor={key}>
                        Row {i + 1} column {j + 1}
                        {isAugCol ? ' (constant)' : ''}
                      </label>
                      <input
                        id={key}
                        type="text"
                        inputMode="decimal"
                        value={cell}
                        onChange={(e) => setCell(i, j, e.target.value)}
                        className={`h-11 w-full rounded-lg border bg-white px-2 text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring ${
                          error
                            ? 'border-rose-300'
                            : isAugCol
                              ? 'border-primary/40'
                              : 'border-border'
                        }`}
                        autoComplete="off"
                      />
                      {error ? (
                        <p className="mt-1 text-[11px] font-normal leading-snug text-rose-600">
                          {error}
                        </p>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
            <span
              aria-hidden="true"
              className="w-1.5 shrink-0 rounded-r-md border-y border-r border-accent/70"
            />
          </div>
        </div>
        {errors.form ? (
          <p className="mt-2 text-xs font-normal text-rose-600">{errors.form}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-2.5 rounded-xl border border-border bg-brand-softTeal/50 p-3.5">
        <input
          type="checkbox"
          checked={draft.augmented}
          onChange={(e) => onChange({ ...draft, augmented: e.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-ring"
        />
        <span>
          <span className="block text-[13px] font-medium text-accent">
            Augmented matrix (last column = constants)
          </span>
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            Enables consistency and solution analysis for a linear system.
          </span>
        </span>
      </label>
      {errors.augmented ? (
        <p className="text-xs font-normal text-rose-600">{errors.augmented}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <Button
          type="submit"
          className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          Calculate RREF
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={clearMatrix}>
          Clear
        </Button>
      </div>
    </form>
  );
}
