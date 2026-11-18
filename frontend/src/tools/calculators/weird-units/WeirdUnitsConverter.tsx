'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  convertWeird,
  findRegular,
  findWeird,
  resultSentence,
  shareResultText,
} from './calculation';
import { emptyDraft, WeirdUnitsForm, type WeirdUnitsDraft } from './WeirdUnitsForm';
import { WeirdUnitsResults } from './WeirdUnitsResults';
import { parseWeirdInput, validateConversion } from './validation';

export function WeirdUnitsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<WeirdUnitsDraft>(emptyDraft);
  const [shared, setShared] = React.useState(false);

  const parsed = parseWeirdInput(draft.valueText);
  const regular = findRegular(draft.category, draft.regularId);
  const weird = findWeird(draft.category, draft.weirdId);

  let result: number | null = null;
  let sentence: string | null = null;
  let displayError: string | undefined;

  if (parsed.blank || parsed.incomplete) {
    displayError = undefined;
  } else if (parsed.value == null) {
    displayError = parsed.error;
  } else {
    const check = validateConversion({
      category: draft.category,
      regularId: draft.regularId,
      weirdId: draft.weirdId,
      direction: draft.direction,
      value: parsed.value,
    });
    if (!check.ok) {
      displayError = check.error;
    } else {
      try {
        result = convertWeird(
          parsed.value,
          draft.category,
          draft.regularId,
          draft.weirdId,
          draft.direction,
        );
        if (!Number.isFinite(result)) {
          displayError = 'Result is not a finite number.';
          result = null;
        } else {
          sentence = resultSentence({
            value: parsed.value,
            category: draft.category,
            regularId: draft.regularId,
            weirdId: draft.weirdId,
            direction: draft.direction,
            result,
          });
        }
      } catch {
        displayError = 'Unable to convert with the selected units.';
        result = null;
      }
    }
  }

  const displayAmount = result;
  const displayUnitLabel =
    draft.direction === 'regular-to-weird'
      ? weird?.label ?? null
      : regular
        ? `${regular.label} (${regular.symbol})`
        : null;

  const comparisonCount =
    draft.direction === 'regular-to-weird'
      ? result
      : parsed.value != null && !parsed.blank && !parsed.incomplete && !displayError
        ? parsed.value
        : null;

  const markShared = () => {
    setShared(true);
    window.setTimeout(() => setShared(false), 2000);
  };

  const share = () => {
    if (!sentence) return;
    const note = weird?.approximate ? 'Reference is approximate.' : weird?.sourceNote;
    const payload =
      typeof window !== 'undefined'
        ? `${shareResultText(sentence, note)}\n\nExplore: ${window.location.href}`
        : shareResultText(sentence, note);
    if (typeof navigator.share === 'function') {
      void navigator
        .share({
          title: metadata.title,
          text: payload,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        })
        .then(markShared)
        .catch(() => {
          void copyTextToClipboard(payload).then((ok) => {
            if (ok) markShared();
          });
        });
      return;
    }
    void copyTextToClipboard(payload).then((ok) => {
      if (ok) markShared();
    });
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
            Convert measurements into unusual units!
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <WeirdUnitsForm
          draft={draft}
          error={displayError}
          onDraftChange={(next) => {
            setDraft(next);
            setShared(false);
          }}
          onSubmit={(event) => event.preventDefault()}
          onReload={() => {
            setDraft(emptyDraft());
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setShared(false);
          }}
        >
          <WeirdUnitsResults
            sentence={sentence}
            displayAmount={displayAmount}
            displayUnitLabel={displayUnitLabel}
            comparisonCount={comparisonCount}
            weird={weird}
            shared={shared}
            canShare={Boolean(sentence)}
            onShare={share}
          />
        </WeirdUnitsForm>
      </div>
    </section>
  );
}
