'use client';

import * as React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { formatMeasure, shareResultText } from './calculation';
import {
  MmollToMgdlForm,
  draftToInput,
  inputToDraft,
  type MmollToMgdlDraft,
} from './MmollToMgdlForm';
import { MmollToMgdlResults } from './MmollToMgdlResults';
import {
  DEFAULT_MMOLL_TO_MGDL_INPUT,
  EMPTY_MMOLL_TO_MGDL_INPUT,
  type MmollToMgdlFieldErrors,
  type MmollToMgdlResult,
} from './types';
import { validateMmollToMgdl } from './validation';

function syncDraftFromResult(draft: MmollToMgdlDraft, result: MmollToMgdlResult): MmollToMgdlDraft {
  let next = { ...draft };
  if (result.preset) {
    if (draft.presetSource === 'mmolL') {
      next = { ...next, presetMgDlDisplay: formatMeasure(result.preset.mgDl) };
    } else {
      next = { ...next, presetMmolLDisplay: formatMeasure(result.preset.mmolL) };
    }
  }
  if (result.custom) {
    if (draft.customSource === 'mmolL') {
      next = { ...next, customMgDlDisplay: formatMeasure(result.custom.mgDl) };
    } else {
      next = { ...next, customMmolLDisplay: formatMeasure(result.custom.mmolL) };
    }
  }
  return next;
}

function draftsEqual(a: MmollToMgdlDraft, b: MmollToMgdlDraft): boolean {
  return (
    a.analyte === b.analyte &&
    a.presetSource === b.presetSource &&
    a.presetMmolLDisplay === b.presetMmolLDisplay &&
    a.presetMgDlDisplay === b.presetMgDlDisplay &&
    a.customOpen === b.customOpen &&
    a.customMolarMassDisplay === b.customMolarMassDisplay &&
    a.customSource === b.customSource &&
    a.customMmolLDisplay === b.customMmolLDisplay &&
    a.customMgDlDisplay === b.customMgDlDisplay
  );
}

function draftHasValues(draft: MmollToMgdlDraft): boolean {
  return (
    draft.presetMmolLDisplay !== '' ||
    draft.presetMgDlDisplay !== '' ||
    draft.customMolarMassDisplay !== '' ||
    draft.customMmolLDisplay !== '' ||
    draft.customMgDlDisplay !== ''
  );
}

export function MmollToMgdlCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [baseline, setBaseline] = React.useState<MmollToMgdlDraft>(() =>
    inputToDraft(DEFAULT_MMOLL_TO_MGDL_INPUT)
  );
  const [draft, setDraft] = React.useState<MmollToMgdlDraft>(() =>
    inputToDraft(DEFAULT_MMOLL_TO_MGDL_INPUT)
  );
  const [errors, setErrors] = React.useState<MmollToMgdlFieldErrors>({});
  const [result, setResult] = React.useState<MmollToMgdlResult | null>(null);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MmollToMgdlDraft) => {
    const input = draftToInput(next);
    const validation = validateMmollToMgdl(input);
    setErrors(validation.errors);
    if (!validation.isValid || !validation.result) {
      setDraft(next);
      setResult(null);
      return;
    }
    setResult(validation.result);
    setDraft(syncDraftFromResult(next, validation.result));
  };

  const handleReload = () => {
    const fresh = inputToDraft(DEFAULT_MMOLL_TO_MGDL_INPUT);
    setDraft(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
    setShared(false);
  };

  const handleClear = () => {
    const fresh = inputToDraft(EMPTY_MMOLL_TO_MGDL_INPUT);
    setDraft(fresh);
    setErrors({});
    setResult(null);
    setShared(false);
  };

  const dirty = !draftsEqual(draft, baseline);
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  const handleShare = async () => {
    const text =
      result && (result.preset || result.custom)
        ? `${shareResultText(result)}\n\nExplore: ${pageUrl}`
        : `mmol/L to mg/dL Calculator | Omega Calculators\n${pageUrl}`;
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text,
          url: pageUrl,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        /* fall through */
      }
    }
    if (await copyTextToClipboard(text)) {
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    }
  };

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
            mmol/L ↔ mg/dL using analyte molar mass (MW ÷ 10)
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <MmollToMgdlForm draft={draft} errors={errors} result={result} onDraftChange={evaluate} />

        <MmollToMgdlResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          isEmbed={isEmbed}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" aria-hidden />
            </div>
            <span className="text-xs font-semibold text-accent">
              {shared ? 'Link copied' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty && !draftHasValues(draft)}
              onClick={handleClear}
            >
              Clear all changes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
