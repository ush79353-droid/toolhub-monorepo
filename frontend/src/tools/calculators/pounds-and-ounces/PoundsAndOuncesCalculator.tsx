'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateAddition,
  calculateEquivalence,
  formatMeasure,
  formatMixed,
} from './calculation';
import {
  defaultDraftFromResult,
  emptyDraft,
  PoundsAndOuncesForm,
  type PoundsAndOuncesDraft,
} from './PoundsAndOuncesForm';
import { PoundsAndOuncesResults } from './PoundsAndOuncesResults';
import {
  DEFAULT_ADDITION_INPUT,
  DEFAULT_EQUIVALENCE_INPUT,
  type AdditionFieldErrors,
  type AdditionResult,
  type EquivalenceFieldErrors,
  type EquivalenceInput,
  type EquivalenceResult,
} from './types';
import { parseOptionalNumber, validateAddition, validateEquivalence } from './validation';

function draftToEquivalence(draft: PoundsAndOuncesDraft): EquivalenceInput {
  return {
    source: draft.equivSource,
    pounds: parseOptionalNumber(draft.pounds),
    ounces: parseOptionalNumber(draft.ounces),
    mixedPounds: parseOptionalNumber(draft.mixedPounds),
    mixedOunces: parseOptionalNumber(draft.mixedOunces),
    metric: parseOptionalNumber(draft.metric),
    metricUnit: draft.metricUnit,
    stones: parseOptionalNumber(draft.stones),
  };
}

function draftToAddition(draft: PoundsAndOuncesDraft) {
  return {
    rows: draft.addRows.map((row) => ({
      id: row.id,
      pounds: parseOptionalNumber(row.pounds),
      ounces: parseOptionalNumber(row.ounces),
    })),
  };
}

function syncEquivDraft(
  draft: PoundsAndOuncesDraft,
  result: EquivalenceResult
): PoundsAndOuncesDraft {
  const next = { ...draft };
  if (draft.equivSource !== 'pounds') {
    next.pounds = formatMeasure(result.decimalPounds);
  }
  if (draft.equivSource !== 'ounces') {
    next.ounces = formatMeasure(result.totalOuncesDisplay);
  }
  if (draft.equivSource !== 'mixed') {
    next.mixedPounds = formatMeasure(result.mixed.pounds);
    next.mixedOunces = formatMeasure(result.mixed.ounces);
  }
  if (draft.equivSource !== 'metric') {
    next.metric = formatMeasure(result.metric);
  }
  if (draft.equivSource !== 'stones') {
    next.stones = formatMeasure(result.stones);
  }
  return next;
}

function summaryText(
  equiv: EquivalenceResult | null,
  add: AdditionResult | null,
  draft: PoundsAndOuncesDraft
): string {
  const lines = ['Pounds and Ounces Calculator', 'Omega Calculators', ''];
  if (equiv) {
    lines.push(
      `Pounds: ${formatMeasure(equiv.decimalPounds)} lb`,
      `Ounces: ${formatMeasure(equiv.totalOuncesDisplay)} oz`,
      `Mixed Weight: ${formatMixed(equiv.mixed)}`,
      `Grams: ${formatMeasure(equiv.grams)} g`,
      `Kilograms: ${formatMeasure(equiv.grams / 1000)} kg`,
      `Stones: ${formatMeasure(equiv.stones)} st`,
      ''
    );
  }
  if (add) {
    draft.addRows.forEach((row, i) => {
      const lb = row.pounds || '0';
      const oz = row.ounces || '0';
      if (row.pounds || row.ounces) {
        lines.push(`Measurement ${i + 1}: ${lb} lb ${oz} oz`);
      }
    });
    lines.push(
      `Total: ${formatMixed(add.mixed)}`,
      `Total Ounces: ${formatMeasure(add.totalOunces)} oz`,
      `Decimal Pounds: ${formatMeasure(add.decimalPounds)} lb`
    );
  }
  return lines.join('\n');
}

export function PoundsAndOuncesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PoundsAndOuncesDraft>(() =>
    defaultDraftFromResult(calculateEquivalence(DEFAULT_EQUIVALENCE_INPUT))
  );
  const [equivErrors, setEquivErrors] = React.useState<EquivalenceFieldErrors>({});
  const [addErrors, setAddErrors] = React.useState<AdditionFieldErrors>({});
  const [equivResult, setEquivResult] = React.useState<EquivalenceResult | null>(() =>
    calculateEquivalence(DEFAULT_EQUIVALENCE_INPUT)
  );
  const [addResult, setAddResult] = React.useState<AdditionResult | null>(() =>
    calculateAddition(DEFAULT_ADDITION_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: PoundsAndOuncesDraft) => {
      const uiOnly =
        next.pounds === draft.pounds &&
        next.ounces === draft.ounces &&
        next.mixedPounds === draft.mixedPounds &&
        next.mixedOunces === draft.mixedOunces &&
        next.metric === draft.metric &&
        next.metricUnit === draft.metricUnit &&
        next.stones === draft.stones &&
        next.equivSource === draft.equivSource &&
        JSON.stringify(next.addRows) === JSON.stringify(draft.addRows);

      if (uiOnly) {
        setDraft(next);
        return;
      }

      const equivInput = draftToEquivalence(next);
      const equivValidation = validateEquivalence(equivInput);
      setEquivErrors(equivValidation.errors);

      let nextEquiv: EquivalenceResult | null = null;
      let synced = next;
      if (equivValidation.isValid) {
        nextEquiv = calculateEquivalence(equivInput);
        synced = syncEquivDraft(next, nextEquiv);
      } else {
        nextEquiv = null;
      }

      const addInput = draftToAddition(synced);
      const addValidation = validateAddition(addInput);
      setAddErrors(addValidation.errors);
      const nextAdd = addValidation.isValid ? calculateAddition(addInput) : null;

      setEquivResult(nextEquiv);
      setAddResult(nextAdd);
      setDraft(synced);
    },
    [draft]
  );

  const sharePayload = summaryText(equivResult, addResult, draft);

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
            lb ↔ oz · mixed weights · add measurements
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PoundsAndOuncesForm
          draft={draft}
          equivErrors={equivErrors}
          addErrors={addErrors}
          equivResult={equivResult}
          addResult={addResult}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setEquivErrors({});
            setAddErrors({});
            setEquivResult(null);
            setAddResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <PoundsAndOuncesResults
          equivResult={equivResult}
          addResult={addResult}
          equivInvalid={Object.keys(equivErrors).length > 0}
          addInvalid={Object.keys(addErrors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!equivResult && !addResult) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if ((!equivResult && !addResult) || typeof navigator.share !== 'function') {
              return;
            }
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
