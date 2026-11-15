'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { JewishMode } from './types';
import { MAX_GEMATRIA_INPUT_LENGTH } from './types';

export interface GematriaDraft {
  text: string;
  jewishMode: JewishMode;
  breakdownOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'min-h-[88px] w-full resize-y bg-transparent px-3 py-2.5 text-sm text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): GematriaDraft {
  return {
    text: '',
    jewishMode: 'auto',
    breakdownOpen: false,
  };
}

export function emptyDraft(): GematriaDraft {
  return defaultDraft();
}

interface GematriaFormProps {
  draft: GematriaDraft;
  error?: string;
  onDraftChange: (draft: GematriaDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3 | 4) => void;
  children?: ReactNode;
}

export function GematriaForm({
  draft,
  error,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
  children,
}: GematriaFormProps) {
  const set = (patch: Partial<GematriaDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Assign numerical values to letters with Simple, English (×6), and Jewish/Hebrew systems.
        Results are cultural/symbolic mappings — not scientific predictions. Latin and Hebrew scripts
        are never silently transliterated.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="gematria-text" className={labelClass}>
          Text to translate
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <textarea
            id="gematria-text"
            className={inputClass}
            value={draft.text}
            maxLength={MAX_GEMATRIA_INPUT_LENGTH}
            placeholder="Enter a word, name, or phrase"
            aria-invalid={Boolean(error)}
            aria-describedby="gematria-text-hint"
            onChange={(event) => set({ text: event.target.value })}
          />
        </div>
        <p id="gematria-text-hint" className="text-xs text-muted-foreground">
          English letters (any case), Hebrew letters, spaces, and punctuation. Max{' '}
          {MAX_GEMATRIA_INPUT_LENGTH} characters.
        </p>
        {error ? (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="gematria-jewish-mode" className={labelClass}>
          Jewish Gematria mapping
        </label>
        <Select
          id="gematria-jewish-mode"
          value={draft.jewishMode}
          className="h-11 rounded-lg border-border bg-white text-sm"
          onChange={(event) => set({ jewishMode: event.target.value as JewishMode })}
        >
          <option value="auto">Auto (match detected script)</option>
          <option value="jewish-english">English Jewish Gematria (Latin letters)</option>
          <option value="hebrew-standard">Hebrew Standard / Mispar Hechrechi</option>
        </Select>
      </div>

      {children}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.breakdownOpen}
          onClick={() => set({ breakdownOpen: !draft.breakdownOpen })}
        >
          <span>Show calculation breakdown</span>
          {draft.breakdownOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, 'CAT'],
              [2, 'HELLO'],
              [3, 'שלום'],
              [4, 'ABC'],
            ] as const
          ).map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                className="text-left text-primary underline-offset-2 hover:underline"
                onClick={() => onApplyExample(id)}
              >
                Example {id} — {label}
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
