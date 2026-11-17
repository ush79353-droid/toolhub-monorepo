'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateKgToOunce,
  formatMass,
  OZ_PER_KG,
  shareResultText,
  type KgToOunceResult,
} from './calculation';
import {
  KgToOunceForm,
  draftToInput,
  emptyDraft,
  type KgToOunceDraft,
} from './KgToOunceForm';
import { KgToOunceResults } from './KgToOunceResults';
import type { KgToOunceFieldErrors } from './types';
import { isIncompleteNumber, validateKgToOunce } from './validation';

function syncDraftFromResult(draft: KgToOunceDraft, result: KgToOunceResult): KgToOunceDraft {
  const next: KgToOunceDraft = {
    ...draft,
    kg: formatMass(result.kg),
    oz: formatMass(result.oz),
    troyOz: formatMass(result.troyOz),
    lbPart: formatMass(result.lbPart),
    ozPart: formatMass(result.ozPart),
    moreUnit: draft.moreUnit,
    moreValue: formatMass(result.moreValue),
  };

  if (draft.source === 'kg') next.kg = draft.kg;
  else if (draft.source === 'oz') next.oz = draft.oz;
  else if (draft.source === 'troyOz') next.troyOz = draft.troyOz;
  else if (draft.source === 'lbOz') {
    next.lbPart = draft.lbPart;
    next.ozPart = draft.ozPart;
  } else if (draft.source === 'more') next.moreValue = draft.moreValue;

  return next;
}

function clearNonSource(draft: KgToOunceDraft): KgToOunceDraft {
  const cleared: KgToOunceDraft = {
    ...draft,
    kg: '',
    oz: '',
    troyOz: '',
    lbPart: '',
    ozPart: '',
    moreValue: '',
  };
  if (draft.source === 'kg') cleared.kg = draft.kg;
  else if (draft.source === 'oz') cleared.oz = draft.oz;
  else if (draft.source === 'troyOz') cleared.troyOz = draft.troyOz;
  else if (draft.source === 'lbOz') {
    cleared.lbPart = draft.lbPart;
    cleared.ozPart = draft.ozPart;
  } else if (draft.source === 'more') cleared.moreValue = draft.moreValue;
  return cleared;
}

function compoundIncomplete(a: string, b: string): boolean {
  const left = a.trim().replace(/,/g, '');
  const right = b.trim().replace(/,/g, '');
  if (left === '' && right === '') return true;
  if (left !== '' && isIncompleteNumber(left)) return true;
  if (right !== '' && isIncompleteNumber(right)) return true;
  return false;
}

function sourceIncomplete(draft: KgToOunceDraft): boolean {
  if (draft.source === 'lbOz') {
    return compoundIncomplete(draft.lbPart, draft.ozPart);
  }
  const raw =
    draft.source === 'kg'
      ? draft.kg
      : draft.source === 'oz'
        ? draft.oz
        : draft.source === 'troyOz'
          ? draft.troyOz
          : draft.moreValue;
  const cleaned = raw.trim().replace(/,/g, '');
  return cleaned === '' || isIncompleteNumber(cleaned);
}

export function KgToOunceConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<KgToOunceDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<KgToOunceFieldErrors>({});
  const [result, setResult] = React.useState<KgToOunceResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: KgToOunceDraft) => {
    // Changing only the more-unit keeps the same mass (recompute from last kg).
    if (result && next.moreUnit !== draft.moreUnit && next.source === draft.source) {
      const nextResult = calculateKgToOunce({
        source: 'kg',
        kg: result.kg,
        oz: null,
        troyOz: null,
        lbPart: null,
        ozPart: null,
        moreUnit: next.moreUnit,
        moreValue: null,
      });
      setErrors({});
      setResult(nextResult);
      setDraft({
        ...next,
        kg: formatMass(nextResult.kg),
        oz: formatMass(nextResult.oz),
        troyOz: formatMass(nextResult.troyOz),
        lbPart: formatMass(nextResult.lbPart),
        ozPart: formatMass(nextResult.ozPart),
        moreValue: formatMass(nextResult.moreValue),
      });
      return;
    }

    if (sourceIncomplete(next)) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateKgToOunce(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateKgToOunce(input);
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
            oz = kg × {OZ_PER_KG}
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <KgToOunceForm
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
          <KgToOunceResults
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
        </KgToOunceForm>
      </div>
    </section>
  );
}
