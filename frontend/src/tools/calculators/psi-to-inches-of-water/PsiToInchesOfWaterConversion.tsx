'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  INH2O_PER_PSI,
  calculatePsiToInchesOfWater,
  formatPressure,
  shareResultText,
  type PsiToInchesOfWaterResult,
} from './calculation';
import {
  PsiToInchesOfWaterForm,
  draftToInput,
  emptyDraft,
  type PsiToInchesOfWaterDraft,
} from './PsiToInchesOfWaterForm';
import { PsiToInchesOfWaterResults } from './PsiToInchesOfWaterResults';
import type { PsiToInchesOfWaterFieldErrors } from './types';
import { isIncompleteNumber, validatePsiToInchesOfWater } from './validation';

function syncDraftFromResult(
  draft: PsiToInchesOfWaterDraft,
  result: PsiToInchesOfWaterResult,
): PsiToInchesOfWaterDraft {
  if (draft.source === 'psi') {
    return { ...draft, inH2O: formatPressure(result.inH2O) };
  }
  return { ...draft, psi: formatPressure(result.psi) };
}

function clearOpposite(draft: PsiToInchesOfWaterDraft): PsiToInchesOfWaterDraft {
  if (draft.source === 'psi') return { ...draft, inH2O: '' };
  return { ...draft, psi: '' };
}

export function PsiToInchesOfWaterConversion({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PsiToInchesOfWaterDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<PsiToInchesOfWaterFieldErrors>({});
  const [result, setResult] = React.useState<PsiToInchesOfWaterResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PsiToInchesOfWaterDraft) => {
    const sourceRaw = next.source === 'psi' ? next.psi : next.inH2O;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validatePsiToInchesOfWater(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculatePsiToInchesOfWater(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const payload = result ? shareResultText(result) : '';

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
            1 psi ≈ {formatPressure(INH2O_PER_PSI)} inH₂O (4 °C)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PsiToInchesOfWaterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <PsiToInchesOfWaterResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\n${window.location.href}`
                  : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\n${window.location.href}`
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
        </PsiToInchesOfWaterForm>
      </div>
    </section>
  );
}
