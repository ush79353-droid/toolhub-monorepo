'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildResult, formatForce, fromNewtons, toNewtons } from './calculation';
import { ForceConverterForm, type ForceConverterDraft } from './ForceConverterForm';
import { ForceConverterResults } from './ForceConverterResults';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_NEWTONS,
  FORCE_UNIT_BY_ID,
  type ForceConverterFieldErrors,
  type ForceConverterResult,
  type ForceFieldId,
} from './types';
import { forceErrorMessage, forceValueState, parseOptionalNumber } from './validation';

function emptyDraft(): ForceConverterDraft {
  return {
    texts: ['', '', '', '', '', '', ''],
    units: [...DEFAULT_FIELD_UNITS],
    activeField: null,
    otherOpen: false,
  };
}

function draftFromNewtons(
  newtons: number,
  units: ForceConverterDraft['units'],
  preserveField: ForceFieldId | null,
  preserveText: string,
  otherOpen: boolean
): ForceConverterDraft {
  const values = [
    fromNewtons(newtons, units[0]),
    fromNewtons(newtons, units[1]),
    fromNewtons(newtons, units[2]),
    fromNewtons(newtons, units[3]),
    fromNewtons(newtons, units[4]),
    fromNewtons(newtons, units[5]),
    fromNewtons(newtons, units[6]),
  ] as const;

  const texts = values.map((v, i) =>
    preserveField === i ? preserveText : formatForce(v)
  ) as ForceConverterDraft['texts'];

  return {
    texts,
    units,
    activeField: preserveField,
    otherOpen,
  };
}

function summaryText(result: ForceConverterResult): string {
  const lines = ['Force Converter', 'Omega Calculators', ''];
  result.values.forEach((value, index) => {
    const symbol = FORCE_UNIT_BY_ID[result.units[index]!].symbol;
    lines.push(`${formatForce(value)} ${symbol}`);
  });
  lines.push('', `Canonical: ${formatForce(result.newtons)} N`);
  return lines.join('\n');
}

export function ForceConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ForceConverterDraft>(() =>
    draftFromNewtons(DEFAULT_NEWTONS, [...DEFAULT_FIELD_UNITS], null, '', false)
  );
  const [errors, setErrors] = React.useState<ForceConverterFieldErrors>({});
  const [result, setResult] = React.useState<ForceConverterResult | null>(() =>
    buildResult(DEFAULT_NEWTONS, [...DEFAULT_FIELD_UNITS])
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  const newtonsRef = React.useRef<number | null>(DEFAULT_NEWTONS);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: ForceConverterDraft) => {
      const field = next.activeField;

      if (
        field === draft.activeField &&
        next.texts.every((t, i) => t === draft.texts[i]) &&
        next.units.every((u, i) => u === draft.units[i]) &&
        next.otherOpen !== draft.otherOpen
      ) {
        setDraft(next);
        return;
      }

      if (
        field !== null &&
        next.texts[field] === draft.texts[field] &&
        next.units[field] !== draft.units[field]
      ) {
        const newtons = newtonsRef.current;
        if (newtons === null) {
          setDraft(next);
          return;
        }
        const synced = draftFromNewtons(newtons, next.units, null, '', next.otherOpen);
        setDraft(synced);
        setErrors({});
        setResult(buildResult(newtons, next.units));
        return;
      }

      if (field === null) {
        setDraft(next);
        return;
      }

      const parsed = parseOptionalNumber(next.texts[field]);
      const state = forceValueState(parsed);
      const message = forceErrorMessage(state);
      const nextErrors: ForceConverterFieldErrors = {};
      if (message) nextErrors[field] = message;

      if (state === 'blank') {
        newtonsRef.current = null;
        setDraft({
          ...next,
          texts: ['', '', '', '', '', '', ''],
        });
        setErrors({});
        setResult(null);
        return;
      }

      if (state !== 'ok' || parsed === null) {
        setDraft(next);
        setErrors(nextErrors);
        setResult(null);
        return;
      }

      const newtons = toNewtons(parsed, next.units[field]);
      newtonsRef.current = newtons;
      const synced = draftFromNewtons(
        newtons,
        next.units,
        field,
        next.texts[field],
        next.otherOpen
      );
      setDraft(synced);
      setErrors({});
      setResult(buildResult(newtons, next.units));
    },
    [draft]
  );

  const sharePayload = result ? summaryText(result) : '';

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
            SI, CGS, gravitational &amp; imperial · base N
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ForceConverterForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            newtonsRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <ForceConverterResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
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
