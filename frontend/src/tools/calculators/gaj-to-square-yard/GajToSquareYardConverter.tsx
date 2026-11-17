'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateArea,
  calculateLength,
  formatMeasure,
  shareResultText,
} from './calculation';
import {
  GajToSqYdForm,
  draftToAreaInput,
  draftToLengthInput,
  emptyDraft,
  type GajToSqYdDraft,
} from './GajToSqYdForm';
import { GajToSqYdResults } from './GajToSqYdResults';
import type {
  AreaFieldErrors,
  AreaResult,
  LengthFieldErrors,
  LengthResult,
} from './types';
import { isIncompleteNumber, validateArea, validateLength } from './validation';

function syncArea(draft: GajToSqYdDraft, result: AreaResult): GajToSqYdDraft {
  if (draft.areaSource === 'gaj') {
    return { ...draft, squareYards: formatMeasure(result.squareYards) };
  }
  return { ...draft, gaj: formatMeasure(result.gaj) };
}

function clearAreaOpposite(draft: GajToSqYdDraft): GajToSqYdDraft {
  if (draft.areaSource === 'gaj') return { ...draft, squareYards: '' };
  return { ...draft, gaj: '' };
}

function syncLength(draft: GajToSqYdDraft, result: LengthResult): GajToSqYdDraft {
  if (draft.lengthSource === 'linearGaj') {
    return { ...draft, yards: formatMeasure(result.yards) };
  }
  return { ...draft, linearGaj: formatMeasure(result.linearGaj) };
}

function clearLengthOpposite(draft: GajToSqYdDraft): GajToSqYdDraft {
  if (draft.lengthSource === 'linearGaj') return { ...draft, yards: '' };
  return { ...draft, linearGaj: '' };
}

export function GajToSquareYardConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GajToSqYdDraft>(emptyDraft);
  const [areaErrors, setAreaErrors] = React.useState<AreaFieldErrors>({});
  const [lengthErrors, setLengthErrors] = React.useState<LengthFieldErrors>({});
  const [area, setArea] = React.useState<AreaResult | null>(null);
  const [length, setLength] = React.useState<LengthResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: GajToSqYdDraft) => {
    if (
      next.gaj === draft.gaj &&
      next.squareYards === draft.squareYards &&
      next.linearGaj === draft.linearGaj &&
      next.yards === draft.yards &&
      next.areaSource === draft.areaSource &&
      next.lengthSource === draft.lengthSource &&
      next.lengthOpen !== draft.lengthOpen
    ) {
      setDraft(next);
      return;
    }

    let working = next;

    const areaRaw = next.areaSource === 'gaj' ? next.gaj : next.squareYards;
    if (areaRaw.trim() === '' || isIncompleteNumber(areaRaw.trim().replace(/,/g, ''))) {
      setAreaErrors({});
      setArea(null);
      working = clearAreaOpposite(working);
    } else {
      const areaInput = draftToAreaInput(working);
      const areaValidation = validateArea(areaInput);
      setAreaErrors(areaValidation.errors);
      if (!areaValidation.isValid) {
        setArea(null);
      } else {
        const areaResult = calculateArea(areaInput);
        setArea(areaResult);
        working = syncArea(working, areaResult);
      }
    }

    const lengthRaw = next.lengthSource === 'linearGaj' ? next.linearGaj : next.yards;
    if (lengthRaw.trim() === '' || isIncompleteNumber(lengthRaw.trim().replace(/,/g, ''))) {
      setLengthErrors({});
      setLength(null);
      working = clearLengthOpposite(working);
    } else {
      const lengthInput = draftToLengthInput(working);
      const lengthValidation = validateLength(lengthInput);
      setLengthErrors(lengthValidation.errors);
      if (!lengthValidation.isValid) {
        setLength(null);
      } else {
        const lengthResult = calculateLength(lengthInput);
        setLength(lengthResult);
        working = syncLength(working, lengthResult);
      }
    }

    setDraft(working);
  };

  const payload = shareResultText(area, length);

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
          <p className="text-xs font-normal text-muted-foreground">1 land-area gaj = 1 yd² = 9 ft²</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GajToSqYdForm
          draft={draft}
          areaErrors={areaErrors}
          lengthErrors={lengthErrors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft());
            setAreaErrors({});
            setLengthErrors({});
            setArea(null);
            setLength(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setAreaErrors({});
            setLengthErrors({});
            setArea(null);
            setLength(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <GajToSqYdResults
            area={area}
            length={length}
            areaInvalid={Object.keys(areaErrors).length > 0}
            lengthInvalid={Object.keys(lengthErrors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(area || length)}
            onCopy={() => {
              if (!area && !length) return;
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
              if (!area && !length) return;
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
        </GajToSqYdForm>
      </div>
    </section>
  );
}
