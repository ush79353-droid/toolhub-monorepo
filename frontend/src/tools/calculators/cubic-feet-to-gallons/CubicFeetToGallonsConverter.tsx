'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCuFtToGal,
  cubicFeetToGallons,
  formatVolume,
  shareResultText,
} from './calculation';
import {
  CuFtToGalForm,
  draftToInput,
  emptyDraft,
  type CuFtToGalDraft,
} from './CuFtToGalForm';
import { CuFtToGalResults } from './CuFtToGalResults';
import type { CuFtToGalFieldErrors, CuFtToGalResult, GallonUnit } from './types';
import { parseOptionalNumber, validateCuFtToGal } from './validation';

function syncDraftFromResult(draft: CuFtToGalDraft, result: CuFtToGalResult): CuFtToGalDraft {
  return {
    ...draft,
    cubicFeet:
      draft.source === 'cubicFeet' ? draft.cubicFeet : formatVolume(result.cubicFeet),
    gallons: draft.source === 'gallons' ? draft.gallons : formatVolume(result.gallons),
    gallonUnit: result.gallonUnit,
  };
}

export function CubicFeetToGallonsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CuFtToGalDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CuFtToGalFieldErrors>({});
  const [result, setResult] = React.useState<CuFtToGalResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CuFtToGalDraft) => {
    const input = draftToInput(next);
    const validation = validateCuFtToGal(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateCuFtToGal(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const handleGallonUnitChange = (unit: GallonUnit) => {
    if (result) {
      const next: CuFtToGalDraft = {
        ...draft,
        gallonUnit: unit,
        gallons: formatVolume(cubicFeetToGallons(result.cubicFeet, unit)),
        source: draft.source === 'gallons' ? 'cubicFeet' : draft.source,
      };
      if (draft.source === 'gallons') {
        next.cubicFeet = formatVolume(result.cubicFeet);
        next.source = 'cubicFeet';
      }
      evaluate(next);
      return;
    }

    const ft3 = parseOptionalNumber(draft.cubicFeet);
    if (ft3 != null && Number.isFinite(ft3) && ft3 >= 0) {
      evaluate({
        ...draft,
        source: 'cubicFeet',
        gallonUnit: unit,
        gallons: formatVolume(cubicFeetToGallons(ft3, unit)),
      });
      return;
    }

    setDraft({ ...draft, gallonUnit: unit, gallons: '' });
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
            US and UK gallons · exact cubic-meter factors
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CuFtToGalForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onGallonUnitChange={handleGallonUnitChange}
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
          <CuFtToGalResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
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
              if (!result) return;
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
        </CuFtToGalForm>
      </div>
    </section>
  );
}
