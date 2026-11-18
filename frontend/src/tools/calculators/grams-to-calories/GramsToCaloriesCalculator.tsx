'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCalories,
  shareResultText,
  type CalorieBreakdown,
} from './calculation';
import {
  emptyDraft,
  GramsToCaloriesForm,
  type GramsToCaloriesDraft,
} from './GramsToCaloriesForm';
import { GramsToCaloriesResults } from './GramsToCaloriesResults';
import type { GramsToCaloriesFieldErrors } from './types';
import { parseAbvPercent, parseNonNegativeNumber, parseVolumeMl } from './validation';

function numOrZero(
  parsed: { blank: boolean; incomplete: boolean; value: number | null; error?: string },
): { ok: true; value: number } | { ok: false; error: string } | { ok: 'pending' } {
  if (parsed.blank) return { ok: true, value: 0 };
  if (parsed.incomplete) return { ok: 'pending' };
  if (parsed.value == null) return { ok: false, error: parsed.error ?? 'Enter a valid finite number.' };
  return { ok: true, value: parsed.value };
}

export function GramsToCaloriesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GramsToCaloriesDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<GramsToCaloriesFieldErrors>({});
  const [result, setResult] = React.useState<CalorieBreakdown | null>(null);
  const [macros, setMacros] = React.useState({ carbs: 0, protein: 0, fat: 0, alcohol: 0 });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: GramsToCaloriesDraft) => {
    setDraft(next);

    const carbsP = parseNonNegativeNumber(next.carbs, { label: 'Carbohydrates' });
    const proteinP = parseNonNegativeNumber(next.protein, { label: 'Protein' });
    const fatP = parseNonNegativeNumber(next.fat, { label: 'Fat' });

    const nextErrors: GramsToCaloriesFieldErrors = {};
    const carbs = numOrZero(carbsP);
    const protein = numOrZero(proteinP);
    const fat = numOrZero(fatP);

    if (carbs.ok === false) nextErrors.carbs = carbs.error;
    if (protein.ok === false) nextErrors.protein = protein.error;
    if (fat.ok === false) nextErrors.fat = fat.error;

    let alcoholGrams = 0;
    let volumeMl = 0;
    let abvPercent = 0;
    let pending = carbs.ok === 'pending' || protein.ok === 'pending' || fat.ok === 'pending';
    let invalid = carbs.ok === false || protein.ok === false || fat.ok === false;

    if (next.alcoholMode === 'grams') {
      const alcoholP = parseNonNegativeNumber(next.alcoholGrams, { label: 'Alcohol' });
      const alcohol = numOrZero(alcoholP);
      if (alcohol.ok === false) {
        nextErrors.alcoholGrams = alcohol.error;
        invalid = true;
      } else if (alcohol.ok === 'pending') {
        pending = true;
      } else {
        alcoholGrams = alcohol.value;
      }
    } else if (next.alcoholMode === 'volume') {
      const volP = parseVolumeMl(next.volumeMl);
      const abvP = parseAbvPercent(next.abv);
      const vol = numOrZero(volP);
      const abv = numOrZero(abvP);
      if (vol.ok === false) {
        nextErrors.volumeMl = vol.error;
        invalid = true;
      } else if (vol.ok === 'pending') {
        pending = true;
      } else {
        volumeMl = vol.value;
      }
      if (abv.ok === false) {
        nextErrors.abv = abv.error;
        invalid = true;
      } else if (abv.ok === 'pending') {
        pending = true;
      } else {
        abvPercent = abv.value;
      }
    }

    setErrors(nextErrors);

    if (invalid || pending) {
      if (invalid) setResult(null);
      return;
    }

    const breakdown = calculateCalories({
      carbsG: carbs.ok === true ? carbs.value : 0,
      proteinG: protein.ok === true ? protein.value : 0,
      fatG: fat.ok === true ? fat.value : 0,
      alcoholMode: next.alcoholMode,
      alcoholGrams,
      volumeMl,
      abvPercent,
    });

    setMacros({
      carbs: carbs.ok === true ? carbs.value : 0,
      protein: protein.ok === true ? protein.value : 0,
      fat: fat.ok === true ? fat.value : 0,
      alcohol: breakdown.alcoholGramsUsed,
    });
    setResult(breakdown);
  };

  const clearAll = () => {
    setDraft(emptyDraft());
    setErrors({});
    setResult(null);
    setMacros({ carbs: 0, protein: 0, fat: 0, alcohol: 0 });
    setCopied(false);
    setShared(false);
  };

  const payload = result
    ? shareResultText(macros.carbs, macros.protein, macros.fat, macros.alcohol, result)
    : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Carbs · protein · fat · alcohol → kcal
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GramsToCaloriesForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <GramsToCaloriesResults
            result={result}
            copied={copied}
            shared={shared}
            canShare={canShare && result != null}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
                  : payload;
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(text).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </GramsToCaloriesForm>
      </div>
    </section>
  );
}
