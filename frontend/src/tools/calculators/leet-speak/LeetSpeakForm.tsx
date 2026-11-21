'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DIRECTION_OPTIONS,
  PROFILE_OPTIONS,
  type LeetProfile,
  type TranslationDirection,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const textareaClass =
  'min-h-[120px] w-full resize-y break-words bg-transparent px-3 py-2.5 font-mono text-sm leading-relaxed text-accent outline-none placeholder:text-muted-foreground';

export interface LeetSpeakDraft {
  direction: TranslationDirection;
  profile: LeetProfile;
  text: string;
}

export function emptyDraft(): LeetSpeakDraft {
  return { direction: 'text-to-leet', profile: 'classic', text: '' };
}

interface LeetSpeakFormProps {
  draft: LeetSpeakDraft;
  warning?: string;
  onDraftChange: (draft: LeetSpeakDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function LeetSpeakForm({
  draft,
  warning,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: LeetSpeakFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Classic leet maps A B E G I L O S T Z to 4 8 3 6 1 1 0 5 7 2. Reverse decoding treats{' '}
 <span className="font-mono">1</span> as <span className="font-mono">I</span> (not L); results
        are approximate, not encryption.
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Which direction are you translating?</legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Translation direction">
          {DIRECTION_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
            >
              <input
                type="radio"
                name="leet-direction"
                value={option.id}
                checked={draft.direction === option.id}
                className="h-4 w-4 accent-primary"
                onChange={() => onDraftChange({ ...draft, direction: option.id })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Leet style</legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Leet mapping profile">
          {PROFILE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer flex-col gap-0.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="leet-profile"
                  value={option.id}
                  checked={draft.profile === option.id}
                  className="h-4 w-4 accent-primary"
                  onChange={() => onDraftChange({ ...draft, profile: option.id })}
                />
                <span className="font-medium">{option.label}</span>
              </span>
              <span className="pl-6 text-xs text-muted-foreground">{option.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="leet-speak-input" className={labelClass}>
          Enter your text
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <textarea
            id="leet-speak-input"
            rows={5}
            autoComplete="off"
            spellCheck={false}
            className={textareaClass}
            value={draft.text}
            placeholder="HELLO WORLD"
            aria-describedby={warning ? 'leet-speak-warning' : 'leet-speak-hint'}
            onChange={(event) => onDraftChange({ ...draft, text: event.target.value })}
          />
        </div>
        {warning ? (
          <p id="leet-speak-warning" className="text-xs text-amber-700" role="status">
            {warning}
          </p>
        ) : (
          <p id="leet-speak-hint" className="text-xs text-muted-foreground">
            Switching direction or style updates the translation without clearing your input.
          </p>
        )}
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
          Translate
        </button>
      </div>
    </form>
  );
}
