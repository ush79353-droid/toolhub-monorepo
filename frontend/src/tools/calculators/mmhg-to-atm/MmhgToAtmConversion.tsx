'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateMmhgToAtm,
  formatPressure,
  MMHG_PER_ATM,
  shareResultText,
  type MmhgToAtmResult,
} from './calculation';
import { MmhgToAtmForm, draftToInput, emptyDraft, type MmhgToAtmDraft } from './MmhgToAtmForm';
import { MmhgToAtmResults } from './MmhgToAtmResults';
import type { MmhgToAtmFieldErrors } from './types';
import { isIncompleteNumber, validateMmhgToAtm } from './validation';

function syncDraftFromResult(draft: MmhgToAtmDraft, result: MmhgToAtmResult): MmhgToAtmDraft {
  if (draft.source === 'mmHg') {
    return { ...draft, atm: formatPressure(result.atm) };
  }
  return { ...draft, mmHg: formatPressure(result.mmHg) };
}

function clearOpposite(draft: MmhgToAtmDraft): MmhgToAtmDraft {
  if (draft.source === 'mmHg') return { ...draft, atm: '' };
  return { ...draft, mmHg: '' };
}

export function MmhgToAtmConversion({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MmhgToAtmDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<MmhgToAtmFieldErrors>({});
  const [result, setResult] = React.useState<MmhgToAtmResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MmhgToAtmDraft) => {
    if (
      next.mmHg === draft.mmHg &&
      next.atm === draft.atm &&
      next.source === draft.source &&
      next.otherOpen !== draft.otherOpen
    ) {
      setDraft(next);
      return;
    }

    const sourceRaw = next.source === 'mmHg' ? next.mmHg : next.atm;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateMmhgToAtm(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateMmhgToAtm(input);
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
            1 atm = {MMHG_PER_ATM} mmHg (conventional)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MmhgToAtmForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
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
          <MmhgToAtmResults
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
        </MmhgToAtmForm>
      </div>
    </section>
  );
}
